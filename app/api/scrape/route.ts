import { type NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
      ],
      executablePath: process.env.CHROME_EXECUTABLE_FILE || puppeteer.executablePath(),
    })

    const page = await browser.newPage()

    // Set user agent to avoid being blocked
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    )

    // Set viewport
    await page.setViewport({ width: 1280, height: 720 })

    // Navigate to the URL with timeout
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000,
    })

    // Extract page data
    const scrapedData = await page.evaluate(() => {
      // Helper function to clean text
      const cleanText = (text: string) => {
        return text.replace(/\s+/g, " ").trim()
      }

      // Get page title
      const title = document.title || "No title found"

      // Get meta description
      const metaDescription =
        document.querySelector('meta[name="description"]')?.getAttribute("content") || "No description found"

      // Get all headings
      const headings: { level: string; text: string }[] = []
      const headingElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
      headingElements.forEach((heading) => {
        const text = cleanText(heading.textContent || "")
        if (text) {
          headings.push({
            level: heading.tagName.toLowerCase(),
            text: text,
          })
        }
      })

      // Get main content (try to find main content areas)
      const contentSelectors = ["main", "article", '[role="main"]', ".content", ".main-content", "#content", "#main"]

      let mainContent = ""
      for (const selector of contentSelectors) {
        const element = document.querySelector(selector)
        if (element) {
          mainContent = cleanText(element.textContent || "")
          break
        }
      }

      // If no main content found, get body text but exclude nav, header, footer
      if (!mainContent) {
        const bodyClone = document.body.cloneNode(true) as HTMLElement
        const excludeSelectors = ["nav", "header", "footer", ".nav", ".header", ".footer", "script", "style"]
        excludeSelectors.forEach((selector) => {
          const elements = bodyClone.querySelectorAll(selector)
          elements.forEach((el) => el.remove())
        })
        mainContent = cleanText(bodyClone.textContent || "")
      }

      // Get all links
      const links: { text: string; href: string }[] = []
      const linkElements = document.querySelectorAll("a[href]")
      linkElements.forEach((link) => {
        const text = cleanText(link.textContent || "")
        const href = link.getAttribute("href") || ""
        if (text && href) {
          links.push({ text, href })
        }
      })

      // Get images
      const images: { alt: string; src: string }[] = []
      const imageElements = document.querySelectorAll("img[src]")
      imageElements.forEach((img) => {
        const alt = img.getAttribute("alt") || "No alt text"
        const src = img.getAttribute("src") || ""
        if (src) {
          images.push({ alt, src })
        }
      })

      // Get page structure info
      const elementCounts = {
        paragraphs: document.querySelectorAll("p").length,
        divs: document.querySelectorAll("div").length,
        spans: document.querySelectorAll("span").length,
        links: document.querySelectorAll("a").length,
        images: document.querySelectorAll("img").length,
        forms: document.querySelectorAll("form").length,
      }

      return {
        title,
        metaDescription,
        headings,
        mainContent: mainContent.substring(0, 5000), // Limit content length
        links: links.slice(0, 20), // Limit number of links
        images: images.slice(0, 10), // Limit number of images
        elementCounts,
        url: window.location.href,
        scrapedAt: new Date().toISOString(),
      }
    })

    await browser.close()

    // Format the scraped data into a readable format
    const formattedData = formatScrapedData(scrapedData)

    return NextResponse.json({
      success: true,
      data: formattedData,
      rawData: scrapedData,
    })
  } catch (error) {
    console.error("Scraping error:", error)

    let errorMessage = "Failed to scrape the website"
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        errorMessage = "Website took too long to load (timeout)"
      } else if (error.message.includes("net::ERR_NAME_NOT_RESOLVED")) {
        errorMessage = "Website not found or unreachable"
      } else if (error.message.includes("net::ERR_CONNECTION_REFUSED")) {
        errorMessage = "Connection refused by the website"
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}

function formatScrapedData(data: any): string {
  let formatted = `# Scraped Content from ${data.url}\n\n`

  formatted += `## Page Information\n`
  formatted += `**Title**: ${data.title}\n`
  formatted += `**Description**: ${data.metaDescription}\n`
  formatted += `**Scraped At**: ${new Date(data.scrapedAt).toLocaleString()}\n\n`

  if (data.headings.length > 0) {
    formatted += `## Page Structure\n`
    data.headings.forEach((heading: any) => {
      const level = "#".repeat(Number.parseInt(heading.level.charAt(1)) + 2)
      formatted += `${level} ${heading.text}\n`
    })
    formatted += "\n"
  }

  if (data.mainContent) {
    formatted += `## Main Content\n`
    formatted += `${data.mainContent.substring(0, 2000)}${data.mainContent.length > 2000 ? "..." : ""}\n\n`
  }

  if (data.links.length > 0) {
    formatted += `## Links Found (${data.links.length} total)\n`
    data.links.slice(0, 10).forEach((link: any) => {
      formatted += `- [${link.text}](${link.href})\n`
    })
    if (data.links.length > 10) {
      formatted += `- ... and ${data.links.length - 10} more links\n`
    }
    formatted += "\n"
  }

  if (data.images.length > 0) {
    formatted += `## Images Found (${data.images.length} total)\n`
    data.images.slice(0, 5).forEach((image: any) => {
      formatted += `- ${image.alt} (${image.src})\n`
    })
    if (data.images.length > 5) {
      formatted += `- ... and ${data.images.length - 5} more images\n`
    }
    formatted += "\n"
  }

  formatted += `## Page Statistics\n`
  formatted += `- **Paragraphs**: ${data.elementCounts.paragraphs}\n`
  formatted += `- **Divs**: ${data.elementCounts.divs}\n`
  formatted += `- **Links**: ${data.elementCounts.links}\n`
  formatted += `- **Images**: ${data.elementCounts.images}\n`
  formatted += `- **Forms**: ${data.elementCounts.forms}\n`

  return formatted
}

"use client"

import { useState } from "react"
import { UrlInputForm } from "@/components/UrlInput"
import { ScrapedDataDisplay } from "@/components/ScrapedData"
import { AiQueryForm } from "@/components/QueryForm"
import { AiResultsDisplay } from "@/components/QueryResults"
import { EmptyState } from "@/components/EmptyState"

export default function WebScraperPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isScraped, setIsScraped] = useState(false)
  const [scrapedData, setScrapedData] = useState("")
  const [queryResult, setQueryResult] = useState("")
  const [isQuerying, setIsQuerying] = useState(false)

  const handleScrape = async (url: string) => {
    setIsLoading(true)
    setScrapedData("")
    setQueryResult("")

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      const result = await response.json()

      if (result.success) {
        setScrapedData(result.data)
        setIsScraped(true)
      } else {
        setScrapedData(`# Error Scraping Website\n\n**Error**: ${result.error}\n\nPlease check the URL and try again.`)
        setIsScraped(true)
      }
    } catch (error) {
      console.error("Scraping failed:", error)
      setScrapedData(
        `# Error Scraping Website\n\n**Error**: Failed to connect to scraping service\n\nPlease check your internet connection and try again.`,
      )
      setIsScraped(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuery = async (query: string) => {
    setIsQuerying(true)

    // Simulate AI processing
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setQueryResult(`# Analysis of Scraped Content

Based on your query: "${query}"

## Summary
The scraped webpage appears to be a product or service page related to AI technology. It has a structured layout with 5 main sections.

## Key Information Extracted
- **Title**: AI Webscraper Demo Page
- **Main Sections**: Introduction, Features, Specifications, Testimonials, and Pricing
- **Content Structure**: Well-organized with headings and numbered lists
- **Technical Details**: Contains metadata and approximately 150 HTML elements

## Recommendations
Based on the content, this appears to be a demonstration or product page. The pricing information in section 5 would be particularly relevant for potential customers.

## Data Format
The data is presented in a hierarchical structure with clear section headings, making it suitable for further processing or analysis.`)
        setIsQuerying(false)
        resolve()
      }, 2000)
    })
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">AI Webscraper</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - URL Input and Scraped Data */}
        <div className="space-y-6">
          <UrlInputForm onScrape={handleScrape} isLoading={isLoading} />
          {isScraped && <ScrapedDataDisplay data={scrapedData} />}
        </div>

        {/* Right Panel - AI Query and Results */}
        <div className="space-y-6">
          {isScraped ? (
            <>
              <AiQueryForm onQuery={handleQuery} isQuerying={isQuerying} />
              {queryResult && <AiResultsDisplay result={queryResult} />}
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </main>
  )
}

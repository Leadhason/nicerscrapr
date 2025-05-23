import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ScrapedDataDisplayProps {
  data: string
}

export function ScrapedDataDisplay({ data }: ScrapedDataDisplayProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Scraped Content</h2>
      <ScrollArea className="h-[500px] rounded-md border p-4">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {data.split("\n").map((line, index) => (
            <div key={index}>
              {line.startsWith("# ") ? (
                <h1 className="text-xl font-bold mt-4 mb-2">{line.substring(2)}</h1>
              ) : line.startsWith("## ") ? (
                <h2 className="text-lg font-semibold mt-3 mb-2">{line.substring(3)}</h2>
              ) : line.startsWith("### ") ? (
                <h3 className="text-md font-semibold mt-2 mb-1">{line.substring(4)}</h3>
              ) : (
                <p className="my-1">{line}</p>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}

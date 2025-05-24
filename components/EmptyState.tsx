import { Card } from "@/components/ui/card"
import { Search } from "lucide-react"

export function EmptyState() {
  return (
    <Card className="p-6 flex items-center justify-center h-[200px]">
      <div className="text-center text-muted-foreground">
        <Search className="mx-auto h-12 w-12 mb-4 opacity-20" />
        <p>Enter a URL and scrape content to start querying with AI</p>
      </div>
    </Card>
  )
}

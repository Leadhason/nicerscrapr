import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ScrapeInterfaceProps {
  data: string | null
}

export function ScrapeInterface({ data }: ScrapeInterfaceProps) {
  return (
    <Card className="mb-4 w-full">
      <CardHeader>
        <CardTitle className=''>Scraped Data</CardTitle>
      </CardHeader>
      <CardContent className="border p-2 mx-4 mb-4 rounded-md">
      <ScrollArea className="h-full rounded-md border p-2">
        {data ? (
          <pre className="whitespace-pre-wrap">{data}</pre>
        ) : (
          <p>No data scraped yet. Enter a URL above to start.</p>
        )}
      </ScrollArea>
      </CardContent>
    </Card>
  )
}


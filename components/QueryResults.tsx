import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AiResultsDisplayProps {
  result: string
}

export function AiResultsDisplay({ result }: AiResultsDisplayProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">AI Analysis</h2>
      <Tabs defaultValue="formatted" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="formatted">Formatted</TabsTrigger>
          <TabsTrigger value="raw">Raw</TabsTrigger>
        </TabsList>
        <TabsContent value="formatted">
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {result.split("\n").map((line, index) => (
                <div key={index}>
                  {line.startsWith("# ") ? (
                    <h1 className="text-xl font-bold mt-4 mb-2">{line.substring(2)}</h1>
                  ) : line.startsWith("## ") ? (
                    <h2 className="text-lg font-semibold mt-3 mb-2">{line.substring(3)}</h2>
                  ) : line.startsWith("### ") ? (
                    <h3 className="text-md font-semibold mt-2 mb-1">{line.substring(4)}</h3>
                  ) : line.startsWith("- **") ? (
                    <div className="flex my-1">
                      <span className="font-semibold">{line.substring(3, line.indexOf("**:") + 2)}</span>
                      <span>{line.substring(line.indexOf("**:") + 3)}</span>
                    </div>
                  ) : (
                    <p className="my-1">{line}</p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="raw">
          <ScrollArea className="h-[400px] rounded-md border p-4 font-mono text-sm">{result}</ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface AiQueryInterfaceProps {
  onQuery: (query: string) => void
  response: string | null
  isQueryLoading: boolean
}

export function AiInterface({ onQuery, response, isQueryLoading }: AiQueryInterfaceProps) {
  const [query, setQuery] = useState('')
  

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if(query.trim()){
        onQuery(query.trim())
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className='text-center'>Query Interface</CardTitle>
      </CardHeader>
      <CardContent className="justify-center items-center flex flex-col">
        <form onSubmit={handleQuerySubmit} className="flex gap-1 mb-4 border border-black p-1 rounded-md h-[43px] w-[600px] items-center justify-center">
          <input
            type="text"
            placeholder="Ask AI about the scraped data"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none border-none w-[550px] h-[35px] p-2 rounded-md"
          />
           <Button type="submit" className="w-full sm:w-auto h-[35px]" disabled={isQueryLoading}>
            {isQueryLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Querying...
              </>
            ) : (
              'Query'
            )}
          </Button>
        </form>
        {response && (
          <div className="mt-3 p-4 rounded-md w-[700px]">
            <h3 className="font-semibold mb-2">Here you are:</h3>
            <p>{response}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


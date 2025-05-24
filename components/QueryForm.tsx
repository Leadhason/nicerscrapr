"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Search } from "lucide-react"

interface AiQueryFormProps {
  onQuery: (query: string) => Promise<void>
  isQuerying: boolean
}

export function AiQueryForm({ onQuery, isQuerying }: AiQueryFormProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query) return
    await onQuery(query)
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Search className="mr-2 h-5 w-5" />
        Ask AI About the Content
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Ask a question about the scraped content..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[50px]"
          required
        />
        <Button type="submit" className="w-full" disabled={isQuerying}>
          {isQuerying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            "Submit Query"
          )}
        </Button>
      </form>
    </Card>
  )
}

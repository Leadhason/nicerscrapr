"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Loader2, Globe } from "lucide-react"

interface UrlInputFormProps {
  onScrape: (url: string) => Promise<void>
  isLoading: boolean
}

export function UrlInputForm({ onScrape, isLoading }: UrlInputFormProps) {
  const [url, setUrl] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    await onScrape(url)
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Globe className="mr-2 h-5 w-5" />
        Enter Website URL
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scraping
              </>
            ) : (
              "Scrape"
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}

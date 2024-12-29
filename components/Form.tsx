import { useState } from 'react'
import Image from 'next/image';
import { Loader2 } from 'lucide-react'


interface UrlInputProps {
  onScrape: (url: string) => void
  isLoading: boolean
}

export function Form({ onScrape, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onScrape(url.trim());
    }

  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center h-[43px] w-[570px] bg-white rounded-md border border-gray-300 rounded-md shadow-md p-3 focus:border-black focus:ring-black focus:ring-1">
        <Image src="/link.svg" width={25} height={25} alt="link" />
        <input 
        type="url" 
        className="w-[550px] h-[35px] bg-tranparent p-1 outline-none" 
        placeholder="Enter a URL"
        value={url}
        required
        onChange={(e) => setUrl(e.target.value)}
        />
        <button type="button" onClick={handleSubmit} className="flex bg-transparent border-none active:scale-90">
        {isLoading ? (
              <>
                <Loader2 className="mr-2 h-full w-6 animate-spin flex items-center justify-center" />
              </>
            ) : (
              <Image src="/send.svg" width={30} height={30} alt="search" />
            )}
        </button>
    </form>
  )
}


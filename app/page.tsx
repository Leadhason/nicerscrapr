'use client'

import Image from 'next/image';
import React, { useState } from 'react';

interface UrlInputProps {
  onScrape: (url: string) => Promise<void>
}
  

export default function Home({ onScrape }: UrlInputProps) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onScrape(url)
  }
  return (
    <div className="flex flex-col h-screen container mx-auto p-4">
      <header className="flex w-full justify-between">
        <h1 className="text-4xl font-bold text-center text-gray-900">
            SCRAPR
        </h1>
        <button className="flex border w-[100px] h-[40px] items-center justify-center border-black p-3 text-white bg-black hover:text-black hover:bg-transparent rounded-full">GitHub</button>
      </header>

      <div className="flex flex-col items-center justify-center h-full space-y-14">
        <div className="-mt-48 space-y-3">
          <h2 className="text-5xl font-bold text-center text-gray-900">
            A Webscraper with <span className="bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 bg-clip-text text-transparent">Superpowers</span>
          </h2>
          <p className="text-center text-lg font-extralight text-gray-400">
            Simplify data collection with Scrapr, an intelligent web scraper <br/> that empowers you to extract and analyze website data effortlessly with AI precision.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center justify-center h-[43px] w-[570px] bg-white rounded-md border border-gray-300 rounded-md shadow-md p-3 focus:border-black focus:ring-black focus:ring-1">
          <Image src="/link.svg" width={25} height={25} alt="link" />
          <input 
            type="text" 
            className="w-[550px] h-[35px] bg-tranparent p-1 outline-none" 
            placeholder="Enter a URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            typeof="url"
          />
          <button type="submit" className="bg-transparent border-none active:scale-90">
            <Image src="/send.svg" width={30} height={30} alt="search" />
          </button>
        </form>
      </div>
    </div>
  );
}

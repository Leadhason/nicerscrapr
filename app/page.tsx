'use client'

import React, { useState } from 'react';
import { Form } from '../components/Form';
import { ScrapeInterface } from '../components/ScrapeInterface'
import { AiInterface } from '../components/AiInterface'
import { AnimatePresence, motion } from 'framer-motion'

export default function Home () {
  const [scrapedData, setScrapedData] = useState<string | null>(null)
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [isScrapingLoading, setIsScrapingLoading] = useState(false)
  const [isQueryLoading, setIsQueryLoading] = useState(false)


  const handleScrape = async (url: string) => {
    setIsScrapingLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setScrapedData(`Simulated scraped data from ${url}`)
    setIsScrapingLoading(false)
  }

  const handleQuery = async (query: string) => {
    setIsQueryLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setAiResponse(`AI response to "${query}" based on the scraped data.`)
    setIsQueryLoading(false)
  }

  return (
    <div className="flex flex-col mx-auto min-h-screen p-4 bg-gradient-to-br from-amber-100 via-orange-0 to-yellow-50">
      <header className="flex w-full justify-between px-2">
        <h1 className="text-3xl font-bold text-center text-gray-900">
            SCRAPR
        </h1>
        <button className="flex border w-[100px] h-[40px] items-center justify-center border-black p-3 text-white bg-black hover:text-black hover:bg-transparent rounded-full">GitHub</button>
      </header>

      <motion.div
        className="flex-grow flex flex-col justify-center"
        animate={{ y: scrapedData ? -40 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`flex flex-col items-center justify-center space-y-8 transition-all duration-500 ${scrapedData ? 'mt-10' : '-mt-20'}`}>
          <div className="space-y-3">
            <h2 className="text-5xl font-bold text-center text-gray-900">
              A Webscraper with <span className="bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500  bg-clip-text text-transparent">Superpowers</span>
            </h2>
            <p className="text-center text-lg font-extralight text-gray-400">
              Simplify data collection with Scrapr, an intelligent web scraper <br/> that empowers you to extract and analyze website data effortlessly with AI precision.
            </p>
          </div>
          <Form onScrape={handleScrape} isLoading={isScrapingLoading}/>
          <AnimatePresence>
            {scrapedData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <ScrapeInterface data={scrapedData} />
                <AiInterface onQuery={handleQuery} response={aiResponse} isQueryLoading={isQueryLoading} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}


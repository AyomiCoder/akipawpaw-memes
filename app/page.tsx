"use client"

import { Search, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import GifGrid from "@/components/gif-grid"
import Footer from "@/components/footer"
import UploadModal from "@/components/upload-modal"
import { useState } from "react"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = () => {
    // Trigger search functionality
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text mb-4">
            AkiPawPaw
          </h1>
          <p className="text-gray-300 text-lg mb-8 animate-slide-up">
            Discover the funniest Aki & Pawpaw moments that broke the internet
          </p>
        </div>

        {/* Search Bar and Upload Button */}
        <div className="max-w-4xl mx-auto mb-12 animate-slide-up">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for viral memes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-4 text-base rounded-2xl border-2 border-purple-500/30 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 hover:bg-white/20"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:from-pink-600 hover:to-violet-600 font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-full md:w-auto whitespace-nowrap"
            >
              Search
            </Button>
            <UploadButton />
          </div>
        </div>

        {/* GIF Grid with integrated CategoryFilter */}
        <GifGrid searchQuery={searchQuery} />
      </main>

      <Footer />
    </div>
  )
}

function UploadButton() {
  return (
    <UploadModal>
      <Button className="bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:from-pink-600 hover:to-violet-600 font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-full md:w-auto whitespace-nowrap">
        <Upload className="h-4 w-4 mr-2" />
        Upload Meme
      </Button>
    </UploadModal>
  )
}

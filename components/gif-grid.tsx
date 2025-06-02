"use client"

import { useState, useEffect } from "react"
import GifCard from "@/components/gif-card"
import GifModal from "@/components/gif-modal"
import CategoryFilter from "@/components/category-filter"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Meme } from "@/lib/types"

interface GifGridProps {
  searchQuery: string
}

export default function GifGrid({ searchQuery }: GifGridProps) {
  const [selectedGif, setSelectedGif] = useState<Meme | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [gifs, setGifs] = useState<Meme[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const gifsPerPage = 12

  const fetchMemes = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/memes")
      const data = await res.json()
      setGifs(data.memes || [])
    } catch (error) {
      console.error("Error fetching memes:", error)
      setGifs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMemes()
  }, [])

  // Listen for custom event when a new meme is uploaded
  useEffect(() => {
    const handleNewMeme = () => {
      console.log("New meme uploaded, refreshing grid...")
      fetchMemes()
    }

    window.addEventListener("newMemeUploaded", handleNewMeme)
    return () => window.removeEventListener("newMemeUploaded", handleNewMeme)
  }, [])

  const handleOpenModal = (gif: Meme) => {
    setSelectedGif(gif)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const filteredGifs =
    selectedCategory === "All"
      ? gifs.filter((gif) =>
          gif.uploaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gif.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gif.hashtags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : gifs.filter((gif) =>
          (gif.category.toLowerCase() === selectedCategory.toLowerCase() ||
          gif.hashtags.some((tag) => tag.toLowerCase() === selectedCategory.toLowerCase())) &&
          (gif.uploaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gif.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gif.hashtags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
        )

  const totalPages = Math.ceil(filteredGifs.length / gifsPerPage)
  const startIndex = currentPage * gifsPerPage
  const endIndex = startIndex + gifsPerPage
  const currentGifs = filteredGifs.slice(startIndex, endIndex)

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))
  }

  return (
    <>
      <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading memes...</div>
      ) : filteredGifs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No memes found{selectedCategory !== "All" ? ` for "${selectedCategory}" category` : ""}.</p>
          <p className="text-gray-400 text-sm mt-2">Try selecting a different category or upload some memes!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentGifs.map((gif) => (
              <GifCard key={gif.id} gif={gif} onOpenModal={handleOpenModal} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <span className="text-sm text-gray-400">
                Page {currentPage + 1} of {totalPages}
              </span>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </>
      )}

      {isModalOpen && selectedGif && <GifModal gif={selectedGif} isOpen={isModalOpen} onClose={handleCloseModal} />}
    </>
  )
}

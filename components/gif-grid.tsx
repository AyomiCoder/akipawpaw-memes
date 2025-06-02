"use client"

import { useState, useEffect } from "react"
import GifCard from "@/components/gif-card"
import GifModal from "@/components/gif-modal"
import CategoryFilter from "@/components/category-filter"
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

  const fetchMemes = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/memes")
      const data = await res.json()
      setGifs(data.memes || [])
    } catch {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGifs.map((gif) => (
            <GifCard key={gif.id} gif={gif} onOpenModal={handleOpenModal} />
          ))}
        </div>
      )}

      {isModalOpen && selectedGif && <GifModal gif={selectedGif} isOpen={isModalOpen} onClose={handleCloseModal} />}
    </>
  )
}

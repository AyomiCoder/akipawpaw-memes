"use client"

import { useState } from "react"
import GifCard from "@/components/gif-card"
import GifModal from "@/components/gif-modal"
import CategoryFilter from "@/components/category-filter"
import type { Gif } from "@/lib/types"
import { mockGifs } from "@/lib/mock-data"

export default function GifGrid() {
  const [selectedGif, setSelectedGif] = useState<Gif | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [gifs, setGifs] = useState(mockGifs)

  const handleOpenModal = (gif: Gif) => {
    setSelectedGif(gif)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleViewIncrement = (id: string) => {
    setGifs((prevGifs) => prevGifs.map((gif) => (gif.id === id ? { ...gif, views: (gif.views || 0) + 1 } : gif)))
  }

  const filteredGifs =
    selectedCategory === "All"
      ? gifs
      : gifs.filter((gif) => gif.tags.some((tag) => tag.toLowerCase() === selectedCategory.toLowerCase()))

  return (
    <>
      <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredGifs.map((gif) => (
          <GifCard key={gif.id} gif={gif} onOpenModal={handleOpenModal} onViewIncrement={handleViewIncrement} />
        ))}
      </div>

      {filteredGifs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No memes found for "{selectedCategory}" category.</p>
          <p className="text-gray-400 text-sm mt-2">Try selecting a different category or upload some memes!</p>
        </div>
      )}

      {isModalOpen && selectedGif && <GifModal gif={selectedGif} isOpen={isModalOpen} onClose={handleCloseModal} />}
    </>
  )
}

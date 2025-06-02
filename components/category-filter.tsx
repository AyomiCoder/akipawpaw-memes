"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const categoriesPerPage = 6

  const categories = [
    { name: "All", emoji: "🔥" },
    { name: "Funny", emoji: "😂" },
    { name: "Confused", emoji: "🤔" },
    { name: "Angry", emoji: "😡" },
    { name: "Wahala", emoji: "💀" },
    { name: "Judging You", emoji: "👀" },
    { name: "Dancing", emoji: "💃" },
    { name: "Celebration", emoji: "🎉" },
    { name: "Shocked", emoji: "😱" },
    { name: "Happy", emoji: "😊" },
    { name: "Pain", emoji: "😫" },
    { name: "Surprised", emoji: "😲" },
    { name: "Love", emoji: "❤️" },
    { name: "Sad", emoji: "😢" },
    { name: "Excited", emoji: "🤩" },
    { name: "Sleepy", emoji: "😴" },
  ]

  const totalPages = Math.ceil(categories.length / categoriesPerPage)
  const startIndex = currentPage * categoriesPerPage
  const endIndex = startIndex + categoriesPerPage
  const currentCategories = categories.slice(startIndex, endIndex)

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))
  }

  return (
    <div className="flex flex-col items-center gap-4 mb-12 animate-slide-up">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="text-gray-400 hover:text-white hover:bg-white/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {currentCategories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-3 text-sm font-bold rounded-full transition-all duration-300 hover:scale-110 transform ${
                category.name === selectedCategory
                  ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg shadow-pink-500/25 animate-pulse"
                  : "bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20 border border-purple-500/30 hover:border-pink-500/50"
              }`}
              onClick={() => onCategoryChange(category.name)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="mr-2 text-lg animate-bounce" style={{ animationDelay: `${index * 150}ms` }}>
                {category.emoji}
              </span>
              {category.name}
            </button>
          ))}
        </div>

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
      
      <div className="text-sm text-gray-400">
        Page {currentPage + 1} of {totalPages}
      </div>
    </div>
  )
}

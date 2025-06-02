"use client"

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
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
  ]

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12 animate-slide-up">
      {categories.map((category, index) => (
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
  )
}

"use client"

import type React from "react"

import { Download, Link, Eye, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import type { Gif } from "@/lib/types"
import { useState } from "react"

interface GifCardProps {
  gif: Gif
  onOpenModal: (gif: Gif) => void
  onViewIncrement: (id: string) => void
}

export default function GifCard({ gif, onOpenModal, onViewIncrement }: GifCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [likes, setLikes] = useState(gif.likes || 0)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://akipawpaw.com/gif/${gif.id}`)
    toast({
      title: "Link copied! 🔗",
      description: "Meme link has been copied to clipboard",
    })
  }

  const handleLike = () => {
    setLikes(likes + 1)
    toast({
      title: "Liked! ❤️",
      description: "You liked this meme",
    })
  }

  const handleClick = () => {
    onViewIncrement(gif.id)
    onOpenModal(gif)
  }

  const handleUploaderClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (gif.socialLink) {
      window.open(gif.socialLink, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div
      className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-500 border border-purple-500/20 hover:border-pink-500/50 group hover:scale-105 transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={handleClick}>
        <img
          src={gif.url || "/placeholder.svg"}
          alt="Aki & Pawpaw meme"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Hover overlay with stats */}
        <div
          className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <div className="text-white text-center animate-fade-in">
            <Eye className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-bold">Click to view</p>
          </div>
        </div>

        {/* Floating stats */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs font-bold animate-slide-down">
          👀 {gif.views || 0}
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {gif.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-300 text-xs font-semibold px-3 py-1 rounded-full border border-pink-500/30 animate-fade-in hover:scale-105 transition-transform cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400">
            by{" "}
            <span
              className="font-semibold text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer hover:underline"
              onClick={handleUploaderClick}
            >
              {gif.uploadedBy}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-pink-400 hover:bg-pink-500/20 transition-all duration-300 hover:scale-110 transform"
              onClick={handleCopyLink}
            >
              <Link className="h-4 w-4" />
              <span className="sr-only">Copy Link</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-green-400 hover:bg-green-500/20 transition-all duration-300 hover:scale-110 transform"
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Download</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/20 transition-all duration-300 hover:scale-110 transform relative"
              onClick={handleLike}
            >
              <Heart className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {likes > 99 ? "99+" : likes}
              </span>
              <span className="sr-only">Like</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

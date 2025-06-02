"use client"

import type React from "react"

import { X, Download, Link, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import type { Gif } from "@/lib/types"
import { useState } from "react"

interface GifModalProps {
  gif: Gif
  isOpen: boolean
  onClose: () => void
}

export default function GifModal({ gif, isOpen, onClose }: GifModalProps) {
  const [likes, setLikes] = useState(gif.likes || 0)

  if (!isOpen) return null

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleUploaderClick = () => {
    if (gif.socialLink) {
      window.open(gif.socialLink, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-purple-500/30 animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-xl text-white">Meme Details</h3>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4 text-cyan-400" />
                <span>{gif.views || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-red-400" />
                <span>{likes}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="aspect-video w-full relative rounded-xl overflow-hidden bg-black/50 mb-6">
            <img src={gif.url || "/placeholder.svg"} alt="Aki & Pawpaw meme" className="w-full h-full object-contain" />
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {gif.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-300 text-sm font-semibold px-4 py-2 rounded-full border border-pink-500/30 hover:scale-105 transition-transform cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-purple-500/30 p-6 bg-gradient-to-r from-slate-900/50 to-purple-900/50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Uploaded by{" "}
              <span
                className="font-semibold text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer hover:underline"
                onClick={handleUploaderClick}
              >
                {gif.uploadedBy}
              </span>
              {gif.socialLink && (
                <span className="ml-2 text-pink-400 hover:text-pink-300 transition-colors cursor-pointer hover:underline">
                  @{gif.uploadedBy}
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex gap-2 border-purple-500/30 text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all duration-300 hover:scale-105"
                onClick={handleCopyLink}
              >
                <Link className="h-4 w-4" />
                Copy Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex gap-2 border-green-500/30 text-green-300 hover:text-white hover:bg-green-500/20 transition-all duration-300 hover:scale-105"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                size="sm"
                className="flex gap-2 bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:from-pink-600 hover:to-violet-600 transition-all duration-300 hover:scale-105"
                onClick={handleLike}
              >
                <Heart className="h-4 w-4" />
                Like ({likes})
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

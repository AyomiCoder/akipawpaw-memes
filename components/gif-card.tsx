"use client"

import type React from "react"
import { useState } from "react"
import { Download, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import type { Meme } from "@/lib/types"

interface GifCardProps {
  gif: Meme
  onOpenModal: (gif: Meme) => void
}

export default function GifCard({ gif, onOpenModal }: GifCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Map Meme fields to match the boilerplate
  const tags = gif.hashtags || []
  const uploadedBy = gif.uploaderName || "Unknown"
  const socialLink = gif.socialLink
  const fileUrl = gif.fileUrl || "/placeholder.svg"

  const handleCopyLink = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    const url = `${window.location.origin}/?gif=${gif._id}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Link copied! 🔗",
      description: "Meme link has been copied to clipboard",
    })
  }

  const handleClick = () => {
    onOpenModal(gif)
  }

  const handleUploaderClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (socialLink) {
      window.open(socialLink, "_blank", "noopener,noreferrer")
    }
  }

  const handleDownload = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = `meme-${gif._id}.${fileUrl.split(".").pop()}`
    link.setAttribute("download", `meme-${gif._id}.${fileUrl.split(".").pop()}`)
    link.setAttribute("target", "_blank")
    link.setAttribute("rel", "noopener noreferrer")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast({
      title: "Downloading... 📥",
      description: "Your meme is being downloaded",
    })
  }

  return (
    <div
      className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-500 border border-purple-500/20 hover:border-pink-500/50 group hover:scale-105 transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={handleClick}>
        <img
          src={fileUrl}
          alt="Aki & Pawpaw meme"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <div className="text-white text-center animate-fade-in">
            <p className="text-sm font-bold">Click to view</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div
              className="text-sm text-gray-400 hover:text-cyan-300 transition-colors cursor-pointer"
              onClick={handleUploaderClick}
            >
              By {uploadedBy}
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
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

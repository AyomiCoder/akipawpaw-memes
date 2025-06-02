"use client"

import type React from "react"
import { X, Download, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import type { Meme } from "@/lib/types"

interface GifModalProps {
  gif: Meme
  isOpen: boolean
  onClose: () => void
}

export default function GifModal({ gif, isOpen, onClose }: GifModalProps) {
  // Map Meme fields to match the boilerplate
  const tags = gif.hashtags || []
  const uploadedBy = gif.uploaderName || "Unknown"
  const socialLink = gif.socialLink
  const fileUrl = gif.fileUrl || gif.url || "/placeholder.svg"

  if (!isOpen) return null

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/gif/${gif.id}`)
    toast({
      title: "Link copied! 🔗",
      description: "Meme link has been copied to clipboard",
    })
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleUploaderClick = () => {
    if (socialLink) {
      window.open(socialLink, "_blank", "noopener,noreferrer")
    }
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = `meme-${gif.id}.${fileUrl.split(".").pop()}`
    link.setAttribute("download", `meme-${gif.id}.${fileUrl.split(".").pop()}`)
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
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-purple-500/30 animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-xl text-white">Meme Details</h3>
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

        <div className="flex-1 overflow-y-auto p-6">
          <div className="aspect-square w-full max-w-2xl mx-auto rounded-xl overflow-hidden mb-6">
            <img
              src={fileUrl}
              alt="Aki & Pawpaw meme"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
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
                {uploadedBy}
              </span>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex gap-2 border-purple-500/30 text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all duration-300 hover:scale-105"
                onClick={handleCopyLink}
              >
                <LinkIcon className="h-4 w-4" />
                Copy Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex gap-2 border-green-500/30 text-green-300 hover:text-white hover:bg-green-500/20 transition-all duration-300 hover:scale-105"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

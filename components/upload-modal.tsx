"use client"

import type React from "react"
import { useState } from "react"
import { Upload, Tag, User, FolderOpen, X, LinkIcon, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface UploadModalProps {
  children: React.ReactNode
}

export default function UploadModal({ children }: UploadModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [uploaderName, setUploaderName] = useState("")
  const [category, setCategory] = useState("")
  const [hashtags, setHashtags] = useState("")
  const [socialLink, setSocialLink] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")

  const predefinedCategories = [
    "Funny",
    "Confused",
    "Angry",
    "Wahala",
    "Judging You",
    "Dancing",
    "Celebration",
    "Shocked",
    "Happy",
    "Pain",
    "Surprised",
    "Love",
    "Sad",
    "Excited",
    "Sleepy"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsUploading(true)

    if (!file) {
      setError("Please select a file to upload")
      setIsUploading(false)
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("uploaderName", uploaderName)
    formData.append("socialLink", socialLink)
    formData.append("category", category)
    formData.append("hashtags", hashtags)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to upload meme")
      }

      toast({
        title: "Success! 🎉",
        description: "Your meme has been uploaded successfully",
      })

      // Dispatch custom event for successful upload
      window.dispatchEvent(new Event("newMemeUploaded"))

      // Reset form
      setUploaderName("")
      setSocialLink("")
      setCategory("")
      setHashtags("")
      setFile(null)
      setIsOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload meme")
    } finally {
      setIsUploading(false)
    }
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    // Generate hashtag from category but don't override existing hashtags
    if (!hashtags) {
      const categoryHashtag = value.toLowerCase().replace(/\s+/g, '')
      setHashtags(categoryHashtag)
    }
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gradient-to-br from-slate-900 to-purple-900 border-purple-500/30 max-w-2xl">
          <DialogHeader className="flex flex-row items-center justify-between border-b border-purple-500/30 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              <DialogTitle className="text-xl font-bold text-white">Upload Your Meme</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="rounded-full text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Uploader Name */}
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <User className="h-4 w-4 text-cyan-400" />
                Your Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                className="bg-white/10 border-purple-500/30 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500/50 transition-all duration-300"
                required
              />
            </div>

            {/* Social Link */}
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <Label htmlFor="social" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-pink-400" />
                Social Media Link (Optional)
              </Label>
              <Input
                id="social"
                type="url"
                placeholder="https://twitter.com/yourhandle"
                value={socialLink}
                onChange={(e) => setSocialLink(e.target.value)}
                className="bg-white/10 border-purple-500/30 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500/50 transition-all duration-300"
              />
            </div>

            {/* Category */}
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <Label htmlFor="category" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-violet-400" />
                Category *
              </Label>
              <Select value={category} onValueChange={handleCategoryChange} required>
                <SelectTrigger className="bg-white/10 border-purple-500/30 text-white focus:border-pink-500 focus:ring-pink-500/50">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-500/30">
                  {predefinedCategories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-white hover:bg-purple-500/20">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hashtags */}
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <Label htmlFor="hashtags" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Tag className="h-4 w-4 text-green-400" />
                Hashtags (Optional)
              </Label>
              <Input
                id="hashtags"
                type="text"
                placeholder="funny, aki, pawpaw, reaction"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="bg-white/10 border-purple-500/30 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500/50 transition-all duration-300"
              />
              <p className="text-xs text-gray-400">
                The category hashtag will be automatically added. You can add more hashtags separated by commas.
              </p>
            </div>

            {/* File Upload */}
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <Label htmlFor="file" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Upload className="h-4 w-4 text-yellow-400" />
                Upload Meme *
              </Label>
              <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-8 text-center hover:border-pink-500/50 transition-all duration-300 bg-white/5 hover:bg-white/10">
                <input
                  id="file"
                  type="file"
                  accept="image/*,video/*,.gif"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  required
                />
                <label htmlFor="file" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-300">
                    {file ? file.name : "Click to upload your meme"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">GIF, JPG, PNG, MP4 (Max 10MB)</p>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:from-pink-600 hover:to-violet-600 font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in"
              style={{ animationDelay: "500ms" }}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Meme 🚀
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export interface Meme {
  _id: string
  url: string
  id: string
  fileName: string
  fileUrl: string
  uploaderName: string
  category: string
  hashtags: string[]
  socialLink?: string
  likes: number
  views: number
  createdAt: string
  updatedAt: string
}

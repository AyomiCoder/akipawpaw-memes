import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { rateLimit } from "@/lib/rate-limit"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(req)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60'
          }
        }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const uploaderName = formData.get("uploaderName") as string
    const socialLink = formData.get("socialLink") as string
    const category = formData.get("category") as string
    const hashtags = formData.get("hashtags") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer for Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            folder: "akipawpaw",
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        .end(buffer)
    })

    // Save to MongoDB
    const { db } = await connectToDatabase()
    const result = await db.collection("memes").insertOne({
      _id: new ObjectId(),
      fileUrl: (uploadResult as any).secure_url,
      uploaderName,
      socialLink,
      category,
      hashtags: hashtags.split(",").map((tag) => tag.trim()),
      createdAt: new Date(),
      views: 0,
      likes: 0,
    })

    return NextResponse.json({
      success: true,
      memeId: result.insertedId,
      remainingUploads: rateLimitResult.remaining
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload meme" },
      { status: 500 }
    )
  }
} 
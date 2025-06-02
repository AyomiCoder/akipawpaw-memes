import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import clientPromise from "@/lib/mongodb"
import cloudinary from "@/lib/cloudinary"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const uploaderName = formData.get("uploaderName") as string
    const category = formData.get("category") as string
    const hashtags = formData.get("hashtags") as string
    const socialLink = formData.get("socialLink") as string

    if (!file) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      )
    }
    if (!uploaderName) {
      return NextResponse.json(
        { error: "Uploader name is required" },
        { status: 400 }
      )
    }
    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ["image/gif", "image/jpeg", "image/png", "video/mp4"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only GIF, JPG, PNG, and MP4 files are allowed" },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`

    console.log("Uploading to Cloudinary...")
    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        base64File,
        {
          resource_type: "auto",
          folder: "akipawpaw",
          public_id: uuidv4(),
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
    })
    console.log("Cloudinary upload response:", uploadResponse)

    console.log("Connecting to MongoDB...")
    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("akipawpaw")

    // Process hashtags
    const categoryHashtag = category.toLowerCase().replace(/\s+/g, '')
    const additionalHashtags = hashtags ? hashtags.split(",").map((tag) => tag.trim()).filter(Boolean) : []
    const allHashtags = [...new Set([categoryHashtag, ...additionalHashtags])]

    // Save to database
    const meme = {
      id: uuidv4(),
      fileName: (uploadResponse as any).public_id,
      fileUrl: (uploadResponse as any).secure_url,
      uploaderName,
      category,
      hashtags: allHashtags,
      socialLink,
      likes: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("Saving to MongoDB:", meme)
    const result = await db.collection("memes").insertOne(meme)
    console.log("MongoDB insert result:", result)

    return NextResponse.json({
      success: true,
      meme,
    })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to upload meme" },
      { status: 500 }
    )
  }
} 
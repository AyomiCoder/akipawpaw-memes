import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("akipawpaw")
    const meme = await db.collection("memes").findOne({ id: params.id })

    if (!meme) {
      return NextResponse.json(
        { error: "Meme not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ meme })
  } catch (error) {
    console.error("Error fetching meme:", error)
    return NextResponse.json(
      { error: "Failed to fetch meme" },
      { status: 500 }
    )
  }
} 
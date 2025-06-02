import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("akipawpaw")
    const memes = await db.collection("memes").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ memes })
  } catch (error) {
    return NextResponse.json({ memes: [] }, { status: 500 })
  }
} 
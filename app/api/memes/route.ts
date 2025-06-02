import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("Fetching memes from MongoDB...")
    const client = await clientPromise
    
    // List all databases
    const adminDb = client.db("admin")
    const dbs = await adminDb.admin().listDatabases()
    console.log("Available databases:", dbs.databases.map(db => db.name))
    
    const db = client.db("akipawpaw")
    
    // List all collections to verify
    const collections = await db.listCollections().toArray()
    console.log("Available collections:", collections.map(c => c.name))
    
    const memes = await db.collection("memes").find({}).sort({ createdAt: -1 }).toArray()
    console.log("Found memes:", memes.length)
    console.log("First meme:", memes[0] ? {
      id: memes[0].id,
      fileName: memes[0].fileName,
      fileUrl: memes[0].fileUrl,
      uploaderName: memes[0].uploaderName,
      category: memes[0].category,
      createdAt: memes[0].createdAt
    } : 'No memes found')
    
    return NextResponse.json({ memes })
  } catch (error) {
    console.error("Error fetching memes:", error)
    return NextResponse.json({ memes: [] }, { status: 500 })
  }
} 
import { MongoClient, WriteConcern } from "mongodb"
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

// Validate MongoDB URI format
const uri = process.env.MONGODB_URI
if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
  throw new Error('Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://')
}

if (!uri.includes('mongodb.net')) {
  throw new Error('Invalid MongoDB URI. Must be a MongoDB Atlas connection string')
}

// Log the connection string (without credentials)
const sanitizedUri = uri.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://***:***@')
console.log("Connecting to MongoDB:", sanitizedUri)

const options = {
  ssl: true,
  tls: true,
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 60000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
  writeConcern: new WriteConcern("majority", 2500),
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db("akipawpaw")
  return { client, db }
}

export default clientPromise 
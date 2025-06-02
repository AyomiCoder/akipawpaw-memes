import { NextRequest, NextResponse } from 'next/server'

// Store for rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds
const MAX_REQUESTS = 5 // Maximum requests per window

export function rateLimit(req: NextRequest) {
  const ip = req.ip || 'anonymous'
  const now = Date.now()
  
  // Get or initialize rate limit data for this IP
  const rateLimitData = rateLimitStore.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW }
  
  // Check if the window has expired
  if (now > rateLimitData.resetTime) {
    rateLimitData.count = 0
    rateLimitData.resetTime = now + RATE_LIMIT_WINDOW
  }
  
  // Increment the request count
  rateLimitData.count++
  rateLimitStore.set(ip, rateLimitData)
  
  // Check if rate limit is exceeded
  if (rateLimitData.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((rateLimitData.resetTime - now) / 1000)
    return {
      success: false,
      message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
      retryAfter
    }
  }
  
  return {
    success: true,
    remaining: MAX_REQUESTS - rateLimitData.count,
    resetTime: rateLimitData.resetTime
  }
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(ip)
    }
  }
}, RATE_LIMIT_WINDOW)
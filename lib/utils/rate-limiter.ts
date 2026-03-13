/**
 * Rate limiter for API routes.
 *
 * Uses Upstash Redis (distributed, survives restarts, works across all Vercel instances)
 * when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set.
 *
 * Falls back to a process-local in-memory Map when credentials are not configured.
 * WARNING: In-memory fallback is NOT shared across instances — a single user can bypass
 * limits by hitting different serverless instances. Set up Upstash for production.
 *
 * Set up:
 *   1. Create a free Redis DB at https://console.upstash.com
 *   2. Add to .env.local (and Vercel env vars):
 *        UPSTASH_REDIS_REST_URL=https://....upstash.io
 *        UPSTASH_REDIS_REST_TOKEN=your_token_here
 */

import { NextResponse } from 'next/server'

// ── Redis path ─────────────────────────────────────────────────────────────────

let redisRatelimit: ((
  storeName: string,
  key: string,
  maxRequests: number,
  windowMs: number
) => Promise<{ allowed: boolean; remaining: number; retryAfterMs: number }>) | null = null

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  // Dynamic import keeps the Redis SDK out of the bundle when not configured
  Promise.all([
    import('@upstash/redis').then(m => m.Redis),
    import('@upstash/ratelimit').then(m => m.Ratelimit),
  ]).then(([Redis, Ratelimit]) => {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })

    // Cache one Ratelimit instance per store name
    const limiters = new Map<string, InstanceType<typeof Ratelimit>>()

    redisRatelimit = async (storeName, key, maxRequests, windowMs) => {
      if (!limiters.has(storeName)) {
        limiters.set(
          storeName,
          new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(maxRequests, `${windowMs}ms`),
            prefix: `rl:${storeName}`,
          })
        )
      }

      const limiter = limiters.get(storeName)!
      const { success, remaining, reset } = await limiter.limit(key)
      return {
        allowed: success,
        remaining,
        retryAfterMs: success ? 0 : Math.max(0, reset - Date.now()),
      }
    }
  }).catch(() => {
    // Redis init failed — fall back silently to in-memory
    redisRatelimit = null
  })
}

// ── In-memory fallback ─────────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number
  resetAt: number
}

const stores = new Map<string, Map<string, RateLimitEntry>>()

export function checkRateLimit(
  storeName: string,
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  if (!stores.has(storeName)) {
    stores.set(storeName, new Map())
  }
  const store = stores.get(storeName)!
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, retryAfterMs: 0 }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, retryAfterMs: entry.resetAt - now }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count, retryAfterMs: 0 }
}

// ── Shared helpers ─────────────────────────────────────────────────────────────

export function getClientIP(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

/**
 * Returns a 429 NextResponse if rate limited, or null if allowed.
 * Uses Redis when configured, in-memory Map otherwise.
 */
export async function rateLimitOrNull(
  storeName: string,
  request: Request,
  maxRequests: number,
  windowMs: number
): Promise<NextResponse | null> {
  const ip = getClientIP(request)

  let allowed: boolean
  let retryAfterMs: number

  if (redisRatelimit) {
    const result = await redisRatelimit(storeName, ip, maxRequests, windowMs)
    allowed = result.allowed
    retryAfterMs = result.retryAfterMs
  } else {
    const result = checkRateLimit(storeName, ip, maxRequests, windowMs)
    allowed = result.allowed
    retryAfterMs = result.retryAfterMs
  }

  if (!allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) },
      }
    )
  }

  return null
}

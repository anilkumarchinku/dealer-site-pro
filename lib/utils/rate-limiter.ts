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

// Build the Redis client synchronously so it's ready on the very first request
// (avoids the race condition where an async Promise hadn't resolved on cold start).
function buildRedisRatelimit() {
    const url   = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!url || !token) return null

    try {
        // These are pure-JS ESM modules — require works in Node/Edge environments
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Redis }     = require('@upstash/redis')
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Ratelimit } = require('@upstash/ratelimit')

        const redis    = new Redis({ url, token })
        const limiters = new Map<string, InstanceType<typeof Ratelimit>>()

        return async (
            storeName: string,
            key: string,
            maxRequests: number,
            windowMs: number
        ): Promise<{ allowed: boolean; remaining: number; retryAfterMs: number }> => {
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
                allowed:      success,
                remaining,
                retryAfterMs: success ? 0 : Math.max(0, reset - Date.now()),
            }
        }
    } catch {
        // @upstash packages not installed — fall through to in-memory
        return null
    }
}

const redisRatelimit = buildRedisRatelimit()

// ── In-memory fallback ─────────────────────────────────────────────────────────

interface RateLimitEntry {
    count:   number
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
    const now   = Date.now()
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
 *
 * In production without Redis: logs a critical Sentry alert and falls back
 * to in-memory (per-instance) rather than blocking the app entirely.
 * Fix: set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN in your env.
 */
export async function rateLimitOrNull(
    storeName: string,
    request: Request,
    maxRequests: number,
    windowMs: number
): Promise<NextResponse | null> {
    const ip = getClientIP(request)

    // Warn loudly in production when Redis is missing — ops must see this
    if (!redisRatelimit && process.env.NODE_ENV === 'production') {
        // Lazy import to avoid pulling Sentry into every edge runtime
        try {
            const Sentry = await import('@sentry/nextjs')
            Sentry.captureMessage(
                `[RateLimiter] Redis not configured — falling back to in-memory for store "${storeName}". Rate limits are NOT distributed.`,
                'warning'
            )
        } catch { /* Sentry not available — console fallback */ }
        console.warn(`[RateLimiter] Redis unavailable — in-memory fallback active for "${storeName}"`)
    }

    let allowed: boolean
    let retryAfterMs: number

    if (redisRatelimit) {
        const result = await redisRatelimit(storeName, ip, maxRequests, windowMs)
        allowed      = result.allowed
        retryAfterMs = result.retryAfterMs
    } else {
        const result = checkRateLimit(storeName, ip, maxRequests, windowMs)
        allowed      = result.allowed
        retryAfterMs = result.retryAfterMs
    }

    if (!allowed) {
        return NextResponse.json(
            { success: false, error: 'Too many requests. Please try again later.' },
            {
                status:  429,
                headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) },
            }
        )
    }

    return null
}

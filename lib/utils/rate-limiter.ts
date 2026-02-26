/**
 * In-memory rate limiter for API routes.
 * For production at scale, replace with Redis-based implementation.
 */

interface RateLimitEntry {
    count: number
    resetAt: number
}

const stores = new Map<string, Map<string, RateLimitEntry>>()

/**
 * Check rate limit for a given key within a named store.
 * Returns { allowed, remaining, retryAfterMs }
 */
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
        return {
            allowed: false,
            remaining: 0,
            retryAfterMs: entry.resetAt - now,
        }
    }

    entry.count++
    return { allowed: true, remaining: maxRequests - entry.count, retryAfterMs: 0 }
}

/**
 * Extract client IP from request headers.
 */
export function getClientIP(request: Request): string {
    return (
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown'
    )
}

/**
 * Helper: returns a 429 NextResponse if rate limited, or null if allowed.
 */
export function rateLimitOrNull(
    storeName: string,
    request: Request,
    maxRequests: number,
    windowMs: number
) {
    const ip = getClientIP(request)
    const { allowed, retryAfterMs } = checkRateLimit(storeName, ip, maxRequests, windowMs)

    if (!allowed) {
        const { NextResponse } = require('next/server')
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

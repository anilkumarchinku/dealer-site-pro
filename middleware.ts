import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { extractSlugFromHostname } from './lib/utils/slug'

const PROTECTED_PREFIXES = ['/dashboard', '/onboarding', '/preview']
const AUTH_PAGES       = ['/auth/login', '/auth/register']
const ADMIN_SESSION_COOKIE = 'dealer_site_admin_session'

// Base domain from env (e.g. "your-project.vercel.app" or "dealersitepro.com")
const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'dealersitepro.com'
const USE_SUBDOMAIN = process.env.NEXT_PUBLIC_USE_SUBDOMAIN === 'true'

// ── Domain cache (shared across all instances via Upstash, local Map as fallback) ──
// Local Map is still kept as L1 cache to avoid a Redis round-trip on every request
// for the same domain within the same instance.
const localCache = new Map<string, { slug: string; expires: number }>()
const CACHE_TTL  = 300_000 // 5 minutes

// Build Upstash Redis client once at module load (synchronous, no race condition)
function buildRedisClient() {
    const url   = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!url || !token) return null
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Redis } = require('@upstash/redis')
        return new Redis({ url, token }) as {
            get: (key: string) => Promise<string | null>
            set: (key: string, value: string, opts: { ex: number }) => Promise<unknown>
        }
    } catch { return null }
}
const redis = buildRedisClient()

async function getCachedSlug(hostname: string): Promise<string | null> {
    // L1: local memory
    const local = localCache.get(hostname)
    if (local && local.expires > Date.now()) return local.slug
    // L2: Redis (shared across instances)
    if (redis) {
        try {
            const val = await redis.get(`domain:${hostname}`)
            if (val) {
                localCache.set(hostname, { slug: val, expires: Date.now() + CACHE_TTL })
                return val
            }
        } catch { /* Redis unavailable — fall through */ }
    }
    return null
}

async function setCachedSlug(hostname: string, slug: string): Promise<void> {
    localCache.set(hostname, { slug, expires: Date.now() + CACHE_TTL })
    if (redis) {
        try {
            await redis.set(`domain:${hostname}`, slug, { ex: Math.ceil(CACHE_TTL / 1000) })
        } catch { /* Redis unavailable — local cache still set */ }
    }
}

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || ''
    const pathname = request.nextUrl.pathname

    // ── Handle CORS preflight for API routes ─────────────────
    if (pathname.startsWith('/api') && request.method === 'OPTIONS') {
        // Get allowed origins from env, default to base domain patterns
        const origin = request.headers.get('origin') ?? ''
        const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'localhost:3000'
        const allowedOrigins = [
            `https://${baseDomain}`,
            `http://localhost:3000`,
            `http://localhost:3001`,
        ]
        const isAllowedOrigin = allowedOrigins.includes(origin) ||
            origin.endsWith(`.${baseDomain}`)
        const corsOrigin = isAllowedOrigin ? origin : allowedOrigins[0]

        return new NextResponse(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin':  corsOrigin,
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, idempotency-key',
            },
        })
    }

    // ── Skip static files, API routes, Next.js internals ─────
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') ||
        pathname.startsWith('/favicon')
    ) {
        return NextResponse.next()
    }

    // ── Main domain detection ─────────────────────────────────
    // Always treat the configured BASE_DOMAIN, localhost, and all
    // *.vercel.app URLs as the "main" domain — never as dealer subdomains.
    const isMainDomain =
        hostname === BASE_DOMAIN ||
        hostname === `www.${BASE_DOMAIN}` ||
        hostname.startsWith('localhost') ||
        hostname.startsWith('127.0.0.1') ||
        hostname.endsWith('.vercel.app')   // Vercel preview/production deployments

    // ── Subdomain / custom domain routing ────────────────────
    // Handles both slug.indrav.in subdomains AND custom domains (ganeshmotor.com).
    // Runs for any host that is not the main domain.
    if (!isMainDomain) {
        // 1. Fast path: subdomain-style slug (e.g. ganesh.indrav.in → "ganesh")
        const slug = extractSlugFromHostname(hostname, BASE_DOMAIN)
        if (slug) {
            await setCachedSlug(hostname, slug)
            const url = request.nextUrl.clone()
            url.pathname = `/sites/${slug}${pathname}`
            return NextResponse.rewrite(url)
        }

        // 2. Check cache (L1 local + L2 Redis) for previously resolved custom domains
        const cached = await getCachedSlug(hostname)
        if (cached) {
            const url = request.nextUrl.clone()
            url.pathname = `/sites/${cached}${pathname}`
            return NextResponse.rewrite(url)
        }

        // 3. Look up custom domain via resolve API (e.g. ganeshmotor.com)
        try {
            const resolveUrl = new URL(request.url)
            resolveUrl.pathname = '/api/domains/resolve'
            resolveUrl.search = `?domain=${encodeURIComponent(hostname)}`

            const res = await fetch(resolveUrl.toString(), {
                signal: AbortSignal.timeout(2000), // 2s timeout
            })

            if (res.ok) {
                const { slug: resolvedSlug } = await res.json() as { slug: string }
                await setCachedSlug(hostname, resolvedSlug)
                const url = request.nextUrl.clone()
                url.pathname = `/sites/${resolvedSlug}${pathname}`
                return NextResponse.rewrite(url)
            }
        } catch {
            // Timeout or error — fall through to not-found
        }

        // 4. Nothing matched — domain not registered
        return NextResponse.redirect(new URL(`https://${BASE_DOMAIN}/not-found`, request.url))
    }

    // ── Auth guard (only on main domain) ─────────────────────
    if (pathname.startsWith('/admin/') && !request.cookies.get(ADMIN_SESSION_COOKIE)?.value) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // If Supabase isn't configured, skip auth checks entirely
    if (!supabaseUrl || !supabaseAnonKey ||
        supabaseUrl.includes('placeholder') ||
        supabaseUrl === 'https://your-project.supabase.co') {
        return NextResponse.next()
    }

    const response = NextResponse.next({
        request: { headers: request.headers },
    })

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => {
                    request.cookies.set(name, value)
                    response.cookies.set(name, value, options)
                })
            },
        },
    })

    // Wrap Supabase session check in try/catch — if it times out or fails on
    // Vercel Edge we fail-open (allow request through) rather than crashing.
    let isLoggedIn = false
    try {
        const { data: { user } } = await supabase.auth.getUser()
        isLoggedIn = !!user
    } catch {
        // Supabase unreachable — block protected routes rather than fail-open
        const isProtectedOnFail = PROTECTED_PREFIXES.some(p => pathname.startsWith(p))
        if (isProtectedOnFail) {
            const loginUrl = new URL('/auth/login', request.url)
            loginUrl.searchParams.set('redirect', pathname)
            return NextResponse.redirect(loginUrl)
        }
        return response
    }

    const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p))
    const isAuthPage  = AUTH_PAGES.some(p => pathname.startsWith(p))

    // Redirect to login if accessing protected route without session
    if (isProtected && !isLoggedIn) {
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Redirect to dashboard if already logged in and visiting auth pages
    if (isAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api).*)',
    ],
}

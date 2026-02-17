import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { extractSlugFromHostname } from './lib/utils/slug'

const PROTECTED_PREFIXES = ['/dashboard', '/onboarding']
const AUTH_PAGES       = ['/auth/login', '/auth/register']

// Base domain from env (e.g. "your-project.vercel.app" or "dealersitepro.com")
const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'dealersitepro.com'
const USE_SUBDOMAIN = process.env.NEXT_PUBLIC_USE_SUBDOMAIN === 'true'

// In-memory cache for domain lookups
const domainCache = new Map<string, { slug: string; expires: number }>()
const CACHE_TTL = 60000 // 60 seconds

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || ''
    const pathname = request.nextUrl.pathname

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
        hostname.endsWith('.vercel.app')   // Vercel preview/production deployments

    // ── Subdomain / custom domain routing ────────────────────
    // Only active when USE_SUBDOMAIN=true AND we're NOT on the main domain.
    // Requires wildcard DNS pointing to this app (e.g. *.dealersitepro.com).
    if (!isMainDomain && USE_SUBDOMAIN) {
        const slug = extractSlugFromHostname(hostname, BASE_DOMAIN)
        if (!slug) {
            return NextResponse.redirect(new URL(`https://${BASE_DOMAIN}/not-found`, request.url))
        }

        const cached = domainCache.get(hostname)
        if (cached && cached.expires > Date.now()) {
            const url = request.nextUrl.clone()
            url.pathname = `/sites/${cached.slug}${pathname}`
            return NextResponse.rewrite(url)
        }

        domainCache.set(hostname, { slug, expires: Date.now() + CACHE_TTL })
        const url = request.nextUrl.clone()
        url.pathname = `/sites/${slug}${pathname}`
        return NextResponse.rewrite(url)
    }

    // ── Custom domain routing (non-Vercel, non-BASE_DOMAIN hosts) ──────────
    // A dealer may point their own domain (abcmotors.com) here.
    // In that case we look up the slug from the dealer_domains table via
    // the /api/domains/resolve route (handled separately).
    if (!isMainDomain && !USE_SUBDOMAIN) {
        // Unknown host — treat as a custom domain dealer site
        const slug = extractSlugFromHostname(hostname, BASE_DOMAIN)
        if (slug) {
            const url = request.nextUrl.clone()
            url.pathname = `/sites/${slug}${pathname}`
            return NextResponse.rewrite(url)
        }
        // Custom domain (abcmotors.com) — rewrite to /sites/[custom-domain]
        // The page.tsx will resolve it via dealer_domains lookup
        const url = request.nextUrl.clone()
        url.pathname = `/sites/${hostname}${pathname}`
        return NextResponse.rewrite(url)
    }

    // ── Auth guard (only on main domain) ─────────────────────
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
        const { data: { session } } = await supabase.auth.getSession()
        isLoggedIn = !!session
    } catch {
        // Supabase unreachable — skip auth guard, let the page handle it
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

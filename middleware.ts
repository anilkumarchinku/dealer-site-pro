import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { extractSlugFromHostname } from './lib/utils/slug'

const PROTECTED_PREFIXES = ['/dashboard', '/onboarding']
const AUTH_PAGES       = ['/auth/login', '/auth/register']

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

    // ── Subdomain / custom domain routing ────────────────────
    const isMainDomain =
        hostname === 'dealersitepro.com' ||
        hostname === 'www.dealersitepro.com' ||
        hostname.startsWith('localhost')

    if (!isMainDomain) {
        const slug = extractSlugFromHostname(hostname)
        if (!slug) {
            return NextResponse.redirect(new URL('https://dealersitepro.com/not-found', request.url))
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

    const { data: { session } } = await supabase.auth.getSession()
    const isLoggedIn = !!session

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

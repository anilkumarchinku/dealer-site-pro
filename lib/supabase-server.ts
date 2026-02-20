/**
 * Server-side Supabase clients for API route handlers.
 * Use these in app/api/* routes — never use the browser client server-side.
 */

import { createServerClient } from '@supabase/ssr'
import { createClient }       from '@supabase/supabase-js'
import { cookies }            from 'next/headers'
import { NextResponse }       from 'next/server'

/**
 * Service-role client — bypasses RLS entirely.
 * Use ONLY in trusted server-side API routes (never expose to the client).
 */
export function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )
}

/**
 * Creates a Supabase client that reads the authenticated user's session
 * from cookies. Use in API route handlers.
 */
export async function createRouteClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Route handlers can't set cookies after streaming starts — safe to ignore
                    }
                },
            },
        }
    )
}

/**
 * Returns the authenticated user or sends a 401 response.
 * Usage:
 *   const { user, supabase, errorResponse } = await requireAuth()
 *   if (errorResponse) return errorResponse
 */
export async function requireAuth(): Promise<
    | { user: { id: string; email?: string }; supabase: Awaited<ReturnType<typeof createRouteClient>>; errorResponse: null }
    | { user: null; supabase: null; errorResponse: NextResponse }
> {
    const supabase = await createRouteClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return {
            user: null,
            supabase: null,
            errorResponse: NextResponse.json(
                { error: 'Unauthorized — please sign in' },
                { status: 401 }
            ),
        }
    }

    return { user, supabase, errorResponse: null }
}

/**
 * Verifies that the authenticated user owns the given dealerId.
 * Returns the dealer row or a 403 response if ownership check fails.
 */
export async function requireDealerOwnership(
    supabase: Awaited<ReturnType<typeof createRouteClient>>,
    userId: string,
    dealerId: string
): Promise<
    | { dealer: { id: string; slug: string }; errorResponse: null }
    | { dealer: null; errorResponse: NextResponse }
> {
    const { data: dealer, error } = await supabase
        .from('dealers')
        .select('id, slug')
        .eq('id', dealerId)
        .eq('user_id', userId)
        .single()

    if (error || !dealer) {
        return {
            dealer: null,
            errorResponse: NextResponse.json(
                { error: 'Forbidden — you do not own this dealer account' },
                { status: 403 }
            ),
        }
    }

    return { dealer, errorResponse: null }
}

/**
 * Looks up the dealer that belongs to the authenticated user.
 * Use when the route should auto-detect the dealer from session (not accept dealer_id from client).
 */
export async function getDealerForUser(
    supabase: Awaited<ReturnType<typeof createRouteClient>>,
    userId: string
): Promise<{ id: string; slug: string } | null> {
    const { data } = await supabase
        .from('dealers')
        .select('id, slug')
        .eq('user_id', userId)
        .single()

    return data ?? null
}

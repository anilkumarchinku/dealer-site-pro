/**
 * GET /auth/callback
 *
 * Handles the Supabase magic link redirect.
 * Exchanges the auth code for a session and redirects to the dashboard.
 */

import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next')

    if (code) {
        const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options)
                        })
                    },
                },
            }
        )

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // After email verification: create a stub dealer row so registration
            // data lands in the DB immediately. ignoreDuplicates:true ensures we
            // never overwrite an existing row (idempotent on retry).
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const meta = user.user_metadata ?? {}
                const dealershipName = (meta.dealership_name as string | undefined) ?? ''
                if (dealershipName) {
                    await supabase.from('dealers').upsert(
                        {
                            user_id: user.id,
                            dealership_name: dealershipName,
                            phone: (meta.phone as string | undefined) ?? null,
                            email: user.email ?? null,
                            onboarding_complete: false,
                            onboarding_step: 0,
                        },
                        { onConflict: 'user_id', ignoreDuplicates: true }
                    )
                }
            }

            // If coming from registration, redirect to login with success banner
            if (next === '/auth/login') {
                // Sign out so user can log in with their password
                await supabase.auth.signOut()
                return NextResponse.redirect(`${origin}/auth/login?registered=true`)
            }
            return NextResponse.redirect(`${origin}${next || '/dashboard'}`)
        }
    }

    // If code exchange fails, redirect to login with error
    return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
}

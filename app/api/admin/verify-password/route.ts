/**
 * POST /api/admin/verify-password
 * Verifies the admin password server-side.
 * ADMIN_PASSWORD env var is never sent to the client.
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    // 1. Must be logged in
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: (cookiesToSet) => {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // 2. Must be an admin email
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '')
        .split(',')
        .map(e => e.trim().toLowerCase())
        .filter(Boolean);

    if (!adminEmails.includes(user.email?.toLowerCase() ?? '')) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // 3. Check the password (server-side only — never sent to client)
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
        // No password configured — allow access (backwards compatible)
        return NextResponse.json({ success: true });
    }

    const { password } = await request.json();
    if (!password || password !== adminPassword) {
        return NextResponse.json({ success: false, error: 'Wrong password' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
}

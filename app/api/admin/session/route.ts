import { NextResponse } from "next/server"

import { createRouteClient } from "@/lib/supabase-server"
import {
    buildAdminSessionCookie,
    buildClearedAdminSessionCookie,
    createAdminSessionToken,
    getAdminSession,
    validateAdminCredentials,
} from "@/lib/utils/admin-session"
import { rateLimitOrNull } from "@/lib/utils/rate-limiter"

export async function GET() {
    const session = await getAdminSession()
    return NextResponse.json({
        authenticated: Boolean(session),
        username: session?.username ?? null,
        source: session?.source ?? null,
        email: session?.email ?? null,
        name: session?.name ?? null,
    })
}

export async function POST(request: Request) {
    const limited = await rateLimitOrNull("admin_login", request, 5, 15 * 60 * 1000)
    if (limited) return limited

    const { username, password } = await request.json()

    if (typeof username !== "string" || typeof password !== "string") {
        return NextResponse.json({ success: false, error: "Username and password are required" }, { status: 400 })
    }

    if (!validateAdminCredentials(username, password)) {
        return NextResponse.json({ success: false, error: "Invalid admin credentials" }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set(buildAdminSessionCookie(createAdminSessionToken(username.trim())))
    return response
}

export async function DELETE() {
    const response = NextResponse.json({ success: true })
    try {
        const supabase = await createRouteClient()
        await supabase.auth.signOut()
    } catch {
        // Legacy admin sessions do not require a Supabase session.
    }
    response.cookies.set(buildClearedAdminSessionCookie())
    return response
}

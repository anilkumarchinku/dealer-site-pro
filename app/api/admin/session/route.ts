import { NextResponse } from "next/server"

import {
    buildAdminSessionCookie,
    buildClearedAdminSessionCookie,
    createAdminSessionToken,
    getAdminSession,
    validateAdminCredentials,
} from "@/lib/utils/admin-session"

export async function GET() {
    const session = await getAdminSession()
    return NextResponse.json({
        authenticated: Boolean(session),
        username: session?.username ?? null,
    })
}

export async function POST(request: Request) {
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
    response.cookies.set(buildClearedAdminSessionCookie())
    return response
}

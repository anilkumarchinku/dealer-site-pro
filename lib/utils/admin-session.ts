import { createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const ADMIN_SESSION_COOKIE = "dealer_site_admin_session"

const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12

function toBase64Url(input: string): string {
    return Buffer.from(input, "utf8").toString("base64url")
}

function fromBase64Url(input: string): string {
    return Buffer.from(input, "base64url").toString("utf8")
}

function getSessionSecret(): string | null {
    return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? null
}

export function getAdminUsername(): string {
    return (process.env.ADMIN_USERNAME ?? "admin").trim()
}

export function validateAdminCredentials(username: string, password: string): boolean {
    const configuredPassword = process.env.ADMIN_PASSWORD
    if (!configuredPassword) return false

    const normalizedUsername = username.trim().toLowerCase()
    const configuredUsername = getAdminUsername()
    const matchesIdentity = normalizedUsername === configuredUsername.toLowerCase()

    return matchesIdentity && password === configuredPassword
}

export function createAdminSessionToken(username: string): string {
    const secret = getSessionSecret()
    if (!secret) {
        throw new Error("Admin session secret is not configured")
    }

    const payload = JSON.stringify({
        username,
        exp: Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000,
    })
    const encodedPayload = toBase64Url(payload)
    const signature = createHmac("sha256", secret).update(encodedPayload).digest("base64url")

    return `${encodedPayload}.${signature}`
}

export function verifyAdminSessionToken(token?: string | null): { username: string } | null {
    const secret = getSessionSecret()
    if (!secret || !token) return null

    const [encodedPayload, signature] = token.split(".")
    if (!encodedPayload || !signature) return null

    const expectedSignature = createHmac("sha256", secret).update(encodedPayload).digest("base64url")
    const actualBuffer = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expectedSignature)

    if (
        actualBuffer.length !== expectedBuffer.length ||
        !timingSafeEqual(actualBuffer, expectedBuffer)
    ) {
        return null
    }

    try {
        const parsed = JSON.parse(fromBase64Url(encodedPayload)) as { username?: string; exp?: number }
        if (!parsed.username || !parsed.exp || parsed.exp < Date.now()) return null
        return { username: parsed.username }
    } catch {
        return null
    }
}

export async function getAdminSession() {
    const cookieStore = await cookies()
    return verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)
}

export async function requireAdminSession(): Promise<
    | { session: { username: string }; errorResponse: null }
    | { session: null; errorResponse: NextResponse }
> {
    const session = await getAdminSession()
    if (!session) {
        return {
            session: null,
            errorResponse: NextResponse.json({ error: "Unauthorized admin session" }, { status: 401 }),
        }
    }

    return { session, errorResponse: null }
}

export function buildAdminSessionCookie(token: string) {
    return {
        name: ADMIN_SESSION_COOKIE,
        value: token,
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: ADMIN_SESSION_TTL_SECONDS,
    }
}

export function buildClearedAdminSessionCookie() {
    return {
        name: ADMIN_SESSION_COOKIE,
        value: "",
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    }
}

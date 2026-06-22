import { createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getOptionalEnv } from "@/lib/env"
import { createAdminClient, createRouteClient } from "@/lib/supabase-server"
import { getMetadataString, isPlatformAdminAppMetadata } from "@/lib/utils/platform-admin"

export const ADMIN_SESSION_COOKIE = "dealer_site_admin_session"

const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12

export type AdminSession = {
    username: string
    source: "legacy" | "platform"
    userId?: string
    email?: string
    name?: string
}

function toBase64Url(input: string): string {
    return Buffer.from(input, "utf8").toString("base64url")
}

function fromBase64Url(input: string): string {
    return Buffer.from(input, "base64url").toString("utf8")
}

function getSessionSecret(): string | null {
    return getOptionalEnv("ADMIN_SESSION_SECRET") ?? getOptionalEnv("ADMIN_PASSWORD") ?? null
}

function getAllowedAdminEmails(): string[] {
    return (getOptionalEnv("NEXT_PUBLIC_ADMIN_EMAILS") ?? "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
}

export function getAdminUsername(): string {
    return (getOptionalEnv("ADMIN_USERNAME") ?? "admin").trim()
}

export function validateAdminCredentials(username: string, password: string): boolean {
    const configuredPassword = getOptionalEnv("ADMIN_PASSWORD")
    if (!configuredPassword) return false

    const normalizedUsername = username.trim().toLowerCase()
    const configuredUsername = getAdminUsername()
    const allowedEmails = getAllowedAdminEmails()
    const matchesIdentity =
        normalizedUsername === configuredUsername.toLowerCase() ||
        allowedEmails.includes(normalizedUsername)

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

async function getLegacyAdminSession(): Promise<AdminSession | null> {
    const cookieStore = await cookies()
    const session = verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)
    return session ? { ...session, source: "legacy" } : null
}

async function getPlatformAdminSession(): Promise<AdminSession | null> {
    try {
        const supabase = await createRouteClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) return null

        const email = user.email?.trim().toLowerCase() ?? null
        const name =
            getMetadataString(user.user_metadata, "full_name") ??
            getMetadataString(user.user_metadata, "name") ??
            getMetadataString(user.app_metadata, "name")

        if (isPlatformAdminAppMetadata(user.app_metadata)) {
            return {
                username: email ?? user.id,
                source: "platform",
                userId: user.id,
                email: email ?? undefined,
                name: name ?? undefined,
            }
        }

        // platform_admins is introduced by the production-hardening migration;
        // generated DB types can lag until the migration is applied and types are regenerated.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const admin = createAdminClient() as any
        const { data: platformAdmin, error: platformError } = await admin
            .from("platform_admins")
            .select("user_id, email, full_name, is_active")
            .eq("user_id", user.id)
            .eq("is_active", true)
            .maybeSingle()

        if (platformError || !platformAdmin) return null

        return {
            username: platformAdmin.email ?? email ?? user.id,
            source: "platform",
            userId: platformAdmin.user_id ?? user.id,
            email: platformAdmin.email ?? email ?? undefined,
            name: platformAdmin.full_name ?? name ?? undefined,
        }
    } catch {
        return null
    }
}

export async function getAdminSession(): Promise<AdminSession | null> {
    return (await getLegacyAdminSession()) ?? (await getPlatformAdminSession())
}

export async function requireAdminSession(): Promise<
    | { session: AdminSession; errorResponse: null }
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

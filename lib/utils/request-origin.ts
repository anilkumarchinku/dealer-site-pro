import 'server-only'

import { headers } from 'next/headers'

function normalizeOrigin(value: string | null | undefined): string | null {
    if (!value) return null

    if (/^https?:\/\//i.test(value)) {
        return value.replace(/\/$/, '')
    }

    return `https://${value.replace(/\/$/, '')}`
}

export async function getRequestOrigin(): Promise<string | null> {
    const hdrs = await headers()
    const host = hdrs.get('x-forwarded-host') ?? hdrs.get('host')
    const proto = hdrs.get('x-forwarded-proto') ?? (host?.includes('localhost') ? 'http' : 'https')

    if (host) {
        return `${proto}://${host}`.replace(/\/$/, '')
    }

    return normalizeOrigin(
        process.env.NEXT_PUBLIC_APP_URL ??
        process.env.NEXT_PUBLIC_SITE_URL ??
        process.env.VERCEL_URL ??
        null
    )
}

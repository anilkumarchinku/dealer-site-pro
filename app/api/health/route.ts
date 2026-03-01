/**
 * GET /api/health
 * Health check endpoint for uptime monitoring tools.
 * Returns 200 if the app is running, 503 if critical services are down.
 */

import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
    const checks: Record<string, 'ok' | 'missing'> = {
        supabase_url:      process.env.NEXT_PUBLIC_SUPABASE_URL ? 'ok' : 'missing',
        supabase_anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'ok' : 'missing',
        razorpay_key:      process.env.RAZORPAY_KEY_ID ? 'ok' : 'missing',
    }

    const allOk = Object.values(checks).every(v => v === 'ok')

    return NextResponse.json(
        {
            status:    allOk ? 'ok' : 'degraded',
            timestamp: new Date().toISOString(),
            version:   process.env.npm_package_version ?? '0.1.0',
            checks,
        },
        { status: allOk ? 200 : 503 }
    )
}

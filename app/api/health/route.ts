/**
 * GET /api/health
 * Health check endpoint for uptime monitoring tools.
 * Returns 200 if the app is running, 503 if critical services are down.
 *
 * Checks:
 *  - env vars (supabase URL, anon key, razorpay key)
 *  - live Supabase DB connectivity (SELECT against dealers table)
 */

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
    const checks: Record<string, string> = {}
    let httpStatus = 200

    // Check env vars
    checks.supabase_url      = process.env.NEXT_PUBLIC_SUPABASE_URL      ? 'ok' : 'missing'
    checks.supabase_anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'ok' : 'missing'
    checks.razorpay_key      = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID   ? 'ok' : 'missing'

    // Check live DB connectivity
    try {
        const supabase = createAdminClient()
        const { error } = await supabase.from('dealers').select('id').limit(1)
        checks.db = error ? `error: ${error.message}` : 'ok'
    } catch (e) {
        checks.db = 'unreachable'
        httpStatus = 503
    }

    const allOk = Object.values(checks).every(v => v === 'ok')
    if (!allOk) httpStatus = 503

    return NextResponse.json(
        {
            status:  allOk ? 'ok' : 'degraded',
            checks,
            ts:      Date.now(),
            version: process.env.npm_package_version ?? '0.1.0',
        },
        { status: httpStatus }
    )
}

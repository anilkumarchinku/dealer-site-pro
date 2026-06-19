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
import { getOptionalEnv, type EnvKey } from '@/lib/env'
import { createAdminClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const checks: Record<string, string> = {}
    let httpStatus = 200

    const envChecks: Array<[string, EnvKey]> = [
        ['supabase_url', 'NEXT_PUBLIC_SUPABASE_URL'],
        ['supabase_anon_key', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
        ['supabase_service_role', 'SUPABASE_SERVICE_ROLE_KEY'],
        ['base_domain', 'NEXT_PUBLIC_BASE_DOMAIN'],
        ['razorpay_key', 'NEXT_PUBLIC_RAZORPAY_KEY_ID'],
        ['razorpay_secret', 'RAZORPAY_KEY_SECRET'],
        ['razorpay_webhook_secret', 'RAZORPAY_WEBHOOK_SECRET'],
        ['vercel_token', 'VERCEL_TOKEN'],
        ['vercel_main_project', 'VERCEL_MAIN_PROJECT_ID'],
    ]

    for (const [label, key] of envChecks) {
        checks[label] = getOptionalEnv(key) ? 'ok' : 'missing'
    }

    // Check live DB connectivity
    try {
        const supabase = createAdminClient()
        const { error } = await supabase.from('dealers').select('id').limit(1)
        checks.db = error ? 'error' : 'ok'
    } catch {
        checks.db = 'unreachable'
        httpStatus = 503
    }

    const allOk = Object.values(checks).every(v => v === 'ok')
    if (!allOk) httpStatus = 503

    // Only expose the detailed config/DB check map to authorized callers (CRON_SECRET).
    // Anonymous uptime monitors still get the overall status + correct HTTP code.
    const cronSecret = getOptionalEnv('CRON_SECRET')
    const authorized = !!cronSecret && request.headers.get('authorization') === `Bearer ${cronSecret}`

    return NextResponse.json(
        authorized
            ? {
                status:  allOk ? 'ok' : 'degraded',
                checks,
                ts:      Date.now(),
                version: process.env.npm_package_version ?? '0.1.0',
            }
            : { status: allOk ? 'ok' : 'degraded', ts: Date.now() },
        { status: httpStatus }
    )
}

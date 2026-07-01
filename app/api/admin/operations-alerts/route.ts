import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase-server'
import { getOptionalEnv, isPlaceholderEnvValue, type EnvKey } from '@/lib/env'
import { requireAdminSession } from '@/lib/utils/admin-session'

type AlertLevel = 'critical' | 'warning' | 'info'

interface OperationAlert {
    id: string
    level: AlertLevel
    title: string
    detail: string
    count?: number
}

function envReady(key: EnvKey) {
    const value = getOptionalEnv(key)
    return Boolean(value && !isPlaceholderEnvValue(value))
}

async function countWhere(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase: any,
    table: string,
    column: string,
    value: string
) {
    const { count, error } = await supabase
        .from(table)
        .select('id', { count: 'exact', head: true })
        .eq(column, value)

    if (error) return null
    return count ?? 0
}

export async function GET() {
    const { errorResponse } = await requireAdminSession()
    if (errorResponse) return errorResponse

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any
    const alerts: OperationAlert[] = []

    const configChecks: Array<{ id: string; title: string; keys: EnvKey[] }> = [
        { id: 'cyepro-config', title: 'Cyepro inventory and lead sync', keys: ['CYEPRO_API_BASE_URL', 'CYEPRO_SEARCH_PATH', 'CYEPRO_LEAD_PATH'] },
        { id: 'razorpay-config', title: 'Razorpay billing and bookings', keys: ['NEXT_PUBLIC_RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET'] },
        { id: 'domain-config', title: 'Custom domain automation', keys: ['VERCEL_TOKEN', 'VERCEL_MAIN_PROJECT_ID', 'NEXT_PUBLIC_CNAME_TARGET'] },
        { id: 'rc-config', title: 'RC lookup provider', keys: ['RC_LOOKUP_PROVIDER'] },
        { id: 'finance-config', title: 'Finance pre-check partner', keys: ['FINANCE_PRECHECK_URL'] },
        { id: 'fastag-config', title: 'FASTag recharge partner', keys: ['FASTAG_RECHARGE_URL'] },
    ]

    for (const check of configChecks) {
        const missing = check.keys.filter((key) => !envReady(key))
        if (missing.length > 0) {
            alerts.push({
                id: check.id,
                level: check.id.includes('razorpay') || check.id.includes('domain') ? 'critical' : 'warning',
                title: `${check.title} not fully configured`,
                detail: `Missing or placeholder env: ${missing.join(', ')}`,
            })
        }
    }

    const [
        failedCyeproLeads,
        failedDomains,
        pendingDomains,
        pastDueSubscriptions,
        failedWebhooks,
    ] = await Promise.all([
        countWhere(supabase, 'leads', 'cyepro_sync_status', 'failed'),
        countWhere(supabase, 'dealer_domains', 'status', 'failed'),
        countWhere(supabase, 'dealer_domains', 'status', 'pending'),
        countWhere(supabase, 'domain_subscriptions', 'status', 'past_due'),
        countWhere(supabase, 'webhook_events', 'status', 'failed'),
    ])

    if ((failedCyeproLeads ?? 0) > 0) {
        alerts.push({
            id: 'failed-cyepro-leads',
            level: 'warning',
            title: 'Failed Cyepro lead syncs',
            detail: 'Some website leads did not reach the connected Cyepro workflow.',
            count: failedCyeproLeads ?? 0,
        })
    }

    if ((failedDomains ?? 0) > 0 || (pendingDomains ?? 0) > 0) {
        alerts.push({
            id: 'domain-verification',
            level: (failedDomains ?? 0) > 0 ? 'critical' : 'warning',
            title: 'Domain verification needs attention',
            detail: `${failedDomains ?? 0} failed and ${pendingDomains ?? 0} pending custom domain rows.`,
            count: (failedDomains ?? 0) + (pendingDomains ?? 0),
        })
    }

    if ((pastDueSubscriptions ?? 0) > 0) {
        alerts.push({
            id: 'past-due-subscriptions',
            level: 'warning',
            title: 'Past-due domain subscriptions',
            detail: 'Razorpay subscription status should be reviewed for these dealers.',
            count: pastDueSubscriptions ?? 0,
        })
    }

    if ((failedWebhooks ?? 0) > 0) {
        alerts.push({
            id: 'failed-webhooks',
            level: 'critical',
            title: 'Failed webhook events',
            detail: 'Payment webhook retries or manual reconciliation may be needed.',
            count: failedWebhooks ?? 0,
        })
    }

    return NextResponse.json({
        generatedAt: new Date().toISOString(),
        ok: alerts.length === 0,
        alerts,
    })
}

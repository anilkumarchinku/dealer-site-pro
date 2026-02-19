/**
 * GET /api/deploy/status/[id]
 * Returns the current deployment status for a given deployment record ID.
 * The dashboard polls this every 5 seconds while status is "building".
 *
 * The [id] parameter can be:
 *   1. A Supabase record UUID  (preferred path — looked up in dealer_deployments)
 *   2. A Vercel deployment UID (fallback — queried from Vercel directly)
 *      Used when the Supabase upsert failed but we still have a Vercel build running.
 *
 * Response shape:
 * {
 *   status:   "queued" | "building" | "ready" | "error"
 *   siteUrl:  string | null
 *   error:    string | null
 *   progress: number  (0–100)
 * }
 */

import { NextResponse }            from 'next/server'
import { createClient }            from '@supabase/supabase-js'
import { getDeploymentStatus }     from '@/lib/services/vercel-service'

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
}

// Maps Vercel deployment states to our simplified status
function vercelStateToStatus(
    state: string,
): 'queued' | 'building' | 'ready' | 'error' {
    switch (state) {
        case 'READY':    return 'ready'
        case 'ERROR':    return 'error'
        case 'CANCELED': return 'error'
        case 'BUILDING':
        case 'INITIALIZING': return 'building'
        default:         return 'queued'
    }
}

// Rough progress estimate based on Vercel state
function stateToProgress(state: string): number {
    switch (state) {
        case 'QUEUED':       return 10
        case 'INITIALIZING': return 25
        case 'BUILDING':     return 60
        case 'READY':        return 100
        case 'ERROR':        return 100
        default:             return 5
    }
}

// Looks like a Supabase UUID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
function isSupabaseUUID(id: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params

        // ── Guard: reject obviously invalid IDs immediately ────────────────────
        if (!id || id === 'null' || id === 'undefined') {
            return NextResponse.json(
                { error: 'Invalid deployment ID' },
                { status: 400 },
            )
        }

        // ── Path 1: Supabase record lookup (preferred) ─────────────────────────
        if (isSupabaseUUID(id)) {
            const supabase = getSupabase()

            const { data: record, error } = await supabase
                .from('dealer_deployments')
                .select('*')
                .eq('id', id)
                .single()

            if (!error && record) {
                // If already terminal (ready/error), return cached status
                if (record.status === 'ready' || record.status === 'error') {
                    return NextResponse.json({
                        status:   record.status,
                        siteUrl:  record.site_url,
                        error:    record.error_message ?? null,
                        progress: 100,
                    })
                }

                // Still building — check live Vercel status
                let vercelStatus = record.status
                let progress     = 20
                let errorMessage: string | null = null

                if (record.vercel_deploy_id) {
                    try {
                        const deployment = await getDeploymentStatus(record.vercel_deploy_id)
                        vercelStatus = vercelStateToStatus(deployment.state)
                        progress     = stateToProgress(deployment.state)

                        if (vercelStatus !== record.status) {
                            // Update this record's status
                            await supabase
                                .from('dealer_deployments')
                                .update({
                                    status:        vercelStatus,
                                    is_current:    vercelStatus === 'ready' ? true : false,
                                    error_message: vercelStatus === 'error'
                                        ? `Vercel build ${deployment.state}`
                                        : null,
                                    updated_at: new Date().toISOString(),
                                })
                                .eq('id', id)

                            // If newly ready → un-mark all other records for this dealer as current
                            if (vercelStatus === 'ready') {
                                await supabase
                                    .from('dealer_deployments')
                                    .update({ is_current: false })
                                    .eq('dealer_id', record.dealer_id)
                                    .neq('id', id)
                            }

                            if (vercelStatus === 'error') {
                                errorMessage = `Vercel build ${deployment.state}`
                            }
                        }
                    } catch (vercelErr) {
                        console.error('Could not fetch Vercel status:', vercelErr)
                    }
                }

                return NextResponse.json({
                    status:   vercelStatus,
                    siteUrl:  record.site_url,
                    error:    errorMessage,
                    progress,
                })
            }
        }

        // ── Path 2: Vercel deployment UID fallback ─────────────────────────────
        // Supabase record not found (or ID is a Vercel UID) — query Vercel directly
        try {
            const deployment = await getDeploymentStatus(id)
            const status     = vercelStateToStatus(deployment.state)
            const progress   = stateToProgress(deployment.state)
            const siteUrl    = deployment.url ? `https://${deployment.url}` : null

            return NextResponse.json({
                status,
                siteUrl,
                error:    status === 'error' ? `Vercel build ${deployment.state}` : null,
                progress,
            })
        } catch {
            return NextResponse.json(
                { error: 'Deployment not found' },
                { status: 404 },
            )
        }
    } catch (err) {
        console.error('Status route error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

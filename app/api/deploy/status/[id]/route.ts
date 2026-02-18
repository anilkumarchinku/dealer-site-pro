/**
 * GET /api/deploy/status/[id]
 * Returns the current deployment status for a given deployment record ID.
 * The dashboard polls this every 5 seconds while status is "building".
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

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params
        const supabase = getSupabase()

        // Load deployment record from Supabase
        const { data: record, error } = await supabase
            .from('dealer_deployments')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !record) {
            return NextResponse.json({ error: 'Deployment not found' }, { status: 404 })
        }

        // If already terminal (ready/error), return cached status
        if (record.status === 'ready' || record.status === 'error') {
            return NextResponse.json({
                status:   record.status,
                siteUrl:  record.site_url,
                error:    record.error_message ?? null,
                progress: record.status === 'ready' ? 100 : 100,
            })
        }

        // Otherwise check live Vercel status
        let vercelStatus = record.status
        let progress     = 20
        let errorMessage: string | null = null

        if (record.vercel_deploy_id) {
            try {
                const deployment = await getDeploymentStatus(record.vercel_deploy_id)
                vercelStatus = vercelStateToStatus(deployment.state)
                progress     = stateToProgress(deployment.state)

                // Persist status change if it changed
                if (vercelStatus !== record.status) {
                    await supabase
                        .from('dealer_deployments')
                        .update({
                            status:        vercelStatus,
                            error_message: vercelStatus === 'error' ? `Vercel build ${deployment.state}` : null,
                            updated_at:    new Date().toISOString(),
                        })
                        .eq('id', id)
                }
            } catch (vercelErr) {
                console.error('Could not fetch Vercel status:', vercelErr)
                // Return last known status rather than erroring
            }
        }

        return NextResponse.json({
            status:   vercelStatus,
            siteUrl:  record.site_url,
            error:    errorMessage,
            progress,
        })
    } catch (err) {
        console.error('Status route error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

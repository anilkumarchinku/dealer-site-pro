import { NextResponse } from 'next/server'
import { getMonitoringStats } from '@/lib/services/monitoring-service'
import { requireAuth, getDealerForUser } from '@/lib/supabase-server'

/**
 * GET /api/domains/stats
 * Get domain monitoring statistics for the authenticated dealer.
 * Dealer ID is derived from session — never trusted from client.
 */
export async function GET() {
    try {
        const { user, supabase, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse

        const dealer = await getDealerForUser(supabase, user.id)
        if (!dealer) {
            return NextResponse.json(
                { success: false, error: 'Dealer account not found' },
                { status: 404 }
            )
        }

        const result = await getMonitoringStats(dealer.id)

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            stats: result.stats
        })
    } catch (error) {
        console.error('Error in GET /api/domains/stats:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

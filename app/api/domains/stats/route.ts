import { NextResponse } from 'next/server'
import { getMonitoringStats } from '@/lib/services/monitoring-service'
import { requireDealerForRoute } from '@/lib/services/dealer-route-auth-service'

/**
 * GET /api/domains/stats
 * Get domain monitoring statistics for the authenticated dealer.
 * Dealer ID is derived from session — never trusted from client.
 */
export async function GET() {
    try {
        const { dealer, errorResponse } = await requireDealerForRoute({
            body: { success: false, error: 'Dealer account not found' },
        })
        if (errorResponse) return errorResponse

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

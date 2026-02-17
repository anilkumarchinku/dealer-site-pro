import { NextResponse } from 'next/server'
import { getMonitoringStats } from '@/lib/services/monitoring-service'

/**
 * GET /api/domains/stats?dealer_id=xxx
 * Get domain monitoring statistics for dashboard
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const dealerId = searchParams.get('dealer_id')

        if (!dealerId) {
            return NextResponse.json(
                { success: false, error: 'Dealer ID is required' },
                { status: 400 }
            )
        }

        const result = await getMonitoringStats(dealerId)

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

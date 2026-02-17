import { NextResponse } from 'next/server'
import { getDealerDomains } from '@/lib/services/domain-service'

/**
 * GET /api/domains
 * Get all domains for the authenticated dealer
 */
export async function GET(request: Request) {
    try {
        // TODO: Get dealer_id from authentication session
        // For now, we'll need to pass it as a query parameter
        const { searchParams } = new URL(request.url)
        const dealerId = searchParams.get('dealer_id')

        if (!dealerId) {
            return NextResponse.json(
                { error: 'Dealer ID is required' },
                { status: 400 }
            )
        }

        const domains = await getDealerDomains(dealerId)

        return NextResponse.json({
            success: true,
            domains
        })
    } catch (error) {
        console.error('Error in GET /api/domains:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

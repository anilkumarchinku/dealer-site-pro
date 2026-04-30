import { NextResponse } from 'next/server'
import { getDealerDomains } from '@/lib/services/domain-service'
import { requireDealerForRoute } from '@/lib/services/dealer-route-auth-service'

/**
 * GET /api/domains
 * Returns all domains for the authenticated dealer.
 * No query params accepted — dealer is resolved from the auth session.
 */
export async function GET() {
    try {
        const { dealer, supabase, errorResponse } = await requireDealerForRoute({
            body: { error: 'No dealer account found for this user' },
        })
        if (errorResponse) return errorResponse

        const domains = await getDealerDomains(dealer.id, supabase)

        return NextResponse.json({ success: true, domains })
    } catch (error) {
        console.error('Error in GET /api/domains:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

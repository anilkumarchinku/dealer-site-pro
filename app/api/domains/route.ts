import { NextResponse } from 'next/server'
import { getDealerDomains } from '@/lib/services/domain-service'
import { requireAuth, getDealerForUser } from '@/lib/supabase-server'

/**
 * GET /api/domains
 * Returns all domains for the authenticated dealer.
 * No query params accepted — dealer is resolved from the auth session.
 */
export async function GET() {
    try {
        const { user, supabase, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse

        const dealer = await getDealerForUser(supabase, user.id)
        if (!dealer) {
            return NextResponse.json(
                { error: 'No dealer account found for this user' },
                { status: 404 }
            )
        }

        const domains = await getDealerDomains(dealer.id)

        return NextResponse.json({ success: true, domains })
    } catch (error) {
        console.error('Error in GET /api/domains:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

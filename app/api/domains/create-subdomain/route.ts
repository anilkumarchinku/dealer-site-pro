import { NextResponse } from 'next/server'
import { createSubdomainForDealer } from '@/lib/services/domain-service'
import {
    getSupabaseServerConfigError,
    isSupabaseServerReady,
    requireAuth,
    requireDealerOwnership,
} from '@/lib/supabase-server'

/**
 * POST /api/domains/create-subdomain
 * Creates a FREE subdomain for a dealer during onboarding
 */
export async function POST(request: Request) {
    try {
        // Check if Supabase is configured
        if (!isSupabaseServerReady()) {
            const configError = getSupabaseServerConfigError()
            console.error('Supabase not configured:', configError)
            return NextResponse.json(
                {
                    success: false,
                    error: 'Database not configured. Please set up Supabase to continue.',
                    details: process.env.NODE_ENV === 'development' ? configError : undefined
                },
                { status: 503 }
            )
        }

        const { user, supabase, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse

        const body = await request.json()
        const { dealerId, businessName, city } = body

        if (!dealerId || !businessName) {
            return NextResponse.json(
                { success: false, error: 'Dealer ID and business name are required' },
                { status: 400 }
            )
        }

        const { errorResponse: ownershipError } = await requireDealerOwnership(supabase, user.id, dealerId)
        if (ownershipError) return ownershipError

        // Create subdomain
        const result = await createSubdomainForDealer({
            dealerId,
            businessName,
            city
        }, supabase)

        if (result.success) {
            return NextResponse.json({
                success: true,
                domain: result.domain,
                message: `Your website is live at ${result.domain?.domain}!`
            })
        } else {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error
                },
                { status: 400 }
            )
        }
    } catch (error) {
        console.error('Error in POST /api/domains/create-subdomain:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

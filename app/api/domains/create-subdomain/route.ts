import { NextResponse } from 'next/server'
import { createSubdomainForDealer } from '@/lib/services/domain-service'
import { isSupabaseReady, getSupabaseConfigError } from '@/lib/supabase'

/**
 * POST /api/domains/create-subdomain
 * Creates a FREE subdomain for a dealer during onboarding
 */
export async function POST(request: Request) {
    try {
        // Check if Supabase is configured
        if (!isSupabaseReady()) {
            const configError = getSupabaseConfigError()
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

        const body = await request.json()
        const { dealerId, businessName, city } = body

        if (!dealerId || !businessName) {
            return NextResponse.json(
                { success: false, error: 'Dealer ID and business name are required' },
                { status: 400 }
            )
        }

        // Create subdomain
        const result = await createSubdomainForDealer({
            dealerId,
            businessName,
            city
        })

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

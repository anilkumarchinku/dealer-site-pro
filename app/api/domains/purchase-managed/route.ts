import { NextResponse } from 'next/server'
import { purchaseDomain } from '@/lib/services/domain-search-service'
import { supabase } from '@/lib/supabase'

/**
 * POST /api/domains/purchase-managed
 * Purchase and configure managed domain (PREMIUM tier)
 */
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { dealerId, domain, contactInfo } = body

        if (!dealerId || !domain || !contactInfo) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Purchase domain via Cloudflare
        const purchaseResult = await purchaseDomain(domain, contactInfo)

        if (!purchaseResult.success) {
            return NextResponse.json(
                { success: false, error: purchaseResult.error },
                { status: 400 }
            )
        }

        // Create domain record
        const { data: newDomain, error: dbError } = await supabase
            .from('domains')
            .insert({
                dealer_id: dealerId,
                domain,
                slug: domain.replace(/\./g, '-'),
                type: 'managed',
                status: 'active', // Auto-configured, no verification needed
                ssl_status: 'provisioning',
                is_primary: true, // Make primary by default
                registrar: 'cloudflare',
                registration_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
                auto_renew: true
            })
            .select()
            .single()

        if (dbError) {
            console.error('Error creating managed domain:', dbError)
            return NextResponse.json(
                { success: false, error: 'Failed to save domain' },
                { status: 500 }
            )
        }

        // Un-set previous primary domain
        await supabase
            .from('domains')
            .update({ is_primary: false })
            .eq('dealer_id', dealerId)
            .neq('id', newDomain.id)

        return NextResponse.json({
            success: true,
            domain: newDomain,
            orderId: purchaseResult.orderId,
            message: 'Domain purchased and configured successfully!'
        })
    } catch (error) {
        console.error('Error in POST /api/domains/purchase-managed:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

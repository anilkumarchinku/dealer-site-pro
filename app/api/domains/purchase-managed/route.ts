import { NextResponse } from 'next/server'
import { purchaseDomain } from '@/lib/services/domain-search-service'
import { requireAuth, requireDealerOwnership } from '@/lib/supabase-server'

function normalizeDomain(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/.*$/, '')
}

/**
 * POST /api/domains/purchase-managed
 * Purchase and configure managed domain (PREMIUM tier)
 */
export async function POST(request: Request) {
    try {
        const { user, supabase: authSupabase, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse

        const body = await request.json()
        const { dealerId, domain, contactInfo } = body
        const normalizedDomain = typeof domain === 'string' ? normalizeDomain(domain) : ''

        if (!dealerId || !normalizedDomain || !contactInfo) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const { errorResponse: ownershipError } = await requireDealerOwnership(authSupabase, user.id, dealerId)
        if (ownershipError) return ownershipError

        // Purchase domain via Cloudflare
        const purchaseResult = await purchaseDomain(normalizedDomain, contactInfo)

        if (!purchaseResult.success) {
            return NextResponse.json(
                { success: false, error: purchaseResult.error },
                { status: 400 }
            )
        }

        const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()

        // Make the managed domain primary in the canonical routing table.
        await authSupabase
            .from('dealer_domains')
            .update({ is_primary: false })
            .eq('dealer_id', dealerId)

        const { data: newDomain, error: dbError } = await authSupabase
            .from('dealer_domains')
            .insert({
                dealer_id: dealerId,
                custom_domain: normalizedDomain,
                domain_type: 'managed',
                status: 'active', // Auto-configured, no verification needed
                ssl_status: 'provisioning',
                is_primary: true, // Make primary by default
                dns_verified: true,
                dns_verified_at: new Date().toISOString(),
                registrar: 'cloudflare',
                registration_expires_at: expiresAt,
                auto_renew: true
            })
            .select()
            .single()

        if (dbError || !newDomain) {
            console.error('Error creating managed domain:', dbError)
            return NextResponse.json(
                { success: false, error: 'Failed to save domain' },
                { status: 500 }
            )
        }

        // Keep legacy dashboard-facing records compatible for older code paths.
        await authSupabase
            .from('domains')
            .update({ is_primary: false })
            .eq('dealer_id', dealerId)

        const { error: legacyError } = await authSupabase
            .from('domains')
            .insert({
                dealer_id: dealerId,
                domain: normalizedDomain,
                slug: normalizedDomain.replace(/\./g, '-'),
                type: 'managed',
                status: 'active',
                ssl_status: 'provisioning',
                is_primary: true,
                dns_verified_at: new Date().toISOString(),
                registrar: 'cloudflare',
                registration_expires_at: expiresAt,
                auto_renew: true
            })

        if (legacyError) {
            console.warn('Managed domain saved to dealer_domains but legacy domains sync failed:', legacyError)
        }

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

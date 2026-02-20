import { NextResponse } from 'next/server'
import { verifyCustomDomain } from '@/lib/services/dns-verification-service'
import { createRouteClient } from '@/lib/supabase-server'

/**
 * POST /api/domains/verify-dns
 * Verifies DNS configuration for a custom domain
 */
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { domainId, domain } = body

        if (!domainId || !domain) {
            return NextResponse.json(
                { success: false, error: 'Domain ID and domain name are required' },
                { status: 400 }
            )
        }

        const supabase = await createRouteClient()

        // Verify DNS
        const verification = await verifyCustomDomain(domain)

        // Save verification results to domain_verifications
        await supabase.from('domain_verifications').insert(
            verification.records.map(record => ({
                domain_id: domainId,
                record_type: record.type,
                record_name: record.name,
                expected_value: record.expectedValue,
                actual_value: record.actualValue,
                is_verified: record.isVerified,
                error_message: record.error
            }))
        )

        // Update dealer_domains status
        if (verification.allVerified) {
            await supabase
                .from('dealer_domains')
                .update({
                    status: 'active',
                    dns_verified: true,
                    dns_verified_at: new Date().toISOString(),
                    last_checked_at: new Date().toISOString()
                })
                .eq('id', domainId)
        } else {
            await supabase
                .from('dealer_domains')
                .update({
                    status: 'pending',
                    dns_verified: false,
                    last_checked_at: new Date().toISOString()
                })
                .eq('id', domainId)
        }

        return NextResponse.json({
            success: true,
            verification
        })
    } catch (error) {
        console.error('Error in POST /api/domains/verify-dns:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

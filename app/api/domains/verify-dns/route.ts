import { NextResponse } from 'next/server'
import { verifyCustomDomain } from '@/lib/services/dns-verification-service'
import { supabase, isSupabaseReady, getSupabaseConfigError } from '@/lib/supabase'

/**
 * POST /api/domains/verify-dns
 * Verifies DNS configuration for a custom domain
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
                    error: 'Database not configured. Please contact support.',
                    details: process.env.NODE_ENV === 'development' ? configError : undefined
                },
                { status: 503 }
            )
        }

        const body = await request.json()
        const { domainId, domain } = body

        if (!domainId || !domain) {
            return NextResponse.json(
                { success: false, error: 'Domain ID and domain name are required' },
                { status: 400 }
            )
        }

        // Verify DNS
        const verification = await verifyCustomDomain(domain)

        // Save verification results
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

        // Update domain status
        if (verification.allVerified) {
            await supabase
                .from('domains')
                .update({
                    status: 'active',
                    dns_verified_at: new Date().toISOString(),
                    last_checked_at: new Date().toISOString()
                })
                .eq('id', domainId)
        } else {
            await supabase
                .from('domains')
                .update({
                    status: 'failed',
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

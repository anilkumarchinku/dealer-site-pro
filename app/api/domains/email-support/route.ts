import { NextResponse } from 'next/server'
import { sendDomainEmailSupportRequestEmail } from '@/lib/services/email-service'
import { requireAuth, requireDealerOwnership } from '@/lib/supabase-server'
import type { Json } from '@/lib/database.types'

function normalizeDomain(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/.*$/, '')
}

async function resolveMxRecords(domain: string): Promise<Array<{ exchange: string; priority: number }>> {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const dns = (await import(/* webpackIgnore: true */ 'dns/promises')).default
    return dns.resolveMx(domain)
}

export async function POST(request: Request) {
    try {
        const { user, supabase, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse

        const body = await request.json()
        const { domainId, domain, dealerId, notes } = body

        if (!domainId || !domain || !dealerId) {
            return NextResponse.json(
                { success: false, error: 'Domain ID, domain name and dealer ID are required' },
                { status: 400 }
            )
        }

        const { errorResponse: ownerErr } = await requireDealerOwnership(supabase, user.id, dealerId)
        if (ownerErr) return ownerErr

        const { data: storedDomain, error: domainError } = await supabase
            .from('dealer_domains')
            .select('id, dealer_id, custom_domain, subdomain_url, subdomain')
            .eq('id', domainId)
            .eq('dealer_id', dealerId)
            .single()

        if (domainError || !storedDomain) {
            return NextResponse.json(
                { success: false, error: 'Domain not found or does not belong to your account' },
                { status: 404 }
            )
        }

        const storedDomainName = normalizeDomain(
            storedDomain.custom_domain ?? storedDomain.subdomain_url ?? storedDomain.subdomain ?? ''
        )

        if (!storedDomainName || normalizeDomain(domain) !== storedDomainName) {
            return NextResponse.json(
                { success: false, error: 'Domain name does not match the stored domain record' },
                { status: 400 }
            )
        }

        const { data: dealer } = await supabase
            .from('dealers')
            .select('dealership_name, email')
            .eq('id', dealerId)
            .eq('user_id', user.id)
            .single()

        let mxRecords: Array<{ exchange: string; priority: number }> = []
        let mxStatus: 'found' | 'missing' | 'error' | 'not_checked' = 'not_checked'

        try {
            mxRecords = await resolveMxRecords(storedDomainName)
            mxStatus = mxRecords.length > 0 ? 'found' : 'missing'
        } catch {
            mxStatus = 'missing'
        }

        const cleanNotes = typeof notes === 'string' ? notes.trim().slice(0, 1000) : null

        const { data: requestRow, error: insertError } = await supabase
            .from('domain_email_support_requests')
            .insert({
                dealer_id: dealerId,
                domain_id: domainId,
                domain: storedDomainName,
                requester_user_id: user.id,
                requester_email: user.email ?? dealer?.email ?? null,
                mx_status: mxStatus,
                mx_records: mxRecords as unknown as Json,
                notes: cleanNotes,
                status: 'open',
            })
            .select('id, status, created_at')
            .single()

        if (insertError) {
            console.error('[domain-email-support] Failed to save support request:', insertError)
            return NextResponse.json(
                { success: false, error: 'Failed to save support request' },
                { status: 500 }
            )
        }

        const emailResult = await sendDomainEmailSupportRequestEmail({
            dealerName: dealer?.dealership_name ?? 'DealerSite Pro dealer',
            dealerEmail: user.email ?? dealer?.email ?? null,
            domain: storedDomainName,
            mxStatus,
            mxRecords,
            notes: cleanNotes ?? undefined,
        })

        return NextResponse.json({
            success: true,
            request: requestRow,
            emailQueued: emailResult.success,
            mxStatus,
            mxRecords,
            message: emailResult.success
                ? 'Support request sent. Our team will help you preserve or set up email records.'
                : 'Support request saved. Email notification is not configured yet.',
        })
    } catch (error) {
        console.error('Error in POST /api/domains/email-support:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

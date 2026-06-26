import { NextResponse } from 'next/server'
import { requireAuth, requireDealerOwnership } from '@/lib/supabase-server'

function normalizeDomain(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/.*$/, '')
}

async function resolveMxRecords(domain: string) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const dns = (await import(/* webpackIgnore: true */ 'dns/promises')).default
    return dns.resolveMx(domain)
}

export async function POST(request: Request) {
    try {
        const { user, supabase, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse

        const body = await request.json()
        const { domainId, domain, dealerId } = body

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

        try {
            const records = await resolveMxRecords(storedDomainName)

            return NextResponse.json({
                success: true,
                hasMx: records.length > 0,
                records,
                message: records.length > 0
                    ? 'MX records found. Keep these records while connecting your website domain.'
                    : 'No MX records found. You can add Google Workspace, Zoho, or another email provider.',
            })
        } catch {
            return NextResponse.json({
                success: true,
                hasMx: false,
                records: [],
                message: 'No MX records found. If you already use email, check your registrar before changing DNS.',
            })
        }
    } catch (error) {
        console.error('Error in POST /api/domains/check-email-records:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

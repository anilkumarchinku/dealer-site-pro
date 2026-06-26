import { NextResponse } from 'next/server'
import { isValidDomain } from '@/lib/services/dns-verification-service'
import { recordDomainDeploymentOperation } from '@/lib/services/domain-deployment-operation-service'
import { requireAuth, requireDealerOwnership } from '@/lib/supabase-server'

function normalizeCustomDomain(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/.*$/, '')
}

export async function POST(request: Request) {
    try {
        const { user, supabase, errorResponse: authErr } = await requireAuth()
        if (authErr) return authErr

        const body = await request.json()
        const { dealerId, customDomain, siteSlug } = body
        const normalizedCustomDomain = typeof customDomain === 'string'
            ? normalizeCustomDomain(customDomain)
            : ''

        if (!dealerId || !normalizedCustomDomain) {
            return NextResponse.json(
                { success: false, error: 'Dealer ID and custom domain are required' },
                { status: 400 }
            )
        }

        const { errorResponse: ownerErr } = await requireDealerOwnership(supabase, user.id, dealerId)
        if (ownerErr) return ownerErr

        const validation = isValidDomain(normalizedCustomDomain)
        if (!validation.valid) {
            return NextResponse.json(
                { success: false, error: validation.error },
                { status: 400 }
            )
        }

        const { data: existingDomain } = await supabase
            .from('dealer_domains')
            .select('id, dealer_id, custom_domain, subdomain_url, subdomain, domain_type, status, ssl_status, is_primary, dns_verified, site_slug, created_at, updated_at')
            .eq('custom_domain', normalizedCustomDomain)
            .maybeSingle()

        if (existingDomain && existingDomain.dealer_id !== dealerId) {
            return NextResponse.json(
                { success: false, error: 'This domain is already connected to another dealer' },
                { status: 400 }
            )
        }

        if (existingDomain) {
            if (siteSlug && existingDomain.site_slug !== siteSlug) {
                await supabase
                    .from('dealer_domains')
                    .update({ site_slug: siteSlug })
                    .eq('id', existingDomain.id)
                    .eq('dealer_id', dealerId)
            }

            return NextResponse.json({
                success: true,
                domain: { ...existingDomain, site_slug: siteSlug ?? existingDomain.site_slug },
            })
        }

        await recordDomainDeploymentOperation({
            dealerId,
            domain: normalizedCustomDomain,
            operation: 'custom_domain_connect',
            status: 'started',
            providerStep: 'database',
            details: { stage: 'payment_prepare', siteSlug: siteSlug ?? null },
        })

        const { data: newDomain, error } = await supabase
            .from('dealer_domains')
            .insert({
                dealer_id: dealerId,
                custom_domain: normalizedCustomDomain,
                domain_type: 'custom',
                status: 'pending',
                ssl_status: 'pending',
                is_primary: false,
                dns_verified: false,
                site_slug: siteSlug ?? null,
            })
            .select('id, dealer_id, custom_domain, subdomain_url, subdomain, domain_type, status, ssl_status, is_primary, dns_verified, site_slug, created_at, updated_at')
            .single()

        if (error) {
            console.error('[prepare-custom-domain] Failed to create domain row:', error)
            await recordDomainDeploymentOperation({
                dealerId,
                domain: normalizedCustomDomain,
                operation: 'custom_domain_connect',
                status: 'failed',
                providerStep: 'database',
                error,
            })

            return NextResponse.json(
                { success: false, error: 'Failed to prepare custom domain' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, domain: newDomain })
    } catch (error) {
        console.error('Error in POST /api/domains/prepare-custom:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

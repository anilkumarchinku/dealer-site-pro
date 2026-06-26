import { NextResponse } from 'next/server'
import { recordDomainDeploymentOperation } from '@/lib/services/domain-deployment-operation-service'
import { isValidDomain, verifyCustomDomain } from '@/lib/services/dns-verification-service'
import { requireActiveProDomainSubscription } from '@/lib/services/pro-domain-subscription-service'
import { registerDomainOnMainProject } from '@/lib/services/vercel-service'
import { requireAuth, requireDealerOwnership } from '@/lib/supabase-server'

// Correct DNS records for Vercel custom domains.
// A record on root (@) is required — CNAME on root is not supported by most registrars.
const DNS_INSTRUCTIONS = {
    records: [
        { type: 'A',     host: '@',   value: '76.76.21.21',          ttl: 3600 },
        { type: 'CNAME', host: 'www', value: 'cname.vercel-dns.com',  ttl: 3600 },
    ],
    note: 'Add an A record for the root domain (@) and a CNAME for www. Both are required.',
}

function normalizeCustomDomain(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/.*$/, '')
}

/**
 * POST /api/domains/connect-custom
 * Initiates custom domain connection (PRO tier)
 * Requires authentication — dealer ownership is verified server-side.
 */
export async function POST(request: Request) {
    try {
        // ── Auth: require signed-in user ──────────────────────────────────────
        const { user, supabase, errorResponse: authErr } = await requireAuth()
        if (authErr) return authErr

        const body = await request.json()
        const { dealerId, customDomain, templateId, siteSlug } = body
        const normalizedCustomDomain = typeof customDomain === 'string'
            ? normalizeCustomDomain(customDomain)
            : ''

        if (!dealerId || !normalizedCustomDomain) {
            return NextResponse.json(
                { success: false, error: 'Dealer ID and custom domain are required' },
                { status: 400 }
            )
        }

        // ── Ownership: verify user owns this dealer ───────────────────────────
        const { errorResponse: ownerErr } = await requireDealerOwnership(supabase, user.id, dealerId)
        if (ownerErr) return ownerErr

        await recordDomainDeploymentOperation({
            dealerId,
            domain: normalizedCustomDomain,
            operation: 'custom_domain_connect',
            status: 'started',
            providerStep: 'database',
            details: { templateId: templateId ?? null, siteSlug: siteSlug ?? null },
        })

        // Validate domain format
        const validation = isValidDomain(normalizedCustomDomain)
        if (!validation.valid) {
            return NextResponse.json(
                { success: false, error: validation.error },
                { status: 400 }
            )
        }

        // Check if domain already exists for a DIFFERENT dealer
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

        if (!existingDomain) {
            return NextResponse.json(
                {
                    success: false,
                    requiresPayment: true,
                    error: 'Start the ₹499/month PRO payment before connecting this custom domain.',
                },
                { status: 402 }
            )
        }

        const { error: subscriptionError } = await requireActiveProDomainSubscription(
            supabase,
            dealerId,
            existingDomain.id
        )

        if (subscriptionError) {
            return NextResponse.json(
                { success: false, requiresPayment: true, error: subscriptionError },
                { status: 402 }
            )
        }

        let vercelRegistered = false
        try {
            await registerDomainOnMainProject(normalizedCustomDomain)
            vercelRegistered = true
            await recordDomainDeploymentOperation({
                dealerId,
                domainId: existingDomain.id,
                domain: normalizedCustomDomain,
                operation: 'custom_domain_connect',
                status: 'provider_succeeded',
                providerStep: 'vercel',
                details: { target: 'main-project', idempotent: true },
            })
        } catch (vercelError) {
            console.error('Vercel domain registration failed (non-fatal):', vercelError)
            await recordDomainDeploymentOperation({
                dealerId,
                domainId: existingDomain.id,
                domain: normalizedCustomDomain,
                operation: 'custom_domain_connect',
                status: 'provider_failed',
                providerStep: 'vercel',
                error: vercelError,
            })
        }

        if (siteSlug && existingDomain.site_slug !== siteSlug) {
            await supabase
                .from('dealer_domains')
                .update({ site_slug: siteSlug })
                .eq('id', existingDomain.id)
                .eq('dealer_id', dealerId)
            existingDomain.site_slug = siteSlug
        }

        if (vercelRegistered) {
            try {
                const verification = await verifyCustomDomain(normalizedCustomDomain)
                if (verification.allVerified) {
                    await supabase
                        .from('dealer_domains')
                        .update({
                            status: 'active',
                            ssl_status: 'provisioning',
                            dns_verified: true,
                            dns_verified_at: new Date().toISOString(),
                            last_checked_at: new Date().toISOString(),
                        })
                        .eq('id', existingDomain.id)
                        .eq('dealer_id', dealerId)

                    existingDomain.status = 'active'
                    existingDomain.ssl_status = 'provisioning'
                }
            } catch {
                // DNS can still be pending; the dashboard verify button handles retries.
            }
        }

        await recordDomainDeploymentOperation({
            dealerId,
            domainId: existingDomain.id,
            domain: normalizedCustomDomain,
            operation: 'custom_domain_connect',
            status: existingDomain.status === 'active' ? 'completed' : 'provider_pending',
            providerStep: existingDomain.status === 'active' ? 'dns' : 'dns',
            details: { idempotent: true, vercelRegistered },
        })
        return NextResponse.json({
            success: true,
            domain: existingDomain,
            dns: DNS_INSTRUCTIONS,
            vercelRegistered,
        })
    } catch (error) {
        console.error('Error in POST /api/domains/connect-custom:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

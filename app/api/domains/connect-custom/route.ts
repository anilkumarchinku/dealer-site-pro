import { NextResponse } from 'next/server'
import { recordDomainDeploymentOperation } from '@/lib/services/domain-deployment-operation-service'
import { isValidDomain, verifyCustomDomain } from '@/lib/services/dns-verification-service'
import { addDomainToProject, registerDomainOnMainProject } from '@/lib/services/vercel-service'
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
            .select('id, dealer_id')
            .eq('custom_domain', normalizedCustomDomain)
            .single()

        if (existingDomain && existingDomain.dealer_id !== dealerId) {
            return NextResponse.json(
                { success: false, error: 'This domain is already connected to another dealer' },
                { status: 400 }
            )
        }

        // If domain already belongs to this dealer, return success (idempotent)
        if (existingDomain && existingDomain.dealer_id === dealerId) {
            await recordDomainDeploymentOperation({
                dealerId,
                domainId: existingDomain.id,
                domain: normalizedCustomDomain,
                operation: 'custom_domain_connect',
                status: 'completed',
                providerStep: 'database',
                details: { idempotent: true },
            })
            return NextResponse.json({
                success: true,
                domain: existingDomain,
                dns: DNS_INSTRUCTIONS,
                vercelRegistered: false,
            })
        }

        // Create domain record with pending status
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
            .select()
            .single()

        if (error) {
            console.error('Error creating custom domain:', error)
            await recordDomainDeploymentOperation({
                dealerId,
                domain: normalizedCustomDomain,
                operation: 'custom_domain_connect',
                status: 'failed',
                providerStep: 'database',
                error,
            })

            // Provide more specific error messages
            let errorMessage = 'Failed to initiate domain connection'

            if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
                errorMessage = 'Database table not found. Please run database migrations.'
            } else if (error.message?.includes('permission') || error.message?.includes('policy')) {
                errorMessage = 'Database permission denied. Please check RLS policies.'
            } else if (error.message?.includes('unique')) {
                errorMessage = 'This domain is already registered.'
            } else if (error.code === 'PGRST116') {
                errorMessage = 'Database connection failed. Please check your Supabase configuration.'
            }

            return NextResponse.json(
                {
                    success: false,
                    error: errorMessage,
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined
                },
                { status: 500 }
            )
        }

        // ── Fetch dealer type to decide which Vercel project to register on ──
        const { data: dealerInfo } = await supabase
            .from('dealers')
            .select('sells_new_cars, sells_used_cars, slug')
            .eq('id', dealerId)
            .single()

        // 1st hand (new cars only) → main multi-tenant project
        // 2nd hand / hybrid        → their individual Vercel project
        const isFirstHand = dealerInfo?.sells_new_cars === true && dealerInfo?.sells_used_cars === false

        // Attempt to register domain on the appropriate Vercel project.
        // Errors here are non-fatal — domain is already saved in DB.
        let vercelRegistered = false
        try {
            if (isFirstHand) {
                await registerDomainOnMainProject(normalizedCustomDomain)
            } else {
                const slug = dealerInfo?.slug
                if (!slug) throw new Error('Dealer slug not found')
                await addDomainToProject(slug, normalizedCustomDomain)
            }
            vercelRegistered = true
            await recordDomainDeploymentOperation({
                dealerId,
                domainId: newDomain?.id,
                domain: normalizedCustomDomain,
                operation: 'custom_domain_connect',
                status: 'provider_succeeded',
                providerStep: 'vercel',
                details: { target: isFirstHand ? 'main-project' : 'dealer-project' },
            })
        } catch (vercelError) {
            console.error('Vercel domain registration failed (non-fatal):', vercelError)
            await recordDomainDeploymentOperation({
                dealerId,
                domainId: newDomain?.id,
                domain: normalizedCustomDomain,
                operation: 'custom_domain_connect',
                status: 'provider_failed',
                providerStep: 'vercel',
                error: vercelError,
            })
        }

        // Auto-verify DNS immediately — if the dealer had DNS already pointing to us
        // (e.g. set up before connecting), we activate the domain right away instead of
        // leaving it stuck in 'pending' indefinitely.
        if (vercelRegistered && newDomain) {
            try {
                const verification = await verifyCustomDomain(normalizedCustomDomain)
                if (verification.allVerified) {
                    await supabase
                        .from('dealer_domains')
                        .update({
                            status: 'active',
                            dns_verified: true,
                            dns_verified_at: new Date().toISOString(),
                            last_checked_at: new Date().toISOString(),
                        })
                        .eq('id', newDomain.id)
                    newDomain.status = 'active'
                    await recordDomainDeploymentOperation({
                        dealerId,
                        domainId: newDomain.id,
                        domain: normalizedCustomDomain,
                        operation: 'custom_domain_connect',
                        status: 'completed',
                        providerStep: 'dns',
                        details: { dnsVerified: true },
                    })
                }
            } catch {
                // Non-fatal — DNS hasn't propagated yet. User can verify later.
            }
        }

        if (!vercelRegistered || newDomain?.status !== 'active') {
            await recordDomainDeploymentOperation({
                dealerId,
                domainId: newDomain?.id,
                domain: normalizedCustomDomain,
                operation: 'custom_domain_connect',
                status: 'provider_pending',
                providerStep: vercelRegistered ? 'dns' : 'vercel',
                details: { vercelRegistered, domainStatus: newDomain?.status ?? null },
            })
        }

        return NextResponse.json({
            success: true,
            domain: newDomain,
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

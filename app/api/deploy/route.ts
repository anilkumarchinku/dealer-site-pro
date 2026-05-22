/**
 * POST /api/deploy
 * Orchestrates the full dealer site deployment pipeline:
 *   1. Load dealer data from Supabase
 *   2. Generate dealer.config.ts
 *   3. GitHub: create repo from template (if not exists)
 *   4. GitHub: push dealer.config.ts
 *   5. Vercel: create project linked to that repo (if not exists)
 *   6. Vercel: set env vars
 *   7. Vercel: trigger deployment
 *   8. Save deployment record in Supabase
 */

import { NextResponse } from 'next/server'
import { recordDomainDeploymentOperation } from '@/lib/services/domain-deployment-operation-service'
import { requireAuth, requireDealerOwnership } from '@/lib/supabase-server'
import { dealerSiteHref } from '@/lib/utils/domain'

export async function POST(request: Request) {
    try {
        // ── Auth: require signed-in user ──────────────────────────────────────
        const { user, supabase, errorResponse: authErr } = await requireAuth()
        if (authErr) return authErr

        const { dealerId } = await request.json()
        if (!dealerId) {
            return NextResponse.json({ error: 'dealerId is required' }, { status: 400 })
        }

        // ── Ownership: verify user owns this dealer ───────────────────────────
        const { errorResponse: ownerErr } = await requireDealerOwnership(supabase, user.id, dealerId)
        if (ownerErr) return ownerErr

        await recordDomainDeploymentOperation({
            dealerId,
            operation: 'multi_tenant_deploy',
            status: 'started',
            providerStep: 'deployment',
        })

        // ── 1. Load dealer data ───────────────────────────────────────────────
        const { data: dealer, error: dealerErr } = await supabase
            .from('dealers')
            .select(`
                id, dealership_name, tagline, phone, whatsapp, email,
                location, full_address, map_link, slug, style_template,
                sells_new_cars, sells_used_cars, gstin
            `)
            .eq('id', dealerId)
            .eq('user_id', user.id)   // explicit filter — don't rely solely on RLS
            .single()

        if (dealerErr || !dealer) {
            const msg = dealerErr?.message ?? 'no data returned'
            console.error(`Deploy: dealer query failed for id=${dealerId} user=${user.id}: ${msg}`)
            return NextResponse.json({ error: `Dealer not found: ${msg}` }, { status: 404 })
        }

        // Load services and template config in parallel (reserved for future use)
        await Promise.all([
            supabase.from('dealer_services').select('service_name').eq('dealer_id', dealerId).eq('is_active', true),
            supabase.from('dealer_template_configs')
                .select('hero_title, hero_subtitle, hero_cta_text, working_hours, facebook_url, instagram_url, youtube_url')
                .eq('dealer_id', dealerId)
                .single(),
        ])


        const dealerSlug = dealer.slug
        if (!dealerSlug) {
            return NextResponse.json({ error: 'Dealer slug is not set' }, { status: 400 })
        }

        // ── Deployment mode: ALL dealers use multi-tenant platform ──────────────
        // No standalone GitHub/Vercel repos — both new and used car dealers are
        // served from this shared Next.js app at /sites/[slug].
        const siteUrl = dealerSiteHref(dealerSlug)

        await recordDomainDeploymentOperation({
            dealerId,
            domain: siteUrl,
            operation: 'multi_tenant_deploy',
            status: 'completed',
            providerStep: 'deployment',
            details: { deploymentMode: 'multi-tenant', siteUrl },
        })

        return NextResponse.json({
            success: true,
            deploymentMode: 'multi-tenant',
            siteUrl,
            message: 'Your site is live on our shared platform. No separate deployment needed.',
        })
    } catch (error) {
        console.error('Deploy pipeline error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Deployment failed' },
            { status: 500 }
        )
    }
}

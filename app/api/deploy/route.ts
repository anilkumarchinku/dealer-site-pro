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

import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { generateDealerConfig } from '@/lib/services/code-generator'
import {
    createRepoFromTemplate,
    getRepo,
    pushDealerConfig,
    syncDirectory,
    upsertFile,
} from '@/lib/services/github-service'
import {
    createVercelProject,
    setProjectEnvVars,
    triggerDeployment,
} from '@/lib/services/vercel-service'
import { requireAuth, requireDealerOwnership } from '@/lib/supabase-server'

/** Validate that required env vars are present and not placeholder values */
function checkEnvVars(): string | null {
    const required: Record<string, string | undefined> = {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN,
        GITHUB_ORG: process.env.GITHUB_ORG,
        GITHUB_TEMPLATE_REPO: process.env.GITHUB_TEMPLATE_REPO,
        VERCEL_TOKEN: process.env.VERCEL_TOKEN,
    }
    for (const [key, val] of Object.entries(required)) {
        if (!val) return `${key} env var is not set`
        if (val.startsWith('REVOKED') || val.includes('xxxxx') || val === 'your_' + key.toLowerCase() + '_here') {
            return `${key} is a placeholder value — please set a real token in .env`
        }
    }
    return null
}

export async function POST(request: Request) {
    try {
        // ── Env vars: fail fast if tokens are missing or placeholders ─────────
        const envError = checkEnvVars()
        if (envError) {
            return NextResponse.json({ error: envError }, { status: 500 })
        }

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

        // Load brands, services, template config in parallel
        const [brandsRes, servicesRes, configRes] = await Promise.all([
            supabase.from('dealer_brands').select('brand_name').eq('dealer_id', dealerId),
            supabase.from('dealer_services').select('service_name').eq('dealer_id', dealerId).eq('is_active', true),
            supabase.from('dealer_template_configs')
                .select('hero_title, hero_subtitle, hero_cta_text, working_hours, facebook_url, instagram_url, youtube_url')
                .eq('dealer_id', dealerId)
                .single(),
        ])

        const brands = brandsRes.data?.map(b => b.brand_name) ?? []
        const services = servicesRes.data?.map(s => s.service_name) ?? []
        const tc = configRes.data

        const dealerSlug = dealer.slug
        if (!dealerSlug) {
            return NextResponse.json({ error: 'Dealer slug is not set' }, { status: 400 })
        }

        // ── Deployment mode: ALL dealers use multi-tenant platform ──────────────
        // No standalone GitHub/Vercel repos — both new and used car dealers are
        // served from this shared Next.js app at /sites/[slug].
        const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'dealersitepro.com'
        const useSubdomain = process.env.NEXT_PUBLIC_USE_SUBDOMAIN === 'true'
        const siteUrl = useSubdomain
            ? `https://${dealerSlug}.${baseDomain}`
            : `https://${baseDomain}/sites/${dealerSlug}`

        return NextResponse.json({
            success: true,
            deploymentMode: 'multi-tenant',
            siteUrl,
            message: 'Your site is live on our shared platform. No separate deployment needed.',
        })

        // ── 2. Generate dealer.config.ts content ─────────────────────────────
        const configContent = generateDealerConfig({
            dealershipName: dealer.dealership_name,
            tagline: dealer.tagline,
            phone: dealer.phone,
            whatsapp: dealer.whatsapp,
            email: dealer.email,
            location: dealer.location,
            fullAddress: dealer.full_address,
            mapLink: dealer.map_link,
            gstin: dealer.gstin,
            slug: dealerSlug,
            styleTemplate: dealer.style_template ?? 'family',
            sellsNewCars: dealer.sells_new_cars ?? false,
            sellsUsedCars: dealer.sells_used_cars ?? false,
            brands,
            services,
            heroTitle: tc?.hero_title,
            heroSubtitle: tc?.hero_subtitle,
            heroCtaText: tc?.hero_cta_text,
            workingHours: tc?.working_hours,
            facebook: tc?.facebook_url,
            instagram: tc?.instagram_url,
            youtube: tc?.youtube_url,
        })

        // ── 3. GitHub: create repo from template (skip if already exists) ────
        let repo = await getRepo(dealerSlug)
        if (!repo) {
            repo = await createRepoFromTemplate(dealerSlug)
            // Wait a moment for the repo to be fully initialised after creation
            await new Promise(r => setTimeout(r, 3000))
        }

        // ── 4. GitHub: Sync FULL code from dealer-custom-site-dist ────────────
        try {
            const distPath = path.join(process.cwd(), 'dealer-custom-site-dist')
            await syncDirectory(dealerSlug, distPath)
        } catch (syncErr) {
            console.error('Failed to sync directory:', syncErr)
            throw new Error(`Code sync failed: ${syncErr}`)
        }

        // ── 4b. GitHub: push dealer.config.ts (must be after sync) ─────────────
        // (syncDirectory ignores dealer.config.ts to prevent overwriting with template default)
        await pushDealerConfig(dealerSlug, configContent)

        // ── 5. Vercel: create project linked to the GitHub repo ───────────────
        const vercelProject = await createVercelProject(dealerSlug, repo.full_name)

        // ── 6. Vercel: set Supabase env vars on the project ───────────────────
        await setProjectEnvVars(dealerSlug, {
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
            NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
            NEXT_PUBLIC_DEALER_SLUG: dealerSlug,
        })

        // ── 7. Vercel: trigger a deployment ───────────────────────────────────
        const deployment = await triggerDeployment(dealerSlug)

        // ── 8. Save deployment record in Supabase ─────────────────────────────
        const siteUrl = `https://dealer-${dealerSlug}.vercel.app`
        const buildId = deployment.id ?? deployment.uid

        // Get next version number for this dealer
        const { data: lastDeploy } = await supabase
            .from('dealer_deployments')
            .select('version_number')
            .eq('dealer_id', dealerId)
            .order('version_number', { ascending: false })
            .limit(1)
            .maybeSingle()
        const versionNumber = (lastDeploy?.version_number ?? 0) + 1

        // INSERT a new record — every deploy is a separate commit-like entry
        const { data: record, error: insertErr } = await supabase
            .from('dealer_deployments')
            .insert({
                dealer_id: dealerId,
                github_repo: repo.full_name,
                vercel_project: vercelProject.id,
                vercel_deploy_id: buildId,
                domain: `dealer-${dealerSlug}.vercel.app`,
                status: 'building',
                site_url: siteUrl,
                version_number: versionNumber,
                commit_message: `Deploy v${versionNumber}`,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single()

        if (insertErr) {
            console.error('Failed to save deployment record:', insertErr)
        }

        return NextResponse.json({
            success: true,
            deployId: record?.id ?? null,
            buildId,
            siteUrl,
            githubRepo: repo.html_url,
            vercelUrl: `https://vercel.com/${process.env.GITHUB_ORG}/dealer-${dealerSlug}`,
        })
    } catch (error) {
        console.error('Deploy pipeline error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Deployment failed' },
            { status: 500 }
        )
    }
}

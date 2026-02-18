/**
 * GET /api/domains/resolve?domain=bharat-hyundai.com
 *
 * Looks up which dealer slug maps to the given custom domain.
 * Used by middleware to route custom domain traffic to /sites/[slug].
 *
 * Response 200: { slug: string, dealerId: string }
 * Response 404: { error: 'Domain not found' }
 */

import { NextResponse }  from 'next/server'
import { createClient }  from '@supabase/supabase-js'

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    return createClient(url, key)
}

export const runtime = 'edge'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')?.toLowerCase().trim()

    if (!domain) {
        return NextResponse.json({ error: 'domain param required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Look up by custom_domain in dealer_domains table
    const { data, error } = await supabase
        .from('dealer_domains')
        .select('dealer_id, subdomain, custom_domain, status, dealers(slug, id)')
        .or(`custom_domain.eq.${domain},subdomain_url.eq.${domain}`)
        .eq('status', 'active')
        .limit(1)
        .single()

    if (error || !data) {
        // Try a broader search — also check dealers.slug directly
        const { data: dealer } = await supabase
            .from('dealers')
            .select('id, slug')
            .eq('slug', domain.replace(/\..+$/, '')) // strip TLD as fallback
            .eq('onboarding_complete', true)
            .single()

        if (dealer) {
            return NextResponse.json(
                { slug: dealer.slug, dealerId: dealer.id },
                { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=30' } }
            )
        }

        return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
    }

    const dealer = Array.isArray(data.dealers) ? data.dealers[0] : data.dealers
    if (!dealer) {
        return NextResponse.json({ error: 'Dealer not found' }, { status: 404 })
    }

    return NextResponse.json(
        { slug: dealer.slug, dealerId: dealer.id },
        { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=30' } }
    )
}

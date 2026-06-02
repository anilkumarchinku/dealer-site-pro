import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, getDealerForUser, requireAuth } from '@/lib/supabase-server'
import { logger } from '@/lib/utils/logger'

function getSupabase() {
    // New service module tables may not be present in generated local DB types yet.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createAdminClient() as any
}

function text(value: unknown, max = 500) {
    return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function nullableText(value: unknown, max = 500) {
    const next = text(value, max)
    return next || null
}

function imageUrls(value: unknown) {
    return Array.isArray(value)
        ? value.map(url => text(url, 2000)).filter(Boolean).slice(0, 10)
        : []
}

export async function GET(request: NextRequest) {
    const dealerId = request.nextUrl.searchParams.get('dealer_id')
    const admin = request.nextUrl.searchParams.get('admin') === 'true'
    const supabase = getSupabase()

    let effectiveDealerId = dealerId
    if (admin || !effectiveDealerId) {
        const { user, supabase: routeSupabase, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse
        const dealer = await getDealerForUser(routeSupabase, user.id)
        if (!dealer) return NextResponse.json({ error: 'Dealer account not found' }, { status: 404 })
        effectiveDealerId = dealer.id
    }

    const [centersResult, tiersResult] = await Promise.all([
        supabase
            .from('service_centers')
            .select('*')
            .eq('dealer_id', effectiveDealerId)
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false }),
        supabase
            .from('service_pricing_tiers')
            .select('*')
            .eq('dealer_id', effectiveDealerId)
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false }),
    ])

    if (centersResult.error || tiersResult.error) {
        logger.error('Service centers fetch error:', centersResult.error ?? tiersResult.error)
        return NextResponse.json({ error: 'Failed to fetch service centers' }, { status: 500 })
    }

    const centers = admin
        ? centersResult.data ?? []
        : (centersResult.data ?? []).filter((center: { is_active: boolean }) => center.is_active)
    const tiers = admin
        ? tiersResult.data ?? []
        : (tiersResult.data ?? []).filter((tier: { is_active: boolean }) => tier.is_active)

    return NextResponse.json({ centers, tiers })
}

export async function POST(request: NextRequest) {
    const { user, supabase: routeSupabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse
    const dealer = await getDealerForUser(routeSupabase, user.id)
    if (!dealer) return NextResponse.json({ error: 'Dealer account not found' }, { status: 404 })

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    const type = body.type === 'tier' ? 'tier' : 'center'
    const supabase = getSupabase()

    if (type === 'tier') {
        const name = text(body.name, 120)
        if (!name) return NextResponse.json({ error: 'Service package name is required' }, { status: 400 })
        const { data, error } = await supabase
            .from('service_pricing_tiers')
            .insert({
                dealer_id: dealer.id,
                service_center_id: body.service_center_id || null,
                name,
                description: nullableText(body.description, 1000),
                price_paise: Math.max(0, Math.round(Number(body.price_inr ?? 0) * 100)),
                duration: nullableText(body.duration, 80),
                is_active: body.is_active !== false,
                display_order: Number.isInteger(body.display_order) ? body.display_order : 0,
            })
            .select('*')
            .single()
        if (error) {
            logger.error('Service tier create error:', error)
            return NextResponse.json({ error: 'Failed to save service package' }, { status: 500 })
        }
        return NextResponse.json({ tier: data })
    }

    const name = text(body.name, 120)
    const address = text(body.address, 500)
    if (!name || !address) return NextResponse.json({ error: 'Center name and address are required' }, { status: 400 })
    const { data, error } = await supabase
        .from('service_centers')
        .insert({
            dealer_id: dealer.id,
            name,
            address,
            city: nullableText(body.city, 100),
            phone: nullableText(body.phone, 30),
            maps_url: nullableText(body.maps_url, 2000),
            referral_url: nullableText(body.referral_url, 2000),
            working_hours: nullableText(body.working_hours, 150),
            description: nullableText(body.description, 1000),
            image_urls: imageUrls(body.image_urls),
            is_active: body.is_active !== false,
            display_order: Number.isInteger(body.display_order) ? body.display_order : 0,
        })
        .select('*')
        .single()
    if (error) {
        logger.error('Service center create error:', error)
        return NextResponse.json({ error: 'Failed to save service center' }, { status: 500 })
    }
    return NextResponse.json({ center: data })
}

export async function PATCH(request: NextRequest) {
    const { user, supabase: routeSupabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse
    const dealer = await getDealerForUser(routeSupabase, user.id)
    if (!dealer) return NextResponse.json({ error: 'Dealer account not found' }, { status: 404 })

    const body = await request.json().catch(() => null)
    if (!body?.id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
    const type = body.type === 'tier' ? 'tier' : 'center'
    const supabase = getSupabase()

    if (type === 'tier') {
        const { error } = await supabase
            .from('service_pricing_tiers')
            .update({
                service_center_id: body.service_center_id || null,
                name: text(body.name, 120),
                description: nullableText(body.description, 1000),
                price_paise: Math.max(0, Math.round(Number(body.price_inr ?? 0) * 100)),
                duration: nullableText(body.duration, 80),
                is_active: body.is_active !== false,
                display_order: Number.isInteger(body.display_order) ? body.display_order : 0,
            })
            .eq('id', body.id)
            .eq('dealer_id', dealer.id)
        if (error) return NextResponse.json({ error: 'Failed to update service package' }, { status: 500 })
        return NextResponse.json({ success: true })
    }

    const { error } = await supabase
        .from('service_centers')
        .update({
            name: text(body.name, 120),
            address: text(body.address, 500),
            city: nullableText(body.city, 100),
            phone: nullableText(body.phone, 30),
            maps_url: nullableText(body.maps_url, 2000),
            referral_url: nullableText(body.referral_url, 2000),
            working_hours: nullableText(body.working_hours, 150),
            description: nullableText(body.description, 1000),
            image_urls: imageUrls(body.image_urls),
            is_active: body.is_active !== false,
            display_order: Number.isInteger(body.display_order) ? body.display_order : 0,
        })
        .eq('id', body.id)
        .eq('dealer_id', dealer.id)
    if (error) return NextResponse.json({ error: 'Failed to update service center' }, { status: 500 })
    return NextResponse.json({ success: true })
}

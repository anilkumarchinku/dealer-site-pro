import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, requireAuth } from '@/lib/supabase-server'

function getServiceSupabase() {
    return createAdminClient()
}

function cleanText(value: unknown, maxLength: number): string | null {
    if (typeof value !== 'string') return null
    const trimmed = value.trim()
    if (!trimmed) return null
    return trimmed.slice(0, maxLength)
}

function cleanSiteSlug(value: unknown): string | null {
    const slug = cleanText(value, 160)
    if (!slug) return null
    return /^[a-z0-9][a-z0-9/-]*(?:-[a-z0-9]+)?$/i.test(slug) ? slug : null
}

async function getDealerIdForUser(userId: string): Promise<string | null> {
    const supabase = getServiceSupabase()
    const { data } = await supabase
        .from('dealers')
        .select('id')
        .eq('user_id', userId)
        .single()

    return data?.id ?? null
}

export async function GET(request: NextRequest) {
    const dealerId = request.nextUrl.searchParams.get('dealer_id')
    if (!dealerId) return NextResponse.json({ error: 'dealer_id required' }, { status: 400 })

    const siteSlug = cleanSiteSlug(request.nextUrl.searchParams.get('site_slug'))
    const supabase = getServiceSupabase()

    let query = supabase
        .from('dealer_site_banners')
        .select('id, title, site_slug, desktop_image_url, mobile_image_url, sort_order, created_at')
        .eq('dealer_id', dealerId)
        .eq('is_active', true)

    if (siteSlug) {
        query = query.or(`site_slug.is.null,site_slug.eq.${siteSlug}`)
    }

    const { data, error } = await query
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ banners: [] })
    return NextResponse.json({ banners: data ?? [] })
}

export async function POST(request: NextRequest) {
    const { user, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

    const title = cleanText(body.title, 120)
    const siteSlug = cleanSiteSlug(body.site_slug)
    const desktopImageUrl = cleanText(body.desktop_image_url, 1000)
    const mobileImageUrl = cleanText(body.mobile_image_url, 1000)
    const sortOrder = Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0

    if (!siteSlug) return NextResponse.json({ error: 'site_slug is required' }, { status: 400 })
    if (!desktopImageUrl) return NextResponse.json({ error: 'desktop_image_url is required' }, { status: 400 })

    const dealerId = await getDealerIdForUser(user.id)
    if (!dealerId) return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })

    const supabase = getServiceSupabase()
    const { data, error } = await supabase
        .from('dealer_site_banners')
        .insert({
            dealer_id: dealerId,
            title,
            site_slug: siteSlug,
            desktop_image_url: desktopImageUrl,
            mobile_image_url: mobileImageUrl,
            sort_order: sortOrder,
        })
        .select('id, title, site_slug, desktop_image_url, mobile_image_url, sort_order, created_at')
        .single()

    if (error) return NextResponse.json({ error: 'Failed to save banner' }, { status: 500 })
    return NextResponse.json({ success: true, banner: data })
}

export async function DELETE(request: NextRequest) {
    const { user, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const id = request.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const dealerId = await getDealerIdForUser(user.id)
    if (!dealerId) return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })

    const supabase = getServiceSupabase()
    const { error } = await supabase
        .from('dealer_site_banners')
        .update({ is_active: false })
        .eq('id', id)
        .eq('dealer_id', dealerId)

    if (error) return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 })
    return NextResponse.json({ success: true })
}

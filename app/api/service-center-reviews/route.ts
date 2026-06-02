import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, getDealerForUser, requireAuth } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { logger } from '@/lib/utils/logger'

function getSupabase() {
    // New service_center_reviews table may not be in generated types yet.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createAdminClient() as any
}

export async function GET(request: NextRequest) {
    const centerId = request.nextUrl.searchParams.get('service_center_id')
    const admin = request.nextUrl.searchParams.get('admin') === 'true'
    const supabase = getSupabase()

    if (admin) {
        const { user, supabase: routeSupabase, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse
        const dealer = await getDealerForUser(routeSupabase, user.id)
        if (!dealer) return NextResponse.json({ error: 'Dealer account not found' }, { status: 404 })
        const { data, error } = await supabase
            .from('service_center_reviews')
            .select('*, service_centers(name)')
            .eq('dealer_id', dealer.id)
            .order('created_at', { ascending: false })
        if (error) return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
        return NextResponse.json({ reviews: data ?? [] })
    }

    if (!centerId) return NextResponse.json({ error: 'service_center_id required' }, { status: 400 })
    const { data, error } = await supabase
        .from('service_center_reviews')
        .select('*')
        .eq('service_center_id', centerId)
        .eq('is_approved', true)
        .eq('moderation_status', 'approved')
        .eq('show_on_homepage', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(20)
    if (error) return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    return NextResponse.json({ reviews: data ?? [] })
}

export async function POST(request: NextRequest) {
    const rateLimit = await rateLimitOrNull('service_center_reviews', request, 5, 24 * 60 * 60 * 1000)
    if (rateLimit) return rateLimit

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    const serviceCenterId = typeof body.service_center_id === 'string' ? body.service_center_id : ''
    const reviewerName = typeof body.reviewer_name === 'string' ? body.reviewer_name.trim().slice(0, 80) : ''
    const rating = Number(body.rating)
    const reviewText = typeof body.review_text === 'string' ? body.review_text.trim().slice(0, 500) : null
    if (!serviceCenterId || !reviewerName || !Number.isInteger(rating) || rating < 1 || rating > 5) {
        return NextResponse.json({ error: 'Service center, name, and 1-5 rating are required' }, { status: 400 })
    }

    const supabase = getSupabase()
    const { data: center, error: centerError } = await supabase
        .from('service_centers')
        .select('id, dealer_id')
        .eq('id', serviceCenterId)
        .eq('is_active', true)
        .maybeSingle()
    if (centerError || !center) return NextResponse.json({ error: 'Invalid service center' }, { status: 400 })

    const { error } = await supabase
        .from('service_center_reviews')
        .insert({
            dealer_id: center.dealer_id,
            service_center_id: serviceCenterId,
            reviewer_name: reviewerName,
            rating,
            review_text: reviewText || null,
        })
    if (error) {
        logger.error('Service center review insert error:', error)
        return NextResponse.json({ error: 'Failed to save review' }, { status: 500 })
    }
    return NextResponse.json({ success: true, message: 'Thank you. Your feedback will appear after admin approval.' })
}

export async function PATCH(request: NextRequest) {
    const { user, supabase: routeSupabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse
    const dealer = await getDealerForUser(routeSupabase, user.id)
    if (!dealer) return NextResponse.json({ error: 'Dealer account not found' }, { status: 404 })

    const body = await request.json().catch(() => null)
    if (!body?.id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
    const action = body.action
    if (!['approve', 'reject', 'flag', 'curate'].includes(action)) {
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (action === 'approve') {
        updatePayload.is_approved = true
        updatePayload.moderation_status = 'approved'
        updatePayload.show_on_homepage = true
    } else if (action === 'reject' || action === 'flag') {
        updatePayload.is_approved = false
        updatePayload.moderation_status = action === 'reject' ? 'rejected' : 'flagged'
        updatePayload.show_on_homepage = false
    } else {
        if (typeof body.show_on_homepage === 'boolean') updatePayload.show_on_homepage = body.show_on_homepage
        if (Number.isInteger(body.display_order)) updatePayload.display_order = Math.max(0, body.display_order)
    }

    const supabase = getSupabase()
    const { error } = await supabase
        .from('service_center_reviews')
        .update(updatePayload)
        .eq('id', body.id)
        .eq('dealer_id', dealer.id)
    if (error) return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
    return NextResponse.json({ success: true })
}

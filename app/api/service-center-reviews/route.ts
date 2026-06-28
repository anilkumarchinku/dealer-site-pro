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

// ── Verify the reviewer has interacted with this dealer ──────────────────────
async function isVerifiedCustomer(
    supabase: ReturnType<typeof getSupabase>,
    dealerId: string,
    email?: string,
    phone?: string,
): Promise<boolean> {
    const normalizedEmail = email?.trim().toLowerCase()
    const phoneDigits = phone?.replace(/\D/g, '') ?? ''
    const normalizedPhone = phoneDigits.length > 10 ? phoneDigits.slice(-10) : phoneDigits

    if (!normalizedEmail && !normalizedPhone) return false

    function orFilter(emailCol: string, phoneCol: string) {
        const clauses: string[] = []
        if (normalizedEmail) clauses.push(`${emailCol}.ilike.${normalizedEmail}`)
        if (normalizedPhone.length === 10) clauses.push(`${phoneCol}.ilike.%${normalizedPhone}%`)
        return clauses.join(',')
    }

    // Check car_service_bookings (most relevant for service reviews)
    const serviceFilter = orFilter('email', 'phone')
    if (serviceFilter) {
        const { count } = await supabase
            .from('car_service_bookings')
            .select('id', { count: 'exact', head: true })
            .eq('dealer_id', dealerId)
            .or(serviceFilter)
        if (count && count > 0) return true
    }

    // Check leads
    const leadsFilter = orFilter('customer_email', 'customer_phone')
    if (leadsFilter) {
        const { count } = await supabase
            .from('leads')
            .select('id', { count: 'exact', head: true })
            .eq('dealer_id', dealerId)
            .or(leadsFilter)
        if (count && count > 0) return true
    }

    // Check test_drive_bookings
    if (leadsFilter) {
        const { count } = await supabase
            .from('test_drive_bookings')
            .select('id', { count: 'exact', head: true })
            .eq('dealer_id', dealerId)
            .or(leadsFilter)
        if (count && count > 0) return true
    }

    // Check sell_requests
    const sellFilter = orFilter('seller_email', 'seller_phone')
    if (sellFilter) {
        const { count } = await supabase
            .from('sell_requests')
            .select('id', { count: 'exact', head: true })
            .or(`dealer_id.eq.${dealerId},dealer_id.is.null`)
            .or(sellFilter)
        if (count && count > 0) return true
    }

    return false
}

export async function POST(request: NextRequest) {
    const rateLimit = await rateLimitOrNull('service_center_reviews', request, 5, 24 * 60 * 60 * 1000)
    if (rateLimit) return rateLimit

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    const serviceCenterId = typeof body.service_center_id === 'string' ? body.service_center_id : ''
    const reviewerName = typeof body.reviewer_name === 'string' ? body.reviewer_name.trim().slice(0, 80) : ''
    const reviewerEmail = typeof body.reviewer_email === 'string' ? body.reviewer_email.trim().toLowerCase() : ''
    const reviewerPhone = typeof body.reviewer_phone === 'string' ? body.reviewer_phone.trim() : ''
    const rating = Number(body.rating)
    const reviewText = typeof body.review_text === 'string' ? body.review_text.trim().slice(0, 500) : null
    if (!serviceCenterId || !reviewerName || !Number.isInteger(rating) || rating < 1 || rating > 5) {
        return NextResponse.json({ error: 'Service center, name, and 1-5 rating are required' }, { status: 400 })
    }
    if (!reviewerEmail && !reviewerPhone) {
        return NextResponse.json({ error: 'Email or phone is required to verify your identity' }, { status: 400 })
    }

    const supabase = getSupabase()
    const { data: center, error: centerError } = await supabase
        .from('service_centers')
        .select('id, dealer_id')
        .eq('id', serviceCenterId)
        .eq('is_active', true)
        .maybeSingle()
    if (centerError || !center) return NextResponse.json({ error: 'Invalid service center' }, { status: 400 })

    // Verify the reviewer has interacted with this dealer
    const verified = await isVerifiedCustomer(supabase, center.dealer_id, reviewerEmail, reviewerPhone)
    if (!verified) {
        return NextResponse.json(
            { error: 'Only customers who have interacted with this dealership can leave a review. Please use the email or phone you used during your enquiry, purchase, or service.' },
            { status: 403 }
        )
    }

    const { error } = await supabase
        .from('service_center_reviews')
        .insert({
            dealer_id: center.dealer_id,
            service_center_id: serviceCenterId,
            reviewer_name: reviewerName,
            reviewer_email: reviewerEmail || null,
            reviewer_phone: reviewerPhone || null,
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

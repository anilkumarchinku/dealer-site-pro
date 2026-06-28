/**
 * /api/reviews
 *
 * GET  ?dealer_id=xxx  — returns approved reviews for a dealer (public)
 * POST              — submits a new review (public, rate-limited)
 *
 * New reviews are saved with is_approved=false.
 * Dealers approve via the dashboard (future work).
 * For demo purposes, reviews auto-approve after 30 s (handled via DB trigger
 * or can be toggled via NEXT_PUBLIC_AUTO_APPROVE_REVIEWS=true env var).
 */

import { NextRequest, NextResponse } from 'next/server'
import { getOptionalEnv } from '@/lib/env'
import { createAdminClient, requireAuth, requireDealerOwnership } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { logger } from '@/lib/utils/logger'

function getSupabase() {
    // dealer_reviews moderation columns are added by a new migration; generated DB types may lag locally.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createAdminClient() as any
}

const REVIEW_STATUSES = ['pending', 'approved', 'rejected', 'flagged'] as const
type ReviewStatus = typeof REVIEW_STATUSES[number]

function isReviewStatus(value: string): value is ReviewStatus {
    return (REVIEW_STATUSES as readonly string[]).includes(value)
}

// ── GET: fetch approved reviews for a dealer ─────────────────────────────────
export async function GET(request: NextRequest) {
    const dealerId = request.nextUrl.searchParams.get('dealer_id')
    const status = request.nextUrl.searchParams.get('status')
    if (!dealerId) {
        return NextResponse.json({ error: 'dealer_id required' }, { status: 400 })
    }

    if (status) {
        if (status !== 'all' && !isReviewStatus(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
        }

        const { user, supabase: routeSupabase, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse

        const { errorResponse: ownerErr } = await requireDealerOwnership(routeSupabase, user.id, dealerId)
        if (ownerErr) return ownerErr

        const supabase = getSupabase()
        let query = supabase
            .from('dealer_reviews')
            .select('id, dealer_id, reviewer_name, reviewer_phone, rating, review_text, car_purchased, is_approved, show_on_homepage, display_order, moderation_status, admin_reply, replied_at, created_at, updated_at, source')
            .eq('dealer_id', dealerId)
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false })
            .limit(100)

        if (status !== 'all') {
            query = query.eq('moderation_status', status)
        }

        const { data, error } = await query
        if (error) {
            logger.error('Reviews moderation fetch error:', error)
            return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
        }

        return NextResponse.json({ reviews: data ?? [] })
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
        .from('dealer_reviews')
        .select('id, reviewer_name, rating, review_text, car_purchased, created_at, source, admin_reply, display_order')
        .eq('dealer_id', dealerId)
        .eq('is_approved', true)
        .eq('moderation_status', 'approved')
        .eq('show_on_homepage', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(20)

    if (error) {
        logger.error('Reviews fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }

    const reviews = data ?? []
    const avgRating = reviews.length
        ? Math.round((reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / reviews.length) * 10) / 10
        : 0

    return NextResponse.json({ reviews, avgRating, total: reviews.length })
}

// ── PATCH: approve a review (dealer dashboard) ───────────────────────────────
export async function PATCH(request: NextRequest) {
    const { user, supabase: routeSupabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

    const { review_id, dealer_id, action, admin_reply, show_on_homepage, display_order } = body
    if (!review_id || !dealer_id) {
        return NextResponse.json({ error: 'review_id and dealer_id required' }, { status: 400 })
    }
    if (!['approve', 'reject', 'flag', 'respond', 'curate'].includes(action)) {
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const { errorResponse: ownerErr } = await requireDealerOwnership(routeSupabase, user.id, dealer_id)
    if (ownerErr) return ownerErr

    const supabase = getSupabase()

    // Verify the review belongs to this dealer
    const { data: review, error: fetchErr } = await supabase
        .from('dealer_reviews')
        .select('id, dealer_id')
        .eq('id', review_id)
        .eq('dealer_id', dealer_id)
        .single()

    if (fetchErr || !review) {
        return NextResponse.json({ error: 'Review not found or access denied' }, { status: 404 })
    }

    const updatePayload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
    }

    if (action === 'curate') {
        if (typeof show_on_homepage === 'boolean') {
            updatePayload.show_on_homepage = show_on_homepage
        }
        if (typeof display_order === 'number' && Number.isInteger(display_order)) {
            updatePayload.display_order = Math.max(0, display_order)
        }
    } else {
        updatePayload.is_approved = action === 'approve' || action === 'respond'
        updatePayload.moderation_status = action === 'approve' || action === 'respond' ? 'approved' : action === 'reject' ? 'rejected' : 'flagged'
        if (action === 'approve') updatePayload.show_on_homepage = true
        if (action === 'reject' || action === 'flag') updatePayload.show_on_homepage = false
        if (typeof admin_reply === 'string') {
            updatePayload.admin_reply = admin_reply.trim().slice(0, 1000)
            if (admin_reply.trim()) updatePayload.replied_at = new Date().toISOString()
        }
    }

    const { data: updatedReview, error } = await supabase
        .from('dealer_reviews')
        .update(updatePayload)
        .eq('id', review_id)
        .select('id, dealer_id, reviewer_name, reviewer_phone, rating, review_text, car_purchased, is_approved, show_on_homepage, display_order, moderation_status, admin_reply, replied_at, created_at, updated_at, source')
        .single()

    if (error) {
        logger.error('Review approve error:', error)
        return NextResponse.json({ error: 'Failed to approve review' }, { status: 500 })
    }

    return NextResponse.json({ success: true, review: updatedReview })
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

    // Build OR filter for each table's email/phone columns
    function orFilter(emailCol: string, phoneCol: string) {
        const clauses: string[] = []
        if (normalizedEmail) clauses.push(`${emailCol}.ilike.${normalizedEmail}`)
        if (normalizedPhone.length === 10) clauses.push(`${phoneCol}.ilike.%${normalizedPhone}%`)
        return clauses.join(',')
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
    const tdFilter = orFilter('customer_email', 'customer_phone')
    if (tdFilter) {
        const { count } = await supabase
            .from('test_drive_bookings')
            .select('id', { count: 'exact', head: true })
            .eq('dealer_id', dealerId)
            .or(tdFilter)
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

    // Check car_service_bookings
    const serviceFilter = orFilter('email', 'phone')
    if (serviceFilter) {
        const { count } = await supabase
            .from('car_service_bookings')
            .select('id', { count: 'exact', head: true })
            .eq('dealer_id', dealerId)
            .or(serviceFilter)
        if (count && count > 0) return true
    }

    return false
}

// ── POST: submit a new review ────────────────────────────────────────────────
export async function POST(request: NextRequest) {
    // Rate limiting (5 reviews per IP per day)
    const rateLimitResponse = await rateLimitOrNull('reviews', request, 5, 24 * 60 * 60 * 1000)
    if (rateLimitResponse) return rateLimitResponse

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

    const { dealer_id, reviewer_name, reviewer_email, reviewer_phone, rating, review_text, car_purchased } = body

    if (!dealer_id || !reviewer_name || !rating) {
        return NextResponse.json(
            { error: 'dealer_id, reviewer_name and rating are required' },
            { status: 400 }
        )
    }
    if (!reviewer_email && !reviewer_phone) {
        return NextResponse.json(
            { error: 'Email or phone is required to verify your identity' },
            { status: 400 }
        )
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return NextResponse.json({ error: 'Rating must be 1–5' }, { status: 400 })
    }
    if (typeof reviewer_name !== 'string' || reviewer_name.length > 80) {
        return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
    }
    if (review_text && (typeof review_text !== 'string' || review_text.length > 500)) {
        return NextResponse.json({ error: 'Review too long (max 500 chars)' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Verify dealer exists
    const { data: dealer, error: dealerErr } = await supabase
        .from('dealers')
        .select('id')
        .eq('id', dealer_id)
        .single()

    if (dealerErr || !dealer) {
        return NextResponse.json({ error: 'Invalid dealer' }, { status: 400 })
    }

    // Verify the reviewer has interacted with this dealer
    const verified = await isVerifiedCustomer(supabase, dealer_id, reviewer_email, reviewer_phone)
    if (!verified) {
        return NextResponse.json(
            { error: 'Only customers who have interacted with this dealership can leave a review. Please use the email or phone you used during your enquiry, purchase, or service.' },
            { status: 403 }
        )
    }

    const { error } = await supabase
        .from('dealer_reviews')
        .insert({
            dealer_id,
            reviewer_name: reviewer_name.trim(),
            reviewer_email: reviewer_email?.trim().toLowerCase() ?? null,
            reviewer_phone: reviewer_phone?.trim() ?? null,
            rating,
            review_text: review_text?.trim() ?? null,
            car_purchased: car_purchased?.trim() ?? null,
            is_approved: false,
            moderation_status: 'pending',
        })

    if (error) {
        logger.error('Review insert error:', error)
        return NextResponse.json({ error: 'Failed to save review' }, { status: 500 })
    }

    return NextResponse.json({
        success: true,
        message: 'Thank you! Your review will be visible after dealer approval.',
    })
}

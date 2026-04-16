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
import { createClient } from '@supabase/supabase-js'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { logger } from '@/lib/utils/logger'

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

// ── GET: fetch approved reviews for a dealer ─────────────────────────────────
export async function GET(request: NextRequest) {
    const dealerId = request.nextUrl.searchParams.get('dealer_id')
    if (!dealerId) {
        return NextResponse.json({ error: 'dealer_id required' }, { status: 400 })
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
        .from('dealer_reviews')
        .select('id, reviewer_name, rating, review_text, car_purchased, created_at, source')
        .eq('dealer_id', dealerId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(20)

    if (error) {
        logger.error('Reviews fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }

    const avgRating = data.length
        ? Math.round((data.reduce((s, r) => s + r.rating, 0) / data.length) * 10) / 10
        : 0

    return NextResponse.json({ reviews: data, avgRating, total: data.length })
}

// ── PATCH: approve a review (dealer dashboard) ───────────────────────────────
export async function PATCH(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

    const { review_id, dealer_id } = body
    if (!review_id || !dealer_id) {
        return NextResponse.json({ error: 'review_id and dealer_id required' }, { status: 400 })
    }

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

    const { error } = await supabase
        .from('dealer_reviews')
        .update({ is_approved: true })
        .eq('id', review_id)

    if (error) {
        logger.error('Review approve error:', error)
        return NextResponse.json({ error: 'Failed to approve review' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

// ── POST: submit a new review ────────────────────────────────────────────────
export async function POST(request: NextRequest) {
    // Rate limiting (5 reviews per IP per day)
    const rateLimitResponse = await rateLimitOrNull('reviews', request, 5, 24 * 60 * 60 * 1000)
    if (rateLimitResponse) return rateLimitResponse

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

    const { dealer_id, reviewer_name, rating, review_text, car_purchased } = body

    if (!dealer_id || !reviewer_name || !rating) {
        return NextResponse.json(
            { error: 'dealer_id, reviewer_name and rating are required' },
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

    // Auto-approve in dev / when env flag is set (for demo)
    const autoApprove = process.env.NEXT_PUBLIC_AUTO_APPROVE_REVIEWS === 'true'

    const { error } = await supabase
        .from('dealer_reviews')
        .insert({
            dealer_id,
            reviewer_name: reviewer_name.trim(),
            rating,
            review_text: review_text?.trim() ?? null,
            car_purchased: car_purchased?.trim() ?? null,
            is_approved: autoApprove,
        })

    if (error) {
        logger.error('Review insert error:', error)
        return NextResponse.json({ error: 'Failed to save review' }, { status: 500 })
    }

    return NextResponse.json({
        success: true,
        message: autoApprove
            ? 'Review published!'
            : 'Thank you! Your review will be visible after dealer approval.',
    })
}

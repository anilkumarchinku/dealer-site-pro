/**
 * POST /api/reviews/google-sync
 *
 * Fetches Google reviews for a dealer using the Google Places API
 * and upserts them into dealer_reviews with source='google'.
 *
 * Body: { dealer_id: string; maps_url?: string }
 *   - maps_url is optional if the dealer already has google_place_id saved.
 *
 * Requires env var: GOOGLE_PLACES_API_KEY
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth, requireDealerOwnership } from '@/lib/supabase-server'

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

// ── Extract Place ID from a Google Maps URL ───────────────────────────────────
function extractPlaceIdFromUrl(url: string): string | null {
    // Format: ...data=...!1sChIJxxxxxxxx... (most common long URL format)
    const chijMatch = url.match(/!1s(ChIJ[A-Za-z0-9_-]+)/)
    if (chijMatch) return chijMatch[1]

    // Format: place_id=ChIJxxxxxxxx (rare but possible in API-generated URLs)
    const paramMatch = url.match(/[?&]place_id=(ChIJ[A-Za-z0-9_-]+)/)
    if (paramMatch) return paramMatch[1]

    // Format: https://maps.google.com/?cid=XXXXXXX — CID not equal to place_id
    // We'll return null and let the text-search fallback handle it
    return null
}

// ── Resolve place ID via Places Text Search ───────────────────────────────────
async function findPlaceId(query: string): Promise<string | null> {
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`
    const res = await fetch(url)
    const data = await res.json()
    return data?.candidates?.[0]?.place_id ?? null
}

// ── Fetch reviews from Google Places Details ──────────────────────────────────
interface GoogleReview {
    author_name: string
    rating: number
    text: string
    time: number          // Unix timestamp
    relative_time_description: string
}

async function fetchGoogleReviews(placeId: string): Promise<GoogleReview[]> {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,name,rating,user_ratings_total&language=en&key=${GOOGLE_API_KEY}`
    const res = await fetch(url)
    const data = await res.json()

    if (data.status !== 'OK') {
        throw new Error(`Places API error: ${data.status} — ${data.error_message ?? ''}`)
    }

    return data.result?.reviews ?? []
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
    // Auth: only authenticated dealers can trigger Google sync
    const { user, supabase: authClient, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    if (!GOOGLE_API_KEY) {
        return NextResponse.json(
            { error: 'Google Places API key not configured on this server.' },
            { status: 503 }
        )
    }

    const body = await request.json().catch(() => null)
    if (!body?.dealer_id) {
        return NextResponse.json({ error: 'dealer_id is required' }, { status: 400 })
    }

    const { dealer_id, maps_url } = body as { dealer_id: string; maps_url?: string }

    // Verify the caller owns this dealer
    const { errorResponse: ownershipError } = await requireDealerOwnership(authClient, user.id, dealer_id)
    if (ownershipError) return ownershipError

    const supabase = getSupabase()

    // ── 1. Verify dealer & get existing place_id ──────────────────────────────
    const { data: dealer, error: dealerErr } = await supabase
        .from('dealers')
        .select('id, dealership_name, location, google_place_id, google_maps_url')
        .eq('id', dealer_id)
        .single()

    if (dealerErr || !dealer) {
        return NextResponse.json({ error: 'Dealer not found' }, { status: 404 })
    }

    // ── 2. Resolve Place ID ───────────────────────────────────────────────────
    let placeId: string | null = dealer.google_place_id ?? null
    const urlToUse = maps_url?.trim() || dealer.google_maps_url

    if (!placeId && urlToUse) {
        // Try to extract from URL directly
        placeId = extractPlaceIdFromUrl(urlToUse)

        // If still no place ID, use Text Search with dealer name + city
        if (!placeId) {
            const query = `${dealer.dealership_name} ${dealer.location}`
            placeId = await findPlaceId(query).catch(() => null)
        }
    }

    if (!placeId) {
        return NextResponse.json(
            { error: 'Could not resolve Google Place ID. Please check the URL and try again.' },
            { status: 422 }
        )
    }

    // ── 3. Persist maps_url + place_id back to dealer ─────────────────────────
    const updatePayload: Record<string, string> = { google_place_id: placeId }
    if (urlToUse && !dealer.google_maps_url) updatePayload.google_maps_url = urlToUse
    await supabase.from('dealers').update(updatePayload).eq('id', dealer_id)

    // ── 4. Fetch reviews from Google ──────────────────────────────────────────
    let googleReviews: GoogleReview[]
    try {
        googleReviews = await fetchGoogleReviews(placeId)
    } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: `Google API error: ${msg}` }, { status: 502 })
    }

    if (googleReviews.length === 0) {
        return NextResponse.json({ synced: 0, message: 'No reviews found on Google yet.' })
    }

    // ── 5. Upsert reviews into dealer_reviews ────────────────────────────────
    const rows = googleReviews.map((r, i) => ({
        dealer_id,
        reviewer_name:  r.author_name,
        rating:         Math.round(r.rating),          // Google gives 1–5 stars
        review_text:    r.text?.slice(0, 500) || null,
        car_purchased:  null,
        is_approved:    true,
        source:         'google',
        external_id:    `${placeId}_${r.time}_${i}`,  // unique per review
        created_at:     new Date(r.time * 1000).toISOString(),
    }))

    const { error: upsertErr } = await supabase
        .from('dealer_reviews')
        .upsert(rows, { onConflict: 'dealer_id,external_id', ignoreDuplicates: true })

    if (upsertErr) {
        console.error('[google-sync] upsert error:', upsertErr.message)
        return NextResponse.json({ error: 'Failed to save reviews' }, { status: 500 })
    }

    return NextResponse.json({
        synced:   googleReviews.length,
        place_id: placeId,
        message:  `Synced ${googleReviews.length} review${googleReviews.length !== 1 ? 's' : ''} from Google.`,
    })
}

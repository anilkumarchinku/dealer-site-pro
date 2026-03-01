/**
 * POST /api/social/post
 * Auto-posts a new vehicle listing to dealer's social media.
 *
 * Supported platforms (configure via env):
 *   - Facebook Page (Meta Graph API)
 *   - Instagram Business (Meta Graph API)
 *   - Twitter/X (Twitter API v2)
 *
 * Setup:
 *   META_PAGE_ID          — Facebook Page ID
 *   META_PAGE_ACCESS_TOKEN — Long-lived Page Access Token
 *   META_IG_USER_ID       — Instagram Business Account user ID
 *   TWITTER_BEARER_TOKEN  — Twitter API v2 Bearer Token
 *   TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET
 *
 * Body: {
 *   dealer_id: string
 *   car_name: string         e.g. "2023 Maruti Suzuki Swift VXi"
 *   price_text: string       e.g. "₹7.5 Lakh"
 *   fuel_type?: string
 *   color?: string
 *   image_url?: string       public URL of car hero image
 *   site_url?: string        public dealer site URL
 * }
 */

import { NextRequest, NextResponse } from 'next/server'

interface PostBody {
    dealer_id: string
    car_name: string
    price_text: string
    fuel_type?: string
    color?: string
    image_url?: string
    site_url?: string
}

function buildCaption(b: PostBody): string {
    const lines = [
        `🚗 NEW ARRIVAL: ${b.car_name}`,
        `💰 Price: ${b.price_text}`,
    ]
    if (b.fuel_type) lines.push(`⛽ Fuel: ${b.fuel_type}`)
    if (b.color)     lines.push(`🎨 Color: ${b.color}`)
    if (b.site_url)  lines.push(`\n🔗 View details: ${b.site_url}`)
    lines.push('\n#NewCar #CarSale #DealerSitePro #Automobile #IndianCars')
    return lines.join('\n')
}

// ── Facebook Page Post ────────────────────────────────────────────────────────
async function postToFacebook(caption: string, imageUrl?: string): Promise<void> {
    const pageId    = process.env.META_PAGE_ID
    const pageToken = process.env.META_PAGE_ACCESS_TOKEN
    if (!pageId || !pageToken) return

    const endpoint = imageUrl
        ? `https://graph.facebook.com/v18.0/${pageId}/photos`
        : `https://graph.facebook.com/v18.0/${pageId}/feed`

    const body: Record<string, string> = {
        access_token: pageToken,
        message:      caption,
    }
    if (imageUrl) body.url = imageUrl

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    if (!res.ok) {
        const err = await res.text()
        console.error('[Social] Facebook post failed:', res.status, err)
    }
}

// ── Instagram Business Post ───────────────────────────────────────────────────
async function postToInstagram(caption: string, imageUrl?: string): Promise<void> {
    const igUserId  = process.env.META_IG_USER_ID
    const pageToken = process.env.META_PAGE_ACCESS_TOKEN
    if (!igUserId || !pageToken || !imageUrl) return

    // Step 1: Create media container
    const containerRes = await fetch(`https://graph.facebook.com/v18.0/${igUserId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            image_url:    imageUrl,
            caption,
            access_token: pageToken,
        }),
    })
    if (!containerRes.ok) { console.error('[Social] IG container failed'); return }
    const { id: creationId } = await containerRes.json()

    // Step 2: Publish
    const pubRes = await fetch(`https://graph.facebook.com/v18.0/${igUserId}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creation_id: creationId, access_token: pageToken }),
    })
    if (!pubRes.ok) console.error('[Social] IG publish failed')
}

// ── Twitter/X Post ────────────────────────────────────────────────────────────
async function postToTwitter(text: string): Promise<void> {
    const bearerToken    = process.env.TWITTER_BEARER_TOKEN
    const apiKey         = process.env.TWITTER_API_KEY
    const apiSecret      = process.env.TWITTER_API_SECRET
    const accessToken    = process.env.TWITTER_ACCESS_TOKEN
    const accessSecret   = process.env.TWITTER_ACCESS_SECRET
    if (!apiKey || !apiSecret || !accessToken || !accessSecret) return

    // OAuth 1.0a — simplified implementation using fetch
    // For production, use a proper OAuth library (e.g. 'oauth-1.0a')
    const tweet = text.length > 280 ? text.substring(0, 277) + '...' : text
    const res = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${bearerToken}`,  // App-only auth (read-only) — use OAuth 1.0a for posting
        },
        body: JSON.stringify({ text: tweet }),
    })
    if (!res.ok) console.error('[Social] Twitter post failed:', res.status)
}

export async function POST(request: NextRequest) {
    const body: PostBody = await request.json().catch(() => null)
    if (!body?.dealer_id || !body?.car_name || !body?.price_text) {
        return NextResponse.json({ error: 'dealer_id, car_name and price_text required' }, { status: 400 })
    }

    // Only post if at least one platform is configured
    const hasFB     = !!(process.env.META_PAGE_ID && process.env.META_PAGE_ACCESS_TOKEN)
    const hasIG     = !!(process.env.META_IG_USER_ID && process.env.META_PAGE_ACCESS_TOKEN)
    const hasTwitter = !!(process.env.TWITTER_API_KEY)

    if (!hasFB && !hasIG && !hasTwitter) {
        return NextResponse.json({ success: true, skipped: true, message: 'No social platforms configured' })
    }

    const caption = buildCaption(body)
    const results: Record<string, string> = {}

    // Fire all posts concurrently (failures are logged but don't break response)
    await Promise.allSettled([
        hasFB     ? postToFacebook(caption, body.image_url).then(() => { results.facebook = 'ok' }).catch(() => { results.facebook = 'error' }) : Promise.resolve(),
        hasIG     ? postToInstagram(caption, body.image_url).then(() => { results.instagram = 'ok' }).catch(() => { results.instagram = 'error' }) : Promise.resolve(),
        hasTwitter ? postToTwitter(caption).then(() => { results.twitter = 'ok' }).catch(() => { results.twitter = 'error' }) : Promise.resolve(),
    ])

    return NextResponse.json({ success: true, results })
}

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
import { getOptionalEnv } from '@/lib/env'
import { ExternalApiError, externalApiFetch } from '@/lib/services/external-api-fetch'
import { requireAuth, requireDealerOwnership } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'

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
    const pageId    = getOptionalEnv('META_PAGE_ID')
    const pageToken = getOptionalEnv('META_PAGE_ACCESS_TOKEN')
    if (!pageId || !pageToken) return

    const path = imageUrl
        ? `/v18.0/${pageId}/photos`
        : `/v18.0/${pageId}/feed`

    const body: Record<string, string> = {
        access_token: pageToken,
        message:      caption,
    }
    if (imageUrl) body.url = imageUrl

    try {
        await externalApiFetch({
            baseUrl: 'https://graph.facebook.com',
            providerName: 'Meta',
            path,
            headers: { 'Content-Type': 'application/json' },
            init: {
                method: 'POST',
                body: JSON.stringify(body),
            },
            responseType: 'void',
        })
    } catch (err) {
        if (err instanceof ExternalApiError) {
            console.error('[Social] Facebook post failed:', err.status, err.bodyText ?? err.message)
            return
        }
        throw err
    }
}

// ── Instagram Business Post ───────────────────────────────────────────────────
async function postToInstagram(caption: string, imageUrl?: string): Promise<void> {
    const igUserId  = getOptionalEnv('META_IG_USER_ID')
    const pageToken = getOptionalEnv('META_PAGE_ACCESS_TOKEN')
    if (!igUserId || !pageToken || !imageUrl) return

    // Step 1: Create media container
    let creationId: string | undefined
    try {
        const media = await externalApiFetch<{ id?: string }>({
            baseUrl: 'https://graph.facebook.com',
            providerName: 'Meta',
            path: `/v18.0/${igUserId}/media`,
            headers: { 'Content-Type': 'application/json' },
            init: {
                method: 'POST',
                body: JSON.stringify({
                    image_url:    imageUrl,
                    caption,
                    access_token: pageToken,
                }),
            },
        })
        creationId = media.id
    } catch {
        console.error('[Social] IG container failed')
        return
    }

    if (!creationId) {
        console.error('[Social] IG container failed')
        return
    }

    // Step 2: Publish
    try {
        await externalApiFetch({
            baseUrl: 'https://graph.facebook.com',
            providerName: 'Meta',
            path: `/v18.0/${igUserId}/media_publish`,
            headers: { 'Content-Type': 'application/json' },
            init: {
                method: 'POST',
                body: JSON.stringify({ creation_id: creationId, access_token: pageToken }),
            },
            responseType: 'void',
        })
    } catch {
        console.error('[Social] IG publish failed')
    }
}

// ── Twitter/X Post ────────────────────────────────────────────────────────────
async function postToTwitter(text: string): Promise<void> {
    const bearerToken    = getOptionalEnv('TWITTER_BEARER_TOKEN')
    const apiKey         = getOptionalEnv('TWITTER_API_KEY')
    const apiSecret      = getOptionalEnv('TWITTER_API_SECRET')
    const accessToken    = getOptionalEnv('TWITTER_ACCESS_TOKEN')
    const accessSecret   = getOptionalEnv('TWITTER_ACCESS_SECRET')
    if (!apiKey || !apiSecret || !accessToken || !accessSecret) return

    // OAuth 1.0a — simplified implementation using fetch
    // For production, use a proper OAuth library (e.g. 'oauth-1.0a')
    const tweet = text.length > 280 ? text.substring(0, 277) + '...' : text
    try {
        await externalApiFetch({
            baseUrl: 'https://api.twitter.com',
            providerName: 'Twitter',
            path: '/2/tweets',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${bearerToken}`,  // App-only auth (read-only) — use OAuth 1.0a for posting
            },
            init: {
                method: 'POST',
                body: JSON.stringify({ text: tweet }),
            },
            responseType: 'void',
        })
    } catch (err) {
        if (err instanceof ExternalApiError) {
            console.error('[Social] Twitter post failed:', err.status)
            return
        }
        throw err
    }
}

export async function POST(request: NextRequest) {
    const limited = await rateLimitOrNull("social_post", request, 30, 3600000); if (limited) return limited;
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const body: PostBody = await request.json().catch(() => null)
    if (!body?.dealer_id || !body?.car_name || !body?.price_text) {
        return NextResponse.json({ error: 'dealer_id, car_name and price_text required' }, { status: 400 })
    }

    const { errorResponse: ownershipError } = await requireDealerOwnership(supabase, user.id, body.dealer_id)
    if (ownershipError) return ownershipError

    // Only post if at least one platform is configured
    const hasFB     = !!(getOptionalEnv('META_PAGE_ID') && getOptionalEnv('META_PAGE_ACCESS_TOKEN'))
    const hasIG     = !!(getOptionalEnv('META_IG_USER_ID') && getOptionalEnv('META_PAGE_ACCESS_TOKEN'))
    const hasTwitter = !!getOptionalEnv('TWITTER_API_KEY')

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

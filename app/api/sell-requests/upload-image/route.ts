/**
 * POST /api/sell-requests/upload-image
 * Public seller photo upload for Sell Your Car requests.
 */

import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'

const BUCKET = 'dealer-assets'
const MAX_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Map([
    ['image/jpeg', 'jpg'],
    ['image/png', 'png'],
    ['image/webp', 'webp'],
    ['image/avif', 'avif'],
])
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function POST(request: NextRequest) {
    const rateLimit = await rateLimitOrNull('sell_request_image_upload', request, 24, 60 * 60 * 1000)
    if (rateLimit) return rateLimit

    let formData: FormData
    try {
        formData = await request.formData()
    } catch {
        return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
    }

    const file = formData.get('file')
    if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const ext = ALLOWED_TYPES.get(file.type)
    if (!ext) {
        return NextResponse.json({ error: 'Only JPEG, PNG, WebP, and AVIF images are allowed' }, { status: 400 })
    }

    if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json({ error: 'File too large. Maximum size is 5 MB.' }, { status: 400 })
    }

    const dealerIdValue = formData.get('dealer_id')
    const dealerId = typeof dealerIdValue === 'string' && UUID_RE.test(dealerIdValue)
        ? dealerIdValue
        : 'public'
    const storagePath = `sell-requests/${dealerId}/${randomUUID()}.${ext}`

    try {
        const adminClient = createAdminClient()
        const arrayBuffer = await file.arrayBuffer()

        const { error: uploadError } = await adminClient.storage
            .from(BUCKET)
            .upload(storagePath, arrayBuffer, {
                contentType: file.type,
                upsert: false,
            })

        if (uploadError) {
            console.error('[sell-requests/upload-image] Storage upload error:', uploadError)
            return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
        }

        const { data } = adminClient.storage
            .from(BUCKET)
            .getPublicUrl(storagePath)

        return NextResponse.json({ url: data.publicUrl, path: storagePath })
    } catch (error) {
        console.error('[sell-requests/upload-image] Upload error:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}

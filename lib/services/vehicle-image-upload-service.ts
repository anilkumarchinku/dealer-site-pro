import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, getDealerForUser, requireAuth } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'

const BUCKET = 'dealer-assets'
const MAX_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

type UploadOptions = {
    rateLimitKey: string
    storagePrefix: string
    logPrefix: string
}

export async function uploadVehicleImage(
    request: NextRequest,
    options: UploadOptions
) {
    const rateLimit = await rateLimitOrNull(options.rateLimitKey, request, 20, 60 * 60 * 1000)
    if (rateLimit) return rateLimit

    const { user, supabase: userClient, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const dealer = await getDealerForUser(userClient, user.id)
    if (!dealer) {
        return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })
    }

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

    if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: 'Only JPEG, PNG, WebP, and AVIF images are allowed' }, { status: 400 })
    }
    if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const storagePath = `${options.storagePrefix}/${dealer.id}/${safeName}`

    const arrayBuffer = await file.arrayBuffer()
    const adminClient = createAdminClient()

    const { error: uploadError } = await adminClient.storage
        .from(BUCKET)
        .upload(storagePath, arrayBuffer, {
            contentType: file.type,
            upsert: false,
        })

    if (uploadError) {
        console.error(`[${options.logPrefix}] Storage upload error:`, uploadError)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const { data: publicData } = adminClient.storage
        .from(BUCKET)
        .getPublicUrl(storagePath)

    return NextResponse.json({ url: publicData.publicUrl })
}

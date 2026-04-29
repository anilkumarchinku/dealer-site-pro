/**
 * POST /api/three-wheelers/upload-image
 * Uploads a 3W vehicle image to Supabase Storage.
 */

import { NextRequest } from 'next/server'
import { uploadVehicleImage } from '@/lib/services/vehicle-image-upload-service'

export async function POST(request: NextRequest) {
    return uploadVehicleImage(request, {
        rateLimitKey: 'thw_image_upload',
        storagePrefix: 'thw',
        logPrefix: 'thw/upload-image',
    })
}

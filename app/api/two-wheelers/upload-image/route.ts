/**
 * POST /api/two-wheelers/upload-image
 * Uploads a 2W vehicle image to Supabase Storage.
 */

import { NextRequest } from 'next/server'
import { uploadVehicleImage } from '@/lib/services/vehicle-image-upload-service'

export async function POST(request: NextRequest) {
    return uploadVehicleImage(request, {
        rateLimitKey: 'tw_image_upload',
        storagePrefix: 'tw',
        logPrefix: 'tw/upload-image',
    })
}

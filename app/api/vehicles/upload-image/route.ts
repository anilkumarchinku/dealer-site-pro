/**
 * POST /api/vehicles/upload-image
 * Uploads a 4W vehicle image to Supabase Storage.
 */

import { NextRequest } from 'next/server'
import { uploadVehicleImage } from '@/lib/services/vehicle-image-upload-service'

export async function POST(request: NextRequest) {
    return uploadVehicleImage(request, {
        rateLimitKey: 'vehicle_image_upload',
        storagePrefix: 'vehicles',
        logPrefix: 'vehicles/upload-image',
    })
}

import { NextRequest } from 'next/server'
import { uploadVehicleImage } from '@/lib/services/vehicle-image-upload-service'

export async function POST(request: NextRequest) {
    return uploadVehicleImage(request, {
        rateLimitKey: 'service_center_image_upload',
        storagePrefix: 'service-centers',
        logPrefix: 'service-centers/upload-image',
    })
}

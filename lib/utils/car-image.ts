import type { Car } from '@/lib/types/car'
import { getVehicleImageUrls, brandNameToId, isUsableVehicleImageUrl } from '@/lib/utils/brand-model-images'

/**
 * Resolve the best available thumbnail URL for a car, using the same curated →
 * scraped → primary → color-hero fallback chain the cards use. Returns a usable
 * null when no real model/uploaded image is available. Callers should keep the
 * slot layout but avoid rendering fake vehicle art.
 */
export function resolveCarImage(car: Car): string | null {
    const category = (car.vehicleCategory ?? '4w') as '2w' | '3w' | '4w'
    const candidates = getVehicleImageUrls(
        category,
        brandNameToId(car.make, category),
        car.model,
        car.images?.hero,
    )
    return candidates[0] || (isUsableVehicleImageUrl(car.images?.hero) ? car.images.hero : null)
}

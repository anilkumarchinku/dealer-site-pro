import type { Car } from '@/lib/types/car'
import { getVehicleImageUrls, brandNameToId } from '@/lib/utils/brand-model-images'

const PLACEHOLDER = '/placeholder-car.jpg'

/**
 * Resolve the best available thumbnail URL for a car, using the same curated →
 * scraped → primary → color-hero fallback chain the cards use. Returns a usable
 * placeholder rather than an empty string so compact surfaces (compare bar/modal)
 * never render a broken image.
 */
export function resolveCarImage(car: Car): string {
    const category = (car.vehicleCategory ?? '4w') as '2w' | '3w' | '4w'
    const candidates = getVehicleImageUrls(
        category,
        brandNameToId(car.make, category),
        car.model,
        car.images?.hero,
    )
    return candidates[0] || car.images?.hero || PLACEHOLDER
}

import type { Car } from '@/lib/types/car'
import { brandNameToId } from '@/lib/utils/brand-model-images'

export type VehicleImageCategory = '2w' | '3w' | '4w'

export function brandLogoUrl(brandName: string | null | undefined, category: VehicleImageCategory): string | undefined {
    if (!brandName) return undefined
    return `/data/brand-logos/${brandNameToId(brandName, category)}.png`
}

export function firstVehicleHeroImage(cars: Car[]): string | undefined {
    const hero = cars.find(car => {
        const src = car.images?.hero
        return src && src !== '/placeholder-car.jpg'
    })?.images.hero

    if (hero) return hero

    return cars
        .flatMap(car => car.images?.exterior ?? [])
        .find(src => src && src !== '/placeholder-car.jpg')
}

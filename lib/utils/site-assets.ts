import type { Car } from '@/lib/types/car'
import { brandNameToId } from '@/lib/utils/brand-model-images'

export type VehicleImageCategory = '2w' | '3w' | '4w'

const LOGO_EXTENSION_OVERRIDES: Record<string, string> = {
    'hop-electric':       'svg',
    'okinawa-autotech':   'webp',
}

const LOGO_ID_OVERRIDES: Record<string, string> = {
    'Tata Motors::4w': 'tata-motors',
    'Tata::4w':        'tata-motors',
}

export function brandLogoUrl(brandName: string | null | undefined, category: VehicleImageCategory): string | undefined {
    if (!brandName) return undefined
    const brandId = LOGO_ID_OVERRIDES[`${brandName.trim()}::${category}`] ?? brandNameToId(brandName, category)
    const extension = LOGO_EXTENSION_OVERRIDES[brandId] ?? 'png'
    return `/data/brand-logos/${brandId}.${extension}`
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

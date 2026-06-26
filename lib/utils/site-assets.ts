import type { Car } from '@/lib/types/car'
import { brandNameToId } from '@/lib/utils/brand-model-images'

export type VehicleImageCategory = '2w' | '3w' | '4w'

const LOGO_EXTENSION_OVERRIDES: Record<string, string> = {
    'hop-electric':       'svg',
    'okinawa-autotech':   'webp',
}

const LOGO_ID_OVERRIDES: Record<string, string | null> = {
    'Tata Motors::4w':                         'tata-motors',
    'Tata::4w':                                'tata-motors',
    'Honda::3w':                               null,
    'Honda Motorcycle & Scooter India::3w':    null,
}

export function brandLogoUrl(brandName: string | null | undefined, category: VehicleImageCategory): string | undefined {
    if (!brandName) return undefined
    const override = LOGO_ID_OVERRIDES[`${brandName.trim()}::${category}`]
    if (override === null) return undefined
    const brandId = override ?? brandNameToId(brandName, category)
    const extension = LOGO_EXTENSION_OVERRIDES[brandId] ?? 'png'
    return `/data/brand-logos/${brandId}.${extension}`
}

export function firstVehicleHeroImage(cars: Car[]): string | undefined {
    const hero = cars.find(car => {
        const src = car.images?.hero
        return isUsableSiteImage(src)
    })?.images.hero

    if (hero) return hero

    return cars
        .flatMap(car => car.images?.exterior ?? [])
        .find(isUsableSiteImage)
}

export function isUsableSiteImage(src: string | null | undefined): src is string {
    if (!src?.trim()) return false
    return ![
        '/placeholder-car.jpg',
        '/placeholder.svg',
        '/placeholder.png',
    ].includes(src.trim())
}

export function isDealerUploadedHero(src: string | null | undefined): boolean {
    if (!isUsableSiteImage(src)) return false

    const normalized = src.trim().toLowerCase()
    return (
        normalized.startsWith('data:image/') ||
        normalized.includes('/storage/v1/object/public/dealer-assets/') ||
        normalized.includes('/storage/v1/object/public/vehicle-images/dealer-assets/') ||
        normalized.includes('/dealer-assets/dealers/') ||
        normalized.includes('/vehicle-images/dealer-assets/')
    )
}

export function resolveDealerHeroImage({
    uploadedHeroImage,
    inventoryHeroImage,
}: {
    uploadedHeroImage?: string | null
    inventoryHeroImage?: string | null
}): string | undefined {
    const uploaded = uploadedHeroImage?.trim()
    if (isDealerUploadedHero(uploaded)) return uploaded
    return isUsableSiteImage(inventoryHeroImage) ? inventoryHeroImage.trim() : undefined
}

export function isDealerUploadedLogo(src: string | null | undefined): boolean {
    if (!src?.trim()) return false

    const normalized = src.trim().toLowerCase()
    return (
        normalized.startsWith('data:image/') ||
        normalized.startsWith('http://') ||
        normalized.startsWith('https://') ||
        normalized.includes('/storage/v1/object/public/dealer-assets/') ||
        normalized.includes('/storage/v1/object/public/vehicle-images/dealer-assets/') ||
        normalized.includes('/dealer-assets/dealers/') ||
        normalized.includes('/vehicle-images/dealer-assets/')
    )
}

export function resolveDealerLogoImage({
    uploadedLogo,
    fallbackLogo,
    preferFallbackLogo = false,
}: {
    uploadedLogo?: string | null
    fallbackLogo?: string | null
    preferFallbackLogo?: boolean
}): string | undefined {
    const uploaded = uploadedLogo?.trim()
    const fallback = fallbackLogo?.trim()
    if (preferFallbackLogo && fallback) return fallback
    if (isDealerUploadedLogo(uploaded)) return uploaded
    return fallback || undefined
}

import 'server-only'

import type { TwoWheelerVehicle } from '@/lib/types/two-wheeler'
import { getModelEnrichment } from '@/lib/data/2w-brand-data'
import { brandNameToId, getVehicleImageUrls } from '@/lib/utils/brand-model-images'
import { fetchTwoWheelerColorGallery } from '@/lib/data/two-wheeler-gallery'
import { defaultTwoWheelerVariantName, normalizeTwoWheelerVariants } from '@/lib/utils/two-wheeler-variants'

function normalizeColorName(value: string): string {
    return value
        .toLowerCase()
        .replace(/\b-?\s*obd\s*[- ]?\s*\d*\b/g, '')
        .replace(/[^a-z0-9]+/g, '')
}

function uniqueStrings(values: string[]): string[] {
    return Array.from(new Set(values.filter(Boolean)))
}

export function hydrateTwoWheelerWithJson(vehicle: TwoWheelerVehicle): TwoWheelerVehicle {
    const brandId = brandNameToId(vehicle.brand, '2w')
    const enrichment = getModelEnrichment(brandId, vehicle.model)
    const fallbackVariant = {
        name: defaultTwoWheelerVariantName(vehicle.model, vehicle.variant),
        price_paise: vehicle.ex_showroom_price_paise,
    }
    if (!enrichment) {
        return {
            ...vehicle,
            all_variants: normalizeTwoWheelerVariants(vehicle.all_variants, fallbackVariant),
        }
    }

    const modelImages = getVehicleImageUrls('2w', brandId, vehicle.model, vehicle.images[0])
    const vehicleVariants = normalizeTwoWheelerVariants(vehicle.all_variants)
    const enrichmentVariants = normalizeTwoWheelerVariants(enrichment.all_variants)
    const hasGeneratedFallbackVariant =
        vehicleVariants.length === 1 &&
        vehicleVariants[0].name === fallbackVariant.name &&
        vehicleVariants[0].price_paise === fallbackVariant.price_paise
    const variantSource = enrichmentVariants.length > 0 &&
        (hasGeneratedFallbackVariant || enrichmentVariants.length > vehicleVariants.length)
        ? enrichmentVariants
        : vehicleVariants

    return {
        ...vehicle,
        variant: vehicle.variant ?? enrichment.variant ?? null,
        engine_cc: vehicle.engine_cc ?? enrichment.engine_cc ?? null,
        max_power: vehicle.max_power ?? enrichment.max_power ?? null,
        torque: vehicle.torque ?? enrichment.torque ?? null,
        battery_kwh: vehicle.battery_kwh ?? enrichment.battery_kwh ?? null,
        range_km: vehicle.range_km ?? enrichment.range_km ?? null,
        top_speed_kmph: vehicle.top_speed_kmph ?? enrichment.top_speed_kmph ?? null,
        transmission: vehicle.transmission ?? enrichment.transmission ?? null,
        mileage_kmpl: vehicle.mileage_kmpl ?? enrichment.mileage_kmpl ?? null,
        colors: vehicle.colors.length > 0 ? vehicle.colors : enrichment.colors,
        images: vehicle.images.length > 0 ? vehicle.images : modelImages,
        description: vehicle.description ?? enrichment.description ?? null,
        features: vehicle.features.length > 0 ? vehicle.features : enrichment.features,
        all_variants: normalizeTwoWheelerVariants(variantSource, fallbackVariant),
        wheelbase_mm: vehicle.wheelbase_mm ?? enrichment.wheelbase_mm ?? null,
        length_mm: vehicle.length_mm ?? enrichment.length_mm ?? null,
        width_mm: vehicle.width_mm ?? enrichment.width_mm ?? null,
        height_mm: vehicle.height_mm ?? enrichment.height_mm ?? null,
        stock_status: vehicle.stock_status ?? enrichment.stock_status,
    }
}

export async function hydrateTwoWheelerDetail(vehicle: TwoWheelerVehicle): Promise<TwoWheelerVehicle> {
    const hydratedVehicle = hydrateTwoWheelerWithJson(vehicle)
    const gallery = await fetchTwoWheelerColorGallery(hydratedVehicle.brand, hydratedVehicle.model)

    if (!gallery) return hydratedVehicle

    const colorImageMap = new Map(
        gallery.colors.map(color => [normalizeColorName(color.name), color.image])
    )

    const colors = hydratedVehicle.colors.map(color => ({
        ...color,
        image: color.image ?? colorImageMap.get(normalizeColorName(color.name)),
    }))

    const colorImages = colors
        .map(color => color.image)
        .filter((image): image is string => Boolean(image))

    // For two-wheelers, the color gallery is the best source of truth.
    // Mixing the remote hero/fallback image back in creates near-duplicate
    // thumbnails where the same bike is shown twice from the same studio shot.
    const images = colorImages.length > 0
        ? uniqueStrings(colorImages)
        : uniqueStrings([
            gallery.hero ?? '',
            ...hydratedVehicle.images,
        ])

    return {
        ...hydratedVehicle,
        colors,
        images,
    }
}

import 'server-only'

import type { TwoWheelerVehicle } from '@/lib/types/two-wheeler'
import { getModelEnrichment } from '@/lib/data/2w-brand-data'
import { brandNameToId, getScrapedImageFallback } from '@/lib/utils/brand-model-images'

export function hydrateTwoWheelerWithJson(vehicle: TwoWheelerVehicle): TwoWheelerVehicle {
    const brandId = brandNameToId(vehicle.brand, '2w')
    const enrichment = getModelEnrichment(brandId, vehicle.model)
    if (!enrichment) return vehicle

    const fallbackImage = getScrapedImageFallback('2w', brandId, vehicle.model)

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
        images: vehicle.images.length > 0 ? vehicle.images : (fallbackImage ? [fallbackImage] : []),
        description: vehicle.description ?? enrichment.description ?? null,
        features: vehicle.features.length > 0 ? vehicle.features : enrichment.features,
        all_variants: vehicle.all_variants && vehicle.all_variants.length > 0 ? vehicle.all_variants : enrichment.all_variants,
        wheelbase_mm: vehicle.wheelbase_mm ?? enrichment.wheelbase_mm ?? null,
        length_mm: vehicle.length_mm ?? enrichment.length_mm ?? null,
        width_mm: vehicle.width_mm ?? enrichment.width_mm ?? null,
        height_mm: vehicle.height_mm ?? enrichment.height_mm ?? null,
        stock_status: vehicle.stock_status ?? enrichment.stock_status,
    }
}

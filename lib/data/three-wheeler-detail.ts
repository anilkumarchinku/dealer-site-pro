import 'server-only'

import type { ThreeWheelerVehicle } from '@/lib/types/three-wheeler'
import { get3WModelEnrichment } from '@/lib/data/3w-brand-data'
import { THREE_WHEELER_MODEL_COLORS } from '@/lib/data/3w-model-colors'
import { brandNameToId, getScrapedImageFallback } from '@/lib/utils/brand-model-images'

function lookupColors(brand: string, model: string) {
    return THREE_WHEELER_MODEL_COLORS[`${brand} ${model}`] ?? []
}

export function hydrateThreeWheelerWithJson(vehicle: ThreeWheelerVehicle): ThreeWheelerVehicle {
    const brandId = brandNameToId(vehicle.brand, '3w')
    const enrichment = get3WModelEnrichment(brandId, vehicle.model)
    const fallbackImage = getScrapedImageFallback('3w', brandId, vehicle.model)

    if (!enrichment) {
        return {
            ...vehicle,
            images: vehicle.images.length > 0 ? vehicle.images : (fallbackImage ? [fallbackImage] : []),
            colors: vehicle.colors.length > 0 ? vehicle.colors : lookupColors(vehicle.brand, vehicle.model),
        }
    }

    return {
        ...vehicle,
        variant: vehicle.variant ?? enrichment.variant ?? null,
        fuel_type: vehicle.fuel_type ?? enrichment.fuel_type ?? vehicle.fuel_type,
        engine_cc: vehicle.engine_cc ?? enrichment.engine_cc ?? null,
        max_power: vehicle.max_power ?? enrichment.max_power ?? null,
        torque: vehicle.torque ?? enrichment.torque ?? null,
        battery_kwh: vehicle.battery_kwh ?? enrichment.battery_kwh ?? null,
        range_km: vehicle.range_km ?? enrichment.range_km ?? null,
        charging_time_hours: vehicle.charging_time_hours ?? enrichment.charging_time_hours ?? null,
        transmission: vehicle.transmission ?? enrichment.transmission ?? null,
        payload_kg: vehicle.payload_kg ?? enrichment.payload_kg ?? null,
        passenger_capacity: vehicle.passenger_capacity ?? enrichment.passenger_capacity ?? null,
        max_speed_kmph: vehicle.max_speed_kmph ?? enrichment.top_speed_kmph ?? null,
        mileage_kmpl: vehicle.mileage_kmpl ?? enrichment.mileage_kmpl ?? null,
        cng_mileage_km_per_kg: vehicle.cng_mileage_km_per_kg ?? enrichment.cng_mileage_km_per_kg ?? null,
        gvw_kg: vehicle.gvw_kg ?? enrichment.gvw_kg ?? null,
        colors: vehicle.colors.length > 0 ? vehicle.colors : (enrichment.colors.length > 0 ? enrichment.colors : lookupColors(vehicle.brand, vehicle.model)),
        images: vehicle.images.length > 0 ? vehicle.images : (fallbackImage ? [fallbackImage] : []),
        description: vehicle.description ?? enrichment.description ?? null,
        features: vehicle.features.length > 0 ? vehicle.features : enrichment.features,
        all_variants: vehicle.all_variants && vehicle.all_variants.length > 0 ? vehicle.all_variants : enrichment.all_variants,
        wheelbase_mm: vehicle.wheelbase_mm ?? enrichment.wheelbase_mm ?? null,
    }
}

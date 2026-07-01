import {
    deleteUsedThreeWheeler,
    getUsedThreeWheelerById,
    updateUsedThreeWheeler,
} from '@/lib/db/three-wheelers'
import { db } from '@/lib/db/query-helpers'
import { createUsedVehicleDetailRouteHandlers } from '@/lib/services/vehicle-inventory-route-service'
import type { ThreeWheelerUsedVehicle } from '@/lib/types/three-wheeler'
import { brandNameToId, isUsableVehicleImageUrl } from '@/lib/utils/brand-model-images'
import { get3wVehicleImageUrls } from '@/lib/utils/resolve-3w-images'

type GenericUsedThreeWheelerRow = {
    id: string
    dealer_id: string
    make: string | null
    model: string | null
    variant: string | null
    year: number | null
    price_paise: number | null
    image_url: string | null
    image_urls: string[] | null
    fuel_type: string | null
    body_type: string | null
    seating_capacity: number | null
    mileage_km: number | null
    condition: 'used' | 'certified_pre_owned' | 'new' | null
    description: string | null
    created_at: string | null
}

function genericRowToUsedThreeWheeler(row: GenericUsedThreeWheelerRow): ThreeWheelerUsedVehicle {
    const brand = String(row.make ?? '').trim()
    const model = String(row.model ?? '').trim()
    const uploadedImages = [
        row.image_url,
        ...(Array.isArray(row.image_urls) ? row.image_urls : []),
    ].filter(isUsableVehicleImageUrl)
    const resolvedImages = get3wVehicleImageUrls(brandNameToId(brand, '3w'), model)
    const images = Array.from(new Set([...resolvedImages, ...uploadedImages].filter(isUsableVehicleImageUrl)))
    const body = String(row.body_type ?? '').toLowerCase()
    const fuel = String(row.fuel_type ?? '').toLowerCase()

    return {
        id: row.id,
        dealer_id: row.dealer_id,
        type: body.includes('cargo') ? 'cargo' : fuel.includes('electric') ? 'electric' : 'passenger',
        brand,
        model,
        variant: row.variant ?? null,
        year: row.year ?? new Date().getFullYear(),
        fuel_type: fuel.includes('electric') ? 'electric' : fuel.includes('cng') ? 'cng' : fuel.includes('diesel') ? 'diesel' : 'petrol',
        km_driven: row.mileage_km ?? 0,
        no_of_owners: 1,
        condition_grade: null,
        rc_status: null,
        vehicle_reg_no: null,
        permit_valid_until: null,
        fitness_certificate_valid: null,
        insurance_valid_until: null,
        inspection_report_url: null,
        certified_pre_owned: row.condition === 'certified_pre_owned',
        payload_kg: null,
        body_type: row.body_type as ThreeWheelerUsedVehicle['body_type'],
        passenger_capacity: row.seating_capacity ?? null,
        price_paise: row.price_paise ?? 0,
        negotiable: false,
        images,
        description: row.description,
        video_url: null,
        is_featured: false,
        status: 'available',
        created_at: row.created_at ?? new Date().toISOString(),
        updated_at: row.created_at ?? new Date().toISOString(),
    }
}

async function getUsedThreeWheelerByIdWithGenericFallback(id: string, dealerId?: string) {
    const vehicle = await getUsedThreeWheelerById(id, dealerId)
    if (vehicle || !dealerId) return vehicle

    const { data, error } = await db()
        .from('vehicles')
        .select('id, dealer_id, make, model, variant, year, price_paise, image_url, image_urls, fuel_type, body_type, seating_capacity, mileage_km, condition, description, created_at')
        .eq('id', id)
        .eq('dealer_id', dealerId)
        .eq('status', 'available')
        .single()

    if (error || !data) return null
    const row = data as GenericUsedThreeWheelerRow
    if (row.condition !== 'used' && row.condition !== 'certified_pre_owned') return null
    return genericRowToUsedThreeWheeler(row)
}

const handlers = createUsedVehicleDetailRouteHandlers({
    vehicleType: 'three-wheeler',
    getVehicleById: getUsedThreeWheelerByIdWithGenericFallback,
    updateVehicle: updateUsedThreeWheeler,
    deleteVehicle: deleteUsedThreeWheeler,
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

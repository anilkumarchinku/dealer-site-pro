/**
 * GET    /api/two-wheelers/used/[id]  — Public: get single used vehicle
 * PUT    /api/two-wheelers/used/[id]  — Dealer: update used vehicle
 * DELETE /api/two-wheelers/used/[id]  — Dealer: mark vehicle as sold
 */

import {
    deleteUsedTwoWheeler,
    getUsedTwoWheelerById,
    updateUsedTwoWheeler,
} from '@/lib/db/two-wheelers'
import { db } from '@/lib/db/query-helpers'
import { createUsedVehicleDetailRouteHandlers } from '@/lib/services/vehicle-inventory-route-service'
import type { TwoWheelerUsedVehicle } from '@/lib/types/two-wheeler'
import { brandNameToId, getVehicleImageUrls, isUsableVehicleImageUrl } from '@/lib/utils/brand-model-images'

type GenericUsedTwoWheelerRow = {
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
    mileage_km: number | null
    condition: 'used' | 'certified_pre_owned' | 'new' | null
    description: string | null
    created_at: string | null
}

function genericRowToUsedTwoWheeler(row: GenericUsedTwoWheelerRow): TwoWheelerUsedVehicle {
    const brand = String(row.make ?? '').trim()
    const model = String(row.model ?? '').trim()
    const uploadedImages = [
        row.image_url,
        ...(Array.isArray(row.image_urls) ? row.image_urls : []),
    ].filter(isUsableVehicleImageUrl)
    const resolvedImages = getVehicleImageUrls('2w', brandNameToId(brand, '2w'), model)
    const images = Array.from(new Set([...resolvedImages, ...uploadedImages].filter(isUsableVehicleImageUrl)))
    const body = String(row.body_type ?? '').toLowerCase()
    const fuel = String(row.fuel_type ?? '').toLowerCase()

    return {
        id: row.id,
        dealer_id: row.dealer_id,
        type: body.includes('scooter') ? 'scooter' : fuel.includes('electric') ? 'electric' : 'bike',
        brand,
        model,
        variant: row.variant ?? null,
        year: row.year ?? new Date().getFullYear(),
        fuel_type: fuel.includes('electric') ? 'electric' : 'petrol',
        km_driven: row.mileage_km ?? 0,
        no_of_owners: 1,
        condition_grade: null,
        rc_status: null,
        insurance_valid_until: null,
        inspection_report_url: null,
        certified_pre_owned: row.condition === 'certified_pre_owned',
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

async function getUsedTwoWheelerByIdWithGenericFallback(id: string, dealerId?: string) {
    const vehicle = await getUsedTwoWheelerById(id, dealerId)
    if (vehicle || !dealerId) return vehicle

    const { data, error } = await db()
        .from('vehicles')
        .select('id, dealer_id, make, model, variant, year, price_paise, image_url, image_urls, fuel_type, body_type, mileage_km, condition, description, created_at')
        .eq('id', id)
        .eq('dealer_id', dealerId)
        .eq('status', 'available')
        .single()

    if (error || !data) return null
    const row = data as GenericUsedTwoWheelerRow
    if (row.condition !== 'used' && row.condition !== 'certified_pre_owned') return null
    return genericRowToUsedTwoWheeler(row)
}

const handlers = createUsedVehicleDetailRouteHandlers({
    vehicleType: 'two-wheeler',
    getVehicleById: getUsedTwoWheelerByIdWithGenericFallback,
    updateVehicle: updateUsedTwoWheeler,
    deleteVehicle: deleteUsedTwoWheeler,
})

export const GET = handlers.GET
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE

/**
 * lib/data/cars.ts
 * Car catalog helpers — static make list + server-side DB queries.
 * Used by filter components (getAllMakes) and site pages (getCarsByMake).
 */

import { createClient } from '@supabase/supabase-js'
import type { Car } from '@/lib/types/car'

// ── Static makes list ─────────────────────────────────────────────────────────

export const CAR_MAKES = [
    'Audi',
    'Bentley',
    'BMW',
    'BYD',
    'Citroen',
    'Force Motors',
    'Honda',
    'Hyundai',
    'Isuzu',
    'Jaguar',
    'Jeep',
    'Kia',
    'Lamborghini',
    'Land Rover',
    'Lexus',
    'Mahindra',
    'Maruti Suzuki',
    'Mercedes-Benz',
    'MG',
    'MINI',
    'Nissan',
    'Porsche',
    'Renault',
    'Skoda',
    'Tata Motors',
    'Toyota',
    'Volkswagen',
    'Volvo',
] as const

export type CarMake = (typeof CAR_MAKES)[number]

/** Returns all available car makes for filter UI. */
export function getAllMakes(): string[] {
    return [...CAR_MAKES]
}

// ── Fallback empty array (used when DB is unavailable) ────────────────────────
export const allCars: Car[] = []

// ── Server-side DB helpers ────────────────────────────────────────────────────

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key || url.includes('placeholder')) return null
    return createClient(url, key)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function catalogRowToCar(row: any): Car {
    const minPrice = Math.round((row.price_min_paise ?? 0) / 100)
    const maxPrice = Math.round((row.price_max_paise ?? 0) / 100)
    return {
        id:       row.id,
        make:     row.make,
        model:    row.model,
        variant:  row.variant ?? '',
        year:     row.year ?? new Date().getFullYear(),
        bodyType: row.body_type ?? 'SUV',
        segment:  'B' as Car['segment'],
        pricing: {
            exShowroom: {
                min:      minPrice || null,
                max:      maxPrice || null,
                currency: 'INR' as const,
            },
        },
        engine: {
            type:   row.fuel_type ?? 'Petrol',
            power:  '—',
            torque: '—',
        },
        transmission: {
            type: row.transmission ?? 'Manual',
        },
        performance: {},
        dimensions: {
            seatingCapacity: row.seating_capacity ?? 5,
        },
        features: { keyFeatures: [] },
        images: {
            hero:     row.image_url ?? '/placeholder-car.jpg',
            exterior: row.image_url ? [row.image_url] : [],
            interior: [],
        },
        meta: {
            lastUpdated: row.scraped_at ?? undefined,
            sourceUrl:   row.source_url ?? undefined,
            isAvailable: row.is_active ?? true,
        },
        price: minPrice
            ? `₹${minPrice.toLocaleString('en-IN')}`
            : undefined,
    }
}

/**
 * Fetch up to 24 cars from the car_catalog table for a given make.
 * Returns [] if the DB is unavailable or the make is not found.
 */
export async function getCarsByMake(make: string): Promise<Car[]> {
    if (!make) return []
    const supabase = getSupabase()
    if (!supabase) return []

    const { data, error } = await supabase
        .from('car_catalog')
        .select('*')
        .ilike('make', make)
        .eq('is_active', true)
        .order('year', { ascending: false })
        .limit(24)

    if (error || !data) return []
    return data.map(catalogRowToCar)
}

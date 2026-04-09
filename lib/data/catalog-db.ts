/**
 * lib/data/catalog-db.ts
 * DB-backed catalog fetchers for 2W and 3W.
 * Reads from tw_catalog and thw_catalog Supabase tables.
 * Replaces the JSON-file-based getTwoWheelerCatalog / getThreeWheelerCatalog.
 */

import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { TwoWheelerVehicle } from '@/lib/types/two-wheeler'
import type { ThreeWheelerVehicle } from '@/lib/types/three-wheeler'

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key || url.includes('placeholder')) return null
    return createClient(url, key)
}

// ── Brand name mapping: brand-models.json names → tw_catalog make names ────────

const TW_MAKE_MAP: Record<string, string> = {
    // Traditional
    'Hero MotoCorp':                  'Hero',
    'Honda Motorcycle & Scooter India': 'Honda',
    'TVS Motor Company':              'TVS',
    'Bajaj Auto':                     'Bajaj',
    'Royal Enfield':                  'Royal Enfield',
    'Yamaha India':                   'Yamaha',
    'Suzuki Motorcycle India':        'Suzuki',
    'KTM India':                      'KTM',
    'Kawasaki India':                 'Kawasaki',
    'Triumph India':                  'Triumph',
    'Ducati India':                   'Ducati',
    'BMW Motorrad India':             'BMW Motorrad',
    'Harley-Davidson India':          'Harley-Davidson',
    'Indian Motorcycle':              'Indian',
    'Aprilia India':                  'Aprilia',
    'Vespa India':                    'Vespa',
    'Husqvarna India':                'Husqvarna',
    'Jawa Motorcycles':               'Jawa',
    'Yezdi Motorcycles':              'Yezdi',
    'Benelli India':                  'Benelli',
    'Moto Guzzi':                     'Moto Guzzi',
    // Electric
    'Ola Electric':                   'Ola Electric',
    'Ather Energy':                   'Ather Energy',
    'Bajaj Chetak':                   'Bajaj Chetak',
    'TVS iQube':                      'TVS',
    'Hero Electric':                  'Hero Electric',
    'Vida (Hero MotoCorp)':           'Vida',
    'Revolt Motors':                  'Revolt',
    'Okinawa Autotech':               'Okinawa',
    'Ampere (Greaves Electric)':      'Ampere',
    'Tork Motors':                    'Tork Motors',
    'Ultraviolette Automotive':       'Ultraviolette',
    'Simple Energy':                  'Simple Energy',
    'Kabira Mobility':                'Kabira Mobility',
    'Pure EV':                        'Pure EV',
    'Matter':                         'Matter',
    'Hop Electric':                   'Hop Electric',
    'Okaya EV (OPG Mobility)':        'Okaya EV',
    'Oben Electric':                  'Oben Electric',
    'Lectrix EV':                     'Lectrix EV',
    'River':                          'River',
    'Odysse Electric':                'Odysse Electric',
    'Joy e-bike':                     'Joy e-bike',
    'Komaki':                         'Komaki',
    'Bounce Infinity':                'Bounce Infinity',
    'Quantum Energy':                 'Quantum Energy',
    'Yulu':                           'Yulu',
}

const THW_MAKE_MAP: Record<string, string> = {
    'Bajaj Auto (3W)':        'Bajaj',
    'Piaggio Ape':            'Piaggio Ape',
    'TVS King':               'TVS',
    'Mahindra (3W)':          'Mahindra',
    'Atul Auto':              'Atul',
    'Kinetic Green':          'Kinetic Green',
    'Lohia Auto':             'Lohia Auto',
    'Euler Motors':           'Euler',
    'Greaves Electric Mobility': 'Greaves',
}

function resolveTwMake(brand: string): string {
    if (TW_MAKE_MAP[brand]) return TW_MAKE_MAP[brand]
    // Fallback: try partial match
    for (const [key, val] of Object.entries(TW_MAKE_MAP)) {
        if (key.toLowerCase().includes(brand.toLowerCase()) || brand.toLowerCase().includes(key.toLowerCase())) {
            return val
        }
    }
    return brand
}

function resolveThwMake(brand: string): string {
    if (THW_MAKE_MAP[brand]) return THW_MAKE_MAP[brand]
    for (const [key, val] of Object.entries(THW_MAKE_MAP)) {
        if (key.toLowerCase().includes(brand.toLowerCase()) || brand.toLowerCase().includes(key.toLowerCase())) {
            return val
        }
    }
    return brand
}

function fuelTypeToTw(fuel: string | null): TwoWheelerVehicle['fuel_type'] {
    if (!fuel) return 'petrol'
    const f = fuel.toLowerCase()
    if (f === 'electric') return 'electric'
    return 'petrol'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function twRowToVehicle(row: any, dealerId: string): TwoWheelerVehicle {
    const fuel = fuelTypeToTw(row.fuel_type)
    const isElectric = fuel === 'electric'
    const bodyType = (row.body_type ?? '').toLowerCase()
    const type: TwoWheelerVehicle['type'] = isElectric
        ? 'electric'
        : bodyType.includes('scooter') ? 'scooter' : 'bike'

    return {
        id:                      row.id,
        dealer_id:               dealerId,
        type,
        brand:                   row.make,
        model:                   row.model,
        variant:                 row.variant ?? null,
        year:                    row.year ?? new Date().getFullYear(),
        engine_cc:               row.engine_cc ?? null,
        battery_kwh:             null,
        fuel_type:               fuel,
        max_power:               null,
        torque:                  null,
        mileage_kmpl:            row.mileage_kmpl ? parseFloat(row.mileage_kmpl) : null,
        range_km:                row.range_km ?? null,
        top_speed_kmph:          row.top_speed_kmph ?? null,
        transmission:            null,
        colors:                  [],
        ex_showroom_price_paise: row.price_min_paise ?? 0,
        on_road_price_paise:     null,
        emi_starting_paise:      null,
        stock_status:            'available',
        images:                  row.image_url ? [row.image_url] : [],
        brochure_url:            null,
        bs6_compliant:           false,
        fame_subsidy_eligible:   isElectric,
        charging_time_hours:     null,
        battery_warranty_years:  null,
        description:             null,
        features:                [],
        video_url:               null,
        is_featured:             (row.popularity_score ?? 0) >= 8,
        status:                  row.is_active ? 'active' : 'inactive',
        views:                   0,
        created_at:              row.created_at ?? new Date().toISOString(),
        updated_at:              row.updated_at ?? new Date().toISOString(),
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function thwRowToVehicle(row: any, dealerId: string): ThreeWheelerVehicle {
    const fuelRaw = (row.fuel_type ?? '').toLowerCase()
    const fuel = (['petrol', 'diesel', 'cng', 'electric', 'lpg'].includes(fuelRaw) ? fuelRaw : 'petrol') as ThreeWheelerVehicle['fuel_type']
    const isElectric = fuel === 'electric'
    const type: ThreeWheelerVehicle['type'] = isElectric
        ? 'electric'
        : (row.passenger_capacity ?? 0) > 0 ? 'passenger' : 'cargo'

    return {
        id:                      row.id,
        dealer_id:               dealerId,
        type,
        brand:                   row.make,
        model:                   row.model,
        variant:                 row.variant ?? null,
        year:                    row.year ?? new Date().getFullYear(),
        body_type:               null,
        fuel_type:               fuel,
        engine_cc:               row.engine_cc ?? null,
        max_power:               null,
        torque:                  null,
        battery_kwh:             null,
        range_km:                row.range_km ?? null,
        charging_time_hours:     null,
        battery_warranty_years:  null,
        transmission:            'Automatic',
        payload_kg:              row.payload_kg ?? null,
        passenger_capacity:      row.passenger_capacity ?? null,
        max_speed_kmph:          null,
        mileage_kmpl:            row.mileage_kmpl ? parseFloat(row.mileage_kmpl) : null,
        cng_mileage_km_per_kg:   null,
        permit_type:             null,
        gvw_kg:                  null,
        fame_subsidy_eligible:   isElectric,
        bs6_compliant:           false,
        ex_showroom_price_paise: row.price_min_paise ?? 0,
        on_road_price_paise:     null,
        emi_starting_paise:      null,
        stock_status:            'available',
        colors:                  [],
        images:                  row.image_url ? [row.image_url] : [],
        brochure_url:            null,
        description:             null,
        features:                [],
        video_url:               null,
        is_featured:             (row.popularity_score ?? 0) >= 8,
        status:                  row.is_active ? 'active' : 'inactive',
        views:                   0,
        created_at:              row.created_at ?? new Date().toISOString(),
        updated_at:              row.updated_at ?? new Date().toISOString(),
    }
}

/**
 * Fetch 2W catalog for a brand from tw_catalog table.
 * Returns active models sorted by popularity then model name.
 */
export async function getTwoWheelerCatalogFromDB(
    brand: string,
    dealerId: string
): Promise<TwoWheelerVehicle[]> {
    const supabase = getSupabase()
    if (!supabase) return []

    const dbMake = resolveTwMake(brand)

    const { data, error } = await supabase
        .from('tw_catalog')
        .select('*')
        .ilike('make', dbMake)
        .eq('is_active', true)
        .order('popularity_score', { ascending: false })
        .order('model', { ascending: true })
        .limit(100)

    if (error || !data) return []
    return data.map(row => twRowToVehicle(row, dealerId))
}

/**
 * Fetch 3W catalog for a brand from thw_catalog table.
 */
export async function getThreeWheelerCatalogFromDB(
    brand: string,
    dealerId: string
): Promise<ThreeWheelerVehicle[]> {
    const supabase = getSupabase()
    if (!supabase) return []

    const dbMake = resolveThwMake(brand)

    const { data, error } = await supabase
        .from('thw_catalog')
        .select('*')
        .ilike('make', dbMake)
        .eq('is_active', true)
        .order('popularity_score', { ascending: false })
        .order('model', { ascending: true })
        .limit(100)

    if (error || !data) return []
    return data.map(row => thwRowToVehicle(row, dealerId))
}

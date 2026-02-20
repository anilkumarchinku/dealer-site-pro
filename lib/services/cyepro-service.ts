/**
 * Cyepro Vehicle Inventory API Service
 *
 * Server-side only — API key is never exposed to the browser.
 * Base URL  : https://api.cyepro.com
 * Auth      : API-KEY header
 * Service ID: 460
 */

import type { Car, FuelType, TransmissionType } from '@/lib/types/car'

// ── Cyepro API types ──────────────────────────────────────────────────────────

export interface CyeproVehicle {
    id: number
    make: string
    model: string
    vehicleManufactureYear: number
    customerSellingPrice: number
    kiloMeters: number
    fuel: string
    transmission: string
    location: string
    imageUrl: string
    variant: string
    color: string
    regNumber: string
}

export interface CyeproSearchBody {
    page: number
    size: number
    priceMin: number
    priceMax: number
    yearMin: number
    yearMax: number
    vehicleStatusIds: number[]
    kmDrivenMax: number
    daysFilter: null
    sortBy: null | string
    order: 'asc' | 'desc'
}

export interface CyeproSearchResponse {
    vehicles: CyeproVehicle[]
    totalCount: number
    pageNumber: number
    pageSize: number
    totalPages: number
}

export interface CyeproAggregations {
    makes: { name: string; count: number }[]
    models: { make: string; model: string; count: number }[]
    years: { year: number; count: number }[]
}

// ── Constants ─────────────────────────────────────────────────────────────────

const BASE_URL    = 'https://api.cyepro.com'
const SERVICE_ID  = '460'
const TIME_ZONE   = 'Asia/Calcutta'

// Default search params for fetching all active inventory
const DEFAULT_SEARCH: CyeproSearchBody = {
    page:             1,
    size:             30,
    priceMin:         0,
    priceMax:         100_000_000,
    yearMin:          1970,
    yearMax:          new Date().getFullYear() + 1,
    vehicleStatusIds: [],
    kmDrivenMax:      9_999_999,
    daysFilter:       null,
    sortBy:           null,
    order:            'asc',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildHeaders(apiKey: string): HeadersInit {
    return {
        'Content-Type':    'application/json',
        'API-KEY':         apiKey,
        'SERVICE-TYPE-ID': SERVICE_ID,
        'timeZone':        TIME_ZONE,
    }
}

/** Format INR price for display — e.g. 850000 → "₹8.50 Lakh" */
function formatPrice(paise: number): string {
    if (paise >= 10_000_000) return `₹${(paise / 10_000_000).toFixed(2)} Cr`
    if (paise >= 100_000)    return `₹${(paise / 100_000).toFixed(2)} Lakh`
    return `₹${paise.toLocaleString('en-IN')}`
}

/** Normalise fuel string from Cyepro → FuelType */
function normaliseFuel(fuel: string): FuelType {
    const f = (fuel ?? '').toLowerCase()
    if (f.includes('electric'))                    return 'Electric'
    if (f.includes('hybrid'))                      return 'Hybrid'
    if (f.includes('cng') && f.includes('petrol')) return 'Petrol+CNG'
    if (f.includes('cng'))                         return 'CNG'
    if (f.includes('diesel'))                      return 'Diesel'
    return 'Petrol'
}

/** Normalise transmission string from Cyepro → TransmissionType */
function normaliseTransmission(tx: string): TransmissionType {
    const t = (tx ?? '').toLowerCase()
    if (t.includes('auto') || t.includes('cvt')) return 'Automatic'
    if (t.includes('amt'))                        return 'AMT'
    return 'Manual'
}

// ── Mapper: CyeproVehicle → Car ───────────────────────────────────────────────

export function mapCyeproVehicleToCar(v: CyeproVehicle): Car {
    return {
        id:       String(v.id),
        make:     v.make     ?? 'Unknown',
        model:    v.model    ?? 'Vehicle',
        variant:  v.variant  ?? '',
        year:     v.vehicleManufactureYear ?? new Date().getFullYear(),
        bodyType: 'Sedan',        // Cyepro doesn't provide body type — default
        segment:  'B',

        pricing: {
            exShowroom: {
                min:      v.customerSellingPrice,
                max:      v.customerSellingPrice,
                currency: 'INR',
            },
        },

        engine: {
            type:   normaliseFuel(v.fuel),
            power:  '—',
            torque: '—',
        },

        transmission: {
            type: normaliseTransmission(v.transmission),
        },

        performance: {},

        dimensions: {
            seatingCapacity: 5,
        },

        features: {
            keyFeatures: [
                v.color        ? `Colour: ${v.color}`                 : '',
                v.kiloMeters   ? `${v.kiloMeters.toLocaleString()} km driven` : '',
                v.regNumber    ? `Reg: ${v.regNumber}`                : '',
                v.location     ? `Location: ${v.location}`           : '',
            ].filter(Boolean),
        },

        images: {
            hero:     v.imageUrl || '/placeholder-car.jpg',
            exterior: v.imageUrl ? [v.imageUrl] : [],
            interior: [],
        },

        meta: {
            viewCount: 0,
        },

        price: formatPrice(v.customerSellingPrice),
    }
}

// ── API Functions ─────────────────────────────────────────────────────────────

/**
 * Fetch vehicles from the Cyepro inventory API.
 * Returns null on auth/network failure so callers can fall back gracefully.
 */
export async function fetchCyeproVehicles(
    apiKey:  string,
    options: Partial<CyeproSearchBody> = {},
): Promise<CyeproSearchResponse | null> {
    if (!apiKey) return null

    const body: CyeproSearchBody = { ...DEFAULT_SEARCH, ...options }

    try {
        const res = await fetch(
            `${BASE_URL}/dynamicForms/search/vehicles/filterQueryApi`,
            {
                method:  'POST',
                headers: buildHeaders(apiKey),
                body:    JSON.stringify(body),
                // Server-side fetch — use Next.js cache with 5-minute revalidation
                next:    { revalidate: 300 },
            },
        )

        if (res.status === 401) {
            console.error('[Cyepro] Invalid API key')
            return null
        }
        if (res.status === 429) {
            console.error('[Cyepro] Rate limit reached')
            return null
        }
        if (!res.ok) {
            console.error(`[Cyepro] Fetch vehicles failed: ${res.status}`)
            return null
        }

        return (await res.json()) as CyeproSearchResponse
    } catch (err) {
        console.error('[Cyepro] Network error:', err)
        return null
    }
}

/**
 * Fetch aggregations (counts by make/model/year) for building filter UI.
 * Returns null on failure.
 */
export async function fetchCyeproAggregations(
    apiKey: string,
): Promise<CyeproAggregations | null> {
    if (!apiKey) return null

    try {
        const res = await fetch(
            `${BASE_URL}/dynamicForms/search/vehicles/aggregationsApi`,
            {
                method:  'GET',
                headers: buildHeaders(apiKey),
                next:    { revalidate: 300 },
            },
        )

        if (!res.ok) return null
        return (await res.json()) as CyeproAggregations
    } catch {
        return null
    }
}

/**
 * Convenience: fetch Cyepro vehicles and map them to the Car type
 * that templates already understand. Falls back to empty array on error.
 */
export async function fetchCyeproInventoryAsCars(
    apiKey: string,
    options: Partial<CyeproSearchBody> = {},
): Promise<Car[]> {
    const response = await fetchCyeproVehicles(apiKey, options)
    if (!response || !response.vehicles?.length) return []
    return response.vehicles.map(mapCyeproVehicleToCar)
}

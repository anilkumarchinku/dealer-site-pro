/**
 * Cyepro Vehicle Inventory API Service
 *
 * Server-side only — API key is never exposed to the browser.
 * Base URL  : https://api.cyepro.com
 * Auth      : API-KEY header
 * Service ID: 460
 */

import type { Car, FuelType, TransmissionType } from '@/lib/types/car'
import { logger } from '@/lib/utils/logger'

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
        condition: 'used' as const,
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
    if (!apiKey) {
        logger.warn('[Cyepro] No API key provided')
        return null
    }

    const body: CyeproSearchBody = { ...DEFAULT_SEARCH, ...options }

    try {
        logger.log('[Cyepro] Fetching vehicles...', { page: body.page, size: body.size })
        const res = await fetch(
            `${BASE_URL}/dynamicForms/search/vehicles/filterQueryApi`,
            {
                method:  'POST',
                headers: buildHeaders(apiKey),
                body:    JSON.stringify(body),
                cache:   'no-store',  // Don't cache — always fetch fresh data
            },
        )

        logger.log('[Cyepro] Response status:', res.status)

        if (res.status === 401) {
            logger.error('[Cyepro] Invalid API key (401)')
            return null
        }
        if (res.status === 429) {
            logger.error('[Cyepro] Rate limit reached (429)')
            return null
        }
        if (!res.ok) {
            const errorText = await res.text()
            logger.error(`[Cyepro] Fetch failed: ${res.status}`, errorText)
            return null
        }

        const rawData = await res.json()
        logger.log('[Cyepro] Raw response keys:', Object.keys(rawData))

        // Handle different possible response formats from Cyepro API
        const vehicles = rawData.vehicles ?? rawData.data ?? rawData.results ?? rawData.content ?? []
        const totalCount = rawData.totalCount ?? rawData.total ?? rawData.totalElements ?? vehicles.length

        const data: CyeproSearchResponse = {
            vehicles,
            totalCount,
            pageNumber:  rawData.pageNumber  ?? rawData.page     ?? body.page,
            pageSize:    rawData.pageSize    ?? rawData.size     ?? body.size,
            totalPages:  rawData.totalPages  ?? Math.ceil(totalCount / body.size) ?? 1,
        }

        logger.log(`[Cyepro] Fetched ${data.vehicles.length} vehicles (total: ${data.totalCount})`)
        return data
    } catch (err) {
        logger.error('[Cyepro] Network error:', err instanceof Error ? err.message : err)
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
                cache:   'no-store',
            },
        )

        if (!res.ok) return null
        return (await res.json()) as CyeproAggregations
    } catch {
        return null
    }
}

// ── Lead Forwarding ───────────────────────────────────────────────────────────

export interface CyeproLeadPayload {
    customerName:  string
    customerPhone: string
    customerEmail?: string
    vehicleName?:  string
    message?:      string
    leadSource?:   string
}

/**
 * Forward a website lead to Cyepro CRM.
 * Fire-and-forget — call with `.catch(() => {})` to avoid blocking the response.
 */
export async function forwardLeadToCyepro(
    apiKey:  string,
    payload: CyeproLeadPayload,
): Promise<void> {
    if (!apiKey) return

    try {
        const res = await fetch(`${BASE_URL}/dynamicForms/leads`, {
            method:  'POST',
            headers: buildHeaders(apiKey),
            body: JSON.stringify({
                customerName:      payload.customerName,
                customerMobile:    payload.customerPhone,
                customerEmail:     payload.customerEmail ?? '',
                vehicleInterest:   payload.vehicleName  ?? '',
                remarks:           payload.message      ?? '',
                leadSource:        payload.leadSource   ?? 'Website',
            }),
        })

        if (!res.ok) {
            logger.warn(`[Cyepro] Lead forward failed: ${res.status}`)
        } else {
            logger.log('[Cyepro] Lead forwarded successfully')
        }
    } catch (err) {
        logger.warn('[Cyepro] Lead forward error:', err instanceof Error ? err.message : err)
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

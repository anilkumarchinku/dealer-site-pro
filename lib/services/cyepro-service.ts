/**
 * Cyepro Vehicle Inventory API Service
 *
 * Server-side only — API key is never exposed to the browser.
 * Base URL  : https://api.cyepro.com
 * Auth      : API-KEY header
 * Service ID: 460
 */

import type { Car, FuelType, TransmissionType } from '@/lib/types/car'
import { getOptionalEnv } from '@/lib/env'
import { ExternalApiError, externalApiFetch } from '@/lib/services/external-api-fetch'
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

type CyeproRawSearchResponse = Partial<CyeproSearchResponse> & {
    data?: CyeproVehicle[] | Partial<CyeproSearchResponse> & {
        data?: CyeproVehicle[]
        results?: CyeproVehicle[]
        content?: CyeproVehicle[]
        total?: number
        totalElements?: number
    }
    results?: CyeproVehicle[]
    content?: CyeproVehicle[]
    total?: number
    totalElements?: number
    page?: number
    size?: number
    result?: Partial<CyeproSearchResponse>
    response?: Partial<CyeproSearchResponse>
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_BASE_URL = 'https://api.cyepro.com'
const BASE_URL    = normaliseBaseUrl(getOptionalEnv('CYEPRO_API_BASE_URL') ?? DEFAULT_BASE_URL)
const SEARCH_PATH = normalisePath(getOptionalEnv('CYEPRO_SEARCH_PATH') ?? '/dynamicForms/search/vehicles/filterQueryApi')
const AGGREGATIONS_PATH = normalisePath(getOptionalEnv('CYEPRO_AGGREGATIONS_PATH') ?? '/dynamicForms/search/vehicles/aggregationsApi')
const SERVICE_ID  = '460'
const TIME_ZONE   = 'Asia/Calcutta'
const SEARCH_TIMEOUT_MS = 10_000
const LEAD_TIMEOUT_MS = 5_000
const DEFAULT_FETCH_ALL_PAGE_SIZE = 100
const DEFAULT_FETCH_ALL_MAX_VEHICLES = 500

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

function normaliseBaseUrl(value: string): string {
    return value.trim().replace(/\/+$/, '')
}

function normalisePath(value: string): string {
    const path = value.trim()
    return path.startsWith('/') ? path : `/${path}`
}

export function getCyeproApiBaseUrl(): string {
    return BASE_URL
}

export function getCyeproSearchPath(): string {
    return SEARCH_PATH
}

function buildHeaders(apiKey: string): HeadersInit {
    return {
        'Content-Type':    'application/json',
        'API-KEY':         apiKey,
        'SERVICE-TYPE-ID': SERVICE_ID,
        'timeZone':        TIME_ZONE,
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
}

export function getCyeproVehicleArray(source: unknown): CyeproVehicle[] {
    if (Array.isArray(source)) return source as CyeproVehicle[]
    if (!isRecord(source)) return []

    const candidates = [
        source.vehicles,
        source.data,
        source.results,
        source.content,
        isRecord(source.data) ? source.data.vehicles : undefined,
        isRecord(source.data) ? source.data.data : undefined,
        isRecord(source.data) ? source.data.results : undefined,
        isRecord(source.data) ? source.data.content : undefined,
        isRecord(source.result) ? source.result.vehicles : undefined,
        isRecord(source.response) ? source.response.vehicles : undefined,
    ]

    return (candidates.find(Array.isArray) ?? []) as CyeproVehicle[]
}

export function getCyeproNumericValue(source: unknown, keys: string[]): number | undefined {
    if (!isRecord(source)) return undefined

    for (const key of keys) {
        const value = source[key]
        if (typeof value === 'number') return value
    }

    for (const nestedKey of ['data', 'result', 'response']) {
        const nested = source[nestedKey]
        const value = getCyeproNumericValue(nested, keys)
        if (typeof value === 'number') return value
    }

    return undefined
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
        const rawData = await externalApiFetch<CyeproRawSearchResponse>({
            baseUrl: BASE_URL,
            providerName: 'Cyepro',
            path: SEARCH_PATH,
            headers: buildHeaders(apiKey),
            init: {
                method:  'POST',
                body:    JSON.stringify(body),
                cache:   'no-store',  // Don't cache — always fetch fresh data
            },
            timeoutMs: SEARCH_TIMEOUT_MS,
        })
        logger.log('[Cyepro] Raw response keys:', Object.keys(rawData))

        // Handle different possible response formats from Cyepro API.
        // Some accounts return vehicles at the top level, while others wrap
        // them in data/result/response objects.
        const vehicles = getCyeproVehicleArray(rawData)
        const totalCount = getCyeproNumericValue(rawData, ['totalCount', 'total', 'totalElements']) ?? vehicles.length

        const data: CyeproSearchResponse = {
            vehicles,
            totalCount,
            pageNumber:  getCyeproNumericValue(rawData, ['pageNumber', 'page']) ?? body.page,
            pageSize:    getCyeproNumericValue(rawData, ['pageSize', 'size']) ?? body.size,
            totalPages:  getCyeproNumericValue(rawData, ['totalPages']) ?? Math.ceil(totalCount / body.size) ?? 1,
        }

        logger.log(`[Cyepro] Fetched ${data.vehicles.length} vehicles (total: ${data.totalCount})`)
        return data
    } catch (err) {
        if (err instanceof ExternalApiError) {
            if (err.status === 401) {
                logger.error('[Cyepro] Invalid API key (401)')
                return null
            }
            if (err.status === 429) {
                logger.error('[Cyepro] Rate limit reached (429)')
                return null
            }
            if (err.status) {
                logger.error(`[Cyepro] Fetch failed: ${err.status}`, err.bodyText ?? err.message)
                return null
            }
        }
        logger.error('[Cyepro] Network error:', err instanceof Error ? err.message : err)
        return null
    }
}

/**
 * Fetch every available Cyepro inventory page for generated public websites.
 *
 * The Cyepro endpoint is paginated. A single request only returns `size` rows,
 * so public dealer sites must walk the pages to avoid hiding vehicles after
 * the first page. `maxVehicles` is a guardrail against accidental huge loops.
 */
export async function fetchAllCyeproVehicles(
    apiKey: string,
    options: Partial<CyeproSearchBody> = {},
    maxVehicles = DEFAULT_FETCH_ALL_MAX_VEHICLES,
): Promise<CyeproSearchResponse | null> {
    const pageSize = Math.min(
        Math.max(options.size ?? DEFAULT_FETCH_ALL_PAGE_SIZE, 1),
        DEFAULT_FETCH_ALL_PAGE_SIZE,
    )

    const firstPage = await fetchCyeproVehicles(apiKey, {
        ...options,
        page: 1,
        size: pageSize,
    })

    if (!firstPage) return null
    if (!firstPage.vehicles.length || firstPage.totalPages <= 1) return firstPage

    const vehicles = [...firstPage.vehicles]
    const totalPages = Math.min(
        firstPage.totalPages,
        Math.ceil(maxVehicles / pageSize),
    )

    for (let page = (firstPage.pageNumber || 1) + 1; page <= totalPages; page += 1) {
        if (vehicles.length >= maxVehicles) break

        const nextPage = await fetchCyeproVehicles(apiKey, {
            ...options,
            page,
            size: pageSize,
        })

        if (!nextPage?.vehicles.length) break
        vehicles.push(...nextPage.vehicles)
    }

    return {
        ...firstPage,
        vehicles: vehicles.slice(0, maxVehicles),
        pageNumber: 1,
        pageSize,
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
        return await externalApiFetch<CyeproAggregations>({
            baseUrl: BASE_URL,
            providerName: 'Cyepro',
            path: AGGREGATIONS_PATH,
            headers: buildHeaders(apiKey),
            init: {
                method:  'GET',
                cache:   'no-store',
            },
            timeoutMs: SEARCH_TIMEOUT_MS,
        })
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
        await externalApiFetch({
            baseUrl: BASE_URL,
            providerName: 'Cyepro',
            path: '/dynamicForms/leads',
            headers: buildHeaders(apiKey),
            init: {
                method:  'POST',
                body: JSON.stringify({
                    customerName:      payload.customerName,
                    customerMobile:    payload.customerPhone,
                    customerEmail:     payload.customerEmail ?? '',
                    vehicleInterest:   payload.vehicleName  ?? '',
                    remarks:           payload.message      ?? '',
                    leadSource:        payload.leadSource   ?? 'Website',
                }),
            },
            timeoutMs: LEAD_TIMEOUT_MS,
        })

        logger.log('[Cyepro] Lead forwarded successfully')
    } catch (err) {
        if (err instanceof ExternalApiError && err.status) {
            logger.warn(`[Cyepro] Lead forward failed: ${err.status}`)
            return
        }
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

export async function fetchAllCyeproInventoryAsCars(
    apiKey: string,
    options: Partial<CyeproSearchBody> = {},
    maxVehicles?: number,
): Promise<Car[]> {
    const response = await fetchAllCyeproVehicles(apiKey, options, maxVehicles)
    if (!response || !response.vehicles?.length) return []
    return response.vehicles.map(mapCyeproVehicleToCar)
}

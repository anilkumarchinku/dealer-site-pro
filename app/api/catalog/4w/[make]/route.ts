/**
 * GET /api/catalog/4w/[make]
 *
 * Server-side catalog endpoint for the preview page.
 * Uses the admin client so it bypasses RLS and works regardless of
 * browser auth state — safe because it only reads public catalog data.
 *
 * Returns up to 20 unique models for the given make.
 * Falls back to top-8 most recent cars from any brand when the make has 0 rows.
 */

import { NextRequest, NextResponse } from 'next/server'
import { get4WCardekhoBrandMeta, get4WCardekhoModelMeta } from '@/lib/data/4w-cardekho-meta'
import { extract4WModelsFromJson, FOUR_W_BRANDS, normalize4WModelKey } from '@/lib/data/four-wheelers'
import { createAdminClient } from '@/lib/supabase-server'

// Lightweight Car shape — enough for the preview hero card
interface PreviewCar {
    id: string
    make: string
    model: string
    variant: string
    year: number
    bodyType: string | null
    segment: string | null
    vehicleCategory: '4w'
    price: string | undefined
    pricing: { exShowroom: { min: number | null; max: number | null; currency: 'INR' } }
    engine: { type: string; power: string; torque: string }
    transmission: { type: string | null }
    performance: object
    dimensions: { seatingCapacity: number }
    features: { keyFeatures: string[] }
    images: { hero: string | null; exterior: string[]; interior: string[] }
    colors: []
    meta: { isAvailable: boolean }
    condition: 'new'
}

function find4WJsonKey(make: string): string | null {
    const match = FOUR_W_BRANDS.find((brand) => brand.make.toLowerCase() === make.toLowerCase())
    return match?.jsonKey ?? null
}

async function loadBrandJson<T>(request: NextRequest, jsonKey: string): Promise<T | null> {
    try {
        const response = await fetch(new URL(`/data/${jsonKey}.json`, request.url), {
            next: { revalidate: 60 * 60 },
        })
        if (!response.ok) return null
        return await response.json() as T
    } catch {
        return null
    }
}

function jsonModelToPreviewCar(make: string, model: {
    model: string
    imageUrl: string | null
    priceMinInr: number | null
    fuelType: string | null
    transmission: string | null
    seating: number
}): PreviewCar {
    const meta = get4WCardekhoModelMeta(make, model.model)
    const price = model.priceMinInr ?? meta?.priceMinInr ?? null
    const hero = model.imageUrl ?? meta?.imageUrl ?? null

    return {
        id: `json-${make}-${normalize4WModelKey(model.model)}`,
        make,
        model: model.model,
        variant: '',
        year: new Date().getFullYear(),
        bodyType: meta?.bodyType ?? null,
        segment: 'B',
        vehicleCategory: '4w',
        price: price ? `₹${price.toLocaleString('en-IN')}` : undefined,
        pricing: {
            exShowroom: { min: price, max: price, currency: 'INR' },
        },
        engine: {
            type: model.fuelType ?? meta?.fuelType ?? 'Petrol',
            power: '—',
            torque: '—',
        },
        transmission: { type: model.transmission ?? 'Manual' },
        performance: {},
        dimensions: { seatingCapacity: model.seating ?? 5 },
        features: { keyFeatures: [] },
        images: {
            hero,
            exterior: hero ? [hero] : [],
            interior: [],
        },
        colors: [],
        meta: { isAvailable: true },
        condition: 'new',
    }
}

async function getJsonFallbackCars(request: NextRequest, make: string): Promise<PreviewCar[]> {
    const jsonKey = find4WJsonKey(make)
    if (!jsonKey) return []

    const raw = await loadBrandJson<unknown>(request, jsonKey)
    if (!raw) return []

    const models = extract4WModelsFromJson(raw)
    const brandMeta = get4WCardekhoBrandMeta(make)
    const seen = new Set(models.map((entry) => normalize4WModelKey(entry.model)))
    const mergedModels = [...models]

    for (const meta of Object.values(brandMeta?.models ?? {})) {
        const key = normalize4WModelKey(meta.model)
        if (seen.has(key)) continue
        seen.add(key)
        mergedModels.push({
            model: meta.model,
            imageUrl: meta.imageUrl,
            priceMinInr: meta.priceMinInr,
            fuelType: meta.fuelType,
            transmission: null,
            seating: 5,
        })
    }

    return mergedModels
        .slice(0, 20)
        .map((model) => jsonModelToPreviewCar(make, model))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToPreviewCar(row: any): PreviewCar {
    const minPaise = (row.price_min_paise as number | null) ?? 0
    const maxPaise = (row.price_max_paise as number | null) ?? 0
    const minINR = minPaise > 0 ? Math.round(minPaise / 100) : null
    const maxINR = maxPaise > 0 ? Math.round(maxPaise / 100) : null

    return {
        id: String(row.id),
        make: String(row.make),
        model: String(row.model),
        variant: '',
        year: Number(row.year),
        bodyType: (row.body_type as string | null) ?? null,
        segment: (row.segment as string | null) ?? 'B',
        vehicleCategory: '4w',
        price: minINR ? `₹${minINR.toLocaleString('en-IN')}` : undefined,
        pricing: {
            exShowroom: { min: minINR, max: maxINR, currency: 'INR' },
        },
        engine: {
            type: (row.fuel_type as string | null) ?? 'Petrol',
            power: '—',
            torque: '—',
        },
        transmission: { type: (row.transmission as string | null) ?? 'Manual' },
        performance: {},
        dimensions: { seatingCapacity: (row.seating_capacity as number | null) ?? 5 },
        features: { keyFeatures: [] },
        images: {
            hero: (row.image_url as string | null) ?? null,
            exterior: (row.image_url as string | null) ? [(row.image_url as string)] : [],
            interior: [],
        },
        colors: [],
        meta: { isAvailable: true },
        condition: 'new',
    }
}

// Group raw rows by model — keep the row with the lowest price per model
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function groupByModel(rows: any[]): any[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map = new Map<string, any>()
    for (const row of rows) {
        const key = `${row.make}|${row.model}`
        if (!map.has(key)) {
            map.set(key, row)
        } else {
            const existing = map.get(key)!
            const rowMin = (row.price_min_paise as number | null) ?? 0
            const existMin = (existing.price_min_paise as number | null) ?? 0
            if (rowMin > 0 && (existMin === 0 || rowMin < existMin)) {
                map.set(key, row)
            }
        }
    }
    return Array.from(map.values())
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ make: string }> }
) {
    const { make } = await params
    const decodedMake = decodeURIComponent(make || '')

    if (!decodedMake) {
        return NextResponse.json({ cars: [] })
    }

    const supabase = createAdminClient()

    // Fetch variants for the requested make
    const { data: makeData, error: makeError } = await supabase
        .from('car_catalog')
        .select('id, make, model, year, body_type, fuel_type, transmission, seating_capacity, price_min_paise, price_max_paise, image_url, is_active')
        .eq('make', decodedMake)
        .eq('is_active', true)
        .order('year', { ascending: false })
        .limit(100)

    const makeRows = ((makeData ?? []) as unknown) as Array<Record<string, unknown>>
    const makeRowsHavePrice = makeRows.some((row) => {
        const priceMinPaise = row.price_min_paise
        return typeof priceMinPaise === 'number' && priceMinPaise > 0
    })

    if (!makeError && makeRows.length > 0 && makeRowsHavePrice) {
        const cars = groupByModel(makeRows).slice(0, 20).map(rowToPreviewCar)
        return NextResponse.json({ cars })
    }

    const jsonFallbackCars = await getJsonFallbackCars(req, decodedMake)
    if (jsonFallbackCars.length > 0) {
        return NextResponse.json({ cars: jsonFallbackCars })
    }

    // Fallback: return the top 8 most recent active cars from any brand
    // so the preview hero always has something to show
    const { data: fallbackData } = await supabase
        .from('car_catalog')
        .select('id, make, model, year, body_type, fuel_type, transmission, seating_capacity, price_min_paise, price_max_paise, image_url, is_active')
        .eq('is_active', true)
        .order('year', { ascending: false })
        .limit(8)

    const cars = (fallbackData ?? []).map(rowToPreviewCar)
    return NextResponse.json({ cars })
}

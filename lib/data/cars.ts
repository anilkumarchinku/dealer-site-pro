/**
 * lib/data/cars.ts
 * Server-only car catalog helpers — DB queries + brand image loading.
 * Uses Node.js `fs`/`path` — CANNOT be imported by client components.
 *
 * Client-safe static exports (CAR_MAKES, getAllMakes, allCars) live in
 * cars-static.ts — import from there in client components.
 */

import 'server-only'
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import type { Car } from '@/lib/types/car'
import { brandNameToId, getScrapedImageFallback } from '@/lib/utils/brand-model-images'
import { extract4WModelsFromJson, normalize4WModelKey } from '@/lib/data/four-wheelers'
import { get4WCardekhoBrandMeta, get4WCardekhoModelMeta } from '@/lib/data/4w-cardekho-meta'

// Re-export static client-safe exports so server code can still use one import
export { CAR_MAKES, getAllMakes, allCars } from '@/lib/data/cars-static'
export type { CarMake } from '@/lib/data/cars-static'

// ── Brand JSON image lookup (server-side only) ────────────────────────────────

const MAKE_TO_JSON: Record<string, string> = {
    'tata motors': 'tata',
    'tata': 'tata',
    'hyundai': 'hyundai',
    'maruti suzuki': 'maruti_suzuki',
    'honda': 'honda',
    'kia': 'kia',
    'mahindra': 'mahindra',
    'toyota': 'toyota',
    'volkswagen': 'volkswagen',
    'skoda': 'skoda',
    'mg': 'mg',
    'renault': 'renault',
    'nissan': 'nissan',
    'bmw': 'bmw',
    'audi': 'audi',
    'mercedes-benz': 'mercedes',
    'mercedes': 'mercedes',
    'jeep': 'jeep',
    'isuzu': 'isuzu',
    'land rover': 'land_rover',
    'jaguar': 'jaguar',
    'lexus': 'lexus',
    'mini': 'mini',
    'volvo': 'volvo',
    'porsche': 'porsche',
    // Brands added 2026-04-07 — JSON files exist with image_urls
    'aston martin': 'aston_martin',
    'bentley': 'bentley',
    'byd': 'byd',
    'citroen': 'citroen',
    'ferrari': 'ferrari',
    'force motors': 'force',
    'lamborghini': 'lamborghini',
    'maserati': 'maserati',
    'rolls-royce': 'rolls_royce',
    'vinfast': 'vinfast',
}

/** Read a JSON file from public/data/ directly via filesystem (no HTTP round-trip). */
function readPublicJson<T>(pathname: string): T | null {
    try {
        const filePath = path.join(process.cwd(), 'public', pathname.replace(/^\//, ''))
        const content = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(content) as T
    } catch {
        return null
    }
}

function getLocal4WImage(make: string, model: string): string | null {
    return getScrapedImageFallback('4w', brandNameToId(make, '4w'), model)
}

export function getLocal2WImage(brand: string, model: string): string | null {
    return getScrapedImageFallback('2w', brandNameToId(brand, '2w'), model)
}

export function getLocal3WImage(brand: string, model: string): string | null {
    return getScrapedImageFallback('3w', brandNameToId(brand, '3w'), model)
}

// ── JSON-based catalog fallback (mirrors admin catalog/page.tsx load4W logic) ─

function parsePriceINR(priceStr: string): number {
    return parseInt(String(priceStr).replace(/[^0-9]/g, ''), 10) || 0
}

/**
 * Load 4W models from brand JSON when DB is empty.
 * Uses the same recursive walk() pattern as the admin catalog page (load4W).
 * Falls back to local committed images for models without a CDN image.
 */
async function getCarsByMakeFromJson(make: string): Promise<Car[]> {
    const jsonKey = MAKE_TO_JSON[make.toLowerCase()]
    if (!jsonKey) return []

    try {
        const raw = readPublicJson<unknown>(`/data/${jsonKey}.json`)
        if (!raw) return []

        const localModels = extract4WModelsFromJson(raw)
        const brandMeta = get4WCardekhoBrandMeta(make)
        const collected = localModels.map((model) => {
            const meta = get4WCardekhoModelMeta(make, model.model)
            return {
                model: model.model,
                cdnImg: (model.imageUrl && !model.imageUrl.includes('spacer')) ? model.imageUrl : (meta?.imageUrl ?? null),
                price: model.priceMinInr ?? meta?.priceMinInr ?? null,
                fuel: model.fuelType ?? meta?.fuelType ?? null,
                transmission: model.transmission ?? null,
                seating: model.seating ?? 5,
                bodyType: meta?.bodyType ?? null,
                sourceUrl: meta?.sourceUrl ?? null,
            }
        })

        const seen = new Set(collected.map((model) => normalize4WModelKey(model.model)))
        for (const meta of Object.values(brandMeta?.models ?? {})) {
            const key = normalize4WModelKey(meta.model)
            if (seen.has(key)) continue
            seen.add(key)
            collected.push({
                model: meta.model,
                cdnImg: meta.imageUrl,
                price: meta.priceMinInr,
                fuel: meta.fuelType,
                transmission: null,
                seating: 5,
                bodyType: meta.bodyType ?? null,
                sourceUrl: meta.sourceUrl ?? null,
            })
        }

        return collected.map((m, idx) => {
            // Prefer local image (always available, no hotlink issues) over CDN
            const localUrl = getLocal4WImage(make, m.model)
            const heroImg  = localUrl ?? m.cdnImg ?? '/placeholder-car.jpg'
            const minPrice = typeof m.price === 'number' ? m.price : parsePriceINR(m.price ?? '')

            return {
                id: `json-${jsonKey}-${idx}`,
                make,
                model: m.model,
                variant: '',
                year: new Date().getFullYear(),
                bodyType: (m.bodyType ?? 'Other') as Car['bodyType'],
                segment: 'B' as Car['segment'],
                vehicleCategory: '4w' as const,
                pricing: {
                    exShowroom: {
                        min: minPrice || null,
                        max: minPrice || null,
                        currency: 'INR' as const,
                    },
                },
                engine: {
                    type: (m.fuel ?? 'Petrol') as Car['engine']['type'],
                    power: '—',
                    torque: '—',
                },
                transmission: { type: (m.transmission ?? 'Manual') as Car['transmission']['type'] },
                performance: {},
                dimensions: { seatingCapacity: m.seating },
                features: { keyFeatures: [] },
                images: {
                    hero: heroImg,
                    exterior: heroImg !== '/placeholder-car.jpg' ? [heroImg] : [],
                    interior: [],
                },
                meta: {
                    sourceUrl: m.sourceUrl ?? undefined,
                    dataSource: m.sourceUrl ? 'CarDekho' : undefined,
                },
                price: minPrice ? `₹${minPrice.toLocaleString('en-IN')}` : undefined,
            }
        })
    } catch {
        return []
    }
}

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
    const normalizedBodyType = get4WCardekhoModelMeta(row.make, row.model)?.bodyType ?? row.body_type ?? 'Other'
    return {
        id:       row.id,
        make:     row.make,
        model:    row.model,
        variant:  row.variant ?? '',
        year:     row.year ?? new Date().getFullYear(),
        bodyType: normalizedBodyType,
        segment:  'B' as Car['segment'],
        vehicleCategory: '4w' as const,
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
        performance: {
            fuelEfficiency: row.fuel_efficiency ?? row.mileage ?? null,
            range: row.range_km ?? null,
        },
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
 * Returns all models for a given make.
 * Always reads from the brand JSON file — same source as the admin catalog page.
 * This guarantees dealers see all correct models/variants matching what admin shows.
 */
export async function getCarsByMake(make: string): Promise<Car[]> {
    if (!make) return []
    return await getCarsByMakeFromJson(make)
}

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

/** Returns a map of lowercase model name → CardDekho image URL, read from brand JSON.
 *  Uses a recursive tree walker so it handles all brand JSON formats:
 *  - { items: [{model, image_urls}] }            BMW, Audi
 *  - { brand: [{model, image_urls}] }            VW, Skoda, Toyota, MG, Renault, Nissan, KIA, Mahindra
 *  - { brand: { '0': {model_name, image_urls} } } Mercedes
 *  - { brand: { variants: [{model, image_urls}] } } Jeep
 *  - { brand: { models: [{model, variants:[{image_urls}]}] } } Honda
 *  - [ { '0': [variants_with_model+image_urls] } ]  Tata, Hyundai
 *  - flat array of variants without model (Maruti) → extracted from image URL
 */
function loadBrandImageMap(make: string): Record<string, string> {
    const jsonKey = MAKE_TO_JSON[make.toLowerCase()]
    if (!jsonKey) return {}
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', `${jsonKey}.json`)
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        const map: Record<string, string> = {}

        const getImg = (imgUrls: unknown): string | null => {
            if (!Array.isArray(imgUrls)) return null
            const u = imgUrls.find((x: unknown) => {
                const obj = x as Record<string, unknown>
                return typeof obj.value === 'string' && obj.value.startsWith('http')
            }) as Record<string, string> | undefined
            return u?.value ?? null
        }

        // Recursive walker — passes parent model name as context for nested formats
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function walk(node: any, ctxModel?: string): void {
            if (!node || typeof node !== 'object') return
            if (Array.isArray(node)) { node.forEach((n: unknown) => walk(n, ctxModel)); return }
            const model: string | undefined = node.model || node.model_name || ctxModel
            const imgUrl = getImg(node.image_urls)
            if (model && imgUrl && !map[model.toLowerCase()]) map[model.toLowerCase()] = imgUrl
            for (const [k, v] of Object.entries(node)) {
                if (k === 'image_urls') continue
                if (v && typeof v === 'object') walk(v, model ?? ctxModel)
            }
        }

        walk(raw)

        // Fallback for Maruti-style flat arrays (no model field) — extract model from image URL
        // e.g. stimg.cardekho.com/…/Maruti/Grand-Vitara/… → "Grand Vitara"
        if (Object.keys(map).length === 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            function collectImageUrls(node: any): void {
                if (!node || typeof node !== 'object') return
                if (Array.isArray(node)) { node.forEach(collectImageUrls); return }
                const imgUrl = getImg(node.image_urls)
                if (imgUrl) {
                    const m = imgUrl.match(/\/([A-Z][^/]+)\/\d{4,}\//)
                    if (m) {
                        const modelName = m[1].replace(/-/g, ' ')
                        if (!map[modelName.toLowerCase()]) map[modelName.toLowerCase()] = imgUrl
                    }
                }
                for (const [k, v] of Object.entries(node)) {
                    if (k === 'image_urls') continue
                    if (v && typeof v === 'object') collectImageUrls(v)
                }
            }
            collectImageUrls(raw)
        }

        return map
    } catch {
        return {}
    }
}

// ── Local 4W image resolver ───────────────────────────────────────────────────

/** Same slug logic used when scraping: lowercase, remove periods, spaces→hyphens */
function toSlug(s: string): string {
    return s.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/** Folder name for a car make inside public/data/brand-model-images/4w/ */
const MAKE_TO_FOLDER_4W: Record<string, string> = {
    'aston martin': 'aston-martin',
    'audi': 'audi',
    'bentley': 'bentley',
    'bmw': 'bmw',
    'byd': 'byd',
    'citroen': 'citroen',
    'ferrari': 'ferrari',
    'force motors': 'force-motors',
    'force': 'force',
    'honda': 'honda',
    'hyundai': 'hyundai',
    'isuzu': 'isuzu',
    'jaguar': 'jaguar',
    'jeep': 'jeep',
    'kia': 'kia',
    'lamborghini': 'lamborghini',
    'land rover': 'land-rover',
    'lexus': 'lexus',
    'mahindra': 'mahindra',
    'maserati': 'maserati',
    'maruti suzuki': 'maruti',
    'maruti': 'maruti',
    'mercedes-benz': 'mercedes-benz',
    'mercedes': 'mercedes-benz',
    'mg': 'mg',
    'mg motor': 'mg',
    'mini': 'mini',
    'nissan': 'nissan',
    'porsche': 'porsche',
    'renault': 'renault',
    'rolls-royce': 'rolls-royce',
    'rolls royce': 'rolls-royce',
    'skoda': 'skoda',
    'tata motors': 'tata',
    'tata': 'tata',
    'toyota': 'toyota',
    'vinfast': 'vinfast',
    'volkswagen': 'volkswagen',
    'volvo': 'volvo',
}

/**
 * Returns a public URL to a locally committed 4W image, or null if not found.
 * Tries {slug}.jpg then {slug}.png inside public/data/brand-model-images/4w/{folder}/
 */
function getLocal4WImage(make: string, model: string): string | null {
    const folder = MAKE_TO_FOLDER_4W[make.toLowerCase()]
    if (!folder) return null
    const slug = toSlug(model)
    const base = path.join(process.cwd(), 'public', 'data', 'brand-model-images', '4w', folder, slug)
    for (const ext of ['.jpg', '.png']) {
        if (fs.existsSync(base + ext)) return `/data/brand-model-images/4w/${folder}/${slug}${ext}`
    }
    return null
}

/**
 * Returns a public URL to a locally committed 2W image, or null if not found.
 * Tries direct folder paths and scans if needed.
 */
export function getLocal2WImage(brand: string, model: string): string | null {
    const slug = toSlug(model)
    const brandLower = brand.toLowerCase().trim()

    try {
        const baseDir = path.join(process.cwd(), 'public', 'data', 'brand-model-images', '2w')
        if (!fs.existsSync(baseDir)) {
            console.log(`[getLocal2WImage] 2W dir not found: ${baseDir}`)
            return null
        }

        // Common folder naming patterns to try
        const folderPatterns = [
            // Direct slug
            brandLower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            // With common suffixes
            `${brandLower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-india`,
            `${brandLower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-ev`,
            `${brandLower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-auto`,
            `${brandLower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-motorcycles`,
            `${brandLower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-motor`,
            // Special cases (hardcoded for brands with non-obvious names)
            brandLower.includes('honda') ? 'honda-hmsi' : null,
            brandLower.includes('matter') ? 'matter-ev' : null,
        ].filter(Boolean) as string[]

        for (const folder of folderPatterns) {
            const imgPath = path.join(baseDir, folder, slug)
            for (const ext of ['.jpg', '.png']) {
                const fullPath = imgPath + ext
                if (fs.existsSync(fullPath)) {
                    const url = `/data/brand-model-images/2w/${folder}/${slug}${ext}`
                    console.log(`[getLocal2WImage] ✓ Found: ${brand} ${model} → ${url}`)
                    return url
                }
            }
        }

        // Fallback: scan all folders if patterns didn't match
        const allFolders = fs.readdirSync(baseDir)
        const brandWords = brandLower.split(/[^a-z0-9]/g).filter(w => w.length > 2)

        for (const folder of allFolders) {
            const folderLower = folder.toLowerCase()
            const folderWords = folderLower.split('-')

            // Check if folder shares keywords with brand
            const hasMatch = brandWords.some(bw => folderWords.some(fw => fw.includes(bw) || bw.includes(fw)))

            if (hasMatch) {
                const imgPath = path.join(baseDir, folder, slug)
                for (const ext of ['.jpg', '.png']) {
                    const fullPath = imgPath + ext
                    if (fs.existsSync(fullPath)) {
                        const url = `/data/brand-model-images/2w/${folder}/${slug}${ext}`
                        console.log(`[getLocal2WImage] ✓ Found (fallback): ${brand} ${model} → ${url}`)
                        return url
                    }
                }
            }
        }

        console.log(`[getLocal2WImage] ✗ NOT FOUND: ${brand} "${model}" (slug: ${slug})`)
    } catch (err) {
        console.error(`[getLocal2WImage] Error for ${brand} ${model}:`, err)
    }
    return null
}

/**
 * Returns a public URL to a locally committed 3W image, or null if not found.
 * Scans available folders to find a match for the brand.
 */
export function getLocal3WImage(brand: string, model: string): string | null {
    const slug = toSlug(model)
    const brandLower = brand.toLowerCase().trim()

    try {
        const baseDir = path.join(process.cwd(), 'public', 'data', 'brand-model-images', '3w')
        if (!fs.existsSync(baseDir)) {
            console.log(`[getLocal3WImage] 3W dir not found: ${baseDir}`)
            return null
        }

        // Common folder naming patterns
        const folderPatterns = [
            brandLower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            `${brandLower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-auto`,
            `${brandLower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-motors`,
            `${brandLower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-india`,
            `${brandLower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-three-wheelers`,
        ].filter(Boolean) as string[]

        for (const folder of folderPatterns) {
            const imgPath = path.join(baseDir, folder, slug)
            for (const ext of ['.jpg', '.png']) {
                const fullPath = imgPath + ext
                if (fs.existsSync(fullPath)) {
                    const url = `/data/brand-model-images/3w/${folder}/${slug}${ext}`
                    console.log(`[getLocal3WImage] ✓ Found: ${brand} ${model} → ${url}`)
                    return url
                }
            }
        }

        console.log(`[getLocal3WImage] ✗ NOT FOUND: ${brand} "${model}" (slug: ${slug})`)
    } catch (err) {
        console.error(`[getLocal3WImage] Error for ${brand} ${model}:`, err)
    }
    return null
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
function getCarsByMakeFromJson(make: string): Car[] {
    const jsonKey = MAKE_TO_JSON[make.toLowerCase()]
    if (!jsonKey) return []
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', `${jsonKey}.json`)
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'))

        const seen = new Set<string>()
        const collected: Array<{
            model: string; cdnImg: string | null; price: string | null
            fuel: string | null; transmission: string | null; seating: number
        }> = []

        // Inline getImg matching the admin catalog pattern exactly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function getImg(imgUrls: unknown): string | null {
            if (!Array.isArray(imgUrls)) return null
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const u = (imgUrls as any[]).find((x) => typeof x?.value === 'string' && x.value.startsWith('http'))
            return u?.value ?? null
        }

        // Same recursive walk as admin catalog load4W()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function walk(node: any, ctxModel?: string, ctxPrice?: string, ctxFuel?: string): void {
            if (!node || typeof node !== 'object') return
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (Array.isArray(node)) { node.forEach((n: any) => walk(n, ctxModel, ctxPrice, ctxFuel)); return }
            const model: string | undefined = node.model || node.model_name || ctxModel
            const imgUrl = getImg(node.image_urls)
            const price  = node.ex_showroom_price || node.ex_showroom_price_min_inr || ctxPrice
            const fuel   = node.fuel_type || ctxFuel
            if (model && !seen.has(model.toLowerCase())) {
                seen.add(model.toLowerCase())
                collected.push({
                    model,
                    cdnImg: imgUrl && !imgUrl.includes('spacer') ? imgUrl : null,
                    price: price ? String(price) : null,
                    fuel: fuel ?? null,
                    transmission: node.transmission ?? null,
                    seating: node.seating_capacity ?? 5,
                })
            }
            for (const [k, v] of Object.entries(node)) {
                if (k === 'image_urls') continue
                if (v && typeof v === 'object') walk(v, model ?? ctxModel, price ?? ctxPrice, fuel ?? ctxFuel)
            }
        }

        walk(raw)

        // Maruti-style fallback: no model field — extract model name from image URL path
        // e.g. stimg.cardekho.com/…/Maruti/Grand-Vitara/… → "Grand Vitara"
        if (collected.length === 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            function urlWalk(node: any): void {
                if (!node || typeof node !== 'object') return
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (Array.isArray(node)) { node.forEach((n: any) => urlWalk(n)); return }
                const imgUrl = getImg(node.image_urls)
                if (imgUrl) {
                    const m = imgUrl.match(/\/([A-Z][^/]+)\/\d{4,}\//)
                    if (m) {
                        const model = m[1].replace(/-/g, ' ')
                        if (!seen.has(model.toLowerCase())) {
                            seen.add(model.toLowerCase())
                            collected.push({
                                model,
                                cdnImg: !imgUrl.includes('spacer') ? imgUrl : null,
                                price: node.ex_showroom_price ? String(node.ex_showroom_price) : null,
                                fuel: node.fuel_type ?? null,
                                transmission: node.transmission ?? null,
                                seating: node.seating_capacity ?? 5,
                            })
                        }
                    }
                }
                for (const [k, v] of Object.entries(node)) {
                    if (k === 'image_urls') continue
                    if (v && typeof v === 'object') urlWalk(v)
                }
            }
            urlWalk(raw)
        }

        return collected.map((m, idx) => {
            const localUrl = m.cdnImg ? null : getLocal4WImage(make, m.model)
            const heroImg  = m.cdnImg ?? localUrl ?? '/placeholder-car.jpg'
            const minPrice = parsePriceINR(m.price ?? '')

            return {
                id: `json-${jsonKey}-${idx}`,
                make,
                model: m.model,
                variant: '',
                year: new Date().getFullYear(),
                bodyType: 'SUV' as Car['bodyType'],
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
                meta: {},
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
    return {
        id:       row.id,
        make:     row.make,
        model:    row.model,
        variant:  row.variant ?? '',
        year:     row.year ?? new Date().getFullYear(),
        bodyType: row.body_type ?? 'SUV',
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
    return getCarsByMakeFromJson(make)
}

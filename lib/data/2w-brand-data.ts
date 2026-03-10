/**
 * lib/data/2w-brand-data.ts
 * Loads rich vehicle data from public/data/2w/*.json files
 * and provides a lookup for buildTwoWheelerEntry enrichment.
 *
 * Uses static imports (no fs) so it works in both server and client bundles.
 */

export interface BrandModelEnrichment {
    engine_cc: number | null
    mileage_kmpl: number | null
    top_speed_kmph: number | null
    ex_showroom_price_paise: number
    range_km: number | null
    battery_kwh: number | null
    colors: { name: string; hex: string }[]
    features: string[]
    description: string | null
    torque: string | null
    variant: string | null
}

// ── Parse helpers ───────────────────────────────────────────────

function parsePrice(priceStr: string | null | undefined): number {
    if (!priceStr) return 0
    const cleaned = priceStr.replace(/[₹,Rs.*Onwards\s]/gi, '')
    const num = parseFloat(cleaned)
    return isNaN(num) ? 0 : Math.round(num * 100)
}

function parseCC(str: string | null | undefined): number | null {
    if (!str) return null
    const match = str.match(/([\d.]+)\s*cc/i)
    if (!match) return null
    return Math.round(parseFloat(match[1]))
}

function parseMileage(str: string | null | undefined): number | null {
    if (!str) return null
    const match = str.match(/([\d.]+)\s*kmpl/i)
    if (!match) return null
    return parseFloat(match[1])
}

function parseTopSpeed(str: string | null | undefined): number | null {
    if (!str) return null
    const match = str.match(/([\d.]+)\s*km\/?h/i)
    if (!match) return null
    return Math.round(parseFloat(match[1]))
}

function parseRange(str: string | null | undefined): number | null {
    if (!str) return null
    const match = str.match(/([\d.]+)\s*km/i)
    if (!match) return null
    return Math.round(parseFloat(match[1]))
}

function parseBatteryKwh(str: string | null | undefined): number | null {
    if (!str) return null
    const match = str.match(/([\d.]+)\s*k?wh/i)
    if (!match) return null
    return parseFloat(match[1])
}

// ── Static imports of all brand JSON files ──────────────────────
// Only files with data get imported. Empty templates are skipped.

/* eslint-disable @typescript-eslint/no-explicit-any */
let hondaData: any = null
let revoltData: any = null
let apriliaData: any = null
let bmwData: any = null
let benelliData: any = null
let ducatiData: any = null
let heroData: any = null
let indianData: any = null
let kawasakiData: any = null
let okinawaData: any = null

try { hondaData = require('@/../public/data/2w/honda.json') } catch { /* empty */ }
try { revoltData = require('@/../public/data/2w/revolt-motors.json') } catch { /* empty */ }
try { apriliaData = require('@/../public/data/2w/aprilia-india.json') } catch { /* empty */ }
try { bmwData = require('@/../public/data/2w/bmw-motorrad-india.json') } catch { /* empty */ }
try { benelliData = require('@/../public/data/2w/benelli-india.json') } catch { /* empty */ }
try { ducatiData = require('@/../public/data/2w/ducati-india.json') } catch { /* empty */ }
try { heroData = require('@/../public/data/2w/hero-motocorp.json') } catch { /* empty */ }
try { indianData = require('@/../public/data/2w/indian-motorcycle.json') } catch { /* empty */ }
try { kawasakiData = require('@/../public/data/2w/kawasaki-india.json') } catch { /* empty */ }
try { okinawaData = require('@/../public/data/2w/okinawa-autotech.json') } catch { /* empty */ }

const ALL_BRAND_FILES: any[] = [
    hondaData, revoltData, apriliaData, bmwData, benelliData, ducatiData,
    heroData, indianData, kawasakiData, okinawaData
].filter(Boolean)
/* eslint-enable @typescript-eslint/no-explicit-any */

// ── Extract enrichment from vehicle entries ─────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractFromVehicle(v: any): BrandModelEnrichment {
    // Honda format: has variants array
    if (v.variants && Array.isArray(v.variants) && v.variants.length > 0) {
        const firstVar = v.variants[0]
        const specs = firstVar.technical_specifications || {}
        const engine = specs.engine_and_transmission || {}
        const perf = specs.performance_and_features || {}

        const colors = (firstVar.colors || []).map((c: string | { value: string }) => ({
            name: typeof c === 'string' ? c : c.value || '',
            hex: '#808080'
        }))

        const features: string[] = []
        if (perf['Additional Features Of Variant']) features.push(perf['Additional Features Of Variant'])
        if (engine['Gear Box']) features.push(`${engine['Gear Box']} Gearbox`)
        if (engine['Cooling System']) features.push(engine['Cooling System'])
        if (engine['Starting']) features.push(engine['Starting'])
        if (perf['Bluetooth Connectivity']) features.push('Bluetooth Connectivity')
        if (perf['USB Charging Port'] === 'Yes') features.push('USB Charging Port')
        if (perf['Navigation'] === 'Yes') features.push('Navigation')

        return {
            engine_cc: parseCC(engine['Displacement']),
            mileage_kmpl: null,
            top_speed_kmph: null,
            ex_showroom_price_paise: parsePrice(firstVar.price),
            range_km: null,
            battery_kwh: null,
            colors,
            features,
            description: null,
            torque: engine['Max Torque'] || null,
            variant: firstVar.variant_name || null,
        }
    }

    // Revolt / electric format: has specifications with Motor Power / Range
    const specs = v.specifications || {}
    if (specs['Motor Power'] || specs['Range']) {
        const colors = (v.colors || []).map((c: string) => ({ name: c, hex: '#808080' }))
        const features: string[] = []
        if (specs['Riding Modes'] === 'Yes') features.push('Riding Modes')
        if (specs['Bluetooth Connectivity'] === 'Yes' || specs['Mobile Connectivity']) features.push('Bluetooth Connectivity')
        if (specs['Navigation'] === 'Yes') features.push('Navigation')
        if (specs['USB Charging Port'] === 'Yes') features.push('USB Charging Port')
        if (specs['Keyless Ignition'] === 'Yes') features.push('Keyless Ignition')
        if (specs['Reverse Assist'] === 'Yes') features.push('Reverse Assist')
        if (specs['Fast Charging'] === 'Yes') features.push('Fast Charging')
        if (specs['Swappable Battery'] === 'Yes') features.push('Swappable Battery')

        return {
            engine_cc: null,
            mileage_kmpl: null,
            top_speed_kmph: parseTopSpeed(specs['Top Speed']),
            ex_showroom_price_paise: parsePrice(v.price),
            range_km: parseRange(specs['Range'] || specs['Claimed Range'] || specs['Range (Eco Mode)']),
            battery_kwh: parseBatteryKwh(specs['Battery Capacity']),
            colors,
            features,
            description: null,
            torque: specs['Torque (Motor)'] || null,
            variant: null,
        }
    }

    // Generic format (Aprilia, BMW, Benelli, Ducati)
    const genFeatures = Array.isArray(specs.features)
        ? specs.features.map((f: string | { value: string }) => typeof f === 'string' ? f : f.value || '')
        : []

    return {
        engine_cc: parseCC(specs.engine_details || specs.engine || specs.displacement),
        mileage_kmpl: parseMileage(specs.mileage || v.mileage),
        top_speed_kmph: null,
        ex_showroom_price_paise: parsePrice(v.price),
        range_km: null,
        battery_kwh: null,
        colors: (v.colors || []).map((c: string | { name: string }) => ({
            name: typeof c === 'string' ? c : c.name || '',
            hex: '#808080'
        })),
        features: genFeatures,
        description: specs.description || null,
        torque: specs.torque || v.torque || null,
        variant: null,
    }
}

// ── Build the lookup cache ──────────────────────────────────────

const enrichmentCache = new Map<string, BrandModelEnrichment>()
// Maps brandId → brand display name (lowercase) for prefix stripping
const brandNameMap = new Map<string, string>()

function normalizeModelKey(brandId: string, model: string): string {
    return `${brandId}::${model.toLowerCase().trim()}`
}

/** Strip special chars, normalize whitespace for comparison */
function normalizeForMatch(str: string): string {
    return str.toLowerCase()
        .replace(/[''`]/g, '')       // remove apostrophes
        .replace(/[-]/g, ' ')        // hyphens to spaces
        .replace(/\s+/g, ' ')        // collapse whitespace
        .trim()
}

/** Extract significant words (skip short noise words) */
function getWords(str: string): string[] {
    return normalizeForMatch(str).split(' ').filter(w => w.length > 0)
}

/** Check if two model names are a fuzzy match */
function modelsMatch(catalogModel: string, dataModel: string, brandName: string): boolean {
    const a = normalizeForMatch(catalogModel)
    const b = normalizeForMatch(dataModel)

    // Exact after normalization
    if (a === b) return true

    // Also compare with spaces removed (e.g., "goldwing" vs "gold wing")
    const aNoSpace = a.replace(/\s/g, '')
    const bNoSpace = b.replace(/\s/g, '')
    if (aNoSpace === bNoSpace) return true

    // Simple substring
    if (a.includes(b) || b.includes(a)) return true

    // Strip brand prefix from data model (e.g., "honda sp 125" → "sp 125")
    const brandLower = normalizeForMatch(brandName)
    const brandWords = brandLower.split(' ')
    let stripped = b
    for (const bw of brandWords) {
        if (stripped.startsWith(bw + ' ')) {
            stripped = stripped.slice(bw.length + 1)
        }
    }
    if (stripped !== b) {
        if (a === stripped || a.includes(stripped) || stripped.includes(a)) return true
        // No-space comparison after stripping (e.g., "goldwing tour" vs "gold wing")
        const strippedNoSpace = stripped.replace(/\s/g, '')
        if (aNoSpace === strippedNoSpace || aNoSpace.includes(strippedNoSpace) || strippedNoSpace.includes(aNoSpace)) return true
    }

    // Word overlap: if all words of the shorter name appear in the longer name
    const wordsA = getWords(catalogModel)
    const wordsB = getWords(stripped || dataModel)

    const shorter = wordsA.length <= wordsB.length ? wordsA : wordsB
    const longer = wordsA.length <= wordsB.length ? wordsB : wordsA
    const longerStr = longer.join(' ')

    const matchCount = shorter.filter(w => longerStr.includes(w)).length
    if (shorter.length > 0 && matchCount === shorter.length) return true

    // Partial: if at least 2 significant words overlap and ratio > 60%
    if (shorter.length >= 2 && matchCount >= 2 && matchCount / shorter.length >= 0.6) return true

    return false
}

// Build cache on module load
for (const brandFile of ALL_BRAND_FILES) {
    const brandId: string = brandFile.brandId || ''
    const brandName: string = brandFile.brand || ''
    const vehicles = brandFile.vehicles || []
    if (!brandId || !Array.isArray(vehicles)) continue

    brandNameMap.set(brandId, brandName)

    for (const v of vehicles) {
        const modelName: string = v.model || v.model_name || ''
        if (!modelName) continue
        const enrichment = extractFromVehicle(v)
        enrichmentCache.set(normalizeModelKey(brandId, modelName), enrichment)
    }
}

/**
 * Get enrichment data for a specific brand+model combination.
 * Returns null if no data available.
 */
export function getModelEnrichment(brandId: string, model: string): BrandModelEnrichment | null {
    // Try exact match
    const key = normalizeModelKey(brandId, model)
    const exact = enrichmentCache.get(key)
    if (exact) return exact

    const brandName = brandNameMap.get(brandId) || ''

    // Fuzzy match against all models for this brand
    let bestMatch: BrandModelEnrichment | null = null
    let bestScore = 0

    for (const [cachedKey, data] of enrichmentCache) {
        if (!cachedKey.startsWith(brandId + '::')) continue
        const cachedModel = cachedKey.split('::')[1]

        if (modelsMatch(model, cachedModel, brandName)) {
            // Score by how close the lengths are (prefer closer matches)
            const a = normalizeForMatch(model)
            const b = normalizeForMatch(cachedModel)
            const score = 1 / (1 + Math.abs(a.length - b.length))
            if (score > bestScore) {
                bestScore = score
                bestMatch = data
            }
        }
    }

    return bestMatch
}

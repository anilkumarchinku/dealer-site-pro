/**
 * lib/data/3w-brand-data.ts
 * Loads vehicle spec data from public/data/3w/*.json files
 * and provides enrichment lookup for the 3W catalog builder.
 */

export interface ThreeWheelerEnrichment {
    engine_cc: number | null
    fuel_type: string | null
    mileage_kmpl: number | null
    max_power: string | null
    torque: string | null
    gvw_kg: number | null
    ex_showroom_price_paise: number | null
    range_km: number | null
    passenger_capacity: number | null
}

// ── Parse helpers ────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */
function toStr(val: unknown): string {
    if (val == null) return ''
    return typeof val === 'string' ? val : String(val)
}

function parseCC(str: unknown): number | null {
    const s = toStr(str)
    if (!s) return null
    const match = s.match(/([\d.]+)\s*cc/i)
    if (!match) return null
    return Math.round(parseFloat(match[1]))
}

function parseMileage(str: unknown): number | null {
    const s = toStr(str)
    if (!s) return null
    const match = s.match(/([\d.]+)\s*kmpl/i)
    if (!match) return null
    return parseFloat(match[1])
}

function parseKg(str: unknown): number | null {
    const s = toStr(str)
    if (!s) return null
    const match = s.match(/([\d.]+)\s*kg/i)
    if (!match) return null
    return Math.round(parseFloat(match[1]))
}

function parsePrice(str: unknown): number | null {
    const s = toStr(str)
    if (!s) return null
    // Extract first number (handles "₹ 2.50 Lakh", "₹1.12 lakh", "₹ 2.50 Lakh - ₹ 2.85 Lakh")
    const cleaned = s.replace(/[₹,Rs.\s]/gi, '')
    const match = cleaned.match(/([\d.]+)\s*(?:lakh|l)/i)
    if (!match) return null
    const lakhs = parseFloat(match[1])
    return Math.round(lakhs * 100000 * 100) // convert to paise
}

function parseRange(str: unknown): number | null {
    const s = toStr(str)
    if (!s) return null
    const match = s.match(/([\d.]+)\s*km/i)
    if (!match) return null
    return Math.round(parseFloat(match[1]))
}

function parseSeating(str: unknown): number | null {
    const s = toStr(str)
    if (!s) return null
    const match = s.match(/(\d+)/)
    if (!match) return null
    return parseInt(match[1])
}

// ── Static imports ───────────────────────────────────────────────

let atulData: any = null
let bajajData: any = null
let eulerData: any = null
let greavesData: any = null
let kineticData: any = null
let lohiaData: any = null
let mahindraData: any = null
let piaggioData: any = null
let tvsKingData: any = null

/* eslint-disable @typescript-eslint/no-require-imports */
try { atulData    = require('@/public/data/3w/atul-auto.json')            } catch { /* optional */ }
try { bajajData   = require('@/public/data/3w/bajaj-auto-3w.json')        } catch { /* optional */ }
try { eulerData   = require('@/public/data/3w/euler-motors.json')         } catch { /* optional */ }
try { greavesData = require('@/public/data/3w/greaves-electric-3w.json')  } catch { /* optional */ }
try { kineticData = require('@/public/data/3w/kinetic-green.json')        } catch { /* optional */ }
try { lohiaData   = require('@/public/data/3w/lohia-auto.json')           } catch { /* optional */ }
try { mahindraData = require('@/public/data/3w/mahindra-3w.json')         } catch { /* optional */ }
try { piaggioData = require('@/public/data/3w/piaggio-ape.json')          } catch { /* optional */ }
try { tvsKingData = require('@/public/data/3w/tvs-king.json')             } catch { /* optional */ }
/* eslint-enable @typescript-eslint/no-require-imports */

// ── Extractors for different JSON formats ────────────────────────

// Format A: Atul — { model_name, cardekho_technical_specifications: { engine_type (cc embedded), fuel_type, mileage } }
function extractAtulFormat(v: any): ThreeWheelerEnrichment {
    const specs = v.cardekho_technical_specifications || {}
    const pricing = v.cardekho_pricing || {}
    // mileage can be "36 kmpl" or "80 km range per charge"
    const mileageRaw: string = specs.mileage || ''
    const isEV = mileageRaw.toLowerCase().includes('range') || (specs.fuel_type || '').toLowerCase().includes('electric')
    return {
        engine_cc:   isEV ? null : parseCC(specs.engine_type),
        fuel_type:   specs.fuel_type || null,
        mileage_kmpl: isEV ? null : parseMileage(mileageRaw),
        range_km:    isEV ? parseRange(mileageRaw) : null,
        max_power:   specs.max_power || null,
        torque:      specs.torque || null,
        gvw_kg:      parseKg(specs.gross_vehicle_weight),
        ex_showroom_price_paise: parsePrice(pricing.ex_showroom_price),
        passenger_capacity: parseSeating(specs.seating_capacity),
    }
}

// Format B: Bajaj — { variant_name, engine_details: { displacement, max_power, torque }, technical_specifications: { fuel_type } }
function extractBajajFormat(v: any): ThreeWheelerEnrichment {
    const eng = v.engine_details || {}
    const tech = v.technical_specifications || {}
    return {
        engine_cc:   parseCC(eng.displacement),
        fuel_type:   tech.fuel_type || null,
        mileage_kmpl: null,
        range_km:    null,
        max_power:   eng.max_power || null,
        torque:      eng.torque || null,
        gvw_kg:      parseKg(v.payload_features?.gross_vehicle_weight),
        ex_showroom_price_paise: null,
        passenger_capacity: null,
    }
}

// Format C: make/model/category + real specs (fuel_type, engine_cc, range_km, mileage_km_per_kg, mileage_kmpl,
//           max_power, torque, gvw_kg, passenger_capacity, ex_showroom_price)
function extractMakeModelFormat(v: any): ThreeWheelerEnrichment {
    const isElectric = (toStr(v.fuel_type) || toStr(v.category)).toLowerCase().includes('electric')
    // mileage_km_per_kg → treat as CNG mileage; mileage_kmpl → standard; range_km → EV range
    const mileageKmpl = typeof v.mileage_kmpl === 'number' ? v.mileage_kmpl : null
    const rangeKm = typeof v.range_km === 'number' ? v.range_km : null
    // price can be numeric paise or string like "₹3.50 Lakh"
    let price: number | null = null
    if (typeof v.ex_showroom_price_paise === 'number') {
        price = v.ex_showroom_price_paise
    } else if (typeof v.ex_showroom_price === 'string') {
        price = parsePrice(v.ex_showroom_price)
    }
    return {
        engine_cc:   isElectric ? null : (typeof v.engine_cc === 'number' ? v.engine_cc : null),
        fuel_type:   v.fuel_type || (isElectric ? 'Electric' : null),
        mileage_kmpl: mileageKmpl,
        range_km:    rangeKm,
        max_power:   v.max_power || null,
        torque:      v.torque || null,
        gvw_kg:      typeof v.gvw_kg === 'number' ? v.gvw_kg : null,
        ex_showroom_price_paise: price,
        passenger_capacity: typeof v.passenger_capacity === 'number' ? v.passenger_capacity : null,
    }
}

// ── Build enrichment cache ───────────────────────────────────────

interface BrandFile {
    data: any
    brandId: string
    format: 'atul' | 'bajaj' | 'make-model'
    modelKey: string // field name for model name
}

const BRAND_FILES: BrandFile[] = ([
    { data: atulData,     brandId: 'atul-auto',           format: 'atul',       modelKey: 'model_name'   },
    { data: bajajData,    brandId: 'bajaj-auto-3w',        format: 'bajaj',      modelKey: 'variant_name' },
    { data: eulerData,    brandId: 'euler-motors',         format: 'make-model', modelKey: 'model'        },
    { data: greavesData,  brandId: 'greaves-electric-3w',  format: 'make-model', modelKey: 'model'        },
    { data: kineticData,  brandId: 'kinetic-green',        format: 'make-model', modelKey: 'model'        },
    { data: lohiaData,    brandId: 'lohia-auto',           format: 'make-model', modelKey: 'model'        },
    { data: mahindraData, brandId: 'mahindra-3w',          format: 'make-model', modelKey: 'model'        },
    { data: piaggioData,  brandId: 'piaggio-ape',          format: 'make-model', modelKey: 'model'        },
    { data: tvsKingData,  brandId: 'tvs-king',             format: 'make-model', modelKey: 'model'        },
] as BrandFile[]).filter(b => b.data)

const enrichmentCache = new Map<string, ThreeWheelerEnrichment>()

function normalizeKey(brandId: string, model: string): string {
    return `${brandId}::${model.toLowerCase().trim()}`
}

for (const { data, brandId, format, modelKey } of BRAND_FILES) {
    const vehicles: any[] = data.vehicles || []
    for (const v of vehicles) {
        const modelName: string = v[modelKey] || ''
        if (!modelName) continue

        let enrichment: ThreeWheelerEnrichment
        if (format === 'atul')       enrichment = extractAtulFormat(v)
        else if (format === 'bajaj') enrichment = extractBajajFormat(v)
        else                         enrichment = extractMakeModelFormat(v)

        enrichmentCache.set(normalizeKey(brandId, modelName), enrichment)
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Get enrichment data for a 3W brand+model combination.
 * Returns null if no data available.
 */
export function get3WModelEnrichment(brandId: string, model: string): ThreeWheelerEnrichment | null {
    // Exact match
    const exact = enrichmentCache.get(normalizeKey(brandId, model))
    if (exact) return exact

    // Fuzzy: check if any cached model name is a substring of the given model or vice versa
    const modelLower = model.toLowerCase().trim()
    for (const [key, data] of enrichmentCache) {
        if (!key.startsWith(brandId + '::')) continue
        const cachedModel = key.split('::')[1]
        if (modelLower.includes(cachedModel) || cachedModel.includes(modelLower)) {
            return data
        }
    }

    return null
}

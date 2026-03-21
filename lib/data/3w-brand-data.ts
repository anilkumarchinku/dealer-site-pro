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
}

// ── Parse helpers ────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */
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

function parseKg(str: string | null | undefined): number | null {
    if (!str) return null
    const match = str.match(/([\d.]+)\s*kg/i)
    if (!match) return null
    return Math.round(parseFloat(match[1]))
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
    return {
        engine_cc:   parseCC(specs.engine_type),
        fuel_type:   specs.fuel_type || null,
        mileage_kmpl: parseMileage(specs.mileage),
        max_power:   specs.max_power || null,
        torque:      specs.torque || null,
        gvw_kg:      parseKg(specs.gross_vehicle_weight),
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
        max_power:   eng.max_power || null,
        torque:      eng.torque || null,
        gvw_kg:      parseKg(v.payload_features?.gross_vehicle_weight),
    }
}

// Format C: make/model/category/status/variants (variants usually empty — use category for fuel inference)
function extractMakeModelFormat(v: any): ThreeWheelerEnrichment {
    return {
        engine_cc:   null,
        fuel_type:   v.category?.toLowerCase().includes('electric') ? 'Electric' : null,
        mileage_kmpl: null,
        max_power:   null,
        torque:      null,
        gvw_kg:      null,
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

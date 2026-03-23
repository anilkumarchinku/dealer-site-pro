/**
 * lib/data/2w-brand-data.ts
 * Loads rich vehicle data from public/data/2w/*.json files
 * and provides a lookup for buildTwoWheelerEntry enrichment.
 *
 * Uses static imports (no fs) so it works in both server and client bundles.
 */

import { resolveVehicleColorHex } from '@/lib/utils/resolve-vehicle-color'

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
    all_variants: { name: string; price_paise: number }[]
    stock_status: 'available' | 'booking_open' | 'out_of_stock'
    wheelbase_mm: number | null
    length_mm: number | null
    width_mm: number | null
    height_mm: number | null
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

function parseMM(str: string | null | undefined): number | null {
    if (!str) return null
    const match = str.match(/([\d.]+)\s*mm/i)
    if (!match) return null
    return Math.round(parseFloat(match[1]))
}

function parseSourceSection(section: string | null | undefined): 'available' | 'booking_open' | 'out_of_stock' {
    if (!section) return 'available'
    const s = section.toLowerCase()
    if (s.includes('upcoming') || s.includes('launch')) return 'booking_open'
    if (s.includes('discontinu') || s.includes('stopped')) return 'out_of_stock'
    return 'available'
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
// Previously missing brands (non-standard root keys)
let cfmotoData: any = null
let harleyData: any = null
let husqvarnaData: any = null
let keewayData: any = null
let ktmData: any = null
let motoGuzziData: any = null
let olaData: any = null
let royalEnfieldData: any = null
let suzukiData: any = null
let triumphData: any = null
let tvsIqubeData: any = null
let vidaData: any = null
let yamahaData: any = null
let yezdiData: any = null
let zontesData: any = null
// Additional standard-format brands
let ampereData: any = null
let atherData: any = null
let bajajData: any = null
let bajajChetakData: any = null
let bounceData: any = null
let heroElectricData: any = null
let hopData: any = null
let jawaData: any = null
let joyData: any = null
let kabiraData: any = null
let komakiData: any = null
let lectrixData: any = null
let mahindra2wData: any = null
let matterData: any = null
let obenData: any = null
let odysseData: any = null
let okayaData: any = null
let pureEvData: any = null
let quantumData: any = null
let riverData: any = null
let simpleData: any = null
let torkData: any = null
let tvsMotorData: any = null
let ultravioletteData: any = null
let vespaData: any = null
let yuluData: any = null

/* eslint-disable @typescript-eslint/no-require-imports */
try { hondaData         = require('@/public/data/2w/honda.json')              } catch { /* optional */ }
try { revoltData        = require('@/public/data/2w/revolt-motors.json')      } catch { /* optional */ }
try { apriliaData       = require('@/public/data/2w/aprilia-india.json')      } catch { /* optional */ }
try { bmwData           = require('@/public/data/2w/bmw-motorrad-india.json') } catch { /* optional */ }
try { benelliData       = require('@/public/data/2w/benelli-india.json')      } catch { /* optional */ }
try { ducatiData        = require('@/public/data/2w/ducati-india.json')       } catch { /* optional */ }
try { heroData          = require('@/public/data/2w/hero-motocorp.json')      } catch { /* optional */ }
try { indianData        = require('@/public/data/2w/indian-motorcycle.json')  } catch { /* optional */ }
try { kawasakiData      = require('@/public/data/2w/kawasaki-india.json')     } catch { /* optional */ }
try { okinawaData       = require('@/public/data/2w/okinawa-autotech.json')   } catch { /* optional */ }
try { cfmotoData        = require('@/public/data/2w/cfmoto-india.json')       } catch { /* optional */ }
try { harleyData        = require('@/public/data/2w/harley-davidson-india.json') } catch { /* optional */ }
try { husqvarnaData     = require('@/public/data/2w/husqvarna-india.json')    } catch { /* optional */ }
try { keewayData        = require('@/public/data/2w/keeway-india.json')       } catch { /* optional */ }
try { ktmData           = require('@/public/data/2w/ktm-india.json')          } catch { /* optional */ }
try { motoGuzziData     = require('@/public/data/2w/moto-guzzi.json')         } catch { /* optional */ }
try { olaData           = require('@/public/data/2w/ola-electric.json')       } catch { /* optional */ }
try { royalEnfieldData  = require('@/public/data/2w/royal-enfield.json')      } catch { /* optional */ }
try { suzukiData        = require('@/public/data/2w/suzuki-motorcycle.json')  } catch { /* optional */ }
try { triumphData       = require('@/public/data/2w/triumph-india.json')      } catch { /* optional */ }
try { tvsIqubeData      = require('@/public/data/2w/tvs-iqube.json')          } catch { /* optional */ }
try { vidaData          = require('@/public/data/2w/vida-hero.json')          } catch { /* optional */ }
try { yamahaData        = require('@/public/data/2w/yamaha-india.json')       } catch { /* optional */ }
try { yezdiData         = require('@/public/data/2w/yezdi-motorcycles.json')  } catch { /* optional */ }
try { zontesData        = require('@/public/data/2w/zontes-india.json')       } catch { /* optional */ }
try { ampereData        = require('@/public/data/2w/ampere-greaves.json')     } catch { /* optional */ }
try { atherData         = require('@/public/data/2w/ather-energy.json')       } catch { /* optional */ }
try { bajajData         = require('@/public/data/2w/bajaj-auto.json')         } catch { /* optional */ }
try { bajajChetakData   = require('@/public/data/2w/bajaj-chetak-ev.json')    } catch { /* optional */ }
try { bounceData        = require('@/public/data/2w/bounce-infinity.json')    } catch { /* optional */ }
try { heroElectricData  = require('@/public/data/2w/hero-electric.json')      } catch { /* optional */ }
try { hopData           = require('@/public/data/2w/hop-electric.json')       } catch { /* optional */ }
try { jawaData          = require('@/public/data/2w/jawa-motorcycles.json')   } catch { /* optional */ }
try { joyData           = require('@/public/data/2w/joy-e-bike.json')         } catch { /* optional */ }
try { kabiraData        = require('@/public/data/2w/kabira-mobility.json')    } catch { /* optional */ }
try { komakiData        = require('@/public/data/2w/komaki.json')             } catch { /* optional */ }
try { lectrixData       = require('@/public/data/2w/lectrix-ev.json')         } catch { /* optional */ }
try { mahindra2wData    = require('@/public/data/2w/mahindra-two-wheelers.json') } catch { /* optional */ }
try { matterData        = require('@/public/data/2w/matter-ev.json')          } catch { /* optional */ }
try { obenData          = require('@/public/data/2w/oben-electric.json')      } catch { /* optional */ }
try { odysseData        = require('@/public/data/2w/odysse-electric.json')    } catch { /* optional */ }
try { okayaData         = require('@/public/data/2w/okaya-ev.json')           } catch { /* optional */ }
try { pureEvData        = require('@/public/data/2w/pure-ev.json')            } catch { /* optional */ }
try { quantumData       = require('@/public/data/2w/quantum-energy.json')     } catch { /* optional */ }
try { riverData         = require('@/public/data/2w/river-ev.json')           } catch { /* optional */ }
try { simpleData        = require('@/public/data/2w/simple-energy.json')      } catch { /* optional */ }
try { torkData          = require('@/public/data/2w/tork-motors.json')        } catch { /* optional */ }
try { tvsMotorData      = require('@/public/data/2w/tvs-motor.json')          } catch { /* optional */ }
try { ultravioletteData = require('@/public/data/2w/ultraviolette.json')      } catch { /* optional */ }
try { vespaData         = require('@/public/data/2w/vespa-india.json')        } catch { /* optional */ }
try { yuluData          = require('@/public/data/2w/yulu.json')               } catch { /* optional */ }
let nortonData:       any = null
try { nortonData        = require('@/public/data/2w/norton-motorcycles.json') } catch { /* optional */ }
/* eslint-enable @typescript-eslint/no-require-imports */

// Standard-format files (have brand/brandId/vehicles at root)
const STANDARD_BRAND_FILES: any[] = [
    hondaData, revoltData, apriliaData, bmwData, benelliData, ducatiData,
    heroData, indianData, kawasakiData, okinawaData,
    ampereData, atherData, bajajData, bajajChetakData, bounceData,
    heroElectricData, hopData, jawaData, joyData, kabiraData,
    komakiData, lectrixData, mahindra2wData, matterData, obenData,
    odysseData, okayaData, pureEvData, quantumData, riverData,
    simpleData, torkData, tvsMotorData, ultravioletteData, vespaData, yuluData,
    nortonData,
].filter(Boolean)

// Flat-format files: non-standard root key, flat item schema
// Each entry: { data, brandId, brand, rootKey }
const FLAT_BRAND_FILES: { data: any; brandId: string; brand: string; rootKey: string }[] = [
    { data: cfmotoData,       brandId: 'cfmoto-india',          brand: 'CFMoto',            rootKey: 'cfmoto_bikes' },
    { data: harleyData,       brandId: 'harley-davidson-india',  brand: 'Harley-Davidson',   rootKey: 'harley_davidson_bikes' },
    { data: husqvarnaData,    brandId: 'husqvarna-india',        brand: 'Husqvarna',         rootKey: 'husqvarna_bikes' },
    { data: keewayData,       brandId: 'keeway-india',           brand: 'Keeway',            rootKey: 'keeway_bikes' },
    { data: ktmData,          brandId: 'ktm-india',              brand: 'KTM',               rootKey: 'ktm_bikes' },
    { data: motoGuzziData,    brandId: 'moto-guzzi',             brand: 'Moto Guzzi',        rootKey: 'moto_guzzi_bikes' },
    { data: olaData,          brandId: 'ola-electric',           brand: 'Ola Electric',      rootKey: 'ola_electric_bikes' },
    { data: royalEnfieldData, brandId: 'royal-enfield',          brand: 'Royal Enfield',     rootKey: 'royal_enfield_bikes' },
    { data: suzukiData,       brandId: 'suzuki-motorcycle',      brand: 'Suzuki',            rootKey: 'suzuki_bikes' },
    { data: triumphData,      brandId: 'triumph-india',          brand: 'Triumph',           rootKey: 'triumph_bikes' },
    { data: tvsIqubeData,     brandId: 'tvs-iqube',              brand: 'TVS iQube',         rootKey: 'tvs_iqube_scooters' },
    { data: vidaData,         brandId: 'vida-hero',              brand: 'Vida (Hero)',        rootKey: 'vida_models' },
    { data: yamahaData,       brandId: 'yamaha-india',           brand: 'Yamaha',            rootKey: 'yamaha_bikes' },
    { data: yezdiData,        brandId: 'yezdi-motorcycles',      brand: 'Yezdi',             rootKey: 'yezdi_bikes' },
    { data: zontesData,       brandId: 'zontes-india',           brand: 'Zontes',            rootKey: 'zontes_bikes' },
].filter(e => e.data)

/* eslint-enable @typescript-eslint/no-explicit-any */

// ── Flat-format item extractor ──────────────────────────────────
// Handles items from brands like KTM, Yamaha, Royal Enfield, Ola, etc.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractFromFlatItem(item: any): BrandModelEnrichment {
    const specs = item.specifications || {}

    // EV detection: has range or battery_capacity at top level or in specs
    const rangeStr = item.range || specs['Range'] || specs['Claimed Range'] || specs['Range (Claimed)'] || specs['Range (Eco Mode)'] || null
    const batteryStr = item.battery_capacity || specs['Battery Capacity'] || null
    const isEV = !!(rangeStr || batteryStr)

    // Engine CC: engine / engine_displacement / engine_capacity_cc / engine_details
    const engineRaw = item.engine || item.engine_displacement || item.engine_capacity_cc || item.engine_details || specs['Engine'] || null

    // Price
    const priceStr = item.price || null

    // Mileage (petrol) — try all field name variants across brands
    const mileageStr = item.mileage
        || specs['mileage_kmpl']   // TVS, Vespa, Ultraviolette
        || specs['mileage']        // Aprilia, Benelli, BMW, Ducati
        || specs['Mileage']        // older scraped formats
        || null

    // Torque
    const torqueStr = item.torque || specs['Torque'] || null

    // Top speed
    const topSpeedStr = item.top_speed || specs['Top Speed'] || null

    // Features from specs keys
    const features: string[] = []
    if (specs['Bluetooth Connectivity'] === 'Yes' || specs['Bluetooth']) features.push('Bluetooth Connectivity')
    if (specs['USB Charging Port'] === 'Yes' || specs['USB Charging']) features.push('USB Charging Port')
    if (specs['Navigation'] === 'Yes') features.push('Navigation')
    if (specs['Riding Modes'] === 'Yes' || specs['Ride Modes']) features.push('Riding Modes')
    if (specs['Keyless Ignition'] === 'Yes' || specs['Keyless Start']) features.push('Keyless Ignition')
    if (specs['Fast Charging'] === 'Yes') features.push('Fast Charging')
    if (specs['Swappable Battery'] === 'Yes') features.push('Swappable Battery')
    if (specs['ABS'] === 'Yes' || specs['ABS']) features.push('ABS')
    if (specs['TFT Display'] === 'Yes' || specs['TFT Instrument Cluster'] === 'Yes') features.push('TFT Display')

    return {
        engine_cc: parseCC(typeof engineRaw === 'number' ? `${engineRaw} cc` : engineRaw),
        mileage_kmpl: isEV ? null : parseMileage(mileageStr),
        top_speed_kmph: parseTopSpeed(topSpeedStr),
        ex_showroom_price_paise: parsePrice(priceStr),
        range_km: parseRange(rangeStr),
        battery_kwh: parseBatteryKwh(batteryStr),
        colors: [],
        features,
        description: null,
        torque: torqueStr,
        variant: null,
        all_variants: [],
        stock_status: 'available' as const,
        wheelbase_mm: null,
        length_mm: null,
        width_mm: null,
        height_mm: null,
    }
}

// ── Extract enrichment from vehicle entries ─────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractFromVehicle(v: any): BrandModelEnrichment {
    // Honda format: has variants array
    if (v.variants && Array.isArray(v.variants) && v.variants.length > 0) {
        const firstVar = v.variants[0]
        const specs = firstVar.technical_specifications || {}
        const engine = specs.engine_and_transmission || {}
        const perf = specs.performance_and_features || {}

        const colors = (firstVar.colors || []).map((c: string | { value: string }) => {
            const name = typeof c === 'string' ? c : c.value || ''
            return { name, hex: resolveVehicleColorHex(name) }
        })

        const features: string[] = []
        if (perf['Additional Features Of Variant']) features.push(perf['Additional Features Of Variant'])
        if (engine['Gear Box']) features.push(`${engine['Gear Box']} Gearbox`)
        if (engine['Cooling System']) features.push(engine['Cooling System'])
        if (engine['Starting']) features.push(engine['Starting'])
        if (perf['Bluetooth Connectivity']) features.push('Bluetooth Connectivity')
        if (perf['USB Charging Port'] === 'Yes') features.push('USB Charging Port')
        if (perf['Navigation'] === 'Yes') features.push('Navigation')

        // Extract all variants with names + prices
        const allVariants = (v.variants || [])
            .map((variantItem: any) => ({
                name: variantItem.variant_name || '',
                price_paise: parsePrice(variantItem.price),
            }))
            .filter((vv: { name: string; price_paise: number }) => vv.name && vv.price_paise > 0)

        const dims = firstVar.technical_specifications?.dimensions_and_capacity || {}

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
            all_variants: allVariants,
            stock_status: parseSourceSection(v.source_section),
            wheelbase_mm: parseMM(dims['Wheelbase']),
            length_mm: parseMM(dims['Length']),
            width_mm: parseMM(dims['Width']),
            height_mm: parseMM(dims['Height']),
        }
    }

    // Revolt / electric format: has specifications with Motor Power / Range
    const specs = v.specifications || {}
    if (specs['Motor Power'] || specs['Range']) {
        const colors = (v.colors || []).map((c: string) => ({ name: c, hex: resolveVehicleColorHex(c) }))
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
            all_variants: [],
            stock_status: parseSourceSection(v.source_section),
            wheelbase_mm: null,
            length_mm: null,
            width_mm: null,
            height_mm: null,
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
        colors: (v.colors || []).map((c: string | { name: string }) => {
            const name = typeof c === 'string' ? c : c.name || ''
            return { name, hex: resolveVehicleColorHex(name) }
        }),
        features: genFeatures,
        description: specs.description || null,
        torque: specs.torque || v.torque || null,
        variant: null,
        all_variants: [],
        stock_status: parseSourceSection(v.source_section),
        wheelbase_mm: null,
        length_mm: null,
        width_mm: null,
        height_mm: null,
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

// Standard-format brands
for (const brandFile of STANDARD_BRAND_FILES) {
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

// Flat-format brands (non-standard root key)
for (const { data, brandId, brand, rootKey } of FLAT_BRAND_FILES) {
    const items = data[rootKey]
    if (!Array.isArray(items)) continue

    brandNameMap.set(brandId, brand)

    for (const item of items) {
        const modelName: string = item.model_name || item.bike_name || ''
        if (!modelName) continue
        const enrichment = extractFromFlatItem(item)
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

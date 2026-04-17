import 'server-only'

import fs from 'fs'
import path from 'path'
import type { Car, CarVariant } from '@/lib/types/car'

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

function normalizeText(value: string | null | undefined): string {
    return String(value ?? '')
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[.'`]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
}

function parseNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) return value
    const cleaned = String(value ?? '').replace(/[^0-9.]/g, '')
    if (!cleaned) return null
    const parsed = Number(cleaned)
    return Number.isFinite(parsed) ? parsed : null
}

function parsePrice(value: unknown): number | null {
    const parsed = parseNumber(value)
    return parsed && parsed > 0 ? Math.round(parsed) : null
}

function extractFeatureValues(input: unknown): string[] {
    if (!Array.isArray(input)) return []
    return input
        .map(item => {
            if (typeof item === 'string') return item.trim()
            if (item && typeof item === 'object' && 'value' in item) {
                return String((item as { value?: unknown }).value ?? '').trim()
            }
            return ''
        })
        .filter(Boolean)
}

function uniqueStrings(values: string[]): string[] {
    return Array.from(new Set(values.map(v => v.trim()).filter(Boolean)))
}

function summarizeRange(values: Array<number | null>, suffix: string): string {
    const filtered = values.filter((value): value is number => value != null && Number.isFinite(value))
    if (filtered.length === 0) return '—'
    const min = Math.min(...filtered)
    const max = Math.max(...filtered)
    if (min === max) return `${min} ${suffix}`
    return `${min} - ${max} ${suffix}`
}

function flattenBrandVariants(raw: unknown): Record<string, unknown>[] {
    const variants: Record<string, unknown>[] = []
    const seen = new Set<string>()

    function walk(node: unknown): void {
        if (!node || typeof node !== 'object') return
        if (Array.isArray(node)) {
            node.forEach(walk)
            return
        }

        const record = node as Record<string, unknown>
        const model = record.model ?? record.model_name
        const variant = record.variant_name ?? record.variant
        const hasUsefulDetail = Boolean(
            record.ex_showroom_price ||
            record.ex_showroom_price_min_inr ||
            record.power ||
            record.torque ||
            record.key_features ||
            record.safety_features ||
            record.image_urls
        )

        if (model && hasUsefulDetail) {
            const key = `${String(model)}::${String(variant ?? '')}`
            if (!seen.has(key)) {
                seen.add(key)
                variants.push(record)
            }
        }

        Object.values(record).forEach(walk)
    }

    walk(raw)
    return variants
}

function getBrandVariants(make: string): Record<string, unknown>[] {
    const jsonKey = MAKE_TO_JSON[make.toLowerCase()]
    if (!jsonKey) return []

    try {
        const filePath = path.join(process.cwd(), 'public', 'data', `${jsonKey}.json`)
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        return flattenBrandVariants(raw)
    } catch {
        return []
    }
}

function getMatchingModelVariants(make: string, model: string): Record<string, unknown>[] {
    const normalizedModel = normalizeText(model)

    return getBrandVariants(make).filter(entry => {
        const entryModel = normalizeText(String(entry.model ?? entry.model_name ?? ''))
        return entryModel === normalizedModel ||
            entryModel.includes(normalizedModel) ||
            normalizedModel.includes(entryModel)
    })
}

function inferAirbags(values: string[]): number {
    let airbags = 0

    for (const value of values) {
        const normalized = value.toLowerCase()
        const numeric = normalized.match(/(\d+)\s*airbags?/)
        if (numeric) airbags = Math.max(airbags, Number(numeric[1]))
        else if (normalized.includes('driver+passenger airbags') || normalized.includes('driver + passenger airbags')) airbags = Math.max(airbags, 2)
        else if (normalized.includes('airbag')) airbags = Math.max(airbags, 2)
    }

    return airbags
}

function buildVariants(entries: Record<string, unknown>[], carId: string, fallbackFuel: string, fallbackTransmission: string): CarVariant[] {
    const variants: Array<CarVariant | null> = entries.map((entry, index) => {
            const price = parsePrice(entry.ex_showroom_price ?? entry.ex_showroom_price_min_inr)
            if (!price) return null

            return {
                id: `${carId}-variant-${index}`,
                name: String(entry.variant_name ?? entry.variant ?? `Variant ${index + 1}`),
                price,
                transmission: String(entry.transmission ?? fallbackTransmission),
                fuelType: String(entry.fuel_type ?? fallbackFuel),
                keyFeatures: extractFeatureValues(entry.key_features).slice(0, 4),
                isPopular: index === 0,
            } satisfies CarVariant
        })
    return variants
        .filter((variant): variant is CarVariant => Boolean(variant))
}

export function hydrateCarWithJsonDetails(car: Car): Car {
    if (!car.make || !car.model) return car

    const matchingVariants = getMatchingModelVariants(car.make, car.model)
    if (matchingVariants.length === 0) return car

    const priceValues = matchingVariants
        .map(entry => parsePrice(entry.ex_showroom_price ?? entry.ex_showroom_price_min_inr))
        .filter((value): value is number => value != null)
    const fuelTypes = uniqueStrings(matchingVariants.map(entry => String(entry.fuel_type ?? '')).filter(Boolean))
    const transmissions = uniqueStrings(matchingVariants.map(entry => String(entry.transmission ?? '')).filter(Boolean))
    const keyFeatures = uniqueStrings(matchingVariants.flatMap(entry => extractFeatureValues(entry.key_features)))
    const safetyFeatures = uniqueStrings(matchingVariants.flatMap(entry => extractFeatureValues(entry.safety_features)))
    const allFeatureCopy = uniqueStrings([...keyFeatures, ...safetyFeatures])
    const imageUrls = uniqueStrings(
        matchingVariants.flatMap(entry => {
            const urls = entry.image_urls
            if (!Array.isArray(urls)) return []
            return urls
                .map(item => {
                    if (item && typeof item === 'object' && 'value' in item) {
                        return String((item as { value?: unknown }).value ?? '')
                    }
                    return ''
                })
                .filter(Boolean)
        })
    )

    const displacement = matchingVariants
        .map(entry => parseNumber(entry.engine_displacement_cc ?? entry.engine_displacement))
        .find(value => value != null) ?? car.engine.displacement ?? null
    const seatingCapacity = matchingVariants
        .map(entry => parseNumber(entry.seating_capacity))
        .find(value => value != null) ?? car.dimensions.seatingCapacity ?? null
    const bootSpace = matchingVariants
        .map(entry => parseNumber(entry.boot_capacity))
        .find(value => value != null) ?? car.dimensions.bootSpace ?? null
    const groundClearance = matchingVariants
        .map(entry => parseNumber((entry.dimensions as Record<string, unknown> | undefined)?.ground_clearance))
        .find(value => value != null) ?? car.dimensions.groundClearance ?? null
    const length = matchingVariants
        .map(entry => parseNumber((entry.dimensions as Record<string, unknown> | undefined)?.length))
        .find(value => value != null) ?? car.dimensions.length ?? null
    const width = matchingVariants
        .map(entry => parseNumber((entry.dimensions as Record<string, unknown> | undefined)?.width))
        .find(value => value != null) ?? car.dimensions.width ?? null
    const height = matchingVariants
        .map(entry => parseNumber((entry.dimensions as Record<string, unknown> | undefined)?.height))
        .find(value => value != null) ?? car.dimensions.height ?? null
    const powerValues = matchingVariants.map(entry => parseNumber(entry.power))
    const torqueValues = matchingVariants.map(entry => parseNumber(entry.torque))
    const mileageText = matchingVariants
        .map(entry => String(entry.mileage_range ?? entry.mileage_kmpl_or_ev_range ?? ''))
        .find(Boolean)
    const mileageNumber = parseNumber(mileageText)
    const airbags = inferAirbags(safetyFeatures)
    const variantEntries = buildVariants(
        matchingVariants,
        car.id,
        fuelTypes[0] ?? car.engine.type,
        transmissions[0] ?? car.transmission.type
    )

    return {
        ...car,
        pricing: {
            ...car.pricing,
            exShowroom: {
                min: priceValues.length > 0 ? Math.min(...priceValues) : car.pricing.exShowroom.min,
                max: priceValues.length > 0 ? Math.max(...priceValues) : car.pricing.exShowroom.max,
                currency: 'INR',
            },
            onRoad: car.pricing.onRoad,
        },
        engine: {
            ...car.engine,
            type: fuelTypes.join(' / ') || car.engine.type,
            displacement,
            power: summarizeRange(powerValues, 'bhp'),
            torque: summarizeRange(torqueValues, 'Nm'),
            range: car.engine.type === 'Electric' || fuelTypes.some(fuel => /electric/i.test(fuel))
                ? mileageNumber ?? car.engine.range ?? null
                : car.engine.range ?? null,
        },
        transmission: {
            ...car.transmission,
            type: transmissions.join(' / ') || car.transmission.type,
        },
        performance: {
            ...car.performance,
            fuelEfficiency: fuelTypes.some(fuel => /electric/i.test(fuel))
                ? car.performance.fuelEfficiency ?? null
                : mileageNumber ?? car.performance.fuelEfficiency ?? null,
            range: fuelTypes.some(fuel => /electric/i.test(fuel))
                ? mileageNumber ?? car.performance.range ?? null
                : car.performance.range ?? null,
        },
        dimensions: {
            ...car.dimensions,
            length,
            width,
            height,
            groundClearance,
            bootSpace,
            seatingCapacity,
        },
        features: {
            ...car.features,
            keyFeatures: keyFeatures.length > 0 ? keyFeatures : car.features.keyFeatures,
            safetyFeatures: safetyFeatures.length > 0 ? safetyFeatures : car.features.safetyFeatures,
            techFeatures: car.features.techFeatures?.length ? car.features.techFeatures : allFeatureCopy.slice(0, 10),
        },
        safety: {
            airbags: airbags || car.safety?.airbags || 0,
            abs: safetyFeatures.some(feature => /abs/i.test(feature)) || car.safety?.abs || false,
            esp: safetyFeatures.some(feature => /\besc\b|\besp\b|stability/i.test(feature)) || car.safety?.esp,
            hillHoldAssist: safetyFeatures.some(feature => /hill hold/i.test(feature)) || car.safety?.hillHoldAssist,
            tractionControl: safetyFeatures.some(feature => /traction control/i.test(feature)) || car.safety?.tractionControl,
            rearCamera: safetyFeatures.some(feature => /rear camera|360/i.test(feature)) || car.safety?.rearCamera,
            ncapRating: car.safety?.ncapRating,
        },
        images: {
            hero: imageUrls[0] || car.images.hero,
            exterior: imageUrls.length > 0 ? imageUrls : car.images.exterior,
            interior: car.images.interior,
            colors: car.images.colors,
        },
        variants: variantEntries.length > 0 ? variantEntries : car.variants,
        meta: {
            ...car.meta,
            dataSource: 'Brand JSON',
        },
    }
}

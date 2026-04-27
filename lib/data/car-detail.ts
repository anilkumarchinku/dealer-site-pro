import 'server-only'

import type { Car, CarVariant } from '@/lib/types/car'
import { CAR_MODEL_COLORS } from '@/lib/data/car-colors'
import { fetchCardekhoGallery } from '@/lib/data/cardekho-gallery'
import { get4WPriceMaxInr, get4WPriceMinInr } from '@/lib/data/four-wheelers'
import { getRequestOrigin } from '@/lib/utils/request-origin'

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
    // Handle {min, max} object structure from JSON data files
    if (value && typeof value === 'object' && 'min' in value) {
        return parsePrice((value as Record<string, unknown>).min)
    }
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

function removeMatchingUrl(urls: string[], blocked: string[]): string[] {
    const blockedSet = new Set(blocked.map(value => value.trim()).filter(Boolean))
    return uniqueStrings(urls).filter(url => !blockedSet.has(url))
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

    function walk(node: unknown, ctxModel?: string): void {
        if (!node || typeof node !== 'object') return
        if (Array.isArray(node)) {
            node.forEach(item => walk(item, ctxModel))
            return
        }

        const record = node as Record<string, unknown>
        const model = record.model ?? record.model_name ?? ctxModel
        const variant = record.variant_name ?? record.variant

        // Flatten nested spec objects (engine_specs, engine_performance, powertrain, dimensions)
        // so hydration can read entry.power instead of entry.engine_specs.power
        const nested = ['engine_specs', 'engine_performance', 'powertrain', 'powertrain_details'] as const
        const flat: Record<string, unknown> = { ...record }
        for (const key of nested) {
            const sub = record[key]
            if (sub && typeof sub === 'object' && !Array.isArray(sub)) {
                for (const [sk, sv] of Object.entries(sub as Record<string, unknown>)) {
                    if (flat[sk] === undefined || flat[sk] === null) flat[sk] = sv
                }
            }
        }

        const hasUsefulDetail = Boolean(
            get4WPriceMinInr(flat) ||
            get4WPriceMaxInr(flat) ||
            flat.power || flat.power_bhp ||
            flat.torque || flat.torque_nm ||
            flat.key_features ||
            flat.safety_features ||
            flat.image_urls
        )

        if (model && hasUsefulDetail) {
            const key = `${String(model)}::${String(variant ?? '')}`
            if (!seen.has(key)) {
                seen.add(key)
                // Ensure model is on the flat record (may come from ctxModel, not the record itself)
                if (!flat.model && !flat.model_name) flat.model = String(model)
                variants.push(flat)
            }
        } else if (!model && variant && hasUsefulDetail) {
            // No model field (e.g. Isuzu, Force, Jaguar, MINI) — use variant_name as-is.
            // The matching step will fuzzy-match against car.model later.
            const variantStr = String(variant)
            const key = `__nomodel__::${variantStr}`
            if (!seen.has(key)) {
                seen.add(key)
                flat.variant_name = variantStr
                variants.push(flat)
            }
        }

        // Pass model context to children so nested variants inherit the parent model
        const modelCtx = model ? String(model) : ctxModel
        for (const [k, v] of Object.entries(record)) {
            if (k === 'image_urls') continue
            if (v && typeof v === 'object') walk(v, modelCtx)
        }
    }

    walk(raw)
    return variants
}

async function getPublicJson<T>(pathname: string): Promise<T | null> {
    const origin = await getRequestOrigin()
    if (!origin) return null

    try {
        const response = await fetch(`${origin}${pathname}`, {
            next: { revalidate: 60 * 60 },
        })
        if (!response.ok) return null
        return await response.json() as T
    } catch {
        return null
    }
}

async function getBrandVariants(make: string): Promise<Record<string, unknown>[]> {
    const jsonKey = MAKE_TO_JSON[make.toLowerCase()]
    if (!jsonKey) return []

    const raw = await getPublicJson<unknown>(`/data/${jsonKey}.json`)
    return raw ? flattenBrandVariants(raw) : []
}

async function getMatchingModelVariants(make: string, model: string): Promise<Record<string, unknown>[]> {
    const normalizedModel = normalizeText(model)
    const variants = await getBrandVariants(make)

    return variants.filter(entry => {
        const entryModel = normalizeText(String(entry.model ?? entry.model_name ?? ''))
        if (entryModel) {
            return entryModel === normalizedModel ||
                entryModel.includes(normalizedModel) ||
                normalizedModel.includes(entryModel)
        }
        // No model field — match against variant_name (e.g. "V-Cross 4x2 Z AT" matches model "V Cross")
        const entryVariant = normalizeText(String(entry.variant_name ?? ''))
        return entryVariant.startsWith(normalizedModel) ||
            entryVariant.includes(normalizedModel)
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
            const price = get4WPriceMinInr(entry)
            if (!price) return null
            const exactOnRoad =
                parsePrice(entry.hyderabad_on_road_price_inr) ??
                parsePrice(entry.hyderabad_on_road_price)
            const engineCc =
                parseNumber(entry.engine_displacement_cc ?? entry.engine_displacement ?? entry.displacement)

            return {
                id: `${carId}-variant-${index}`,
                name: String(entry.variant_name ?? entry.variant ?? `Variant ${index + 1}`),
                price,
                transmission: String(entry.transmission ?? fallbackTransmission),
                fuelType: String(entry.fuel_type ?? fallbackFuel),
                engineCc,
                exactOnRoad: exactOnRoad ? { hyderabad: exactOnRoad } : undefined,
                keyFeatures: extractFeatureValues(entry.key_features).slice(0, 4),
                isPopular: index === 0,
            } satisfies CarVariant
        })
    return variants
        .filter((variant): variant is CarVariant => Boolean(variant))
}

function normalizeColorName(value: string): string {
    return value
        .replace(/\s+/g, ' ')
        .replace(/\b([a-z])/gi, (match) => match.toUpperCase())
        .trim()
}

function normalizeColorKey(value: string): string {
    return normalizeText(
        String(value ?? '')
            .replace(/\((solid|metallic|pearl)\)/gi, ' ')
            .replace(/\b(solid|metallic|pearl)\b/gi, ' ')
    )
}

function inferColorType(name: string): 'Solid' | 'Metallic' | 'Pearl' | string {
    const normalized = name.toLowerCase()
    if (normalized.includes('metallic')) return 'Metallic'
    if (normalized.includes('pearl')) return 'Pearl'
    return 'Solid'
}

function resolveVehicleColorHex(name: string): string {
    const normalized = name.toLowerCase()
    if (normalized.includes('white')) return '#F5F5F5'
    if (normalized.includes('black')) return '#1A1A1A'
    if (normalized.includes('silver')) return '#C0C0C0'
    if (normalized.includes('grey') || normalized.includes('gray')) return '#808080'
    if (normalized.includes('red') || normalized.includes('maroon')) return '#C00000'
    if (normalized.includes('blue') || normalized.includes('navy')) return '#1E40AF'
    if (normalized.includes('green') || normalized.includes('olive')) return '#2E7D32'
    if (normalized.includes('yellow') || normalized.includes('gold')) return '#D4AF37'
    if (normalized.includes('orange') || normalized.includes('bronze') || normalized.includes('copper')) return '#C26A2D'
    if (normalized.includes('brown') || normalized.includes('beige') || normalized.includes('mocha')) return '#8B6B4A'
    if (normalized.includes('purple') || normalized.includes('violet')) return '#6D28D9'
    return '#9CA3AF'
}

function extractColors(entry: Record<string, unknown>): Array<{ name: string; type: string; hex: string; extraCost: number }> {
    const candidateKeys = ['colors', 'colour_options', 'color_options', 'available_colors', 'available_colours']

    for (const key of candidateKeys) {
        const raw = entry[key]
        if (!Array.isArray(raw) || raw.length === 0) continue

        return raw
            .map((color) => {
                if (typeof color === 'string') {
                    const name = normalizeColorName(color)
                    return { name, type: inferColorType(name), hex: resolveVehicleColorHex(name), extraCost: 0 }
                }

                if (color && typeof color === 'object') {
                    const record = color as Record<string, unknown>
                    const name = normalizeColorName(String(record.name ?? record.value ?? record.label ?? ''))
                    if (!name) return null
                    const hex = String(record.hex ?? '').trim() || resolveVehicleColorHex(name)
                    return {
                        name,
                        type: String(record.type ?? inferColorType(name)),
                        hex,
                        extraCost: parsePrice(record.extraCost ?? record.extra_cost) ?? 0,
                    }
                }

                return null
            })
            .filter((color): color is { name: string; type: string; hex: string; extraCost: number } => Boolean(color))
    }

    return []
}

type HydratedColor = { name: string; type: string; hex: string; extraCost: number; image?: string }

function uniqueColors(colors: HydratedColor[]) {
    const merged: HydratedColor[] = []
    const seen = new Map<string, number>()

    for (const color of colors) {
        const key = normalizeColorKey(color.name)
        if (!key) continue

        const existingIndex = seen.get(key)
        if (existingIndex == null) {
            seen.set(key, merged.length)
            merged.push(color)
            continue
        }

        const existing = merged[existingIndex]
        merged[existingIndex] = {
            ...existing,
            type: existing.type || color.type,
            hex: existing.hex && existing.hex !== '#9CA3AF' ? existing.hex : color.hex,
            extraCost: existing.extraCost > 0 ? existing.extraCost : color.extraCost,
            ...(existing.image ? {} : color.image ? { image: color.image } : {}),
        }
    }

    return merged
}

function colorsFromNames(
    names: string[],
    images: string[] = [],
): HydratedColor[] {
    return names
        .map((name, index) => {
            const normalized = normalizeColorName(name)
            if (!normalized) return null
            const image = images[index] || undefined
            return {
                name: normalized,
                type: inferColorType(normalized),
                hex: resolveVehicleColorHex(normalized),
                extraCost: 0,
                ...(image ? { image } : {}),
            }
        })
        .filter((color): color is HydratedColor => Boolean(color))
}

export async function hydrateCarWithJsonDetails(car: Car): Promise<Car> {
    if (!car.make || !car.model) return car

    const matchingVariants = await getMatchingModelVariants(car.make, car.model)
    const sourceUrlFromVariants = matchingVariants
        .map(entry => String(entry.model_citation ?? entry.source_url ?? ''))
        .find(Boolean) || ''
    const sourceUrl = sourceUrlFromVariants || car.meta?.sourceUrl || ''
    const scrapedGallery = await fetchCardekhoGallery(sourceUrl, {
        make: car.make,
        model: car.model,
    })
    const scrapedColors = colorsFromNames(scrapedGallery?.colorNames ?? [], scrapedGallery?.colorImages ?? [])
    const fallbackColors = car.colors?.length
        ? car.colors
        : (CAR_MODEL_COLORS[`${car.make} ${car.model}`] ?? [])

    const baseHeroImage = car.images.hero
    const scrapedColorImageSet = new Set(scrapedGallery?.colorImages ?? [])
    const baseHeroIsLocalColor = Boolean(baseHeroImage && scrapedColorImageSet.has(baseHeroImage))
    const hasLocalHero = Boolean(baseHeroImage?.startsWith('/data/')) && !baseHeroIsLocalColor
    const heroImage = hasLocalHero
        ? baseHeroImage
        : (scrapedGallery?.exterior?.[0] || scrapedGallery?.hero || car.images.hero)
    const baseMergedExterior = scrapedGallery?.exterior?.length
        ? scrapedGallery.exterior
        : car.images.exterior
    const baseMergedInterior = scrapedGallery?.interior?.length
        ? scrapedGallery.interior
        : car.images.interior
    const baseMergedColorImages = scrapedGallery?.colorImages?.length
        ? scrapedGallery.colorImages
        : car.images.colors
    const baseFeatureImages = scrapedGallery?.feature ?? []
    const baseMergedExteriorWithFeatures = baseFeatureImages.length > 0
        ? uniqueStrings([...baseMergedExterior, ...baseFeatureImages])
        : baseMergedExterior
    const baseHeroBlockList = [
        heroImage,
        scrapedGallery?.hero,
        scrapedGallery?.exterior?.[0],
    ].filter(Boolean) as string[]
    const baseDedupedExterior = removeMatchingUrl(baseMergedExteriorWithFeatures, baseHeroBlockList)
    const baseDedupedInterior = removeMatchingUrl(baseMergedInterior, [heroImage, ...baseDedupedExterior])
    const mergedColorsWithoutJson = scrapedColors.length > 0 ? scrapedColors : fallbackColors

    if (matchingVariants.length === 0) {
        return {
            ...car,
            images: {
                hero: heroImage,
                exterior: baseDedupedExterior,
                interior: baseDedupedInterior,
                colors: uniqueStrings(baseMergedColorImages ?? []),
            },
            colors: mergedColorsWithoutJson,
            meta: {
                ...car.meta,
                sourceUrl: sourceUrl || car.meta?.sourceUrl,
            },
        }
    }

    const priceValues = matchingVariants
        .flatMap((entry) => {
            const min = get4WPriceMinInr(entry)
            const max = get4WPriceMaxInr(entry)
            return [min, max].filter((value): value is number => value != null)
        })
        .filter((value): value is number => value != null)
    const fuelTypes = uniqueStrings(matchingVariants.map(entry => String(entry.fuel_type ?? entry.fuel ?? '')).filter(Boolean))
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
        .map(entry => parseNumber(entry.engine_displacement_cc ?? entry.engine_displacement ?? entry.displacement))
        .find(value => value != null) ?? car.engine.displacement ?? null
    const currentVariantEntry = matchingVariants.find((entry) => normalizeText(String(entry.variant_name ?? entry.variant ?? '')) === normalizeText(car.variant))
        ?? matchingVariants[0]
    const exactHyderabadOnRoad =
        parsePrice(currentVariantEntry?.hyderabad_on_road_price_inr) ??
        parsePrice(currentVariantEntry?.hyderabad_on_road_price) ??
        car.pricing.onRoad?.hyderabad ??
        null
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
    const powerValues = matchingVariants.map(entry => parseNumber(entry.power ?? entry.power_bhp))
    const torqueValues = matchingVariants.map(entry => parseNumber(entry.torque ?? entry.torque_nm))
    const mileageText = matchingVariants
        .map(entry => String(entry.mileage_range ?? entry.mileage_kmpl_or_ev_range ?? entry.mileage ?? entry.mileage_kmpl ?? ''))
        .find(Boolean)
    const mileageNumber = parseNumber(mileageText)
    const airbags = inferAirbags(safetyFeatures)
    const variantEntries = buildVariants(
        matchingVariants,
        car.id,
        fuelTypes[0] ?? car.engine.type,
        transmissions[0] ?? car.transmission.type
    )
    const jsonColors = uniqueColors(matchingVariants.flatMap(extractColors))
    const mergedColors = uniqueColors([...scrapedColors, ...jsonColors])
    const pricedHeroImage = hasLocalHero
        ? baseHeroImage
        : (scrapedGallery?.exterior?.[0] || scrapedGallery?.hero || imageUrls[0] || car.images.hero)

    const mergedExterior = baseMergedExterior
    const mergedInterior = baseMergedInterior
    const mergedColorImages = scrapedGallery?.colorImages?.length
        ? scrapedGallery.colorImages
        : car.images.colors
    const featureImages = scrapedGallery?.feature ?? []
    const mergedExteriorWithFeatures = featureImages.length > 0
        ? uniqueStrings([...mergedExterior, ...featureImages])
        : mergedExterior
    // Block the local hero, CDN hero, AND exterior[0] (same front-view photo
    // served at different CDN paths/sizes). Also block first 2 JSON imageUrls
    // (often spacers or the same hero shot from the JSON data).
    const heroBlockList = [
        pricedHeroImage,
        scrapedGallery?.hero,
        scrapedGallery?.exterior?.[0],
        imageUrls[0],
        imageUrls[1],
    ].filter(Boolean) as string[]
    const dedupedExterior = removeMatchingUrl(mergedExteriorWithFeatures, heroBlockList)
    const dedupedInterior = removeMatchingUrl(mergedInterior, [pricedHeroImage, ...dedupedExterior])

    // Include color images in the gallery so users see more than just the hero.
    // Local gallery color images (from 4w-galleries/{brand}/{model}/colors/) are
    // reliable and model-specific — add them as additional gallery views.
    const localColorImages = (mergedColorImages ?? []).filter(url => url.startsWith('/data/'))
    const galleryExterior = localColorImages.length > 0
        ? uniqueStrings([...dedupedExterior, ...localColorImages])
        : dedupedExterior

    return {
        ...car,
        pricing: {
            ...car.pricing,
            exShowroom: {
                min: priceValues.length > 0 ? Math.min(...priceValues) : car.pricing.exShowroom.min,
                max: priceValues.length > 0 ? Math.max(...priceValues) : car.pricing.exShowroom.max,
                currency: 'INR',
            },
            onRoad: {
                ...car.pricing.onRoad,
                ...(exactHyderabadOnRoad ? { hyderabad: exactHyderabadOnRoad } : {}),
            },
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
            hero: pricedHeroImage,
            exterior: galleryExterior,
            interior: dedupedInterior,
            colors: uniqueStrings(mergedColorImages ?? []),
        },
        colors: mergedColors.length > 0 ? mergedColors : fallbackColors,
        variants: variantEntries.length > 0 ? variantEntries : car.variants,
        meta: {
            ...car.meta,
            dataSource: 'Brand JSON',
            sourceUrl: sourceUrl || car.meta?.sourceUrl,
        },
    }
}

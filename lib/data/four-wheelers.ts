import type { BodyType } from '@/lib/types/car'

export interface FourWBrandConfig {
    make: string
    jsonKey: string
    brandId: string
    cardekhoBrandUrl: string
    cardekhoBrandLabel: string
}

export const FOUR_W_BRANDS: FourWBrandConfig[] = [
    { make: 'Tata Motors', jsonKey: 'tata', brandId: 'tata', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Tata', cardekhoBrandLabel: 'Tata' },
    { make: 'Maruti Suzuki', jsonKey: 'maruti_suzuki', brandId: 'maruti-suzuki', cardekhoBrandUrl: 'https://www.cardekho.com/maruti-suzuki-cars', cardekhoBrandLabel: 'Maruti' },
    { make: 'Hyundai', jsonKey: 'hyundai', brandId: 'hyundai', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Hyundai', cardekhoBrandLabel: 'Hyundai' },
    { make: 'Honda', jsonKey: 'honda', brandId: 'honda', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Honda', cardekhoBrandLabel: 'Honda' },
    { make: 'Mahindra', jsonKey: 'mahindra', brandId: 'mahindra', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Mahindra', cardekhoBrandLabel: 'Mahindra' },
    { make: 'Kia', jsonKey: 'kia', brandId: 'kia', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Kia', cardekhoBrandLabel: 'Kia' },
    { make: 'Toyota', jsonKey: 'toyota', brandId: 'toyota', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Toyota', cardekhoBrandLabel: 'Toyota' },
    { make: 'Volkswagen', jsonKey: 'volkswagen', brandId: 'volkswagen', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Volkswagen', cardekhoBrandLabel: 'Volkswagen' },
    { make: 'Skoda', jsonKey: 'skoda', brandId: 'skoda', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Skoda', cardekhoBrandLabel: 'Skoda' },
    { make: 'MG', jsonKey: 'mg', brandId: 'mg', cardekhoBrandUrl: 'https://www.cardekho.com/cars/MG', cardekhoBrandLabel: 'MG' },
    { make: 'Renault', jsonKey: 'renault', brandId: 'renault', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Renault', cardekhoBrandLabel: 'Renault' },
    { make: 'Nissan', jsonKey: 'nissan', brandId: 'nissan', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Nissan', cardekhoBrandLabel: 'Nissan' },
    { make: 'Jeep', jsonKey: 'jeep', brandId: 'jeep', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Jeep', cardekhoBrandLabel: 'Jeep' },
    { make: 'Citroen', jsonKey: 'citroen', brandId: 'citroen', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Citroen', cardekhoBrandLabel: 'Citroen' },
    { make: 'BYD', jsonKey: 'byd', brandId: 'byd', cardekhoBrandUrl: 'https://www.cardekho.com/cars/BYD', cardekhoBrandLabel: 'BYD' },
    { make: 'Force Motors', jsonKey: 'force', brandId: 'force-motors', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Force', cardekhoBrandLabel: 'Force' },
    { make: 'Isuzu', jsonKey: 'isuzu', brandId: 'isuzu', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Isuzu', cardekhoBrandLabel: 'Isuzu' },
    { make: 'VinFast', jsonKey: 'vinfast', brandId: 'vinfast', cardekhoBrandUrl: 'https://www.cardekho.com/cars/VinFast', cardekhoBrandLabel: 'VinFast' },
    { make: 'BMW', jsonKey: 'bmw', brandId: 'bmw', cardekhoBrandUrl: 'https://www.cardekho.com/cars/BMW', cardekhoBrandLabel: 'BMW' },
    { make: 'Audi', jsonKey: 'audi', brandId: 'audi', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Audi', cardekhoBrandLabel: 'Audi' },
    { make: 'Mercedes-Benz', jsonKey: 'mercedes', brandId: 'mercedes-benz', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Mercedes-Benz', cardekhoBrandLabel: 'Mercedes-Benz' },
    { make: 'Porsche', jsonKey: 'porsche', brandId: 'porsche', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Porsche', cardekhoBrandLabel: 'Porsche' },
    { make: 'Lamborghini', jsonKey: 'lamborghini', brandId: 'lamborghini', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Lamborghini', cardekhoBrandLabel: 'Lamborghini' },
    { make: 'Ferrari', jsonKey: 'ferrari', brandId: 'ferrari', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Ferrari', cardekhoBrandLabel: 'Ferrari' },
    { make: 'Land Rover', jsonKey: 'land_rover', brandId: 'land-rover', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Land_Rover', cardekhoBrandLabel: 'Land Rover' },
    { make: 'Jaguar', jsonKey: 'jaguar', brandId: 'jaguar', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Jaguar', cardekhoBrandLabel: 'Jaguar' },
    { make: 'Lexus', jsonKey: 'lexus', brandId: 'lexus', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Lexus', cardekhoBrandLabel: 'Lexus' },
    { make: 'Volvo', jsonKey: 'volvo', brandId: 'volvo', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Volvo', cardekhoBrandLabel: 'Volvo' },
    { make: 'Mini', jsonKey: 'mini', brandId: 'mini', cardekhoBrandUrl: 'https://www.cardekho.com/cars/MINI', cardekhoBrandLabel: 'MINI' },
    { make: 'Aston Martin', jsonKey: 'aston_martin', brandId: 'aston-martin', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Aston_Martin', cardekhoBrandLabel: 'Aston Martin' },
    { make: 'Bentley', jsonKey: 'bentley', brandId: 'bentley', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Bentley', cardekhoBrandLabel: 'Bentley' },
    { make: 'Maserati', jsonKey: 'maserati', brandId: 'maserati', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Maserati', cardekhoBrandLabel: 'Maserati' },
    { make: 'Rolls-Royce', jsonKey: 'rolls_royce', brandId: 'rolls-royce', cardekhoBrandUrl: 'https://www.cardekho.com/cars/Rolls-Royce', cardekhoBrandLabel: 'Rolls-Royce' },
]

export const FOUR_W_BODY_TYPES = [
    'Hatchback',
    'Sedan',
    'SUV',
    'MPV',
    'Coupe',
    'Convertible',
    'Pickup',
] as const

export function modelToSlug(value: string): string {
    return value.toLowerCase().replace(/\./g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function normalize4WMakeKey(value: string): string {
    return value.toLowerCase().replace(/\s+/g, ' ').trim()
}

export function normalize4WModelKey(value: string): string {
    return value
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

export function normalize4WBodyType(value: unknown): BodyType | null {
    if (typeof value !== 'string') return null
    const normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
    if (!normalized) return null

    if (normalized.includes('pickup')) return 'Pickup'
    if (normalized.includes('convertible') || normalized.includes('roadster') || normalized.includes('cabriolet')) return 'Convertible'
    if (normalized.includes('coupe')) return normalized.includes('suv') ? 'SUV' : 'Coupe'
    if (normalized.includes('mpv') || normalized.includes('muv') || normalized.includes('minivan') || normalized.includes('people mover')) return 'MPV'
    if (normalized.includes('sport utilit') || normalized === 'suv' || normalized.includes('crossover')) return 'SUV'
    if (normalized.includes('hatchback')) return 'Hatchback'
    if (normalized.includes('sedan')) return 'Sedan'
    if (normalized.includes('van')) return 'MPV'
    if (normalized.includes('wagon')) return 'Hatchback'

    return null
}

export interface FourWModelSummary {
    model: string
    imageUrl: string | null
    priceMinInr: number | null
    fuelType: string | null
    transmission: string | null
    seating: number
}

function getImageUrl(imgUrls: unknown): string | null {
    if (!Array.isArray(imgUrls)) return null
    const match = imgUrls.find((item) => {
        if (!item || typeof item !== 'object') return false
        const candidate = item as { value?: unknown }
        return typeof candidate.value === 'string' && candidate.value.startsWith('http')
    }) as { value?: string } | undefined
    return match?.value ?? null
}

function parse4WPriceValue(value: unknown): number | null {
    if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>
        if ('min' in record) return parse4WPriceValue(record.min)
        if ('value' in record) return parse4WPriceValue(record.value)
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
        return Math.round(value)
    }

    const cleaned = String(value ?? '').replace(/[^0-9.]/g, '')
    if (!cleaned) return null

    const parsed = Number(cleaned)
    return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null
}

export function get4WPriceMinInr(record: Record<string, unknown>, fallback?: unknown): number | null {
    return parse4WPriceValue(
        record.ex_showroom_price_min_inr ??
        record.ex_showroom_price_min ??
        record.ex_showroom_min ??
        record.ex_showroom_price_range ??
        record.ex_showroom_price ??
        (record.pricing as Record<string, unknown> | undefined)?.ex_showroom_min ??
        (record.pricing as Record<string, unknown> | undefined)?.ex_showroom ??
        (record.pricing as Record<string, unknown> | undefined)?.ex_showroom_price ??
        fallback ??
        null
    )
}

export function get4WPriceMaxInr(record: Record<string, unknown>, fallback?: unknown): number | null {
    return parse4WPriceValue(
        record.ex_showroom_price_max_inr ??
        record.ex_showroom_price_max ??
        record.ex_showroom_max ??
        (record.pricing as Record<string, unknown> | undefined)?.ex_showroom_max ??
        get4WPriceMinInr(record, fallback)
    )
}

export function extract4WModelsFromJson(raw: unknown): FourWModelSummary[] {
    const models: FourWModelSummary[] = []
    const seen = new Set<string>()

    function walk(node: unknown, ctxModel?: string, ctxPrice?: unknown, ctxFuel?: unknown): void {
        if (!node || typeof node !== 'object') return

        if (Array.isArray(node)) {
            node.forEach((item) => walk(item, ctxModel, ctxPrice, ctxFuel))
            return
        }

        const record = node as Record<string, unknown>
        const model = String(record.model ?? record.model_name ?? ctxModel ?? '').trim()
        const imageUrl = getImageUrl(record.image_urls)
        const price = get4WPriceMinInr(record, ctxPrice)
        const fuel = record.fuel_type ?? ctxFuel ?? null
        const transmission = record.transmission ?? null
        const seating = Number(record.seating_capacity ?? 5) || 5

        if (model) {
            const looksLikeAggregateLabel = model.includes(',') && !imageUrl && !price
            if (!looksLikeAggregateLabel) {
                const key = normalize4WModelKey(model)
                if (!seen.has(key)) {
                    seen.add(key)
                    models.push({
                        model,
                        imageUrl,
                        priceMinInr: price,
                        fuelType: typeof fuel === 'string' ? fuel : null,
                        transmission: typeof transmission === 'string' ? transmission : null,
                        seating,
                    })
                } else if (price) {
                    // Backfill: model was seen at parent level (no price) but
                    // this nested variant has price data (e.g. Honda: model at
                    // top level, price inside variants array)
                    const existing = models.find(m => normalize4WModelKey(m.model) === key)
                    if (existing && !existing.priceMinInr) existing.priceMinInr = price
                    if (existing && !existing.imageUrl && imageUrl) existing.imageUrl = imageUrl
                    if (existing && !existing.fuelType && typeof fuel === 'string') existing.fuelType = fuel
                    if (existing && !existing.transmission && typeof transmission === 'string') existing.transmission = transmission
                }
            }
        }

        for (const [key, value] of Object.entries(record)) {
            if (key === 'image_urls') continue
            if (value && typeof value === 'object') {
                walk(value, model || ctxModel, price, fuel)
            }
        }
    }

    walk(raw)

    if (models.length > 0) return models

    function collectFromImageUrl(node: unknown): void {
        if (!node || typeof node !== 'object') return
        if (Array.isArray(node)) {
            node.forEach(collectFromImageUrl)
            return
        }

        const record = node as Record<string, unknown>
        const imageUrl = getImageUrl(record.image_urls)
        if (imageUrl) {
            const match = imageUrl.match(/\/([A-Z][^/]+)\/\d{4,}\//)
            if (match) {
                const model = match[1].replace(/-/g, ' ')
                const key = normalize4WModelKey(model)
                if (!seen.has(key)) {
                    seen.add(key)
                    models.push({
                        model,
                        imageUrl,
                        priceMinInr: get4WPriceMinInr(record),
                        fuelType: typeof record.fuel_type === 'string' ? record.fuel_type : null,
                        transmission: typeof record.transmission === 'string' ? record.transmission : null,
                        seating: Number(record.seating_capacity ?? 5) || 5,
                    })
                }
            }
        }

        for (const [key, value] of Object.entries(record)) {
            if (key === 'image_urls') continue
            if (value && typeof value === 'object') {
                collectFromImageUrl(value)
            }
        }
    }

    collectFromImageUrl(raw)
    return models
}

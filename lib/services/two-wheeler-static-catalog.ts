import fs from 'fs'
import path from 'path'
import {
    brandNameToId,
    getVehicleImageUrls,
    modelToSlug,
} from '@/lib/utils/brand-model-images'
import { isDiscontinuedTwoWheeler } from '@/lib/utils/two-wheeler-source-status'
import { defaultTwoWheelerVariantName, normalizeTwoWheelerVariants } from '@/lib/utils/two-wheeler-variants'
import {
    parseBatteryKwh,
    parseMileage,
    parseNumberFromString,
    parsePriceToPaise,
    StaticVehicleListItem,
} from '@/lib/services/static-vehicle-catalog-service'

interface BrandModelsFile {
    twoWheelers: {
        traditional: BrandModelEntry[]
        electric: BrandModelEntry[]
    }
}

interface BrandModelEntry {
    brandId: string
    brand: string
    models: {
        motorcycles?: string[]
        scooters?: string[]
    }
}

interface RawVehicleFile {
    brand: string
    brandId: string
    vehicles: RawVehicle[]
}

interface RawVehicle {
    make?: string
    model?: string
    variant_name: string
    price?: string
    ex_showroom_price?: string
    engine_displacement?: string
    mileage?: string
    max_power?: string
    max_torque?: string
    top_speed?: string
    fuel_type?: string
    transmission?: string
    source_section?: string
    description?: string
    features?: string[]
    variants?: { name?: string; variant_name?: string; price?: string | number; price_paise?: number }[]
    colors?: { name: string; hex: string }[]
    technical_specifications?: Record<string, string | undefined>
    engine_details?: Record<string, string | undefined>
}

export interface ProcessedTwoWheeler extends StaticVehicleListItem {
    id: string
    fuel_type: string
    engine_cc: number | null
    mileage_kmpl: number | null
    range_km: number | null
    battery_kwh: number | null
    top_speed_kmph: number | null
    image_url: string | null
    year: number
}

let cachedVehicles: ProcessedTwoWheeler[] | null = null
let cachedScooterModels: Set<string> | null = null
let cachedElectricBrandIds: Set<string> | null = null

function getScooterModelsAndElectricBrands(): {
    scooterModels: Set<string>
    electricBrandIds: Set<string>
} {
    if (cachedScooterModels && cachedElectricBrandIds) {
        return { scooterModels: cachedScooterModels, electricBrandIds: cachedElectricBrandIds }
    }

    const bmPath = path.join(process.cwd(), 'lib', 'data', 'brand-models.json')
    const bmData: BrandModelsFile = JSON.parse(fs.readFileSync(bmPath, 'utf-8'))
    const scooterModels = new Set<string>()
    const electricBrandIds = new Set<string>()

    for (const entry of bmData.twoWheelers.traditional) {
        for (const model of entry.models.scooters ?? []) {
            scooterModels.add(`${entry.brandId}::${model.toLowerCase()}`)
        }
    }

    for (const entry of bmData.twoWheelers.electric) {
        electricBrandIds.add(entry.brandId)
        for (const model of entry.models.scooters ?? []) {
            scooterModels.add(`${entry.brandId}::${model.toLowerCase()}`)
        }
    }

    cachedScooterModels = scooterModels
    cachedElectricBrandIds = electricBrandIds
    return { scooterModels, electricBrandIds }
}

function buildTwoWheelerBase(
    brandName: string,
    brandId: string,
    vehicle: RawVehicle,
    index: number,
    scooterModels: Set<string>,
    electricBrandIds: Set<string>
) {
    const modelName = vehicle.model ?? vehicle.variant_name.split('/')[0].trim()
    const fuelTypeRaw = (
        vehicle.fuel_type ??
        vehicle.technical_specifications?.fuel_type ??
        ''
    ).toLowerCase()
    const isElectric = fuelTypeRaw === 'electric' || electricBrandIds.has(brandId)
    const scooterKey = `${brandId}::${modelName.toLowerCase()}`
    const vehicleType = isElectric ? 'electric' : scooterModels.has(scooterKey) ? 'scooter' : 'bike'
    const priceStr = vehicle.price ?? vehicle.ex_showroom_price
    const { kmpl, rangeKm } = parseMileage(vehicle.mileage)
    const imageUrls = getVehicleImageUrls('2w', brandNameToId(brandName, '2w'), modelName)

    return {
        id: `${brandId}-${modelToSlug(modelName)}-${index}`,
        make: vehicle.make ?? brandName,
        model: modelName,
        variant: vehicle.variant_name,
        type: vehicleType,
        fuel_type: isElectric ? 'electric' : 'petrol',
        engine_cc: parseNumberFromString(vehicle.engine_displacement ?? vehicle.engine_details?.displacement),
        mileage_kmpl: kmpl,
        range_km: rangeKm,
        battery_kwh: parseBatteryKwh(vehicle.technical_specifications?.battery_capacity),
        top_speed_kmph: parseNumberFromString(vehicle.top_speed ?? vehicle.technical_specifications?.top_speed),
        price_min_paise: parsePriceToPaise(priceStr),
        price_display: priceStr ?? null,
        image_url: imageUrls[0] ?? null,
        image_urls: imageUrls,
        is_featured: false,
        year: new Date().getFullYear(),
    }
}

function toTwoWheelerListItem(
    built: ReturnType<typeof buildTwoWheelerBase>
): ProcessedTwoWheeler {
    return {
        id: built.id,
        make: built.make,
        model: built.model,
        variant: built.variant,
        type: built.type,
        fuel_type: built.fuel_type,
        engine_cc: built.engine_cc,
        mileage_kmpl: built.mileage_kmpl,
        range_km: built.range_km,
        battery_kwh: built.battery_kwh,
        top_speed_kmph: built.top_speed_kmph,
        price_min_paise: built.price_min_paise,
        image_url: built.image_url,
        is_featured: built.is_featured,
        year: built.year,
    }
}

export function loadTwoWheelerCatalogVehicles(): ProcessedTwoWheeler[] {
    if (cachedVehicles) return cachedVehicles

    const dir = path.join(process.cwd(), 'public', 'data', '2w')
    const files = fs.readdirSync(dir).filter((file) => file.endsWith('.json'))
    const { scooterModels, electricBrandIds } = getScooterModelsAndElectricBrands()
    const allVehicles: ProcessedTwoWheeler[] = []

    for (const file of files) {
        const raw: RawVehicleFile = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))
        for (let i = 0; i < raw.vehicles.length; i++) {
            const vehicle = raw.vehicles[i]
            if (isDiscontinuedTwoWheeler(vehicle.source_section)) continue
            const built = buildTwoWheelerBase(raw.brand, raw.brandId, vehicle, i, scooterModels, electricBrandIds)
            allVehicles.push(toTwoWheelerListItem(built))
        }
    }

    cachedVehicles = allVehicles
    return allVehicles
}

export function findTwoWheelerCatalogVehicleById(id: string) {
    const dir = path.join(process.cwd(), 'public', 'data', '2w')
    const files = fs.readdirSync(dir).filter((file) => file.endsWith('.json'))
    const { scooterModels, electricBrandIds } = getScooterModelsAndElectricBrands()

    for (const file of files) {
        const raw: RawVehicleFile = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))

        for (let i = 0; i < raw.vehicles.length; i++) {
            const vehicle = raw.vehicles[i]
            const modelName = vehicle.model ?? vehicle.variant_name.split('/')[0].trim()
            const vehicleId = `${raw.brandId}-${modelToSlug(modelName)}-${i}`
            if (vehicleId !== id) continue
            if (isDiscontinuedTwoWheeler(vehicle.source_section)) return null

            const built = buildTwoWheelerBase(raw.brand, raw.brandId, vehicle, i, scooterModels, electricBrandIds)
            const variants = normalizeTwoWheelerVariants(vehicle.variants, {
                name: defaultTwoWheelerVariantName(built.model, built.variant),
                price_paise: built.price_min_paise,
            })
            return {
                id: built.id,
                make: built.make,
                model: built.model,
                variant: built.variant,
                type: built.type,
                fuel_type: built.fuel_type,
                engine_cc: built.engine_cc,
                mileage_kmpl: built.mileage_kmpl,
                range_km: built.range_km,
                battery_kwh: built.battery_kwh,
                top_speed_kmph: built.top_speed_kmph,
                price_min_paise: built.price_min_paise,
                price_display: built.price_display,
                image_url: built.image_url,
                image_urls: built.image_urls,
                is_featured: false,
                year: built.year,
                max_power: vehicle.max_power ?? null,
                max_torque: vehicle.max_torque ?? null,
                transmission: vehicle.transmission ?? null,
                description: vehicle.description ?? null,
                features: vehicle.features ?? [],
                variants: variants.map((variant) => ({
                    name: variant.name,
                    price: variant.price_paise > 0 ? String(variant.price_paise / 100) : '',
                })),
                colors: vehicle.colors ?? [],
                technical_specifications: vehicle.technical_specifications ?? {},
            }
        }
    }

    return null
}

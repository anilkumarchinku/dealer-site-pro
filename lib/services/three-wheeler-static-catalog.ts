import fs from 'fs'
import path from 'path'
import {
    brandNameToId,
    modelToSlug,
} from '@/lib/utils/brand-model-images'
import { get3wVehicleImageUrls } from '@/lib/utils/resolve-3w-images'
import {
    parseMileage,
    parseNumberFromString,
    parsePassengerCapacity,
    parsePriceToPaise,
    StaticVehicleListItem,
} from '@/lib/services/static-vehicle-catalog-service'

interface BrandModelsFile {
    threeWheelers: ThreeWheelerBrandEntry[]
}

interface ThreeWheelerBrandEntry {
    brandId: string
    brand: string
    models: {
        passenger?: string[]
        cargo?: string[]
        cargo_cng?: string[]
        electric?: string[]
    }
}

interface RawVehicleFile {
    brand: string
    brandId: string
    vehicles: RawVehicle[]
}

interface RawVehicle {
    model?: string
    variant_name: string
    ex_showroom_price?: string
    price?: string
    mileage?: string
    engine_details?: {
        displacement?: string
        max_power?: string
        torque?: string
        motor_type?: string
    }
    payload_features?: {
        gross_vehicle_weight?: string
        payload_capacity?: string
    }
    technical_specifications?: {
        fuel_type?: string
        transmission_type?: string
        battery_capacity?: string
        range?: string
        top_speed?: string
        seating_capacity?: string
        body_type?: string
        [key: string]: string | undefined
    }
    dimensions?: {
        [key: string]: string | undefined
    }
    source_url?: string
}

type ThreeWheelerType = 'passenger' | 'cargo' | 'electric'

export interface ProcessedThreeWheeler extends StaticVehicleListItem {
    id: string
    fuel_type: string
    engine_cc: number | null
    mileage_kmpl: number | null
    range_km: number | null
    payload_kg: number | null
    passenger_capacity: number | null
    image_url: string | null
    year: number
}

let cachedVehicles: ProcessedThreeWheeler[] | null = null
let cachedTypeMap: Map<string, ThreeWheelerType> | null = null

function getTypeMap(): Map<string, ThreeWheelerType> {
    if (cachedTypeMap) return cachedTypeMap

    const bmPath = path.join(process.cwd(), 'lib', 'data', 'brand-models.json')
    const bmData: BrandModelsFile = JSON.parse(fs.readFileSync(bmPath, 'utf-8'))
    const map = new Map<string, ThreeWheelerType>()

    for (const entry of bmData.threeWheelers) {
        for (const model of entry.models.passenger ?? []) {
            map.set(`${entry.brandId}::${model.toLowerCase()}`, 'passenger')
        }
        for (const model of entry.models.cargo ?? []) {
            map.set(`${entry.brandId}::${model.toLowerCase()}`, 'cargo')
        }
        for (const model of entry.models.cargo_cng ?? []) {
            map.set(`${entry.brandId}::${model.toLowerCase()}`, 'cargo')
        }
        for (const model of entry.models.electric ?? []) {
            map.set(`${entry.brandId}::${model.toLowerCase()}`, 'electric')
        }
    }

    cachedTypeMap = map
    return map
}

function classifyType(
    brandId: string,
    modelName: string,
    fuelType: string,
    payloadKg: number | null,
    passengerCapacity: number | null,
    bodyType: string | undefined
): ThreeWheelerType {
    const typeMap = getTypeMap()
    const key = `${brandId}::${modelName.toLowerCase()}`
    if (typeMap.has(key)) return typeMap.get(key)!

    for (const [mapKey, mapType] of typeMap.entries()) {
        if (!mapKey.startsWith(`${brandId}::`)) continue
        const mapModel = mapKey.split('::')[1]
        if (modelName.toLowerCase().includes(mapModel)) return mapType
    }

    if (fuelType === 'electric') return 'electric'
    if (bodyType) {
        const bodyTypeLower = bodyType.toLowerCase()
        if (bodyTypeLower.includes('passenger')) return 'passenger'
        if (bodyTypeLower.includes('cargo') || bodyTypeLower.includes('load')) return 'cargo'
    }
    if (passengerCapacity && passengerCapacity >= 3) return 'passenger'
    if (payloadKg && payloadKg > 0) return 'cargo'
    return 'passenger'
}

function buildThreeWheelerVariant(
    brandName: string,
    brandId: string,
    vehicle: RawVehicle,
    index: number,
) {
    const rec = vehicle as unknown as Record<string, unknown>
    const modelName = vehicle.model ?? vehicle.variant_name?.split('/')[0].trim() ?? 'Unknown'
    const fuelTypeRaw = ((rec.fuel_type as string) ?? vehicle.technical_specifications?.fuel_type ?? '')
        .toString()
        .toLowerCase()
    const priceStr = vehicle.ex_showroom_price ?? vehicle.price
    const parsedMileage = parseMileage((rec.mileage_kmpl as number | string | undefined) ?? vehicle.mileage, {
        includeKmPerKg: true,
        rangeMode: 'three-wheeler',
    })
    const specRange = parseNumberFromString(vehicle.technical_specifications?.range)
    const payloadKg = (typeof rec.payload_kg === 'number' ? rec.payload_kg : null)
        ?? parseNumberFromString(vehicle.payload_features?.payload_capacity)
    const passengerCapacity = (typeof rec.passenger_capacity === 'number' ? rec.passenger_capacity : null)
        ?? parsePassengerCapacity(vehicle.technical_specifications?.seating_capacity)
    const vehicleCategory = (rec.vehicle_category as string | null) ?? null
    const vehicleType = vehicleCategory
        ? (vehicleCategory as ThreeWheelerType)
        : classifyType(
            brandId,
            modelName,
            fuelTypeRaw,
            payloadKg,
            passengerCapacity,
            vehicle.technical_specifications?.body_type
        )
    const imageUrls = get3wVehicleImageUrls(brandNameToId(brandName, '3w'), modelName)
    const gvw = (rec.gvw_kg as number | null) ?? null

    return {
        id: `${brandId}-${modelToSlug(modelName)}-${index}`,
        make: brandName,
        model: modelName,
        variant: (rec.variant as string) ?? vehicle.variant_name ?? null,
        type: vehicleType,
        fuel_type: fuelTypeRaw === 'electric' ? 'electric' : (fuelTypeRaw || 'petrol'),
        engine_cc: (typeof rec.engine_cc === 'number' ? rec.engine_cc : null)
            ?? parseNumberFromString(vehicle.engine_details?.displacement),
        max_power: (rec.max_power as string | null) ?? vehicle.engine_details?.max_power ?? null,
        torque: (rec.torque as string | null) ?? vehicle.engine_details?.torque ?? null,
        transmission: (rec.transmission_type as string | null)
            ?? vehicle.technical_specifications?.transmission_type
            ?? null,
        mileage_kmpl: parsedMileage.kmpl ?? (typeof rec.mileage_kmpl === 'number' ? rec.mileage_kmpl : null),
        range_km: parsedMileage.rangeKm ?? specRange ?? (rec.range_km as number | null) ?? null,
        top_speed_kmph: (rec.top_speed_kmph as number | null)
            ?? parseNumberFromString(vehicle.technical_specifications?.top_speed)
            ?? null,
        payload_kg: payloadKg,
        passenger_capacity: passengerCapacity,
        gvw_kg: gvw,
        wheelbase_mm: (rec.wheelbase_mm as number | null) ?? null,
        price_min_paise: parsePriceToPaise(priceStr),
        price_display: priceStr ?? null,
        image_url: imageUrls[0] ?? null,
        image_urls: imageUrls,
        is_featured: false,
        year: new Date().getFullYear(),
        motor_type: vehicle.engine_details?.motor_type ?? null,
        gross_vehicle_weight: vehicle.payload_features?.gross_vehicle_weight ?? (gvw ? `${gvw} kg` : null),
        technical_specifications: vehicle.technical_specifications ?? {},
        dimensions: vehicle.dimensions ?? {},
        features: (rec.features as string[] | null) ?? [],
        description: (rec.description as string | null) ?? null,
    }
}

export function loadThreeWheelerCatalogVehicles(): ProcessedThreeWheeler[] {
    if (cachedVehicles) return cachedVehicles

    const dir = path.join(process.cwd(), 'public', 'data', '3w')
    const files = fs.readdirSync(dir).filter((file) => file.endsWith('.json'))
    const allVehicles: ProcessedThreeWheeler[] = []

    for (const file of files) {
        const raw: RawVehicleFile = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))
        for (let i = 0; i < raw.vehicles.length; i++) {
            const built = buildThreeWheelerVariant(raw.brand, raw.brandId, raw.vehicles[i], i)
            allVehicles.push({
                id: built.id,
                make: built.make,
                model: built.model,
                variant: built.variant ?? '',
                type: built.type,
                fuel_type: built.fuel_type,
                engine_cc: built.engine_cc,
                mileage_kmpl: built.mileage_kmpl,
                range_km: built.range_km,
                payload_kg: built.payload_kg,
                passenger_capacity: built.passenger_capacity,
                price_min_paise: built.price_min_paise,
                image_url: built.image_url,
                is_featured: built.is_featured,
                year: built.year,
            })
        }
    }

    cachedVehicles = allVehicles
    return allVehicles
}

export function findThreeWheelerCatalogVehicleById(id: string) {
    const dir = path.join(process.cwd(), 'public', 'data', '3w')
    const files = fs.readdirSync(dir).filter((file) => file.endsWith('.json'))

    for (const file of files) {
        const raw: RawVehicleFile = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))
        let targetIndex = -1
        let targetModelName = ''

        for (let i = 0; i < raw.vehicles.length; i++) {
            const vehicle = raw.vehicles[i]
            const modelName = vehicle.model ?? vehicle.variant_name?.split('/')[0].trim() ?? 'Unknown'
            const vehicleId = `${raw.brandId}-${modelToSlug(modelName)}-${i}`
            if (vehicleId === id) {
                targetIndex = i
                targetModelName = modelName
                break
            }
        }

        if (targetIndex === -1) continue

        const mainVehicle = buildThreeWheelerVariant(raw.brand, raw.brandId, raw.vehicles[targetIndex], targetIndex)
        const variants = []

        for (let i = 0; i < raw.vehicles.length; i++) {
            const vehicle = raw.vehicles[i]
            const modelName = vehicle.model ?? vehicle.variant_name?.split('/')[0].trim() ?? 'Unknown'
            if (modelName.toLowerCase() !== targetModelName.toLowerCase()) continue

            const variant = buildThreeWheelerVariant(raw.brand, raw.brandId, vehicle, i)
            variants.push({
                id: variant.id,
                variant: variant.variant,
                fuel_type: variant.fuel_type,
                price_min_paise: variant.price_min_paise,
                engine_cc: variant.engine_cc,
                max_power: variant.max_power,
                mileage_kmpl: variant.mileage_kmpl,
                range_km: variant.range_km,
            })
        }

        return { ...mainVehicle, variants }
    }

    return null
}

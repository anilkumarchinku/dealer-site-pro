import { NextResponse } from 'next/server'
import type { CatalogModel } from '@/lib/types/catalog'
import { requireAdminSession } from '@/lib/utils/admin-session'
import { get4WCardekhoBrandMeta, get4WCardekhoModelMeta } from '@/lib/data/4w-cardekho-meta'
import { extract4WModelsFromJson, FOUR_W_BRANDS, modelToSlug, normalize4WModelKey } from '@/lib/data/four-wheelers'

const TWO_W_FILES = [
    'ampere-greaves', 'aprilia-india', 'ather-energy', 'bajaj-auto', 'bajaj-chetak-ev',
    'battre-ev', 'benelli-india', 'bgauss', 'bmw-motorrad-india', 'bounce-infinity',
    'brixton-motorcycles', 'bsa', 'cfmoto-india', 'ducati-india', 'evolet', 'ferrato',
    'gemopai', 'harley-davidson-india', 'hero-electric', 'hero-motocorp', 'honda',
    'hop-electric', 'husqvarna-india', 'indian-motorcycle', 'ivoomi-energy', 'jawa-motorcycles',
    'joy-e-bike', 'kabira-mobility', 'kawasaki-india', 'keeway-india', 'kinetic', 'komaki',
    'ktm-india', 'lectrix-ev', 'mahindra-two-wheelers', 'matter-ev', 'moto-guzzi', 'motomorini',
    'norton-motorcycles', 'numeros', 'oben-electric', 'odysse-electric', 'okaya-ev',
    'okinawa-autotech', 'ola-electric', 'opg-mobility', 'pure-ev', 'qj-motor-india',
    'quantum-energy', 'raptee', 'revolt-motors', 'river-ev', 'royal-enfield', 'simple-energy',
    'suzuki-motorcycle', 'tork-motors', 'triumph-india', 'tvs-iqube', 'tvs-motor',
    'ultraviolette', 'vespa-india', 'vida-hero', 'vlf', 'yamaha-india', 'yezdi-motorcycles',
    'yo', 'yulu', 'zontes-india',
] as const

const THREE_W_FILES = [
    'altigreen', 'atul-auto', 'bajaj-auto-3w', 'etrio', 'euler-motors', 'greaves-electric-3w',
    'kinetic-green', 'lohia-auto', 'mahindra-3w', 'montra-ev', 'omega-seiki-mobility',
    'osm', 'piaggio-ape', 'saera-ev', 'terra-motors', 'tvs-king', 'yc-ev', 'youdha',
] as const

async function fetchJson<T>(origin: string, pathname: string): Promise<T | null> {
    try {
        const response = await fetch(`${origin}${pathname}`, {
            next: { revalidate: 60 * 60 },
            cache: 'no-store',
        })
        if (!response.ok) return null
        return await response.json() as T
    } catch {
        return null
    }
}

function load4WModelsFromJson(raw: unknown, make: string, brandId: string): CatalogModel[] {
    const brandMeta = get4WCardekhoBrandMeta(make)
    const localModels = extract4WModelsFromJson(raw)
    const models: CatalogModel[] = []
    const seen = new Set<string>()

    const pushModel = (modelName: string, imageUrl: string | null, price: string | number | null, fuelType: string | null) => {
        const key = normalize4WModelKey(modelName)
        if (seen.has(key)) return
        seen.add(key)
        models.push({
            id: `4w-${brandId}-${modelToSlug(modelName)}`,
            brand: make,
            brandId,
            model: modelName,
            imageUrl,
            price: typeof price === 'number' ? String(price) : price,
            fuelType,
            category: '4w',
        })
    }

    for (const localModel of localModels) {
        const meta = get4WCardekhoModelMeta(make, localModel.model)
        pushModel(
            localModel.model,
            localModel.imageUrl ?? meta?.imageUrl ?? null,
            localModel.priceMinInr ?? meta?.priceMinInr ?? null,
            localModel.fuelType ?? meta?.fuelType ?? null,
        )
    }

    for (const meta of Object.values(brandMeta?.models ?? {})) {
        pushModel(meta.model, meta.imageUrl, meta.priceMinInr, meta.fuelType)
    }

    return models
}

export async function GET(request: Request) {
    const { errorResponse } = await requireAdminSession()
    if (errorResponse) return errorResponse

    const origin = new URL(request.url).origin
    const models: CatalogModel[] = []

    for (const { make, jsonKey, brandId } of FOUR_W_BRANDS) {
        const raw = await fetchJson<unknown>(origin, `/data/${jsonKey}.json`)
        if (!raw) continue
        models.push(...load4WModelsFromJson(raw, make, brandId))
    }

    for (const fileId of TWO_W_FILES) {
        const raw = await fetchJson<{ brand?: string; brandId?: string; vehicles?: Array<Record<string, unknown>> }>(
            origin,
            `/data/2w/${fileId}.json`
        )
        if (!raw?.vehicles?.length) continue

        const brand = raw.brand ?? fileId
        const brandId = raw.brandId ?? fileId

        for (const vehicle of raw.vehicles) {
            const model = String(vehicle.model ?? '').trim()
            if (!model) continue

            models.push({
                id: `2w-${brandId}-${modelToSlug(model)}`,
                brand,
                brandId,
                model,
                imageUrl: `https://llsvbyeumrfngjvbedbz.supabase.co/storage/v1/object/public/vehicle-images/2w/${brandId}/${modelToSlug(model)}.jpg`,
                price: vehicle.price ? String(vehicle.price) : null,
                fuelType: vehicle.fuel_type ? String(vehicle.fuel_type) : null,
                category: '2w',
            })
        }
    }

    for (const fileId of THREE_W_FILES) {
        const raw = await fetchJson<{ brand?: string; brandId?: string; vehicles?: Array<Record<string, unknown>> }>(
            origin,
            `/data/3w/${fileId}.json`
        )
        if (!raw?.vehicles?.length) continue

        const brand = raw.brand ?? fileId
        const brandId = raw.brandId ?? fileId
        const seen = new Set<string>()

        for (const vehicle of raw.vehicles) {
            const model = String(vehicle.variant_name ?? vehicle.model ?? '').split('/')[0].trim()
            const key = model.toLowerCase()
            if (!model || seen.has(key)) continue
            seen.add(key)

            models.push({
                id: `3w-${brandId}-${modelToSlug(model)}`,
                brand,
                brandId,
                model,
                imageUrl: `https://llsvbyeumrfngjvbedbz.supabase.co/storage/v1/object/public/vehicle-images/3w/${brandId}/${modelToSlug(model)}.jpg`,
                price: vehicle.ex_showroom_price ? String(vehicle.ex_showroom_price) : null,
                fuelType: null,
                category: '3w',
            })
        }
    }

    return NextResponse.json({ models })
}

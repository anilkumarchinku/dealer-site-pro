import { readFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { CatalogBrand, CatalogCategory, CatalogModel } from '@/lib/types/catalog'
import { createAdminClient, getDealerForUser, requireAuth, type RouteSupabaseClient } from '@/lib/supabase-server'
import { get4WCardekhoBrandMeta, get4WCardekhoModelMeta } from '@/lib/data/4w-cardekho-meta'
import { extract4WModelsFromJson, FOUR_W_BRANDS, modelToSlug, normalize4WModelKey } from '@/lib/data/four-wheelers'
import { resolveThwCatalogMake, resolveTwCatalogMake } from '@/lib/data/catalog-db'
import brandData from '@/lib/data/brand-models.json'

type SupabaseTableClient = ReturnType<typeof createAdminClient> | RouteSupabaseClient

type DealerBrandRow = {
    brand_name: string
    is_primary?: boolean | null
    vehicle_type?: string | null
}

type DealerProfileRow = {
    id: string
    brands: string[] | null
}

type BrandModelMeta = {
    brandId: string
    brand: string
    models?: Record<string, string[]>
}

type StaticVehiclePayload = {
    brand?: string
    brandId?: string
    vehicles?: Array<Record<string, unknown>>
}

type CatalogDbRow = {
    id: string
    make: string
    model: string
    variant?: string | null
    year?: number | null
    body_type?: string | null
    fuel_type?: string | null
    price_min_paise?: number | null
    price_max_paise?: number | null
    image_url?: string | null
    is_active?: boolean | null
}

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

const parsedBrandData = brandData as {
    twoWheelers: {
        traditional: BrandModelMeta[]
        electric: BrandModelMeta[]
    }
    threeWheelers: BrandModelMeta[]
}

const TWO_W_BRANDS = [
    ...parsedBrandData.twoWheelers.traditional,
    ...parsedBrandData.twoWheelers.electric,
]

const THREE_W_BRANDS = parsedBrandData.threeWheelers

const addModelSchema = z.object({
    category: z.enum(['4w', '2w', '3w']),
    brand: z.string().trim().min(1),
    model: z.string().trim().min(1).max(120),
    variant: z.string().trim().max(120).optional().nullable(),
    year: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
    fuelType: z.string().trim().max(40).optional().nullable(),
    bodyType: z.string().trim().max(60).optional().nullable(),
    price: z.string().trim().max(40).optional().nullable(),
    imageUrl: z.string().trim().max(500).optional().nullable(),
})

function normalizeText(value: string): string {
    return value
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

function normalizeVehicleType(value: string | null | undefined): CatalogCategory | null {
    const normalized = normalizeText(value ?? '')
    if (!normalized) return null
    if (normalized === '2w' || normalized === 'two wheeler' || normalized === 'bike') return '2w'
    if (normalized === '3w' || normalized === 'three wheeler' || normalized === 'auto') return '3w'
    if (normalized === 'cars' || normalized === 'car' || normalized === '4w' || normalized === 'four wheeler') return '4w'
    return null
}

function find4WBrand(brand: string) {
    const normalized = normalizeText(brand)
    return FOUR_W_BRANDS.find((entry) =>
        normalizeText(entry.make) === normalized ||
        normalizeText(entry.brandId) === normalized ||
        normalizeText(entry.cardekhoBrandLabel) === normalized
    )
}

function find2WBrand(brand: string) {
    const normalized = normalizeText(brand)
    return TWO_W_BRANDS.find((entry) =>
        normalizeText(entry.brand) === normalized ||
        normalizeText(entry.brandId) === normalized
    )
}

function find3WBrand(brand: string) {
    const normalized = normalizeText(brand)
    return THREE_W_BRANDS.find((entry) =>
        normalizeText(entry.brand) === normalized ||
        normalizeText(entry.brandId) === normalized
    )
}

function toLogoId(brand: string, brandId: string, category: CatalogCategory): string {
    if (category === '4w') return modelToSlug(brand)
    return brandId
}

function resolveCatalogBrand(brandName: string, vehicleType?: string | null): CatalogBrand | null {
    const explicitCategory = normalizeVehicleType(vehicleType)

    if (explicitCategory === '4w') {
        const meta = find4WBrand(brandName)
        const brand = meta?.make ?? brandName
        const brandId = meta?.brandId ?? modelToSlug(brandName)
        return { brand, brandId, logoId: toLogoId(brand, brandId, '4w'), category: '4w', modelCount: 0 }
    }

    if (explicitCategory === '2w') {
        const meta = find2WBrand(brandName)
        const brand = meta?.brand ?? brandName
        const brandId = meta?.brandId ?? modelToSlug(brandName)
        return { brand, brandId, logoId: brandId, category: '2w', modelCount: 0 }
    }

    if (explicitCategory === '3w') {
        const meta = find3WBrand(brandName)
        const brand = meta?.brand ?? brandName
        const brandId = meta?.brandId ?? modelToSlug(brandName)
        return { brand, brandId, logoId: brandId, category: '3w', modelCount: 0 }
    }

    const carMeta = find4WBrand(brandName)
    if (carMeta) {
        return {
            brand: carMeta.make,
            brandId: carMeta.brandId,
            logoId: toLogoId(carMeta.make, carMeta.brandId, '4w'),
            category: '4w',
            modelCount: 0,
        }
    }

    const twoWMeta = find2WBrand(brandName)
    if (twoWMeta) {
        return { brand: twoWMeta.brand, brandId: twoWMeta.brandId, logoId: twoWMeta.brandId, category: '2w', modelCount: 0 }
    }

    const threeWMeta = find3WBrand(brandName)
    if (threeWMeta) {
        return { brand: threeWMeta.brand, brandId: threeWMeta.brandId, logoId: threeWMeta.brandId, category: '3w', modelCount: 0 }
    }

    const fallbackBrandId = modelToSlug(brandName)
    return { brand: brandName, brandId: fallbackBrandId, logoId: fallbackBrandId, category: '4w', modelCount: 0 }
}

function dedupeBrands(brands: CatalogBrand[]): CatalogBrand[] {
    const seen = new Set<string>()
    const result: CatalogBrand[] = []

    for (const brand of brands) {
        const key = `${brand.category}:${normalizeText(brand.brand)}`
        if (seen.has(key)) continue
        seen.add(key)
        result.push(brand)
    }

    return result
}

async function loadSelectedBrands(supabase: RouteSupabaseClient, dealer: DealerProfileRow): Promise<CatalogBrand[]> {
    const { data: rows } = await supabase
        .from('dealer_brands')
        .select('brand_name, is_primary, vehicle_type')
        .eq('dealer_id', dealer.id)
        .order('is_primary', { ascending: false })
        .order('brand_name', { ascending: true })

    const explicitRows = (rows ?? []) as DealerBrandRow[]
    const selected = explicitRows
        .map((row) => resolveCatalogBrand(row.brand_name, row.vehicle_type))
        .filter((brand): brand is CatalogBrand => Boolean(brand))

    if (selected.length > 0) return dedupeBrands(selected)

    const fallback = (dealer.brands ?? [])
        .map((brand) => resolveCatalogBrand(brand))
        .filter((brand): brand is CatalogBrand => Boolean(brand))

    return dedupeBrands(fallback)
}

async function readPublicJson<T>(pathname: string): Promise<T | null> {
    const publicDir = path.join(process.cwd(), 'public')
    const relative = pathname.replace(/^\/+/, '')
    const filePath = path.resolve(publicDir, relative)
    if (!filePath.startsWith(publicDir)) return null

    try {
        const text = await readFile(filePath, 'utf8')
        return JSON.parse(text) as T
    } catch {
        return null
    }
}

function cleanPriceString(value: unknown): string | null {
    if (value === null || value === undefined) return null
    const text = String(value).trim()
    if (!text) return null
    return text.replace(/â‚¹/g, 'Rs.').replace(/\s+/g, ' ')
}

function formatPaiseValue(paise: number | null | undefined): string | null {
    if (!paise || paise <= 0) return null
    const rupees = paise / 100
    if (rupees >= 10000000) {
        return `Rs. ${(rupees / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`
    }
    if (rupees >= 100000) {
        return `Rs. ${(rupees / 100000).toFixed(2).replace(/\.00$/, '')} L`
    }
    return `Rs. ${Math.round(rupees).toLocaleString('en-IN')}`
}

function formatPriceRange(minPaise: number | null | undefined, maxPaise: number | null | undefined): string | null {
    const min = formatPaiseValue(minPaise)
    const max = formatPaiseValue(maxPaise)
    if (!min && !max) return null
    if (!max || min === max) return min ?? max
    if (!min) return max
    return `${min} - ${max}`
}

function parsePriceToPaise(value: string | null | undefined): number | null {
    const cleaned = String(value ?? '').replace(/[^0-9.]/g, '')
    if (!cleaned) return null
    const rupees = Number(cleaned)
    return Number.isFinite(rupees) && rupees > 0 ? Math.round(rupees * 100) : null
}

function modelKey(model: CatalogModel): string {
    return normalize4WModelKey(model.model)
}

function mergeModels(models: CatalogModel[]): CatalogModel[] {
    const byModel = new Map<string, CatalogModel>()

    for (const model of models) {
        const key = modelKey(model)
        const existing = byModel.get(key)
        if (!existing) {
            byModel.set(key, model)
            continue
        }

        byModel.set(key, {
            ...existing,
            ...model,
            imageUrl: model.imageUrl ?? existing.imageUrl,
            price: model.price ?? existing.price,
            fuelType: model.fuelType ?? existing.fuelType,
            logoId: model.logoId ?? existing.logoId,
        })
    }

    return Array.from(byModel.values()).sort((a, b) => a.model.localeCompare(b.model))
}

function dbRowToCatalogModel(row: CatalogDbRow, brand: CatalogBrand): CatalogModel {
    return {
        id: `${brand.category}-db-${row.id}`,
        brand: brand.brand,
        brandId: brand.brandId,
        logoId: brand.logoId,
        model: row.model,
        imageUrl: row.image_url ?? null,
        price: formatPriceRange(row.price_min_paise, row.price_max_paise),
        fuelType: row.fuel_type ?? null,
        category: brand.category,
    }
}

function load4WModelsFromJson(raw: unknown, brand: CatalogBrand): CatalogModel[] {
    const brandMeta = get4WCardekhoBrandMeta(brand.brand)
    const localModels = extract4WModelsFromJson(raw)
    const models: CatalogModel[] = []
    const seen = new Set<string>()

    const pushModel = (modelName: string, imageUrl: string | null, price: string | number | null, fuelType: string | null) => {
        const key = normalize4WModelKey(modelName)
        if (seen.has(key)) return
        seen.add(key)
        models.push({
            id: `4w-${brand.brandId}-${modelToSlug(modelName)}`,
            brand: brand.brand,
            brandId: brand.brandId,
            logoId: brand.logoId,
            model: modelName,
            imageUrl,
            price: cleanPriceString(price),
            fuelType,
            category: '4w',
        })
    }

    for (const localModel of localModels) {
        const meta = get4WCardekhoModelMeta(brand.brand, localModel.model)
        pushModel(
            localModel.model,
            localModel.imageUrl ?? meta?.imageUrl ?? null,
            localModel.priceMinInr ? localModel.priceMinInr.toLocaleString('en-IN') : meta?.priceMinInr ?? null,
            localModel.fuelType ?? meta?.fuelType ?? null,
        )
    }

    for (const meta of Object.values(brandMeta?.models ?? {})) {
        pushModel(meta.model, meta.imageUrl, meta.priceMinInr, meta.fuelType)
    }

    return models
}

async function load4WStaticModels(brand: CatalogBrand): Promise<CatalogModel[]> {
    const config = find4WBrand(brand.brand)
    if (!config) return []
    const raw = await readPublicJson<unknown>(`/data/${config.jsonKey}.json`)
    return raw ? load4WModelsFromJson(raw, brand) : []
}

async function loadStaticPayload(category: Extract<CatalogCategory, '2w' | '3w'>, brand: CatalogBrand): Promise<StaticVehiclePayload | null> {
    const files = category === '2w' ? TWO_W_FILES : THREE_W_FILES

    for (const fileId of files) {
        const payload = await readPublicJson<StaticVehiclePayload>(`/data/${category}/${fileId}.json`)
        if (!payload) continue

        const payloadBrand = payload.brand ?? ''
        const payloadBrandId = payload.brandId ?? fileId
        const matches =
            normalizeText(payloadBrandId) === normalizeText(brand.brandId) ||
            normalizeText(payloadBrand) === normalizeText(brand.brand) ||
            normalizeText(fileId) === normalizeText(brand.brandId)

        if (matches) return payload
    }

    return null
}

async function load2WStaticModels(brand: CatalogBrand): Promise<CatalogModel[]> {
    const raw = await loadStaticPayload('2w', brand)
    const vehicles = raw?.vehicles ?? []
    const models: CatalogModel[] = []

    for (const vehicle of vehicles) {
        const model = String(vehicle.model ?? vehicle.variant_name ?? '').trim()
        if (!model) continue

        models.push({
            id: `2w-${brand.brandId}-${modelToSlug(model)}`,
            brand: brand.brand,
            brandId: brand.brandId,
            logoId: brand.logoId,
            model,
            imageUrl: `https://llsvbyeumrfngjvbedbz.supabase.co/storage/v1/object/public/vehicle-images/2w/${brand.brandId}/${modelToSlug(model)}.jpg`,
            price: cleanPriceString(vehicle.price),
            fuelType: vehicle.fuel_type ? String(vehicle.fuel_type) : null,
            category: '2w',
        })
    }

    return mergeModels(models)
}

async function load3WStaticModels(brand: CatalogBrand): Promise<CatalogModel[]> {
    const raw = await loadStaticPayload('3w', brand)
    const vehicles = raw?.vehicles ?? []
    const models: CatalogModel[] = []

    for (const vehicle of vehicles) {
        const model = String(vehicle.variant_name ?? vehicle.model ?? '').split('/')[0].trim()
        if (!model) continue
        const technical = vehicle.technical_specifications as Record<string, unknown> | undefined

        models.push({
            id: `3w-${brand.brandId}-${modelToSlug(model)}`,
            brand: brand.brand,
            brandId: brand.brandId,
            logoId: brand.logoId,
            model,
            imageUrl: `https://llsvbyeumrfngjvbedbz.supabase.co/storage/v1/object/public/vehicle-images/3w/${brand.brandId}/${modelToSlug(model)}.jpg`,
            price: cleanPriceString(vehicle.ex_showroom_price),
            fuelType: technical?.fuel_type ? String(technical.fuel_type) : null,
            category: '3w',
        })
    }

    return mergeModels(models)
}

async function loadDbModels(supabase: SupabaseTableClient, brand: CatalogBrand): Promise<CatalogModel[]> {
    const client = supabase as unknown as { from: (table: string) => any }
    const table = brand.category === '4w'
        ? 'car_catalog'
        : brand.category === '2w'
            ? 'tw_catalog'
            : 'thw_catalog'
    const make = brand.category === '2w'
        ? resolveTwCatalogMake(brand.brand)
        : brand.category === '3w'
            ? resolveThwCatalogMake(brand.brand)
            : brand.brand

    const { data, error } = await client
        .from(table)
        .select('id, make, model, variant, year, body_type, fuel_type, price_min_paise, price_max_paise, image_url, is_active')
        .ilike('make', make)
        .eq('is_active', true)
        .order('model', { ascending: true })
        .limit(200)

    if (error || !data) return []
    return (data as CatalogDbRow[]).map((row) => dbRowToCatalogModel(row, brand))
}

async function loadModelsForBrand(supabase: SupabaseTableClient, brand: CatalogBrand): Promise<CatalogModel[]> {
    const [dbModels, staticModels] = await Promise.all([
        loadDbModels(supabase, brand),
        brand.category === '4w'
            ? load4WStaticModels(brand)
            : brand.category === '2w'
                ? load2WStaticModels(brand)
                : load3WStaticModels(brand),
    ])

    return mergeModels([...staticModels, ...dbModels])
}

function selectedBrandKey(category: CatalogCategory, brand: string): string {
    return `${category}:${normalizeText(brand)}`
}

async function loadDealerContext() {
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return { errorResponse }

    const dealerRef = await getDealerForUser(supabase, user.id)
    if (!dealerRef) {
        return {
            errorResponse: NextResponse.json({ error: 'Dealer profile not found' }, { status: 404 }),
        }
    }

    const { data: dealer, error } = await supabase
        .from('dealers')
        .select('id, brands')
        .eq('id', dealerRef.id)
        .single()

    if (error || !dealer) {
        return {
            errorResponse: NextResponse.json({ error: 'Dealer profile not found' }, { status: 404 }),
        }
    }

    const selectedBrands = await loadSelectedBrands(supabase, dealer as DealerProfileRow)
    return { user, supabase, dealer: dealer as DealerProfileRow, selectedBrands, errorResponse: null }
}

export async function GET() {
    const context = await loadDealerContext()
    if (context.errorResponse) return context.errorResponse

    const modelsByBrand = await Promise.all(
        context.selectedBrands.map(async (brand) => ({
            brand,
            models: await loadModelsForBrand(context.supabase, brand),
        }))
    )

    const models = modelsByBrand.flatMap((entry) => entry.models)
    const countByBrand = new Map<string, number>()

    for (const entry of modelsByBrand) {
        countByBrand.set(selectedBrandKey(entry.brand.category, entry.brand.brand), entry.models.length)
    }

    const brands = context.selectedBrands.map((brand) => ({
        ...brand,
        modelCount: countByBrand.get(selectedBrandKey(brand.category, brand.brand)) ?? 0,
    }))

    return NextResponse.json({ brands, models })
}

export async function POST(request: Request) {
    const context = await loadDealerContext()
    if (context.errorResponse) return context.errorResponse

    const body = await request.json().catch(() => null)
    const parsed = addModelSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid catalog model payload' }, { status: 400 })
    }

    const input = parsed.data
    const selectedBrand = context.selectedBrands.find((brand) =>
        brand.category === input.category &&
        normalizeText(brand.brand) === normalizeText(input.brand)
    )

    if (!selectedBrand) {
        return NextResponse.json({ error: 'This OEM is not selected for your dealership' }, { status: 403 })
    }

    const admin = createAdminClient() as unknown as { from: (table: string) => any }
    const currentYear = new Date().getFullYear()
    const pricePaise = parsePriceToPaise(input.price)
    const imageUrl = input.imageUrl?.trim() || null
    const fuelType = input.fuelType?.trim() || null
    const bodyType = input.bodyType?.trim() || null
    const variant = input.variant?.trim() || null
    const year = input.year ?? currentYear

    const table = selectedBrand.category === '4w'
        ? 'car_catalog'
        : selectedBrand.category === '2w'
            ? 'tw_catalog'
            : 'thw_catalog'
    const make = selectedBrand.category === '2w'
        ? resolveTwCatalogMake(selectedBrand.brand)
        : selectedBrand.category === '3w'
            ? resolveThwCatalogMake(selectedBrand.brand)
            : selectedBrand.brand

    const basePayload = {
        make,
        model: input.model,
        variant,
        year,
        body_type: bodyType,
        fuel_type: fuelType,
        price_min_paise: pricePaise,
        price_max_paise: pricePaise,
        image_url: imageUrl,
        is_active: true,
    }

    const payload = selectedBrand.category === '4w'
        ? { id: `${modelToSlug(selectedBrand.brand)}-${modelToSlug(input.model)}`, ...basePayload }
        : basePayload

    const { data: existing } = await admin
        .from(table)
        .select('id')
        .ilike('make', make)
        .ilike('model', input.model)
        .maybeSingle()

    const query = existing?.id
        ? admin.from(table).update(payload).eq('id', existing.id).select('*').maybeSingle()
        : admin.from(table).insert(payload).select('*').maybeSingle()

    const { data, error } = await query
    if (error || !data) {
        return NextResponse.json({ error: error?.message ?? 'Failed to save model' }, { status: 500 })
    }

    const model = dbRowToCatalogModel(data as CatalogDbRow, selectedBrand)
    return NextResponse.json({ model }, { status: existing?.id ? 200 : 201 })
}

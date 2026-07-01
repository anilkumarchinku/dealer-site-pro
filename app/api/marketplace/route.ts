/**
 * GET /api/marketplace
 * Cross-dealer inventory search — returns real vehicles for sale across all dealers.
 *
 * Query params:
 *   make         — partial match on make, e.g. "Maruti"
 *   fuel_type    — e.g. "Petrol" | "Electric" | "CNG"
 *   exclude_fuel — comma-separated fuels to exclude, e.g. "Electric,CNG"
 *   condition    — "new" | "used" | "certified_pre_owned" | "all"
 *   category     — "four_wheeler" | "two_three_wheeler" | "fleet" | "bus"
 *   body_type    — e.g. "SUV" | "Hatchback" | "Sedan"
 *   transmission — "Manual" | "Automatic"
 *   year_from    — minimum year, e.g. 2020
 *   year_to      — maximum year, e.g. 2024
 *   city         — partial match on dealer location, e.g. "Mumbai"
 *   minPrice     — INR (not paise), e.g. 300000
 *   maxPrice     — INR (not paise), e.g. 2000000
 *   sortBy       — "newest" | "price_low" | "price_high" (default: newest)
 *   page         — 1-indexed (default: 1)
 *   pageSize     — results per page (default: 12, max: 48)
 */

import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { getOptionalEnv } from '@/lib/env'
import { get4WCardekhoModelMeta } from '@/lib/data/4w-cardekho-meta'
import { extract4WModelsFromJson, FOUR_W_BRANDS, modelToSlug } from '@/lib/data/four-wheelers'
import { loadThreeWheelerCatalogVehicles } from '@/lib/services/three-wheeler-static-catalog'
import { loadTwoWheelerCatalogVehicles } from '@/lib/services/two-wheeler-static-catalog'
import { brandNameToId, getVehicleImageUrls, isUsableVehicleImageUrl } from '@/lib/utils/brand-model-images'
import { get3wVehicleImageUrls } from '@/lib/utils/resolve-3w-images'

// Body type mapping per vehicle category
const CATEGORY_BODY_TYPES: Record<string, string[]> = {
    two_three_wheeler: ['Motorcycle', 'Scooter', 'Moped', 'Two-Wheeler', 'Three-Wheeler', 'Auto', 'E-Rickshaw'],
    fleet:             ['Truck', 'Tempo', 'Commercial', 'Van', 'Pickup', 'Mini Truck'],
    bus:               ['Bus', 'Coach', 'Mini Bus', 'School Bus'],
    four_wheeler:      [], // default — exclude 2/3 wheelers, bus, fleet
}

type MarketplaceVehicleRow = {
    id: string
    make: string
    model: string
    variant: string | null
    year: number | string | null
    price_paise: number | null
    on_road_price_paise: number | null
    mileage_km: number | null
    mileage_kmpl: number | null
    range_km: number | null
    color: string | null
    transmission: string | null
    fuel_type: string | null
    body_type: string | null
    seating_capacity: number | null
    condition: 'new' | 'used' | 'certified_pre_owned'
    features: string[] | null
    description: string | null
    views: number
    leads_count: number
    image_url: string | null
    image_urls: string[]
    created_at: string
    vehicle_category: '4w' | '2w' | '3w'
    detail_href: string
    brand_href: string
    dealers: {
        id: string
        dealership_name: string
        slug: string
        location: string
        logo_url: string | null
        phone: string | null
        whatsapp: string | null
    }
}

type CatalogDbRow = {
    id: string
    make: string | null
    model: string | null
    variant?: string | null
    year?: number | null
    price_min_paise?: number | null
    price_max_paise?: number | null
    image_url?: string | null
    fuel_type?: string | null
    body_type?: string | null
    transmission?: string | null
    seating_capacity?: number | null
    fuel_efficiency?: number | null
    range_km?: number | null
    is_active?: boolean | null
    created_at?: string | null
}

type DealerLookupRow = MarketplaceVehicleRow['dealers']

type MarketplaceDbVehicleRow = Omit<
    MarketplaceVehicleRow,
    'mileage_kmpl' | 'range_km' | 'vehicle_category' | 'detail_href' | 'brand_href' | 'dealers'
> & {
    dealer_id: string
    dealers: DealerLookupRow | DealerLookupRow[] | null
}

type UsedTwoWheelerDbRow = {
    id: string
    dealer_id: string
    type: string | null
    brand: string | null
    model: string | null
    variant: string | null
    year: number | null
    fuel_type: string | null
    km_driven: number | null
    certified_pre_owned: boolean | null
    price_paise: number | null
    images: string[] | null
    description: string | null
    status: string | null
    created_at: string | null
}

type UsedThreeWheelerDbRow = UsedTwoWheelerDbRow & {
    body_type: string | null
    passenger_capacity: number | null
    payload_kg: number | null
}

function getSupabase() {
    const supabaseUrl = getOptionalEnv('NEXT_PUBLIC_SUPABASE_URL') ?? ''
    const supabaseAnon = getOptionalEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ?? ''
    if (!supabaseUrl || !supabaseAnon) return null
    return createClient(supabaseUrl, supabaseAnon)
}

function normalizeText(value: unknown): string {
    return String(value ?? '')
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

function detailHref(category: MarketplaceVehicleRow['vehicle_category'], id: string): string {
    if (category === '2w') return `/bikes/${encodeURIComponent(id)}`
    if (category === '3w') return `/autos/${encodeURIComponent(id)}`
    return `/cars/${encodeURIComponent(id)}`
}

function brandHref(category: MarketplaceVehicleRow['vehicle_category'], brand: string): string {
    return `/brands/${encodeURIComponent(brand)}?type=${category}`
}

function onRoadEstimate(pricePaise: number | null): number | null {
    return pricePaise && pricePaise > 0 ? Math.round(pricePaise * 1.12) : null
}

function normalize4wCatalogPricePaise(pricePaise: number | null | undefined): number | null {
    if (!pricePaise || pricePaise <= 0) return null

    // Some imported 4W luxury catalog rows are stored 100x above paise scale.
    // Keep normal rows untouched, but prevent impossible crore-level UI prices.
    return pricePaise > 50_000_000_000 ? Math.round(pricePaise / 100) : pricePaise
}

function normalizeMarketplaceCategory(value: string | null): string {
    const category = normalizeText(value)
    if (!category || category === 'all') return 'all'
    if (category === '2w' || category === 'bike' || category === 'bikes') return '2w'
    if (category === '3w' || category === 'auto' || category === 'autos') return '3w'
    if (category === '4w' || category === 'car' || category === 'cars') return '4w'
    return category
}

function categoryIncludes4w(category: string): boolean {
    return category === 'all' || category === 'four_wheeler' || category === '4w'
}

function categoryIncludes2w(category: string): boolean {
    return category === 'all' || category === 'two_three_wheeler' || category === '2w'
}

function categoryIncludes3w(category: string): boolean {
    return category === 'all' || category === 'two_three_wheeler' || category === '3w'
}

function categoryIncludes2w3w(category: string): boolean {
    return categoryIncludes2w(category) || categoryIncludes3w(category)
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

function catalogDealer(category: MarketplaceVehicleRow['vehicle_category']) {
    return {
        id: `catalog-${category}`,
        dealership_name: '',
        slug: `catalog-${category}`,
        location: 'India',
        logo_url: null,
        phone: null,
        whatsapp: null,
    }
}

function makeMarketplaceRow(input: {
    id: string
    make: string
    model: string
    variant?: string | null
    year?: number | string | null
    pricePaise?: number | null
    imageUrls?: string[]
    fuelType?: string | null
    bodyType?: string | null
    transmission?: string | null
    seatingCapacity?: number | null
    mileageKm?: number | null
    mileageKmpl?: number | null
    rangeKm?: number | null
    category: MarketplaceVehicleRow['vehicle_category']
    createdAt?: string | null
    condition?: MarketplaceVehicleRow['condition']
    dealer?: MarketplaceVehicleRow['dealers']
    detailHref?: string
}): MarketplaceVehicleRow {
    const imageUrls = Array.from(new Set((input.imageUrls ?? []).filter(Boolean)))
    return {
        id: input.id,
        make: input.make,
        model: input.model,
        variant: input.variant ?? null,
        year: input.year ?? new Date().getFullYear(),
        price_paise: input.pricePaise ?? null,
        on_road_price_paise: onRoadEstimate(input.pricePaise ?? null),
        mileage_km: input.mileageKm ?? null,
        mileage_kmpl: input.mileageKmpl ?? null,
        range_km: input.rangeKm ?? null,
        color: null,
        transmission: input.transmission ?? null,
        fuel_type: input.fuelType ?? null,
        body_type: input.bodyType ?? null,
        seating_capacity: input.seatingCapacity ?? null,
        condition: input.condition ?? 'new',
        features: null,
        description: null,
        views: 0,
        leads_count: 0,
        image_url: imageUrls[0] ?? null,
        image_urls: imageUrls,
        created_at: input.createdAt ?? new Date().toISOString(),
        vehicle_category: input.category,
        detail_href: input.detailHref ?? detailHref(input.category, input.id),
        brand_href: brandHref(input.category, input.make),
        dealers: input.dealer ?? catalogDealer(input.category),
    }
}

function groupCatalogRows(rows: CatalogDbRow[]): CatalogDbRow[] {
    const byModel = new Map<string, CatalogDbRow>()

    for (const row of rows) {
        const make = String(row.make ?? '').trim()
        const model = String(row.model ?? '').trim()
        if (!make || !model) continue

        const key = `${normalizeText(make)}__${normalizeText(model)}`
        const existing = byModel.get(key)
        if (!existing) {
            byModel.set(key, row)
            continue
        }

        const rowPrice = row.price_min_paise ?? 0
        const existingPrice = existing.price_min_paise ?? 0
        const preferred = rowPrice > 0 && (existingPrice === 0 || rowPrice < existingPrice) ? row : existing
        const fallback = preferred === row ? existing : row

        byModel.set(key, {
            ...preferred,
            variant: preferred.variant ?? fallback.variant,
            year: preferred.year ?? fallback.year,
            price_max_paise: preferred.price_max_paise ?? fallback.price_max_paise,
            image_url: preferred.image_url ?? fallback.image_url,
            fuel_type: preferred.fuel_type ?? fallback.fuel_type,
            body_type: preferred.body_type ?? fallback.body_type,
            transmission: preferred.transmission ?? fallback.transmission,
            seating_capacity: preferred.seating_capacity ?? fallback.seating_capacity,
            fuel_efficiency: preferred.fuel_efficiency ?? fallback.fuel_efficiency,
            range_km: preferred.range_km ?? fallback.range_km,
            created_at: preferred.created_at ?? fallback.created_at,
        })
    }

    return Array.from(byModel.values())
}

let static4wCatalogRowsPromise: Promise<CatalogDbRow[]> | null = null

function loadStatic4wCatalogRows(): Promise<CatalogDbRow[]> {
    if (!static4wCatalogRowsPromise) {
        static4wCatalogRowsPromise = Promise.all(
            FOUR_W_BRANDS.map(async (brand) => {
                const raw = await readPublicJson<unknown>(`/data/${brand.jsonKey}.json`)
                if (!raw) return []

                return extract4WModelsFromJson(raw).map((model): CatalogDbRow => ({
                    id: `static-4w-${brand.brandId}-${modelToSlug(model.model)}`,
                    make: brand.make,
                    model: model.model,
                    variant: null,
                    year: new Date().getFullYear(),
                    price_min_paise: model.priceMinInr ? Math.round(model.priceMinInr * 100) : null,
                    price_max_paise: null,
                    image_url: model.imageUrl,
                    fuel_type: model.fuelType,
                    body_type: null,
                    transmission: model.transmission,
                    seating_capacity: model.seating,
                    fuel_efficiency: null,
                    range_km: null,
                    is_active: true,
                    created_at: new Date().toISOString(),
                }))
            })
        ).then((groups) => groups.flat())
    }

    return static4wCatalogRowsPromise
}

async function load4wCatalogRows(supabase: ReturnType<typeof getSupabase>): Promise<MarketplaceVehicleRow[]> {
    const staticRows = await loadStatic4wCatalogRows()
    let dbRows: CatalogDbRow[] = []

    if (supabase) {
        const { data, error } = await supabase
            .from('car_catalog')
            .select('id, make, model, variant, year, price_min_paise, price_max_paise, image_url, fuel_type, body_type, transmission, seating_capacity, fuel_efficiency, range_km, is_active, created_at')
            .eq('is_active', true)
            .order('make', { ascending: true })
            .order('model', { ascending: true })
            .range(0, 1200)

        if (!error && data) {
            dbRows = data as CatalogDbRow[]
        }
    }

    return groupCatalogRows([...staticRows, ...dbRows]).map((row) => {
        const make = String(row.make ?? '').trim()
        const model = String(row.model ?? '').trim()
        const brandId = brandNameToId(make, '4w')
        const imageUrls = getVehicleImageUrls('4w', brandId, model, row.image_url ?? undefined)
        const meta = get4WCardekhoModelMeta(make, model)

        return makeMarketplaceRow({
            id: row.id,
            make,
            model,
            variant: row.variant,
            year: row.year,
            pricePaise: normalize4wCatalogPricePaise(row.price_min_paise),
            imageUrls,
            fuelType: row.fuel_type,
            bodyType: meta?.bodyType ?? row.body_type ?? 'Car',
            transmission: row.transmission,
            seatingCapacity: row.seating_capacity ?? null,
            mileageKmpl: row.fuel_efficiency ?? null,
            rangeKm: row.range_km ?? null,
            category: '4w',
            createdAt: row.created_at,
        })
    })
}

function load2wCatalogRows(): MarketplaceVehicleRow[] {
    return loadTwoWheelerCatalogVehicles().map((vehicle) => {
        const brandId = brandNameToId(vehicle.make, '2w')
        const imageUrls = getVehicleImageUrls('2w', brandId, vehicle.model, vehicle.image_url ?? undefined)
        const bodyType = vehicle.type === 'electric'
            ? 'Electric Two-Wheeler'
            : vehicle.type === 'scooter'
                ? 'Scooter'
                : 'Motorcycle'

        return makeMarketplaceRow({
            id: vehicle.id,
            make: vehicle.make,
            model: vehicle.model,
            variant: vehicle.variant,
            year: vehicle.year,
            pricePaise: vehicle.price_min_paise,
            imageUrls,
            fuelType: vehicle.fuel_type === 'electric' ? 'Electric' : 'Petrol',
            bodyType,
            transmission: vehicle.type === 'bike' ? 'Manual' : 'Automatic',
            seatingCapacity: 2,
            mileageKmpl: vehicle.mileage_kmpl ?? null,
            rangeKm: vehicle.range_km ?? null,
            category: '2w',
        })
    })
}

function load3wCatalogRows(): MarketplaceVehicleRow[] {
    return loadThreeWheelerCatalogVehicles().map((vehicle) => {
        const brandId = brandNameToId(vehicle.make, '3w')
        const imageUrls = get3wVehicleImageUrls(brandId, vehicle.model, vehicle.image_url ?? undefined)
        const bodyType = vehicle.type === 'electric'
            ? 'Electric Three-Wheeler'
            : vehicle.type === 'cargo'
                ? 'Cargo Auto'
                : 'Passenger Auto'

        return makeMarketplaceRow({
            id: vehicle.id,
            make: vehicle.make,
            model: vehicle.model,
            variant: vehicle.variant,
            year: vehicle.year,
            pricePaise: vehicle.price_min_paise,
            imageUrls,
            fuelType: vehicle.fuel_type === 'electric' ? 'Electric' : vehicle.fuel_type?.toUpperCase() ?? null,
            bodyType,
            transmission: 'Manual',
            seatingCapacity: vehicle.passenger_capacity ?? null,
            mileageKmpl: vehicle.mileage_kmpl ?? null,
            rangeKm: vehicle.range_km ?? null,
            category: '3w',
        })
    })
}

function dealerFromJoined(value: MarketplaceDbVehicleRow['dealers'], fallbackDealerId: string): MarketplaceVehicleRow['dealers'] {
    const dealer = Array.isArray(value) ? value[0] : value
    return dealer ?? {
        id: fallbackDealerId,
        dealership_name: 'Marketplace dealer',
        slug: fallbackDealerId,
        location: 'India',
        logo_url: null,
        phone: null,
        whatsapp: null,
    }
}

function inferMarketplaceCategory(row: Pick<MarketplaceDbVehicleRow, 'make' | 'model' | 'body_type'>): MarketplaceVehicleRow['vehicle_category'] {
    const body = normalizeText(row.body_type)
    const text = normalizeText(`${row.make} ${row.model} ${row.body_type ?? ''}`)
    if (
        body.includes('motorcycle') ||
        body.includes('scooter') ||
        body.includes('moped') ||
        body.includes('two wheeler') ||
        /\b(hero|motocorp|tvs|bajaj|yamaha|royal enfield|ather|ola electric|okinawa|revolt|jawa|yezdi)\b/.test(text)
    ) return '2w'
    if (
        body.includes('auto') ||
        body.includes('rickshaw') ||
        body.includes('three wheeler') ||
        /\b(piaggio|ape|atul|altigreen|e alfa|treo|e rickshaw)\b/.test(text)
    ) return '3w'
    return '4w'
}

function normalizeDbVehicleRow(row: MarketplaceDbVehicleRow): MarketplaceVehicleRow {
    const category = inferMarketplaceCategory(row)
    const dealer = dealerFromJoined(row.dealers, row.dealer_id)
    const uploadedImages = [
        row.image_url,
        ...(Array.isArray(row.image_urls) ? row.image_urls : []),
    ].filter(isUsableVehicleImageUrl)
    const brandId = brandNameToId(row.make, category)
    const resolvedImages = category === '3w'
        ? get3wVehicleImageUrls(brandId, row.model)
        : getVehicleImageUrls(category, brandId, row.model)
    const imageUrls = Array.from(new Set([...resolvedImages, ...uploadedImages].filter(isUsableVehicleImageUrl)))

    return {
        ...row,
        image_url: imageUrls[0] ?? null,
        image_urls: imageUrls,
        mileage_kmpl: null,
        range_km: null,
        vehicle_category: category,
        detail_href: row.condition === 'new'
            ? detailHref(category, row.id)
            : usedDealerDetailHref(dealer, category, row.id),
        brand_href: brandHref(category, row.make),
        dealers: dealer,
    }
}

function usedTwoWheelerBodyType(type: string | null): string {
    const value = normalizeText(type)
    if (value.includes('scooter')) return 'Scooter'
    if (value.includes('moped')) return 'Moped'
    return 'Motorcycle'
}

function usedThreeWheelerBodyType(row: UsedThreeWheelerDbRow): string {
    const body = String(row.body_type ?? '').trim()
    if (body) return body
    const type = normalizeText(row.type)
    if (type.includes('cargo')) return 'Cargo Auto'
    if (type.includes('electric')) return 'Electric Three-Wheeler'
    return 'Passenger Auto'
}

function usedCondition(certified: boolean | null): MarketplaceVehicleRow['condition'] {
    return certified ? 'certified_pre_owned' : 'used'
}

function marketplaceConditionRank(condition: MarketplaceVehicleRow['condition'] | string | null | undefined): number {
    if (condition === 'used') return 0
    if (condition === 'certified_pre_owned') return 1
    if (condition === 'new') return 2
    return 3
}

function usedDealerDetailHref(
    dealer: MarketplaceVehicleRow['dealers'],
    category: MarketplaceVehicleRow['vehicle_category'],
    vehicleId: string
): string {
    const slug = dealer.slug || dealer.id || 'dealer'
    if (category === '2w') return `/sites/${encodeURIComponent(slug)}/two-wheelers/used/${encodeURIComponent(vehicleId)}`
    if (category === '3w') return `/sites/${encodeURIComponent(slug)}/three-wheelers/used/${encodeURIComponent(vehicleId)}`
    return `/sites/${encodeURIComponent(slug)}/${encodeURIComponent(vehicleId)}`
}

function used2wToMarketplaceRow(row: UsedTwoWheelerDbRow, dealer: MarketplaceVehicleRow['dealers']): MarketplaceVehicleRow {
    const make = String(row.brand ?? '').trim()
    const model = String(row.model ?? '').trim()
    const uploadedImages = Array.isArray(row.images) ? row.images : []
    const imageUrls = getVehicleImageUrls('2w', brandNameToId(make, '2w'), model)
    return makeMarketplaceRow({
        id: row.id,
        make,
        model,
        variant: row.variant,
        year: row.year,
        pricePaise: row.price_paise,
        imageUrls: [...imageUrls, ...uploadedImages],
        fuelType: row.fuel_type,
        bodyType: usedTwoWheelerBodyType(row.type),
        transmission: 'Automatic',
        seatingCapacity: 2,
        mileageKm: row.km_driven,
        category: '2w',
        condition: usedCondition(row.certified_pre_owned),
        createdAt: row.created_at,
        dealer,
        detailHref: usedDealerDetailHref(dealer, '2w', row.id),
    })
}

function used3wToMarketplaceRow(row: UsedThreeWheelerDbRow, dealer: MarketplaceVehicleRow['dealers']): MarketplaceVehicleRow {
    const make = String(row.brand ?? '').trim()
    const model = String(row.model ?? '').trim()
    const uploadedImages = Array.isArray(row.images) ? row.images : []
    const imageUrls = get3wVehicleImageUrls(brandNameToId(make, '3w'), model)
    return makeMarketplaceRow({
        id: row.id,
        make,
        model,
        variant: row.variant,
        year: row.year,
        pricePaise: row.price_paise,
        imageUrls: [...imageUrls, ...uploadedImages],
        fuelType: row.fuel_type,
        bodyType: usedThreeWheelerBodyType(row),
        transmission: 'Manual',
        seatingCapacity: row.passenger_capacity ?? null,
        mileageKm: row.km_driven,
        category: '3w',
        condition: usedCondition(row.certified_pre_owned),
        createdAt: row.created_at,
        dealer,
        detailHref: usedDealerDetailHref(dealer, '3w', row.id),
    })
}

async function loadDealerLookup(
    supabase: NonNullable<ReturnType<typeof getSupabase>>,
    dealerIds: string[]
): Promise<Map<string, MarketplaceVehicleRow['dealers']>> {
    const ids = Array.from(new Set(dealerIds.filter(Boolean)))
    if (ids.length === 0) return new Map()

    const { data } = await supabase
        .from('dealers')
        .select('id, dealership_name, slug, location, logo_url, phone, whatsapp')
        .in('id', ids)

    return new Map((data ?? []).map((dealer) => [dealer.id, dealer as MarketplaceVehicleRow['dealers']]))
}

function usedConditionMatches(row: { certified_pre_owned: boolean | null }, condition: string | null): boolean {
    if (!condition || condition === 'all') return true
    return usedCondition(row.certified_pre_owned) === condition
}

async function loadUsedTwoThreeWheelerDealerRows(
    supabase: NonNullable<ReturnType<typeof getSupabase>>,
    condition: string | null,
    category: string
): Promise<MarketplaceVehicleRow[]> {
    const include2w = categoryIncludes2w(category)
    const include3w = categoryIncludes3w(category)
    if (!include2w && !include3w) return []

    const [twRes, thwRes] = await Promise.all([
        include2w ? supabase
            .from('tw_used_vehicles')
            .select('id, dealer_id, type, brand, model, variant, year, fuel_type, km_driven, certified_pre_owned, price_paise, images, description, status, created_at')
            .neq('status', 'sold')
            .order('created_at', { ascending: false })
            .range(0, 999) : Promise.resolve({ data: [] }),
        include3w ? supabase
            .from('thw_used_vehicles')
            .select('id, dealer_id, type, brand, model, variant, year, fuel_type, km_driven, certified_pre_owned, price_paise, images, description, status, created_at, body_type, passenger_capacity, payload_kg')
            .eq('status', 'available')
            .order('created_at', { ascending: false })
            .range(0, 999) : Promise.resolve({ data: [] }),
    ])

    const twRows = ((twRes.data ?? []) as UsedTwoWheelerDbRow[]).filter((row) => usedConditionMatches(row, condition))
    const thwRows = ((thwRes.data ?? []) as UsedThreeWheelerDbRow[]).filter((row) => usedConditionMatches(row, condition))
    const dealerMap = await loadDealerLookup(supabase, [
        ...twRows.map((row) => row.dealer_id),
        ...thwRows.map((row) => row.dealer_id),
    ])

    return [
        ...twRows.map((row) => used2wToMarketplaceRow(row, dealerMap.get(row.dealer_id) ?? catalogDealer('2w'))),
        ...thwRows.map((row) => used3wToMarketplaceRow(row, dealerMap.get(row.dealer_id) ?? catalogDealer('3w'))),
    ].filter((row) => row.make && row.model)
}

async function loadDatabaseMarketplaceRows(
    supabase: NonNullable<ReturnType<typeof getSupabase>>,
    condition: string | null,
    category: string
): Promise<MarketplaceVehicleRow[]> {
    let query = supabase
        .from('vehicles')
        .select(`
            id, dealer_id, make, model, variant, year, price_paise, on_road_price_paise, mileage_km,
            color, transmission, fuel_type, body_type, seating_capacity, condition, features,
            description, views, leads_count, image_url, image_urls, created_at,
            dealers (
                id, dealership_name, slug, location, logo_url, phone, whatsapp
            )
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .range(0, 1199)

    const bodyTypes = CATEGORY_BODY_TYPES[category] ?? []
    if (bodyTypes.length > 0 && category !== 'two_three_wheeler') {
        query = query.in('body_type', bodyTypes)
    } else if (category === 'four_wheeler' || category === '4w') {
        const exclude4w = [
            ...CATEGORY_BODY_TYPES.two_three_wheeler,
            ...CATEGORY_BODY_TYPES.fleet,
            ...CATEGORY_BODY_TYPES.bus,
        ]
        query = query.or(`body_type.is.null,body_type.not.in.(${exclude4w.map(b => `"${b}"`).join(',')})`)
    }

    if (condition && condition !== 'all') query = query.eq('condition', condition)

    const { data, error } = await query
    if (error) throw error
    const rows = ((data ?? []) as MarketplaceDbVehicleRow[]).map(normalizeDbVehicleRow)
    if (category === 'two_three_wheeler') {
        return rows.filter((row) => row.vehicle_category === '2w' || row.vehicle_category === '3w')
    }
    if (category === '2w' || category === '3w' || category === '4w') {
        return rows.filter((row) => row.vehicle_category === category)
    }
    return rows
}

async function loadFirstHandCatalogVehicles(
    supabase: ReturnType<typeof getSupabase>,
    category: string
): Promise<MarketplaceVehicleRow[]> {
    const include4w = categoryIncludes4w(category)
    const include2w = categoryIncludes2w(category)
    const include3w = categoryIncludes3w(category)

    const [fourWheelers] = await Promise.all([
        include4w ? load4wCatalogRows(supabase) : Promise.resolve([]),
    ])

    return [
        ...fourWheelers,
        ...(include2w ? load2wCatalogRows() : []),
        ...(include3w ? load3wCatalogRows() : []),
    ]
}

function applyCatalogFilters(
    rows: MarketplaceVehicleRow[],
    sp: URLSearchParams
): MarketplaceVehicleRow[] {
    let filtered = rows

    const makes = sp.get('make')?.split(',').map((m) => normalizeText(m)).filter(Boolean) ?? []
    if (makes.length > 0) {
        filtered = filtered.filter((row) => {
            const make = normalizeText(row.make)
            return makes.some((item) => make.includes(item) || item.includes(make))
        })
    }

    const fuels = sp.get('fuel_type')?.split(',').map((f) => normalizeText(f)).filter(Boolean) ?? []
    if (fuels.length > 0) {
        filtered = filtered.filter((row) => fuels.includes(normalizeText(row.fuel_type)))
    }

    const excludeFuels = sp.get('exclude_fuel')?.split(',').map((f) => normalizeText(f)).filter(Boolean) ?? []
    if (excludeFuels.length > 0) {
        filtered = filtered.filter((row) => !excludeFuels.includes(normalizeText(row.fuel_type)))
    }

    const bodyType = normalizeText(sp.get('body_type'))
    if (bodyType) {
        filtered = filtered.filter((row) => normalizeText(row.body_type).includes(bodyType))
    }

    const condition = normalizeText(sp.get('condition'))
    if (condition && condition !== 'all') {
        filtered = filtered.filter((row) => normalizeText(row.condition) === condition)
    }

    const transmission = normalizeText(sp.get('transmission'))
    if (transmission) {
        filtered = filtered.filter((row) => normalizeText(row.transmission) === transmission)
    }

    const yearFrom = parseInt(sp.get('year_from') ?? '0')
    const yearTo = parseInt(sp.get('year_to') ?? '0')
    if (yearFrom > 0) filtered = filtered.filter((row) => Number(row.year) >= yearFrom)
    if (yearTo > 0) filtered = filtered.filter((row) => Number(row.year) <= yearTo)

    const city = normalizeText(sp.get('city'))
    const state = normalizeText(sp.get('state'))
    if (city) filtered = filtered.filter((row) => normalizeText(row.dealers.location).includes(city))
    if (state) filtered = filtered.filter((row) => normalizeText(row.dealers.location).includes(state))

    const minPrice = parseFloat(sp.get('minPrice') ?? '0')
    const maxPrice = parseFloat(sp.get('maxPrice') ?? '0')
    if (minPrice > 0) filtered = filtered.filter((row) => (row.price_paise ?? 0) >= Math.round(minPrice * 100))
    if (maxPrice > 0) filtered = filtered.filter((row) => (row.price_paise ?? 0) <= Math.round(maxPrice * 100))

    const search = normalizeText(sp.get('q') ?? sp.get('searchQuery'))
    if (search) {
        filtered = filtered.filter((row) =>
            normalizeText(`${row.make} ${row.model} ${row.variant ?? ''} ${row.body_type ?? ''} ${row.fuel_type ?? ''}`).includes(search)
        )
    }

    const sortBy = sp.get('sortBy') ?? 'newest'
    filtered = [...filtered].sort((a, b) => {
        if (sortBy === 'price_low') return (a.price_paise ?? Number.MAX_SAFE_INTEGER) - (b.price_paise ?? Number.MAX_SAFE_INTEGER)
        if (sortBy === 'price_high') return (b.price_paise ?? 0) - (a.price_paise ?? 0)
        const conditionRank = marketplaceConditionRank(a.condition) - marketplaceConditionRank(b.condition)
        if (conditionRank !== 0) return conditionRank
        return `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`)
    })

    return filtered
}

export async function GET(req: NextRequest) {
    const supabase = getSupabase()
    const sp       = req.nextUrl.searchParams
    const page     = Math.max(1, parseInt(sp.get('page') ?? '1'))
    const pageSize = Math.min(48, Math.max(1, parseInt(sp.get('pageSize') ?? '12')))
    const from     = (page - 1) * pageSize
    const to       = from + pageSize - 1
    const condition = sp.get('condition')
    const category = normalizeMarketplaceCategory(sp.get('category') ?? sp.get('type') ?? 'four_wheeler')

    if (condition === 'new') {
        const catalogVehicles = applyCatalogFilters(
            await loadFirstHandCatalogVehicles(supabase, category),
            sp
        )
        const paged = catalogVehicles.slice(from, to + 1)
        const totalPages = Math.ceil(catalogVehicles.length / pageSize)

        return NextResponse.json({
            success: true,
            data: {
                vehicles: paged,
                total: catalogVehicles.length,
                page,
                pageSize,
                totalPages,
            },
        })
    }

    if (!supabase) {
        return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 503 })
    }

    const shouldUseMergedMarketplace =
        condition === 'all' ||
        category === 'all' ||
        category === 'two_three_wheeler' ||
        category === '2w' ||
        category === '3w' ||
        category === '4w'

    if (shouldUseMergedMarketplace) {
        try {
            const [catalogVehicles, dbVehicles, usedTwoThreeWheelers] = await Promise.all([
                condition === 'all' ? loadFirstHandCatalogVehicles(supabase, category) : Promise.resolve([]),
                loadDatabaseMarketplaceRows(supabase, condition, category),
                loadUsedTwoThreeWheelerDealerRows(supabase, condition, category),
            ])
            const seen = new Set<string>()
            const merged = [...catalogVehicles, ...dbVehicles, ...usedTwoThreeWheelers].filter((row) => {
                const key = `${row.vehicle_category}:${row.condition}:${row.id}`
                if (seen.has(key)) return false
                seen.add(key)
                return true
            })
            const filtered = applyCatalogFilters(merged, sp)
            const paged = filtered.slice(from, to + 1)
            const totalPages = Math.ceil(filtered.length / pageSize)

            return NextResponse.json({
                success: true,
                data: {
                    vehicles: paged,
                    total: filtered.length,
                    page,
                    pageSize,
                    totalPages,
                },
            })
        } catch (error) {
            console.error('[Marketplace API merged]', error)
            return NextResponse.json({ success: false, error: 'Failed to fetch listings' }, { status: 500 })
        }
    }

    // Build query — vehicles joined with dealers via dealer_id
    let query = supabase
        .from('vehicles')
        .select(`
            id, make, model, variant, year, price_paise, on_road_price_paise, mileage_km,
            color, transmission, fuel_type, body_type, seating_capacity, condition, features,
            description, views, leads_count, image_url, image_urls, created_at,
            dealers (
                id, dealership_name, slug, location, logo_url, phone, whatsapp
            )
        `, { count: 'exact' })
        .eq('status', 'available')

    // Filters
    const makes = sp.get('make')?.split(',').map(m => m.trim()).filter(Boolean) ?? []
    if (makes.length === 1) {
        query = query.ilike('make', `%${makes[0]}%`)
    } else if (makes.length > 1) {
        query = query.in('make', makes)
    }

    const fuels = sp.get('fuel_type')?.split(',').map(f => f.trim()).filter(Boolean) ?? []
    if (fuels.length === 1) {
        query = query.eq('fuel_type', fuels[0])
    } else if (fuels.length > 1) {
        query = query.in('fuel_type', fuels)
    }

    // Exclude certain fuel types (used for "Non-EV" toggle)
    const excludeFuels = sp.get('exclude_fuel')?.split(',').map(f => f.trim()).filter(Boolean) ?? []
    for (const ef of excludeFuels) {
        query = query.neq('fuel_type', ef)
    }

    // Vehicle category filter (maps to body_type)
    const bodyTypes = CATEGORY_BODY_TYPES[category] ?? []
    if (bodyTypes.length > 0) {
        query = query.in('body_type', bodyTypes)
    } else if (category === 'four_wheeler' || category === '4w') {
        // Exclude non-4-wheeler body types, but KEEP vehicles with NULL body_type
        // (most dealer-uploaded vehicles don't set body_type — they're 4W by default)
        const exclude4w = [
            ...CATEGORY_BODY_TYPES.two_three_wheeler,
            ...CATEGORY_BODY_TYPES.fleet,
            ...CATEGORY_BODY_TYPES.bus,
        ]
        query = query.or(`body_type.is.null,body_type.not.in.(${exclude4w.map(b => `"${b}"`).join(',')})`)
    }

    if (condition && condition !== 'all') query = query.eq('condition', condition)

    // Body type filter (within a category)
    const bodyType = sp.get('body_type')?.trim()
    if (bodyType) query = query.ilike('body_type', `%${bodyType}%`)

    // Transmission filter
    const transmission = sp.get('transmission')?.trim()
    if (transmission) query = query.eq('transmission', transmission)

    // Year range filter
    const yearFrom = parseInt(sp.get('year_from') ?? '0')
    const yearTo   = parseInt(sp.get('year_to')   ?? '0')
    if (yearFrom > 0) query = query.gte('year', yearFrom)
    if (yearTo   > 0) query = query.lte('year', yearTo)

    const city  = sp.get('city')?.trim()
    const state = sp.get('state')?.trim()
    // Filter by dealer location — PostgREST can't ilike on joined table columns,
    // so we resolve matching dealer IDs first then IN-filter on dealer_id
    if (city || state) {
        let dealerQuery = supabase.from('dealers').select('id')
        if (city)  dealerQuery = dealerQuery.ilike('location', `%${city}%`)
        if (state) dealerQuery = dealerQuery.ilike('location', `%${state}%`)
        const { data: matchedDealers } = await dealerQuery
        const dealerIds = (matchedDealers ?? []).map((d: { id: string }) => d.id)
        if (dealerIds.length > 0) {
            query = query.in('dealer_id', dealerIds)
        } else {
            // No dealers match — return empty
            return NextResponse.json({ success: true, data: { vehicles: [], total: 0, page, pageSize, totalPages: 0 } })
        }
    }

    const minPrice = parseFloat(sp.get('minPrice') ?? '0')
    const maxPrice = parseFloat(sp.get('maxPrice') ?? '0')
    if (minPrice > 0) query = query.gte('price_paise', Math.round(minPrice * 100))
    if (maxPrice > 0) query = query.lte('price_paise', Math.round(maxPrice * 100))

    // Sort
    const sortBy = sp.get('sortBy') ?? 'newest'
    if (sortBy === 'price_low')  query = query.order('price_paise', { ascending: true })
    else if (sortBy === 'price_high') query = query.order('price_paise', { ascending: false })
    else query = query.order('created_at', { ascending: false })   // newest

    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
        console.error('[Marketplace API]', error.message)
        return NextResponse.json({ success: false, error: 'Failed to fetch listings' }, { status: 500 })
    }

    // Aggregate filter options from the result set (for sidebar counts)
    const totalPages = Math.ceil((count ?? 0) / pageSize)

    return NextResponse.json({
        success: true,
        data: {
            vehicles: data ?? [],
            total:     count ?? 0,
            page,
            pageSize,
            totalPages,
        },
    })
}

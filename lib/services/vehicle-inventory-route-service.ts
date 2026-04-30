import { NextRequest, NextResponse } from 'next/server'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { modelToSlug } from '@/lib/utils/brand-model-images'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { requireDealerAccount } from '@/lib/services/vehicle-route-service-utils'

type RouteParams = { params: Promise<{ id: string }> }

type VehicleLookup = {
    id: string
    brand: string
    model: string
    variant?: string | null
}

type DealerVehicleType = 'two-wheeler' | 'three-wheeler'

type DealerRouteMetadata = {
    id: string
    phone: string
    logo_url: string | null
    dealership_name: string
    style_template: string
}

type DealerSlugResolution<TVehicle> = {
    vehicle: TVehicle
    dealer: DealerRouteMetadata
}

type VehicleDetailRouteOptions<TVehicle extends VehicleLookup, TUpdatePayload> = {
    vehicleType: DealerVehicleType
    catalogPrefix: string
    dbPrefix: string
    getVehicleById: (id: string, dealerId?: string) => Promise<TVehicle | null>
    getVehicles: (dealerId: string, filters: { pageSize: number; sortBy: 'newest' }) => Promise<{ vehicles: TVehicle[] }>
    getCatalogFromDB: (brand: string, dealerId: string) => Promise<TVehicle[]>
    getFallbackCatalog: (brand: string, dealerId: string) => TVehicle[]
    hydrateVehicle: (vehicle: TVehicle) => TVehicle | Promise<unknown>
    incrementViews: (id: string) => Promise<unknown>
    updateVehicle: (id: string, dealerId: string, body: TUpdatePayload) => Promise<{ success: boolean; error?: string }>
    deleteVehicle: (id: string, dealerId: string) => Promise<{ success: boolean; error?: string }>
}

type UsedVehicleCollectionOptions<TFilters, TCreatePayload> = {
    rateLimitKey: string
    buildFilters: (searchParams: URLSearchParams) => TFilters
    getVehicles: (dealerId: string, filters: TFilters) => Promise<unknown>
    addVehicle: (dealerId: string, body: TCreatePayload) => Promise<{ success: boolean; id?: string; error?: string }>
}

type UsedVehicleDetailOptions<TVehicle, TUpdatePayload> = {
    vehicleType: DealerVehicleType
    getVehicleById: (id: string, dealerId?: string) => Promise<TVehicle | null>
    updateVehicle: (id: string, dealerId: string, body: TUpdatePayload) => Promise<{ success: boolean; error?: string }>
    deleteVehicle: (id: string, dealerId: string) => Promise<{ success: boolean; error?: string }>
}

function dealerRouteMetadata(dealer: NonNullable<Awaited<ReturnType<typeof fetchDealerBySlug>>>): DealerRouteMetadata {
    return {
        id:              dealer.id,
        phone:           dealer.phone,
        logo_url:        dealer.logo_url,
        dealership_name: dealer.dealership_name,
        style_template:  dealer.style_template,
    }
}

function appendDealerMetadata<TVehicle>(vehicle: TVehicle, dealer: DealerRouteMetadata | null): TVehicle | (TVehicle & { _dealer: DealerRouteMetadata }) {
    if (!dealer || typeof vehicle !== 'object' || vehicle === null) return vehicle as TVehicle
    return { ...(vehicle as Record<string, unknown>), _dealer: dealer } as TVehicle & { _dealer: DealerRouteMetadata }
}

function dealerSupportsVehicleType(
    dealer: NonNullable<Awaited<ReturnType<typeof fetchDealerBySlug>>>,
    vehicleType: DealerVehicleType
): boolean {
    if (dealer.vehicle_type === vehicleType) return true
    if (vehicleType === 'two-wheeler') return dealer.sells_two_wheelers
    return dealer.sells_three_wheelers
}

function normalizeIdentifier(value: string, options: Pick<VehicleDetailRouteOptions<VehicleLookup, unknown>, 'catalogPrefix' | 'dbPrefix'>): string {
    return value
        .toLowerCase()
        .replace(new RegExp(`^${options.catalogPrefix}-\\d+-`), '')
        .replace(new RegExp(`^${options.dbPrefix}`), '')
        .trim()
}

function getVehicleLookupSlugs(
    vehicle: VehicleLookup,
    options: Pick<VehicleDetailRouteOptions<VehicleLookup, unknown>, 'catalogPrefix' | 'dbPrefix'>
): string[] {
    const values = [
        vehicle.id,
        modelToSlug(vehicle.model),
        modelToSlug(`${vehicle.brand} ${vehicle.model}`),
        vehicle.variant ? modelToSlug(`${vehicle.model} ${vehicle.variant}`) : '',
        vehicle.variant ? modelToSlug(`${vehicle.brand} ${vehicle.model} ${vehicle.variant}`) : '',
    ]

    return Array.from(new Set(values.filter(Boolean).map((value) => normalizeIdentifier(value, options))))
}

async function resolveVehicleBySlug<TVehicle extends VehicleLookup>(
    slug: string,
    identifier: string,
    options: VehicleDetailRouteOptions<TVehicle, unknown>
): Promise<DealerSlugResolution<TVehicle> | null> {
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer || !dealerSupportsVehicleType(dealer, options.vehicleType)) return null

    const directVehicle = await options.getVehicleById(identifier, dealer.id)
    if (directVehicle) return { vehicle: directVehicle, dealer: dealerRouteMetadata(dealer) }

    const normalized = normalizeIdentifier(identifier, options)
    const { vehicles: dealerVehicles } = await options.getVehicles(dealer.id, { pageSize: 100, sortBy: 'newest' })
    const directMatch = dealerVehicles.find((vehicle) => getVehicleLookupSlugs(vehicle, options).includes(normalized))
    if (directMatch) return { vehicle: directMatch, dealer: dealerRouteMetadata(dealer) }

    const brandsToShow = dealer.brandFilter ? [dealer.brandFilter] : dealer.brands
    const catalogGroups = await Promise.all(
        brandsToShow.map(async (brand, brandIndex) => {
            const dbRows = await options.getCatalogFromDB(brand, dealer.id)
            const fallbackRows = options.getFallbackCatalog(brand, dealer.id)
            const source = [...dbRows, ...fallbackRows]
            return source.map((vehicle) => ({ ...vehicle, id: `${options.catalogPrefix}-${brandIndex}-${vehicle.id}` }))
        })
    )

    const catalogMatch = catalogGroups
        .flat()
        .find((vehicle) =>
            normalizeIdentifier(vehicle.id, options) === normalized ||
            getVehicleLookupSlugs(vehicle, options).includes(normalized)
        ) ?? null

    return catalogMatch ? { vehicle: catalogMatch, dealer: dealerRouteMetadata(dealer) } : null
}

async function updateDealerVehicle<TUpdatePayload>(
    request: NextRequest,
    id: string,
    updateVehicle: (id: string, dealerId: string, body: TUpdatePayload) => Promise<{ success: boolean; error?: string }>
) {
    const { dealer, errorResponse } = await requireDealerAccount()
    if (errorResponse) return errorResponse

    const body = await request.json() as TUpdatePayload
    const result = await updateVehicle(id, dealer.id, body)
    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true })
}

async function deleteDealerVehicle(
    id: string,
    deleteVehicle: (id: string, dealerId: string) => Promise<{ success: boolean; error?: string }>
) {
    const { dealer, errorResponse } = await requireDealerAccount()
    if (errorResponse) return errorResponse

    const result = await deleteVehicle(id, dealer.id)
    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true })
}

function createDealerMutationHandlers<TUpdatePayload>(
    updateVehicle: (id: string, dealerId: string, body: TUpdatePayload) => Promise<{ success: boolean; error?: string }>,
    deleteVehicle: (id: string, dealerId: string) => Promise<{ success: boolean; error?: string }>
) {
    return {
        PUT: async (request: NextRequest, { params }: RouteParams) => {
            const { id } = await params
            return updateDealerVehicle(request, id, updateVehicle)
        },
        DELETE: async (_request: NextRequest, { params }: RouteParams) => {
            const { id } = await params
            return deleteDealerVehicle(id, deleteVehicle)
        },
    }
}

export function createVehicleDetailRouteHandlers<TVehicle extends VehicleLookup, TUpdatePayload>(
    options: VehicleDetailRouteOptions<TVehicle, TUpdatePayload>
) {
    return {
        GET: async (request: NextRequest, { params }: RouteParams) => {
            const { id } = await params
            const slug = request.nextUrl.searchParams.get('slug')
            const slugResolution = slug
                ? await resolveVehicleBySlug(slug, id, options as VehicleDetailRouteOptions<TVehicle, unknown>)
                : null
            const dealerMetadata = slugResolution?.dealer ?? null
            const vehicle = slug
                ? slugResolution?.vehicle ?? null
                : await (async () => {
                    const { dealer, errorResponse } = await requireDealerAccount()
                    if (errorResponse) return errorResponse
                    return options.getVehicleById(id, dealer.id)
                })()
            if (vehicle instanceof NextResponse) return vehicle
            if (!vehicle) {
                return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
            }

            const hydratedVehicle = await options.hydrateVehicle(vehicle)
            if (vehicle.id === id) options.incrementViews(id).catch(() => {})
            return NextResponse.json(appendDealerMetadata(hydratedVehicle, dealerMetadata))
        },
        ...createDealerMutationHandlers(options.updateVehicle, options.deleteVehicle),
    }
}

export function createUsedVehicleCollectionRouteHandlers<TFilters, TCreatePayload>(
    options: UsedVehicleCollectionOptions<TFilters, TCreatePayload>
) {
    return {
        GET: async (request: NextRequest) => {
            const { searchParams } = new URL(request.url)
            const dealerId = searchParams.get('dealerId')
            if (!dealerId) {
                return NextResponse.json({ error: 'dealerId is required' }, { status: 400 })
            }

            const result = await options.getVehicles(dealerId, options.buildFilters(searchParams))
            return NextResponse.json(result)
        },
        POST: async (request: NextRequest) => {
            const rateLimit = await rateLimitOrNull(options.rateLimitKey, request, 30, 60 * 60 * 1000)
            if (rateLimit) return rateLimit

            const { dealer, errorResponse } = await requireDealerAccount()
            if (errorResponse) return errorResponse

            const body = await request.json() as TCreatePayload
            const result = await options.addVehicle(dealer.id, body)
            if (!result.success) {
                return NextResponse.json({ error: result.error }, { status: 400 })
            }
            return NextResponse.json({ success: true, id: result.id }, { status: 201 })
        },
    }
}

export function createUsedVehicleDetailRouteHandlers<TVehicle, TUpdatePayload>(
    options: UsedVehicleDetailOptions<TVehicle, TUpdatePayload>
) {
    return {
        GET: async (request: NextRequest, { params }: RouteParams) => {
            const { id } = await params
            const slug = request.nextUrl.searchParams.get('slug')
            let dealerMetadata: DealerRouteMetadata | null = null
            const vehicle = slug
                ? await (async () => {
                    const dealer = await fetchDealerBySlug(slug)
                    if (!dealer || !dealerSupportsVehicleType(dealer, options.vehicleType)) return null
                    dealerMetadata = dealerRouteMetadata(dealer)
                    return options.getVehicleById(id, dealer.id)
                })()
                : await (async () => {
                    const { dealer, errorResponse } = await requireDealerAccount()
                    if (errorResponse) return errorResponse
                    return options.getVehicleById(id, dealer.id)
                })()
            if (vehicle instanceof NextResponse) return vehicle
            if (!vehicle) {
                return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
            }
            return NextResponse.json(appendDealerMetadata(vehicle, dealerMetadata))
        },
        ...createDealerMutationHandlers(options.updateVehicle, options.deleteVehicle),
    }
}

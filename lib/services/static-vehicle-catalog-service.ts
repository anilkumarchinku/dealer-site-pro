import { NextRequest, NextResponse } from 'next/server'

export type MileageParseOptions = {
    includeKmPerKg?: boolean
    rangeMode?: 'two-wheeler' | 'three-wheeler'
}

export type StaticVehicleListItem = {
    make: string
    model: string
    variant: string
    type: string
    price_min_paise: number
    is_featured: boolean
}

type StaticVehicleListOptions<TVehicle extends StaticVehicleListItem> = {
    loadVehicles: () => TVehicle[]
    typeValues: string[]
    makeFilterMode: 'csv' | 'exact'
    includePriceFilters?: boolean
    errorLabel: string
}

type StaticVehicleDetailOptions<TVehicle> = {
    findVehicleById: (id: string) => TVehicle | null
    errorLabel: string
}

export function parsePriceToPaise(raw: string | undefined | null): number {
    if (!raw) return 0
    const cleaned = raw.replace(/[₹,\s]/g, '')
    const lakhMatch = cleaned.match(/^([\d.]+)\s*[Ll]akh$/)
    if (lakhMatch) return Math.round(parseFloat(lakhMatch[1]) * 100000 * 100)
    const croreMatch = cleaned.match(/^([\d.]+)\s*[Cc]rore$/)
    if (croreMatch) return Math.round(parseFloat(croreMatch[1]) * 10000000 * 100)
    const num = parseFloat(cleaned)
    if (!isNaN(num)) return Math.round(num * 100)
    return 0
}

export function parseNumberFromString(raw: string | undefined | null): number | null {
    if (!raw || raw === 'N/A' || raw === '') return null
    const match = raw.match(/([\d.]+)/)
    return match ? parseFloat(match[1]) : null
}

export function parseMileage(
    raw: string | number | undefined | null,
    options: MileageParseOptions = {}
): { kmpl: number | null; rangeKm: number | null } {
    if (typeof raw === 'number') return { kmpl: raw, rangeKm: null }
    if (!raw) return { kmpl: null, rangeKm: null }

    const rangeMatch = options.rangeMode === 'three-wheeler'
        ? raw.match(/([\d.]+)\s*km\s*(?:range|\()/i)
        : raw.match(/([\d.]+)\s*km\s*(?:\(range\)|range)/i)
    if (rangeMatch) return { kmpl: null, rangeKm: parseFloat(rangeMatch[1]) }

    const kmplMatch = raw.match(/([\d.]+)\s*kmpl/i)
    if (kmplMatch) return { kmpl: parseFloat(kmplMatch[1]), rangeKm: null }

    if (options.includeKmPerKg) {
        const kmkgMatch = raw.match(/([\d.]+)\s*km\/kg/i)
        if (kmkgMatch) return { kmpl: parseFloat(kmkgMatch[1]), rangeKm: null }
    }

    const numMatch = raw.match(/([\d.]+)/)
    if (numMatch) return { kmpl: parseFloat(numMatch[1]), rangeKm: null }
    return { kmpl: null, rangeKm: null }
}

export function parseBatteryKwh(raw: string | undefined | null): number | null {
    if (!raw) return null
    const match = raw.match(/([\d.]+)\s*kWh/i)
    return match ? parseFloat(match[1]) : null
}

export function parsePassengerCapacity(raw: string | undefined | null): number | null {
    if (!raw || raw === '') return null
    const passengerMatch = raw.match(/(\d+)\s*(?:Passenger|passenger|pax)/i)
    if (passengerMatch) return parseInt(passengerMatch[1])
    const numMatch = raw.match(/(\d+)/)
    return numMatch ? parseInt(numMatch[1]) : null
}

function groupLowestPricedByModel<TVehicle extends StaticVehicleListItem>(vehicles: TVehicle[]) {
    const modelMap = new Map<string, TVehicle>()
    for (const vehicle of vehicles) {
        const key = `${vehicle.make.toLowerCase()}__${vehicle.model.toLowerCase()}`
        if (!modelMap.has(key)) {
            modelMap.set(key, vehicle)
            continue
        }

        const existing = modelMap.get(key)!
        if (
            vehicle.price_min_paise > 0 &&
            (existing.price_min_paise === 0 || vehicle.price_min_paise < existing.price_min_paise)
        ) {
            modelMap.set(key, vehicle)
        }
    }
    return Array.from(modelMap.values())
}

function filterByMake<TVehicle extends StaticVehicleListItem>(
    vehicles: TVehicle[],
    make: string,
    mode: StaticVehicleListOptions<TVehicle>['makeFilterMode']
) {
    if (mode === 'csv') {
        const allowedMakes = make
            .split(',')
            .map((value) => value.trim().toLowerCase())
            .filter(Boolean)
        return vehicles.filter((vehicle) => allowedMakes.includes(vehicle.make.toLowerCase()))
    }

    const makeLower = make.toLowerCase()
    return vehicles.filter((vehicle) => vehicle.make.toLowerCase() === makeLower)
}

export function createStaticVehicleListHandler<TVehicle extends StaticVehicleListItem>(
    options: StaticVehicleListOptions<TVehicle>
) {
    return async function GET(request: NextRequest) {
        try {
            const { searchParams } = new URL(request.url)
            const make = searchParams.get('make')
            const type = searchParams.get('type')
            const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
            const pageSize = Math.min(60, Math.max(1, parseInt(searchParams.get('pageSize') || '30')))
            const sortBy = searchParams.get('sortBy') || 'popular'
            const q = searchParams.get('q') || searchParams.get('searchQuery')

            let grouped = groupLowestPricedByModel(options.loadVehicles())

            if (make) grouped = filterByMake(grouped, make, options.makeFilterMode)
            if (type && options.typeValues.includes(type)) {
                grouped = grouped.filter((vehicle) => vehicle.type === type)
            }

            if (options.includePriceFilters) {
                const minPrice = searchParams.get('minPrice')
                const maxPrice = searchParams.get('maxPrice')
                if (minPrice) {
                    const min = parseInt(minPrice)
                    grouped = grouped.filter((vehicle) => vehicle.price_min_paise >= min)
                }
                if (maxPrice) {
                    const max = parseInt(maxPrice)
                    grouped = grouped.filter((vehicle) => vehicle.price_min_paise <= max)
                }
            }

            if (q) {
                const qLower = q.toLowerCase()
                grouped = grouped.filter(
                    (vehicle) =>
                        vehicle.make.toLowerCase().includes(qLower) ||
                        vehicle.model.toLowerCase().includes(qLower) ||
                        vehicle.variant.toLowerCase().includes(qLower)
                )
            }

            switch (sortBy) {
                case 'price_low':
                    grouped.sort((a, b) => a.price_min_paise - b.price_min_paise)
                    break
                case 'price_high':
                    grouped.sort((a, b) => b.price_min_paise - a.price_min_paise)
                    break
                case 'newest':
                    break
                case 'popular':
                default:
                    grouped.sort((a, b) => {
                        const priceDiff = b.price_min_paise - a.price_min_paise
                        if (priceDiff !== 0) return priceDiff
                        return a.model.localeCompare(b.model)
                    })
                    break
            }

            const featuredCount = Math.max(1, Math.ceil(grouped.length * 0.2))
            for (let i = 0; i < grouped.length; i++) {
                grouped[i] = { ...grouped[i], is_featured: i < featuredCount }
            }

            const total = grouped.length
            const totalPages = Math.ceil(total / pageSize)
            const from = (page - 1) * pageSize
            const paged = grouped.slice(from, from + pageSize)

            return NextResponse.json({
                success: true,
                data: {
                    vehicles: paged,
                    total,
                    page,
                    pageSize,
                    totalPages,
                },
            })
        } catch (error) {
            console.error(`Error in ${options.errorLabel} API:`, error)
            return NextResponse.json(
                { success: false, error: 'Internal server error' },
                { status: 500 }
            )
        }
    }
}

export function createStaticVehicleDetailHandler<TVehicle>(
    options: StaticVehicleDetailOptions<TVehicle>
) {
    return async function GET(
        _request: NextRequest,
        { params }: { params: Promise<{ id: string }> }
    ) {
        try {
            const { id } = await params
            const data = options.findVehicleById(id)

            if (!data) {
                return NextResponse.json(
                    { success: false, error: 'Vehicle not found' },
                    { status: 404 }
                )
            }

            return NextResponse.json({ success: true, data })
        } catch (error) {
            console.error(`Error in ${options.errorLabel} API:`, error)
            return NextResponse.json(
                { success: false, error: 'Internal server error' },
                { status: 500 }
            )
        }
    }
}

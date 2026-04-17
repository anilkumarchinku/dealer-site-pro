/**
 * GET    /api/two-wheelers/[id]  — Public: get single vehicle
 * PUT    /api/two-wheelers/[id]  — Dealer: update vehicle
 * DELETE /api/two-wheelers/[id]  — Dealer: soft-delete vehicle
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getDealerForUser } from '@/lib/supabase-server'
import {
    getTwoWheelerVehicleById,
    getTwoWheelerVehicles,
    updateTwoWheelerVehicle,
    deleteTwoWheelerVehicle,
    incrementTwoWheelerViews,
} from '@/lib/db/two-wheelers'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { getTwoWheelerCatalog } from '@/lib/data/two-wheelers'
import { getTwoWheelerCatalogFromDB } from '@/lib/data/catalog-db'
import { modelToSlug } from '@/lib/utils/brand-model-images'
import type { TwoWheelerVehicle } from '@/lib/types/two-wheeler'
import { hydrateTwoWheelerWithJson } from '@/lib/data/two-wheeler-detail'

interface Params { params: Promise<{ id: string }> }

function normalizeIdentifier(value: string): string {
    return value
        .toLowerCase()
        .replace(/^cat-2w-\d+-/, '')
        .replace(/^tw-/, '')
        .trim()
}

function getVehicleLookupSlugs(vehicle: TwoWheelerVehicle): string[] {
    const values = [
        vehicle.id,
        modelToSlug(vehicle.model),
        modelToSlug(`${vehicle.brand} ${vehicle.model}`),
        vehicle.variant ? modelToSlug(`${vehicle.model} ${vehicle.variant}`) : '',
        vehicle.variant ? modelToSlug(`${vehicle.brand} ${vehicle.model} ${vehicle.variant}`) : '',
    ]

    return Array.from(new Set(values.filter(Boolean).map(normalizeIdentifier)))
}

async function resolveVehicleBySlug(slug: string, identifier: string): Promise<TwoWheelerVehicle | null> {
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer || dealer.vehicle_type !== 'two-wheeler') return null

    const directVehicle = await getTwoWheelerVehicleById(identifier, dealer.id)
    if (directVehicle) return directVehicle

    const normalized = normalizeIdentifier(identifier)

    const { vehicles: dealerVehicles } = await getTwoWheelerVehicles(dealer.id, { pageSize: 100, sortBy: 'newest' })
    const directMatch = dealerVehicles.find(vehicle => getVehicleLookupSlugs(vehicle).includes(normalized))
    if (directMatch) return directMatch

    const brandsToShow = dealer.brandFilter ? [dealer.brandFilter] : dealer.brands
    const catalogGroups = await Promise.all(
        brandsToShow.map(async (brand, brandIndex) => {
            const dbRows = await getTwoWheelerCatalogFromDB(brand, dealer.id)
            const source = dbRows.length > 0 ? dbRows : getTwoWheelerCatalog(brand, dealer.id)
            return source.map(vehicle => ({ ...vehicle, id: `cat-2w-${brandIndex}-${vehicle.id}` }))
        })
    )

    return catalogGroups
        .flat()
        .find(vehicle =>
            normalizeIdentifier(vehicle.id) === normalized ||
            getVehicleLookupSlugs(vehicle).includes(normalized)
        ) ?? null
}

export async function GET(_req: NextRequest, { params }: Params) {
    const { id } = await params
    const slug = _req.nextUrl.searchParams.get('slug')
    const vehicle = slug
        ? await resolveVehicleBySlug(slug, id)
        : await getTwoWheelerVehicleById(id)
    if (!vehicle) {
        return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }
    const hydratedVehicle = hydrateTwoWheelerWithJson(vehicle)
    // Fire-and-forget view increment
    if (vehicle.id === id) incrementTwoWheelerViews(id).catch(() => {})
    return NextResponse.json(hydratedVehicle)
}

export async function PUT(request: NextRequest, { params }: Params) {
    const { id } = await params
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) {
        return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })
    }

    const body = await request.json()
    const result = await updateTwoWheelerVehicle(id, dealer.id, body)

    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    const { id } = await params
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) {
        return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })
    }

    const result = await deleteTwoWheelerVehicle(id, dealer.id)
    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true })
}

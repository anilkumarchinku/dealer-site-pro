/**
 * GET    /api/three-wheelers/[id]  — Public
 * PUT    /api/three-wheelers/[id]  — Dealer
 * DELETE /api/three-wheelers/[id]  — Dealer (soft delete)
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getDealerForUser } from '@/lib/supabase-server'
import {
    getThreeWheelerVehicleById,
    getThreeWheelerVehicles,
    updateThreeWheelerVehicle,
    deleteThreeWheelerVehicle,
    incrementThreeWheelerViews,
} from '@/lib/db/three-wheelers'
import { fetchDealerBySlug } from '@/lib/db/dealers'
import { getThreeWheelerCatalog } from '@/lib/data/three-wheelers'
import { getThreeWheelerCatalogFromDB } from '@/lib/data/catalog-db'
import { modelToSlug } from '@/lib/utils/brand-model-images'
import type { ThreeWheelerVehicle } from '@/lib/types/three-wheeler'
import { hydrateThreeWheelerWithJson } from '@/lib/data/three-wheeler-detail'

interface Params { params: Promise<{ id: string }> }

function normalizeIdentifier(value: string): string {
    return value
        .toLowerCase()
        .replace(/^cat-3w-\d+-/, '')
        .replace(/^thw-/, '')
        .trim()
}

function getVehicleLookupSlugs(vehicle: ThreeWheelerVehicle): string[] {
    const values = [
        vehicle.id,
        modelToSlug(vehicle.model),
        modelToSlug(`${vehicle.brand} ${vehicle.model}`),
        vehicle.variant ? modelToSlug(`${vehicle.model} ${vehicle.variant}`) : '',
        vehicle.variant ? modelToSlug(`${vehicle.brand} ${vehicle.model} ${vehicle.variant}`) : '',
    ]

    return Array.from(new Set(values.filter(Boolean).map(normalizeIdentifier)))
}

async function resolveVehicleBySlug(slug: string, identifier: string): Promise<ThreeWheelerVehicle | null> {
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer || dealer.vehicle_type !== 'three-wheeler') return null

    const directVehicle = await getThreeWheelerVehicleById(identifier, dealer.id)
    if (directVehicle) return directVehicle

    const normalized = normalizeIdentifier(identifier)
    const { vehicles: dealerVehicles } = await getThreeWheelerVehicles(dealer.id, { pageSize: 100, sortBy: 'newest' })
    const directMatch = dealerVehicles.find(vehicle => getVehicleLookupSlugs(vehicle).includes(normalized))
    if (directMatch) return directMatch

    const brandsToShow = dealer.brandFilter ? [dealer.brandFilter] : dealer.brands
    const catalogGroups = await Promise.all(
        brandsToShow.map(async (brand, brandIndex) => {
            const dbRows = await getThreeWheelerCatalogFromDB(brand, dealer.id)
            const source = dbRows.length > 0 ? dbRows : getThreeWheelerCatalog(brand, dealer.id)
            return source.map(vehicle => ({ ...vehicle, id: `cat-3w-${brandIndex}-${vehicle.id}` }))
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
        : await getThreeWheelerVehicleById(id)
    if (!vehicle) return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    const hydratedVehicle = hydrateThreeWheelerWithJson(vehicle)
    if (vehicle.id === id) incrementThreeWheelerViews(id).catch(() => {})
    return NextResponse.json(hydratedVehicle)
}

export async function PUT(request: NextRequest, { params }: Params) {
    const { id } = await params
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse
    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })
    const body = await request.json()
    const result = await updateThreeWheelerVehicle(id, dealer.id, body)
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    const { id } = await params
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse
    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })
    const result = await deleteThreeWheelerVehicle(id, dealer.id)
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true })
}

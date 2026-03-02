/**
 * GET    /api/two-wheelers/[id]  — Public: get single vehicle
 * PUT    /api/two-wheelers/[id]  — Dealer: update vehicle
 * DELETE /api/two-wheelers/[id]  — Dealer: soft-delete vehicle
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getDealerForUser } from '@/lib/supabase-server'
import {
    getTwoWheelerVehicleById,
    updateTwoWheelerVehicle,
    deleteTwoWheelerVehicle,
    incrementTwoWheelerViews,
} from '@/lib/db/two-wheelers'

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
    const { id } = await params
    const vehicle = await getTwoWheelerVehicleById(id)
    if (!vehicle) {
        return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }
    // Fire-and-forget view increment
    incrementTwoWheelerViews(id).catch(() => {})
    return NextResponse.json(vehicle)
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

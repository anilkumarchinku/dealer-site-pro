/**
 * GET    /api/two-wheelers/used/[id]  — Public: get single used vehicle
 * PUT    /api/two-wheelers/used/[id]  — Dealer: update used vehicle
 * DELETE /api/two-wheelers/used/[id]  — Dealer: mark vehicle as sold
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getDealerForUser } from '@/lib/supabase-server'
import {
    getUsedTwoWheelerById,
    updateUsedTwoWheeler,
    deleteUsedTwoWheeler,
} from '@/lib/db/two-wheelers'

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
    const { id } = await params
    const vehicle = await getUsedTwoWheelerById(id)
    if (!vehicle) {
        return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }
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
    const result = await updateUsedTwoWheeler(id, dealer.id, body)

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

    const result = await deleteUsedTwoWheeler(id, dealer.id)
    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true })
}

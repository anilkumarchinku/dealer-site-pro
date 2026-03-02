import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getDealerForUser } from '@/lib/supabase-server'
import { getUsedThreeWheelerById, updateUsedThreeWheeler, deleteUsedThreeWheeler } from '@/lib/db/three-wheelers'

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
    const { id } = await params
    const vehicle = await getUsedThreeWheelerById(id)
    if (!vehicle) return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    return NextResponse.json(vehicle)
}

export async function PUT(request: NextRequest, { params }: Params) {
    const { id } = await params
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse
    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })
    const body = await request.json()
    const result = await updateUsedThreeWheeler(id, dealer.id, body)
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    const { id } = await params
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse
    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) return NextResponse.json({ error: 'Dealer account not found' }, { status: 403 })
    const result = await deleteUsedThreeWheeler(id, dealer.id)
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true })
}

/**
 * POST /api/inventory/cyepro
 *
 * Server-side proxy for the Cyepro Vehicle Inventory API.
 * Keeps the dealer's API key on the server — never exposed to browsers.
 *
 * Request body:
 *   { dealerId: string, page?: number, size?: number, filters?: {...} }
 *
 * Returns mapped Car[] + pagination metadata.
 */

import { NextResponse }             from 'next/server'
import { requireAuth }              from '@/lib/supabase-server'
import { createRouteClient }        from '@/lib/supabase-server'
import {
    fetchCyeproVehicles,
    mapCyeproVehicleToCar,
    type CyeproSearchBody,
} from '@/lib/services/cyepro-service'

export async function POST(request: Request) {
    try {
        // ── Auth: signed-in user only ─────────────────────────────────────────
        const { user, supabase, errorResponse: authErr } = await requireAuth()
        if (authErr) return authErr

        const body = await request.json()
        const {
            dealerId,
            page    = 1,
            size    = 30,
            priceMin, priceMax,
            yearMin,  yearMax,
            kmDrivenMax,
            sortBy, order,
        } = body

        if (!dealerId) {
            return NextResponse.json({ error: 'dealerId is required' }, { status: 400 })
        }

        // ── Fetch dealer's Cyepro API key ─────────────────────────────────────
        const { data: dealer, error: dealerErr } = await supabase
            .from('dealers')
            .select('cyepro_api_key')
            .eq('id', dealerId)
            .eq('user_id', user.id)
            .single()

        if (dealerErr || !dealer) {
            return NextResponse.json({ error: 'Dealer not found' }, { status: 404 })
        }

        if (!dealer.cyepro_api_key) {
            return NextResponse.json(
                { error: 'Cyepro API key not configured. Go to Settings → Integrations to add it.' },
                { status: 422 },
            )
        }

        // ── Build search params ───────────────────────────────────────────────
        const searchParams: Partial<CyeproSearchBody> = {
            page,
            size,
            ...(priceMin    != null && { priceMin }),
            ...(priceMax    != null && { priceMax }),
            ...(yearMin     != null && { yearMin }),
            ...(yearMax     != null && { yearMax }),
            ...(kmDrivenMax != null && { kmDrivenMax }),
            ...(sortBy      != null && { sortBy }),
            ...(order       != null && { order }),
        }

        // ── Call Cyepro API ───────────────────────────────────────────────────
        const cyeproRes = await fetchCyeproVehicles(dealer.cyepro_api_key, searchParams)

        if (!cyeproRes) {
            return NextResponse.json(
                { error: 'Failed to fetch inventory from Cyepro. Check your API key.' },
                { status: 502 },
            )
        }

        // ── Map to Car type ───────────────────────────────────────────────────
        const cars = cyeproRes.vehicles.map(mapCyeproVehicleToCar)

        return NextResponse.json({
            success:     true,
            cars,
            totalCount:  cyeproRes.totalCount,
            pageNumber:  cyeproRes.pageNumber,
            pageSize:    cyeproRes.pageSize,
            totalPages:  cyeproRes.totalPages,
        })
    } catch (error) {
        console.error('[/api/inventory/cyepro] Error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 },
        )
    }
}

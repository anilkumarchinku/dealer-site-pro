import { NextRequest, NextResponse } from 'next/server'
import { getDealerForUser, requireAuth } from '@/lib/supabase-server'
import {
    clearUsedVehiclePriceOffer,
    fetchActiveUsedVehiclePriceOffers,
    upsertUsedVehiclePriceOffer,
    type UsedVehicleCategory,
    type UsedVehicleSourceType,
} from '@/lib/services/used-vehicle-price-offers'

const VALID_CATEGORIES = new Set(['2w', '3w', '4w'])
const VALID_SOURCE_TYPES = new Set(['manual', 'cyepro'])

function isCategory(value: unknown): value is UsedVehicleCategory {
    return typeof value === 'string' && VALID_CATEGORIES.has(value)
}

function isSourceType(value: unknown): value is UsedVehicleSourceType {
    return typeof value === 'string' && VALID_SOURCE_TYPES.has(value)
}

async function getOwnedDealerId() {
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return { dealerId: null, errorResponse }

    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) {
        return {
            dealerId: null,
            errorResponse: NextResponse.json({ error: 'Dealer account not found' }, { status: 403 }),
        }
    }

    return { dealerId: dealer.id, errorResponse: null }
}

export async function GET() {
    const { dealerId, errorResponse } = await getOwnedDealerId()
    if (errorResponse) return errorResponse

    const offers = await fetchActiveUsedVehiclePriceOffers(dealerId)
    return NextResponse.json({ offers })
}

export async function POST(request: NextRequest) {
    const { dealerId, errorResponse } = await getOwnedDealerId()
    if (errorResponse) return errorResponse

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

    const {
        vehicle_category,
        source_type,
        source_vehicle_id,
        offer_price_paise,
        offer_label,
        valid_until,
    } = body

    if (!isCategory(vehicle_category)) {
        return NextResponse.json({ error: 'vehicle_category must be 2w, 3w, or 4w' }, { status: 400 })
    }
    if (!isSourceType(source_type)) {
        return NextResponse.json({ error: 'source_type must be manual or cyepro' }, { status: 400 })
    }
    if (typeof source_vehicle_id !== 'string' || !source_vehicle_id.trim()) {
        return NextResponse.json({ error: 'source_vehicle_id is required' }, { status: 400 })
    }
    if (typeof offer_price_paise !== 'number' || !Number.isFinite(offer_price_paise) || offer_price_paise < 0) {
        return NextResponse.json({ error: 'offer_price_paise must be a valid amount' }, { status: 400 })
    }

    const result = await upsertUsedVehiclePriceOffer({
        dealer_id: dealerId,
        vehicle_category,
        source_type,
        source_vehicle_id: source_vehicle_id.trim(),
        offer_price_paise: Math.round(offer_price_paise),
        offer_label: typeof offer_label === 'string' ? offer_label : null,
        valid_until: typeof valid_until === 'string' && valid_until ? valid_until : null,
    })

    if (!result.success) {
        return NextResponse.json({ error: result.error ?? 'Failed to save offer price' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: result.id })
}

export async function DELETE(request: NextRequest) {
    const { dealerId, errorResponse } = await getOwnedDealerId()
    if (errorResponse) return errorResponse

    const { searchParams } = new URL(request.url)
    const vehicleCategory = searchParams.get('vehicle_category')
    const sourceType = searchParams.get('source_type')
    const sourceVehicleId = searchParams.get('source_vehicle_id')

    if (!isCategory(vehicleCategory) || !isSourceType(sourceType) || !sourceVehicleId) {
        return NextResponse.json({ error: 'vehicle_category, source_type, and source_vehicle_id are required' }, { status: 400 })
    }

    const result = await clearUsedVehiclePriceOffer({
        dealer_id: dealerId,
        vehicle_category: vehicleCategory,
        source_type: sourceType,
        source_vehicle_id: sourceVehicleId,
    })

    if (!result.success) {
        return NextResponse.json({ error: result.error ?? 'Failed to clear offer price' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

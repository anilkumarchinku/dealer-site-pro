import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, requireAuth, getDealerForUser } from '@/lib/supabase-server'
import { formatZodErrors, sellRequestSchema } from '@/lib/validations/schemas'
import { logger } from '@/lib/utils/logger'
import { getOptionalEnv } from '@/lib/env'
import { sendSellRequestConfirmationEmail, sendSellRequestNotificationEmail } from '@/lib/services/email-service'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'

const SELL_REQUEST_STATUSES = ['new', 'reviewing', 'contacted', 'approved', 'rejected', 'listed'] as const
type SellRequestStatus = typeof SELL_REQUEST_STATUSES[number]

type SellRequestRow = {
    id: string
    dealer_id: string | null
    seller_name: string
    seller_phone: string
    seller_email: string | null
    make: string
    model: string | null
    variant: string | null
    year: number
    fuel_type: string
    transmission: string | null
    registration_number: string | null
    mileage_km: number
    owner_count: string | null
    expected_price_paise: number | null
    city: string | null
    address: string | null
    preferred_date: string | null
    preferred_slot: string | null
    estimated_low_paise: number | null
    estimated_high_paise: number | null
    photo_urls: string[]
    notes: string | null
    status: SellRequestStatus
    admin_notes: string | null
    approved_vehicle_id: string | null
}

function getSupabase() {
    // sell_requests is added by this feature's migration; generated DB types may lag locally.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createAdminClient() as any
}

function cleanText(value: string | null | undefined) {
    const text = value?.trim()
    return text || null
}

function buildVehicleDescription(request: SellRequestRow) {
    return [
        'Seller-submitted vehicle approved by the dealership.',
        request.notes ? `Seller notes: ${request.notes}` : null,
        request.city ? `Location: ${request.city}` : null,
    ].filter(Boolean).join('\n\n')
}

async function listSellRequestVehicle(
    supabase: ReturnType<typeof getSupabase>,
    request: SellRequestRow,
    dealerId: string,
) {
    if (request.approved_vehicle_id) {
        return request.approved_vehicle_id
    }

    const imageUrls = (request.photo_urls ?? [])
        .map(url => url.trim())
        .filter(Boolean)
        .slice(0, 10)

    const features = [
        request.owner_count ? `${request.owner_count} owner` : null,
        request.city ? `Location: ${request.city}` : null,
        request.preferred_date ? `Inspection requested: ${request.preferred_date}` : null,
    ].filter(Boolean)

    const pricePaise = request.estimated_high_paise
        ?? request.estimated_low_paise
        ?? request.expected_price_paise
        ?? 0

    const { data, error } = await supabase
        .from('vehicles')
        .insert({
            dealer_id: request.dealer_id ?? dealerId,
            make: request.make,
            model: cleanText(request.model) ?? 'Model pending',
            variant: cleanText(request.variant),
            year: request.year,
            price_paise: pricePaise,
            mileage_km: request.mileage_km,
            fuel_type: cleanText(request.fuel_type),
            transmission: cleanText(request.transmission),
            registration_number: cleanText(request.registration_number)?.toUpperCase(),
            features,
            description: buildVehicleDescription(request),
            image_url: imageUrls[0] ?? null,
            image_urls: imageUrls,
            condition: 'used',
            status: 'available',
            views: 0,
        })
        .select('id')
        .single()

    if (error) throw error
    return data.id as string
}

export async function GET() {
    const { user, supabase: routeSupabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const dealer = await getDealerForUser(routeSupabase, user.id)
    if (!dealer) {
        return NextResponse.json({ error: 'Dealer account not found' }, { status: 404 })
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
        .from('sell_requests')
        .select('*')
        .or(`dealer_id.eq.${dealer.id},dealer_id.is.null`)
        .order('created_at', { ascending: false })
        .limit(100)

    if (error) {
        logger.error('Sell request fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch sell requests' }, { status: 500 })
    }

    return NextResponse.json({ requests: data ?? [] })
}

export async function POST(request: NextRequest) {
    const limited = await rateLimitOrNull("sell_request_create", request, 5, 60000); if (limited) return limited;
    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

    const parsed = sellRequestSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: formatZodErrors(parsed.error) }, { status: 400 })
    }

    const input = parsed.data
    const supabase = getSupabase()
    const fallbackAdminEmail = getOptionalEnv('NEXT_PUBLIC_ADMIN_EMAILS')
        ?.split(',')
        .map(email => email.trim())
        .find(Boolean)
    let notificationEmail = input.dealer_id ? undefined : fallbackAdminEmail

    if (input.dealer_id) {
        const { data: dealer, error: dealerError } = await supabase
            .from('dealers')
            .select('id, email')
            .eq('id', input.dealer_id)
            .maybeSingle()

        if (dealerError || !dealer) {
            return NextResponse.json({ error: 'Invalid dealer' }, { status: 400 })
        }
        notificationEmail = dealer.email || undefined
    }

    const { data, error } = await supabase
        .from('sell_requests')
        .insert({
            ...input,
            seller_email: input.seller_email || null,
            model: input.model || null,
            variant: input.variant || null,
            transmission: input.transmission || null,
            registration_number: input.registration_number || null,
            owner_count: input.owner_count || null,
            city: input.city || null,
            address: input.address || null,
            preferred_date: input.preferred_date || null,
            preferred_slot: input.preferred_slot || null,
            photo_urls: input.photo_urls?.filter(Boolean) ?? [],
            notes: input.notes || null,
        })
        .select('id')
        .single()

    if (error) {
        logger.error('Sell request insert error:', error)
        return NextResponse.json({ error: 'Failed to submit sell request' }, { status: 500 })
    }

    const vehicleName = [input.year, input.make, input.model, input.variant].filter(Boolean).join(' ')

    if (input.seller_email) {
        sendSellRequestConfirmationEmail({
            to: input.seller_email,
            sellerName: input.seller_name,
            vehicleName,
        }).catch(() => { /* already logged inside */ })
    }

    if (notificationEmail) {
        sendSellRequestNotificationEmail({
            to: notificationEmail,
            sellerName: input.seller_name,
            sellerPhone: input.seller_phone,
            sellerEmail: input.seller_email || undefined,
            vehicleName,
            city: input.city || undefined,
            replyTo: input.seller_email || undefined,
        }).catch(() => { /* already logged inside */ })
    }

    return NextResponse.json({ success: true, requestId: data.id })
}

export async function PATCH(request: NextRequest) {
    const { user, supabase: routeSupabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const dealer = await getDealerForUser(routeSupabase, user.id)
    if (!dealer) {
        return NextResponse.json({ error: 'Dealer account not found' }, { status: 404 })
    }

    const body = await request.json().catch(() => null)
    if (!body?.id || !body?.status) {
        return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
    }
    if (!SELL_REQUEST_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const nextStatus = body.status as SellRequestStatus
    const adminNotes = typeof body.admin_notes === 'string' ? body.admin_notes.slice(0, 1000) : null
    const supabase = getSupabase()
    const { data: sellRequest, error: readError } = await supabase
        .from('sell_requests')
        .select('*')
        .eq('id', body.id)
        .or(`dealer_id.eq.${dealer.id},dealer_id.is.null`)
        .maybeSingle()

    if (readError) {
        logger.error('Sell request fetch before update error:', readError)
        return NextResponse.json({ error: 'Failed to update sell request' }, { status: 500 })
    }
    if (!sellRequest) {
        return NextResponse.json({ error: 'Sell request not found' }, { status: 404 })
    }

    let vehicleId = (sellRequest as SellRequestRow).approved_vehicle_id
    const finalStatus: SellRequestStatus = nextStatus === 'approved' || nextStatus === 'listed'
        ? 'listed'
        : nextStatus

    if (finalStatus === 'listed') {
        try {
            vehicleId = await listSellRequestVehicle(supabase, sellRequest as SellRequestRow, dealer.id)
        } catch (error) {
            logger.error('Sell request vehicle listing error:', error)
            return NextResponse.json({ error: 'Failed to create inventory listing' }, { status: 500 })
        }
    }

    const { data: updatedRequest, error } = await supabase
        .from('sell_requests')
        .update({
            status: finalStatus,
            admin_notes: adminNotes,
            approved_vehicle_id: vehicleId,
        })
        .eq('id', body.id)
        .or(`dealer_id.eq.${dealer.id},dealer_id.is.null`)
        .select('*')
        .single()

    if (error) {
        logger.error('Sell request update error:', error)
        return NextResponse.json({ error: 'Failed to update sell request' }, { status: 500 })
    }

    return NextResponse.json({ success: true, request: updatedRequest, vehicleId })
}

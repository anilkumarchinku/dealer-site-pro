import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient, requireAuth, getDealerForUser } from '@/lib/supabase-server'
import { formatZodErrors, sellRequestSchema } from '@/lib/validations/schemas'
import { logger } from '@/lib/utils/logger'
import { getOptionalEnv } from '@/lib/env'
import { sendSellRequestConfirmationEmail, sendSellRequestNotificationEmail } from '@/lib/services/email-service'

const SELL_REQUEST_STATUSES = ['new', 'reviewing', 'contacted', 'approved', 'rejected', 'listed'] as const
type SellRequestStatus = typeof SELL_REQUEST_STATUSES[number]
type InsuranceStatus = 'unknown' | 'active' | 'expired' | 'expiring_soon'

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
    vin: string | null
    mileage_km: number
    owner_count: string | null
    expected_price_paise: number | null
    color: string | null
    body_type: string | null
    features: string[] | null
    city: string | null
    address: string | null
    preferred_date: string | null
    preferred_slot: string | null
    estimated_low_paise: number | null
    estimated_high_paise: number | null
    photo_urls: string[] | null
    insurance_status: InsuranceStatus | null
    insurance_provider: string | null
    insurance_valid_until: string | null
    insurance_quote_url: string | null
    video_url: string | null
    accident_history: 'unknown' | 'none' | 'minor' | 'major' | null
    flood_damage: boolean | null
    service_history_available: boolean | null
    rc_available: boolean | null
    loan_active: boolean | null
    notes: string | null
    status: SellRequestStatus
    admin_notes: string | null
    approved_vehicle_id: string | null
}

type DbClient = Awaited<ReturnType<typeof createRouteClient>>

function db(supabase: DbClient) {
    // sell_requests was added after generated DB types in some local checkouts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return supabase as any
}

function cleanText(value: string | null | undefined) {
    const text = value?.trim()
    return text || null
}

function cleanArray(values: string[] | null | undefined) {
    return Array.from(new Set((values ?? [])
        .map(value => value.trim())
        .filter(Boolean)))
}

function yesNo(value: boolean | null | undefined) {
    if (typeof value !== 'boolean') return null
    return value ? 'Yes' : 'No'
}

function buildVehicleDescription(request: SellRequestRow) {
    const condition = [
        request.accident_history ? `Accident history: ${request.accident_history}` : null,
        typeof request.flood_damage === 'boolean' ? `Flood damage: ${yesNo(request.flood_damage)}` : null,
        typeof request.service_history_available === 'boolean' ? `Service history available: ${yesNo(request.service_history_available)}` : null,
        typeof request.rc_available === 'boolean' ? `RC available: ${yesNo(request.rc_available)}` : null,
        typeof request.loan_active === 'boolean' ? `Active loan: ${yesNo(request.loan_active)}` : null,
        request.insurance_status && request.insurance_status !== 'unknown' ? `Insurance: ${request.insurance_status}` : null,
        request.insurance_valid_until ? `Insurance valid until: ${request.insurance_valid_until}` : null,
    ].filter(Boolean)

    return [
        'Seller-submitted vehicle approved by the dealership.',
        request.notes ? `Seller notes: ${request.notes}` : null,
        condition.length > 0 ? `Seller condition declaration:\n${condition.join('\n')}` : null,
        request.city ? `Location: ${request.city}` : null,
        request.address ? `Inspection address: ${request.address}` : null,
    ].filter(Boolean).join('\n\n')
}

function buildVehicleFeatures(request: SellRequestRow) {
    const sellerFeatures = cleanArray(request.features)
    const reviewFeatures = [
        request.owner_count ? `${request.owner_count} owner` : null,
        request.city ? `Location: ${request.city}` : null,
        request.preferred_date ? `Inspection requested: ${request.preferred_date}` : null,
        request.accident_history ? `Accident history: ${request.accident_history}` : null,
        typeof request.service_history_available === 'boolean' ? `Service history: ${yesNo(request.service_history_available)}` : null,
        typeof request.rc_available === 'boolean' ? `RC available: ${yesNo(request.rc_available)}` : null,
        typeof request.loan_active === 'boolean' ? `Active loan: ${yesNo(request.loan_active)}` : null,
    ].filter((item): item is string => Boolean(item))

    return Array.from(new Set([...sellerFeatures, ...reviewFeatures])).slice(0, 30)
}

function fallbackPricePaise(request: SellRequestRow) {
    return request.estimated_high_paise
        ?? request.estimated_low_paise
        ?? request.expected_price_paise
        ?? 0
}

function parseListingPricePaise(value: unknown) {
    if (value === undefined || value === null || value === '') {
        return { value: undefined as number | undefined, error: null as string | null }
    }

    const parsed = typeof value === 'number' ? value : Number(value)
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 500_000_000) {
        return { value: undefined, error: 'Invalid listing price' }
    }

    return { value: Math.round(parsed), error: null }
}

async function listSellRequestVehicle(
    supabase: DbClient,
    request: SellRequestRow,
    dealerId: string,
    listingPricePaise?: number,
) {
    if (request.approved_vehicle_id) {
        return request.approved_vehicle_id
    }

    const imageUrls = cleanArray(request.photo_urls).slice(0, 10)
    const pricePaise = listingPricePaise && listingPricePaise > 0
        ? listingPricePaise
        : fallbackPricePaise(request)

    const { data, error } = await db(supabase)
        .from('vehicles')
        .insert({
            dealer_id: request.dealer_id ?? dealerId,
            vin: cleanText(request.vin),
            registration_number: cleanText(request.registration_number)?.toUpperCase(),
            make: request.make,
            model: cleanText(request.model) ?? 'Model pending',
            variant: cleanText(request.variant),
            year: request.year,
            price_paise: pricePaise,
            mileage_km: request.mileage_km,
            color: cleanText(request.color),
            body_type: cleanText(request.body_type),
            fuel_type: cleanText(request.fuel_type),
            transmission: cleanText(request.transmission),
            features: buildVehicleFeatures(request),
            description: buildVehicleDescription(request),
            image_url: imageUrls[0] ?? null,
            image_urls: imageUrls,
            insurance_status: request.insurance_status ?? 'unknown',
            insurance_provider: cleanText(request.insurance_provider),
            insurance_valid_until: request.insurance_valid_until,
            insurance_quote_url: cleanText(request.insurance_quote_url),
            video_url: cleanText(request.video_url),
            insurance_last_checked_at: request.insurance_valid_until ? new Date().toISOString() : null,
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

    const { data, error } = await db(routeSupabase)
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
    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

    const parsed = sellRequestSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: formatZodErrors(parsed.error) }, { status: 400 })
    }

    const input = parsed.data
    const supabase = await createRouteClient()
    const requestId = randomUUID()
    const fallbackAdminEmail = getOptionalEnv('NEXT_PUBLIC_ADMIN_EMAILS')
        ?.split(',')
        .map(email => email.trim())
        .find(Boolean)

    const { error } = await db(supabase)
        .from('sell_requests')
        .insert({
            id: requestId,
            dealer_id: input.dealer_id ?? null,
            seller_name: input.seller_name,
            seller_phone: input.seller_phone,
            seller_email: input.seller_email || null,
            make: input.make,
            model: input.model || null,
            variant: input.variant || null,
            year: input.year,
            fuel_type: input.fuel_type,
            transmission: input.transmission || null,
            registration_number: input.registration_number || null,
            vin: input.vin || null,
            mileage_km: input.mileage_km,
            owner_count: input.owner_count || null,
            expected_price_paise: input.expected_price_paise ?? null,
            color: input.color || null,
            body_type: input.body_type || null,
            features: cleanArray(input.features),
            city: input.city || null,
            address: input.address || null,
            preferred_date: input.preferred_date || null,
            preferred_slot: input.preferred_slot || null,
            estimated_low_paise: input.estimated_low_paise ?? null,
            estimated_high_paise: input.estimated_high_paise ?? null,
            photo_urls: cleanArray(input.photo_urls),
            insurance_status: input.insurance_status ?? 'unknown',
            insurance_provider: input.insurance_provider || null,
            insurance_valid_until: input.insurance_valid_until || null,
            insurance_quote_url: input.insurance_quote_url || null,
            video_url: input.video_url || null,
            accident_history: input.accident_history || null,
            flood_damage: input.flood_damage ?? null,
            service_history_available: input.service_history_available ?? null,
            rc_available: input.rc_available ?? null,
            loan_active: input.loan_active ?? null,
            notes: input.notes || null,
        })

    if (error) {
        logger.error('Sell request insert error:', error)
        const status = error.code === '23503' ? 400 : 500
        const message = error.code === '23503'
            ? 'Invalid dealer'
            : 'Failed to submit sell request'
        return NextResponse.json({ error: message }, { status })
    }

    const vehicleName = [input.year, input.make, input.model, input.variant].filter(Boolean).join(' ')

    if (input.seller_email) {
        sendSellRequestConfirmationEmail({
            to: input.seller_email,
            sellerName: input.seller_name,
            vehicleName,
        }).catch(() => { /* already logged inside */ })
    }

    if (fallbackAdminEmail) {
        sendSellRequestNotificationEmail({
            to: fallbackAdminEmail,
            sellerName: input.seller_name,
            sellerPhone: input.seller_phone,
            sellerEmail: input.seller_email || undefined,
            vehicleName,
            city: input.city || undefined,
            replyTo: input.seller_email || undefined,
        }).catch(() => { /* already logged inside */ })
    }

    return NextResponse.json({ success: true, requestId })
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

    const { value: listingPricePaise, error: listingPriceError } = parseListingPricePaise(body.listing_price_paise)
    if (listingPriceError) {
        return NextResponse.json({ error: listingPriceError }, { status: 400 })
    }

    const nextStatus = body.status as SellRequestStatus
    const adminNotes = typeof body.admin_notes === 'string' ? body.admin_notes.slice(0, 1000) : null
    const { data: sellRequest, error: readError } = await db(routeSupabase)
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
            vehicleId = await listSellRequestVehicle(
                routeSupabase,
                sellRequest as SellRequestRow,
                dealer.id,
                listingPricePaise,
            )
        } catch (error) {
            logger.error('Sell request vehicle listing error:', error)
            return NextResponse.json({ error: 'Failed to create inventory listing' }, { status: 500 })
        }
    }

    const { data: updatedRequest, error } = await db(routeSupabase)
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

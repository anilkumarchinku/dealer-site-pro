import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, requireAuth, getDealerForUser } from '@/lib/supabase-server'
import { formatZodErrors, sellRequestSchema } from '@/lib/validations/schemas'
import { logger } from '@/lib/utils/logger'
import { getOptionalEnv } from '@/lib/env'
import { sendSellRequestConfirmationEmail, sendSellRequestNotificationEmail } from '@/lib/services/email-service'

const SELL_REQUEST_STATUSES = ['new', 'reviewing', 'contacted', 'approved', 'rejected', 'listed'] as const

function getSupabase() {
    // sell_requests is added by this feature's migration; generated DB types may lag locally.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createAdminClient() as any
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
    let notificationEmail = fallbackAdminEmail

    if (input.dealer_id) {
        const { data: dealer, error: dealerError } = await supabase
            .from('dealers')
            .select('id, email')
            .eq('id', input.dealer_id)
            .maybeSingle()

        if (dealerError || !dealer) {
            return NextResponse.json({ error: 'Invalid dealer' }, { status: 400 })
        }
        notificationEmail = dealer.email || notificationEmail
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

    const supabase = getSupabase()
    const { error } = await supabase
        .from('sell_requests')
        .update({
            status: body.status,
            admin_notes: typeof body.admin_notes === 'string' ? body.admin_notes.slice(0, 1000) : null,
        })
        .eq('id', body.id)
        .or(`dealer_id.eq.${dealer.id},dealer_id.is.null`)

    if (error) {
        logger.error('Sell request update error:', error)
        return NextResponse.json({ error: 'Failed to update sell request' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

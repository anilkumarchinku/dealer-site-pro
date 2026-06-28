import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase-server'
import { rateLimitOrNull, checkRateLimit } from '@/lib/utils/rate-limiter'
import { sendOtp, verifyOtp } from '@/lib/services/otp-service'

// ─────────────────────────────────────────────────────────────────────────────
// SECURITY — OTP-GATED CUSTOMER PANEL
//
// This endpoint returns a customer's leads, test-drives and sell-requests (PII —
// names, phone numbers, emails, vehicle interest, messages). Previously it did so
// given ONLY a PUBLIC dealer slug + an UNVERIFIED phone/email, so anyone who knew
// (or guessed) a contact could enumerate that person's activity.
//
// PII is now gated behind an email OTP challenge that proves the caller owns the
// email the records are tied to:
//   step "send-otp" → emails a 6-digit code (reuses lib/services/otp-service).
//   step "verify"   → verifies the code and, ONLY on success, returns PII matched
//                     on the VERIFIED email (+ optional phone) for that dealer.
//
// We deliberately match PII on the verified EMAIL only (never on an unverified
// phone alone) so a caller cannot supply a victim's phone next to their own
// verified email and exfiltrate the victim's phone-only records.
// ─────────────────────────────────────────────────────────────────────────────

const OTP_PURPOSE = 'customer_panel' as const

const sendOtpSchema = z.object({
    step: z.literal('send-otp'),
    slug: z.string().min(1),
    email: z.string().trim().email('A valid email is required to verify your identity').max(254),
})

const verifySchema = z.object({
    step: z.literal('verify'),
    slug: z.string().min(1),
    email: z.string().trim().email('A valid email is required to verify your identity').max(254),
    code: z.string().trim().regex(/^\d{6}$/, 'Enter the 6-digit code from your email'),
    // Optional extra phone the verified user wants matched against their records.
    phone: z.string().optional(),
})

const requestSchema = z.discriminatedUnion('step', [sendOtpSchema, verifySchema])

function normalizePhone(value?: string) {
    const digits = value?.replace(/\D/g, '') ?? ''
    return digits.length > 10 ? digits.slice(-10) : digits
}

function identifierKey(value: string) {
    return createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

function contactOrFilter(email: string, phone?: string, emailColumn = 'customer_email', phoneColumn = 'customer_phone') {
    const clauses: string[] = []
    // PII is keyed to the VERIFIED email. The phone is only an additional match
    // for records the same verified user also owns.
    clauses.push(`${emailColumn}.ilike.${email.trim().toLowerCase()}`)
    const digits = normalizePhone(phone)
    if (digits.length === 10) clauses.push(`${phoneColumn}.ilike.%${digits}%`)
    return clauses.join(',')
}

async function loadDealer(slug: string) {
    const admin = createAdminClient() as any
    const select = 'id, slug, dealership_name, location, full_address, phone, whatsapp, email, branches, tagline'
    const { data, error } = await admin
        .from('dealers')
        .select(select)
        .eq('slug', slug)
        .maybeSingle()
    if (!error && data) return data
    // Hybrid dealer used-car sites use a "-used" suffix that isn't in the DB slug
    if (slug.endsWith('-used')) {
        const parentSlug = slug.slice(0, -'-used'.length)
        const { data: parent } = await admin
            .from('dealers')
            .select(select)
            .eq('slug', parentSlug)
            .maybeSingle()
        if (parent) return parent
    }
    return null
}

export async function POST(request: NextRequest) {
    // Per-IP throttle on every call to the endpoint.
    const limited = await rateLimitOrNull('customer_panel', request, 10, 60_000)
    if (limited) return limited

    const body = await request.json().catch(() => null)
    const parsed = requestSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 })
    }

    // ── Step 1: send OTP to the supplied email ───────────────────────────────
    if (parsed.data.step === 'send-otp') {
        const { slug, email } = parsed.data

        // Throttle OTP sends per email so the panel can't be used to spam codes
        // at an address (or to enumerate via timing). 3 sends per 10 minutes.
        const sendLimit = checkRateLimit('customer_panel_send_otp', identifierKey(email), 3, 10 * 60_000)
        if (!sendLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many code requests for this email. Please try again later.' },
                { status: 429, headers: { 'Retry-After': String(Math.ceil(sendLimit.retryAfterMs / 1000)) } }
            )
        }

        const dealer = await loadDealer(slug)
        if (!dealer) {
            return NextResponse.json({ error: 'Dealer not found' }, { status: 404 })
        }

        const result = await sendOtp(email.trim().toLowerCase(), OTP_PURPOSE)
        if (!result.success) {
            return NextResponse.json({ error: result.error || 'Could not send verification code' }, { status: 500 })
        }

        return NextResponse.json({
            step: 'otp-sent',
            message: `We sent a 6-digit verification code to ${email}. It expires in 10 minutes.`,
        })
    }

    // ── Step 2: verify OTP, then return PII scoped to the verified email ──────
    const { slug, email, code, phone } = parsed.data
    const verifiedEmail = email.trim().toLowerCase()

    // Throttle verify attempts per email at the edge too (the OTP service also
    // enforces a per-code attempt lockout). 10 verify calls per 10 minutes.
    const verifyLimit = checkRateLimit('customer_panel_verify', identifierKey(verifiedEmail), 10, 10 * 60_000)
    if (!verifyLimit.allowed) {
        return NextResponse.json(
            { error: 'Too many attempts for this email. Please try again later.' },
            { status: 429, headers: { 'Retry-After': String(Math.ceil(verifyLimit.retryAfterMs / 1000)) } }
        )
    }

    const verification = await verifyOtp(verifiedEmail, code, OTP_PURPOSE)
    if (!verification.success) {
        return NextResponse.json({ error: verification.error || 'Invalid or expired code' }, { status: 401 })
    }

    const dealer = await loadDealer(slug)
    if (!dealer) {
        return NextResponse.json({ error: 'Dealer not found' }, { status: 404 })
    }

    const admin = createAdminClient() as any
    const today = new Date().toISOString().slice(0, 10)
    const customerFilter = contactOrFilter(verifiedEmail, phone)
    const sellerFilter = contactOrFilter(verifiedEmail, phone, 'seller_email', 'seller_phone')

    const serviceFilter = contactOrFilter(verifiedEmail, phone, 'email', 'phone')

    const [leadsResult, testDrivesResult, sellRequestsResult, serviceBookingsResult, vehiclesResult, offersResult] = await Promise.all([
        admin
            .from('leads')
            .select('id, customer_name, customer_phone, customer_email, lead_type, status, vehicle_interest, message, created_at')
            .eq('dealer_id', dealer.id)
            .or(customerFilter)
            .order('created_at', { ascending: false })
            .limit(20),
        admin
            .from('test_drive_bookings')
            .select('id, customer_name, customer_phone, customer_email, vehicle_interest, preferred_date, preferred_time, status, created_at')
            .eq('dealer_id', dealer.id)
            .or(customerFilter)
            .order('preferred_date', { ascending: false })
            .limit(20),
        admin
            .from('sell_requests')
            .select('id, seller_name, seller_phone, seller_email, make, model, variant, year, expected_price_paise, status, preferred_date, created_at')
            .or(`dealer_id.eq.${dealer.id},dealer_id.is.null`)
            .or(sellerFilter)
            .order('created_at', { ascending: false })
            .limit(20),
        admin
            .from('car_service_bookings')
            .select('id, customer_name, phone, email, vehicle_reg_no, vehicle_make, vehicle_model, service_type, preferred_date, preferred_slot, status, created_at')
            .eq('dealer_id', dealer.id)
            .or(serviceFilter)
            .order('created_at', { ascending: false })
            .limit(20),
        admin
            .from('vehicles')
            .select('id, make, model, variant, year, price_paise, fuel_type, transmission, mileage_km, status, created_at')
            .eq('dealer_id', dealer.id)
            .eq('status', 'available')
            .order('created_at', { ascending: false })
            .limit(8),
        admin
            .from('dealer_offers')
            .select('id, title, description, tag, valid_until, created_at')
            .eq('dealer_id', dealer.id)
            .eq('is_active', true)
            .or(`valid_until.is.null,valid_until.gte.${today}`)
            .order('created_at', { ascending: false })
            .limit(8),
    ])

    if (leadsResult.error || testDrivesResult.error || sellRequestsResult.error || serviceBookingsResult.error) {
        return NextResponse.json({ error: 'Failed to load customer activity' }, { status: 500 })
    }

    return NextResponse.json({
        step: 'verified',
        dealer,
        history: {
            inquiries: leadsResult.data ?? [],
            test_drives: testDrivesResult.data ?? [],
            sell_requests: sellRequestsResult.data ?? [],
            service_bookings: serviceBookingsResult.data ?? [],
        },
        new_arrivals: vehiclesResult.data ?? [],
        offers: offersResult.data ?? [],
    })
}

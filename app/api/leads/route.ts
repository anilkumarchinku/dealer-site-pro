/**
 * POST /api/leads
 * Anonymous — visitors from dealer sites submit enquiries.
 *
 * Body: {
 *   dealer_id: string  (required — validated against DB)
 *   name: string       (required)
 *   phone: string      (required)
 *   email?: string
 *   message?: string
 *   car_id?: string    (vehicle they're enquiring about)
 *   car_name?: string  (human-readable car name for display)
 *   lead_source?: string  e.g. 'contact_form' | 'car_enquiry' | 'test_drive'
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ── Simple in-memory rate limiter (3 leads per IP per hour) ──────────────────
const ipHitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT   = 3
const WINDOW_MS    = 60 * 60 * 1000 // 1 hour

function checkRateLimit(ip: string): boolean {
    const now  = Date.now()
    const entry = ipHitMap.get(ip)

    if (!entry || now > entry.resetAt) {
        ipHitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
        return true // allowed
    }

    if (entry.count >= RATE_LIMIT) return false // blocked

    entry.count++
    return true // allowed
}

// ── Supabase client with anon key (public API — no user session available) ───
function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

// Allowed lead_source values
const VALID_SOURCES = new Set(['contact_form', 'car_enquiry', 'test_drive', 'whatsapp', 'phone'])

export async function POST(request: NextRequest) {
    try {
        // ── Rate limiting ─────────────────────────────────────────────────────
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
                ?? request.headers.get('x-real-ip')
                ?? 'unknown'

        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: 'Too many enquiries submitted. Please try again later.' },
                { status: 429 }
            )
        }

        const body = await request.json()
        const { dealer_id, name, phone, email, message, car_id, car_name, lead_source } = body

        // ── Validate required fields ──────────────────────────────────────────
        if (!dealer_id || !name || !phone) {
            return NextResponse.json(
                { error: 'dealer_id, name and phone are required' },
                { status: 400 }
            )
        }

        // Basic type / length validation
        if (typeof dealer_id !== 'string' || typeof name !== 'string' || typeof phone !== 'string') {
            return NextResponse.json({ error: 'Invalid field types' }, { status: 400 })
        }
        if (name.length > 100 || phone.length > 20) {
            return NextResponse.json({ error: 'Invalid field length' }, { status: 400 })
        }
        if (email && (typeof email !== 'string' || email.length > 254)) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
        }
        if (message && (typeof message !== 'string' || message.length > 1000)) {
            return NextResponse.json({ error: 'Message too long' }, { status: 400 })
        }

        // Sanitise lead_source — never trust client values verbatim
        const safeSource = lead_source && VALID_SOURCES.has(lead_source) ? lead_source : 'contact_form'

        const supabase = getSupabase()

        // ── Verify dealer_id exists and is active (prevent phantom leads) ─────
        const { data: dealer, error: dealerErr } = await supabase
            .from('dealers')
            .select('id')
            .eq('id', dealer_id)
            .single()

        if (dealerErr || !dealer) {
            return NextResponse.json(
                { error: 'Invalid dealer' },
                { status: 400 }
            )
        }

        // ── Insert lead ───────────────────────────────────────────────────────
        const { data, error } = await supabase
            .from('leads')
            .insert({
                dealer_id,
                customer_name:  name.trim(),
                customer_phone: phone.trim(),
                customer_email: email?.trim()   ?? null,
                message:        message?.trim() ?? null,
                vehicle_id:     car_id          ?? null,
                lead_source:    safeSource,
                status:         'new',
            })
            .select('id')
            .single()

        if (error) {
            console.error('Lead insert error:', error)
            return NextResponse.json({ error: 'Failed to save enquiry' }, { status: 500 })
        }

        return NextResponse.json({ success: true, leadId: data.id })
    } catch (err) {
        console.error('Lead API error:', err)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}

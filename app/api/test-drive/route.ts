/**
 * POST /api/test-drive
 * Saves a test-drive booking as:
 * 1. a lead row in `leads`
 * 2. a structured booking row in `test_drive_bookings`
 * linked together via `lead_id`.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { testDriveSchema, formatZodErrors } from '@/lib/validations/schemas';
import { logger } from '@/lib/utils/logger';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

async function resolveVehicleId(
    supabase: ReturnType<typeof getSupabase>,
    rawCarId?: string | null
) {
    const trimmedCarId = rawCarId?.trim();
    if (!trimmedCarId || !UUID_PATTERN.test(trimmedCarId)) {
        return null;
    }

    const { data, error } = await supabase
        .from('vehicles')
        .select('id')
        .eq('id', trimmedCarId)
        .maybeSingle();

    if (error) {
        console.error('[test-drive] vehicle lookup error:', error);
        return null;
    }

    const vehicleRow = data as { id: string } | null;
    return vehicleRow?.id ?? null;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // ── Validate with Zod ───────────────────────────────────────────────
        const parsed = testDriveSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: formatZodErrors(parsed.error) },
                { status: 400 }
            );
        }
        const {
            dealer_id, car_id, car_name, preferred_date, preferred_time,
            name, phone, email, vehicle_type,
        } = parsed.data;

        // Format a human-readable message for the lead record
        const message = `${vehicle_type === '2w' ? 'Test Ride' : vehicle_type === '3w' ? 'Trial Run' : 'Test Drive'} request for ${car_name ?? 'vehicle'}.\nPreferred: ${preferred_date} at ${preferred_time}.`;
        const referer = req.headers.get('referer') || 'Direct/Unknown';

        const supabase = getSupabase();
        const { data: dealerRow, error: dealerError } = await supabase
            .from('dealers')
            .select('id')
            .eq('id', dealer_id)
            .maybeSingle();

        if (dealerError) {
            throw dealerError;
        }

        if (!dealerRow?.id) {
            return NextResponse.json(
                { error: 'Invalid dealer selected for test drive booking.' },
                { status: 400 }
            );
        }

        const vehicleId = await resolveVehicleId(supabase, car_id);
        const { data: lead, error: leadError } = await supabase
            .from('leads')
            .insert({
                dealer_id,
                customer_name: name.trim(),
                customer_phone: phone.trim(),
                customer_email: email?.trim() || null,
                message,
                vehicle_id: vehicleId,
                vehicle_interest: car_name?.trim() || null,
                lead_type: 'test_drive',
                source: 'website',
                utm_source: referer,
                status: 'new',
            })
            .select('id')
            .single();

        if (leadError) {
            throw leadError;
        }

        const { data: booking, error: bookingError } = await supabase
            .from('test_drive_bookings')
            .insert({
                dealer_id,
                lead_id: lead.id,
                vehicle_id: vehicleId,
                customer_name: name.trim(),
                customer_phone: phone.trim(),
                customer_email: email?.trim() || null,
                vehicle_interest: car_name?.trim() || null,
                preferred_date,
                preferred_time,
                status: 'pending',
                notes: message,
                source: 'website',
                utm_source: referer,
            })
            .select('id')
            .single();

        if (bookingError) {
            logger.error('[test-drive] booking insert failed after lead insert:', bookingError);

            const { error: rollbackError } = await supabase
                .from('leads')
                .delete()
                .eq('id', lead.id);

            if (rollbackError) {
                logger.error('[test-drive] rollback failed for lead:', rollbackError);
            }

            throw bookingError;
        }

        return NextResponse.json(
            { success: true, leadId: lead.id, bookingId: booking.id },
            { status: 201 }
        );
    } catch (err) {
        logger.error('[test-drive] booking error:', err);
        return NextResponse.json(
            { error: 'Failed to book test drive. Please try again.' },
            { status: 500 }
        );
    }
}

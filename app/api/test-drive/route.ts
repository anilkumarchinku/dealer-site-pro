/**
 * POST /api/test-drive
 * Saves a test-drive booking as a lead with lead_source = 'test_drive'
 * and stores structured date/time in the message field.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { testDriveSchema, formatZodErrors } from '@/lib/validations/schemas';

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

        const supabase = getSupabase();
        const vehicleId = await resolveVehicleId(supabase, car_id);
        const { error } = await supabase
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
                utm_source: req.headers.get('referer') || 'Direct/Unknown',
                status: 'new',
            });

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (err) {
        console.error('[test-drive] booking error:', err);
        return NextResponse.json(
            { error: 'Failed to book test drive. Please try again.' },
            { status: 500 }
        );
    }
}

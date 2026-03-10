/**
 * POST /api/test-drive
 * Saves a test-drive booking as a lead with lead_source = 'test_drive'
 * and stores structured date/time in the message field.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            dealer_id,
            car_id,
            car_name,
            preferred_date,
            preferred_time,
            name,
            phone,
            email,
            vehicle_type,
        } = body;

        // Basic validation
        if (!dealer_id || !name || !phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        if (!preferred_date || !preferred_time) {
            return NextResponse.json({ error: 'Please select a date and time' }, { status: 400 });
        }

        // Format a human-readable message for the lead record
        const message = `${vehicle_type === '2w' ? 'Test Ride' : vehicle_type === '3w' ? 'Trial Run' : 'Test Drive'} request for ${car_name ?? 'vehicle'}.\nPreferred: ${preferred_date} at ${preferred_time}.`;

        const supabase = getSupabase();
        const { error } = await supabase
            .from('leads')
            .insert({
                dealer_id,
                name: name.trim(),
                phone: phone.trim(),
                email: email?.trim() || null,
                message,
                car_id: car_id ?? null,
                car_name: car_name ?? null,
                lead_source: 'test_drive',
                preferred_date,
                preferred_time,
                status: 'new',
            });

        if (error) {
            // If preferred_date / preferred_time columns don't exist yet, fallback gracefully
            if (error.code === '42703') {
                // Column doesn't exist — insert without those fields
                const { error: fallbackError } = await supabase
                    .from('leads')
                    .insert({
                        dealer_id,
                        name: name.trim(),
                        phone: phone.trim(),
                        email: email?.trim() || null,
                        message,
                        car_id: car_id ?? null,
                        car_name: car_name ?? null,
                        lead_source: 'test_drive',
                        status: 'new',
                    });
                if (fallbackError) throw fallbackError;
            } else {
                throw error;
            }
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (err) {
        console.error('[test-drive] booking error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal error' },
            { status: 500 }
        );
    }
}

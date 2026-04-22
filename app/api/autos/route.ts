/**
 * Autos API Route
 * GET /api/autos - List three-wheelers from thw_catalog with filtering, sorting, and pagination
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key || url.includes('placeholder')) return null;
    return createClient(url, key);
}

export async function GET(request: NextRequest) {
    try {
        const supabase = getSupabase();
        if (!supabase) {
            return NextResponse.json(
                { success: false, error: 'Database not configured' },
                { status: 503 }
            );
        }

        const { searchParams } = new URL(request.url);

        // Parse query params
        const make = searchParams.get('make');
        const type = searchParams.get('type'); // passenger, cargo, electric
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const pageSize = Math.min(60, Math.max(1, parseInt(searchParams.get('pageSize') || '12')));
        const sortBy = searchParams.get('sortBy') || 'popular';

        // Build query
        let query = supabase
            .from('thw_catalog')
            .select('*', { count: 'exact' })
            .eq('is_active', true);

        // Brand filter
        if (make) {
            query = query.ilike('make', make);
        }

        // Type filter: passenger, cargo, or electric
        if (type === 'electric') {
            query = query.ilike('fuel_type', 'electric');
        } else if (type === 'passenger') {
            query = query.not('fuel_type', 'ilike', 'electric');
            query = query.gt('passenger_capacity', 0);
        } else if (type === 'cargo') {
            query = query.not('fuel_type', 'ilike', 'electric');
            query = query.gt('payload_kg', 0);
        }

        // Sorting
        switch (sortBy) {
            case 'price_low':
                query = query.order('price_min_paise', { ascending: true });
                break;
            case 'price_high':
                query = query.order('price_min_paise', { ascending: false });
                break;
            case 'newest':
                query = query.order('created_at', { ascending: false });
                break;
            case 'popular':
            default:
                query = query
                    .order('popularity_score', { ascending: false })
                    .order('model', { ascending: true });
                break;
        }

        // Pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching autos:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to fetch autos' },
                { status: 500 }
            );
        }

        const total = count ?? 0;
        const totalPages = Math.ceil(total / pageSize);

        // Map rows to a simplified vehicle shape for the frontend
        const vehicles = (data ?? []).map((row) => {
            const fuelRaw = (row.fuel_type ?? '').toLowerCase();
            const isElectric = fuelRaw === 'electric';
            const vehicleType: string = isElectric
                ? 'electric'
                : (row.passenger_capacity ?? 0) > 0
                  ? 'passenger'
                  : 'cargo';

            return {
                id: row.id,
                make: row.make,
                model: row.model,
                variant: row.variant ?? null,
                year: row.year ?? new Date().getFullYear(),
                type: vehicleType,
                fuel_type: isElectric ? 'electric' : (fuelRaw || 'petrol'),
                engine_cc: row.engine_cc ?? null,
                mileage_kmpl: row.mileage_kmpl ? parseFloat(row.mileage_kmpl) : null,
                range_km: row.range_km ?? null,
                payload_kg: row.payload_kg ?? null,
                passenger_capacity: row.passenger_capacity ?? null,
                price_min_paise: row.price_min_paise ?? 0,
                image_url: row.image_url ?? null,
                popularity_score: row.popularity_score ?? 0,
                is_featured: (row.popularity_score ?? 0) >= 8,
            };
        });

        return NextResponse.json({
            success: true,
            data: {
                vehicles,
                total,
                page,
                pageSize,
                totalPages,
            },
        });
    } catch (error) {
        console.error('Error in autos API:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

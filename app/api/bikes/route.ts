/**
 * Bikes API Route
 * GET /api/bikes - List two-wheelers from tw_catalog with filtering, sorting, and pagination
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
        const type = searchParams.get('type'); // bike, scooter, electric
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const pageSize = Math.min(60, Math.max(1, parseInt(searchParams.get('pageSize') || '12')));
        const sortBy = searchParams.get('sortBy') || 'popular';
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const q = searchParams.get('q') || searchParams.get('searchQuery');

        // Build query
        let query = supabase
            .from('tw_catalog')
            .select('*', { count: 'exact' })
            .eq('is_active', true);

        // Brand filter
        if (make) {
            query = query.ilike('make', make);
        }

        // Type filter: bike, scooter, or electric
        if (type === 'electric') {
            query = query.ilike('fuel_type', 'electric');
        } else if (type === 'scooter') {
            query = query.ilike('body_type', '%scooter%');
            query = query.not('fuel_type', 'ilike', 'electric');
        } else if (type === 'bike') {
            query = query.not('body_type', 'ilike', '%scooter%');
            query = query.not('fuel_type', 'ilike', 'electric');
        }

        // Price range filter (price_min_paise in the DB)
        if (minPrice) {
            query = query.gte('price_min_paise', parseInt(minPrice));
        }
        if (maxPrice) {
            query = query.lte('price_min_paise', parseInt(maxPrice));
        }

        // Text search
        if (q) {
            query = query.or(`make.ilike.%${q}%,model.ilike.%${q}%`);
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
            console.error('Error fetching bikes:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to fetch bikes' },
                { status: 500 }
            );
        }

        // Note: total reflects grouped count (models, not variants)
        const total = count ?? 0;

        // Group variants by make+model — keep first row per model (highest popularity)
        const modelMap = new Map<string, typeof data[0]>();
        for (const row of (data ?? [])) {
            const key = `${(row.make ?? '').toLowerCase()}__${(row.model ?? '').toLowerCase()}`;
            if (!modelMap.has(key)) {
                modelMap.set(key, row);
            } else {
                // Keep the one with lowest price for display
                const existing = modelMap.get(key)!;
                const existingPrice = existing.price_min_paise ?? 0;
                const rowPrice = row.price_min_paise ?? 0;
                if (rowPrice > 0 && (existingPrice === 0 || rowPrice < existingPrice)) {
                    modelMap.set(key, row);
                }
            }
        }
        const groupedData = Array.from(modelMap.values());

        // Map rows to a simplified vehicle shape for the frontend
        const vehicles = groupedData.map((row) => {
            const fuelRaw = (row.fuel_type ?? '').toLowerCase();
            const isElectric = fuelRaw === 'electric';
            const bodyType = (row.body_type ?? '').toLowerCase();
            const vehicleType: string = isElectric
                ? 'electric'
                : bodyType.includes('scooter')
                  ? 'scooter'
                  : 'bike';

            return {
                id: row.id,
                make: row.make,
                model: row.model,
                variant: row.variant ?? null,
                year: row.year ?? new Date().getFullYear(),
                type: vehicleType,
                fuel_type: isElectric ? 'electric' : 'petrol',
                engine_cc: row.engine_cc ?? null,
                battery_kwh: null as number | null,
                mileage_kmpl: row.mileage_kmpl ? parseFloat(row.mileage_kmpl) : null,
                range_km: row.range_km ?? null,
                top_speed_kmph: row.top_speed_kmph ?? null,
                price_min_paise: row.price_min_paise ?? 0,
                image_url: row.image_url ?? null,
                popularity_score: row.popularity_score ?? 0,
                is_featured: (row.popularity_score ?? 0) >= 8,
            };
        });

        const totalPages = Math.ceil(vehicles.length > 0 ? total / pageSize : 0);

        return NextResponse.json({
            success: true,
            data: {
                vehicles,
                total: vehicles.length,
                page,
                pageSize,
                totalPages,
            },
        });
    } catch (error) {
        console.error('Error in bikes API:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

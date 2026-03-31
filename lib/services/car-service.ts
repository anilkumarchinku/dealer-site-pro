/**
 * Car Service
 * Business logic for car data operations using Supabase
 */

import { supabase } from '@/lib/supabase';
import type { Car, CarFilters, CarSearchResult } from '@/lib/types/car';
import { searchCars, sortCars, calculateEMI } from '@/lib/utils/car-utils';
import { CAR_MODEL_COLORS } from '@/lib/data/car-colors';

// Table name in Supabase
const CAR_TABLE = 'car_catalog';

/**
 * Get all cars with optional filters
 */
export async function getAllCars(filters?: CarFilters): Promise<CarSearchResult> {
    let query = supabase.from(CAR_TABLE).select('*');

    // Apply basic filters directly in SQL where possible
    if (filters?.make) {
        const makes = Array.isArray(filters.make) ? filters.make : [filters.make];
        query = query.in('make', makes);
    }

    if (filters?.bodyType) {
        const types = Array.isArray(filters.bodyType) ? filters.bodyType : [filters.bodyType];
        query = query.in('body_type', types);
    }

    if (filters?.fuelType) {
        const fuels = Array.isArray(filters.fuelType) ? filters.fuelType : [filters.fuelType];
        query = query.in('fuel_type', fuels);
    }

    // Pagination
    const page = Math.floor((filters?.offset || 0) / (filters?.limit || 10)) + 1;
    const pageSize = filters?.limit || 10;

    // We get all data for now to handle complex JSON filtering/sorting in JS if needed, 
    // or we can implement more SQL filters. 
    // For 200 items, fetching all is fine for now, but pagination should ideally be SQL-based.
    // Let's do SQL pagination for performance.

    // If we have complex filters (like price range on JSON), we might need to fetch more or use PostgREST operators on JSON.
    // However, our schema has top-level columns for filtering which is great!

    if (filters?.priceRange) {
        // DB stores prices in paise; filter values from API are in INR — convert
        const minPaise = filters.priceRange.min * 100;
        query = query.gte('price_min_paise', minPaise);
        if (filters.priceRange.max < Infinity) {
            const maxPaise = filters.priceRange.max * 100;
            query = query.lte('price_min_paise', maxPaise);
        }
    }

    // Execute query
    const { data, error } = await query;

    if (error) {
        console.error('Error fetching cars:', error);
        return { cars: [], total: 0, page, pageSize, filters: filters || {} };
    }

    let cars = groupVariantsByModel(data || []).map(mapDbCarToCar);

    // Apply search logic (client-side for now as it searches multiple fields)
    if (filters?.searchQuery) {
        cars = searchCars(cars, filters.searchQuery);
    }

    // Apply remaining filters that weren't handled by SQL (if any)
    // ...

    // Sort results
    if (filters?.sortBy) {
        cars = sortCars(cars, filters.sortBy);
    }

    const total = cars.length;

    // Manual pagination if we fetched more due to client-side filtering
    // (If we fully move to SQL pagination, we'd use .range() in the query)
    const start = filters?.offset || 0;
    const end = start + pageSize;
    const paginatedCars = cars.slice(start, end);

    return {
        cars: paginatedCars,
        total,
        page,
        pageSize,
        filters: filters || {},
    };
}

/**
 * Get single car by ID
 */
export async function getCarById(id: string): Promise<Car | null> {
    const { data, error } = await supabase
        .from(CAR_TABLE)
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return null;

    return mapDbCarToCar(data);
}

/**
 * Get cars by brand/make
 */
export async function getCarsByMake(make: string): Promise<Car[]> {
    const { data, error } = await supabase
        .from(CAR_TABLE)
        .select('*')
        .eq('make', make);

    if (error || !data) return [];
    return groupVariantsByModel(data).map(mapDbCarToCar);
}

/**
 * Get featured cars — ordered by popularity_score DESC (now a real DB column)
 */
export async function getFeaturedCars(limit: number = 6): Promise<Car[]> {
    const { data } = await supabase
        .from(CAR_TABLE)
        .select('*')
        .eq('is_active', true)
        .gte('popularity_score', 8)
        .order('popularity_score', { ascending: false });
    if (!data) return [];
    return groupVariantsByModel(data).slice(0, limit).map(mapDbCarToCar);
}

/**
 * Get latest car launches
 * Uses year + scraped_at as proxy for launch date since launchDate is not in the flat schema.
 */
export async function getLatestCars(limit: number = 8): Promise<Car[]> {
    const { data } = await supabase
        .from(CAR_TABLE)
        .select('*')
        .eq('is_active', true)
        .order('year', { ascending: false });
    if (!data) return [];
    return groupVariantsByModel(data).slice(0, limit).map(mapDbCarToCar);
}

/**
 * Get similar cars based on segment and price
 */
export async function getSimilarCars(carId: string, limit: number = 4): Promise<Car[]> {
    const car = await getCarById(carId);
    if (!car) return [];

    const priceVariance = 200000; // ₹2L variance
    // We can filter by segment in SQL
    const { data } = await supabase
        .from(CAR_TABLE)
        .select('*')
        .eq('segment', car.segment)
        .neq('id', carId);

    if (!data) return [];

    const candidates = groupVariantsByModel(data).map(mapDbCarToCar);

    return candidates
        .filter(c =>
            Math.abs((c.pricing.exShowroom.min ?? 0) - (car.pricing.exShowroom.min ?? 0)) <= priceVariance
        )
        .sort((a, b) => (b.meta.popularityScore || 0) - (a.meta.popularityScore || 0))
        .slice(0, limit);
}

// ... other functions can be similarly adapted or just use getAllCars internals

/**
 * Groups variant rows by (make, model), returning one row per model.
 * Aggregates: price range (min/max), fuel_types array, transmissions array.
 */
function groupVariantsByModel(rows: any[]): any[] {
    const modelMap = new Map<string, any>();
    for (const row of rows) {
        const key = `${row.make}|${row.model}`;
        if (!modelMap.has(key)) {
            modelMap.set(key, {
                ...row,
                fuel_types: row.fuel_type ? [row.fuel_type] : [],
                transmissions: row.transmission ? [row.transmission] : [],
                variant: '',
            });
        } else {
            const existing = modelMap.get(key)!;
            const rowMin = row.price_min_paise ?? 0;
            const rowMax = row.price_max_paise ?? 0;
            if (rowMin > 0 && (existing.price_min_paise === 0 || rowMin < existing.price_min_paise))
                existing.price_min_paise = rowMin;
            if (rowMax > existing.price_max_paise)
                existing.price_max_paise = rowMax;
            if (row.fuel_type && !existing.fuel_types.includes(row.fuel_type))
                existing.fuel_types.push(row.fuel_type);
            if (row.transmission && !existing.transmissions.includes(row.transmission))
                existing.transmissions.push(row.transmission);
        }
    }
    return Array.from(modelMap.values());
}

/**
 * Helper to map DB result to Car interface.
 * Handles the flat car_catalog schema (price_min_paise / price_max_paise).
 */
function mapDbCarToCar(dbCar: any): Car {
    // ── Pricing ──────────────────────────────────────────────────────────────
    // DB stores prices in paise (1 INR = 100 paise)
    const minPaise = dbCar.price_min_paise ?? 0;
    const maxPaise = dbCar.price_max_paise ?? 0;
    const minINR   = minPaise > 0 ? Math.round(minPaise / 100) : null;
    const maxINR   = maxPaise > 0 ? Math.round(maxPaise / 100) : null;

    // Calculate EMI (20% down payment, 9.5% p.a., 60 months)
    const emiMonthly = minINR ? calculateEMI(Math.round(minINR * 0.8)) : undefined;
    const emi = emiMonthly
        ? { monthly: emiMonthly, downPayment: Math.round((minINR ?? 0) * 0.2), tenure: 60 }
        : undefined;

    const pricing = dbCar.pricing ?? {
        exShowroom: { min: minINR, max: maxINR, currency: 'INR' as const },
        emi,
    };
    // Ensure exShowroom always exists to avoid downstream crashes
    if (!pricing.exShowroom) {
        pricing.exShowroom = { min: minINR, max: maxINR, currency: 'INR' as const };
    }
    // Backfill EMI if pricing came from JSONB but has no emi block
    if (!pricing.emi && emi) {
        pricing.emi = emi;
    }

    // ── Fuel Types (array) ────────────────────────────────────────────────────
    // Use fuel_types[] array column (all options the model offers).
    // Falls back to single fuel_type column if array not present.
    const fuelTypesArr: string[] =
        Array.isArray(dbCar.fuel_types) && dbCar.fuel_types.length > 0
            ? dbCar.fuel_types
            : (dbCar.fuel_type ? [dbCar.fuel_type] : ['Petrol']);
    const fuelTypeDisplay = fuelTypesArr.join(' / ');

    // ── Transmissions (array) ────────────────────────────────────────────────
    // Use transmissions[] array column (all options the model offers).
    // Falls back to single transmission column if array not present.
    const transmissionsArr: string[] =
        Array.isArray(dbCar.transmissions) && dbCar.transmissions.length > 0
            ? dbCar.transmissions
            : (dbCar.transmission ? [dbCar.transmission] : []);
    // Abbreviate "Automatic" → "Auto" so multi-option strings stay compact on the card
    const transmissionDisplay = transmissionsArr
        .map(t => t === 'Automatic' ? 'Auto' : t)
        .join(' / ') || null;

    const transmissionObj = dbCar.transmission && typeof dbCar.transmission === 'object'
        ? dbCar.transmission                          // already an object (JSONB schema)
        : { type: transmissionDisplay };

    // ── Engine ────────────────────────────────────────────────────────────────
    // DB has flat columns fuel_type, engine_cc, engine_power, engine_torque.
    const engineObj = dbCar.engine ?? {
        type:         fuelTypeDisplay,
        displacement: dbCar.engine_cc ?? null,
        power:        dbCar.engine_power ?? '—',
        torque:       dbCar.engine_torque ?? '—',
    };

    // ── Performance ───────────────────────────────────────────────────────────
    // fuel_efficiency column does not exist in the current flat schema.
    // Map it if present (future-proof) otherwise null.
    const performanceObj = dbCar.performance ?? {
        fuelEfficiency: dbCar.fuel_efficiency ?? null,
    };

    // ── Dimensions ────────────────────────────────────────────────────────────
    const dimensionsObj = dbCar.dimensions ?? {
        seatingCapacity: dbCar.seating_capacity ?? null,
    };

    return {
        id:       dbCar.id,
        make:     dbCar.make,
        model:    dbCar.model,
        variant:  dbCar.variant ?? '',
        year:     dbCar.year,
        bodyType: dbCar.body_type,
        segment:  dbCar.segment ?? null,
        price:    minINR ? `₹${minINR.toLocaleString('en-IN')}` : (dbCar.price ?? undefined),

        pricing,
        engine:       engineObj,
        transmission: transmissionObj,
        performance:  performanceObj,
        dimensions:   dimensionsObj,
        features:     dbCar.features ?? {
            keyFeatures:     Array.isArray(dbCar.key_features)    ? dbCar.key_features    : [],
            safetyFeatures:  Array.isArray(dbCar.safety_features) ? dbCar.safety_features : [],
        },
        images:       dbCar.images ?? {
            hero:     dbCar.image_url ?? null,
            exterior: dbCar.image_url ? [dbCar.image_url] : [],
            interior: [],
        },
        colors: (() => {
            // Use DB colors if they exist and are non-empty
            if (Array.isArray(dbCar.colors) && dbCar.colors.length > 0) return dbCar.colors;
            // Otherwise enrich from the static model-color lookup table
            const key = `${dbCar.make} ${dbCar.model}`;
            return CAR_MODEL_COLORS[key] ?? [];
        })(),
        meta:      dbCar.meta ?? {
            lastUpdated:    dbCar.scraped_at     ?? undefined,
            isAvailable:    dbCar.is_active      ?? true,
            popularityScore: dbCar.popularity_score ?? undefined,
        },
        rating:      dbCar.rating      ?? undefined,
        variants:    dbCar.variants    ?? undefined,
        competitors: dbCar.competitors ?? undefined,
        ownership:   dbCar.ownership   ?? undefined,
    };
}

export async function getFuelEfficientCars(limit: number = 6): Promise<Car[]> {
    const { data } = await supabase
        .from(CAR_TABLE)
        .select('*')
        .in('fuel_type', ['Electric', 'Hybrid', 'CNG'])
        .eq('is_active', true)
        .order('year', { ascending: false })
    return groupVariantsByModel(data ?? []).slice(0, limit).map(mapDbCarToCar)
}

export async function getTopRatedCars(limit: number = 6): Promise<Car[]> {
    const { data } = await supabase
        .from(CAR_TABLE)
        .select('*')
        .eq('is_active', true)
        .order('year', { ascending: false })
    return groupVariantsByModel(data ?? []).slice(0, limit).map(mapDbCarToCar)
}

/**
 * Get all brands with model count and price range
 */
export async function getAllBrandsWithStats(): Promise<{
    name: string;
    modelCount: number;
    priceMin: number | null;
    priceMax: number | null;
    bodyTypes: string[];
}[]> {
    const { data } = await supabase
        .from(CAR_TABLE)
        .select('make, body_type, price_min_paise, price_max_paise')
        .eq('is_active', true);

    if (!data) return [];

    const brandMap = new Map<string, {
        modelCount: number;
        priceMin: number;
        priceMax: number;
        bodyTypes: Set<string>;
    }>();

    for (const row of data) {
        const existing = brandMap.get(row.make);
        const minP = row.price_min_paise ? Math.round(row.price_min_paise / 100) : 0;
        const maxP = row.price_max_paise ? Math.round(row.price_max_paise / 100) : 0;

        if (existing) {
            existing.modelCount++;
            if (minP > 0 && (existing.priceMin === 0 || minP < existing.priceMin)) existing.priceMin = minP;
            if (maxP > existing.priceMax) existing.priceMax = maxP;
            if (row.body_type) existing.bodyTypes.add(row.body_type);
        } else {
            brandMap.set(row.make, {
                modelCount: 1,
                priceMin: minP,
                priceMax: maxP,
                bodyTypes: new Set(row.body_type ? [row.body_type] : []),
            });
        }
    }

    return Array.from(brandMap.entries())
        .map(([name, stats]) => ({
            name,
            modelCount: stats.modelCount,
            priceMin: stats.priceMin || null,
            priceMax: stats.priceMax || null,
            bodyTypes: Array.from(stats.bodyTypes),
        }))
        .sort((a, b) => b.modelCount - a.modelCount);
}

/**
 * Get cars by make with optional body type filter
 */
export async function getCarsByMakeAndBodyType(make: string, bodyType?: string): Promise<Car[]> {
    let query = supabase
        .from(CAR_TABLE)
        .select('*')
        .eq('make', make)
        .eq('is_active', true);

    if (bodyType && bodyType !== 'All') {
        query = query.eq('body_type', bodyType);
    }

    const { data } = await query.order('popularity_score', { ascending: false });
    if (!data) return [];
    return groupVariantsByModel(data).map(mapDbCarToCar);
}


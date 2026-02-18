/**
 * Car Service
 * Business logic for car data operations using Supabase
 */

import { supabase } from '@/lib/supabase';
import type { Car, CarFilters, CarSearchResult } from '@/lib/types/car';
import { searchCars, sortCars } from '@/lib/utils/car-utils';

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
        query = query.gte('price_min', filters.priceRange.min);
        // max price filter might be tricky if max is Infinity. 
        if (filters.priceRange.max < Infinity) {
            query = query.lte('price_min', filters.priceRange.max);
            // Using price_min for range check is a simplification. 
            // Ideally we check if [min, max] overlaps with [price_min, price_max].
        }
    }

    // Execute query
    const { data, error } = await query;

    if (error) {
        console.error('Error fetching cars:', error);
        return { cars: [], total: 0, page, pageSize, filters: filters || {} };
    }

    let cars = (data || []).map(mapDbCarToCar);

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
    return data.map(mapDbCarToCar);
}

/**
 * Get featured cars
 */
export async function getFeaturedCars(limit: number = 6): Promise<Car[]> {
    // We need to fetch and sort/filter. 
    // Since popularityScore is inside `meta` JSON, we might fetch all or use a specialized query.
    // For 200 items, fetching all is acceptable cacheable overhead.
    const { data } = await supabase.from(CAR_TABLE).select('*');
    if (!data) return [];

    const cars = data.map(mapDbCarToCar);
    return cars
        .filter(car => car.meta.popularityScore && car.meta.popularityScore >= 8)
        .sort((a, b) => (b.meta.popularityScore || 0) - (a.meta.popularityScore || 0))
        .slice(0, limit);
}

/**
 * Get latest car launches
 */
export async function getLatestCars(limit: number = 8): Promise<Car[]> {
    const { data } = await supabase.from(CAR_TABLE).select('*');
    if (!data) return [];

    const cars = data.map(mapDbCarToCar);
    return cars
        .filter(car => car.meta.launchDate)
        .sort((a, b) => {
            const dateA = new Date(a.meta.launchDate!).getTime();
            const dateB = new Date(b.meta.launchDate!).getTime();
            return dateB - dateA;
        })
        .slice(0, limit);
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

    const candidates = data.map(mapDbCarToCar);

    return candidates
        .filter(c =>
            Math.abs((c.pricing.exShowroom.min ?? 0) - (car.pricing.exShowroom.min ?? 0)) <= priceVariance
        )
        .sort((a, b) => (b.meta.popularityScore || 0) - (a.meta.popularityScore || 0))
        .slice(0, limit);
}

// ... other functions can be similarly adapted or just use getAllCars internals

/**
 * Helper to map DB result to Car interface
 */
function mapDbCarToCar(dbCar: any): Car {
    return {
        id: dbCar.id,
        make: dbCar.make,
        model: dbCar.model,
        variant: dbCar.variant,
        year: dbCar.year,
        bodyType: dbCar.body_type,
        segment: dbCar.segment,
        price: dbCar.price, // display string

        // Reconstruct complex objects from JSONB columns
        pricing: dbCar.pricing || {},
        engine: dbCar.engine || { type: dbCar.fuel_type },
        transmission: dbCar.transmission || { type: dbCar.transmission_type },
        performance: dbCar.performance || { fuelEfficiency: dbCar.fuel_efficiency },
        dimensions: dbCar.dimensions || { seatingCapacity: dbCar.seating_capacity },
        features: dbCar.features || { keyFeatures: [] },
        images: dbCar.images || {},
        colors: dbCar.colors || [],
        meta: dbCar.meta || {},

        // Optional fields
        rating: dbCar.rating,
        variants: dbCar.variants,
        competitors: dbCar.competitors,
        ownership: dbCar.ownership,
    };
}


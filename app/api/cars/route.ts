/**
 * Cars API Route
 * GET /api/cars - List all cars with filtering, sorting, and pagination
 */

import { NextRequest, NextResponse } from 'next/server';
import type { CarFilters } from '@/lib/types/car';
import { getAllCars } from '@/lib/services/car-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Parse filters from query params
        const filters: CarFilters = {};

        // Make filter
        const make = searchParams.get('make');
        if (make) {
            filters.make = make.split(',');
        }

        // Body type filter
        const bodyType = searchParams.get('bodyType');
        if (bodyType) {
            filters.bodyType = bodyType.split(',') as any;
        }

        // Fuel type filter
        const fuelType = searchParams.get('fuelType');
        if (fuelType) {
            filters.fuelType = fuelType.split(',') as any;
        }

        // Transmission filter
        const transmission = searchParams.get('transmission');
        if (transmission) {
            filters.transmission = transmission.split(',') as any;
        }

        // Segment filter
        const segment = searchParams.get('segment');
        if (segment) {
            filters.segment = segment.split(',') as any;
        }

        // Price range filter
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        if (minPrice || maxPrice) {
            filters.priceRange = {
                min: minPrice ? parseInt(minPrice) : 0,
                max: maxPrice ? parseInt(maxPrice) : Number.MAX_SAFE_INTEGER,
            };
        }

        // Seating capacity filter
        const seating = searchParams.get('seating');
        if (seating) {
            filters.seatingCapacity = seating.split(',').map(s => parseInt(s));
        }

        // Search query
        const searchQuery = searchParams.get('q');
        if (searchQuery) {
            filters.searchQuery = searchQuery;
        }

        // Sorting
        const sortBy = searchParams.get('sortBy');
        if (sortBy) {
            filters.sortBy = sortBy as any;
        }

        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        filters.offset = (page - 1) * limit;
        filters.limit = limit;

        // Get filtered cars
        const result = await getAllCars(filters);

        return NextResponse.json({
            success: true,
            data: result,
        });

    } catch (error) {
        console.error('Error fetching cars:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch cars',
            },
            { status: 500 }
        );
    }
}

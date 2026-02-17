/**
 * Featured Cars API Route
 * GET /api/cars/featured - Get featured/popular cars
 */

import { NextRequest, NextResponse } from 'next/server';
import {
    getFeaturedCars,
    getLatestCars,
    getFuelEfficientCars,
    getTopRatedCars,
} from '@/lib/services/car-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'featured';
        const limit = parseInt(searchParams.get('limit') || '6');

        let cars;

        switch (type) {
            case 'featured':
                cars = await getFeaturedCars(limit);
                break;
            case 'latest':
                cars = await getLatestCars(limit);
                break;
            case 'fuel-efficient':
                cars = await getFuelEfficientCars(limit);
                break;
            case 'top-rated':
                cars = await getTopRatedCars(limit);
                break;
            default:
                cars = await getFeaturedCars(limit);
        }

        return NextResponse.json({
            success: true,
            data: {
                type,
                cars,
                total: cars.length,
            },
        });

    } catch (error) {
        console.error('Error fetching featured cars:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch featured cars',
            },
            { status: 500 }
        );
    }
}

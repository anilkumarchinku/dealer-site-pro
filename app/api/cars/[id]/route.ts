/**
 * Single Car API Route
 * GET /api/cars/[id] - Get detailed information for a specific car
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCarById, getSimilarCars } from '@/lib/services/car-service';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const car = await getCarById(id);

        if (!car) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Car not found',
                },
                { status: 404 }
            );
        }

        // Get similar cars for recommendations
        const similar = await getSimilarCars(id, 4);

        return NextResponse.json({
            success: true,
            data: {
                car,
                similar,
            },
        });

    } catch (error) {
        console.error('Error fetching car:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch car details',
            },
            { status: 500 }
        );
    }
}

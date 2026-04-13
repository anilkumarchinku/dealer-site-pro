/**
 * GET /api/brands
 * Returns the list of car makes that actually have data in the database.
 * Used by CarFilters to show only brands that return results.
 */

import { NextResponse } from 'next/server';
import { getAllBrandsWithStats } from '@/lib/services/car-service';

export async function GET() {
    try {
        const brands = await getAllBrandsWithStats();
        const makes = brands
            .map(b => b.name)
            .sort((a, b) => a.localeCompare(b));
        return NextResponse.json({ success: true, makes });
    } catch (error) {
        console.error('Failed to fetch brands:', error);
        return NextResponse.json({ success: false, makes: [] }, { status: 500 });
    }
}

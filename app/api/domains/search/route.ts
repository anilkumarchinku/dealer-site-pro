import { NextResponse } from 'next/server'
import { searchDomains } from '@/lib/services/domain-search-service'

/**
 * GET /api/domains/search?query=abcmotors
 * Search for available domains (PREMIUM tier)
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('query')

        if (!query) {
            return NextResponse.json(
                { success: false, error: 'Query parameter is required' },
                { status: 400 }
            )
        }

        const results = await searchDomains(query)

        return NextResponse.json({
            success: true,
            results
        })
    } catch (error) {
        console.error('Error in GET /api/domains/search:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

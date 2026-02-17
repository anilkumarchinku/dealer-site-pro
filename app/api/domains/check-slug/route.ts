import { NextResponse } from 'next/server'
import { isSlugAvailable } from '@/lib/services/domain-service'
import { validateSlug, generateSlug } from '@/lib/utils/slug'

/**
 * GET /api/domains/check-slug?name=ABC Motors
 * Check if a slug is available and return the generated slug
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const businessName = searchParams.get('name')

        if (!businessName) {
            return NextResponse.json(
                { error: 'Business name is required' },
                { status: 400 }
            )
        }

        // Generate slug from business name
        const slug = generateSlug(businessName)

        // Validate slug
        const validation = validateSlug(slug)
        if (!validation.valid) {
            return NextResponse.json(
                {
                    success: false,
                    error: validation.error,
                    slug
                },
                { status: 400 }
            )
        }

        // Check availability
        const available = await isSlugAvailable(slug)

        return NextResponse.json({
            success: true,
            slug,
            available,
            subdomain: available ? `${slug}.dealersitepro.com` : null,
            message: available
                ? 'Subdomain is available'
                : 'This subdomain is already taken. We\'ll add your city to make it unique.'
        })
    } catch (error) {
        console.error('Error in GET /api/domains/check-slug:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

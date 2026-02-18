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
        const directSlug   = searchParams.get('slug')

        if (!businessName && !directSlug) {
            return NextResponse.json(
                { error: 'Business name or slug is required' },
                { status: 400 }
            )
        }

        // Use direct slug if provided, otherwise generate from business name
        const slug = directSlug ?? generateSlug(businessName!)

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
            message: available
                ? 'Site name is available!'
                : 'This name is already taken — try a different one.'
        })
    } catch (error) {
        console.error('Error in GET /api/domains/check-slug:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

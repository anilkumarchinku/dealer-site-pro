/**
 * POST /api/domain/configure
 * NOTE: This endpoint is not yet implemented.
 * Custom domain DNS configuration is handled via /api/domains/ routes.
 */

import { NextResponse } from 'next/server'

export async function POST() {
    return NextResponse.json(
        { error: 'This feature is not available yet. Please use the Domains section in your dashboard.' },
        { status: 501 }
    )
}

/**
 * GET /api/domain/propagation-status/[id]
 * NOTE: This endpoint is not yet implemented.
 * DNS status checking is handled via /api/domains/verify-dns.
 */

import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json(
        { error: 'This feature is not available yet. Please use the Domains section in your dashboard.' },
        { status: 501 }
    )
}

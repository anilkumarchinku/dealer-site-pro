/**
 * GET /api/domain/verification-status/[id]
 * NOTE: This endpoint is not yet implemented.
 * Domain verification is handled via /api/domains/verify-dns.
 */

import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json(
        { error: 'This feature is not available yet. Please use the Domains section in your dashboard.' },
        { status: 501 }
    )
}

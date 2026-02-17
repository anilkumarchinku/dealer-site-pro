/**
 * GET /api/domain/download-verification-file
 * Download HTML verification file for domain ownership verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { DomainVerificationService } from '@/lib/services/domain-verification';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { error: 'Missing verification token' },
                { status: 400 }
            );
        }

        // Generate HTML content
        const htmlContent = DomainVerificationService.generateHTMLFile(token);

        // Return as downloadable file
        return new NextResponse(htmlContent, {
            headers: {
                'Content-Type': 'text/html',
                'Content-Disposition': 'attachment; filename="dealersite-verify.html"',
                'Cache-Control': 'no-cache'
            }
        });

    } catch (error) {
        console.error('❌ Error generating verification file:', error);
        return NextResponse.json(
            { error: 'Failed to generate verification file' },
            { status: 500 }
        );
    }
}

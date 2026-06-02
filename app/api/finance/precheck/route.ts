import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

function buildPartnerUrl(baseUrl: string, request: NextRequest) {
    const url = new URL(baseUrl);
    const vehicle = request.nextUrl.searchParams.get('vehicle');
    const amount = request.nextUrl.searchParams.get('amount');
    const source = request.nextUrl.searchParams.get('source') ?? 'dealer-site-pro';

    if (vehicle) url.searchParams.set('vehicle', vehicle);
    if (amount) url.searchParams.set('amount', amount);
    url.searchParams.set('source', source);

    return url;
}

export function GET(request: NextRequest) {
    if (!env.financePrecheckUrl) {
        return NextResponse.redirect(new URL('/tools/emi-calculator?finance=precheck-unconfigured', request.url), 307);
    }

    try {
        return NextResponse.redirect(buildPartnerUrl(env.financePrecheckUrl, request), 307);
    } catch {
        return NextResponse.json({ error: 'FINANCE_PRECHECK_URL is not a valid URL' }, { status: 500 });
    }
}

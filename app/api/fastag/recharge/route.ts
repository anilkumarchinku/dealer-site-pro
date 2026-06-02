import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

function buildPartnerUrl(baseUrl: string, request: NextRequest) {
    const url = new URL(baseUrl);
    const vehicle = request.nextUrl.searchParams.get('vehicle');
    const registration = request.nextUrl.searchParams.get('registration');
    const source = request.nextUrl.searchParams.get('source') ?? 'dealer-site-pro';

    if (vehicle) url.searchParams.set('vehicle', vehicle);
    if (registration) url.searchParams.set('registration', registration);
    url.searchParams.set('source', source);

    return url;
}

export function GET(request: NextRequest) {
    if (!env.fastagRechargeUrl) {
        return NextResponse.redirect(new URL('/tools/on-road-price?fastag=recharge-unconfigured', request.url), 307);
    }

    try {
        return NextResponse.redirect(buildPartnerUrl(env.fastagRechargeUrl, request), 307);
    } catch {
        return NextResponse.json({ error: 'FASTAG_RECHARGE_URL is not a valid URL' }, { status: 500 });
    }
}

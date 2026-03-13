/**
 * GET /api/domain/dns-scan/[id]
 * Perform comprehensive DNS analysis and recommend deployment route
 */

import { NextRequest, NextResponse } from 'next/server';
import { DNSAnalysisService } from '@/lib/services/dns-analysis';
import { requireAuth } from '@/lib/supabase-server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { user, supabase, errorResponse } = await requireAuth();
        if (errorResponse) return errorResponse;

        const { id: onboardingId } = await params;

        if (!onboardingId) {
            return NextResponse.json(
                { error: 'Missing onboarding ID' },
                { status: 400 }
            );
        }

        // Fetch onboarding record from database — scoped to the authenticated user
        const { data: onboarding, error: fetchError } = await supabase
            .from('domain_onboardings')
            .select('*')
            .eq('id', onboardingId)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !onboarding) {
            return NextResponse.json(
                { error: 'Onboarding record not found' },
                { status: 404 }
            );
        }

        // Verify that domain ownership is confirmed
        const verificationData = onboarding.verification as { status?: string } | null
        if (verificationData?.status !== 'verified') {
            return NextResponse.json(
                {
                    error: 'Domain verification required before DNS scan',
                    current_state: onboarding.current_state
                },
                { status: 400 }
            );
        }

        // Perform comprehensive DNS scan
        const scanResult = await DNSAnalysisService.scanDomain(onboarding.domain_name);

        // Detect registrar
        const detectedRegistrar = DNSAnalysisService.detectRegistrar(scanResult.nameservers);
        const isCloudflare = DNSAnalysisService.isCloudflare(scanResult.nameservers);

        // Prepare detailed analysis response
        const analysis = {
            domain: onboarding.domain_name,
            scan_timestamp: scanResult.scanned_at,
            dns_records: {
                nameservers: scanResult.nameservers,
                a_records: scanResult.a_records,
                mx_records: scanResult.mx_records,
                txt_records_count: scanResult.txt_records.length,
                cname_records: scanResult.cname_records
            },
            existing_services: {
                has_active_website: scanResult.has_active_website,
                has_email: scanResult.has_email,
                using_cloudflare: isCloudflare
            },
            registrar: {
                detected: detectedRegistrar,
                confidence: detectedRegistrar ? 'high' : 'unknown',
                nameserver_pattern: scanResult.nameservers[0] || 'none'
            },
            recommendation: {
                route: scanResult.recommended_route,
                reason: scanResult.reason,
                warnings: scanResult.warnings,
                explanation: scanResult.recommended_route === 'subdomain'
                    ? 'We recommend deploying on a subdomain (e.g., shop.yourdomain.com) to preserve your existing website and email services.'
                    : 'You can deploy on the main domain for maximum branding impact. No existing services detected that would be affected.'
            }
        };

        // Update onboarding record with DNS analysis results
        await supabase
            .from('domain_onboardings')
            .update({
                dns_analysis: scanResult as unknown as import('@/lib/database.types').Json,
                configuration: {
                    deployment_route: scanResult.recommended_route,
                    subdomain: scanResult.recommended_route === 'subdomain' ? 'shop' : null
                },
                current_state: 'dns_analysis',
                updated_at: new Date().toISOString()
            })
            .eq('id', onboardingId);

        return NextResponse.json({
            success: true,
            onboarding_id: onboardingId,
            analysis,
            next_steps: [
                'Review the DNS analysis results',
                scanResult.recommended_route === 'subdomain'
                    ? 'Choose a subdomain name (e.g., shop, store, cars)'
                    : 'Proceed with full domain configuration',
                'Configure DNS records',
                'Wait for DNS propagation'
            ],
            configuration_options: {
                full_domain: {
                    available: true,
                    impact: scanResult.has_active_website || scanResult.has_email
                        ? 'Will replace existing website/email services'
                        : 'No impact - domain is available',
                    recommended: scanResult.recommended_route === 'full_domain'
                },
                subdomain: {
                    available: true,
                    impact: 'Preserves all existing services',
                    recommended: scanResult.recommended_route === 'subdomain',
                    suggested_names: ['shop', 'store', 'cars', 'auto', 'showroom']
                }
            }
        });

    } catch (error) {
        console.error('Error performing DNS scan:', error);
        return NextResponse.json(
            { error: 'Failed to perform DNS scan', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

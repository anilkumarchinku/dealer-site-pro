/**
 * GET /api/domain/dns-scan/[id]
 * Perform comprehensive DNS analysis and recommend deployment route
 */

import { NextRequest, NextResponse } from 'next/server';
import { DNSAnalysisService } from '@/lib/services/dns-analysis';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: onboardingId } = await params;

        if (!onboardingId) {
            return NextResponse.json(
                { error: 'Missing onboarding ID' },
                { status: 400 }
            );
        }

        // TODO: Fetch onboarding record from database
        // const { data: onboarding, error } = await supabase
        //     .from('domain_onboardings')
        //     .select('*')
        //     .eq('id', onboardingId)
        //     .single();

        // Mock data for now
        const onboarding = {
            id: onboardingId,
            domain_name: 'example.com',
            verification: {
                status: 'verified'
            },
            current_state: 'verification_complete'
        };

        // Verify that domain ownership is confirmed
        if (onboarding.verification.status !== 'verified') {
            return NextResponse.json(
                {
                    error: 'Domain verification required before DNS scan',
                    current_state: onboarding.current_state
                },
                { status: 400 }
            );
        }

        console.log(`🔬 Starting DNS scan for ${onboarding.domain_name}...`);

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

        // Update onboarding record with DNS analysis
        // TODO: Save to database
        // await supabase
        //     .from('domain_onboardings')
        //     .update({
        //         dns_analysis: scanResult,
        //         configuration: {
        //             deployment_route: scanResult.recommended_route,
        //             subdomain: scanResult.recommended_route === 'subdomain' ? 'shop' : null
        //         },
        //         current_state: 'dns_analysis',
        //         updated_at: new Date()
        //     })
        //     .eq('id', onboardingId);

        console.log(`✅ DNS scan complete. Recommendation: ${scanResult.recommended_route}`);

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
        console.error('❌ Error performing DNS scan:', error);
        return NextResponse.json(
            { error: 'Failed to perform DNS scan', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

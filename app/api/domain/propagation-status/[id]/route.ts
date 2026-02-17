/**
 * GET /api/domain/propagation-status/[id]
 * Check DNS propagation status for configured domain
 */

import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns/promises';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const onboardingId = params.id;

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

        // Mock data
        const onboarding = {
            id: onboardingId,
            domain_name: 'example.com',
            configuration: {
                target_domain: 'example.com',
                deployment_route: 'full_domain',
                dns_records: [
                    { type: 'A', name: '@', value: '123.45.67.89' },
                    { type: 'A', name: 'www', value: '123.45.67.89' }
                ]
            },
            current_state: 'configuration_pending'
        };

        const targetDomain = onboarding.configuration.target_domain;
        const expectedIP = '123.45.67.89'; // TODO: Get from config

        console.log(`🔍 Checking DNS propagation for ${targetDomain}...`);

        // Check A records
        let aRecords: string[] = [];
        let aRecordsPropagated = false;
        try {
            aRecords = await dns.resolve4(targetDomain);
            aRecordsPropagated = aRecords.includes(expectedIP);
        } catch (error) {
            console.log(`⚠️ A records not yet propagated`);
        }

        // Check www subdomain if full domain deployment
        let wwwRecords: string[] = [];
        let wwwPropagated = false;
        if (onboarding.configuration.deployment_route === 'full_domain') {
            try {
                wwwRecords = await dns.resolve4(`www.${onboarding.domain_name}`);
                wwwPropagated = wwwRecords.includes(expectedIP);
            } catch (error) {
                console.log(`⚠️ WWW records not yet propagated`);
            }
        }

        // Check TXT records
        let txtRecords: string[] = [];
        let txtPropagated = false;
        try {
            const txtResults = await dns.resolveTxt(targetDomain);
            txtRecords = txtResults.flat();
            txtPropagated = txtRecords.some(record => record.includes('dealersite-pro'));
        } catch (error) {
            console.log(`⚠️ TXT records not yet propagated`);
        }

        // Calculate overall propagation status
        const requiredChecks = onboarding.configuration.deployment_route === 'full_domain'
            ? [aRecordsPropagated, wwwPropagated, txtPropagated]
            : [aRecordsPropagated, txtPropagated];

        const propagatedCount = requiredChecks.filter(Boolean).length;
        const totalChecks = requiredChecks.length;
        const propagationPercentage = Math.round((propagatedCount / totalChecks) * 100);
        const fullyPropagated = propagationPercentage === 100;

        // Detailed status
        const propagationStatus = {
            overall: {
                percentage: propagationPercentage,
                fully_propagated: fullyPropagated,
                checks_passed: propagatedCount,
                total_checks: totalChecks
            },
            records: {
                a_record: {
                    propagated: aRecordsPropagated,
                    current_values: aRecords,
                    expected_value: expectedIP
                },
                ...(onboarding.configuration.deployment_route === 'full_domain' && {
                    www_record: {
                        propagated: wwwPropagated,
                        current_values: wwwRecords,
                        expected_value: expectedIP
                    }
                }),
                txt_record: {
                    propagated: txtPropagated,
                    current_values: txtRecords,
                    expected_pattern: 'dealersite-pro'
                }
            },
            estimated_time_remaining: fullyPropagated
                ? 'Complete'
                : propagationPercentage > 50
                    ? '5-15 minutes'
                    : '15-30 minutes'
        };

        // Update onboarding state if fully propagated
        if (fullyPropagated && onboarding.current_state !== 'configuration_complete') {
            // TODO: Update database
            // await supabase
            //     .from('domain_onboardings')
            //     .update({
            //         current_state: 'configuration_complete',
            //         updated_at: new Date()
            //     })
            //     .eq('id', onboardingId);

            console.log(`✅ DNS fully propagated for ${targetDomain}`);
        }

        return NextResponse.json({
            success: true,
            onboarding_id: onboardingId,
            target_domain: targetDomain,
            propagation_status: propagationStatus,
            current_state: fullyPropagated ? 'configuration_complete' : 'configuration_pending',
            next_step: fullyPropagated
                ? 'DNS propagation complete! Ready for SSL provisioning and deployment.'
                : 'DNS is still propagating. This typically takes 5-30 minutes. We\'ll keep checking automatically.',
            actions: fullyPropagated
                ? ['proceed_to_ssl', 'proceed_to_deployment']
                : ['wait_and_recheck', 'verify_dns_records']
        });

    } catch (error) {
        console.error('❌ Error checking propagation status:', error);
        return NextResponse.json(
            {
                error: 'Failed to check DNS propagation',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

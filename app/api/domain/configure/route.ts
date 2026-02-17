/**
 * POST /api/domain/configure
 * Configure DNS records based on chosen deployment route
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { onboarding_id, deployment_route, subdomain } = body;

        // Validate required fields
        if (!onboarding_id || !deployment_route) {
            return NextResponse.json(
                { error: 'Missing required fields: onboarding_id, deployment_route' },
                { status: 400 }
            );
        }

        // Validate deployment route
        if (!['full_domain', 'subdomain'].includes(deployment_route)) {
            return NextResponse.json(
                { error: 'Invalid deployment route. Use: full_domain or subdomain' },
                { status: 400 }
            );
        }

        // Validate subdomain if route is subdomain
        if (deployment_route === 'subdomain' && !subdomain) {
            return NextResponse.json(
                { error: 'Subdomain name required for subdomain deployment' },
                { status: 400 }
            );
        }

        // TODO: Fetch onboarding record from database
        // const { data: onboarding, error } = await supabase
        //     .from('domain_onboardings')
        //     .select('*')
        //     .eq('id', onboarding_id)
        //     .single();

        // Mock data
        const onboarding = {
            id: onboarding_id,
            domain_name: 'example.com',
            current_state: 'dns_analysis'
        };

        // Generate DNS configuration instructions
        const targetDomain = deployment_route === 'subdomain'
            ? `${subdomain}.${onboarding.domain_name}`
            : onboarding.domain_name;

        // TODO: In production, these IPs would be your actual hosting IPs
        const serverIP = '123.45.67.89'; // Placeholder
        const cloudflareNameservers = ['ns1.cloudflare.com', 'ns2.cloudflare.com'];

        const dnsInstructions = {
            deployment_route,
            target_domain: targetDomain,
            records_to_add: [] as any[]
        };

        if (deployment_route === 'full_domain') {
            // Full domain configuration
            dnsInstructions.records_to_add = [
                {
                    type: 'A',
                    name: '@',
                    value: serverIP,
                    ttl: 300,
                    description: 'Points your domain to our servers'
                },
                {
                    type: 'A',
                    name: 'www',
                    value: serverIP,
                    ttl: 300,
                    description: 'Points www subdomain to our servers'
                },
                {
                    type: 'TXT',
                    name: '@',
                    value: 'v=dealersite-pro',
                    ttl: 300,
                    description: 'Verification record'
                }
            ];
        } else {
            // Subdomain configuration
            dnsInstructions.records_to_add = [
                {
                    type: 'A',
                    name: subdomain,
                    value: serverIP,
                    ttl: 300,
                    description: `Points ${subdomain} subdomain to our servers`
                },
                {
                    type: 'TXT',
                    name: subdomain,
                    value: 'v=dealersite-pro',
                    ttl: 300,
                    description: 'Verification record'
                }
            ];
        }

        // Manual configuration instructions
        const manualSteps = {
            title: 'Configure Your DNS Records',
            steps: [
                'Log in to your domain registrar account',
                'Navigate to DNS management / DNS settings',
                'Add the DNS records shown below',
                'Save your changes',
                'Wait 5-30 minutes for DNS propagation',
                'Click "Check Propagation" to verify'
            ],
            registrar_specific_help: {
                godaddy: 'DNS Settings → Manage → Add Record',
                namecheap: 'Advanced DNS → Add New Record',
                bigrock: 'Manage DNS → Add Record',
                other: 'Look for "DNS Settings", "DNS Management", or "Nameservers"'
            }
        };

        // Cloudflare automated option
        const cloudflareOption = {
            available: true,
            benefits: [
                'Automated DNS configuration',
                'Free SSL certificate',
                'Faster propagation (5-10 minutes)',
                'CDN and DDoS protection',
                'Better performance'
            ],
            steps: [
                'We will provide Cloudflare nameservers',
                'Update nameservers at your registrar',
                'We handle all DNS records automatically',
                'SSL certificate provisioned automatically'
            ],
            nameservers: cloudflareNameservers
        };

        // Update onboarding record
        // TODO: Save to database
        // await supabase
        //     .from('domain_onboardings')
        //     .update({
        //         configuration: {
        //             deployment_route,
        //             target_domain: targetDomain,
        //             subdomain: deployment_route === 'subdomain' ? subdomain : null,
        //             dns_records: dnsInstructions.records_to_add,
        //             method: 'manual' // or 'cloudflare'
        //         },
        //         current_state: 'configuration_pending',
        //         updated_at: new Date()
        //     })
        //     .eq('id', onboarding_id);

        console.log(`⚙️ DNS configuration prepared for ${targetDomain}`);

        return NextResponse.json({
            success: true,
            onboarding_id,
            target_domain: targetDomain,
            deployment_route,
            dns_instructions: dnsInstructions,
            manual_configuration: manualSteps,
            cloudflare_option: cloudflareOption,
            estimated_propagation_time: '5-30 minutes',
            next_step: 'Add DNS records and check propagation status'
        });

    } catch (error) {
        console.error('❌ Error configuring DNS:', error);
        return NextResponse.json(
            { error: 'Failed to configure DNS' },
            { status: 500 }
        );
    }
}

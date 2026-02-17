/**
 * POST /api/domain/verify-ownership
 * Start domain ownership verification using DNS TXT or HTML file method
 */

import { NextRequest, NextResponse } from 'next/server';
import { DomainVerificationService } from '@/lib/services/domain-verification';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { onboarding_id, method } = body;

        // Validate required fields
        if (!onboarding_id || !method) {
            return NextResponse.json(
                { error: 'Missing required fields: onboarding_id, method' },
                { status: 400 }
            );
        }

        // Validate method
        if (!['dns_txt', 'html_file', 'email'].includes(method)) {
            return NextResponse.json(
                { error: 'Invalid verification method. Use: dns_txt, html_file, or email' },
                { status: 400 }
            );
        }

        // TODO: Fetch onboarding record from database
        // const { data: onboarding, error } = await supabase
        //     .from('domain_onboardings')
        //     .select('*')
        //     .eq('id', onboarding_id)
        //     .single();

        // Mock data for now
        const onboarding = {
            id: onboarding_id,
            domain_name: 'example.com',
            verification: {
                token: 'dealersite-verify-abc123',
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        };

        // Check token expiration
        if (DomainVerificationService.isTokenExpired(onboarding.verification.expires_at)) {
            return NextResponse.json(
                { error: 'Verification token has expired. Please restart the onboarding process.' },
                { status: 400 }
            );
        }

        let verificationResult;
        let instructions;

        // Perform verification based on method
        if (method === 'dns_txt') {
            verificationResult = await DomainVerificationService.verifyDNSTXT(
                onboarding.domain_name,
                onboarding.verification.token
            );

            instructions = {
                method: 'dns_txt',
                steps: [
                    'Log in to your domain registrar',
                    'Navigate to DNS settings',
                    `Add a new TXT record with name: @ or ${onboarding.domain_name}`,
                    `Set the value to: ${onboarding.verification.token}`,
                    'Save changes and wait 5-10 minutes for DNS propagation',
                    'Click "Verify" button to check'
                ],
                txt_record: {
                    name: '@',
                    type: 'TXT',
                    value: onboarding.verification.token,
                    ttl: 300
                }
            };

        } else if (method === 'html_file') {
            verificationResult = await DomainVerificationService.verifyHTMLFile(
                onboarding.domain_name,
                onboarding.verification.token
            );

            const htmlContent = DomainVerificationService.generateHTMLFile(
                onboarding.verification.token
            );

            instructions = {
                method: 'html_file',
                steps: [
                    'Download the verification HTML file',
                    'Upload it to your website root directory',
                    `Ensure it\'s accessible at: http://${onboarding.domain_name}/dealersite-verify.html`,
                    'Click "Verify" button to check'
                ],
                file: {
                    name: 'dealersite-verify.html',
                    content: htmlContent,
                    upload_path: '/dealersite-verify.html'
                },
                download_url: `/api/domain/download-verification-file?token=${onboarding.verification.token}`
            };

        } else if (method === 'email') {
            // Email verification (manual fallback)
            instructions = {
                method: 'email',
                steps: [
                    'An email has been sent to the domain admin contact',
                    'Click the verification link in the email',
                    'Return here once verified'
                ],
                note: 'Email verification typically takes 5-10 minutes'
            };
            verificationResult = { verified: false, pending: true };
        }

        // Update onboarding record
        // TODO: Save to database
        // await supabase
        //     .from('domain_onboardings')
        //     .update({
        //         verification: {
        //             ...onboarding.verification,
        //             method,
        //             status: verificationResult.verified ? 'verified' : 'pending',
        //             verified_at: verificationResult.verified ? new Date() : null,
        //             attempts: (onboarding.verification.attempts || 0) + 1
        //         },
        //         current_state: verificationResult.verified ? 'verification_complete' : 'verification_pending',
        //         updated_at: new Date()
        //     })
        //     .eq('id', onboarding_id);

        // Log verification attempt
        // await supabase.from('verification_attempts').insert({
        //     onboarding_id,
        //     method,
        //     status: verificationResult.verified ? 'success' : 'pending',
        //     attempted_at: new Date()
        // });

        if (!verificationResult) {
            return NextResponse.json({ error: 'Invalid verification method' }, { status: 400 });
        }

        console.log(`📝 Verification attempt: ${method} - ${verificationResult.verified ? 'SUCCESS' : 'PENDING'}`);

        return NextResponse.json({
            success: true,
            verified: verificationResult.verified,
            method,
            instructions,
            result: verificationResult,
            next_action: verificationResult.verified
                ? 'Verification complete! Proceed to DNS analysis.'
                : 'Follow the instructions and click verify again when ready.'
        });

    } catch (error) {
        console.error('❌ Error in verification:', error);
        return NextResponse.json(
            { error: 'Failed to process verification' },
            { status: 500 }
        );
    }
}

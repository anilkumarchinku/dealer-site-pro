/**
 * GET /api/domain/verification-status/[id]
 * Check the current verification status for an onboarding process
 */

import { NextRequest, NextResponse } from 'next/server';
import { DomainVerificationService } from '@/lib/services/domain-verification';

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
                status: 'pending',
                method: 'dns_txt',
                token: 'dealersite-verify-abc123',
                expires_at: new Date(Date.now() + 20 * 60 * 60 * 1000),
                attempts: 1,
                verified_at: null
            },
            current_state: 'verification_pending'
        };

        // If already verified, return success
        if (onboarding.verification.status === 'verified') {
            return NextResponse.json({
                success: true,
                verified: true,
                method: onboarding.verification.method,
                verified_at: onboarding.verification.verified_at,
                current_state: onboarding.current_state,
                next_step: 'dns_analysis'
            });
        }

        // Check token expiration
        if (DomainVerificationService.isTokenExpired(onboarding.verification.expires_at)) {
            return NextResponse.json({
                success: false,
                verified: false,
                expired: true,
                error: 'Verification token has expired',
                action_required: 'Restart onboarding process with new token'
            });
        }

        // Try to verify based on the chosen method
        let verificationResult;

        if (onboarding.verification.method === 'dns_txt') {
            verificationResult = await DomainVerificationService.verifyDNSTXT(
                onboarding.domain_name,
                onboarding.verification.token
            );
        } else if (onboarding.verification.method === 'html_file') {
            verificationResult = await DomainVerificationService.verifyHTMLFile(
                onboarding.domain_name,
                onboarding.verification.token
            );
        } else {
            // Email or other methods - check database status only
            verificationResult = {
                verified: onboarding.verification.status === 'verified',
                pending: true
            };
        }

        // If newly verified, update database
        if (verificationResult.verified && onboarding.verification.status !== 'verified') {
            // TODO: Update database
            // await supabase
            //     .from('domain_onboardings')
            //     .update({
            //         verification: {
            //             ...onboarding.verification,
            //             status: 'verified',
            //             verified_at: new Date()
            //         },
            //         current_state: 'verification_complete',
            //         updated_at: new Date()
            //     })
            //     .eq('id', onboardingId);

            console.log(`✅ Domain verified: ${onboarding.domain_name}`);
        }

        // Calculate time remaining
        const timeRemaining = onboarding.verification.expires_at.getTime() - Date.now();
        const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

        return NextResponse.json({
            success: true,
            verified: verificationResult.verified,
            method: onboarding.verification.method,
            current_state: verificationResult.verified ? 'verification_complete' : 'verification_pending',
            attempts: onboarding.verification.attempts,
            expires_in: {
                hours: hoursRemaining,
                minutes: minutesRemaining,
                timestamp: onboarding.verification.expires_at
            },
            result: verificationResult,
            next_step: verificationResult.verified ? 'dns_analysis' : 'continue_verification'
        });

    } catch (error) {
        console.error('❌ Error checking verification status:', error);
        return NextResponse.json(
            { error: 'Failed to check verification status' },
            { status: 500 }
        );
    }
}

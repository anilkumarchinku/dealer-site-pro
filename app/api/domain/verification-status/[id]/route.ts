/**
 * GET /api/domain/verification-status/[id]
 * Check ownership verification for a domain onboarding.
 */

import { NextRequest, NextResponse } from 'next/server'
import { DomainVerificationService } from '@/lib/services/domain-verification'
import { requireAuth } from '@/lib/supabase-server'
import type { Json } from '@/lib/database.types'

type VerificationMethod = 'dns_txt' | 'html_file' | 'email'

type VerificationData = {
    status?: string | null
    method?: VerificationMethod | null
    token?: string | null
    expires_at?: string | null
    attempts?: number | null
    verified_at?: string | null
    error_message?: string | null
    last_checked_at?: string | null
    last_result?: Json
}

type VerificationResult = {
    verified: boolean
    found_records?: string[]
    content?: string
    error?: string
}

function asVerificationData(value: Json | null): VerificationData {
    return value && typeof value === 'object' && !Array.isArray(value)
        ? value as VerificationData
        : {}
}

function isExpired(expiresAt: string | null | undefined): boolean {
    return !!expiresAt && new Date(expiresAt).getTime() < Date.now()
}

async function runVerification(
    domain: string,
    method: VerificationMethod | null | undefined,
    token: string
): Promise<VerificationResult> {
    if (method === 'dns_txt') {
        return DomainVerificationService.verifyDNSTXT(domain, token)
    }

    if (method === 'html_file') {
        return DomainVerificationService.verifyHTMLFile(domain, token)
    }

    return {
        verified: false,
        error: method === 'email'
            ? 'Email verification is not automated yet. Please use DNS TXT or HTML file verification.'
            : 'Verification method has not been selected.',
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { user, supabase, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse

        const { id: onboardingId } = await params
        if (!onboardingId) {
            return NextResponse.json(
                { success: false, error: 'Missing onboarding ID' },
                { status: 400 }
            )
        }

        const { data: onboarding, error: fetchError } = await supabase
            .from('domain_onboardings')
            .select('id, domain_name, verification, current_state')
            .eq('id', onboardingId)
            .eq('user_id', user.id)
            .single()

        if (fetchError || !onboarding) {
            return NextResponse.json(
                { success: false, error: 'Onboarding record not found' },
                { status: 404 }
            )
        }

        const verification = asVerificationData(onboarding.verification)
        const attempts = verification.attempts ?? 0

        if (verification.status === 'verified') {
            return NextResponse.json({
                success: true,
                onboarding_id: onboardingId,
                verified: true,
                attempts,
                current_state: onboarding.current_state,
                result: {
                    verified: true,
                    error: null,
                },
            })
        }

        if (!verification.token) {
            return NextResponse.json(
                { success: false, error: 'Verification token is missing. Please restart onboarding.' },
                { status: 400 }
            )
        }

        if (isExpired(verification.expires_at)) {
            const nextAttempts = attempts + 1
            const result = {
                verified: false,
                error: 'Verification token expired. Please restart onboarding to generate a new token.',
            }

            await supabase
                .from('domain_onboardings')
                .update({
                    verification: {
                        ...verification,
                        attempts: nextAttempts,
                        status: 'failed',
                        error_message: result.error,
                        last_checked_at: new Date().toISOString(),
                        last_result: result,
                    } as Json,
                    current_state: 'failed',
                    error_message: result.error,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', onboardingId)
                .eq('user_id', user.id)

            return NextResponse.json({
                success: true,
                onboarding_id: onboardingId,
                verified: false,
                attempts: nextAttempts,
                current_state: 'failed',
                result,
            })
        }

        const result = await runVerification(onboarding.domain_name, verification.method, verification.token)
        const verified = result.verified
        const nextAttempts = attempts + 1
        const currentState = verified ? 'verification_complete' : 'verification_pending'

        const { error: updateError } = await supabase
            .from('domain_onboardings')
            .update({
                verification: {
                    ...verification,
                    attempts: nextAttempts,
                    status: verified ? 'verified' : 'pending',
                    verified_at: verified ? new Date().toISOString() : null,
                    error_message: verified ? null : result.error ?? null,
                    last_checked_at: new Date().toISOString(),
                    last_result: result as Json,
                } as Json,
                current_state: currentState,
                updated_at: new Date().toISOString(),
            })
            .eq('id', onboardingId)
            .eq('user_id', user.id)

        if (updateError) {
            return NextResponse.json(
                { success: false, error: 'Failed to save verification status' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            onboarding_id: onboardingId,
            verified,
            attempts: nextAttempts,
            current_state: currentState,
            result,
        })
    } catch (error) {
        console.error('Error checking domain verification status:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to check verification status' },
            { status: 500 }
        )
    }
}

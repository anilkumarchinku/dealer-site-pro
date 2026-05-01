/**
 * POST /api/domain/verify-ownership
 * Start ownership verification for a domain onboarding.
 */

import { NextRequest, NextResponse } from 'next/server'
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
}

function isVerificationMethod(value: unknown): value is VerificationMethod {
    return value === 'dns_txt' || value === 'html_file' || value === 'email'
}

function asVerificationData(value: Json | null): VerificationData {
    return value && typeof value === 'object' && !Array.isArray(value)
        ? value as VerificationData
        : {}
}

function buildInstructions(domain: string, token: string, method: VerificationMethod) {
    if (method === 'dns_txt') {
        return {
            record_type: 'TXT',
            host: '@',
            name: domain,
            value: token,
            ttl: 'Auto or 3600',
            note: 'Add this TXT record at your domain root, then wait a few minutes before checking verification.',
        }
    }

    if (method === 'html_file') {
        return {
            file_name: 'dealersite-verify.html',
            download_url: `/api/domain/download-verification-file?token=${encodeURIComponent(token)}`,
            upload_path: '/',
            expected_url: `https://${domain}/dealersite-verify.html`,
            note: 'Upload the downloaded file to the root of your existing website.',
        }
    }

    return {
        note: 'Email verification is not automated yet. Please choose DNS TXT or HTML file verification.',
    }
}

export async function POST(request: NextRequest) {
    try {
        const { user, supabase, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse

        const body = await request.json()
        const { onboarding_id: onboardingId, method } = body

        if (!onboardingId || !isVerificationMethod(method)) {
            return NextResponse.json(
                { success: false, error: 'Onboarding ID and valid verification method are required' },
                { status: 400 }
            )
        }

        const { data: onboarding, error: fetchError } = await supabase
            .from('domain_onboardings')
            .select('id, domain_name, verification')
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
        const token = verification.token
        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Verification token is missing. Please restart onboarding.' },
                { status: 400 }
            )
        }

        const updatedVerification = {
            ...verification,
            method,
            status: verification.status === 'verified' ? 'verified' : 'pending',
            attempts: verification.attempts ?? 0,
            error_message: null,
        }

        const { error: updateError } = await supabase
            .from('domain_onboardings')
            .update({
                verification: updatedVerification as Json,
                current_state: verification.status === 'verified' ? 'verification_complete' : 'verification_pending',
                updated_at: new Date().toISOString(),
            })
            .eq('id', onboardingId)
            .eq('user_id', user.id)

        if (updateError) {
            return NextResponse.json(
                { success: false, error: 'Failed to update verification method' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            onboarding_id: onboardingId,
            domain_name: onboarding.domain_name,
            method,
            instructions: buildInstructions(onboarding.domain_name, token, method),
            current_state: updatedVerification.status === 'verified' ? 'verification_complete' : 'verification_pending',
        })
    } catch (error) {
        console.error('Error starting domain ownership verification:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to start domain verification' },
            { status: 500 }
        )
    }
}

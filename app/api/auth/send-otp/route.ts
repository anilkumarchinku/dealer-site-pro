/**
 * POST /api/auth/send-otp
 *
 * Send a 6-digit OTP to the provided email for login or registration
 *
 * Request body:
 *   { email: string, purpose: 'login' | 'register' }
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendOtp } from '@/lib/services/otp-service'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { sendOtpSchema, formatZodErrors } from '@/lib/validations/schemas'

export async function POST(request: NextRequest) {
    // Rate limit: max 5 OTP requests per IP per 15 minutes
    const rateLimit = await rateLimitOrNull('send_otp', request, 5, 15 * 60 * 1000)
    if (rateLimit) return rateLimit

    try {
        const body = await request.json()

        // ── Validate with Zod ───────────────────────────────────────────────
        const parsed = sendOtpSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: formatZodErrors(parsed.error) },
                { status: 400 }
            )
        }
        const { email, purpose } = parsed.data

        const result = await sendOtp(email, purpose)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to send OTP' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: `OTP sent to ${email}. Valid for 10 minutes.`,
        })
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error)
        console.error('[/api/auth/send-otp] Error:', msg)
        return NextResponse.json(
            { error: 'Failed to send OTP' },
            { status: 500 }
        )
    }
}

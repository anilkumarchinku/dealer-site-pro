/**
 * OTP Service — Handles 6-digit code generation, sending, and verification
 * Server-side only — never expose OTP logic to the browser
 */

import { createClient } from '@supabase/supabase-js'
import { sendOtpEmail } from './email-service'

/**
 * Create admin Supabase client for OTP operations
 * Uses service role key — bypasses RLS on otp_codes table
 */
function getAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return null
    return createClient(url, key)
}

/**
 * Generate a random 6-digit code
 */
function generateOtpCode(): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    return code
}

/**
 * Send OTP to user's email — valid for 10 minutes
 */
export async function sendOtp(
    email: string,
    purpose: 'login' | 'register'
): Promise<{ success: boolean; error?: string }> {
    const admin = getAdminClient()
    if (!admin) return { success: false, error: 'OTP service not configured' }

    try {
        const code = generateOtpCode()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        // Delete any previous codes for this email
        await admin
            .from('otp_codes')
            .delete()
            .eq('email', email)
            .eq('purpose', purpose)

        // Insert new OTP code
        const { error: insertError } = await admin
            .from('otp_codes')
            .insert({
                email,
                code,
                purpose,
                expires_at: expiresAt.toISOString(),
            })

        if (insertError) throw insertError

        // Send email with OTP
        const subject = purpose === 'login' ? 'Sign In to DealerSite Pro' : 'Verify Your Email'
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>${purpose === 'login' ? 'Your Sign-In Code' : 'Verify Your Email'}</h2>
                <p>Your verification code is:</p>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <code style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0066cc;">${code}</code>
                </div>
                <p style="color: #666; font-size: 14px;">
                    This code expires in 10 minutes. Don't share this code with anyone.
                </p>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
                <p style="color: #999; font-size: 12px;">
                    If you didn't request this code, you can safely ignore this email.
                </p>
            </div>
        `

        await sendOtpEmail(email, subject, html)

        return { success: true }
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error)
        console.error('[OTP] Failed to send:', msg)
        return { success: false, error: msg }
    }
}

/**
 * Verify OTP code and return user email if valid
 */
export async function verifyOtp(
    email: string,
    code: string,
    purpose: 'login' | 'register'
): Promise<{ success: boolean; email?: string; error?: string }> {
    const admin = getAdminClient()
    if (!admin) return { success: false, error: 'OTP service not configured' }

    try {
        // Fetch the OTP record
        const { data, error: queryError } = await admin
            .from('otp_codes')
            .select('*')
            .eq('email', email)
            .eq('code', code)
            .eq('purpose', purpose)
            .single()

        if (queryError || !data) {
            return { success: false, error: 'Invalid or expired code' }
        }

        // Check if code has expired
        if (new Date(data.expires_at) < new Date()) {
            return { success: false, error: 'Code has expired. Request a new one.' }
        }

        // Check attempt count
        if (data.attempts >= data.max_attempts) {
            return { success: false, error: 'Too many failed attempts. Request a new code.' }
        }

        // Check if already verified
        if (data.verified_at) {
            return { success: false, error: 'Code already used. Request a new one.' }
        }

        // Mark as verified
        await admin
            .from('otp_codes')
            .update({ verified_at: new Date().toISOString() })
            .eq('id', data.id)

        return { success: true, email }
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error)
        console.error('[OTP] Verification failed:', msg)
        return { success: false, error: msg }
    }
}

/**
 * Increment failed attempt counter for a code
 */
export async function incrementOtpAttempt(
    email: string,
    code: string,
    purpose: 'login' | 'register'
): Promise<void> {
    const admin = getAdminClient()
    if (!admin) return

    try {
        const { data } = await admin
            .from('otp_codes')
            .select('attempts')
            .eq('email', email)
            .eq('code', code)
            .eq('purpose', purpose)
            .single()

        if (data) {
            await admin
                .from('otp_codes')
                .update({ attempts: data.attempts + 1 })
                .eq('email', email)
                .eq('code', code)
        }
    } catch {
        // Silently fail — don't block the user experience
    }
}

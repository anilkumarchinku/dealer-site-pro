/**
 * OTP Service — Handles 6-digit code generation, sending, and verification
 * Server-side only — never expose OTP logic to the browser
 */

import { timingSafeEqual } from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { getOptionalEnv } from '@/lib/env'
import { sendOtpEmail } from './email-service'

/**
 * Purposes an OTP code can be issued for. `customer_panel` gates the public
 * customer self-service panel (proof the caller owns the email before any PII
 * is returned). The `otp_codes.purpose` column is plain text, so adding a value
 * here needs no DB migration.
 */
export type OtpPurpose = 'login' | 'register' | 'customer_panel'

/** Constant-time comparison of two short strings (the OTP codes). */
function codesMatch(a: string, b: string): boolean {
    const bufA = Buffer.from(a)
    const bufB = Buffer.from(b)
    if (bufA.length !== bufB.length) return false
    try {
        return timingSafeEqual(bufA, bufB)
    } catch {
        return false
    }
}

/**
 * Create admin Supabase client for OTP operations
 * Uses service role key — bypasses RLS on otp_codes table
 */
function getAdminClient() {
    const url = getOptionalEnv('NEXT_PUBLIC_SUPABASE_URL')
    const key = getOptionalEnv('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !key) return null
    return createClient(url, key)
}

/**
 * Generate a cryptographically secure random 6-digit code
 */
function generateOtpCode(): string {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    // Map to 100000–999999 range
    const code = (100000 + (array[0] % 900000)).toString()
    return code
}

/**
 * Send OTP to user's email — valid for 10 minutes
 */
const MOCK_OTP_ENABLED = process.env.ALLOW_MOCK_OTP === 'true'
const MOCK_OTP_CODE = '998909'

export async function sendOtp(
    email: string,
    purpose: OtpPurpose
): Promise<{ success: boolean; error?: string }> {
    // Mock mode: skip DB and email, pretend OTP was sent
    if (MOCK_OTP_ENABLED) {
        return { success: true }
    }

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
        const heading =
            purpose === 'login' ? 'Your Sign-In Code'
            : purpose === 'customer_panel' ? 'Your Verification Code'
            : 'Verify Your Email'
        const subject =
            purpose === 'login' ? 'Sign In to DealerSite Pro'
            : purpose === 'customer_panel' ? 'Your DealerSite Pro Verification Code'
            : 'Verify Your Email'
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>${heading}</h2>
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
    purpose: OtpPurpose
): Promise<{ success: boolean; email?: string; error?: string }> {
    // Mock OTP bypass — code 998909 always succeeds when ALLOW_MOCK_OTP=true
    if (MOCK_OTP_ENABLED && code === MOCK_OTP_CODE) {
        return { success: true, email }
    }

    const admin = getAdminClient()
    if (!admin) return { success: false, error: 'OTP service not configured' }

    try {
        // Fetch the active OTP record for this identifier.
        //
        // SECURITY: We look up by (email, purpose) ONLY — never by `code`.
        // Matching on the code means a wrong guess finds no row, so the attempt
        // counter never increments and brute-forcing is unbounded. By loading the
        // single active row first we can enforce the lockout and increment the
        // counter on every wrong guess before we ever compare codes.
        const { data, error: queryError } = await admin
            .from('otp_codes')
            .select('*')
            .eq('email', email)
            .eq('purpose', purpose)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (queryError) {
            console.error('[OTP] Lookup failed:', queryError.message)
            return { success: false, error: 'Could not verify code. Please try again.' }
        }

        if (!data) {
            return { success: false, error: 'Invalid or expired code' }
        }

        // Enforce lockout BEFORE comparing codes so an attacker can't keep
        // guessing once the limit is reached.
        if (data.attempts >= data.max_attempts) {
            return { success: false, error: 'Too many failed attempts. Request a new code.' }
        }

        // Check if code has expired
        if (new Date(data.expires_at) < new Date()) {
            return { success: false, error: 'Code has expired. Request a new one.' }
        }

        // Check if already verified (single-use)
        if (data.verified_at) {
            return { success: false, error: 'Code already used. Request a new one.' }
        }

        // Compare in constant time. On any mismatch, atomically burn an attempt.
        if (!codesMatch(String(data.code), String(code))) {
            const remaining = await registerFailedAttempt(data.id, data.attempts)
            if (remaining <= 0) {
                return { success: false, error: 'Too many failed attempts. Request a new code.' }
            }
            return { success: false, error: 'Invalid or expired code' }
        }

        // Correct code → consume it (mark verified). Guard the update so a row
        // that was verified concurrently isn't accepted twice.
        const { data: consumed, error: consumeError } = await admin
            .from('otp_codes')
            .update({ verified_at: new Date().toISOString() })
            .eq('id', data.id)
            .is('verified_at', null)
            .select('id')
            .maybeSingle()

        if (consumeError) {
            console.error('[OTP] Failed to consume code:', consumeError.message)
            return { success: false, error: 'Could not verify code. Please try again.' }
        }

        if (!consumed) {
            // Another request consumed it first.
            return { success: false, error: 'Code already used. Request a new one.' }
        }

        return { success: true, email }
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error)
        console.error('[OTP] Verification failed:', msg)
        return { success: false, error: 'Could not verify code. Please try again.' }
    }
}

/**
 * Atomically record a failed verification attempt against a specific OTP row.
 *
 * Uses optimistic concurrency: the update only applies when `attempts` still
 * equals the value we read, so concurrent wrong guesses can't both write the
 * same incremented value (the classic read-then-write race). On a lost race we
 * re-read the current count. Returns the number of attempts remaining.
 *
 * The increment error is NOT swallowed: if we cannot record the attempt we
 * fail closed by reporting zero remaining attempts.
 */
async function registerFailedAttempt(otpId: string, knownAttempts: number): Promise<number> {
    const admin = getAdminClient()
    if (!admin) return 0

    const { data: updated, error } = await admin
        .from('otp_codes')
        .update({ attempts: knownAttempts + 1 })
        .eq('id', otpId)
        .eq('attempts', knownAttempts)
        .select('attempts, max_attempts')
        .maybeSingle()

    if (error) {
        console.error('[OTP] Failed to record attempt:', error.message)
        return 0 // fail closed — treat as no attempts remaining
    }

    if (updated) {
        return Math.max(0, updated.max_attempts - updated.attempts)
    }

    // Lost the optimistic-concurrency race — re-read the authoritative count.
    const { data: current, error: reReadError } = await admin
        .from('otp_codes')
        .select('attempts, max_attempts')
        .eq('id', otpId)
        .maybeSingle()

    if (reReadError || !current) {
        console.error('[OTP] Failed to re-read attempts after contended update:', reReadError?.message)
        return 0
    }

    return Math.max(0, current.max_attempts - current.attempts)
}

/**
 * @deprecated Failed-attempt accounting now happens atomically inside
 * `verifyOtp` (it increments the per-identifier counter and enforces the
 * lockout before comparing codes). This export is retained only so existing
 * callers keep compiling; it is intentionally a no-op to avoid double-counting
 * a single failed verification.
 *
 * The previous implementation matched on the submitted `code`, so a wrong guess
 * matched no row and never incremented — leaving brute-force unbounded — and it
 * swallowed write errors. Both issues are fixed in `verifyOtp`.
 */
export async function incrementOtpAttempt(
    _email: string,
    _code: string,
    _purpose: OtpPurpose
): Promise<void> {
    // No-op: see verifyOtp / registerFailedAttempt.
    void _email
    void _code
    void _purpose
}

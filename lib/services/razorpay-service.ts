import { createHmac, timingSafeEqual } from 'crypto'
import { getOptionalEnv } from '@/lib/env'
import { ExternalApiError, externalApiFetch } from '@/lib/services/external-api-fetch'

const RAZORPAY_BASE_URL = 'https://api.razorpay.com/v1'
const RAZORPAY_TIMEOUT_MS = 15_000

export type RazorpayJson = Record<string, unknown>

export function getRazorpayKeyId(): string | undefined {
    return getOptionalEnv('NEXT_PUBLIC_RAZORPAY_KEY_ID')
}

export function getRazorpaySecret(): string | undefined {
    return getOptionalEnv('RAZORPAY_KEY_SECRET')
}

export function isRazorpayConfigured(): boolean {
    const keyId = getRazorpayKeyId()
    const keySecret = getRazorpaySecret()
    return !!(
        keyId &&
        !keyId.includes('xxx') &&
        keySecret &&
        keySecret !== 'your_razorpay_secret_key_here'
    )
}

export function razorpayAuthHeader(): string {
    return Buffer.from(`${getRazorpayKeyId() ?? ''}:${getRazorpaySecret() ?? ''}`).toString('base64')
}

export function verifyRazorpaySignature(message: string, signature: string, secret: string): boolean {
    if (!secret || !signature) return false

    const generated = createHmac('sha256', secret)
        .update(message)
        .digest('hex')

    try {
        const expected = Buffer.from(generated)
        const received = Buffer.from(signature)
        if (expected.length !== received.length) return false
        return timingSafeEqual(expected, received)
    } catch {
        return false
    }
}

/**
 * Whether the explicit, opt-in fake/dev payment path is allowed.
 *
 * SECURITY: This must NEVER be keyed on NODE_ENV alone — Vercel preview /
 * staging / CI all run with NODE_ENV !== 'production', so keying on it there
 * would silently accept unsigned payment callbacks. The bypass is only allowed
 * when an operator explicitly sets ALLOW_FAKE_PAYMENTS=1 AND the secret is
 * genuinely absent. Otherwise we always fail closed.
 */
function fakePaymentsExplicitlyAllowed(): boolean {
    return process.env.ALLOW_FAKE_PAYMENTS === '1'
}

function razorpaySecretIsAbsent(secret: string | undefined): boolean {
    return !secret || secret === 'your_razorpay_secret_key_here'
}

export function verifySubscriptionPaymentSignature(
    paymentId: string,
    subscriptionId: string,
    signature: string
): boolean {
    const secret = getRazorpaySecret()
    if (razorpaySecretIsAbsent(secret)) {
        if (fakePaymentsExplicitlyAllowed()) {
            console.warn('[Payment] RAZORPAY_KEY_SECRET not configured - ALLOW_FAKE_PAYMENTS=1, skipping verification')
            return true
        }
        console.error('[Payment] RAZORPAY_KEY_SECRET not configured - rejecting payment (fail closed)')
        return false
    }

    return verifyRazorpaySignature(`${paymentId}|${subscriptionId}`, signature, secret as string)
}

export function verifyBookingPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string,
    logPrefix: string
): boolean {
    const secret = getRazorpaySecret()
    if (razorpaySecretIsAbsent(secret)) {
        if (fakePaymentsExplicitlyAllowed()) {
            console.warn(`[${logPrefix}/verify] RAZORPAY_KEY_SECRET not configured - ALLOW_FAKE_PAYMENTS=1, skipping signature check`)
            return true
        }
        console.error(`[${logPrefix}/verify] RAZORPAY_KEY_SECRET not configured - rejecting (fail closed)`)
        return false
    }

    return verifyRazorpaySignature(`${orderId}|${paymentId}`, signature, secret as string)
}

export function verifyRazorpayWebhookSignature(body: string, signature: string, secret: string): boolean {
    return verifyRazorpaySignature(body, signature, secret)
}

export async function razorpayApiFetch<T = RazorpayJson>(path: string, init?: RequestInit): Promise<T> {
    return externalApiFetch<T>({
        baseUrl: RAZORPAY_BASE_URL,
        providerName: 'Razorpay',
        path,
        headers: {
            Authorization: `Basic ${razorpayAuthHeader()}`,
            'Content-Type': 'application/json',
        },
        init,
        timeoutMs: RAZORPAY_TIMEOUT_MS,
    })
}

/**
 * Captured/authorized payment as returned by the Razorpay API.
 * Amounts are in paise. `status` is 'created' | 'authorized' | 'captured' | 'refunded' | 'failed'.
 */
export interface RazorpayPayment {
    id: string
    status: string
    amount: number
    currency: string
    order_id?: string | null
    invoice_id?: string | null
}

/**
 * Fetches a payment from Razorpay (server-side, authenticated via key id/secret).
 * Use this to independently confirm the captured amount/status before granting
 * paid features — never trust client-supplied amounts.
 */
export async function fetchRazorpayPayment(paymentId: string): Promise<RazorpayPayment> {
    return razorpayApiFetch<RazorpayPayment>(`/payments/${encodeURIComponent(paymentId)}`, {
        method: 'GET',
    })
}

/**
 * A Razorpay subscription as returned by the API. For subscription billing the
 * latest charge is exposed via the linked invoice; we read the subscription to
 * confirm it is active/charged.
 */
export interface RazorpaySubscription {
    id: string
    status: string
    plan_id?: string
    paid_count?: number
}

export async function fetchRazorpaySubscription(subscriptionId: string): Promise<RazorpaySubscription> {
    return razorpayApiFetch<RazorpaySubscription>(`/subscriptions/${encodeURIComponent(subscriptionId)}`, {
        method: 'GET',
    })
}

export function getRazorpayErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof ExternalApiError) {
        const body = error.bodyJson as { error?: { description?: string } } | undefined
        return body?.error?.description ?? fallback
    }
    return fallback
}

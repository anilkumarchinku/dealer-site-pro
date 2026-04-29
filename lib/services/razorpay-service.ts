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

export function verifySubscriptionPaymentSignature(
    paymentId: string,
    subscriptionId: string,
    signature: string
): boolean {
    const secret = getRazorpaySecret()
    if (!secret || secret === 'your_razorpay_secret_key_here') {
        if (process.env.NODE_ENV === 'production') {
            console.error('[Payment] RAZORPAY_KEY_SECRET not configured in production - rejecting payment')
            return false
        }
        console.warn('[Payment] RAZORPAY_KEY_SECRET not configured - skipping verification in dev')
        return true
    }

    return verifyRazorpaySignature(`${paymentId}|${subscriptionId}`, signature, secret)
}

export function verifyBookingPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string,
    logPrefix: string
): boolean {
    const secret = getRazorpaySecret()
    if (!secret || secret === 'your_razorpay_secret_key_here') {
        if (process.env.NODE_ENV === 'production') {
            console.error(`[${logPrefix}/verify] RAZORPAY_KEY_SECRET not configured - rejecting`)
            return false
        }
        console.warn(`[${logPrefix}/verify] Skipping signature check in dev`)
        return true
    }

    return verifyRazorpaySignature(`${orderId}|${paymentId}`, signature, secret)
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

export function getRazorpayErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof ExternalApiError) {
        const body = error.bodyJson as { error?: { description?: string } } | undefined
        return body?.error?.description ?? fallback
    }
    return fallback
}

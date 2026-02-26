'use client'

declare global {
    interface Window {
        Razorpay: new (options: object) => { open(): void }
    }
}

export interface RazorpaySuccessResponse {
    razorpay_payment_id: string
    razorpay_subscription_id: string
    razorpay_signature: string
}

/**
 * Generate a crypto-random UUID v4 for idempotency keys.
 * Falls back to Math.random if crypto.randomUUID is unavailable.
 */
export function generateIdempotencyKey(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID()
    }
    // Fallback for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

/**
 * Verify a Razorpay payment with the backend, using an idempotency key
 * to prevent duplicate processing.
 */
export async function verifyPaymentWithBackend(
    response: RazorpaySuccessResponse,
    idempotencyKey: string
): Promise<{ success: boolean; message?: string; error?: string; idempotent?: boolean }> {
    const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'idempotency-key': idempotencyKey,
        },
        body: JSON.stringify({
            orderId: response.razorpay_subscription_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            subscriptionId: response.razorpay_subscription_id,
        }),
    })
    return res.json()
}

function loadScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') { resolve(false); return }
        if (window.Razorpay) { resolve(true); return }
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}

export async function openRazorpayCheckout(opts: {
    subscriptionId: string
    tier: 'pro' | 'premium'
    prefill?: { name?: string; email?: string; contact?: string }
    onSuccess: (response: RazorpaySuccessResponse) => void
    onFailure: (error: { error: string }) => void
}): Promise<void> {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

    // MOCK MODE: when key is not configured, simulate a successful payment after a short delay
    if (!keyId || keyId.includes('xxx')) {
        console.warn('[MOCK] Razorpay not configured — simulating successful payment')
        await new Promise((resolve) => setTimeout(resolve, 1500))
        opts.onSuccess({
            razorpay_payment_id: `mock_pay_${Date.now()}`,
            razorpay_subscription_id: opts.subscriptionId,
            razorpay_signature: 'mock_signature',
        })
        return
    }

    const loaded = await loadScript()
    if (!loaded) {
        opts.onFailure({ error: 'Failed to load payment gateway. Please check your internet connection.' })
        return
    }

    const rzp = new window.Razorpay({
        key: keyId,
        subscription_id: opts.subscriptionId,
        name: 'DealerSite Pro',
        description: opts.tier === 'pro' ? 'PRO Plan – ₹499/month' : 'PREMIUM Plan – ₹999/month',
        handler: opts.onSuccess,
        prefill: opts.prefill ?? {},
        notes: { tier: opts.tier },
        theme: { color: opts.tier === 'pro' ? '#2563eb' : '#9333ea' },
        modal: {
            ondismiss: () => opts.onFailure({ error: 'Payment was cancelled.' }),
        },
    })

    rzp.open()
}

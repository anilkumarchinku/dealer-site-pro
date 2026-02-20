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

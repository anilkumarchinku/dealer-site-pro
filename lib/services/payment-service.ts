/**
 * Razorpay Payment Service
 * Handles subscription payments for PRO (₹499/mo) and PREMIUM (₹999/mo) tiers.
 * Uses Razorpay REST API via fetch — no npm SDK required.
 */

import { createHmac } from 'crypto'

export interface CreateSubscriptionParams {
    dealerId: string
    tier: 'pro' | 'premium'
    domainId?: string
}

export interface SubscriptionResult {
    success: boolean
    subscriptionId?: string
    orderId?: string
    error?: string
}

function razorpayAuth(): string {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    return Buffer.from(`${keyId}:${keySecret}`).toString('base64')
}

function isConfigured(): boolean {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    return !!(
        keyId && !keyId.includes('xxx') &&
        keySecret && keySecret !== 'your_razorpay_secret_key_here'
    )
}

/**
 * Creates a Razorpay subscription for PRO or PREMIUM tier.
 */
export async function createDomainSubscription(
    params: CreateSubscriptionParams
): Promise<SubscriptionResult> {
    const { dealerId, tier, domainId } = params

    if (!isConfigured()) {
        return { success: false, error: 'Payment gateway not configured. Please contact support.' }
    }

    const planIds: Record<string, string | undefined> = {
        pro: process.env.RAZORPAY_PRO_PLAN_ID,
        premium: process.env.RAZORPAY_PREMIUM_PLAN_ID,
    }

    const planId = planIds[tier]
    if (!planId || planId.startsWith('plan_xxx')) {
        return { success: false, error: `${tier.toUpperCase()} plan not configured. Please contact support.` }
    }

    try {
        const response = await fetch('https://api.razorpay.com/v1/subscriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${razorpayAuth()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plan_id: planId,
                customer_notify: 1,
                total_count: 120, // up to 10 years; cancel anytime
                quantity: 1,
                notes: {
                    dealer_id: dealerId,
                    domain_id: domainId ?? '',
                    tier,
                },
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            const msg = data?.error?.description ?? 'Failed to create subscription'
            console.error('Razorpay subscription error:', data)
            return { success: false, error: msg }
        }

        return {
            success: true,
            subscriptionId: data.id,
            orderId: data.id, // for subscriptions, orderId == subscriptionId
        }
    } catch (error) {
        console.error('Error calling Razorpay API:', error)
        return { success: false, error: 'Payment service unavailable. Please try again.' }
    }
}

/**
 * Verifies Razorpay payment signature for subscriptions.
 * Razorpay signs subscriptions as HMAC-SHA256(payment_id + "|" + subscription_id).
 */
export function verifyPaymentSignature(
    paymentId: string,
    subscriptionId: string,
    signature: string
): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret || secret === 'your_razorpay_secret_key_here') {
        console.warn('RAZORPAY_KEY_SECRET not configured — skipping signature verification')
        return true // fail-open in dev; remove this for strict prod
    }

    const generated = createHmac('sha256', secret)
        .update(`${paymentId}|${subscriptionId}`)
        .digest('hex')

    return generated === signature
}

/**
 * Razorpay Payment Service
 * Handles subscription payments for PRO (₹499/mo) and PREMIUM (₹999/mo) tiers.
 * Uses the shared Razorpay REST wrapper — no npm SDK required.
 */

import { getOptionalEnv } from '@/lib/env'
import {
    getRazorpayErrorMessage,
    isRazorpayConfigured,
    razorpayApiFetch,
    verifySubscriptionPaymentSignature,
} from '@/lib/services/razorpay-service'

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

/**
 * Creates a Razorpay subscription for PRO or PREMIUM tier.
 */
export async function createDomainSubscription(
    params: CreateSubscriptionParams
): Promise<SubscriptionResult> {
    const { dealerId, tier, domainId } = params

    // MOCK MODE: when Razorpay credentials are not configured, return fake subscription data for testing
    if (!isRazorpayConfigured()) {
        const mockId = `mock_sub_${Date.now()}`
        console.warn('[MOCK] Razorpay not configured — returning mock subscription:', mockId)
        return { success: true, subscriptionId: mockId, orderId: mockId }
    }

    const planIds: Record<string, string | undefined> = {
        pro: getOptionalEnv('RAZORPAY_PRO_PLAN_ID'),
        premium: getOptionalEnv('RAZORPAY_PREMIUM_PLAN_ID'),
    }

    const planId = planIds[tier]
    if (!planId || planId.startsWith('plan_xxx')) {
        const mockId = `mock_sub_${Date.now()}`
        console.warn('[MOCK] Razorpay plan not configured — returning mock subscription:', mockId)
        return { success: true, subscriptionId: mockId, orderId: mockId }
    }

    try {
        const data = await razorpayApiFetch<{ id: string }>('/subscriptions', {
            method: 'POST',
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

        return {
            success: true,
            subscriptionId: data.id,
            orderId: data.id, // for subscriptions, orderId == subscriptionId
        }
    } catch (error) {
        const msg = getRazorpayErrorMessage(error, 'Payment service unavailable. Please try again.')
        console.error('Error calling Razorpay API:', error)
        return { success: false, error: msg }
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
    return verifySubscriptionPaymentSignature(paymentId, subscriptionId, signature)
}

/** Expected prices in paise for each tier */
export const PLAN_PRICES_PAISE: Record<'pro' | 'premium', number> = {
    pro:     49900,  // ₹499
    premium: 99900,  // ₹999
}

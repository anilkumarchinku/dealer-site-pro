import { NextResponse } from 'next/server'
import { verifyPaymentSignature } from '@/lib/services/payment-service'
import { createRouteClient } from '@/lib/supabase-server'

/**
 * POST /api/payments/verify
 * Verifies Razorpay payment and activates subscription
 */
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { orderId, paymentId, signature, subscriptionId } = body

        if (!orderId || !paymentId || !signature) {
            return NextResponse.json(
                { success: false, error: 'Missing payment verification details' },
                { status: 400 }
            )
        }

        // Verify signature — Razorpay signs subscriptions as payment_id|subscription_id
        const isValid = verifyPaymentSignature(paymentId, subscriptionId ?? orderId, signature)

        if (!isValid) {
            return NextResponse.json(
                { success: false, error: 'Invalid payment signature' },
                { status: 400 }
            )
        }

        // Update subscription status to active
        const supabase = await createRouteClient()
        const { data: subscription, error: updateError } = await supabase
            .from('domain_subscriptions')
            .update({
                status: 'active',
                razorpay_payment_id: paymentId
            })
            .eq('razorpay_subscription_id', subscriptionId)
            .select()
            .single()

        if (updateError) {
            console.error('Error updating subscription:', updateError)
            return NextResponse.json(
                { success: false, error: 'Failed to activate subscription' },
                { status: 500 }
            )
        }

        // If domain_id exists, update domain status
        if (subscription.domain_id) {
            await supabase
                .from('domains')
                .update({ status: 'active' })
                .eq('id', subscription.domain_id)
        }

        return NextResponse.json({
            success: true,
            message: 'Payment verified and subscription activated'
        })
    } catch (error) {
        console.error('Error in POST /api/payments/verify:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

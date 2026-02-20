import { NextResponse } from 'next/server'
import { createDomainSubscription } from '@/lib/services/payment-service'
import { createRouteClient } from '@/lib/supabase-server'

/**
 * POST /api/payments/create-subscription
 * Creates a Razorpay subscription for PRO or PREMIUM tier
 */
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { dealerId, tier, domainId } = body

        if (!dealerId || !tier || !domainId) {
            return NextResponse.json(
                { success: false, error: 'Dealer ID, tier, and domain ID are required' },
                { status: 400 }
            )
        }

        if (!['pro', 'premium'].includes(tier)) {
            return NextResponse.json(
                { success: false, error: 'Invalid tier. Must be "pro" or "premium"' },
                { status: 400 }
            )
        }

        // Create Razorpay subscription
        const subscriptionResult = await createDomainSubscription({
            dealerId,
            tier,
            domainId
        })

        if (!subscriptionResult.success) {
            return NextResponse.json(
                { success: false, error: subscriptionResult.error },
                { status: 400 }
            )
        }

        // Save subscription to database
        const supabase = await createRouteClient()
        const { data: subscription, error: dbError } = await supabase
            .from('domain_subscriptions')
            .insert({
                domain_id: domainId,
                dealer_id: dealerId,
                plan: tier,
                status: 'trialing',
                razorpay_subscription_id: subscriptionResult.subscriptionId,
                current_period_start: new Date().toISOString(),
                current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            })
            .select()
            .single()

        if (dbError) {
            console.error('Error saving subscription:', dbError)
            return NextResponse.json(
                { success: false, error: 'Failed to save subscription' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            subscription,
            orderId: subscriptionResult.orderId,
            subscriptionId: subscriptionResult.subscriptionId
        })
    } catch (error) {
        console.error('Error in POST /api/payments/create-subscription:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

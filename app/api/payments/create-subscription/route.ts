import { NextRequest, NextResponse } from 'next/server'
import { createDomainSubscription } from '@/lib/services/payment-service'
import { requireAuth, requireDealerOwnership } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { createSubscriptionSchema, formatZodErrors } from '@/lib/validations/schemas'

/**
 * POST /api/payments/create-subscription
 * Creates a Razorpay subscription for PRO or PREMIUM tier.
 * Requires authenticated session — dealer and domain ownership are verified server-side.
 */
export async function POST(request: NextRequest) {
    try {
        // Rate limit: max 5 subscription attempts per IP per hour
        const rateLimit = await rateLimitOrNull('create_subscription', request, 5, 60 * 60 * 1000)
        if (rateLimit) return rateLimit

        const { user, supabase, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse

        const body = await request.json()

        // ── Validate with Zod ───────────────────────────────────────────────
        const parsed = createSubscriptionSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: formatZodErrors(parsed.error) },
                { status: 400 }
            )
        }
        const { dealerId, tier, domainId } = parsed.data

        // Verify the authenticated user owns the dealer account
        const { errorResponse: ownerErr } = await requireDealerOwnership(supabase, user.id, dealerId)
        if (ownerErr) return ownerErr

        // Verify the domain belongs to this dealer
        const { data: domain } = await supabase
            .from('domains')
            .select('id')
            .eq('id', domainId)
            .eq('dealer_id', dealerId)
            .single()

        if (!domain) {
            return NextResponse.json(
                { success: false, error: 'Domain not found or does not belong to your account' },
                { status: 403 }
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

        // Save subscription to database (reuse the authenticated supabase client)
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

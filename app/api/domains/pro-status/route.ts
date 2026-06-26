import { NextResponse } from 'next/server'
import {
    getActiveProDomainSubscription,
    isPaidDomainPlan,
    PRO_DOMAIN_PRICE_PAISE,
} from '@/lib/services/pro-domain-subscription-service'
import { requireDealerForRoute } from '@/lib/services/dealer-route-auth-service'

export async function GET() {
    try {
        const { dealer, supabase, errorResponse } = await requireDealerForRoute({
            body: { error: 'No dealer account found for this user' },
        })
        if (errorResponse) return errorResponse

        const activeSubscription = await getActiveProDomainSubscription(supabase, dealer.id)

        const { data: latestSubscription } = await supabase
            .from('domain_subscriptions')
            .select('id, dealer_id, domain_id, plan, tier, status, current_period_end, razorpay_subscription_id')
            .eq('dealer_id', dealer.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        const subscription = activeSubscription ?? latestSubscription ?? null

        return NextResponse.json({
            success: true,
            pro: {
                active: !!activeSubscription,
                pricePaise: PRO_DOMAIN_PRICE_PAISE,
                plan: subscription && isPaidDomainPlan(subscription) ? subscription.plan : 'free',
                status: subscription?.status ?? 'free',
                subscription,
            },
        })
    } catch (error) {
        console.error('Error in GET /api/domains/pro-status:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

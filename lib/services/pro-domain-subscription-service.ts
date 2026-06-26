import type { Database } from '@/lib/database.types'
import type { RouteSupabaseClient } from '@/lib/supabase-server'

type DomainSubscriptionRow = Database['public']['Tables']['domain_subscriptions']['Row']
type DomainSubscriptionClient = Pick<RouteSupabaseClient, 'from'>

export type ProDomainSubscription = Pick<
    DomainSubscriptionRow,
    | 'id'
    | 'dealer_id'
    | 'domain_id'
    | 'plan'
    | 'tier'
    | 'status'
    | 'current_period_end'
    | 'razorpay_subscription_id'
>

export const PRO_DOMAIN_PRICE_PAISE = 49900

export function isPaidDomainPlan(subscription: Pick<DomainSubscriptionRow, 'plan' | 'tier'>): boolean {
    return subscription.plan === 'pro' ||
        subscription.plan === 'premium' ||
        subscription.tier === 'pro' ||
        subscription.tier === 'premium'
}

export function isActiveProDomainSubscription(subscription: Pick<DomainSubscriptionRow, 'plan' | 'tier' | 'status'>): boolean {
    return subscription.status === 'active' && isPaidDomainPlan(subscription)
}

export async function getActiveProDomainSubscription(
    supabase: DomainSubscriptionClient,
    dealerId: string,
    domainId?: string
): Promise<ProDomainSubscription | null> {
    let query = supabase
        .from('domain_subscriptions')
        .select('id, dealer_id, domain_id, plan, tier, status, current_period_end, razorpay_subscription_id')
        .eq('dealer_id', dealerId)
        .eq('status', 'active')
        .in('plan', ['pro', 'premium'])
        .order('created_at', { ascending: false })

    if (domainId) {
        query = query.eq('domain_id', domainId)
    }

    const { data, error } = await query.limit(1).maybeSingle()

    if (error) {
        console.error('[pro-domain] Failed to load active subscription:', error)
        return null
    }

    return data as ProDomainSubscription | null
}

export async function requireActiveProDomainSubscription(
    supabase: DomainSubscriptionClient,
    dealerId: string,
    domainId: string
): Promise<{ subscription: ProDomainSubscription | null; error: string | null }> {
    const subscription = await getActiveProDomainSubscription(supabase, dealerId, domainId)

    if (!subscription || !isActiveProDomainSubscription(subscription)) {
        return {
            subscription: null,
            error: 'Activate the ₹499/month PRO plan before connecting this custom domain.',
        }
    }

    return { subscription, error: null }
}

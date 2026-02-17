import { createBrowserClient } from '@supabase/ssr'

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check if Supabase is properly configured
const isSupabaseConfigured: boolean =
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key-here' &&
    !supabaseUrl.includes('placeholder')

// createBrowserClient (from @supabase/ssr) syncs sessions to cookies
// so the middleware can read them server-side — unlike the plain createClient
export const supabase = createBrowserClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
)

// Helper function to check if Supabase is configured
export function isSupabaseReady(): boolean {
    return isSupabaseConfigured
}

// Helper function to get configuration error
export function getSupabaseConfigError(): string | null {
    if (!isSupabaseConfigured) {
        return 'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    }
    return null
}

// Database types
export type DomainType = 'subdomain' | 'custom' | 'managed'
export type DomainStatus = 'pending' | 'verifying' | 'active' | 'failed' | 'expired'
export type SSLStatus = 'pending' | 'provisioning' | 'active' | 'expired' | 'failed'
export type TemplateStyle = 'luxury' | 'family' | 'sporty' | 'professional'

export interface Domain {
    id: string
    dealer_id: string
    domain: string
    slug: string
    type: DomainType
    template_id?: TemplateStyle  // Template/style for the website
    status: DomainStatus
    ssl_status: SSLStatus
    is_primary: boolean
    dns_verified_at?: string
    ssl_provisioned_at?: string
    ssl_expires_at?: string
    last_checked_at?: string
    registrar?: string
    registration_expires_at?: string
    auto_renew: boolean
    created_at: string
    updated_at: string
}

export interface DomainVerification {
    id: string
    domain_id: string
    record_type: 'A' | 'CNAME' | 'TXT'
    record_name: string
    expected_value: string
    actual_value?: string
    is_verified: boolean
    error_message?: string
    checked_at: string
    created_at: string
}

export interface DomainSubscription {
    id: string
    domain_id: string
    dealer_id: string
    plan: 'pro' | 'premium'
    price_monthly: number
    billing_cycle: 'monthly' | 'annual'
    razorpay_subscription_id?: string
    razorpay_plan_id?: string
    razorpay_customer_id?: string
    status: 'active' | 'cancelled' | 'past_due' | 'expired'
    current_period_start?: string
    current_period_end?: string
    cancelled_at?: string
    cancel_reason?: string
    created_at: string
    updated_at: string
}

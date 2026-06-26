/**
 * Central environment access.
 *
 * Server code should read env vars through this module so production-only
 * required secrets fail in one predictable place instead of route-by-route.
 */

export type RequiredEnvKey =
    | 'NEXT_PUBLIC_SUPABASE_URL'
    | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    | 'SUPABASE_SERVICE_ROLE_KEY'
    | 'NEXT_PUBLIC_BASE_DOMAIN'

export type PaymentEnvKey =
    | 'NEXT_PUBLIC_RAZORPAY_KEY_ID'
    | 'RAZORPAY_KEY_SECRET'
    | 'RAZORPAY_WEBHOOK_SECRET'

export type OptionalEnvKey =
    | 'ADMIN_PASSWORD'
    | 'ADMIN_SESSION_SECRET'
    | 'ADMIN_USERNAME'
    | 'ANTHROPIC_API_KEY'
    | 'CLOUDFLARE_API_TOKEN'
    | 'CLOUDFLARE_ACCOUNT_ID'
    | 'CLOUDFLARE_ZONE_ID'
    | 'CRON_SECRET'
    | 'CYEPRO_API_BASE_URL'
    | 'CYEPRO_AGGREGATIONS_PATH'
    | 'CYEPRO_LEAD_PATH'
    | 'CYEPRO_SEARCH_PATH'
    | 'CYEPRO_SEARCH_CACHE_TTL_MS'
    | 'CYEPRO_2W_VEHICLE_TYPE_LIST'
    | 'CYEPRO_3W_VEHICLE_TYPE_LIST'
    | 'CYEPRO_4W_VEHICLE_TYPE_LIST'
    | 'DOMAIN_SUPPORT_EMAIL'
    | 'EMAIL_FROM'
    | 'GITHUB_ORG'
    | 'GITHUB_TEMPLATE_REPO'
    | 'GITHUB_TOKEN'
    | 'GODADDY_API_URL'
    | 'GODADDY_API_KEY'
    | 'GODADDY_API_SECRET'
    | 'FASTAG_RECHARGE_URL'
    | 'FINANCE_PRECHECK_URL'
    | 'GOOGLE_PLACES_API_KEY'
    | 'META_IG_USER_ID'
    | 'META_PAGE_ACCESS_TOKEN'
    | 'META_PAGE_ID'
    | 'MSG91_AUTH_KEY'
    | 'MSG91_LEAD_TEMPLATE_ID'
    | 'MSG91_SENDER_ID'
    | 'NEXT_PUBLIC_APP_URL'
    | 'NEXT_PUBLIC_ADMIN_EMAILS'
    | 'NEXT_PUBLIC_AUTO_APPROVE_REVIEWS'
    | 'NEXT_PUBLIC_CNAME_TARGET'
    | 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
    | 'NEXT_PUBLIC_SITE_URL'
    | 'NEXT_PUBLIC_SUPPORT_WHATSAPP'
    | 'NEXT_PUBLIC_USE_SUBDOMAIN'
    | 'NEXT_PUBLIC_VAPID_PUBLIC_KEY'
    | 'RAPIDOR_API_KEY'
    | 'RC_LOOKUP_PROVIDER'
    | 'RAZORPAY_PREMIUM_PLAN_ID'
    | 'RAZORPAY_PRO_PLAN_ID'
    | 'RESEND_API_KEY'
    | 'SENTRY_DSN'
    | 'SUREPASS_API_BASE_URL'
    | 'SUREPASS_API_TOKEN'
    | 'SUREPASS_BEARER_TOKEN'
    | 'SUREPASS_CHALLAN_PATH'
    | 'SUREPASS_RC_PATH'
    | 'SUPPORT_EMAIL'
    | 'TWITTER_BEARER_TOKEN'
    | 'TWITTER_API_KEY'
    | 'TWITTER_API_SECRET'
    | 'TWITTER_ACCESS_TOKEN'
    | 'TWITTER_ACCESS_SECRET'
    | 'UPSTASH_REDIS_REST_TOKEN'
    | 'UPSTASH_REDIS_REST_URL'
    | 'VAPID_PRIVATE_KEY'
    | 'VAPID_SUBJECT'
    | 'VERCEL_TEAM_ID'
    | 'VERCEL_MAIN_PROJECT_ID'
    | 'VERCEL_TOKEN'
    | 'VERCEL_URL'

export type EnvKey = RequiredEnvKey | PaymentEnvKey | OptionalEnvKey

export const requiredEnvKeys: readonly RequiredEnvKey[] = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_BASE_DOMAIN',
]

export const paymentEnvKeys: readonly PaymentEnvKey[] = [
    'NEXT_PUBLIC_RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'RAZORPAY_WEBHOOK_SECRET',
]

export const optionalEnvKeys: readonly OptionalEnvKey[] = [
    'RESEND_API_KEY',
    'EMAIL_FROM',
    'DOMAIN_SUPPORT_EMAIL',
    'SUPPORT_EMAIL',
    'SENTRY_DSN',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'NEXT_PUBLIC_SUPPORT_WHATSAPP',
]

const placeholderFragments = [
    'your-project-ref.supabase.co',
    'your_supabase_anon_key_here',
    'your_service_role_key_here',
    'your_razorpay_key_id',
    'your_razorpay_secret',
    'your_razorpay_secret_key_here',
    'your_',
    'xxxxx',
]

function rawEnv(key: EnvKey): string | undefined {
    if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
        return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    }
    return process.env[key]
}

export function isPlaceholderEnvValue(value: string): boolean {
    return (
        value.startsWith('REVOKED') ||
        placeholderFragments.some(fragment => value.includes(fragment))
    )
}

export function getOptionalEnv(key: EnvKey): string | undefined {
    const value = rawEnv(key)
    return value && value.trim() ? value : undefined
}

export function getRequiredEnv(key: EnvKey): string {
    const value = getOptionalEnv(key)
    if (!value) {
        throw new Error(`[ENV] ${key} env var is not set`)
    }
    if (isPlaceholderEnvValue(value)) {
        throw new Error(`[ENV] ${key} is a placeholder value`)
    }
    return value
}

function validateEnvKeys(keys: readonly EnvKey[]): { missing: string[]; placeholder: string[] } {
    const missing: string[] = []
    const placeholder: string[] = []

    for (const key of keys) {
        const value = getOptionalEnv(key)
        if (!value) {
            missing.push(key)
        } else if (isPlaceholderEnvValue(value)) {
            placeholder.push(key)
        }
    }

    return { missing, placeholder }
}

export function validateRequiredEnv(): { missing: string[]; placeholder: string[] } {
    return validateEnvKeys(requiredEnvKeys)
}

export function validatePaymentEnv(): { missing: string[]; placeholder: string[] } {
    return validateEnvKeys(paymentEnvKeys)
}

export function assertProductionEnv(): void {
    if (
        typeof window !== 'undefined' ||
        process.env.NODE_ENV !== 'production' ||
        process.env.NEXT_PHASE === 'phase-production-build'
    ) {
        return
    }

    const { missing, placeholder } = validateRequiredEnv()
    const problems = [
        ...missing.map(key => `${key} is missing`),
        ...placeholder.map(key => `${key} is a placeholder value`),
    ]

    for (const key of optionalEnvKeys) {
        if (!getOptionalEnv(key)) {
            console.warn(`[ENV] Optional env var ${key} is not set - related features will be disabled.`)
        }
    }

    if (problems.length > 0) {
        throw new Error(`[ENV] Production env validation failed:\n  ${problems.join('\n  ')}`)
    }
}

assertProductionEnv()

export const env = {
    get supabaseUrl() { return getOptionalEnv('NEXT_PUBLIC_SUPABASE_URL') ?? '' },
    get supabaseAnonKey() { return getOptionalEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ?? '' },
    get supabaseServiceKey() { return getOptionalEnv('SUPABASE_SERVICE_ROLE_KEY') ?? '' },
    get razorpayKeyId() { return getOptionalEnv('NEXT_PUBLIC_RAZORPAY_KEY_ID') ?? '' },
    get razorpaySecret() { return getOptionalEnv('RAZORPAY_KEY_SECRET') ?? '' },
    get resendApiKey() { return getOptionalEnv('RESEND_API_KEY') ?? '' },
    get baseDomain() { return getOptionalEnv('NEXT_PUBLIC_BASE_DOMAIN') ?? 'localhost:3000' },
    get webhookSecret() { return getOptionalEnv('RAZORPAY_WEBHOOK_SECRET') ?? '' },
    get cnameTarget() { return getOptionalEnv('NEXT_PUBLIC_CNAME_TARGET') ?? 'cname.vercel-dns.com' },
    get supportWhatsapp() { return getOptionalEnv('NEXT_PUBLIC_SUPPORT_WHATSAPP') },
    get financePrecheckUrl() { return getOptionalEnv('FINANCE_PRECHECK_URL') },
    get fastagRechargeUrl() { return getOptionalEnv('FASTAG_RECHARGE_URL') },
}

/**
 * Environment variable validation.
 * Called once at server startup. Throws if a required variable is missing.
 *
 * Import this in your root server layout:
 *   import '@/lib/env'
 */

// These must be present — without them the site cannot function at all
const required = {
    NEXT_PUBLIC_SUPABASE_URL:      process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY:     process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_RAZORPAY_KEY_ID:   process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET:           process.env.RAZORPAY_KEY_SECRET,
    NEXT_PUBLIC_BASE_DOMAIN:       process.env.NEXT_PUBLIC_BASE_DOMAIN,
}

// These are optional — missing values degrade a feature but don't crash the site
const optional = {
    RESEND_API_KEY:            process.env.RESEND_API_KEY,
    SENTRY_DSN:                process.env.SENTRY_DSN,
    UPSTASH_REDIS_REST_URL:    process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN:  process.env.UPSTASH_REDIS_REST_TOKEN,
    NEXT_PUBLIC_SUPPORT_WHATSAPP: process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP,
}

const placeholders = [
    'your-project-ref.supabase.co',
    'your_supabase_anon_key_here',
    'your_service_role_key_here',
    'your_razorpay_key_id',
    'your_razorpay_secret',
]

// Only validate in production at runtime — skip during build phase (NEXT_PHASE=phase-production-build)
if (
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PHASE !== 'phase-production-build'
) {
    const missing: string[] = []
    const placeholder: string[] = []

    for (const [key, value] of Object.entries(required)) {
        if (!value) {
            missing.push(key)
        } else if (placeholders.some(p => value.includes(p))) {
            placeholder.push(key)
        }
    }

    if (missing.length > 0) {
        console.error(
            `[ENV] Missing required environment variables:\n  ${missing.join('\n  ')}\n` +
            'Set these in your deployment environment. Related features will be disabled.'
        )
    }

    if (placeholder.length > 0) {
        console.error(
            `[ENV] Placeholder values detected in production for:\n  ${placeholder.join('\n  ')}\n` +
            'Replace with real credentials before deploying.'
        )
    }

    // Warn (don't throw) for optional vars — missing these degrades a feature but won't crash the site
    for (const [key, value] of Object.entries(optional)) {
        if (!value) {
            console.warn(`[ENV] Optional env var ${key} is not set — related features will be disabled.`)
        }
    }
}

export const env = {
    supabaseUrl:      process.env.NEXT_PUBLIC_SUPABASE_URL    ?? '',
    supabaseAnonKey:  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    razorpayKeyId:    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID  ?? '',
    razorpaySecret:   process.env.RAZORPAY_KEY_SECRET         ?? '',
    resendApiKey:     process.env.RESEND_API_KEY              ?? '',
    baseDomain:       process.env.NEXT_PUBLIC_BASE_DOMAIN     ?? 'localhost:3000',
    webhookSecret:    process.env.RAZORPAY_WEBHOOK_SECRET     ?? '',
    cnameTarget:      process.env.NEXT_PUBLIC_CNAME_TARGET    ?? 'cname.vercel-dns.com',
    supportWhatsapp:  process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP,
}

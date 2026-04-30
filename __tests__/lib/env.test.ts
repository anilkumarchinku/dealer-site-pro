import {
    assertProductionEnv,
    env,
    getOptionalEnv,
    getRequiredEnv,
    validatePaymentEnv,
    validateRequiredEnv,
} from '@/lib/env'

const managedKeys = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'RAZORPAY_WEBHOOK_SECRET',
    'NEXT_PUBLIC_BASE_DOMAIN',
    'NODE_ENV',
    'NEXT_PHASE',
] as const

const originalEnv = { ...process.env }

describe('env helpers', () => {
    beforeEach(() => {
        for (const key of managedKeys) {
            delete process.env[key]
        }
    })

    afterEach(() => {
        vi.unstubAllEnvs()
        vi.unstubAllGlobals()
    })

    afterAll(() => {
        process.env = originalEnv
    })

    it('returns undefined for missing optional env values', () => {
        expect(getOptionalEnv('RESEND_API_KEY')).toBeUndefined()
    })

    it('throws for missing required env values', () => {
        expect(() => getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL')).toThrow('NEXT_PUBLIC_SUPABASE_URL')
    })

    it('throws for placeholder required env values', () => {
        process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://your-project-ref.supabase.co'

        expect(() => getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL')).toThrow('placeholder')
    })

    it('reads env getters dynamically', () => {
        process.env.NEXT_PUBLIC_BASE_DOMAIN = 'example.com'

        expect(env.baseDomain).toBe('example.com')
    })

    it('reports all missing production-required keys', () => {
        const result = validateRequiredEnv()

        expect(result.missing).toContain('NEXT_PUBLIC_SUPABASE_URL')
        expect(result.missing).toContain('SUPABASE_SERVICE_ROLE_KEY')
        expect(result.missing).not.toContain('RAZORPAY_WEBHOOK_SECRET')
    })

    it('tracks payment env separately from public runtime startup checks', () => {
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID = 'your_razorpay_key_id'
        process.env.RAZORPAY_KEY_SECRET = 'secret_live'

        const result = validatePaymentEnv()

        expect(result.missing).toContain('RAZORPAY_WEBHOOK_SECRET')
        expect(result.placeholder).toContain('NEXT_PUBLIC_RAZORPAY_KEY_ID')
    })

    it('accepts the Supabase publishable key as the public client key alias', () => {
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_demo'

        expect(getOptionalEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')).toBe('sb_publishable_demo')
        expect(getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')).toBe('sb_publishable_demo')
    })

    it('fails fast in production runtime when required env is missing', () => {
        vi.stubEnv('NODE_ENV', 'production')
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

        expect(() => assertProductionEnv()).toThrow('Production env validation failed')

        warn.mockRestore()
    })

    it('does not block production startup for missing payment-only env values', () => {
        vi.stubEnv('NODE_ENV', 'production')
        process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://demo.supabase.co'
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon_key'
        process.env.SUPABASE_SERVICE_ROLE_KEY = 'service_role_key'
        process.env.NEXT_PUBLIC_BASE_DOMAIN = 'indrav.in'
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID = 'your_razorpay_key_id'
        process.env.RAZORPAY_KEY_SECRET = 'your_razorpay_secret_key_here'
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

        expect(() => assertProductionEnv()).not.toThrow()

        warn.mockRestore()
    })

    it('does not throw production server-secret validation in the browser bundle', () => {
        vi.stubEnv('NODE_ENV', 'production')
        vi.stubGlobal('window', {})

        expect(() => assertProductionEnv()).not.toThrow()
    })
})

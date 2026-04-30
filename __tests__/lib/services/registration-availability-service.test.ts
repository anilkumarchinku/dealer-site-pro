import {
    checkRegistrationAvailability,
    formatRegistrationPhone,
    getRegistrationMobileDigits,
    normalizeRegistrationEmail,
    REGISTRATION_PASSWORD_MIN_LENGTH,
    validateRegistrationMobileNumber,
    type RegistrationAdminClient,
} from '@/lib/services/registration-availability-service'

function createMockSupabase(options?: {
    authUsers?: Array<{ email?: string | null }>
    dealerEmailRows?: Array<{ id: string }>
    dealerPhoneRows?: Array<{ id: string }>
}) {
    const authUsers = options?.authUsers ?? []
    const dealerEmailRows = options?.dealerEmailRows ?? []
    const dealerPhoneRows = options?.dealerPhoneRows ?? []
    const queries: Array<{ field: string; pattern: string }> = []

    const supabase = {
        auth: {
            admin: {
                listUsers: vi.fn().mockResolvedValue({
                    data:  { users: authUsers, lastPage: 1 },
                    error: null,
                }),
            },
        },
        from: vi.fn(() => {
            let field = ''
            const builder = {
                select: vi.fn(() => builder),
                ilike: vi.fn((nextField: string, pattern: string) => {
                    field = nextField
                    queries.push({ field, pattern })
                    return builder
                }),
                limit: vi.fn(async () => ({
                    data:  field === 'email' ? dealerEmailRows : dealerPhoneRows,
                    error: null,
                })),
            }
            return builder
        }),
    } as unknown as RegistrationAdminClient

    return { supabase, queries }
}

describe('registration availability service', () => {
    it('normalizes registration input for the signup flow', () => {
        expect(REGISTRATION_PASSWORD_MIN_LENGTH).toBe(8)
        expect(normalizeRegistrationEmail(' OWNER@Example.COM ')).toBe('owner@example.com')
        expect(getRegistrationMobileDigits('+91 98765-43210')).toBe('919876543210')
        expect(formatRegistrationPhone('98765 43210')).toBe('+919876543210')
    })

    it('requires a 10 digit Indian mobile number', () => {
        expect(validateRegistrationMobileNumber('9876543210')).toBeNull()
        expect(validateRegistrationMobileNumber('987654321')).toBe('Mobile number must be exactly 10 digits')
        expect(validateRegistrationMobileNumber('98765432101')).toBe('Mobile number must be exactly 10 digits')
        expect(validateRegistrationMobileNumber('5876543210')).toBe('Mobile number must start with 6, 7, 8, or 9')
    })

    it('blocks registration when auth already has the email', async () => {
        const { supabase } = createMockSupabase({
            authUsers: [{ email: 'owner@example.com' }],
        })

        await expect(checkRegistrationAvailability(supabase, {
            email:        'Owner@Example.com',
            mobileNumber: '9876543210',
        })).resolves.toEqual({
            available: false,
            field:     'email',
            error:     'This email is already registered. Please login instead.',
        })
    })

    it('blocks registration when a dealer already has the email', async () => {
        const { supabase } = createMockSupabase({
            dealerEmailRows: [{ id: 'dealer_1' }],
        })

        const result = await checkRegistrationAvailability(supabase, {
            email:        'owner@example.com',
            mobileNumber: '9876543210',
        })

        expect(result).toMatchObject({ available: false, field: 'email' })
    })

    it('blocks registration when a dealer already has the mobile number', async () => {
        const { supabase, queries } = createMockSupabase({
            dealerPhoneRows: [{ id: 'dealer_1' }],
        })

        const result = await checkRegistrationAvailability(supabase, {
            email:        'owner@example.com',
            mobileNumber: '9876543210',
        })

        expect(result).toMatchObject({ available: false, field: 'mobileNumber' })
        expect(queries).toContainEqual({ field: 'phone', pattern: '%9876543210' })
    })

    it('allows registration when email and mobile number are unused', async () => {
        const { supabase } = createMockSupabase()

        await expect(checkRegistrationAvailability(supabase, {
            email:        'owner@example.com',
            mobileNumber: '9876543210',
        })).resolves.toEqual({ available: true })
    })
})

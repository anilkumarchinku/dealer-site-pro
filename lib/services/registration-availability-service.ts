import type { createAdminClient } from '@/lib/supabase-server'

export const REGISTRATION_PASSWORD_MIN_LENGTH = 8

export type RegistrationConflictField = 'email' | 'mobileNumber'

export type RegistrationAvailabilityResult =
    | { available: true }
    | { available: false; field: RegistrationConflictField; error: string }

export type RegistrationAdminClient = ReturnType<typeof createAdminClient>

export function normalizeRegistrationEmail(email: string): string {
    return email.trim().toLowerCase()
}

export function getRegistrationMobileDigits(mobileNumber: string): string {
    return mobileNumber.replace(/\D/g, '')
}

export function validateRegistrationMobileNumber(mobileNumber: string): string | null {
    const digits = getRegistrationMobileDigits(mobileNumber)
    if (!digits) return 'Mobile number is required'
    if (!/^\d{10}$/.test(digits)) return 'Mobile number must be exactly 10 digits'
    if (!/^[6-9]/.test(digits)) return 'Mobile number must start with 6, 7, 8, or 9'
    return null
}

export function formatRegistrationPhone(mobileNumber: string): string {
    return `+91${getRegistrationMobileDigits(mobileNumber)}`
}

async function authEmailExists(supabase: RegistrationAdminClient, email: string): Promise<boolean> {
    const perPage = 1000
    let page = 1
    let lastPage: number | null = null

    do {
        const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
        if (error) throw error

        if (data.users.some((user) => user.email?.trim().toLowerCase() === email)) {
            return true
        }

        lastPage = typeof data.lastPage === 'number' && data.lastPage > 0 ? data.lastPage : page
        page += 1
    } while (page <= lastPage)

    return false
}

async function dealerEmailExists(supabase: RegistrationAdminClient, email: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('dealers')
        .select('id')
        .ilike('email', email)
        .limit(1)

    if (error) throw error
    return Boolean(data?.length)
}

async function dealerPhoneExists(supabase: RegistrationAdminClient, mobileNumber: string): Promise<boolean> {
    const digits = getRegistrationMobileDigits(mobileNumber)
    const { data, error } = await supabase
        .from('dealers')
        .select('id')
        .ilike('phone', `%${digits}`)
        .limit(1)

    if (error) throw error
    return Boolean(data?.length)
}

export async function checkRegistrationAvailability(
    supabase: RegistrationAdminClient,
    input: { email: string; mobileNumber: string }
): Promise<RegistrationAvailabilityResult> {
    const email = normalizeRegistrationEmail(input.email)
    const mobileError = validateRegistrationMobileNumber(input.mobileNumber)

    if (mobileError) {
        return { available: false, field: 'mobileNumber', error: mobileError }
    }

    if (await authEmailExists(supabase, email) || await dealerEmailExists(supabase, email)) {
        return {
            available: false,
            field:     'email',
            error:     'This email is already registered. Please login instead.',
        }
    }

    if (await dealerPhoneExists(supabase, input.mobileNumber)) {
        return {
            available: false,
            field:     'mobileNumber',
            error:     'This mobile number is already registered. Please use another number or login instead.',
        }
    }

    return { available: true }
}

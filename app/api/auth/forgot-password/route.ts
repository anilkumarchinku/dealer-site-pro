import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { createAdminClient } from '@/lib/supabase-server'
import { getOptionalEnv } from '@/lib/env'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import {
    getRegistrationMobileDigits,
    normalizeRegistrationEmail,
    validateRegistrationMobileNumber,
} from '@/lib/services/registration-availability-service'

const forgotPasswordSchema = z.object({
    identifier: z.string().trim().min(1, 'Enter your email or mobile number'),
})

function isEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

async function findAuthEmail(admin: ReturnType<typeof createAdminClient>, email: string) {
    const target = normalizeRegistrationEmail(email)
    const perPage = 1000
    let page = 1
    let lastPage: number | null = null

    do {
        const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
        if (error) throw error

        const match = data.users.find((user) => user.email?.trim().toLowerCase() === target)
        if (match?.email) return match.email.trim().toLowerCase()

        lastPage = typeof data.lastPage === 'number' && data.lastPage > 0 ? data.lastPage : page
        page += 1
    } while (page <= lastPage)

    return null
}

async function findDealerEmailByPhone(admin: ReturnType<typeof createAdminClient>, phone: string) {
    const digits = getRegistrationMobileDigits(phone)
    const { data: dealer, error } = await admin
        .from('dealers')
        .select('email, user_id')
        .ilike('phone', `%${digits}`)
        .limit(1)
        .maybeSingle()

    if (error) throw error
    if (!dealer) return null
    if (dealer.email) return dealer.email.trim().toLowerCase()

    if (dealer.user_id) {
        const { data, error: userError } = await admin.auth.admin.getUserById(dealer.user_id)
        if (userError) throw userError
        return data.user?.email?.trim().toLowerCase() ?? null
    }

    return null
}

async function findDealerEmailByEmail(admin: ReturnType<typeof createAdminClient>, email: string) {
    const target = normalizeRegistrationEmail(email)
    const { data: dealer, error } = await admin
        .from('dealers')
        .select('email, user_id')
        .ilike('email', target)
        .limit(1)
        .maybeSingle()

    if (error) throw error
    if (!dealer) return null
    if (dealer.email) return dealer.email.trim().toLowerCase()

    if (dealer.user_id) {
        const { data, error: userError } = await admin.auth.admin.getUserById(dealer.user_id)
        if (userError) throw userError
        return data.user?.email?.trim().toLowerCase() ?? null
    }

    return null
}

export async function POST(request: NextRequest) {
    const rateLimit = await rateLimitOrNull('forgot_password', request, 5, 15 * 60 * 1000)
    if (rateLimit) return rateLimit

    try {
        const parsed = forgotPasswordSchema.safeParse(await request.json())
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 })
        }

        const identifier = parsed.data.identifier
        const admin = createAdminClient()
        const origin = getOptionalEnv('NEXT_PUBLIC_APP_URL')
            ?? getOptionalEnv('NEXT_PUBLIC_SITE_URL')
            ?? new URL(request.url).origin
        const redirectTo = `${origin}/auth/callback?next=/auth/update-password`

        let email: string | null = null

        if (isEmail(identifier)) {
            email = await findAuthEmail(admin, identifier) ?? await findDealerEmailByEmail(admin, identifier)
        } else {
            const phoneError = validateRegistrationMobileNumber(identifier)
            if (phoneError) {
                return NextResponse.json({ error: 'Enter a valid email or 10-digit mobile number' }, { status: 400 })
            }
            email = await findDealerEmailByPhone(admin, identifier)
        }

        if (!email) {
            return NextResponse.json({
                success: false,
                message: 'No account is linked to those details. Please check the email or mobile number.',
            }, { status: 404 })
        }

        const { error } = await admin.auth.resetPasswordForEmail(email, { redirectTo })
        if (error) throw error

        return NextResponse.json({
            success: true,
            email,
            message: `Account found. Password reset link sent to ${email}.`,
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.error('[/api/auth/forgot-password] Error:', message)
        return NextResponse.json({ error: 'Could not start password reset. Please try again.' }, { status: 500 })
    }
}

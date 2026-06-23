import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase-server'
import { rateLimitOrNull } from '@/lib/utils/rate-limiter'
import { email as emailSchema, formatZodErrors } from '@/lib/validations/schemas'
import { checkRegistrationAvailability } from '@/lib/services/registration-availability-service'

const registrationAvailabilitySchema = z.object({
    email:        emailSchema,
    mobileNumber: z.string().trim().min(1, 'Mobile number is required'),
})

export async function POST(request: NextRequest) {
    const rateLimit = await rateLimitOrNull('registration_availability', request, 20, 15 * 60 * 1000)
    if (rateLimit) return rateLimit

    try {
        const body = await request.json()
        const parsed = registrationAvailabilitySchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { available: false, error: formatZodErrors(parsed.error) },
                { status: 400 }
            )
        }

        const result = await checkRegistrationAvailability(createAdminClient(), parsed.data)

        if (!result.available) {
            return NextResponse.json(result, { status: 409 })
        }

        return NextResponse.json(result)
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error)
        console.error('[/api/auth/registration-availability] Error:', msg)

        // A missing/placeholder env var (e.g. SUPABASE_SERVICE_ROLE_KEY) is a server
        // *configuration* problem, not a transient failure. getRequiredEnv throws
        // messages prefixed with "[ENV]". Surface those as 503 so the real cause is
        // not masked behind a generic "try again" message (which silently hid a
        // missing service-role key — see Gotchas). The full message is logged above;
        // the client message intentionally omits the key name.
        if (msg.startsWith('[ENV]')) {
            return NextResponse.json(
                { available: false, error: 'Registration is temporarily unavailable due to a server configuration issue. Please try again later.' },
                { status: 503 }
            )
        }

        return NextResponse.json(
            { available: false, error: 'Could not validate registration details. Please try again.' },
            { status: 500 }
        )
    }
}

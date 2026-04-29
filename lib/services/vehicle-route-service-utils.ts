import { NextRequest, NextResponse } from 'next/server'
import { getDealerForUser, requireAuth } from '@/lib/supabase-server'

export type SafeParseResult<T> =
    | { success: true; data: T }
    | { success: false; error: unknown }

type DealerScopedStatusUpdateOptions<TStatus extends string> = {
    parsePatch: (body: unknown) => SafeParseResult<{ id: string; status: TStatus }>
    formatParseError: (error: unknown) => string
    updateStatus: (id: string, dealerId: string, status: TStatus) => Promise<{ success: boolean; error?: string }>
}

export async function readRouteJson(request: NextRequest, invalidJsonMessage?: string) {
    if (!invalidJsonMessage) return request.json()

    const body = await request.json().catch(() => null)
    if (!body) {
        return NextResponse.json({ error: invalidJsonMessage }, { status: 400 })
    }
    return body
}

export async function requireDealerAccount() {
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return { errorResponse }

    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) {
        return { errorResponse: NextResponse.json({ error: 'Dealer account not found' }, { status: 403 }) }
    }

    return { dealer }
}

export async function updateDealerScopedStatus<TStatus extends string>(
    request: NextRequest,
    options: DealerScopedStatusUpdateOptions<TStatus>
) {
    const { dealer, errorResponse } = await requireDealerAccount()
    if (errorResponse) return errorResponse

    const patchBody = await request.json()
    const parsedPatch = options.parsePatch(patchBody)
    if (!parsedPatch.success) {
        return NextResponse.json({ error: options.formatParseError(parsedPatch.error) }, { status: 400 })
    }

    const { id, status } = parsedPatch.data
    const result = await options.updateStatus(id, dealer.id, status)
    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true })
}

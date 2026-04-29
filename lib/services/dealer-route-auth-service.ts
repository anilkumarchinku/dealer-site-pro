import { NextResponse } from 'next/server'
import {
    getDealerForUser,
    requireAuth,
    type AuthenticatedUser,
    type RouteSupabaseClient,
} from '@/lib/supabase-server'

type DealerNotFoundResponse = {
    body: unknown
    status?: number
}

export type AuthenticatedDealerContext = {
    user: AuthenticatedUser
    supabase: RouteSupabaseClient
    dealer: { id: string; slug: string | null }
}

export async function requireDealerForRoute(notFound: DealerNotFoundResponse): Promise<
    | (AuthenticatedDealerContext & { errorResponse?: never })
    | { errorResponse: NextResponse; user?: never; supabase?: never; dealer?: never }
> {
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return { errorResponse }

    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) {
        return {
            errorResponse: NextResponse.json(
                notFound.body,
                { status: notFound.status ?? 404 }
            ),
        }
    }

    return { user, supabase, dealer }
}

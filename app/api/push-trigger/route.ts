import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth, getDealerForUser } from '@/lib/supabase-server'
import { triggerNewListingPush, triggerPriceDropPush } from '@/lib/services/push-trigger'

const newListingSchema = z.object({
    type: z.literal('new_listing'),
    vehicle: z.object({
        make: z.string(),
        model: z.string(),
        year: z.number(),
        price_paise: z.number().nullable().optional(),
    }),
    site_url: z.string().optional(),
})

const priceDropSchema = z.object({
    type: z.literal('price_drop'),
    vehicle: z.object({
        make: z.string(),
        model: z.string(),
        year: z.number(),
    }),
    old_price_paise: z.number(),
    new_price_paise: z.number(),
    site_url: z.string().optional(),
})

const triggerSchema = z.discriminatedUnion('type', [newListingSchema, priceDropSchema])

export async function POST(request: NextRequest) {
    const { user, supabase, errorResponse } = await requireAuth()
    if (errorResponse) return errorResponse

    const dealer = await getDealerForUser(supabase, user.id)
    if (!dealer) return NextResponse.json({ error: 'Dealer not found' }, { status: 404 })

    const body = await request.json().catch(() => null)
    const parsed = triggerSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid trigger payload' }, { status: 400 })
    }

    const data = parsed.data

    if (data.type === 'new_listing') {
        triggerNewListingPush(dealer.id, data.vehicle, data.site_url)
    } else {
        triggerPriceDropPush(dealer.id, data.vehicle, data.old_price_paise, data.new_price_paise, data.site_url)
    }

    return NextResponse.json({ success: true })
}

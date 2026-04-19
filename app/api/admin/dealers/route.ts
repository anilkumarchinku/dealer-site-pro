import { NextResponse } from "next/server"

import { createAdminClient } from "@/lib/supabase-server"
import { requireAdminSession } from "@/lib/utils/admin-session"

export async function GET() {
    const { errorResponse } = await requireAdminSession()
    if (errorResponse) return errorResponse

    try {
        const supabase = createAdminClient()
        const { data: dealerRows, error: dealersError } = await supabase
            .from("dealers")
            .select("id, dealership_name, slug, location, style_template, vehicle_type, onboarding_complete")
            .order("dealership_name", { ascending: true })

        if (dealersError) {
            return NextResponse.json({ error: "Failed to load dealers" }, { status: 500 })
        }

        const dealerIds = (dealerRows ?? []).map((dealer) => dealer.id)
        const { data: dealerBrands, error: brandsError } = dealerIds.length > 0
            ? await supabase
                .from("dealer_brands")
                .select("dealer_id, brand_name, is_primary")
                .in("dealer_id", dealerIds)
                .order("is_primary", { ascending: false })
            : { data: [], error: null }

        if (brandsError) {
            return NextResponse.json({ error: "Failed to load dealer brands" }, { status: 500 })
        }

        const brandsByDealer = new Map<string, string[]>()
        for (const row of dealerBrands ?? []) {
            const current = brandsByDealer.get(row.dealer_id) ?? []
            current.push(row.brand_name)
            brandsByDealer.set(row.dealer_id, current)
        }

        const dealers = (dealerRows ?? []).map((dealer) => ({
            id: dealer.id,
            dealershipName: dealer.dealership_name ?? "Untitled dealer",
            slug: dealer.slug ?? null,
            location: dealer.location ?? null,
            styleTemplate: dealer.style_template ?? "family",
            brands: brandsByDealer.get(dealer.id) ?? [],
            vehicleType: dealer.vehicle_type ?? null,
            onboardingComplete: Boolean(dealer.onboarding_complete),
        }))

        return NextResponse.json({ dealers })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error"
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

import { NextResponse } from "next/server"

import { createAdminClient } from "@/lib/supabase-server"
import { requireAdminSession } from "@/lib/utils/admin-session"

export async function GET() {
    const { errorResponse } = await requireAdminSession()
    if (errorResponse) return errorResponse

    try {
        const supabase = createAdminClient()
        const { data, error } = await supabase
            .from("dealers")
            .select("id, dealership_name, slug, location, style_template, brands, vehicle_type, onboarding_complete")
            .order("dealership_name", { ascending: true })

        if (error) {
            return NextResponse.json({ error: "Failed to load dealers" }, { status: 500 })
        }

        const dealers = (data ?? []).map((dealer) => ({
            id: dealer.id,
            dealershipName: dealer.dealership_name ?? "Untitled dealer",
            slug: dealer.slug ?? null,
            location: dealer.location ?? null,
            styleTemplate: dealer.style_template ?? "family",
            brands: Array.isArray(dealer.brands) ? dealer.brands.filter((brand): brand is string => typeof brand === "string") : [],
            vehicleType: dealer.vehicle_type ?? null,
            onboardingComplete: Boolean(dealer.onboarding_complete),
        }))

        return NextResponse.json({ dealers })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error"
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

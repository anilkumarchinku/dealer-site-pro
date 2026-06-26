import { NextRequest, NextResponse } from "next/server"

import { createAdminClient } from "@/lib/supabase-server"
import { requireAdminSession } from "@/lib/utils/admin-session"
import { brandNameToId, getVehicleImageUrls } from "@/lib/utils/brand-model-images"

/**
 * GET /api/admin/dealers-360/[id]
 * Drill-down for a single dealer: the aggregated 360 row plus that dealer's
 * recent inventory (with images for the model cards) and recent leads.
 */

type VehicleCard = {
    id: string
    category: "4w" | "2w" | "3w"
    title: string
    subtitle: string | null
    images: string[]
    price_paise: number | null
    status: string | null
    created_at: string | null
}

function firstImage(value: unknown): string | null {
    if (!value) return null
    if (typeof value === "string") return value.trim() || null
    if (Array.isArray(value)) {
        const found = value.find((v) => typeof v === "string" && v.trim())
        return (found as string) ?? null
    }
    return null
}

// Resolve model-card image candidates: stored image first, then the
// curated/scraped brand-model assets by make+model (same source the marketplace
// uses). Returned as an ordered list so the client can fall back on load error.
function resolveImages(
    category: "4w" | "2w" | "3w",
    brand: string | null | undefined,
    model: string | null | undefined,
    stored: string | null,
): string[] {
    const candidates: string[] = []
    if (stored) candidates.push(stored)
    if (brand && model) {
        candidates.push(...getVehicleImageUrls(category, brandNameToId(brand, category), model, stored))
    }
    return Array.from(new Set(candidates.filter(Boolean))).slice(0, 5)
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { errorResponse } = await requireAdminSession()
    if (errorResponse) return errorResponse

    const { id } = await params

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any

    try {
        const [dealer, fourW, twoW, threeW, recentLeads] = await Promise.all([
            supabase.from("admin_dealer_360").select("*").eq("id", id).maybeSingle(),
            supabase
                .from("vehicles")
                .select("id, make, model, variant, year, price_paise, image_url, image_urls, status, created_at")
                .eq("dealer_id", id)
                .order("created_at", { ascending: false })
                .limit(8),
            supabase
                .from("tw_vehicles")
                .select("id, brand, model, variant, year, images, status, created_at")
                .eq("dealer_id", id)
                .order("created_at", { ascending: false })
                .limit(8),
            supabase
                .from("thw_vehicles")
                .select("id, brand, model, variant, year, images, status, created_at")
                .eq("dealer_id", id)
                .order("created_at", { ascending: false })
                .limit(8),
            supabase
                .from("leads")
                .select("*")
                .eq("dealer_id", id)
                .order("created_at", { ascending: false })
                .limit(10),
        ])

        if (dealer.error) throw new Error(`admin_dealer_360: ${dealer.error.message}`)
        if (!dealer.data) {
            return NextResponse.json({ error: "Dealer not found" }, { status: 404 })
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const vehicles: VehicleCard[] = [
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(fourW.data ?? []).map((v: any) => ({
                id: v.id,
                category: "4w" as const,
                title: [v.make, v.model].filter(Boolean).join(" ") || "Vehicle",
                subtitle: v.variant ?? (v.year ? String(v.year) : null),
                images: resolveImages("4w", v.make, v.model, firstImage(v.image_url) ?? firstImage(v.image_urls)),
                price_paise: v.price_paise ?? null,
                status: v.status ?? null,
                created_at: v.created_at ?? null,
            })),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(twoW.data ?? []).map((v: any) => ({
                id: v.id,
                category: "2w" as const,
                title: [v.brand, v.model].filter(Boolean).join(" ") || "Two-wheeler",
                subtitle: v.variant ?? (v.year ? String(v.year) : null),
                images: resolveImages("2w", v.brand, v.model, firstImage(v.images)),
                price_paise: null,
                status: v.status ?? null,
                created_at: v.created_at ?? null,
            })),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(threeW.data ?? []).map((v: any) => ({
                id: v.id,
                category: "3w" as const,
                title: [v.brand, v.model].filter(Boolean).join(" ") || "Three-wheeler",
                subtitle: v.variant ?? (v.year ? String(v.year) : null),
                images: resolveImages("3w", v.brand, v.model, firstImage(v.images)),
                price_paise: null,
                status: v.status ?? null,
                created_at: v.created_at ?? null,
            })),
        ]
            .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
            .slice(0, 12)

        return NextResponse.json({
            dealer: dealer.data,
            vehicles,
            recentLeads: recentLeads.data ?? [],
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load dealer detail"
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

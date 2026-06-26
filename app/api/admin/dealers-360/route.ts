import { NextResponse } from "next/server"

import { createAdminClient } from "@/lib/supabase-server"
import { requireAdminSession } from "@/lib/utils/admin-session"

/**
 * GET /api/admin/dealers-360
 * Platform-maintainer 360 view: global KPIs + one aggregated row per dealer
 * (leads, services, inventory, subscriptions) sourced from the
 * `admin_dealer_360` SQL view. Gated by the admin session.
 */

export type Dealer360Row = {
    id: string
    dealership_name: string | null
    logo_url: string | null
    slug: string | null
    subdomain: string | null
    location: string | null
    email: string | null
    phone: string | null
    vehicle_type: string | null
    dealer_type: string | null
    is_active: boolean | null
    onboarding_complete: boolean | null
    onboarding_step: number | null
    created_at: string | null
    cyepro_enabled: boolean
    inventory_system: string | null
    sells_four_wheelers: boolean | null
    sells_two_wheelers: boolean | null
    sells_three_wheelers: boolean | null
    sells_new_cars: boolean | null
    sells_used_cars: boolean | null
    leads_4w: number
    leads_2w: number
    leads_3w: number
    leads_total: number
    service_4w: number
    service_2w: number
    service_3w: number
    service_bookings: number
    vehicles_4w: number
    vehicles_2w: number
    vehicles_3w: number
    vehicles_total: number
    test_drives: number
    sell_requests: number
    messages_count: number
    reviews_count: number
    avg_rating: number | null
    active_subscriptions: number
    mrr_paise: number
    subscription_plan: string | null
    revenue_paise: number
}

export async function GET() {
    const { errorResponse } = await requireAdminSession()
    if (errorResponse) return errorResponse

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any

    try {
        const [dealersResult, authUsersResult] = await Promise.all([
            supabase
                .from("admin_dealer_360")
                .select("*")
                .order("created_at", { ascending: false }),
            supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
        ])

        if (dealersResult.error) throw new Error(`admin_dealer_360: ${dealersResult.error.message}`)

        const dealers = (dealersResult.data ?? []) as Dealer360Row[]
        const totalUsers = authUsersResult.data?.users?.length ?? null
        const created30dCutoff = Date.now() - 30 * 24 * 60 * 60 * 1000

        const sum = (key: keyof Dealer360Row) =>
            dealers.reduce((acc, d) => acc + (Number(d[key]) || 0), 0)

        const kpis = {
            totalUsers,
            totalDealers: dealers.length,
            activeDealers: dealers.filter((d) => d.is_active).length,
            onboardedDealers: dealers.filter((d) => d.onboarding_complete).length,
            newDealers30d: dealers.filter(
                (d) => d.created_at && new Date(d.created_at).getTime() >= created30dCutoff
            ).length,
            withCyepro: dealers.filter((d) => d.cyepro_enabled).length,
            withoutCyepro: dealers.filter((d) => !d.cyepro_enabled).length,
            totalLeads: sum("leads_total"),
            leads4w: sum("leads_4w"),
            leads2w: sum("leads_2w"),
            leads3w: sum("leads_3w"),
            totalServiceBookings: sum("service_bookings"),
            totalVehicles: sum("vehicles_total"),
            totalTestDrives: sum("test_drives"),
            totalSellRequests: sum("sell_requests"),
            activeSubscriptions: sum("active_subscriptions"),
            mrrPaise: sum("mrr_paise"),
            revenuePaise: sum("revenue_paise"),
            byVehicleType: dealers.reduce<Record<string, number>>((acc, d) => {
                const key = d.vehicle_type?.trim() || "unspecified"
                acc[key] = (acc[key] ?? 0) + 1
                return acc
            }, {}),
        }

        // ── Ranking system ────────────────────────────────────────────────
        // Weighted performance score (0–100) normalised against the top dealer
        // in each metric, then overall + per-metric ranks across all dealers.
        const engagement = (d: Dealer360Row) =>
            (d.test_drives || 0) + (d.sell_requests || 0) + (d.messages_count || 0)
        const monetization = (d: Dealer360Row) =>
            (d.active_subscriptions || 0) + (d.mrr_paise || 0) / 100000
        const reviewScore = (d: Dealer360Row) =>
            (d.reviews_count || 0) * (1 + (d.avg_rating || 0) / 5)

        const maxOf = (f: (d: Dealer360Row) => number) =>
            Math.max(1, ...dealers.map(f))
        const mLeads = maxOf((d) => d.leads_total || 0)
        const mSvc = maxOf((d) => d.service_bookings || 0)
        const mVeh = maxOf((d) => d.vehicles_total || 0)
        const mEng = maxOf(engagement)
        const mRev = maxOf(reviewScore)
        const mMon = maxOf(monetization)

        const WEIGHTS = { leads: 0.35, service: 0.15, inventory: 0.15, engagement: 0.15, reviews: 0.1, monetization: 0.1 }
        const scoreOf = (d: Dealer360Row) =>
            Math.round(
                1000 *
                    (WEIGHTS.leads * ((d.leads_total || 0) / mLeads) +
                        WEIGHTS.service * ((d.service_bookings || 0) / mSvc) +
                        WEIGHTS.inventory * ((d.vehicles_total || 0) / mVeh) +
                        WEIGHTS.engagement * (engagement(d) / mEng) +
                        WEIGHTS.reviews * (reviewScore(d) / mRev) +
                        WEIGHTS.monetization * (monetization(d) / mMon))
            ) / 10

        const scoreById = new Map(dealers.map((d) => [d.id, scoreOf(d)]))
        const rankMapFor = (f: (d: Dealer360Row) => number) => {
            const order = [...dealers].sort((a, b) => f(b) - f(a))
            const m = new Map<string, number>()
            order.forEach((d, i) => m.set(d.id, i + 1))
            return m
        }
        const rScore = rankMapFor((d) => scoreById.get(d.id) ?? 0)
        const rLeads = rankMapFor((d) => d.leads_total || 0)
        const rSvc = rankMapFor((d) => d.service_bookings || 0)
        const rVeh = rankMapFor((d) => d.vehicles_total || 0)
        const rEng = rankMapFor(engagement)
        const n = dealers.length

        const rankedDealers = dealers
            .map((d) => ({
                ...d,
                score: scoreById.get(d.id) ?? 0,
                rank: rScore.get(d.id) ?? n,
                percentile: n > 1 ? Math.round((1 - ((rScore.get(d.id) ?? n) - 1) / (n - 1)) * 100) : 100,
                rank_leads: rLeads.get(d.id) ?? n,
                rank_service: rSvc.get(d.id) ?? n,
                rank_vehicles: rVeh.get(d.id) ?? n,
                rank_engagement: rEng.get(d.id) ?? n,
            }))
            .sort((a, b) => a.rank - b.rank)

        return NextResponse.json({
            generatedAt: new Date().toISOString(),
            kpis,
            ranking: { weights: WEIGHTS, totalRanked: n, leaderboard: rankedDealers.slice(0, 10) },
            dealers: rankedDealers,
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load dealer 360"
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

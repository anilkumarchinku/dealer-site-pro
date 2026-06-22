import { NextResponse } from "next/server"

import { createAdminClient } from "@/lib/supabase-server"
import { requireAdminSession } from "@/lib/utils/admin-session"

type DealerInsightRow = {
    is_active: boolean | null
    onboarding_complete: boolean | null
    cyepro_api_key: string | null
    vehicle_type: string | null
    sells_four_wheelers: boolean | null
    sells_two_wheelers: boolean | null
    sells_three_wheelers: boolean | null
    sells_new_cars: boolean | null
    sells_used_cars: boolean | null
    created_at: string | null
}

type DomainInsightRow = {
    domain_type?: string | null
    type?: string | null
    status: string | null
    dns_verified?: boolean | null
}

function countBy<T extends string | null | undefined>(values: T[]) {
    return values.reduce<Record<string, number>>((acc, value) => {
        const key = value?.trim() || "unknown"
        acc[key] = (acc[key] ?? 0) + 1
        return acc
    }, {})
}

export async function GET() {
    const { errorResponse } = await requireAdminSession()
    if (errorResponse) return errorResponse

    // Some production-hardening tables are intentionally ahead of generated types.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any

    async function exactCount(table: string): Promise<number> {
        const { count, error } = await supabase
            .from(table)
            .select("id", { count: "exact", head: true })

        if (error) throw new Error(`${table}: ${error.message}`)
        return count ?? 0
    }

    try {
        const [
            dealersResult,
            dealerDomainsResult,
            legacyDomainsResult,
            authUsersResult,
            carCatalog,
            twCatalog,
            thwCatalog,
            vehicles,
            twVehicles,
            thwVehicles,
            leads,
            twLeads,
            thwLeads,
            twBookings,
            thwBookings,
            domainSubscriptions,
            paymentTransactions,
            webhookEvents,
        ] = await Promise.all([
            supabase
                .from("dealers")
                .select("is_active, onboarding_complete, cyepro_api_key, vehicle_type, sells_four_wheelers, sells_two_wheelers, sells_three_wheelers, sells_new_cars, sells_used_cars, created_at"),
            supabase
                .from("dealer_domains")
                .select("domain_type, status, dns_verified"),
            supabase
                .from("domains")
                .select("type, status"),
            supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
            exactCount("car_catalog"),
            exactCount("tw_catalog"),
            exactCount("thw_catalog"),
            exactCount("vehicles"),
            exactCount("tw_vehicles"),
            exactCount("thw_vehicles"),
            exactCount("leads"),
            exactCount("tw_leads"),
            exactCount("thw_leads"),
            exactCount("tw_bookings"),
            exactCount("thw_bookings"),
            exactCount("domain_subscriptions"),
            exactCount("payment_transactions"),
            exactCount("webhook_events"),
        ])

        if (dealersResult.error) throw new Error(`dealers: ${dealersResult.error.message}`)
        if (dealerDomainsResult.error) throw new Error(`dealer_domains: ${dealerDomainsResult.error.message}`)
        if (legacyDomainsResult.error) throw new Error(`domains: ${legacyDomainsResult.error.message}`)

        const dealers = (dealersResult.data ?? []) as DealerInsightRow[]
        const dealerDomains = (dealerDomainsResult.data ?? []) as DomainInsightRow[]
        const legacyDomains = (legacyDomainsResult.data ?? []) as DomainInsightRow[]
        const created30dCutoff = Date.now() - 30 * 24 * 60 * 60 * 1000

        return NextResponse.json({
            generatedAt: new Date().toISOString(),
            auth: {
                users: authUsersResult.data?.users?.length ?? null,
            },
            dealers: {
                total: dealers.length,
                active: dealers.filter((dealer) => dealer.is_active).length,
                onboardingComplete: dealers.filter((dealer) => dealer.onboarding_complete).length,
                createdLast30Days: dealers.filter((dealer) => {
                    if (!dealer.created_at) return false
                    return new Date(dealer.created_at).getTime() >= created30dCutoff
                }).length,
                cyeproEnabled: dealers.filter((dealer) => Boolean(dealer.cyepro_api_key?.trim())).length,
                byVehicleType: countBy(dealers.map((dealer) => dealer.vehicle_type)),
                sellFlags: {
                    fourWheelers: dealers.filter((dealer) => dealer.sells_four_wheelers).length,
                    twoWheelers: dealers.filter((dealer) => dealer.sells_two_wheelers).length,
                    threeWheelers: dealers.filter((dealer) => dealer.sells_three_wheelers).length,
                    newCars: dealers.filter((dealer) => dealer.sells_new_cars).length,
                    usedCars: dealers.filter((dealer) => dealer.sells_used_cars).length,
                },
            },
            domains: {
                canonicalRows: dealerDomains.length,
                legacyRows: legacyDomains.length,
                customRows: dealerDomains.filter((domain) => domain.domain_type === "custom").length,
                customActive: dealerDomains.filter((domain) => domain.domain_type === "custom" && domain.status === "active").length,
                customPending: dealerDomains.filter((domain) => domain.domain_type === "custom" && domain.status === "pending").length,
                dnsVerified: dealerDomains.filter((domain) => domain.dns_verified).length,
                canonicalByStatus: countBy(dealerDomains.map((domain) => domain.status)),
                legacyByStatus: countBy(legacyDomains.map((domain) => domain.status)),
            },
            inventory: {
                carCatalog,
                twoWheelerCatalog: twCatalog,
                threeWheelerCatalog: thwCatalog,
                fourWheelerDealerVehicles: vehicles,
                twoWheelerDealerVehicles: twVehicles,
                threeWheelerDealerVehicles: thwVehicles,
            },
            activity: {
                leads,
                twoWheelerLeads: twLeads,
                threeWheelerLeads: thwLeads,
                twoWheelerBookings: twBookings,
                threeWheelerBookings: thwBookings,
            },
            billing: {
                domainSubscriptions,
                paymentTransactions,
                webhookEvents,
            },
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load platform insights"
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

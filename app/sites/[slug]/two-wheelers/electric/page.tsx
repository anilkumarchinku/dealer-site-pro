"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { VehicleCard } from "@/components/two-wheelers/VehicleCard"
import { LeadFormModal } from "@/components/two-wheelers/LeadFormModal"
import type { TwoWheelerVehicle, TwoWheelerFilters } from "@/lib/types/two-wheeler"

export default function ElectricTwoWheelersPage() {
    const params = useParams()
    const slug   = params.slug as string
    const [dealerId, setDealerId]  = useState<string | null>(null)
    const [vehicles, setVehicles]  = useState<TwoWheelerVehicle[]>([])
    const [total,    setTotal]     = useState(0)
    const [loading,  setLoading]   = useState(true)
    const [filters,  setFilters]   = useState<TwoWheelerFilters>({ fuelType: "electric", sortBy: "newest", page: 1, pageSize: 12 })
    const [leadVehicleId, setLeadVehicleId] = useState<string | null>(null)
    const [search, setSearch] = useState("")

    useEffect(() => {
        if (!slug) return
        supabase.from("dealers").select("id").eq("slug", slug).single()
            .then(({ data }) => { // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (data) setDealerId((data as any).id) })
    }, [slug])

    const load = useCallback(async () => {
        if (!dealerId) return
        setLoading(true)
        const p = new URLSearchParams({ dealerId, ...Object.fromEntries(
            Object.entries(filters).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])
        )})
        const res  = await fetch(`/api/two-wheelers?${p}`)
        const data = await res.json()
        setVehicles(data.vehicles ?? [])
        setTotal(data.total ?? 0)
        setLoading(false)
    }, [dealerId, filters])

    useEffect(() => { load() }, [load])

    const filtered = vehicles.filter(v =>
        v.brand.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen">
            {/* EV Hero */}
            <section className="bg-gradient-to-br from-green-600/10 to-blue-600/10 py-12 px-4 text-center">
                <div className="max-w-3xl mx-auto space-y-3">
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Zero Emissions</span>
                    <h1 className="text-4xl font-bold">Electric 2-Wheelers</h1>
                    <p className="text-muted-foreground">Save on fuel · FAME subsidy available · Govt incentives</p>
                </div>
            </section>

            {/* Highlights */}
            <section className="max-w-5xl mx-auto px-4 py-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                        { label: "FAME Subsidy",  value: "Up to ₹15,000" },
                        { label: "Savings/Year",  value: "₹25,000+"      },
                        { label: "Range",         value: "80–150 km"     },
                    ].map(h => (
                        <div key={h.label} className="bg-card border border-border rounded-xl p-4">
                            <p className="text-lg font-bold text-primary">{h.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{h.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Listing */}
            <div className="max-w-5xl mx-auto px-4 pb-12">
                <h2 className="text-2xl font-semibold mb-5">{total} Electric Vehicles Available</h2>

                {/* Search bar */}
                <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="relative w-full max-w-sm">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by brand or model..."
                            className="w-full max-w-sm rounded-xl border border-input bg-background pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                    </div>
                    {search && (
                        <p className="text-sm text-muted-foreground">Showing {filtered.length} of {vehicles.length}</p>
                    )}
                </div>

                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => <div key={i} className="h-64 rounded-2xl bg-muted/30 animate-pulse" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">No electric vehicles listed yet.</div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map(v => (
                            <VehicleCard key={v.id} vehicle={v} slug={slug} onLead={vid => setLeadVehicleId(vid)} />
                        ))}
                    </div>
                )}
            </div>

            {dealerId && (
                <LeadFormModal
                    dealerId={dealerId}
                    vehicleId={leadVehicleId ?? undefined}
                    leadType="best_price"
                    title="Get EV Price"
                    isOpen={!!leadVehicleId}
                    onClose={() => setLeadVehicleId(null)}
                />
            )}
        </div>
    )
}

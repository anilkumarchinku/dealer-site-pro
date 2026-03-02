"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { VehicleCard } from "@/components/two-wheelers/VehicleCard"
import { FilterSidebar } from "@/components/two-wheelers/FilterSidebar"
import { LeadFormModal } from "@/components/two-wheelers/LeadFormModal"
import type { TwoWheelerVehicle, TwoWheelerFilters } from "@/lib/types/two-wheeler"

export default function ScootersListingPage() {
    const params  = useParams()
    const slug    = params.slug as string
    const [dealerId, setDealerId]  = useState<string | null>(null)
    const [vehicles, setVehicles]  = useState<TwoWheelerVehicle[]>([])
    const [total,    setTotal]     = useState(0)
    const [loading,  setLoading]   = useState(true)
    const [filters,  setFilters]   = useState<TwoWheelerFilters>({ type: "scooter", sortBy: "newest", page: 1, pageSize: 12 })
    const [leadVehicleId, setLeadVehicleId] = useState<string | null>(null)

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

    return (
        <div className="min-h-screen max-w-6xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Scooters</h1>
                <p className="text-muted-foreground mt-1">{total} scooter{total !== 1 ? "s" : ""} available</p>
            </div>

            <div className="flex gap-8">
                <div className="w-52 shrink-0 hidden md:block">
                    <FilterSidebar filters={filters} onChange={setFilters} />
                </div>
                <div className="flex-1">
                    {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => <div key={i} className="h-64 rounded-2xl bg-muted/30 animate-pulse" />)}
                        </div>
                    ) : vehicles.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">No scooters found.</div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {vehicles.map(v => (
                                <VehicleCard key={v.id} vehicle={v} slug={slug} onLead={vid => setLeadVehicleId(vid)} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {dealerId && (
                <LeadFormModal
                    dealerId={dealerId}
                    vehicleId={leadVehicleId ?? undefined}
                    leadType="best_price"
                    title="Get Best Price"
                    isOpen={!!leadVehicleId}
                    onClose={() => setLeadVehicleId(null)}
                />
            )}
        </div>
    )
}

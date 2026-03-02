"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { VehicleCard } from "@/components/two-wheelers/VehicleCard"
import { FilterSidebar } from "@/components/two-wheelers/FilterSidebar"
import { CompareBar } from "@/components/two-wheelers/CompareBar"
import { LeadFormModal } from "@/components/two-wheelers/LeadFormModal"
import type { TwoWheelerVehicle, TwoWheelerFilters, TwoWheelerCompareItem } from "@/lib/types/two-wheeler"

export default function BikesListingPage() {
    const params = useParams()
    const slug   = params.slug as string

    const [dealerId,  setDealerId]  = useState<string | null>(null)
    const [vehicles,  setVehicles]  = useState<TwoWheelerVehicle[]>([])
    const [total,     setTotal]     = useState(0)
    const [loading,   setLoading]   = useState(true)
    const [filters,   setFilters]   = useState<TwoWheelerFilters>({ type: "bike", sortBy: "newest", page: 1, pageSize: 12 })
    const [compareItems, setCompareItems] = useState<TwoWheelerCompareItem[]>([])
    const [leadVehicleId, setLeadVehicleId] = useState<string | null>(null)
    const [brands, setBrands] = useState<string[]>([])

    useEffect(() => {
        if (!slug) return
        supabase.from("dealers").select("id").eq("slug", slug).single()
            .then(({ data }) => { // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (data) setDealerId((data as any).id) })
    }, [slug])

    const loadVehicles = useCallback(async () => {
        if (!dealerId) return
        setLoading(true)
        const params = new URLSearchParams({ dealerId, ...Object.fromEntries(
            Object.entries(filters).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])
        )})
        const res  = await fetch(`/api/two-wheelers?${params}`)
        const data = await res.json()
        setVehicles(data.vehicles ?? [])
        setTotal(data.total ?? 0)
        // Extract unique brands
        const uniqueBrands = [...new Set((data.vehicles ?? []).map((v: TwoWheelerVehicle) => v.brand))] as string[]
        if (uniqueBrands.length > brands.length) setBrands(uniqueBrands)
        setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dealerId, filters])

    useEffect(() => { loadVehicles() }, [loadVehicles])

    function addToCompare(vehicle: TwoWheelerVehicle) {
        if (compareItems.length >= 3) return
        if (compareItems.find(i => i.id === vehicle.id)) return
        setCompareItems(prev => [...prev, { id: vehicle.id, brand: vehicle.brand, model: vehicle.model, image: vehicle.images[0] ?? null }])
    }

    return (
        <div className="min-h-screen max-w-6xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Bikes</h1>
                <p className="text-muted-foreground mt-1">{total} bike{total !== 1 ? "s" : ""} available</p>
            </div>

            <div className="flex gap-8">
                {/* Sidebar */}
                <div className="w-52 shrink-0 hidden md:block">
                    <FilterSidebar filters={filters} onChange={setFilters} brands={brands} />
                </div>

                {/* Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => <div key={i} className="h-64 rounded-2xl bg-muted/30 animate-pulse" />)}
                        </div>
                    ) : vehicles.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            <p className="text-lg font-medium">No bikes found</p>
                            <button onClick={() => setFilters({ type: "bike", sortBy: "newest", page: 1, pageSize: 12 })} className="mt-3 text-sm text-primary hover:underline">Clear filters</button>
                        </div>
                    ) : (
                        <>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {vehicles.map(v => (
                                    <VehicleCard
                                        key={v.id}
                                        vehicle={v}
                                        slug={slug}
                                        onLead={vid => setLeadVehicleId(vid)}
                                        onCompare={addToCompare}
                                    />
                                ))}
                            </div>
                            {/* Pagination */}
                            {total > (filters.pageSize ?? 12) && (
                                <div className="flex justify-center gap-3 mt-8">
                                    <button disabled={!filters.page || filters.page <= 1} onClick={() => setFilters(f => ({ ...f, page: (f.page ?? 1) - 1 }))} className="px-4 py-2 border border-border rounded-lg text-sm disabled:opacity-40">Previous</button>
                                    <span className="px-4 py-2 text-sm text-muted-foreground">Page {filters.page ?? 1}</span>
                                    <button disabled={(filters.page ?? 1) * (filters.pageSize ?? 12) >= total} onClick={() => setFilters(f => ({ ...f, page: (f.page ?? 1) + 1 }))} className="px-4 py-2 border border-border rounded-lg text-sm disabled:opacity-40">Next</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <CompareBar items={compareItems} slug={slug} onRemove={id => setCompareItems(prev => prev.filter(i => i.id !== id))} onClear={() => setCompareItems([])} />

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

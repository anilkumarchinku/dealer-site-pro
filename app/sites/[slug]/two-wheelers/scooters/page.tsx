"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { VehicleCard } from "@/components/two-wheelers/VehicleCard"
import { FilterSidebar } from "@/components/two-wheelers/FilterSidebar"
import { MobileFilterDrawer } from "@/components/two-wheelers/MobileFilterDrawer"
import { LeadFormModal } from "@/components/two-wheelers/LeadFormModal"
import { ReviewsSection } from "@/components/shared/ReviewsSection"
import type { TwoWheelerVehicle, TwoWheelerFilters } from "@/lib/types/two-wheeler"

export default function ScootersListingPage() {
    const params       = useParams()
    const slug         = params.slug as string
    const router       = useRouter()
    const searchParams = useSearchParams()

    const [dealerId, setDealerId]  = useState<string | null>(null)
    const [vehicles, setVehicles]  = useState<TwoWheelerVehicle[]>([])
    const [total,    setTotal]     = useState(0)
    const [loading,  setLoading]   = useState(true)
    const [filters,  setFilters]   = useState<TwoWheelerFilters>(() => ({
        type:      "scooter",
        brand:     searchParams.get("brand")    ?? undefined,
        fuelType:  (searchParams.get("fuelType") as TwoWheelerFilters["fuelType"]) ?? undefined,
        sortBy:    (searchParams.get("sortBy")   as TwoWheelerFilters["sortBy"])   ?? "newest",
        minPrice:  searchParams.get("minPrice")  ? Number(searchParams.get("minPrice"))  : undefined,
        maxPrice:  searchParams.get("maxPrice")  ? Number(searchParams.get("maxPrice"))  : undefined,
        page:      searchParams.get("page")      ? Number(searchParams.get("page"))      : 1,
        pageSize:  12,
    }))
    const [leadVehicleId, setLeadVehicleId] = useState<string | null>(null)
    const [brands, setBrands] = useState<string[]>([])
    const [search, setSearch] = useState("")
    const [filterOpen, setFilterOpen] = useState(false)

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
        const uniqueBrands = [...new Set((data.vehicles ?? []).map((v: TwoWheelerVehicle) => v.brand))] as string[]
        if (uniqueBrands.length > brands.length) setBrands(uniqueBrands)
        setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dealerId, filters])

    useEffect(() => { load() }, [load])

    // Sync filter state → URL (so back button restores filters)
    useEffect(() => {
        const p = new URLSearchParams()
        if (filters.brand)    p.set("brand",    filters.brand)
        if (filters.fuelType) p.set("fuelType", filters.fuelType)
        if (filters.sortBy && filters.sortBy !== "newest") p.set("sortBy", filters.sortBy)
        if (filters.minPrice) p.set("minPrice", String(filters.minPrice))
        if (filters.maxPrice) p.set("maxPrice", String(filters.maxPrice))
        if (filters.page && filters.page > 1) p.set("page", String(filters.page))
        router.replace(`?${p.toString()}`, { scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters])

    const filtered = vehicles.filter(v =>
        v.brand.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen max-w-6xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Scooters</h1>
                <p className="text-muted-foreground mt-1">{total} scooter{total !== 1 ? "s" : ""} available</p>
            </div>

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

            {/* Mobile filter button */}
            <div className="flex items-center justify-between mb-4 md:hidden">
                <p className="text-sm text-muted-foreground">{total} available</p>
                <button
                    onClick={() => setFilterOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-muted/50"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                    </svg>
                    Filter &amp; Sort
                </button>
            </div>

            <div className="flex gap-8">
                <div className="w-52 shrink-0 hidden md:block">
                    <FilterSidebar filters={filters} onChange={setFilters} brands={brands} />
                </div>
                <div className="flex-1">
                    {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => <div key={i} className="h-64 rounded-2xl bg-muted/30 animate-pulse" />)}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">No scooters found.</div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filtered.map(v => (
                                <VehicleCard key={v.id} vehicle={v} slug={slug} onLead={vid => setLeadVehicleId(vid)} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {filterOpen && (
                <MobileFilterDrawer
                    filters={filters}
                    onChange={setFilters}
                    brands={brands}
                    onClose={() => setFilterOpen(false)}
                />
            )}

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

            {dealerId && <ReviewsSection dealerId={dealerId} />}
        </div>
    )
}

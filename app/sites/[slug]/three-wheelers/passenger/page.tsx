"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { VehicleCard } from "@/components/three-wheelers/VehicleCard"
import { FilterSidebar } from "@/components/three-wheelers/FilterSidebar"
import { MobileFilterDrawer } from "@/components/three-wheelers/MobileFilterDrawer"
import { LeadFormModal } from "@/components/three-wheelers/LeadFormModal"
import { ReviewsSection } from "@/components/shared/ReviewsSection"
import type { ThreeWheelerVehicle, ThreeWheelerFilters } from "@/lib/types/three-wheeler"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

export default function PassengerAutoPage() {
    const params       = useParams()
    const slug         = params.slug as string
    const prefix       = useSitePrefix(slug)
    const router       = useRouter()
    const searchParams = useSearchParams()

    const [dealer, setDealer]         = useState<{ id: string } | null>(null)
    const [vehicles, setVehicles]     = useState<ThreeWheelerVehicle[]>([])
    const [total, setTotal]           = useState(0)
    const [loading, setLoading]       = useState(true)
    const [filters, setFilters]       = useState<ThreeWheelerFilters>(() => ({
        type:        "passenger",
        brand:       searchParams.get("brand")      ?? undefined,
        fuelType:    (searchParams.get("fuelType")   as ThreeWheelerFilters["fuelType"])   ?? undefined,
        permitType:  (searchParams.get("permitType") as ThreeWheelerFilters["permitType"]) ?? undefined,
        sortBy:      (searchParams.get("sortBy")     as ThreeWheelerFilters["sortBy"])     ?? "newest",
        minPrice:    searchParams.get("minPrice")    ? Number(searchParams.get("minPrice")) : undefined,
        maxPrice:    searchParams.get("maxPrice")    ? Number(searchParams.get("maxPrice")) : undefined,
        page:        searchParams.get("page")        ? Number(searchParams.get("page"))     : 1,
        pageSize:    12,
    }))
    const [brands, setBrands]         = useState<string[]>([])
    const [filterOpen, setFilterOpen] = useState(false)
    const [leadVehicleId, setLeadVehicleId] = useState<string | null>(null)
    const [search, setSearch]         = useState("")

    useEffect(() => {
        if (!slug) return
        supabase.from("dealers").select("id").eq("slug", slug).single()
            .then(({ data }) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (data) setDealer((data as any))
            })
    }, [slug])

    const loadVehicles = useCallback(async () => {
        if (!dealer) return
        setLoading(true)
        const urlParams = new URLSearchParams({ dealerId: dealer.id, ...Object.fromEntries(
            Object.entries(filters).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])
        )})
        const res  = await fetch(`/api/three-wheelers?${urlParams}`)
        const data = await res.json()
        setVehicles(data.vehicles ?? [])
        setTotal(data.total ?? 0)
        const uniqueBrands = [...new Set((data.vehicles ?? []).map((v: ThreeWheelerVehicle) => v.brand))] as string[]
        if (uniqueBrands.length > brands.length) setBrands(uniqueBrands)
        setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dealer, filters])

    useEffect(() => { loadVehicles() }, [loadVehicles])

    // Sync filter state → URL (so back button restores filters)
    useEffect(() => {
        const p = new URLSearchParams()
        if (filters.brand)      p.set("brand",      filters.brand)
        if (filters.fuelType)   p.set("fuelType",   filters.fuelType)
        if (filters.permitType) p.set("permitType", filters.permitType)
        if (filters.sortBy && filters.sortBy !== "newest") p.set("sortBy", filters.sortBy)
        if (filters.minPrice)   p.set("minPrice",   String(filters.minPrice))
        if (filters.maxPrice)   p.set("maxPrice",   String(filters.maxPrice))
        if (filters.page && filters.page > 1) p.set("page", String(filters.page))
        router.replace(`?${p.toString()}`, { scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters])

    const filtered = vehicles.filter(v =>
        v.brand.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase())
    )

    if (!dealer && !loading) return <div className="min-h-screen flex items-center justify-center">Dealer not found</div>

    return (
        <div className="min-h-screen max-w-6xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href={`${prefix}/three-wheelers`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="w-4 h-4" /> Back
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">🛺 Passenger Autos</h1>
                <p className="text-muted-foreground mt-1">{total} model{total !== 1 ? "s" : ""} available</p>
            </div>

            {/* Search bar */}
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="relative w-full max-w-sm">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                    </svg>
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
                {/* Desktop sidebar */}
                <div className="w-52 shrink-0 hidden md:block">
                    <FilterSidebar filters={filters} onChange={setFilters} brands={brands} showPassenger={true} />
                </div>

                {/* Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[...Array(6)].map((_, i) => <div key={i} className="h-64 rounded-2xl bg-muted/30 animate-pulse" />)}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            <p className="text-2xl">🛺</p>
                            <p className="text-lg font-medium mt-4">{search ? "No results found" : "No passenger autos available right now"}</p>
                            <p className="text-sm mt-1">{search ? "Try a different search term." : "Check back soon or contact us for enquiries."}</p>
                            <button onClick={() => { setFilters({ type: "passenger", sortBy: "newest", page: 1, pageSize: 12 }); setSearch("") }} className="mt-3 text-sm text-primary hover:underline">Clear filters</button>
                        </div>
                    ) : (
                        <>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filtered.map(v => (
                                    <VehicleCard key={v.id} vehicle={v} slug={slug} onLead={vid => setLeadVehicleId(vid)} />
                                ))}
                            </div>
                            {/* Pagination */}
                            {total > (filters.pageSize ?? 12) && (
                                <div className="flex justify-center gap-3 mt-8">
                                    <button
                                        disabled={!filters.page || filters.page <= 1}
                                        onClick={() => setFilters(f => ({ ...f, page: (f.page ?? 1) - 1 }))}
                                        className="px-4 py-2 border border-border rounded-lg text-sm disabled:opacity-40"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-4 py-2 text-sm text-muted-foreground">Page {filters.page ?? 1}</span>
                                    <button
                                        disabled={(filters.page ?? 1) * (filters.pageSize ?? 12) >= total}
                                        onClick={() => setFilters(f => ({ ...f, page: (f.page ?? 1) + 1 }))}
                                        className="px-4 py-2 border border-border rounded-lg text-sm disabled:opacity-40"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {filterOpen && (
                <MobileFilterDrawer
                    filters={filters}
                    onChange={setFilters}
                    brands={brands}
                    showPassenger={true}
                    onClose={() => setFilterOpen(false)}
                />
            )}

            {dealer && (
                <LeadFormModal
                    dealerId={dealer.id}
                    vehicleId={leadVehicleId ?? undefined}
                    leadType="best_price"
                    title="Get Best Price"
                    isOpen={!!leadVehicleId}
                    onClose={() => setLeadVehicleId(null)}
                />
            )}

            {dealer && <ReviewsSection dealerId={dealer.id} />}
        </div>
    )
}

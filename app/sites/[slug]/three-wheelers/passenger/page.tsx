"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { VehicleCard } from "@/components/three-wheelers/VehicleCard"
import { LeadFormModal } from "@/components/three-wheelers/LeadFormModal"
import { ReviewsSection } from "@/components/shared/ReviewsSection"
import type { ThreeWheelerVehicle } from "@/lib/types/three-wheeler"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

export default function PassengerAutoPage() {
    const params = useParams()
    const slug   = params.slug as string
    const prefix = useSitePrefix(slug)

    const [dealer, setDealer]   = useState<{ id: string } | null>(null)
    const [vehicles, setVehicles] = useState<ThreeWheelerVehicle[]>([])
    const [total, setTotal]     = useState(0)
    const [loading, setLoading] = useState(true)
    const [leadVehicleId, setLeadVehicleId] = useState<string | null>(null)
    const [search, setSearch]   = useState("")

    useEffect(() => {
        if (!slug) return
        async function load() {
            const { data: d } = await supabase.from("dealers").select("id").eq("slug", slug).single()
            if (!d) { setLoading(false); return }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dealer = d as any
            setDealer(dealer)

            const res  = await fetch(`/api/three-wheelers?dealerId=${dealer.id}&type=passenger&pageSize=20`)
            const data = await res.json()
            setVehicles(data.vehicles ?? [])
            setTotal(data.total ?? 0)
            setLoading(false)
        }
        load()
    }, [slug])

    if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>
    if (!dealer) return <div className="min-h-screen flex items-center justify-center">Dealer not found</div>

    return (
        <div className="min-h-screen max-w-5xl mx-auto px-4 py-8">
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
            <div className="mb-6 relative w-full max-w-sm">
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

            {(() => {
                const filtered = vehicles.filter(v =>
                    v.brand.toLowerCase().includes(search.toLowerCase()) ||
                    v.model.toLowerCase().includes(search.toLowerCase())
                )
                return (
                    <>
                        {search && (
                            <p className="text-sm text-muted-foreground mb-4">Showing {filtered.length} of {vehicles.length}</p>
                        )}
                        {filtered.length === 0 ? (
                            <div className="text-center py-20 text-muted-foreground">
                                <p className="text-2xl">🛺</p>
                                <p className="text-lg font-medium mt-4">{search ? "No results found" : "No passenger autos available right now"}</p>
                                <p className="text-sm mt-1">{search ? "Try a different search term." : "Check back soon or contact us for enquiries."}</p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                                {filtered.map(v => (
                                    <VehicleCard key={v.id} vehicle={v} slug={slug} onLead={vid => setLeadVehicleId(vid)} />
                                ))}
                            </div>
                        )}
                    </>
                )
            })()}

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

            <ReviewsSection dealerId={dealer.id} />
        </div>
    )
}

"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { LeadFormModal } from "@/components/three-wheelers/LeadFormModal"
import type { ThreeWheelerUsedVehicle } from "@/lib/types/three-wheeler"
import { ChevronLeft } from "lucide-react"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

const GRADE_COLORS: Record<string, string> = {
    A: "bg-green-100 text-green-700",
    B: "bg-yellow-100 text-yellow-700",
    C: "bg-orange-100 text-orange-700",
}

export default function UsedThreeWheelersPublicPage() {
    const params = useParams()
    const slug   = params.slug as string
    const prefix = useSitePrefix(slug)

    const [dealer, setDealer]   = useState<{ id: string; dealership_name: string } | null>(null)
    const [vehicles, setVehicles] = useState<ThreeWheelerUsedVehicle[]>([])
    const [total, setTotal]     = useState(0)
    const [loading, setLoading] = useState(true)
    const [leadVehicleId, setLeadVehicleId] = useState<string | null>(null)

    useEffect(() => {
        if (!slug) return
        async function load() {
            const { data: d } = await supabase
                .from("dealers")
                .select("id, dealership_name")
                .eq("slug", slug)
                .single()
            if (!d) { setLoading(false); return }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dealer = d as any
            setDealer(dealer)

            const res  = await fetch(`/api/three-wheelers/used?dealerId=${dealer.id}&pageSize=20&sortBy=newest`)
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
                    <ChevronLeft className="w-4 h-4" /> Back to 3-Wheelers
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">Used 3-Wheelers</h1>
                <p className="text-muted-foreground mt-1">{total} vehicle{total !== 1 ? "s" : ""} available</p>
            </div>

            {vehicles.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-2xl">🛺</p>
                    <p className="text-lg font-medium mt-4">No used vehicles currently available</p>
                    <p className="text-sm mt-1">Check back soon or contact us directly.</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {vehicles.map(v => (
                        <div key={v.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                            {v.images[0] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={v.images[0]} alt={`${v.brand} ${v.model}`} className="w-full h-40 object-cover" />
                            ) : (
                                <div className="h-40 bg-muted/30 flex items-center justify-center text-muted-foreground text-sm">No Image</div>
                            )}
                            <div className="p-4 space-y-3">
                                <div>
                                    <h3 className="font-semibold">{v.brand} {v.model}</h3>
                                    <p className="text-xs text-muted-foreground">{v.year} · {v.fuel_type.toUpperCase()} · {v.km_driven.toLocaleString("en-IN")} km</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {v.condition_grade && (
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${GRADE_COLORS[v.condition_grade]}`}>
                                            Grade {v.condition_grade}
                                        </span>
                                    )}
                                    {v.certified_pre_owned && (
                                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">Certified</span>
                                    )}
                                </div>
                                <p className="text-xl font-bold text-primary">
                                    ₹{(v.price_paise / 100).toLocaleString("en-IN")}
                                    {v.negotiable && <span className="text-xs font-normal text-muted-foreground ml-1">Negotiable</span>}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setLeadVehicleId(v.id)}
                                        className="flex-1 bg-primary text-primary-foreground text-sm font-medium rounded-lg px-3 py-2 hover:opacity-90"
                                    >
                                        Make Offer
                                    </button>
                                    <Link
                                        href={`${prefix}/three-wheelers/used/${v.id}`}
                                        className="flex-1 border border-border text-sm font-medium rounded-lg px-3 py-2 text-center hover:bg-muted/50"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <LeadFormModal
                dealerId={dealer.id}
                usedVehicleId={leadVehicleId ?? undefined}
                leadType="best_price"
                title="Make an Offer"
                isOpen={!!leadVehicleId}
                onClose={() => setLeadVehicleId(null)}
            />
        </div>
    )
}

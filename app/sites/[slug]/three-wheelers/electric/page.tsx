"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { VehicleCard } from "@/components/three-wheelers/VehicleCard"
import { LeadFormModal } from "@/components/three-wheelers/LeadFormModal"
import type { ThreeWheelerVehicle } from "@/lib/types/three-wheeler"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

export default function ElectricThreeWheelerPage() {
    const params = useParams()
    const slug   = params.slug as string
    const prefix = useSitePrefix(slug)

    const [dealer, setDealer]   = useState<{ id: string } | null>(null)
    const [vehicles, setVehicles] = useState<ThreeWheelerVehicle[]>([])
    const [total, setTotal]     = useState(0)
    const [loading, setLoading] = useState(true)
    const [leadVehicleId, setLeadVehicleId] = useState<string | null>(null)

    useEffect(() => {
        if (!slug) return
        async function load() {
            const { data: d } = await supabase.from("dealers").select("id").eq("slug", slug).single()
            if (!d) { setLoading(false); return }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dealer = d as any
            setDealer(dealer)

            const res  = await fetch(`/api/three-wheelers?dealerId=${dealer.id}&type=electric&pageSize=20`)
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

            {/* EV highlights banner */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6 mb-8">
                <h1 className="text-3xl font-bold">⚡ Electric 3-Wheelers</h1>
                <p className="text-muted-foreground mt-1">{total} model{total !== 1 ? "s" : ""} available</p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                    <span className="flex items-center gap-1.5 text-green-700">✅ Zero Emissions</span>
                    <span className="flex items-center gap-1.5 text-green-700">✅ Lower Running Cost</span>
                    <span className="flex items-center gap-1.5 text-green-700">✅ FAME Subsidy Eligible</span>
                    <span className="flex items-center gap-1.5 text-green-700">✅ No Fuel Permit Required</span>
                </div>
            </div>

            {vehicles.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-2xl">⚡</p>
                    <p className="text-lg font-medium mt-4">No electric 3-wheelers available right now</p>
                    <p className="text-sm mt-1">Contact us for upcoming EV models.</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {vehicles.map(v => (
                        <VehicleCard key={v.id} vehicle={v} slug={slug} onLead={vid => setLeadVehicleId(vid)} />
                    ))}
                </div>
            )}

            {dealer && (
                <LeadFormModal
                    dealerId={dealer.id}
                    vehicleId={leadVehicleId ?? undefined}
                    leadType="best_price"
                    title="Get EV Price & Subsidy Details"
                    isOpen={!!leadVehicleId}
                    onClose={() => setLeadVehicleId(null)}
                />
            )}
        </div>
    )
}

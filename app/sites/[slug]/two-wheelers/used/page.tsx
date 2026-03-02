"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { UsedVehicleCard } from "@/components/two-wheelers/UsedVehicleCard"
import { LeadFormModal } from "@/components/two-wheelers/LeadFormModal"
import type { TwoWheelerUsedVehicle, TwoWheelerUsedFilters } from "@/lib/types/two-wheeler"

const GRADES = ["A", "B", "C"] as const

export default function UsedTwoWheelersPublicPage() {
    const params = useParams()
    const slug   = params.slug as string
    const [dealerId, setDealerId]  = useState<string | null>(null)
    const [vehicles, setVehicles]  = useState<TwoWheelerUsedVehicle[]>([])
    const [total,    setTotal]     = useState(0)
    const [loading,  setLoading]   = useState(true)
    const [filters,  setFilters]   = useState<TwoWheelerUsedFilters>({ sortBy: "newest", page: 1, pageSize: 12 })
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
        const res  = await fetch(`/api/two-wheelers/used?${p}`)
        const data = await res.json()
        setVehicles(data.vehicles ?? [])
        setTotal(data.total ?? 0)
        setLoading(false)
    }, [dealerId, filters])

    useEffect(() => { load() }, [load])

    return (
        <div className="min-h-screen max-w-6xl mx-auto px-4 py-8">
            <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-3xl font-bold">Used 2-Wheelers</h1>
                    <p className="text-muted-foreground mt-1">{total} vehicle{total !== 1 ? "s" : ""} available</p>
                </div>
                {/* Grade filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Grade:</span>
                    <button onClick={() => setFilters(f => ({ ...f, conditionGrade: undefined, page: 1 }))} className={`px-3 py-1.5 text-sm rounded-lg border ${!filters.conditionGrade ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>All</button>
                    {GRADES.map(g => (
                        <button key={g} onClick={() => setFilters(f => ({ ...f, conditionGrade: g, page: 1 }))} className={`px-3 py-1.5 text-sm rounded-lg border ${filters.conditionGrade === g ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>Grade {g}</button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => <div key={i} className="h-64 rounded-2xl bg-muted/30 animate-pulse" />)}
                </div>
            ) : vehicles.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">No used vehicles available.</div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vehicles.map(v => (
                        <UsedVehicleCard key={v.id} vehicle={v} slug={slug} onLead={vid => setLeadVehicleId(vid)} />
                    ))}
                </div>
            )}

            {dealerId && (
                <LeadFormModal
                    dealerId={dealerId}
                    usedVehicleId={leadVehicleId ?? undefined}
                    leadType="best_price"
                    title="Make an Offer"
                    isOpen={!!leadVehicleId}
                    onClose={() => setLeadVehicleId(null)}
                />
            )}
        </div>
    )
}

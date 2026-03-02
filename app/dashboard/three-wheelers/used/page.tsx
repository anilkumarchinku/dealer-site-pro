"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ThreeWheelerUsedVehicle } from "@/lib/types/three-wheeler"

const GRADE_COLORS: Record<string, string> = {
    A: "bg-green-100 text-green-700",
    B: "bg-yellow-100 text-yellow-700",
    C: "bg-orange-100 text-orange-700",
}

export default function UsedThreeWheelersPage() {
    const { dealerId } = useOnboardingStore()
    const [vehicles, setVehicles] = useState<ThreeWheelerUsedVehicle[]>([])
    const [total, setTotal]       = useState(0)
    const [loading, setLoading]   = useState(true)

    const load = useCallback(async () => {
        if (!dealerId) return
        setLoading(true)
        try {
            const res  = await fetch(`/api/three-wheelers/used?dealerId=${dealerId}&pageSize=50`)
            const data = await res.json()
            setVehicles(data.vehicles ?? [])
            setTotal(data.total ?? 0)
        } finally {
            setLoading(false)
        }
    }, [dealerId])

    useEffect(() => { load() }, [load])

    async function handleDelete(id: string) {
        if (!confirm("Mark this vehicle as sold?")) return
        await fetch(`/api/three-wheelers/used/${id}`, { method: "DELETE" })
        load()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Used 3W Stock</h1>
                    <p className="text-muted-foreground text-sm">{total} vehicle{total !== 1 ? "s" : ""} in stock</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/three-wheelers/used/add">
                        <Plus className="w-4 h-4 mr-2" /> Add Used Vehicle
                    </Link>
                </Button>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-muted/30 animate-pulse" />)}
                </div>
            ) : vehicles.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-lg font-medium mb-2">No used vehicles yet</p>
                    <Button asChild><Link href="/dashboard/three-wheelers/used/add">Add Used Vehicle</Link></Button>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Vehicle</th>
                                <th className="px-4 py-3 text-left font-medium">Year</th>
                                <th className="px-4 py-3 text-left font-medium">KM</th>
                                <th className="px-4 py-3 text-left font-medium">Grade</th>
                                <th className="px-4 py-3 text-left font-medium">Price</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {vehicles.map((v) => (
                                <tr key={v.id} className="hover:bg-muted/10">
                                    <td className="px-4 py-3 font-medium">{v.brand} {v.model} {v.variant ?? ""}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{v.year}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{v.km_driven.toLocaleString("en-IN")}</td>
                                    <td className="px-4 py-3">
                                        {v.condition_grade ? (
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${GRADE_COLORS[v.condition_grade]}`}>
                                                Grade {v.condition_grade}
                                            </span>
                                        ) : "—"}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-primary">₹{(v.price_paise / 100).toLocaleString("en-IN")}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                                            v.status === "available" ? "bg-green-100 text-green-700" :
                                            v.status === "reserved"  ? "bg-blue-100 text-blue-700"  :
                                                                       "bg-gray-100 text-gray-700"
                                        }`}>{v.status}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/dashboard/three-wheelers/used/${v.id}/edit`}>
                                                    <Pencil className="w-3 h-3" />
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(v.id)}>
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

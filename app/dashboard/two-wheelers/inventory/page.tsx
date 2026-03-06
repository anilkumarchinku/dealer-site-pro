"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TwoWheelerVehicle } from "@/lib/types/two-wheeler"
import { getScrapedImageFallback, brandNameToId } from "@/lib/utils/brand-model-images"

export default function TwoWheelerInventoryPage() {
    const { dealerId } = useOnboardingStore()
    const [vehicles, setVehicles] = useState<TwoWheelerVehicle[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)

    const load = useCallback(async () => {
        if (!dealerId) return
        setLoading(true)
        try {
            const res = await fetch(`/api/two-wheelers?dealerId=${dealerId}&pageSize=50`)
            const data = await res.json()
            setVehicles(data.vehicles ?? [])
            setTotal(data.total ?? 0)
        } finally {
            setLoading(false)
        }
    }, [dealerId])

    useEffect(() => { load() }, [load])

    async function handleDelete(id: string) {
        if (!confirm("Remove this vehicle from your inventory?")) return
        await fetch(`/api/two-wheelers/${id}`, { method: "DELETE" })
        load()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">New 2W Inventory</h1>
                    <p className="text-muted-foreground text-sm">{total} vehicle{total !== 1 ? "s" : ""} listed</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/two-wheelers/inventory/add">
                        <Plus className="w-4 h-4 mr-2" /> Add Vehicle
                    </Link>
                </Button>
            </div>

            {loading ? (
                <div className="grid md:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-36 rounded-xl bg-muted/30 animate-pulse" />
                    ))}
                </div>
            ) : vehicles.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-lg font-medium mb-2">No vehicles yet</p>
                    <p className="text-sm mb-6">Add your first bike or scooter to get started.</p>
                    <Button asChild><Link href="/dashboard/two-wheelers/inventory/add">Add Vehicle</Link></Button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vehicles.map((v) => (
                        <div key={v.id} className="bg-card border border-border rounded-xl overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={v.images[0] || getScrapedImageFallback("2w", brandNameToId(v.brand), v.model)}
                                alt={`${v.brand} ${v.model}`}
                                className="w-full h-40 object-cover bg-muted/30"
                            />
                            <div className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold">{v.brand} {v.model}</p>
                                        <p className="text-xs text-muted-foreground">{v.year} · {v.type} · {v.fuel_type}</p>
                                        <p className="text-sm font-medium text-primary mt-1">
                                            ₹{(v.ex_showroom_price_paise / 100).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${v.stock_status === "available" ? "bg-green-100 text-green-700" :
                                            v.stock_status === "booking_open" ? "bg-blue-100 text-blue-700" :
                                                "bg-gray-100 text-gray-700"
                                        }`}>
                                        {v.stock_status.replace("_", " ")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <Button variant="outline" size="sm" asChild className="flex-1">
                                        <Link href={`/dashboard/two-wheelers/inventory/${v.id}/edit`}>
                                            <Pencil className="w-3 h-3 mr-1" /> Edit
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(v.id)}>
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                    <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                                        <Eye className="w-3 h-3" /> {v.views}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

"use client"

import { useState } from "react"
import { Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { StatusBadge } from "./StatusBadge"
import { formatDate, formatPrice } from "./utils"
import type { SellRequest } from "./types"

const FILTERS = ["all", "pending", "under_review", "completed", "rejected"] as const

interface Props {
    sellRequests: SellRequest[]
}

export function CustomerPanelSellRequests({ sellRequests }: Props) {
    const [filter, setFilter] = useState<string>("all")
    const filtered = filter === "all" ? sellRequests : sellRequests.filter(s => s.status.toLowerCase() === filter)

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Sell Requests ({sellRequests.length})</h2>

            <div className="flex flex-wrap gap-1.5">
                {FILTERS.map(f => (
                    <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">
                        {f.replace(/_/g, " ")}
                    </Button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <EmptyState icon={Car} title="No sell requests found" description={filter === "all" ? "Vehicles you've offered to sell will appear here." : `No sell requests with status "${filter.replace(/_/g, " ")}".`} />
            ) : (
                <div className="grid gap-3">
                    {filtered.map(item => (
                        <div key={item.id} className="flex items-start justify-between gap-4 rounded-xl border bg-white p-4">
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold">{[item.year, item.make, item.model, item.variant].filter(Boolean).join(" ")}</p>
                                {item.listing_price_paise ? (
                                    <p className="mt-1 text-sm text-slate-600">Listed at {formatPrice(item.listing_price_paise)}</p>
                                ) : null}
                                <p className="mt-1 text-xs text-slate-500">
                                    Submitted {formatDate(item.created_at)}
                                    {item.preferred_date ? ` · Inspection ${formatDate(item.preferred_date)}` : ""}
                                </p>
                            </div>
                            <StatusBadge status={item.status} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

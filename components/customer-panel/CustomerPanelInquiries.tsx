"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { StatusBadge } from "./StatusBadge"
import { formatDate } from "./utils"
import type { Lead } from "./types"

const FILTERS = ["all", "new", "contacted", "qualified", "converted", "lost"] as const

interface Props {
    inquiries: Lead[]
}

export function CustomerPanelInquiries({ inquiries }: Props) {
    const [filter, setFilter] = useState<string>("all")
    const filtered = filter === "all" ? inquiries : inquiries.filter(i => i.status.toLowerCase() === filter)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold">Inquiries ({inquiries.length})</h2>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {FILTERS.map(f => (
                    <Button
                        key={f}
                        variant={filter === f ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(f)}
                        className="capitalize"
                    >
                        {f}
                    </Button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <EmptyState icon={Search} title="No inquiries found" description={filter === "all" ? "Your buy requests and inquiries will appear here." : `No inquiries with status "${filter}".`} />
            ) : (
                <div className="grid gap-3">
                    {filtered.map(item => (
                        <div key={item.id} className="flex items-start justify-between gap-4 rounded-xl border bg-white p-4">
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold">{item.vehicle_interest || item.lead_type.replace(/_/g, " ")}</p>
                                {item.message && (
                                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">{item.message}</p>
                                )}
                                <p className="mt-2 text-xs text-slate-500">{formatDate(item.created_at)}</p>
                            </div>
                            <StatusBadge status={item.status} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

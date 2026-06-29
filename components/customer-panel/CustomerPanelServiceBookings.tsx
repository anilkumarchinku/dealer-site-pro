"use client"

import { useState } from "react"
import { Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { StatusBadge } from "./StatusBadge"
import { formatDate, formatServiceType } from "./utils"
import type { ServiceBooking } from "./types"

const FILTERS = ["all", "pending", "confirmed", "assigned", "completed", "cancelled"] as const

interface Props {
    serviceBookings: ServiceBooking[]
}

export function CustomerPanelServiceBookings({ serviceBookings }: Props) {
    const [filter, setFilter] = useState<string>("all")
    const filtered = filter === "all" ? serviceBookings : serviceBookings.filter(s => s.status.toLowerCase() === filter)
    const today = new Date().toISOString().slice(0, 10)

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Service Bookings ({serviceBookings.length})</h2>

            <div className="flex flex-wrap gap-1.5">
                {FILTERS.map(f => (
                    <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">
                        {f}
                    </Button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <EmptyState icon={Wrench} title="No service bookings found" description={filter === "all" ? "Your service appointments will appear here." : `No bookings with status "${filter}".`} />
            ) : (
                <div className="grid gap-3">
                    {filtered.map(item => {
                        const isUpcoming = item.preferred_date >= today
                        return (
                            <div key={item.id} className={`flex items-start justify-between gap-4 rounded-xl border bg-white p-4 ${isUpcoming ? "border-l-4 border-l-purple-400" : ""}`}>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold">
                                        {formatServiceType(item.service_type)}
                                        {item.vehicle_make ? ` — ${[item.vehicle_make, item.vehicle_model].filter(Boolean).join(" ")}` : ""}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-600">
                                        {formatDate(item.preferred_date)} · {item.preferred_slot}
                                        {item.vehicle_reg_no ? ` · ${item.vehicle_reg_no}` : ""}
                                    </p>
                                    {isUpcoming && <p className="mt-1 text-xs font-medium text-purple-600">Upcoming</p>}
                                </div>
                                <StatusBadge status={item.status} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

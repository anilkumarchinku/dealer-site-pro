"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { StatusBadge } from "./StatusBadge"
import { formatDate } from "./utils"
import type { TestDrive } from "./types"

const FILTERS = ["all", "pending", "confirmed", "completed", "cancelled"] as const

interface Props {
    testDrives: TestDrive[]
}

export function CustomerPanelTestDrives({ testDrives }: Props) {
    const [filter, setFilter] = useState<string>("all")
    const filtered = filter === "all" ? testDrives : testDrives.filter(t => t.status.toLowerCase() === filter)
    const today = new Date().toISOString().slice(0, 10)

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Test Drives ({testDrives.length})</h2>

            <div className="flex flex-wrap gap-1.5">
                {FILTERS.map(f => (
                    <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">
                        {f}
                    </Button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <EmptyState icon={Calendar} title="No test drives found" description={filter === "all" ? "Your test drive appointments will appear here." : `No test drives with status "${filter}".`} />
            ) : (
                <div className="grid gap-3">
                    {filtered.map(item => {
                        const isUpcoming = item.preferred_date && item.preferred_date >= today
                        return (
                            <div key={item.id} className={`flex items-start justify-between gap-4 rounded-xl border bg-white p-4 ${isUpcoming ? "border-l-4 border-l-blue-400" : ""}`}>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold">{item.vehicle_interest || "Vehicle test drive"}</p>
                                    <p className="mt-1 text-sm text-slate-600">
                                        {formatDate(item.preferred_date)}{item.preferred_time ? ` at ${item.preferred_time}` : ""}
                                    </p>
                                    {isUpcoming && <p className="mt-1 text-xs font-medium text-blue-600">Upcoming</p>}
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

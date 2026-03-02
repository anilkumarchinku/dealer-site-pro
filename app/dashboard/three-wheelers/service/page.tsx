"use client"

import { useEffect, useState, useCallback } from "react"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import type { ThreeWheelerServiceBooking, ThreeWheelerServiceStatus } from "@/lib/types/three-wheeler"

const STATUS_COLORS: Record<ThreeWheelerServiceStatus, string> = {
    pending:   "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-700",
}

const STATUSES: ThreeWheelerServiceStatus[] = ["pending", "confirmed", "completed", "cancelled"]

export default function ThreeWheelerServicePage() {
    const { dealerId } = useOnboardingStore()
    const [bookings, setBookings]         = useState<ThreeWheelerServiceBooking[]>([])
    const [total, setTotal]               = useState(0)
    const [loading, setLoading]           = useState(true)
    const [filterStatus, setFilterStatus] = useState<string>("pending")

    const load = useCallback(async () => {
        if (!dealerId) return
        setLoading(true)
        try {
            const params = new URLSearchParams({ pageSize: "50" })
            if (filterStatus) params.set("status", filterStatus)
            const res  = await fetch(`/api/three-wheelers/service-booking?${params}`)
            const data = await res.json()
            setBookings(data.bookings ?? [])
            setTotal(data.total ?? 0)
        } finally {
            setLoading(false)
        }
    }, [dealerId, filterStatus])

    useEffect(() => { load() }, [load])

    async function updateStatus(id: string, status: ThreeWheelerServiceStatus) {
        await fetch("/api/three-wheelers/service-booking", {
            method:  "PATCH",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ id, status }),
        })
        load()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">3W Service Bookings</h1>
                    <p className="text-muted-foreground text-sm">{total} booking{total !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">Filter:</label>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
                    >
                        <option value="">All Statuses</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-muted/30 animate-pulse" />)}
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-lg font-medium">No service bookings</p>
                    <p className="text-sm mt-1">Service bookings from your public 3W site will appear here.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Customer</th>
                                <th className="px-4 py-3 text-left font-medium">Phone</th>
                                <th className="px-4 py-3 text-left font-medium">Vehicle</th>
                                <th className="px-4 py-3 text-left font-medium">Service</th>
                                <th className="px-4 py-3 text-left font-medium">Date / Slot</th>
                                <th className="px-4 py-3 text-left font-medium">KM</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {bookings.map(b => (
                                <tr key={b.id} className="hover:bg-muted/10">
                                    <td className="px-4 py-3 font-medium">{b.customer_name}</td>
                                    <td className="px-4 py-3">
                                        <a href={`tel:${b.phone}`} className="text-primary hover:underline">{b.phone}</a>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {b.vehicle_make && b.vehicle_model
                                            ? `${b.vehicle_make} ${b.vehicle_model} ${b.vehicle_year ?? ""}`
                                            : "—"}
                                        {b.vehicle_reg_no && <span className="block text-xs">{b.vehicle_reg_no}</span>}
                                    </td>
                                    <td className="px-4 py-3 capitalize text-muted-foreground">{b.service_type.replace(/_/g, " ")}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {new Date(b.preferred_date).toLocaleDateString("en-IN")}<br />
                                        <span className="text-xs">{b.preferred_slot}</span>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{b.km_reading?.toLocaleString("en-IN") ?? "—"}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={b.status}
                                            onChange={e => updateStatus(b.id, e.target.value as ThreeWheelerServiceStatus)}
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium border-0 cursor-pointer ${STATUS_COLORS[b.status]}`}
                                        >
                                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
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

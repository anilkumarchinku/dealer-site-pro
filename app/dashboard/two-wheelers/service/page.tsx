"use client"

import { useEffect, useState, useCallback } from "react"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { toast } from "@/lib/utils/toast"
import type { TwoWheelerServiceBooking, TwoWheelerServiceStatus } from "@/lib/types/two-wheeler"

const STATUS_COLORS: Record<TwoWheelerServiceStatus, string> = {
    pending:   "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300",
    confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    completed: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
    cancelled: "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-300",
}

const STATUSES: TwoWheelerServiceStatus[] = ["pending", "confirmed", "completed", "cancelled"]

export default function ServiceBookingsPage() {
    const { dealerId } = useOnboardingStore()
    const [bookings, setBookings] = useState<TwoWheelerServiceBooking[]>([])
    const [total, setTotal]       = useState(0)
    const [loading, setLoading]   = useState(true)
    const [error, setError]       = useState(false)
    const [filterStatus, setFilterStatus] = useState<string>("pending")

    const load = useCallback(async () => {
        if (!dealerId) return
        setLoading(true)
        setError(false)
        try {
            const params = new URLSearchParams({ pageSize: "50" })
            if (filterStatus) params.set("status", filterStatus)
            const res  = await fetch(`/api/two-wheelers/service-booking?${params}`)
            if (!res.ok) throw new Error("Failed to load bookings")
            const data = await res.json()
            setBookings(data.bookings ?? [])
            setTotal(data.total ?? 0)
        } catch {
            setError(true)
        } finally {
            setLoading(false)
        }
    }, [dealerId, filterStatus])

    useEffect(() => { load() }, [load])

    async function updateStatus(id: string, status: TwoWheelerServiceStatus) {
        const res = await fetch("/api/two-wheelers/service-booking", {
            method:  "PATCH",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ id, status }),
        })
        if (!res.ok) {
            const data = await res.json().catch(() => null)
            toast.error(data?.error ?? "Couldn't update the booking. Please try again.")
            return
        }
        toast.success("Booking updated.")
        load()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Service Bookings</h1>
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
            ) : error ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-lg font-medium">Couldn&apos;t load bookings</p>
                    <p className="text-sm mt-1">Please check your connection and try again.</p>
                    <button
                        onClick={() => load()}
                        className="mt-4 px-4 py-1.5 text-sm rounded-lg border border-border hover:bg-muted/30"
                    >
                        Retry
                    </button>
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-lg font-medium">No service bookings</p>
                    <p className="text-sm mt-1">Service bookings from your public site will appear here.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="min-w-[840px] w-full text-sm">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Customer</th>
                                <th className="px-4 py-3 text-left font-medium">Phone</th>
                                <th className="px-4 py-3 text-left font-medium">Vehicle</th>
                                <th className="px-4 py-3 text-left font-medium">Service</th>
                                <th className="px-4 py-3 text-left font-medium">Date / Slot</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {bookings.map(b => (
                                <tr key={b.id} className="hover:bg-muted/10">
                                    <td className="px-4 py-3 font-medium">
                                        <div className="max-w-[180px] truncate">{b.customer_name}</div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <a href={`tel:${b.phone}`} className="text-primary hover:underline">{b.phone}</a>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        <div className="max-w-[220px] truncate">
                                            {b.vehicle_make && b.vehicle_model
                                                ? `${b.vehicle_make} ${b.vehicle_model} ${b.vehicle_year ?? ""}`
                                                : "—"}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 capitalize text-muted-foreground whitespace-nowrap">{b.service_type.replace("_", " ")}</td>
                                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                        {new Date(b.preferred_date).toLocaleDateString("en-IN")}<br />
                                        <span className="text-xs">{b.preferred_slot}</span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <select
                                            value={b.status}
                                            onChange={e => updateStatus(b.id, e.target.value as TwoWheelerServiceStatus)}
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

"use client"

import { useEffect, useState, useCallback } from "react"
import type { ThreeWheelerBooking, ThreeWheelerBookingStatus } from "@/lib/types/three-wheeler"

const STATUS_COLORS: Record<ThreeWheelerBookingStatus, string> = {
    pending:  "bg-yellow-100 text-yellow-700",
    paid:     "bg-green-100 text-green-700",
    failed:   "bg-red-100 text-red-700",
    refunded: "bg-gray-100 text-gray-700",
}

export default function ThreeWheelerBookingsPage() {
    const [bookings, setBookings] = useState<ThreeWheelerBooking[]>([])
    const [total,    setTotal]    = useState(0)
    const [loading,  setLoading]  = useState(true)
    const [page,     setPage]     = useState(1)

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const res  = await fetch(`/api/three-wheelers/bookings?page=${page}&pageSize=20`)
            if (!res.ok) return
            const data = await res.json()
            setBookings(data.bookings ?? [])
            setTotal(data.total ?? 0)
        } finally {
            setLoading(false)
        }
    }, [page])

    useEffect(() => { load() }, [load])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">3W Payment Bookings</h1>
                    <p className="text-muted-foreground text-sm">{total} booking{total !== 1 ? "s" : ""}</p>
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-muted/30 animate-pulse" />)}
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-lg font-medium">No bookings yet</p>
                    <p className="text-sm mt-1">Razorpay payment bookings will appear here.</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-xl border border-border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/30">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Customer</th>
                                    <th className="px-4 py-3 text-left font-medium">Phone</th>
                                    <th className="px-4 py-3 text-left font-medium">Amount</th>
                                    <th className="px-4 py-3 text-left font-medium">Razorpay Order</th>
                                    <th className="px-4 py-3 text-left font-medium">Date</th>
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
                                        <td className="px-4 py-3 font-medium">₹{(b.booking_amount_paise / 100).toLocaleString("en-IN")}</td>
                                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                                            {b.razorpay_order_id ?? "—"}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {new Date(b.created_at).toLocaleDateString("en-IN")}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[b.status]}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {((page - 1) * 20) + 1}–{Math.min(page * 20, total)} of {total}
                        </p>
                        <div className="flex gap-2">
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 text-sm rounded-lg border border-border disabled:opacity-40">Previous</button>
                            <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1 text-sm rounded-lg border border-border disabled:opacity-40">Next</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type CarServiceStatus = "pending" | "confirmed" | "assigned" | "completed" | "cancelled"

interface CarServiceBooking {
    id: string
    customer_name: string
    phone: string
    email: string | null
    vehicle_reg_no: string | null
    vehicle_make: string | null
    vehicle_model: string | null
    vehicle_year: number | null
    km_reading: number | null
    service_type: string
    preferred_date: string
    preferred_slot: string
    service_location: string | null
    notes: string | null
    status: CarServiceStatus
    assigned_partner: string | null
    referral_url: string | null
    admin_notes: string | null
}

const STATUSES: CarServiceStatus[] = ["pending", "confirmed", "assigned", "completed", "cancelled"]

const STATUS_COLORS: Record<CarServiceStatus, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    assigned: "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-700",
}

function label(value: string) {
    return value.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase())
}

export default function CarServicePage() {
    const [bookings, setBookings] = useState<CarServiceBooking[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState<string>("pending")
    const [savingId, setSavingId] = useState("")
    const [partnerInputs, setPartnerInputs] = useState<Record<string, string>>({})
    const [referralInputs, setReferralInputs] = useState<Record<string, string>>({})
    const [notesInputs, setNotesInputs] = useState<Record<string, string>>({})

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ pageSize: "50" })
            if (filterStatus) params.set("status", filterStatus)
            const res = await fetch(`/api/car-service-bookings?${params}`)
            const data = await res.json()
            const nextBookings = data.bookings ?? []
            setBookings(nextBookings)
            setTotal(data.total ?? 0)
            setPartnerInputs(Object.fromEntries(nextBookings.map((b: CarServiceBooking) => [b.id, b.assigned_partner ?? ""])))
            setReferralInputs(Object.fromEntries(nextBookings.map((b: CarServiceBooking) => [b.id, b.referral_url ?? ""])))
            setNotesInputs(Object.fromEntries(nextBookings.map((b: CarServiceBooking) => [b.id, b.admin_notes ?? ""])))
        } finally {
            setLoading(false)
        }
    }, [filterStatus])

    useEffect(() => { load() }, [load])

    async function updateBooking(booking: CarServiceBooking, status: CarServiceStatus) {
        setSavingId(booking.id)
        await fetch("/api/car-service-bookings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: booking.id,
                status,
                assigned_partner: partnerInputs[booking.id] || null,
                referral_url: referralInputs[booking.id] || null,
                admin_notes: notesInputs[booking.id] || null,
            }),
        })
        setSavingId("")
        load()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Car Service Bookings</h1>
                    <p className="text-muted-foreground text-sm">{total} booking{total !== 1 ? "s" : ""} captured from 4W service forms</p>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">Filter:</label>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
                    >
                        <option value="">All Statuses</option>
                        {STATUSES.map(status => <option key={status} value={status}>{label(status)}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-muted/30 animate-pulse" />)}
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-lg font-medium">No car service bookings</p>
                    <p className="text-sm mt-1">Service leads from public car dealer sites will appear here.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full min-w-[980px] text-sm">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Customer</th>
                                <th className="px-4 py-3 text-left font-medium">Vehicle</th>
                                <th className="px-4 py-3 text-left font-medium">Service</th>
                                <th className="px-4 py-3 text-left font-medium">Date / Location</th>
                                <th className="px-4 py-3 text-left font-medium">Partner / Referral</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {bookings.map(booking => (
                                <tr key={booking.id} className="hover:bg-muted/10 align-top">
                                    <td className="px-4 py-3">
                                        <p className="font-medium">{booking.customer_name}</p>
                                        <a href={`tel:${booking.phone}`} className="text-primary hover:underline">{booking.phone}</a>
                                        {booking.email && <p className="text-xs text-muted-foreground">{booking.email}</p>}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        <p>{[booking.vehicle_make, booking.vehicle_model, booking.vehicle_year].filter(Boolean).join(" ") || "Vehicle N/A"}</p>
                                        {booking.vehicle_reg_no && <p className="text-xs uppercase">{booking.vehicle_reg_no}</p>}
                                        {booking.km_reading != null && <p className="text-xs">{booking.km_reading.toLocaleString("en-IN")} km</p>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium">{label(booking.service_type)}</p>
                                        {booking.notes && <p className="mt-1 max-w-xs text-xs text-muted-foreground line-clamp-2">{booking.notes}</p>}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        <p>{new Date(booking.preferred_date).toLocaleDateString("en-IN")}</p>
                                        <p className="text-xs">{booking.preferred_slot}</p>
                                        {booking.service_location && <p className="text-xs">{booking.service_location}</p>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="space-y-2">
                                            <Input
                                                value={partnerInputs[booking.id] ?? ""}
                                                onChange={e => setPartnerInputs(prev => ({ ...prev, [booking.id]: e.target.value }))}
                                                placeholder="Partner center"
                                                className="h-8 text-xs"
                                            />
                                            <Input
                                                value={referralInputs[booking.id] ?? ""}
                                                onChange={e => setReferralInputs(prev => ({ ...prev, [booking.id]: e.target.value }))}
                                                placeholder="Referral URL"
                                                className="h-8 text-xs"
                                            />
                                            <Input
                                                value={notesInputs[booking.id] ?? ""}
                                                onChange={e => setNotesInputs(prev => ({ ...prev, [booking.id]: e.target.value }))}
                                                placeholder="Admin notes / follow-up"
                                                className="h-8 text-xs"
                                            />
                                            {booking.referral_url && (
                                                <a
                                                    href={booking.referral_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs text-primary hover:underline"
                                                >
                                                    Open referral link
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="space-y-2">
                                            <select
                                                value={booking.status}
                                                onChange={e => updateBooking(booking, e.target.value as CarServiceStatus)}
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium border-0 cursor-pointer ${STATUS_COLORS[booking.status]}`}
                                            >
                                                {STATUSES.map(status => <option key={status} value={status}>{label(status)}</option>)}
                                            </select>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 text-xs"
                                                disabled={savingId === booking.id}
                                                onClick={() => updateBooking(booking, booking.status === "pending" ? "assigned" : booking.status)}
                                            >
                                                Save Assignment
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

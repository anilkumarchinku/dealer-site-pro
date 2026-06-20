"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/lib/utils/toast"

async function readError(res: Response, fallback: string): Promise<string> {
    const data = await res.json().catch(() => null)
    return data?.error ?? fallback
}

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
    service_center_id?: string | null
    service_pricing_tier_id?: string | null
    notes: string | null
    status: CarServiceStatus
    assigned_partner: string | null
    referral_url: string | null
    admin_notes: string | null
}

interface ServiceCenter {
    id: string
    name: string
    address: string
    city: string | null
    phone: string | null
    maps_url: string | null
    referral_url: string | null
    working_hours: string | null
    description: string | null
    image_urls: string[]
    is_active: boolean
    display_order: number
}

interface ServiceTier {
    id: string
    service_center_id: string | null
    name: string
    description: string | null
    price_paise: number
    duration: string | null
    is_active: boolean
    display_order: number
}

interface ServiceCenterReview {
    id: string
    service_center_id: string
    reviewer_name: string
    rating: number
    review_text: string | null
    moderation_status: "pending" | "approved" | "rejected" | "flagged"
    is_approved: boolean
    show_on_homepage: boolean
    service_centers?: { name?: string }
}

const STATUSES: CarServiceStatus[] = ["pending", "confirmed", "assigned", "completed", "cancelled"]

const STATUS_COLORS: Record<CarServiceStatus, string> = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300",
    confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
    assigned: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300",
    completed: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300",
    cancelled: "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-300",
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
    const [centers, setCenters] = useState<ServiceCenter[]>([])
    const [tiers, setTiers] = useState<ServiceTier[]>([])
    const [reviews, setReviews] = useState<ServiceCenterReview[]>([])
    const [centerForm, setCenterForm] = useState({
        id: "",
        name: "",
        address: "",
        city: "",
        phone: "",
        maps_url: "",
        referral_url: "",
        working_hours: "",
        description: "",
        image_urls: [] as string[],
        is_active: true,
    })
    const [tierForm, setTierForm] = useState({
        id: "",
        service_center_id: "",
        name: "",
        description: "",
        price_inr: "",
        duration: "",
        is_active: true,
    })
    const [savingConfig, setSavingConfig] = useState(false)
    const [partnerInputs, setPartnerInputs] = useState<Record<string, string>>({})
    const [referralInputs, setReferralInputs] = useState<Record<string, string>>({})
    const [notesInputs, setNotesInputs] = useState<Record<string, string>>({})

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ pageSize: "50" })
            if (filterStatus) params.set("status", filterStatus)
            const [bookingsRes, centersRes, reviewsRes] = await Promise.all([
                fetch(`/api/car-service-bookings?${params}`),
                fetch("/api/service-centers?admin=true"),
                fetch("/api/service-center-reviews?admin=true"),
            ])
            const data = await bookingsRes.json()
            const centersData = await centersRes.json().catch(() => null)
            const reviewsData = await reviewsRes.json().catch(() => null)
            const nextBookings = data.bookings ?? []
            setBookings(nextBookings)
            setTotal(data.total ?? 0)
            setCenters(centersData?.centers ?? [])
            setTiers(centersData?.tiers ?? [])
            setReviews(reviewsData?.reviews ?? [])
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
        try {
            const res = await fetch("/api/car-service-bookings", {
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
            if (!res.ok) {
                toast.error(await readError(res, "Couldn't update the booking. Please try again."))
                return
            }
            toast.success("Booking updated.")
            await load()
        } finally {
            setSavingId("")
        }
    }

    async function uploadCenterImages(files: FileList | null) {
        if (!files?.length) return
        setSavingConfig(true)
        try {
            const next = [...centerForm.image_urls]
            for (const file of Array.from(files).slice(0, 10 - next.length)) {
                const formData = new FormData()
                formData.append("file", file)
                const res = await fetch("/api/service-centers/upload-image", { method: "POST", body: formData })
                const data = await res.json()
                if (res.ok && data.url) next.push(data.url)
            }
            setCenterForm(prev => ({ ...prev, image_urls: next.slice(0, 10) }))
        } finally {
            setSavingConfig(false)
        }
    }

    async function saveCenter() {
        setSavingConfig(true)
        try {
            const res = await fetch("/api/service-centers", {
                method: centerForm.id ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(centerForm),
            })
            if (!res.ok) {
                // Keep the form populated so the operator doesn't lose their input.
                toast.error(await readError(res, "Couldn't save the service center. Please try again."))
                return
            }
            toast.success(centerForm.id ? "Service center updated." : "Service center added.")
            setCenterForm({ id: "", name: "", address: "", city: "", phone: "", maps_url: "", referral_url: "", working_hours: "", description: "", image_urls: [], is_active: true })
            await load()
        } finally {
            setSavingConfig(false)
        }
    }

    async function saveTier() {
        setSavingConfig(true)
        try {
            const res = await fetch("/api/service-centers", {
                method: tierForm.id ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...tierForm, type: "tier" }),
            })
            if (!res.ok) {
                toast.error(await readError(res, "Couldn't save the service price. Please try again."))
                return
            }
            toast.success(tierForm.id ? "Service price updated." : "Service price added.")
            setTierForm({ id: "", service_center_id: "", name: "", description: "", price_inr: "", duration: "", is_active: true })
            await load()
        } finally {
            setSavingConfig(false)
        }
    }

    function editCenter(center: ServiceCenter) {
        setCenterForm({
            id: center.id,
            name: center.name,
            address: center.address,
            city: center.city ?? "",
            phone: center.phone ?? "",
            maps_url: center.maps_url ?? "",
            referral_url: center.referral_url ?? "",
            working_hours: center.working_hours ?? "",
            description: center.description ?? "",
            image_urls: center.image_urls ?? [],
            is_active: center.is_active,
        })
    }

    function editTier(tier: ServiceTier) {
        setTierForm({
            id: tier.id,
            service_center_id: tier.service_center_id ?? "",
            name: tier.name,
            description: tier.description ?? "",
            price_inr: String(Math.round(tier.price_paise / 100)),
            duration: tier.duration ?? "",
            is_active: tier.is_active,
        })
    }

    async function moderateServiceReview(review: ServiceCenterReview, action: "approve" | "reject" | "flag") {
        const res = await fetch("/api/service-center-reviews", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: review.id, action }),
        })
        if (!res.ok) {
            toast.error(await readError(res, "Couldn't update the review. Please try again."))
            return
        }
        toast.success(`Review ${action === "approve" ? "approved" : action === "reject" ? "rejected" : "flagged"}.`)
        await load()
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

            <section className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-4">
                    <h2 className="text-lg font-semibold">{centerForm.id ? "Edit Service Center" : "Add Service Center"}</h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <Input placeholder="Center name" value={centerForm.name} onChange={e => setCenterForm(prev => ({ ...prev, name: e.target.value }))} />
                        <Input placeholder="City" value={centerForm.city} onChange={e => setCenterForm(prev => ({ ...prev, city: e.target.value }))} />
                        <Input className="sm:col-span-2" placeholder="Address" value={centerForm.address} onChange={e => setCenterForm(prev => ({ ...prev, address: e.target.value }))} />
                        <Input placeholder="Phone" value={centerForm.phone} onChange={e => setCenterForm(prev => ({ ...prev, phone: e.target.value }))} />
                        <Input placeholder="Working hours" value={centerForm.working_hours} onChange={e => setCenterForm(prev => ({ ...prev, working_hours: e.target.value }))} />
                        <Input className="sm:col-span-2" placeholder="Google Maps URL" value={centerForm.maps_url} onChange={e => setCenterForm(prev => ({ ...prev, maps_url: e.target.value }))} />
                        <Input className="sm:col-span-2" placeholder="Partner referral URL" value={centerForm.referral_url} onChange={e => setCenterForm(prev => ({ ...prev, referral_url: e.target.value }))} />
                        <textarea className="rounded-md border border-input bg-background px-3 py-2 text-sm sm:col-span-2" rows={2} placeholder="Description" value={centerForm.description} onChange={e => setCenterForm(prev => ({ ...prev, description: e.target.value }))} />
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={centerForm.is_active} onChange={e => setCenterForm(prev => ({ ...prev, is_active: e.target.checked }))} />
                            Active on website
                        </label>
                        <Input type="file" accept="image/*" multiple onChange={e => uploadCenterImages(e.target.files)} />
                    </div>
                    {centerForm.image_urls.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {centerForm.image_urls.map(url => (
                                <div key={url} className="relative h-16 w-24 overflow-hidden rounded border border-border">
                                    <Image src={url} alt="" fill unoptimized className="object-cover" />
                                    <button type="button" className="absolute right-1 top-1 rounded bg-black/70 px-1 text-xs text-white" onClick={() => setCenterForm(prev => ({ ...prev, image_urls: prev.image_urls.filter(item => item !== url) }))}>x</button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-4 flex gap-2">
                        <Button onClick={saveCenter} disabled={savingConfig || !centerForm.name || !centerForm.address}>{savingConfig ? "Saving..." : "Save Center"}</Button>
                        {centerForm.id && <Button variant="outline" onClick={() => setCenterForm({ id: "", name: "", address: "", city: "", phone: "", maps_url: "", referral_url: "", working_hours: "", description: "", image_urls: [], is_active: true })}>Cancel Edit</Button>}
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                    <h2 className="text-lg font-semibold">{tierForm.id ? "Edit Service Price" : "Add Service Price"}</h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <select className="rounded-md border border-input bg-background px-3 py-2 text-sm sm:col-span-2" value={tierForm.service_center_id} onChange={e => setTierForm(prev => ({ ...prev, service_center_id: e.target.value }))}>
                            <option value="">All service centers</option>
                            {centers.map(center => <option key={center.id} value={center.id}>{center.name}</option>)}
                        </select>
                        <Input placeholder="Package name" value={tierForm.name} onChange={e => setTierForm(prev => ({ ...prev, name: e.target.value }))} />
                        <Input placeholder="Price in ₹" type="number" value={tierForm.price_inr} onChange={e => setTierForm(prev => ({ ...prev, price_inr: e.target.value }))} />
                        <Input placeholder="Duration" value={tierForm.duration} onChange={e => setTierForm(prev => ({ ...prev, duration: e.target.value }))} />
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={tierForm.is_active} onChange={e => setTierForm(prev => ({ ...prev, is_active: e.target.checked }))} />
                            Active on website
                        </label>
                        <textarea className="rounded-md border border-input bg-background px-3 py-2 text-sm sm:col-span-2" rows={2} placeholder="Description" value={tierForm.description} onChange={e => setTierForm(prev => ({ ...prev, description: e.target.value }))} />
                    </div>
                    <div className="mt-4 flex gap-2">
                        <Button onClick={saveTier} disabled={savingConfig || !tierForm.name}>{savingConfig ? "Saving..." : "Save Price"}</Button>
                        {tierForm.id && <Button variant="outline" onClick={() => setTierForm({ id: "", service_center_id: "", name: "", description: "", price_inr: "", duration: "", is_active: true })}>Cancel Edit</Button>}
                    </div>
                </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-4">
                    <h2 className="text-lg font-semibold">Service Centers</h2>
                    <div className="mt-3 space-y-2">
                        {centers.length === 0 ? <p className="text-sm text-muted-foreground">No centers added yet.</p> : centers.map(center => (
                            <div key={center.id} className="flex items-start justify-between gap-3 rounded-lg bg-muted/30 p-3">
                                <div>
                                    <p className="font-medium">{center.name}</p>
                                    <p className="text-xs text-muted-foreground">{center.address}</p>
                                    <p className="text-xs text-muted-foreground">{center.image_urls?.length ?? 0}/10 images · {center.is_active ? "Active" : "Hidden"}</p>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => editCenter(center)}>Edit</Button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                    <h2 className="text-lg font-semibold">Service Prices</h2>
                    <div className="mt-3 space-y-2">
                        {tiers.length === 0 ? <p className="text-sm text-muted-foreground">No prices added yet.</p> : tiers.map(tier => (
                            <div key={tier.id} className="flex items-start justify-between gap-3 rounded-lg bg-muted/30 p-3">
                                <div>
                                    <p className="font-medium">{tier.name} · ₹{Math.round(tier.price_paise / 100).toLocaleString("en-IN")}</p>
                                    <p className="text-xs text-muted-foreground">{centers.find(center => center.id === tier.service_center_id)?.name ?? "All centers"} · {tier.is_active ? "Active" : "Hidden"}</p>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => editTier(tier)}>Edit</Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-4">
                <h2 className="text-lg font-semibold">Service Center Reviews</h2>
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                    {reviews.length === 0 ? <p className="text-sm text-muted-foreground">No service center reviews yet.</p> : reviews.map(review => (
                        <div key={review.id} className="rounded-lg bg-muted/30 p-3">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-medium">{review.reviewer_name} · {review.rating}/5</p>
                                    <p className="text-xs text-muted-foreground">{review.service_centers?.name ?? "Service center"} · {review.moderation_status}</p>
                                </div>
                                <div className="flex gap-1">
                                    <Button size="sm" variant="outline" onClick={() => moderateServiceReview(review, "approve")}>Approve</Button>
                                    <Button size="sm" variant="outline" onClick={() => moderateServiceReview(review, "flag")}>Flag</Button>
                                    <Button size="sm" variant="outline" onClick={() => moderateServiceReview(review, "reject")}>Reject</Button>
                                </div>
                            </div>
                            {review.review_text && <p className="mt-2 text-sm text-muted-foreground">{review.review_text}</p>}
                        </div>
                    ))}
                </div>
            </section>

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

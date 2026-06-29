"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Phone, Star, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LocationsMapSection } from "@/components/templates/sections/LocationsMapSection"

type ServiceCenter = {
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
}

type ServiceTier = {
    id: string
    service_center_id: string | null
    name: string
    description: string | null
    price_paise: number
    duration: string | null
}

type Review = {
    id: string
    service_center_id: string
    reviewer_name: string
    rating: number
    review_text: string | null
}

type Props = {
    dealerId: string
    dealerName: string
    siteSlug: string
    centers: ServiceCenter[]
    tiers: ServiceTier[]
    initialReviews: Review[]
    mainAddress?: string
    mainPhone?: string
    branches?: Array<{ city: string; address: string; phone?: string }> | null
}

const SERVICE_TYPES = [
    ["periodic_service", "Periodic Service"],
    ["ac_service", "AC Service"],
    ["tyre_alignment", "Tyre Alignment"],
    ["accident_repair", "Accident Repair"],
    ["inspection", "Inspection"],
    ["battery", "Battery"],
    ["insurance_claim", "Insurance Claim"],
]

function money(paise: number) {
    return `₹${Math.round(paise / 100).toLocaleString("en-IN")}`
}

function Stars({ value, onSelect }: { value: number; onSelect?: (rating: number) => void }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => onSelect?.(star)} disabled={!onSelect}>
                    <Star className={`h-4 w-4 ${star <= value ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                </button>
            ))}
        </div>
    )
}

export function PublicServiceCentersPage({ dealerId, dealerName, siteSlug, centers, tiers, initialReviews, mainAddress, mainPhone, branches }: Props) {
    const [selectedCenterId, setSelectedCenterId] = useState(centers[0]?.id ?? "")
    const [activeImage, setActiveImage] = useState<Record<string, number>>({})
    const [reviews] = useState(initialReviews)
    const [bookingStatus, setBookingStatus] = useState("")
    const [reviewStatus, setReviewStatus] = useState<Record<string, string>>({})
    const [booking, setBooking] = useState({
        customer_name: "",
        phone: "",
        email: "",
        vehicle_reg_no: "",
        vehicle_make: "",
        vehicle_model: "",
        vehicle_year: "",
        km_reading: "",
        service_type: "periodic_service",
        service_pricing_tier_id: "",
        preferred_date: "",
        preferred_slot: "",
        notes: "",
    })
    const [reviewForm, setReviewForm] = useState<Record<string, { name: string; email: string; phone: string; rating: number; text: string }>>({})
    const selectedCenter = centers.find(center => center.id === selectedCenterId) ?? centers[0]

    const tiersForCenter = useMemo(() => {
        if (!selectedCenter) return []
        return tiers.filter(tier => !tier.service_center_id || tier.service_center_id === selectedCenter.id)
    }, [selectedCenter, tiers])

    async function submitBooking(event: React.FormEvent) {
        event.preventDefault()
        if (!selectedCenter) return
        setBookingStatus("Submitting...")
        const selectedTier = tiers.find(tier => tier.id === booking.service_pricing_tier_id)
        const res = await fetch("/api/car-service-bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                dealer_id: dealerId,
                ...booking,
                vehicle_year: booking.vehicle_year ? Number(booking.vehicle_year) : null,
                km_reading: booking.km_reading ? Number(booking.km_reading) : null,
                service_center_id: selectedCenter.id,
                service_location: selectedCenter.name,
                service_pricing_tier_id: selectedTier?.id || null,
            }),
        })
        if (res.ok) {
            setBookingStatus("Service appointment submitted. The team will contact you shortly.")
            setBooking(prev => ({ ...prev, customer_name: "", phone: "", email: "", vehicle_reg_no: "", notes: "" }))
        } else {
            const data = await res.json().catch(() => null)
            setBookingStatus(data?.error ?? "Could not submit booking.")
        }
    }

    async function submitReview(center: ServiceCenter) {
        const form = reviewForm[center.id] ?? { name: "", email: "", phone: "", rating: 0, text: "" }
        if (!form.email && !form.phone) {
            setReviewStatus(prev => ({ ...prev, [center.id]: "Email or phone is required to verify your identity." }))
            return
        }
        setReviewStatus(prev => ({ ...prev, [center.id]: "Submitting..." }))
        const res = await fetch("/api/service-center-reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                service_center_id: center.id,
                reviewer_name: form.name,
                reviewer_email: form.email || null,
                reviewer_phone: form.phone || null,
                rating: form.rating,
                review_text: form.text,
            }),
        })
        const data = await res.json().catch(() => null)
        setReviewStatus(prev => ({ ...prev, [center.id]: res.ok ? data.message : data?.error ?? "Could not submit review." }))
        if (res.ok) setReviewForm(prev => ({ ...prev, [center.id]: { name: "", email: "", phone: "", rating: 0, text: "" } }))
    }

    return (
        <main className="min-h-screen bg-white text-slate-950">
            <header className="border-b border-slate-200">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <Link href={`/sites/${siteSlug}`} className="font-bold">{dealerName}</Link>
                    <Link href={`/sites/${siteSlug}`} className="text-sm text-slate-600 hover:text-slate-950">Back to Website</Link>
                </div>
            </header>

            <section className="mx-auto max-w-6xl px-4 py-10">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Service Centers</p>
                    <h1 className="mt-2 text-4xl font-black tracking-tight">Book Service Appointment</h1>
                    <p className="mt-3 max-w-2xl text-slate-600">Choose a service center, compare packages, view workshop photos, and book a preferred time.</p>
                </div>

                {mainAddress && (
                    <LocationsMapSection
                        dealerName={dealerName}
                        mainAddress={mainAddress}
                        mainPhone={mainPhone ?? ""}
                        branches={branches}
                        serviceCenters={centers.map(c => ({
                            name: c.name,
                            address: c.address,
                            city: c.city,
                            phone: c.phone,
                            working_hours: c.working_hours,
                            maps_url: c.maps_url,
                        }))}
                    />
                )}

                {centers.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 p-8 text-center text-slate-600">No service centers are available yet.</div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                        <div className="space-y-5">
                            {centers.map(center => {
                                const images = center.image_urls?.length ? center.image_urls : ["/placeholder-car.jpg"]
                                const imageIndex = activeImage[center.id] ?? 0
                                const centerReviews = reviews.filter(review => review.service_center_id === center.id)
                                const avg = centerReviews.length ? centerReviews.reduce((sum, r) => sum + r.rating, 0) / centerReviews.length : 0
                                const form = reviewForm[center.id] ?? { name: "", email: "", phone: "", rating: 0, text: "" }
                                return (
                                    <article key={center.id} className={`rounded-xl border p-4 ${selectedCenterId === center.id ? "border-emerald-500" : "border-slate-200"}`}>
                                        <div className="grid gap-4 md:grid-cols-[240px_1fr]">
                                            <div>
                                                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
                                                    <Image src={images[imageIndex] ?? images[0]} alt={center.name} fill unoptimized className="object-cover" />
                                                </div>
                                                {images.length > 1 && (
                                                    <div className="mt-2 flex gap-2 overflow-x-auto">
                                                        {images.map((url, index) => (
                                                            <button key={url} onClick={() => setActiveImage(prev => ({ ...prev, [center.id]: index }))} className="relative h-12 w-16 shrink-0 overflow-hidden rounded border border-slate-200">
                                                                <Image src={url} alt="" fill unoptimized className="object-cover" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                    <div>
                                                        <h2 className="text-2xl font-bold">{center.name}</h2>
                                                        <p className="mt-1 flex gap-2 text-sm text-slate-600"><MapPin className="h-4 w-4 shrink-0" />{center.address}</p>
                                                    </div>
                                                    <Button onClick={() => setSelectedCenterId(center.id)}>Choose Center</Button>
                                                </div>
                                                {center.description && <p className="text-sm text-slate-600">{center.description}</p>}
                                                <div className="flex flex-wrap gap-2 text-sm">
                                                    {center.phone && <a href={`tel:${center.phone}`} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1"><Phone className="h-4 w-4" />{center.phone}</a>}
                                                    {center.working_hours && <span className="rounded-full bg-slate-100 px-3 py-1">{center.working_hours}</span>}
                                                    {center.maps_url && <a href={center.maps_url} target="_blank" rel="noreferrer" className="rounded-full bg-slate-950 px-3 py-1 text-white">Open Map</a>}
                                                    {center.referral_url && <a href={center.referral_url} target="_blank" rel="noreferrer" className="rounded-full bg-emerald-600 px-3 py-1 text-white">Partner Link</a>}
                                                </div>
                                                <div className="rounded-lg bg-slate-50 p-3">
                                                    <div className="flex items-center gap-2 text-sm font-semibold"><Stars value={Math.round(avg)} /> {centerReviews.length ? `${avg.toFixed(1)} from ${centerReviews.length} review${centerReviews.length !== 1 ? "s" : ""}` : "No reviews yet"}</div>
                                                    <div className="mt-3 grid gap-2">
                                                        {centerReviews.slice(0, 3).map(review => (
                                                            <p key={review.id} className="text-sm text-slate-600"><strong>{review.reviewer_name}:</strong> {review.review_text || `${review.rating}/5 service rating`}</p>
                                                        ))}
                                                    </div>
                                                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                                        <Input placeholder="Your name *" value={form.name} onChange={e => setReviewForm(prev => ({ ...prev, [center.id]: { ...form, name: e.target.value } }))} />
                                                        <div className="flex items-center"><Stars value={form.rating} onSelect={rating => setReviewForm(prev => ({ ...prev, [center.id]: { ...form, rating } }))} /></div>
                                                        <Input type="email" placeholder="Email" value={form.email} onChange={e => setReviewForm(prev => ({ ...prev, [center.id]: { ...form, email: e.target.value } }))} />
                                                        <Input type="tel" placeholder="Phone" value={form.phone} onChange={e => setReviewForm(prev => ({ ...prev, [center.id]: { ...form, phone: e.target.value } }))} />
                                                        <p className="text-[11px] text-slate-500 sm:col-span-2 -mt-1">We verify your email/phone against our records to ensure only genuine customers can review.</p>
                                                        <textarea className="rounded-md border border-input px-3 py-2 text-sm sm:col-span-2" rows={2} placeholder="Rate this service center" value={form.text} onChange={e => setReviewForm(prev => ({ ...prev, [center.id]: { ...form, text: e.target.value } }))} />
                                                        <Button type="button" variant="outline" onClick={() => submitReview(center)}>Submit Center Review</Button>
                                                        {reviewStatus[center.id] && <p className="text-xs text-slate-600 sm:self-center">{reviewStatus[center.id]}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>

                        <aside className="sticky top-4 h-fit rounded-xl border border-slate-200 p-5">
                            <h2 className="text-xl font-bold">Book Service</h2>
                            {selectedCenter && <p className="mt-1 text-sm text-slate-600">Selected: {selectedCenter.name}</p>}
                            <div className="mt-4 space-y-3">
                                {tiersForCenter.map(tier => (
                                    <label key={tier.id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3">
                                        <input type="radio" name="tier" checked={booking.service_pricing_tier_id === tier.id} onChange={() => setBooking(prev => ({ ...prev, service_pricing_tier_id: tier.id }))} />
                                        <span className="flex-1">
                                            <span className="block font-semibold">{tier.name} - {money(tier.price_paise)}</span>
                                            <span className="text-sm text-slate-600">{tier.description || tier.duration || "Service package"}</span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <form onSubmit={submitBooking} className="mt-5 space-y-3">
                                <Input required placeholder="Customer name" value={booking.customer_name} onChange={e => setBooking(prev => ({ ...prev, customer_name: e.target.value }))} />
                                <Input required placeholder="Phone" value={booking.phone} onChange={e => setBooking(prev => ({ ...prev, phone: e.target.value }))} />
                                <Input placeholder="Email" value={booking.email} onChange={e => setBooking(prev => ({ ...prev, email: e.target.value }))} />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="Make" value={booking.vehicle_make} onChange={e => setBooking(prev => ({ ...prev, vehicle_make: e.target.value }))} />
                                    <Input placeholder="Model" value={booking.vehicle_model} onChange={e => setBooking(prev => ({ ...prev, vehicle_model: e.target.value }))} />
                                    <Input placeholder="Year" type="number" value={booking.vehicle_year} onChange={e => setBooking(prev => ({ ...prev, vehicle_year: e.target.value }))} />
                                    <Input placeholder="KM reading" type="number" value={booking.km_reading} onChange={e => setBooking(prev => ({ ...prev, km_reading: e.target.value }))} />
                                </div>
                                <Input placeholder="Registration number" value={booking.vehicle_reg_no} onChange={e => setBooking(prev => ({ ...prev, vehicle_reg_no: e.target.value.toUpperCase() }))} />
                                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={booking.service_type} onChange={e => setBooking(prev => ({ ...prev, service_type: e.target.value }))}>
                                    {SERVICE_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                </select>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input required type="date" value={booking.preferred_date} onChange={e => setBooking(prev => ({ ...prev, preferred_date: e.target.value }))} />
                                    <Input required placeholder="Preferred time" value={booking.preferred_slot} onChange={e => setBooking(prev => ({ ...prev, preferred_slot: e.target.value }))} />
                                </div>
                                <textarea className="w-full rounded-md border border-input px-3 py-2 text-sm" rows={3} placeholder="Notes / issue" value={booking.notes} onChange={e => setBooking(prev => ({ ...prev, notes: e.target.value }))} />
                                <Button type="submit" className="w-full gap-2"><Calendar className="h-4 w-4" />Book Service Appointment</Button>
                                {bookingStatus && <p className="text-sm text-slate-600">{bookingStatus}</p>}
                            </form>
                        </aside>
                    </div>
                )}
            </section>

            <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
                <Wrench className="mx-auto mb-2 h-5 w-5" />
                {dealerName} Service
            </footer>
        </main>
    )
}

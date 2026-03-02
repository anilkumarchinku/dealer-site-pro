"use client"

import { useState } from "react"
import type { TwoWheelerServiceType } from "@/lib/types/two-wheeler"

interface Props {
    dealerId: string
}

const SERVICE_TYPES: { value: TwoWheelerServiceType; label: string }[] = [
    { value: "general_service", label: "General Service" },
    { value: "oil_change",      label: "Oil Change"      },
    { value: "tyre",            label: "Tyre Service"    },
    { value: "battery",         label: "Battery Service" },
    { value: "repair",          label: "Repair Work"     },
    { value: "amc",             label: "AMC Package"     },
]

const SLOTS = ["9:00 AM – 11:00 AM", "11:00 AM – 1:00 PM", "2:00 PM – 4:00 PM", "4:00 PM – 6:00 PM"]

export function ServiceBookingForm({ dealerId }: Props) {
    const [form, setForm] = useState({
        customer_name:  "",
        phone:          "",
        vehicle_make:   "",
        vehicle_model:  "",
        vehicle_year:   "",
        km_reading:     "",
        service_type:   "" as TwoWheelerServiceType | "",
        preferred_date: "",
        preferred_slot: SLOTS[0],
    })
    const [submitting, setSubmitting] = useState(false)
    const [submitted,  setSubmitted]  = useState(false)
    const [error,      setError]      = useState("")

    function set(field: string, value: string) {
        setForm(f => ({ ...f, [field]: value }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.service_type) { setError("Please select a service type"); return }
        setSubmitting(true)
        setError("")

        try {
            const res = await fetch("/api/two-wheelers/service-booking", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({
                    dealer_id:      dealerId,
                    customer_name:  form.customer_name,
                    phone:          form.phone,
                    vehicle_make:   form.vehicle_make  || null,
                    vehicle_model:  form.vehicle_model || null,
                    vehicle_year:   form.vehicle_year  ? Number(form.vehicle_year) : null,
                    km_reading:     form.km_reading    ? Number(form.km_reading)   : null,
                    service_type:   form.service_type,
                    preferred_date: form.preferred_date,
                    preferred_slot: form.preferred_slot,
                }),
            })
            if (!res.ok) throw new Error("Failed to submit")
            setSubmitted(true)
        } catch {
            setError("Booking failed. Please call us directly.")
        } finally {
            setSubmitting(false)
        }
    }

    if (submitted) {
        return (
            <div className="text-center py-12 space-y-3">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold">Booking Confirmed!</h3>
                <p className="text-muted-foreground">We will call you to confirm your appointment.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Customer info */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Name *</label>
                    <input value={form.customer_name} onChange={e => set("customer_name", e.target.value)} required className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Your name" />
                </div>
                <div>
                    <label className="text-sm font-medium">Phone *</label>
                    <input value={form.phone} onChange={e => set("phone", e.target.value)} required type="tel" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Mobile number" />
                </div>
            </div>

            {/* Vehicle info */}
            <div className="grid sm:grid-cols-3 gap-4">
                <div>
                    <label className="text-sm font-medium">Make</label>
                    <input value={form.vehicle_make} onChange={e => set("vehicle_make", e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. Hero" />
                </div>
                <div>
                    <label className="text-sm font-medium">Model</label>
                    <input value={form.vehicle_model} onChange={e => set("vehicle_model", e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="e.g. Splendor" />
                </div>
                <div>
                    <label className="text-sm font-medium">Year</label>
                    <input value={form.vehicle_year} onChange={e => set("vehicle_year", e.target.value)} type="number" min={2000} max={2030} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="2022" />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium">KM Reading</label>
                <input value={form.km_reading} onChange={e => set("km_reading", e.target.value)} type="number" className="mt-1 w-48 rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="15000" />
            </div>

            {/* Service type */}
            <div>
                <label className="text-sm font-medium">Service Type *</label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SERVICE_TYPES.map(s => (
                        <button
                            key={s.value}
                            type="button"
                            onClick={() => set("service_type", s.value)}
                            className={`px-3 py-2.5 text-sm rounded-lg border transition-colors ${
                                form.service_type === s.value
                                    ? "border-primary bg-primary/10 text-primary font-medium"
                                    : "border-border hover:bg-muted/50"
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Appointment */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Preferred Date *</label>
                    <input
                        value={form.preferred_date}
                        onChange={e => set("preferred_date", e.target.value)}
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Time Slot *</label>
                    <select value={form.preferred_slot} onChange={e => set("preferred_slot", e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                        {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground rounded-lg py-3 text-sm font-semibold disabled:opacity-50">
                {submitting ? "Booking..." : "Book Service Appointment"}
            </button>
        </form>
    )
}

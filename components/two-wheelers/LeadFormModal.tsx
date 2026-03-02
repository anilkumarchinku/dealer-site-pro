"use client"

import { useState } from "react"
import type { TwoWheelerLeadType } from "@/lib/types/two-wheeler"
import { X } from "lucide-react"

interface Props {
    dealerId:      string
    vehicleId?:    string
    usedVehicleId?: string
    leadType:      TwoWheelerLeadType
    title:         string
    isOpen:        boolean
    onClose:       () => void
}

export function LeadFormModal({
    dealerId, vehicleId, usedVehicleId, leadType, title, isOpen, onClose
}: Props) {
    const [name,          setName]           = useState("")
    const [phone,         setPhone]          = useState("")
    const [email,         setEmail]          = useState("")
    const [preferredDate, setPreferredDate]  = useState("")
    const [message,       setMessage]        = useState("")
    const [offerPrice,    setOfferPrice]     = useState("")
    const [submitting,    setSubmitting]     = useState(false)
    const [submitted,     setSubmitted]      = useState(false)
    const [error,         setError]          = useState("")

    if (!isOpen) return null

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!name || !phone) return
        setSubmitting(true)
        setError("")

        try {
            const res = await fetch("/api/two-wheelers/leads", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({
                    dealer_id:         dealerId,
                    vehicle_id:        vehicleId        ?? null,
                    used_vehicle_id:   usedVehicleId    ?? null,
                    lead_type:         leadType,
                    name,
                    phone,
                    email:             email          || null,
                    preferred_date:    preferredDate  || null,
                    message:           message        || null,
                    offer_price_paise: offerPrice ? Math.round(Number(offerPrice) * 100) : null,
                }),
            })
            if (!res.ok) throw new Error("Failed to submit")
            setSubmitted(true)
        } catch {
            setError("Something went wrong. Please call us directly.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                </div>

                {submitted ? (
                    <div className="text-center py-8 space-y-3">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="font-semibold text-lg">Request Submitted!</p>
                        <p className="text-muted-foreground text-sm">Our team will contact you shortly.</p>
                        <button onClick={onClose} className="mt-4 bg-primary text-primary-foreground rounded-lg px-6 py-2 text-sm font-medium">Done</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Name *</label>
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                placeholder="Your name"
                                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Phone *</label>
                            <input
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                required
                                type="tel"
                                placeholder="10-digit mobile number"
                                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Email</label>
                            <input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                type="email"
                                placeholder="Optional"
                                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>
                        {leadType === "test_ride" && (
                            <div>
                                <label className="text-sm font-medium">Preferred Date</label>
                                <input
                                    value={preferredDate}
                                    onChange={e => setPreferredDate(e.target.value)}
                                    type="date"
                                    min={new Date().toISOString().split("T")[0]}
                                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                />
                            </div>
                        )}
                        {leadType === "best_price" || leadType === "exchange" ? (
                            <div>
                                <label className="text-sm font-medium">Your Offer Price (₹)</label>
                                <input
                                    value={offerPrice}
                                    onChange={e => setOfferPrice(e.target.value)}
                                    type="number"
                                    placeholder="Optional"
                                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                />
                            </div>
                        ) : null}
                        <div>
                            <label className="text-sm font-medium">Message</label>
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                rows={2}
                                placeholder="Any specific requirements?"
                                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>

                        {error && <p className="text-sm text-destructive">{error}</p>}

                        <button
                            type="submit"
                            disabled={submitting || !name || !phone}
                            className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-semibold disabled:opacity-50"
                        >
                            {submitting ? "Submitting..." : "Submit Request"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

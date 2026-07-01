"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import type { TwoWheelerLeadType } from "@/lib/types/two-wheeler"
import { X } from "lucide-react"
import { validateLeadForm, focusFirstInvalidField, type ValidationErrors } from "@/lib/validations/client"
import { normalizeLeadPhone } from "@/lib/validations/lead"

interface Props {
    dealerId:      string
    vehicleId?:    string
    vehicleName?:  string
    vehicleImage?: string
    usedVehicleId?: string
    leadType:      TwoWheelerLeadType
    title:         string
    initialMessage?: string
    isOpen:        boolean
    onClose:       () => void
}

export function LeadFormModal({
    dealerId, vehicleId, vehicleName, vehicleImage, usedVehicleId, leadType, title, initialMessage, isOpen, onClose
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
    const [fieldErrors,   setFieldErrors]    = useState<ValidationErrors>({})
    const [minDate,       setMinDate]        = useState("")

    const dialogRef         = useRef<HTMLDivElement>(null)
    const previouslyFocused = useRef<HTMLElement | null>(null)

    function clearFieldError(field: keyof ValidationErrors) {
        setFieldErrors(prev => {
            const next = { ...prev }
            delete next[field]
            return next
        })
    }

    useEffect(() => { setMinDate(new Date().toISOString().split("T")[0]) }, [])
    useEffect(() => {
        if (!isOpen) return
        setMessage(initialMessage ?? "")
        setError("")
        setFieldErrors({})
        setSubmitted(false)
    }, [initialMessage, isOpen])

    // Restore focus to the trigger and close on Escape; trap Tab within the dialog.
    useEffect(() => {
        if (!isOpen) return
        previouslyFocused.current = document.activeElement as HTMLElement | null
        const focusTimer = window.setTimeout(() => {
            const dialog = dialogRef.current
            if (!dialog) return
            const focusable = dialog.querySelector<HTMLElement>(
                'input, button, [href], select, textarea, [tabindex]:not([tabindex="-1"])'
            )
            focusable?.focus()
        }, 0)

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.stopPropagation()
                onClose()
                return
            }
            if (e.key !== "Tab") return
            const dialog = dialogRef.current
            if (!dialog) return
            const focusable = Array.from(
                dialog.querySelectorAll<HTMLElement>(
                    'input, button, [href], select, textarea, [tabindex]:not([tabindex="-1"])'
                )
            ).filter(el => !el.hasAttribute("disabled") && el.offsetParent !== null)
            if (focusable.length === 0) return
            const first = focusable[0]
            const last = focusable[focusable.length - 1]
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault()
                last.focus()
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault()
                first.focus()
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => {
            window.clearTimeout(focusTimer)
            document.removeEventListener("keydown", handleKeyDown)
            previouslyFocused.current?.focus?.()
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const normalizedPhone = normalizeLeadPhone(phone)
        const validationErrors = validateLeadForm({ name, phone: normalizedPhone, email })
        setFieldErrors(validationErrors)
        if (Object.keys(validationErrors).length > 0) {
            setError("")
            focusFirstInvalidField(validationErrors, dialogRef.current)
            return
        }
        setSubmitting(true)
        setError("")

        try {
            const res = await fetch("/api/two-wheelers/leads", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({
                    dealer_id:         dealerId,
                    vehicle_id:        vehicleId        ?? null,
                    vehicle_name:      vehicleName      ?? null,
                    used_vehicle_id:   usedVehicleId    ?? null,
                    lead_type:         leadType,
                    name,
                    phone:             normalizedPhone,
                    email:             email          || null,
                    preferred_date:    preferredDate  || null,
                    message:           message        || null,
                    offer_price_paise: offerPrice ? Math.round(Number(offerPrice) * 100) : null,
                }),
            })
            if (!res.ok) {
                const errBody = await res.json().catch(() => null)
                const errMsg = errBody?.error || (res.status === 429
                    ? 'Too many requests. Please wait a few minutes.'
                    : 'Something went wrong. Please call us directly.')
                setError(errMsg)
                return
            }
            setSubmitted(true)
        } catch {
            setError("Network error. Please check your connection.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={title} className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Image */}
                {vehicleImage && (
                    <div className="relative h-40 bg-gray-100 w-full">
                        <Image
                            src={vehicleImage}
                            alt={vehicleName || "Vehicle"}
                            fill
                            sizes="100%"
                            className="object-contain p-3"
                            unoptimized={vehicleImage.startsWith('http')}
                        />
                    </div>
                )}

                <div className="p-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">{title}</h2>
                        <button onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                    </div>

                {/* Content */}

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
                                onChange={e => {
                                    setName(e.target.value)
                                    if (fieldErrors.name) clearFieldError("name")
                                }}
                                data-field="name"
                                aria-required="true"
                                aria-invalid={Boolean(fieldErrors.name)}
                                placeholder="Your name"
                                className={`mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm ${fieldErrors.name ? "border-destructive" : "border-input"}`}
                            />
                            {fieldErrors.name && <p className="mt-1 text-xs text-destructive">{fieldErrors.name}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium">Phone *</label>
                            <input
                                value={phone}
                                onChange={e => {
                                    setPhone(e.target.value)
                                    if (fieldErrors.phone) clearFieldError("phone")
                                }}
                                data-field="phone"
                                aria-required="true"
                                aria-invalid={Boolean(fieldErrors.phone)}
                                type="tel"
                                placeholder="10-digit mobile number"
                                className={`mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm ${fieldErrors.phone ? "border-destructive" : "border-input"}`}
                            />
                            {fieldErrors.phone && <p className="mt-1 text-xs text-destructive">{fieldErrors.phone}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium">Email <span className="text-muted-foreground">(optional)</span></label>
                            <input
                                value={email}
                                onChange={e => {
                                    setEmail(e.target.value)
                                    if (fieldErrors.email) clearFieldError("email")
                                }}
                                data-field="email"
                                aria-invalid={Boolean(fieldErrors.email)}
                                type="email"
                                placeholder="you@example.com"
                                className={`mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm ${fieldErrors.email ? "border-destructive" : "border-input"}`}
                            />
                            {fieldErrors.email && <p className="mt-1 text-xs text-destructive">{fieldErrors.email}</p>}
                        </div>
                        {leadType === "test_ride" && (
                            <div>
                                <label className="text-sm font-medium">Preferred Date</label>
                                <input
                                    value={preferredDate}
                                    onChange={e => setPreferredDate(e.target.value)}
                                    type="date"
                                    min={minDate}
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
                            disabled={submitting}
                            className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-semibold disabled:opacity-50"
                        >
                            {submitting ? "Submitting..." : "Submit Request"}
                        </button>
                    </form>
                )}
                </div>
            </div>
        </div>
    )
}

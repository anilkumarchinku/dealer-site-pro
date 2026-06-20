"use client"

import { useEffect, useId, useRef, useState } from "react"
import { X } from "lucide-react"

interface Props {
    dealerId:             string
    vehicleId?:           string
    usedVehicleId?:       string
    vehicleName:          string
    bookingAmountPaise:   number   // default booking token amount
    isOpen:               boolean
    onClose:              () => void
}

type BookingOrderResponse = {
    error?: string
    mock?: boolean
    keyId: string
    amount: number
    currency: string
    orderId: string
}

type RazorpayPaymentResponse = {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
}

type RazorpayCheckoutOptions = {
    key: string
    amount: number
    currency: string
    order_id: string
    name: string
    description: string
    prefill: { name: string; contact: string; email: string }
    theme: { color: string }
    handler: (response: RazorpayPaymentResponse) => Promise<void>
    modal: { ondismiss: () => void }
}

type RazorpayConstructor = new (options: RazorpayCheckoutOptions) => { open: () => void }

export function BookingModal({
    dealerId, vehicleId, usedVehicleId, vehicleName, bookingAmountPaise, isOpen, onClose
}: Props) {
    const [name,      setName]      = useState("")
    const [phone,     setPhone]     = useState("")
    const [email,     setEmail]     = useState("")
    const [loading,   setLoading]   = useState(false)
    const [success,   setSuccess]   = useState(false)
    const [error,     setError]     = useState("")

    const fieldId   = useId()
    const nameId    = `${fieldId}-name`
    const phoneId   = `${fieldId}-phone`
    const emailId   = `${fieldId}-email`
    const titleId   = `${fieldId}-title`

    const dialogRef        = useRef<HTMLDivElement>(null)
    const previouslyFocused = useRef<HTMLElement | null>(null)

    // Restore focus to the trigger and close on Escape; trap Tab within the dialog.
    useEffect(() => {
        if (!isOpen) return
        previouslyFocused.current = document.activeElement as HTMLElement | null
        // Focus the first interactive element inside the dialog on open.
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

    async function handleBook() {
        if (!name || !phone) return
        setLoading(true)
        setError("")

        const idempotencyKey = `tw_${Date.now()}_${Math.random().toString(36).slice(2)}`

        try {
            // Create order
            const res = await fetch("/api/two-wheelers/booking/create-order", {
                method:  "POST",
                headers: {
                    "Content-Type":    "application/json",
                    "idempotency-key": idempotencyKey,
                },
                body: JSON.stringify({
                    dealer_id:            dealerId,
                    vehicle_id:           vehicleId        ?? null,
                    used_vehicle_id:      usedVehicleId    ?? null,
                    customer_name:        name,
                    phone,
                    email:                email            || null,
                    booking_amount_paise: bookingAmountPaise,
                }),
            })

            const orderData = await res.json() as BookingOrderResponse
            if (!res.ok) throw new Error(orderData.error ?? "Failed to create order")

            if (orderData.mock) {
                // Development mock — skip Razorpay
                setSuccess(true)
                return
            }

            // Load Razorpay checkout
            const rzpScript = document.createElement("script")
            rzpScript.src   = "https://checkout.razorpay.com/v1/checkout.js"
            rzpScript.async = true
            document.head.appendChild(rzpScript)

            rzpScript.onload = () => {
                const RazorpayClass = (window as Window & { Razorpay?: RazorpayConstructor }).Razorpay
                if (!RazorpayClass) {
                    setError("Payment checkout failed to load. Please try again.")
                    setLoading(false)
                    return
                }
                const rzp = new RazorpayClass({
                    key:         orderData.keyId,
                    amount:      orderData.amount,
                    currency:    orderData.currency,
                    order_id:    orderData.orderId,
                    name:        "Vehicle Booking",
                    description: vehicleName,
                    prefill:     { name, contact: phone, email },
                    theme:       { color: "#1d4ed8" },
                    handler: async (response: RazorpayPaymentResponse) => {
                        // Verify payment
                        const verifyRes = await fetch("/api/two-wheelers/booking/verify", {
                            method:  "POST",
                            headers: {
                                "Content-Type":    "application/json",
                                "idempotency-key": idempotencyKey,
                            },
                            body: JSON.stringify({
                                orderId:   response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                            }),
                        })
                        const verifyData = await verifyRes.json()
                        if (verifyData.success) setSuccess(true)
                        else setError("Payment verification failed. Please contact us.")
                    },
                    modal: { ondismiss: () => setLoading(false) },
                })
                rzp.open()
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Booking failed")
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5"
            >
                <div className="flex items-center justify-between">
                    <h2 id={titleId} className="font-semibold text-lg">Book Now</h2>
                    <button onClick={onClose} aria-label="Close"><X className="w-5 h-5 text-muted-foreground" /></button>
                </div>

                {success ? (
                    <div className="text-center py-8 space-y-3">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="font-semibold">Booking Confirmed!</p>
                        <p className="text-sm text-muted-foreground">Your booking for {vehicleName} is confirmed.</p>
                        <button onClick={onClose} className="bg-primary text-primary-foreground rounded-lg px-6 py-2 text-sm font-medium">Done</button>
                    </div>
                ) : (
                    <>
                        <div className="bg-muted/30 rounded-xl p-3 text-sm">
                            <p className="font-medium">{vehicleName}</p>
                            <p className="text-muted-foreground">
                                Booking amount: <strong className="text-foreground">₹{(bookingAmountPaise / 100).toLocaleString("en-IN")}</strong>
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label htmlFor={nameId} className="text-sm font-medium">Name *</label>
                                <input id={nameId} required aria-required="true" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Your name" />
                            </div>
                            <div>
                                <label htmlFor={phoneId} className="text-sm font-medium">Phone *</label>
                                <input id={phoneId} required aria-required="true" value={phone} onChange={e => setPhone(e.target.value)} type="tel" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Mobile number" />
                            </div>
                            <div>
                                <label htmlFor={emailId} className="text-sm font-medium">Email</label>
                                <input id={emailId} value={email} onChange={e => setEmail(e.target.value)} type="email" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Optional" />
                            </div>
                        </div>

                        {error && <p className="text-sm text-destructive">{error}</p>}

                        <button
                            onClick={handleBook}
                            disabled={loading || !name || !phone}
                            className="w-full bg-primary text-primary-foreground rounded-lg py-3 text-sm font-semibold disabled:opacity-50"
                        >
                            {loading ? "Processing..." : `Pay ₹${(bookingAmountPaise / 100).toLocaleString("en-IN")} to Book`}
                        </button>
                        <p className="text-xs text-muted-foreground text-center">Secured by Razorpay · Refundable if not purchased</p>
                    </>
                )}
            </div>
        </div>
    )
}

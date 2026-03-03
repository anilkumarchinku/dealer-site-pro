"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface Props {
    dealerId:             string
    vehicleId?:           string
    usedVehicleId?:       string
    vehicleName:          string
    bookingAmountPaise:   number
    isOpen:               boolean
    onClose:              () => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RazorpayConstructor = any

export function BookingModal({
    dealerId, vehicleId, usedVehicleId, vehicleName, bookingAmountPaise, isOpen, onClose
}: Props) {
    const [name,    setName]    = useState("")
    const [phone,   setPhone]   = useState("")
    const [email,   setEmail]   = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error,   setError]   = useState("")

    if (!isOpen) return null

    async function handleBook() {
        if (!name || !phone) return
        setLoading(true)
        setError("")

        const idempotencyKey = `3w_${Date.now()}_${Math.random().toString(36).slice(2)}`

        try {
            const res = await fetch("/api/three-wheelers/booking/create-order", {
                method:  "POST",
                headers: {
                    "Content-Type":    "application/json",
                    "idempotency-key": idempotencyKey,
                },
                body: JSON.stringify({
                    dealer_id:            dealerId,
                    vehicle_id:           vehicleId     ?? null,
                    used_vehicle_id:      usedVehicleId ?? null,
                    customer_name:        name,
                    phone,
                    email:                email || null,
                    booking_amount_paise: bookingAmountPaise,
                }),
            })

            const orderData = await res.json()
            if (!res.ok) throw new Error(orderData.error ?? "Failed to create order")

            if (orderData.mock) {
                setSuccess(true)
                return
            }

            const rzpScript = document.createElement("script")
            rzpScript.src   = "https://checkout.razorpay.com/v1/checkout.js"
            rzpScript.async = true
            document.head.appendChild(rzpScript)

            rzpScript.onload = () => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const RazorpayClass = (window as any).Razorpay as RazorpayConstructor
                const rzp = new RazorpayClass({
                    key:         orderData.keyId,
                    amount:      orderData.amount,
                    currency:    orderData.currency,
                    order_id:    orderData.orderId,
                    name:        "Vehicle Booking",
                    description: vehicleName,
                    prefill:     { name, contact: phone, email },
                    theme:       { color: "#16a34a" },
                    handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
                        const verifyRes = await fetch("/api/three-wheelers/booking/verify", {
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
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg">Book Now</h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
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
                                <label className="text-sm font-medium">Name *</label>
                                <input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Your name" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Phone *</label>
                                <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Mobile number" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Email</label>
                                <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Optional" />
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

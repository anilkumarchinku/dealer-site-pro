"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { VehicleDetailGallery } from "@/components/two-wheelers/VehicleDetailGallery"
import { EMICalculator } from "@/components/shared/EMICalculator"
import { LeadFormModal } from "@/components/two-wheelers/LeadFormModal"
import { BookingModal } from "@/components/two-wheelers/BookingModal"
import type { TwoWheelerVehicle, TwoWheelerLeadType } from "@/lib/types/two-wheeler"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

const BOOKING_AMOUNT = 50000 // ₹500 booking token

export default function VehicleDetailPage() {
    const params = useParams()
    const slug   = params.slug as string
    const id     = params.id   as string
    const prefix = useSitePrefix(slug)

    const [vehicle,  setVehicle]  = useState<TwoWheelerVehicle | null>(null)
    const [dealerId, setDealerId] = useState<string | null>(null)
    const [loading,  setLoading]  = useState(true)

    const [leadType,    setLeadType]    = useState<TwoWheelerLeadType>("test_ride")
    const [leadTitle,   setLeadTitle]   = useState("")
    const [leadOpen,    setLeadOpen]    = useState(false)
    const [bookingOpen, setBookingOpen] = useState(false)

    useEffect(() => {
        if (!slug || !id) return
        async function load() {
            const [{ data: dealer }, vehicleRes] = await Promise.all([
                supabase.from("dealers").select("id").eq("slug", slug).single(),
                fetch(`/api/two-wheelers/${id}`),
            ])
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (dealer) setDealerId((dealer as any).id)
            if (vehicleRes.ok) setVehicle(await vehicleRes.json())
            setLoading(false)
        }
        load()
    }, [slug, id])

    function openLead(type: TwoWheelerLeadType, title: string) {
        setLeadType(type)
        setLeadTitle(title)
        setLeadOpen(true)
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground animate-pulse">Loading...</div>
    if (!vehicle) return <div className="min-h-screen flex items-center justify-center">Vehicle not found</div>

    const price  = (vehicle.ex_showroom_price_paise / 100)
    const priceF = price.toLocaleString("en-IN")

    return (
        <div className="min-h-screen max-w-5xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href={`${prefix}/two-wheelers/${vehicle.type === 'electric' ? 'electric' : `${vehicle.type}s`}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="w-4 h-4" /> Back
                </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Gallery */}
                <div>
                    <VehicleDetailGallery images={vehicle.images} alt={`${vehicle.brand} ${vehicle.model}`} brand={vehicle.brand} model={vehicle.model} />
                </div>

                {/* Info */}
                <div className="space-y-5">
                    {/* Title & badges */}
                    <div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {vehicle.bs6_compliant && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">BS6</span>}
                            {vehicle.fame_subsidy_eligible && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded">FAME Eligible</span>}
                            <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded capitalize">{vehicle.stock_status.replace("_", " ")}</span>
                        </div>
                        <h1 className="text-3xl font-bold">{vehicle.brand} {vehicle.model}</h1>
                        {vehicle.variant && <p className="text-muted-foreground mt-0.5">{vehicle.variant}</p>}
                    </div>

                    {/* Price */}
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                        <p className="text-3xl font-bold text-primary">₹{priceF}</p>
                        <p className="text-xs text-muted-foreground">Ex-showroom</p>
                        {vehicle.on_road_price_paise && (
                            <p className="text-sm mt-1">On-road: <strong>₹{(vehicle.on_road_price_paise / 100).toLocaleString("en-IN")}</strong></p>
                        )}
                        {vehicle.emi_starting_paise && (
                            <p className="text-sm text-muted-foreground">EMI from ₹{(vehicle.emi_starting_paise / 100).toLocaleString("en-IN")}/mo</p>
                        )}
                    </div>

                    {/* Key specs */}
                    <div className="grid grid-cols-2 gap-3">
                        {vehicle.fuel_type === "petrol" && vehicle.mileage_kmpl && (
                            <div className="bg-muted/30 rounded-xl p-3 text-center">
                                <p className="text-lg font-bold">{vehicle.mileage_kmpl} kmpl</p>
                                <p className="text-xs text-muted-foreground">Mileage</p>
                            </div>
                        )}
                        {vehicle.fuel_type === "electric" && vehicle.range_km && (
                            <div className="bg-muted/30 rounded-xl p-3 text-center">
                                <p className="text-lg font-bold">{vehicle.range_km} km</p>
                                <p className="text-xs text-muted-foreground">Range</p>
                            </div>
                        )}
                        {vehicle.engine_cc && (
                            <div className="bg-muted/30 rounded-xl p-3 text-center">
                                <p className="text-lg font-bold">{vehicle.engine_cc}cc</p>
                                <p className="text-xs text-muted-foreground">Engine</p>
                            </div>
                        )}
                        {vehicle.top_speed_kmph && (
                            <div className="bg-muted/30 rounded-xl p-3 text-center">
                                <p className="text-lg font-bold">{vehicle.top_speed_kmph} kmph</p>
                                <p className="text-xs text-muted-foreground">Top Speed</p>
                            </div>
                        )}
                        {vehicle.battery_kwh && (
                            <div className="bg-muted/30 rounded-xl p-3 text-center">
                                <p className="text-lg font-bold">{vehicle.battery_kwh} kWh</p>
                                <p className="text-xs text-muted-foreground">Battery</p>
                            </div>
                        )}
                    </div>

                    {/* Dimensions */}
                    {(vehicle.wheelbase_mm || vehicle.length_mm || vehicle.width_mm || vehicle.height_mm) && (
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Dimensions</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {vehicle.length_mm && <div className="bg-muted/30 rounded-xl p-3 text-center"><p className="text-base font-bold">{vehicle.length_mm} mm</p><p className="text-xs text-muted-foreground">Length</p></div>}
                                {vehicle.width_mm && <div className="bg-muted/30 rounded-xl p-3 text-center"><p className="text-base font-bold">{vehicle.width_mm} mm</p><p className="text-xs text-muted-foreground">Width</p></div>}
                                {vehicle.height_mm && <div className="bg-muted/30 rounded-xl p-3 text-center"><p className="text-base font-bold">{vehicle.height_mm} mm</p><p className="text-xs text-muted-foreground">Height</p></div>}
                                {vehicle.wheelbase_mm && <div className="bg-muted/30 rounded-xl p-3 text-center"><p className="text-base font-bold">{vehicle.wheelbase_mm} mm</p><p className="text-xs text-muted-foreground">Wheelbase</p></div>}
                            </div>
                        </div>
                    )}

                    {/* CTAs */}
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => openLead("test_ride", "Book Test Ride")} className="bg-primary text-primary-foreground rounded-xl py-3 font-semibold hover:opacity-90">Book Test Ride</button>
                        <button onClick={() => openLead("best_price", "Get Best Price")} className="border border-border rounded-xl py-3 font-semibold hover:bg-muted/50">Get Best Price</button>
                        <button onClick={() => openLead("finance", "Apply for Finance")} className="border border-border rounded-xl py-3 font-semibold hover:bg-muted/50">Finance Options</button>
                        {vehicle.stock_status === "booking_open" && (
                            <button onClick={() => setBookingOpen(true)} className="bg-green-600 text-white rounded-xl py-3 font-semibold hover:opacity-90">Book Now ₹500</button>
                        )}
                    </div>
                </div>
            </div>

            {/* Features */}
            {vehicle.features.length > 0 && (
                <section className="mt-10">
                    <h2 className="text-xl font-bold mb-4">Key Features</h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {vehicle.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                {f}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Description */}
            {vehicle.description && (
                <section className="mt-8">
                    <h2 className="text-xl font-bold mb-3">About this model</h2>
                    <p className="text-muted-foreground leading-relaxed">{vehicle.description}</p>
                </section>
            )}

            {/* EMI Calculator */}
            <section className="mt-10">
                <h2 className="text-xl font-bold mb-4">Calculate EMI</h2>
                <div className="max-w-lg">
                    <EMICalculator defaultPrice={price} />
                </div>
            </section>

            {/* Modals */}
            {dealerId && (
                <>
                    <LeadFormModal
                        dealerId={dealerId}
                        vehicleId={vehicle.id}
                        leadType={leadType}
                        title={leadTitle}
                        isOpen={leadOpen}
                        onClose={() => setLeadOpen(false)}
                    />
                    <BookingModal
                        dealerId={dealerId}
                        vehicleId={vehicle.id}
                        vehicleName={`${vehicle.brand} ${vehicle.model}`}
                        bookingAmountPaise={BOOKING_AMOUNT}
                        isOpen={bookingOpen}
                        onClose={() => setBookingOpen(false)}
                    />
                </>
            )}
        </div>
    )
}

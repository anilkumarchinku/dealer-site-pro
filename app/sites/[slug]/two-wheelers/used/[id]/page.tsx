"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { VehicleDetailGallery } from "@/components/two-wheelers/VehicleDetailGallery"
import { ConditionBadge } from "@/components/two-wheelers/ConditionBadge"
import { LeadFormModal } from "@/components/two-wheelers/LeadFormModal"
import type { TwoWheelerUsedVehicle } from "@/lib/types/two-wheeler"
import { ChevronLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function UsedVehicleDetailPage() {
    const params = useParams()
    const slug   = params.slug as string
    const id     = params.id   as string

    const [vehicle,  setVehicle]  = useState<TwoWheelerUsedVehicle | null>(null)
    const [dealerId, setDealerId] = useState<string | null>(null)
    const [phone,    setPhone]    = useState<string>("")
    const [loading,  setLoading]  = useState(true)
    const [leadOpen, setLeadOpen] = useState(false)

    useEffect(() => {
        if (!slug || !id) return
        async function load() {
            const [{ data: dealer }, vehicleRes] = await Promise.all([
                supabase.from("dealers").select("id, phone").eq("slug", slug).single(),
                fetch(`/api/two-wheelers/used/${id}`),
            ])
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (dealer) { setDealerId((dealer as any).id); setPhone((dealer as any).phone ?? "") }
            if (vehicleRes.ok) setVehicle(await vehicleRes.json())
            setLoading(false)
        }
        load()
    }, [slug, id])

    if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground animate-pulse">Loading...</div>
    if (!vehicle) return <div className="min-h-screen flex items-center justify-center">Vehicle not found</div>

    const priceF = (vehicle.price_paise / 100).toLocaleString("en-IN")

    const rcLabel: Record<string, { label: string; color: string }> = {
        clear:          { label: "Clear RC",          color: "text-green-600"  },
        hypothecation:  { label: "Under Hypothecation", color: "text-yellow-600" },
        pending:        { label: "RC Pending",         color: "text-red-600"   },
    }
    const rc = vehicle.rc_status ? rcLabel[vehicle.rc_status] : null

    return (
        <div className="min-h-screen max-w-5xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href={`/sites/${slug}/two-wheelers/used`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="w-4 h-4" /> Back to Used Vehicles
                </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Gallery */}
                <div>
                    <VehicleDetailGallery images={vehicle.images} alt={`${vehicle.brand} ${vehicle.model}`} />
                </div>

                {/* Info panel */}
                <div className="space-y-5">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                        {vehicle.condition_grade && <ConditionBadge grade={vehicle.condition_grade} />}
                        {vehicle.certified_pre_owned && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-semibold bg-blue-100 text-blue-700 border-blue-300">
                                <CheckCircle className="w-3 h-3" /> Certified Pre-Owned
                            </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full border text-xs font-semibold bg-muted text-muted-foreground capitalize">
                            {vehicle.status}
                        </span>
                    </div>

                    {/* Title */}
                    <div>
                        <h1 className="text-3xl font-bold">{vehicle.brand} {vehicle.model}</h1>
                        {vehicle.variant && <p className="text-muted-foreground mt-0.5">{vehicle.variant}</p>}
                        <p className="text-sm text-muted-foreground mt-1">{vehicle.year} · {vehicle.fuel_type}</p>
                    </div>

                    {/* Price */}
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                        <p className="text-3xl font-bold text-primary">₹{priceF}</p>
                        {vehicle.negotiable && (
                            <p className="text-xs text-green-600 font-medium mt-1">Price is negotiable</p>
                        )}
                    </div>

                    {/* Key stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/30 rounded-xl p-3 text-center">
                            <p className="text-lg font-bold">{vehicle.km_driven.toLocaleString("en-IN")} km</p>
                            <p className="text-xs text-muted-foreground">Odometer</p>
                        </div>
                        <div className="bg-muted/30 rounded-xl p-3 text-center">
                            <p className="text-lg font-bold">{vehicle.no_of_owners}</p>
                            <p className="text-xs text-muted-foreground">{vehicle.no_of_owners === 1 ? "Owner" : "Owners"}</p>
                        </div>
                        <div className="bg-muted/30 rounded-xl p-3 text-center">
                            <p className="text-lg font-bold capitalize">{vehicle.fuel_type}</p>
                            <p className="text-xs text-muted-foreground">Fuel Type</p>
                        </div>
                        <div className="bg-muted/30 rounded-xl p-3 text-center">
                            <p className="text-lg font-bold capitalize">{vehicle.type}</p>
                            <p className="text-xs text-muted-foreground">Category</p>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setLeadOpen(true)}
                            className="bg-primary text-primary-foreground rounded-xl py-3 font-semibold hover:opacity-90 col-span-2"
                        >
                            Make an Offer
                        </button>
                        {phone && (
                            <a
                                href={`tel:${phone}`}
                                className="border border-border rounded-xl py-3 font-semibold hover:bg-muted/50 text-center text-sm"
                            >
                                📞 Call Dealer
                            </a>
                        )}
                        {phone && (
                            <a
                                href={`https://wa.me/91${phone.replace(/\D/g, "").slice(-10)}?text=Hi%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(vehicle.brand + " " + vehicle.model)}%20listed%20on%20your%20website.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-500 text-white rounded-xl py-3 font-semibold hover:opacity-90 text-center text-sm"
                            >
                                WhatsApp
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Details section */}
            <div className="mt-10 grid md:grid-cols-2 gap-8">
                {/* Vehicle details */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Vehicle Details</h2>
                    <div className="bg-card border border-border rounded-xl divide-y divide-border">
                        {[
                            { label: "Brand",    value: vehicle.brand                                    },
                            { label: "Model",    value: vehicle.model                                    },
                            { label: "Year",     value: String(vehicle.year)                             },
                            { label: "Fuel",     value: vehicle.fuel_type                                },
                            { label: "Odometer", value: `${vehicle.km_driven.toLocaleString("en-IN")} km` },
                            { label: "Owners",   value: String(vehicle.no_of_owners)                    },
                        ].map(row => (
                            <div key={row.label} className="flex justify-between items-center px-4 py-3 text-sm">
                                <span className="text-muted-foreground">{row.label}</span>
                                <span className="font-medium capitalize">{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ownership & Legal */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Ownership & Legal</h2>
                    <div className="bg-card border border-border rounded-xl divide-y divide-border">
                        {rc && (
                            <div className="flex justify-between items-center px-4 py-3 text-sm">
                                <span className="text-muted-foreground">RC Status</span>
                                <span className={`font-medium ${rc.color}`}>{rc.label}</span>
                            </div>
                        )}
                        {vehicle.insurance_valid_until && (
                            <div className="flex justify-between items-center px-4 py-3 text-sm">
                                <span className="text-muted-foreground">Insurance Valid</span>
                                <span className="font-medium">{new Date(vehicle.insurance_valid_until).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center px-4 py-3 text-sm">
                            <span className="text-muted-foreground">Certified Pre-Owned</span>
                            <span className={`font-medium ${vehicle.certified_pre_owned ? "text-green-600" : "text-muted-foreground"}`}>
                                {vehicle.certified_pre_owned ? "Yes" : "No"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3 text-sm">
                            <span className="text-muted-foreground">Price Negotiable</span>
                            <span className="font-medium">{vehicle.negotiable ? "Yes" : "No"}</span>
                        </div>
                    </div>

                    {/* Inspection report */}
                    {vehicle.inspection_report_url && (
                        <a
                            href={vehicle.inspection_report_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                            <CheckCircle className="w-4 h-4" /> View Inspection Report
                        </a>
                    )}
                </div>
            </div>

            {/* Description */}
            {vehicle.description && (
                <section className="mt-8">
                    <h2 className="text-xl font-bold mb-3">About this vehicle</h2>
                    <p className="text-muted-foreground leading-relaxed">{vehicle.description}</p>
                </section>
            )}

            {/* Buyer tips */}
            <section className="mt-10 bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h2 className="text-base font-bold text-blue-800 mb-3">Buyer Tips</h2>
                <ul className="space-y-2">
                    {[
                        "Always check RC ownership transfer before purchasing",
                        "Verify insurance validity and transfer it within 14 days",
                        "Inspect the vehicle in daylight and take a test ride",
                        "Check for hypothecation clearance before payment",
                    ].map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-blue-700">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            {tip}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Lead modal */}
            {dealerId && (
                <LeadFormModal
                    dealerId={dealerId}
                    usedVehicleId={vehicle.id}
                    leadType="best_price"
                    title="Make an Offer"
                    isOpen={leadOpen}
                    onClose={() => setLeadOpen(false)}
                />
            )}
        </div>
    )
}

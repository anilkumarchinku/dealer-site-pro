"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { VehicleDetailGallery } from "@/components/two-wheelers/VehicleDetailGallery"
import { EMICalculator } from "@/components/shared/EMICalculator"
import { LeadFormModal } from "@/components/two-wheelers/LeadFormModal"
import { BookingModal } from "@/components/two-wheelers/BookingModal"
import { CityOnRoadPrice } from "@/components/two-wheelers/CityOnRoadPrice"
import { FullSpecsSection } from "@/components/two-wheelers/FullSpecsSection"
import { SimilarVehicles } from "@/components/two-wheelers/SimilarVehicles"
import { generateTemplateConfig } from "@/lib/templates"
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

    const [vehicle,    setVehicle]    = useState<TwoWheelerVehicle | null>(null)
    const [dealerId,   setDealerId]   = useState<string | null>(null)
    const [dealerInfo, setDealerInfo] = useState<{
        logoUrl: string | null
        dealerName: string
        styleTemplate: string
    } | null>(null)
    const [loading,  setLoading]  = useState(true)

    const [leadType,    setLeadType]    = useState<TwoWheelerLeadType>("test_ride")
    const [leadTitle,   setLeadTitle]   = useState("")
    const [leadOpen,    setLeadOpen]    = useState(false)
    const [bookingOpen, setBookingOpen] = useState(false)
    const [selectedColor, setSelectedColor] = useState("")

    useEffect(() => {
        if (!slug || !id) return
        async function load() {
            const [{ data: dealer }, vehicleRes] = await Promise.all([
                supabase
                    .from("dealers")
                    .select("id, logo_url, dealership_name, style_template")
                    .eq("slug", slug)
                    .single(),
                fetch(`/api/two-wheelers/${encodeURIComponent(id)}?slug=${encodeURIComponent(slug)}`),
            ])
            if (dealer) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const d = dealer as any
                setDealerId(d.id)
                setDealerInfo({
                    logoUrl:       d.logo_url       ?? null,
                    dealerName:    d.dealership_name ?? '',
                    styleTemplate: d.style_template  ?? 'modern',
                })
            }
            if (vehicleRes.ok) setVehicle(await vehicleRes.json())
            setLoading(false)
        }
        load()
    }, [slug, id])

    useEffect(() => {
        if (!vehicle) return
        setSelectedColor(vehicle.colors[0]?.name ?? "")
    }, [vehicle])

    // Brand color derived from vehicle brand + dealer template
    const brandColor = useMemo(() => {
        if (!vehicle || !dealerInfo) return "#2563eb"
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return generateTemplateConfig(vehicle.brand, dealerInfo.styleTemplate as any).brandColors.primary
        } catch {
            return "#2563eb"
        }
    }, [vehicle, dealerInfo])

    // Logo: dealer-uploaded logo first, then brand logo as fallback
    const logoSrc = useMemo(() => {
        if (dealerInfo?.logoUrl) return dealerInfo.logoUrl
        if (vehicle?.brand) return `/assets/logos/2w/${vehicle.brand.toLowerCase().replace(/\s+/g, '-')}.svg`
        return null
    }, [dealerInfo, vehicle])

    function openLead(type: TwoWheelerLeadType, title: string) {
        setLeadType(type)
        setLeadTitle(title)
        setLeadOpen(true)
    }

    // Compute these only when vehicle is loaded
    const price  = vehicle ? vehicle.ex_showroom_price_paise / 100 : 0
    const priceF = price.toLocaleString("en-IN")
    const selectedColorImage = vehicle?.colors.find(c => c.name === selectedColor)?.image ?? null
    const galleryImages = useMemo(
        () => Array.from(new Set([
            selectedColorImage ?? '',
            ...(vehicle?.images ?? []),
        ].filter(Boolean))),
        [selectedColorImage, vehicle?.images]
    )

    return (
        <div className="min-h-screen bg-white">
            {/* Branded header */}
            <header
                className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b"
                style={{ borderBottomColor: `${brandColor}25` }}
            >
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
                    {/* Back link — LEFT */}
                    <Link
                        href={prefix || "/"}
                        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 shrink-0 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </Link>

                    {/* Logo + dealer name — RIGHT → navigates home */}
                    <Link
                        href={prefix || "/"}
                        className="flex items-center gap-2.5 hover:opacity-80 transition-opacity min-w-0"
                    >
                        <span className="font-semibold text-gray-900 text-sm truncate max-w-[160px] sm:max-w-xs">
                            {dealerInfo?.dealerName ?? ''}
                        </span>
                        {logoSrc && (
                            <div className="relative w-8 h-8 shrink-0">
                                <Image
                                    src={logoSrc}
                                    alt={dealerInfo?.dealerName || vehicle?.brand || ''}
                                    fill
                                    className="object-contain"
                                    sizes="32px"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                />
                            </div>
                        )}
                    </Link>
                </div>
            </header>

            {/* Page content */}
            {loading ? (
                <div className="flex items-center justify-center py-24 text-muted-foreground animate-pulse">
                    Loading…
                </div>
            ) : !vehicle ? (
                <div className="flex items-center justify-center py-24 text-gray-500">
                    Vehicle not found
                </div>
            ) : (
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Gallery */}
                        <div>
                            <VehicleDetailGallery
                                images={galleryImages}
                                alt={`${vehicle.brand} ${vehicle.model}`}
                                brand={vehicle.brand}
                                model={vehicle.model}
                            />
                        </div>

                        {/* Info */}
                        <div className="space-y-5">
                            {/* Title & badges */}
                            <div>
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {vehicle.bs6_compliant && (
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">BS6</span>
                                    )}
                                    {vehicle.fame_subsidy_eligible && (
                                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded">FAME Eligible</span>
                                    )}
                                    <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded capitalize">
                                        {vehicle.stock_status.replace("_", " ")}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold">{vehicle.brand} {vehicle.model}</h1>
                                {vehicle.variant && <p className="text-muted-foreground mt-0.5">{vehicle.variant}</p>}
                            </div>

                            {/* Price box */}
                            <div
                                className="rounded-xl p-4 border"
                                style={{ backgroundColor: `${brandColor}0d`, borderColor: `${brandColor}33` }}
                            >
                                <p className="text-3xl font-bold" style={{ color: brandColor }}>₹{priceF}</p>
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
                                        {vehicle.length_mm    && <div className="bg-muted/30 rounded-xl p-3 text-center"><p className="text-base font-bold">{vehicle.length_mm} mm</p><p className="text-xs text-muted-foreground">Length</p></div>}
                                        {vehicle.width_mm     && <div className="bg-muted/30 rounded-xl p-3 text-center"><p className="text-base font-bold">{vehicle.width_mm} mm</p><p className="text-xs text-muted-foreground">Width</p></div>}
                                        {vehicle.height_mm    && <div className="bg-muted/30 rounded-xl p-3 text-center"><p className="text-base font-bold">{vehicle.height_mm} mm</p><p className="text-xs text-muted-foreground">Height</p></div>}
                                        {vehicle.wheelbase_mm && <div className="bg-muted/30 rounded-xl p-3 text-center"><p className="text-base font-bold">{vehicle.wheelbase_mm} mm</p><p className="text-xs text-muted-foreground">Wheelbase</p></div>}
                                    </div>
                                </div>
                            )}

                            {/* CTAs */}
                            <div className="flex flex-col gap-3">
                                {/* Primary — Enquire Now (full width) */}
                                <button
                                    onClick={() => openLead("callback", "Enquire Now")}
                                    className="w-full rounded-xl py-3.5 font-bold text-white text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    style={{ backgroundColor: brandColor }}
                                >
                                    Enquire Now
                                </button>

                                {/* Secondary CTAs */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => openLead("test_ride", "Book Test Ride")}
                                        className="border rounded-xl py-3 font-semibold hover:bg-muted/50 transition-colors"
                                        style={{ borderColor: brandColor, color: brandColor }}
                                    >
                                        Book Test Ride
                                    </button>
                                    <button
                                        onClick={() => openLead("best_price", "Get Best Price")}
                                        className="border rounded-xl py-3 font-semibold hover:bg-muted/50 transition-colors"
                                        style={{ borderColor: brandColor, color: brandColor }}
                                    >
                                        Get Best Price
                                    </button>
                                    <button
                                        onClick={() => openLead("finance", "Apply for Finance")}
                                        className="border border-border rounded-xl py-3 font-semibold hover:bg-muted/50 transition-colors"
                                    >
                                        Finance Options
                                    </button>
                                    {vehicle.stock_status === "booking_open" && (
                                        <button
                                            onClick={() => setBookingOpen(true)}
                                            className="bg-green-600 text-white rounded-xl py-3 font-semibold hover:opacity-90 transition-opacity"
                                        >
                                            Book Now ₹500
                                        </button>
                                    )}
                                </div>
                            </div>

                            {vehicle.brochure_url && (
                                <a
                                    href={vehicle.brochure_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 border border-border rounded-xl py-3 text-sm font-semibold hover:bg-muted/50 transition-colors w-full"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download Brochure
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Features */}
                    {vehicle.features.length > 0 && (
                        <section className="mt-10">
                            <h2 className="text-xl font-bold mb-4">Key Features</h2>
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {vehicle.features.map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: brandColor }} />
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

                    {/* Colors */}
                    {vehicle.colors.length > 0 && (
                        <section className="mt-8">
                            <h2 className="text-xl font-bold mb-3">Available Colors</h2>
                            <div className="flex flex-wrap gap-3">
                                {vehicle.colors.map(color => (
                                    <button
                                        key={color.name}
                                        type="button"
                                        onClick={() => setSelectedColor(color.name)}
                                        className="flex items-center gap-2 rounded-xl border-2 px-3 py-2 transition-all"
                                        style={
                                            selectedColor === color.name
                                                ? { borderColor: brandColor, backgroundColor: `${brandColor}0d` }
                                                : { borderColor: '#e5e7eb', backgroundColor: 'white' }
                                        }
                                    >
                                        <span className="h-5 w-5 rounded-full border border-gray-200" style={{ backgroundColor: color.hex }} />
                                        <span className="text-sm font-medium">{color.name}</span>
                                    </button>
                                ))}
                            </div>
                            {selectedColor && (
                                <p className="mt-3 text-sm text-muted-foreground">
                                    Selected: <span className="font-medium text-foreground">{selectedColor}</span>
                                </p>
                            )}
                        </section>
                    )}

                    {/* EMI Calculator */}
                    <section className="mt-10">
                        <h2 className="text-xl font-bold mb-4">Calculate EMI</h2>
                        <div className="max-w-lg">
                            <EMICalculator defaultPrice={price} />
                        </div>
                    </section>

                    {/* On-Road Price */}
                    <div className="mt-10 max-w-lg">
                        <CityOnRoadPrice
                            exShowroomPaise={vehicle.ex_showroom_price_paise}
                            engineCc={vehicle.engine_cc}
                            fuelType={vehicle.fuel_type}
                        />
                    </div>

                    {/* Full Specifications */}
                    <FullSpecsSection vehicle={vehicle} />

                    {/* Similar Vehicles */}
                    {dealerId && (
                        <SimilarVehicles
                            currentId={vehicle.id}
                            dealerId={dealerId}
                            vehicleType={vehicle.type}
                            slug={slug}
                        />
                    )}

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
            )}
        </div>
    )
}

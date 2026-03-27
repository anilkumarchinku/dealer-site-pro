"use client"

import { useState } from "react"
import Link from "next/link"
import { Fuel, Zap, Users, Package, Send, ChevronRight, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ThreeWheelerVehicle } from "@/lib/types/three-wheeler"
import { getScrapedImageUrls, brandNameToId } from "@/lib/utils/brand-model-images"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"
import { QuickViewModal } from "./QuickViewModal"

interface Props {
    vehicle:    ThreeWheelerVehicle
    slug:       string
    brandColor?: string
    onLead?:    (vehicleId: string) => void
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-100">
            <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 bg-white shadow-sm border border-gray-100">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] text-gray-500 leading-none">{label}</p>
                <p className="text-xs font-semibold text-gray-900 leading-tight truncate">{value}</p>
            </div>
        </div>
    )
}

export function VehicleCard({ vehicle, slug, brandColor = "#1f2937", onLead }: Props) {
    const prefix = useSitePrefix(slug)
    const price  = (vehicle.ex_showroom_price_paise / 100).toLocaleString("en-IN")

    const [jpgUrl, pngUrl] = getScrapedImageUrls("3w", brandNameToId(vehicle.brand, "3w"), vehicle.model)
    const primarySrc = vehicle.images[0] || jpgUrl
    const [imgSrc, setImgSrc] = useState(primarySrc)
    const [imgFailed, setFailed] = useState(false)
    const [quickView, setQuickView] = useState(false)

    function handleImgError() {
        if (imgSrc === jpgUrl) { setImgSrc(pngUrl); return }
        setFailed(true)
    }

    // Spec values
    const fuelLabel = vehicle.fuel_type === "electric" ? "Electric"
        : vehicle.fuel_type === "cng" ? "CNG"
        : vehicle.fuel_type === "diesel" ? "Diesel"
        : vehicle.fuel_type.charAt(0).toUpperCase() + vehicle.fuel_type.slice(1)

    const perfValue = vehicle.fuel_type === "electric" && vehicle.range_km
        ? `${vehicle.range_km} km`
        : vehicle.fuel_type === "cng" && vehicle.cng_mileage_km_per_kg
        ? `${vehicle.cng_mileage_km_per_kg} km/kg`
        : "—"

    const capacityValue = vehicle.passenger_capacity
        ? `${vehicle.passenger_capacity} seats`
        : vehicle.payload_kg
        ? `${vehicle.payload_kg} kg`
        : "—"

    const typeLabel = vehicle.type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())

    return (
        <div className="group relative flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer h-full">

            {/* Image */}
            <div className="relative h-44 bg-gray-50 overflow-hidden">
                {!imgFailed ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={imgSrc}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={handleImgError}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">🛺</div>
                )}

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                    {vehicle.bs6_compliant && (
                        <span className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">BS6</span>
                    )}
                    {vehicle.fame_subsidy_eligible && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">FAME</span>
                    )}
                    {vehicle.fuel_type === "electric" && (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5" /> EV
                        </span>
                    )}
                </div>

                {/* Stock status */}
                {vehicle.stock_status !== "available" && (
                    <div className={`absolute bottom-0 left-0 right-0 text-center text-xs font-medium py-1 ${
                        vehicle.stock_status === "booking_open" ? "bg-blue-600 text-white" : "bg-gray-800 text-white"
                    }`}>
                        {vehicle.stock_status === "booking_open" ? "Booking Open" : "Out of Stock"}
                    </div>
                )}

                {/* Hover overlay with Quick View */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                        onClick={(e) => { e.stopPropagation(); setQuickView(true) }}
                        className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800 flex items-center gap-1 shadow-lg hover:bg-white transition-colors translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                        <Eye className="w-3.5 h-3.5" /> Quick View
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-3 pt-2.5">

                {/* Brand + model */}
                <div className="mb-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: brandColor }}>
                        {vehicle.brand}
                    </p>
                    <h3 className="text-base font-bold leading-tight line-clamp-1 text-gray-900">
                        {vehicle.model}
                    </h3>
                    {vehicle.variant && (
                        <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{vehicle.variant}</p>
                    )}
                </div>

                {/* Price */}
                <div className="mb-2">
                    <p className="text-lg font-bold text-gray-900">₹{price}</p>
                    <p className="text-[10px] text-gray-500">Ex-showroom</p>
                </div>

                <div className="border-t border-gray-100 mb-2" />

                {/* Specs 2×2 grid */}
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                    <SpecItem icon={<Fuel className="w-3.5 h-3.5 text-emerald-600" />} label="Fuel" value={fuelLabel} />
                    <SpecItem icon={<Zap className="w-3.5 h-3.5 text-blue-600" />} label={vehicle.fuel_type === "electric" ? "Range" : "Efficiency"} value={perfValue} />
                    <SpecItem icon={<Users className="w-3.5 h-3.5 text-amber-600" />} label="Capacity" value={capacityValue} />
                    <SpecItem icon={<ChevronRight className="w-3.5 h-3.5 text-purple-600" />} label="Type" value={typeLabel} />
                </div>

                {/* Color swatches */}
                {vehicle.colors.length > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                        {vehicle.colors.slice(0, 5).map((c, i) => (
                            <div
                                key={i}
                                className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                            />
                        ))}
                        {vehicle.colors.length > 5 && (
                            <span className="text-[10px] text-gray-400 ml-0.5">+{vehicle.colors.length - 5}</span>
                        )}
                    </div>
                )}

                {/* CTA buttons */}
                <div className="flex gap-2 mt-auto">
                    <Button
                        size="sm"
                        className="flex-1 text-white"
                        style={{ backgroundColor: brandColor }}
                        onClick={() => onLead?.(vehicle.id)}
                    >
                        <Send className="w-3.5 h-3.5 mr-1.5" />
                        Get Price
                    </Button>
                    <Link
                        href={`${prefix}/three-wheelers/${vehicle.id}`}
                        className="flex-1"
                        onClick={e => e.stopPropagation()}
                    >
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-white"
                            style={{ borderColor: brandColor, color: brandColor }}
                        >
                            Details
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Bottom accent line on hover */}
            <div
                className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
                style={{ backgroundColor: brandColor }}
            />

            {/* Quick View Modal */}
            <QuickViewModal
                vehicle={vehicle}
                open={quickView}
                onClose={() => setQuickView(false)}
                brandColor={brandColor}
                onLead={onLead}
            />
        </div>
    )
}

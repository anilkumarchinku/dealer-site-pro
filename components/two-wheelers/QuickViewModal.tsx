"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Fuel, Zap, Gauge, Palette, Settings, Shield, Info, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TwoWheelerVehicle } from "@/lib/types/two-wheeler"
import { getScrapedImageUrls, brandNameToId } from "@/lib/utils/brand-model-images"

interface Props {
    vehicle: TwoWheelerVehicle
    open: boolean
    onClose: () => void
    brandColor?: string
    onLead?: (vehicleId: string) => void
}

type Tab = "overview" | "specs" | "colors" | "features"

export function QuickViewModal({ vehicle, open, onClose, brandColor = "#1f2937", onLead }: Props) {
    const [tab, setTab] = useState<Tab>("overview")

    if (!open) return null

    const [jpgUrl] = getScrapedImageUrls("2w", brandNameToId(vehicle.brand), vehicle.model)
    const imgSrc = vehicle.images[0] || jpgUrl

    const priceRaw = vehicle.ex_showroom_price_paise
    const price = priceRaw > 0 ? `₹${(priceRaw / 100).toLocaleString("en-IN")}` : "Price on request"
    const onRoad = vehicle.on_road_price_paise && vehicle.on_road_price_paise > 0
        ? `₹${(vehicle.on_road_price_paise / 100).toLocaleString("en-IN")}`
        : null
    const emi = vehicle.emi_starting_paise && vehicle.emi_starting_paise > 0
        ? `₹${(vehicle.emi_starting_paise / 100).toLocaleString("en-IN")}/mo`
        : null

    const isEV = vehicle.fuel_type === "electric"
    const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
        { key: "overview", label: "Overview", icon: <Info className="w-3.5 h-3.5" /> },
        { key: "specs",    label: "Specs",    icon: <Settings className="w-3.5 h-3.5" /> },
        { key: "colors",   label: `Colors${vehicle.colors.length ? ` (${vehicle.colors.length})` : ""}`, icon: <Palette className="w-3.5 h-3.5" /> },
        { key: "features", label: "Features", icon: <Shield className="w-3.5 h-3.5" /> },
    ]

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header with image */}
                <div className="relative h-52 bg-gray-50 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imgSrc}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-contain bg-white p-4"
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-1">
                        {vehicle.fuel_type === "electric" && (
                            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <Zap className="w-2.5 h-2.5" /> EV
                            </span>
                        )}
                        {vehicle.bs6_compliant && (
                            <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">BS6</span>
                        )}
                    </div>
                </div>

                {/* Title + Price */}
                <div className="px-4 pt-3 pb-2 border-b border-gray-100 shrink-0">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: brandColor }}>
                                {vehicle.brand}
                            </p>
                            <h3 className="text-lg font-bold text-gray-900">{vehicle.model}</h3>
                            {vehicle.variant && <p className="text-xs text-gray-500">{vehicle.variant}</p>}
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">{price}</p>
                            {onRoad && <p className="text-[10px] text-gray-500">On-road: {onRoad}</p>}
                            {emi && <p className="text-[10px] text-emerald-600 font-medium">EMI from {emi}</p>}
                        </div>
                    </div>
                </div>

                {/* Tab bar */}
                <div className="flex border-b border-gray-200 px-2 shrink-0">
                    {tabs.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`flex items-center gap-1 px-3 py-2.5 text-xs font-medium transition-colors border-b-2 ${
                                tab === t.key
                                    ? "border-current text-gray-900"
                                    : "border-transparent text-gray-400 hover:text-gray-600"
                            }`}
                            style={tab === t.key ? { color: brandColor, borderColor: brandColor } : undefined}
                        >
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {tab === "overview" && (
                        <div className="space-y-4">
                            {vehicle.description && (
                                <p className="text-sm text-gray-600 leading-relaxed">{vehicle.description}</p>
                            )}

                            {/* Key specs grid */}
                            <div className="grid grid-cols-2 gap-2">
                                {vehicle.engine_cc && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-[10px] text-gray-500">Engine</p>
                                        <p className="text-sm font-semibold">{vehicle.engine_cc} cc</p>
                                    </div>
                                )}
                                {vehicle.max_power && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-[10px] text-gray-500">Power</p>
                                        <p className="text-sm font-semibold">{vehicle.max_power}</p>
                                    </div>
                                )}
                                {vehicle.torque && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-[10px] text-gray-500">Torque</p>
                                        <p className="text-sm font-semibold">{vehicle.torque}</p>
                                    </div>
                                )}
                                {vehicle.mileage_kmpl && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-[10px] text-gray-500">Mileage</p>
                                        <p className="text-sm font-semibold">{vehicle.mileage_kmpl} kmpl</p>
                                    </div>
                                )}
                                {isEV && vehicle.range_km && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-[10px] text-gray-500">Range</p>
                                        <p className="text-sm font-semibold">{vehicle.range_km} km</p>
                                    </div>
                                )}
                                {isEV && vehicle.battery_kwh && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-[10px] text-gray-500">Battery</p>
                                        <p className="text-sm font-semibold">{vehicle.battery_kwh} kWh</p>
                                    </div>
                                )}
                                {vehicle.top_speed_kmph && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-[10px] text-gray-500">Top Speed</p>
                                        <p className="text-sm font-semibold">{vehicle.top_speed_kmph} kmph</p>
                                    </div>
                                )}
                                {vehicle.transmission && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-[10px] text-gray-500">Transmission</p>
                                        <p className="text-sm font-semibold">{vehicle.transmission}</p>
                                    </div>
                                )}
                            </div>

                            {/* Variants */}
                            {vehicle.all_variants && vehicle.all_variants.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Variants ({vehicle.all_variants.length})</h4>
                                    <div className="space-y-1.5">
                                        {vehicle.all_variants.map((v, i) => (
                                            <div key={i} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                                                <span className="text-xs font-medium text-gray-800">{v.name}</span>
                                                <span className="text-xs font-semibold text-gray-900">
                                                    {v.price_paise > 0 ? `₹${(v.price_paise / 100).toLocaleString("en-IN")}` : "—"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {tab === "specs" && (
                        <div className="space-y-2">
                            {[
                                { label: "Type", value: vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1) },
                                { label: "Fuel Type", value: vehicle.fuel_type === "electric" ? "Electric" : "Petrol" },
                                { label: "Engine", value: vehicle.engine_cc ? `${vehicle.engine_cc} cc` : null },
                                { label: "Power", value: vehicle.max_power },
                                { label: "Torque", value: vehicle.torque },
                                { label: "Transmission", value: vehicle.transmission },
                                { label: "Mileage", value: vehicle.mileage_kmpl ? `${vehicle.mileage_kmpl} kmpl` : null },
                                { label: "Top Speed", value: vehicle.top_speed_kmph ? `${vehicle.top_speed_kmph} kmph` : null },
                                { label: "Range", value: vehicle.range_km ? `${vehicle.range_km} km` : null },
                                { label: "Battery", value: vehicle.battery_kwh ? `${vehicle.battery_kwh} kWh` : null },
                                { label: "Charging Time", value: vehicle.charging_time_hours ? `${vehicle.charging_time_hours} hrs` : null },
                                { label: "Wheelbase", value: vehicle.wheelbase_mm ? `${vehicle.wheelbase_mm} mm` : null },
                                { label: "Length", value: vehicle.length_mm ? `${vehicle.length_mm} mm` : null },
                                { label: "Width", value: vehicle.width_mm ? `${vehicle.width_mm} mm` : null },
                                { label: "Height", value: vehicle.height_mm ? `${vehicle.height_mm} mm` : null },
                                { label: "Year", value: String(vehicle.year) },
                            ].filter(s => s.value).map((s, i) => (
                                <div key={i} className="flex justify-between items-center py-2 px-3 rounded-lg odd:bg-gray-50">
                                    <span className="text-xs text-gray-500">{s.label}</span>
                                    <span className="text-xs font-semibold text-gray-900">{s.value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {tab === "colors" && (
                        <div>
                            {vehicle.colors.length > 0 ? (
                                <div className="grid grid-cols-3 gap-3">
                                    {vehicle.colors.map((c, i) => (
                                        <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                            <div
                                                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                                                style={{ backgroundColor: c.hex }}
                                            />
                                            <span className="text-[10px] font-medium text-gray-700 text-center leading-tight">
                                                {c.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 text-center py-8">No color options available</p>
                            )}
                        </div>
                    )}

                    {tab === "features" && (
                        <div>
                            {vehicle.features.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {vehicle.features.map((f, i) => (
                                        <span
                                            key={i}
                                            className="text-xs px-3 py-1.5 rounded-full border font-medium"
                                            style={{
                                                borderColor: brandColor + "40",
                                                color: brandColor,
                                                backgroundColor: brandColor + "08",
                                            }}
                                        >
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 text-center py-8">No features listed</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer CTA */}
                <div className="px-4 py-3 border-t border-gray-100 flex gap-2 shrink-0">
                    <Button
                        className="flex-1 text-white"
                        style={{ backgroundColor: brandColor }}
                        onClick={() => { onLead?.(vehicle.id); onClose() }}
                    >
                        Get Best Price
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1"
                        style={{ borderColor: brandColor, color: brandColor }}
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    )
}

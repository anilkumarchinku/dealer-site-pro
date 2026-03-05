"use client"

import { useState } from "react"
import Link from "next/link"
import type { TwoWheelerVehicle } from "@/lib/types/two-wheeler"
import { getScrapedImageUrls, brandNameToId } from "@/lib/utils/brand-model-images"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

interface Props {
    vehicle:  TwoWheelerVehicle
    slug:     string
    onLead?:  (vehicleId: string) => void
    onCompare?: (vehicle: TwoWheelerVehicle) => void
}

export function VehicleCard({ vehicle, slug, onLead, onCompare }: Props) {
    const prefix = useSitePrefix(slug)
    const price = (vehicle.ex_showroom_price_paise / 100).toLocaleString("en-IN")

    const [jpgUrl, pngUrl] = getScrapedImageUrls("2w", brandNameToId(vehicle.brand), vehicle.model)
    const primarySrc = vehicle.images[0] || jpgUrl
    const [imgSrc, setImgSrc]   = useState(primarySrc)
    const [imgFailed, setFailed] = useState(false)

    function handleImgError() {
        if (imgSrc === jpgUrl) { setImgSrc(pngUrl); return; }
        setFailed(true);
    }

    return (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
            {/* Image */}
            <div className="relative h-44 bg-gray-50 overflow-hidden">
                {!imgFailed ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={imgSrc}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={handleImgError}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">No Image</div>
                )}
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {vehicle.bs6_compliant && (
                        <span className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">BS6</span>
                    )}
                    {vehicle.fame_subsidy_eligible && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">FAME</span>
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
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="font-semibold text-base text-gray-900 leading-tight">{vehicle.brand} {vehicle.model}</h3>
                {vehicle.variant && <p className="text-xs text-gray-500 mt-0.5">{vehicle.variant}</p>}

                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    {vehicle.fuel_type === "petrol" && vehicle.mileage_kmpl && (
                        <span>{vehicle.mileage_kmpl} kmpl</span>
                    )}
                    {vehicle.fuel_type === "electric" && vehicle.range_km && (
                        <span>{vehicle.range_km} km range</span>
                    )}
                    {vehicle.engine_cc && <span>{vehicle.engine_cc}cc</span>}
                    <span className="capitalize">{vehicle.type}</span>
                </div>

                <p className="text-lg font-bold text-gray-900 mt-3">₹{price}</p>
                <p className="text-xs text-gray-500">Ex-showroom</p>

                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => onLead?.(vehicle.id)}
                        className="flex-1 bg-gray-900 text-white text-sm font-medium rounded-lg px-3 py-2 hover:bg-gray-700 transition-colors"
                    >
                        Get Price
                    </button>
                    <Link
                        href={`${prefix}/two-wheelers/${vehicle.id}`}
                        className="flex-1 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg px-3 py-2 text-center hover:bg-gray-50 transition-colors"
                    >
                        View Details
                    </Link>
                </div>
                {onCompare && (
                    <button
                        onClick={() => onCompare(vehicle)}
                        className="w-full mt-2 text-xs text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        + Add to Compare
                    </button>
                )}
            </div>
        </div>
    )
}

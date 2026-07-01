"use client"

import { useState } from "react"
import Link from "next/link"
import { FadeInImage } from "@/components/ui/FadeInImage"
import type { ThreeWheelerUsedVehicle } from "@/lib/types/three-wheeler"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"
import { brandNameToId, getVehicleImageUrls } from "@/lib/utils/brand-model-images"

interface Props {
    vehicle: ThreeWheelerUsedVehicle
    slug:    string
    onLead?: (vehicleId: string) => void
}

const GRADE_COLORS = {
    A: "bg-green-100 text-green-700 border-green-300",
    B: "bg-yellow-100 text-yellow-700 border-yellow-300",
    C: "bg-orange-100 text-orange-700 border-orange-300",
}

function modelImageSourceKind(src: string | null | undefined) {
    const value = String(src ?? "").toLowerCase()
    if (
        value.includes("/storage/v1/object/public/dealer-assets/vehicles/") ||
        value.includes("/storage/v1/object/public/dealer-assets/sell-requests/") ||
        value.includes("/storage/v1/object/public/vehicle-images/")
    ) {
        return "inventory-photo"
    }
    return "resolved-model"
}

export function UsedVehicleCard({ vehicle, slug, onLead }: Props) {
    const prefix = useSitePrefix(slug)
    const [imgIdx, setImgIdx] = useState(0)
    const [imgFailed, setImgFailed] = useState(false)
    const imageUrls = getVehicleImageUrls("3w", brandNameToId(vehicle.brand, "3w"), vehicle.model, vehicle.images[0])
    const image = imageUrls[imgIdx] ?? null
    const hasOffer = typeof vehicle.offer_price_paise === "number" && vehicle.offer_price_paise > 0 && vehicle.offer_price_paise < vehicle.price_paise
    const price = ((hasOffer ? vehicle.offer_price_paise! : vehicle.price_paise) / 100).toLocaleString("en-IN")
    const originalPrice = (vehicle.price_paise / 100).toLocaleString("en-IN")

    if (!image || imgFailed) return null

    function handleImgError() {
        if (imgIdx < imageUrls.length - 1) {
            setImgIdx((current) => current + 1)
            return
        }
        setImgFailed(true)
    }

    return (
        <div data-vehicle-card="true" data-model-image-source={modelImageSourceKind(image)} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
            {/* Image */}
            <div className="relative aspect-[16/10] bg-gray-50 overflow-hidden">
                <FadeInImage
                    src={image}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={handleImgError}
                />
                {vehicle.certified_pre_owned && (
                    <div className="absolute top-3 left-3">
                        <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">CPO</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold text-base">{vehicle.brand} {vehicle.model}</h3>
                        <p className="text-xs text-muted-foreground">
                            {vehicle.year} · {vehicle.km_driven.toLocaleString("en-IN")} km · {vehicle.no_of_owners} owner{vehicle.no_of_owners > 1 ? "s" : ""}
                        </p>
                    </div>
                    {vehicle.condition_grade && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${GRADE_COLORS[vehicle.condition_grade]}`}>
                            Grade {vehicle.condition_grade}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="capitalize">{vehicle.fuel_type}</span>
                    {vehicle.rc_status && <span className="capitalize">RC: {vehicle.rc_status}</span>}
                    {vehicle.type && <span className="capitalize">{vehicle.type.replace('_', ' ')}</span>}
                </div>

                <div className="flex items-baseline gap-1 mt-3">
                    <p className="text-lg font-bold text-primary">₹{price}</p>
                    {hasOffer && (
                        <span className="text-xs text-muted-foreground line-through">₹{originalPrice}</span>
                    )}
                    {vehicle.negotiable && <span className="text-xs text-muted-foreground">(negotiable)</span>}
                </div>
                {hasOffer && (
                    <p className="mt-1 text-xs font-medium text-primary">{vehicle.offer_label || "Offer price"}</p>
                )}

                <div className="flex gap-2 mt-4">
                    {onLead && (
                        <button
                            onClick={() => onLead(vehicle.id)}
                            className="flex-1 bg-primary text-primary-foreground text-sm font-medium rounded-lg px-3 py-2 hover:opacity-90 transition-opacity"
                        >
                            Make an Offer
                        </button>
                    )}
                    <Link
                        href={`${prefix}/three-wheelers/used/${vehicle.id}`}
                        className="flex-1 border border-border text-sm font-medium rounded-lg px-3 py-2 text-center hover:bg-muted/50 transition-colors"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    )
}

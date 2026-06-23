"use client"

import { useState } from "react"
import Link from "next/link"
import { Bike } from "lucide-react"
import { FadeInImage } from "@/components/ui/FadeInImage"
import type { TwoWheelerUsedVehicle } from "@/lib/types/two-wheeler"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

interface Props {
    vehicle: TwoWheelerUsedVehicle
    slug:    string
    onLead?: (vehicleId: string) => void
}

const GRADE_COLORS = {
    A: "bg-green-100 text-green-700 border-green-300",
    B: "bg-yellow-100 text-yellow-700 border-yellow-300",
    C: "bg-orange-100 text-orange-700 border-orange-300",
}

/**
 * Consistent "no image available" placeholder — matches the treatment used
 * across all two-wheeler cards (see VehicleCard).
 */
function NoImagePlaceholder() {
    return (
        <div
            role="img"
            aria-label="No image available"
            className="flex h-full w-full items-center justify-center bg-gray-100 border-b border-gray-200"
        >
            <Bike className="h-10 w-10 text-gray-400" strokeWidth={1.5} aria-hidden="true" />
            <span className="sr-only">No image available</span>
        </div>
    )
}

export function UsedVehicleCard({ vehicle, slug, onLead }: Props) {
    const prefix = useSitePrefix(slug)
    const [imgFailed, setImgFailed] = useState(false)
    const hasOffer = typeof vehicle.offer_price_paise === "number" && vehicle.offer_price_paise > 0 && vehicle.offer_price_paise < vehicle.price_paise
    const price = ((hasOffer ? vehicle.offer_price_paise! : vehicle.price_paise) / 100).toLocaleString("en-IN")
    const originalPrice = (vehicle.price_paise / 100).toLocaleString("en-IN")

    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
            {/* Image */}
            <div className="relative aspect-[16/10] bg-gray-50 overflow-hidden">
                {vehicle.images[0] && !imgFailed ? (
                    <FadeInImage
                        src={vehicle.images[0]}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={() => setImgFailed(true)}
                    />
                ) : (
                    <NoImagePlaceholder />
                )}
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
                        <p className="text-xs text-muted-foreground">{vehicle.year} · {vehicle.km_driven.toLocaleString("en-IN")} km · {vehicle.no_of_owners} owner{vehicle.no_of_owners > 1 ? "s" : ""}</p>
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
                        href={`${prefix}/two-wheelers/used/${vehicle.id}`}
                        className="flex-1 border border-border text-sm font-medium rounded-lg px-3 py-2 text-center hover:bg-muted/50 transition-colors"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    )
}

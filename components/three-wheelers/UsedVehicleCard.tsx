"use client"

import Link from "next/link"
import type { ThreeWheelerUsedVehicle } from "@/lib/types/three-wheeler"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

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

export function UsedVehicleCard({ vehicle, slug, onLead }: Props) {
    const prefix = useSitePrefix(slug)
    const price = (vehicle.price_paise / 100).toLocaleString("en-IN")

    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
            {/* Image */}
            <div className="relative h-44 bg-muted/30 overflow-hidden">
                {vehicle.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={vehicle.images[0]}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No Image</div>
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
                    {vehicle.negotiable && <span className="text-xs text-muted-foreground">(negotiable)</span>}
                </div>

                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => onLead?.(vehicle.id)}
                        className="flex-1 bg-primary text-primary-foreground text-sm font-medium rounded-lg px-3 py-2 hover:opacity-90 transition-opacity"
                    >
                        Make an Offer
                    </button>
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

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { ThreeWheelerVehicle } from "@/lib/types/three-wheeler"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"
import { resolveGeneratedVehicleImage } from "@/lib/utils/generated-vehicle-images"

interface Props {
    currentId:   string
    dealerId:    string
    vehicleType: string
    slug:        string
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

function SimilarVehicleCard({ vehicle, imgSrc, href }: { vehicle: ThreeWheelerVehicle; imgSrc: string; href: string }) {
    const [failed, setFailed] = useState(false)
    if (failed) return null

    const priceF = vehicle.ex_showroom_price_paise > 0
        ? `₹${(vehicle.ex_showroom_price_paise / 100).toLocaleString("en-IN")}`
        : "Price on request"

    return (
        <Link
            href={href}
            data-vehicle-card="true"
            data-model-image-source={modelImageSourceKind(imgSrc)}
            className="shrink-0 w-44 rounded-xl border border-border bg-card p-3 hover:shadow-md transition-shadow"
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={imgSrc}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-28 object-contain rounded-lg bg-muted/30"
                onError={() => setFailed(true)}
            />
            <p className="text-sm font-semibold mt-2 leading-tight line-clamp-2">{vehicle.brand} {vehicle.model}</p>
            <p className="text-xs text-primary mt-0.5 truncate">{priceF}</p>
        </Link>
    )
}

export function SimilarVehicles({ currentId, dealerId, vehicleType, slug }: Props) {
    const [vehicles, setVehicles] = useState<ThreeWheelerVehicle[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const prefix = useSitePrefix(slug)

    useEffect(() => {
        if (!dealerId || !vehicleType) { setLoading(false); return }
        let active = true
        setLoading(true)
        setError(false)
        fetch(`/api/three-wheelers?dealerId=${dealerId}&type=${vehicleType}&pageSize=6`)
            .then(r => {
                if (!r.ok) throw new Error(`Request failed: ${r.status}`)
                return r.json()
            })
            .then(data => {
                if (!active) return
                const all: ThreeWheelerVehicle[] = data.vehicles ?? []
                setVehicles(all.filter(v => v.id !== currentId).slice(0, 4))
            })
            .catch(err => {
                if (!active) return
                console.error("Failed to load similar vehicles", err)
                setError(true)
            })
            .finally(() => { if (active) setLoading(false) })
        return () => { active = false }
    }, [currentId, dealerId, vehicleType])

    // Loading skeleton.
    if (loading) {
        return (
            <section className="mt-10">
                <h2 className="text-xl font-bold mb-4">Similar Vehicles</h2>
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="shrink-0 w-44 rounded-xl border border-border bg-card p-3">
                            <div className="h-28 w-full rounded-lg bg-muted/40 animate-pulse" />
                            <div className="mt-2 h-4 w-3/4 rounded bg-muted/40 animate-pulse" />
                            <div className="mt-1.5 h-3 w-1/2 rounded bg-muted/40 animate-pulse" />
                        </div>
                    ))}
                </div>
            </section>
        )
    }

    // Surface load failures instead of silently rendering nothing.
    if (error) {
        return (
            <section className="mt-10">
                <h2 className="text-xl font-bold mb-4">Similar Vehicles</h2>
                <p className="text-sm text-muted-foreground">Couldn&apos;t load similar vehicles right now.</p>
            </section>
        )
    }

    const vehiclesWithImages = vehicles
        .map(vehicle => ({
            vehicle,
            imgSrc: resolveGeneratedVehicleImage("3w", vehicle.brand, vehicle.model, vehicle.images),
        }))
        .filter((item): item is { vehicle: ThreeWheelerVehicle; imgSrc: string } => Boolean(item.imgSrc))

    // Show only cards that can render a real uploaded or model image.
    if (vehiclesWithImages.length < 1) return null

    return (
        <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">Similar Vehicles</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {vehiclesWithImages.map(({ vehicle: v, imgSrc }) => (
                    <SimilarVehicleCard key={v.id} vehicle={v} imgSrc={imgSrc} href={`${prefix}/three-wheelers/${v.id}`} />
                ))}
            </div>
        </section>
    )
}

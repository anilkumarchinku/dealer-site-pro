"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { TwoWheelerVehicle } from "@/lib/types/two-wheeler"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

interface Props {
    currentId: string
    dealerId: string
    vehicleType: string  // "bike" | "scooter" | "electric"
    slug: string
}

export function SimilarVehicles({ currentId, dealerId, vehicleType, slug }: Props) {
    const [vehicles, setVehicles] = useState<TwoWheelerVehicle[]>([])
    const prefix = useSitePrefix(slug)

    useEffect(() => {
        if (!dealerId) return
        const p = new URLSearchParams({ dealerId, type: vehicleType, pageSize: "6" })
        fetch(`/api/two-wheelers?${p}`)
            .then(r => r.json())
            .then(data => {
                const list: TwoWheelerVehicle[] = data.vehicles ?? []
                setVehicles(list.filter(v => v.id !== currentId).slice(0, 4))
            })
            .catch(() => {/* silently ignore */})
    }, [dealerId, vehicleType, currentId])

    if (vehicles.length < 2) return null

    return (
        <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">Similar Vehicles</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                {vehicles.map(v => {
                    const imgSrc = Array.isArray(v.images) && v.images.length > 0 ? v.images[0] : null
                    const priceF = v.ex_showroom_price_paise > 0
                        ? `₹${(v.ex_showroom_price_paise / 100).toLocaleString("en-IN")}`
                        : "Price on request"

                    return (
                        <Link
                            key={v.id}
                            href={`${prefix}/two-wheelers/${v.id}`}
                            className="shrink-0 w-44 rounded-xl border border-border bg-card p-2 hover:shadow-md transition-shadow"
                        >
                            {imgSrc ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={imgSrc}
                                    alt={`${v.brand} ${v.model}`}
                                    className="w-full h-28 object-contain rounded-xl bg-muted/30"
                                />
                            ) : (
                                <div className="w-full h-28 rounded-xl bg-muted/30 flex items-center justify-center text-3xl">
                                    🏍️
                                </div>
                            )}
                            <p className="text-sm font-semibold mt-2 leading-tight line-clamp-2">{v.brand} {v.model}</p>
                            <p className="text-xs text-primary mt-0.5">{priceF}</p>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}

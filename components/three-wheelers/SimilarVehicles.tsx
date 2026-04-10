"use client"

import { useEffect, useState } from "react"
import type { ThreeWheelerVehicle } from "@/lib/types/three-wheeler"

interface Props {
    currentId:   string
    dealerId:    string
    vehicleType: string
    slug:        string
}

export function SimilarVehicles({ currentId, dealerId, vehicleType }: Props) {
    const [vehicles, setVehicles] = useState<ThreeWheelerVehicle[]>([])

    useEffect(() => {
        if (!dealerId || !vehicleType) return
        fetch(`/api/three-wheelers?dealerId=${dealerId}&type=${vehicleType}&pageSize=6`)
            .then(r => r.json())
            .then(data => {
                const all: ThreeWheelerVehicle[] = data.vehicles ?? []
                setVehicles(all.filter(v => v.id !== currentId).slice(0, 4))
            })
            .catch(() => {/* silently ignore */})
    }, [currentId, dealerId, vehicleType])

    if (vehicles.length < 2) return null

    return (
        <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">Similar Vehicles</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {vehicles.map(v => (
                    <a
                        key={v.id}
                        href={`/three-wheelers/${v.id}`}
                        className="shrink-0 w-44 rounded-xl border border-border bg-card p-3 hover:shadow-md transition-shadow"
                    >
                        <img
                            src={v.images?.[0] ?? ""}
                            alt={`${v.brand} ${v.model}`}
                            className="w-full h-28 object-contain rounded-lg bg-muted/30"
                        />
                        <p className="text-sm font-semibold mt-2">{v.brand} {v.model}</p>
                        <p className="text-xs text-primary mt-0.5">
                            {v.ex_showroom_price_paise > 0
                                ? `₹${(v.ex_showroom_price_paise / 100).toLocaleString("en-IN")}`
                                : "Price on request"}
                        </p>
                    </a>
                ))}
            </div>
        </section>
    )
}

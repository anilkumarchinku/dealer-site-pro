"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Truck } from "lucide-react"
import type { ThreeWheelerVehicle } from "@/lib/types/three-wheeler"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

interface Props {
    currentId:   string
    dealerId:    string
    vehicleType: string
    slug:        string
}

/** Neutral placeholder shown when a similar vehicle has no image. */
function NoImagePlaceholder() {
    return (
        <div
            role="img"
            aria-label="No image available"
            className="flex h-28 w-full items-center justify-center rounded-lg bg-muted/30"
        >
            <Truck className="h-8 w-8 text-gray-400" strokeWidth={1.5} aria-hidden="true" />
            <span className="sr-only">No image available</span>
        </div>
    )
}

/** Image that falls back to a placeholder if the source fails to load. */
function SimilarImage({ src, alt }: { src: string; alt: string }) {
    const [failed, setFailed] = useState(false)
    if (failed) return <NoImagePlaceholder />
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt}
            className="w-full h-28 object-contain rounded-lg bg-muted/30"
            onError={() => setFailed(true)}
        />
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

    // Show as soon as there is at least one result.
    if (vehicles.length < 1) return null

    return (
        <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">Similar Vehicles</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {vehicles.map(v => {
                    const imgSrc = Array.isArray(v.images) && v.images.length > 0 ? v.images[0] : null
                    return (
                        <Link
                            key={v.id}
                            href={`${prefix}/three-wheelers/${v.id}`}
                            className="shrink-0 w-44 rounded-xl border border-border bg-card p-3 hover:shadow-md transition-shadow"
                        >
                            {imgSrc ? (
                                <SimilarImage src={imgSrc} alt={`${v.brand} ${v.model}`} />
                            ) : (
                                <NoImagePlaceholder />
                            )}
                            <p className="text-sm font-semibold mt-2">{v.brand} {v.model}</p>
                            <p className="text-xs text-primary mt-0.5">
                                {v.ex_showroom_price_paise > 0
                                    ? `₹${(v.ex_showroom_price_paise / 100).toLocaleString("en-IN")}`
                                    : "Price on request"}
                            </p>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}

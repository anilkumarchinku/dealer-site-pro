"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bike } from "lucide-react"
import type { TwoWheelerVehicle } from "@/lib/types/two-wheeler"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

interface Props {
    currentId: string
    dealerId: string
    vehicleType: string  // "bike" | "scooter" | "electric"
    slug: string
}

/** Neutral placeholder shown when a similar vehicle has no image. */
function NoImagePlaceholder() {
    return (
        <div
            role="img"
            aria-label="No image available"
            className="flex h-28 w-full items-center justify-center rounded-xl bg-muted/30"
        >
            <Bike className="h-8 w-8 text-gray-400" strokeWidth={1.5} aria-hidden="true" />
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
            className="w-full h-28 object-contain rounded-xl bg-muted/30"
            onError={() => setFailed(true)}
        />
    )
}

export function SimilarVehicles({ currentId, dealerId, vehicleType, slug }: Props) {
    const [vehicles, setVehicles] = useState<TwoWheelerVehicle[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const prefix = useSitePrefix(slug)

    useEffect(() => {
        if (!dealerId) { setLoading(false); return }
        let active = true
        setLoading(true)
        setError(false)
        const p = new URLSearchParams({ dealerId, type: vehicleType, pageSize: "6" })
        fetch(`/api/two-wheelers?${p}`)
            .then(r => {
                if (!r.ok) throw new Error(`Request failed: ${r.status}`)
                return r.json()
            })
            .then(data => {
                if (!active) return
                const list: TwoWheelerVehicle[] = data.vehicles ?? []
                setVehicles(list.filter(v => v.id !== currentId).slice(0, 4))
            })
            .catch(err => {
                if (!active) return
                console.error("Failed to load similar vehicles", err)
                setError(true)
            })
            .finally(() => { if (active) setLoading(false) })
        return () => { active = false }
    }, [dealerId, vehicleType, currentId])

    // Loading skeleton.
    if (loading) {
        return (
            <section className="mt-10">
                <h2 className="text-xl font-bold mb-4">Similar Vehicles</h2>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="shrink-0 w-44 rounded-xl border border-border bg-card p-2">
                            <div className="h-28 w-full rounded-xl bg-muted/40 animate-pulse" />
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
                                <SimilarImage src={imgSrc} alt={`${v.brand} ${v.model}`} />
                            ) : (
                                <NoImagePlaceholder />
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

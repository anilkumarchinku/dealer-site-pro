"use client"

import Link from "next/link"
import { X } from "lucide-react"
import type { ThreeWheelerCompareItem } from "@/lib/types/three-wheeler"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"
import { isUsableVehicleImageUrl } from "@/lib/utils/brand-model-images"

interface Props {
    items:     ThreeWheelerCompareItem[]
    slug:      string
    onRemove:  (id: string) => void
    onClear:   () => void
}

export function CompareBar({ items, slug, onRemove, onClear }: Props) {
    const prefix = useSitePrefix(slug)
    if (items.length === 0) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur border-t border-border shadow-lg">
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <p className="text-sm font-medium shrink-0">Compare ({items.length}/3)</p>

                <div className="min-w-0 flex-1 flex items-center gap-3 overflow-x-auto">
                    {items.map(item => (
                        <div key={item.id} className="flex min-w-0 max-w-[11rem] items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5 shrink-0">
                            {isUsableVehicleImageUrl(item.image) ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={item.image} alt={item.brand} className="w-8 h-8 object-cover rounded" />
                            ) : null}
                            <span className="min-w-0 truncate text-sm font-medium">{item.brand} {item.model}</span>
                            <button onClick={() => onRemove(item.id)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-end gap-2 shrink-0">
                    <button onClick={onClear} className="text-sm text-muted-foreground hover:text-foreground">Clear</button>
                    {items.length >= 2 && (
                        <Link
                            href={`${prefix}/three-wheelers/compare?ids=${items.map(i => i.id).join(",")}`}
                            className="bg-primary text-primary-foreground text-sm font-medium rounded-lg px-4 py-2 text-center"
                        >
                            Compare Now
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

"use client"

import Link from "next/link"
import { X } from "lucide-react"
import type { TwoWheelerCompareItem } from "@/lib/types/two-wheeler"

interface Props {
    items:     TwoWheelerCompareItem[]
    slug:      string
    onRemove:  (id: string) => void
    onClear:   () => void
}

export function CompareBar({ items, slug, onRemove, onClear }: Props) {
    if (items.length === 0) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur border-t border-border shadow-lg">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
                <p className="text-sm font-medium shrink-0">Compare ({items.length}/3)</p>

                <div className="flex-1 flex items-center gap-3 overflow-x-auto">
                    {items.map(item => (
                        <div key={item.id} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5 shrink-0">
                            {item.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={item.image} alt={item.brand} className="w-8 h-8 object-cover rounded" />
                            ) : (
                                <div className="w-8 h-8 bg-muted rounded" />
                            )}
                            <span className="text-sm font-medium">{item.brand} {item.model}</span>
                            <button onClick={() => onRemove(item.id)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                    {[...Array(3 - items.length)].map((_, i) => (
                        <div key={i} className="w-28 h-9 rounded-lg border-2 border-dashed border-border flex items-center justify-center shrink-0">
                            <span className="text-xs text-muted-foreground">+ Add</span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button onClick={onClear} className="text-sm text-muted-foreground hover:text-foreground">Clear</button>
                    {items.length >= 2 && (
                        <Link
                            href={`/sites/${slug}/two-wheelers/compare?ids=${items.map(i => i.id).join(",")}`}
                            className="bg-primary text-primary-foreground text-sm font-medium rounded-lg px-4 py-2"
                        >
                            Compare Now
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

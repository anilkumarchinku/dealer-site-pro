"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

interface OfferPopupProps {
    offer: {
        id: string
        title: string
        description: string | null
        image_url: string | null
        valid_until: string | null
    } | null
}

export function OfferPopup({ offer }: OfferPopupProps) {
    const [mounted, setMounted] = useState(false)
    const [open, setOpen] = useState(true)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        setOpen(true)
    }, [offer?.id])

    if (!mounted || !offer?.image_url || !open) return null

    return createPortal(
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/65 px-4 py-6">
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black"
                    aria-label="Close offer popup"
                >
                    <X className="h-5 w-5" />
                </button>
                <div className="relative aspect-[4/3] w-full bg-slate-100">
                    <Image
                        src={offer.image_url}
                        alt={offer.title}
                        fill
                        priority
                        sizes="(max-width: 640px) 92vw, 512px"
                        className="object-contain"
                        unoptimized
                    />
                </div>
                {(offer.title || offer.description || offer.valid_until) && (
                    <div className="space-y-1 px-5 py-4">
                        {offer.title && <h2 className="text-base font-bold text-slate-950">{offer.title}</h2>}
                        {offer.description && <p className="text-sm text-slate-600">{offer.description}</p>}
                        {offer.valid_until && (
                            <p className="text-xs font-medium text-slate-500">
                                Valid until {new Date(offer.valid_until).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>,
        document.body,
    )
}

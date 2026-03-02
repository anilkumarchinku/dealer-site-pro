"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
    images: string[]
    alt:    string
}

export function VehicleDetailGallery({ images, alt }: Props) {
    const [active, setActive] = useState(0)

    if (images.length === 0) {
        return (
            <div className="w-full h-72 bg-muted/30 rounded-2xl flex items-center justify-center text-muted-foreground">
                No Images Available
            </div>
        )
    }

    function prev() { setActive(i => (i - 1 + images.length) % images.length) }
    function next() { setActive(i => (i + 1) % images.length) }

    return (
        <div className="space-y-3">
            {/* Main image */}
            <div className="relative w-full h-72 md:h-96 bg-muted/20 rounded-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={images[active]} alt={alt} className="w-full h-full object-contain" />

                {images.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white hover:bg-black/50"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white hover:bg-black/50"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActive(i)}
                                    className={`w-2 h-2 rounded-full transition-colors ${i === active ? "bg-white" : "bg-white/50"}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className={`shrink-0 w-16 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                                i === active ? "border-primary" : "border-border"
                            }`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

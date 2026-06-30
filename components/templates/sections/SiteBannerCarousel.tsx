"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { SiteBanner } from "@/lib/types/site-banner"

interface SiteBannerCarouselProps {
    banners?: SiteBanner[]
}

export function SiteBannerCarousel({ banners = [] }: SiteBannerCarouselProps) {
    const activeBanners = useMemo(
        () => banners.filter(banner => Boolean(banner.desktop_image_url)),
        [banners],
    )
    const [index, setIndex] = useState(0)

    useEffect(() => {
        setIndex(0)
    }, [activeBanners.length])

    useEffect(() => {
        if (activeBanners.length < 2) return
        const timer = window.setInterval(() => {
            setIndex(current => (current + 1) % activeBanners.length)
        }, 5000)

        return () => window.clearInterval(timer)
    }, [activeBanners.length])

    if (activeBanners.length === 0) return null

    const banner = activeBanners[index] ?? activeBanners[0]
    const mobileImage = banner.mobile_image_url || banner.desktop_image_url
    const showControls = activeBanners.length > 1
    const goToPrevious = () => {
        setIndex(current => (current - 1 + activeBanners.length) % activeBanners.length)
    }
    const goToNext = () => {
        setIndex(current => (current + 1) % activeBanners.length)
    }

    return (
        <section className="bg-white py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
                    <picture>
                        <source media="(max-width: 640px)" srcSet={mobileImage} />
                        <img
                            src={banner.desktop_image_url}
                            alt={banner.title || "Website banner"}
                            className="aspect-[4/5] w-full object-cover sm:aspect-[16/6] lg:aspect-[16/5]"
                            loading="lazy"
                        />
                    </picture>
                    {showControls && (
                        <>
                            <button
                                type="button"
                                aria-label="Previous banner"
                                onClick={goToPrevious}
                                className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white shadow-lg transition hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-5 sm:h-12 sm:w-12"
                            >
                                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                            </button>
                            <button
                                type="button"
                                aria-label="Next banner"
                                onClick={goToNext}
                                className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white shadow-lg transition hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-5 sm:h-12 sm:w-12"
                            >
                                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                            </button>
                            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/30 px-2 py-1">
                                {activeBanners.map(item => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className={`h-1.5 rounded-full transition-all ${item.id === banner.id ? "w-5 bg-white" : "w-1.5 bg-white/60"}`}
                                        aria-label={`Show banner ${item.title || item.id}`}
                                        onClick={() => setIndex(activeBanners.findIndex(candidate => candidate.id === item.id))}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}

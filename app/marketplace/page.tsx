"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

const CATEGORY_ALIASES: Record<string, string> = {
    "2w": "2w",
    bike: "2w",
    bikes: "2w",
    "3w": "3w",
    auto: "3w",
    autos: "3w",
    "4w": "4w",
    car: "4w",
    cars: "4w",
}

function MarketplaceFrame() {
    const searchParams = useSearchParams()
    const category = CATEGORY_ALIASES[(searchParams.get("category") || searchParams.get("type") || "").toLowerCase()] || "all"
    const query = searchParams.get("q") || searchParams.get("search") || ""
    const iframeParams = new URLSearchParams({
        v: "design-system-20260625-compare-popup-v60",
        category,
    })

    if (query.trim()) iframeParams.set("q", query.trim())

    return (
        <main className="min-h-screen bg-[#F5F1EA]">
            <iframe
                title="DealerSite Pro vehicle marketplace"
                src={`/design-system-handoff/ui_kits/marketing/index.html?${iframeParams.toString()}#listing`}
                className="block h-dvh w-full border-0"
            />
        </main>
    )
}

export default function MarketplacePage() {
    return (
        <Suspense fallback={<main className="min-h-screen bg-[#F5F1EA]" />}>
            <MarketplaceFrame />
        </Suspense>
    )
}

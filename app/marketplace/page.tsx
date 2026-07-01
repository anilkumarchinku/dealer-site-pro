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
    const condition = (searchParams.get("condition") || "").toLowerCase()
    const iframeParams = new URLSearchParams({
        v: "marketplace-shell-v13",
        surface: "marketplace",
        category,
        type: category,
        condition: "all",
    })

    if (query.trim()) {
        iframeParams.set("q", query.trim())
        iframeParams.set("search", query.trim())
    }
    if (condition === "used" || condition === "new" || condition === "certified_pre_owned") {
        iframeParams.set("condition", condition)
    }

    return (
        <main className="relative min-h-screen bg-[#F5F1EA]">
            <h1 className="sr-only">DealerSite Pro vehicle marketplace</h1>
            <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm font-semibold text-[#5f564c]">
                Loading marketplace...
            </div>
            <iframe
                title="DealerSite Pro vehicle marketplace"
                src={`/design-system-handoff/ui_kits/marketing/index.html?${iframeParams.toString()}#listing`}
                className="relative block h-dvh w-full border-0 bg-[#F5F1EA]"
            />
        </main>
    )
}

export default function MarketplacePage() {
    return (
        <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-[#F5F1EA] px-4 text-sm font-semibold text-[#5f564c]">Loading marketplace...</main>}>
            <MarketplaceFrame />
        </Suspense>
    )
}

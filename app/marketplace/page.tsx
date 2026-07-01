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
        v: "marketplace-shell-v10",
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

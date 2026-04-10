"use client"

import { useParams } from "next/navigation"
import { FleetROICalculator } from "@/components/three-wheelers/FleetROICalculator"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function FleetROIPage() {
    const params = useParams()
    const slug = params.slug as string
    const prefix = useSitePrefix(slug)

    return (
        <div className="min-h-screen max-w-5xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Link
                    href={`${prefix}/three-wheelers`}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ChevronLeft className="w-4 h-4" /> Back to Three-Wheelers
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">Fleet ROI Calculator</h1>
                <p className="text-muted-foreground mt-2">
                    Calculate your monthly earnings, expenses, and payback period for a 3-wheeler
                    investment.
                </p>
            </div>

            <FleetROICalculator />

            <div className="mt-8 p-4 rounded-xl bg-muted/30 text-xs text-muted-foreground">
                * These are approximate estimates. Actual earnings depend on route, demand, fuel
                prices, and operating conditions. Consult your dealer for accurate financing terms.
            </div>
        </div>
    )
}

"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { EMICalculator } from "@/components/shared/EMICalculator"
import { ChevronLeft } from "lucide-react"

export default function ThreeWheelerEMICalculatorPage() {
    const params = useParams()
    const slug   = params.slug as string

    return (
        <div className="min-h-screen max-w-2xl mx-auto px-4 py-10">
            <div className="mb-8">
                <Link href={`/sites/${slug}/three-wheelers`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="w-4 h-4" /> Back
                </Link>
                <h1 className="text-3xl font-bold mt-4">3-Wheeler EMI Calculator</h1>
                <p className="text-muted-foreground mt-2">Estimate your monthly instalments and plan your purchase.</p>
            </div>

            <EMICalculator defaultPrice={200000} />

            <div className="mt-8 p-5 bg-card border border-border rounded-xl space-y-3 text-sm text-muted-foreground">
                <h3 className="font-semibold text-foreground">Finance Tips for 3-Wheeler Buyers</h3>
                <ul className="space-y-1.5 list-disc list-inside">
                    <li>Commercial vehicle loans typically have 12–48 month tenures</li>
                    <li>Down payment of 20–25% is standard for 3W commercial loans</li>
                    <li>Fleet buyers (3+ vehicles) may qualify for bulk financing rates</li>
                    <li>Electric 3W may be eligible for FAME subsidy and state EV incentives</li>
                    <li>Compare rates from HDFC, ICICI, UCO Bank, and regional co-op banks</li>
                </ul>
                <div className="pt-2">
                    <Link href={`/sites/${slug}/three-wheelers`} className="text-primary hover:underline">Browse available models →</Link>
                </div>
            </div>
        </div>
    )
}

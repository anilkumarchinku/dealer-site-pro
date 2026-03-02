"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { EMICalculator } from "@/components/shared/EMICalculator"
import { ChevronLeft } from "lucide-react"

export default function EMICalculatorPage() {
    const params = useParams()
    const slug   = params.slug as string

    return (
        <div className="min-h-screen max-w-2xl mx-auto px-4 py-10">
            <div className="mb-8">
                <Link href={`/sites/${slug}/two-wheelers`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="w-4 h-4" /> Back
                </Link>
                <h1 className="text-3xl font-bold mt-4">2-Wheeler EMI Calculator</h1>
                <p className="text-muted-foreground mt-2">Estimate your monthly instalments and plan your purchase.</p>
            </div>

            <EMICalculator defaultPrice={80000} />

            <div className="mt-8 p-5 bg-card border border-border rounded-xl space-y-3 text-sm text-muted-foreground">
                <h3 className="font-semibold text-foreground">Finance Tips</h3>
                <ul className="space-y-1.5 list-disc list-inside">
                    <li>Down payment of 20–30% reduces total interest significantly</li>
                    <li>24-month tenure offers better overall savings vs 36 months</li>
                    <li>Compare rates from HDFC, ICICI, SBI Bike Loan, and Bajaj Finance</li>
                    <li>Good credit score (700+) can get you rates as low as 7.5%</li>
                </ul>
                <div className="pt-2">
                    <Link href={`/sites/${slug}/two-wheelers`} className="text-primary hover:underline">Browse available models →</Link>
                </div>
            </div>
        </div>
    )
}

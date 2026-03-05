"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { LeadFormModal } from "@/components/three-wheelers/LeadFormModal"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

export default function OffersPage() {
    const params = useParams()
    const slug   = params.slug as string
    const prefix = useSitePrefix(slug)
    const [dealerId, setDealerId] = useState<string | null>(null)
    const [offerOpen, setOfferOpen] = useState(false)

    useEffect(() => {
        if (!slug) return
        supabase.from("dealers").select("id").eq("slug", slug).single()
            .then(({ data }) => { // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (data) setDealerId((data as any).id) })
    }, [slug])

    const offers = [
        {
            title:    "Fleet Purchase Discount",
            desc:     "Buy 3 or more three-wheelers and get up to ₹15,000 off per vehicle",
            tag:      "Fleet",
            color:    "bg-blue-50 border-blue-200",
            tagColor: "bg-blue-100 text-blue-700",
        },
        {
            title:    "0% Processing Fee on Loans",
            desc:     "Zero processing fee on vehicle loans above ₹80,000",
            tag:      "Finance",
            color:    "bg-green-50 border-green-200",
            tagColor: "bg-green-100 text-green-700",
        },
        {
            title:    "Free 1st Service",
            desc:     "Get your first service FREE when you buy a new vehicle from us",
            tag:      "Service",
            color:    "bg-purple-50 border-purple-200",
            tagColor: "bg-purple-100 text-purple-700",
        },
        {
            title:    "EV & FAME Subsidy Assistance",
            desc:     "We handle all paperwork to claim FAME II subsidy on eligible electric three-wheelers",
            tag:      "Electric",
            color:    "bg-yellow-50 border-yellow-200",
            tagColor: "bg-yellow-100 text-yellow-700",
        },
        {
            title:    "Custom Body Work Offer",
            desc:     "Get free body customisation (flatbed / closed body) on select cargo models",
            tag:      "Cargo",
            color:    "bg-orange-50 border-orange-200",
            tagColor: "bg-orange-100 text-orange-700",
        },
        {
            title:    "Exchange Your Old Vehicle",
            desc:     "Exchange your old two or three-wheeler and get up to ₹8,000 extra value",
            tag:      "Exchange",
            color:    "bg-red-50 border-red-200",
            tagColor: "bg-red-100 text-red-700",
        },
    ]

    return (
        <div className="min-h-screen max-w-4xl mx-auto px-4 py-10">
            <div className="mb-8">
                <Link href={`${prefix}/three-wheelers`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="w-4 h-4" /> Back
                </Link>
                <h1 className="text-3xl font-bold mt-4">Offers & Schemes</h1>
                <p className="text-muted-foreground mt-2">Exclusive deals and benefits for our customers this month.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                {offers.map(offer => (
                    <div key={offer.title} className={`rounded-2xl border p-5 space-y-3 ${offer.color}`}>
                        <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${offer.tagColor}`}>{offer.tag}</span>
                        <h3 className="font-bold text-lg">{offer.title}</h3>
                        <p className="text-sm text-muted-foreground">{offer.desc}</p>
                        <button
                            onClick={() => setOfferOpen(true)}
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Claim this offer →
                        </button>
                    </div>
                ))}
            </div>

            <p className="text-xs text-muted-foreground text-center mt-8">
                * Offers are subject to availability and may change without prior notice. Contact us for details.
            </p>

            {dealerId && (
                <LeadFormModal
                    dealerId={dealerId}
                    leadType="offer"
                    title="Claim Offer"
                    isOpen={offerOpen}
                    onClose={() => setOfferOpen(false)}
                />
            )}
        </div>
    )
}

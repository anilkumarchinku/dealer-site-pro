"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { LeadFormModal } from "@/components/two-wheelers/LeadFormModal"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

interface OfferRow {
  id: string
  title: string
  description: string | null
  tag: string | null
  valid_until: string | null
}

const TAG_COLORS: Record<string, string> = {
  Finance:  'bg-green-50 border-green-200',
  Exchange: 'bg-blue-50 border-blue-200',
  Service:  'bg-purple-50 border-purple-200',
  Electric: 'bg-yellow-50 border-yellow-200',
  Offer:    'bg-orange-50 border-orange-200',
  Referral: 'bg-red-50 border-red-200',
  Seasonal: 'bg-pink-50 border-pink-200',
}

const TAG_BADGE_COLORS: Record<string, string> = {
  Finance:  'bg-green-100 text-green-700',
  Exchange: 'bg-blue-100 text-blue-700',
  Service:  'bg-purple-100 text-purple-700',
  Electric: 'bg-yellow-100 text-yellow-700',
  Offer:    'bg-orange-100 text-orange-700',
  Referral: 'bg-red-100 text-red-700',
  Seasonal: 'bg-pink-100 text-pink-700',
}

const FALLBACK_OFFERS = [
  { title: "Free 1st Service", description: "Get your first service FREE on any new purchase", tag: "Service" },
  { title: "Easy Finance Available", description: "0% processing fee on loans. Talk to us for details.", tag: "Finance" },
  { title: "Exchange Bonus", description: "Get extra value when you exchange your old vehicle", tag: "Exchange" },
]

export default function OffersPage() {
    const params = useParams()
    const slug   = params.slug as string
    const prefix = useSitePrefix(slug)
    const [dealerId, setDealerId] = useState<string | null>(null)
    const [offerOpen, setOfferOpen] = useState(false)
    const [offers, setOffers] = useState<OfferRow[]>([])
    const [offersLoading, setOffersLoading] = useState(true)

    useEffect(() => {
        if (!slug) return
        supabase.from("dealers").select("id").eq("slug", slug).single()
            .then(({ data }) => { // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (data) setDealerId((data as any).id) })
    }, [slug])

    useEffect(() => {
        if (!dealerId) return
        setOffersLoading(true)
        fetch(`/api/offers?dealer_id=${dealerId}`)
            .then(r => r.json())
            .then(d => setOffers(d.offers ?? []))
            .finally(() => setOffersLoading(false))
    }, [dealerId])

    const showFallback = !offersLoading && offers.length === 0

    return (
        <div className="min-h-screen max-w-4xl mx-auto px-4 py-10">
            <div className="mb-8">
                <Link href={`${prefix}/two-wheelers`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="w-4 h-4" /> Back
                </Link>
                <h1 className="text-3xl font-bold mt-4">Offers &amp; Schemes</h1>
                <p className="text-muted-foreground mt-2">Exclusive deals and benefits for our customers this month.</p>
            </div>

            {offersLoading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="rounded-2xl border bg-gray-50 border-gray-200 p-5 space-y-3 animate-pulse">
                            <div className="h-5 w-20 bg-gray-200 rounded-full" />
                            <div className="h-6 w-3/4 bg-gray-200 rounded" />
                            <div className="h-4 w-full bg-gray-100 rounded" />
                            <div className="h-4 w-2/3 bg-gray-100 rounded" />
                        </div>
                    ))}
                </div>
            ) : offers.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                    {offers.map(offer => {
                        const cardColor = offer.tag ? (TAG_COLORS[offer.tag] ?? 'bg-gray-50 border-gray-200') : 'bg-gray-50 border-gray-200'
                        const badgeColor = offer.tag ? (TAG_BADGE_COLORS[offer.tag] ?? 'bg-gray-100 text-gray-700') : 'bg-gray-100 text-gray-700'
                        return (
                            <div key={offer.id} className={`rounded-2xl border p-5 space-y-3 ${cardColor}`}>
                                {offer.tag && (
                                    <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeColor}`}>{offer.tag}</span>
                                )}
                                <h3 className="font-bold text-lg">{offer.title}</h3>
                                {offer.description && (
                                    <p className="text-sm text-muted-foreground">{offer.description}</p>
                                )}
                                {offer.valid_until && (
                                    <p className="text-xs text-muted-foreground">
                                        Valid until: {new Date(offer.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                )}
                                <button
                                    onClick={() => setOfferOpen(true)}
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    Claim this offer →
                                </button>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {FALLBACK_OFFERS.map(offer => {
                            const cardColor = TAG_COLORS[offer.tag] ?? 'bg-gray-50 border-gray-200'
                            const badgeColor = TAG_BADGE_COLORS[offer.tag] ?? 'bg-gray-100 text-gray-700'
                            return (
                                <div key={offer.title} className={`rounded-2xl border p-5 space-y-3 ${cardColor}`}>
                                    <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeColor}`}>{offer.tag}</span>
                                    <h3 className="font-bold text-lg">{offer.title}</h3>
                                    <p className="text-sm text-muted-foreground">{offer.description}</p>
                                    <button
                                        onClick={() => setOfferOpen(true)}
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        Claim this offer →
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">* Contact us for current offers and eligibility.</p>
                </>
            )}

            {!showFallback && (
                <p className="text-xs text-muted-foreground text-center mt-8">
                    * Offers are subject to availability and may change without prior notice. Contact us for details.
                </p>
            )}

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

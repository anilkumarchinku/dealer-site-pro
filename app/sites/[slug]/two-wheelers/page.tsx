"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { VehicleCard } from "@/components/two-wheelers/VehicleCard"
import { LeadFormModal } from "@/components/two-wheelers/LeadFormModal"
import type { TwoWheelerVehicle } from "@/lib/types/two-wheeler"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

// Brand-specific hero themes
const BRAND_THEMES: Record<string, { heroClass: string; btnClass: string; accentText: string }> = {
    "Royal Enfield": {
        heroClass:  "bg-gradient-to-br from-[#3D0000] via-[#1A0000] to-black",
        btnClass:   "bg-[#D4A017] text-black hover:bg-[#B8861A]",
        accentText: "text-[#D4A017]",
    },
    "Hero": {
        heroClass:  "bg-gradient-to-br from-[#003087] via-[#001A4D] to-black",
        btnClass:   "bg-[#E31E24] text-white hover:bg-[#C41920]",
        accentText: "text-[#E31E24]",
    },
    "Honda": {
        heroClass:  "bg-gradient-to-br from-[#CC0000] via-[#880000] to-black",
        btnClass:   "bg-white text-[#CC0000] hover:bg-gray-100",
        accentText: "text-red-300",
    },
    "TVS": {
        heroClass:  "bg-gradient-to-br from-[#1B1B8F] via-[#0D0D5C] to-black",
        btnClass:   "bg-[#F7B500] text-black hover:bg-[#D4980A]",
        accentText: "text-[#F7B500]",
    },
    "Bajaj": {
        heroClass:  "bg-gradient-to-br from-[#002FA7] via-[#001A6B] to-black",
        btnClass:   "bg-[#FF6600] text-white hover:bg-[#E05500]",
        accentText: "text-orange-400",
    },
    "Yamaha": {
        heroClass:  "bg-gradient-to-br from-[#003087] via-[#001A4D] to-black",
        btnClass:   "bg-[#E31E24] text-white hover:bg-[#C41920]",
        accentText: "text-red-300",
    },
    "Suzuki": {
        heroClass:  "bg-gradient-to-br from-[#003087] via-[#001A4D] to-black",
        btnClass:   "bg-[#4FC3F7] text-black hover:bg-[#3AACDE]",
        accentText: "text-sky-300",
    },
    "KTM": {
        heroClass:  "bg-gradient-to-br from-[#CC5200] via-[#882200] to-black",
        btnClass:   "bg-[#FF6600] text-white hover:bg-[#E05500]",
        accentText: "text-orange-400",
    },
    "Kawasaki": {
        heroClass:  "bg-gradient-to-br from-[#005500] via-[#003300] to-black",
        btnClass:   "bg-[#66CC00] text-black hover:bg-[#55AA00]",
        accentText: "text-green-400",
    },
    "Ather": {
        heroClass:  "bg-gradient-to-br from-[#0A0A2E] via-[#05050F] to-black",
        btnClass:   "bg-[#00D4FF] text-black hover:bg-[#00B8DC]",
        accentText: "text-cyan-400",
    },
    "Ola Electric": {
        heroClass:  "bg-gradient-to-br from-[#CC0000] via-[#880000] to-black",
        btnClass:   "bg-black text-white hover:bg-gray-900",
        accentText: "text-red-300",
    },
}

const DEFAULT_THEME = {
    heroClass:  "bg-gradient-to-br from-primary/10 via-background to-background",
    btnClass:   "bg-primary text-primary-foreground hover:opacity-90",
    accentText: "text-primary",
}

export default function TwoWheelersHomePage() {
    const params  = useParams()
    const slug    = params.slug as string
    const prefix  = useSitePrefix(slug)

    const [dealer,        setDealer]        = useState<{ id: string; dealership_name: string; phone: string; location: string } | null>(null)
    const [primaryBrand,  setPrimaryBrand]  = useState<string | null>(null)
    const [featured,      setFeatured]      = useState<TwoWheelerVehicle[]>([])
    const [loading,       setLoading]       = useState(true)
    const [leadVehicleId, setLeadVehicleId] = useState<string | null>(null)

    useEffect(() => {
        if (!slug) return
        async function load() {
            const { data: d } = await supabase
                .from("dealers")
                .select("id, dealership_name, phone, location")
                .eq("slug", slug)
                .single()
            if (!d) { setLoading(false); return }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dealer = d as any
            setDealer(dealer)

            // Fetch primary brand for color theming
            const { data: brands } = await supabase
                .from("dealer_brands")
                .select("brand_name")
                .eq("dealer_id", dealer.id)
                .order("is_primary", { ascending: false })
                .limit(1)
            if (brands && brands.length > 0) setPrimaryBrand(brands[0].brand_name)

            const res  = await fetch(`/api/two-wheelers?dealerId=${dealer.id}&pageSize=6&sortBy=views`)
            const data = await res.json()
            setFeatured(data.vehicles ?? [])
            setLoading(false)
        }
        load()
    }, [slug])

    if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>
    if (!dealer) return <div className="min-h-screen flex items-center justify-center">Dealer not found</div>

    const theme      = (primaryBrand && BRAND_THEMES[primaryBrand]) ? BRAND_THEMES[primaryBrand] : DEFAULT_THEME
    const isDarkHero = !!(primaryBrand && BRAND_THEMES[primaryBrand])

    const categories = [
        { label: "Bikes",    href: `${prefix}/two-wheelers/bikes`,    emoji: "🏍️" },
        { label: "Scooters", href: `${prefix}/two-wheelers/scooters`, emoji: "🛵" },
        { label: "Electric", href: `${prefix}/two-wheelers/electric`, emoji: "⚡" },
        { label: "Used",     href: `${prefix}/two-wheelers/used`,     emoji: "🔄" },
    ]

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className={`${theme.heroClass} py-16 px-4`}>
                <div className="max-w-5xl mx-auto text-center space-y-4">
                    {primaryBrand && (
                        <p className={`text-sm font-semibold uppercase tracking-widest ${isDarkHero ? theme.accentText : "text-muted-foreground"}`}>
                            Authorised {primaryBrand} Dealer
                        </p>
                    )}
                    <h1 className={`text-4xl md:text-5xl font-bold ${isDarkHero ? "text-white" : ""}`}>
                        {dealer.dealership_name}
                    </h1>
                    <p className={`text-lg ${isDarkHero ? "text-white/70" : "text-muted-foreground"}`}>
                        Your trusted 2-Wheeler destination in {dealer.location}
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pt-2">
                        <Link
                            href={`${prefix}/two-wheelers/bikes`}
                            className={`${theme.btnClass} rounded-lg px-5 py-2.5 font-medium transition-colors`}
                        >
                            Browse Bikes
                        </Link>
                        <Link
                            href={`${prefix}/two-wheelers/service`}
                            className={`rounded-lg px-5 py-2.5 font-medium transition-colors ${isDarkHero ? "border border-white/30 text-white hover:bg-white/10" : "border border-border hover:bg-muted/50"}`}
                        >
                            Book Service
                        </Link>
                        <Link
                            href={`${prefix}/two-wheelers/emi-calculator`}
                            className={`rounded-lg px-5 py-2.5 font-medium transition-colors ${isDarkHero ? "border border-white/30 text-white hover:bg-white/10" : "border border-border hover:bg-muted/50"}`}
                        >
                            EMI Calculator
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="max-w-5xl mx-auto px-4 py-10">
                <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map(c => (
                        <Link
                            key={c.label}
                            href={c.href}
                            className="flex flex-col items-center gap-3 p-6 bg-card border border-border rounded-2xl hover:border-primary/40 hover:shadow-md transition-all"
                        >
                            <span className="text-4xl">{c.emoji}</span>
                            <span className="font-semibold">{c.label}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured */}
            {featured.length > 0 && (
                <section className="max-w-5xl mx-auto px-4 py-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Popular Models</h2>
                        <Link href={`${prefix}/two-wheelers/bikes`} className="text-sm text-primary hover:underline">View all →</Link>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {featured.map(v => (
                            <VehicleCard
                                key={v.id}
                                vehicle={v}
                                slug={slug}
                                onLead={vid => setLeadVehicleId(vid)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Services strip */}
            <section className="bg-muted/30 py-10 px-4">
                <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
                    {[
                        { icon: "🛠️", title: "Expert Service",  text: "Trained technicians for all brands" },
                        { icon: "💳", title: "Easy Finance",    text: "EMI starting ₹999/month"           },
                        { icon: "🔄", title: "Exchange Offer",  text: "Best value for your old bike"      },
                    ].map(s => (
                        <div key={s.title} className="space-y-2">
                            <div className="text-3xl">{s.icon}</div>
                            <h3 className="font-semibold">{s.title}</h3>
                            <p className="text-sm text-muted-foreground">{s.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick links */}
            <section className="max-w-5xl mx-auto px-4 py-10">
                <div className="grid sm:grid-cols-3 gap-4">
                    <Link href={`${prefix}/two-wheelers/compare`} className="p-4 border border-border rounded-xl hover:border-primary/40 transition-colors">
                        <p className="font-semibold">⚖️ Compare</p>
                        <p className="text-sm text-muted-foreground mt-1">Compare up to 3 models side by side</p>
                    </Link>
                    <Link href={`${prefix}/two-wheelers/offers`} className="p-4 border border-border rounded-xl hover:border-primary/40 transition-colors">
                        <p className="font-semibold">🎁 Offers</p>
                        <p className="text-sm text-muted-foreground mt-1">Current schemes and discounts</p>
                    </Link>
                    <Link href={`${prefix}/two-wheelers/emi-calculator`} className="p-4 border border-border rounded-xl hover:border-primary/40 transition-colors">
                        <p className="font-semibold">🧮 EMI Calculator</p>
                        <p className="text-sm text-muted-foreground mt-1">Plan your monthly payments</p>
                    </Link>
                </div>
            </section>

            {/* Lead modal */}
            <LeadFormModal
                dealerId={dealer.id}
                vehicleId={leadVehicleId ?? undefined}
                leadType="best_price"
                title="Get Best Price"
                isOpen={!!leadVehicleId}
                onClose={() => setLeadVehicleId(null)}
            />
        </div>
    )
}

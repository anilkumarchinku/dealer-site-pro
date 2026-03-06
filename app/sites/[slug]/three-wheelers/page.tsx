"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { VehicleCard } from "@/components/three-wheelers/VehicleCard"
import { LeadFormModal } from "@/components/three-wheelers/LeadFormModal"
import type { ThreeWheelerVehicle } from "@/lib/types/three-wheeler"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

// Brand-specific hero themes for 3W brands
const BRAND_THEMES: Record<string, { heroClass: string; btnClass: string; accentText: string }> = {
    "Piaggio": {
        heroClass: "bg-gradient-to-br from-[#003087] via-[#001A4D] to-black",
        btnClass: "bg-[#E31E24] text-white hover:bg-[#C41920]",
        accentText: "text-red-300",
    },
    "Mahindra": {
        heroClass: "bg-gradient-to-br from-[#CC0000] via-[#880000] to-black",
        btnClass: "bg-white text-[#CC0000] hover:bg-gray-100",
        accentText: "text-red-300",
    },
    "Bajaj": {
        heroClass: "bg-gradient-to-br from-[#002FA7] via-[#001A6B] to-black",
        btnClass: "bg-[#FF6600] text-white hover:bg-[#E05500]",
        accentText: "text-orange-400",
    },
    "TVS": {
        heroClass: "bg-gradient-to-br from-[#1B1B8F] via-[#0D0D5C] to-black",
        btnClass: "bg-[#F7B500] text-black hover:bg-[#D4980A]",
        accentText: "text-[#F7B500]",
    },
    "Atul Auto": {
        heroClass: "bg-gradient-to-br from-[#1A4D1A] via-[#0D300D] to-black",
        btnClass: "bg-[#66CC00] text-black hover:bg-[#55AA00]",
        accentText: "text-green-400",
    },
    "Euler Motors": {
        heroClass: "bg-gradient-to-br from-[#0A0A2E] via-[#05050F] to-black",
        btnClass: "bg-[#00D4FF] text-black hover:bg-[#00B8DC]",
        accentText: "text-cyan-400",
    },
    // ── Additional 3W brands (auto-generated from 3w-brand-colors.json) ───
    "Bajaj Auto": { heroClass: "bg-gradient-to-br from-[#001A3A] via-[#000B19] to-black", btnClass: "bg-[#004DA8] text-white hover:bg-[#00418E]", accentText: "text-[#004DA8]" },
    "Mahindra Last Mile Mobility": { heroClass: "bg-gradient-to-br from-[#4D0B0D] via-[#210505] to-black", btnClass: "bg-[#DE2027] text-white hover:bg-[#BC1B20]", accentText: "text-[#DE2027]" },
    "Piaggio Vehicles": { heroClass: "bg-gradient-to-br from-[#073544] via-[#03161D] to-black", btnClass: "bg-[#1699C3] text-white hover:bg-[#1282A5]", accentText: "text-[#1699C3]" },
    "TVS Motor Company": { heroClass: "bg-gradient-to-br from-[#0C152C] via-[#050913] to-black", btnClass: "bg-[#253C80] text-white hover:bg-[#1F336C]", accentText: "text-[#253C80]" },

    "Altigreen": { heroClass: "bg-gradient-to-br from-[#2B4016] via-[#121B09] to-black", btnClass: "bg-[#7BB841] text-black hover:bg-[#689C37]", accentText: "text-[#7BB841]" },
    "Montra Electric": { heroClass: "bg-gradient-to-br from-[#55270B] via-[#241005] to-black", btnClass: "bg-[#F37021] text-black hover:bg-[#CE5F1C]", accentText: "text-[#F37021]" },
    "Omega Seiki Mobility": { heroClass: "bg-gradient-to-br from-[#004253] via-[#001C23] to-black", btnClass: "bg-[#00BEEE] text-black hover:bg-[#00A1CA]", accentText: "text-[#00BEEE]" },
    "Kinetic Green": { heroClass: "bg-gradient-to-br from-[#2B3E17] via-[#121B0A] to-black", btnClass: "bg-[#7BB343] text-black hover:bg-[#689839]", accentText: "text-[#7BB343]" },
    "Lohia Auto": { heroClass: "bg-gradient-to-br from-[#001F3B] via-[#000D19] to-black", btnClass: "bg-[#005AAA] text-white hover:bg-[#004C90]", accentText: "text-[#005AAA]" },
    "Greaves Mobility": { heroClass: "bg-gradient-to-br from-[#001138] via-[#000818] to-black", btnClass: "bg-[#0033A0] text-white hover:bg-[#002B88]", accentText: "text-[#0033A0]" },
    "YC Electric": { heroClass: "bg-gradient-to-br from-[#2C4417] via-[#131D0A] to-black", btnClass: "bg-[#80C342] text-black hover:bg-[#6CA538]", accentText: "text-[#80C342]" },
    "Saera Electric": { heroClass: "bg-gradient-to-br from-[#003316] via-[#001509] to-black", btnClass: "bg-[#00923F] text-white hover:bg-[#007C35]", accentText: "text-[#00923F]" },
    "Dilli Electric Auto": { heroClass: "bg-gradient-to-br from-[#00223D] via-[#000E1A] to-black", btnClass: "bg-[#0062AF] text-white hover:bg-[#005394]", accentText: "text-[#0062AF]" },
    "EKA Mobility": { heroClass: "bg-gradient-to-br from-[#574707] via-[#261E03] to-black", btnClass: "bg-[#FACC15] text-black hover:bg-[#D4AD11]", accentText: "text-[#FACC15]" },
    "Terra Motors India": { heroClass: "bg-gradient-to-br from-[#143D12] via-[#091A08] to-black", btnClass: "bg-[#3BB033] text-white hover:bg-[#32952B]", accentText: "text-[#3BB033]" },
    "Gayam Motor Works": { heroClass: "bg-gradient-to-br from-[#003A1C] via-[#00180C] to-black", btnClass: "bg-[#00A651] text-white hover:bg-[#008D44]", accentText: "text-[#00A651]" },
    "Zen Mobility": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Triton EV": { heroClass: "bg-gradient-to-br from-[#002748] via-[#001020] to-black", btnClass: "bg-[#0071CE] text-white hover:bg-[#0060AF]", accentText: "text-[#0071CE]" },
    "Saarthi": { heroClass: "bg-gradient-to-br from-[#07403A] via-[#031B19] to-black", btnClass: "bg-[#14B8A6] text-black hover:bg-[#119C8D]", accentText: "text-[#14B8A6]" },
    "E-Ashwa": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Baxy Mobility": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Dabang": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Mini Metro EV": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Keto Motors": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "GreenRick": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Gkon Automotive": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Thukral Electric": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Hexall Motors": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Joy E-Rik": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Dandera": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Eblu": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Zelio": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Speego": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Wasan e-Mobility": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Raftaar Electric": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Rajhans": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Sodyco": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Zero21": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Sniper Electric": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "OPG Mobility": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Vande Bharat EV": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Panther": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "JSA": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Udaan": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "SN Solar Energy": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Shaktimaan E-Rickshaw": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Baba Electric": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Singham": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Skyride": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Star": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Khalsa": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Veectero": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Bahubali E-Rickshaw": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Gem EV": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Deltic": { heroClass: "bg-gradient-to-br from-[#572807] via-[#251103] to-black", btnClass: "bg-[#F97316] text-black hover:bg-[#D36112]", accentText: "text-[#F97316]" },
    "Jezza Motors": { heroClass: "bg-gradient-to-br from-[#142D56] via-[#081324] to-black", btnClass: "bg-[#3B82F6] text-white hover:bg-[#326ED1]", accentText: "text-[#3B82F6]" },
    "City Life Electric": { heroClass: "bg-gradient-to-br from-[#00223D] via-[#000E1A] to-black", btnClass: "bg-[#0062AF] text-white hover:bg-[#005394]", accentText: "text-[#0062AF]" },
    "Avon E-Rickshaw": { heroClass: "bg-gradient-to-br from-[#511E04] via-[#230D01] to-black", btnClass: "bg-[#EA580C] text-white hover:bg-[#C64A0A]", accentText: "text-[#EA580C]" },
    "Mac Electric": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Indo Wagen": { heroClass: "bg-gradient-to-br from-[#073919] via-[#03180B] to-black", btnClass: "bg-[#16A34A] text-white hover:bg-[#128A3E]", accentText: "text-[#16A34A]" },
    "Teja": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Mayuri Rickshaw": { heroClass: "bg-gradient-to-br from-[#003316] via-[#001509] to-black", btnClass: "bg-[#00923F] text-white hover:bg-[#007C35]", accentText: "text-[#00923F]" },
    "Dilli Electric": { heroClass: "bg-gradient-to-br from-[#00223D] via-[#000E1A] to-black", btnClass: "bg-[#0062AF] text-white hover:bg-[#005394]", accentText: "text-[#0062AF]" },
    "YOUDHA": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Ceeon India": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "Biliti Electric": { heroClass: "bg-gradient-to-br from-[#05402D] via-[#021B13] to-black", btnClass: "bg-[#10B981] text-black hover:bg-[#0D9D6D]", accentText: "text-[#10B981]" },
    "OSM": { heroClass: "bg-gradient-to-br from-[#004253] via-[#001C23] to-black", btnClass: "bg-[#00BEEE] text-black hover:bg-[#00A1CA]", accentText: "text-[#00BEEE]" },
}

const DEFAULT_THEME = {
    heroClass: "bg-gradient-to-br from-primary/10 via-background to-background",
    btnClass: "bg-primary text-primary-foreground hover:opacity-90",
    accentText: "text-primary",
}

export default function ThreeWheelersHomePage() {
    const params = useParams()
    const slug = params.slug as string
    const prefix = useSitePrefix(slug)

    const [dealer, setDealer] = useState<{ id: string; dealership_name: string; phone: string; location: string } | null>(null)
    const [primaryBrand, setPrimaryBrand] = useState<string | null>(null)
    const [featured, setFeatured] = useState<ThreeWheelerVehicle[]>([])
    const [loading, setLoading] = useState(true)
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

            const res = await fetch(`/api/three-wheelers?dealerId=${dealer.id}&pageSize=6&sortBy=views`)
            const data = await res.json()
            setFeatured(data.vehicles ?? [])
            setLoading(false)
        }
        load()
    }, [slug])

    if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>
    if (!dealer) return <div className="min-h-screen flex items-center justify-center">Dealer not found</div>

    // Fuzzy brand theme lookup — handles DB names like "Bajaj Auto" matching "Bajaj"
    function resolveBrandTheme(brand: string | null) {
        if (!brand) return null
        if (BRAND_THEMES[brand]) return BRAND_THEMES[brand]
        const lower = brand.toLowerCase()
        for (const [key, theme] of Object.entries(BRAND_THEMES)) {
            if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
                return theme
            }
        }
        return null
    }
    const resolved = resolveBrandTheme(primaryBrand)
    const theme = resolved ?? DEFAULT_THEME
    const isDarkHero = !!resolved

    const categories = [
        { label: "Passenger Auto", href: `${prefix}/three-wheelers/passenger`, emoji: "🛺" },
        { label: "Cargo 3W", href: `${prefix}/three-wheelers/cargo`, emoji: "📦" },
        { label: "Electric 3W", href: `${prefix}/three-wheelers/electric`, emoji: "⚡" },
        { label: "Used 3W", href: `${prefix}/three-wheelers/used`, emoji: "🔄" },
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
                        Your trusted 3-Wheeler destination in {dealer.location}
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pt-2">
                        <Link
                            href={`${prefix}/three-wheelers/passenger`}
                            className={`${theme.btnClass} rounded-lg px-5 py-2.5 font-medium transition-colors`}
                        >
                            Browse Autos
                        </Link>
                        <Link
                            href={`${prefix}/three-wheelers/service`}
                            className={`rounded-lg px-5 py-2.5 font-medium transition-colors ${isDarkHero ? "border border-white/30 text-white hover:bg-white/10" : "border border-border hover:bg-muted/50"}`}
                        >
                            Book Service
                        </Link>
                        <Link
                            href={`${prefix}/three-wheelers/emi-calculator`}
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
                            <span className="font-semibold text-center">{c.label}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured */}
            {featured.length > 0 && (
                <section className="max-w-5xl mx-auto px-4 py-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Popular Models</h2>
                        <Link href={`${prefix}/three-wheelers/passenger`} className="text-sm text-primary hover:underline">View all →</Link>
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
                        { icon: "🔧", title: "Expert Service", text: "CNG, electrical, and body work specialists" },
                        { icon: "💳", title: "Fleet Finance", text: "Special rates for fleet buyers" },
                        { icon: "📋", title: "Permit Assistance", text: "Help with route and vehicle permits" },
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
                    <Link href={`${prefix}/three-wheelers/cargo`} className="p-4 border border-border rounded-xl hover:border-primary/40 transition-colors">
                        <p className="font-semibold">📦 Cargo Vehicles</p>
                        <p className="text-sm text-muted-foreground mt-1">Piaggio Ape, Mahindra Alfa & more</p>
                    </Link>
                    <Link href={`${prefix}/three-wheelers/electric`} className="p-4 border border-border rounded-xl hover:border-primary/40 transition-colors">
                        <p className="font-semibold">⚡ Electric 3W</p>
                        <p className="text-sm text-muted-foreground mt-1">Zero emission, low running cost</p>
                    </Link>
                    <Link href={`${prefix}/three-wheelers/emi-calculator`} className="p-4 border border-border rounded-xl hover:border-primary/40 transition-colors">
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

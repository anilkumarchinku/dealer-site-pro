"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { VehicleCard } from "@/components/three-wheelers/VehicleCard"
import { LeadFormModal } from "@/components/three-wheelers/LeadFormModal"
import { WhatsAppButton } from "@/components/ui/WhatsAppButton"
import type { ThreeWheelerVehicle } from "@/lib/types/three-wheeler"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

// ── Brand color themes — keyed by EXACT brand name stored in DB ───────────────
type BrandTheme = { heroClass: string; btnClass: string; accentText: string }

const BRAND_THEMES: Record<string, BrandTheme> = {
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
    "Bajaj Auto": { heroClass: "bg-gradient-to-br from-[#001A3A] via-[#000B19] to-black", btnClass: "bg-[#004DA8] text-white hover:bg-[#00418E]", accentText: "text-[#004DA8]" },
    "Mahindra Last Mile Mobility": { heroClass: "bg-gradient-to-br from-[#4D0B0D] via-[#210505] to-black", btnClass: "bg-[#DE2027] text-white hover:bg-[#BC1B20]", accentText: "text-[#DE2027]" },
    "Piaggio Vehicles": { heroClass: "bg-gradient-to-br from-[#073544] via-[#03161D] to-black", btnClass: "bg-[#1699C3] text-white hover:bg-[#1282A5]", accentText: "text-[#1699C3]" },
    "Piaggio Ape": { heroClass: "bg-gradient-to-br from-[#003087] via-[#001A4D] to-black", btnClass: "bg-[#E31E24] text-white hover:bg-[#C41920]", accentText: "text-red-300" },
    "TVS Motor Company": { heroClass: "bg-gradient-to-br from-[#0C152C] via-[#050913] to-black", btnClass: "bg-[#253C80] text-white hover:bg-[#1F336C]", accentText: "text-[#253C80]" },
    "Altigreen": { heroClass: "bg-gradient-to-br from-[#2B4016] via-[#121B09] to-black", btnClass: "bg-[#7BB841] text-black hover:bg-[#689C37]", accentText: "text-[#7BB841]" },
    "Kinetic Green": { heroClass: "bg-gradient-to-br from-[#2B3E17] via-[#121B0A] to-black", btnClass: "bg-[#7BB343] text-black hover:bg-[#689839]", accentText: "text-[#7BB343]" },
    "Lohia Auto": { heroClass: "bg-gradient-to-br from-[#001F3B] via-[#000D19] to-black", btnClass: "bg-[#005AAA] text-white hover:bg-[#004C90]", accentText: "text-[#005AAA]" },
    "Greaves Mobility": { heroClass: "bg-gradient-to-br from-[#001138] via-[#000818] to-black", btnClass: "bg-[#0033A0] text-white hover:bg-[#002B88]", accentText: "text-[#0033A0]" },
    "Omega Seiki Mobility": { heroClass: "bg-gradient-to-br from-[#004253] via-[#001C23] to-black", btnClass: "bg-[#00BEEE] text-black hover:bg-[#00A1CA]", accentText: "text-[#00BEEE]" },
    "Montra Electric": { heroClass: "bg-gradient-to-br from-[#55270B] via-[#241005] to-black", btnClass: "bg-[#F37021] text-black hover:bg-[#CE5F1C]", accentText: "text-[#F37021]" },
}

const DEFAULT_THEME: BrandTheme = {
    heroClass: "bg-gradient-to-br from-primary/10 via-background to-background",
    btnClass: "bg-primary text-primary-foreground hover:opacity-90",
    accentText: "text-primary",
}

function resolveBrandTheme(brand: string | null): BrandTheme | null {
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

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
    dealerId:     string
    dealerName:   string
    phone:        string
    email:        string | null
    location:     string
    fullAddress:  string | null
    tagline:      string | null
    primaryBrand: string | null
    heroTitle:    string | null
    heroSubtitle: string | null
    logoUrl:      string | null | undefined
    vehicles:     ThreeWheelerVehicle[]
    slug:         string
    workingHours: string | null
    services:     string[] | null
}

export function ThreeWheelerTemplate({
    dealerId, dealerName, phone, email, location, fullAddress,
    tagline, primaryBrand, heroTitle, heroSubtitle, logoUrl,
    vehicles, slug, workingHours, services,
}: Props) {
    const prefix = useSitePrefix(slug)
    const [leadVehicleId, setLeadVehicleId] = useState<string | null>(null)

    const resolved = resolveBrandTheme(primaryBrand)
    const theme = resolved ?? DEFAULT_THEME
    const isDarkHero = !!resolved

    // Hero text — user-entered overrides first, then smart defaults
    const displayTitle    = heroTitle    || dealerName
    const displaySubtitle = heroSubtitle || tagline
        || `Your trusted 3-Wheeler destination in ${location}`

    const categories = [
        { label: "Passenger Auto", href: `${prefix}/three-wheelers/passenger`, emoji: "🛺" },
        { label: "Cargo 3W",       href: `${prefix}/three-wheelers/cargo`,     emoji: "📦" },
        { label: "Electric 3W",    href: `${prefix}/three-wheelers/electric`,  emoji: "⚡" },
        { label: "Used 3W",        href: `${prefix}/three-wheelers/used`,      emoji: "🔄" },
    ]

    return (
        <div className="min-h-screen">

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <section className={`${theme.heroClass} py-16 px-4`}>
                <div className="max-w-5xl mx-auto text-center space-y-4">

                    {/* Logo (if dealer uploaded one) */}
                    {logoUrl && (
                        <div className="flex justify-center mb-2">
                            <Image
                                src={logoUrl}
                                alt={`${dealerName} logo`}
                                width={120}
                                height={60}
                                className="object-contain max-h-14"
                            />
                        </div>
                    )}

                    {/* Authorised brand badge */}
                    {primaryBrand && (
                        <p className={`text-sm font-semibold uppercase tracking-widest ${isDarkHero ? theme.accentText : "text-muted-foreground"}`}>
                            Authorised {primaryBrand} Dealer
                        </p>
                    )}

                    <h1 className={`text-4xl md:text-5xl font-bold ${isDarkHero ? "text-white" : ""}`}>
                        {displayTitle}
                    </h1>

                    <p className={`text-lg ${isDarkHero ? "text-white/70" : "text-muted-foreground"}`}>
                        {displaySubtitle}
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

                    {/* Contact bar */}
                    <div className={`flex flex-wrap justify-center gap-4 pt-1 text-sm ${isDarkHero ? "text-white/60" : "text-muted-foreground"}`}>
                        <a href={`tel:${phone}`} className="flex items-center gap-1.5 hover:underline">
                            <Phone className="w-3.5 h-3.5" /> {phone}
                        </a>
                        {email && (
                            <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:underline">
                                <Mail className="w-3.5 h-3.5" /> {email}
                            </a>
                        )}
                        <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" /> {fullAddress ?? location}
                        </span>
                    </div>
                </div>
            </section>

            {/* ── Shop by Category ──────────────────────────────────────────── */}
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

            {/* ── Popular Models ────────────────────────────────────────────── */}
            {vehicles.length > 0 && (
                <section className="max-w-5xl mx-auto px-4 py-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Popular Models</h2>
                        <Link href={`${prefix}/three-wheelers/passenger`} className="text-sm text-primary hover:underline">
                            View all →
                        </Link>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {vehicles.map(v => (
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

            {/* ── Services strip ────────────────────────────────────────────── */}
            <section className="bg-muted/30 py-10 px-4">
                <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
                    {[
                        { icon: "🔧", title: "Expert Service", text: "CNG, electrical, and body work specialists" },
                        { icon: "💳", title: "Fleet Finance",   text: "Special rates for fleet buyers" },
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

            {/* ── Quick links ───────────────────────────────────────────────── */}
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

            {/* ── Contact & Info ────────────────────────────────────────────── */}
            <section className="bg-muted/20 py-10 px-4">
                <div className="max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Phone */}
                    <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Call Us</p>
                            <a href={`tel:${phone}`} className="font-semibold hover:text-primary transition-colors">{phone}</a>
                        </div>
                    </div>
                    {/* Email */}
                    {email && (
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Email</p>
                                <a href={`mailto:${email}`} className="font-semibold hover:text-primary transition-colors break-all">{email}</a>
                            </div>
                        </div>
                    )}
                    {/* Address */}
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Address</p>
                            <p className="font-semibold">{fullAddress ?? location}</p>
                        </div>
                    </div>
                    {/* Working hours */}
                    {workingHours && (
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Working Hours</p>
                                <p className="font-semibold">{workingHours}</p>
                            </div>
                        </div>
                    )}
                    {/* Services */}
                    {services && services.length > 0 && (
                        <div className="sm:col-span-2">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Services Offered</p>
                            <div className="flex flex-wrap gap-2">
                                {services.map(s => (
                                    <span key={s} className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full capitalize">
                                        {s.replace(/_/g, " ")}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Lead modal */}
            <LeadFormModal
                dealerId={dealerId}
                vehicleId={leadVehicleId ?? undefined}
                leadType="best_price"
                title="Get Best Price"
                isOpen={!!leadVehicleId}
                onClose={() => setLeadVehicleId(null)}
            />

            <WhatsAppButton phone={phone} message={`Hi ${dealerName}, I'm interested in your 3-Wheeler inventory.`} />
        </div>
    )
}

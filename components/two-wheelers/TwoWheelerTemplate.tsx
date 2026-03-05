"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
    Phone, MapPin, Mail, Menu, X, ArrowRight,
    Bike, Zap, RotateCcw, Wrench, CreditCard, ChevronRight,
} from "lucide-react"
import type { TwoWheelerVehicle } from "@/lib/types/two-wheeler"
import { VehicleCard } from "@/components/two-wheelers/VehicleCard"
import { LeadFormModal } from "@/components/two-wheelers/LeadFormModal"
import { WhatsAppButton } from "@/components/ui/WhatsAppButton"
import { getScrapedImageUrls, brandNameToId } from "@/lib/utils/brand-model-images"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

// ── Brand color themes (same palette as ModernTemplate for cars) ──────────────
const BRAND_THEMES: Record<string, { heroGradient: string; accent: string; accentText: string; btnPrimary: string }> = {
    "Royal Enfield": {
        heroGradient: "from-[#3D0000] via-[#1A0000] to-black",
        accent: "#D4A017", accentText: "text-[#D4A017]", btnPrimary: "bg-[#D4A017] text-black hover:bg-[#B8861A]",
    },
    "Hero": {
        heroGradient: "from-[#003087] via-[#001A4D] to-black",
        accent: "#E31E24", accentText: "text-[#E31E24]", btnPrimary: "bg-[#E31E24] text-white hover:bg-[#C41920]",
    },
    "Honda": {
        heroGradient: "from-[#CC0000] via-[#880000] to-black",
        accent: "#ffffff", accentText: "text-red-300", btnPrimary: "bg-white text-[#CC0000] hover:bg-gray-100",
    },
    "TVS": {
        heroGradient: "from-[#1B1B8F] via-[#0D0D5C] to-black",
        accent: "#F7B500", accentText: "text-[#F7B500]", btnPrimary: "bg-[#F7B500] text-black hover:bg-[#D4980A]",
    },
    "Bajaj": {
        heroGradient: "from-[#002FA7] via-[#001A6B] to-black",
        accent: "#FF6600", accentText: "text-orange-400", btnPrimary: "bg-[#FF6600] text-white hover:bg-[#E05500]",
    },
    "Yamaha": {
        heroGradient: "from-[#003087] via-[#001A4D] to-black",
        accent: "#E31E24", accentText: "text-red-300", btnPrimary: "bg-[#E31E24] text-white hover:bg-[#C41920]",
    },
    "Suzuki": {
        heroGradient: "from-[#003087] via-[#001A4D] to-black",
        accent: "#4FC3F7", accentText: "text-sky-300", btnPrimary: "bg-[#4FC3F7] text-black hover:bg-[#3AACDE]",
    },
    "KTM": {
        heroGradient: "from-[#CC5200] via-[#882200] to-black",
        accent: "#FF6600", accentText: "text-orange-400", btnPrimary: "bg-[#FF6600] text-white hover:bg-[#E05500]",
    },
    "Kawasaki": {
        heroGradient: "from-[#005500] via-[#003300] to-black",
        accent: "#66CC00", accentText: "text-green-400", btnPrimary: "bg-[#66CC00] text-black hover:bg-[#55AA00]",
    },
    "Ather": {
        heroGradient: "from-[#0A0A2E] via-[#05050F] to-black",
        accent: "#00D4FF", accentText: "text-cyan-400", btnPrimary: "bg-[#00D4FF] text-black hover:bg-[#00B8DC]",
    },
    "Ola Electric": {
        heroGradient: "from-[#CC0000] via-[#880000] to-black",
        accent: "#ffffff", accentText: "text-red-300", btnPrimary: "bg-black text-white hover:bg-gray-900",
    },
}

const DEFAULT_THEME = {
    heroGradient: "from-gray-900 via-gray-800 to-black",
    accent: "#3B82F6", accentText: "text-blue-400", btnPrimary: "bg-blue-600 text-white hover:bg-blue-700",
}

// ── Types ────────────────────────────────────────────────────────────────────

interface Props {
    dealerId:    string
    dealerName:  string
    phone:       string
    email:       string
    location:    string
    fullAddress: string | null
    primaryBrand: string | null
    vehicles:    TwoWheelerVehicle[]
    slug:        string
}

type FilterTab = "all" | "bike" | "scooter" | "electric"

// ── Helper: first available hero image for a vehicle ─────────────────────────
function getVehicleHeroImage(v: TwoWheelerVehicle): string {
    if (v.images[0]) return v.images[0]
    const [jpg] = getScrapedImageUrls("2w", brandNameToId(v.brand), v.model)
    return jpg
}

// ── Template component ────────────────────────────────────────────────────────

export function TwoWheelerTemplate({
    dealerId, dealerName, phone, email, location, fullAddress,
    primaryBrand, vehicles, slug,
}: Props) {
    const theme = (primaryBrand && BRAND_THEMES[primaryBrand]) ? BRAND_THEMES[primaryBrand] : DEFAULT_THEME
    const prefix = useSitePrefix(slug)

    const [isScrolled,      setIsScrolled]      = useState(false)
    const [mobileMenuOpen,  setMobileMenuOpen]   = useState(false)
    const [activeTab,       setActiveTab]        = useState<FilterTab>("all")
    const [leadVehicleId,   setLeadVehicleId]    = useState<string | null>(null)
    const [leadType,        setLeadType]         = useState<"best_price" | "test_ride">("best_price")
    const [heroVehicleIdx,  setHeroVehicleIdx]   = useState(0)

    // Scroll handler — nav goes solid like ModernTemplate
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 60)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    // Auto-rotate hero vehicle
    useEffect(() => {
        if (vehicles.length === 0) return
        const t = setInterval(() => setHeroVehicleIdx(i => (i + 1) % Math.min(vehicles.length, 3)), 5000)
        return () => clearInterval(t)
    }, [vehicles.length])

    // Filtered vehicles
    const filtered = activeTab === "all"
        ? vehicles
        : activeTab === "electric"
            ? vehicles.filter(v => v.fuel_type === "electric" || v.type === "electric")
            : vehicles.filter(v => v.type === activeTab)

    const tabCounts = {
        all:      vehicles.length,
        bike:     vehicles.filter(v => v.type === "bike").length,
        scooter:  vehicles.filter(v => v.type === "scooter").length,
        electric: vehicles.filter(v => v.fuel_type === "electric" || v.type === "electric").length,
    }

    const navLinks: { label: string; href: string }[] = [
        { label: "Bikes",       href: `${prefix}/two-wheelers/bikes`         },
        { label: "Scooters",    href: `${prefix}/two-wheelers/scooters`      },
        { label: "Electric",    href: `${prefix}/two-wheelers/electric`      },
        { label: "Used",        href: `${prefix}/two-wheelers/used`          },
        { label: "Service",     href: `${prefix}/two-wheelers/service`       },
        { label: "EMI Calc",    href: `${prefix}/two-wheelers/emi-calculator`},
    ]

    const heroVehicle = vehicles[heroVehicleIdx]

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">

            {/* ── Fixed Navigation (ModernTemplate-style) ─────────────────── */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? "bg-white shadow-lg" : "bg-transparent"
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Brand logo + name */}
                        <div className="flex items-center gap-3">
                            <div className="relative w-9 h-9 shrink-0">
                                <Image
                                    src={primaryBrand
                                        ? `/assets/logos/2w/${brandNameToId(primaryBrand)}.png`
                                        : "/favicon.svg"}
                                    alt={primaryBrand ?? dealerName}
                                    fill
                                    className="object-contain"
                                    sizes="36px"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                                />
                            </div>
                            <span className={`text-lg font-bold transition-colors ${isScrolled ? "text-gray-900" : "text-white"}`}>
                                {dealerName}
                            </span>
                        </div>

                        {/* Desktop nav links */}
                        <div className="hidden md:flex items-center gap-5">
                            {navLinks.map(l => (
                                <Link
                                    key={l.label}
                                    href={l.href}
                                    className={`text-sm font-medium transition-colors ${
                                        isScrolled ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white"
                                    }`}
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>

                        {/* Phone + mobile menu */}
                        <div className="flex items-center gap-3">
                            <a
                                href={`tel:${phone}`}
                                className={`hidden md:flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                                    isScrolled ? "text-gray-900" : "text-white"
                                }`}
                            >
                                <Phone className="w-4 h-4" />
                                {phone}
                            </a>
                            <button
                                className={`md:hidden p-2 rounded-lg transition-colors ${
                                    isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
                                }`}
                                onClick={() => setMobileMenuOpen(o => !o)}
                                aria-label="Menu"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t shadow-lg">
                        <div className="px-4 py-3 space-y-1">
                            {navLinks.map(l => (
                                <Link
                                    key={l.label}
                                    href={l.href}
                                    className="block py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {l.label}
                                </Link>
                            ))}
                            <a href={`tel:${phone}`} className="block py-2 px-3 text-sm font-medium text-blue-600">
                                <Phone className="inline w-4 h-4 mr-1" />
                                {phone}
                            </a>
                        </div>
                    </div>
                )}
            </nav>

            {/* ── Hero Section (ModernTemplate-style full-screen) ──────────── */}
            <section className={`relative min-h-screen bg-gradient-to-br ${theme.heroGradient} flex flex-col justify-center overflow-hidden`}>
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
                        backgroundSize: "50px 50px",
                    }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left: text + CTAs */}
                        <div className="space-y-6">
                            {primaryBrand && (
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest ${theme.accentText} border-current/30 bg-white/5`}>
                                    Authorised {primaryBrand} Dealer
                                </div>
                            )}

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                                {dealerName}
                            </h1>

                            <p className="text-lg text-white/70 flex items-center gap-2">
                                <MapPin className="w-5 h-5 shrink-0" />
                                {location}
                            </p>

                            <p className="text-white/60 text-base max-w-md">
                                Your trusted 2-Wheeler destination — bikes, scooters & electric vehicles.
                                {vehicles.length > 0 && ` ${vehicles.length}+ models in stock.`}
                            </p>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <button
                                    onClick={() => { setLeadType("best_price"); setLeadVehicleId("") }}
                                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${theme.btnPrimary}`}
                                >
                                    Get Best Price <ArrowRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => { setLeadType("test_ride"); setLeadVehicleId("") }}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-white/30 text-white hover:bg-white/10 transition-all"
                                >
                                    Book Test Ride
                                </button>
                                <Link
                                    href={`${prefix}/two-wheelers/emi-calculator`}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-white/30 text-white hover:bg-white/10 transition-all"
                                >
                                    EMI Calculator
                                </Link>
                            </div>

                            {/* Quick stats */}
                            <div className="flex flex-wrap gap-6 pt-4 border-t border-white/10">
                                {[
                                    { label: "Models",    value: `${vehicles.length}+`   },
                                    { label: "Brands",    value: `${new Set(vehicles.map(v => v.brand)).size}+` },
                                    { label: "Service",   value: "Expert"                },
                                ].map(s => (
                                    <div key={s.label} className="text-center">
                                        <p className={`text-2xl font-extrabold ${theme.accentText}`}>{s.value}</p>
                                        <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: rotating vehicle showcase */}
                        {heroVehicle && (
                            <div className="relative">
                                <div className="relative bg-white/5 rounded-3xl border border-white/10 overflow-hidden aspect-[4/3]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={getVehicleHeroImage(heroVehicle)}
                                        alt={`${heroVehicle.brand} ${heroVehicle.model}`}
                                        className="w-full h-full object-cover transition-opacity duration-700"
                                    />
                                    {/* Vehicle info overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                        <p className="text-white/70 text-xs uppercase tracking-widest">{heroVehicle.brand}</p>
                                        <p className="text-white font-bold text-xl">{heroVehicle.model}</p>
                                        <p className={`text-lg font-bold mt-1 ${theme.accentText}`}>
                                            ₹{(heroVehicle.ex_showroom_price_paise / 100).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>

                                {/* Thumbnail row */}
                                {vehicles.length > 1 && (
                                    <div className="flex gap-2 mt-3 justify-center">
                                        {vehicles.slice(0, 3).map((v, i) => (
                                            <button
                                                key={v.id}
                                                onClick={() => setHeroVehicleIdx(i)}
                                                className={`w-3 h-3 rounded-full transition-all ${
                                                    i === heroVehicleIdx ? "scale-125" : "bg-white/30 hover:bg-white/50"
                                                }`}
                                                style={i === heroVehicleIdx ? { backgroundColor: theme.accent } : {}}
                                                aria-label={`View ${v.brand} ${v.model}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <ChevronRight className="w-6 h-6 text-white/40 rotate-90" />
                </div>
            </section>

            {/* ── Category tiles ──────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Shop by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Bikes",    emoji: "🏍️", href: `${prefix}/two-wheelers/bikes`,    count: tabCounts.bike     },
                        { label: "Scooters", emoji: "🛵", href: `${prefix}/two-wheelers/scooters`, count: tabCounts.scooter  },
                        { label: "Electric", emoji: "⚡", href: `${prefix}/two-wheelers/electric`, count: tabCounts.electric },
                        { label: "Used",     emoji: "🔄", href: `${prefix}/two-wheelers/used`,     count: null               },
                    ].map(c => (
                        <Link
                            key={c.label}
                            href={c.href}
                            className="group flex flex-col items-center gap-3 p-6 bg-gray-50 border border-gray-200 rounded-2xl hover:border-gray-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
                        >
                            <span className="text-4xl">{c.emoji}</span>
                            <span className="font-semibold text-gray-900">{c.label}</span>
                            {c.count != null && c.count > 0 && (
                                <span className="text-xs text-gray-500">{c.count} models</span>
                            )}
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Inventory Section ────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Our Inventory</h2>
                        <p className="text-gray-500 text-sm mt-1">{vehicles.length} models available</p>
                    </div>

                    {/* Filter tabs */}
                    <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
                        {([
                            { key: "all",      label: `All (${tabCounts.all})`           },
                            { key: "bike",     label: `Bikes (${tabCounts.bike})`        },
                            { key: "scooter",  label: `Scooters (${tabCounts.scooter})`  },
                            { key: "electric", label: `Electric (${tabCounts.electric})` },
                        ] as { key: FilterTab; label: string }[]).map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                                    activeTab === tab.key
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {filtered.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filtered.map(v => (
                            <VehicleCard
                                key={v.id}
                                vehicle={v}
                                slug={slug}
                                onLead={vid => { setLeadType("best_price"); setLeadVehicleId(vid) }}
                                onCompare={undefined}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-lg font-medium">No vehicles in this category yet.</p>
                        <p className="text-sm mt-1">Check back soon or contact us directly.</p>
                    </div>
                )}
            </section>

            {/* ── Services strip (ModernTemplate-style) ───────────────────── */}
            <section className="bg-gray-950 py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold text-white text-center mb-10">Why Buy From Us</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { Icon: Wrench,    title: "Expert Service",    text: "Factory-trained technicians for all 2W brands"         },
                            { Icon: CreditCard, title: "Easy Finance",      text: "EMI starting ₹999/month — HDFC, Bajaj & more"          },
                            { Icon: RotateCcw, title: "Exchange Offer",    text: "Best exchange value for your old bike or scooter"      },
                            { Icon: Zap,       title: "EV Specialists",    text: "Test rides & charging demos for electric models"       },
                        ].map(s => (
                            <div key={s.title} className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: theme.accent + "22" }}>
                                    <s.Icon className="w-6 h-6" style={{ color: theme.accent }} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{s.title}</h3>
                                    <p className="text-sm text-white/50 mt-1">{s.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Contact Section ──────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h2>
                        <p className="text-gray-500 mb-8">Our team is here to help you find the perfect ride.</p>
                        <div className="space-y-4">
                            <a href={`tel:${phone}`} className="flex items-center gap-3 text-gray-700 hover:text-gray-900 group">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                    <Phone className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Call Us</p>
                                    <p className="font-semibold">{phone}</p>
                                </div>
                            </a>
                            <a href={`mailto:${email}`} className="flex items-center gap-3 text-gray-700 hover:text-gray-900 group">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                    <Mail className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Email</p>
                                    <p className="font-semibold">{email}</p>
                                </div>
                            </a>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Address</p>
                                    <p className="font-semibold">{fullAddress ?? location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => { setLeadType("best_price"); setLeadVehicleId("") }}
                            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-semibold text-sm transition-all ${theme.btnPrimary}`}
                        >
                            Get Best Price Quote
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => { setLeadType("test_ride"); setLeadVehicleId("") }}
                            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl font-semibold text-sm bg-gray-900 text-white hover:bg-gray-800 transition-all"
                        >
                            Book a Test Ride
                            <Bike className="w-4 h-4" />
                        </button>
                        <Link
                            href={`${prefix}/two-wheelers/service`}
                            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl font-semibold text-sm border-2 border-gray-200 text-gray-700 hover:border-gray-400 transition-all"
                        >
                            Book Service Appointment
                            <Wrench className="w-4 h-4" />
                        </Link>
                        <Link
                            href={`${prefix}/two-wheelers/emi-calculator`}
                            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl font-semibold text-sm border-2 border-gray-200 text-gray-700 hover:border-gray-400 transition-all"
                        >
                            Calculate EMI
                            <CreditCard className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Footer ───────────────────────────────────────────────────── */}
            <footer className="bg-gray-950 text-gray-400 text-sm py-8 px-4 text-center">
                <p className="font-semibold text-white">{dealerName}</p>
                <p className="mt-1">{location}</p>
                <p className="mt-4 text-gray-600 text-xs">Powered by <span className="text-blue-400 font-semibold">DealerSite Pro</span></p>
            </footer>

            {/* ── WhatsApp floating button ──────────────────────────────────── */}
            <WhatsAppButton phone={phone} message={`Hi ${dealerName}, I'm interested in your 2-Wheeler inventory.`} />

            {/* ── Lead modal ────────────────────────────────────────────────── */}
            <LeadFormModal
                dealerId={dealerId}
                vehicleId={leadVehicleId ?? undefined}
                leadType={leadType}
                title={leadType === "test_ride" ? "Book Test Ride" : "Get Best Price"}
                isOpen={leadVehicleId !== null}
                onClose={() => setLeadVehicleId(null)}
            />
        </div>
    )
}

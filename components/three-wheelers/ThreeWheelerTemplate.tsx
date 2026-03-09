"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    Phone, Mail, MapPin, Clock, Menu, X, ArrowRight,
    ChevronRight, Shield, Star, Award, CheckCircle2, Send,
    MessageSquare, Zap, Package, Users, Wrench, CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { WhatsAppButton } from "@/components/ui/WhatsAppButton"
import { EmiCalculator } from "@/components/ui/EmiCalculator"
import { ReviewsSection } from "@/components/ui/ReviewsSection"
import { VehicleCard } from "@/components/three-wheelers/VehicleCard"
import { LeadFormModal } from "@/components/three-wheelers/LeadFormModal"
import type { ThreeWheelerVehicle } from "@/lib/types/three-wheeler"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

// ── Service label map (reuses the same keys as 4W) ───────────────────────────
const SERVICE_LABELS: Record<string, { label: string; icon: string }> = {
    new_car_sales:        { label: "New 3-Wheelers",      icon: "🛺" },
    used_car_sales:       { label: "Used 3-Wheelers",     icon: "🔄" },
    financing:            { label: "Finance & EMI",       icon: "💰" },
    service_maintenance:  { label: "Service & Repairs",   icon: "🔧" },
    parts_accessories:    { label: "Parts & Accessories", icon: "⚙️" },
    test_drive:           { label: "Test Drive",          icon: "🏎️" },
    insurance:            { label: "Insurance",           icon: "🛡️" },
    extended_warranty:    { label: "Extended Warranty",   icon: "✅" },
    roadside_assistance:  { label: "Roadside Assist",     icon: "🆘" },
    car_exchange:         { label: "Vehicle Exchange",    icon: "🔃" },
}

// ── Brand accent colors for inline styling ────────────────────────────────────
const BRAND_ACCENT: Record<string, string> = {
    "Piaggio":                      "#E31E24",
    "Piaggio Vehicles":             "#1699C3",
    "Piaggio Ape":                  "#E31E24",
    "Mahindra":                     "#CC0000",
    "Mahindra Last Mile Mobility":  "#DE2027",
    "Bajaj":                        "#FF6600",
    "Bajaj Auto":                   "#004DA8",
    "TVS":                          "#F7B500",
    "TVS Motor Company":            "#253C80",
    "Atul Auto":                    "#66CC00",
    "Euler Motors":                 "#00D4FF",
    "Altigreen":                    "#7BB841",
    "Montra Electric":              "#F37021",
    "Omega Seiki Mobility":         "#00BEEE",
    "Kinetic Green":                "#7BB343",
    "Lohia Auto":                   "#005AAA",
    "Greaves Mobility":             "#0033A0",
    "EKA Mobility":                 "#FACC15",
    "Indo Wagen":                   "#16A34A",
    "OSM":                          "#00BEEE",
}

const DEFAULT_ACCENT = "#E31E24"

// ── Brand hero gradients (dark backgrounds) ───────────────────────────────────
const BRAND_HERO: Record<string, string> = {
    "Piaggio":                      "from-[#003087] via-[#001A4D] to-black",
    "Piaggio Vehicles":             "from-[#073544] via-[#03161D] to-black",
    "Piaggio Ape":                  "from-[#003087] via-[#001A4D] to-black",
    "Mahindra":                     "from-[#CC0000] via-[#880000] to-black",
    "Mahindra Last Mile Mobility":  "from-[#4D0B0D] via-[#210505] to-black",
    "Bajaj":                        "from-[#002FA7] via-[#001A6B] to-black",
    "Bajaj Auto":                   "from-[#001A3A] via-[#000B19] to-black",
    "TVS":                          "from-[#1B1B8F] via-[#0D0D5C] to-black",
    "TVS Motor Company":            "from-[#0C152C] via-[#050913] to-black",
    "Atul Auto":                    "from-[#1A4D1A] via-[#0D300D] to-black",
    "Euler Motors":                 "from-[#0A0A2E] via-[#05050F] to-black",
    "Altigreen":                    "from-[#2B4016] via-[#121B09] to-black",
    "Montra Electric":              "from-[#55270B] via-[#241005] to-black",
    "Omega Seiki Mobility":         "from-[#004253] via-[#001C23] to-black",
    "Kinetic Green":                "from-[#2B3E17] via-[#121B0A] to-black",
    "Lohia Auto":                   "from-[#001F3B] via-[#000D19] to-black",
    "Greaves Mobility":             "from-[#001138] via-[#000818] to-black",
    "EKA Mobility":                 "from-[#574707] via-[#261E03] to-black",
    "Indo Wagen":                   "from-[#073919] via-[#03180B] to-black",
    "OSM":                          "from-[#004253] via-[#001C23] to-black",
}

const DEFAULT_HERO_GRADIENT = "from-slate-900 via-slate-800 to-black"

function resolveBrandHero(brand: string | null): string {
    if (!brand) return DEFAULT_HERO_GRADIENT
    if (BRAND_HERO[brand]) return BRAND_HERO[brand]
    const lower = brand.toLowerCase()
    for (const [key, val] of Object.entries(BRAND_HERO)) {
        if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) return val
    }
    return DEFAULT_HERO_GRADIENT
}

function resolveBrandAccent(brand: string | null): string {
    if (!brand) return DEFAULT_ACCENT
    if (BRAND_ACCENT[brand]) return BRAND_ACCENT[brand]
    const lower = brand.toLowerCase()
    for (const [key, val] of Object.entries(BRAND_ACCENT)) {
        if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) return val
    }
    return DEFAULT_ACCENT
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
    const accent = resolveBrandAccent(primaryBrand)
    const heroGradient = resolveBrandHero(primaryBrand)

    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<"home" | "inventory">("home")
    const [leadVehicleId, setLeadVehicleId] = useState<string | null>(null)

    // Contact form state
    const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" })
    const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 50)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const title    = heroTitle    || `${primaryBrand ? `Authorised ${primaryBrand} Dealer` : dealerName}`
    const subtitle = heroSubtitle || tagline || `Your trusted 3-Wheeler destination in ${location}`

    const serviceList = services ?? []
    const featured    = vehicles.slice(0, 6)

    const categories = [
        { label: "Passenger Auto", href: `${prefix}/three-wheelers/passenger`, Icon: Users,   desc: "CNG & petrol autos" },
        { label: "Cargo 3W",       href: `${prefix}/three-wheelers/cargo`,     Icon: Package, desc: "Delivery & goods" },
        { label: "Electric 3W",    href: `${prefix}/three-wheelers/electric`,  Icon: Zap,     desc: "Zero emission" },
        { label: "Used 3W",        href: `${prefix}/three-wheelers/used`,      Icon: Wrench,  desc: "Pre-owned stock" },
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.phone) return
        setFormStatus("sending")
        try {
            const res = await fetch("/api/three-wheelers/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dealer_id: dealerId,
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    message: formData.message,
                    lead_type: "enquiry",
                }),
            })
            setFormStatus(res.ok ? "sent" : "error")
        } catch {
            setFormStatus("error")
        }
    }

    return (
        <div className="min-h-screen bg-white text-gray-900">

            {/* ── Sticky Navbar ─────────────────────────────────────────────── */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-lg shadow-sm" : "bg-transparent"}`}>
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo + Name */}
                        <button onClick={() => setActiveTab("home")} className="flex items-center gap-3">
                            {logoUrl ? (
                                <div className="relative w-10 h-10 shrink-0">
                                    <Image src={logoUrl} alt={dealerName} fill className="object-contain" sizes="40px"
                                        onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
                                </div>
                            ) : null}
                            <span className={`text-lg font-semibold tracking-wide ${isScrolled ? "text-gray-900" : "text-white"}`}>
                                {dealerName}
                            </span>
                        </button>

                        {/* Desktop nav */}
                        <div className="hidden md:flex items-center gap-6">
                            {[
                                { label: "Home",      tab: "home" as const },
                                { label: "Inventory", tab: "inventory" as const },
                            ].map(({ label, tab }) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-sm font-medium transition-colors ${isScrolled ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white"}`}
                                    style={activeTab === tab ? { color: accent } : {}}
                                >
                                    {label}
                                </button>
                            ))}
                            <a
                                href="#contact"
                                className={`text-sm font-medium transition-colors ${isScrolled ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white"}`}
                            >
                                Contact
                            </a>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className={`hidden sm:flex ${isScrolled ? "border-gray-300 text-gray-900 hover:bg-gray-100" : "border-white/40 text-white bg-white/10 hover:bg-white/20"}`}
                                onClick={() => { setActiveTab("home"); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) }}
                            >
                                <MessageSquare className="w-4 h-4 mr-1.5" />
                                Enquire
                            </Button>
                            <Button
                                size="sm"
                                className="text-white"
                                style={{ backgroundColor: accent }}
                                asChild
                            >
                                <a href={`tel:${phone}`}>
                                    <Phone className="w-4 h-4 mr-1.5" />
                                    Call Now
                                </a>
                            </Button>
                            <button
                                className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled ? "text-gray-900 hover:bg-gray-100" : "text-white hover:bg-white/10"}`}
                                onClick={() => setMobileMenuOpen(o => !o)}
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-3 border-t border-white/20 pt-3 space-y-1">
                            {[
                                { label: "Home",      action: () => { setActiveTab("home");      setMobileMenuOpen(false) } },
                                { label: "Inventory", action: () => { setActiveTab("inventory"); setMobileMenuOpen(false) } },
                                { label: "Contact",   action: () => { setMobileMenuOpen(false);  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) } },
                            ].map(({ label, action }) => (
                                <button
                                    key={label}
                                    onClick={action}
                                    className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${isScrolled ? "text-gray-900 hover:bg-gray-100" : "text-white hover:bg-white/10"}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </nav>

            {/* ── HOME TAB ──────────────────────────────────────────────────── */}
            {activeTab === "home" && (
                <>
                    {/* Hero */}
                    <section className={`relative min-h-[90vh] flex items-center bg-gradient-to-br ${heroGradient}`}>
                        {/* Subtle mesh overlay */}
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
                        />

                        <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 text-center">
                            {/* Brand badge */}
                            {primaryBrand && (
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 mb-6">
                                    {logoUrl && (
                                        <div className="relative w-5 h-5">
                                            <Image src={logoUrl} alt={primaryBrand} fill className="object-contain" sizes="20px"
                                                onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
                                        </div>
                                    )}
                                    <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                                        Authorised {primaryBrand} Dealer
                                    </span>
                                </div>
                            )}

                            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
                                {title}
                            </h1>
                            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
                                {subtitle}
                            </p>

                            {/* Contact bar */}
                            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/60 mb-10">
                                <a href={`tel:${phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                                    <Phone className="w-4 h-4" style={{ color: accent }} />
                                    {phone}
                                </a>
                                {email && (
                                    <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                                        <Mail className="w-4 h-4" style={{ color: accent }} />
                                        {email}
                                    </a>
                                )}
                                {(fullAddress || location) && (
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 shrink-0" style={{ color: accent }} />
                                        <span className="max-w-xs text-left">{fullAddress || location}</span>
                                    </span>
                                )}
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <Button
                                    size="lg"
                                    className="text-white font-semibold px-8"
                                    style={{ backgroundColor: accent }}
                                    onClick={() => setActiveTab("inventory")}
                                >
                                    Browse All Vehicles
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white/30 text-white bg-white/10 hover:bg-white/20 font-semibold px-8"
                                    asChild
                                >
                                    <Link href={`${prefix}/three-wheelers/emi-calculator`}>
                                        EMI Calculator
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white/30 text-white bg-white/10 hover:bg-white/20 font-semibold px-8"
                                    asChild
                                >
                                    <Link href={`${prefix}/three-wheelers/service`}>
                                        Book Service
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Bottom fade */}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
                    </section>

                    {/* Categories */}
                    <section className="max-w-7xl mx-auto px-4 py-16">
                        <div className="text-center mb-10">
                            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>
                                What We Offer
                            </span>
                            <h2 className="text-3xl font-bold mt-2 text-gray-900">Shop by Category</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                            {categories.map(({ label, href, Icon, desc }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className="group flex flex-col items-center gap-3 p-6 bg-white border border-gray-200 rounded-2xl hover:border-transparent hover:shadow-xl transition-all duration-300"
                                    style={{ "--accent": accent } as React.CSSProperties}
                                >
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300 group-hover:text-white"
                                        style={{ backgroundColor: `${accent}15`, color: accent }}
                                    >
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-gray-900">{label}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" style={{ color: accent }} />
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Services */}
                    {serviceList.length > 0 && (
                        <section className="bg-gray-50 py-12">
                            <div className="max-w-7xl mx-auto px-4">
                                <div className="text-center mb-8">
                                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>
                                        Our Services
                                    </span>
                                    <h2 className="text-2xl font-bold mt-2 text-gray-900">Everything You Need</h2>
                                </div>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {serviceList.map(svc => {
                                        const meta = SERVICE_LABELS[svc] ?? { label: svc, icon: "🛺" }
                                        return (
                                            <div
                                                key={svc}
                                                className="flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium"
                                                style={{ borderColor: `${accent}60`, color: accent, backgroundColor: `${accent}10` }}
                                            >
                                                <span>{meta.icon}</span>
                                                <span>{meta.label}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Popular Models */}
                    {featured.length > 0 && (
                        <section className="max-w-7xl mx-auto px-4 py-16">
                            <div className="flex items-end justify-between mb-10">
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>
                                        {primaryBrand ? `${primaryBrand} Range` : "Our Stock"}
                                    </span>
                                    <h2 className="text-3xl font-bold mt-2 text-gray-900">Popular Models</h2>
                                </div>
                                <button
                                    onClick={() => setActiveTab("inventory")}
                                    className="text-sm font-medium flex items-center gap-1 hover:underline"
                                    style={{ color: accent }}
                                >
                                    View all <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {featured.map(v => (
                                    <VehicleCard
                                        key={v.id}
                                        vehicle={v}
                                        slug={slug}
                                        onLead={vid => setLeadVehicleId(vid)}
                                    />
                                ))}
                            </div>
                            <div className="text-center mt-10">
                                <Button
                                    variant="outline"
                                    className="border-gray-300 text-gray-900 hover:bg-gray-50 font-medium px-8"
                                    onClick={() => setActiveTab("inventory")}
                                >
                                    View Full Inventory
                                    <ChevronRight className="ml-1 w-4 h-4" />
                                </Button>
                            </div>
                        </section>
                    )}

                    {/* Why Choose Us */}
                    <section className="bg-gray-50 py-16">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="text-center mb-12">
                                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>
                                    Why Us
                                </span>
                                <h2 className="text-3xl font-bold mt-2 text-gray-900">The {dealerName} Difference</h2>
                            </div>
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { Icon: Wrench,   title: "Expert Service",      desc: "Certified technicians for CNG, electric, and all 3-wheeler variants — fast, reliable, and at your doorstep." },
                                    { Icon: CreditCard, title: "Easy Fleet Finance",  desc: "Special EMI rates and fleet packages for aggregators and logistics companies. Get on road faster." },
                                    { Icon: Shield,   title: "Permit Assistance",    desc: "Full support with route permits, registration, and insurance so you can focus on your business." },
                                ].map(({ Icon, title, desc }) => (
                                    <div key={title} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                                            style={{ backgroundColor: `${accent}15`, color: accent }}
                                        >
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-3 text-gray-900">{title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* EMI Calculator */}
                    <section className="max-w-4xl mx-auto px-4 py-16">
                        <div className="text-center mb-10">
                            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>Finance</span>
                            <h2 className="text-3xl font-bold mt-2 text-gray-900">EMI Calculator</h2>
                            <p className="text-gray-500 mt-2">Plan your monthly payments before you visit us</p>
                        </div>
                        <EmiCalculator brandColor={accent} theme="light" />
                    </section>

                    {/* Trust Badges */}
                    <section className="bg-gray-50 py-12">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                {[
                                    { Icon: Award,        stat: "500+",    label: "Vehicles Sold" },
                                    { Icon: Star,         stat: "4.8★",   label: "Customer Rating" },
                                    { Icon: Shield,       stat: "100%",   label: "Genuine Parts" },
                                    { Icon: CheckCircle2, stat: "10+ Yrs", label: "In Business" },
                                ].map(({ Icon, stat, label }) => (
                                    <div key={label} className="flex flex-col items-center gap-2">
                                        <Icon className="w-8 h-8" style={{ color: accent }} />
                                        <p className="text-2xl font-bold text-gray-900">{stat}</p>
                                        <p className="text-sm text-gray-500">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Reviews */}
                    <section className="max-w-7xl mx-auto px-4 py-12">
                        <ReviewsSection dealerId={dealerId} brandColor={accent} variant="light" />
                    </section>

                    {/* Contact Section */}
                    <section id="contact" className="bg-gray-50 py-20">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="grid lg:grid-cols-2 gap-16 items-start">
                                {/* Info column */}
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>Contact Us</span>
                                    <h2 className="text-4xl font-bold mt-3 mb-6 text-gray-900">Get in Touch</h2>
                                    <p className="text-gray-500 mb-8 text-lg">
                                        Our team will call you back with the best price and availability. No spam, just answers.
                                    </p>

                                    <div className="space-y-4 mb-8">
                                        <a href={`tel:${phone}`} className="flex items-center gap-4 group">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}15` }}>
                                                <Phone className="w-5 h-5" style={{ color: accent }} />
                                            </div>
                                            <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{phone}</span>
                                        </a>
                                        {email && (
                                            <a href={`mailto:${email}`} className="flex items-center gap-4 group">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}15` }}>
                                                    <Mail className="w-5 h-5" style={{ color: accent }} />
                                                </div>
                                                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{email}</span>
                                            </a>
                                        )}
                                        {(fullAddress || location) && (
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}15` }}>
                                                    <MapPin className="w-5 h-5" style={{ color: accent }} />
                                                </div>
                                                <span className="text-gray-700">{fullAddress || location}</span>
                                            </div>
                                        )}
                                        {workingHours && (
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}15` }}>
                                                    <Clock className="w-5 h-5" style={{ color: accent }} />
                                                </div>
                                                <span className="text-gray-700">{workingHours}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Google Maps embed */}
                                    {(fullAddress || location) && (
                                        <div className="rounded-2xl overflow-hidden border border-gray-200 h-52">
                                            <iframe
                                                src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress || location)}&output=embed`}
                                                className="w-full h-full"
                                                loading="lazy"
                                                title={`${dealerName} location`}
                                                referrerPolicy="no-referrer-when-downgrade"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Lead form */}
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                                    {formStatus === "sent" ? (
                                        <div className="text-center py-12">
                                            <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: accent }} />
                                            <h3 className="text-2xl font-bold mb-2 text-gray-900">Thank You!</h3>
                                            <p className="text-gray-500">Our team will call you back shortly.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <h3 className="text-xl font-bold text-gray-900 mb-6">Request a Callback</h3>
                                            {[
                                                { label: "Your Name *",    key: "name",    type: "text",  placeholder: "Full name",             required: true },
                                                { label: "Phone *",        key: "phone",   type: "tel",   placeholder: "Your contact number",   required: true },
                                                { label: "Email",          key: "email",   type: "email", placeholder: "your@email.com",        required: false },
                                            ].map(({ label, key, type, placeholder, required }) => (
                                                <div key={key}>
                                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{label}</label>
                                                    <input
                                                        type={type}
                                                        required={required}
                                                        value={(formData as Record<string, string>)[key]}
                                                        onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                                                        placeholder={placeholder}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
                                                        style={{ "--tw-ring-color": `${accent}40` } as React.CSSProperties}
                                                    />
                                                </div>
                                            ))}
                                            <div>
                                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Message</label>
                                                <textarea
                                                    rows={3}
                                                    value={formData.message}
                                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                    placeholder="Which vehicle are you interested in?"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
                                                />
                                            </div>
                                            {formStatus === "error" && (
                                                <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
                                            )}
                                            <Button
                                                type="submit"
                                                disabled={formStatus === "sending"}
                                                className="w-full text-white py-3 font-semibold rounded-xl"
                                                style={{ backgroundColor: accent }}
                                            >
                                                {formStatus === "sending" ? "Sending..." : (
                                                    <>
                                                        <Send className="w-4 h-4 mr-2" />
                                                        Submit Request
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* ── INVENTORY TAB ─────────────────────────────────────────────── */}
            {activeTab === "inventory" && (
                <div className="pt-20 pb-16 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 py-10 border-b border-gray-100 mb-10">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>
                                    {primaryBrand || "All Brands"}
                                </span>
                                <h1 className="text-4xl font-bold mt-1 text-gray-900">
                                    Our Inventory
                                    <span className="ml-3 text-lg font-normal text-gray-400">({vehicles.length} vehicles)</span>
                                </h1>
                            </div>
                            <Button
                                variant="outline"
                                className="border-gray-300 font-medium"
                                onClick={() => setActiveTab("home")}
                            >
                                ← Back to Home
                            </Button>
                        </div>

                        {/* Category filter chips */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            {categories.map(({ label, href }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className="px-4 py-2 rounded-full border text-sm font-medium transition-colors"
                                    style={{ borderColor: `${accent}60`, color: accent, backgroundColor: `${accent}10` }}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>

                        {vehicles.length > 0 ? (
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {vehicles.map(v => (
                                    <VehicleCard
                                        key={v.id}
                                        vehicle={v}
                                        slug={slug}
                                        onLead={vid => setLeadVehicleId(vid)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 text-gray-400">
                                <p className="text-5xl mb-4">🛺</p>
                                <p className="text-xl font-semibold text-gray-600">Stock coming soon</p>
                                <p className="mt-2">Call us to check current availability</p>
                                <Button className="mt-6 text-white" style={{ backgroundColor: accent }} asChild>
                                    <a href={`tel:${phone}`}><Phone className="w-4 h-4 mr-2" />Call {phone}</a>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Footer ────────────────────────────────────────────────────── */}
            <footer className="border-t border-gray-200 bg-gray-50 py-14">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Brand row */}
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                        {logoUrl && (
                            <div className="relative w-12 h-12 shrink-0">
                                <Image src={logoUrl} alt={dealerName} fill className="object-contain" sizes="48px"
                                    onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
                            </div>
                        )}
                        <div>
                            <p className="text-xl font-bold text-gray-900">{dealerName}</p>
                            {tagline && <p className="text-sm text-gray-500">{tagline}</p>}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 text-gray-500 mb-8">
                        {/* Contact */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
                            <div className="space-y-3 text-sm">
                                <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-gray-900">
                                    <Phone className="w-4 h-4 shrink-0" style={{ color: accent }} />
                                    {phone}
                                </a>
                                {email && (
                                    <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-gray-900">
                                        <Mail className="w-4 h-4 shrink-0" style={{ color: accent }} />
                                        {email}
                                    </a>
                                )}
                                {(fullAddress || location) && (
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accent }} />
                                        <span>{fullAddress || location}</span>
                                    </div>
                                )}
                                {workingHours && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 shrink-0" style={{ color: accent }} />
                                        <span>{workingHours}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick links */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
                            <div className="space-y-2 text-sm">
                                <button onClick={() => setActiveTab("home")} className="block hover:text-gray-900">Home</button>
                                <button onClick={() => setActiveTab("inventory")} className="block hover:text-gray-900">Inventory</button>
                                <Link href={`${prefix}/three-wheelers/passenger`} className="block hover:text-gray-900">Passenger Autos</Link>
                                <Link href={`${prefix}/three-wheelers/cargo`} className="block hover:text-gray-900">Cargo Vehicles</Link>
                                <Link href={`${prefix}/three-wheelers/electric`} className="block hover:text-gray-900">Electric 3W</Link>
                                <Link href={`${prefix}/three-wheelers/service`} className="block hover:text-gray-900">Book Service</Link>
                                <Link href={`${prefix}/three-wheelers/emi-calculator`} className="block hover:text-gray-900">EMI Calculator</Link>
                            </div>
                        </div>

                        {/* About */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">{dealerName}</h4>
                            <p className="text-sm leading-relaxed">
                                {primaryBrand
                                    ? `Authorised ${primaryBrand} dealer serving ${location}. Sales, service, parts, and fleet solutions for all your 3-wheeler needs.`
                                    : `Your trusted 3-Wheeler partner in ${location}. Sales, service, and finance under one roof.`
                                }
                            </p>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-400">© {new Date().getFullYear()} {dealerName}. All rights reserved.</p>
                        <a href="https://www.cyepro.com/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                            <div className="relative w-32 h-10">
                                <Image src="/assets/cyepro-logo.png" alt="Cyepro" fill className="object-contain" sizes="128px" />
                            </div>
                        </a>
                    </div>
                </div>
            </footer>

            {/* ── Floating WhatsApp ──────────────────────────────────────────── */}
            <WhatsAppButton phone={phone} />

            {/* ── Lead Modal ────────────────────────────────────────────────── */}
            <LeadFormModal
                dealerId={dealerId}
                vehicleId={leadVehicleId ?? undefined}
                leadType="best_price"
                title="Get Best Price"
                isOpen={!!leadVehicleId}
                onClose={() => setLeadVehicleId(null)}
            />
        </div>
    )
}

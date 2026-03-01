'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet'
import {
    Filter, ChevronLeft, ChevronRight, X, Search,
    Gauge, MapPin, Tag, Car, Building2,
    Zap, Wind, Flame, Heart, Share2,
    GitCompare, MessageCircle, Eye, Clock, IndianRupee,
    CheckCircle2, ChevronDown, ArrowRight,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DealerInfo {
    id: string
    dealership_name: string
    slug: string
    location: string
    logo_url: string | null
    phone: string | null
    whatsapp: string | null
}

interface MarketplaceVehicle {
    id: string
    make: string
    model: string
    variant?: string
    year: number
    price_paise: number
    mileage_km?: number
    color?: string
    transmission?: string
    fuel_type?: string
    body_type?: string
    condition: 'new' | 'used' | 'certified_pre_owned'
    features: string[]
    description?: string
    views: number
    created_at: string
    dealers: DealerInfo
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VEHICLE_CATEGORIES = [
    { id: 'four_wheeler',     label: '4 Wheelers',     icon: '🚗', desc: 'Cars & SUVs' },
    { id: 'two_three_wheeler',label: '2 & 3 Wheelers', icon: '🛵', desc: 'Bikes & Scooters' },
    { id: 'fleet',            label: 'Fleet',          icon: '🚛', desc: 'Trucks & Tempos' },
    { id: 'bus',              label: 'Bus',            icon: '🚌', desc: 'Buses & Coaches' },
]

const FUEL_TOGGLES = [
    { id: '',        label: 'All', icon: null,  color: '' },
    { id: 'Electric',label: 'EV', icon: Zap,   color: 'bg-emerald-500 text-white' },
    { id: 'CNG',     label: 'CNG',icon: Wind,  color: 'bg-cyan-500 text-white' },
    { id: 'non-ev',  label: 'Non', icon: Flame, color: 'bg-orange-500 text-white' },
]

const BUDGET_CHIPS = [
    { label: 'Under ₹3L',  min: 0,          max: 300_000 },
    { label: '₹3-7L',      min: 300_000,     max: 700_000 },
    { label: '₹7-15L',     min: 700_000,     max: 1_500_000 },
    { label: '₹15-30L',    min: 1_500_000,   max: 3_000_000 },
    { label: '₹30L+',      min: 3_000_000,   max: 0 },
]

const BODY_TYPE_CHIPS = [
    { label: 'Hatchback', icon: '🚗' },
    { label: 'Sedan',     icon: '🚘' },
    { label: 'SUV',       icon: '🚙' },
    { label: 'MUV',       icon: '🚐' },
    { label: 'Pickup',    icon: '🛻' },
    { label: 'Luxury',    icon: '✨' },
]

const MAKES = [
    'Maruti Suzuki','Hyundai','Tata','Mahindra','Honda','Toyota',
    'Kia','MG','Volkswagen','Skoda','Renault','Nissan',
    'Ford','Jeep','BMW','Mercedes-Benz','Audi',
    'Hero','Bajaj','TVS','Royal Enfield','Yamaha',
]

const FUEL_TYPES = ['Petrol','Diesel','CNG','Electric','Hybrid','LPG']

const CONDITIONS = [
    { value: 'new',                 label: 'New' },
    { value: 'used',                label: 'Used' },
    { value: 'certified_pre_owned', label: 'Certified Pre-Owned' },
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 15 }, (_, i) => CURRENT_YEAR - i)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(paise: number): string {
    const inr = paise / 100
    if (inr >= 10_000_000) return `₹${(inr / 10_000_000).toFixed(2)} Cr`
    if (inr >= 100_000)    return `₹${(inr / 100_000).toFixed(1)} L`
    return `₹${inr.toLocaleString('en-IN')}`
}

/** Monthly EMI at 9% pa, 5 years, 10% down payment */
function calcEMI(paise: number): string {
    if (paise <= 0) return ''
    const principal = (paise / 100) * 0.9   // 90% financed
    const r = 9 / 100 / 12                   // monthly rate
    const n = 60                              // 60 months
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    if (emi >= 100_000) return `₹${(emi / 100_000).toFixed(1)}L/mo`
    return `₹${Math.round(emi / 100) * 100 < 1000
        ? Math.round(emi).toLocaleString('en-IN')
        : (Math.round(emi / 100) * 100).toLocaleString('en-IN')}/mo`
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86_400_000)
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    if (days < 7)  return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    if (days < 365)return `${Math.floor(days / 30)}mo ago`
    return `${Math.floor(days / 365)}y ago`
}

function conditionLabel(c: string): string {
    if (c === 'new')                 return 'New'
    if (c === 'certified_pre_owned') return 'CPO'
    return 'Used'
}

function conditionColor(c: string): string {
    if (c === 'new')                 return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    if (c === 'certified_pre_owned') return 'bg-blue-100 text-blue-700 border-blue-200'
    return 'bg-amber-100 text-amber-700 border-amber-200'
}

function fuelEmoji(fuel?: string): string {
    if (fuel === 'Electric') return '⚡'
    if (fuel === 'CNG')      return '💨'
    if (fuel === 'Hybrid')   return '🔋'
    if (fuel === 'LPG')      return '🔵'
    return '⛽'
}

function whatsappLink(phone: string, car: string, dealer: string): string {
    const msg = encodeURIComponent(
        `Hi ${dealer}, I'm interested in the ${car}. Please share more details and best price. Thank you.`
    )
    const clean = phone.replace(/\D/g, '')
    const num   = clean.startsWith('91') ? clean : `91${clean}`
    return `https://wa.me/${num}?text=${msg}`
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({
    onSearch, onBudget, onBodyType
}: {
    onSearch: (q: string) => void
    onBudget: (min: number, max: number) => void
    onBodyType: (bt: string) => void
}) {
    const [q, setQ] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (q.trim()) onSearch(q.trim())
    }

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 text-center">
                {/* Pill badge */}
                <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/25 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    India&apos;s Trusted Dealer Marketplace
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-3">
                    Find Your Perfect Ride
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        New &amp; Pre-Owned
                    </span>
                </h1>
                <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-7">
                    Browse vehicles from verified dealers across India — cars, bikes, buses &amp; more.
                </p>

                {/* Search bar */}
                <form
                    onSubmit={handleSubmit}
                    className="max-w-2xl mx-auto flex gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-2 mb-5"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            placeholder="Search make, model or city…"
                            className="w-full pl-9 pr-3 py-2.5 bg-transparent text-white placeholder:text-gray-400 text-sm focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
                    >
                        Search
                    </button>
                </form>

                {/* Budget quick-select — most important for Indian buyers */}
                <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2.5 font-medium tracking-wide uppercase">Shop by Budget</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {BUDGET_CHIPS.map(b => (
                            <button
                                key={b.label}
                                type="button"
                                onClick={() => onBudget(b.min, b.max)}
                                className="text-xs font-semibold bg-white/8 hover:bg-white/15 border border-white/15 hover:border-white/30 text-gray-200 px-3.5 py-1.5 rounded-full transition-all"
                            >
                                <IndianRupee className="w-3 h-3 inline -mt-0.5 mr-0.5" />
                                {b.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Body type chips */}
                <div className="mb-8">
                    <p className="text-xs text-gray-500 mb-2.5 font-medium tracking-wide uppercase">Browse by Type</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {BODY_TYPE_CHIPS.map(bt => (
                            <button
                                key={bt.label}
                                type="button"
                                onClick={() => onBodyType(bt.label)}
                                className="flex items-center gap-1.5 text-xs font-medium bg-white/8 hover:bg-white/15 border border-white/15 hover:border-white/30 text-gray-200 px-3 py-1.5 rounded-full transition-all"
                            >
                                <span>{bt.icon}</span>
                                {bt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                    {[
                        { value: '1,200+', label: 'Vehicles Listed' },
                        { value: '80+',    label: 'Verified Dealers' },
                        { value: '25+',    label: 'Cities Covered' },
                    ].map(s => (
                        <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl py-3 backdrop-blur-sm">
                            <p className="text-xl font-bold text-white">{s.value}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── Sticky Toggle Bar ────────────────────────────────────────────────────────

function ToggleBar({
    category, fuel, condition, transmission,
    onCategoryChange, onFuelChange, onConditionChange, onTransmissionChange,
}: {
    category: string; fuel: string; condition: string; transmission: string
    onCategoryChange: (c: string) => void
    onFuelChange: (f: string) => void
    onConditionChange: (c: string) => void
    onTransmissionChange: (t: string) => void
}) {
    return (
        <div className="bg-white border-b border-gray-200 sticky top-14 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide py-2">

                    {/* Vehicle Category Tabs */}
                    <div className="flex items-center gap-1 shrink-0">
                        {VEHICLE_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => onCategoryChange(cat.id)}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                                    category === cat.id
                                        ? 'bg-gray-900 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <span>{cat.icon}</span> {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* Fuel toggle */}
                        <div className="flex items-center gap-0.5 bg-gray-100 rounded-xl p-1">
                            {FUEL_TOGGLES.map(ft => {
                                const Icon = ft.icon
                                const active = fuel === ft.id
                                return (
                                    <button
                                        key={ft.id}
                                        onClick={() => onFuelChange(ft.id)}
                                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                                            active ? (ft.color || 'bg-white text-gray-900 shadow-sm') : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                    >
                                        {Icon && <Icon className="w-3 h-3" />}
                                        {ft.label}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Transmission toggle */}
                        <div className="flex items-center gap-0.5 bg-gray-100 rounded-xl p-1">
                            {[
                                { v: '',          l: 'All' },
                                { v: 'Manual',    l: 'MT' },
                                { v: 'Automatic', l: 'AT' },
                            ].map(t => (
                                <button
                                    key={t.v}
                                    onClick={() => onTransmissionChange(t.v)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                        transmission === t.v
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    {t.l}
                                </button>
                            ))}
                        </div>

                        {/* Condition toggle */}
                        <div className="flex items-center gap-0.5 bg-gray-100 rounded-xl p-1">
                            {[
                                { v: '',     l: 'All' },
                                { v: 'new',  l: 'New' },
                                { v: 'used', l: 'Used' },
                            ].map(c => (
                                <button
                                    key={c.v}
                                    onClick={() => onConditionChange(c.v)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                        condition === c.v
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    {c.l}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Compare Bar (floats at bottom when cars selected) ────────────────────────

function CompareBar({
    ids, vehicles, onRemove, onClear,
}: {
    ids: string[]
    vehicles: MarketplaceVehicle[]
    onRemove: (id: string) => void
    onClear: () => void
}) {
    if (ids.length === 0) return null
    const selected = vehicles.filter(v => ids.includes(v.id))

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white border-t border-gray-700 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
                <div className="flex items-center gap-2 flex-1 overflow-x-auto">
                    <GitCompare className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-xs font-semibold text-gray-300 shrink-0">Compare ({ids.length}/3)</span>
                    {selected.map(v => (
                        <div key={v.id} className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-2.5 py-1.5 shrink-0">
                            <span className="text-xs font-medium">{v.year} {v.make} {v.model}</span>
                            <button onClick={() => onRemove(v.id)} className="text-gray-400 hover:text-white ml-1">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    {ids.length < 3 && (
                        <span className="text-xs text-gray-500 shrink-0">Add {3 - ids.length} more to compare</span>
                    )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {ids.length >= 2 && (
                        <Link
                            href={`/compare?ids=${ids.join(',')}`}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold rounded-xl transition-colors"
                        >
                            Compare Now
                        </Link>
                    )}
                    <button onClick={onClear} className="text-xs text-gray-400 hover:text-white px-3 py-2">
                        Clear
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Vehicle Card ─────────────────────────────────────────────────────────────

function VehicleCard({
    v, saved, onSave, comparing, onCompare, compareDisabled,
}: {
    v: MarketplaceVehicle
    saved: boolean
    onSave: () => void
    comparing: boolean
    onCompare: () => void
    compareDisabled: boolean
}) {
    const dealer   = v.dealers
    const title    = [v.year, v.make, v.model, v.variant].filter(Boolean).join(' ')
    const emi      = calcEMI(v.price_paise)
    const wp       = dealer.whatsapp || dealer.phone
    const waLink   = wp ? whatsappLink(wp, title, dealer.dealership_name) : null

    const shareCard = () => {
        const text = `${title} — ${v.price_paise > 0 ? formatPrice(v.price_paise) : 'Price on Request'} at ${dealer.dealership_name}, ${dealer.location}`
        if (navigator.share) {
            navigator.share({ title, text, url: `/${dealer.slug}` }).catch(() => {})
        } else {
            navigator.clipboard.writeText(window.location.origin + `/${dealer.slug}`).catch(() => {})
        }
    }

    return (
        <div className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col group ${comparing ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-200'}`}>

            {/* Image area */}
            <div className="aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-100 relative flex items-center justify-center overflow-hidden">
                <Car className="w-20 h-20 text-gray-200 group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Top-left: condition badge */}
                <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full border ${conditionColor(v.condition)}`}>
                    {conditionLabel(v.condition)}
                </span>

                {/* Top-right: save + share */}
                <div className="absolute top-2.5 right-2.5 flex gap-1">
                    <button
                        onClick={shareCard}
                        className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-colors"
                        title="Share"
                    >
                        <Share2 className="w-3.5 h-3.5 text-white" />
                    </button>
                    <button
                        onClick={onSave}
                        className={`w-7 h-7 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
                            saved ? 'bg-red-500' : 'bg-black/40 hover:bg-black/60'
                        }`}
                        title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                        <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-white text-white' : 'text-white'}`} />
                    </button>
                </div>

                {/* Bottom-left: mileage */}
                {(v.mileage_km ?? 0) > 0 && (
                    <span className="absolute bottom-3 left-3 text-xs bg-black/60 text-white px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                        <Gauge className="w-3 h-3" /> {v.mileage_km!.toLocaleString('en-IN')} km
                    </span>
                )}

                {/* Bottom-right: fuel */}
                <span className="absolute bottom-3 right-3 text-xs bg-black/50 text-white backdrop-blur-sm px-2 py-1 rounded-full">
                    {fuelEmoji(v.fuel_type)} {v.fuel_type ?? 'Petrol'}
                </span>
            </div>

            <div className="p-4 flex flex-col flex-1">
                {/* Title */}
                <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">{title}</h3>

                {/* Price + EMI */}
                <div className="flex items-baseline justify-between mt-1">
                    <p className="text-lg font-bold text-gray-900">
                        {v.price_paise > 0 ? formatPrice(v.price_paise) : <span className="text-gray-400 text-sm font-medium">On Request</span>}
                    </p>
                    {emi && (
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            ~{emi}
                        </span>
                    )}
                </div>

                {/* Specs pills */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {v.transmission && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" /> {v.transmission}
                        </span>
                    )}
                    {v.body_type && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {v.body_type}
                        </span>
                    )}
                    {v.color && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {v.color}
                        </span>
                    )}
                </div>

                {/* Meta row: views + time + compare */}
                <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {v.views > 0 ? v.views.toLocaleString() : '0'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {timeAgo(v.created_at)}
                        </span>
                    </div>
                    <button
                        onClick={onCompare}
                        disabled={compareDisabled && !comparing}
                        className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full transition-colors ${
                            comparing
                                ? 'bg-blue-500 text-white'
                                : compareDisabled
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-blue-600 hover:bg-blue-50 border border-blue-200'
                        }`}
                        title="Add to compare"
                    >
                        <GitCompare className="w-3 h-3" />
                        {comparing ? 'Added' : 'Compare'}
                    </button>
                </div>

                {/* Dealer info */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-800 truncate">{dealer.dealership_name}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-0.5 truncate">
                            <MapPin className="w-3 h-3 shrink-0" /> {dealer.location}
                        </p>
                    </div>
                </div>

                {/* CTAs */}
                <div className="mt-3 flex gap-2">
                    {waLink ? (
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white transition-colors"
                        >
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                        </a>
                    ) : (
                        <Link
                            href={`/${dealer.slug}`}
                            className="flex-1 text-center text-xs font-medium py-2 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700"
                        >
                            View Dealer
                        </Link>
                    )}
                    <Link
                        href={`/${dealer.slug}?car=${v.id}`}
                        className="flex-1 text-center text-xs font-semibold py-2 px-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                    >
                        Enquire Now
                    </Link>
                </div>

                {/* EMI tooltip */}
                {emi && (
                    <p className="mt-1.5 text-center text-[10px] text-gray-400">
                        *EMI est. at 9% p.a. · 10% down · 5 yrs
                    </p>
                )}
            </div>
        </div>
    )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function VehicleCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
            <div className="aspect-[16/10] bg-gray-100" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="flex justify-between">
                    <div className="h-6 bg-gray-100 rounded w-1/3" />
                    <div className="h-5 bg-blue-50 rounded-full w-20" />
                </div>
                <div className="flex gap-2">
                    <div className="h-5 bg-gray-100 rounded-full w-16" />
                    <div className="h-5 bg-gray-100 rounded-full w-12" />
                </div>
                <div className="h-px bg-gray-100 mt-2" />
                <div className="flex gap-2 pt-1">
                    <div className="h-8 bg-emerald-50 rounded-xl flex-1" />
                    <div className="h-8 bg-blue-50 rounded-xl flex-1" />
                </div>
            </div>
        </div>
    )
}

// ─── Saved Cars Section ───────────────────────────────────────────────────────

function SavedSection({
    ids, vehicles, onUnsave,
}: {
    ids: string[]; vehicles: MarketplaceVehicle[]; onUnsave: (id: string) => void
}) {
    const saved = vehicles.filter(v => ids.includes(v.id))
    if (saved.length === 0) return null
    return (
        <div className="mb-6 bg-red-50 border border-red-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" /> Saved ({saved.length})
                </h3>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {saved.map(v => (
                    <div key={v.id} className="shrink-0 bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-2 min-w-[200px]">
                        <Car className="w-8 h-8 text-gray-300 shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-gray-900 truncate">{v.year} {v.make} {v.model}</p>
                            <p className="text-xs text-blue-600 font-bold">{formatPrice(v.price_paise)}</p>
                        </div>
                        <button onClick={() => onUnsave(v.id)} className="text-gray-300 hover:text-red-400 transition-colors shrink-0">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────

function FilterPanel({ sp, onApply }: { sp: URLSearchParams; onApply: (p: URLSearchParams) => void }) {
    const [make,       setMake]       = useState(sp.get('make')         ?? '')
    const [fuel,       setFuel]       = useState(sp.get('fuel_type')    ?? '')
    const [condition,  setCondition]  = useState(sp.get('condition')    ?? '')
    const [city,       setCity]       = useState(sp.get('city')         ?? '')
    const [minPrice,   setMinPrice]   = useState(sp.get('minPrice')     ?? '')
    const [maxPrice,   setMaxPrice]   = useState(sp.get('maxPrice')     ?? '')
    const [yearFrom,   setYearFrom]   = useState(sp.get('year_from')    ?? '')
    const [yearTo,     setYearTo]     = useState(sp.get('year_to')      ?? '')
    const [bodyType,   setBodyType]   = useState(sp.get('body_type')    ?? '')
    const [transmission, setTransmission] = useState(sp.get('transmission') ?? '')

    const apply = () => {
        const p = new URLSearchParams()
        if (sp.get('category'))    p.set('category',    sp.get('category')!)
        if (make)        p.set('make',         make)
        if (fuel)        p.set('fuel_type',    fuel)
        if (condition)   p.set('condition',    condition)
        if (city)        p.set('city',         city)
        if (minPrice)    p.set('minPrice',     minPrice)
        if (maxPrice)    p.set('maxPrice',     maxPrice)
        if (yearFrom)    p.set('year_from',    yearFrom)
        if (yearTo)      p.set('year_to',      yearTo)
        if (bodyType)    p.set('body_type',    bodyType)
        if (transmission)p.set('transmission', transmission)
        p.set('page', '1')
        onApply(p)
    }

    const reset = () => {
        setMake(''); setFuel(''); setCondition(''); setCity('')
        setMinPrice(''); setMaxPrice(''); setYearFrom(''); setYearTo('')
        setBodyType(''); setTransmission('')
        const p = new URLSearchParams()
        if (sp.get('category')) p.set('category', sp.get('category')!)
        p.set('page', '1')
        onApply(p)
    }

    return (
        <div className="space-y-5 text-sm">
            {/* Brand */}
            <div>
                <label className="font-semibold text-gray-800 block mb-2">Brand / Make</label>
                <select
                    value={make}
                    onChange={e => setMake(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-400"
                >
                    <option value="">All Brands</option>
                    {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>

            {/* Body Type */}
            <div>
                <label className="font-semibold text-gray-800 block mb-2">Body Type</label>
                <div className="flex flex-wrap gap-1.5">
                    {BODY_TYPE_CHIPS.map(bt => (
                        <button
                            key={bt.label}
                            onClick={() => setBodyType(bodyType === bt.label ? '' : bt.label)}
                            className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${
                                bodyType === bt.label
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                            }`}
                        >
                            {bt.icon} {bt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Budget */}
            <div>
                <label className="font-semibold text-gray-800 block mb-2">Budget (₹)</label>
                <div className="flex flex-col gap-1.5 mb-2">
                    {BUDGET_CHIPS.map(b => (
                        <button
                            key={b.label}
                            onClick={() => {
                                setMinPrice(b.min > 0 ? String(b.min) : '')
                                setMaxPrice(b.max > 0 ? String(b.max) : '')
                            }}
                            className={`text-left px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                                minPrice === String(b.min) && maxPrice === String(b.max)
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                            }`}
                        >
                            {b.label}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Min ₹" className="h-8 text-xs rounded-xl" />
                    <Input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Max ₹" className="h-8 text-xs rounded-xl" />
                </div>
            </div>

            {/* Year range */}
            <div>
                <label className="font-semibold text-gray-800 block mb-2">Year Range</label>
                <div className="flex gap-2">
                    <select
                        value={yearFrom}
                        onChange={e => setYearFrom(e.target.value)}
                        className="flex-1 px-2 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-blue-400"
                    >
                        <option value="">From</option>
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select
                        value={yearTo}
                        onChange={e => setYearTo(e.target.value)}
                        className="flex-1 px-2 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-blue-400"
                    >
                        <option value="">To</option>
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>

            {/* Fuel */}
            <div>
                <label className="font-semibold text-gray-800 block mb-2">Fuel Type</label>
                <div className="flex flex-wrap gap-1.5">
                    {FUEL_TYPES.map(f => (
                        <button
                            key={f}
                            onClick={() => setFuel(fuel === f ? '' : f)}
                            className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${
                                fuel === f
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                            }`}
                        >
                            {fuelEmoji(f)} {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transmission */}
            <div>
                <label className="font-semibold text-gray-800 block mb-2">Transmission</label>
                <div className="flex gap-2">
                    {['Manual','Automatic'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTransmission(transmission === t ? '' : t)}
                            className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                                transmission === t
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Condition */}
            <div>
                <label className="font-semibold text-gray-800 block mb-2">Condition</label>
                <div className="flex flex-col gap-1.5">
                    {CONDITIONS.map(c => (
                        <label key={c.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="condition"
                                checked={condition === c.value}
                                onChange={() => setCondition(condition === c.value ? '' : c.value)}
                                className="accent-blue-600"
                            />
                            <span className="text-gray-700 text-xs">{c.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* City */}
            <div>
                <label className="font-semibold text-gray-800 block mb-2">City</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <Input
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="e.g. Mumbai, Delhi"
                        className="h-9 text-sm rounded-xl pl-8"
                    />
                </div>
            </div>

            <div className="flex gap-2 pt-1">
                <Button onClick={apply} className="flex-1 h-9 text-sm rounded-xl bg-blue-600 hover:bg-blue-500">Apply</Button>
                <Button onClick={reset} variant="outline" className="h-9 text-sm px-3 rounded-xl">Reset</Button>
            </div>
        </div>
    )
}

// ─── Main Content ─────────────────────────────────────────────────────────────

function MarketplaceContent() {
    const router       = useRouter()
    const searchParams = useSearchParams()
    const [vehicles,    setVehicles]    = useState<MarketplaceVehicle[]>([])
    const [loading,     setLoading]     = useState(true)
    const [total,       setTotal]       = useState(0)
    const [totalPages,  setTotalPages]  = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [savedIds,    setSavedIds]    = useState<string[]>([])
    const [compareIds,  setCompareIds]  = useState<string[]>([])

    // Load wishlist from localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem('marketplace_saved')
            if (raw) setSavedIds(JSON.parse(raw))
        } catch {}
    }, [])

    const category     = searchParams.get('category')     ?? 'four_wheeler'
    const activeFuel   = searchParams.get('fuel_type')    ?? ''
    const condition    = searchParams.get('condition')    ?? ''
    const transmission = searchParams.get('transmission') ?? ''
    const sortBy       = searchParams.get('sortBy')       ?? 'newest'

    const navigate = useCallback((params: URLSearchParams) => {
        router.push(`/marketplace?${params.toString()}`)
    }, [router])

    const updateParam = (key: string, value: string) => {
        const p = new URLSearchParams(searchParams.toString())
        if (value) p.set(key, value) else p.delete(key)
        p.set('page', '1')
        navigate(p)
    }

    // Wishlist
    const toggleSave = (id: string) => {
        setSavedIds(prev => {
            const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
            try { localStorage.setItem('marketplace_saved', JSON.stringify(next)) } catch {}
            return next
        })
    }

    // Compare
    const toggleCompare = (id: string) => {
        setCompareIds(prev => {
            if (prev.includes(id)) return prev.filter(x => x !== id)
            if (prev.length >= 3) return prev
            return [...prev, id]
        })
    }

    const fetchVehicles = useCallback(async () => {
        setLoading(true)
        try {
            const apiParams = new URLSearchParams(searchParams.toString())
            if (apiParams.get('fuel_type') === 'non-ev') {
                apiParams.delete('fuel_type')
                apiParams.set('exclude_fuel', 'Electric,CNG,Hybrid')
            }
            const res  = await fetch(`/api/marketplace?${apiParams.toString()}`)
            const data = await res.json()
            if (data.success) {
                setVehicles(data.data.vehicles)
                setTotal(data.data.total)
                setTotalPages(data.data.totalPages)
                setCurrentPage(data.data.page)
            }
        } catch (err) {
            console.error('[Marketplace]', err)
        } finally {
            setLoading(false)
        }
    }, [searchParams])

    useEffect(() => { fetchVehicles() }, [fetchVehicles])

    const handlePageChange = (page: number) => {
        const p = new URLSearchParams(searchParams.toString())
        p.set('page', page.toString())
        navigate(p)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Build active chips for display
    const chips: { label: string; paramKey: string }[] = []
    const makePar  = searchParams.get('make');         if (makePar)     chips.push({ label: `🚗 ${makePar}`, paramKey: 'make' })
    const btPar    = searchParams.get('body_type');    if (btPar)       chips.push({ label: btPar,           paramKey: 'body_type' })
    const fuelPar  = searchParams.get('fuel_type');    if (fuelPar && fuelPar !== 'non-ev') chips.push({ label: `${fuelEmoji(fuelPar)} ${fuelPar}`, paramKey: 'fuel_type' })
    if (fuelPar === 'non-ev')                          chips.push({ label: '⛽ Non-EV', paramKey: 'fuel_type' })
    const condPar  = searchParams.get('condition');    if (condPar)     chips.push({ label: CONDITIONS.find(c=>c.value===condPar)?.label ?? condPar, paramKey: 'condition' })
    const transPar = searchParams.get('transmission'); if (transPar)    chips.push({ label: transPar, paramKey: 'transmission' })
    const cityPar  = searchParams.get('city');         if (cityPar)     chips.push({ label: `📍 ${cityPar}`, paramKey: 'city' })
    const yfPar    = searchParams.get('year_from');    const ytPar = searchParams.get('year_to')
    if (yfPar || ytPar) chips.push({ label: `${yfPar ?? '...'} – ${ytPar ?? 'now'}`, paramKey: '__year' })
    const minP     = searchParams.get('minPrice');     const maxP = searchParams.get('maxPrice')
    if (minP || maxP) chips.push({ label: `₹${minP ? Number(minP)/100000+'L' : '0'} – ₹${maxP ? Number(maxP)/100000+'L' : '∞'}`, paramKey: '__price' })

    const removeChip = (paramKey: string) => {
        const p = new URLSearchParams(searchParams.toString())
        if (paramKey === '__price') { p.delete('minPrice'); p.delete('maxPrice') }
        else if (paramKey === '__year') { p.delete('year_from'); p.delete('year_to') }
        else p.delete(paramKey)
        p.set('page', '1')
        navigate(p)
    }

    const clearAll = () => navigate(new URLSearchParams({ category, page: '1' }))

    const activeCat = VEHICLE_CATEGORIES.find(c => c.id === category)

    return (
        <>
            {/* Hero */}
            <HeroSection
                onSearch={q => updateParam('make', q)}
                onBudget={(min, max) => {
                    const p = new URLSearchParams(searchParams.toString())
                    if (min > 0) p.set('minPrice', String(min)) else p.delete('minPrice')
                    if (max > 0) p.set('maxPrice', String(max)) else p.delete('maxPrice')
                    p.set('page', '1')
                    navigate(p)
                }}
                onBodyType={bt => updateParam('body_type', bt)}
            />

            {/* Sticky Toggle Bar */}
            <ToggleBar
                category={category}
                fuel={activeFuel}
                condition={condition}
                transmission={transmission}
                onCategoryChange={c => {
                    const p = new URLSearchParams()
                    p.set('category', c)
                    p.set('page', '1')
                    navigate(p)
                }}
                onFuelChange={f => updateParam('fuel_type', f)}
                onConditionChange={c => updateParam('condition', c)}
                onTransmissionChange={t => updateParam('transmission', t)}
            />

            {/* Body */}
            <div className="bg-gray-50 min-h-screen pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Saved cars */}
                    <SavedSection ids={savedIds} vehicles={vehicles} onUnsave={toggleSave} />

                    {/* Section heading */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <span>{activeCat?.icon}</span> {activeCat?.label}
                            </h2>
                            {!loading && (
                                <p className="text-sm text-gray-500 mt-0.5">
                                    <span className="font-semibold text-gray-800">{total.toLocaleString()}</span> vehicles found
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Sidebar */}
                        <div className="hidden lg:block w-60 flex-shrink-0">
                            <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl p-5 max-h-[80vh] overflow-y-auto">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Filter className="w-4 h-4" /> Filters
                                </h3>
                                <FilterPanel sp={searchParams} onApply={navigate} />
                            </div>
                        </div>

                        {/* Main */}
                        <div className="flex-1 min-w-0">
                            {/* Toolbar */}
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant="outline" size="sm" className="lg:hidden relative rounded-xl">
                                                <Filter className="w-4 h-4 mr-1.5" /> Filters
                                                {chips.length > 0 && (
                                                    <Badge variant="default" className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[9px]">
                                                        {chips.length}
                                                    </Badge>
                                                )}
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side="left" className="w-80 overflow-y-auto">
                                            <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                                            <div className="mt-4">
                                                <FilterPanel sp={searchParams} onApply={p => { navigate(p) }} />
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </div>

                                <Select value={sortBy} onValueChange={v => {
                                    const p = new URLSearchParams(searchParams.toString())
                                    p.set('sortBy', v); p.set('page', '1'); navigate(p)
                                }}>
                                    <SelectTrigger className="w-44 h-9 text-sm rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest First</SelectItem>
                                        <SelectItem value="price_low">Price: Low → High</SelectItem>
                                        <SelectItem value="price_high">Price: High → Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Active chips */}
                            {chips.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {chips.map(chip => (
                                        <Badge key={chip.paramKey} variant="secondary" className="gap-1 pl-2.5 pr-1 py-1 text-xs rounded-full">
                                            {chip.label}
                                            <button onClick={() => removeChip(chip.paramKey)} className="ml-0.5 p-0.5 rounded-full hover:bg-foreground/10">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                    <button onClick={clearAll} className="text-xs text-red-500 hover:underline font-medium ml-1">
                                        Clear all
                                    </button>
                                </div>
                            )}

                            {/* Grid */}
                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {Array.from({ length: 9 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
                                </div>
                            ) : vehicles.length === 0 ? (
                                <div className="text-center py-24">
                                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                        <Car className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <p className="font-semibold text-gray-700 text-lg">No vehicles found</p>
                                    <p className="text-sm mt-1 text-gray-400 max-w-xs mx-auto">
                                        Try adjusting your filters, switching category, or expanding your budget range.
                                    </p>
                                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                                        <button onClick={clearAll} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-500 transition-colors">
                                            Clear All Filters
                                        </button>
                                        {condition && (
                                            <button onClick={() => updateParam('condition', '')} className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                                                Remove Condition Filter
                                            </button>
                                        )}
                                        {activeFuel && (
                                            <button onClick={() => updateParam('fuel_type', '')} className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                                                Remove Fuel Filter
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {vehicles.map(v => (
                                        <VehicleCard
                                            key={v.id}
                                            v={v}
                                            saved={savedIds.includes(v.id)}
                                            onSave={() => toggleSave(v.id)}
                                            comparing={compareIds.includes(v.id)}
                                            onCompare={() => toggleCompare(v.id)}
                                            compareDisabled={compareIds.length >= 3}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && !loading && (
                                <div className="flex items-center justify-center gap-2 mt-10">
                                    <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1} className="rounded-xl">
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4))
                                        return start + i
                                    }).map(page => (
                                        <Button key={page} size="sm" variant={currentPage === page ? 'default' : 'outline'} className="w-9 rounded-xl" onClick={() => handlePageChange(page)}>
                                            {page}
                                        </Button>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="rounded-xl">
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                    <span className="text-xs text-gray-400 ml-2">Page {currentPage} of {totalPages}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Compare bar */}
            <CompareBar
                ids={compareIds}
                vehicles={vehicles}
                onRemove={id => setCompareIds(prev => prev.filter(x => x !== id))}
                onClear={() => setCompareIds([])}
            />
        </>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
    return (
        <>
            <SiteHeader />
            <Suspense fallback={
                <div className="bg-gray-50 min-h-screen p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 max-w-5xl mx-auto">
                        {Array.from({ length: 9 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
                    </div>
                </div>
            }>
                <MarketplaceContent />
            </Suspense>
            <SiteFooter />
        </>
    )
}

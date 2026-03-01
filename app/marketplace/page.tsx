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
    Fuel, Gauge, MapPin, Tag, Car, Building2,
    Zap, Wind, Flame,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DealerInfo {
    id: string
    dealership_name: string
    slug: string
    location: string
    logo_url: string | null
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
    condition: 'new' | 'used' | 'certified_pre_owned'
    features: string[]
    description?: string
    views: number
    created_at: string
    dealers: DealerInfo
}

// ─── Vehicle Category Config ──────────────────────────────────────────────────

const VEHICLE_CATEGORIES = [
    { id: 'four_wheeler', label: '4 Wheelers', icon: '🚗', desc: 'Cars & SUVs' },
    { id: 'two_three_wheeler', label: '2 & 3 Wheelers', icon: '🛵', desc: 'Bikes & Scooters' },
    { id: 'fleet', label: 'Fleet', icon: '🚛', desc: 'Trucks & Tempos' },
    { id: 'bus', label: 'Bus', icon: '🚌', desc: 'Buses & Coaches' },
]

const FUEL_TOGGLES = [
    { id: '',         label: 'All',  icon: null },
    { id: 'Electric', label: 'EV',   icon: Zap  },
    { id: 'CNG',      label: 'CNG',  icon: Wind },
    { id: 'non-ev',   label: 'Non',  icon: Flame },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(paise: number): string {
    const inr = paise / 100
    if (inr >= 10_000_000) return `₹${(inr / 10_000_000).toFixed(2)} Cr`
    if (inr >= 100_000)   return `₹${(inr / 100_000).toFixed(1)} L`
    return `₹${inr.toLocaleString('en-IN')}`
}

function conditionLabel(c: string): string {
    if (c === 'new')                return 'New'
    if (c === 'certified_pre_owned') return 'CPO'
    return 'Used'
}

function conditionColor(c: string): string {
    if (c === 'new')                return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    if (c === 'certified_pre_owned') return 'bg-blue-100 text-blue-700 border-blue-200'
    return 'bg-amber-100 text-amber-700 border-amber-200'
}

const MAKES = [
    'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota',
    'Kia', 'MG', 'Volkswagen', 'Skoda', 'Renault', 'Nissan',
    'Ford', 'Jeep', 'BMW', 'Mercedes-Benz', 'Audi', 'Ola Electric', 'Ather',
    'Hero', 'Bajaj', 'TVS', 'Royal Enfield', 'Yamaha', 'Suzuki',
]
const FUEL_TYPES  = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid', 'LPG']
const CONDITIONS  = [
    { value: 'new',                 label: 'New' },
    { value: 'used',                label: 'Used' },
    { value: 'certified_pre_owned', label: 'Certified Pre-Owned' },
]

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection({ onSearch }: { onSearch: (q: string) => void }) {
    const [q, setQ] = useState('')
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (q.trim()) onSearch(q.trim())
    }
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white">
            {/* Decorative blobs */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/25 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    India&apos;s Trusted Dealer Marketplace
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-4">
                    Find Your Perfect Ride<br />
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        New &amp; Pre-Owned
                    </span>
                </h1>

                <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-8">
                    Browse lakhs of vehicles from verified dealers across India — cars, bikes, buses &amp; more.
                </p>

                {/* Search bar */}
                <form
                    onSubmit={handleSubmit}
                    className="max-w-2xl mx-auto flex gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-2"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            placeholder="Search by make, model or city…"
                            className="w-full pl-9 pr-3 py-2.5 bg-white/10 text-white placeholder:text-gray-400 text-sm rounded-xl focus:outline-none focus:bg-white/15 transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
                    >
                        Search
                    </button>
                </form>

                {/* Popular searches */}
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {['Maruti Swift', 'Hyundai Creta', 'Tata Nexon', 'Honda Activa', 'Electric Vehicles'].map(t => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => onSearch(t)}
                            className="text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-colors"
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto">
                    {[
                        { value: '1,200+', label: 'Vehicles' },
                        { value: '80+',    label: 'Verified Dealers' },
                        { value: '25+',    label: 'Cities' },
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

// ─── Vehicle Type + Fuel Toggle Bar ──────────────────────────────────────────

interface ToggleBarProps {
    category: string
    fuel: string
    condition: string
    onCategoryChange: (c: string) => void
    onFuelChange: (f: string) => void
    onConditionChange: (c: string) => void
}

function ToggleBar({ category, fuel, condition, onCategoryChange, onFuelChange, onConditionChange }: ToggleBarProps) {
    return (
        <div className="bg-white border-b border-gray-200 sticky top-14 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">

                    {/* Vehicle Category Tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
                        {VEHICLE_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => onCategoryChange(cat.id)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                                    category === cat.id
                                        ? 'bg-gray-900 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <span className="text-base">{cat.icon}</span>
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Right side: Fuel + Condition toggles */}
                    <div className="flex items-center gap-3 py-2 sm:pl-4">
                        {/* Fuel type mini toggle */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                            {FUEL_TOGGLES.map(ft => {
                                const Icon = ft.icon
                                return (
                                    <button
                                        key={ft.id}
                                        onClick={() => onFuelChange(ft.id)}
                                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                            fuel === ft.id
                                                ? ft.id === 'Electric'
                                                    ? 'bg-green-500 text-white shadow-sm'
                                                    : ft.id === 'CNG'
                                                    ? 'bg-cyan-500 text-white shadow-sm'
                                                    : ft.id === 'non-ev'
                                                    ? 'bg-orange-500 text-white shadow-sm'
                                                    : 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                    >
                                        {Icon && <Icon className="w-3 h-3" />}
                                        {ft.label}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Condition toggle */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                            {[
                                { value: '', label: 'All' },
                                { value: 'new', label: 'New' },
                                { value: 'used', label: 'Used' },
                            ].map(c => (
                                <button
                                    key={c.value}
                                    onClick={() => onConditionChange(c.value)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                        condition === c.value
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Vehicle Card ─────────────────────────────────────────────────────────────

function VehicleCard({ v }: { v: MarketplaceVehicle }) {
    const dealer = v.dealers
    const title  = [v.year, v.make, v.model, v.variant].filter(Boolean).join(' ')

    const fuelIcon =
        v.fuel_type === 'Electric' ? '⚡' :
        v.fuel_type === 'CNG'      ? '💨' :
        v.fuel_type === 'Hybrid'   ? '🔋' : '⛽'

    return (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col group">
            {/* Image area */}
            <div className="aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-100 relative flex items-center justify-center overflow-hidden">
                {/* Placeholder graphic */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <Car className="w-20 h-20 text-gray-200 group-hover:scale-105 transition-transform duration-300" />
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                {/* Badges */}
                <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full border ${conditionColor(v.condition)}`}>
                    {conditionLabel(v.condition)}
                </span>
                <span className="absolute top-3 right-3 text-xs font-medium bg-black/50 text-white backdrop-blur-sm px-2 py-1 rounded-full">
                    {fuelIcon} {v.fuel_type ?? 'Petrol'}
                </span>
                {v.mileage_km !== undefined && v.mileage_km > 0 && (
                    <span className="absolute bottom-3 left-3 text-xs bg-black/60 text-white px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                        <Gauge className="w-3 h-3" />
                        {v.mileage_km.toLocaleString('en-IN')} km
                    </span>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1">
                {/* Title + price */}
                <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">{title}</h3>
                <p className="text-xl font-bold text-gray-900 mt-0.5">
                    {v.price_paise > 0 ? formatPrice(v.price_paise) : <span className="text-gray-400 text-sm font-medium">Price on Request</span>}
                </p>

                {/* Specs pills */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {v.transmission && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" /> {v.transmission}
                        </span>
                    )}
                    {v.color && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {v.color}
                        </span>
                    )}
                </div>

                {/* Dealer info */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-800 truncate">{dealer.dealership_name}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-0.5 truncate">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {dealer.location}
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-3 flex gap-2">
                    <Link
                        href={`/${dealer.slug}`}
                        className="flex-1 text-center text-xs font-medium py-2 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                        View Dealer
                    </Link>
                    <Link
                        href={`/${dealer.slug}?car=${v.id}`}
                        className="flex-1 text-center text-xs font-medium py-2 px-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                    >
                        Enquire Now
                    </Link>
                </div>
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
                <div className="h-6 bg-gray-100 rounded w-1/3" />
                <div className="flex gap-2">
                    <div className="h-5 bg-gray-100 rounded-full w-16" />
                    <div className="h-5 bg-gray-100 rounded-full w-12" />
                </div>
                <div className="h-8 bg-gray-100 rounded mt-4" />
            </div>
        </div>
    )
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

interface FiltersProps {
    sp: URLSearchParams
    onApply: (params: URLSearchParams) => void
}

function FilterPanel({ sp, onApply }: FiltersProps) {
    const [make,      setMake]      = useState(sp.get('make')      ?? '')
    const [fuel,      setFuel]      = useState(sp.get('fuel_type') ?? '')
    const [condition, setCondition] = useState(sp.get('condition') ?? '')
    const [city,      setCity]      = useState(sp.get('city')      ?? '')
    const [minPrice,  setMinPrice]  = useState(sp.get('minPrice')  ?? '')
    const [maxPrice,  setMaxPrice]  = useState(sp.get('maxPrice')  ?? '')

    const apply = () => {
        const p = new URLSearchParams(sp.toString())
        if (make)      p.set('make',      make)      else p.delete('make')
        if (fuel)      p.set('fuel_type', fuel)      else p.delete('fuel_type')
        if (condition) p.set('condition', condition) else p.delete('condition')
        if (city)      p.set('city',      city)      else p.delete('city')
        if (minPrice)  p.set('minPrice',  minPrice)  else p.delete('minPrice')
        if (maxPrice)  p.set('maxPrice',  maxPrice)  else p.delete('maxPrice')
        p.set('page', '1')
        onApply(p)
    }

    const reset = () => {
        setMake(''); setFuel(''); setCondition(''); setCity(''); setMinPrice(''); setMaxPrice('')
        const p = new URLSearchParams()
        if (sp.get('category')) p.set('category', sp.get('category')!)
        p.set('page', '1')
        onApply(p)
    }

    return (
        <div className="space-y-5 text-sm">
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

            <div>
                <label className="font-semibold text-gray-800 block mb-2">Fuel Type</label>
                <div className="flex flex-wrap gap-2">
                    {FUEL_TYPES.map(f => (
                        <button
                            key={f}
                            type="button"
                            onClick={() => setFuel(fuel === f ? '' : f)}
                            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                                fuel === f
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="font-semibold text-gray-800 block mb-2">Condition</label>
                <div className="flex flex-col gap-2">
                    {CONDITIONS.map(c => (
                        <label key={c.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="condition"
                                value={c.value}
                                checked={condition === c.value}
                                onChange={() => setCondition(condition === c.value ? '' : c.value)}
                                className="accent-blue-600"
                            />
                            <span className="text-gray-700">{c.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="font-semibold text-gray-800 block mb-2">City</label>
                <Input
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Mumbai, Delhi"
                    className="h-9 text-sm rounded-xl"
                />
            </div>

            <div>
                <label className="font-semibold text-gray-800 block mb-2">Price Range (₹)</label>
                <div className="flex gap-2">
                    <Input
                        type="number"
                        value={minPrice}
                        onChange={e => setMinPrice(e.target.value)}
                        placeholder="Min"
                        className="h-9 text-sm rounded-xl"
                    />
                    <Input
                        type="number"
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        placeholder="Max"
                        className="h-9 text-sm rounded-xl"
                    />
                </div>
            </div>

            <div className="flex gap-2 pt-2">
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

    const category  = searchParams.get('category')  ?? 'four_wheeler'
    const activeFuel = searchParams.get('fuel_type') ?? ''
    const condition = searchParams.get('condition')  ?? ''
    const sortBy    = searchParams.get('sortBy')     ?? 'newest'

    const navigate = useCallback((params: URLSearchParams) => {
        router.push(`/marketplace?${params.toString()}`)
    }, [router])

    const updateParam = (key: string, value: string) => {
        const p = new URLSearchParams(searchParams.toString())
        if (value) p.set(key, value)
        else p.delete(key)
        p.set('page', '1')
        navigate(p)
    }

    const handleCategoryChange = (c: string) => {
        const p = new URLSearchParams(searchParams.toString())
        p.set('category', c)
        p.set('page', '1')
        navigate(p)
    }

    const handleFuelChange = (f: string) => {
        const p = new URLSearchParams(searchParams.toString())
        if (f) p.set('fuel_type', f)
        else p.delete('fuel_type')
        p.set('page', '1')
        navigate(p)
    }

    const handleConditionChange = (c: string) => {
        const p = new URLSearchParams(searchParams.toString())
        if (c) p.set('condition', c)
        else p.delete('condition')
        p.set('page', '1')
        navigate(p)
    }

    const handleSearch = (q: string) => {
        const p = new URLSearchParams(searchParams.toString())
        p.set('make', q)
        p.set('page', '1')
        navigate(p)
    }

    const fetchVehicles = useCallback(async () => {
        setLoading(true)
        try {
            // Build query — pass category and handle non-EV
            const apiParams = new URLSearchParams(searchParams.toString())

            // For "Non" fuel toggle → exclude EV and CNG
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

    const handleSortChange = (value: string) => {
        const p = new URLSearchParams(searchParams.toString())
        p.set('sortBy', value)
        p.set('page', '1')
        navigate(p)
    }

    const handlePageChange = (page: number) => {
        const p = new URLSearchParams(searchParams.toString())
        p.set('page', page.toString())
        navigate(p)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Active filter chips
    const chips: { label: string; paramKey: string }[] = []
    const makePar  = searchParams.get('make');      if (makePar)      chips.push({ label: `🚗 ${makePar}`,       paramKey: 'make' })
    const fuelPar  = searchParams.get('fuel_type'); if (fuelPar && fuelPar !== 'non-ev') chips.push({ label: `⛽ ${fuelPar}`,  paramKey: 'fuel_type' })
    if (fuelPar === 'non-ev') chips.push({ label: '⛽ Non-EV',   paramKey: 'fuel_type' })
    const condPar  = searchParams.get('condition'); if (condPar)      chips.push({ label: CONDITIONS.find(c=>c.value===condPar)?.label ?? condPar, paramKey: 'condition' })
    const cityPar  = searchParams.get('city');      if (cityPar)      chips.push({ label: `📍 ${cityPar}`,       paramKey: 'city' })
    const minP     = searchParams.get('minPrice');  const maxP = searchParams.get('maxPrice')
    if (minP || maxP) chips.push({ label: `₹${minP ? Number(minP)/100000+'L' : '0'} – ₹${maxP ? Number(maxP)/100000+'L' : '∞'}`, paramKey: '__price' })

    const removeChip = (paramKey: string) => {
        const p = new URLSearchParams(searchParams.toString())
        if (paramKey === '__price') { p.delete('minPrice'); p.delete('maxPrice') }
        else p.delete(paramKey)
        p.set('page', '1')
        navigate(p)
    }

    const activeCat = VEHICLE_CATEGORIES.find(c => c.id === category)

    return (
        <>
            {/* Hero */}
            <HeroSection onSearch={handleSearch} />

            {/* Sticky Toggle Bar */}
            <ToggleBar
                category={category}
                fuel={activeFuel}
                condition={condition}
                onCategoryChange={handleCategoryChange}
                onFuelChange={handleFuelChange}
                onConditionChange={handleConditionChange}
            />

            {/* Page body */}
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Section title */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            {activeCat?.icon} {activeCat?.label}
                            {condition && (
                                <span className="text-sm font-normal text-gray-500">
                                    — {CONDITIONS.find(c => c.value === condition)?.label}
                                </span>
                            )}
                        </h2>
                        {!loading && (
                            <p className="text-sm text-gray-500 mt-1">
                                <span className="font-semibold text-gray-800">{total.toLocaleString()}</span> vehicles available
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Sidebar — desktop */}
                        <div className="hidden lg:block w-60 flex-shrink-0">
                            <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl p-5">
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
                                    {/* Mobile filter */}
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
                                        <SheetContent side="left" className="w-80">
                                            <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                                            <div className="mt-4 overflow-y-auto">
                                                <FilterPanel sp={searchParams} onApply={(p) => { navigate(p) }} />
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </div>

                                <Select value={sortBy} onValueChange={handleSortChange}>
                                    <SelectTrigger className="w-44 h-9 text-sm rounded-xl">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest First</SelectItem>
                                        <SelectItem value="price_low">Price: Low → High</SelectItem>
                                        <SelectItem value="price_high">Price: High → Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Active filter chips */}
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
                                    {chips.length > 1 && (
                                        <button
                                            onClick={() => navigate(new URLSearchParams({ category, page: '1' }))}
                                            className="text-xs text-red-500 hover:underline font-medium ml-1"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Grid */}
                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {Array.from({ length: 9 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
                                </div>
                            ) : vehicles.length === 0 ? (
                                <div className="text-center py-24 text-gray-500">
                                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                        <Car className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <p className="font-semibold text-gray-700 text-lg">No vehicles found</p>
                                    <p className="text-sm mt-1 text-gray-400">Try adjusting your filters or switching category</p>
                                    <Button
                                        variant="outline"
                                        className="mt-5 rounded-xl"
                                        onClick={() => navigate(new URLSearchParams({ category, page: '1' }))}
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {vehicles.map(v => <VehicleCard key={v.id} v={v} />)}
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
                                        <Button
                                            key={page}
                                            size="sm"
                                            variant={currentPage === page ? 'default' : 'outline'}
                                            className="w-9 rounded-xl"
                                            onClick={() => handlePageChange(page)}
                                        >
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
        </>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
    return (
        <>
            <SiteHeader />
            <Suspense fallback={
                <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 max-w-5xl w-full px-4">
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

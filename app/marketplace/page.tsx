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
    Filter, ChevronLeft, ChevronRight, X, Search, BadgeCheck,
    Fuel, Gauge, MapPin, Tag, Car, Building2, Shield,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DealerInfo {
    id: string
    dealership_name: string
    slug: string
    location: string
    is_verified: boolean
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
    view_count: number
    created_at: string
    dealers: DealerInfo
}

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
    if (c === 'new')                return 'bg-emerald-100 text-emerald-700'
    if (c === 'certified_pre_owned') return 'bg-blue-100 text-blue-700'
    return 'bg-amber-100 text-amber-700'
}

const MAKES = [
    'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota',
    'Kia', 'MG', 'Volkswagen', 'Skoda', 'Renault', 'Nissan',
    'Ford', 'Jeep', 'BMW', 'Mercedes-Benz', 'Audi', 'Ola Electric', 'Ather',
]
const FUEL_TYPES  = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid', 'LPG']
const CONDITIONS  = [
    { value: 'new',                 label: 'New' },
    { value: 'used',                label: 'Used' },
    { value: 'certified_pre_owned', label: 'Certified Pre-Owned' },
]

// ─── Vehicle Card ─────────────────────────────────────────────────────────────

function VehicleCard({ v }: { v: MarketplaceVehicle }) {
    const dealer = v.dealers
    const title  = [v.year, v.make, v.model, v.variant].filter(Boolean).join(' ')

    return (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            {/* Image placeholder / hero */}
            <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 relative flex items-center justify-center">
                <Car className="w-16 h-16 text-gray-300" />
                {/* Condition badge */}
                <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${conditionColor(v.condition)}`}>
                    {conditionLabel(v.condition)}
                </span>
                {v.mileage_km !== undefined && v.mileage_km > 0 && (
                    <span className="absolute top-3 right-3 text-xs bg-black/60 text-white px-2 py-1 rounded-full flex items-center gap-1">
                        <Gauge className="w-3 h-3" />
                        {v.mileage_km.toLocaleString('en-IN')} km
                    </span>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1">
                {/* Title + price */}
                <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{title}</h3>
                <p className="text-lg font-bold text-gray-900 mt-1">
                    {v.price_paise > 0 ? formatPrice(v.price_paise) : 'Price on Request'}
                </p>

                {/* Specs row */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                    {v.fuel_type && (
                        <span className="flex items-center gap-1">
                            <Fuel className="w-3 h-3" /> {v.fuel_type}
                        </span>
                    )}
                    {v.transmission && (
                        <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" /> {v.transmission}
                        </span>
                    )}
                    {v.color && (
                        <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full border border-gray-300 bg-gray-400 inline-block" />
                            {v.color}
                        </span>
                    )}
                </div>

                {/* Dealer info */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-800 truncate flex items-center gap-1">
                            {dealer.dealership_name}
                            {dealer.is_verified && (
                                <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            )}
                        </p>
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
                        className="flex-1 text-center text-xs font-medium py-2 px-3 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors"
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
                <div className="h-3 bg-gray-100 rounded w-1/2" />
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
        const p = new URLSearchParams()
        if (make)      p.set('make',      make)
        if (fuel)      p.set('fuel_type', fuel)
        if (condition) p.set('condition', condition)
        if (city)      p.set('city',      city)
        if (minPrice)  p.set('minPrice',  minPrice)
        if (maxPrice)  p.set('maxPrice',  maxPrice)
        p.set('page', '1')
        onApply(p)
    }

    const reset = () => {
        setMake(''); setFuel(''); setCondition(''); setCity(''); setMinPrice(''); setMaxPrice('')
        onApply(new URLSearchParams({ page: '1' }))
    }

    return (
        <div className="space-y-5 text-sm">
            <div>
                <label className="font-medium text-gray-700 block mb-2">Brand / Make</label>
                <select
                    value={make}
                    onChange={e => setMake(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-gray-400"
                >
                    <option value="">All Brands</option>
                    {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>

            <div>
                <label className="font-medium text-gray-700 block mb-2">Fuel Type</label>
                <div className="flex flex-wrap gap-2">
                    {FUEL_TYPES.map(f => (
                        <button
                            key={f}
                            type="button"
                            onClick={() => setFuel(fuel === f ? '' : f)}
                            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
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
                <label className="font-medium text-gray-700 block mb-2">Condition</label>
                <div className="flex flex-col gap-2">
                    {CONDITIONS.map(c => (
                        <label key={c.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="condition"
                                value={c.value}
                                checked={condition === c.value}
                                onChange={() => setCondition(condition === c.value ? '' : c.value)}
                                className="accent-gray-900"
                            />
                            <span className="text-gray-700">{c.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="font-medium text-gray-700 block mb-2">City</label>
                <Input
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Mumbai, Delhi"
                    className="h-9 text-sm"
                />
            </div>

            <div>
                <label className="font-medium text-gray-700 block mb-2">Price Range (₹)</label>
                <div className="flex gap-2">
                    <Input
                        type="number"
                        value={minPrice}
                        onChange={e => setMinPrice(e.target.value)}
                        placeholder="Min"
                        className="h-9 text-sm"
                    />
                    <Input
                        type="number"
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        placeholder="Max"
                        className="h-9 text-sm"
                    />
                </div>
            </div>

            <div className="flex gap-2 pt-2">
                <Button onClick={apply} className="flex-1 h-9 text-sm">Apply Filters</Button>
                <Button onClick={reset} variant="outline" className="h-9 text-sm px-3">Reset</Button>
            </div>
        </div>
    )
}

// ─── Main Content ─────────────────────────────────────────────────────────────

function MarketplaceContent() {
    const router     = useRouter()
    const searchParams = useSearchParams()
    const [vehicles,   setVehicles]   = useState<MarketplaceVehicle[]>([])
    const [loading,    setLoading]    = useState(true)
    const [total,      setTotal]      = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [search,     setSearch]     = useState('')

    const sortBy = searchParams.get('sortBy') ?? 'newest'

    const fetchVehicles = useCallback(async () => {
        setLoading(true)
        try {
            const res  = await fetch(`/api/marketplace?${searchParams.toString()}`)
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

    const navigate = (params: URLSearchParams) => {
        router.push(`?${params.toString()}`)
    }

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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!search.trim()) return
        const p = new URLSearchParams(searchParams.toString())
        p.set('make', search.trim())
        p.set('page', '1')
        navigate(p)
    }

    // Active filter chips
    const chips: { label: string; paramKey: string }[] = []
    const makePar  = searchParams.get('make');      if (makePar)      chips.push({ label: makePar,        paramKey: 'make' })
    const fuelPar  = searchParams.get('fuel_type'); if (fuelPar)      chips.push({ label: fuelPar,        paramKey: 'fuel_type' })
    const condPar  = searchParams.get('condition'); if (condPar)      chips.push({ label: CONDITIONS.find(c=>c.value===condPar)?.label ?? condPar, paramKey: 'condition' })
    const cityPar  = searchParams.get('city');      if (cityPar)      chips.push({ label: `📍 ${cityPar}`, paramKey: 'city' })
    const minP     = searchParams.get('minPrice');  const maxP = searchParams.get('maxPrice')
    if (minP || maxP) chips.push({ label: `₹${minP ? Number(minP)/100000+'L' : '0'} – ₹${maxP ? Number(maxP)/100000+'L' : '∞'}`, paramKey: '__price' })

    const removeChip = (paramKey: string) => {
        const p = new URLSearchParams(searchParams.toString())
        if (paramKey === '__price') { p.delete('minPrice'); p.delete('maxPrice') }
        else p.delete(paramKey)
        p.set('page', '1')
        navigate(p)
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar — desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Filter Cars</h3>
                    <FilterPanel sp={searchParams} onApply={navigate} />
                </div>
            </div>

            {/* Main */}
            <div className="flex-1 min-w-0">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                        {/* Mobile filter */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="lg:hidden relative">
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

                        {!loading && (
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold text-gray-900">{total.toLocaleString()}</span>{' '}
                                cars available
                            </p>
                        )}
                    </div>

                    <Select value={sortBy} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-48 h-9 text-sm">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="price_low">Price: Low to High</SelectItem>
                            <SelectItem value="price_high">Price: High to Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Active filter chips */}
                {chips.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {chips.map(chip => (
                            <Badge key={chip.paramKey} variant="secondary" className="gap-1 pl-2.5 pr-1 py-1 text-xs">
                                {chip.label}
                                <button onClick={() => removeChip(chip.paramKey)} className="ml-0.5 p-0.5 rounded-full hover:bg-foreground/10">
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                        {chips.length > 1 && (
                            <button onClick={() => navigate(new URLSearchParams({ page: '1' }))} className="text-xs text-red-500 hover:underline font-medium ml-1">
                                Clear all
                            </button>
                        )}
                    </div>
                )}

                {/* Quick search bar */}
                <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by brand, e.g. Maruti or Hyundai…"
                            className="pl-9 h-10"
                        />
                    </div>
                    <Button type="submit" size="sm" className="h-10 px-5">Search</Button>
                </form>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {Array.from({ length: 9 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <Car className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="font-medium text-gray-700">No cars found</p>
                        <p className="text-sm mt-1">Try adjusting your filters</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => navigate(new URLSearchParams({ page: '1' }))}
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
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
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
                                className="w-9"
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </Button>
                        ))}
                        <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                        <span className="text-xs text-gray-400 ml-2">Page {currentPage} of {totalPages}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Stats Banner ─────────────────────────────────────────────────────────────

function StatsBanner() {
    return (
        <div className="grid grid-cols-3 gap-4 mb-10">
            {[
                { icon: Car,       label: 'Cars Listed',       value: '1,200+' },
                { icon: Building2, label: 'Verified Dealers',  value: '80+' },
                { icon: Shield,    label: 'Cities Covered',    value: '25+' },
            ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-900">{value}</p>
                        <p className="text-xs text-gray-500">{label}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
    return (
        <>
            <SiteHeader />
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {/* Hero */}
                    <div className="mb-8">
                        <p className="text-sm text-gray-400 mb-1">Home / Marketplace</p>
                        <h1 className="text-3xl font-bold text-gray-900">India&apos;s Dealer Marketplace</h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            Browse real cars for sale from verified dealers across India
                        </p>
                    </div>

                    <StatsBanner />

                    <Suspense fallback={
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:ml-[272px]">
                            {Array.from({ length: 9 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
                        </div>
                    }>
                        <MarketplaceContent />
                    </Suspense>
                </div>
            </div>
            <SiteFooter />
        </>
    )
}

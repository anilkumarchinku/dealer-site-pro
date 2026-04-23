/**
 * Bikes & Scooters Page
 * /app/bikes/page.tsx
 * Client component that shows 2W catalog from tw_catalog via /api/bikes
 */

'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Filter,
    ChevronLeft,
    ChevronRight,
    X,
    Fuel,
    Gauge,
    Zap,
    Bike,
} from 'lucide-react';
import { getVehicleImageUrls, brandNameToId } from '@/lib/utils/brand-model-images';

// ── Types ──────────────────────────────────────────────────────
interface BikeVehicle {
    id: string;
    make: string;
    model: string;
    variant: string | null;
    year: number;
    type: 'bike' | 'scooter' | 'electric';
    fuel_type: 'petrol' | 'electric';
    engine_cc: number | null;
    battery_kwh: number | null;
    mileage_kmpl: number | null;
    range_km: number | null;
    top_speed_kmph: number | null;
    price_min_paise: number;
    image_url: string | null;
    popularity_score: number;
    is_featured: boolean;
}

// ── Brand list — names must match the `make` field from /api/bikes ──
// (v.make from JSON, e.g. "Hero" not "Hero MotoCorp", "BMW" not "BMW Motorrad")
const TRADITIONAL_BRANDS = [
    'Hero', 'Honda', 'TVS', 'Bajaj', 'Royal Enfield',
    'Yamaha', 'Suzuki', 'KTM', 'Kawasaki', 'Triumph',
    'Ducati', 'BMW', 'Harley-Davidson', 'Aprilia', 'Vespa',
    'Husqvarna', 'Jawa', 'Yezdi', 'Benelli',
];

const ELECTRIC_BRANDS = [
    'Ola Electric', 'Ather', 'Bajaj Chetak', 'TVS',
    'Hero Electric', 'Vida', 'Revolt', 'Ampere',
    'Okinawa', 'Tork Motors', 'Ultraviolette', 'Simple Energy',
];

const ALL_BRANDS = [...TRADITIONAL_BRANDS, ...ELECTRIC_BRANDS];

const TYPE_OPTIONS = [
    { value: 'bike', label: 'Bike' },
    { value: 'scooter', label: 'Scooter' },
    { value: 'electric', label: 'Electric' },
];

// Price range constants (in paise)
const PRICE_MIN = 0;
const PRICE_MAX = 5_000_000_00; // 50 lakh in paise
const PRICE_STEP = 10_000_00; // 10k in paise

function formatPricePaise(paise: number): string {
    const inr = paise / 100;
    if (inr >= 10_000_000) return `${(inr / 10_000_000).toFixed(1)} Cr`;
    if (inr >= 100_000) return `${(inr / 100_000).toFixed(1)} L`;
    if (inr >= 1_000) return `${(inr / 1_000).toFixed(0)}K`;
    return `${inr.toFixed(0)}`;
}

function formatPriceDisplay(paise: number): string {
    if (paise <= 0) return 'Price on request';
    const inr = paise / 100;
    return `₹${inr.toLocaleString('en-IN')}`;
}

// ── Skeleton ──────────────────────────────────────────────────
function BikeCardSkeleton() {
    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
            <div className="aspect-[16/10] bg-muted" />
            <div className="p-4 space-y-3">
                <div className="h-3 w-16 bg-muted rounded" />
                <div className="h-5 w-28 bg-muted rounded" />
                <div className="h-6 w-24 bg-muted rounded mt-2" />
                <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="h-10 bg-muted rounded-lg" />
                    <div className="h-10 bg-muted rounded-lg" />
                </div>
            </div>
        </div>
    );
}

// ── Bike Card ──────────────────────────────────────────────────
function BikeCard({ bike }: { bike: BikeVehicle }) {
    const brandId = brandNameToId(bike.make, '2w');
    const imageUrls = getVehicleImageUrls('2w', brandId, bike.model, bike.image_url);
    const [imgIdx, setImgIdx] = useState(0);
    const [imgFailed, setImgFailed] = useState(false);

    function handleImgError() {
        if (imgIdx < imageUrls.length - 1) {
            setImgIdx(imgIdx + 1);
        } else {
            setImgFailed(true);
        }
    }

    const isElectric = bike.fuel_type === 'electric';
    const perfLabel = isElectric ? 'Range' : 'Mileage';
    const perfValue = isElectric && bike.range_km
        ? `${bike.range_km} km`
        : bike.mileage_kmpl
          ? `${bike.mileage_kmpl} kmpl`
          : '--';
    const engineLabel = isElectric ? 'Battery' : 'Engine';
    const engineValue = isElectric
        ? (bike.battery_kwh ? `${bike.battery_kwh} kWh` : '--')
        : (bike.engine_cc ? `${bike.engine_cc} cc` : '--');
    const typeLabel = bike.type.charAt(0).toUpperCase() + bike.type.slice(1);

    const slug = `${bike.make.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${bike.model.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const detailHref = `/bikes/${bike.id ?? slug}`;

    return (
        <Link href={detailHref} className="group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full">
            {/* Image */}
            <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                {!imgFailed && imageUrls.length > 0 ? (
                    <Image
                        src={imageUrls[imgIdx]}
                        alt={`${bike.make} ${bike.model}`}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                        onError={handleImgError}
                        unoptimized
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-700 text-sm">
                        <Bike className="w-10 h-10 text-gray-400" />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                    {isElectric && (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5" /> EV
                        </span>
                    )}
                    {bike.is_featured && (
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                            Popular
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4">
                {/* Brand + Model */}
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-700">
                    {bike.make}
                </p>
                <h3 className="text-base font-bold leading-tight line-clamp-1 text-foreground mt-0.5">
                    {bike.model}
                </h3>
                {bike.variant && (
                    <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">{bike.variant}</p>
                )}

                {/* Price */}
                <div className="mt-2">
                    {bike.price_min_paise > 0 ? (
                        <>
                            <p className="text-lg font-bold text-foreground">
                                {formatPriceDisplay(bike.price_min_paise)}
                            </p>
                            <p className="text-[10px] text-gray-600">Ex-showroom</p>
                        </>
                    ) : (
                        <p className="text-sm font-semibold text-gray-600 italic">Price on request</p>
                    )}
                </div>

                <div className="border-t border-border my-2" />

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-1.5">
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-muted/50">
                        <Fuel className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-600 leading-none">Fuel</p>
                            <p className="text-xs font-semibold text-gray-800 truncate">
                                {isElectric ? 'Electric' : 'Petrol'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-muted/50">
                        <Gauge className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-600 leading-none">{perfLabel}</p>
                            <p className="text-xs font-semibold text-gray-800 truncate">{perfValue}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-muted/50">
                        <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-600 leading-none">{engineLabel}</p>
                            <p className="text-xs font-semibold text-gray-800 truncate">{engineValue}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-muted/50">
                        <Bike className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-600 leading-none">Type</p>
                            <p className="text-xs font-semibold text-gray-800 truncate">{typeLabel}</p>
                        </div>
                    </div>
                </div>

                {/* View Details button */}
                <div className="mt-auto pt-3">
                    <span className="w-full inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold py-2.5 group-hover:opacity-90 transition-opacity">
                        View Details <ChevronRight className="w-4 h-4 ml-1" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

// ── Filter Sidebar ────────────────────────────────────────────
function BikeFilters({
    selectedBrands,
    selectedType,
    priceRange,
    onBrandToggle,
    onTypeChange,
    onPriceChange,
    onClearAll,
}: {
    selectedBrands: string[];
    selectedType: string | null;
    priceRange: [number, number];
    onBrandToggle: (brand: string) => void;
    onTypeChange: (type: string | null) => void;
    onPriceChange: (range: [number, number]) => void;
    onClearAll: () => void;
}) {
    const hasFilters = selectedBrands.length > 0 || selectedType !== null ||
        priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Filters</h3>
                {hasFilters && (
                    <button
                        onClick={onClearAll}
                        className="text-xs text-destructive hover:underline font-medium"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Type Filter */}
            <div>
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                    Vehicle Type
                </h4>
                <div className="space-y-2">
                    {TYPE_OPTIONS.map((opt) => (
                        <label
                            key={opt.value}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <Checkbox
                                checked={selectedType === opt.value}
                                onCheckedChange={() =>
                                    onTypeChange(selectedType === opt.value ? null : opt.value)
                                }
                            />
                            <span className="text-sm text-gray-700 group-hover:text-foreground transition-colors">
                                {opt.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                    Price Range
                </h4>
                <Slider
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={PRICE_STEP}
                    value={priceRange}
                    onValueChange={(val) => onPriceChange(val as [number, number])}
                    className="mb-2"
                />
                <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{formatPricePaise(priceRange[0])}</span>
                    <span>{formatPricePaise(priceRange[1])}</span>
                </div>
            </div>

            {/* Brand Filter */}
            <div>
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                    Brand
                </h4>
                <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
                    {ALL_BRANDS.map((brand) => (
                        <label
                            key={brand}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <Checkbox
                                checked={selectedBrands.includes(brand)}
                                onCheckedChange={() => onBrandToggle(brand)}
                            />
                            <span className="text-sm text-gray-700 group-hover:text-foreground transition-colors">
                                {brand}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Main Content ──────────────────────────────────────────────
function BikesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [bikes, setBikes] = useState<BikeVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Read filters from URL
    const makeParam = searchParams.get('make') || '';
    const typeParam = searchParams.get('type') || '';
    const sortBy = searchParams.get('sortBy') || 'popular';
    const minPriceParam = searchParams.get('minPrice') || '';
    const maxPriceParam = searchParams.get('maxPrice') || '';

    const selectedBrands = makeParam ? makeParam.split(',').filter(Boolean) : [];
    const selectedType = typeParam || null;
    const priceRange: [number, number] = [
        minPriceParam ? parseInt(minPriceParam) : PRICE_MIN,
        maxPriceParam ? parseInt(maxPriceParam) : PRICE_MAX,
    ];

    useEffect(() => {
        const fetchBikes = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (makeParam) params.set('make', makeParam);
                if (typeParam) params.set('type', typeParam);
                if (minPriceParam) params.set('minPrice', minPriceParam);
                if (maxPriceParam) params.set('maxPrice', maxPriceParam);
                params.set('sortBy', sortBy);
                params.set('page', searchParams.get('page') || '1');
                params.set('pageSize', '12');

                const res = await fetch(`/api/bikes?${params.toString()}`);
                const data = await res.json();
                if (data.success) {
                    setBikes(data.data.vehicles);
                    setTotalCount(data.data.total || 0);
                    setCurrentPage(data.data.page || 1);
                    setTotalPages(data.data.totalPages || 1);
                }
            } catch (error) {
                console.error('Failed to fetch bikes', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBikes();
    }, [searchParams, makeParam, typeParam, minPriceParam, maxPriceParam, sortBy]);

    const updateParams = useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());
            for (const [key, value] of Object.entries(updates)) {
                if (value === null || value === '') {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            }
            params.set('page', '1');
            router.push(`?${params.toString()}`);
        },
        [router, searchParams]
    );

    const handleBrandToggle = (brand: string) => {
        const current = selectedBrands.includes(brand)
            ? selectedBrands.filter((b) => b !== brand)
            : [...selectedBrands, brand];
        updateParams({ make: current.length > 0 ? current.join(',') : null });
    };

    const handleTypeChange = (type: string | null) => {
        updateParams({ type });
    };

    const handlePriceChange = (range: [number, number]) => {
        updateParams({
            minPrice: range[0] !== PRICE_MIN ? String(range[0]) : null,
            maxPrice: range[1] !== PRICE_MAX ? String(range[1]) : null,
        });
    };

    const handleSortChange = (value: string) => {
        updateParams({ sortBy: value });
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClearAll = () => {
        router.push('/bikes');
    };

    // Build active filter chips
    const filterChips: { label: string; key: string; value: string }[] = [];
    if (makeParam) {
        selectedBrands.forEach((m) =>
            filterChips.push({ label: m, key: 'make', value: m })
        );
    }
    if (typeParam) {
        filterChips.push({ label: typeParam.charAt(0).toUpperCase() + typeParam.slice(1), key: 'type', value: typeParam });
    }
    if (
        (minPriceParam && minPriceParam !== '0') ||
        (maxPriceParam && maxPriceParam !== String(PRICE_MAX))
    ) {
        filterChips.push({
            label: `Price: ${formatPricePaise(parseInt(minPriceParam || '0'))} - ${formatPricePaise(parseInt(maxPriceParam || String(PRICE_MAX)))}`,
            key: 'price',
            value: 'price',
        });
    }

    const removeFilter = (key: string, value: string) => {
        if (key === 'price') {
            updateParams({ minPrice: null, maxPrice: null });
        } else if (key === 'make') {
            const updated = selectedBrands.filter((b) => b !== value);
            updateParams({ make: updated.length > 0 ? updated.join(',') : null });
        } else if (key === 'type') {
            updateParams({ type: null });
        }
    };

    const activeFilterCount = filterChips.length;

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block w-72 flex-shrink-0">
                <div className="sticky top-8">
                    <BikeFilters
                        selectedBrands={selectedBrands}
                        selectedType={selectedType}
                        priceRange={priceRange}
                        onBrandToggle={handleBrandToggle}
                        onTypeChange={handleTypeChange}
                        onPriceChange={handlePriceChange}
                        onClearAll={handleClearAll}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-3">
                        {/* Mobile filter trigger */}
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="relative">
                                        <Filter className="w-4 h-4 mr-2" /> Filters
                                        {activeFilterCount > 0 && (
                                            <Badge
                                                variant="default"
                                                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                                            >
                                                {activeFilterCount}
                                            </Badge>
                                        )}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-80">
                                    <SheetHeader>
                                        <SheetTitle>Filters</SheetTitle>
                                        <SheetDescription>Refine your search</SheetDescription>
                                    </SheetHeader>
                                    <div className="mt-4 overflow-y-auto max-h-[calc(100vh-120px)]">
                                        <BikeFilters
                                            selectedBrands={selectedBrands}
                                            selectedType={selectedType}
                                            priceRange={priceRange}
                                            onBrandToggle={handleBrandToggle}
                                            onTypeChange={handleTypeChange}
                                            onPriceChange={handlePriceChange}
                                            onClearAll={handleClearAll}
                                        />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Result count */}
                        {!loading && (
                            <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">
                                    {totalCount.toLocaleString()}
                                </span>{' '}
                                Bikes found
                                {filterChips.length > 0 && (
                                    <span className="text-muted-foreground"> matching filters</span>
                                )}
                            </p>
                        )}
                    </div>

                    {/* Sort */}
                    <Select value={sortBy} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="popular">Popular</SelectItem>
                            <SelectItem value="price_low">Price: Low to High</SelectItem>
                            <SelectItem value="price_high">Price: High to Low</SelectItem>
                            <SelectItem value="newest">Newest First</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Active Filter Chips */}
                {filterChips.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        {filterChips.map((chip, idx) => (
                            <Badge
                                key={`${chip.key}-${chip.value}-${idx}`}
                                variant="secondary"
                                className="pl-2.5 pr-1 py-1 text-xs font-medium gap-1 cursor-pointer hover:bg-muted/80 transition-colors"
                            >
                                {chip.label}
                                <button
                                    onClick={() => removeFilter(chip.key, chip.value)}
                                    className="ml-0.5 p-0.5 rounded-full hover:bg-foreground/10"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                        {filterChips.length > 1 && (
                            <button
                                onClick={handleClearAll}
                                className="text-xs text-destructive hover:underline font-medium ml-1"
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                )}

                {/* Bike Grid or Skeleton */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <BikeCardSkeleton key={i} />
                        ))}
                    </div>
                ) : bikes.length === 0 ? (
                    <div className="text-center py-16">
                        <Bike className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-1">No bikes found</h3>
                        <p className="text-sm text-gray-600">
                            Try adjusting your filters or search criteria
                        </p>
                        <Button variant="outline" className="mt-4" onClick={handleClearAll}>
                            Clear Filters
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {bikes.map((bike) => (
                                <BikeCard key={bike.id} bike={bike} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 space-y-4">
                                {currentPage < totalPages && (
                                    <div className="flex justify-center">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="px-8"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        >
                                            Load More Bikes
                                        </Button>
                                    </div>
                                )}

                                <div className="flex items-center justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage <= 1}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>

                                    {(() => {
                                        const pages: number[] = [];
                                        const maxVisible = 5;
                                        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                                        const end = Math.min(totalPages, start + maxVisible - 1);
                                        start = Math.max(1, end - maxVisible + 1);

                                        if (start > 1) {
                                            pages.push(1);
                                            if (start > 2) pages.push(-1);
                                        }
                                        for (let i = start; i <= end; i++) pages.push(i);
                                        if (end < totalPages) {
                                            if (end < totalPages - 1) pages.push(-2);
                                            pages.push(totalPages);
                                        }

                                        return pages.map((page, idx) =>
                                            page < 0 ? (
                                                <span
                                                    key={`ellipsis-${idx}`}
                                                    className="px-1 text-muted-foreground"
                                                >
                                                    ...
                                                </span>
                                            ) : (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => handlePageChange(page)}
                                                    className="w-9"
                                                >
                                                    {page}
                                                </Button>
                                            )
                                        );
                                    })()}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= totalPages}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>

                                    <span className="text-xs text-muted-foreground ml-2">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// ── Page Component ────────────────────────────────────────────
export default function BikesPage() {
    return (
        <>
            <SiteHeader />
            <div className="bg-background min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <p className="text-sm text-muted-foreground mb-1">
                            <Link href="/" className="hover:underline">Home</Link> / Bikes
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight">Bikes & Scooters</h1>
                        <p className="text-muted-foreground mt-1">
                            Browse bikes, scooters, and electric two-wheelers from top brands
                        </p>
                    </div>

                    <Suspense
                        fallback={
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:ml-[304px]">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <BikeCardSkeleton key={i} />
                                ))}
                            </div>
                        }
                    >
                        <BikesContent />
                    </Suspense>
                </div>
            </div>
            <SiteFooter />
        </>
    );
}

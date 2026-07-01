/**
 * Autos & Three-Wheelers Page
 * /app/autos/page.tsx
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Filter,
    ChevronLeft,
    ChevronRight,
    X,
    Fuel,
    Zap,
    Users,
    Package,
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { getVehicleImageUrls, brandNameToId } from '@/lib/utils/brand-model-images';

// 3W brand list — `brand` must match the `make` field returned by /api/autos
// (which comes from the JSON `brand` field, e.g. "Piaggio" not "Piaggio Ape")
const THREE_WHEELER_BRANDS = [
    { brandId: 'bajaj-auto-3w', brand: 'Bajaj' },
    { brandId: 'piaggio-ape', brand: 'Piaggio' },
    { brandId: 'tvs-king', brand: 'TVS King' },
    { brandId: 'mahindra-3w', brand: 'Mahindra' },
    { brandId: 'atul-auto', brand: 'Atul Auto' },
    { brandId: 'kinetic-green', brand: 'Kinetic Green' },
    { brandId: 'euler-motors', brand: 'Euler Motors' },
    { brandId: 'greaves-electric-3w', brand: 'Greaves Electric' },
    { brandId: 'lohia-auto', brand: 'Lohia Auto' },
    { brandId: 'yc-ev', brand: 'YC Electric' },
    { brandId: 'saera-ev', brand: 'Saera Electric' },
    { brandId: 'omega-seiki-mobility', brand: 'Omega Seiki Mobility' },
    { brandId: 'altigreen', brand: 'Altigreen' },
    { brandId: 'montra-ev', brand: 'Montra Electric' },
    { brandId: 'terra-motors', brand: 'Terra Motors' },
    { brandId: 'etrio', brand: 'ETrio' },
    { brandId: 'osm', brand: 'OSM' },
    { brandId: 'youdha', brand: 'YOUDHA' },
];

const TYPE_OPTIONS = [
    { value: 'all', label: 'All Types' },
    { value: 'passenger', label: 'Passenger' },
    { value: 'cargo', label: 'Cargo' },
    { value: 'electric', label: 'Electric' },
];

const SORT_OPTIONS = [
    { value: 'popular', label: 'Popular' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
];

type AutosQueryState = {
    selectedBrand: string;
    selectedType: string;
    sortBy: string;
    searchQuery: string;
    page: number;
};

const DEFAULT_AUTOS_QUERY: AutosQueryState = {
    selectedBrand: '',
    selectedType: 'all',
    sortBy: 'popular',
    searchQuery: '',
    page: 1,
};

function readAutosQuery(): AutosQueryState {
    if (typeof window === 'undefined') return DEFAULT_AUTOS_QUERY;

    const params = new URLSearchParams(window.location.search);
    const parsedPage = Number(params.get('page') || '1');

    return {
        selectedBrand: params.get('make') || '',
        selectedType: params.get('type') || 'all',
        sortBy: params.get('sortBy') || 'popular',
        searchQuery: params.get('q') || '',
        page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
    };
}

function writeAutosQuery(next: AutosQueryState) {
    const params = new URLSearchParams();
    if (next.selectedBrand) params.set('make', next.selectedBrand);
    if (next.selectedType !== 'all') params.set('type', next.selectedType);
    if (next.sortBy !== 'popular') params.set('sortBy', next.sortBy);
    if (next.searchQuery) params.set('q', next.searchQuery);
    if (next.page > 1) params.set('page', String(next.page));

    const query = params.toString();
    window.history.pushState(null, '', query ? `/autos?${query}` : '/autos');
}

interface AutoVehicle {
    id: string;
    make: string;
    model: string;
    variant: string | null;
    year: number;
    type: string;
    fuel_type: string;
    engine_cc: number | null;
    mileage_kmpl: number | null;
    range_km: number | null;
    payload_kg: number | null;
    passenger_capacity: number | null;
    price_min_paise: number;
    image_url: string | null;
    popularity_score: number;
    is_featured: boolean;
}

function modelImageSourceKind(src: string | null | undefined) {
    const value = String(src ?? '').toLowerCase();
    if (
        value.includes('/storage/v1/object/public/dealer-assets/vehicles/') ||
        value.includes('/storage/v1/object/public/dealer-assets/sell-requests/') ||
        value.includes('/storage/v1/object/public/vehicle-images/')
    ) {
        return 'inventory-photo';
    }
    return 'resolved-model';
}

function formatPrice(paise: number): string {
    if (paise <= 0) return 'Price on request';
    const rupees = paise / 100;
    if (rupees >= 100000) {
        return `${(rupees / 100000).toFixed(2)} Lakh`;
    }
    return `${rupees.toLocaleString('en-IN')}`;
}

function AutoCardSkeleton() {
    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
            <div className="aspect-[16/10] bg-muted" />
            <div className="p-4 space-y-3">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-5 w-32 bg-muted rounded" />
                <div className="h-6 w-28 bg-muted rounded mt-2" />
                <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="h-10 bg-muted rounded-lg" />
                    <div className="h-10 bg-muted rounded-lg" />
                </div>
            </div>
        </div>
    );
}

function AutoCard({ vehicle }: { vehicle: AutoVehicle }) {
    const imageUrls = getVehicleImageUrls('3w', brandNameToId(vehicle.make, '3w'), vehicle.model, vehicle.image_url);
    const [imgIdx, setImgIdx] = useState(0);
    const [imgFailed, setImgFailed] = useState(false);

    const handleImgError = () => {
        if (imgIdx < imageUrls.length - 1) {
            setImgIdx(imgIdx + 1);
        } else {
            setImgFailed(true);
        }
    };

    const fuelLabel =
        vehicle.fuel_type === 'electric' ? 'Electric'
            : vehicle.fuel_type === 'cng' ? 'CNG'
            : vehicle.fuel_type === 'diesel' ? 'Diesel'
            : vehicle.fuel_type === 'lpg' ? 'LPG'
            : 'Petrol';

    const capacityLabel = vehicle.passenger_capacity
        ? `${vehicle.passenger_capacity} seats`
        : vehicle.payload_kg
        ? `${vehicle.payload_kg} kg`
        : null;

    const typeLabel = vehicle.type === 'electric' ? 'Electric'
        : vehicle.type === 'passenger' ? 'Passenger'
        : 'Cargo';

    const slug = `${vehicle.make.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${vehicle.model.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const detailHref = `/autos/${vehicle.id ?? slug}`;

    if (imageUrls.length === 0 || imgFailed) return null;

    return (
        <Link href={detailHref} data-vehicle-card="true" data-model-image-source={modelImageSourceKind(imageUrls[imgIdx])} className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            {/* Image */}
            <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                <Image
                    src={imageUrls[imgIdx]}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    fill
                    unoptimized
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                    onError={handleImgError}
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {vehicle.fuel_type === 'electric' && (
                        <span className="bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5" /> EV
                        </span>
                    )}
                    {vehicle.is_featured && (
                        <span className="bg-amber-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                            Popular
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Brand */}
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                    {vehicle.make}
                </p>

                {/* Model */}
                <h3 className="text-base font-bold text-foreground leading-tight line-clamp-1">
                    {vehicle.model}
                </h3>
                {vehicle.variant && (
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{vehicle.variant}</p>
                )}

                {/* Price */}
                <div className="mt-2 mb-3">
                    {vehicle.price_min_paise > 0 ? (
                        <>
                            <p className="text-lg font-bold text-foreground">
                                ₹{formatPrice(vehicle.price_min_paise)}
                            </p>
                            <p className="text-[10px] text-muted-foreground">Ex-showroom</p>
                        </>
                    ) : (
                        <p className="text-sm font-semibold text-muted-foreground italic">Price on request</p>
                    )}
                </div>

                {/* Divider */}
                <div className="border-t border-border mb-3" />

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Fuel className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{fuelLabel}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="text-sm shrink-0">🛺</span>
                        <span>{typeLabel}</span>
                    </div>
                    {capacityLabel && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            {vehicle.passenger_capacity ? (
                                <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            ) : (
                                <Package className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            )}
                            <span>{capacityLabel}</span>
                        </div>
                    )}
                    {vehicle.fuel_type === 'electric' && vehicle.range_km ? (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Zap className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>{vehicle.range_km} km range</span>
                        </div>
                    ) : vehicle.mileage_kmpl ? (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Fuel className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{vehicle.mileage_kmpl} km/l</span>
                        </div>
                    ) : null}
                </div>

                {/* View Details */}
                <div className="mt-3 pt-3 border-t border-border">
                    <span className="w-full inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold py-2.5 group-hover:opacity-90 transition-opacity">
                        View Details <ChevronRight className="w-4 h-4 ml-1" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

function FilterSidebar({
    selectedBrand,
    selectedType,
    onBrandChange,
    onTypeChange,
    onClear,
}: {
    selectedBrand: string;
    selectedType: string;
    onBrandChange: (brand: string) => void;
    onTypeChange: (type: string) => void;
    onClear: () => void;
}) {
    const hasFilters = selectedBrand !== '' || selectedType !== 'all';

    return (
        <div className="space-y-6">
            {hasFilters && (
                <button
                    onClick={onClear}
                    className="flex items-center gap-1.5 text-sm text-destructive hover:underline font-medium"
                >
                    <X className="w-3.5 h-3.5" /> Clear all filters
                </button>
            )}

            {/* Brand filter */}
            <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Brand</h4>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                    <button
                        onClick={() => onBrandChange('')}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                            selectedBrand === ''
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:bg-muted'
                        }`}
                    >
                        All Brands
                    </button>
                    {THREE_WHEELER_BRANDS.map((b) => (
                        <button
                            key={b.brandId}
                            onClick={() => onBrandChange(b.brand)}
                            className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                                selectedBrand === b.brand
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-muted-foreground hover:bg-muted'
                            }`}
                        >
                            {b.brand}
                        </button>
                    ))}
                </div>
            </div>

            {/* Type filter */}
            <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Type</h4>
                <div className="space-y-1">
                    {TYPE_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => onTypeChange(opt.value)}
                            className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                                selectedType === opt.value
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-muted-foreground hover:bg-muted'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AutosContent() {
    const [queryState, setQueryState] = useState<AutosQueryState>(DEFAULT_AUTOS_QUERY);
    const [vehicles, setVehicles] = useState<AutoVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const selectedBrand = queryState.selectedBrand;
    const selectedType = queryState.selectedType;
    const sortBy = queryState.sortBy;
    const searchQuery = queryState.searchQuery;
    const currentPage = queryState.page;

    const updateParams = useCallback(
        (updates: Record<string, string>) => {
            setQueryState((prev) => {
                const next = { ...prev };
                for (const [key, value] of Object.entries(updates)) {
                    if (key === 'make') next.selectedBrand = value;
                    if (key === 'type') next.selectedType = value || 'all';
                    if (key === 'sortBy') next.sortBy = value || 'popular';
                    if (key === 'q') next.searchQuery = value;
                    if (key === 'page') {
                        const parsedPage = Number(value || '1');
                        next.page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
                    }
                }
                writeAutosQuery(next);
                return next;
            });
        },
        []
    );

    useEffect(() => {
        const syncFromUrl = () => setQueryState(readAutosQuery());
        syncFromUrl();
        window.addEventListener('popstate', syncFromUrl);
        return () => window.removeEventListener('popstate', syncFromUrl);
    }, []);

    useEffect(() => {
        const fetchAutos = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (selectedBrand) params.set('make', selectedBrand);
                if (searchQuery) params.set('q', searchQuery);
                if (selectedType !== 'all') params.set('type', selectedType);
                params.set('sortBy', sortBy);
                params.set('page', String(currentPage));
                params.set('pageSize', '12');

                const res = await fetch(`/api/autos?${params.toString()}`);
                const data = await res.json();
                if (data.success) {
                    setVehicles(data.data.vehicles);
                    setTotalCount(data.data.total);
                    setTotalPages(data.data.totalPages);
                }
            } catch {
                setVehicles([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAutos();
    }, [selectedBrand, selectedType, sortBy, currentPage, searchQuery]);

    const handleBrandChange = (brand: string) => {
        updateParams({ make: brand, page: '1' });
    };

    const handleTypeChange = (type: string) => {
        updateParams({ type, page: '1' });
    };

    const handleSortChange = (sort: string) => {
        updateParams({ sortBy: sort });
    };

    const handleClearFilters = () => {
        setQueryState(DEFAULT_AUTOS_QUERY);
        window.history.pushState(null, '', '/autos');
    };

    const handlePageChange = (newPage: number) => {
        updateParams({ page: String(newPage) });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const activeFilterCount =
        (selectedBrand ? 1 : 0) + (selectedType !== 'all' ? 1 : 0);

    return (
        <div className="flex gap-6">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-60 shrink-0">
                <div className="bg-card rounded-xl border border-border p-4 sticky top-20">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filters
                        {activeFilterCount > 0 && (
                            <Badge variant="secondary" className="text-[10px] h-5">
                                {activeFilterCount}
                            </Badge>
                        )}
                    </h3>
                    <FilterSidebar
                        selectedBrand={selectedBrand}
                        selectedType={selectedType}
                        onBrandChange={handleBrandChange}
                        onTypeChange={handleTypeChange}
                        onClear={handleClearFilters}
                    />
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
                {/* Top bar: count + sort + mobile filter */}
                <div className="flex items-center justify-between mb-4 gap-3">
                    <p className="text-sm text-muted-foreground">
                        {loading ? (
                            'Loading...'
                        ) : (
                            <>
                                <span className="font-semibold text-foreground">{totalCount}</span>{' '}
                                {totalCount === 1 ? 'vehicle' : 'vehicles'} found
                            </>
                        )}
                    </p>

                    <div className="flex items-center gap-2">
                        {/* Sort */}
                        <Select value={sortBy} onValueChange={handleSortChange}>
                            <SelectTrigger className="w-[160px] h-9 text-sm">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                {SORT_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Mobile filter trigger */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="lg:hidden h-9">
                                    <Filter className="w-4 h-4 mr-1.5" />
                                    Filters
                                    {activeFilterCount > 0 && (
                                        <Badge variant="secondary" className="ml-1.5 text-[10px] h-4">
                                            {activeFilterCount}
                                        </Badge>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-80">
                                <SheetHeader>
                                    <SheetTitle>Filters</SheetTitle>
                                    <SheetDescription>
                                        Filter three-wheelers by brand and type
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-6">
                                    <FilterSidebar
                                        selectedBrand={selectedBrand}
                                        selectedType={selectedType}
                                        onBrandChange={handleBrandChange}
                                        onTypeChange={handleTypeChange}
                                        onClear={handleClearFilters}
                                    />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Active filter badges */}
                {activeFilterCount > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {selectedBrand && (
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1 cursor-pointer hover:bg-muted/80"
                                onClick={() => handleBrandChange('')}
                            >
                                {selectedBrand}
                                <X className="w-3 h-3" />
                            </Badge>
                        )}
                        {selectedType !== 'all' && (
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1 cursor-pointer hover:bg-muted/80"
                                onClick={() => handleTypeChange('all')}
                            >
                                {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                                <X className="w-3 h-3" />
                            </Badge>
                        )}
                    </div>
                )}

                {/* Vehicle grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <AutoCardSkeleton key={i} />
                        ))}
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="text-center py-16">
                        <span className="text-5xl mb-4 block">🛺</span>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                            No vehicles found
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Try adjusting your filters or clearing them
                        </p>
                        <Button variant="outline" size="sm" onClick={handleClearFilters}>
                            Clear all filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {vehicles.map((v) => (
                            <AutoCard key={v.id} vehicle={v} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex max-w-full flex-wrap items-center justify-center gap-2 px-1">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((p) => {
                                // Show first, last, and pages near current
                                return p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2;
                            })
                            .map((p, idx, arr) => {
                                const prev = arr[idx - 1];
                                const showEllipsis = prev && p - prev > 1;
                                return (
                                    <span key={p} className="flex shrink-0 items-center gap-1">
                                        {showEllipsis && (
                                            <span className="text-muted-foreground px-1">...</span>
                                        )}
                                        <Button
                                            variant={p === currentPage ? 'default' : 'outline'}
                                            size="sm"
                                            className="min-w-[36px]"
                                            onClick={() => handlePageChange(p)}
                                        >
                                            {p}
                                        </Button>
                                    </span>
                                );
                            })}

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AutosPage() {
    return (
        <>
            <SiteHeader />
            <div className="min-h-screen bg-background">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-foreground transition-colors">
                            Home
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-foreground font-medium">Autos</span>
                    </nav>

                    {/* Title */}
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                            Autos & Three-Wheelers
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Browse auto-rickshaws, e-autos, and cargo three-wheelers from top brands in India
                        </p>
                    </div>

                    <AutosContent />
                </main>
            </div>
            <SiteFooter />
        </>
    );
}

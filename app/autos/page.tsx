/**
 * Autos & Three-Wheelers Page
 * /app/autos/page.tsx
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
    ChevronDown,
    X,
    Fuel,
    Zap,
    Users,
    Package,
    Loader2,
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
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
            <div className="aspect-[16/10] bg-gray-100" />
            <div className="p-4 space-y-3">
                <div className="h-3 w-20 bg-gray-100 rounded" />
                <div className="h-5 w-32 bg-gray-100 rounded" />
                <div className="h-6 w-28 bg-gray-100 rounded mt-2" />
                <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="h-10 bg-gray-100 rounded-lg" />
                    <div className="h-10 bg-gray-100 rounded-lg" />
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

    return (
        <Link href={detailHref} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            {/* Image */}
            <div className="relative aspect-[16/10] bg-gray-50 overflow-hidden">
                {!imgFailed && imageUrls.length > 0 ? (
                    <Image
                        src={imageUrls[imgIdx]}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        fill
                        unoptimized
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                        onError={handleImgError}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-4xl text-gray-400">
                        <span>🛺</span>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {vehicle.fuel_type === 'electric' && (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5" /> EV
                        </span>
                    )}
                    {vehicle.is_featured && (
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                            Popular
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Brand */}
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-0.5">
                    {vehicle.make}
                </p>

                {/* Model */}
                <h3 className="text-base font-bold text-gray-900 leading-tight line-clamp-1">
                    {vehicle.model}
                </h3>
                {vehicle.variant && (
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{vehicle.variant}</p>
                )}

                {/* Price */}
                <div className="mt-2 mb-3">
                    {vehicle.price_min_paise > 0 ? (
                        <>
                            <p className="text-lg font-bold text-gray-900">
                                ₹{formatPrice(vehicle.price_min_paise)}
                            </p>
                            <p className="text-[10px] text-gray-500">Ex-showroom</p>
                        </>
                    ) : (
                        <p className="text-sm font-semibold text-gray-500 italic">Price on request</p>
                    )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 mb-3" />

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-700">
                        <Fuel className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{fuelLabel}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-700">
                        <span className="text-sm shrink-0">🛺</span>
                        <span>{typeLabel}</span>
                    </div>
                    {capacityLabel && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-700">
                            {vehicle.passenger_capacity ? (
                                <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            ) : (
                                <Package className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            )}
                            <span>{capacityLabel}</span>
                        </div>
                    )}
                    {vehicle.fuel_type === 'electric' && vehicle.range_km ? (
                        <div className="flex items-center gap-1.5 text-xs text-gray-700">
                            <Zap className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>{vehicle.range_km} km range</span>
                        </div>
                    ) : vehicle.mileage_kmpl ? (
                        <div className="flex items-center gap-1.5 text-xs text-gray-700">
                            <Fuel className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{vehicle.mileage_kmpl} km/l</span>
                        </div>
                    ) : null}
                </div>

                {/* View Details */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="w-full inline-flex items-center justify-center rounded-lg bg-gray-900 text-white text-sm font-semibold py-2.5 group-hover:bg-gray-800 transition-colors">
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
                    className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                    <X className="w-3.5 h-3.5" /> Clear all filters
                </button>
            )}

            {/* Brand filter */}
            <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Brand</h4>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                    <button
                        onClick={() => onBrandChange('')}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                            selectedBrand === ''
                                ? 'bg-green-50 text-green-700 font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
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
                                    ? 'bg-green-50 text-green-700 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {b.brand}
                        </button>
                    ))}
                </div>
            </div>

            {/* Type filter */}
            <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Type</h4>
                <div className="space-y-1">
                    {TYPE_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => onTypeChange(opt.value)}
                            className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                                selectedType === opt.value
                                    ? 'bg-green-50 text-green-700 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
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
    const router = useRouter();
    const searchParams = useSearchParams();
    const [vehicles, setVehicles] = useState<AutoVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const selectedBrand = searchParams.get('make') || '';
    const selectedType = searchParams.get('type') || 'all';
    const sortBy = searchParams.get('sortBy') || 'popular';
    const searchQuery = searchParams.get('q') || '';

    const updateParams = useCallback(
        (updates: Record<string, string>) => {
            const params = new URLSearchParams(searchParams.toString());
            for (const [key, value] of Object.entries(updates)) {
                if (value === '' || value === 'all') {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            }
            router.push(`/autos?${params.toString()}`);
        },
        [router, searchParams]
    );

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
                    setCurrentPage(data.data.page);
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
        setCurrentPage(1);
        updateParams({ make: brand, page: '' });
    };

    const handleTypeChange = (type: string) => {
        setCurrentPage(1);
        updateParams({ type, page: '' });
    };

    const handleSortChange = (sort: string) => {
        updateParams({ sortBy: sort });
    };

    const handleClearFilters = () => {
        setCurrentPage(1);
        router.push('/autos');
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        updateParams({ page: String(newPage) });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const activeFilterCount =
        (selectedBrand ? 1 : 0) + (selectedType !== 'all' ? 1 : 0);

    return (
        <div className="min-h-screen bg-gray-50">
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Link href="/" className="hover:text-gray-700 transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-gray-900 font-medium">Autos</span>
                </nav>

                {/* Title */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Autos & Three-Wheelers
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Browse auto-rickshaws, e-autos, and cargo three-wheelers from top brands in India
                    </p>
                </div>

                <div className="flex gap-6">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block w-60 shrink-0">
                        <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-20">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
                            <p className="text-sm text-gray-700">
                                {loading ? (
                                    'Loading...'
                                ) : (
                                    <>
                                        <span className="font-semibold text-gray-900">{totalCount}</span>{' '}
                                        {totalCount === 1 ? 'vehicle' : 'vehicles'} found
                                    </>
                                )}
                            </p>

                            <div className="flex items-center gap-2">
                                {/* Sort */}
                                <Select value={sortBy} onValueChange={handleSortChange}>
                                    <SelectTrigger className="w-[160px] h-9 text-sm bg-white">
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
                                        className="flex items-center gap-1 cursor-pointer hover:bg-gray-200"
                                        onClick={() => handleBrandChange('')}
                                    >
                                        {selectedBrand}
                                        <X className="w-3 h-3" />
                                    </Badge>
                                )}
                                {selectedType !== 'all' && (
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1 cursor-pointer hover:bg-gray-200"
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
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    No vehicles found
                                </h3>
                                <p className="text-gray-500 text-sm mb-4">
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
                            <div className="flex items-center justify-center gap-2 mt-8">
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
                                            <span key={p} className="flex items-center gap-1">
                                                {showEllipsis && (
                                                    <span className="text-gray-400 px-1">...</span>
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
            </main>

            <SiteFooter />
        </div>
    );
}

export default function AutosPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            }
        >
            <AutosContent />
        </Suspense>
    );
}

/**
 * Cars Page Layout
 * /app/cars/page.tsx
 */

'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { CarFilters } from '@/components/cars/CarFilters';
import { CarGrid } from '@/components/cars/CarGrid';
import { Car } from '@/lib/types/car';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Filter, LayoutGrid, List, ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

function CarCardSkeleton() {
    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
            <div className="aspect-[16/10] bg-muted" />
            <div className="p-5 space-y-3">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-5 w-32 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded" />
                <div className="h-6 w-28 bg-muted rounded mt-2" />
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="h-14 bg-muted rounded-xl" />
                    <div className="h-14 bg-muted rounded-xl" />
                    <div className="h-14 bg-muted rounded-xl" />
                    <div className="h-14 bg-muted rounded-xl" />
                </div>
                <div className="h-10 bg-muted rounded-lg mt-4" />
            </div>
        </div>
    );
}

const PRICE_MAX_DEFAULT = 5_000_000;
const PRICE_CRORE_THRESHOLD = 10_000_000;
const PRICE_LAKH_THRESHOLD = 100_000;

function CarsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const sortBy = searchParams.get('sortBy') || 'popular';

    useEffect(() => {
        const fetchCars = async () => {
            setLoading(true);
            try {
                const query = searchParams.toString();
                const res = await fetch(`/api/cars?${query}`);
                const data = await res.json();
                if (data.success) {
                    setCars(data.data.cars);
                    setTotalCount(data.data.total || data.data.cars.length);
                    setCurrentPage(data.data.page || 1);
                    setTotalPages(data.data.totalPages || 1);
                }
            } catch (error) {
                console.error('Failed to fetch cars', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
        return;
    }, [searchParams]);

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sortBy', value);
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Build active filter chips
    const buildFilterChips = () => {
        const chips: { label: string; key: string; value: string }[] = [];

        const makeParam = searchParams.get('make');
        if (makeParam) makeParam.split(',').forEach(m => chips.push({ label: m, key: 'make', value: m }));

        const bodyParam = searchParams.get('bodyType');
        if (bodyParam) bodyParam.split(',').forEach(b => chips.push({ label: b, key: 'bodyType', value: b }));

        const fuelParam = searchParams.get('fuelType');
        if (fuelParam) fuelParam.split(',').forEach(f => chips.push({ label: f, key: 'fuelType', value: f }));

        const transParam = searchParams.get('transmission');
        if (transParam) transParam.split(',').forEach(t => chips.push({ label: t, key: 'transmission', value: t }));

        const yearParam = searchParams.get('year');
        if (yearParam) yearParam.split(',').forEach(y => chips.push({ label: y, key: 'year', value: y }));

        const seatingParam = searchParams.get('seating');
        if (seatingParam) seatingParam.split(',').forEach(s => chips.push({ label: `${s} Seater`, key: 'seating', value: s }));

        const colorParam = searchParams.get('color');
        if (colorParam) colorParam.split(',').forEach(c => chips.push({ label: c, key: 'color', value: c }));

        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        if ((minPrice && minPrice !== '0') || (maxPrice && maxPrice !== String(PRICE_MAX_DEFAULT))) {
            chips.push({ label: `Price: ${formatPriceLabel(Number(minPrice || 0))} - ${formatPriceLabel(Number(maxPrice || PRICE_MAX_DEFAULT))}`, key: 'price', value: 'price' });
        }

        return chips;
    };

    const formatPriceLabel = (price: number) => {
        if (price >= PRICE_CRORE_THRESHOLD) return `${(price / PRICE_CRORE_THRESHOLD).toFixed(1)} Cr`;
        if (price >= PRICE_LAKH_THRESHOLD) return `${(price / PRICE_LAKH_THRESHOLD).toFixed(1)} L`;
        return `${(price / 1000).toFixed(0)}K`;
    };

    const removeFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (key === 'price') {
            params.delete('minPrice');
            params.delete('maxPrice');
        } else {
            const current = params.get(key)?.split(',').filter(Boolean) || [];
            const updated = current.filter(v => v !== value);
            if (updated.length > 0) params.set(key, updated.join(','));
            else params.delete(key);
        }
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const clearAllFilters = () => {
        router.push('?');
    };

    const filterChips = buildFilterChips();
    const activeFilterCount = filterChips.length;

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block w-72 flex-shrink-0">
                <div className="sticky top-8">
                    <CarFilters />
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
                                            <Badge variant="default" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
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
                                        <CarFilters />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Result count */}
                        {!loading && (
                            <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">{totalCount.toLocaleString()}</span>
                                {' '}Cars found
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
                                onClick={clearAllFilters}
                                className="text-xs text-destructive hover:underline font-medium ml-1"
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                )}

                {/* Car Grid or Skeleton */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <CarCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <>
                        <CarGrid cars={cars} light />

                        {/* Load More + Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 space-y-4">
                                {/* Load More Button */}
                                {currentPage < totalPages && (
                                    <div className="flex justify-center">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="px-8"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        >
                                            Load More Cars
                                        </Button>
                                    </div>
                                )}

                                {/* Page Navigation */}
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
                                            if (start > 2) pages.push(-1); // ellipsis
                                        }
                                        for (let i = start; i <= end; i++) pages.push(i);
                                        if (end < totalPages) {
                                            if (end < totalPages - 1) pages.push(-2); // ellipsis
                                            pages.push(totalPages);
                                        }

                                        return pages.map((page, idx) =>
                                            page < 0 ? (
                                                <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground">...</span>
                                            ) : (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? "default" : "outline"}
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

export default function CarsPage() {
    return (
        <>
            <SiteHeader />
            <div className="bg-background min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <p className="text-sm text-muted-foreground mb-1">Home / Cars</p>
                        <h1 className="text-3xl font-bold tracking-tight">All Cars</h1>
                        <p className="text-muted-foreground mt-1">Browse and compare cars from top brands</p>
                    </div>

                    <Suspense fallback={
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:ml-[304px]">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <CarCardSkeleton key={i} />
                            ))}
                        </div>
                    }>
                        <CarsContent />
                    </Suspense>
                </div>
            </div>
            <SiteFooter />
        </>
    );
}

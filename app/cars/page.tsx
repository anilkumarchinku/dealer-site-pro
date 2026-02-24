/**
 * Cars Page Layout
 * /app/cars/page.tsx
 */

'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Filter, LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react';
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
        <div className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
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

    // Count active filters
    const activeFilterCount = [
        searchParams.get('make'),
        searchParams.get('bodyType'),
        searchParams.get('fuelType'),
        searchParams.get('transmission'),
        (searchParams.get('minPrice') && searchParams.get('minPrice') !== '0') ? 'price' : null,
        (searchParams.get('maxPrice') && searchParams.get('maxPrice') !== '5000000') ? 'price' : null,
    ].filter(Boolean).length;

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
                                Showing <span className="font-semibold text-foreground">{cars.length}</span>
                                {totalCount > cars.length && <> of <span className="font-semibold text-foreground">{totalCount}</span></>}
                                {' '}cars
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

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                                    const page = i + 1;
                                    return (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(page)}
                                            className="w-9"
                                        >
                                            {page}
                                        </Button>
                                    );
                                })}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
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
    );
}

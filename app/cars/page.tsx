/**
 * Cars Page Layout
 * /app/cars/page.tsx
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CarFilters } from '@/components/cars/CarFilters';
import { CarGrid } from '@/components/cars/CarGrid';
import { Car } from '@/lib/types/car';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export default function CarsPage() {
    const searchParams = useSearchParams();
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch cars based on searchParams
        // This would ideally call the API route we created
        const fetchCars = async () => {
            setLoading(true);
            try {
                const query = searchParams.toString();
                const res = await fetch(`/api/cars?${query}`);
                const data = await res.json();
                if (data.success) {
                    setCars(data.data.cars);
                }
            } catch (error) {
                console.error('Failed to fetch cars', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, [searchParams]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">All Cars</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar - Desktop */}
                    <div className="hidden lg:block w-64 flex-shrink-0">
                        <CarFilters />
                    </div>

                    {/* Filters - Mobile */}
                    <div className="lg:hidden mb-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline">
                                    <Filter className="w-4 h-4 mr-2" /> Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <SheetHeader>
                                    <SheetTitle>Filters</SheetTitle>
                                    <SheetDescription>
                                        Refine your search
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-4">
                                    <CarFilters />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Car Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <CarGrid cars={cars} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

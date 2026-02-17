/**
 * Cars Demo Page
 * Test page to showcase the car inventory system
 */

'use client';

import { useEffect, useState } from 'react';
import type { Car } from '@/lib/types/car';
import { CarGrid } from '@/components/cars/CarGrid';
import { allCars } from '@/lib/data/cars';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CarsDemoPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            setCars(allCars);
            setLoading(false);
        }, 500);
    }, []);

    const handleViewDetails = (carId: string) => {
        console.log('View details for car:', carId);
        // Navigate to car detail page
        // router.push(`/cars/${carId}`);
    };

    const handleCompare = (carId: string) => {
        console.log('Add to compare:', carId);
        // Add to comparison list
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4 animate-bounce">🚗</div>
                    <p className="text-gray-600">Loading cars...</p>
                </div>
            </div>
        );
    }

    const totalCars = cars.length;
    const makes = Array.from(new Set(cars.map(c => c.make)));
    const avgPrice = cars.reduce((sum, c) => sum + (c.pricing.exShowroom.min ?? 0), 0) / cars.length;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        🚗 Car Inventory System Demo
                    </h1>
                    <p className="text-xl text-gray-600 mb-6">
                        Browse our collection of {totalCars} cars across {makes.length} brands
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-blue-600">{totalCars}</div>
                                <div className="text-sm text-gray-600">Total Cars</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-green-600">{makes.length}</div>
                                <div className="text-sm text-gray-600">Brands</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-purple-600">
                                    ₹{(avgPrice / 100000).toFixed(1)}L
                                </div>
                                <div className="text-sm text-gray-600">Avg Price</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-orange-600">
                                    {cars.filter(c => c.rating && c.rating.overall >= 4).length}
                                </div>
                                <div className="text-sm text-gray-600">Top Rated</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Available Brands */}
                    <div className="mb-8">
                        <p className="text-sm text-gray-600 mb-3">Available Brands:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {makes.map(make => (
                                <Badge key={make} variant="outline" className="text-sm">
                                    {make}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* API Endpoints Info */}
                <Card className="mb-8 bg-blue-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-lg">📡 API Endpoints Ready</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm font-mono">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-green-600">GET</Badge>
                            <code>/api/cars</code>
                            <span className="text-gray-600 text-xs">- List all cars with filters</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-green-600">GET</Badge>
                            <code>/api/cars/[id]</code>
                            <span className="text-gray-600 text-xs">- Single car details</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-green-600">GET</Badge>
                            <code>/api/cars/featured</code>
                            <span className="text-gray-600 text-xs">- Featured cars</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Car Grid */}
                <CarGrid
                    cars={cars}
                    variant="detailed"
                    showEMI={true}
                    onViewDetails={handleViewDetails}
                    onCompare={handleCompare}
                />

                {/* Footer Info */}
                <div className="mt-12 text-center text-sm text-gray-600">
                    <p>✅ TypeScript types defined</p>
                    <p>✅ API endpoints created</p>
                    <p>✅ UI components built</p>
                    <p>✅ Sample data for {totalCars} cars</p>
                    <p className="mt-4 text-xs text-gray-500">
                        Add more car data by creating files in <code>lib/data/sample-cars/</code>
                    </p>
                </div>
            </div>
        </div>
    );
}

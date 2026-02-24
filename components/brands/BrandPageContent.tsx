/**
 * BrandPageContent — Client component for brand page with body type tabs
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Car } from '@/lib/types/car';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
import { CarCard } from '@/components/cars/CarCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    ChevronRight,
    Car as CarIcon,
    TrendingUp,
    Gauge,
    Fuel,
} from 'lucide-react';

interface BrandPageContentProps {
    brand: string;
    cars: Car[];
    brandInfo: {
        name: string;
        modelCount: number;
        priceMin: number | null;
        priceMax: number | null;
        bodyTypes: string[];
    };
}

export function BrandPageContent({ brand, cars, brandInfo }: BrandPageContentProps) {
    const [activeBodyType, setActiveBodyType] = useState('All');

    // Get unique body types from actual car data
    const bodyTypes = useMemo(() => {
        const types = new Set(cars.map(c => c.bodyType).filter(Boolean));
        return ['All', ...Array.from(types)];
    }, [cars]);

    // Filter cars by body type
    const filteredCars = useMemo(() => {
        if (activeBodyType === 'All') return cars;
        return cars.filter(c => c.bodyType === activeBodyType);
    }, [cars, activeBodyType]);

    // Price stats
    const cheapest = cars.reduce((min, c) =>
        (c.pricing.exShowroom.min && (!min || c.pricing.exShowroom.min < min)) ? c.pricing.exShowroom.min : min
    , null as number | null);

    const expensive = cars.reduce((max, c) =>
        (c.pricing.exShowroom.max && (!max || c.pricing.exShowroom.max > max)) ? c.pricing.exShowroom.max : max
    , null as number | null);

    return (
        <div className="bg-background min-h-screen">
            {/* Brand Header */}
            <div className="bg-muted/30 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <Link href="/brands" className="hover:text-foreground transition-colors">Brands</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-foreground font-medium">{brand}</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* Brand initial */}
                            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold shrink-0">
                                {brand.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">{brand} Cars</h1>
                                <p className="text-muted-foreground text-sm mt-0.5">
                                    {brandInfo.modelCount} {brandInfo.modelCount === 1 ? 'Model' : 'Models'} available
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex gap-3">
                            {cheapest && (
                                <Card className="px-4 py-2.5">
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Starting From</div>
                                    <div className="text-sm font-bold">{formatPriceInLakhs(cheapest)}</div>
                                </Card>
                            )}
                            {expensive && (
                                <Card className="px-4 py-2.5">
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Goes Up To</div>
                                    <div className="text-sm font-bold">{formatPriceInLakhs(expensive)}</div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Body Type Tabs */}
            <div className="border-b bg-background sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-0 overflow-x-auto no-scrollbar">
                        {bodyTypes.map((type) => {
                            const count = type === 'All'
                                ? cars.length
                                : cars.filter(c => c.bodyType === type).length;
                            return (
                                <button
                                    key={type}
                                    onClick={() => setActiveBodyType(type)}
                                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                        activeBodyType === type
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {type}
                                    <Badge variant="secondary" className="ml-1.5 text-[10px] h-4 px-1">
                                        {count}
                                    </Badge>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Car Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Result count */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="font-semibold text-foreground">{filteredCars.length}</span>
                        {' '}{brand} {activeBodyType !== 'All' ? activeBodyType + ' ' : ''}cars
                    </p>
                </div>

                {filteredCars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredCars.map((car) => (
                            <CarCard key={car.id} car={car} light />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <CarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">
                            No {activeBodyType} models found for {brand}.
                        </p>
                    </div>
                )}

                {/* Price Range Overview */}
                {cars.length > 1 && (
                    <div className="mt-12">
                        <h2 className="text-xl font-bold mb-4">{brand} Price Range</h2>
                        <Card>
                            <CardContent className="p-5">
                                <div className="space-y-3">
                                    {cars
                                        .sort((a, b) => (a.pricing.exShowroom.min || 0) - (b.pricing.exShowroom.min || 0))
                                        .map((car) => {
                                            const min = car.pricing.exShowroom.min || 0;
                                            const max = car.pricing.exShowroom.max || min;
                                            const maxBrandPrice = expensive || 5000000;
                                            const widthPct = maxBrandPrice > 0 ? Math.max(5, ((max - min) / maxBrandPrice) * 100) : 5;
                                            const leftPct = maxBrandPrice > 0 ? (min / maxBrandPrice) * 100 : 0;

                                            return (
                                                <div key={car.id} className="flex items-center gap-4">
                                                    <Link
                                                        href={`/cars/${car.id}`}
                                                        className="w-40 text-sm font-medium hover:text-primary truncate shrink-0"
                                                    >
                                                        {car.model}
                                                    </Link>
                                                    <div className="flex-1 relative h-6">
                                                        <div
                                                            className="absolute top-1 h-4 bg-primary/20 rounded-full"
                                                            style={{
                                                                left: `${leftPct}%`,
                                                                width: `${Math.min(widthPct, 100 - leftPct)}%`,
                                                            }}
                                                        >
                                                            <div className="absolute inset-0 bg-primary/60 rounded-full" />
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground w-36 text-right shrink-0">
                                                        {formatPriceInLakhs(min)}
                                                        {max !== min && ` - ${formatPriceInLakhs(max)}`}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * ComparePageContent — Full car comparison interface
 * Select up to 4 cars and compare specs side by side
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Car } from '@/lib/types/car';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
    ChevronRight,
    Plus,
    X,
    Search,
    Trophy,
    Fuel,
    Gauge,
    Users,
    Shield,
    Zap,
    Car as CarIcon,
    ArrowRight,
} from 'lucide-react';
import { getBrandLogo } from '@/lib/data/brand-logos';
import { getVehicleImageUrls, brandNameToId } from '@/lib/utils/brand-model-images';

const MAX_COMPARE = 4;

interface CompareSpec {
    label: string;
    category: string;
    getValue: (car: Car) => string;
    higherIsBetter?: boolean;
    getNumeric?: (car: Car) => number | null;
}

const COMPARE_SPECS: CompareSpec[] = [
    // Price
    { label: 'Ex-Showroom Price*', category: 'Price', getValue: (c) => formatPriceInLakhs(c.pricing.exShowroom.min), getNumeric: (c) => c.pricing.exShowroom.min, higherIsBetter: false },
    { label: 'Top Variant Price', category: 'Price', getValue: (c) => formatPriceInLakhs(c.pricing.exShowroom.max), getNumeric: (c) => c.pricing.exShowroom.max, higherIsBetter: false },

    // Engine
    { label: 'Engine Type', category: 'Engine', getValue: (c) => c.engine?.type || '—' },
    { label: 'Displacement', category: 'Engine', getValue: (c) => c.engine?.displacement ? `${c.engine.displacement} cc` : '—', getNumeric: (c) => c.engine?.displacement || null, higherIsBetter: true },
    { label: 'Max Power', category: 'Engine', getValue: (c) => c.engine?.power || '—' },
    { label: 'Max Torque', category: 'Engine', getValue: (c) => c.engine?.torque || '—' },
    { label: 'Transmission', category: 'Engine', getValue: (c) => c.transmission?.type || '—' },

    // Performance
    { label: 'Mileage', category: 'Performance', getValue: (c) => c.performance?.fuelEfficiency ? `${c.performance.fuelEfficiency} km/l` : '—', getNumeric: (c) => c.performance?.fuelEfficiency || null, higherIsBetter: true },
    { label: 'Top Speed', category: 'Performance', getValue: (c) => c.performance?.topSpeed ? `${c.performance.topSpeed} km/h` : '—', getNumeric: (c) => c.performance?.topSpeed || null, higherIsBetter: true },

    // Dimensions
    { label: 'Length', category: 'Dimensions', getValue: (c) => c.dimensions?.length ? `${c.dimensions.length} mm` : '—', getNumeric: (c) => c.dimensions?.length || null },
    { label: 'Width', category: 'Dimensions', getValue: (c) => c.dimensions?.width ? `${c.dimensions.width} mm` : '—' },
    { label: 'Height', category: 'Dimensions', getValue: (c) => c.dimensions?.height ? `${c.dimensions.height} mm` : '—' },
    { label: 'Wheelbase', category: 'Dimensions', getValue: (c) => c.dimensions?.wheelbase ? `${c.dimensions.wheelbase} mm` : '—', getNumeric: (c) => c.dimensions?.wheelbase || null, higherIsBetter: true },
    { label: 'Boot Space', category: 'Dimensions', getValue: (c) => c.dimensions?.bootSpace ? `${c.dimensions.bootSpace} L` : '—', getNumeric: (c) => c.dimensions?.bootSpace || null, higherIsBetter: true },
    { label: 'Seating', category: 'Dimensions', getValue: (c) => c.dimensions?.seatingCapacity ? `${c.dimensions.seatingCapacity}` : '—' },
    { label: 'Fuel Tank', category: 'Dimensions', getValue: (c) => c.dimensions?.fuelTankCapacity ? `${c.dimensions.fuelTankCapacity} L` : '—', getNumeric: (c) => c.dimensions?.fuelTankCapacity || null, higherIsBetter: true },

    // Safety
    { label: 'Airbags', category: 'Safety', getValue: (c) => c.safety?.airbags !== undefined ? `${c.safety.airbags}` : '—', getNumeric: (c) => c.safety?.airbags ?? null, higherIsBetter: true },
    { label: 'NCAP Rating', category: 'Safety', getValue: (c) => c.safety?.ncapRating?.stars ? `${c.safety.ncapRating.stars} Stars` : '—', getNumeric: (c) => c.safety?.ncapRating?.stars ?? null, higherIsBetter: true },
    { label: 'ABS', category: 'Safety', getValue: (c) => c.safety?.abs ? 'Yes' : 'No' },
    { label: 'ESP', category: 'Safety', getValue: (c) => c.safety?.esp ? 'Yes' : 'No' },
    { label: 'Rear Camera', category: 'Safety', getValue: (c) => c.safety?.rearCamera ? 'Yes' : 'No' },
];

/**
 * Resolves car image URLs with local fallback chain.
 * CDN hero URLs are often blocked by hotlink protection, so we prefer
 * local images from /data/brand-model-images/4w/ via getVehicleImageUrls.
 */
function useResolvedCarImage(car: Car) {
    const category = (car.vehicleCategory ?? '4w') as '2w' | '3w' | '4w';
    const urls = getVehicleImageUrls(
        category,
        brandNameToId(car.make, category),
        car.model,
        car.images.hero,
    );
    return urls;
}

/** Small image component with fallback cycling & unoptimized flag */
function CarImage({ car, fill, className, sizes }: {
    car: Car;
    fill?: boolean;
    className?: string;
    sizes?: string;
}) {
    const urls = useResolvedCarImage(car);
    const [idx, setIdx] = useState(0);

    const src = urls[idx] ?? null;

    if (!src) {
        return (
            <div className="flex items-center justify-center h-full">
                <CarIcon className="w-8 h-8 text-muted-foreground" />
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={`${car.make} ${car.model}`}
            fill={fill}
            unoptimized
            sizes={sizes}
            className={className}
            onError={() => {
                if (idx < urls.length - 1) {
                    setIdx((prev) => prev + 1);
                }
            }}
        />
    );
}

/** Smaller thumbnail variant for search results */
function CarThumbnail({ car }: { car: Car }) {
    const urls = useResolvedCarImage(car);
    const [idx, setIdx] = useState(0);

    const src = urls[idx] ?? null;

    if (!src) {
        return (
            <div className="flex items-center justify-center h-full">
                <CarIcon className="w-4 h-4 text-muted-foreground" />
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt=""
            fill
            unoptimized
            className="object-cover"
            onError={() => {
                if (idx < urls.length - 1) {
                    setIdx((prev) => prev + 1);
                }
            }}
        />
    );
}

export function ComparePageContent() {
    const [selectedCars, setSelectedCars] = useState<Car[]>([]);
    const [searchResults, setSearchResults] = useState<Car[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSlot, setActiveSlot] = useState<number | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    // Search cars
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`/api/cars?searchQuery=${encodeURIComponent(searchQuery)}&limit=10`);
                const data = await res.json();
                if (data.success) {
                    // Filter out already selected cars
                    const selectedIds = new Set(selectedCars.map(c => c.id));
                    setSearchResults(data.data.cars.filter((c: Car) => !selectedIds.has(c.id)));
                }
            } catch {
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedCars]);

    const addCar = (car: Car) => {
        if (selectedCars.length < MAX_COMPARE) {
            setSelectedCars([...selectedCars, car]);
        }
        setSearchQuery('');
        setSearchResults([]);
        setActiveSlot(null);
    };

    const removeCar = (index: number) => {
        setSelectedCars(selectedCars.filter((_, i) => i !== index));
    };

    const getWinner = (spec: CompareSpec): number | null => {
        if (!spec.getNumeric || selectedCars.length < 2) return null;
        const values = selectedCars.map(c => spec.getNumeric!(c));
        const validValues = values.filter((v): v is number => v !== null && v > 0);
        if (validValues.length < 2) return null;

        const best = spec.higherIsBetter
            ? Math.max(...validValues)
            : Math.min(...validValues);
        const idx = values.indexOf(best);
        return idx >= 0 ? idx : null;
    };

    // Group specs by category
    const categories = Array.from(new Set(COMPARE_SPECS.map(s => s.category)));

    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-foreground font-medium">Compare Cars</span>
                </nav>

                <h1 className="text-3xl font-bold tracking-tight mb-2">Compare Cars</h1>
                <p className="text-muted-foreground mb-8">
                    Select up to {MAX_COMPARE} cars to compare side by side
                </p>

                {/* Car Selection Slots */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {Array.from({ length: MAX_COMPARE }).map((_, idx) => {
                        const car = selectedCars[idx];

                        if (car) {
                            return (
                                <Card key={car.id} className="relative group">
                                    <button
                                        onClick={() => removeCar(idx)}
                                        className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                    <CardContent className="p-3 text-center">
                                        <div className="relative aspect-[16/10] bg-muted rounded-lg overflow-hidden mb-2">
                                            <CarImage
                                                car={car}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                            />
                                        </div>
                                        <div className="flex items-center justify-center gap-1">
                                            {getBrandLogo(car.make) && (
                                                <Image src={getBrandLogo(car.make)!} alt={car.make} width={14} height={14} unoptimized className="object-contain" />
                                            )}
                                            <p className="text-xs text-muted-foreground">{car.make}</p>
                                        </div>
                                        <p className="text-sm font-semibold line-clamp-1">{car.model}</p>
                                        <p className="text-xs font-medium text-primary mt-0.5">
                                            {formatPriceInLakhs(car.pricing.exShowroom.min)}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        }

                        return (
                            <Card
                                key={`slot-${idx}`}
                                className={`border-dashed cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors ${
                                    activeSlot === idx ? 'border-primary bg-muted/30' : ''
                                }`}
                                onClick={() => setActiveSlot(idx)}
                            >
                                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[160px]">
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
                                        <Plus className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">Add Car</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Search Box */}
                {(activeSlot !== null || selectedCars.length < MAX_COMPARE) && (
                    <Card className="mb-8">
                        <CardContent className="p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search for a car to add... (e.g., Hyundai Creta, Tata Nexon)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                    autoFocus={activeSlot !== null}
                                />
                            </div>

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="mt-3 space-y-1 max-h-60 overflow-y-auto">
                                    {searchResults.map((car) => (
                                        <button
                                            key={car.id}
                                            onClick={() => addCar(car)}
                                            className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left"
                                        >
                                            <div className="relative w-12 h-8 bg-muted rounded overflow-hidden shrink-0">
                                                <CarThumbnail car={car} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium flex items-center gap-1.5">
                                                    {getBrandLogo(car.make) && (
                                                        <Image src={getBrandLogo(car.make)!} alt={car.make} width={16} height={16} unoptimized className="object-contain shrink-0" />
                                                    )}
                                                    {car.make} {car.model}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{formatPriceInLakhs(car.pricing.exShowroom.min)}</p>
                                            </div>
                                            <Plus className="w-4 h-4 text-muted-foreground shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {isSearching && (
                                <p className="text-xs text-muted-foreground mt-3 text-center">Searching...</p>
                            )}

                            {searchQuery && !isSearching && searchResults.length === 0 && (
                                <p className="text-xs text-muted-foreground mt-3 text-center">No cars found</p>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Comparison Table */}
                {selectedCars.length >= 2 && (
                    <div className="overflow-x-auto">
                        <div className="min-w-[600px]">
                            {categories.map((category) => {
                                const specs = COMPARE_SPECS.filter(s => s.category === category);
                                return (
                                    <div key={category} className="mb-6">
                                        <div className="bg-muted/50 px-4 py-2.5 rounded-t-lg">
                                            <h3 className="text-sm font-semibold">{category}</h3>
                                        </div>
                                        <Card className="rounded-t-none border-t-0">
                                            <CardContent className="p-0">
                                                {specs.map((spec, specIdx) => {
                                                    const winner = getWinner(spec);
                                                    return (
                                                        <div
                                                            key={spec.label}
                                                            className={`grid gap-0 ${specIdx < specs.length - 1 ? 'border-b' : ''}`}
                                                            style={{
                                                                gridTemplateColumns: `180px repeat(${selectedCars.length}, 1fr)`,
                                                            }}
                                                        >
                                                            <div className="px-4 py-3 text-sm text-muted-foreground bg-muted/20 flex items-center">
                                                                {spec.label}
                                                            </div>
                                                            {selectedCars.map((car, carIdx) => {
                                                                const isWinner = winner === carIdx;
                                                                return (
                                                                    <div
                                                                        key={car.id}
                                                                        className={`px-4 py-3 text-sm font-medium flex items-center gap-1.5 ${
                                                                            isWinner ? 'text-primary bg-amber-500/5' : ''
                                                                        } ${carIdx < selectedCars.length - 1 ? 'border-r' : ''}`}
                                                                    >
                                                                        {isWinner && <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                                                                        {spec.getValue(car)}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    );
                                                })}
                                            </CardContent>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {selectedCars.length < 2 && (
                    <Card className="p-12 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-4">
                            <CarIcon className="w-10 h-10 text-primary/60" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Select Cars to Compare</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                            Add at least 2 cars using the search above to see a detailed side-by-side comparison of price, specs, features, and safety.
                        </p>
                        <Link href="/cars">
                            <Button variant="outline" className="mt-4">
                                Browse Cars <ArrowRight className="w-4 h-4 ml-1.5" />
                            </Button>
                        </Link>
                    </Card>
                )}
            </div>
        </div>
    );
}

/**
 * Car Filters Component
 * Polished filter sidebar with shadcn/ui
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
import { X } from 'lucide-react';
import { FOUR_W_BODY_TYPES } from '@/lib/data/four-wheelers';

interface CarFiltersProps {
    className?: string;
    onFilterChange?: (filters: any) => void;
    hideBrand?: boolean;
    showUsedCarFilters?: boolean;
}

const PRICE_MAX_DEFAULT = 100_000_000; // ₹10 Cr
const PRICE_SLIDER_MAX = 100_000_000; // ₹10 Cr
const PRICE_STEP = 100_000; // ₹1 Lakh steps
const KM_MAX_DEFAULT = 200_000;
const KM_STEP = 5_000;

export function CarFilters({ className, onFilterChange, hideBrand = false, showUsedCarFilters = false }: CarFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [priceRange, setPriceRange] = useState<[number, number]>([0, PRICE_MAX_DEFAULT]);
    const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
    const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([]);
    const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
    const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
    const [selectedYears, setSelectedYears] = useState<string[]>([]);
    const [selectedSeating, setSelectedSeating] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
    const [kmRange, setKmRange] = useState<[number, number]>([0, KM_MAX_DEFAULT]);
    const [availableMakes, setAvailableMakes] = useState<string[]>([]);

    useEffect(() => {
        fetch('/api/brands')
            .then(r => r.json())
            .then(data => { if (data.success) setAvailableMakes(data.makes); })
            .catch(() => {});
    }, []);

    const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
    const TRANSMISSIONS = ['Manual', 'Automatic', 'AMT', 'CVT', 'DCT'];
    const YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];
    const SEATING = ['2', '4', '5', '6', '7', '8+'];
    const COLORS = [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#1a1a1a' },
        { name: 'Silver', hex: '#C0C0C0' },
        { name: 'Grey', hex: '#808080' },
        { name: 'Red', hex: '#DC2626' },
        { name: 'Blue', hex: '#2563EB' },
        { name: 'Brown', hex: '#92400E' },
        { name: 'Green', hex: '#16A34A' },
        { name: 'Orange', hex: '#EA580C' },
        { name: 'Yellow', hex: '#CA8A04' },
    ];
    const OWNERS = ['1st Owner', '2nd Owner', '3rd Owner', '4th+ Owner'];

    // Sync from URL params
    useEffect(() => {
        const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : 0;
        const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : PRICE_MAX_DEFAULT;
        setPriceRange([minPrice, maxPrice]);

        const makes = searchParams.get('make')?.split(',').filter(Boolean) || [];
        setSelectedMakes(makes);

        const body = searchParams.get('bodyType')?.split(',').filter(Boolean) || [];
        setSelectedBodyTypes(body);

        const fuel = searchParams.get('fuelType')?.split(',').filter(Boolean) || [];
        setSelectedFuelTypes(fuel);

        const trans = searchParams.get('transmission')?.split(',').filter(Boolean) || [];
        setSelectedTransmissions(trans);

        const years = searchParams.get('year')?.split(',').filter(Boolean) || [];
        setSelectedYears(years);

        const seating = searchParams.get('seating')?.split(',').filter(Boolean) || [];
        setSelectedSeating(seating);

        const colors = searchParams.get('color')?.split(',').filter(Boolean) || [];
        setSelectedColors(colors);

        const owners = searchParams.get('owners')?.split(',').filter(Boolean) || [];
        setSelectedOwners(owners);

        const minKm = searchParams.get('minKm') ? parseInt(searchParams.get('minKm')!) : 0;
        const maxKm = searchParams.get('maxKm') ? parseInt(searchParams.get('maxKm')!) : KM_MAX_DEFAULT;
        setKmRange([minKm, maxKm]);
        return;
    }, [searchParams]);

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (selectedMakes.length > 0) params.set('make', selectedMakes.join(','));
        else params.delete('make');

        if (selectedBodyTypes.length > 0) params.set('bodyType', selectedBodyTypes.join(','));
        else params.delete('bodyType');

        if (selectedFuelTypes.length > 0) params.set('fuelType', selectedFuelTypes.join(','));
        else params.delete('fuelType');

        if (selectedTransmissions.length > 0) params.set('transmission', selectedTransmissions.join(','));
        else params.delete('transmission');

        if (selectedYears.length > 0) params.set('year', selectedYears.join(','));
        else params.delete('year');

        if (selectedSeating.length > 0) params.set('seating', selectedSeating.join(','));
        else params.delete('seating');

        if (selectedColors.length > 0) params.set('color', selectedColors.join(','));
        else params.delete('color');

        if (selectedOwners.length > 0) params.set('owners', selectedOwners.join(','));
        else params.delete('owners');

        params.set('minPrice', priceRange[0].toString());
        params.set('maxPrice', priceRange[1].toString());

        if (showUsedCarFilters) {
            params.set('minKm', kmRange[0].toString());
            params.set('maxKm', kmRange[1].toString());
        }

        params.set('page', '1');

        router.push(`?${params.toString()}`);

        if (onFilterChange) {
            onFilterChange({
                make: selectedMakes,
                bodyType: selectedBodyTypes,
                fuelType: selectedFuelTypes,
                transmission: selectedTransmissions,
                year: selectedYears,
                seating: selectedSeating,
                color: selectedColors,
                owners: selectedOwners,
                priceRange: { min: priceRange[0], max: priceRange[1] },
                kmRange: { min: kmRange[0], max: kmRange[1] },
            });
        }
    };

    const clearFilters = () => {
        setPriceRange([0, PRICE_MAX_DEFAULT]);
        setSelectedMakes([]);
        setSelectedBodyTypes([]);
        setSelectedFuelTypes([]);
        setSelectedTransmissions([]);
        setSelectedYears([]);
        setSelectedSeating([]);
        setSelectedColors([]);
        setSelectedOwners([]);
        setKmRange([0, KM_MAX_DEFAULT]);
        router.push('?');
    };

    const toggleItem = (item: string, array: string[], setArray: (val: string[]) => void) => {
        setArray(array.includes(item) ? array.filter(i => i !== item) : [...array, item]);
    };

    const totalActive = selectedMakes.length + selectedBodyTypes.length + selectedFuelTypes.length + selectedTransmissions.length +
        selectedYears.length + selectedSeating.length + selectedColors.length + selectedOwners.length +
        (priceRange[0] > 0 || priceRange[1] < PRICE_MAX_DEFAULT ? 1 : 0) +
        (showUsedCarFilters && (kmRange[0] > 0 || kmRange[1] < KM_MAX_DEFAULT) ? 1 : 0);

    return (
        <Card className={cn('overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-200 bg-white dark:bg-white shadow-sm', className)}>
            <CardHeader className="pb-3 pt-5 px-5 bg-gradient-to-b from-gray-50 to-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900">Filters</h3>
                        {totalActive > 0 && (
                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-gray-900 dark:bg-gray-900 text-white dark:text-white hover:bg-gray-900 dark:hover:bg-gray-900">
                                {totalActive}
                            </Badge>
                        )}
                    </div>
                    {totalActive > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2.5 rounded-lg">
                            <X className="w-3 h-3 mr-1" /> Clear
                        </Button>
                    )}
                </div>
            </CardHeader>

            <Separator />

            <CardContent className="px-5 pt-3 pb-5">
                <Accordion type="multiple" defaultValue={['price', 'make', 'bodyType']} className="w-full">
                    {/* Price Range */}
                    <AccordionItem value="price" className="border-b-0">
                        <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
                            Price Range
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-gray-900">{formatPriceInLakhs(priceRange[0])}</span>
                                <span className="text-xs text-gray-400">to</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {priceRange[1] >= PRICE_SLIDER_MAX ? '₹10 Cr+' : formatPriceInLakhs(priceRange[1])}
                                </span>
                            </div>
                            <Slider
                                value={priceRange}
                                min={0}
                                max={PRICE_SLIDER_MAX}
                                step={PRICE_STEP}
                                onValueChange={(val) => setPriceRange(val as [number, number])}
                                className="mb-4"
                            />
                            {/* Quick preset buttons */}
                            <div className="flex flex-wrap gap-1.5">
                                {[
                                    { label: 'Under 5 L', min: 0, max: 500_000 },
                                    { label: 'Under 10 L', min: 0, max: 1_000_000 },
                                    { label: '10-20 L', min: 1_000_000, max: 2_000_000 },
                                    { label: '20-50 L', min: 2_000_000, max: 5_000_000 },
                                    { label: '50 L-1 Cr', min: 5_000_000, max: 10_000_000 },
                                    { label: '1-5 Cr', min: 10_000_000, max: 50_000_000 },
                                    { label: 'All', min: 0, max: PRICE_SLIDER_MAX },
                                ].map((p) => (
                                    <button
                                        key={p.label}
                                        onClick={() => setPriceRange([p.min, p.max])}
                                        className={cn(
                                            'text-[11px] px-2 py-1 rounded-md border transition-colors',
                                            priceRange[0] === p.min && priceRange[1] === p.max
                                                ? 'bg-gray-900 text-white border-gray-900'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                                        )}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Brand */}
                    {!hideBrand && (
                        <AccordionItem value="make" className="border-b-0">
                            <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
                                <span className="flex items-center gap-2">
                                    Brand
                                    {selectedMakes.length > 0 && (
                                        <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-gray-100 dark:bg-gray-100 text-gray-700 dark:text-gray-700">{selectedMakes.length}</Badge>
                                    )}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                                <ScrollArea className="h-48 pr-3">
                                    <div className="space-y-2.5">
                                        {availableMakes.map((make) => (
                                            <div key={make} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`make-${make}`}
                                                    checked={selectedMakes.includes(make)}
                                                    onCheckedChange={() => toggleItem(make, selectedMakes, setSelectedMakes)}
                                                />
                                                <Label htmlFor={`make-${make}`} className="text-sm font-normal cursor-pointer">{make}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {/* Body Type */}
                    <AccordionItem value="bodyType" className="border-b-0">
                        <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
                            <span className="flex items-center gap-2">
                                Body Type
                                {selectedBodyTypes.length > 0 && (
                                        <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-gray-100 dark:bg-gray-100 text-gray-700 dark:text-gray-700">{selectedBodyTypes.length}</Badge>
                                )}
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                            <div className="space-y-2.5">
                                {FOUR_W_BODY_TYPES.map((type) => (
                                    <div key={type} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`body-${type}`}
                                            checked={selectedBodyTypes.includes(type)}
                                            onCheckedChange={() => toggleItem(type, selectedBodyTypes, setSelectedBodyTypes)}
                                        />
                                        <Label htmlFor={`body-${type}`} className="text-sm font-normal cursor-pointer">{type}</Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Fuel Type */}
                    <AccordionItem value="fuel" className="border-b-0">
                        <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
                            <span className="flex items-center gap-2">
                                Fuel Type
                                {selectedFuelTypes.length > 0 && (
                                        <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-gray-100 dark:bg-gray-100 text-gray-700 dark:text-gray-700">{selectedFuelTypes.length}</Badge>
                                )}
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                            <div className="space-y-2.5">
                                {FUEL_TYPES.map((type) => (
                                    <div key={type} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`fuel-${type}`}
                                            checked={selectedFuelTypes.includes(type)}
                                            onCheckedChange={() => toggleItem(type, selectedFuelTypes, setSelectedFuelTypes)}
                                        />
                                        <Label htmlFor={`fuel-${type}`} className="text-sm font-normal cursor-pointer">{type}</Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Transmission */}
                    <AccordionItem value="transmission" className="border-b-0">
                        <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
                            <span className="flex items-center gap-2">
                                Transmission
                                {selectedTransmissions.length > 0 && (
                                        <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-gray-100 dark:bg-gray-100 text-gray-700 dark:text-gray-700">{selectedTransmissions.length}</Badge>
                                )}
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                            <div className="space-y-2.5">
                                {TRANSMISSIONS.map((type) => (
                                    <div key={type} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`trans-${type}`}
                                            checked={selectedTransmissions.includes(type)}
                                            onCheckedChange={() => toggleItem(type, selectedTransmissions, setSelectedTransmissions)}
                                        />
                                        <Label htmlFor={`trans-${type}`} className="text-sm font-normal cursor-pointer">{type}</Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Year */}
                    <AccordionItem value="year" className="border-b-0">
                        <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
                            <span className="flex items-center gap-2">
                                Year
                                {selectedYears.length > 0 && (
                                        <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-gray-100 dark:bg-gray-100 text-gray-700 dark:text-gray-700">{selectedYears.length}</Badge>
                                )}
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                            <div className="flex flex-wrap gap-2">
                                {YEARS.map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => toggleItem(year, selectedYears, setSelectedYears)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                                            selectedYears.includes(year)
                                                ? 'bg-gray-900 text-white border-gray-900'
                                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Seating Capacity */}
                    <AccordionItem value="seating" className="border-b-0">
                        <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
                            <span className="flex items-center gap-2">
                                Seating Capacity
                                {selectedSeating.length > 0 && (
                                        <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-gray-100 dark:bg-gray-100 text-gray-700 dark:text-gray-700">{selectedSeating.length}</Badge>
                                )}
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                            <div className="flex flex-wrap gap-2">
                                {SEATING.map((seats) => (
                                    <button
                                        key={seats}
                                        onClick={() => toggleItem(seats, selectedSeating, setSelectedSeating)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                                            selectedSeating.includes(seats)
                                                ? 'bg-gray-900 text-white border-gray-900'
                                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        {seats} Seater
                                    </button>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Color */}
                    <AccordionItem value="color" className="border-b-0">
                        <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
                            <span className="flex items-center gap-2">
                                Color
                                {selectedColors.length > 0 && (
                                        <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-gray-100 dark:bg-gray-100 text-gray-700 dark:text-gray-700">{selectedColors.length}</Badge>
                                )}
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                            <div className="grid grid-cols-5 gap-2">
                                {COLORS.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => toggleItem(color.name, selectedColors, setSelectedColors)}
                                        className="flex flex-col items-center gap-1 group/color"
                                        title={color.name}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                                                selectedColors.includes(color.name)
                                                    ? 'border-primary scale-110 ring-2 ring-primary/30'
                                                    : 'border-gray-200 hover:scale-105'
                                            }`}
                                            style={{ backgroundColor: color.hex }}
                                        />
                                        <span className="text-[9px] text-gray-600 leading-none">{color.name}</span>
                                    </button>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* KM Driven — only for used cars */}
                    {showUsedCarFilters && (
                        <AccordionItem value="kmDriven" className="border-b-0">
                            <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
                                KM Driven
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                                <Slider
                                    value={kmRange}
                                    max={KM_MAX_DEFAULT}
                                    step={KM_STEP}
                                    onValueChange={(val) => setKmRange(val as [number, number])}
                                    className="mb-3"
                                />
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
                                        {kmRange[0].toLocaleString()} km
                                    </span>
                                    <span className="text-xs text-gray-600">to</span>
                                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
                                        {kmRange[1].toLocaleString()} km
                                    </span>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {/* Owners — only for used cars */}
                    {showUsedCarFilters && (
                        <AccordionItem value="owners" className="border-b-0">
                            <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
                                <span className="flex items-center gap-2">
                                    No. of Owners
                                    {selectedOwners.length > 0 && (
                                        <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-gray-100 dark:bg-gray-100 text-gray-700 dark:text-gray-700">{selectedOwners.length}</Badge>
                                    )}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                                <div className="space-y-2.5">
                                    {OWNERS.map((owner) => (
                                        <div key={owner} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`owner-${owner}`}
                                                checked={selectedOwners.includes(owner)}
                                                onCheckedChange={() => toggleItem(owner, selectedOwners, setSelectedOwners)}
                                            />
                                            <Label htmlFor={`owner-${owner}`} className="text-sm font-normal cursor-pointer">{owner}</Label>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                </Accordion>

                <Button className="w-full mt-5 h-11 rounded-xl text-sm font-semibold shadow-sm" size="sm" onClick={applyFilters}>
                    Apply Filters
                </Button>
            </CardContent>
        </Card>
    );
}

/**
 * Car Filters Component
 * Filter sidebar for car listing pages
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
import { getAllMakes } from '@/lib/data/cars'; // We'll use this for static generation/initial state if needed
// In a real app with API, we might fetch these available options

interface CarFiltersProps {
    className?: string;
    onFilterChange?: (filters: any) => void;
    /** Hide the Brand/Make filter — for 1st-hand dealers who sell only their own brand */
    hideBrand?: boolean;
}

export function CarFilters({ className, onFilterChange, hideBrand = false }: CarFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State for filters
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
    const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
    const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([]);
    const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
    const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);

    // Constants
    const BODY_TYPES = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Compact SUV', 'Luxury'];
    const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
    const TRANSMISSIONS = ['Manual', 'Automatic', 'AMT', 'CVT', 'DCT'];

    // Initialize from URL params
    useEffect(() => {
        const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : 0;
        const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : 5000000;
        setPriceRange([minPrice, maxPrice]);

        const makes = searchParams.get('make')?.split(',') || [];
        setSelectedMakes(makes);

        // ... similarly for others if needed
    }, [searchParams]);

    // Handle filter changes
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

        params.set('minPrice', priceRange[0].toString());
        params.set('maxPrice', priceRange[1].toString());

        // Reset pagination
        params.set('page', '1');

        router.push(`?${params.toString()}`);

        if (onFilterChange) {
            onFilterChange({
                make: selectedMakes,
                bodyType: selectedBodyTypes,
                fuelType: selectedFuelTypes,
                transmission: selectedTransmissions,
                priceRange: { min: priceRange[0], max: priceRange[1] }
            });
        }
    };

    const clearFilters = () => {
        setPriceRange([0, 5000000]);
        setSelectedMakes([]);
        setSelectedBodyTypes([]);
        setSelectedFuelTypes([]);
        setSelectedTransmissions([]);

        router.push('?'); // Clear all query params
    };

    const toggleArrayItem = (item: string, array: string[], setArray: (val: string[]) => void) => {
        if (array.includes(item)) {
            setArray(array.filter(i => i !== item));
        } else {
            setArray([...array, item]);
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-500 hover:text-red-700">
                    Clear All
                </Button>
            </div>

            <Accordion type="multiple" defaultValue={['price', 'make', 'bodyType']} className="w-full">
                {/* Price Range */}
                <AccordionItem value="price">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent className="pt-4 px-1">
                        <Slider
                            defaultValue={[0, 5000000]}
                            value={priceRange}
                            max={10000000} // 1 Cr max for slider
                            step={50000}
                            onValueChange={(val) => setPriceRange(val as [number, number])}
                            className="mb-4"
                        />
                        <div className="flex items-center justify-between text-sm">
                            <span>{formatPriceInLakhs(priceRange[0])}</span>
                            <span>{formatPriceInLakhs(priceRange[1])}</span>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Brand/Make — hidden for 1st-hand single-brand dealers */}
                {!hideBrand && (
                    <AccordionItem value="make">
                        <AccordionTrigger>Brand</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {getAllMakes().map((make) => (
                                    <div key={make} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`make-${make}`}
                                            checked={selectedMakes.includes(make)}
                                            onCheckedChange={() => toggleArrayItem(make, selectedMakes, setSelectedMakes)}
                                        />
                                        <Label htmlFor={`make-${make}`}>{make}</Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Body Type */}
                <AccordionItem value="bodyType">
                    <AccordionTrigger>Body Type</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {BODY_TYPES.map((type) => (
                                <div key={type} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`body-${type}`}
                                        checked={selectedBodyTypes.includes(type)}
                                        onCheckedChange={() => toggleArrayItem(type, selectedBodyTypes, setSelectedBodyTypes)}
                                    />
                                    <Label htmlFor={`body-${type}`}>{type}</Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Fuel Type */}
                <AccordionItem value="fuel">
                    <AccordionTrigger>Fuel Type</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {FUEL_TYPES.map((type) => (
                                <div key={type} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`fuel-${type}`}
                                        checked={selectedFuelTypes.includes(type)}
                                        onCheckedChange={() => toggleArrayItem(type, selectedFuelTypes, setSelectedFuelTypes)}
                                    />
                                    <Label htmlFor={`fuel-${type}`}>{type}</Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Transmission */}
                <AccordionItem value="transmission">
                    <AccordionTrigger>Transmission</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {TRANSMISSIONS.map((type) => (
                                <div key={type} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`trans-${type}`}
                                        checked={selectedTransmissions.includes(type)}
                                        onCheckedChange={() => toggleArrayItem(type, selectedTransmissions, setSelectedTransmissions)}
                                    />
                                    <Label htmlFor={`trans-${type}`}>{type}</Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Button className="w-full" onClick={applyFilters}>
                Apply Filters
            </Button>
        </div>
    );
}

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
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
import { getAllMakes } from '@/lib/data/cars';
import { X } from 'lucide-react';

interface CarFiltersProps {
    className?: string;
    onFilterChange?: (filters: any) => void;
    hideBrand?: boolean;
}

export function CarFilters({ className, onFilterChange, hideBrand = false }: CarFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
    const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
    const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([]);
    const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
    const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);

    const BODY_TYPES = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Compact SUV', 'Luxury'];
    const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
    const TRANSMISSIONS = ['Manual', 'Automatic', 'AMT', 'CVT', 'DCT'];

    // Sync from URL params
    useEffect(() => {
        const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : 0;
        const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : 5000000;
        setPriceRange([minPrice, maxPrice]);

        const makes = searchParams.get('make')?.split(',').filter(Boolean) || [];
        setSelectedMakes(makes);

        const body = searchParams.get('bodyType')?.split(',').filter(Boolean) || [];
        setSelectedBodyTypes(body);

        const fuel = searchParams.get('fuelType')?.split(',').filter(Boolean) || [];
        setSelectedFuelTypes(fuel);

        const trans = searchParams.get('transmission')?.split(',').filter(Boolean) || [];
        setSelectedTransmissions(trans);
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

        params.set('minPrice', priceRange[0].toString());
        params.set('maxPrice', priceRange[1].toString());
        params.set('page', '1');

        router.push(`?${params.toString()}`);

        if (onFilterChange) {
            onFilterChange({
                make: selectedMakes,
                bodyType: selectedBodyTypes,
                fuelType: selectedFuelTypes,
                transmission: selectedTransmissions,
                priceRange: { min: priceRange[0], max: priceRange[1] },
            });
        }
    };

    const clearFilters = () => {
        setPriceRange([0, 5000000]);
        setSelectedMakes([]);
        setSelectedBodyTypes([]);
        setSelectedFuelTypes([]);
        setSelectedTransmissions([]);
        router.push('?');
    };

    const toggleItem = (item: string, array: string[], setArray: (val: string[]) => void) => {
        setArray(array.includes(item) ? array.filter(i => i !== item) : [...array, item]);
    };

    const totalActive = selectedMakes.length + selectedBodyTypes.length + selectedFuelTypes.length + selectedTransmissions.length +
        (priceRange[0] > 0 || priceRange[1] < 5000000 ? 1 : 0);

    return (
        <Card className={className}>
            <CardHeader className="pb-3 pt-4 px-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold">Filters</h3>
                        {totalActive > 0 && (
                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                                {totalActive}
                            </Badge>
                        )}
                    </div>
                    {totalActive > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-destructive hover:text-destructive h-7 px-2">
                            <X className="w-3 h-3 mr-1" /> Clear
                        </Button>
                    )}
                </div>
            </CardHeader>

            <Separator />

            <CardContent className="px-4 pt-2 pb-4">
                <Accordion type="multiple" defaultValue={['price', 'make', 'bodyType']} className="w-full">
                    {/* Price Range */}
                    <AccordionItem value="price" className="border-b-0">
                        <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
                            Price Range
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                            <Slider
                                value={priceRange}
                                max={10000000}
                                step={50000}
                                onValueChange={(val) => setPriceRange(val as [number, number])}
                                className="mb-3"
                            />
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium px-2 py-1 bg-muted rounded-md">{formatPriceInLakhs(priceRange[0])}</span>
                                <span className="text-xs text-muted-foreground">to</span>
                                <span className="text-xs font-medium px-2 py-1 bg-muted rounded-md">{formatPriceInLakhs(priceRange[1])}</span>
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
                                        <Badge variant="secondary" className="text-[10px] h-4 px-1">{selectedMakes.length}</Badge>
                                    )}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                                <ScrollArea className="h-48 pr-3">
                                    <div className="space-y-2.5">
                                        {getAllMakes().map((make) => (
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
                                    <Badge variant="secondary" className="text-[10px] h-4 px-1">{selectedBodyTypes.length}</Badge>
                                )}
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                            <div className="space-y-2.5">
                                {BODY_TYPES.map((type) => (
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
                                    <Badge variant="secondary" className="text-[10px] h-4 px-1">{selectedFuelTypes.length}</Badge>
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
                                    <Badge variant="secondary" className="text-[10px] h-4 px-1">{selectedTransmissions.length}</Badge>
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
                </Accordion>

                <Button className="w-full mt-4" size="sm" onClick={applyFilters}>
                    Apply Filters
                </Button>
            </CardContent>
        </Card>
    );
}

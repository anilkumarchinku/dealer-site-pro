/**
 * Shared inventory-filter logic for the dealer-site templates.
 * (Previously duplicated verbatim in Modern/Luxury/Sporty/Family.)
 *
 * A car's engine.type / transmission.type can be a joined string (e.g.
 * "Petrol / Diesel" or "Manual / Auto"). We split on " / " so a multi-value car
 * matches any selected option, and normalize the Auto/Automatic alias both ways.
 */
import type { Car } from '@/lib/types/car';

export interface ActiveFilters {
    make?: string[];
    bodyType?: string[];
    fuelType?: string[];
    transmission?: string[];
    year?: string[];
    seating?: string[];
    priceRange?: { min: number; max: number };
}

export function normalizeTransmission(value: string): string {
    const v = value.trim().toLowerCase();
    if (v === 'auto' || v === 'automatic') return 'automatic';
    return v;
}

export function matchesFuel(carFuel: string, selected: string[]): boolean {
    const carValues = carFuel.split(' / ').map(s => s.trim().toLowerCase());
    return selected.some(sel => carValues.includes(sel.trim().toLowerCase()));
}

export function matchesTransmission(carTransmission: string, selected: string[]): boolean {
    const carValues = carTransmission.split(' / ').map(normalizeTransmission);
    return selected.some(sel => carValues.includes(normalizeTransmission(sel)));
}

/**
 * Apply the active CarFilters selections to a car list. Returns the input
 * unchanged when no filters are set. Pure — safe to call inside a useMemo.
 */
export function filterCars(cars: Car[], activeFilters: ActiveFilters | null): Car[] {
    if (!activeFilters) return cars;
    let result = cars;
    const { make, bodyType, fuelType, transmission, year, seating, priceRange } = activeFilters;
    if (make?.length) result = result.filter(c => make.includes(c.make));
    if (bodyType?.length) result = result.filter(c => bodyType.includes(c.bodyType));
    if (fuelType?.length) result = result.filter(c => matchesFuel(c.engine.type, fuelType));
    if (transmission?.length) result = result.filter(c => matchesTransmission(c.transmission.type, transmission));
    if (year?.length) result = result.filter(c => year.includes(c.year.toString()));
    if (seating?.length) result = result.filter(c => seating.includes(String(c.dimensions?.seatingCapacity ?? '')));
    if (priceRange) result = result.filter(c => {
        const p = c.pricing?.exShowroom?.min ?? 0;
        return p >= priceRange.min && p <= priceRange.max;
    });
    return result;
}

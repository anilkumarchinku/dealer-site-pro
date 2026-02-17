/**
 * Car Data Utilities
 * Helper functions for working with car data
 */

import type { Car, CarFilters, FuelType, BodyType, TransmissionType } from '@/lib/types/car';

/**
 * Generate unique car ID from make, model, and variant
 */
export function generateCarId(make: string, model: string, variant: string): string {
    const slug = `${make}-${model}-${variant}`
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    return slug;
}

/**
 * Format price to Indian currency
 */
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
}

/**
 * Format price in lakhs (Indian numbering system)
 */
export function formatPriceInLakhs(price: number): string {
    const lakhs = price / 100000;
    if (lakhs >= 1) {
        return `₹${lakhs.toFixed(2)} Lakh${lakhs > 1 ? 's' : ''}`;
    }
    return formatPrice(price);
}

/**
 * Get price range display string
 */
export function getPriceRangeDisplay(min: number, max: number): string {
    const minLakhs = min / 100000;
    const maxLakhs = max / 100000;

    if (minLakhs === maxLakhs) {
        return `₹${minLakhs.toFixed(2)} Lakh`;
    }

    return `₹${minLakhs.toFixed(2)} - ${maxLakhs.toFixed(2)} Lakh`;
}

/**
 * Calculate monthly EMI
 * Formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
 */
export function calculateEMI(
    principal: number,
    annualRate: number = 9.5, // Default 9.5% per annum
    tenureMonths: number = 60  // Default 5 years
): number {
    const monthlyRate = annualRate / 12 / 100;
    const emi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    return Math.round(emi);
}

/**
 * Get fuel type icon emoji
 */
export function getFuelTypeIcon(fuelType: FuelType): string {
    const icons: Record<FuelType, string> = {
        'Petrol': '⛽',
        'Diesel': '🛢️',
        'Electric': '⚡',
        'Hybrid': '🔋',
        'CNG': '🌱',
        'Petrol+CNG': '⛽🌱',
    };

    return icons[fuelType] || '⛽';
}

/**
 * Get body type icon emoji
 */
export function getBodyTypeIcon(bodyType: BodyType): string {
    const icons: Record<BodyType, string> = {
        'Hatchback': '🚗',
        'Sedan': '🚙',
        'SUV': '🚙',
        'MPV': '🚐',
        'Coupe': '🏎️',
        'Convertible': '🏎️',
        'Pickup': '🛻',
        'Van': '🚐',
    };

    return icons[bodyType] || '🚗';
}

/**
 * Get transmission icon emoji
 */
export function getTransmissionIcon(transmission: TransmissionType): string {
    const manual = '🔧';
    const automatic = '⚙️';

    return transmission === 'Manual' ? manual : automatic;
}

/**
 * Filter cars based on criteria
 */
export function filterCars(cars: Car[], filters: CarFilters): Car[] {
    let filtered = [...cars];

    // Filter by make
    if (filters.make) {
        const makes = Array.isArray(filters.make) ? filters.make : [filters.make];
        filtered = filtered.filter(car => makes.includes(car.make));
    }

    // Filter by body type
    if (filters.bodyType) {
        const types = Array.isArray(filters.bodyType) ? filters.bodyType : [filters.bodyType];
        filtered = filtered.filter(car => types.includes(car.bodyType));
    }

    // Filter by fuel type
    if (filters.fuelType) {
        const fuels = Array.isArray(filters.fuelType) ? filters.fuelType : [filters.fuelType];
        filtered = filtered.filter(car => fuels.includes(car.engine.type));
    }

    // Filter by transmission
    if (filters.transmission) {
        const transmissions = Array.isArray(filters.transmission) ? filters.transmission : [filters.transmission];
        filtered = filtered.filter(car => transmissions.includes(car.transmission.type));
    }

    // Filter by segment
    if (filters.segment) {
        const segments = Array.isArray(filters.segment) ? filters.segment : [filters.segment];
        filtered = filtered.filter(car => segments.includes(car.segment));
    }

    // Filter by price range
    if (filters.priceRange) {
        filtered = filtered.filter(car =>
            car.pricing.exShowroom.min >= filters.priceRange!.min &&
            car.pricing.exShowroom.max <= filters.priceRange!.max
        );
    }

    // Filter by seating capacity
    if (filters.seatingCapacity) {
        const capacities = Array.isArray(filters.seatingCapacity)
            ? filters.seatingCapacity
            : [filters.seatingCapacity];
        filtered = filtered.filter(car => capacities.includes(car.dimensions.seatingCapacity));
    }

    // Sort results
    if (filters.sortBy) {
        filtered = sortCars(filtered, filters.sortBy);
    }

    // Pagination
    if (filters.offset !== undefined && filters.limit !== undefined) {
        filtered = filtered.slice(filters.offset, filters.offset + filters.limit);
    } else if (filters.limit !== undefined) {
        filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
}

/**
 * Sort cars by criteria
 */
export function sortCars(
    cars: Car[],
    sortBy: 'price_asc' | 'price_desc' | 'popularity' | 'rating' | 'launch_date' | 'fuel_efficiency'
): Car[] {
    const sorted = [...cars];

    switch (sortBy) {
        case 'price_asc':
            return sorted.sort((a, b) => a.pricing.exShowroom.min - b.pricing.exShowroom.min);

        case 'price_desc':
            return sorted.sort((a, b) => b.pricing.exShowroom.min - a.pricing.exShowroom.min);

        case 'popularity':
            return sorted.sort((a, b) => (b.meta.popularityScore || 0) - (a.meta.popularityScore || 0));

        case 'rating':
            return sorted.sort((a, b) => (b.rating?.overall || 0) - (a.rating?.overall || 0));

        case 'launch_date':
            return sorted.sort((a, b) => {
                const dateA = a.meta.launchDate ? new Date(a.meta.launchDate).getTime() : 0;
                const dateB = b.meta.launchDate ? new Date(b.meta.launchDate).getTime() : 0;
                return dateB - dateA;
            });

        case 'fuel_efficiency':
            return sorted.sort((a, b) => (b.performance.fuelEfficiency || 0) - (a.performance.fuelEfficiency || 0));

        default:
            return sorted;
    }
}

/**
 * Search cars by query string
 */
export function searchCars(cars: Car[], query: string): Car[] {
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) return cars;

    return cars.filter(car =>
        car.make.toLowerCase().includes(lowerQuery) ||
        car.model.toLowerCase().includes(lowerQuery) ||
        car.variant.toLowerCase().includes(lowerQuery) ||
        car.bodyType.toLowerCase().includes(lowerQuery) ||
        car.engine.type.toLowerCase().includes(lowerQuery)
    );
}

/**
 * Get unique values for filter options
 */
export function getUniqueFilterOptions(cars: Car[]) {
    return {
        makes: Array.from(new Set(cars.map(car => car.make))).sort(),
        bodyTypes: Array.from(new Set(cars.map(car => car.bodyType))).sort(),
        fuelTypes: Array.from(new Set(cars.map(car => car.engine.type))).sort(),
        transmissions: Array.from(new Set(cars.map(car => car.transmission.type))).sort(),
        segments: Array.from(new Set(cars.map(car => car.segment))).sort(),
        seatingCapacities: Array.from(new Set(cars.map(car => car.dimensions.seatingCapacity))).sort((a, b) => a - b),
        priceRange: {
            min: Math.min(...cars.map(car => car.pricing.exShowroom.min)),
            max: Math.max(...cars.map(car => car.pricing.exShowroom.max)),
        },
    };
}

/**
 * Get recommended cars based on budget
 */
export function getRecommendedByBudget(cars: Car[], budget: number): Car[] {
    const variance = budget * 0.15; // 15% variance

    return cars
        .filter(car =>
            car.pricing.exShowroom.min >= budget - variance &&
            car.pricing.exShowroom.min <= budget + variance
        )
        .sort((a, b) => (b.rating?.overall || 0) - (a.rating?.overall || 0))
        .slice(0, 6);
}

/**
 * Get similar cars (same segment and price range)
 */
export function getSimilarCars(car: Car, allCars: Car[], limit: number = 4): Car[] {
    const priceVariance = 200000; // ₹2 lakh variance

    return allCars
        .filter(c =>
            c.id !== car.id &&
            c.segment === car.segment &&
            Math.abs(c.pricing.exShowroom.min - car.pricing.exShowroom.min) <= priceVariance
        )
        .sort((a, b) => (b.meta.popularityScore || 0) - (a.meta.popularityScore || 0))
        .slice(0, limit);
}

/**
 * Format mileage display
 */
export function formatMileage(mileage: number, fuelType: FuelType): string {
    if (fuelType === 'Electric') {
        return `${mileage} km/kWh`;
    }
    return `${mileage} km/l`;
}

/**
 * Get car summary for display
 */
export function getCarSummary(car: Car): string {
    const parts = [
        car.engine.type,
        car.transmission.type,
        `${car.dimensions.seatingCapacity}-Seater`,
    ];

    if (car.performance.fuelEfficiency) {
        parts.push(formatMileage(car.performance.fuelEfficiency, car.engine.type));
    }

    return parts.join(' • ');
}

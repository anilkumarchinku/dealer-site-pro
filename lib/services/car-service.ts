/**
 * Car Service
 * Business logic for car data operations
 */

import type { Car, CarFilters, CarSearchResult } from '@/lib/types/car';
import { allCars, getCarById as getById, getCarsByMake as getByMake } from '@/lib/data/cars';
import { filterCars, searchCars, sortCars } from '@/lib/utils/car-utils';

/**
 * Get all cars with optional filters
 */
export async function getAllCars(filters?: CarFilters): Promise<CarSearchResult> {
    let cars = [...allCars];

    // Apply search query if provided
    if (filters?.searchQuery) {
        cars = searchCars(cars, filters.searchQuery);
    }

    // Apply filters
    if (filters) {
        cars = filterCars(cars, filters);
    }

    const total = cars.length;
    const page = Math.floor((filters?.offset || 0) / (filters?.limit || 10)) + 1;
    const pageSize = filters?.limit || 10;

    return {
        cars,
        total,
        page,
        pageSize,
        filters: filters || {},
    };
}

/**
 * Get single car by ID
 */
export async function getCarById(id: string): Promise<Car | null> {
    return getById(id) || null;
}

/**
 * Get cars by brand/make
 */
export async function getCarsByMake(make: string): Promise<Car[]> {
    return getByMake(make);
}

/**
 * Get featured cars
 */
export async function getFeaturedCars(limit: number = 6): Promise<Car[]> {
    return allCars
        .filter(car => car.meta.popularityScore && car.meta.popularityScore >= 8)
        .sort((a, b) => (b.meta.popularityScore || 0) - (a.meta.popularityScore || 0))
        .slice(0, limit);
}

/**
 * Get latest car launches
 */
export async function getLatestCars(limit: number = 8): Promise<Car[]> {
    return allCars
        .filter(car => car.meta.launchDate)
        .sort((a, b) => {
            const dateA = new Date(a.meta.launchDate!).getTime();
            const dateB = new Date(b.meta.launchDate!).getTime();
            return dateB - dateA;
        })
        .slice(0, limit);
}

/**
 * Get similar cars based on segment and price
 */
export async function getSimilarCars(carId: string, limit: number = 4): Promise<Car[]> {
    const car = getById(carId);
    if (!car) return [];

    const priceVariance = 200000; // ₹2L variance

    return allCars
        .filter(c =>
            c.id !== carId &&
            c.segment === car.segment &&
            Math.abs(c.pricing.exShowroom.min - car.pricing.exShowroom.min) <= priceVariance
        )
        .sort((a, b) => (b.meta.popularityScore || 0) - (a.meta.popularityScore || 0))
        .slice(0, limit);
}

/**
 * Compare multiple cars
 */
export async function compareCars(carIds: string[]): Promise<Car[]> {
    return carIds
        .map(id => getById(id))
        .filter((car): car is Car => car !== undefined);
}

/**
 * Get cars by budget range
 */
export async function getCarsByBudget(
    minBudget: number,
    maxBudget: number,
    limit: number = 10
): Promise<Car[]> {
    return allCars
        .filter(car =>
            car.pricing.exShowroom.min >= minBudget &&
            car.pricing.exShowroom.min <= maxBudget
        )
        .sort((a, b) => (b.rating?.overall || 0) - (a.rating?.overall || 0))
        .slice(0, limit);
}

/**
 * Get top rated cars
 */
export async function getTopRatedCars(limit: number = 10): Promise<Car[]> {
    return allCars
        .filter(car => car.rating)
        .sort((a, b) => (b.rating?.overall || 0) - (a.rating?.overall || 0))
        .slice(0, limit);
}

/**
 * Get cars by body type
 */
export async function getCarsByBodyType(bodyType: string, limit?: number): Promise<Car[]> {
    const filtered = allCars.filter(car =>
        car.bodyType.toLowerCase() === bodyType.toLowerCase()
    );

    return limit ? filtered.slice(0, limit) : filtered;
}

/**
 * Get electric vehicles
 */
export async function getElectricCars(): Promise<Car[]> {
    return allCars.filter(car => car.engine.type === 'Electric');
}

/**
 * Get fuel efficient cars (> 20 km/l)
 */
export async function getFuelEfficientCars(limit: number = 10): Promise<Car[]> {
    return allCars
        .filter(car => car.performance.fuelEfficiency && car.performance.fuelEfficiency >= 20)
        .sort((a, b) => (b.performance.fuelEfficiency || 0) - (a.performance.fuelEfficiency || 0))
        .slice(0, limit);
}

// Add CarFilters interface extension for search query
declare module '@/lib/types/car' {
    interface CarFilters {
        searchQuery?: string;
    }
}

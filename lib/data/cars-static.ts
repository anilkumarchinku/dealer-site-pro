/**
 * lib/data/cars-static.ts
 * Client-safe static exports from the car catalog.
 * Safe to import in both server and client components.
 *
 * Server-only helpers (getCarsByMake, loadBrandImageMap) live in cars.ts
 * which uses `fs`/`path` and cannot be imported by client components.
 */

import type { Car } from '@/lib/types/car'

export const CAR_MAKES = [
    'Aston Martin',
    'Audi',
    'Bentley',
    'BMW',
    'BYD',
    'Citroen',
    'Ferrari',
    'Force Motors',
    'Honda',
    'Hyundai',
    'Isuzu',
    'Jaguar',
    'Jeep',
    'Kia',
    'Lamborghini',
    'Land Rover',
    'Lexus',
    'Mahindra',
    'Maserati',
    'Maruti Suzuki',
    'Mercedes-Benz',
    'MG',
    'MINI',
    'Nissan',
    'Porsche',
    'Renault',
    'Rolls-Royce',
    'Skoda',
    'Tata Motors',
    'Toyota',
    'VinFast',
    'Volkswagen',
    'Volvo',
] as const

export type CarMake = (typeof CAR_MAKES)[number]

/** Returns all available car makes for filter UI. */
export function getAllMakes(): string[] {
    return [...CAR_MAKES]
}

/** Fallback empty array (used when DB is unavailable) */
export const allCars: Car[] = []

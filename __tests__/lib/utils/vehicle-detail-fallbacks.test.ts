import { describe, expect, it } from 'vitest';
import type { Car } from '@/lib/types/car';
import {
    buildDefaultKeyFeatures,
    formatMileageOrRange,
    isMeaningfulSpec,
    mergeDetailedInfoWithFallback,
} from '@/lib/utils/vehicle-detail-fallbacks';

const baseCar: Car = {
    id: 'yamaha-xsr-155',
    make: 'Yamaha',
    model: 'XSR 155',
    variant: 'Standard',
    year: 2026,
    bodyType: 'Bike',
    segment: 'bike',
    pricing: {
        exShowroom: {
            min: 150957,
            max: 150957,
            currency: 'INR',
        },
    },
    engine: {
        type: 'Petrol',
        displacement: 155,
        power: '—',
        torque: '—',
    },
    transmission: {
        type: 'Manual',
    },
    performance: {
        fuelEfficiency: 46,
    },
    dimensions: {
        seatingCapacity: 2,
    },
    features: {
        keyFeatures: [],
    },
    images: {
        hero: '',
        exterior: [],
        interior: [],
    },
    meta: {
        isAvailable: true,
    },
    vehicleCategory: '2w',
};

describe('vehicle detail fallbacks', () => {
    it('normalizes mileage strings without duplicating units', () => {
        expect(formatMileageOrRange('46 kmpl')).toBe('46 km/l');
        expect(formatMileageOrRange(46)).toBe('46 km/l');
        expect(formatMileageOrRange(undefined, { fallbackTopSpeed: 90 })).toBe('90 km/h top speed');
    });

    it('treats placeholders as empty specs', () => {
        expect(isMeaningfulSpec('—')).toBe(false);
        expect(isMeaningfulSpec('0 bhp')).toBe(false);
        expect(isMeaningfulSpec('Manual')).toBe(true);
    });

    it('fills missing popup data from the vehicle card model', () => {
        const [fallback] = mergeDetailedInfoWithFallback([], baseCar);

        expect(fallback.variant_name).toBe('Standard');
        expect(fallback.fuel_type).toBe('Petrol');
        expect(fallback.transmission).toBe('Manual');
        expect(fallback.engine_displacement_cc).toBe(155);
        expect(fallback.mileage_kmpl_or_ev_range).toBe('46 km/l');
        expect(fallback.seating_capacity).toBe(2);
        expect(buildDefaultKeyFeatures(baseCar).length).toBeGreaterThan(0);
    });
});

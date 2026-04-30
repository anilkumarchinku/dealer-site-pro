import type { Car } from '@/lib/types/car';
import type { DetailedCarInfo } from '@/lib/utils/car-info-fetcher';
import { parseKeyFeatures } from '@/lib/utils/car-info-fetcher';

const EMPTY_SPEC_VALUES = new Set([
    '-',
    '—',
    'tbd',
    'n/a',
    'na',
    'null',
    'undefined',
    '0',
    '0 bhp',
    '0 nm',
    '0 cc',
]);

export function isMeaningfulSpec(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'number') return Number.isFinite(value) && value > 0;
    const normalized = String(value).trim();
    if (!normalized) return false;
    return !EMPTY_SPEC_VALUES.has(normalized.toLowerCase());
}

function parseSpecNumber(value: unknown): number {
    if (typeof value === 'number') return Number.isFinite(value) && value > 0 ? value : 0;
    const match = String(value ?? '').match(/([\d.]+)/);
    return match ? parseFloat(match[1]) || 0 : 0;
}

function parsePowerBhp(value: unknown): number {
    const raw = String(value ?? '');
    const parsed = parseSpecNumber(raw);
    if (!parsed) return 0;
    return /kw/i.test(raw) ? Math.round(parsed * 1.34102 * 10) / 10 : parsed;
}

function firstMeaningfulString(...values: unknown[]): string {
    const value = values.find(isMeaningfulSpec);
    return value === undefined ? '' : String(value).trim();
}

function fallbackFuelType(car: Car): string {
    return firstMeaningfulString(
        car.engine?.type,
        car.vehicleCategory === '2w' || car.vehicleCategory === '3w' ? 'Petrol' : 'Fuel'
    );
}

function fallbackTransmission(car: Car): string {
    if (isMeaningfulSpec(car.transmission?.type)) return String(car.transmission.type);
    if (car.vehicleCategory === '2w') {
        return car.bodyType === 'Scooter' || car.bodyType === 'Electric' ? 'Automatic' : 'Manual';
    }
    if (car.vehicleCategory === '3w') return car.engine?.type === 'Electric' ? 'Automatic' : 'Manual';
    return 'Manual';
}

function fallbackSeating(car: Car): number {
    if (car.dimensions?.seatingCapacity && car.dimensions.seatingCapacity > 0) {
        return car.dimensions.seatingCapacity;
    }
    if (car.vehicleCategory === '2w') return 2;
    if (car.vehicleCategory === '3w') return car.bodyType === 'Cargo' ? 1 : 4;
    return 5;
}

export function formatMileageOrRange(
    value: unknown,
    options: { isElectric?: boolean; fallbackTopSpeed?: number | null } = {}
): string {
    if (isMeaningfulSpec(value)) {
        const raw = String(value).trim();
        if (/[a-z]/i.test(raw)) return raw.replace(/\bkmpl\b/i, 'km/l');
        return options.isElectric ? `${raw} km` : `${raw} km/l`;
    }

    if (options.fallbackTopSpeed && options.fallbackTopSpeed > 0) {
        return `${options.fallbackTopSpeed} km/h top speed`;
    }

    return '';
}

export function buildDefaultKeyFeatures(car: Car): string[] {
    const features = [
        ...((car.features?.keyFeatures ?? []).filter(isMeaningfulSpec) as string[]),
        car.bodyType ? `${car.bodyType} category` : '',
        fallbackFuelType(car) ? `${fallbackFuelType(car)} powertrain` : '',
        fallbackTransmission(car) ? `${fallbackTransmission(car)} transmission` : '',
        car.engine?.displacement ? `${car.engine.displacement} cc engine` : '',
        car.engine?.batteryCapacity ? `${car.engine.batteryCapacity} kWh battery` : '',
        car.performance?.range ? `${car.performance.range} km range` : '',
        car.performance?.fuelEfficiency ? `${car.performance.fuelEfficiency} km/l mileage` : '',
        car.performance?.topSpeed ? `${car.performance.topSpeed} km/h top speed` : '',
        car.dimensions?.bootSpace
            ? `${car.dimensions.bootSpace} ${car.vehicleCategory === '3w' ? 'kg payload' : 'L boot space'}`
            : '',
        car.year ? `${car.year} model` : '',
        car.pricing.exShowroom.min ? 'Ex-showroom pricing available' : '',
    ].filter(isMeaningfulSpec);

    return Array.from(new Set(features)).slice(0, 8);
}

export function buildFallbackDetailedInfo(car: Car): DetailedCarInfo[] {
    const basePrice = car.pricing.exShowroom.min ?? 0;
    const fallbackBase = {
        make: car.make,
        model: car.model,
        fuel_type: fallbackFuelType(car),
        transmission: fallbackTransmission(car),
        engine_displacement_cc: parseSpecNumber(car.engine?.displacement),
        power_bhp: parsePowerBhp(car.engine?.power),
        torque_nm: parseSpecNumber(car.engine?.torque),
        mileage_kmpl_or_ev_range: formatMileageOrRange(
            car.engine?.type === 'Electric' ? car.performance?.range : car.performance?.fuelEfficiency,
            { isElectric: car.engine?.type === 'Electric', fallbackTopSpeed: car.performance?.topSpeed }
        ),
        seating_capacity: fallbackSeating(car),
        boot_space_l: car.vehicleCategory === '3w' ? undefined : car.dimensions?.bootSpace ?? undefined,
        key_features: buildDefaultKeyFeatures(car).join(', '),
        safety_features: car.features?.safetyFeatures?.join(', ') ?? '',
        image_urls: car.colors?.map((color) => ({ value: color.hex })) ?? [],
        launch_year: car.year,
    };

    if (car.variants?.length) {
        return car.variants.map((variant) => ({
            ...fallbackBase,
            variant_name: variant.name || car.variant || 'Standard',
            ex_showroom_price_min_inr: variant.price || basePrice,
            fuel_type: firstMeaningfulString(variant.fuelType, fallbackBase.fuel_type),
            transmission: firstMeaningfulString(variant.transmission, fallbackBase.transmission),
            engine_displacement_cc: variant.engineCc ?? fallbackBase.engine_displacement_cc,
            key_features: variant.keyFeatures?.length
                ? variant.keyFeatures.join(', ')
                : fallbackBase.key_features,
        }));
    }

    return [{
        ...fallbackBase,
        variant_name: car.variant || 'Standard',
        ex_showroom_price_min_inr: basePrice,
    }];
}

export function mergeDetailedInfoWithFallback(
    info: DetailedCarInfo[] | null | undefined,
    car: Car
): DetailedCarInfo[] {
    const fallback = buildFallbackDetailedInfo(car);
    if (!info?.length) return fallback;

    return info.map((item, index) => {
        const backup = fallback[Math.min(index, fallback.length - 1)];
        const keyFeatures = parseKeyFeatures(item.key_features);

        return {
            ...item,
            make: firstMeaningfulString(item.make, backup.make),
            model: firstMeaningfulString(item.model, backup.model),
            variant_name: firstMeaningfulString(item.variant_name, backup.variant_name),
            ex_showroom_price_min_inr: item.ex_showroom_price_min_inr > 0
                ? item.ex_showroom_price_min_inr
                : backup.ex_showroom_price_min_inr,
            ex_showroom_price_max_inr: item.ex_showroom_price_max_inr ?? backup.ex_showroom_price_max_inr,
            fuel_type: firstMeaningfulString(item.fuel_type, backup.fuel_type),
            transmission: firstMeaningfulString(item.transmission, backup.transmission),
            engine_displacement_cc: item.engine_displacement_cc > 0
                ? item.engine_displacement_cc
                : backup.engine_displacement_cc,
            power_bhp: item.power_bhp > 0 ? item.power_bhp : backup.power_bhp,
            torque_nm: item.torque_nm > 0 ? item.torque_nm : backup.torque_nm,
            mileage_kmpl_or_ev_range: firstMeaningfulString(
                item.mileage_kmpl_or_ev_range,
                item.mileage_kmpl,
                backup.mileage_kmpl_or_ev_range
            ),
            mileage_kmpl: item.mileage_kmpl ?? backup.mileage_kmpl,
            seating_capacity: item.seating_capacity > 0 ? item.seating_capacity : backup.seating_capacity,
            boot_space_l: item.boot_space_l ?? backup.boot_space_l,
            ground_clearance_mm: item.ground_clearance_mm ?? backup.ground_clearance_mm,
            key_features: keyFeatures.length ? item.key_features : backup.key_features,
            safety_features: item.safety_features ?? backup.safety_features,
            image_urls: item.image_urls?.length ? item.image_urls : backup.image_urls,
            launch_year: item.launch_year ?? backup.launch_year,
            hyderabad_on_road_price: item.hyderabad_on_road_price ?? backup.hyderabad_on_road_price,
        };
    });
}

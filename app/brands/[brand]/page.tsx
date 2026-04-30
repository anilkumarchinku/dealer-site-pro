/**
 * Brand Page — /brands/[brand]
 * Shows all models from a specific brand with body type tabs
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Car } from '@/lib/types/car';
import { getCarsByMakeAndBodyType, getAllBrandsWithStats } from '@/lib/services/car-service';
import {
    loadTwoWheelerCatalogVehicles,
    type ProcessedTwoWheeler,
} from '@/lib/services/two-wheeler-static-catalog';
import {
    loadThreeWheelerCatalogVehicles,
    type ProcessedThreeWheeler,
} from '@/lib/services/three-wheeler-static-catalog';
import { BrandPageContent } from '@/components/brands/BrandPageContent';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { brandNameToId, getVehicleImageUrls } from '@/lib/utils/brand-model-images';
import { brandLogoUrl } from '@/lib/utils/site-assets';

interface Props {
    params: Promise<{ brand: string }>;
    searchParams?: Promise<{ type?: string }>;
}

type BrandDirectoryType = '2w' | '3w' | '4w';

type BrandInfo = {
    name: string;
    modelCount: number;
    priceMin: number | null;
    priceMax: number | null;
    bodyTypes: string[];
};

const VEHICLE_LABELS: Record<BrandDirectoryType, {
    title: string;
    noun: string;
    brandsHref: string;
    detailBasePath?: string;
}> = {
    '2w': {
        title: 'Two-Wheelers',
        noun: 'two-wheelers',
        brandsHref: '/brands?type=2w',
        detailBasePath: '/bikes',
    },
    '3w': {
        title: 'Three-Wheelers',
        noun: 'three-wheelers',
        brandsHref: '/brands?type=3w',
        detailBasePath: '/autos',
    },
    '4w': {
        title: 'Cars',
        noun: 'cars',
        brandsHref: '/brands?type=4w',
    },
};

function normalizeBrandType(value: string | undefined): BrandDirectoryType {
    return value === '2w' || value === '3w' || value === '4w' ? value : '4w';
}

function priceFromPaise(pricePaise: number): number | null {
    return pricePaise > 0 ? Math.round(pricePaise / 100) : null;
}

function buildEmi(priceInr: number | null): Car['pricing']['emi'] {
    if (!priceInr) return undefined;
    return {
        monthly: Math.max(1, Math.round(priceInr * 0.018)),
        downPayment: Math.round(priceInr * 0.15),
        tenure: 60,
    };
}

function pickLowestPricedByModel<TVehicle extends { make: string; model: string; price_min_paise: number }>(
    vehicles: TVehicle[]
) {
    const modelMap = new Map<string, TVehicle>();

    for (const vehicle of vehicles) {
        const key = `${vehicle.make.toLowerCase()}__${vehicle.model.toLowerCase()}`;
        const existing = modelMap.get(key);
        if (!existing) {
            modelMap.set(key, vehicle);
            continue;
        }

        if (
            vehicle.price_min_paise > 0 &&
            (existing.price_min_paise === 0 || vehicle.price_min_paise < existing.price_min_paise)
        ) {
            modelMap.set(key, vehicle);
        }
    }

    return Array.from(modelMap.values());
}

function buildBrandInfo(name: string, cars: Car[]): BrandInfo {
    const prices = cars
        .flatMap((car) => [car.pricing.exShowroom.min, car.pricing.exShowroom.max])
        .filter((price): price is number => typeof price === 'number' && price > 0);

    return {
        name,
        modelCount: cars.length,
        priceMin: prices.length ? Math.min(...prices) : null,
        priceMax: prices.length ? Math.max(...prices) : null,
        bodyTypes: Array.from(new Set(cars.map((car) => car.bodyType).filter(Boolean))),
    };
}

function twoWheelerBodyType(vehicle: ProcessedTwoWheeler): string {
    if (vehicle.type === 'electric') return 'Electric';
    if (vehicle.type === 'scooter') return 'Scooter';
    return 'Bike';
}

function twoWheelerToCar(vehicle: ProcessedTwoWheeler): Car {
    const price = priceFromPaise(vehicle.price_min_paise);
    const brandId = brandNameToId(vehicle.make, '2w');
    const imageUrls = getVehicleImageUrls('2w', brandId, vehicle.model, vehicle.image_url);
    const isElectric = vehicle.fuel_type === 'electric';

    return {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        variant: vehicle.variant,
        year: vehicle.year,
        bodyType: twoWheelerBodyType(vehicle),
        segment: vehicle.type,
        pricing: {
            exShowroom: {
                min: price,
                max: price,
                currency: 'INR',
            },
            emi: buildEmi(price),
        },
        engine: {
            type: isElectric ? 'Electric' : 'Petrol',
            displacement: vehicle.engine_cc,
            power: '—',
            torque: '—',
            batteryCapacity: vehicle.battery_kwh,
            range: vehicle.range_km,
        },
        transmission: {
            type: vehicle.type === 'scooter' || isElectric ? 'Automatic' : 'Manual',
        },
        performance: {
            fuelEfficiency: vehicle.mileage_kmpl,
            topSpeed: vehicle.top_speed_kmph,
            range: vehicle.range_km,
        },
        dimensions: {
            seatingCapacity: 2,
        },
        features: {
            keyFeatures: [],
        },
        images: {
            hero: imageUrls[0] ?? vehicle.image_url ?? '',
            exterior: imageUrls,
            interior: [],
        },
        meta: {
            isAvailable: true,
            dataSource: 'Static 2W catalog',
        },
        price: price ? undefined : 'Price on request',
        condition: 'new',
        vehicleCategory: '2w',
    };
}

function threeWheelerBodyType(vehicle: ProcessedThreeWheeler): string {
    if (vehicle.type === 'electric') return 'Electric';
    if (vehicle.type === 'cargo') return 'Cargo';
    return 'Passenger';
}

function threeWheelerToCar(vehicle: ProcessedThreeWheeler): Car {
    const price = priceFromPaise(vehicle.price_min_paise);
    const brandId = brandNameToId(vehicle.make, '3w');
    const imageUrls = getVehicleImageUrls('3w', brandId, vehicle.model, vehicle.image_url);
    const isElectric = vehicle.fuel_type === 'electric';

    return {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        variant: vehicle.variant,
        year: vehicle.year,
        bodyType: threeWheelerBodyType(vehicle),
        segment: vehicle.type,
        pricing: {
            exShowroom: {
                min: price,
                max: price,
                currency: 'INR',
            },
            emi: buildEmi(price),
        },
        engine: {
            type: isElectric ? 'Electric' : vehicle.fuel_type.toUpperCase(),
            displacement: vehicle.engine_cc,
            power: '—',
            torque: '—',
            range: vehicle.range_km,
        },
        transmission: {
            type: isElectric ? 'Automatic' : 'Manual',
        },
        performance: {
            fuelEfficiency: vehicle.mileage_kmpl,
            range: vehicle.range_km,
        },
        dimensions: {
            seatingCapacity: vehicle.passenger_capacity,
            bootSpace: vehicle.payload_kg,
        },
        features: {
            keyFeatures: [],
        },
        images: {
            hero: imageUrls[0] ?? vehicle.image_url ?? '',
            exterior: imageUrls,
            interior: [],
        },
        meta: {
            isAvailable: true,
            dataSource: 'Static 3W catalog',
        },
        price: price ? undefined : 'Price on request',
        condition: 'new',
        vehicleCategory: '3w',
    };
}

async function loadBrandPageData(brand: string, type: BrandDirectoryType): Promise<{
    cars: Car[];
    brandInfo: BrandInfo;
    logoUrl: string | null;
}> {
    if (type === '2w') {
        const vehicles = pickLowestPricedByModel(
            loadTwoWheelerCatalogVehicles().filter(
                (vehicle) => vehicle.make.toLowerCase() === brand.toLowerCase()
            )
        );
        const cars = vehicles.map(twoWheelerToCar);
        return {
            cars,
            brandInfo: buildBrandInfo(brand, cars),
            logoUrl: brandLogoUrl(brand, '2w') ?? null,
        };
    }

    if (type === '3w') {
        const vehicles = pickLowestPricedByModel(
            loadThreeWheelerCatalogVehicles().filter(
                (vehicle) => vehicle.make.toLowerCase() === brand.toLowerCase()
            )
        );
        const cars = vehicles.map(threeWheelerToCar);
        return {
            cars,
            brandInfo: buildBrandInfo(brand, cars),
            logoUrl: brandLogoUrl(brand, '3w') ?? null,
        };
    }

    const [cars, allBrands] = await Promise.all([
        getCarsByMakeAndBodyType(brand),
        getAllBrandsWithStats(),
    ]);
    const brandInfo = allBrands.find((item) => item.name.toLowerCase() === brand.toLowerCase()) ?? buildBrandInfo(brand, cars);

    return {
        cars,
        brandInfo,
        logoUrl: brandLogoUrl(brand, '4w') ?? null,
    };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { brand } = await params;
    const decodedBrand = decodeURIComponent(brand);
    const type = normalizeBrandType((await searchParams)?.type);
    const label = VEHICLE_LABELS[type];

    return {
        title: `${decodedBrand} ${label.title} — Price, Models, Specs | DealerSite Pro`,
        description: `Explore all ${decodedBrand} ${label.noun} with prices, specifications, and features.`,
    };
}

export default async function BrandPage({ params, searchParams }: Props) {
    const { brand } = await params;
    const decodedBrand = decodeURIComponent(brand);
    const vehicleType = normalizeBrandType((await searchParams)?.type);
    const label = VEHICLE_LABELS[vehicleType];
    const { cars, brandInfo, logoUrl } = await loadBrandPageData(decodedBrand, vehicleType);

    if (!brandInfo || cars.length === 0) {
        notFound();
    }

    return (
        <>
            <SiteHeader />
            <BrandPageContent
                brand={decodedBrand}
                cars={cars}
                brandInfo={brandInfo}
                vehicleType={vehicleType}
                vehicleLabel={label.title}
                vehicleNoun={label.noun}
                brandsHref={label.brandsHref}
                detailBasePath={label.detailBasePath}
                brandLogoUrl={logoUrl}
            />
            <SiteFooter />
        </>
    );
}

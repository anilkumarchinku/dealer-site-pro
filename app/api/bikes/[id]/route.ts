/**
 * Bike Detail API Route
 * GET /api/bikes/[id] - Fetch a single two-wheeler by ID from local JSON files
 *
 * ID format: {brandId}-{modelSlug}-{index}
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
    brandNameToId,
    getVehicleImageUrls,
    modelToSlug,
} from '@/lib/utils/brand-model-images';
import { isDiscontinuedTwoWheeler } from '@/lib/utils/two-wheeler-source-status';

// ---------- brand-models.json types ----------
interface BrandModelsFile {
    twoWheelers: {
        traditional: BrandModelEntry[];
        electric: BrandModelEntry[];
    };
}
interface BrandModelEntry {
    brandId: string;
    brand: string;
    models: {
        motorcycles?: string[];
        scooters?: string[];
    };
}

// ---------- JSON vehicle shape ----------
interface RawVehicleFile {
    brand: string;
    brandId: string;
    vehicles: RawVehicle[];
}
interface RawVehicle {
    make?: string;
    model?: string;
    variant_name: string;
    price?: string;
    ex_showroom_price?: string;
    engine_displacement?: string;
    mileage?: string;
    max_power?: string;
    max_torque?: string;
    top_speed?: string;
    fuel_type?: string;
    transmission?: string;
    source_section?: string;
    description?: string;
    features?: string[];
    variants?: { name: string; price: string }[];
    colors?: { name: string; hex: string }[];
    technical_specifications?: Record<string, string | undefined>;
    engine_details?: Record<string, string | undefined>;
}

// ---------- helpers ----------

function parsePriceToPaise(raw: string | undefined | null): number {
    if (!raw) return 0;
    const cleaned = raw.replace(/[₹,\s]/g, '');
    const lakhMatch = cleaned.match(/^([\d.]+)\s*[Ll]akh$/);
    if (lakhMatch) return Math.round(parseFloat(lakhMatch[1]) * 100000 * 100);
    const croreMatch = cleaned.match(/^([\d.]+)\s*[Cc]rore$/);
    if (croreMatch) return Math.round(parseFloat(croreMatch[1]) * 10000000 * 100);
    const num = parseFloat(cleaned);
    if (!isNaN(num)) return Math.round(num * 100);
    return 0;
}

function parseCC(raw: string | undefined | null): number | null {
    if (!raw || raw === 'N/A') return null;
    const m = raw.match(/([\d.]+)/);
    return m ? parseFloat(m[1]) : null;
}

function parseMileage(raw: string | undefined | null): { kmpl: number | null; rangeKm: number | null } {
    if (!raw) return { kmpl: null, rangeKm: null };
    const rangeMatch = raw.match(/([\d.]+)\s*km\s*(?:\(range\)|range)/i);
    if (rangeMatch) return { kmpl: null, rangeKm: parseFloat(rangeMatch[1]) };
    const kmplMatch = raw.match(/([\d.]+)\s*kmpl/i);
    if (kmplMatch) return { kmpl: parseFloat(kmplMatch[1]), rangeKm: null };
    const numMatch = raw.match(/([\d.]+)/);
    if (numMatch) return { kmpl: parseFloat(numMatch[1]), rangeKm: null };
    return { kmpl: null, rangeKm: null };
}

function parseTopSpeed(raw: string | undefined | null): number | null {
    if (!raw) return null;
    const m = raw.match(/([\d.]+)/);
    return m ? parseFloat(m[1]) : null;
}

function parseBatteryKwh(raw: string | undefined | null): number | null {
    if (!raw) return null;
    const m = raw.match(/([\d.]+)\s*kWh/i);
    return m ? parseFloat(m[1]) : null;
}

let cachedScooterModels: Set<string> | null = null;
let cachedElectricBrandIds: Set<string> | null = null;

function getScooterModelsAndElectricBrands() {
    if (cachedScooterModels && cachedElectricBrandIds) {
        return { scooterModels: cachedScooterModels, electricBrandIds: cachedElectricBrandIds };
    }
    const bmPath = path.join(process.cwd(), 'lib', 'data', 'brand-models.json');
    const bmData: BrandModelsFile = JSON.parse(fs.readFileSync(bmPath, 'utf-8'));

    const scooterModels = new Set<string>();
    const electricBrandIds = new Set<string>();

    for (const entry of bmData.twoWheelers.traditional) {
        for (const model of entry.models.scooters ?? []) {
            scooterModels.add(`${entry.brandId}::${model.toLowerCase()}`);
        }
    }
    for (const entry of bmData.twoWheelers.electric) {
        electricBrandIds.add(entry.brandId);
        for (const model of entry.models.scooters ?? []) {
            scooterModels.add(`${entry.brandId}::${model.toLowerCase()}`);
        }
    }

    cachedScooterModels = scooterModels;
    cachedElectricBrandIds = electricBrandIds;
    return { scooterModels, electricBrandIds };
}

/** Find a vehicle across all 2W JSON files by its composite ID */
function findVehicleById(id: string) {
    const dir = path.join(process.cwd(), 'public', 'data', '2w');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
    const { scooterModels, electricBrandIds } = getScooterModelsAndElectricBrands();

    for (const file of files) {
        const raw: RawVehicleFile = JSON.parse(
            fs.readFileSync(path.join(dir, file), 'utf-8')
        );

        const brandName = raw.brand;
        const brandId = raw.brandId;

        for (let i = 0; i < raw.vehicles.length; i++) {
            const v = raw.vehicles[i];
            const modelName = v.model ?? v.variant_name.split('/')[0].trim();
            const modelSlugVal = modelToSlug(modelName);
            const vehicleId = `${brandId}-${modelSlugVal}-${i}`;

            if (vehicleId !== id) continue;
            if (isDiscontinuedTwoWheeler(v.source_section)) return null;

            // Found it — build the full detail response
            const fuelTypeRaw = (
                v.fuel_type ??
                v.technical_specifications?.fuel_type ??
                ''
            ).toLowerCase();
            const isElectric =
                fuelTypeRaw === 'electric' || electricBrandIds.has(brandId);
            const scooterKey = `${brandId}::${modelName.toLowerCase()}`;
            const isScooter = scooterModels.has(scooterKey);
            const vehicleType = isElectric
                ? 'electric'
                : isScooter
                  ? 'scooter'
                  : 'bike';

            const priceStr = v.price ?? v.ex_showroom_price;
            const pricePaise = parsePriceToPaise(priceStr);
            const ccVal = parseCC(
                v.engine_displacement ?? v.engine_details?.displacement
            );
            const { kmpl, rangeKm } = parseMileage(v.mileage);
            const topSpeed = parseTopSpeed(
                v.top_speed ?? v.technical_specifications?.top_speed
            );
            const batteryKwh = parseBatteryKwh(
                v.technical_specifications?.battery_capacity
            );
            const imageUrls = getVehicleImageUrls(
                '2w',
                brandNameToId(brandName, '2w'),
                modelName
            );

            return {
                id: vehicleId,
                make: v.make ?? brandName,
                model: modelName,
                variant: v.variant_name,
                type: vehicleType,
                fuel_type: isElectric ? 'electric' : 'petrol',
                engine_cc: ccVal,
                mileage_kmpl: kmpl,
                range_km: rangeKm,
                battery_kwh: batteryKwh,
                top_speed_kmph: topSpeed,
                price_min_paise: pricePaise,
                price_display: priceStr ?? null,
                image_url: imageUrls[0] ?? null,
                image_urls: imageUrls,
                is_featured: false,
                year: new Date().getFullYear(),
                max_power: v.max_power ?? null,
                max_torque: v.max_torque ?? null,
                transmission: v.transmission ?? null,
                description: v.description ?? null,
                features: v.features ?? [],
                variants: v.variants ?? [],
                colors: v.colors ?? [],
                technical_specifications: v.technical_specifications ?? {},
            };
        }
    }

    return null;
}

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = findVehicleById(id);

        if (!data) {
            return NextResponse.json(
                { success: false, error: 'Vehicle not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error in bike detail API:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

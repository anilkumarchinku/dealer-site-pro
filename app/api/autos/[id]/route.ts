/**
 * Auto Detail API Route
 * GET /api/autos/[id] - Fetch a single three-wheeler by ID from local JSON files
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

// ---------- brand-models.json types ----------
interface BrandModelsFile {
    threeWheelers: ThreeWheelerBrandEntry[];
}
interface ThreeWheelerBrandEntry {
    brandId: string;
    brand: string;
    models: {
        passenger?: string[];
        cargo?: string[];
        cargo_cng?: string[];
        electric?: string[];
    };
}

// ---------- JSON vehicle shape ----------
interface RawVehicleFile {
    brand: string;
    brandId: string;
    vehicles: RawVehicle[];
}
interface RawVehicle {
    model?: string;
    variant_name: string;
    ex_showroom_price?: string;
    price?: string;
    mileage?: string;
    engine_details?: {
        displacement?: string;
        max_power?: string;
        torque?: string;
        motor_type?: string;
    };
    payload_features?: {
        gross_vehicle_weight?: string;
        payload_capacity?: string;
    };
    technical_specifications?: {
        fuel_type?: string;
        transmission_type?: string;
        battery_capacity?: string;
        range?: string;
        top_speed?: string;
        seating_capacity?: string;
        body_type?: string;
        [key: string]: string | undefined;
    };
    dimensions?: {
        [key: string]: string | undefined;
    };
    source_url?: string;
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
    if (!raw || raw === 'N/A' || raw === '') return null;
    const m = raw.match(/([\d.]+)/);
    return m ? parseFloat(m[1]) : null;
}

function parseMileage(raw: string | undefined | null): { kmpl: number | null; rangeKm: number | null } {
    if (!raw) return { kmpl: null, rangeKm: null };
    const rangeMatch = raw.match(/([\d.]+)\s*km\s*(?:range|\()/i);
    if (rangeMatch) return { kmpl: null, rangeKm: parseFloat(rangeMatch[1]) };
    const kmplMatch = raw.match(/([\d.]+)\s*kmpl/i);
    if (kmplMatch) return { kmpl: parseFloat(kmplMatch[1]), rangeKm: null };
    const kmkgMatch = raw.match(/([\d.]+)\s*km\/kg/i);
    if (kmkgMatch) return { kmpl: parseFloat(kmkgMatch[1]), rangeKm: null };
    const numMatch = raw.match(/([\d.]+)/);
    if (numMatch) return { kmpl: parseFloat(numMatch[1]), rangeKm: null };
    return { kmpl: null, rangeKm: null };
}

function parsePayloadKg(raw: string | undefined | null): number | null {
    if (!raw || raw === '') return null;
    const m = raw.match(/([\d.]+)/);
    return m ? parseFloat(m[1]) : null;
}

function parsePassengerCapacity(raw: string | undefined | null): number | null {
    if (!raw || raw === '') return null;
    const m = raw.match(/(\d+)\s*(?:Passenger|passenger|pax)/i);
    if (m) return parseInt(m[1]);
    const numMatch = raw.match(/(\d+)/);
    return numMatch ? parseInt(numMatch[1]) : null;
}

function parseRange(raw: string | undefined | null): number | null {
    if (!raw) return null;
    const m = raw.match(/([\d.]+)/);
    return m ? parseFloat(m[1]) : null;
}

type ThreeWheelerType = 'passenger' | 'cargo' | 'electric';

let cachedTypeMap: Map<string, ThreeWheelerType> | null = null;

function getTypeMap(): Map<string, ThreeWheelerType> {
    if (cachedTypeMap) return cachedTypeMap;
    const bmPath = path.join(process.cwd(), 'lib', 'data', 'brand-models.json');
    const bmData: BrandModelsFile = JSON.parse(fs.readFileSync(bmPath, 'utf-8'));

    const map = new Map<string, ThreeWheelerType>();
    for (const entry of bmData.threeWheelers) {
        for (const model of entry.models.passenger ?? []) {
            map.set(`${entry.brandId}::${model.toLowerCase()}`, 'passenger');
        }
        for (const model of entry.models.cargo ?? []) {
            map.set(`${entry.brandId}::${model.toLowerCase()}`, 'cargo');
        }
        for (const model of entry.models.cargo_cng ?? []) {
            map.set(`${entry.brandId}::${model.toLowerCase()}`, 'cargo');
        }
        for (const model of entry.models.electric ?? []) {
            map.set(`${entry.brandId}::${model.toLowerCase()}`, 'electric');
        }
    }

    cachedTypeMap = map;
    return map;
}

function classifyType(
    brandId: string,
    modelName: string,
    fuelType: string,
    payloadKg: number | null,
    passengerCapacity: number | null,
    bodyType: string | undefined
): ThreeWheelerType {
    const typeMap = getTypeMap();

    const key = `${brandId}::${modelName.toLowerCase()}`;
    if (typeMap.has(key)) return typeMap.get(key)!;

    for (const [mapKey, mapType] of typeMap.entries()) {
        if (!mapKey.startsWith(`${brandId}::`)) continue;
        const mapModel = mapKey.split('::')[1];
        if (modelName.toLowerCase().includes(mapModel)) return mapType;
    }

    if (fuelType === 'electric') return 'electric';
    if (bodyType) {
        const bt = bodyType.toLowerCase();
        if (bt.includes('passenger')) return 'passenger';
        if (bt.includes('cargo') || bt.includes('load')) return 'cargo';
    }
    if (passengerCapacity && passengerCapacity >= 3) return 'passenger';
    if (payloadKg && payloadKg > 0) return 'cargo';
    return 'passenger';
}

/** Find a vehicle across all 3W JSON files by its composite ID */
function findVehicleById(id: string) {
    const dir = path.join(process.cwd(), 'public', 'data', '3w');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));

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

            // Found — build full detail response
            // Handle BOTH flat fields (Piaggio) and nested fields (Mahindra)
            const rec = v as unknown as Record<string, unknown>;
            const fuelTypeRaw = (
                rec.fuel_type as string ?? v.technical_specifications?.fuel_type ?? ''
            ).toString().toLowerCase();
            const isElectric = fuelTypeRaw === 'electric';

            const priceStr = v.ex_showroom_price ?? v.price;
            const pricePaise = parsePriceToPaise(priceStr);
            const ccVal = (rec.engine_cc as number) ?? parseCC(v.engine_details?.displacement) ?? null;
            const { kmpl, rangeKm: mileageRange } = parseMileage(
                (rec.mileage_kmpl as string) ?? v.mileage
            );
            const specRange = parseRange(v.technical_specifications?.range);
            const rangeKm = mileageRange ?? specRange ?? (rec.range_km as number | null) ?? null;
            const payloadKg = (rec.payload_kg as number | null) ?? parsePayloadKg(v.payload_features?.payload_capacity);
            const passengerCapacity = (rec.passenger_capacity as number | null) ?? parsePassengerCapacity(
                v.technical_specifications?.seating_capacity
            );
            const maxPower = (rec.max_power as string | null) ?? v.engine_details?.max_power ?? null;
            const torque = (rec.torque as string | null) ?? v.engine_details?.torque ?? null;
            const gvw = (rec.gvw_kg as number | null) ?? null;
            const transmission = (rec.transmission_type as string | null) ?? v.technical_specifications?.transmission_type ?? null;
            const wheelbase = (rec.wheelbase_mm as number | null) ?? null;
            const topSpeed = (rec.top_speed_kmph as number | null) ?? parseRange(v.technical_specifications?.top_speed) ?? null;
            const vehicleCategory = (rec.vehicle_category as string | null) ?? null;

            const vehicleType = vehicleCategory
                ? (vehicleCategory as ThreeWheelerType)
                : classifyType(
                    brandId,
                    modelName,
                    fuelTypeRaw,
                    payloadKg,
                    passengerCapacity,
                    v.technical_specifications?.body_type
                );

            const imageUrls = getVehicleImageUrls(
                '3w',
                brandNameToId(brandName, '3w'),
                modelName
            );

            return {
                id: vehicleId,
                make: brandName,
                model: modelName,
                variant: (rec.variant as string) ?? v.variant_name ?? null,
                type: vehicleType,
                fuel_type: isElectric ? 'electric' : (fuelTypeRaw || 'petrol'),
                engine_cc: ccVal,
                max_power: maxPower,
                torque: torque,
                transmission: transmission,
                mileage_kmpl: kmpl ?? (rec.mileage_kmpl as number | null) ?? null,
                range_km: rangeKm,
                top_speed_kmph: topSpeed,
                payload_kg: payloadKg,
                passenger_capacity: passengerCapacity,
                gvw_kg: gvw,
                wheelbase_mm: wheelbase,
                price_min_paise: pricePaise,
                price_display: priceStr ?? null,
                image_url: imageUrls[0] ?? null,
                image_urls: imageUrls,
                is_featured: false,
                year: new Date().getFullYear(),
                motor_type: v.engine_details?.motor_type ?? null,
                gross_vehicle_weight: v.payload_features?.gross_vehicle_weight ?? (gvw ? `${gvw} kg` : null),
                technical_specifications: v.technical_specifications ?? {},
                dimensions: v.dimensions ?? {},
                features: (rec.features as string[] | null) ?? [],
                description: (rec.description as string | null) ?? null,
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
        console.error('Error in auto detail API:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

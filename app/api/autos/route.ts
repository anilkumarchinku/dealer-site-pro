/**
 * Autos API Route
 * GET /api/autos - List three-wheelers from local JSON files with filtering, sorting, and pagination
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

// ---------- JSON vehicle shape (public/data/3w/*.json) ----------
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
}

// ---------- helpers ----------

/** Parse Indian price strings like "₹2.65 Lakh", "₹74,999" → paise (integer) */
function parsePriceToPaise(raw: string | undefined | null): number {
    if (!raw) return 0;
    const cleaned = raw.replace(/[₹,\s]/g, '');
    const lakhMatch = cleaned.match(/^([\d.]+)\s*[Ll]akh$/);
    if (lakhMatch) {
        return Math.round(parseFloat(lakhMatch[1]) * 100000 * 100);
    }
    const croreMatch = cleaned.match(/^([\d.]+)\s*[Cc]rore$/);
    if (croreMatch) {
        return Math.round(parseFloat(croreMatch[1]) * 10000000 * 100);
    }
    const num = parseFloat(cleaned);
    if (!isNaN(num)) return Math.round(num * 100);
    return 0;
}

/** Extract numeric cc from strings like "236.2 cc" */
function parseCC(raw: string | undefined | null): number | null {
    if (!raw || raw === 'N/A' || raw === '') return null;
    const m = raw.match(/([\d.]+)/);
    return m ? parseFloat(m[1]) : null;
}

/** Extract numeric mileage (kmpl) and range from strings */
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

/** Extract numeric payload in kg */
function parsePayloadKg(raw: string | undefined | null): number | null {
    if (!raw || raw === '') return null;
    const m = raw.match(/([\d.]+)/);
    return m ? parseFloat(m[1]) : null;
}

/** Extract passenger capacity from "Driver + 3 Passenger" style strings */
function parsePassengerCapacity(raw: string | undefined | null): number | null {
    if (!raw || raw === '') return null;
    // "Driver + 3 Passenger" → 3 (passengers, not counting driver)
    const m = raw.match(/(\d+)\s*(?:Passenger|passenger|pax)/i);
    if (m) return parseInt(m[1]);
    const numMatch = raw.match(/(\d+)/);
    return numMatch ? parseInt(numMatch[1]) : null;
}

/** Extract top speed */
function parseTopSpeed(raw: string | undefined | null): number | null {
    if (!raw) return null;
    const m = raw.match(/([\d.]+)/);
    return m ? parseFloat(m[1]) : null;
}

/** Parse range from technical_specifications.range like "135 km" */
function parseRange(raw: string | undefined | null): number | null {
    if (!raw) return null;
    const m = raw.match(/([\d.]+)/);
    return m ? parseFloat(m[1]) : null;
}

// ---------- type classification from brand-models.json ----------
type ThreeWheelerType = 'passenger' | 'cargo' | 'electric';

let cachedTypeMap: Map<string, ThreeWheelerType> | null = null;

/** Build a map of brandId::modelNameLower → type from brand-models.json */
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

/** Determine the 3W type for a vehicle by checking brand-models.json, then fallback heuristics */
function classifyType(
    brandId: string,
    modelName: string,
    fuelType: string,
    payloadKg: number | null,
    passengerCapacity: number | null,
    bodyType: string | undefined
): ThreeWheelerType {
    const typeMap = getTypeMap();

    // Exact match on model name
    const key = `${brandId}::${modelName.toLowerCase()}`;
    if (typeMap.has(key)) return typeMap.get(key)!;

    // Try matching against partial model names (variant_name often has extra text)
    for (const [mapKey, mapType] of typeMap.entries()) {
        if (!mapKey.startsWith(`${brandId}::`)) continue;
        const mapModel = mapKey.split('::')[1];
        if (modelName.toLowerCase().includes(mapModel)) return mapType;
    }

    // Fallback heuristics
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

// ---------- cache ----------
let cachedVehicles: ProcessedVehicle[] | null = null;

interface ProcessedVehicle {
    id: string;
    make: string;
    model: string;
    variant: string;
    type: string;
    fuel_type: string;
    engine_cc: number | null;
    mileage_kmpl: number | null;
    range_km: number | null;
    payload_kg: number | null;
    passenger_capacity: number | null;
    price_min_paise: number;
    image_url: string | null;
    is_featured: boolean;
    year: number;
}

function loadAllVehicles(): ProcessedVehicle[] {
    if (cachedVehicles) return cachedVehicles;

    const dir = path.join(process.cwd(), 'public', 'data', '3w');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));

    const allVehicles: ProcessedVehicle[] = [];

    for (const file of files) {
        const raw: RawVehicleFile = JSON.parse(
            fs.readFileSync(path.join(dir, file), 'utf-8')
        );

        const brandName = raw.brand;
        const brandId = raw.brandId;

        for (let i = 0; i < raw.vehicles.length; i++) {
            const v = raw.vehicles[i];
            // Cast to access flat fields that aren't in the RawVehicle interface
            const flat = v as unknown as Record<string, unknown>;

            // Model: flat field first, then extract from variant_name before "/"
            const modelName = (flat.model as string) ?? v.variant_name?.split('/')[0].trim() ?? 'Unknown';

            // Fuel type: flat field first, then nested
            const fuelTypeRaw = (
                (flat.fuel_type as string) ?? v.technical_specifications?.fuel_type ?? ''
            ).toLowerCase();
            const isElectric = fuelTypeRaw === 'electric';
            const modelSlug = modelToSlug(modelName);

            // Price
            const priceStr = v.ex_showroom_price ?? v.price;
            const pricePaise = parsePriceToPaise(priceStr);

            // Engine CC: flat number first, then parse from nested string
            const ccVal = (typeof flat.engine_cc === 'number' ? flat.engine_cc : null)
                ?? parseCC(v.engine_details?.displacement);

            // Mileage / Range
            const flatMileage = typeof flat.mileage_kmpl === 'number' ? flat.mileage_kmpl : null;
            const { kmpl: parsedKmpl, rangeKm: mileageRange } = parseMileage(v.mileage);
            const kmpl = flatMileage ?? parsedKmpl;
            const specRange = parseRange(v.technical_specifications?.range);
            const rangeKm = mileageRange ?? specRange ?? (flat.range_km as number | null) ?? null;

            // Payload: flat number first, then parse from nested string
            const payloadKg = (typeof flat.payload_kg === 'number' ? flat.payload_kg : null)
                ?? parsePayloadKg(v.payload_features?.payload_capacity);

            // Passenger capacity: flat number first, then parse from nested string
            const passengerCapacity = (typeof flat.passenger_capacity === 'number' ? flat.passenger_capacity : null)
                ?? parsePassengerCapacity(v.technical_specifications?.seating_capacity);

            // Top speed
            const topSpeed = (typeof flat.top_speed_kmph === 'number' ? flat.top_speed_kmph : null)
                ?? parseTopSpeed(v.technical_specifications?.top_speed);

            // Type: explicit vehicle_category first, then brand-models.json, then heuristics
            const explicitCategory = flat.vehicle_category as string | undefined;
            const vehicleType = explicitCategory && ['passenger', 'cargo', 'electric'].includes(explicitCategory)
                ? explicitCategory
                : classifyType(
                    brandId, modelName, fuelTypeRaw, payloadKg, passengerCapacity,
                    v.technical_specifications?.body_type
                );

            const imageUrls = getVehicleImageUrls(
                '3w',
                brandNameToId(brandName, '3w'),
                modelName
            );

            const id = `${brandId}-${modelSlug}-${i}`;

            allVehicles.push({
                id,
                make: brandName,
                model: modelName,
                variant: (flat.variant as string) ?? v.variant_name ?? '',
                type: vehicleType,
                fuel_type: isElectric ? 'electric' : (fuelTypeRaw || 'petrol'),
                engine_cc: ccVal,
                mileage_kmpl: kmpl,
                range_km: rangeKm,
                payload_kg: payloadKg,
                passenger_capacity: passengerCapacity,
                price_min_paise: pricePaise,
                image_url: imageUrls[0] ?? null,
                is_featured: false,
                year: new Date().getFullYear(),
            });
        }
    }

    cachedVehicles = allVehicles;
    return allVehicles;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Parse query params
        const make = searchParams.get('make');
        const type = searchParams.get('type'); // passenger, cargo, electric
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const pageSize = Math.min(
            60,
            Math.max(1, parseInt(searchParams.get('pageSize') || '30'))
        );
        const sortBy = searchParams.get('sortBy') || 'popular';
        const q = searchParams.get('q') || searchParams.get('searchQuery');

        const allVehicles = loadAllVehicles();

        // --- Group by brand+model (keep variant with lowest non-zero price) ---
        const modelMap = new Map<string, ProcessedVehicle>();
        for (const v of allVehicles) {
            const key = `${v.make.toLowerCase()}__${v.model.toLowerCase()}`;
            if (!modelMap.has(key)) {
                modelMap.set(key, v);
            } else {
                const existing = modelMap.get(key)!;
                if (
                    v.price_min_paise > 0 &&
                    (existing.price_min_paise === 0 ||
                        v.price_min_paise < existing.price_min_paise)
                ) {
                    modelMap.set(key, v);
                }
            }
        }
        let grouped = Array.from(modelMap.values());

        // --- Filters ---
        if (make) {
            const makeLower = make.toLowerCase();
            grouped = grouped.filter(
                (v) => v.make.toLowerCase() === makeLower
            );
        }

        if (type === 'electric') {
            grouped = grouped.filter((v) => v.type === 'electric');
        } else if (type === 'passenger') {
            grouped = grouped.filter((v) => v.type === 'passenger');
        } else if (type === 'cargo') {
            grouped = grouped.filter((v) => v.type === 'cargo');
        }

        if (q) {
            const qLower = q.toLowerCase();
            grouped = grouped.filter(
                (v) =>
                    v.make.toLowerCase().includes(qLower) ||
                    v.model.toLowerCase().includes(qLower) ||
                    v.variant.toLowerCase().includes(qLower)
            );
        }

        // --- Sorting ---
        switch (sortBy) {
            case 'price_low':
                grouped.sort((a, b) => a.price_min_paise - b.price_min_paise);
                break;
            case 'price_high':
                grouped.sort((a, b) => b.price_min_paise - a.price_min_paise);
                break;
            case 'newest':
                break;
            case 'popular':
            default:
                grouped.sort((a, b) => {
                    const priceDiff = b.price_min_paise - a.price_min_paise;
                    if (priceDiff !== 0) return priceDiff;
                    return a.model.localeCompare(b.model);
                });
                break;
        }

        // Mark top 20% as featured
        const featuredCount = Math.max(1, Math.ceil(grouped.length * 0.2));
        for (let i = 0; i < grouped.length; i++) {
            grouped[i] = { ...grouped[i], is_featured: i < featuredCount };
        }

        // --- Pagination ---
        const total = grouped.length;
        const totalPages = Math.ceil(total / pageSize);
        const from = (page - 1) * pageSize;
        const paged = grouped.slice(from, from + pageSize);

        return NextResponse.json({
            success: true,
            data: {
                vehicles: paged,
                total,
                page,
                pageSize,
                totalPages,
            },
        });
    } catch (error) {
        console.error('Error in autos API:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

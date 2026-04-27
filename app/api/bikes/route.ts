/**
 * Bikes API Route
 * GET /api/bikes - List two-wheelers from local JSON files with filtering, sorting, and pagination
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

// ---------- JSON vehicle shape (public/data/2w/*.json) ----------
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
    technical_specifications?: {
        engine?: string;
        fuel_type?: string;
        battery_capacity?: string;
        range?: string;
        top_speed?: string;
        [key: string]: string | undefined;
    };
    engine_details?: {
        displacement?: string;
        [key: string]: string | undefined;
    };
}

// ---------- helpers ----------

/** Parse Indian price strings like "₹2.65 Lakh", "₹74,999", "₹1,11,665" → paise (integer) */
function parsePriceToPaise(raw: string | undefined | null): number {
    if (!raw) return 0;
    const cleaned = raw.replace(/[₹,\s]/g, '');
    // Handle "X.XX Lakh" / "X.XX lakh"
    const lakhMatch = cleaned.match(/^([\d.]+)\s*[Ll]akh$/);
    if (lakhMatch) {
        return Math.round(parseFloat(lakhMatch[1]) * 100000 * 100); // rupees → paise
    }
    // Handle "X.XX Crore"
    const croreMatch = cleaned.match(/^([\d.]+)\s*[Cc]rore$/);
    if (croreMatch) {
        return Math.round(parseFloat(croreMatch[1]) * 10000000 * 100);
    }
    // Plain number (already in rupees)
    const num = parseFloat(cleaned);
    if (!isNaN(num)) return Math.round(num * 100);
    return 0;
}

/** Extract numeric cc from strings like "124.4 cc", "N/A" */
function parseCC(raw: string | undefined | null): number | null {
    if (!raw || raw === 'N/A') return null;
    const m = raw.match(/([\d.]+)/);
    return m ? parseFloat(m[1]) : null;
}

/** Extract numeric mileage (kmpl) from strings like "65 kmpl", "123 km (range)" */
function parseMileage(raw: string | undefined | null): { kmpl: number | null; rangeKm: number | null } {
    if (!raw) return { kmpl: null, rangeKm: null };
    // Range-style: "123 km (range)" or "123 km range"
    const rangeMatch = raw.match(/([\d.]+)\s*km\s*(?:\(range\)|range)/i);
    if (rangeMatch) return { kmpl: null, rangeKm: parseFloat(rangeMatch[1]) };
    // kmpl style: "65 kmpl"
    const kmplMatch = raw.match(/([\d.]+)\s*kmpl/i);
    if (kmplMatch) return { kmpl: parseFloat(kmplMatch[1]), rangeKm: null };
    // Just a number
    const numMatch = raw.match(/([\d.]+)/);
    if (numMatch) return { kmpl: parseFloat(numMatch[1]), rangeKm: null };
    return { kmpl: null, rangeKm: null };
}

/** Extract numeric top speed from "90 kmph" */
function parseTopSpeed(raw: string | undefined | null): number | null {
    if (!raw) return null;
    const m = raw.match(/([\d.]+)/);
    return m ? parseFloat(m[1]) : null;
}

/** Extract battery kWh from strings like "3.7 kWh", "4.56kWh" */
function parseBatteryKwh(raw: string | undefined | null): number | null {
    if (!raw) return null;
    const m = raw.match(/([\d.]+)\s*kWh/i);
    return m ? parseFloat(m[1]) : null;
}

// ---------- caches ----------
let cachedVehicles: ProcessedVehicle[] | null = null;
let cachedScooterModels: Set<string> | null = null;
let cachedElectricBrandIds: Set<string> | null = null;

function getScooterModelsAndElectricBrands(): {
    scooterModels: Set<string>;
    electricBrandIds: Set<string>;
} {
    if (cachedScooterModels && cachedElectricBrandIds) {
        return { scooterModels: cachedScooterModels, electricBrandIds: cachedElectricBrandIds };
    }
    const bmPath = path.join(process.cwd(), 'lib', 'data', 'brand-models.json');
    const bmData: BrandModelsFile = JSON.parse(fs.readFileSync(bmPath, 'utf-8'));

    const scooterModels = new Set<string>();
    const electricBrandIds = new Set<string>();

    // Traditional brands
    for (const entry of bmData.twoWheelers.traditional) {
        for (const model of entry.models.scooters ?? []) {
            scooterModels.add(`${entry.brandId}::${model.toLowerCase()}`);
        }
    }
    // Electric brands — all models from electric section are electric
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

function loadAllVehicles() {
    if (cachedVehicles) return cachedVehicles;

    const dir = path.join(process.cwd(), 'public', 'data', '2w');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
    const { scooterModels, electricBrandIds } = getScooterModelsAndElectricBrands();

    const allVehicles: ProcessedVehicle[] = [];

    for (const file of files) {
        const raw: RawVehicleFile = JSON.parse(
            fs.readFileSync(path.join(dir, file), 'utf-8')
        );

        const brandName = raw.brand;
        const brandId = raw.brandId;

        for (let i = 0; i < raw.vehicles.length; i++) {
            const v = raw.vehicles[i];
            if (isDiscontinuedTwoWheeler(v.source_section)) continue;
            const modelName = v.model ?? v.variant_name.split('/')[0].trim();
            const fuelTypeRaw = (
                v.fuel_type ??
                v.technical_specifications?.fuel_type ??
                ''
            ).toLowerCase();
            const isElectric =
                fuelTypeRaw === 'electric' || electricBrandIds.has(brandId);
            const modelSlug = modelToSlug(modelName);
            const scooterKey = `${brandId}::${modelName.toLowerCase()}`;
            const isScooter = scooterModels.has(scooterKey);

            const vehicleType: string = isElectric
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

            const id = `${brandId}-${modelSlug}-${i}`;

            allVehicles.push({
                id,
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
                image_url: imageUrls[0] ?? null,
                is_featured: false, // set below after grouping
                year: new Date().getFullYear(),
            });
        }
    }

    cachedVehicles = allVehicles;
    return allVehicles;
}

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
    battery_kwh: number | null;
    top_speed_kmph: number | null;
    price_min_paise: number;
    image_url: string | null;
    is_featured: boolean;
    year: number;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Parse query params
        const make = searchParams.get('make');
        const type = searchParams.get('type'); // bike, scooter, electric
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const pageSize = Math.min(
            60,
            Math.max(1, parseInt(searchParams.get('pageSize') || '30'))
        );
        const sortBy = searchParams.get('sortBy') || 'popular';
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
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
            const allowedMakes = make
                .split(',')
                .map((value) => value.trim().toLowerCase())
                .filter(Boolean);
            grouped = grouped.filter(
                (v) => allowedMakes.includes(v.make.toLowerCase())
            );
        }

        if (type === 'electric') {
            grouped = grouped.filter((v) => v.type === 'electric');
        } else if (type === 'scooter') {
            grouped = grouped.filter(
                (v) => v.type === 'scooter'
            );
        } else if (type === 'bike') {
            grouped = grouped.filter(
                (v) => v.type === 'bike'
            );
        }

        if (minPrice) {
            const min = parseInt(minPrice);
            grouped = grouped.filter((v) => v.price_min_paise >= min);
        }
        if (maxPrice) {
            const max = parseInt(maxPrice);
            grouped = grouped.filter((v) => v.price_min_paise <= max);
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
                // No created_at — just keep existing order
                break;
            case 'popular':
            default:
                // Sort by price descending as a proxy for popularity, then by model name
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
        console.error('Error in bikes API:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Utility to fetch detailed car information from carInfo.json
 */

export interface DetailedCarInfo {
    make: string;
    model: string;
    variant_name: string;
    ex_showroom_price_min_inr: number;
    ex_showroom_price_max_inr?: number;
    fuel_type: string;
    transmission: string;
    engine_displacement_cc: number;
    power_bhp: number;
    torque_nm: number;
    mileage_kmpl_or_ev_range?: string;
    mileage_kmpl?: number;
    seating_capacity: number;
    boot_space_l?: number;
    ground_clearance_mm?: number;
    dimensions?: string;
    key_features?: string | Array<{ value: string }>;
    safety_features?: string | Array<{ value: string }>;
    image_urls?: Array<{ value: string }>;
    availability_status?: string;
    source_url?: string;
    launch_year?: number;
    hyderabad_on_road_price?: number;
}

let carInfoCache: any = null;

/**
 * Fetch all car info data (with caching)
 */
export async function fetchCarInfoData(): Promise<any> {
    if (carInfoCache) {
        return carInfoCache;
    }

    try {
        const response = await fetch('/carInfo.json');

        if (!response.ok) {
            console.error('❌ Failed to fetch car info:', response.status, response.statusText);
            throw new Error(`Failed to fetch car info: ${response.status}`);
        }

        carInfoCache = await response.json();
        return carInfoCache;
    } catch (error) {
        console.error('❌ Error fetching car info:', error);
        return null;
    }
}

/**
 * Get detailed car information for a specific make and model
 */
export async function getDetailedCarInfo(
    make: string,
    model: string
): Promise<DetailedCarInfo[]> {
    const carData = await fetchCarInfoData();

    if (!carData) return [];

    // Normalize brand key
    const brandKey = make.toLowerCase().replace(/\s+/g, '_');
    const brandData = carData[brandKey];

    if (!brandData) return [];

    // Flatten the data structure - some brands have arrays, some have objects
    let allCars: any[] = [];
    for (const key in brandData) {
        const value = brandData[key];
        if (Array.isArray(value)) {
            allCars = allCars.concat(value);
        } else if (value && typeof value === 'object' && value.model) {
            allCars.push(value);
        }
    }

    // Filter by model name (exact match first, then partial match)
    const matchingCars: DetailedCarInfo[] = [];
    const normalizedSearchModel = model.toLowerCase().trim();

    for (const car of allCars) {
        if (car && car.model) {
            const normalizedCarModel = car.model.toLowerCase().trim();
            if (normalizedCarModel === normalizedSearchModel) {
                matchingCars.push(car);
            } else if (normalizedCarModel.includes(normalizedSearchModel) || normalizedSearchModel.includes(normalizedCarModel)) {
                matchingCars.push(car);
            }
        }
    }

    return matchingCars.map(normalizeVariant);
}

/**
 * Normalize variant field names from different scraped formats to standard DetailedCarInfo fields.
 * Some brands use ex_showroom_min, displacement, fuel, power (string), etc.
 */
function normalizeVariant(car: any): DetailedCarInfo {
    const c = { ...car };

    // Price normalization
    if (c.ex_showroom_price_min_inr == null && c.ex_showroom_min != null) {
        c.ex_showroom_price_min_inr = c.ex_showroom_min;
    }
    if (c.ex_showroom_price_min_inr == null && c.ex_showroom_price_min != null) {
        c.ex_showroom_price_min_inr = c.ex_showroom_price_min;
    }
    // Many brands use plain 'ex_showroom_price' (Maruti, Hyundai, Tata, Mahindra, Kia, etc.)
    if (c.ex_showroom_price_min_inr == null && c.ex_showroom_price != null) {
        c.ex_showroom_price_min_inr = typeof c.ex_showroom_price === 'number'
            ? c.ex_showroom_price
            : parseInt(String(c.ex_showroom_price).replace(/[₹,\s]/g, ''), 10) || 0;
    }
    // Pricing object (Tata, Volvo, Nissan use {pricing: {ex_showroom_min: ...}})
    if (c.ex_showroom_price_min_inr == null && c.pricing != null) {
        c.ex_showroom_price_min_inr = c.pricing.ex_showroom_min || c.pricing.ex_showroom || c.pricing.ex_showroom_price || 0;
    }
    if (c.ex_showroom_price_max_inr == null && c.ex_showroom_max != null) {
        c.ex_showroom_price_max_inr = c.ex_showroom_max;
    }
    if (c.ex_showroom_price_max_inr == null && c.ex_showroom_price_max != null) {
        c.ex_showroom_price_max_inr = c.ex_showroom_price_max;
    }

    // On-road price normalization
    if (c.hyderabad_on_road_price == null && c.hyderabad_on_road_price_inr != null) {
        c.hyderabad_on_road_price = c.hyderabad_on_road_price_inr;
    }

    // Fuel type
    if (!c.fuel_type && c.fuel) {
        c.fuel_type = c.fuel;
    }

    // Engine displacement
    if (c.engine_displacement_cc == null && typeof c.displacement === 'number') {
        c.engine_displacement_cc = c.displacement;
    }

    // Power: parse "65.71 bhp @ 5500 rpm" → 66
    if (c.power_bhp == null && typeof c.power === 'string') {
        const m = c.power.match(/([\d.]+)\s*(?:bhp|ps|hp)/i);
        if (m) c.power_bhp = Math.round(parseFloat(m[1]));
    }

    // Torque: parse "89 Nm @ 3500 rpm" → 89
    if (c.torque_nm == null && typeof c.torque === 'string') {
        const m = c.torque.match(/([\d.]+)\s*nm/i);
        if (m) c.torque_nm = Math.round(parseFloat(m[1]));
    }

    // Mileage: parse from various sources
    if (c.mileage_kmpl == null) {
        if (typeof c.mileage === 'number' && c.mileage > 0) {
            c.mileage_kmpl = c.mileage;
        } else if (typeof c.mileage === 'string') {
            const m = c.mileage.match(/([\d.]+)\s*km/i);
            if (m) c.mileage_kmpl = parseFloat(m[1]);
        }
        // Fall back to mileage_kmpl_or_ev_range if it's a number or parseable string
        if (c.mileage_kmpl == null && c.mileage_kmpl_or_ev_range != null) {
            const val = c.mileage_kmpl_or_ev_range;
            if (typeof val === 'number' && val > 0) {
                c.mileage_kmpl = val;
            } else if (typeof val === 'string') {
                const parsed = parseFloat(val);
                if (!isNaN(parsed) && parsed > 0) c.mileage_kmpl = parsed;
            }
        }
    }
    // Also set mileage_kmpl_or_ev_range if missing
    if (c.mileage_kmpl_or_ev_range == null && c.mileage_kmpl != null) {
        c.mileage_kmpl_or_ev_range = String(c.mileage_kmpl);
    }

    // Boot space: parse "214 L" → 214
    if (c.boot_space_l == null && typeof c.boot_space === 'string') {
        const m = c.boot_space.match(/([\d.]+)/);
        if (m) c.boot_space_l = Math.round(parseFloat(m[1]));
    } else if (c.boot_space_l == null && typeof c.boot_space === 'number') {
        c.boot_space_l = c.boot_space;
    }

    // Ground clearance: parse "170 mm" → 170
    if (c.ground_clearance_mm == null && typeof c.ground_clearance === 'string') {
        const m = c.ground_clearance.match(/([\d.]+)/);
        if (m) c.ground_clearance_mm = Math.round(parseFloat(m[1]));
    } else if (c.ground_clearance_mm == null && typeof c.ground_clearance === 'number') {
        c.ground_clearance_mm = c.ground_clearance;
    }

    // Dimensions: compose from length_mm/width_mm/height_mm if dimensions string is missing
    if (!c.dimensions && c.length_mm && c.width_mm && c.height_mm) {
        c.dimensions = `${c.length_mm} x ${c.width_mm} x ${c.height_mm} mm`;
    }

    return c as DetailedCarInfo;
}

/**
 * Parse key features - handles both string and array formats
 */
export function parseKeyFeatures(features?: string | any[]): string[] {
    if (!features) return [];

    // If it's already an array (from carInfo.json with {value: "feature"} format)
    if (Array.isArray(features)) {
        return features
            .map(f => typeof f === 'object' && f.value ? f.value : f)
            .filter(Boolean);
    }

    // If it's a string (comma-separated)
    if (typeof features === 'string') {
        return features.split(',').map(f => f.trim()).filter(Boolean);
    }

    return [];
}

/**
 * Parse safety features - handles both string and array formats
 */
export function parseSafetyFeatures(features?: string | any[]): string[] {
    if (!features) return [];

    // If it's already an array (from carInfo.json with {value: "feature"} format)
    if (Array.isArray(features)) {
        return features
            .map(f => typeof f === 'object' && f.value ? f.value : f)
            .filter(Boolean);
    }

    // If it's a string (comma-separated)
    if (typeof features === 'string') {
        return features.split(',').map(f => f.trim()).filter(Boolean);
    }

    return [];
}

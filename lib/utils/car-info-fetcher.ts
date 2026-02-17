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
}

let carInfoCache: any = null;

/**
 * Fetch all car info data (with caching)
 */
export async function fetchCarInfoData(): Promise<any> {
    if (carInfoCache) {
        console.log('✅ Using cached car info data');
        return carInfoCache;
    }

    try {
        console.log('🔄 Fetching car info from /carInfo.json...');
        const response = await fetch('/carInfo.json');

        if (!response.ok) {
            console.error('❌ Failed to fetch car info:', response.status, response.statusText);
            throw new Error(`Failed to fetch car info: ${response.status}`);
        }

        carInfoCache = await response.json();
        console.log('✅ Successfully loaded car info data:', Object.keys(carInfoCache).length, 'brands');
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
    console.log(`🔍 Looking for detailed info: ${make} ${model}`);

    const carData = await fetchCarInfoData();

    if (!carData) {
        console.warn('⚠️ No car data available');
        return [];
    }

    // Normalize brand key: convert to lowercase and replace spaces with underscores
    const brandKey = make.toLowerCase().replace(/\s+/g, '_');
    console.log(`🔑 Searching for brand key: "${brandKey}" (from "${make}")`);

    const brandData = carData[brandKey];

    if (!brandData) {
        console.warn(`⚠️ Brand "${brandKey}" not found. Available brands:`, Object.keys(carData));
        return [];
    }

    // Flatten the data structure - some brands have arrays, some have objects
    let allCars: any[] = [];
    for (const key in brandData) {
        const value = brandData[key];
        if (Array.isArray(value)) {
            // If it's an array, add all cars from the array
            allCars = allCars.concat(value);
        } else if (value && typeof value === 'object' && value.model) {
            // If it's a car object, add it
            allCars.push(value);
        }
    }

    // Get all unique model names for this brand for debugging
    const availableModels = [...new Set(allCars
        .filter((car: any) => car && car.model)
        .map((car: any) => car.model))];
    console.log(`📚 Available models for ${brandKey}:`, availableModels);

    // Filter by model name (exact match first, then partial match)
    const matchingCars: DetailedCarInfo[] = [];
    const normalizedSearchModel = model.toLowerCase().trim();

    for (const car of allCars) {
        // Safety check: ensure car.model exists
        if (car && car.model) {
            const normalizedCarModel = car.model.toLowerCase().trim();

            // Try exact match first
            if (normalizedCarModel === normalizedSearchModel) {
                matchingCars.push(car);
            }
            // Then try partial match (if search term is in the model name)
            else if (normalizedCarModel.includes(normalizedSearchModel) || normalizedSearchModel.includes(normalizedCarModel)) {
                matchingCars.push(car);
            }
        }
    }

    console.log(`✅ Found ${matchingCars.length} variants for ${make} ${model}`);

    if (matchingCars.length > 0) {
        console.log('📋 Variants:', matchingCars.map(c => c.variant_name));
    } else {
        console.warn(`⚠️ No variants found for model "${model}". Try checking available models above.`);
    }

    return matchingCars;
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

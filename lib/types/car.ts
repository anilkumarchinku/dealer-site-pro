/**
 * Car Data Types
 * Comprehensive TypeScript interfaces for vehicle information
 */

export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG' | 'Petrol+CNG' | 'Fuel' | 'Fuel Type' | string;

export type TransmissionType = 'Manual' | 'Automatic' | 'AMT' | 'CVT' | 'DCT' | 'iMT' | 'Transmission' | string;

export type BodyType = 'Hatchback' | 'Sedan' | 'SUV' | 'MPV' | 'Coupe' | 'Convertible' | 'Pickup' | 'Van' | string;

export type Segment = 'A' | 'B' | 'C' | 'D' | 'Premium' | 'Luxury' | 'Super Luxury' | string;

export type DriveType = 'FWD' | 'RWD' | 'AWD' | '4WD' | string;

export interface CarPricing {
    exShowroom: {
        min: number | null;   // Starting price in INR
        max: number | null;   // Top variant price in INR
        currency: 'INR';
    };
    onRoad?: {
        delhi?: number;
        mumbai?: number;
        bangalore?: number;
    };
    emi?: {
        monthly: number;      // Typical monthly EMI
        downPayment: number;  // Recommended down payment
        tenure: number;       // Loan tenure in months
    };
}

export interface CarEngine {
    type: FuelType;
    displacement?: number | null;  // Engine capacity in CC (not applicable for EVs)
    power: string;          // e.g., "89 bhp @ 6000 rpm"
    torque: string;         // e.g., "113 Nm @ 4400 rpm"
    cylinders?: number | null;
    valves?: number | null;
    batteryCapacity?: number | null; // kWh for electric vehicles
    range?: number | null;          // km for electric vehicles
}

export interface CarTransmission {
    type: TransmissionType;
    gears?: number | null;
    driveType?: DriveType;
}

export interface CarPerformance {
    fuelEfficiency?: number | null;    // km/l or km/kWh
    topSpeed?: number | null;          // km/h
    acceleration0to100?: number | null; // seconds
    range?: number | null;             // km (for EVs)
}

export interface CarDimensions {
    length?: number | null;           // mm
    width?: number | null;            // mm
    height?: number | null;           // mm
    wheelbase?: number | null;        // mm
    groundClearance?: number | null;  // mm
    bootSpace?: number | null;        // liters
    fuelTankCapacity?: number | null; // liters
    seatingCapacity: number | null;
    kerbWeight?: number | null;       // kg
}

export interface CarFeatures {
    keyFeatures: string[];     // Top 5-7 features for quick display
    safetyFeatures?: string[];  // All safety features
    comfortFeatures?: string[]; // Comfort & convenience
    techFeatures?: string[];    // Technology & infotainment
    exteriorFeatures?: string[]; // Exterior styling & functionality
}

export interface CarColor {
    name: string;
    type: 'Solid' | 'Metallic' | 'Pearl' | string;
    hex: string;
    image?: string;
    extraCost: number; // Additional cost in INR
}

export interface CarVariant {
    id: string;
    name: string;              // e.g., "VXi AGS"
    price: number;             // INR
    transmission: TransmissionType;
    fuelType: FuelType;
    keyFeatures: string[];     // Unique features of this variant
    isPopular?: boolean;       // Highlight popular variants
}

export interface CarImages {
    hero: string;              // Main promotional image
    exterior: string[];        // Front, side, rear, 3/4 angles
    interior: string[];        // Dashboard, seats, boot
    colors?: string[];         // Images showing different colors
}

export interface CarRating {
    overall: number;           // 1-5 stars
    performance?: number;
    comfort?: number;
    fuelEfficiency?: number;
    styling?: number;
    safety?: number;
    valueForMoney?: number;
    reviewCount?: number;
}

export interface CarSafety {
    ncapRating?: {
        stars: number;           // 0-5
        adultProtection?: number;
        childProtection?: number;
        testYear?: number;
    };
    airbags: number;           // Number of airbags
    abs: boolean;
    esp?: boolean;
    hillHoldAssist?: boolean;
    tractionControl?: boolean;
    blindSpotMonitoring?: boolean;
    rearCamera?: boolean;
}

export interface CarWarranty {
    standard: string;          // e.g., "2 years / 40,000 km"
    extended?: string;         // e.g., "Up to 5 years"
    batteryWarranty?: string;  // For EVs
}

export interface CarOwnership {
    warranty: CarWarranty;
    serviceInterval: string;   // e.g., "10,000 km or 12 months"
    averageMaintenanceCost?: {
        annual: number;
        per10000km: number;
    };
    insuranceCost?: {
        comprehensive: number;
        thirdParty: number;
    };
}

export interface CarMeta {
    lastUpdated?: string;       // ISO date string
    dataSource?: string;       // e.g., "CarDekho", "Official"
    isAvailable?: boolean;      // Currently in production
    isDiscontinued?: boolean;
    launchDate?: string;       // ISO date string
    popularityScore?: number;  // 1-10
    viewCount?: number;
    compareCount?: number;
    scrapedAt?: string;
    sourceUrl?: string;
}

/**
 * Main Car Interface
 * Complete vehicle information
 */
export interface Car {
    id: string;                // Unique identifier

    // Basic Information
    make: string;              // Brand name (e.g., "Maruti Suzuki")
    model: string;             // Model name (e.g., "Swift")
    variant: string;           // Variant name (e.g., "VXi AGS")
    year: number;              // Model year
    bodyType: BodyType;
    segment: Segment;

    // Pricing
    pricing: CarPricing;

    // Technical Specifications
    engine: CarEngine;
    transmission: CarTransmission;
    performance: CarPerformance;
    dimensions: CarDimensions;

    // Features & Equipment
    features: CarFeatures;
    safety?: CarSafety;

    // Visual Assets
    images: CarImages;
    colors?: CarColor[];

    // Variants
    variants?: CarVariant[];

    // Ratings & Reviews
    rating?: CarRating;

    // Ownership Info
    ownership?: CarOwnership;

    // Competitors (for comparison)
    competitors?: {
        make: string;
        model: string;
        startingPrice: number;
    }[];

    // Metadata
    meta: CarMeta;
    price?: string;

    // Hybrid: vehicle condition (for filtering in hybrid dealerships)
    condition?: 'new' | 'used' | 'certified_pre_owned';
}

/**
 * Car Filter Options
 */
export interface CarFilters {
    make?: string | string[];
    bodyType?: BodyType | BodyType[];
    fuelType?: FuelType | FuelType[];
    transmission?: TransmissionType | TransmissionType[];
    segment?: Segment | Segment[];
    priceRange?: {
        min: number;
        max: number;
    };
    seatingCapacity?: number | number[];
    sortBy?: 'price_asc' | 'price_desc' | 'popularity' | 'rating' | 'launch_date' | 'fuel_efficiency';
    limit?: number;
    offset?: number;
    searchQuery?: string;
}

/**
 * Car Search Result
 */
export interface CarSearchResult {
    cars: Car[];
    total: number;
    page: number;
    pageSize: number;
    filters: CarFilters;
}

/**
 * Brand Information
 */
export interface CarBrand {
    name: string;
    logo: string;
    segment: 'Mass Market' | 'Mid-Premium' | 'Luxury' | 'Electric';
    country: string;
    description: string;
    modelCount: number;
    priceRange: {
        min: number;
        max: number;
    };
}

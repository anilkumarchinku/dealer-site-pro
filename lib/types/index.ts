// Dealer Types (auto-detected during onboarding)
export type DealerType =
    | 'single_oem'    // Type 1: New cars from 1 brand
    | 'multi_oem'     // Type 2: New cars from multiple brands
    | 'used_only'     // Type 3: Used cars only
    | 'hybrid';       // Type 4: Both new and used

// OEM Brands - Indian Automobile Market
export type Brand =
    // Mass Market (Popular in India)
    | 'Maruti Suzuki' | 'Tata Motors' | 'Mahindra' | 'Hyundai' | 'Honda'
    | 'Toyota' | 'Kia' | 'Renault' | 'Nissan' | 'Volkswagen'

    // Mid-Premium & Utility
    | 'Skoda' | 'MG' | 'Jeep' | 'Citroen' | 'Force Motors'
    | 'Isuzu'

    // Luxury Segment
    | 'Mercedes-Benz' | 'BMW' | 'Audi' | 'Jaguar' | 'Land Rover'
    | 'Volvo' | 'Lexus' | 'Porsche' | 'Bentley' | 'Lamborghini'

    // Electric & New Age
    | 'BYD' | 'Tesla';

// Services offered
export type Service =
    | 'new_car_sales'
    | 'used_car_sales'
    | 'financing'
    | 'service_maintenance'
    | 'parts_accessories'
    | 'body_shop'
    | 'express_service'
    | 'insurance'
    | 'fleet_sales'
    | 'home_test_drives'
    | 'extended_warranties'
    | 'trade_in'
    | 'get_callback'
    | 'buy_accessories';

// Website style templates
export type StyleTemplate =
    | 'luxury'        // Premium: BMW, Mercedes, Audi
    | 'family'        // Friendly: Toyota, Honda, Subaru
    | 'sporty'        // Bold: Sports cars, performance
    | 'professional'  // Business: Trucks, fleet, commercial
    | 'modern';       // Modern multi-brand dealerships

// Inventory management systems
export type InventorySystem =
    | 'vauto'
    | 'dealersocket'
    | 'dealertrack'
    | 'vinsolutions'
    | 'manual'
    | 'other';

// Onboarding data collected
export interface OnboardingData {
    // Step 1: About You
    dealershipName: string;
    tagline?: string; // e.g. "Driven by Trust"
    location: string;
    fullAddress?: string;
    mapLink?: string;
    yearsInBusiness: number | null;
    phone: string;
    whatsapp?: string;
    email: string;
    gstin?: string;
    logo?: string;
    subdomain?: string; // Auto-generated FREE subdomain
    slug?: string; // URL slug for the subdomain

    // Step 2: Your Brands
    sellsNewCars: boolean;
    sellsUsedCars: boolean;
    brands: Brand[];
    inventorySystem: InventorySystem | null;

    // Step 3: Services
    services: Service[];

    // Step 4: Style
    styleTemplate: StyleTemplate;

    // Step 5: Customization
    templateConfig: {
        heroTitle: string;
        heroSubtitle: string;
        heroCtaText: string;
        featuresTitle: string;

        // Social Media
        facebook?: string;
        instagram?: string;
        twitter?: string;
        youtube?: string;
        linkedin?: string;

        // Operations
        workingHours?: string;
    };

    // Computed
    dealerType: DealerType | null;
}

// Lead types and priorities
export type LeadType = 'inquiry' | 'test_drive' | 'quote' | 'service' | 'trade_in' | 'financing';
export type LeadPriority = 'hot' | 'warm' | 'cold';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    type: LeadType;
    priority: LeadPriority;
    status: LeadStatus;
    vehicleInterest?: string;
    message?: string;
    createdAt: string;
}

// Vehicle for used car dealers
export interface Vehicle {
    id: string;
    vin?: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    color: string;
    transmission: 'automatic' | 'manual';
    fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
    features: string[];
    photos: string[];
    description: string;
    status: 'available' | 'pending' | 'sold';
    views: number;
    createdAt: string;
}

// Dashboard stats
export interface DashboardStats {
    visitors: number;
    visitorsChange: number;
    leads: number;
    leadsChange: number;
    testDrives: number;
    testDrivesChange: number;
    rating: number;
    totalReviews: number;
}

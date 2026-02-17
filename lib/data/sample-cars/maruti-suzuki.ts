/**
 * Maruti Suzuki Sample Car Data
 * Top 10 models with complete specifications
 */

import type { Car } from '@/lib/types/car';
import { generateCarId } from '@/lib/utils/car-utils';

const BRAND = 'Maruti Suzuki';

export const marutiSuzukiCars: Car[] = [
    // 1. Swift
    {
        id: generateCarId(BRAND, 'Swift', 'VXi AGS'),
        make: BRAND,
        model: 'Swift',
        variant: 'VXi AGS',
        year: 2024,
        bodyType: 'Hatchback',
        segment: 'B',

        pricing: {
            exShowroom: {
                min: 599000,
                max: 899000,
                currency: 'INR',
            },
            emi: {
                monthly: 18000,
                downPayment: 120000,
                tenure: 60,
            },
        },

        engine: {
            type: 'Petrol',
            displacement: 1197,
            power: '89 bhp @ 6000 rpm',
            torque: '113 Nm @ 4400 rpm',
            cylinders: 4,
        },

        transmission: {
            type: 'Automatic',
            gears: 5,
            driveType: 'FWD',
        },

        performance: {
            fuelEfficiency: 23.2,
            topSpeed: 165,
            acceleration0to100: 12.5,
        },

        dimensions: {
            length: 3860,
            width: 1735,
            height: 1520,
            wheelbase: 2450,
            groundClearance: 163,
            bootSpace: 268,
            fuelTankCapacity: 37,
            seatingCapacity: 5,
            kerbWeight: 860,
        },

        features: {
            keyFeatures: [
                '7-inch Smart Play Touchscreen',
                'Apple CarPlay & Android Auto',
                'Automatic Climate Control',
                'Cruise Control',
                'Push Button Start',
                'LED Projector Headlamps',
            ],
            safetyFeatures: [
                '6 Airbags',
                'ABS with EBD',
                'ESP (Electronic Stability Program)',
                'Hill Hold Assist',
                'Reverse Parking Sensors',
                'ISOFIX Child Seat Anchors',
            ],
            comfortFeatures: [
                'Power Windows (All 4)',
                'Electrically Adjustable ORVMs',
                '60:40 Split Rear Seats',
                'Height Adjustable Driver Seat',
                'Tilt & Telescopic Steering',
                'Rear AC Vents',
            ],
            techFeatures: [
                'Smart Play Studio',
                'Wireless Charger',
                'Arkamys Premium Sound System',
                'Connected Car Features',
            ],
            exteriorFeatures: [
                'LED DRLs',
                '15-inch Alloy Wheels',
                'Chrome Front Grille',
                'Body-colored Bumpers',
            ],
        },

        safety: {
            ncapRating: {
                stars: 3,
                adultProtection: 11.84,
                childProtection: 30.14,
                testYear: 2024,
            },
            airbags: 6,
            abs: true,
            esp: true,
            hillHoldAssist: true,
            rearCamera: true,
        },

        images: {
            hero: '/assets/cars/maruti/swift-hero.jpg',
            exterior: [
                '/assets/cars/maruti/swift-front.jpg',
                '/assets/cars/maruti/swift-side.jpg',
                '/assets/cars/maruti/swift-rear.jpg',
            ],
            interior: [
                '/assets/cars/maruti/swift-dashboard.jpg',
                '/assets/cars/maruti/swift-seats.jpg',
            ],
        },

        colors: [
            { name: 'Pearl Arctic White', type: 'Pearl', hex: '#F5F5F5', extraCost: 0 },
            { name: 'Grandeur Grey', type: 'Metallic', hex: '#6B7280', extraCost: 15000 },
            { name: 'Splendid Silver', type: 'Metallic', hex: '#C0C0C0', extraCost: 15000 },
            { name: 'Opulent Red', type: 'Metallic', hex: '#8B0000', extraCost: 15000 },
            { name: 'Midnight Black', type: 'Pearl', hex: '#1A1A1A', extraCost: 20000 },
        ],

        variants: [
            {
                id: 'swift-lxi',
                name: 'LXi',
                price: 599000,
                transmission: 'Manual',
                fuelType: 'Petrol',
                keyFeatures: ['Manual AC', '4 Airbags', 'Central Locking'],
            },
            {
                id: 'swift-vxi',
                name: 'VXi',
                price: 699000,
                transmission: 'Manual',
                fuelType: 'Petrol',
                keyFeatures: ['Touchscreen', '6 Airbags', 'Alloy Wheels'],
                isPopular: true,
            },
            {
                id: 'swift-vxi-ags',
                name: 'VXi AGS',
                price: 799000,
                transmission: 'AMT',
                fuelType: 'Petrol',
                keyFeatures: ['Auto Gear Shift', 'Touchscreen', '6 Airbags'],
                isPopular: true,
            },
            {
                id: 'swift-zxi',
                name: 'ZXi+',
                price: 899000,
                transmission: 'Manual',
                fuelType: 'Petrol',
                keyFeatures: ['LED Headlamps', 'Cruise Control', 'Wireless Charger'],
            },
        ],

        rating: {
            overall: 4.3,
            performance: 4.0,
            comfort: 4.5,
            fuelEfficiency: 4.7,
            styling: 4.2,
            safety: 4.3,
            valueForMoney: 4.6,
            reviewCount: 1523,
        },

        ownership: {
            warranty: {
                standard: '2 years / 40,000 km',
                extended: 'Up to 5 years / 1,00,000 km',
            },
            serviceInterval: '10,000 km or 12 months',
            averageMaintenanceCost: {
                annual: 15000,
                per10000km: 4500,
            },
        },

        competitors: [
            { make: 'Hyundai', model: 'i20', startingPrice: 699000 },
            { make: 'Tata', model: 'Altroz', startingPrice: 649000 },
        ],

        meta: {
            lastUpdated: '2024-02-09T15:00:00+05:30',
            dataSource: 'Official',
            isAvailable: true,
            isDiscontinued: false,
            launchDate: '2024-01-15',
            popularityScore: 9.5,
            viewCount: 45230,
        },
    },

    // 2. Baleno
    {
        id: generateCarId(BRAND, 'Baleno', 'Alpha CVT'),
        make: BRAND,
        model: 'Baleno',
        variant: 'Alpha CVT',
        year: 2024,
        bodyType: 'Hatchback',
        segment: 'B',

        pricing: {
            exShowroom: {
                min: 649000,
                max: 999000,
                currency: 'INR',
            },
            emi: {
                monthly: 20000,
                downPayment: 130000,
                tenure: 60,
            },
        },

        engine: {
            type: 'Petrol',
            displacement: 1197,
            power: '90 bhp @ 6000 rpm',
            torque: '113 Nm @ 4400 rpm',
            cylinders: 4,
        },

        transmission: {
            type: 'CVT',
            driveType: 'FWD',
        },

        performance: {
            fuelEfficiency: 22.3,
            topSpeed: 170,
            acceleration0to100: 11.8,
        },

        dimensions: {
            length: 3990,
            width: 1745,
            height: 1500,
            wheelbase: 2520,
            groundClearance: 170,
            bootSpace: 318,
            fuelTankCapacity: 37,
            seatingCapacity: 5,
            kerbWeight: 925,
        },

        features: {
            keyFeatures: [
                '9-inch Smart Play Pro+ Touchscreen',
                '360-Degree Camera',
                'Head-Up Display',
                'Wireless Phone Charger',
                'Sunroof',
                'LED Projector Headlamps with DRLs',
            ],
            safetyFeatures: [
                '6 Airbags',
                'ESP & Hill Hold Assist',
                '360° View Camera',
                'ABS with EBD',
                'Rear Parking Sensors',
                'ISOFIX Mounts',
            ],
            comfortFeatures: [
                'Automatic Climate Control',
                'Cruise Control',
                '60:40 Split Rear Seats',
                'Adjustable Headrests (All Seats)',
                'Rear AC Vents',
            ],
            techFeatures: [
                'Suzuki Connect',
                'Wireless Apple CarPlay & Android Auto',
                'Arkamys Tuned Sound',
                'Voice Recognition',
            ],
            exteriorFeatures: [
                'LED Tail Lamps',
                '16-inch Diamond Cut Alloys',
                'Shark Fin Antenna',
            ],
        },

        safety: {
            airbags: 6,
            abs: true,
            esp: true,
            hillHoldAssist: true,
            rearCamera: true,
        },

        images: {
            hero: '/assets/cars/maruti/baleno-hero.jpg',
            exterior: [
                '/assets/cars/maruti/baleno-front.jpg',
                '/assets/cars/maruti/baleno-side.jpg',
            ],
            interior: [
                '/assets/cars/maruti/baleno-dashboard.jpg',
            ],
        },

        colors: [
            { name: 'Nexa Blue', type: 'Metallic', hex: '#1E3A8A', extraCost: 15000 },
            { name: 'Grandeur Grey', type: 'Metallic', hex: '#6B7280', extraCost: 15000 },
            { name: 'Arctic White', type: 'Pearl', hex: '#FFFFFF', extraCost: 0 },
            { name: 'Phoenix Red', type: 'Metallic', hex: '#DC2626', extraCost: 15000 },
        ],

        variants: [
            {
                id: 'baleno-sigma',
                name: 'Sigma',
                price: 649000,
                transmission: 'Manual',
                fuelType: 'Petrol',
                keyFeatures: ['Dual Airbags', 'ABS', 'Power Steering'],
            },
            {
                id: 'baleno-delta',
                name: 'Delta',
                price: 749000,
                transmission: 'Manual',
                fuelType: 'Petrol',
                keyFeatures: ['Touchscreen', '4 Airbags', 'Alloys'],
                isPopular: true,
            },
            {
                id: 'baleno-zeta',
                name: 'Zeta',
                price: 849000,
                transmission: 'Manual',
                fuelType: 'Petrol',
                keyFeatures: ['6 Airbags', 'LED Headlamps', 'Cruise Control'],
            },
            {
                id: 'baleno-alpha-cvt',
                name: 'Alpha CVT',
                price: 999000,
                transmission: 'CVT',
                fuelType: 'Petrol',
                keyFeatures: ['Sunroof', '360 Camera', 'HUD'],
            },
        ],

        rating: {
            overall: 4.4,
            performance: 4.1,
            comfort: 4.5,
            fuelEfficiency: 4.5,
            styling: 4.6,
            safety: 4.3,
            valueForMoney: 4.5,
            reviewCount: 982,
        },

        ownership: {
            warranty: {
                standard: '2 years / 40,000 km',
                extended: 'Up to 5 years',
            },
            serviceInterval: '10,000 km or 12 months',
        },

        meta: {
            lastUpdated: '2024-02-09T15:00:00+05:30',
            dataSource: 'Official',
            isAvailable: true,
            isDiscontinued: false,
            popularityScore: 8.9,
            viewCount: 32100,
        },
    },

    // 3. WagonR
    {
        id: generateCarId(BRAND, 'WagonR', 'VXi AGS'),
        make: BRAND,
        model: 'WagonR',
        variant: 'VXi AGS',
        year: 2024,
        bodyType: 'Hatchback',
        segment: 'A',

        pricing: {
            exShowroom: {
                min: 549000,
                max: 729000,
                currency: 'INR',
            },
            emi: {
                monthly: 15000,
                downPayment: 110000,
                tenure: 60,
            },
        },

        engine: {
            type: 'Petrol',
            displacement: 1197,
            power: '89 bhp @ 6000 rpm',
            torque: '113 Nm @ 4400 rpm',
        },

        transmission: {
            type: 'AMT',
            gears: 5,
        },

        performance: {
            fuelEfficiency: 25.1,
            topSpeed: 150,
        },

        dimensions: {
            seatingCapacity: 5,
            bootSpace: 341,
            groundClearance: 165,
        },

        features: {
            keyFeatures: [
                'Tall-Boy Design',
                'SmartPlay Studio',
                'Spacious Cabin',
                'AutoGear Shift (AGS)',
                'Best-in-Class Boot Space',
            ],
            safetyFeatures: [
                'Dual Airbags',
                'ABS with EBD',
                'Reverse Parking Sensors',
                'Seat Belt Reminder',
            ],
            comfortFeatures: [
                'Adjustable Front Seats',
                'Power Windows',
                'Central Locking',
            ],
            techFeatures: [
                '7-inch Touchscreen',
                'Apple CarPlay',
                'Android Auto',
            ],
            exteriorFeatures: [
                'Halogen Headlamps',
                '14-inch Steel Wheels',
            ],
        },

        safety: {
            airbags: 2,
            abs: true,
            esp: false,
            rearCamera: false,
        },

        images: {
            hero: '/assets/cars/maruti/wagonr-hero.jpg',
            exterior: [],
            interior: [],
        },

        colors: [
            { name: 'Superior White', type: 'Solid', hex: '#FFFFFF', extraCost: 0 },
            { name: 'Silky Silver', type: 'Metallic', hex: '#C0C0C0', extraCost: 13000 },
            { name: 'Nutmeg Brown', type: 'Metallic', hex: '#8B4513', extraCost: 13000 },
        ],

        variants: [
            {
                id: 'wagonr-lxi',
                name: 'LXi',
                price: 549000,
                transmission: 'Manual',
                fuelType: 'Petrol',
                keyFeatures: ['Power Steering', 'Front Power Windows'],
                isPopular: true,
            },
            {
                id: 'wagonr-vxi-ags',
                name: 'VXi AGS',
                price: 729000,
                transmission: 'AMT',
                fuelType: 'Petrol',
                keyFeatures: ['Auto Gear Shift', 'Touchscreen', 'Central Locking'],
            },
        ],

        rating: {
            overall: 4.2,
            performance: 3.8,
            comfort: 4.3,
            fuelEfficiency: 4.8,
            valueForMoney: 4.7,
            reviewCount: 2156,
        },

        ownership: {
            warranty: {
                standard: '2 years / 40,000 km',
            },
            serviceInterval: '10,000 km or 12 months',
        },

        meta: {
            lastUpdated: '2024-02-09T15:00:00+05:30',
            isAvailable: true,
            isDiscontinued: false,
            popularityScore: 9.2,
        },
    },

    // Add more Maruti models here...
    // Alto, Dzire, Ertiga, Brezza, Fronx, Grand Vitara, Jimny
];

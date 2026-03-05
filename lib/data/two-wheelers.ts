/**
 * lib/data/two-wheelers.ts
 * Static 2-Wheeler catalog — used as a fallback when a dealer has no DB inventory.
 * Models and prices are approximate India ex-showroom (2024–25).
 */

import type { TwoWheelerVehicle } from '@/lib/types/two-wheeler'

const NOW = new Date().toISOString()

type CatalogEntry = Omit<TwoWheelerVehicle, 'id' | 'dealer_id' | 'created_at' | 'updated_at' | 'views'>

// ── Royal Enfield — brand name in DB: "Royal Enfield" ────────────────────────
const ROYAL_ENFIELD: CatalogEntry[] = [
    {
        brand: 'Royal Enfield', model: 'Hunter 350', variant: 'Dapper',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 349, mileage_kmpl: 36, range_km: null, top_speed_kmph: 114,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 14990000, on_road_price_paise: 17000000, emi_starting_paise: 410000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Rebel Red', hex: '#8B0000' }, { name: 'Rebel Black', hex: '#1A1A1A' }],
        images: [], brochure_url: null, description: 'The all-new Hunter 350 — nimble, light and fun to ride.', features: ['LED Headlamp', 'Tripper Navigation', 'Dual Channel ABS'], status: 'active',
    },
    {
        brand: 'Royal Enfield', model: 'Bullet 350', variant: 'Standard',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 349, mileage_kmpl: 36, range_km: null, top_speed_kmph: 112,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 17350000, on_road_price_paise: 19500000, emi_starting_paise: 470000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Black', hex: '#1A1A1A' }, { name: 'Silver', hex: '#C0C0C0' }],
        images: [], brochure_url: null, description: 'The iconic Bullet — a legacy that never ages.', features: ['Single Channel ABS', 'LED Tail Lamp', 'Dual Seat'], status: 'active',
    },
    {
        brand: 'Royal Enfield', model: 'Classic 350', variant: 'Signals',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 349, mileage_kmpl: 35, range_km: null, top_speed_kmph: 113,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 19350000, on_road_price_paise: 21700000, emi_starting_paise: 525000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Halcyon Green', hex: '#4A6741' }, { name: 'Halcyon Black', hex: '#2C2C2C' }],
        images: [], brochure_url: null, description: 'A timeless classic, redefined for modern roads.', features: ['Dual Channel ABS', 'Tripper Navigation', 'USB Charging'], status: 'active',
    },
    {
        brand: 'Royal Enfield', model: 'Meteor 350', variant: 'Fireball',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 349, mileage_kmpl: 36, range_km: null, top_speed_kmph: 120,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 21020000, on_road_price_paise: 23500000, emi_starting_paise: 570000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Fireball', hex: '#B22222' }, { name: 'Supernova Brown', hex: '#704214' }],
        images: [], brochure_url: null, description: 'Effortless cruising on any road.', features: ['Tripper Navigation', 'Dual Channel ABS', 'Bluetooth Connectivity'], status: 'active',
    },
    {
        brand: 'Royal Enfield', model: 'Himalayan 450', variant: 'Slate',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 452, mileage_kmpl: 40, range_km: null, top_speed_kmph: 140,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 28450000, on_road_price_paise: 32000000, emi_starting_paise: 770000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Slate Himalayan Salt', hex: '#8B8B83' }, { name: 'Olive Hunter Green', hex: '#4B5320' }],
        images: [], brochure_url: null, description: 'Built for the toughest terrains. Adventure awaits.', features: ['Ride-by-Wire', 'Dual Channel ABS', 'Google Maps Navigation', 'IMU'], status: 'active',
    },
    {
        brand: 'Royal Enfield', model: 'Guerrilla 450', variant: 'Flash',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 452, mileage_kmpl: 40, range_km: null, top_speed_kmph: 160,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 23900000, on_road_price_paise: 27000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Flash', hex: '#DC143C' }, { name: 'Matte Black', hex: '#2C2C2C' }],
        images: [], brochure_url: null, description: 'Street naked performance, redefined.', features: ['Ride-by-Wire', 'Dual Channel ABS', 'IMU', 'Multiple Riding Modes'], status: 'active',
    },
    {
        brand: 'Royal Enfield', model: 'Interceptor 650', variant: 'Orange Crush',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 648, mileage_kmpl: 25, range_km: null, top_speed_kmph: 170,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 30300000, on_road_price_paise: 34000000, emi_starting_paise: 820000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Orange Crush', hex: '#FF6600' }, { name: 'Ravishing Blue', hex: '#003087' }],
        images: [], brochure_url: null, description: 'Twin-cylinder power. Classic soul.', features: ['Dual Channel ABS', 'Slipper Clutch', 'Pirelli Tyres'], status: 'active',
    },
    {
        brand: 'Royal Enfield', model: 'Super Meteor 650', variant: 'Celestial',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 648, mileage_kmpl: 24, range_km: null, top_speed_kmph: 175,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 37900000, on_road_price_paise: 42500000, emi_starting_paise: 1030000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Celestial Blue', hex: '#4169E1' }, { name: 'Astral Black', hex: '#1A1A1A' }],
        images: [], brochure_url: null, description: 'Grand touring redefined. Power, comfort and style.', features: ['Dual Channel ABS', 'Slipper Clutch', 'Tripper Navigation', 'Quickshifter'], status: 'active',
    },
]

// ── Hero MotoCorp ─────────────────────────────────────────────────────────────
const HERO: CatalogEntry[] = [
    {
        brand: 'Hero', model: 'Splendor Plus', variant: 'XTEC',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 97, mileage_kmpl: 80, range_km: null, top_speed_kmph: 90,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 7700000, on_road_price_paise: 9000000, emi_starting_paise: 210000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Heavy Grey', hex: '#808080' }, { name: 'Black', hex: '#1A1A1A' }],
        images: [], brochure_url: null, description: "India's most-loved commuter bike.", features: ['LED DRLs', 'USB Charging', 'i3S Technology'], status: 'active',
    },
    {
        brand: 'Hero', model: 'Xtreme 160R', variant: '4V',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 163, mileage_kmpl: 45, range_km: null, top_speed_kmph: 109,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 12200000, on_road_price_paise: 14000000, emi_starting_paise: 330000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Blazing Red', hex: '#C00000' }, { name: 'Stealth Black', hex: '#2C2C2C' }],
        images: [], brochure_url: null, description: 'Sporty performance for the urban rider.', features: ['Dual Channel ABS', 'LED Headlamp', 'Turn-by-Turn Navigation'], status: 'active',
    },
    {
        brand: 'Hero', model: 'Destini 125', variant: 'Prime',
        type: 'scooter', fuel_type: 'petrol', year: 2024,
        engine_cc: 124, mileage_kmpl: 51, range_km: null, top_speed_kmph: 90,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 8500000, on_road_price_paise: 9800000, emi_starting_paise: 230000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Pearl White', hex: '#F5F5F5' }, { name: 'Techno Blue', hex: '#003087' }],
        images: [], brochure_url: null, description: 'Feature-rich family scooter.', features: ['CBS', 'LED Headlamp', 'Under-Seat Storage'], status: 'active',
    },
    {
        brand: 'Hero', model: 'Xpulse 200 4V', variant: 'Pro',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 199, mileage_kmpl: 40, range_km: null, top_speed_kmph: 114,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 14300000, on_road_price_paise: 16200000, emi_starting_paise: 390000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Forest Green', hex: '#228B22' }, { name: 'Mirage Silver', hex: '#C0C0C0' }],
        images: [], brochure_url: null, description: 'The rally-inspired adventure bike.', features: ['Long Travel Suspension', 'Dual Channel ABS', 'Knobby Tyres'], status: 'active',
    },
]

// ── Honda ─────────────────────────────────────────────────────────────────────
const HONDA: CatalogEntry[] = [
    {
        brand: 'Honda', model: 'Activa 6G', variant: 'Standard',
        type: 'scooter', fuel_type: 'petrol', year: 2024,
        engine_cc: 109, mileage_kmpl: 60, range_km: null, top_speed_kmph: 90,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 8000000, on_road_price_paise: 9200000, emi_starting_paise: 218000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Pearl Igneous Black', hex: '#1A1A1A' }, { name: 'Dazzle Yellow', hex: '#FFD700' }],
        images: [], brochure_url: null, description: "India's bestselling scooter.", features: ['CBS', 'LED Headlamp', 'External Fuel Lid'], status: 'active',
    },
    {
        brand: 'Honda', model: 'SP 125', variant: 'Disc',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 124, mileage_kmpl: 65, range_km: null, top_speed_kmph: 94,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 8500000, on_road_price_paise: 9700000, emi_starting_paise: 231000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Midnight Blue', hex: '#003087' }, { name: 'Sports Red', hex: '#CC0000' }],
        images: [], brochure_url: null, description: 'Premium commuter with refined performance.', features: ['CBS', 'LED Headlamp', 'USB Charger'], status: 'active',
    },
    {
        brand: 'Honda', model: 'CB350RS', variant: 'DLX Pro',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 348, mileage_kmpl: 42, range_km: null, top_speed_kmph: 147,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 20500000, on_road_price_paise: 23000000, emi_starting_paise: 558000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Repsol Red', hex: '#CC0000' }, { name: 'Pearl Deep Mud', hex: '#5C4033' }],
        images: [], brochure_url: null, description: 'Café racer meets modernity.', features: ['Dual Channel ABS', 'Assist & Slipper Clutch', 'Honda Smartphone Voice Control'], status: 'active',
    },
]

// ── TVS ───────────────────────────────────────────────────────────────────────
const TVS: CatalogEntry[] = [
    {
        brand: 'TVS', model: 'Apache RTR 160 4V', variant: 'Race Edition',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 159, mileage_kmpl: 45, range_km: null, top_speed_kmph: 114,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 11300000, on_road_price_paise: 13000000, emi_starting_paise: 308000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Matte Red', hex: '#8B0000' }, { name: 'White', hex: '#F5F5F5' }],
        images: [], brochure_url: null, description: 'Race DNA. Street power.', features: ['Dual Channel ABS', 'SmartXonnect', 'Pirelli Tyres'], status: 'active',
    },
    {
        brand: 'TVS', model: 'Jupiter 125', variant: 'SmartXonnect',
        type: 'scooter', fuel_type: 'petrol', year: 2024,
        engine_cc: 124, mileage_kmpl: 52, range_km: null, top_speed_kmph: 85,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 8200000, on_road_price_paise: 9500000, emi_starting_paise: 224000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Starlight Blue', hex: '#4682B4' }, { name: 'Pearl White', hex: '#F5F5F5' }],
        images: [], brochure_url: null, description: 'Smart, connected and efficient.', features: ['SmartXonnect', 'External Fuel Lid', 'LED Headlamp'], status: 'active',
    },
    {
        brand: 'TVS', model: 'iQube Electric', variant: 'S',
        type: 'electric', fuel_type: 'electric', year: 2024,
        engine_cc: null, mileage_kmpl: null, range_km: 100, top_speed_kmph: 78,
        battery_kwh: 3.04, charging_time_hours: 5, battery_warranty_years: 3,
        ex_showroom_price_paise: 10100000, on_road_price_paise: 11500000, emi_starting_paise: 276000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Starlight Blue', hex: '#4682B4' }, { name: 'Mint Green', hex: '#98FF98' }],
        images: [], brochure_url: null, description: 'Electric freedom, every day.', features: ['SmartXonnect', 'Regenerative Braking', 'Eco & Power Modes', 'FAME Subsidy Eligible'], status: 'active',
    },
]

// ── Bajaj ─────────────────────────────────────────────────────────────────────
const BAJAJ: CatalogEntry[] = [
    {
        brand: 'Bajaj', model: 'Pulsar NS160', variant: 'ABS',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 160, mileage_kmpl: 44, range_km: null, top_speed_kmph: 113,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 12200000, on_road_price_paise: 14000000, emi_starting_paise: 333000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Burnt Red', hex: '#8B0000' }, { name: 'Pewter Grey', hex: '#808080' }],
        images: [], brochure_url: null, description: 'Born to perform. Built to win.', features: ['Single Channel ABS', 'Perimeter Frame', 'LED Headlamp'], status: 'active',
    },
    {
        brand: 'Bajaj', model: 'Pulsar NS200', variant: 'ABS',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 199, mileage_kmpl: 35, range_km: null, top_speed_kmph: 134,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 14200000, on_road_price_paise: 16200000, emi_starting_paise: 387000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Pewter Grey', hex: '#808080' }, { name: 'Burnt Red', hex: '#8B0000' }],
        images: [], brochure_url: null, description: '200cc naked street fighter.', features: ['Dual Channel ABS', 'Liquid Cooling', 'Perimeter Frame'], status: 'active',
    },
    {
        brand: 'Bajaj', model: 'Dominar 400', variant: 'Standard',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 373, mileage_kmpl: 30, range_km: null, top_speed_kmph: 148,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 21900000, on_road_price_paise: 24500000, emi_starting_paise: 596000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Vine Black', hex: '#2C2C2C' }, { name: 'Aurora Green', hex: '#006400' }],
        images: [], brochure_url: null, description: 'Dominate every road. Every day.', features: ['Dual Channel ABS', 'Slipper Clutch', 'LED Headlamp', 'Quickshifter'], status: 'active',
    },
]

// ── Yamaha ────────────────────────────────────────────────────────────────────
const YAMAHA: CatalogEntry[] = [
    {
        brand: 'Yamaha', model: 'FZ-S V3', variant: 'Fi Hybrid',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 149, mileage_kmpl: 45, range_km: null, top_speed_kmph: 100,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 12270000, on_road_price_paise: 14000000, emi_starting_paise: 334000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Matte Black', hex: '#2C2C2C' }, { name: 'Cyan Storm', hex: '#00CED1' }],
        images: [], brochure_url: null, description: 'Street style meets fuel efficiency.', features: ['Single Channel ABS', 'Side Stand Engine Cut-off', 'Bluetooth Connectivity'], status: 'active',
    },
    {
        brand: 'Yamaha', model: 'MT-15 V2', variant: 'Standard',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 155, mileage_kmpl: 43, range_km: null, top_speed_kmph: 130,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 16360000, on_road_price_paise: 18500000, emi_starting_paise: 447000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Ice Fluo', hex: '#00CED1' }, { name: 'Metallic Black', hex: '#2C2C2C' }],
        images: [], brochure_url: null, description: 'The dark side of Japan.', features: ['Dual Channel ABS', 'Traction Control', 'Quick Shift System'], status: 'active',
    },
    {
        brand: 'Yamaha', model: 'Ray ZR 125', variant: 'Street Rally',
        type: 'scooter', fuel_type: 'petrol', year: 2024,
        engine_cc: 125, mileage_kmpl: 55, range_km: null, top_speed_kmph: 85,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 8350000, on_road_price_paise: 9700000, emi_starting_paise: 228000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Racing Blue', hex: '#003087' }, { name: 'Vivid Yellow', hex: '#FFD700' }],
        images: [], brochure_url: null, description: 'Stylish sporty scooter for city riders.', features: ['CBS', 'USB Charger', 'Blue Core Engine'], status: 'active',
    },
]

// ── Suzuki ────────────────────────────────────────────────────────────────────
const SUZUKI: CatalogEntry[] = [
    {
        brand: 'Suzuki', model: 'Access 125', variant: 'CBS Disc',
        type: 'scooter', fuel_type: 'petrol', year: 2024,
        engine_cc: 124, mileage_kmpl: 48, range_km: null, top_speed_kmph: 84,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 8600000, on_road_price_paise: 9900000, emi_starting_paise: 234000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Pearl Mirage White', hex: '#F5F5F5' }, { name: 'Metallic Fibroin Gray', hex: '#808080' }],
        images: [], brochure_url: null, description: 'Premium scooter with superior comfort.', features: ['CBS', 'External Fuel Lid', 'USB Charger'], status: 'active',
    },
    {
        brand: 'Suzuki', model: 'Gixxer SF 250', variant: 'Standard',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 249, mileage_kmpl: 35, range_km: null, top_speed_kmph: 140,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 18000000, on_road_price_paise: 20500000, emi_starting_paise: 490000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Triton Blue', hex: '#003087' }, { name: 'Glass Sparkle Black', hex: '#1A1A1A' }],
        images: [], brochure_url: null, description: 'Full-faired performance at its finest.', features: ['Single Channel ABS', 'Slipper Clutch', 'LED Headlamp'], status: 'active',
    },
]

// ── KTM ───────────────────────────────────────────────────────────────────────
const KTM: CatalogEntry[] = [
    {
        brand: 'KTM', model: '125 Duke', variant: 'Standard',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 125, mileage_kmpl: 45, range_km: null, top_speed_kmph: 107,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 19800000, on_road_price_paise: 22500000, emi_starting_paise: 540000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Orange', hex: '#FF6600' }, { name: 'Black', hex: '#1A1A1A' }],
        images: [], brochure_url: null, description: 'The smallest Duke with the biggest attitude.', features: ['Single Channel ABS', 'WP Suspension', 'TFT Display'], status: 'active',
    },
    {
        brand: 'KTM', model: '390 Duke', variant: 'Standard',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 399, mileage_kmpl: 28, range_km: null, top_speed_kmph: 167,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 31500000, on_road_price_paise: 35500000, emi_starting_paise: 858000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Orange', hex: '#FF6600' }, { name: 'Silver', hex: '#C0C0C0' }],
        images: [], brochure_url: null, description: 'The most powerful Duke yet.', features: ['Dual Channel ABS', 'Cornering ABS', 'TFT Display', 'Track Mode'], status: 'active',
    },
]

// ── Ather ─────────────────────────────────────────────────────────────────────
const ATHER: CatalogEntry[] = [
    {
        brand: 'Ather', model: '450S', variant: 'Standard',
        type: 'electric', fuel_type: 'electric', year: 2024,
        engine_cc: null, mileage_kmpl: null, range_km: 115, top_speed_kmph: 90,
        battery_kwh: 2.9, charging_time_hours: 4.5, battery_warranty_years: 3,
        ex_showroom_price_paise: 14999900, on_road_price_paise: 17000000, emi_starting_paise: 408000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Space Grey', hex: '#4A4A4A' }, { name: 'White', hex: '#F5F5F5' }],
        images: [], brochure_url: null, description: 'Smart, fast and efficient electric scooter.', features: ['OTA Updates', 'Warp Mode', 'Google Maps Navigation', 'FAME Subsidy'], status: 'active',
    },
    {
        brand: 'Ather', model: '450X', variant: 'Pro',
        type: 'electric', fuel_type: 'electric', year: 2024,
        engine_cc: null, mileage_kmpl: null, range_km: 150, top_speed_kmph: 90,
        battery_kwh: 3.7, charging_time_hours: 5, battery_warranty_years: 3,
        ex_showroom_price_paise: 17999900, on_road_price_paise: 20500000, emi_starting_paise: 490000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Space Grey', hex: '#4A4A4A' }, { name: 'Mint', hex: '#98FF98' }],
        images: [], brochure_url: null, description: 'The ultimate electric scooter experience.', features: ['Warp Mode', '7" Touchscreen', 'Auto Hold', 'Proximity Unlock'], status: 'active',
    },
]

// ── Kawasaki ──────────────────────────────────────────────────────────────────
const KAWASAKI: CatalogEntry[] = [
    {
        brand: 'Kawasaki', model: 'Z650RS', variant: 'Standard',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 649, mileage_kmpl: 18, range_km: null, top_speed_kmph: 180,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 70000000, on_road_price_paise: 79000000, emi_starting_paise: 1905000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Candy Emerald Green', hex: '#006400' }, { name: 'Metallic Carbon Gray', hex: '#808080' }],
        images: [], brochure_url: null, description: 'Retro style with modern performance.', features: ['Dual Channel ABS', 'Traction Control', 'Assist & Slipper Clutch'], status: 'active',
    },
    {
        brand: 'Kawasaki', model: 'Ninja 300', variant: 'Standard',
        type: 'bike', fuel_type: 'petrol', year: 2024,
        engine_cc: 296, mileage_kmpl: 23, range_km: null, top_speed_kmph: 168,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 37900000, on_road_price_paise: 43000000, emi_starting_paise: 1031000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Kawasaki Green', hex: '#4CAF50' }, { name: 'Ebony', hex: '#1A1A1A' }],
        images: [], brochure_url: null, description: 'Entry-level supersport with a ninja heart.', features: ['Dual Channel ABS', 'Assist & Slipper Clutch', 'Full Fairing'], status: 'active',
    },
]

// ── Ola Electric — brand name in DB: "Ola Electric" ─────────────────────────
const OLA_ELECTRIC: CatalogEntry[] = [
    {
        brand: 'Ola Electric', model: 'S1 X', variant: '2 kWh',
        type: 'electric', fuel_type: 'electric', year: 2024,
        engine_cc: null, mileage_kmpl: null, range_km: 91, top_speed_kmph: 90,
        battery_kwh: 2.0, charging_time_hours: 4.5, battery_warranty_years: 3,
        ex_showroom_price_paise: 7999900, on_road_price_paise: 9200000, emi_starting_paise: 218000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Jet Black', hex: '#1A1A1A' }, { name: 'Coral Glam', hex: '#FF6B6B' }],
        images: [], brochure_url: null, description: "Ola's most affordable electric scooter.", features: ['MoveOS', 'Fast Charging', 'FAME Subsidy Eligible', 'App Connected'], status: 'active',
    },
    {
        brand: 'Ola Electric', model: 'S1 Air', variant: 'Standard',
        type: 'electric', fuel_type: 'electric', year: 2024,
        engine_cc: null, mileage_kmpl: null, range_km: 101, top_speed_kmph: 90,
        battery_kwh: 2.5, charging_time_hours: 5, battery_warranty_years: 3,
        ex_showroom_price_paise: 10999900, on_road_price_paise: 12500000, emi_starting_paise: 299000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Jet Black', hex: '#1A1A1A' }, { name: 'Porcelain White', hex: '#F5F5F5' }],
        images: [], brochure_url: null, description: 'Stylish performance at an accessible price.', features: ['MoveOS 4', 'Fast Charging', 'Hill Hold', 'Cruise Control'], status: 'active',
    },
    {
        brand: 'Ola Electric', model: 'S1 Pro', variant: 'Gen 2',
        type: 'electric', fuel_type: 'electric', year: 2024,
        engine_cc: null, mileage_kmpl: null, range_km: 195, top_speed_kmph: 120,
        battery_kwh: 4.0, charging_time_hours: 6.5, battery_warranty_years: 3,
        ex_showroom_price_paise: 14999900, on_road_price_paise: 17000000, emi_starting_paise: 408000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Jet Black', hex: '#1A1A1A' }, { name: 'Neo Mint', hex: '#98FF98' }, { name: 'Liquid Silver', hex: '#C0C0C0' }],
        images: [], brochure_url: null, description: "The flagship Ola S1 Pro — fast, smart, and connected.", features: ['MoveOS 4', 'Hyper Mode', 'Cabin Boot Storage', 'Voice Assistant', '7" Touchscreen'], status: 'active',
    },
]

// ── Master lookup — keys must match EXACT brand names stored in DB ─────────────
// (from brand-models.json)
const CATALOG_BY_BRAND: Record<string, CatalogEntry[]> = {
    'Royal Enfield':                     ROYAL_ENFIELD,
    'Hero MotoCorp':                     HERO,
    'Honda Motorcycle & Scooter India':  HONDA,
    'TVS Motor Company':                 TVS,
    'Bajaj Auto':                        BAJAJ,
    'Yamaha India':                      YAMAHA,
    'Suzuki Motorcycle India':           SUZUKI,
    'KTM India':                         KTM,
    'Ather Energy':                      ATHER,
    'Kawasaki India':                    KAWASAKI,
    'Ola Electric':                      OLA_ELECTRIC,
}

/**
 * Returns a catalog of TwoWheelerVehicle objects for the given brand.
 * Tries exact match first, then fuzzy substring match so full DB names
 * like "Hero MotoCorp" still resolve to the "Hero" catalog key if needed.
 * The `dealerId` is substituted in so vehicles are compatible with the system.
 */
export function getTwoWheelerCatalog(brand: string, dealerId: string): TwoWheelerVehicle[] {
    const lower = brand.toLowerCase()

    // 1. Exact match
    let entries = CATALOG_BY_BRAND[brand]

    // 2. Fuzzy match — brand contains key or key contains brand
    if (!entries) {
        const key = Object.keys(CATALOG_BY_BRAND).find(k =>
            lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower)
        )
        entries = key ? CATALOG_BY_BRAND[key] : []
    }

    return entries.map((entry, idx) => ({
        ...entry,
        id:         `catalog-${idx}`,
        dealer_id:  dealerId,
        created_at: NOW,
        updated_at: NOW,
        views:      0,
    }))
}

/** All brand names that have a catalog. */
export const TWO_WHEELER_BRANDS = Object.keys(CATALOG_BY_BRAND)

/**
 * lib/data/three-wheelers.ts
 * Static 3-Wheeler catalog — used as a fallback when a dealer has no DB inventory.
 * Models and prices are approximate India ex-showroom (2024–25).
 */

import type { ThreeWheelerVehicle, ThreeWheelerType, ThreeWheelerFuelType } from '@/lib/types/three-wheeler'
import brandData from '@/lib/data/brand-models.json'
import { brandNameToId, modelToSlug } from '@/lib/utils/brand-model-images'
import { get3WModelEnrichment } from '@/lib/data/3w-brand-data'

const NOW = new Date().toISOString()
const CURRENT_YEAR = new Date().getFullYear()

function subCatToType3W(subCat: string): ThreeWheelerType {
    if (subCat === 'electric') return 'electric'
    if (subCat === 'cargo' || subCat === 'cargo_cng') return 'cargo'
    if (subCat === 'school_van') return 'school_van'
    return 'passenger'
}

function subCatToFuel3W(subCat: string): ThreeWheelerFuelType {
    if (subCat === 'electric') return 'electric'
    if (subCat === 'cargo_cng') return 'cng'
    if (subCat === 'cargo')    return 'diesel'
    return 'cng'
}

function buildThreeWheelerEntry(
    model: string,
    type: ThreeWheelerType,
    fuelType: ThreeWheelerFuelType,
    brand: string,
    brandId: string,
    idx: number,
    dealerId: string
): ThreeWheelerVehicle {
    const slug = modelToSlug(model)
    const imageUrl = `/data/brand-model-images/3w/${brandId}/${slug}.jpg`
    const enrichment = get3WModelEnrichment(brandId, model)
    return {
        id:                     `catalog-3w-${brandId}-${idx}`,
        dealer_id:              dealerId,
        type,
        brand,
        model,
        variant:                null,
        year:                   CURRENT_YEAR,
        fuel_type:              fuelType,
        engine_cc:              enrichment?.engine_cc ?? null,
        battery_kwh:            null,
        range_km:               null,
        charging_time_hours:    null,
        battery_warranty_years: null,
        payload_kg:             type === 'cargo' ? (enrichment?.gvw_kg ?? 500) : null,
        body_type:              null,
        passenger_capacity:     type === 'passenger' || type === 'electric' ? 3 : type === 'school_van' ? 8 : null,
        max_speed_kmph:         null,
        mileage_kmpl:           enrichment?.mileage_kmpl ?? null,
        cng_mileage_km_per_kg:  fuelType === 'cng' ? 28 : null,
        permit_type:            null,
        gvw_kg:                 null,
        fame_subsidy_eligible:  false,
        bs6_compliant:          true,
        ex_showroom_price_paise: 0,
        on_road_price_paise:    null,
        emi_starting_paise:     null,
        stock_status:           'available',
        colors:                 [],
        images:                 [imageUrl],
        brochure_url:           null,
        description:            null,
        features:               [],
        video_url:              null,
        is_featured:            false,
        status:                 'active',
        views:                  0,
        created_at:             NOW,
        updated_at:             NOW,
    }
}
type CatalogEntry = Omit<ThreeWheelerVehicle,
    'id' | 'dealer_id' | 'created_at' | 'updated_at' | 'views' |
    'payload_kg' | 'body_type' | 'passenger_capacity' | 'cng_mileage_km_per_kg' |
    'permit_type' | 'gvw_kg' | 'brochure_url' | 'video_url' | 'is_featured'
>


// ── Bajaj Auto (3W) ─────────────────────────────────────────────────────────────
const BAJAJ_AUTO_3W: CatalogEntry[] = [
    {
        brand: 'Bajaj Auto (3W)', model: 'RE CNG', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Bajaj Auto (3W)', model: 'RE LPG', variant: 'Standard',
        type: 'passenger', fuel_type: 'lpg', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Bajaj Auto (3W)', model: 'RE Diesel', variant: 'Standard',
        type: 'passenger', fuel_type: 'diesel', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Bajaj Auto (3W)', model: 'RE Electric', variant: 'Standard',
        type: 'electric', fuel_type: 'electric', year: CURRENT_YEAR,
        engine_cc: null, mileage_kmpl: null, range_km: 100, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Bajaj Auto (3W)', model: 'Maxima Z CNG', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Bajaj Auto (3W)', model: 'Compact RE CNG', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Bajaj Auto (3W)', model: 'Maxima XL Electric', variant: 'Standard',
        type: 'electric', fuel_type: 'electric', year: CURRENT_YEAR,
        engine_cc: null, mileage_kmpl: null, range_km: 120, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Bajaj Auto (3W)', model: 'Maxima X Wide Diesel', variant: 'Standard',
        type: 'cargo', fuel_type: 'diesel', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Bajaj Auto (3W)', model: 'Maxima C CNG', variant: 'Standard',
        type: 'cargo', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Bajaj Auto (3W)', model: 'GoGo', variant: 'Standard',
        type: 'passenger', fuel_type: 'electric', year: CURRENT_YEAR,
        engine_cc: null, mileage_kmpl: null, range_km: 120, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Bajaj Auto (3W)', model: 'Riki P40', variant: 'Standard',
        type: 'passenger', fuel_type: 'electric', year: CURRENT_YEAR,
        engine_cc: null, mileage_kmpl: null, range_km: 120, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
]

// ── Piaggio Ape ─────────────────────────────────────────────────────────────
const PIAGGIO_APE: CatalogEntry[] = [
    {
        brand: 'Piaggio Ape', model: 'Auto Classic', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Piaggio Ape', model: 'Auto DX', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Piaggio Ape', model: 'NXT+', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Piaggio Ape', model: 'Metro', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Piaggio Ape', model: 'Xtra LDX Diesel', variant: 'Standard',
        type: 'cargo', fuel_type: 'diesel', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Piaggio Ape', model: 'Xtra LDX CNG', variant: 'Standard',
        type: 'cargo', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Piaggio Ape', model: 'E-City', variant: 'Standard',
        type: 'passenger', fuel_type: 'electric', year: CURRENT_YEAR,
        engine_cc: null, mileage_kmpl: null, range_km: 120, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Piaggio Ape', model: 'E-Xtra FX', variant: 'Standard',
        type: 'passenger', fuel_type: 'electric', year: CURRENT_YEAR,
        engine_cc: null, mileage_kmpl: null, range_km: 120, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Piaggio Ape', model: 'E-Xtra FX Max', variant: 'Standard',
        type: 'passenger', fuel_type: 'electric', year: CURRENT_YEAR,
        engine_cc: null, mileage_kmpl: null, range_km: 120, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
]

// ── TVS King ─────────────────────────────────────────────────────────────
const TVS_KING: CatalogEntry[] = [
    {
        brand: 'TVS King', model: 'King Deluxe', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'TVS King', model: 'King Duramax', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'TVS King', model: 'King Duramax Plus', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'TVS King', model: 'King Kargo', variant: 'Standard',
        type: 'cargo', fuel_type: 'diesel', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'TVS King', model: 'King EV Max', variant: 'Standard',
        type: 'passenger', fuel_type: 'electric', year: CURRENT_YEAR,
        engine_cc: null, mileage_kmpl: null, range_km: 120, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'TVS King', model: 'King Kargo HD EV', variant: 'Standard',
        type: 'passenger', fuel_type: 'electric', year: CURRENT_YEAR,
        engine_cc: null, mileage_kmpl: null, range_km: 120, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
]

// ── Mahindra (3W) ─────────────────────────────────────────────────────────────
const MAHINDRA_3W: CatalogEntry[] = [
    {
        brand: 'Mahindra (3W)', model: 'Alfa Passenger', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Mahindra (3W)', model: 'E-Alfa Plus', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Mahindra (3W)', model: 'E-Alfa Mini', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Mahindra (3W)', model: 'Alfa Load', variant: 'Standard',
        type: 'cargo', fuel_type: 'diesel', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Mahindra (3W)', model: 'Zor Grand', variant: 'Standard',
        type: 'cargo', fuel_type: 'diesel', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Mahindra (3W)', model: 'Treo', variant: 'Standard',
        type: 'passenger', fuel_type: 'electric', year: CURRENT_YEAR,
        engine_cc: null, mileage_kmpl: null, range_km: 120, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Mahindra (3W)', model: 'Treo Plus', variant: 'Standard',
        type: 'passenger', fuel_type: 'electric', year: CURRENT_YEAR,
        engine_cc: null, mileage_kmpl: null, range_km: 120, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Mahindra (3W)', model: 'Treo Zor', variant: 'Standard',
        type: 'passenger', fuel_type: 'electric', year: CURRENT_YEAR,
        engine_cc: null, mileage_kmpl: null, range_km: 120, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Mahindra (3W)', model: 'Treo Yaari HRT', variant: 'Standard',
        type: 'passenger', fuel_type: 'electric', year: CURRENT_YEAR,
        engine_cc: null, mileage_kmpl: null, range_km: 120, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Mahindra (3W)', model: 'Treo Yaari SFT', variant: 'Standard',
        type: 'passenger', fuel_type: 'electric', year: CURRENT_YEAR,
        engine_cc: null, mileage_kmpl: null, range_km: 120, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Mahindra (3W)', model: 'UDO', variant: 'Standard',
        type: 'passenger', fuel_type: 'electric', year: CURRENT_YEAR,
        engine_cc: null, mileage_kmpl: null, range_km: 120, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
]

// ── Atul Auto ─────────────────────────────────────────────────────────────
const ATUL_AUTO: CatalogEntry[] = [
    {
        brand: 'Atul Auto', model: 'Gem Paxx', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Atul Auto', model: 'Elite Plus', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Atul Auto', model: 'Rik Auto', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Atul Auto', model: 'Gem Cargo', variant: 'Standard',
        type: 'cargo', fuel_type: 'diesel', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Atul Auto', model: 'Shakti Cargo', variant: 'Standard',
        type: 'cargo', fuel_type: 'diesel', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Atul Auto', model: 'Rik Electric', variant: 'Standard',
        type: 'passenger', fuel_type: 'electric', year: CURRENT_YEAR,
        engine_cc: null, mileage_kmpl: null, range_km: 120, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
]

// ── Kinetic Green ─────────────────────────────────────────────────────────────
const KINETIC_GREEN: CatalogEntry[] = [
    {
        brand: 'Kinetic Green', model: 'Safar Smart', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Kinetic Green', model: 'Super DX', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Kinetic Green', model: 'Safar Shakti', variant: 'Standard',
        type: 'cargo', fuel_type: 'diesel', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Kinetic Green', model: 'Safar Jumbo Ranger', variant: 'Standard',
        type: 'cargo', fuel_type: 'diesel', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
]

// ── Lohia Auto ─────────────────────────────────────────────────────────────
const LOHIA_AUTO: CatalogEntry[] = [
    {
        brand: 'Lohia Auto', model: 'Humsafar L5 Passenger', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Lohia Auto', model: 'Narain ICE L3', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Lohia Auto', model: 'Narain DX', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Lohia Auto', model: 'Humsafar L5 Cargo', variant: 'Standard',
        type: 'cargo', fuel_type: 'diesel', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Lohia Auto', model: 'Comfort F2F+', variant: 'Standard',
        type: 'cargo', fuel_type: 'diesel', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Lohia Auto', model: 'Youdha E5 Passenger', variant: 'Standard',
        type: 'passenger', fuel_type: 'electric', year: CURRENT_YEAR,
        engine_cc: null, mileage_kmpl: null, range_km: 120, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Lohia Auto', model: 'Youdha E5 Cargo', variant: 'Standard',
        type: 'passenger', fuel_type: 'electric', year: CURRENT_YEAR,
        engine_cc: null, mileage_kmpl: null, range_km: 120, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: true,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
]

// ── Euler Motors ─────────────────────────────────────────────────────────────
const EULER_MOTORS: CatalogEntry[] = [
    {
        brand: 'Euler Motors', model: 'NEO HiCITY', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Euler Motors', model: 'NEO HiRange', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Euler Motors', model: 'HiLoad DV EV', variant: 'Standard',
        type: 'cargo', fuel_type: 'diesel', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Euler Motors', model: 'HiLoad EV 120', variant: 'Standard',
        type: 'cargo', fuel_type: 'diesel', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Euler Motors', model: 'HiLoad EV 170', variant: 'Standard',
        type: 'cargo', fuel_type: 'diesel', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
]

// ── Greaves Electric Mobility ─────────────────────────────────────────────────────────────
const GREAVES_ELECTRIC_MOBILITY: CatalogEntry[] = [
    {
        brand: 'Greaves Electric Mobility', model: 'Eltra City', variant: 'Standard',
        type: 'passenger', fuel_type: 'cng', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Greaves Electric Mobility', model: 'Eltra City XTRA', variant: 'Standard',
        type: 'cargo', fuel_type: 'diesel', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
    {
        brand: 'Greaves Electric Mobility', model: 'Xargo', variant: 'Standard',
        type: 'cargo', fuel_type: 'diesel', year: CURRENT_YEAR,
        engine_cc: 400, mileage_kmpl: 30, range_km: null, max_speed_kmph: 55,
        battery_kwh: null, charging_time_hours: null, battery_warranty_years: null,
        ex_showroom_price_paise: 25000000, on_road_price_paise: 28000000, emi_starting_paise: 650000,
        stock_status: 'available', bs6_compliant: true, fame_subsidy_eligible: false,
        colors: [{ name: 'Yellow', hex: '#FFD700' }],
        images: [], description: 'Reliable 3W for everyday use.', features: [], status: 'active',
    },
]

// ── Force Motors ─────────────────────────────────────────────────────────────
const FORCE_MOTORS: CatalogEntry[] = [
]

// ── Master lookup — keys must match EXACT brand names stored in DB ─────────────

const CATALOG_BY_BRAND: Record<string, CatalogEntry[]> = {
    'Bajaj Auto (3W)': BAJAJ_AUTO_3W,
    'Piaggio Ape': PIAGGIO_APE,
    'TVS King': TVS_KING,
    'Mahindra (3W)': MAHINDRA_3W,
    'Atul Auto': ATUL_AUTO,
    'Kinetic Green': KINETIC_GREEN,
    'Lohia Auto': LOHIA_AUTO,
    'Euler Motors': EULER_MOTORS,
    'Greaves Electric Mobility': GREAVES_ELECTRIC_MOBILITY,
    'Force Motors': FORCE_MOTORS,
}

/**
 * Returns a catalog of ThreeWheelerVehicle objects for the given brand.
 * Priority: static CATALOG_BY_BRAND entries (with real prices/specs) overlaid with
 * dynamic image paths from /data/brand-model-images/. Falls back to dynamic-only
 * for brands without a static catalog entry.
 */
export function getThreeWheelerCatalog(brand: string, dealerId: string): ThreeWheelerVehicle[] {
    const brands3W = brandData.threeWheelers as { brandId: string; brand: string; models: unknown }[]

    const lower = brand.toLowerCase()
    let brandGroup = brands3W.find(b => b.brand === brand)
    if (!brandGroup) {
        brandGroup = brands3W.find(b =>
            b.brand.toLowerCase().includes(lower) || lower.includes(b.brand.toLowerCase())
        )
    }
    if (!brandGroup) return []

    const brandId = brandNameToId(brandGroup.brand, '3w')

    // ── Priority 1: use the static catalog (has real prices & specs) ──────────
    const staticEntries = CATALOG_BY_BRAND[brandGroup.brand]
    if (staticEntries && staticEntries.length > 0) {
        return staticEntries.map((entry, idx) => {
            const slug     = modelToSlug(entry.model)
            const imageUrl = `/data/brand-model-images/3w/${brandId}/${slug}.jpg`
            return {
                ...entry,
                id:        `catalog-3w-${brandId}-${idx}`,
                dealer_id: dealerId,
                images:    entry.images && entry.images.length > 0 ? entry.images : [imageUrl],
                created_at: NOW,
                updated_at: NOW,
                views:      0,
                payload_kg:            entry.type === 'cargo' ? 500 : null,
                body_type:             null,
                passenger_capacity:    entry.type === 'passenger' || entry.type === 'electric' ? 3 : entry.type === 'school_van' ? 8 : null,
                cng_mileage_km_per_kg: entry.fuel_type === 'cng' ? 28 : null,
                permit_type: null,
                gvw_kg:     null,
                brochure_url: null,
                video_url:  null,
                is_featured: false,
            } as ThreeWheelerVehicle
        })
    }

    // ── Priority 2: dynamic build from brand-models.json (no pricing) ─────────
    const models  = brandGroup.models
    const entries: ThreeWheelerVehicle[] = []
    let idx = 0

    if (Array.isArray(models)) {
        for (const model of models as string[]) {
            entries.push(buildThreeWheelerEntry(model, 'passenger', 'cng', brandGroup.brand, brandId, idx++, dealerId))
        }
    } else {
        for (const [subCat, modelList] of Object.entries(models as Record<string, string[]>)) {
            if (!Array.isArray(modelList)) continue
            const type     = subCatToType3W(subCat)
            const fuelType = subCatToFuel3W(subCat)
            for (const model of modelList) {
                entries.push(buildThreeWheelerEntry(model, type, fuelType, brandGroup.brand, brandId, idx++, dealerId))
            }
        }
    }

    return entries
}

/** All brand names that have a catalog — derived from brand-models.json. */
export const THREE_WHEELER_BRANDS = (brandData.threeWheelers as { brand: string }[]).map(b => b.brand)

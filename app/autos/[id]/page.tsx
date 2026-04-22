/**
 * Auto / Three-Wheeler Detail Page (Client Component)
 * /app/autos/[id]/page.tsx
 *
 * Fetches data client-side from /api/autos/[id].
 * Sections: Hero, Overview, Specifications, Features, Variants & Price,
 * EMI Calculator, Similar Autos.
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { getVehicleImageUrls, brandNameToId } from '@/lib/utils/brand-model-images';
import {
    ChevronRight,
    Fuel,
    Zap,
    Users,
    Package,
    Gauge,
    Settings,
    CheckCircle2,
    MapPin,
    Share2,
    Calculator,
    Loader2,
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────

interface AutoRow {
    id: string;
    make: string;
    model: string;
    variant: string | null;
    year: number | null;
    fuel_type: string | null;
    engine_cc: number | null;
    mileage_kmpl: string | number | null;
    range_km: number | null;
    payload_kg: number | null;
    passenger_capacity: number | null;
    price_min_paise: number | null;
    image_url: string | null;
    popularity_score: number | null;
    is_active: boolean;
    max_power: string | null;
    torque: string | null;
    battery_kwh: number | null;
    charging_time_hours: number | null;
    battery_warranty_years: number | null;
    transmission: string | null;
    max_speed_kmph: number | null;
    top_speed_kmph: number | null;
    body_type: string | null;
    description: string | null;
    features: string[] | string | null;
    gvw_kg: number | null;
    wheelbase_mm: number | null;
    created_at: string | null;
    updated_at: string | null;
}

interface VariantItem {
    id: string;
    make: string;
    model: string;
    variant: string | null;
    fuel_type: string;
    price_min_paise: number;
}

// ── Helpers ─────────────────────────────────────────────────────

function formatPrice(paise: number): string {
    if (paise <= 0) return 'Price on request';
    const rupees = paise / 100;
    if (rupees >= 100000) {
        return `\u20B9${(rupees / 100000).toFixed(2)} Lakh`;
    }
    return `\u20B9${rupees.toLocaleString('en-IN')}`;
}

function parseFuelType(raw: string | null): string {
    if (!raw) return 'Petrol';
    const f = raw.toLowerCase();
    if (f === 'electric') return 'Electric';
    if (f === 'cng') return 'CNG';
    if (f === 'diesel') return 'Diesel';
    if (f === 'lpg') return 'LPG';
    return 'Petrol';
}

function parseFeatures(raw: string[] | string | null): string[] {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.filter(Boolean);
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
        return raw.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
}

function parseMileage(raw: string | number | null): number | null {
    if (raw == null) return null;
    if (typeof raw === 'number') return raw;
    const n = parseFloat(raw);
    return isNaN(n) ? null : n;
}

function calculateEmi(principal: number, annualRate: number, months: number) {
    if (principal <= 0 || months <= 0 || annualRate <= 0) return null;
    const r = annualRate / 12 / 100;
    const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    const total = emi * months;
    const interest = total - principal;
    return {
        emi: Math.round(emi),
        total: Math.round(total),
        interest: Math.round(interest),
        loan: Math.round(principal),
    };
}

// ── Page Component ──────────────────────────────────────────────

export default function AutoDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const [vehicle, setVehicle] = useState<AutoRow | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Variants
    const [variants, setVariants] = useState<VariantItem[]>([]);
    const [variantsLoading, setVariantsLoading] = useState(false);

    // Similar autos
    const [similarAutos, setSimilarAutos] = useState<VariantItem[]>([]);

    // EMI state
    const [emiPrice, setEmiPrice] = useState(200000);
    const [emiDown, setEmiDown] = useState(50000);
    const [emiRate, setEmiRate] = useState(12);
    const [emiTenure, setEmiTenure] = useState(36);

    // ── Fetch vehicle detail ────────────────────────────────────
    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null);

        fetch(`/api/autos/${id}`)
            .then(res => res.json())
            .then(json => {
                if (json.success && json.data) {
                    setVehicle(json.data);
                    // Set EMI price from vehicle price
                    const pricePaise = json.data.price_min_paise ?? 0;
                    if (pricePaise > 0) {
                        const priceRupees = pricePaise / 100;
                        setEmiPrice(priceRupees);
                        setEmiDown(Math.round(priceRupees * 0.2));
                    }
                } else {
                    setError('Vehicle not found');
                }
            })
            .catch(() => setError('Failed to load vehicle'))
            .finally(() => setLoading(false));
    }, [id]);

    // ── Fetch variants & similar autos ──────────────────────────
    useEffect(() => {
        if (!vehicle) return;

        // Variants: same make + model name search
        setVariantsLoading(true);
        fetch(`/api/autos?make=${encodeURIComponent(vehicle.make)}&q=${encodeURIComponent(vehicle.model)}&pageSize=20`)
            .then(res => res.json())
            .then(json => {
                if (json.success && json.data?.vehicles) {
                    setVariants(json.data.vehicles);
                }
            })
            .catch(() => {})
            .finally(() => setVariantsLoading(false));

        // Similar: same brand, different models
        fetch(`/api/autos?make=${encodeURIComponent(vehicle.make)}&pageSize=12`)
            .then(res => res.json())
            .then(json => {
                if (json.success && json.data?.vehicles) {
                    // Filter out variants of the same model
                    const others = json.data.vehicles.filter(
                        (v: VariantItem) => v.model.toLowerCase() !== vehicle.model.toLowerCase()
                    );
                    // Deduplicate by model name (keep first)
                    const seen = new Set<string>();
                    const unique = others.filter((v: VariantItem) => {
                        const key = v.model.toLowerCase();
                        if (seen.has(key)) return false;
                        seen.add(key);
                        return true;
                    });
                    setSimilarAutos(unique.slice(0, 4));
                }
            })
            .catch(() => {});
    }, [vehicle]);

    // ── Derived values ──────────────────────────────────────────
    const fuelLabel = vehicle ? parseFuelType(vehicle.fuel_type) : '';
    const isElectric = fuelLabel === 'Electric';
    const mileage = vehicle ? parseMileage(vehicle.mileage_kmpl) : null;
    const features = vehicle ? parseFeatures(vehicle.features) : [];
    const topSpeed = vehicle ? (vehicle.top_speed_kmph ?? vehicle.max_speed_kmph) : null;

    const title = vehicle
        ? vehicle.variant
            ? `${vehicle.make} ${vehicle.model} ${vehicle.variant}`
            : `${vehicle.make} ${vehicle.model}`
        : '';

    const capacityLabel = vehicle
        ? vehicle.passenger_capacity
            ? `${vehicle.passenger_capacity} Passengers`
            : vehicle.payload_kg
                ? `${vehicle.payload_kg} kg Payload`
                : null
        : null;

    const typeLabel = vehicle
        ? isElectric
            ? 'Electric'
            : (vehicle.passenger_capacity ?? 0) > 0
                ? 'Passenger'
                : 'Cargo'
        : '';

    const imageUrls = vehicle
        ? getVehicleImageUrls(
            '3w',
            brandNameToId(vehicle.make, '3w'),
            vehicle.model,
            vehicle.image_url
        )
        : [];

    // EMI calculation
    const emiResult = useMemo(() => {
        const loan = emiPrice - emiDown;
        if (loan <= 0) return null;
        return calculateEmi(loan, emiRate, emiTenure);
    }, [emiPrice, emiDown, emiRate, emiTenure]);

    // Share handler
    const handleShare = useCallback(() => {
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `Check out ${title} on DealerSite Pro`,
                url: window.location.href,
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href).catch(() => {});
        }
    }, [title]);

    // ── Loading state ───────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <SiteHeader />
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    <span className="ml-3 text-gray-500 text-lg">Loading vehicle details...</span>
                </div>
                <SiteFooter />
            </div>
        );
    }

    // ── Error / not found ───────────────────────────────────────
    if (error || !vehicle) {
        return (
            <div className="min-h-screen bg-gray-50">
                <SiteHeader />
                <div className="max-w-7xl mx-auto px-4 py-32 text-center">
                    <p className="text-6xl mb-4">🛺</p>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Auto Not Found</h1>
                    <p className="text-gray-600 mb-6">{error || 'The vehicle you are looking for does not exist.'}</p>
                    <Link
                        href="/autos"
                        className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white text-sm font-semibold px-6 py-3 hover:bg-gray-800 transition-colors"
                    >
                        Browse All Autos
                    </Link>
                </div>
                <SiteFooter />
            </div>
        );
    }

    // ── Spec groups for the Specifications section ──────────────
    const engineSpecs: { label: string; value: string }[] = [];
    if (vehicle.engine_cc) engineSpecs.push({ label: 'Engine Displacement', value: `${vehicle.engine_cc} cc` });
    if (vehicle.max_power) engineSpecs.push({ label: 'Max Power', value: vehicle.max_power });
    if (vehicle.torque) engineSpecs.push({ label: 'Torque', value: vehicle.torque });
    engineSpecs.push({ label: 'Fuel Type', value: fuelLabel });
    if (vehicle.transmission) engineSpecs.push({ label: 'Transmission', value: vehicle.transmission });
    if (vehicle.battery_kwh) engineSpecs.push({ label: 'Battery Capacity', value: `${vehicle.battery_kwh} kWh` });
    if (vehicle.charging_time_hours) engineSpecs.push({ label: 'Charging Time', value: `${vehicle.charging_time_hours} hrs` });
    if (vehicle.battery_warranty_years) engineSpecs.push({ label: 'Battery Warranty', value: `${vehicle.battery_warranty_years} years` });

    const performanceSpecs: { label: string; value: string }[] = [];
    if (mileage) performanceSpecs.push({ label: 'Mileage', value: `${mileage} km/l` });
    if (topSpeed) performanceSpecs.push({ label: 'Max Speed', value: `${topSpeed} km/h` });
    if (vehicle.range_km) performanceSpecs.push({ label: 'Range (EV)', value: `${vehicle.range_km} km` });

    const capacitySpecs: { label: string; value: string }[] = [];
    if (vehicle.passenger_capacity) capacitySpecs.push({ label: 'Passenger Capacity', value: `${vehicle.passenger_capacity}` });
    if (vehicle.payload_kg) capacitySpecs.push({ label: 'Payload', value: `${vehicle.payload_kg} kg` });
    if (vehicle.gvw_kg) capacitySpecs.push({ label: 'Gross Vehicle Weight', value: `${vehicle.gvw_kg} kg` });
    if (vehicle.wheelbase_mm) capacitySpecs.push({ label: 'Wheelbase', value: `${vehicle.wheelbase_mm} mm` });
    if (vehicle.body_type) capacitySpecs.push({ label: 'Body Type', value: vehicle.body_type });

    return (
        <div className="min-h-screen bg-gray-50">
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* ── Breadcrumb ─────────────────────────────────────── */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link href="/autos" className="hover:text-gray-700 transition-colors">Autos</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link
                        href={`/autos?make=${encodeURIComponent(vehicle.make)}`}
                        className="hover:text-gray-700 transition-colors"
                    >
                        {vehicle.make}
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-gray-900 font-medium">{vehicle.model}</span>
                </nav>

                {/* ══════════════════════════════════════════════════════
                    SECTION 1: HERO — Large Image + Price Card
                   ══════════════════════════════════════════════════════ */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Hero Image */}
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                        {imageUrls.length > 0 ? (
                            <div className="relative aspect-[16/10] bg-gray-50">
                                <Image
                                    src={imageUrls[0]}
                                    alt={title}
                                    fill
                                    unoptimized
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <div className="aspect-[16/10] flex items-center justify-center bg-gray-50">
                                <span className="text-7xl">🛺</span>
                            </div>
                        )}
                    </div>

                    {/* Price Card */}
                    <div className="flex flex-col justify-between">
                        {/* Type badges */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                    <span>🛺</span> {typeLabel}
                                </span>
                                {isElectric && (
                                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                        <Zap className="w-3 h-3" /> Electric
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                                {vehicle.make} {vehicle.model}
                            </h1>
                            {vehicle.variant && (
                                <p className="text-base text-gray-600 mt-1">{vehicle.variant}</p>
                            )}

                            {/* Price */}
                            <div className="mt-4 mb-6">
                                {(vehicle.price_min_paise ?? 0) > 0 ? (
                                    <>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {formatPrice(vehicle.price_min_paise!)}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-0.5">Ex-showroom price</p>
                                    </>
                                ) : (
                                    <p className="text-xl font-semibold text-gray-500 italic">
                                        Price on request
                                    </p>
                                )}
                            </div>

                            {/* Quick info pills */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <QuickSpec
                                    icon={<Fuel className="w-4 h-4 text-emerald-600" />}
                                    label="Fuel Type"
                                    value={fuelLabel}
                                />
                                {capacityLabel && (
                                    <QuickSpec
                                        icon={
                                            (vehicle.passenger_capacity ?? 0) > 0
                                                ? <Users className="w-4 h-4 text-blue-600" />
                                                : <Package className="w-4 h-4 text-amber-600" />
                                        }
                                        label={vehicle.passenger_capacity ? 'Passengers' : 'Payload'}
                                        value={capacityLabel}
                                    />
                                )}
                                {isElectric && vehicle.range_km ? (
                                    <QuickSpec
                                        icon={<Zap className="w-4 h-4 text-purple-600" />}
                                        label="Range"
                                        value={`${vehicle.range_km} km`}
                                    />
                                ) : mileage ? (
                                    <QuickSpec
                                        icon={<Gauge className="w-4 h-4 text-blue-600" />}
                                        label="Mileage"
                                        value={`${mileage} km/l`}
                                    />
                                ) : null}
                                {vehicle.transmission && (
                                    <QuickSpec
                                        icon={<Settings className="w-4 h-4 text-gray-600" />}
                                        label="Transmission"
                                        value={vehicle.transmission}
                                    />
                                )}
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/autos"
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-white text-sm font-semibold px-6 py-3 hover:bg-gray-800 transition-colors"
                            >
                                <MapPin className="w-4 h-4" />
                                Find a Dealer
                            </Link>
                            <button
                                onClick={handleShare}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-semibold px-5 py-3 hover:bg-gray-50 transition-colors"
                            >
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════
                    SECTION 2: OVERVIEW — Quick Spec Grid
                   ══════════════════════════════════════════════════════ */}
                <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        {vehicle.make} {vehicle.model} Overview
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        <OverviewCard label="Fuel Type" value={fuelLabel} icon={<Fuel className="w-5 h-5 text-emerald-600" />} />
                        {vehicle.passenger_capacity ? (
                            <OverviewCard
                                label="Passengers"
                                value={`${vehicle.passenger_capacity}`}
                                icon={<Users className="w-5 h-5 text-blue-600" />}
                            />
                        ) : vehicle.payload_kg ? (
                            <OverviewCard
                                label="Payload"
                                value={`${vehicle.payload_kg} kg`}
                                icon={<Package className="w-5 h-5 text-amber-600" />}
                            />
                        ) : null}
                        {isElectric && vehicle.range_km ? (
                            <OverviewCard
                                label="Range"
                                value={`${vehicle.range_km} km`}
                                icon={<Zap className="w-5 h-5 text-purple-600" />}
                            />
                        ) : mileage ? (
                            <OverviewCard
                                label="Mileage"
                                value={`${mileage} km/l`}
                                icon={<Gauge className="w-5 h-5 text-blue-600" />}
                            />
                        ) : null}
                        {vehicle.transmission && (
                            <OverviewCard
                                label="Transmission"
                                value={vehicle.transmission}
                                icon={<Settings className="w-5 h-5 text-gray-600" />}
                            />
                        )}
                        <OverviewCard
                            label="Type"
                            value={typeLabel}
                            icon={<span className="text-lg">🛺</span>}
                        />
                    </div>

                    {/* Description if available */}
                    {vehicle.description && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {vehicle.description}
                            </p>
                        </div>
                    )}
                </section>

                {/* ══════════════════════════════════════════════════════
                    SECTION 3: SPECIFICATIONS — Full Spec Tables
                   ══════════════════════════════════════════════════════ */}
                <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        {vehicle.make} {vehicle.model} Specifications
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Engine & Transmission */}
                        {engineSpecs.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-gray-500" />
                                    Engine & Transmission
                                </h3>
                                <div className="space-y-0">
                                    {engineSpecs.map((spec, i) => (
                                        <SpecRow key={i} label={spec.label} value={spec.value} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Performance */}
                        {performanceSpecs.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Gauge className="w-4 h-4 text-gray-500" />
                                    Performance
                                </h3>
                                <div className="space-y-0">
                                    {performanceSpecs.map((spec, i) => (
                                        <SpecRow key={i} label={spec.label} value={spec.value} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Capacity & Dimensions */}
                        {capacitySpecs.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-gray-500" />
                                    Capacity & Dimensions
                                </h3>
                                <div className="space-y-0">
                                    {capacitySpecs.map((spec, i) => (
                                        <SpecRow key={i} label={spec.label} value={spec.value} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════
                    SECTION 4: FEATURES — Key Features List
                   ══════════════════════════════════════════════════════ */}
                {features.length > 0 && (
                    <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            {vehicle.make} {vehicle.model} Key Features
                        </h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {features.map((feature, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-start gap-2.5 text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-3"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* ══════════════════════════════════════════════════════
                    SECTION 5: VARIANTS & PRICE
                   ══════════════════════════════════════════════════════ */}
                <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        {vehicle.make} {vehicle.model} Variants & Price
                    </h2>
                    {variantsLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-5 h-5 animate-spin text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500">Loading variants...</span>
                        </div>
                    ) : variants.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50/60">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Variant</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Ex-Showroom Price</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Fuel</th>
                                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {variants.map((v) => (
                                        <tr
                                            key={v.id}
                                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${v.id === vehicle.id ? 'bg-blue-50/40' : ''}`}
                                        >
                                            <td className="py-3 px-4">
                                                <span className="font-medium text-gray-900">
                                                    {v.variant || v.model}
                                                </span>
                                                {v.id === vehicle.id && (
                                                    <span className="ml-2 inline-flex items-center bg-blue-100 text-blue-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                                                        Current
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-gray-900">
                                                {formatPrice(v.price_min_paise)}
                                            </td>
                                            <td className="py-3 px-4 text-gray-700">
                                                {parseFuelType(v.fuel_type)}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                {v.id !== vehicle.id ? (
                                                    <Link
                                                        href={`/autos/${v.id}`}
                                                        className="inline-flex items-center text-xs font-semibold text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition-colors"
                                                    >
                                                        View
                                                    </Link>
                                                ) : (
                                                    <span className="text-xs text-gray-400">Viewing</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-8">
                            Variant details are not available yet.
                        </p>
                    )}
                </section>

                {/* ══════════════════════════════════════════════════════
                    SECTION 6: EMI CALCULATOR
                   ══════════════════════════════════════════════════════ */}
                <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        {vehicle.make} {vehicle.model} EMI Calculator
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Inputs */}
                        <div className="space-y-6">
                            <EmiSlider
                                label="Vehicle Price"
                                value={emiPrice}
                                min={50000}
                                max={1000000}
                                step={10000}
                                onChange={setEmiPrice}
                                format={(v) => `\u20B9${Math.round(v).toLocaleString('en-IN')}`}
                            />
                            <EmiSlider
                                label="Down Payment"
                                value={emiDown}
                                min={0}
                                max={Math.max(emiPrice - 10000, 0)}
                                step={5000}
                                onChange={setEmiDown}
                                format={(v) => `\u20B9${Math.round(v).toLocaleString('en-IN')}`}
                            />
                            <EmiSlider
                                label="Loan Tenure"
                                value={emiTenure}
                                min={6}
                                max={60}
                                step={6}
                                onChange={setEmiTenure}
                                format={(v) => `${v} months`}
                            />
                            <EmiSlider
                                label="Interest Rate"
                                value={emiRate}
                                min={6}
                                max={24}
                                step={0.5}
                                onChange={setEmiRate}
                                format={(v) => `${v}% p.a.`}
                            />
                        </div>

                        {/* Result */}
                        <div>
                            {emiResult ? (
                                <div className="bg-gray-50 rounded-2xl p-6 h-full flex flex-col">
                                    <div className="text-center pb-4 mb-4 border-b border-gray-200">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Monthly EMI</p>
                                        <p className="text-4xl font-bold text-gray-900">
                                            ₹{emiResult.emi.toLocaleString('en-IN')}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">per month for {emiTenure} months</p>
                                    </div>
                                    <div className="space-y-3 flex-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Loan Amount</span>
                                            <span className="font-semibold text-gray-900">₹{emiResult.loan.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Total Interest</span>
                                            <span className="font-semibold text-gray-900">₹{emiResult.interest.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-semibold text-gray-700">Total Payable</span>
                                                <span className="font-bold text-gray-900">₹{emiResult.total.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Principal vs Interest bar */}
                                    <div className="mt-4">
                                        <div className="flex justify-between text-[11px] mb-1">
                                            <span className="text-gray-600">
                                                Principal {Math.round((emiResult.loan / emiResult.total) * 100)}%
                                            </span>
                                            <span className="text-gray-600">
                                                Interest {Math.round((emiResult.interest / emiResult.total) * 100)}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gray-900 rounded-full transition-all"
                                                style={{ width: `${(emiResult.loan / emiResult.total) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-3">
                                        * Indicative EMI. Actual values may vary based on lender terms.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-2xl flex h-full items-center justify-center p-6">
                                    <div className="text-center">
                                        <Calculator className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                        <p className="text-sm text-gray-500">Adjust sliders to calculate EMI</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════
                    SECTION 7: SIMILAR AUTOS
                   ══════════════════════════════════════════════════════ */}
                {similarAutos.length > 0 && (
                    <section className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                Similar {vehicle.make} Autos
                            </h2>
                            <Link
                                href={`/autos?make=${encodeURIComponent(vehicle.make)}`}
                                className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline transition-colors"
                            >
                                View All
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {similarAutos.map((auto) => (
                                <SimilarAutoCard key={auto.id} auto={auto} />
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Bottom CTA ────────────────────────────────────── */}
                <section className="bg-gray-900 rounded-2xl p-8 text-center mb-8">
                    <h2 className="text-xl font-bold text-white mb-2">
                        Interested in the {vehicle.make} {vehicle.model}?
                    </h2>
                    <p className="text-gray-300 text-sm mb-5">
                        Find an authorized dealer near you for the best prices and offers.
                    </p>
                    <Link
                        href="/autos"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-gray-900 text-sm font-semibold px-6 py-3 hover:bg-gray-100 transition-colors"
                    >
                        <MapPin className="w-4 h-4" />
                        Find a Dealer
                    </Link>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}

// ── Sub-components ──────────────────────────────────────────────

function QuickSpec({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
            <div className="shrink-0">{icon}</div>
            <div>
                <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
                    {label}
                </p>
                <p className="text-sm font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    );
}

function OverviewCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center text-center bg-gray-50 rounded-xl px-3 py-4 gap-2">
            <div>{icon}</div>
            <div>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{value}</p>
            </div>
        </div>
    );
}

function SpecRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
    );
}

function EmiSlider({
    label,
    value,
    min,
    max,
    step,
    onChange,
    format,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
    format: (v: number) => string;
}) {
    const safeMax = Math.max(min + step, max);
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    {label}
                </label>
                <span className="text-sm font-bold text-gray-900">{format(value)}</span>
            </div>
            <input
                type="range"
                min={min}
                max={safeMax}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-gray-900"
            />
        </div>
    );
}

function SimilarAutoCard({ auto }: { auto: VariantItem }) {
    const imageUrls = getVehicleImageUrls(
        '3w',
        brandNameToId(auto.make, '3w'),
        auto.model,
        auto.image_url ?? null
    );
    const [imgIdx, setImgIdx] = useState(0);
    const [imgFailed, setImgFailed] = useState(false);

    return (
        <Link
            href={`/autos/${auto.id}`}
            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="relative aspect-[16/10] bg-gray-50">
                {!imgFailed && imageUrls.length > 0 ? (
                    <Image
                        src={imageUrls[imgIdx]}
                        alt={`${auto.make} ${auto.model}`}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                        onError={() => {
                            if (imgIdx < imageUrls.length - 1) setImgIdx(prev => prev + 1);
                            else setImgFailed(true);
                        }}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <span className="text-4xl">🛺</span>
                    </div>
                )}
            </div>
            <div className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                    {auto.make}
                </p>
                <h3 className="mt-1 line-clamp-1 text-lg font-bold text-gray-900">
                    {auto.model}
                </h3>
                <p className="mt-2 text-base font-semibold text-gray-900">
                    {formatPrice(auto.price_min_paise)}
                </p>
                <div className="mt-3 inline-flex items-center rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-semibold transition-opacity group-hover:opacity-90">
                    View Details
                </div>
            </div>
        </Link>
    );
}

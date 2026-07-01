/**
 * Auto / Three-Wheeler Detail Page (Client Component)
 * /app/autos/[id]/page.tsx
 *
 * Fetches data client-side from /api/autos/[id].
 * Sections: Hero, Overview, Specifications, Features, Variants & Price,
 * EMI Calculator, Similar Autos.
 */

'use client';

import { useState, useEffect, useMemo, useCallback, type CSSProperties } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
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
import { brandNameToId, getVehicleImageUrls } from '@/lib/utils/brand-model-images';

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
    image_urls: string[];
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
    variants: ApiVariant[];
}

function modelImageSourceKind(src: string | null | undefined) {
    const value = String(src ?? '').toLowerCase();
    if (
        value.includes('/storage/v1/object/public/dealer-assets/vehicles/') ||
        value.includes('/storage/v1/object/public/dealer-assets/sell-requests/') ||
        value.includes('/storage/v1/object/public/vehicle-images/')
    ) {
        return 'inventory-photo';
    }
    return 'resolved-model';
}

interface ApiVariant {
    id: string;
    variant: string | null;
    fuel_type: string;
    price_min_paise: number;
    engine_cc: number | null;
    max_power: string | null;
    mileage_kmpl: number | null;
    range_km: number | null;
}

interface VariantItem {
    id: string;
    make: string;
    model: string;
    variant: string | null;
    fuel_type: string;
    price_min_paise: number;
    image_url?: string | null;
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

    // ── Fetch similar autos ───────────────────────────────────
    useEffect(() => {
        if (!vehicle) return;

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

    // Use image_urls from the API (resolved server-side via filesystem scan)
    const imageUrls = vehicle?.image_urls?.length ? vehicle.image_urls : [];

    // Variants come directly from the detail API (all fuel-type variants for same model)
    const variants = vehicle?.variants ?? [];

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
            <div className="min-h-screen bg-background">
                <SiteHeader />
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    <span className="ml-3 text-muted-foreground text-lg">Loading vehicle details...</span>
                </div>
                <SiteFooter />
            </div>
        );
    }

    // ── Error / not found ───────────────────────────────────────
    if (error || !vehicle) {
        return (
            <div className="min-h-screen bg-background">
                <SiteHeader />
                <div className="max-w-7xl mx-auto px-4 py-32 text-center">
                    <p className="text-6xl mb-4">🛺</p>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Auto Not Found</h1>
                    <p className="text-muted-foreground mb-6">{error || 'The vehicle you are looking for does not exist.'}</p>
                    <Link
                        href="/autos"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold px-6 py-3 hover:opacity-90 transition-opacity"
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
        <div className="min-h-screen bg-background">
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* ── Breadcrumb ─────────────────────────────────────── */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link href="/autos" className="hover:text-foreground transition-colors">Autos</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link
                        href={`/autos?make=${encodeURIComponent(vehicle.make)}`}
                        className="hover:text-foreground transition-colors"
                    >
                        {vehicle.make}
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-foreground font-medium">{vehicle.model}</span>
                </nav>

                {/* ══════════════════════════════════════════════════════
                    SECTION 1: HERO — Large Image + Price Card
                   ══════════════════════════════════════════════════════ */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Hero Image */}
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                        <HeroImage imageUrls={imageUrls} alt={title} />
                    </div>

                    {/* Price Card */}
                    <div className="flex flex-col justify-between">
                        {/* Type badges */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                                    <span>🛺</span> {typeLabel}
                                </span>
                                {isElectric && (
                                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                                        <Zap className="w-3 h-3" /> Electric
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                                {vehicle.make} {vehicle.model}
                            </h1>
                            {vehicle.variant && (
                                <p className="text-base text-muted-foreground mt-1">{vehicle.variant}</p>
                            )}

                            {/* Price */}
                            <div className="mt-4 mb-6">
                                {(vehicle.price_min_paise ?? 0) > 0 ? (
                                    <>
                                        <p className="text-3xl font-bold text-foreground">
                                            {formatPrice(vehicle.price_min_paise!)}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-0.5">Ex-showroom price</p>
                                    </>
                                ) : (
                                    <p className="text-xl font-semibold text-muted-foreground italic">
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
                                        icon={<Settings className="w-4 h-4 text-muted-foreground" />}
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
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold px-6 py-3 hover:opacity-90 transition-opacity"
                            >
                                <MapPin className="w-4 h-4" />
                                Find a Dealer
                            </Link>
                            <button
                                onClick={handleShare}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card text-foreground text-sm font-semibold px-5 py-3 hover:bg-muted transition-colors"
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
                <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-8">
                    <h2 className="text-xl font-bold text-foreground mb-6">
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
                                icon={<Settings className="w-5 h-5 text-muted-foreground" />}
                            />
                        )}
                        {/* Type card removed — not useful for users */}
                    </div>

                    {/* Description if available */}
                    {vehicle.description && (
                        <div className="mt-6 pt-6 border-t border-border">
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                {vehicle.description}
                            </p>
                        </div>
                    )}
                </section>

                {/* ══════════════════════════════════════════════════════
                    SECTION 3: SPECIFICATIONS — Full Spec Tables
                   ══════════════════════════════════════════════════════ */}
                <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-8">
                    <h2 className="text-xl font-bold text-foreground mb-6">
                        {vehicle.make} {vehicle.model} Specifications
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Engine & Transmission */}
                        {engineSpecs.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-muted-foreground" />
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
                                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Gauge className="w-4 h-4 text-muted-foreground" />
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
                                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-muted-foreground" />
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
                    <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-8">
                        <h2 className="text-xl font-bold text-foreground mb-6">
                            {vehicle.make} {vehicle.model} Key Features
                        </h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {features.map((feature, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-start gap-2.5 text-sm text-muted-foreground bg-muted rounded-xl px-4 py-3"
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
                <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-8">
                    <h2 className="text-xl font-bold text-foreground mb-6">
                        {vehicle.make} {vehicle.model} Variants & Price
                    </h2>
                    {variants.length > 0 ? (
                        <>
                            <div className="space-y-3 md:hidden">
                                {variants.map((v) => (
                                    <article
                                        key={v.id}
                                        className={`rounded-xl border p-4 ${v.id === vehicle.id ? 'border-primary bg-primary/5' : 'border-border bg-background'}`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h3 className="break-words text-sm font-semibold text-foreground">
                                                    {v.variant || vehicle.model}
                                                </h3>
                                                {v.id === vehicle.id && (
                                                    <span className="mt-1 inline-flex items-center rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                            <div className="shrink-0 text-right text-sm font-bold text-foreground">
                                                {formatPrice(v.price_min_paise)}
                                            </div>
                                        </div>
                                        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                                            <div>
                                                <span className="block text-muted-foreground">Fuel</span>
                                                <span className="font-medium text-foreground">{parseFuelType(v.fuel_type)}</span>
                                            </div>
                                            <div>
                                                <span className="block text-muted-foreground">Power</span>
                                                <span className="font-medium text-foreground">{v.max_power || '-'}</span>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            {v.id !== vehicle.id ? (
                                                <Link
                                                    href={`/autos/${v.id}`}
                                                    className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-border px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                                                >
                                                    View Variant
                                                </Link>
                                            ) : (
                                                <span className="inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                                                    Viewing
                                                </span>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full min-w-[720px] text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/60">
                                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Variant</th>
                                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Ex-Showroom Price</th>
                                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Fuel</th>
                                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Power</th>
                                        <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {variants.map((v) => (
                                        <tr
                                            key={v.id}
                                            className={`border-b border-border hover:bg-muted transition-colors ${v.id === vehicle.id ? 'bg-primary/5' : ''}`}
                                        >
                                            <td className="py-3 px-4">
                                                <span className="block max-w-[260px] truncate font-medium text-foreground">
                                                    {v.variant || vehicle.model}
                                                </span>
                                                {v.id === vehicle.id && (
                                                    <span className="ml-2 inline-flex items-center bg-primary/10 text-primary text-[10px] font-semibold px-1.5 py-0.5 rounded">
                                                        Current
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-foreground whitespace-nowrap">
                                                {formatPrice(v.price_min_paise)}
                                            </td>
                                            <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                                                {parseFuelType(v.fuel_type)}
                                            </td>
                                            <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                                                {v.max_power || '-'}
                                            </td>
                                            <td className="py-3 px-4 text-right whitespace-nowrap">
                                                {v.id !== vehicle.id ? (
                                                    <Link
                                                        href={`/autos/${v.id}`}
                                                        className="inline-flex items-center text-xs font-semibold text-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors"
                                                    >
                                                        View
                                                    </Link>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">Viewing</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            Only one variant available for this model.
                        </p>
                    )}
                </section>

                {/* ══════════════════════════════════════════════════════
                    SECTION 6: EMI CALCULATOR
                   ══════════════════════════════════════════════════════ */}
                <section className="bg-card border border-border rounded-2xl p-5 sm:p-6 lg:p-8 mb-8 shadow-sm">
                    <h2 className="text-xl font-bold text-foreground mb-6 sm:mb-8">
                        {vehicle.make} {vehicle.model} EMI Calculator
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-6 lg:gap-8 items-stretch">
                        {/* Inputs */}
                        <div className="space-y-5 sm:space-y-6">
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
                                <div className="bg-muted/70 rounded-2xl p-5 sm:p-6 h-full min-h-[320px] flex flex-col">
                                    <div className="text-center pb-4 mb-4 border-b border-border">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Monthly EMI</p>
                                        <p className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
                                            ₹{emiResult.emi.toLocaleString('en-IN')}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">per month for {emiTenure} months</p>
                                    </div>
                                    <div className="space-y-3 flex-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Loan Amount</span>
                                            <span className="font-semibold text-foreground">₹{emiResult.loan.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Total Interest</span>
                                            <span className="font-semibold text-foreground">₹{emiResult.interest.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="border-t border-border pt-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-semibold text-muted-foreground">Total Payable</span>
                                                <span className="font-bold text-foreground">₹{emiResult.total.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Principal vs Interest bar */}
                                    <div className="mt-4">
                                        <div className="flex justify-between text-[11px] mb-1">
                                            <span className="text-muted-foreground">
                                                Principal {Math.round((emiResult.loan / emiResult.total) * 100)}%
                                            </span>
                                            <span className="text-muted-foreground">
                                                Interest {Math.round((emiResult.interest / emiResult.total) * 100)}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all"
                                                style={{ width: `${(emiResult.loan / emiResult.total) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-3">
                                        * Indicative EMI. Actual values may vary based on lender terms.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-muted rounded-2xl flex h-full items-center justify-center p-6">
                                    <div className="text-center">
                                        <Calculator className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-sm text-muted-foreground">Adjust sliders to calculate EMI</p>
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
                            <h2 className="text-xl font-bold text-foreground">
                                Similar {vehicle.make} Autos
                            </h2>
                            <Link
                                href={`/autos?make=${encodeURIComponent(vehicle.make)}`}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline transition-colors"
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
                <section className="bg-primary rounded-2xl p-8 text-center mb-8">
                    <h2 className="text-xl font-bold text-primary-foreground mb-2">
                        Interested in the {vehicle.make} {vehicle.model}?
                    </h2>
                    <p className="text-primary-foreground/80 text-sm mb-5">
                        Find an authorized dealer near you for the best prices and offers.
                    </p>
                    <Link
                        href="/autos"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-background text-foreground text-sm font-semibold px-6 py-3 hover:bg-muted transition-colors"
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
        <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3">
            <div className="shrink-0">{icon}</div>
            <div>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                    {label}
                </p>
                <p className="text-sm font-semibold text-foreground">{value}</p>
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
        <div className="flex flex-col items-center text-center bg-muted rounded-xl px-3 py-4 gap-2">
            <div>{icon}</div>
            <div>
                <p className="text-xs text-muted-foreground font-medium">{label}</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{value}</p>
            </div>
        </div>
    );
}

function SpecRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center py-2.5 border-b border-border">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium text-foreground">{value}</span>
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
    const safeValue = Math.min(Math.max(value, min), safeMax);
    const progress = ((safeValue - min) / (safeMax - min)) * 100;
    const sliderStyle = {
        '--emi-range-progress': `${progress}%`,
    } as CSSProperties;

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-x-4 gap-y-1 mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {label}
                </label>
                <span className="text-sm font-bold text-foreground">{format(value)}</span>
            </div>
            <input
                aria-label={label}
                type="range"
                min={min}
                max={safeMax}
                step={step}
                value={safeValue}
                onChange={(e) => onChange(Number(e.target.value))}
                className="emi-range w-full cursor-pointer"
                style={sliderStyle}
            />
        </div>
    );
}

function SimilarAutoCard({ auto }: { auto: VariantItem }) {
    const imageUrls = getVehicleImageUrls('3w', brandNameToId(auto.make, '3w'), auto.model, auto.image_url);
    const [imgIdx, setImgIdx] = useState(0);
    const [imgFailed, setImgFailed] = useState(false);
    const imageSrc = imageUrls[imgIdx] ?? null;

    if (!imageSrc || imgFailed) return null;

    return (
        <Link
            href={`/autos/${auto.id}`}
            data-vehicle-card="true"
            data-model-image-source={modelImageSourceKind(imageSrc)}
            className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="relative aspect-[16/10] bg-muted">
                <Image
                    src={imageSrc}
                    alt={`${auto.make} ${auto.model}`}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    onError={() => {
                        if (imgIdx < imageUrls.length - 1) setImgIdx((current) => current + 1);
                        else setImgFailed(true);
                    }}
                />
            </div>
            <div className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    {auto.make}
                </p>
                <h3 className="mt-1 line-clamp-1 text-lg font-bold text-foreground">
                    {auto.model}
                </h3>
                <p className="mt-2 text-base font-semibold text-foreground">
                    {formatPrice(auto.price_min_paise)}
                </p>
                <div className="mt-3 inline-flex items-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold transition-opacity group-hover:opacity-90">
                    View Details
                </div>
            </div>
        </Link>
    );
}

/** Hero image with fallback cycling through all candidate URLs */
function HeroImage({ imageUrls, alt }: { imageUrls: string[]; alt: string }) {
    const [idx, setIdx] = useState(0);
    const [failed, setFailed] = useState(false);

    if (failed || imageUrls.length === 0) return null;

    return (
        <div className="relative aspect-[16/10] bg-muted">
            <Image
                src={imageUrls[idx]}
                alt={alt}
                fill
                unoptimized
                className="object-contain"
                onError={() => {
                    if (idx < imageUrls.length - 1) setIdx(idx + 1);
                    else setFailed(true);
                }}
            />
        </div>
    );
}

/**
 * Auto / Three-Wheeler Detail Page
 * /app/autos/[id]/page.tsx
 * Server component — fetches a single vehicle from thw_catalog by ID
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
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
} from 'lucide-react';

// ── Supabase helper ──────────────────────────────────────────────

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key || url.includes('placeholder')) return null;
    return createClient(url, key);
}

// ── Data fetcher ─────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getAutoById(id: string): Promise<any | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('thw_catalog')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return null;
    return data;
}

// ── Types (from DB row) ──────────────────────────────────────────

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

// ── Helpers ──────────────────────────────────────────────────────

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
        // not JSON — try comma-separated
        return raw.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
}

// ── Metadata ─────────────────────────────────────────────────────

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const vehicle = await getAutoById(id);

    if (!vehicle) {
        return { title: 'Auto Not Found | DealerSite Pro' };
    }

    const title = vehicle.variant
        ? `${vehicle.make} ${vehicle.model} ${vehicle.variant}`
        : `${vehicle.make} ${vehicle.model}`;

    return {
        title: `${title} Price, Specs & Features | DealerSite Pro`,
        description: `Check out ${title} price, specifications, mileage, payload capacity, and features. Find the best auto-rickshaw deals on DealerSite Pro.`,
        openGraph: {
            title: `${title} — Price & Specs`,
            description: `${title} starting at ${formatPrice(vehicle.price_min_paise ?? 0)} ex-showroom.`,
        },
    };
}

// ── Page Component ───────────────────────────────────────────────

export default async function AutoDetailPage({ params }: Props) {
    const { id } = await params;
    const vehicle: AutoRow | null = await getAutoById(id);

    if (!vehicle) {
        notFound();
    }

    // Image resolution
    const imageUrls = getVehicleImageUrls(
        '3w',
        brandNameToId(vehicle.make, '3w'),
        vehicle.model,
        vehicle.image_url
    );

    const fuelLabel = parseFuelType(vehicle.fuel_type);
    const isElectric = fuelLabel === 'Electric';

    const mileage = vehicle.mileage_kmpl
        ? typeof vehicle.mileage_kmpl === 'string'
            ? parseFloat(vehicle.mileage_kmpl)
            : vehicle.mileage_kmpl
        : null;

    const capacityLabel = vehicle.passenger_capacity
        ? `${vehicle.passenger_capacity} Passengers`
        : vehicle.payload_kg
            ? `${vehicle.payload_kg} kg Payload`
            : null;

    const typeLabel = isElectric
        ? 'Electric'
        : (vehicle.passenger_capacity ?? 0) > 0
            ? 'Passenger'
            : 'Cargo';

    const features = parseFeatures(vehicle.features);

    const title = vehicle.variant
        ? `${vehicle.make} ${vehicle.model} ${vehicle.variant}`
        : `${vehicle.make} ${vehicle.model}`;

    const topSpeed = vehicle.top_speed_kmph ?? vehicle.max_speed_kmph;

    return (
        <div className="min-h-screen bg-gray-50">
            <SiteHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-gray-700 transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link href="/autos" className="hover:text-gray-700 transition-colors">
                        Autos
                    </Link>
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

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Image */}
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                        <AutoHeroImage imageUrls={imageUrls} alt={title} />
                    </div>

                    {/* Summary */}
                    <div>
                        {/* Type badge */}
                        <div className="flex items-center gap-2 mb-2">
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

                        {/* Quick Specs Grid */}
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
                                    label={vehicle.passenger_capacity ? 'Passenger Capacity' : 'Payload'}
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

                        {/* Find a Dealer CTA */}
                        <Link
                            href="/autos"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-white text-sm font-semibold px-6 py-3 hover:bg-gray-800 transition-colors"
                        >
                            <MapPin className="w-4 h-4" />
                            Find a Dealer
                        </Link>
                    </div>
                </div>

                {/* Detailed Specs Section */}
                <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Specifications</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                        <SpecRow label="Brand" value={vehicle.make} />
                        <SpecRow label="Model" value={vehicle.model} />
                        {vehicle.variant && <SpecRow label="Variant" value={vehicle.variant} />}
                        {vehicle.year && <SpecRow label="Year" value={String(vehicle.year)} />}
                        <SpecRow label="Type" value={typeLabel} />
                        <SpecRow label="Fuel Type" value={fuelLabel} />
                        {vehicle.engine_cc && (
                            <SpecRow label="Engine" value={`${vehicle.engine_cc} cc`} />
                        )}
                        {vehicle.max_power && (
                            <SpecRow label="Max Power" value={vehicle.max_power} />
                        )}
                        {vehicle.torque && (
                            <SpecRow label="Torque" value={vehicle.torque} />
                        )}
                        {vehicle.battery_kwh && (
                            <SpecRow label="Battery" value={`${vehicle.battery_kwh} kWh`} />
                        )}
                        {vehicle.range_km && (
                            <SpecRow label="Range" value={`${vehicle.range_km} km`} />
                        )}
                        {vehicle.charging_time_hours && (
                            <SpecRow label="Charging Time" value={`${vehicle.charging_time_hours} hrs`} />
                        )}
                        {vehicle.battery_warranty_years && (
                            <SpecRow label="Battery Warranty" value={`${vehicle.battery_warranty_years} years`} />
                        )}
                        {mileage && (
                            <SpecRow label="Mileage" value={`${mileage} km/l`} />
                        )}
                        {topSpeed && (
                            <SpecRow label="Top Speed" value={`${topSpeed} km/h`} />
                        )}
                        {vehicle.transmission && (
                            <SpecRow label="Transmission" value={vehicle.transmission} />
                        )}
                        {vehicle.passenger_capacity && (
                            <SpecRow label="Passenger Capacity" value={`${vehicle.passenger_capacity}`} />
                        )}
                        {vehicle.payload_kg && (
                            <SpecRow label="Payload" value={`${vehicle.payload_kg} kg`} />
                        )}
                        {vehicle.gvw_kg && (
                            <SpecRow label="GVW" value={`${vehicle.gvw_kg} kg`} />
                        )}
                        {vehicle.wheelbase_mm && (
                            <SpecRow label="Wheelbase" value={`${vehicle.wheelbase_mm} mm`} />
                        )}
                        {vehicle.body_type && (
                            <SpecRow label="Body Type" value={vehicle.body_type} />
                        )}
                    </div>
                </section>

                {/* Features Section */}
                {features.length > 0 && (
                    <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Key Features</h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {features.map((feature, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-start gap-2 text-sm text-gray-700"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Description Section */}
                {vehicle.description && (
                    <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">About this Vehicle</h2>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {vehicle.description}
                        </p>
                    </section>
                )}

                {/* Find a Dealer CTA (bottom) */}
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

// ── Sub-components ───────────────────────────────────────────────

function AutoHeroImage({ imageUrls, alt }: { imageUrls: string[]; alt: string }) {
    if (imageUrls.length === 0) {
        return (
            <div className="aspect-[16/10] flex items-center justify-center bg-gray-50">
                <span className="text-7xl">🛺</span>
            </div>
        );
    }

    return (
        <div className="relative aspect-[16/10] bg-gray-50">
            <Image
                src={imageUrls[0]}
                alt={alt}
                fill
                unoptimized
                className="object-contain"
            />
        </div>
    );
}

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

function SpecRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
    );
}

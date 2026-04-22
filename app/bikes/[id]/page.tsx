/**
 * Bike Detail Page
 * /app/bikes/[id]/page.tsx
 * Server component — shows full details for a two-wheeler model from tw_catalog.
 */

import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { getVehicleImageUrls, brandNameToId } from '@/lib/utils/brand-model-images';
import { Fuel, Gauge, Zap, Bike, ChevronRight, Shield, Sparkles } from 'lucide-react';
import { BikeDetailHeroImage } from './BikeDetailHeroImage';

// ── Supabase helper ──────────────────────────────────────────
function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key || url.includes('placeholder')) return null;
    return createClient(url, key);
}

// ── Data fetcher ─────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getBikeById(id: string): Promise<any | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('tw_catalog')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return null;
    return data;
}

// ── Price formatter ──────────────────────────────────────────
function formatPricePaise(paise: number): string {
    if (paise <= 0) return 'Price on request';
    const inr = paise / 100;
    return `₹${inr.toLocaleString('en-IN')}`;
}

// ── Types ────────────────────────────────────────────────────
interface Props {
    params: Promise<{ id: string }>;
}

// ── SEO Metadata ─────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const bike = await getBikeById(id);

    if (!bike) {
        return { title: 'Bike Not Found | DealerSite Pro' };
    }

    const variant = bike.variant ? ` ${bike.variant}` : '';
    const price = bike.price_min_paise > 0
        ? ` Price starts at ${formatPricePaise(bike.price_min_paise)}.`
        : '';

    return {
        title: `${bike.make} ${bike.model}${variant} Price, Specs, Features | DealerSite Pro`,
        description: `Check out ${bike.make} ${bike.model}${variant} price, mileage, specifications, features, and images.${price}`,
    };
}

// ── Page Component ───────────────────────────────────────────
export default async function BikeDetailPage({ params }: Props) {
    const { id } = await params;
    const bike = await getBikeById(id);

    if (!bike) {
        notFound();
    }

    // Derived values
    const fuelRaw = (bike.fuel_type ?? '').toLowerCase();
    const isElectric = fuelRaw === 'electric';
    const bodyType = (bike.body_type ?? '').toLowerCase();
    const vehicleType = isElectric ? 'Electric' : bodyType.includes('scooter') ? 'Scooter' : 'Bike';
    const fuelLabel = isElectric ? 'Electric' : 'Petrol';
    const transmissionLabel = bike.transmission ?? (isElectric ? 'Automatic' : '--');
    const mileageKmpl = bike.mileage_kmpl ? parseFloat(bike.mileage_kmpl) : null;

    // Image fallback chain
    const brandId = brandNameToId(bike.make, '2w');
    const imageUrls = getVehicleImageUrls('2w', brandId, bike.model, bike.image_url);

    // Features & safety from DB (arrays or null)
    const features: string[] = bike.features ?? [];
    const safetyFeatures: string[] = bike.safety_features ?? [];

    return (
        <>
            <SiteHeader />

            <main className="bg-background min-h-screen">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                    {/* Breadcrumb */}
                    <nav className="text-sm text-gray-700 mb-6">
                        <ol className="flex items-center gap-1.5 flex-wrap">
                            <li>
                                <Link href="/" className="hover:underline text-gray-700">Home</Link>
                            </li>
                            <li><ChevronRight className="w-3.5 h-3.5 text-gray-400" /></li>
                            <li>
                                <Link href="/bikes" className="hover:underline text-gray-700">Bikes</Link>
                            </li>
                            <li><ChevronRight className="w-3.5 h-3.5 text-gray-400" /></li>
                            <li>
                                <Link
                                    href={`/bikes?make=${encodeURIComponent(bike.make)}`}
                                    className="hover:underline text-gray-700"
                                >
                                    {bike.make}
                                </Link>
                            </li>
                            <li><ChevronRight className="w-3.5 h-3.5 text-gray-400" /></li>
                            <li className="text-gray-900 font-medium">{bike.model}</li>
                        </ol>
                    </nav>

                    {/* Hero section: Image + Info */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Hero Image */}
                        <div className="relative aspect-[4/3] bg-muted/30 rounded-2xl overflow-hidden">
                            <BikeDetailHeroImage
                                imageUrls={imageUrls}
                                alt={`${bike.make} ${bike.model}`}
                            />
                        </div>

                        {/* Info panel */}
                        <div className="space-y-5">
                            {/* Title */}
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                                    {bike.make}
                                </p>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {bike.model}
                                </h1>
                                {bike.variant && (
                                    <p className="text-gray-700 mt-0.5">{bike.variant}</p>
                                )}
                                {bike.year && (
                                    <p className="text-sm text-gray-700 mt-0.5">{bike.year} Model</p>
                                )}
                            </div>

                            {/* Price */}
                            <div className="rounded-xl p-4 border border-primary/20 bg-primary/5">
                                <p className="text-3xl font-bold text-primary">
                                    {formatPricePaise(bike.price_min_paise ?? 0)}
                                </p>
                                <p className="text-xs text-gray-700">Ex-showroom</p>
                            </div>

                            {/* Quick Specs Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Fuel Type */}
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40">
                                    <Fuel className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-gray-700 leading-none">Fuel</p>
                                        <p className="text-sm font-semibold text-gray-900">{fuelLabel}</p>
                                    </div>
                                </div>

                                {/* Transmission */}
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40">
                                    <Gauge className="w-4 h-4 text-blue-600 shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-gray-700 leading-none">Transmission</p>
                                        <p className="text-sm font-semibold text-gray-900">{transmissionLabel}</p>
                                    </div>
                                </div>

                                {/* Engine CC or Battery */}
                                {isElectric ? (
                                    bike.battery_kwh && (
                                        <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40">
                                            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-gray-700 leading-none">Battery</p>
                                                <p className="text-sm font-semibold text-gray-900">{bike.battery_kwh} kWh</p>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    bike.engine_cc && (
                                        <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40">
                                            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-gray-700 leading-none">Engine</p>
                                                <p className="text-sm font-semibold text-gray-900">{bike.engine_cc} cc</p>
                                            </div>
                                        </div>
                                    )
                                )}

                                {/* Mileage or Range */}
                                {isElectric && bike.range_km ? (
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40">
                                        <Bike className="w-4 h-4 text-purple-600 shrink-0" />
                                        <div>
                                            <p className="text-[10px] text-gray-700 leading-none">Range</p>
                                            <p className="text-sm font-semibold text-gray-900">{bike.range_km} km</p>
                                        </div>
                                    </div>
                                ) : mileageKmpl ? (
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40">
                                        <Bike className="w-4 h-4 text-purple-600 shrink-0" />
                                        <div>
                                            <p className="text-[10px] text-gray-700 leading-none">Mileage</p>
                                            <p className="text-sm font-semibold text-gray-900">{mileageKmpl} kmpl</p>
                                        </div>
                                    </div>
                                ) : null}

                                {/* Top Speed */}
                                {bike.top_speed_kmph && (
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40">
                                        <Gauge className="w-4 h-4 text-red-500 shrink-0" />
                                        <div>
                                            <p className="text-[10px] text-gray-700 leading-none">Top Speed</p>
                                            <p className="text-sm font-semibold text-gray-900">{bike.top_speed_kmph} kmph</p>
                                        </div>
                                    </div>
                                )}

                                {/* Type */}
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40">
                                    <Bike className="w-4 h-4 text-indigo-600 shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-gray-700 leading-none">Type</p>
                                        <p className="text-sm font-semibold text-gray-900">{vehicleType}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Find a Dealer CTA */}
                            <Link
                                href="/"
                                className="w-full inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground py-3.5 font-bold text-base hover:opacity-90 transition-opacity"
                            >
                                Find a Dealer <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Key Features */}
                    {features.length > 0 && (
                        <section className="mt-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold text-gray-900">Key Features</h2>
                            </div>
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {features.map((f: string, i: number) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-800">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Safety Features */}
                    {safetyFeatures.length > 0 && (
                        <section className="mt-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="w-5 h-5 text-emerald-600" />
                                <h2 className="text-xl font-bold text-gray-900">Safety Features</h2>
                            </div>
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {safetyFeatures.map((f: string, i: number) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-800">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Description */}
                    {bike.description && (
                        <section className="mt-10">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">About {bike.make} {bike.model}</h2>
                            <p className="text-gray-700 leading-relaxed">{bike.description}</p>
                        </section>
                    )}

                    {/* Bottom CTA */}
                    <section className="mt-12 mb-4 text-center">
                        <div className="rounded-2xl border border-border bg-muted/20 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Interested in {bike.make} {bike.model}?
                            </h2>
                            <p className="text-gray-700 mb-6">
                                Find an authorized dealer near you for the best price and offers.
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-8 py-3 font-bold text-base hover:opacity-90 transition-opacity"
                            >
                                Find a Dealer <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    </section>
                </div>
            </main>

            <SiteFooter />
        </>
    );
}

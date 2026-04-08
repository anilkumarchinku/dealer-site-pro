/**
 * QuickViewModal — Neat & symmetric car detail popup
 * Tabs: Variants · Specs · Features · Colors · Overview
 */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Car } from '@/lib/types/car';
import {
    getDetailedCarInfo,
    parseKeyFeatures,
    parseSafetyFeatures,
    type DetailedCarInfo,
} from '@/lib/utils/car-info-fetcher';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Fuel, Gauge, Users, Zap, Settings, Box, MoveVertical,
    Shield, ShieldCheck, Star, Send, TrendingUp, Package,
    Wrench, CheckCircle2, Palette, ChevronRight, Calendar,
    BadgeCheck, Info,
} from 'lucide-react';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
import { getBrandLogo } from '@/lib/data/brand-logos';
import { getContrastText } from '@/lib/utils/color-contrast';
import { getScrapedImageUrls, brandNameToId } from '@/lib/utils/brand-model-images';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Props {
    car: Car | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEnquireNow?: () => void;
    brandColor?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtL = (inr?: number | null) =>
    inr ? `₹${(inr / 1e5).toFixed(2)}L` : '';

const fuelPill = (fuel?: string | null): string => {
    if (fuel === 'Electric') return 'bg-emerald-50 text-emerald-700 border-emerald-300';
    if (fuel === 'Diesel') return 'bg-amber-50   text-amber-700   border-amber-300';
    if (fuel?.includes('CNG')) return 'bg-teal-50  text-teal-700    border-teal-300';
    return 'bg-blue-50 text-blue-700 border-blue-300';
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionHeading({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-current opacity-60" />
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-500">
                {icon}{label}
            </span>
        </div>
    );
}

function SpecCard({ label, value }: { label: string; value?: string | null }) {
    if (!value) return null;
    return (
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-0.5">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">{label}</p>
            <p className="text-sm font-semibold text-gray-900 leading-snug">{value}</p>
        </div>
    );
}

function Pill({ text, color = 'gray' }: { text: string; color?: string }) {
    const map: Record<string, string> = {
        blue: 'bg-blue-50   text-blue-700   border-blue-200',
        green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        red: 'bg-red-50    text-red-700    border-red-200',
        purple: 'bg-purple-50 text-purple-700 border-purple-200',
        amber: 'bg-amber-50  text-amber-700  border-amber-200',
        gray: 'bg-gray-50   text-gray-600   border-gray-200',
    };
    return (
        <span className={`text-[11px] px-2.5 py-1 rounded-full border font-medium ${map[color] ?? map.gray}`}>
            {text}
        </span>
    );
}

function RatingBar({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs">
                <span className="text-gray-500">{label}</span>
                <span className="font-semibold text-gray-900">{value.toFixed(1)}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(value / 5) * 100}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function QuickViewModal({ car, open, onOpenChange, onEnquireNow, brandColor = '#2563eb' }: Props) {
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [detailedInfo, setDetailedInfo] = useState<DetailedCarInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [selVariant, setSelVariant] = useState<DetailedCarInfo | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchDetails = async () => {
            if (!open || !car) return;
            setLoading(true);
            try {
                let info = await getDetailedCarInfo(car.make, car.model, car.vehicleCategory);
                
                // Fallback: use car.variants (populated from all_variants in twoWheelersToCars)
                if (!info || info.length === 0) {
                    if (car.variants && car.variants.length > 0) {
                        // Use the full variant list from enrichment data
                        info = car.variants.map(v => ({
                            make: car.make,
                            model: car.model,
                            variant_name: v.name,
                            ex_showroom_price_min_inr: v.price || 0,
                            fuel_type: car.engine?.type || v.fuelType || 'Petrol',
                            transmission: v.transmission || car.transmission?.type || 'Manual',
                            engine_displacement_cc: car.engine?.displacement || 0,
                            power_bhp: parseInt(car.engine?.power) || 0,
                            torque_nm: parseInt(car.engine?.torque) || 0,
                            mileage_kmpl_or_ev_range: String(car.performance?.fuelEfficiency || car.performance?.range || ''),
                            seating_capacity: car.dimensions?.seatingCapacity || 2,
                            key_features: car.features?.keyFeatures?.join(', ') || '',
                            safety_features: car.features?.safetyFeatures?.join(', ') || '',
                            image_urls: car.colors?.map(c => ({ value: c.hex })) || [],
                            launch_year: car.year
                        }));
                    } else {
                        // Last resort: single entry from the car's own spec data
                        info = [{
                            make: car.make,
                            model: car.model,
                            variant_name: car.variant || 'Standard',
                            ex_showroom_price_min_inr: car.pricing.exShowroom.min || 0,
                            fuel_type: car.engine?.type || 'Petrol',
                            transmission: car.transmission?.type || 'Manual',
                            engine_displacement_cc: car.engine?.displacement || 0,
                            power_bhp: parseInt(car.engine?.power) || 0,
                            torque_nm: parseInt(car.engine?.torque) || 0,
                            mileage_kmpl_or_ev_range: String(car.performance?.fuelEfficiency || car.performance?.range || ''),
                            seating_capacity: car.dimensions?.seatingCapacity || 2,
                            key_features: car.features?.keyFeatures?.join(', ') || '',
                            safety_features: car.features?.safetyFeatures?.join(', ') || '',
                            image_urls: car.colors?.map(c => ({ value: c.hex })) || [],
                            launch_year: car.year
                        }];
                    }
                }

                if (isMounted) {
                    setDetailedInfo(info);
                    setSelVariant(info[0] ?? null);
                }
            } catch (e) {
                // Handle error
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchDetails();
        return () => { isMounted = false; };
    }, [open, car]);

    if (!car) return null;

    // Derived
    const logoSrc = getBrandLogo(car.make);

    // Scraped fallbacks for 2W/3W
    const showScraped = car.vehicleCategory === '2w' || car.vehicleCategory === '3w';
    const scrapedUrls = showScraped ? getScrapedImageUrls(car.vehicleCategory as '2w' | '3w', brandNameToId(car.make, car.vehicleCategory as '2w' | '3w'), car.model) : [];

    const allImages = [...(car.images.exterior || []), ...(car.images.interior || [])].filter(Boolean);

    // Always add hero image if it's not a placeholder
    if (car.images.hero && car.images.hero !== '/placeholder-car.jpg') {
        allImages.unshift(car.images.hero);
    }

    // If no real images, use scraped ones (for 2W/3W)
    if (allImages.length === 0 && showScraped) {
        allImages.push(...scrapedUrls);
    }

    const mainImage = activeImage ?? allImages[0] ?? null;

    // DEBUG: Log image data when modal opens
    if (open) {
        console.log(`[QuickViewModal] ${car.make} ${car.model}:`, {
            hero: car.images.hero,
            exterior_count: car.images.exterior?.length ?? 0,
            interior_count: car.images.interior?.length ?? 0,
            all_images_count: allImages.length,
            mainImage: mainImage,
            isPlaceholder: mainImage === '/placeholder-car.jpg' || !mainImage,
        });
    }
    const priceStart = formatPriceInLakhs(car.pricing.exShowroom.min);
    const priceEnd = formatPriceInLakhs(car.pricing.exShowroom.max);
    const hasRange = car.pricing.exShowroom.min !== car.pricing.exShowroom.max;

    // Features merged
    const match = detailedInfo.find(v => v.variant_name?.toLowerCase().includes(car.variant?.toLowerCase())) ?? detailedInfo[0];
    const keyFeatures = [...(car.features?.keyFeatures ?? []), ...parseKeyFeatures(match?.key_features)].filter((v, i, a) => a.indexOf(v) === i);
    const safetyFeat = [...(car.features?.safetyFeatures ?? []), ...parseSafetyFeatures(match?.safety_features)].filter((v, i, a) => a.indexOf(v) === i);
    const comfortFeat = car.features?.comfortFeatures ?? [];
    const techFeat = car.features?.techFeatures ?? [];
    const extFeat = car.features?.exteriorFeatures ?? [];

    const enquire = () => { onOpenChange(false); onEnquireNow?.(); };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[92vh] overflow-hidden flex flex-col p-0 gap-0 dark:bg-white dark:text-gray-900 dark:border-gray-200">

                {/* ══ HEADER ══════════════════════════════════════════════════ */}
                <div className="shrink-0 border-b border-gray-200 bg-white" style={{ background: `linear-gradient(135deg, ${brandColor}10 0%, transparent 60%)` }}>
                    <DialogHeader className="p-5 pb-4">
                        <div className="flex items-start justify-between gap-4">
                            {/* Brand + model */}
                            <div className="flex items-center gap-3 min-w-0">
                                {logoSrc && (
                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm border flex items-center justify-center shrink-0">
                                        <Image src={logoSrc} alt={car.make} width={28} height={28} className="object-contain" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <DialogTitle className="text-lg font-extrabold text-gray-900 leading-tight">
                                        {car.make} {car.model}
                                    </DialogTitle>
                                    <DialogDescription className="sr-only">
                                        Quick view — {car.make} {car.model} {car.variant}
                                    </DialogDescription>
                                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                                        {car.variant} &bull; {car.year} &bull; {car.bodyType}
                                    </p>
                                </div>
                            </div>

                            {/* Price block */}
                            <div className="text-right shrink-0">
                                <p className="text-[10px] uppercase tracking-widest text-gray-400">Ex-showroom</p>
                                <p className="text-xl font-extrabold text-gray-900">
                                    {priceStart}
                                    {hasRange && <span className="text-sm font-normal text-gray-400"> – {priceEnd}</span>}
                                </p>
                            </div>
                        </div>

                        {/* Badge row */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {car.engine?.type && <Badge variant="outline" className="text-[10px] h-5">{car.engine.type}</Badge>}
                            {car.transmission?.type && <Badge variant="outline" className="text-[10px] h-5">{car.transmission.type}</Badge>}
                            {car.safety?.airbags && <Badge variant="outline" className="text-[10px] h-5 border-red-200 text-red-600">{car.safety.airbags} Airbags</Badge>}
                            {car.safety?.ncapRating && <Badge variant="outline" className="text-[10px] h-5 border-amber-300 text-amber-600">⭐ {car.safety.ncapRating.stars}-Star NCAP</Badge>}
                            {car.segment && <Badge variant="secondary" className="text-[10px] h-5">{car.segment}</Badge>}
                        </div>
                    </DialogHeader>
                </div>

                {/* ══ SCROLLABLE BODY ═════════════════════════════════════════ */}
                <div className="flex-1 overflow-y-auto bg-white">
                    <div className="p-5 space-y-5">

                        {/* Image gallery */}
                        <div className="space-y-2">
                            <div className="relative aspect-[16/7] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
                                {mainImage && mainImage !== '/placeholder-car.jpg'
                                    ? <Image src={mainImage} alt={`${car.make} ${car.model}`} fill sizes="(max-width:1024px) 100vw, 768px" className="object-cover" priority unoptimized={mainImage.startsWith('http')} />
                                    : <div className="flex flex-col items-center justify-center gap-2 text-center">
                                        <div className="text-6xl">🚗</div>
                                        <p className="text-sm text-gray-500">Image not available</p>
                                      </div>
                                }
                            </div>
                            {allImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {allImages.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImage(img)}
                                            className={`relative w-14 h-10 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${mainImage === img ? 'scale-105 shadow' : 'border-gray-200 opacity-60 hover:opacity-100'
                                                }`}
                                            style={mainImage === img ? { borderColor: brandColor } : {}}
                                        >
                                            <Image src={img} alt={`view ${i + 1}`} fill sizes="56px" className="object-cover" unoptimized={img.startsWith('http')} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Tabs */}
                        <Tabs defaultValue="variants">
                            <TabsList className="w-full grid grid-cols-5 h-9 bg-gray-100 dark:bg-gray-100">
                                {['variants', 'specs', 'features', 'colors', 'overview'].map(t => (
                                    <TabsTrigger key={t} value={t} className="text-[11px] capitalize text-gray-600 dark:text-gray-600 dark:data-[state=active]:bg-white dark:data-[state=active]:text-gray-900">{t}</TabsTrigger>
                                ))}
                            </TabsList>

                            {/* ── VARIANTS ─────────────────────────────────── */}
                            <TabsContent value="variants" className="mt-4 space-y-4">
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2 py-10 text-gray-400 text-sm">
                                        <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
                                        Loading variants…
                                    </div>
                                ) : detailedInfo.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400 text-sm">
                                        No variant data available for this model.
                                        {car.variants && car.variants.length > 0 && (
                                            <div className="mt-4 space-y-2 text-left">
                                                {car.variants.map(v => (
                                                    <div key={v.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">{v.name}</p>
                                                            <p className="text-xs text-gray-400">{v.fuelType} · {v.transmission}</p>
                                                        </div>
                                                        <p className="font-bold text-sm" style={{ color: brandColor }}>{fmtL(v.price)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {/* Chips */}
                                        <div className="space-y-2">
                                            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">
                                                {detailedInfo.length} variant{detailedInfo.length > 1 ? 's' : ''} — tap to compare specs
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {detailedInfo.map((v, i) => {
                                                    const isSel = selVariant?.variant_name === v.variant_name;
                                                    return (
                                                        <button
                                                            key={`${i}-${v.variant_name}`}
                                                            onClick={() => setSelVariant(v)}
                                                            className={`px-3 py-2 rounded-xl border text-left text-xs font-medium transition-all duration-150 ${fuelPill(v.fuel_type)} ${isSel ? 'scale-105 shadow-md' : 'opacity-55 hover:opacity-100 hover:scale-[1.02]'
                                                                }`}
                                                            style={isSel ? { outline: `2px solid ${brandColor}`, outlineOffset: '2px' } : {}}
                                                        >
                                                            <span className="block font-semibold leading-tight">{v.variant_name}</span>
                                                            {v.ex_showroom_price_min_inr && (
                                                                <span className="block text-[10px] opacity-70 mt-0.5">{fmtL(v.ex_showroom_price_min_inr)}</span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {/* Fuel legend */}
                                            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                                                {[...new Set(detailedInfo.map(v => v.fuel_type).filter(Boolean))].map(f => (
                                                    <span key={f} className={`text-[10px] px-2 py-0.5 rounded-full border ${fuelPill(f)}`}>{f}</span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Selected variant panel */}
                                        {selVariant && (
                                            <div className="rounded-2xl border border-gray-200 overflow-hidden">
                                                {/* Variant header */}
                                                <div className="px-5 py-4 grid grid-cols-2 gap-4 items-center"
                                                    style={{ background: `linear-gradient(135deg, ${brandColor}12, transparent)` }}>
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Selected Variant</p>
                                                        <p className="text-base font-extrabold text-gray-900 leading-tight">{selVariant.variant_name}</p>
                                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                                            {selVariant.fuel_type && (
                                                                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${fuelPill(selVariant.fuel_type)}`}>
                                                                    {selVariant.fuel_type}
                                                                </span>
                                                            )}
                                                            {selVariant.transmission && (
                                                                <span className="text-[10px] px-2 py-0.5 rounded-full border border-gray-200 text-gray-600 font-medium bg-white">
                                                                    {selVariant.transmission}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] uppercase tracking-widest text-gray-400">Ex-Showroom</p>
                                                        <p className="text-2xl font-extrabold leading-tight" style={{ color: brandColor }}>
                                                            {fmtL(selVariant.ex_showroom_price_min_inr)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Spec grid — 3 columns, consistent */}
                                                <div className="p-4 grid grid-cols-3 gap-2">
                                                    {[
                                                        ['Engine', selVariant.engine_displacement_cc ? `${selVariant.engine_displacement_cc} cc` : selVariant.fuel_type === 'Electric' ? 'Electric' : null],
                                                        ['Power', selVariant.power_bhp ? `${selVariant.power_bhp} bhp` : null],
                                                        ['Torque', selVariant.torque_nm ? `${selVariant.torque_nm} Nm` : null],
                                                        ['Mileage', selVariant.mileage_kmpl_or_ev_range ? String(selVariant.mileage_kmpl_or_ev_range) : selVariant.mileage_kmpl ? `${selVariant.mileage_kmpl} km/l` : null],
                                                        ['Seating', selVariant.seating_capacity ? `${selVariant.seating_capacity} seats` : null],
                                                        ['Boot', selVariant.boot_space_l ? `${selVariant.boot_space_l} L` : null],
                                                        ['Ground', selVariant.ground_clearance_mm ? `${selVariant.ground_clearance_mm} mm` : null],
                                                        ['Year', selVariant.launch_year ? String(selVariant.launch_year) : null],
                                                    ].filter(([, v]) => !!v).map(([label, value]) => (
                                                        <SpecCard key={label as string} label={label as string} value={value as string} />
                                                    ))}
                                                </div>

                                                {/* Key features */}
                                                {selVariant.key_features && (
                                                    <div className="px-4 pb-3 border-t border-gray-100 pt-3 space-y-2">
                                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Key Features</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {parseKeyFeatures(selVariant.key_features).map((f, i) => <Pill key={i} text={f.trim()} color="blue" />)}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Safety */}
                                                {selVariant.safety_features && (
                                                    <div className="px-4 pb-3 border-t border-gray-100 pt-3 space-y-2">
                                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Safety</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {parseSafetyFeatures(selVariant.safety_features).map((f, i) => <Pill key={i} text={f.trim()} color="red" />)}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Enquire CTA */}
                                                <div className="p-4 border-t border-gray-100 bg-gray-50">
                                                    <Button className="w-full gap-2 h-10" style={{ backgroundColor: brandColor, color: getContrastText(brandColor) }} onClick={enquire}>
                                                        <Send className="w-4 h-4" />
                                                        Enquire — {selVariant.model} {selVariant.variant_name}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </TabsContent>

                            {/* ── SPECS ────────────────────────────────────── */}
                            <TabsContent value="specs" className="mt-4 space-y-5">
                                {/* Engine */}
                                <div>
                                    <SectionHeading icon={<Fuel className="w-3 h-3" />} label="Engine & Performance" />
                                    <div className="grid grid-cols-3 gap-2">
                                        <SpecCard label="Fuel Type" value={car.engine?.type} />
                                        <SpecCard label="Displacement" value={car.engine?.displacement ? `${car.engine.displacement} cc` : null} />
                                        <SpecCard label="Power" value={car.engine?.power} />
                                        <SpecCard label="Torque" value={car.engine?.torque} />
                                        <SpecCard label="Cylinders" value={car.engine?.cylinders ? String(car.engine.cylinders) : null} />
                                        <SpecCard label="Battery" value={car.engine?.batteryCapacity ? `${car.engine.batteryCapacity} kWh` : null} />
                                        <SpecCard label="Transmission" value={car.transmission?.type} />
                                        <SpecCard label="Drive Type" value={car.transmission?.driveType} />
                                        <SpecCard label="Fuel Efficiency" value={car.performance?.fuelEfficiency ? `${car.performance.fuelEfficiency} km/l` : null} />
                                        <SpecCard label="Top Speed" value={car.performance?.topSpeed ? `${car.performance.topSpeed} km/h` : null} />
                                        <SpecCard label="0–100 km/h" value={car.performance?.acceleration0to100 ? `${car.performance.acceleration0to100}s` : null} />
                                        <SpecCard label="EV Range" value={car.performance?.range ? `${car.performance.range} km` : null} />
                                    </div>
                                </div>

                                <Separator />

                                {/* Dimensions */}
                                <div>
                                    <SectionHeading icon={<Box className="w-3 h-3" />} label="Dimensions" />
                                    <div className="grid grid-cols-3 gap-2">
                                        <SpecCard label="Length" value={car.dimensions?.length ? `${car.dimensions.length} mm` : null} />
                                        <SpecCard label="Width" value={car.dimensions?.width ? `${car.dimensions.width} mm` : null} />
                                        <SpecCard label="Height" value={car.dimensions?.height ? `${car.dimensions.height} mm` : null} />
                                        <SpecCard label="Wheelbase" value={car.dimensions?.wheelbase ? `${car.dimensions.wheelbase} mm` : null} />
                                        <SpecCard label="Ground Clear." value={car.dimensions?.groundClearance ? `${car.dimensions.groundClearance} mm` : null} />
                                        <SpecCard label={car.vehicleCategory === '3w' ? 'Payload' : 'Boot Space'} value={car.dimensions?.bootSpace ? `${car.dimensions.bootSpace} ${car.vehicleCategory === '3w' ? 'kg' : 'L'}` : null} />
                                        <SpecCard label="Fuel Tank" value={car.dimensions?.fuelTankCapacity ? `${car.dimensions.fuelTankCapacity} L` : null} />
                                        <SpecCard label="Seating" value={car.dimensions?.seatingCapacity ? `${car.dimensions.seatingCapacity} seats` : null} />
                                        <SpecCard label="Kerb Weight" value={car.dimensions?.kerbWeight ? `${car.dimensions.kerbWeight} kg` : null} />
                                    </div>
                                </div>

                                {/* Safety */}
                                {car.safety && (
                                    <>
                                        <Separator />
                                        <div>
                                            <SectionHeading icon={<Shield className="w-3 h-3" />} label="Safety" />
                                            <div className="grid grid-cols-3 gap-2 mb-3">
                                                {car.safety.airbags && <SpecCard label="Airbags" value={`${car.safety.airbags} airbags`} />}
                                                {car.safety.ncapRating && <SpecCard label="NCAP Rating" value={`${car.safety.ncapRating.stars}★ (${car.safety.ncapRating.testYear ?? ''})`} />}
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {([
                                                    ['ABS', car.safety.abs],
                                                    ['ESP', car.safety.esp],
                                                    ['Hill Hold Assist', car.safety.hillHoldAssist],
                                                    ['Traction Control', car.safety.tractionControl],
                                                    ['Blind Spot Monitor', car.safety.blindSpotMonitoring],
                                                    ['Rear Camera', car.safety.rearCamera],
                                                ] as [string, boolean | undefined][]).filter(([, v]) => v).map(([label]) => (
                                                    <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-medium text-emerald-700">
                                                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />{label}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </TabsContent>

                            {/* ── FEATURES ─────────────────────────────────── */}
                            <TabsContent value="features" className="mt-4 space-y-5">
                                {keyFeatures.length > 0 && (
                                    <div className="space-y-2">
                                        <SectionHeading icon={<BadgeCheck className="w-3 h-3" />} label="Key Features" />
                                        <div className="flex flex-wrap gap-1.5">{keyFeatures.map((f, i) => <Pill key={i} text={f} color="blue" />)}</div>
                                    </div>
                                )}
                                {safetyFeat.length > 0 && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            <SectionHeading icon={<Shield className="w-3 h-3" />} label="Safety Features" />
                                            <div className="flex flex-wrap gap-1.5">{safetyFeat.map((f, i) => <Pill key={i} text={f} color="red" />)}</div>
                                        </div>
                                    </>
                                )}
                                {comfortFeat.length > 0 && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            <SectionHeading icon={<Users className="w-3 h-3" />} label="Comfort & Convenience" />
                                            <div className="flex flex-wrap gap-1.5">{comfortFeat.map((f, i) => <Pill key={i} text={f} color="purple" />)}</div>
                                        </div>
                                    </>
                                )}
                                {techFeat.length > 0 && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            <SectionHeading icon={<Settings className="w-3 h-3" />} label="Technology" />
                                            <div className="flex flex-wrap gap-1.5">{techFeat.map((f, i) => <Pill key={i} text={f} color="blue" />)}</div>
                                        </div>
                                    </>
                                )}
                                {extFeat.length > 0 && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            <SectionHeading icon={<Package className="w-3 h-3" />} label="Exterior" />
                                            <div className="flex flex-wrap gap-1.5">{extFeat.map((f, i) => <Pill key={i} text={f} color="amber" />)}</div>
                                        </div>
                                    </>
                                )}
                                {!keyFeatures.length && !safetyFeat.length && !comfortFeat.length && !techFeat.length && !extFeat.length && (
                                    <p className="text-center text-gray-400 text-sm py-10">No feature data available.</p>
                                )}
                            </TabsContent>

                            {/* ── COLORS ───────────────────────────────────── */}
                            <TabsContent value="colors" className="mt-4">
                                {car.colors && car.colors.length > 0 ? (
                                    <div className="space-y-3">
                                        <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">{car.colors.length} color option{car.colors.length > 1 ? 's' : ''}</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {car.colors.map((c, i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors bg-white">
                                                    <div
                                                        className="w-10 h-10 rounded-xl border border-black/10 shadow-sm shrink-0"
                                                        style={{ backgroundColor: c.hex ?? '#aaa' }}
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{c.name}</p>
                                                        <p className="text-[10px] text-gray-400">{c.type}</p>
                                                        {c.extraCost > 0 && (
                                                            <p className="text-[10px] text-amber-600 font-semibold">+{fmtL(c.extraCost)}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-14 gap-3 text-gray-300">
                                        <Palette className="w-12 h-12" />
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-400">No color data available</p>
                                            <p className="text-xs text-gray-300 mt-0.5">Visit your nearest dealer for options</p>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            {/* ── OVERVIEW ─────────────────────────────────── */}
                            <TabsContent value="overview" className="mt-4 space-y-5">
                                {/* Basic */}
                                <div>
                                    <SectionHeading icon={<Info className="w-3 h-3" />} label="Basic Info" />
                                    <div className="grid grid-cols-3 gap-2">
                                        <SpecCard label="Year" value={String(car.year)} />
                                        <SpecCard label="Body Type" value={car.bodyType} />
                                        <SpecCard label="Segment" value={car.segment} />
                                    </div>
                                </div>

                                {/* Ratings */}
                                {car.rating && (
                                    <>
                                        <Separator />
                                        <div>
                                            <SectionHeading icon={<Star className="w-3 h-3" />} label="Ratings" />
                                            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-4">
                                                <div className="text-4xl font-extrabold text-amber-500">{car.rating.overall.toFixed(1)}</div>
                                                <div className="flex-1">
                                                    <div className="flex gap-0.5 mb-1">
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <Star key={s} className={`w-4 h-4 ${s <= Math.round(car.rating!.overall) ? 'fill-amber-500 text-amber-500' : 'text-gray-200'}`} />
                                                        ))}
                                                    </div>
                                                    {car.rating.reviewCount && (
                                                        <p className="text-xs text-gray-500">{car.rating.reviewCount.toLocaleString()} owner reviews</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {([
                                                    ['Performance', car.rating.performance],
                                                    ['Comfort', car.rating.comfort],
                                                    ['Fuel Efficiency', car.rating.fuelEfficiency],
                                                    ['Styling', car.rating.styling],
                                                    ['Safety', car.rating.safety],
                                                    ['Value for Money', car.rating.valueForMoney],
                                                ] as [string, number | undefined][]).filter(([, v]) => !!v).map(([label, val]) => (
                                                    <RatingBar key={label} label={label} value={val!} color={brandColor} />
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* EMI */}
                                {car.pricing.emi && (
                                    <>
                                        <Separator />
                                        <div>
                                            <SectionHeading icon={<TrendingUp className="w-3 h-3" />} label="EMI Details" />
                                            <div className="grid grid-cols-3 gap-2">
                                                <SpecCard label="Monthly EMI" value={`₹${car.pricing.emi.monthly.toLocaleString()}`} />
                                                <SpecCard label="Down Payment" value={`₹${car.pricing.emi.downPayment.toLocaleString()}`} />
                                                <SpecCard label="Tenure" value={`${car.pricing.emi.tenure} months`} />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Ownership */}
                                {car.ownership && (
                                    <>
                                        <Separator />
                                        <div>
                                            <SectionHeading icon={<Wrench className="w-3 h-3" />} label="Ownership" />
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                <SpecCard label="Warranty" value={car.ownership.warranty?.standard} />
                                                <SpecCard label="Extended" value={car.ownership.warranty?.extended} />
                                                <SpecCard label="Battery Warranty" value={car.ownership.warranty?.batteryWarranty} />
                                                <SpecCard label="Service Interval" value={car.ownership.serviceInterval} />
                                                {car.ownership.averageMaintenanceCost && (
                                                    <SpecCard label="Annual Maintenance" value={`₹${car.ownership.averageMaintenanceCost.annual.toLocaleString()}`} />
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Competitors */}
                                {car.competitors && car.competitors.length > 0 && (
                                    <>
                                        <Separator />
                                        <div>
                                            <SectionHeading icon={<ChevronRight className="w-3 h-3" />} label="Rivals" />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {car.competitors.map((c, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm">
                                                        <span className="font-medium text-gray-900">{c.make} {c.model}</span>
                                                        <span className="text-gray-500 text-xs font-semibold">{fmtL(c.startingPrice)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* ══ STICKY FOOTER ═══════════════════════════════════════════ */}
                <div className="shrink-0 border-t border-gray-200 bg-white px-5 py-3 flex gap-3">
                    <Button variant="outline" className="flex-1 h-10 dark:bg-white dark:text-gray-900 dark:border-gray-300 dark:hover:bg-gray-50" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    <Button className="flex-1 h-10 gap-2" style={{ backgroundColor: brandColor, color: getContrastText(brandColor) }} onClick={enquire}>
                        <Send className="w-4 h-4" /> Enquire Now
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

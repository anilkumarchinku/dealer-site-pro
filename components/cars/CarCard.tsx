/**
 * CarCard Component - PRO Edition
 * Clean, consistent card with equal heights across the grid.
 * Now includes a per-model variant accordion (Option B).
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Car } from '@/lib/types/car';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
import { getAggregatedCarSpecs, formatSpecsForDisplay } from '@/lib/utils/car-specs-aggregator';
import { fetchCarInfoData } from '@/lib/utils/car-info-fetcher';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { EnquiryModal } from './EnquiryModal';
import { QuickViewModal } from './QuickViewModal';
import {
    Fuel,
    Gauge,
    Users,
    Zap,
    TrendingUp,
    Send,
    Eye,
    ShieldCheck,
    MapPin,
    Calendar,
    ChevronDown,
    ChevronUp,
    Settings,
    Box,
    MoveVertical,
    BadgeCheck,
    Info,
} from 'lucide-react';
import { getBrandLogo } from '@/lib/data/brand-logos';
import { getContrastText } from '@/lib/utils/color-contrast';

// ── Variant types for the accordion ──────────────────────────────────────────
interface CarVariantInfo {
    make: string;
    model: string;
    variant_name: string;
    ex_showroom_price_min_inr?: number;
    fuel_type?: string;
    transmission?: string;
    engine_displacement_cc?: number;
    power_bhp?: number;
    torque_nm?: number;
    mileage_kmpl_or_ev_range?: string | number;
    seating_capacity?: number;
    boot_space_l?: number;
    ground_clearance_mm?: number;
    key_features?: string;
    safety_features?: string;
    image_urls?: { value: string }[];
    launch_year?: number;
}

function fmtPrice(inr?: number) {
    if (!inr) return '—';
    return `₹${(inr / 100000).toFixed(2)}L`;
}

function fuelChipClass(fuel?: string) {
    if (fuel === 'Electric') return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    if (fuel === 'Diesel') return 'bg-amber-500/15  text-amber-400  border-amber-500/30';
    if (fuel === 'CNG') return 'bg-teal-500/15   text-teal-400   border-teal-500/30';
    return 'bg-blue-500/15   text-blue-400   border-blue-500/30';
}

interface CarCardProps {
    car: Car;
    variant?: 'compact' | 'detailed';
    showEMI?: boolean;
    onViewDetails?: (carId: string) => void;
    onCompare?: (carId: string) => void;
    className?: string;
    brandColor?: string;
    /** Light card styling for templates with a white/light background */
    light?: boolean;
}

export function CarCard({
    car,
    variant = 'compact',
    showEMI = true,
    onViewDetails,
    className,
    brandColor = '#2563eb',
    light,
}: CarCardProps) {
    const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [aggregatedSpecs, setAggregatedSpecs] = useState<ReturnType<typeof formatSpecsForDisplay>>(null);

    useEffect(() => {
        const fetchSpecs = async () => {
            try {
                const specs = await getAggregatedCarSpecs(car.make, car.model);
                const formatted = formatSpecsForDisplay(specs);
                setAggregatedSpecs(formatted);
            } catch (error) {
                console.warn('Could not fetch aggregated specs:', error);
            }
        };
        fetchSpecs();
        return;
    }, [car.make, car.model]);

    const isUsed = car.condition === 'used' || car.condition === 'certified_pre_owned';

    const exShowroom = car.pricing?.exShowroom ?? { min: null, max: null };
    const priceRange = formatPriceInLakhs(exShowroom.min);
    const maxPrice = formatPriceInLakhs(exShowroom.max);
    const hasPriceRange = exShowroom.min !== exShowroom.max && exShowroom.max;

    // Resolved specs — always show 4 items for consistent grid
    const fuelDisplay = aggregatedSpecs?.fuelsDisplay ||
        (car.engine?.type && car.engine.type !== 'TBD' ? car.engine.type : '—');
    const transDisplay = aggregatedSpecs?.transmissionsDisplay ||
        (car.transmission?.type && car.transmission.type !== 'TBD' && car.transmission.type !== 'Transmission'
            ? car.transmission.type : '—');
    const seatingDisplay = aggregatedSpecs?.seatingDisplay ||
        (car.dimensions?.seatingCapacity ? `${car.dimensions.seatingCapacity}` : '—');
    const mileageDisplay = aggregatedSpecs?.mileageDisplay ||
        (car.performance?.fuelEfficiency && car.performance.fuelEfficiency > 0
            ? `${car.performance.fuelEfficiency} km/l` : '—');

    const handleEnquireNow = () => setIsEnquiryModalOpen(true);

    const handleQuickView = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsQuickViewOpen(true);
    };

    return (
        <>
            <Card
                className={cn(
                    'group relative flex flex-col overflow-hidden transition-all duration-300 cursor-pointer h-full',
                    'bg-white border border-gray-200 hover:border-gray-300 text-gray-900',
                    'hover:shadow-lg hover:-translate-y-0.5',
                    'rounded-xl',
                    className
                )}
                onClick={handleEnquireNow}
            >
                {/* ── Image ── */}
                <div className="relative aspect-[16/10] overflow-hidden bg-white">
                    {car.images.hero ? (
                        <Image
                            src={car.images.hero}
                            alt={`${car.make} ${car.model}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-white border-b border-gray-100">
                            <span className="text-4xl">🚗</span>
                        </div>
                    )}

                    {/* Condition Badge — top-left */}
                    {car.condition && car.condition !== 'new' && (
                        <div className="absolute top-2 left-2 flex gap-1.5">
                            {car.condition === 'certified_pre_owned' && (
                                <span className="flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                                    <ShieldCheck className="w-3 h-3" /> Assured
                                </span>
                            )}
                            {car.condition === 'used' && (
                                <span className="bg-amber-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                                    Used
                                </span>
                            )}
                        </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Quick View */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="w-full bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white shadow-md"
                            onClick={handleQuickView}
                        >
                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                            Quick View
                        </Button>
                    </div>
                </div>

                {/* ── Content ── */}
                <CardContent className="flex flex-col flex-1 p-3 pt-2.5">
                    {/* Brand & Model */}
                    <div className="mb-1.5">
                        <div className="flex items-center gap-1.5">
                            {getBrandLogo(car.make) && (
                                <Image src={getBrandLogo(car.make)!} alt={car.make} width={16} height={16} className="object-contain" />
                            )}
                            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: brandColor }}>
                                {car.make}
                            </p>
                        </div>
                        <h3 className="text-base font-bold leading-tight line-clamp-1 text-gray-900">
                            {car.model}
                        </h3>
                        {car.variant && (
                            <p className="text-[11px] line-clamp-1 text-gray-500">
                                {car.variant}
                            </p>
                        )}
                    </div>

                    {/* Used Car Info Pills */}
                    {isUsed && (
                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                            {car.year && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-600">
                                    <Calendar className="w-2.5 h-2.5" />{car.year}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-600">
                                <Fuel className="w-2.5 h-2.5" />{fuelDisplay}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-600">
                                <Gauge className="w-2.5 h-2.5" />{transDisplay}
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="mb-2">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-lg font-bold text-gray-900">
                                {priceRange}
                            </span>
                            {hasPriceRange && (
                                <span className="text-xs text-gray-500">– {maxPrice}</span>
                            )}
                        </div>
                        <p className="text-[10px] text-gray-500">Ex-showroom price</p>

                        {showEMI && car.pricing.emi && (
                            <Badge variant="secondary" className="mt-1 text-[10px] font-medium gap-1 h-5" style={{ color: brandColor }}>
                                <TrendingUp className="w-3 h-3" />
                                EMI ₹{car.pricing.emi.monthly.toLocaleString()}/mo
                            </Badge>
                        )}
                    </div>

                    <Separator className="mb-2" />

                    {/* Specs Grid — always 4 items */}
                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                        <SpecItem icon={<Fuel className="w-3.5 h-3.5 text-emerald-600" />} label="Fuel" value={fuelDisplay} light={light} />
                        <SpecItem icon={<Gauge className="w-3.5 h-3.5 text-blue-600" />} label="Trans" value={transDisplay} light={light} />
                        <SpecItem icon={<Users className="w-3.5 h-3.5 text-purple-600" />} label="Seats" value={seatingDisplay} light={light} />
                        <SpecItem icon={<Zap className="w-3.5 h-3.5 text-amber-600" />} label="Mileage" value={mileageDisplay} light={light} />
                    </div>

                    {/* Trust Badges for Used Cars */}
                    {isUsed && (
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="inline-flex items-center gap-1 text-[9px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                <ShieldCheck className="w-2.5 h-2.5" />Inspected
                            </span>
                            <span className="inline-flex items-center gap-1 text-[9px] font-medium text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">
                                Warranty
                            </span>
                            {car.condition === 'certified_pre_owned' && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-medium text-purple-500 bg-purple-500/10 px-1.5 py-0.5 rounded">
                                    7-Day Return
                                </span>
                            )}
                        </div>
                    )}

                    {/* CTA row — Enquire + Quick View */}
                    <div className="flex gap-2 mt-1">
                        <Button
                            className="flex-1"
                            size="sm"
                            style={{ backgroundColor: brandColor, color: getContrastText(brandColor) }}
                            onClick={(e) => { e.stopPropagation(); handleEnquireNow(); }}
                        >
                            <Send className="w-3.5 h-3.5 mr-1.5" />
                            Enquire
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="shrink-0 gap-1 text-xs h-8 px-2.5 font-medium bg-white"
                            style={{ borderColor: brandColor, color: brandColor }}
                            onClick={(e) => { e.stopPropagation(); setIsQuickViewOpen(true); }}
                        >
                            <Info className="w-3.5 h-3.5" />
                            Quick View
                        </Button>
                    </div>
                </CardContent>

                {/* Bottom accent */}
                <div
                    className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
                    style={{ backgroundColor: brandColor }}
                />
            </Card>

            {/* Modals */}
            <QuickViewModal
                car={car}
                open={isQuickViewOpen}
                onOpenChange={setIsQuickViewOpen}
                onEnquireNow={handleEnquireNow}
                brandColor={brandColor}
            />
            <EnquiryModal
                car={car}
                open={isEnquiryModalOpen}
                onOpenChange={setIsEnquiryModalOpen}
                brandColor={brandColor}
            />
        </>
    );
}

/** Small spec item used in the 2x2 grid */
function SpecItem({
    icon,
    label,
    value,
    light,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    light?: boolean;
}) {
    const isLong = value.includes('/');
    return (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-100">
            <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 bg-white shadow-sm border border-gray-100">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] text-gray-500 leading-none">{label}</p>
                <p
                    className={cn(
                        'font-semibold leading-tight truncate text-gray-900',
                        isLong ? 'text-[11px]' : 'text-xs',
                    )}
                    title={value}
                >
                    {value}
                </p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// VariantAccordionButton — popup with chips + inline spec panel
// ─────────────────────────────────────────────────────────────────────────────
function VariantAccordionButton({
    make,
    model,
    brandColor,
}: {
    make: string;
    model: string;
    brandColor: string;
}) {
    const [open, setOpen] = useState(false);
    const [variants, setVariants] = useState<CarVariantInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<CarVariantInfo | null>(null);
    const logoSrc = getBrandLogo(make);

    const handleToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!open && variants.length === 0) {
            setLoading(true);
            try {
                const data = await fetchCarInfoData();
                if (data) {
                    const brandKey = make.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
                    let bData: any = null;
                    for (const alias of [brandKey, brandKey.replace('_motors', ''), 'mercedes_benz', 'maruti_suzuki']) {
                        if (data[alias]) { bData = data[alias]; break; }
                    }
                    if (bData) {
                        const items: CarVariantInfo[] = [];
                        if (bData.variants && Array.isArray(bData.variants)) items.push(...bData.variants);
                        else if (bData.car_variants && Array.isArray(bData.car_variants)) items.push(...bData.car_variants);
                        else {
                            for (const k of Object.keys(bData)) {
                                const v = bData[k];
                                if (v && typeof v === 'object' && v.model) items.push(v);
                            }
                        }
                        const modelNorm = model.toLowerCase().trim();
                        const matching = items.filter(v => (v.model || '').toLowerCase().trim() === modelNorm);
                        setVariants(matching);
                        if (matching.length > 0) setSelected(matching[0]); // auto-select first
                    }
                }
            } catch (e) { /* silent */ } finally {
                setLoading(false);
            }
        }
        setOpen(o => !o);
    };

    return (
        <>
            {/* Toggle button */}
            <Button
                size="sm"
                variant="outline"
                className="shrink-0 gap-1 text-xs h-8 px-2.5 font-medium bg-white"
                style={{ borderColor: brandColor, color: brandColor }}
                onClick={handleToggle}
            >
                {loading ? (
                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                ) : open ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                )}
                Variants
            </Button>

            {/* Popup overlay */}
            {open && !loading && (
                <div
                    className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm"
                    onClick={e => { e.stopPropagation(); setOpen(false); }}
                >
                    <div
                        className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* ── Header ── */}
                        <div
                            className="px-4 py-3 flex items-center justify-between shrink-0"
                            style={{ background: `linear-gradient(135deg, ${brandColor}20, transparent)` }}
                        >
                            <div className="flex items-center gap-2">
                                {logoSrc && <Image src={logoSrc} alt={make} width={20} height={20} className="object-contain" />}
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: brandColor }}>{make}</p>
                                    <p className="text-sm font-bold text-gray-900 leading-tight">{model}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[11px] text-gray-600 border-gray-200">
                                    {variants.length > 0 ? `${variants.length} variants` : 'No data'}
                                </Badge>
                                <button
                                    onClick={e => { e.stopPropagation(); setOpen(false); }}
                                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* ── Scrollable body ── */}
                        <div className="overflow-y-auto flex-1">
                            {variants.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-8 px-5">
                                    No variant data available for {model}
                                </p>
                            ) : (
                                <>
                                    {/* Variant chips */}
                                    <div className="px-4 pt-3 pb-2">
                                        <p className="text-[11px] text-gray-500 mb-2">Select a variant to see specs</p>
                                        <div className="flex flex-wrap gap-2">
                                            {variants.map((v) => {
                                                const isSelected = selected?.variant_name === v.variant_name;
                                                return (
                                                    <button
                                                        key={v.variant_name}
                                                        onClick={e => { e.stopPropagation(); setSelected(v); }}
                                                        className={cn(
                                                            'px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 text-left',
                                                            fuelChipClass(v.fuel_type),
                                                            isSelected
                                                                ? 'ring-2 ring-offset-1 scale-105 shadow-md'
                                                                : 'hover:scale-[1.03] opacity-80 hover:opacity-100'
                                                        )}
                                                        style={isSelected ? { outline: `2px solid ${brandColor}`, outlineOffset: '2px' } : {}}
                                                    >
                                                        <span className="block font-semibold">{v.variant_name}</span>
                                                        {v.ex_showroom_price_min_inr && (
                                                            <span className="block opacity-70 font-normal text-[10px] mt-0.5">{fmtPrice(v.ex_showroom_price_min_inr)}</span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {/* Fuel legend */}
                                        <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-gray-200">
                                            {Array.from(new Set(variants.map(v => v.fuel_type).filter(Boolean))).map(fuel => (
                                                <span key={fuel} className={cn('text-[10px] px-2 py-0.5 rounded border', fuelChipClass(fuel))}>{fuel}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ── Selected variant specs (inline) ── */}
                                    {selected && (
                                        <div className="border-t border-gray-200 mx-4 mt-1 pt-3 pb-4 space-y-3">
                                            {/* Price + badges */}
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <p className="text-[10px] text-gray-500">Ex-Showroom</p>
                                                    <p className="text-xl font-bold" style={{ color: brandColor }}>
                                                        {fmtPrice(selected.ex_showroom_price_min_inr)}
                                                    </p>
                                                </div>
                                                <div className="flex gap-1.5">
                                                    {selected.fuel_type && (
                                                        <Badge variant="outline" className="text-[10px]" style={{ borderColor: brandColor, color: brandColor }}>
                                                            {selected.fuel_type}
                                                        </Badge>
                                                    )}
                                                    {selected.transmission && (
                                                        <Badge variant="outline" className="text-[10px]">{selected.transmission}</Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Spec grid — 2 columns */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <PopSpecChip icon={<Settings className="w-3.5 h-3.5 text-orange-400" />} label="Engine"
                                                    value={selected.engine_displacement_cc ? `${selected.engine_displacement_cc} cc` : (selected.fuel_type === 'Electric' ? 'Electric' : '—')} />
                                                <PopSpecChip icon={<Zap className="w-3.5 h-3.5 text-yellow-400" />} label="Power"
                                                    value={selected.power_bhp ? `${selected.power_bhp} bhp` : '—'} />
                                                <PopSpecChip icon={<BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />} label="Torque"
                                                    value={selected.torque_nm ? `${selected.torque_nm} Nm` : '—'} />
                                                <PopSpecChip icon={<Gauge className="w-3.5 h-3.5 text-green-400" />} label="Mileage"
                                                    value={selected.mileage_kmpl_or_ev_range ? String(selected.mileage_kmpl_or_ev_range) : '—'} />
                                                <PopSpecChip icon={<Users className="w-3.5 h-3.5 text-cyan-400" />} label="Seating"
                                                    value={selected.seating_capacity ? `${selected.seating_capacity} seats` : '—'} />
                                                <PopSpecChip icon={<Box className="w-3.5 h-3.5 text-pink-400" />} label="Boot"
                                                    value={selected.boot_space_l ? `${selected.boot_space_l} L` : '—'} />
                                                {selected.ground_clearance_mm && (
                                                    <PopSpecChip icon={<MoveVertical className="w-3.5 h-3.5 text-indigo-400" />} label="Ground Clr."
                                                        value={`${selected.ground_clearance_mm} mm`} />
                                                )}
                                                {selected.launch_year && (
                                                    <PopSpecChip icon={<Calendar className="w-3.5 h-3.5 text-slate-400" />} label="Year"
                                                        value={`${selected.launch_year}`} />
                                                )}
                                            </div>

                                            {/* Key features */}
                                            {selected.key_features && (
                                                <div>
                                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Key Features</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {String(selected.key_features).split(',').map((f, i) => (
                                                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">{f.trim()}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Safety features */}
                                            {selected.safety_features && (
                                                <div>
                                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Safety</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {String(selected.safety_features).split(',').map((f, i) => (
                                                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">{f.trim()}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Enquire CTA */}
                                            <Button
                                                className="w-full gap-2 mt-1"
                                                style={{ backgroundColor: brandColor, color: getContrastText(brandColor) }}
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <Send className="w-4 h-4" />
                                                Enquire — {selected.model} {selected.variant_name}
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/** Compact spec chip inside the inline popup */
function PopSpecChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-100">
            <div className="w-6 h-6 rounded-md bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">{icon}</div>
            <div className="min-w-0">
                <p className="text-[9px] text-gray-500 leading-none">{label}</p>
                <p className="text-[11px] font-semibold text-gray-900 mt-0.5 truncate" title={value}>{value}</p>
            </div>
        </div>
    );
}


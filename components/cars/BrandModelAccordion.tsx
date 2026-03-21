/**
 * BrandModelAccordion — Option B Design
 *
 * Shows a brand card with "View All X Models" toggle.
 * Expands into an accordion where each model has variant chips.
 * Clicking a chip opens a right-side Sheet with full specs + Enquire Now.
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { fetchCarInfoData, parseKeyFeatures, parseSafetyFeatures } from '@/lib/utils/car-info-fetcher';
import { getBrandLogo } from '@/lib/data/brand-logos';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    ChevronDown,
    ChevronUp,
    Fuel,
    Gauge,
    Zap,
    Users,
    Box,
    MoveVertical,
    Send,
    X,
    BadgeCheck,
    Settings,
} from 'lucide-react';

interface BrandModelAccordionProps {
    /** The brand name as it appears in carInfo.json (e.g. "tata", "maruti_suzuki") */
    brandKey: string;
    /** Display name (e.g. "Tata Motors") */
    brandDisplay: string;
    /** Optional hero image for the brand card */
    brandHeroImage?: string;
    brandColor?: string;
    className?: string;
    light?: boolean;
}

interface CarVariant {
    make: string;
    model: string;
    variant_name: string;
    ex_showroom_price_min_inr?: number;
    fuel_type?: string;
    transmission?: string;
    engine_displacement_cc?: number;
    power_bhp?: number;
    torque_nm?: number;
    mileage_kmpl_or_ev_range?: string;
    seating_capacity?: number;
    boot_space_l?: number;
    ground_clearance_mm?: number;
    dimensions?: string;
    key_features?: string;
    safety_features?: string;
    image_urls?: { value: string }[];
    launch_year?: number;
}

function formatPrice(inr?: number): string {
    if (!inr) return '—';
    const lakhs = inr / 100000;
    return `₹${lakhs.toFixed(2)}L`;
}

export function BrandModelAccordion({
    brandKey,
    brandDisplay,
    brandHeroImage,
    brandColor = '#2563eb',
    className,
    light,
}: BrandModelAccordionProps) {
    const [expanded, setExpanded] = useState(false);
    const [models, setModels] = useState<Record<string, CarVariant[]>>({});
    const [loading, setLoading] = useState(false);
    const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());
    const [selectedVariant, setSelectedVariant] = useState<CarVariant | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);

    const logoSrc = getBrandLogo(brandDisplay);
    const totalModels = Object.keys(models).length;
    const totalVariants = Object.values(models).reduce((s, v) => s + v.length, 0);

    useEffect(() => {
        if (!expanded || Object.keys(models).length > 0) return;
        setLoading(true);
        fetchCarInfoData().then((data) => {
            if (!data) return;
            const normalizedKey = brandKey.toLowerCase().replace(/\s+/g, '_');
            const bData = data[normalizedKey];
            if (!bData) { setLoading(false); return; }

            const items: CarVariant[] = [];
            if (bData.variants && Array.isArray(bData.variants)) {
                items.push(...bData.variants);
            } else if (bData.car_variants && Array.isArray(bData.car_variants)) {
                items.push(...bData.car_variants);
            } else {
                for (const k of Object.keys(bData)) {
                    const v = bData[k];
                    if (v && typeof v === 'object' && v.model) items.push(v);
                }
            }

            const grouped: Record<string, CarVariant[]> = {};
            items.forEach((v) => {
                const m = v.model || 'Unknown';
                if (!grouped[m]) grouped[m] = [];
                grouped[m].push(v);
            });
            setModels(grouped);
            // Auto-expand the first model
            if (Object.keys(grouped).length > 0) {
                setExpandedModels(new Set([Object.keys(grouped)[0]]));
            }
            setLoading(false);
        });
    }, [expanded, brandKey, models]);

    const toggleModel = (model: string) => {
        setExpandedModels(prev => {
            const next = new Set(prev);
            if (next.has(model)) next.delete(model);
            else next.add(model);
            return next;
        });
    };

    const openVariant = (v: CarVariant) => {
        setSelectedVariant(v);
        setSheetOpen(true);
    };

    // Fuel color helpers
    const fuelBadgeColor = (fuel?: string) => {
        if (!fuel) return 'bg-gray-100 text-gray-500';
        if (fuel === 'Electric') return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
        if (fuel === 'Diesel') return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
        if (fuel === 'CNG') return 'bg-teal-500/15 text-teal-400 border-teal-500/30';
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30'; // Petrol
    };

    return (
        <div className={cn('rounded-xl overflow-hidden border border-gray-200 bg-white transition-all duration-300', className)}>
            {/* ── Brand Card Header ── */}
            <div className="relative">
                {/* Hero / gradient strip */}
                <div
                    className="h-3 w-full"
                    style={{ background: `linear-gradient(90deg, ${brandColor}, ${brandColor}88)` }}
                />

                <div className="p-4 flex items-center gap-4">
                    {/* Logo */}
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                        {logoSrc ? (
                            <Image src={logoSrc} alt={brandDisplay} width={36} height={36} className="object-contain" />
                        ) : (
                            <span className="text-2xl">🚗</span>
                        )}
                    </div>

                    {/* Name + counts */}
                    <div className="flex-1 min-w-0">
                        <h3 className={cn('text-base font-bold leading-tight', light ? 'text-gray-900' : 'text-gray-900')}>
                            {brandDisplay}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {expanded && totalModels > 0
                                ? `${totalModels} models · ${totalVariants} variants`
                                : 'Official Authorised Dealer'}
                        </p>
                    </div>

                    {/* Toggle button */}
                    <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0 gap-1.5 text-xs h-8 px-3 font-semibold"
                        style={{ borderColor: brandColor, color: brandColor }}
                        onClick={() => setExpanded(e => !e)}
                    >
                        {expanded ? (
                            <><ChevronUp className="w-3.5 h-3.5" /> Hide Models</>
                        ) : (
                            <><ChevronDown className="w-3.5 h-3.5" /> View All Models</>
                        )}
                    </Button>
                </div>
            </div>

            {/* ── Accordion Body ── */}
            {expanded && (
                <div className="border-t border-gray-200">
                    {loading ? (
                        <div className="flex items-center justify-center py-8 gap-2 text-gray-500 text-sm">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                            Loading models…
                        </div>
                    ) : Object.keys(models).length === 0 ? (
                        <p className="text-center text-gray-500 text-sm py-6">No model data available</p>
                    ) : (
                        <div className="divide-y divide-border">
                            {Object.entries(models).map(([model, variants]) => {
                                const isOpen = expandedModels.has(model);
                                const baseVariant = variants[0];
                                const priceMin = baseVariant?.ex_showroom_price_min_inr;
                                const priceMax = variants[variants.length - 1]?.ex_showroom_price_min_inr;
                                const hasPriceRange = priceMin && priceMax && priceMin !== priceMax;

                                return (
                                    <div key={model}>
                                        {/* Model Row — clickable header */}
                                        <button
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100/40 transition-colors text-left"
                                            onClick={() => toggleModel(model)}
                                        >
                                            {/* Dot indicator */}
                                            <div
                                                className="w-2 h-2 rounded-full shrink-0"
                                                style={{ backgroundColor: isOpen ? brandColor : 'transparent', border: `2px solid ${brandColor}` }}
                                            />

                                            <div className="flex-1 min-w-0">
                                                <span className={cn('text-sm font-semibold', light ? 'text-gray-900' : 'text-gray-900')}>
                                                    {model}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    {variants.length} variant{variants.length > 1 ? 's' : ''}
                                                </span>
                                            </div>

                                            {/* Price range */}
                                            {priceMin && (
                                                <span className="text-xs font-semibold text-gray-900 shrink-0">
                                                    {formatPrice(priceMin)}
                                                    {hasPriceRange && <span className="text-gray-500 font-normal"> – {formatPrice(priceMax)}</span>}
                                                </span>
                                            )}

                                            <ChevronDown className={cn('w-4 h-4 text-gray-500 transition-transform shrink-0', isOpen && 'rotate-180')} />
                                        </button>

                                        {/* Variant Chips */}
                                        {isOpen && (
                                            <div className="px-4 pb-4 bg-gray-100/20">
                                                {/* Quick spec row */}
                                                {baseVariant && (
                                                    <div className="flex flex-wrap gap-2 py-2 mb-3 text-[11px] text-gray-500">
                                                        {baseVariant.fuel_type && (
                                                            <span className="flex items-center gap-1">
                                                                <Fuel className="w-3 h-3" />{baseVariant.fuel_type}
                                                            </span>
                                                        )}
                                                        {baseVariant.engine_displacement_cc && (
                                                            <span className="flex items-center gap-1">
                                                                <Settings className="w-3 h-3" />{baseVariant.engine_displacement_cc}cc
                                                            </span>
                                                        )}
                                                        {baseVariant.power_bhp && (
                                                            <span className="flex items-center gap-1">
                                                                <Zap className="w-3 h-3" />{baseVariant.power_bhp} bhp
                                                            </span>
                                                        )}
                                                        {baseVariant.seating_capacity && (
                                                            <span className="flex items-center gap-1">
                                                                <Users className="w-3 h-3" />{baseVariant.seating_capacity} seats
                                                            </span>
                                                        )}
                                                        {baseVariant.mileage_kmpl_or_ev_range && (
                                                            <span className="flex items-center gap-1">
                                                                <Gauge className="w-3 h-3" />{baseVariant.mileage_kmpl_or_ev_range}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Variant chips — scrollable */}
                                                <div className="flex flex-wrap gap-2">
                                                    {variants.map((v) => (
                                                        <button
                                                            key={v.variant_name}
                                                            onClick={() => openVariant(v)}
                                                            className={cn(
                                                                'px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95',
                                                                fuelBadgeColor(v.fuel_type),
                                                                'border',
                                                            )}
                                                        >
                                                            {v.variant_name}
                                                            {v.ex_showroom_price_min_inr && (
                                                                <span className="ml-1.5 opacity-70">{formatPrice(v.ex_showroom_price_min_inr)}</span>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ── Right-side Spec Sheet ── */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side="right" className="w-full max-w-md sm:max-w-lg p-0 flex flex-col">
                    {selectedVariant && (
                        <>
                            {/* Header */}
                            <div
                                className="px-5 py-4 flex items-start justify-between gap-3"
                                style={{ background: `linear-gradient(135deg, ${brandColor}20, ${brandColor}05)` }}
                            >
                                <SheetHeader className="space-y-0.5 text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                        {logoSrc && (
                                            <Image src={logoSrc} alt={brandDisplay} width={20} height={20} className="object-contain" />
                                        )}
                                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: brandColor }}>
                                            {selectedVariant.make}
                                        </span>
                                    </div>
                                    <SheetTitle className="text-lg font-bold leading-snug">
                                        {selectedVariant.model}
                                    </SheetTitle>
                                    <p className="text-sm text-gray-500">{selectedVariant.variant_name}</p>
                                </SheetHeader>
                            </div>

                            {/* Car Image */}
                            {selectedVariant.image_urls?.[0]?.value && (
                                <div className="relative aspect-video bg-gray-100 shrink-0">
                                    <Image
                                        src={selectedVariant.image_urls[0].value}
                                        alt={`${selectedVariant.model} ${selectedVariant.variant_name}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 448px"
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            {/* Scrollable spec content */}
                            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                                {/* Price */}
                                {selectedVariant.ex_showroom_price_min_inr && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Ex-Showroom Price</p>
                                        <p className="text-2xl font-bold" style={{ color: brandColor }}>
                                            {formatPrice(selectedVariant.ex_showroom_price_min_inr)}
                                        </p>
                                    </div>
                                )}

                                <Separator />

                                {/* Key Specs Grid */}
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Key Specs</p>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <SpecChip icon={<Fuel className="w-4 h-4 text-blue-400" />} label="Fuel" value={selectedVariant.fuel_type || '—'} />
                                        <SpecChip icon={<Gauge className="w-4 h-4 text-purple-400" />} label="Transmission" value={selectedVariant.transmission || '—'} />
                                        <SpecChip icon={<Settings className="w-4 h-4 text-orange-400" />} label="Engine" value={selectedVariant.engine_displacement_cc ? `${selectedVariant.engine_displacement_cc} cc` : (selectedVariant.fuel_type === 'Electric' ? 'Electric' : '—')} />
                                        <SpecChip icon={<Zap className="w-4 h-4 text-yellow-400" />} label="Power" value={selectedVariant.power_bhp ? `${selectedVariant.power_bhp} bhp` : '—'} />
                                        <SpecChip icon={<BadgeCheck className="w-4 h-4 text-emerald-400" />} label="Torque" value={selectedVariant.torque_nm ? `${selectedVariant.torque_nm} Nm` : '—'} />
                                        <SpecChip icon={<Gauge className="w-4 h-4 text-green-400" />} label="Mileage" value={selectedVariant.mileage_kmpl_or_ev_range ? String(selectedVariant.mileage_kmpl_or_ev_range) : '—'} />
                                        <SpecChip icon={<Users className="w-4 h-4 text-cyan-400" />} label="Seating" value={selectedVariant.seating_capacity ? `${selectedVariant.seating_capacity} Seats` : '—'} />
                                        <SpecChip icon={<Box className="w-4 h-4 text-pink-400" />} label="Boot Space" value={selectedVariant.boot_space_l ? `${selectedVariant.boot_space_l} L` : '—'} />
                                        <SpecChip icon={<MoveVertical className="w-4 h-4 text-indigo-400" />} label="Ground Clear." value={selectedVariant.ground_clearance_mm ? `${selectedVariant.ground_clearance_mm} mm` : '—'} />
                                        {selectedVariant.launch_year && (
                                            <SpecChip icon={<BadgeCheck className="w-4 h-4 text-slate-400" />} label="Year" value={`${selectedVariant.launch_year}`} />
                                        )}
                                    </div>
                                </div>

                                {/* Key Features */}
                                {selectedVariant.key_features && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Key Features</p>
                                            <div className="flex flex-wrap gap-2">
                                                {parseKeyFeatures(selectedVariant.key_features).map((f, i) => (
                                                    <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                                                        {f.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Safety Features */}
                                {selectedVariant.safety_features && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Safety Features</p>
                                            <div className="flex flex-wrap gap-2">
                                                {parseSafetyFeatures(selectedVariant.safety_features).map((f, i) => (
                                                    <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                                                        {f.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Sticky Enquire Bar */}
                            <div className="border-t border-gray-200 px-5 py-4 bg-white/95 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge variant="outline" className="text-[11px]" style={{ borderColor: brandColor, color: brandColor }}>
                                        {selectedVariant.fuel_type}
                                    </Badge>
                                    <Badge variant="outline" className="text-[11px]">
                                        {selectedVariant.transmission}
                                    </Badge>
                                </div>
                                <Button
                                    className="w-full text-white gap-2"
                                    size="lg"
                                    style={{ backgroundColor: brandColor }}
                                >
                                    <Send className="w-4 h-4" />
                                    Enquire for {selectedVariant.model} {selectedVariant.variant_name}
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}

/** Small spec chip for the sheet */
function SpecChip({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-100/50 border border-gray-200/50">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] text-gray-500 leading-none">{label}</p>
                <p className="text-xs font-semibold text-gray-900 mt-0.5 truncate" title={value}>{value}</p>
            </div>
        </div>
    );
}

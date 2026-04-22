/**
 * CarCard Component - PRO Edition
 * Clean, consistent card with equal heights across the grid.
 * Now includes a per-model variant accordion (Option B).
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Car } from '@/lib/types/car';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
import { getAggregatedCarSpecs, formatSpecsForDisplay } from '@/lib/utils/car-specs-aggregator';
import { fetchCarInfoData, parseKeyFeatures, parseSafetyFeatures } from '@/lib/utils/car-info-fetcher';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { EnquiryModal } from './EnquiryModal';
import { TestDriveModal } from './TestDriveModal';
import { WishlistButton } from '@/components/ui/WishlistButton';
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
    GitCompare,
} from 'lucide-react';
import { getBrandLogo } from '@/lib/data/brand-logos';
import { getContrastText } from '@/lib/utils/color-contrast';
import { useCompareStore } from '@/lib/store/compare-store';
import { getVehicleImageUrls, brandNameToId } from '@/lib/utils/brand-model-images';

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
    hyderabad_on_road_price?: number;
}

function fmtPrice(inr?: number) {
    if (!inr) return '';
    return `₹${(inr / 100000).toFixed(2)} L`;
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
    summaryOnly?: boolean;
    onViewDetails?: (carId: string) => void;
    onCompare?: (carId: string) => void;
    className?: string;
    brandColor?: string;
    /** Light card styling for templates with a white/light background */
    light?: boolean;
    /** Base path for detail pages, e.g. "/sites/demo-dealer" or "" on custom domains */
    detailBasePath?: string;
    /** Dealer phone — enables per-car WhatsApp button */
    dealerPhone?: string;
    /** Dealer ID — enables test drive booking */
    dealerId?: string;
}

export function CarCard({
    car,
    variant = 'compact',
    showEMI = true,
    summaryOnly = false,
    onViewDetails,
    className,
    brandColor = '#2563eb',
    light,
    detailBasePath,
    dealerPhone,
    dealerId,
}: CarCardProps) {
    const router = useRouter();
    const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
    const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [scrapedIdx, setScrapedIdx] = useState(0);
    const [aggregatedSpecs, setAggregatedSpecs] = useState<ReturnType<typeof formatSpecsForDisplay>>(null);
    const { addCar, removeCar, isSelected } = useCompareStore();
    const inCompare = isSelected(car.id);

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
    const priceRange = exShowroom.min != null
        ? formatPriceInLakhs(exShowroom.min)
        : (car.price || 'Price on request');
    const maxPrice = formatPriceInLakhs(exShowroom.max);
    const hasPriceRange = exShowroom.min !== exShowroom.max && exShowroom.max;

    // Resolved specs — always show 4 items for consistent grid
    const fuelDisplay = aggregatedSpecs?.fuelsDisplay ||
        (car.engine?.type && car.engine.type !== 'TBD' ? car.engine.type : '');
    const transDisplay = aggregatedSpecs?.transmissionsDisplay ||
        (car.transmission?.type && car.transmission.type !== 'TBD' && car.transmission.type !== 'Transmission'
            ? car.transmission.type
            : car.vehicleCategory === '3w' ? 'Automatic'
            : car.vehicleCategory === '2w' ? (car.bodyType === 'Scooter' || car.bodyType === 'Electric' ? 'Automatic' : 'Manual')
            : '');
    const seatingDisplay = aggregatedSpecs?.seatingDisplay ||
        (car.dimensions?.seatingCapacity ? `${car.dimensions.seatingCapacity}` : '');
    const mileageDisplay = aggregatedSpecs?.mileageDisplay ||
        (car.performance?.fuelEfficiency && car.performance.fuelEfficiency > 0
            ? `${car.performance.fuelEfficiency} km/l`
            : car.performance?.topSpeed && (car.vehicleCategory === '2w' || car.vehicleCategory === '3w')
            ? `${car.performance.topSpeed} km/h top`
            : '');

    // Category-specific specs
    const isEV = car.engine?.type === 'Electric';
    const spec2 = car.vehicleCategory === '2w'
        ? {
            icon: <Settings className="w-3.5 h-3.5 text-orange-500" />,
            label: isEV ? 'Battery' : 'Engine',
            value: isEV
                ? (car.engine?.batteryCapacity ? `${car.engine.batteryCapacity} kWh` : (car.performance?.range ? `${car.performance.range} km` : ''))
                : (car.engine?.displacement ? `${car.engine.displacement} cc`
                    : car.engine?.power && car.engine.power !== '—' ? car.engine.power
                    : ''),
        }
        : car.vehicleCategory === '3w'
            ? {
                icon: car.dimensions?.bootSpace
                    ? <Box className="w-3.5 h-3.5 text-amber-600" />
                    : <Users className="w-3.5 h-3.5 text-purple-600" />,
                label: car.dimensions?.bootSpace ? 'Payload' : 'Seating',
                value: car.dimensions?.bootSpace
                    ? `${car.dimensions.bootSpace} kg`
                    : seatingDisplay,
            }
            : { icon: <Gauge className="w-3.5 h-3.5 text-blue-600" />, label: 'Trans', value: transDisplay };

    const spec3 = car.vehicleCategory === '2w' || car.vehicleCategory === '3w'
        ? { icon: <Zap className="w-3.5 h-3.5 text-amber-600" />, label: isEV ? 'Range' : 'Mileage', value: isEV ? (car.performance?.range ? `${car.performance.range} km` : '') : mileageDisplay }
        : { icon: <Users className="w-3.5 h-3.5 text-purple-600" />, label: 'Seats', value: seatingDisplay };

    const spec4 = car.vehicleCategory === '2w' || car.vehicleCategory === '3w'
        ? { icon: <Gauge className="w-3.5 h-3.5 text-blue-600" />, label: 'Trans', value: transDisplay }
        : isEV
            ? { icon: <Zap className="w-3.5 h-3.5 text-amber-600" />, label: 'Range', value: car.performance?.range ? `${car.performance.range} km` : '' }
            : { icon: <Zap className="w-3.5 h-3.5 text-amber-600" />, label: 'Mileage', value: mileageDisplay };

    const detailHref = detailBasePath !== undefined
        ? `${detailBasePath.replace(/\/$/, '')}/${car.id}`.replace(/^\/\//, '/')
        : `/cars/${car.id}`;

    const handleEnquireNow = () => setIsEnquiryModalOpen(true);
    const handleViewDetails = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (onViewDetails) {
            onViewDetails(car.id);
            return;
        }
        router.push(detailHref);
    };

    // Resolved image reused by detail-oriented actions and the enquiry modal.
    const imageCategory = car.vehicleCategory as '2w' | '3w' | '4w';
    const cardImageUrls = getVehicleImageUrls(
        imageCategory,
        brandNameToId(car.make, imageCategory),
        car.model,
        car.images.hero,
    );
    const shouldPreferResolvedImages = imageCategory === '4w' || !car.images.hero || car.images.hero === '/placeholder-car.jpg' || imgError;
    const cardDisplayUrl = shouldPreferResolvedImages
        ? (cardImageUrls[scrapedIdx] || null)
        : car.images.hero;

    if (summaryOnly) {
        return (
            <>
                <Card
                    className={cn(
                        'group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl',
                        className
                    )}
                    onClick={handleViewDetails}
                >
                    <div className="relative aspect-[16/10] overflow-hidden bg-white">
                        {cardDisplayUrl ? (
                            <Image
                                src={cardDisplayUrl}
                                alt={`${car.make} ${car.model}`}
                                fill
                                unoptimized
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className={cn(
                                    'transition-transform duration-500 group-hover:scale-105',
                                    (car.vehicleCategory === '2w' || car.vehicleCategory === '3w')
                                        ? 'object-contain p-3'
                                        : 'object-cover'
                                )}
                                onError={() => {
                                    if (!imgError) {
                                        setImgError(true);
                                    } else if (scrapedIdx < cardImageUrls.length - 1) {
                                        setScrapedIdx((prev) => prev + 1);
                                    } else {
                                        setScrapedIdx(cardImageUrls.length);
                                    }
                                }}
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center bg-white border-b border-gray-100">
                                <span className="text-4xl">
                                    {car.vehicleCategory === '2w' ? '🏍️' : car.vehicleCategory === '3w' ? '🛺' : '🚗'}
                                </span>
                            </div>
                        )}

                        <div className="absolute top-2 right-2 z-10">
                            <WishlistButton carId={car.id} />
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    <CardContent className="flex flex-1 flex-col p-5">
                        <div className="mb-5">
                            <div className="flex items-center gap-1.5 min-w-0">
                                {getBrandLogo(car.make) && (
                                    <Image src={getBrandLogo(car.make)!} alt={car.make} width={16} height={16} unoptimized className="object-contain shrink-0" />
                                )}
                                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: brandColor }}>
                                    {car.make}
                                </p>
                            </div>
                            <h3 className="mt-2 line-clamp-2 text-[1.375rem] font-bold leading-[1.15] text-gray-900">
                                {car.model}
                            </h3>
                            <div className="mt-4">
                                <p className="text-3xl font-black tracking-tight text-gray-900">{priceRange}</p>
                                <p className="mt-1 text-sm text-gray-600">Ex-showroom price</p>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <Button
                                type="button"
                                onClick={handleViewDetails}
                                className="w-full rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-md"
                                style={{
                                    backgroundColor: brandColor,
                                    borderColor: brandColor,
                                    color: getContrastText(brandColor),
                                }}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </>
        );
    }

    return (
        <>
            <Card
                className={cn(
                    'group relative flex flex-col overflow-hidden transition-all duration-300 cursor-pointer h-full',
                    'bg-white dark:bg-white border border-gray-200 dark:border-gray-200 text-gray-900 dark:text-gray-900 hover:border-gray-300 dark:hover:border-gray-300',
                    'hover:shadow-xl hover:-translate-y-1',
                    'rounded-2xl',
                    className
                )}
                onClick={handleViewDetails}
            >
                {/* ── Image ── */}
                <div className="relative aspect-[16/10] overflow-hidden bg-white">
                    {(() => {
                        const fallbackUrls = cardImageUrls;
                        const displayUrl = shouldPreferResolvedImages
                            ? (fallbackUrls[scrapedIdx] || null)
                            : car.images.hero;

                        if (displayUrl) {
                            return (
                                <Image
                                    src={displayUrl}
                                    alt={`${car.make} ${car.model}`}
                                    fill
                                    unoptimized
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className={cn(
                                        "transition-transform duration-500 group-hover:scale-105",
                                        (car.vehicleCategory === '2w' || car.vehicleCategory === '3w')
                                            ? "object-contain p-3"
                                            : "object-cover"
                                    )}
                                    onError={() => {
                                        if (!imgError) {
                                            setImgError(true);
                                        } else if (scrapedIdx < fallbackUrls.length - 1) {
                                            setScrapedIdx(prev => prev + 1);
                                        } else {
                                            setScrapedIdx(fallbackUrls.length);
                                        }
                                    }}
                                />
                            );
                        }
                        return (
                            <div className="flex items-center justify-center h-full bg-white border-b border-gray-100">
                                <span className="text-4xl">
                                    {car.vehicleCategory === '2w' ? '🏍️' : car.vehicleCategory === '3w' ? '🛺' : '🚗'}
                                </span>
                            </div>
                        );
                    })()}

                    {/* Wishlist heart — top-right */}
                    <div className="absolute top-2 right-2 z-10">
                        <WishlistButton carId={car.id} />
                    </div>

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

                    {/* Hover overlay — gradient + Quick View button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                            onClick={handleViewDetails}
                            className="flex items-center gap-1.5 bg-white/95 text-gray-900 backdrop-blur-sm text-xs font-semibold px-4 py-2 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all scale-95 group-hover:scale-100"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            View Details
                        </button>
                    </div>
                </div>

                {/* ── Content ── */}
                <CardContent className="flex flex-col flex-1 p-5">
                    {/* Brand & Model */}
                    <div className="mb-3">
                        <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                                {getBrandLogo(car.make) && (
                                    <Image src={getBrandLogo(car.make)!} alt={car.make} width={16} height={16} unoptimized className="object-contain shrink-0" />
                                )}
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] truncate" style={{ color: brandColor }}>
                                    {car.make}
                                </p>
                            </div>
                            {isUsed && car.year && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 shrink-0">
                                    {car.year}
                                </span>
                            )}
                        </div>
                        <h3 className="text-[1.375rem] font-bold leading-[1.15] line-clamp-2 text-gray-900 mt-1">
                            {car.model}
                        </h3>
                        {car.variant && (
                            <p className="text-sm line-clamp-1 text-gray-600 mt-1">
                                {car.variant}
                            </p>
                        )}
                    </div>


                    {/* Price */}
                    <div className="mb-3">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-[1.75rem] font-bold tracking-tight text-gray-900">
                                {priceRange}
                            </span>
                            {hasPriceRange && (
                                <span className="text-sm text-gray-600">– {maxPrice}</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600">{isUsed ? 'Selling price' : 'Ex-showroom price'}</p>

                        {showEMI && car.pricing.emi && (
                            <Badge variant="secondary" className="mt-2 text-xs font-medium gap-1 h-6 px-2.5 rounded-full bg-gray-50 dark:bg-gray-50 border border-gray-200 dark:border-gray-200 text-gray-700 dark:text-gray-700" style={{ color: brandColor }}>
                                <TrendingUp className="w-3 h-3" />
                                EMI ₹{car.pricing.emi.monthly.toLocaleString()}/mo
                            </Badge>
                        )}
                    </div>

                    <Separator className="mb-3" />

                    {/* Specs Grid — always 4 items, adapts per vehicle category */}
                    <div className="grid grid-cols-2 gap-2.5 mb-3">
                        <SpecItem icon={<Fuel className="w-3.5 h-3.5 text-emerald-600" />} label="Fuel" value={fuelDisplay} />
                        <SpecItem icon={spec2.icon} label={spec2.label} value={spec2.value} />
                        <SpecItem icon={spec3.icon} label={spec3.label} value={spec3.value} />
                        <SpecItem icon={spec4.icon} label={spec4.label} value={spec4.value} />
                    </div>

                    {/* Trust Badges for Used Cars */}
                    {isUsed && (
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                                <ShieldCheck className="w-2.5 h-2.5" />Inspected
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded-full">
                                Warranty
                            </span>
                            {car.condition === 'certified_pre_owned' && (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 px-2 py-1 rounded-full">
                                    7-Day Return
                                </span>
                            )}
                        </div>
                    )}

                    {/* CTA row — Enquire + Test Drive + View Details */}
                    <div className="flex gap-2 mt-auto pt-2">
                        <Button
                            className="flex-1 h-11 rounded-xl text-sm font-semibold shadow-sm"
                            size="sm"
                            style={{ backgroundColor: brandColor, color: getContrastText(brandColor) }}
                            onClick={(e) => { e.stopPropagation(); handleEnquireNow(); }}
                        >
                            <Send className="w-3.5 h-3.5 mr-1.5" />
                            Enquire
                        </Button>
                        {dealerId && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="shrink-0 gap-1.5 text-xs h-11 px-3 rounded-xl font-semibold bg-white dark:bg-white hover:bg-gray-50 dark:hover:bg-gray-50"
                                style={{ borderColor: brandColor, color: brandColor }}
                                onClick={(e) => { e.stopPropagation(); setIsTestDriveOpen(true); }}
                                title="Book Test Drive"
                            >
                                <Calendar className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Test Drive</span>
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="outline"
                            className="shrink-0 gap-1 text-xs h-11 px-3 rounded-xl font-medium bg-white dark:bg-white hover:bg-gray-50 dark:hover:bg-gray-50"
                            style={{ borderColor: brandColor, color: brandColor }}
                            onClick={handleViewDetails}
                            title="View Details"
                        >
                            <Info className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="shrink-0 gap-1 text-xs h-11 px-3 rounded-xl font-medium bg-white dark:bg-white hover:bg-gray-50 dark:hover:bg-gray-50"
                            style={inCompare
                                ? { backgroundColor: brandColor, color: getContrastText(brandColor), borderColor: brandColor }
                                : { borderColor: brandColor, color: brandColor }}
                            onClick={(e) => { e.stopPropagation(); inCompare ? removeCar(car.id) : addCar(car); }}
                            title={inCompare ? 'Remove from compare' : 'Add to compare'}
                        >
                            <GitCompare className="w-3.5 h-3.5" />
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
            <EnquiryModal
                car={car}
                open={isEnquiryModalOpen}
                onOpenChange={setIsEnquiryModalOpen}
                brandColor={brandColor}
                dealerPhone={dealerPhone}
                resolvedImageSrc={cardDisplayUrl}
            />
            {dealerId && (
                <TestDriveModal
                    car={car}
                    dealerId={dealerId}
                    open={isTestDriveOpen}
                    onOpenChange={setIsTestDriveOpen}
                    brandColor={brandColor}
                />
            )}
        </>
    );
}

/** Small spec item used in the 2x2 grid — hidden when value is empty */
function SpecItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className={cn("flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-200", !value && "invisible")}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white border border-gray-200">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[11px] text-gray-600 leading-none mb-1">{label}</p>
                <p
                    className="text-[13px] font-semibold leading-tight truncate text-gray-800"
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
                className="shrink-0 gap-1 text-xs h-8 px-2.5 font-medium bg-transparent"
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
                            className="px-4 py-3 flex items-center justify-between shrink-0 bg-white border-b border-gray-200"
                        >
                            <div className="flex items-center gap-2">
                                {logoSrc && <Image src={logoSrc} alt={make} width={20} height={20} unoptimized className="object-contain" />}
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: brandColor }}>{make}</p>
                                    <p className="text-sm font-bold text-gray-900 leading-tight">{model}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[11px] text-gray-600 dark:text-gray-600 border-gray-200 dark:border-gray-200 bg-white dark:bg-white">
                                    {variants.length > 0 ? `${variants.length} variants` : 'No data'}
                                </Badge>
                                <button
                                    onClick={e => { e.stopPropagation(); setOpen(false); }}
                                    className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* ── Scrollable body ── */}
                        <div className="overflow-y-auto flex-1">
                            {variants.length === 0 ? (
                                <p className="text-sm text-gray-600 text-center py-8 px-5">
                                    No variant data available for {model}
                                </p>
                            ) : (
                                <>
                                    {/* Variant chips */}
                                    <div className="px-4 pt-3 pb-2">
                                        <p className="text-[11px] text-gray-600 mb-2">Select a variant to see specs</p>
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
                                                    <p className="text-[10px] text-gray-600">Ex-Showroom</p>
                                                    <p className="text-xl font-bold" style={{ color: brandColor }}>
                                                        {fmtPrice(selected.ex_showroom_price_min_inr)}
                                                    </p>
                                                    {selected.hyderabad_on_road_price && (
                                                        <p className="text-[10px] text-gray-600 mt-0.5">
                                                            On-Road (Hyd): <span className="font-semibold text-gray-900">{fmtPrice(selected.hyderabad_on_road_price)}</span>
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex gap-1.5">
                                                    {selected.fuel_type && (
                                                        <Badge variant="outline" className="text-[10px] bg-white dark:bg-white" style={{ borderColor: brandColor, color: brandColor }}>
                                                            {selected.fuel_type}
                                                        </Badge>
                                                    )}
                                                    {selected.transmission && (
                                                        <Badge variant="outline" className="text-[10px] bg-white dark:bg-white text-gray-700 dark:text-gray-700 border-gray-200 dark:border-gray-200">{selected.transmission}</Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Spec grid — 2 columns */}
                                            <div className="grid grid-cols-2 gap-2">
                                                {(selected.engine_displacement_cc || selected.fuel_type === 'Electric') && (
                                                <PopSpecChip icon={<Settings className="w-3.5 h-3.5 text-orange-400" />} label="Engine"
                                                    value={selected.engine_displacement_cc ? `${selected.engine_displacement_cc} cc` : 'Electric'} />
                                                )}
                                                {selected.power_bhp && (
                                                <PopSpecChip icon={<Zap className="w-3.5 h-3.5 text-yellow-400" />} label="Power"
                                                    value={`${selected.power_bhp} bhp`} />
                                                )}
                                                {selected.torque_nm && (
                                                <PopSpecChip icon={<BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />} label="Torque"
                                                    value={`${selected.torque_nm} Nm`} />
                                                )}
                                                {selected.mileage_kmpl_or_ev_range && (
                                                <PopSpecChip icon={<Gauge className="w-3.5 h-3.5 text-green-400" />} label="Mileage"
                                                    value={String(selected.mileage_kmpl_or_ev_range)} />
                                                )}
                                                {selected.seating_capacity && (
                                                <PopSpecChip icon={<Users className="w-3.5 h-3.5 text-cyan-400" />} label="Seating"
                                                    value={`${selected.seating_capacity} seats`} />
                                                )}
                                                {selected.boot_space_l && (
                                                <PopSpecChip icon={<Box className="w-3.5 h-3.5 text-pink-400" />} label="Boot"
                                                    value={`${selected.boot_space_l} L`} />
                                                )}
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
                                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-1.5">Key Features</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {parseKeyFeatures(selected.key_features).map((f, i) => (
                                                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200">{f.trim()}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Safety features */}
                                            {selected.safety_features && (
                                                <div>
                                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-1.5">Safety</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {parseSafetyFeatures(selected.safety_features).map((f, i) => (
                                                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">{f.trim()}</span>
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
        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200">
            <div className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center shrink-0">{icon}</div>
            <div className="min-w-0">
                <p className="text-[9px] text-gray-600 leading-none">{label}</p>
                <p className="text-[11px] font-semibold text-gray-900 mt-0.5 truncate" title={value}>{value}</p>
            </div>
        </div>
    );
}

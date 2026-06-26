/**
 * CarCard Component - PRO Edition
 * Clean, consistent card with equal heights across the grid.
 */

'use client';

import { useState, useEffect, type MouseEvent } from 'react';
import Image from 'next/image';
import { FadeInImage } from '@/components/ui/FadeInImage';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Car } from '@/lib/types/car';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
import { getAggregatedCarSpecs, formatSpecsForDisplay } from '@/lib/utils/car-specs-aggregator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { EnquiryModal } from './EnquiryModal';
import { TestDriveModal } from './TestDriveModal';
import { UsedVehicleDetailModal } from './UsedVehicleDetailModal';
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
    Calendar,
    Settings,
    Box,
    Info,
    GitCompare,
    Car as CarIcon,
    Bike,
    Truck,
} from 'lucide-react';
import { getContrastText } from '@/lib/utils/color-contrast';
import { useCompareStore } from '@/lib/store/compare-store';
import { getVehicleImageUrls, brandNameToId } from '@/lib/utils/brand-model-images';
import { brandLogoUrl } from '@/lib/utils/site-assets';

/**
 * Consistent "no image available" placeholder shared across all vehicle cards.
 * Neutral muted tile with a category-appropriate lucide icon and an
 * accessible (visually-hidden) label — no oversized emoji.
 */
function NoImagePlaceholder({ category }: { category?: '2w' | '3w' | '4w' }) {
    const Icon = category === '2w' ? Bike : category === '3w' ? Truck : CarIcon;
    return (
        <div
            role="img"
            aria-label="No image available"
            className="flex h-full w-full items-center justify-center bg-gray-100 border-b border-gray-200"
        >
            <Icon className="h-10 w-10 text-gray-400" strokeWidth={1.5} aria-hidden="true" />
            <span className="sr-only">No image available</span>
        </div>
    );
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
    onCompare,
    className,
    brandColor = '#A8793A',
    light,
    detailBasePath,
    dealerPhone,
    dealerId,
}: CarCardProps) {
    const router = useRouter();
    const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
    const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
    const [isUsedDetailsOpen, setIsUsedDetailsOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [scrapedIdx, setScrapedIdx] = useState(0);
    const [aggregatedSpecs, setAggregatedSpecs] = useState<ReturnType<typeof formatSpecsForDisplay>>(null);
    const { addCar, removeCar, isSelected } = useCompareStore();
    const inCompare = isSelected(car.id);
    const logoSrc = brandLogoUrl(car.make, car.vehicleCategory ?? '4w');

    const toggleCompare = (event: MouseEvent) => {
        event.stopPropagation();
        if (inCompare) {
            removeCar(car.id);
            return;
        }
        addCar(car);
        onCompare?.(car.id);
    };

    const compareButtonStyle = inCompare
        ? { backgroundColor: brandColor, color: getContrastText(brandColor), borderColor: brandColor }
        : { backgroundColor: 'rgba(255,255,255,0.95)', color: brandColor, borderColor: 'rgba(229,231,235,0.9)' };

    const compareIconButton = (
        <button
            type="button"
            onClick={toggleCompare}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-md backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={compareButtonStyle}
            title={inCompare ? 'Remove from compare' : 'Add to compare'}
            aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
        >
            <GitCompare className="h-4 w-4" />
        </button>
    );

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
    const hasOfferPrice = isUsed &&
        typeof car.offer?.price === 'number' &&
        car.offer.price > 0 &&
        (exShowroom.min == null || car.offer.price < exShowroom.min);
    const displayMinPrice = hasOfferPrice ? car.offer!.price : exShowroom.min;
    const priceRange = displayMinPrice != null
        ? formatPriceInLakhs(displayMinPrice)
        : (car.price || 'Price on request');
    const originalPriceRange = hasOfferPrice && exShowroom.min != null
        ? formatPriceInLakhs(exShowroom.min)
        : null;
    const maxPrice = formatPriceInLakhs(exShowroom.max);
    const hasPriceRange = !hasOfferPrice && exShowroom.min !== exShowroom.max && exShowroom.max;

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
        (car.engine?.type && /electric/i.test(car.engine.type)
            ? (car.performance?.range ?? car.engine?.range ? `${car.performance?.range ?? car.engine?.range} km` : '')
            : car.performance?.fuelEfficiency && car.performance.fuelEfficiency > 0
                ? `${car.performance.fuelEfficiency} kmpl`
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
    const handleOpenQuickCard = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (isUsed) {
            setIsUsedDetailsOpen(true);
            return;
        }
        if (onViewDetails) {
            onViewDetails(car.id);
            return;
        }
        router.push(detailHref);
    };

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
    // Use the model's own cover image (car.images.hero) first — the same image
    // the detail page shows — and only fall back to resolved brand/model assets
    // when the hero is missing, a placeholder, or fails to load. (Previously 4W
    // cards always skipped the hero and showed a scraped asset, which could
    // mismatch the actual model.)
    const shouldPreferResolvedImages = !car.images.hero || car.images.hero === '/placeholder-car.jpg' || imgError;
    const cardDisplayUrl = shouldPreferResolvedImages
        ? (cardImageUrls[scrapedIdx] || null)
        : car.images.hero;

    const cardModals = (
        <>
            <UsedVehicleDetailModal
                car={car}
                open={isUsedDetailsOpen}
                onOpenChange={setIsUsedDetailsOpen}
                onContactDealer={handleEnquireNow}
                resolvedImageSrc={cardDisplayUrl}
                brandColor={brandColor}
            />
            <EnquiryModal
                car={car}
                open={isEnquiryModalOpen}
                onOpenChange={setIsEnquiryModalOpen}
                brandColor={brandColor}
                dealerId={dealerId}
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

    if (summaryOnly) {
        return (
            <>
                <Card
                    className={cn(
                        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl',
                        className
                    )}
                >
                    <div
                        className="relative aspect-[16/10] cursor-pointer overflow-hidden bg-white"
                        onClick={handleOpenQuickCard}
                    >
                        {cardDisplayUrl ? (
                            <FadeInImage
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
                            <NoImagePlaceholder category={car.vehicleCategory as '2w' | '3w' | '4w'} />
                        )}

                        <div className="absolute top-2 right-2 z-10 flex gap-2">
                            {compareIconButton}
                            <WishlistButton carId={car.id} />
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    <CardContent className="flex flex-1 flex-col p-5">
                        <div className="mb-5">
                            <div className="flex items-center gap-1.5 min-w-0">
                                {logoSrc && (
                                    <span className="relative h-4 w-4 shrink-0">
                                        <Image src={logoSrc} alt={car.make} fill sizes="16px" unoptimized className="object-contain" />
                                    </span>
                                )}
                                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: brandColor }}>
                                    {car.make}
                                </p>
                            </div>
                            <h3 className="mt-2 line-clamp-2 text-[1.375rem] font-bold leading-[1.15] text-gray-900">
                                {car.model}
                            </h3>
                            <div className="mt-4">
                                <div className="flex flex-wrap items-baseline gap-2">
                                    <p className="text-3xl font-black tracking-tight text-gray-900">{priceRange}</p>
                                    {originalPriceRange && (
                                        <span className="text-sm font-semibold text-gray-500 line-through">{originalPriceRange}</span>
                                    )}
                                </div>
                                <p className="mt-1 text-sm text-gray-600">{isUsed ? 'Price' : 'Ex-showroom price'}</p>
                                {hasOfferPrice && (
                                    <p className="mt-1 text-xs font-semibold" style={{ color: brandColor }}>
                                        {car.offer?.label || 'Offer price'}
                                    </p>
                                )}
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
                {cardModals}
            </>
        );
    }

    return (
        <>
            <Card
                className={cn(
                    'group relative flex flex-col overflow-hidden transition-all duration-300 h-full',
                    'bg-white dark:bg-white border border-gray-200 dark:border-gray-200 text-gray-900 dark:text-gray-900 hover:border-gray-300 dark:hover:border-gray-300',
                    'hover:shadow-xl hover:-translate-y-1',
                    'rounded-2xl',
                    className
                )}
            >
                {/* ── Image ── */}
                <div
                    className="relative aspect-[16/10] cursor-pointer overflow-hidden bg-white"
                    onClick={handleOpenQuickCard}
                >
                    {(() => {
                        const fallbackUrls = cardImageUrls;
                        const displayUrl = shouldPreferResolvedImages
                            ? (fallbackUrls[scrapedIdx] || null)
                            : car.images.hero;

                        if (displayUrl) {
                            return (
                                <FadeInImage
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
                            <NoImagePlaceholder category={car.vehicleCategory as '2w' | '3w' | '4w'} />
                        );
                    })()}

                    {/* Wishlist heart — top-right */}
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                        {compareIconButton}
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
                            onClick={handleOpenQuickCard}
                            className="flex items-center gap-1.5 bg-white/95 text-gray-900 backdrop-blur-sm text-xs font-semibold px-4 py-2 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all scale-95 group-hover:scale-100"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            Quick View
                        </button>
                    </div>
                </div>

                {/* ── Content ── */}
                <CardContent className="flex flex-col flex-1 p-5">
                    {/* Brand & Model */}
                    <div className="mb-3">
                        <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                                {logoSrc && (
                                    <span className="relative h-4 w-4 shrink-0">
                                        <Image src={logoSrc} alt={car.make} fill sizes="16px" unoptimized className="object-contain" />
                                    </span>
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
                            {originalPriceRange && (
                                <span className="text-sm font-semibold text-gray-500 line-through">
                                    {originalPriceRange}
                                </span>
                            )}
                            {hasPriceRange && (
                                <span className="text-sm text-gray-600">– {maxPrice}</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600">{isUsed ? 'Price' : 'Ex-showroom price*'}</p>
                        {hasOfferPrice && (
                            <p className="mt-1 text-xs font-semibold" style={{ color: brandColor }}>
                                {car.offer?.label || 'Offer price'}
                            </p>
                        )}

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
                            aria-label="View Details"
                        >
                            <Info className="w-3.5 h-3.5" />
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
            {cardModals}
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

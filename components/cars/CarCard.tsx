/**
 * CarCard Component - PRO Edition
 * Clean, consistent card with equal heights across the grid
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Car } from '@/lib/types/car';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
import { getAggregatedCarSpecs, formatSpecsForDisplay } from '@/lib/utils/car-specs-aggregator';
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
} from 'lucide-react';

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
                    light
                        ? 'bg-white border border-gray-200/80 hover:border-gray-300 text-gray-900'
                        : 'bg-card border border-border hover:border-border/80',
                    'hover:shadow-lg hover:-translate-y-0.5',
                    'rounded-xl',
                    className
                )}
                onClick={handleEnquireNow}
            >
                {/* ── Image ── */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {car.images.hero ? (
                        <Image
                            src={car.images.hero}
                            alt={`${car.make} ${car.model}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-muted">
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
                        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: brandColor }}>
                            {car.make}
                        </p>
                        <h3 className={cn('text-base font-bold leading-tight line-clamp-1', light ? 'text-gray-900' : 'text-foreground')}>
                            {car.model}
                        </h3>
                        {car.variant && (
                            <p className={cn('text-[11px] line-clamp-1', light ? 'text-gray-400' : 'text-muted-foreground')}>
                                {car.variant}
                            </p>
                        )}
                    </div>

                    {/* Used Car Info Pills */}
                    {isUsed && (
                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                            {car.year && (
                                <span className={cn('inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded', light ? 'bg-gray-100 text-gray-600' : 'bg-muted text-muted-foreground')}>
                                    <Calendar className="w-2.5 h-2.5" />{car.year}
                                </span>
                            )}
                            <span className={cn('inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded', light ? 'bg-gray-100 text-gray-600' : 'bg-muted text-muted-foreground')}>
                                <Fuel className="w-2.5 h-2.5" />{fuelDisplay}
                            </span>
                            <span className={cn('inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded', light ? 'bg-gray-100 text-gray-600' : 'bg-muted text-muted-foreground')}>
                                <Gauge className="w-2.5 h-2.5" />{transDisplay}
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="mb-2">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className={cn('text-lg font-bold', light ? 'text-gray-900' : 'text-foreground')}>
                                {priceRange}
                            </span>
                            {hasPriceRange && (
                                <span className="text-xs text-muted-foreground">– {maxPrice}</span>
                            )}
                        </div>
                        <p className="text-[10px] text-muted-foreground">Ex-showroom price</p>

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
                            <span className="inline-flex items-center gap-1 text-[9px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                <ShieldCheck className="w-2.5 h-2.5" />Inspected
                            </span>
                            <span className="inline-flex items-center gap-1 text-[9px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                                Warranty
                            </span>
                            {car.condition === 'certified_pre_owned' && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-medium text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                                    7-Day Return
                                </span>
                            )}
                        </div>
                    )}

                    {/* CTA */}
                    <Button
                        className="w-full text-white mt-1"
                        size="sm"
                        style={{ backgroundColor: brandColor }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEnquireNow();
                        }}
                    >
                        <Send className="w-3.5 h-3.5 mr-1.5" />
                        Enquire Now
                    </Button>
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
        <div className={cn(
            'flex items-center gap-2 p-2 rounded-lg',
            light ? 'bg-gray-50' : 'bg-muted/40'
        )}>
            <div className={cn(
                'w-7 h-7 rounded-md flex items-center justify-center shrink-0',
                light ? 'bg-white shadow-sm' : 'bg-background shadow-sm'
            )}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground leading-none">{label}</p>
                <p
                    className={cn(
                        'font-semibold leading-tight truncate',
                        isLong ? 'text-[11px]' : 'text-xs',
                        light ? 'text-gray-900' : 'text-foreground'
                    )}
                    title={value}
                >
                    {value}
                </p>
            </div>
        </div>
    );
}

/**
 * CarCard Component - PRO Edition - ENHANCED
 * Now fetches and displays complete car specifications from all variants
 * Features: All fuel types, transmissions, seating, mileage, and power
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Car } from '@/lib/types/car';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
import { getAggregatedCarSpecs, formatSpecsForDisplay } from '@/lib/utils/car-specs-aggregator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnquiryModal } from './EnquiryModal';
import { QuickViewModal } from './QuickViewModal';
import {
    Fuel,
    Gauge,
    Users,
    Zap,
    Star,
    Shield,
    TrendingUp,
    Send,
    Eye
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
    brandColor = '#2563eb', // default blue
    light,
}: CarCardProps) {
    const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [aggregatedSpecs, setAggregatedSpecs] = useState<ReturnType<typeof formatSpecsForDisplay>>(null);
    const [loading, setLoading] = useState(true);

    // Fetch aggregated specs from all variants when component mounts
    useEffect(() => {
        const fetchSpecs = async () => {
            try {
                setLoading(true);
                const specs = await getAggregatedCarSpecs(car.make, car.model);
                const formatted = formatSpecsForDisplay(specs);
                setAggregatedSpecs(formatted);
            } catch (error) {
                console.warn('Could not fetch aggregated specs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSpecs();
        return;
    }, [car.make, car.model]);

    const exShowroom = car.pricing?.exShowroom ?? { min: null, max: null }
    const priceRange = formatPriceInLakhs(exShowroom.min);
    const maxPrice = formatPriceInLakhs(exShowroom.max);

    // Use aggregated specs from all variants if available, fallback to single car data
    const fuelTypes = aggregatedSpecs?.fuelsDisplay || 
        (!car.engine?.type || car.engine.type === 'TBD') ? null : car.engine.type;
    const transmissionTypes = aggregatedSpecs?.transmissionsDisplay || 
        (!car.transmission?.type || car.transmission.type === 'TBD' || car.transmission.type === 'Transmission')
        ? null : car.transmission.type;
    const mileageRange = aggregatedSpecs?.mileageDisplay || 
        (car.performance?.fuelEfficiency && car.performance.fuelEfficiency > 0
        ? `${car.performance.fuelEfficiency} km/l` : null);
    const powerRange = aggregatedSpecs?.powerDisplay || null;
    const seatingCapacities = aggregatedSpecs?.seatingDisplay || 
        (car.dimensions?.seatingCapacity ? `${car.dimensions.seatingCapacity} seater` : null);

    // For multi-value strings like "Manual / Auto / CVT", use a smaller font so it fits
    const isMultiTransmission = transmissionTypes ? transmissionTypes.includes('/') : false;
    const isMultiFuel = fuelTypes ? fuelTypes.includes('/') : false;

    const handleEnquireNow = () => {
        setIsEnquiryModalOpen(true);
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsQuickViewOpen(true);
    };

    return (
        <>
            <Card
                className={cn(
                    'group relative overflow-hidden transition-all duration-500 cursor-pointer',
                    light
                        ? 'bg-white border border-gray-200 text-gray-900'
                        : 'bg-card border border-border',
                    'hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1',
                    'rounded-2xl',
                    className
                )}
                onClick={handleEnquireNow}
            >
            {/* Image Section */}
            <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                {car.images.hero ? (
                    <Image
                        src={car.images.hero}
                        alt={`${car.make} ${car.model}`}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-4xl">🚗</span>
                        </div>
                    </div>
                )}

                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Quick View Button - Shows on Hover */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <Button
                        className="w-full bg-background/95 backdrop-blur-sm text-foreground hover:bg-background shadow-xl"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleQuickView(e);
                        }}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Quick View
                    </Button>
                </div>
            </div>

            <CardContent className="p-5">
                {/* Brand & Model */}
                <div className="mb-3">
                    <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: brandColor }}>
                        {car.make}
                    </p>
                    <h3 className={cn('text-xl font-bold leading-tight line-clamp-1 transition-colors', light ? 'text-gray-900' : 'text-foreground')}>
                        {car.model}
                    </h3>
                    <p className={cn('text-sm line-clamp-1', light ? 'text-gray-500' : 'text-muted-foreground')}>{car.variant}</p>
                </div>

                {/* Price */}
                <div className={cn('mb-4 pb-4 border-b', light ? 'border-gray-100' : 'border-border')}>
                    <div className="flex items-baseline gap-2">
                        <span className={cn('text-2xl font-bold', light ? 'text-gray-900' : 'text-foreground')}>
                            {priceRange}
                        </span>
                        {car.pricing.exShowroom.min !== car.pricing.exShowroom.max && (
                            <span className="text-sm text-muted-foreground">- {maxPrice}</span>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Ex-showroom price</p>

                    {showEMI && car.pricing.emi && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: `${brandColor}15` }}>
                            <TrendingUp className="w-3 h-3" style={{ color: brandColor }} />
                            <span className="text-xs font-medium" style={{ color: brandColor }}>
                                EMI ₹{car.pricing.emi.monthly.toLocaleString()}/mo
                            </span>
                        </div>
                    )}
                </div>

                {/* Comprehensive Specs Grid - Now showing ALL variants info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {fuelTypes && (
                        <div className={cn('flex items-center gap-2.5 p-2.5 rounded-xl', light ? 'bg-gray-50' : 'bg-muted/50')}>
                            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', light ? 'bg-white shadow-sm' : 'bg-background shadow-sm')}>
                                <Fuel className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="min-w-0">
                                <p className={cn('text-xs', light ? 'text-gray-500' : 'text-muted-foreground')}>Fuel</p>
                                <p className={cn(
                                    'font-semibold leading-tight',
                                    isMultiFuel ? 'text-xs' : 'text-sm',
                                    light ? 'text-gray-900' : 'text-foreground'
                                )} title={fuelTypes}>
                                    {fuelTypes}
                                </p>
                            </div>
                        </div>
                    )}
                    {transmissionTypes && (
                        <div className={cn('flex items-center gap-2.5 p-2.5 rounded-xl', light ? 'bg-gray-50' : 'bg-muted/50')}>
                            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', light ? 'bg-white shadow-sm' : 'bg-background shadow-sm')}>
                                <Gauge className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                                <p className={cn('text-xs', light ? 'text-gray-500' : 'text-muted-foreground')}>Trans</p>
                                <p className={cn(
                                    'font-semibold leading-tight',
                                    isMultiTransmission ? 'text-xs' : 'text-sm',
                                    light ? 'text-gray-900' : 'text-foreground'
                                )} title={transmissionTypes}>
                                    {transmissionTypes}
                                </p>
                            </div>
                        </div>
                    )}
                    {seatingCapacities && (
                        <div className={cn('flex items-center gap-2.5 p-2.5 rounded-xl', light ? 'bg-gray-50' : 'bg-muted/50')}>
                            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', light ? 'bg-white shadow-sm' : 'bg-background shadow-sm')}>
                                <Users className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                                <p className={cn('text-xs', light ? 'text-gray-500' : 'text-muted-foreground')}>Seats</p>
                                <p className={cn('text-sm font-semibold', light ? 'text-gray-900' : 'text-foreground')} title={seatingCapacities}>
                                    {seatingCapacities}
                                </p>
                            </div>
                        </div>
                    )}
                    {mileageRange && (
                        <div className={cn('flex items-center gap-2.5 p-2.5 rounded-xl', light ? 'bg-gray-50' : 'bg-muted/50')}>
                            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', light ? 'bg-white shadow-sm' : 'bg-background shadow-sm')}>
                                <Zap className="w-4 h-4 text-amber-600" />
                            </div>
                            <div>
                                <p className={cn('text-xs', light ? 'text-gray-500' : 'text-muted-foreground')}>Mileage</p>
                                <p className={cn('text-sm font-semibold', light ? 'text-gray-900' : 'text-foreground')} title={mileageRange}>
                                    {mileageRange}
                                </p>
                            </div>
                        </div>
                    )}
                    {powerRange && (
                        <div className={cn('flex items-center gap-2.5 p-2.5 rounded-xl col-span-2', light ? 'bg-gray-50' : 'bg-muted/50')}>
                            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', light ? 'bg-white shadow-sm' : 'bg-background shadow-sm')}>
                                <Star className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div>
                                <p className={cn('text-xs', light ? 'text-gray-500' : 'text-muted-foreground')}>Power</p>
                                <p className={cn('text-sm font-semibold', light ? 'text-gray-900' : 'text-foreground')} title={powerRange}>
                                    {powerRange}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Key Features */}
                {car.features.keyFeatures.length > 0 && (
                    <div className="mb-4 p-3 bg-muted/30 rounded-xl">
                        <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-green-600" />
                            Top Features
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {car.features.keyFeatures.slice(0, variant === 'detailed' ? 5 : 3).map((feature, idx) => (
                                <span
                                    key={idx}
                                    className="text-xs px-2.5 py-1 bg-background rounded-full text-muted-foreground border border-border"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Rating */}
                {car.rating && (
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 rounded-lg">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="font-bold text-foreground">{car.rating.overall.toFixed(1)}</span>
                        </div>
                        {car.rating.reviewCount && (
                            <span className="text-xs text-muted-foreground">
                                {car.rating.reviewCount.toLocaleString()} reviews
                            </span>
                        )}
                    </div>
                )}

                {/* Action Button */}
                <Button
                    className="w-full text-white transition-all duration-300 group/btn"
                    style={{ backgroundColor: brandColor }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEnquireNow();
                    }}
                >
                    <Send className="w-4 h-4 mr-2" />
                    Enquire Now
                </Button>
            </CardContent>

            {/* Hover Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" style={{ backgroundColor: brandColor }} />
        </Card>

        {/* Quick View Modal */}
        <QuickViewModal
            car={car}
            open={isQuickViewOpen}
            onOpenChange={setIsQuickViewOpen}
            onEnquireNow={handleEnquireNow}
            brandColor={brandColor}
        />

        {/* Enquiry Modal */}
        <EnquiryModal
            car={car}
            open={isEnquiryModalOpen}
            onOpenChange={setIsEnquiryModalOpen}
            brandColor={brandColor}
        />
        </>
    );
}

/**
 * CarCard Component - PRO Edition
 * A premium, modern card for displaying car information
 * Features: Smooth animations, gradient accents, modern typography
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Car } from '@/lib/types/car';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
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
}

export function CarCard({
    car,
    variant = 'compact',
    showEMI = true,
    onViewDetails,
    className,
    brandColor = '#2563eb', // default blue
}: CarCardProps) {
    const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const priceRange = formatPriceInLakhs(car.pricing.exShowroom.min);
    const maxPrice = formatPriceInLakhs(car.pricing.exShowroom.max);

    // Normalize placeholder values
    const transmissionType = (!car.transmission?.type || car.transmission.type === 'TBD' || car.transmission.type === 'Transmission')
        ? null : car.transmission.type;
    const engineType = (!car.engine?.type || car.engine.type === 'TBD') ? null : car.engine.type;
    const mileage = car.performance?.fuelEfficiency && car.performance.fuelEfficiency > 0
        ? car.performance.fuelEfficiency : null;

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
                    'bg-card border border-border',
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
                    <h3 className="text-xl font-bold text-foreground leading-tight line-clamp-1 transition-colors" style={{ ['--hover-color' as any]: brandColor }}>
                        {car.model}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{car.variant}</p>
                </div>

                {/* Price */}
                <div className="mb-4 pb-4 border-b border-border">
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">
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

                {/* Quick Specs - Modern Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {engineType && (
                        <div className="flex items-center gap-2.5 p-2.5 bg-muted/50 rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-background shadow-sm flex items-center justify-center">
                                <Fuel className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Fuel</p>
                                <p className="text-sm font-semibold text-foreground">{engineType}</p>
                            </div>
                        </div>
                    )}
                    {transmissionType && (
                        <div className="flex items-center gap-2.5 p-2.5 bg-muted/50 rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-background shadow-sm flex items-center justify-center">
                                <Gauge className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Trans</p>
                                <p className="text-sm font-semibold text-foreground">{transmissionType}</p>
                            </div>
                        </div>
                    )}
                    {car.dimensions?.seatingCapacity && (
                        <div className="flex items-center gap-2.5 p-2.5 bg-muted/50 rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-background shadow-sm flex items-center justify-center">
                                <Users className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Seats</p>
                                <p className="text-sm font-semibold text-foreground">{car.dimensions.seatingCapacity}</p>
                            </div>
                        </div>
                    )}
                    {mileage && (
                        <div className="flex items-center gap-2.5 p-2.5 bg-muted/50 rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-background shadow-sm flex items-center justify-center">
                                <Zap className="w-4 h-4 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Mileage</p>
                                <p className="text-sm font-semibold text-foreground">{mileage} km/l</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Key Features - Detailed Variant */}
                {variant === 'detailed' && car.features.keyFeatures.length > 0 && (
                    <div className="mb-4 p-3 bg-muted/30 rounded-xl">
                        <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-green-600" />
                            Top Features
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {car.features.keyFeatures.slice(0, 3).map((feature, idx) => (
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

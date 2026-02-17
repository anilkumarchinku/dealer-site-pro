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
import { Badge } from '@/components/ui/badge';
import { EnquiryModal } from './EnquiryModal';
import { QuickViewModal } from './QuickViewModal';
import {
    Heart,
    Fuel,
    Gauge,
    Users,
    Zap,
    Star,
    Sparkles,
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
    onWishlist?: (carId: string) => void;
    className?: string;
    brandColor?: string;
}

export function CarCard({
    car,
    variant = 'compact',
    showEMI = true,
    onViewDetails,
    onWishlist,
    className,
    brandColor = '#2563eb', // default blue
}: CarCardProps) {
    const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const priceRange = formatPriceInLakhs(car.pricing.exShowroom.min);
    const maxPrice = formatPriceInLakhs(car.pricing.exShowroom.max);

    const handleEnquireNow = () => {
        setIsEnquiryModalOpen(true);
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsQuickViewOpen(true);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onWishlist) {
            onWishlist(car.id);
        }
    };

    // Determine badge type
    const isNewLaunch = car.meta.launchDate &&
        new Date(car.meta.launchDate) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const isTopRated = car.rating && car.rating.overall >= 4.5;
    const isFuelEfficient = car.performance?.fuelEfficiency && car.performance.fuelEfficiency >= 20;

    return (
        <>
            <Card
                className={cn(
                    'group relative overflow-hidden transition-all duration-500 cursor-pointer',
                    'bg-white border border-gray-100',
                    'hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1',
                    'rounded-2xl',
                    className
                )}
                onClick={handleEnquireNow}
            >
            {/* Image Section */}
            <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                {car.images.hero ? (
                    <Image
                        src={car.images.hero}
                        alt={`${car.make} ${car.model}`}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-4xl">🚗</span>
                        </div>
                    </div>
                )}

                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {isNewLaunch && (
                        <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg shadow-emerald-500/30">
                            <Sparkles className="w-3 h-3 mr-1" />
                            New
                        </Badge>
                    )}
                    {isTopRated && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg shadow-amber-500/30">
                            <Star className="w-3 h-3 mr-1" />
                            Top Rated
                        </Badge>
                    )}
                    {isFuelEfficient && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/30">
                            <Zap className="w-3 h-3 mr-1" />
                            Efficient
                        </Badge>
                    )}
                </div>

                {/* Wishlist Button - Top Right */}
                <button
                    onClick={handleWishlist}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 group/heart"
                >
                    <Heart className="w-5 h-5 text-gray-600 group-hover/heart:text-red-500 transition-colors" />
                </button>

                {/* Quick View Button - Shows on Hover */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <Button
                        className="w-full bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white shadow-xl"
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
                    <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-1 transition-colors" style={{ ['--hover-color' as any]: brandColor }}>
                        {car.model}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{car.variant}</p>
                </div>

                {/* Price */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {priceRange}
                        </span>
                        {car.pricing.exShowroom.min !== car.pricing.exShowroom.max && (
                            <span className="text-sm text-gray-400">- {maxPrice}</span>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">Ex-showroom price</p>

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
                    <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                            <Fuel className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Fuel</p>
                            <p className="text-sm font-semibold text-gray-900">{car.engine.type}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                            <Gauge className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Trans</p>
                            <p className="text-sm font-semibold text-gray-900">{car.transmission.type}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                            <Users className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Seats</p>
                            <p className="text-sm font-semibold text-gray-900">{car.dimensions?.seatingCapacity || 'N/A'}</p>
                        </div>
                    </div>
                    {car.performance?.fuelEfficiency && (
                        <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                <Zap className="w-4 h-4 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Mileage</p>
                                <p className="text-sm font-semibold text-gray-900">{car.performance.fuelEfficiency} km/l</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Key Features - Detailed Variant */}
                {variant === 'detailed' && car.features.keyFeatures.length > 0 && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-green-600" />
                            Top Features
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {car.features.keyFeatures.slice(0, 3).map((feature, idx) => (
                                <span
                                    key={idx}
                                    className="text-xs px-2.5 py-1 bg-white rounded-full text-gray-600 border border-gray-100"
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
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 rounded-lg">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="font-bold text-gray-900">{car.rating.overall.toFixed(1)}</span>
                        </div>
                        {car.rating.reviewCount && (
                            <span className="text-xs text-gray-400">
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

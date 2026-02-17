/**
 * QuickViewModal Component
 * Shows comprehensive car details in a modal
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Car } from '@/lib/types/car';
import { getDetailedCarInfo, parseKeyFeatures, parseSafetyFeatures, type DetailedCarInfo } from '@/lib/utils/car-info-fetcher';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Fuel,
    Gauge,
    Users,
    Zap,
    Calendar,
    Package,
    Settings,
    Shield,
    Star,
    Phone,
    Mail,
    Send,
    Info,
    TrendingUp,
} from 'lucide-react';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';

interface QuickViewModalProps {
    car: Car | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEnquireNow?: () => void;
    brandColor?: string;
}

export function QuickViewModal({
    car,
    open,
    onOpenChange,
    onEnquireNow,
    brandColor = '#2563eb'
}: QuickViewModalProps) {
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [detailedInfo, setDetailedInfo] = useState<DetailedCarInfo[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch detailed car info when modal opens
    useEffect(() => {
        if (open && car) {
            setLoading(true);
            getDetailedCarInfo(car.make, car.model)
                .then((info) => {
                    setDetailedInfo(info);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching detailed car info:', error);
                    setLoading(false);
                });
        }
    }, [open, car]);

    if (!car) return null;

    // Get the first detailed variant that matches
    const detailedVariant = detailedInfo.find(
        (info) => info.variant_name.toLowerCase().includes(car.variant.toLowerCase())
    ) || detailedInfo[0];

    // Aggregate specifications across all variants
    const aggregatedSpecs = detailedInfo.length > 0 ? {
        fuelTypes: [...new Set(detailedInfo.map(v => v.fuel_type).filter(Boolean))].join(' / '),
        transmissions: [...new Set(detailedInfo.map(v => v.transmission).filter(Boolean))].join(' / '),
        powerRange: detailedInfo.length > 1
            ? `${Math.min(...detailedInfo.map(v => v.power_bhp))} - ${Math.max(...detailedInfo.map(v => v.power_bhp))} bhp`
            : detailedVariant?.power_bhp ? `${detailedVariant.power_bhp} bhp` : null,
        seatingCapacities: [...new Set(detailedInfo.map(v => v.seating_capacity).filter(Boolean))].join(' / '),
        mileages: [...new Set(detailedInfo.map(v => v.mileage_kmpl || v.mileage_kmpl_or_ev_range).filter(Boolean))].join(' / ')
    } : null;

    // Parse features from detailed info
    const additionalKeyFeatures = detailedVariant ? parseKeyFeatures(detailedVariant.key_features) : [];
    const safetyFeatures = detailedVariant ? parseSafetyFeatures(detailedVariant.safety_features) : [];

    // Merge features with existing car features
    const allKeyFeatures = [
        ...(car.features?.keyFeatures || []),
        ...additionalKeyFeatures
    ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates

    const mainImage = activeImage || car.images.hero;
    const allImages = [
        car.images.hero,
        ...car.images.exterior,
        ...car.images.interior
    ].filter(Boolean);

    const priceRange = formatPriceInLakhs(car.pricing.exShowroom.min);
    const maxPrice = formatPriceInLakhs(car.pricing.exShowroom.max);

    const handleEnquireClick = () => {
        onOpenChange(false);
        if (onEnquireNow) {
            onEnquireNow();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-0">
                {/* Header */}
                <DialogHeader className="p-4 pb-0">
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold text-gray-900">
                                {car.make} {car.model}
                            </DialogTitle>
                            <p className="text-sm text-gray-500 mt-1">{car.variant} • {car.year}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Starting From</p>
                            <div className="text-xl font-bold text-gray-900">
                                {priceRange}
                                {car.pricing.exShowroom.min !== car.pricing.exShowroom.max && (
                                    <span className="text-base text-gray-400"> - {maxPrice}</span>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Ex-showroom price</p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-4 space-y-4">
                    {/* Image Gallery */}
                    <div className="space-y-2">
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden" style={{ maxHeight: '300px' }}>
                            {mainImage ? (
                                <Image
                                    src={mainImage}
                                    alt={`${car.make} ${car.model}`}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-6xl">🚗</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {allImages.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                                            (activeImage || car.images.hero) === img
                                                ? 'border-blue-600 scale-105'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tabs for Details */}
                    <Tabs defaultValue="specs" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="specs">Specifications</TabsTrigger>
                            <TabsTrigger value="features">Features</TabsTrigger>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                        </TabsList>

                        {/* Specifications Tab */}
                        <TabsContent value="specs" className="mt-4 space-y-4">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Info className="w-5 h-5" style={{ color: brandColor }} />
                                    Technical Specifications
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {/* Engine */}
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Fuel className="w-5 h-5 text-emerald-600" />
                                            <span className="text-xs text-gray-500 uppercase">Fuel Type</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {aggregatedSpecs?.fuelTypes || detailedVariant?.fuel_type || car.engine.type}
                                        </p>
                                        {(detailedVariant?.engine_displacement_cc || car.engine.displacement) && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {detailedVariant?.engine_displacement_cc || car.engine.displacement}cc
                                            </p>
                                        )}
                                    </div>

                                    {/* Transmission */}
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Gauge className="w-5 h-5 text-blue-600" />
                                            <span className="text-xs text-gray-500 uppercase">Transmission</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {aggregatedSpecs?.transmissions || detailedVariant?.transmission || car.transmission.type}
                                        </p>
                                    </div>

                                    {/* Seating */}
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users className="w-5 h-5 text-purple-600" />
                                            <span className="text-xs text-gray-500 uppercase">Seating</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {aggregatedSpecs?.seatingCapacities ? `${aggregatedSpecs.seatingCapacities} Seats` : `${detailedVariant?.seating_capacity || car.dimensions?.seatingCapacity || 'N/A'} Seats`}
                                        </p>
                                    </div>

                                    {/* Mileage */}
                                    {(aggregatedSpecs?.mileages || detailedVariant?.mileage_kmpl_or_ev_range || (detailedVariant as any)?.mileage_kmpl || car.performance?.fuelEfficiency) && (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Zap className="w-5 h-5 text-amber-600" />
                                                <span className="text-xs text-gray-500 uppercase">Mileage</span>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {aggregatedSpecs?.mileages ? `${aggregatedSpecs.mileages} km/l` :
                                                 detailedVariant?.mileage_kmpl_or_ev_range ||
                                                 ((detailedVariant as any)?.mileage_kmpl ? `${(detailedVariant as any).mileage_kmpl} km/l` : null) ||
                                                 (car.performance?.fuelEfficiency ? `${car.performance.fuelEfficiency} km/l` : 'N/A')}
                                            </p>
                                        </div>
                                    )}

                                    {/* Power */}
                                    {(aggregatedSpecs?.powerRange || detailedVariant?.power_bhp || (car.engine.power && car.engine.power !== 'TBD')) && (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Settings className="w-5 h-5 text-red-600" />
                                                <span className="text-xs text-gray-500 uppercase">Power</span>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {aggregatedSpecs?.powerRange || (detailedVariant?.power_bhp ? `${detailedVariant.power_bhp} bhp` : car.engine.power)}
                                            </p>
                                        </div>
                                    )}

                                    {/* Ground Clearance */}
                                    {detailedVariant?.ground_clearance_mm && (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Package className="w-5 h-5 text-indigo-600" />
                                                <span className="text-xs text-gray-500 uppercase">Ground Clearance</span>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900">{detailedVariant.ground_clearance_mm}mm</p>
                                        </div>
                                    )}

                                    {/* Boot Space */}
                                    {detailedVariant?.boot_space_l && (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Package className="w-5 h-5 text-indigo-600" />
                                                <span className="text-xs text-gray-500 uppercase">Boot Space</span>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900">{detailedVariant.boot_space_l}L</p>
                                        </div>
                                    )}

                                    {/* Body Type */}
                                    {car.bodyType && (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Package className="w-5 h-5 text-indigo-600" />
                                                <span className="text-xs text-gray-500 uppercase">Body Type</span>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900">{car.bodyType}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Additional Engine Info */}
                            {(detailedVariant?.torque_nm || (car.engine.torque && car.engine.torque !== 'TBD') ||
                              (detailedVariant as any)?.length_mm || detailedVariant?.dimensions) && (
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <h4 className="font-semibold text-gray-900 mb-2">Additional Details</h4>
                                    {(detailedVariant?.torque_nm || (car.engine.torque && car.engine.torque !== 'TBD')) && (
                                        <p className="text-sm text-gray-600">
                                            Torque: {detailedVariant?.torque_nm ? `${detailedVariant.torque_nm} Nm` : car.engine.torque}
                                        </p>
                                    )}
                                    {((detailedVariant as any)?.length_mm || detailedVariant?.dimensions) && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Dimensions (L×W×H): {
                                                (detailedVariant as any)?.length_mm
                                                    ? `${(detailedVariant as any).length_mm} × ${(detailedVariant as any).width_mm} × ${(detailedVariant as any).height_mm} mm`
                                                    : detailedVariant?.dimensions
                                            }
                                        </p>
                                    )}
                                </div>
                            )}
                        </TabsContent>

                        {/* Features Tab */}
                        <TabsContent value="features" className="mt-4 space-y-3">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Star className="w-5 h-5" style={{ color: brandColor }} />
                                    Key Features
                                </h3>
                                {allKeyFeatures.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {allKeyFeatures.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }} />
                                                <span className="text-sm text-gray-900">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : loading ? (
                                    <p className="text-gray-500 text-center py-8">Loading features...</p>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No features information available</p>
                                )}
                            </div>

                            {/* Safety Features */}
                            {(safetyFeatures.length > 0 || car.safety) && (
                                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Shield className="w-5 h-5 text-green-600" />
                                        <h4 className="font-semibold text-gray-900">Safety Features</h4>
                                    </div>

                                    {/* NCAP Rating if available */}
                                    {car.safety?.ncapRating && (
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-5 h-5 ${
                                                            i < (car.safety?.ncapRating?.stars || 0)
                                                                ? 'text-amber-400 fill-amber-400'
                                                                : 'text-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {car.safety.ncapRating.stars} Star Rating
                                            </span>
                                        </div>
                                    )}

                                    {/* Safety Features List */}
                                    {safetyFeatures.length > 0 && (
                                        <div className="grid grid-cols-1 gap-2">
                                            {safetyFeatures.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </TabsContent>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="mt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <span className="text-xs text-gray-500 uppercase">Year</span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900">{car.year}</p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Package className="w-5 h-5 text-gray-400" />
                                        <span className="text-xs text-gray-500 uppercase">Segment</span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900">{car.segment || 'N/A'}</p>
                                </div>
                            </div>

                            {/* EMI Info */}
                            {car.pricing.emi && (
                                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-5 h-5" style={{ color: brandColor }} />
                                        <h4 className="font-semibold text-gray-900">EMI Details</h4>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        ₹{car.pricing.emi.monthly.toLocaleString()}/month
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Based on {car.pricing.emi.tenure} months tenure
                                    </p>
                                </div>
                            )}

                            {/* Rating */}
                            {car.rating && (
                                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                                        <span className="text-2xl font-bold text-gray-900">{car.rating.overall.toFixed(1)}</span>
                                    </div>
                                    {car.rating.reviewCount && (
                                        <span className="text-sm text-gray-600">
                                            Based on {car.rating.reviewCount.toLocaleString()} reviews
                                        </span>
                                    )}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                        >
                            Close
                        </Button>
                        <Button
                            className="flex-1 text-white"
                            style={{ backgroundColor: brandColor }}
                            onClick={handleEnquireClick}
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Enquire Now
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

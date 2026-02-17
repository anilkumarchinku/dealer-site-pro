/**
 * EnquiryModal Component
 * Shows car details and enquiry form in a modal
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Car } from '@/lib/types/car';
import { getDetailedCarInfo, parseKeyFeatures, type DetailedCarInfo } from '@/lib/utils/car-info-fetcher';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Fuel,
    Gauge,
    Users,
    Zap,
    Calendar,
    Package,
    Settings,
    Send,
    CheckCircle,
} from 'lucide-react';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';

interface EnquiryModalProps {
    car: Car | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    brandColor?: string;
}

export function EnquiryModal({ car, open, onOpenChange, brandColor = '#2563eb' }: EnquiryModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [detailedInfo, setDetailedInfo] = useState<DetailedCarInfo[]>([]);

    // Fetch detailed car info when modal opens
    useEffect(() => {
        if (open && car) {
            getDetailedCarInfo(car.make, car.model)
                .then((info) => {
                    setDetailedInfo(info);
                })
                .catch((error) => {
                    console.error('Error fetching detailed car info:', error);
                });
        }
    }, [open, car]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);

        // Reset after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', phone: '', message: '' });
            onOpenChange(false);
        }, 3000);
    };

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
        mileages: detailedVariant?.mileage_kmpl_or_ev_range || null,
    } : null;

    // Parse features from detailed info
    const additionalKeyFeatures = detailedVariant ? parseKeyFeatures(detailedVariant.key_features) : [];

    // Merge features with existing car features
    const allKeyFeatures = [
        ...(car.features?.keyFeatures || []),
        ...additionalKeyFeatures
    ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates

    const priceRange = formatPriceInLakhs(car.pricing.exShowroom.min);
    const maxPrice = formatPriceInLakhs(car.pricing.exShowroom.max);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-0">
                {/* Car Details Section */}
                <div className="relative">
                    {/* Hero Image */}
                    <div className="relative h-64 w-full bg-gray-100">
                        {car.images.hero ? (
                            <Image
                                src={car.images.hero}
                                alt={`${car.make} ${car.model}`}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <span className="text-6xl">🚗</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Title Overlay */}
                        <div className="absolute bottom-4 left-6 right-6 text-white">
                            <p className="text-sm font-medium uppercase tracking-wider mb-1" style={{ color: brandColor }}>
                                {car.make}
                            </p>
                            <h2 className="text-3xl font-bold">{car.model}</h2>
                            <p className="text-sm opacity-90">{car.variant}</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Price */}
                        <div className="flex items-baseline gap-3 pb-4 border-b">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Price Range</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-gray-900">{priceRange}</span>
                                    {car.pricing.exShowroom.min !== car.pricing.exShowroom.max && (
                                        <span className="text-lg text-gray-400">- {maxPrice}</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Ex-showroom price</p>
                            </div>
                            {car.pricing.emi && (
                                <div className="ml-auto text-right">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">EMI Starts From</p>
                                    <p className="text-xl font-bold" style={{ color: brandColor }}>
                                        ₹{car.pricing.emi.monthly.toLocaleString()}/mo
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Specifications */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Specifications</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Engine */}
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                        <Fuel className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Fuel Type</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {aggregatedSpecs?.fuelTypes || detailedVariant?.fuel_type || car.engine.type}
                                        </p>
                                        {(detailedVariant?.engine_displacement_cc || car.engine.displacement) && (
                                            <p className="text-xs text-gray-500">
                                                {detailedVariant?.engine_displacement_cc || car.engine.displacement}cc
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Transmission */}
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                        <Gauge className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Transmission</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {aggregatedSpecs?.transmissions || detailedVariant?.transmission || car.transmission.type}
                                        </p>
                                    </div>
                                </div>

                                {/* Seating */}
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                        <Users className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Seating</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {detailedVariant?.seating_capacity || car.dimensions?.seatingCapacity || 'N/A'} Seats
                                        </p>
                                    </div>
                                </div>

                                {/* Mileage */}
                                {(aggregatedSpecs?.mileages || detailedVariant?.mileage_kmpl_or_ev_range || (detailedVariant as any)?.mileage_kmpl || car.performance?.fuelEfficiency) && (
                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                            <Zap className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Mileage</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {aggregatedSpecs?.mileages ? `${aggregatedSpecs.mileages} km/l` :
                                                 detailedVariant?.mileage_kmpl_or_ev_range ||
                                                 ((detailedVariant as any)?.mileage_kmpl ? `${(detailedVariant as any).mileage_kmpl} km/l` : null) ||
                                                 (car.performance?.fuelEfficiency ? `${car.performance.fuelEfficiency} km/l` : 'N/A')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Additional Info */}
                        {(detailedVariant?.power_bhp || detailedVariant?.ground_clearance_mm || detailedVariant?.boot_space_l || car.engine.power !== 'TBD' || car.bodyType || car.year) && (
                            <div className="grid grid-cols-3 gap-4 py-4 border-y">
                                {(aggregatedSpecs?.powerRange || detailedVariant?.power_bhp || car.engine.power !== 'TBD') && (
                                    <div className="text-center">
                                        <Settings className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                                        <p className="text-xs text-gray-500">Power</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {aggregatedSpecs?.powerRange || (detailedVariant?.power_bhp ? `${detailedVariant.power_bhp} bhp` : car.engine.power)}
                                        </p>
                                    </div>
                                )}
                                {detailedVariant?.ground_clearance_mm && (
                                    <div className="text-center">
                                        <Package className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                                        <p className="text-xs text-gray-500">Ground Clearance</p>
                                        <p className="text-sm font-semibold text-gray-900">{detailedVariant.ground_clearance_mm}mm</p>
                                    </div>
                                )}
                                {detailedVariant?.boot_space_l && (
                                    <div className="text-center">
                                        <Package className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                                        <p className="text-xs text-gray-500">Boot Space</p>
                                        <p className="text-sm font-semibold text-gray-900">{detailedVariant.boot_space_l}L</p>
                                    </div>
                                )}
                                {car.bodyType && (
                                    <div className="text-center">
                                        <Package className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                                        <p className="text-xs text-gray-500">Body Type</p>
                                        <p className="text-sm font-semibold text-gray-900">{car.bodyType}</p>
                                    </div>
                                )}
                                {car.year && (
                                    <div className="text-center">
                                        <Calendar className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                                        <p className="text-xs text-gray-500">Year</p>
                                        <p className="text-sm font-semibold text-gray-900">{car.year}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Key Features */}
                        {allKeyFeatures.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Key Features</h3>
                                <div className="flex flex-wrap gap-2">
                                    {allKeyFeatures.map((feature, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs px-3 py-1">
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Enquiry Form */}
                        <div className="pt-6 border-t">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Send Enquiry</h3>

                            {isSubmitted ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">Enquiry Sent Successfully!</h4>
                                    <p className="text-gray-600">Our team will contact you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input
                                                id="name"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="+91 98765 43210"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="message">Message (Optional)</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="I'm interested in this car. Please contact me..."
                                            rows={3}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full text-white"
                                        style={{ backgroundColor: brandColor }}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Send Enquiry
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

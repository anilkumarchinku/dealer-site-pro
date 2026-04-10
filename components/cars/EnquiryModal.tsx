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
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
import { getBrandLogo } from '@/lib/data/brand-logos';
import { getContrastText } from '@/lib/utils/color-contrast';
import { validateLeadForm, type ValidationErrors } from '@/lib/validations/client';
import { getScrapedImageUrls, brandNameToId } from '@/lib/utils/brand-model-images';

interface EnquiryModalProps {
    car: Car | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    brandColor?: string;
    /** Dealer phone — enables WhatsApp direct chat option */
    dealerPhone?: string;
    /** Pre-resolved image src from CarCard (local scraped path, avoids CDN hotlink issues) */
    resolvedImageSrc?: string | null;
}

export function EnquiryModal({ car, open, onOpenChange, brandColor = '#2563eb', dealerPhone, resolvedImageSrc }: EnquiryModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formErrors, setFormErrors] = useState<ValidationErrors>({});
    const [detailedInfo, setDetailedInfo] = useState<DetailedCarInfo[]>([]);
    const [heroImgIdx, setHeroImgIdx] = useState(0);

    // Fetch detailed car info when modal opens
    useEffect(() => {
        if (open && car) {
            getDetailedCarInfo(car.make, car.model, car.vehicleCategory)
                .then((info) => {
                    // Fallback for missing/corrupted JSON data: Use the grid's rigorous data!
                    if (!info || info.length === 0) {
                        info = [{
                            make: car.make,
                            model: car.model,
                            variant_name: car.variant || 'Standard',
                            ex_showroom_price_min_inr: car.pricing.exShowroom.min || 0,
                            fuel_type: car.engine?.type || 'Petrol',
                            transmission: car.transmission?.type || 'Manual',
                            engine_displacement_cc: car.engine?.displacement || 0,
                            power_bhp: parseInt(car.engine?.power) || 0,
                            torque_nm: parseInt(car.engine?.torque) || 0,
                            mileage_kmpl_or_ev_range: String(car.performance?.fuelEfficiency || car.performance?.range || ''),
                            seating_capacity: car.dimensions?.seatingCapacity || 2,
                            key_features: car.features?.keyFeatures?.join(', ') || '',
                            safety_features: car.features?.safetyFeatures?.join(', ') || '',
                            image_urls: car.colors?.map(c => ({ value: c.hex })) || [],
                            launch_year: car.year
                        }];
                    }
                    setDetailedInfo(info);
                })
                .catch((error) => {
                    console.error('Error fetching detailed car info:', error);
                });
        }
        return;
    }, [open, car]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validateLeadForm(formData);
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);

        // Reset after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', phone: '', message: '' });
            setFormErrors({});
            onOpenChange(false);
        }, 3000);
    };

    if (!car) return null;

    // Build image fallback list: resolvedImageSrc (local scraped) → scraped jpg/png → hero CDN
    const heroScrapedUrls = getScrapedImageUrls(
        car.vehicleCategory as '2w' | '3w' | '4w',
        brandNameToId(car.make, car.vehicleCategory as '2w' | '3w' | '4w'),
        car.model
    );
    const heroFallbackList = [...new Set([
        resolvedImageSrc,
        ...heroScrapedUrls,
        car.images.hero,
    ].filter((u): u is string => !!u && u !== '/placeholder-car.jpg'))];
    const heroSrc = heroFallbackList[heroImgIdx] ?? null;

    // Get the first detailed variant that matches
    const detailedVariant = detailedInfo.find(
        (info) => info.variant_name.toLowerCase().includes(car.variant.toLowerCase())
    ) || detailedInfo[0];

    // Aggregate specifications across all variants
    const aggregatedSpecs = detailedInfo.length > 0 ? {
        fuelTypes: [...new Set(detailedInfo.map(v => v.fuel_type).filter(Boolean))].join(' / '),
        transmissions: [...new Set(detailedInfo.map(v => v.transmission).filter(Boolean))].map(t => t === 'Automatic' ? 'Auto' : t).join(' / '),
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
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-0 dark:bg-white dark:text-gray-900 dark:border-gray-200">
                {/* Visually hidden title for screen-reader accessibility (Radix requirement) */}
                <DialogTitle className="sr-only">
                    {car.make} {car.model} — Enquiry
                </DialogTitle>
                <DialogDescription className="sr-only">
                    Enquiry form for {car.make} {car.model} {car.variant}
                </DialogDescription>
                {/* Car Details Section */}
                <div className="relative">
                    {/* Hero Image */}
                    <div className="relative h-64 w-full bg-gray-100">
                        {heroSrc ? (
                            <Image
                                src={heroSrc}
                                alt={`${car.make} ${car.model}`}
                                fill
                                unoptimized={heroSrc.startsWith('http')}
                                sizes="(max-width: 1024px) 100vw, 896px"
                                className="object-cover"
                                onError={() => setHeroImgIdx(prev => prev + 1)}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <span className="text-6xl">🚗</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Title Overlay */}
                        <div className="absolute bottom-4 left-6 right-6 text-white">
                            <div className="flex items-center gap-2 mb-1">
                                {getBrandLogo(car.make) && (
                                    <Image src={getBrandLogo(car.make)!} alt={car.make} width={24} height={24} className="object-contain" />
                                )}
                                <p className="text-sm font-medium uppercase tracking-wider" style={{ color: brandColor }}>
                                    {car.make}
                                </p>
                            </div>
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
                                <div className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-lg">
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
                                <div className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-lg">
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
                                <div className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-lg">
                                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                        <Users className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Seating</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {detailedVariant?.seating_capacity || car.dimensions?.seatingCapacity || ''} Seats
                                        </p>
                                    </div>
                                </div>

                                {/* Mileage */}
                                {(aggregatedSpecs?.mileages || detailedVariant?.mileage_kmpl_or_ev_range || (detailedVariant as any)?.mileage_kmpl || car.performance?.fuelEfficiency) && (
                                    <div className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-lg">
                                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                            <Zap className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Mileage</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {aggregatedSpecs?.mileages ? `${aggregatedSpecs.mileages} km/l` :
                                                    detailedVariant?.mileage_kmpl_or_ev_range ||
                                                    ((detailedVariant as any)?.mileage_kmpl ? `${(detailedVariant as any).mileage_kmpl} km/l` : null) ||
                                                    (car.performance?.fuelEfficiency ? `${car.performance.fuelEfficiency} km/l` : '')}
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

                        {/* Video Walkaround */}
                        {car.video_url && (() => {
                            const match = car.video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/)
                            const embedUrl = match ? `https://www.youtube.com/embed/${match[1]}` : null
                            return embedUrl ? (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Video Walkaround</h3>
                                    <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video">
                                        <iframe
                                            src={embedUrl}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title={`${car.make} ${car.model} video walkaround`}
                                        />
                                    </div>
                                </div>
                            ) : null
                        })()}

                        {/* Enquiry Form */}
                        <div className="pt-6 border-t">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Send Enquiry</h3>

                            {/* WhatsApp quick-connect option */}
                            {dealerPhone && !isSubmitted && (
                                <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-green-50 border border-green-200">
                                    <div className="shrink-0 w-9 h-9 rounded-full bg-green-500 flex items-center justify-center">
                                        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800">Prefer WhatsApp?</p>
                                        <p className="text-xs text-gray-500">Get an instant reply from the dealer</p>
                                    </div>
                                    <a
                                        href={`https://wa.me/${dealerPhone.replace(/[^0-9]/g, '').replace(/^(?!91)/, '91')}?text=${encodeURIComponent(`Hi, I'm interested in the ${car?.make} ${car?.model}${car?.variant ? ' ' + car.variant : ''}. Can you share more details and pricing?`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-semibold transition-colors"
                                    >
                                        Chat Now
                                    </a>
                                </div>
                            )}

                            {isSubmitted ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">Enquiry Sent Successfully!</h4>
                                    <p className="text-gray-600 mb-6">Our team will contact you shortly.</p>
                                    {dealerPhone && car && (
                                        <div className="border border-green-200 rounded-xl p-4 bg-green-50">
                                            <p className="text-sm text-gray-600 mb-3">Want a faster response? Chat directly on WhatsApp:</p>
                                            <a
                                                href={`https://wa.me/${dealerPhone.replace(/[^0-9]/g, '').replace(/^(?!91)/, '91')}?text=${encodeURIComponent(`Hi, I just submitted an enquiry for the ${car.make} ${car.model}${car.variant ? ' ' + car.variant : ''}. Can we discuss further?`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors"
                                            >
                                                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                                Continue on WhatsApp
                                            </a>
                                        </div>
                                    )}
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
                                            {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
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
                                            {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
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
                                        {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
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
                                        className="w-full"
                                        style={{ backgroundColor: brandColor, color: getContrastText(brandColor) }}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
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

'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import type { Car } from '@/lib/types/car';
import { formatPrice, formatPriceInLakhs } from '@/lib/utils/car-utils';
import { getVehicleImageUrls, brandNameToId } from '@/lib/utils/brand-model-images';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    Fuel,
    Gauge,
    MapPin,
    Palette,
    Send,
    Settings2,
} from 'lucide-react';

interface UsedVehicleDetailModalProps {
    car: Car | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onContactDealer: () => void;
    resolvedImageSrc?: string | null;
}

const USED_VEHICLE_ACCENT = '#f64f86';

function getFeatureValue(car: Car, matcher: RegExp): string | null {
    const features = car.features?.keyFeatures ?? [];
    for (const feature of features) {
        const match = feature.match(matcher);
        if (match?.[1]) return match[1].trim();
    }
    return null;
}

function getKmDriven(car: Car): string {
    const km = getFeatureValue(car, /([\d,]+)\s*km\s*driven/i);
    return km ? `${km} km` : 'Available on request';
}

function getUsedPrice(car: Car): string {
    if (typeof car.offer?.price === 'number' && car.offer.price > 0) {
        return car.offer.price < 100000 ? formatPrice(car.offer.price) : formatPriceInLakhs(car.offer.price);
    }
    const price = car.pricing?.exShowroom?.min;
    if (typeof price === 'number' && price > 0) {
        return price < 100000 ? formatPrice(price) : formatPriceInLakhs(price);
    }
    return car.price || 'Price on request';
}

export function UsedVehicleDetailModal({
    car,
    open,
    onOpenChange,
    onContactDealer,
    resolvedImageSrc,
}: UsedVehicleDetailModalProps) {
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        if (open) setImageIndex(0);
    }, [open, car?.id]);

    const imageUrls = useMemo(() => {
        if (!car) return [];
        const resolved = getVehicleImageUrls(
            car.vehicleCategory as '2w' | '3w' | '4w',
            brandNameToId(car.make, car.vehicleCategory as '2w' | '3w' | '4w'),
            car.model,
            resolvedImageSrc ?? car.images.hero,
        );
        return [...new Set([
            ...resolved,
            ...(car.images.exterior ?? []),
        ].filter((url): url is string => Boolean(url) && url !== '/placeholder-car.jpg'))];
    }, [car, resolvedImageSrc]);

    if (!car) return null;

    const heroImage = imageUrls[imageIndex] ?? null;
    const color = getFeatureValue(car, /^colou?r:\s*(.+)$/i) ?? 'Available on request';
    const location = getFeatureValue(car, /^location:\s*(.+)$/i) ?? 'Available on request';
    const fuel = car.engine?.type || 'Available on request';
    const transmission = car.transmission?.type || 'Available on request';
    const variant = car.variant || `${car.make} ${car.model}`;
    const year = car.year ? String(car.year) : 'Year available on request';
    const accent = USED_VEHICLE_ACCENT;
    const originalPrice = car.offer?.originalPrice ?? car.pricing?.exShowroom?.min ?? null;
    const hasOffer = typeof car.offer?.price === 'number' && car.offer.price > 0 && originalPrice != null && car.offer.price < originalPrice;

    const specs = [
        { label: 'Kilometers Driven', value: getKmDriven(car), icon: Gauge },
        { label: 'Fuel Type', value: fuel, icon: Fuel },
        { label: 'Transmission', value: transmission, icon: Settings2 },
        { label: 'Year', value: year, icon: Calendar },
        { label: 'Location', value: location, icon: MapPin },
        { label: 'Color', value: color, icon: Palette },
    ];

    const handleContactDealer = () => {
        onOpenChange(false);
        onContactDealer();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl border border-white/20 bg-[#0b0c10] p-4 text-white shadow-2xl sm:rounded-[28px] sm:p-8">
                <DialogTitle className="sr-only">
                    {car.make} {car.model} details
                </DialogTitle>
                <DialogDescription className="sr-only">
                    Used vehicle details with image, price, specifications, and contact action.
                </DialogDescription>

                <div className="space-y-7">
                    <div className="relative overflow-hidden rounded-2xl bg-[#15161c]">
                        {heroImage ? (
                            <Image
                                src={heroImage}
                                alt={`${car.make} ${car.model}`}
                                width={1200}
                                height={620}
                                unoptimized
                                className="h-[240px] w-full object-cover sm:h-[380px]"
                                onError={() => setImageIndex((current) => current + 1)}
                            />
                        ) : (
                            <div className="flex h-[240px] items-center justify-center text-lg font-semibold text-white/60 sm:h-[380px]">
                                No image available
                            </div>
                        )}
                        {car.year && (
                            <div
                                className="absolute right-5 top-5 rounded-full px-6 py-3 text-2xl font-black text-white shadow-lg"
                                style={{ backgroundColor: accent }}
                            >
                                {car.year}
                            </div>
                        )}
                    </div>

                    <div className="text-center">
                        <p className="text-5xl font-black tracking-tight sm:text-6xl" style={{ color: accent }}>
                            {getUsedPrice(car)}
                        </p>
                        {hasOffer && (
                            <p className="mt-2 text-lg font-semibold text-white/45 line-through">
                                {originalPrice < 100000 ? formatPrice(originalPrice) : formatPriceInLakhs(originalPrice)}
                            </p>
                        )}
                        {hasOffer && (
                            <p className="mt-1 text-sm font-semibold" style={{ color: accent }}>
                                {car.offer?.label || 'Offer price'}
                            </p>
                        )}
                        <p className="mt-3 text-xl font-semibold text-white/70 sm:text-2xl">
                            {variant}
                        </p>
                    </div>

                    <div className="h-px bg-white/35" />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {specs.map(({ label, value, icon: Icon }) => (
                            <div key={label} className="flex items-center gap-5 rounded-2xl bg-white/[0.035] p-5">
                                <div
                                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                                    style={{ backgroundColor: `${accent}2b`, color: accent }}
                                >
                                    <Icon className="h-7 w-7" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-lg text-white/70">{label}</p>
                                    <p className="truncate text-2xl font-bold text-white" title={value}>
                                        {value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-white/35" />

                    <Button
                        type="button"
                        className="h-16 w-full rounded-2xl text-xl font-bold text-white hover:opacity-95"
                        style={{ backgroundColor: accent }}
                        onClick={handleContactDealer}
                    >
                        <Send className="mr-2 h-5 w-5" />
                        Contact Dealer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

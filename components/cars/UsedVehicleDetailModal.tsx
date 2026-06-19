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
import { getContrastText } from '@/lib/utils/color-contrast';
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
    brandColor?: string;
}

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
    brandColor = '#111827',
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
    const accent = brandColor;
    const contrast = getContrastText(accent);
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
            <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto border border-gray-200 bg-white p-0 text-gray-950 shadow-2xl sm:rounded-3xl">
                <DialogTitle className="sr-only">
                    {car.make} {car.model} details
                </DialogTitle>
                <DialogDescription className="sr-only">
                    Used vehicle details with image, price, specifications, and contact action.
                </DialogDescription>

                <div className="space-y-6 p-5 sm:p-8">
                    <div className="relative overflow-hidden rounded-2xl bg-gray-100">
                        {heroImage ? (
                            <Image
                                src={heroImage}
                                alt={`${car.make} ${car.model}`}
                                width={1200}
                                height={620}
                                unoptimized
                                className="h-[240px] w-full object-contain sm:h-[360px]"
                                onError={() => setImageIndex((current) => current + 1)}
                            />
                        ) : (
                            <div className="flex h-[240px] items-center justify-center text-lg font-semibold text-gray-500 sm:h-[360px]">
                                No image available
                            </div>
                        )}
                        {car.year && (
                            <div
                                className="absolute right-4 top-4 rounded-full px-4 py-2 text-sm font-bold shadow-lg sm:px-5 sm:text-base"
                                style={{ backgroundColor: accent, color: contrast }}
                            >
                                {car.year}
                            </div>
                        )}
                    </div>

                    <div className="grid gap-4 border-b border-gray-200 pb-6 sm:grid-cols-[1fr_auto] sm:items-end">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>
                                {car.make}
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                                {car.model}
                            </h2>
                            <p className="mt-2 text-base text-gray-600 sm:text-lg">
                                {variant}
                            </p>
                        </div>

                        <div className="sm:text-right">
                            <p className="text-4xl font-black tracking-tight sm:text-5xl" style={{ color: accent }}>
                                {getUsedPrice(car)}
                            </p>
                            {hasOffer && (
                                <p className="mt-1 text-base font-semibold text-gray-400 line-through">
                                    {originalPrice < 100000 ? formatPrice(originalPrice) : formatPriceInLakhs(originalPrice)}
                                </p>
                            )}
                            <p className="mt-1 text-sm text-gray-600">
                                {hasOffer ? (car.offer?.label || 'Offer price') : 'Price'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {specs.map(({ label, value, icon: Icon }) => (
                            <div key={label} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
                                <div
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                                    style={{ backgroundColor: `${accent}14`, color: accent }}
                                >
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm text-gray-500">{label}</p>
                                    <p className="truncate text-xl font-bold text-gray-950" title={value}>
                                        {value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button
                        type="button"
                        className="h-14 w-full rounded-xl text-base font-bold hover:opacity-95"
                        style={{ backgroundColor: accent, color: contrast }}
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

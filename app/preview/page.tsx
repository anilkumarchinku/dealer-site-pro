"use client"

/**
 * Preview Page - PRO Edition
 * Renders the selected template with brand-specific colors and cars
 */

import React, { useState, Suspense, useEffect } from 'react';
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { getPrimaryBrand, automotiveBrands } from "@/lib/colors/automotive-brands";
import type { TemplateStyle } from "@/lib/templates";
import { getCarsByMake, getAllCars } from "@/lib/services/car-service";
import type { Car } from "@/lib/types/car";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { TemplatePageLoader, useTemplatePageAnimation } from "@/components/onboarding/TemplatePageLoader";
import "@/components/onboarding/template-animations.css";
import "@/components/onboarding/premium-animations.css";
import {
    ArrowLeft,
    ExternalLink,
    Settings,
    Eye,
    Palette,
    LayoutTemplate,
    ChevronDown,
    Car as CarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Import PRO Template Components
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { LuxuryTemplate } from "@/components/templates/LuxuryTemplate";
import { SportyTemplate } from "@/components/templates/SportyTemplate";
import { FamilyTemplate } from "@/components/templates/FamilyTemplate";

import { getTwoWheelerCatalog, TWO_WHEELER_BRANDS } from "@/lib/data/two-wheelers";
import { getThreeWheelerCatalog, THREE_WHEELER_BRANDS } from "@/lib/data/three-wheelers";
import { VINFAST_CARS } from "@/lib/data/vinfast-catalog";
import type { TwoWheelerVehicle } from "@/lib/types/two-wheeler";
import type { ThreeWheelerVehicle } from "@/lib/types/three-wheeler";
import { brandNameToId } from "@/lib/utils/brand-model-images";

// Map 2W vehicles to the Car shape expected by 4W templates
function twoWheelersToCars(vehicles: TwoWheelerVehicle[]): import("@/lib/types/car").Car[] {
    return vehicles.map(v => ({
        id: v.id,
        make: v.brand,
        model: v.model,
        variant: v.variant ?? '',
        year: v.year,
        bodyType: v.type === 'scooter' ? 'Scooter' : v.type === 'electric' ? 'Electric' : 'Bike',
        segment: 'B' as const,
        vehicleCategory: '2w' as const,
        pricing: {
            exShowroom: {
                min: v.ex_showroom_price_paise > 0 ? Math.round(v.ex_showroom_price_paise / 100) : null,
                max: v.ex_showroom_price_paise > 0 ? Math.round(v.ex_showroom_price_paise / 100) : null,
                currency: 'INR' as const,
            },
        },
        engine: {
            type: v.fuel_type === 'electric' ? 'Electric' : 'Petrol',
            power: v.max_power || '—',
            torque: v.torque || '—',
            displacement: v.engine_cc ?? undefined,
            batteryCapacity: v.battery_kwh ?? undefined,
        },
        transmission: { type: v.transmission || 'Manual' },
        performance: {
            fuelEfficiency: v.mileage_kmpl ?? undefined,
            topSpeed: v.top_speed_kmph ?? undefined,
            range: v.range_km ?? undefined,
        },
        dimensions: { seatingCapacity: 2 },
        features: { keyFeatures: v.features ?? [] },
        images: { hero: v.images?.[0] ?? '/placeholder-car.jpg', exterior: v.images ?? [], interior: [] },
        colors: (v.colors ?? []).map(c => ({ name: c.name, type: 'Solid' as const, hex: c.hex, extraCost: 0 })),
        meta: { viewCount: v.views ?? 0 },
        price: v.ex_showroom_price_paise > 0
            ? `₹${(v.ex_showroom_price_paise / 100).toLocaleString('en-IN')}`
            : 'Price on request',
        condition: 'new' as const,
    }))
}

// Map 3W vehicles to the Car shape expected by 4W templates
function threeWheelersToCars(vehicles: ThreeWheelerVehicle[]): import("@/lib/types/car").Car[] {
    return vehicles.map(v => ({
        id: v.id,
        make: v.brand,
        model: v.model,
        variant: v.variant ?? '',
        year: v.year,
        bodyType: v.body_type ?? 'Auto',
        segment: 'B' as const,
        vehicleCategory: '3w' as const,
        pricing: {
            exShowroom: {
                min: v.ex_showroom_price_paise > 0 ? Math.round(v.ex_showroom_price_paise / 100) : null,
                max: v.ex_showroom_price_paise > 0 ? Math.round(v.ex_showroom_price_paise / 100) : null,
                currency: 'INR' as const,
            },
        },
        engine: {
            type: v.fuel_type === 'electric' ? 'Electric' : v.fuel_type === 'cng' ? 'CNG' : 'Petrol',
            power: v.max_power || '—',
            torque: v.torque || '—',
            displacement: v.engine_cc ?? undefined,
            batteryCapacity: v.battery_kwh ?? undefined,
        },
        transmission: { type: v.transmission || 'Automatic' },
        performance: {
            fuelEfficiency: v.mileage_kmpl ?? undefined,
            topSpeed: v.max_speed_kmph ?? undefined,
            range: v.range_km ?? undefined,
        },
        dimensions: { seatingCapacity: v.passenger_capacity ?? 3 },
        features: { keyFeatures: v.features ?? [] },
        images: { hero: v.images?.[0] ?? '/placeholder-car.jpg', exterior: v.images ?? [], interior: [] },
        colors: (v.colors ?? []).map(c => ({ name: c.name, type: 'Solid' as const, hex: c.hex, extraCost: 0 })),
        meta: { viewCount: v.views ?? 0 },
        price: v.ex_showroom_price_paise > 0
            ? `₹${(v.ex_showroom_price_paise / 100).toLocaleString('en-IN')}`
            : 'Price on request',
        condition: 'new' as const,
    }))
}


function PreviewContent() {
    const { data, dealerSlug, dealerId } = useOnboardingStore();
    const searchParams = useSearchParams();
    const urlBrand = searchParams.get('brand');
    const urlTemplate = searchParams.get('template');

    // Use URL params if available, otherwise fallback to store data
    const effectiveBrands = urlBrand ? [urlBrand] : (data.brands || ["Toyota"]);
    const primaryBrand = getPrimaryBrand(effectiveBrands);
    const templateId = (urlTemplate || data.styleTemplate || 'modern') as TemplateStyle;

    // Get brand-specific colors
    const brandConfig = automotiveBrands[primaryBrand as keyof typeof automotiveBrands] as any || automotiveBrands['Toyota'];
    const brandColors = {
        primary: brandConfig.primary,
        secondary: brandConfig.secondary || brandConfig.primary,
        gradient: brandConfig.gradient || `from-[${brandConfig.primary}] to-[${brandConfig.primary}]`,
        hover: brandConfig.hover || brandConfig.primary,
    };

    // Detect vehicle category from brand name
    const is2W = TWO_WHEELER_BRANDS.includes(primaryBrand)
    const is3W = THREE_WHEELER_BRANDS.includes(primaryBrand)
    const vehicleCategory = is3W ? "3w" : is2W ? "2w" : "cars"

    const [displayCars, setDisplayCars] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            setIsLoading(true);
            try {
                if (is2W) {
                    const vehicles = getTwoWheelerCatalog(primaryBrand, dealerId || "preview-dealer")
                    if (isMounted) setDisplayCars(twoWheelersToCars(vehicles))
                } else if (is3W) {
                    const vehicles = getThreeWheelerCatalog(primaryBrand, dealerId || "preview-dealer")
                    if (isMounted) setDisplayCars(threeWheelersToCars(vehicles))
                } else {
                    let cars = await getCarsByMake(primaryBrand);
                    if (cars.length === 0) {
                        // Use brand-specific static catalog if available, else generic fallback
                        if (primaryBrand === 'VinFast') {
                            cars = VINFAST_CARS;
                        } else {
                            const result = await getAllCars({ limit: 8 });
                            cars = result.cars;
                        }
                    }
                    if (isMounted) setDisplayCars(cars);
                }
                if (isMounted) setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch vehicles for preview", error);
                if (isMounted) setIsLoading(false);
            }
        }

        fetchData();

        return () => { isMounted = false; };
    }, [primaryBrand, dealerId, is2W, is3W]);

    // Page load animation
    const { showAnimation, isReady } = useTemplatePageAnimation(primaryBrand as any, templateId);

    // Preview banner state
    const [isBannerExpanded, setIsBannerExpanded] = useState(false);

    // Contact info from store or defaults
    const contactInfo = {
        phone: data.phone || "+91 98765 43210",
        email: data.email || "sales@dealership.com",
        address: data.location || "123 Auto Park, City Center"
    };

    // Dealer name from store or default - include brand name
    const dealerName = data.dealershipName || `${primaryBrand} Motors`;

    // Template configurations with brand colors
    const templateConfigs = {
        modern: {
            heroTitle: `Discover ${primaryBrand}`,
            heroSubtitle: `Experience the excellence of ${primaryBrand} with our premium collection`,
            brandColor: brandColors.primary,
        },
        luxury: {
            heroTitle: `THE ${primaryBrand.toUpperCase()} EXPERIENCE`,
            heroSubtitle: `Discover unparalleled luxury and sophistication with ${primaryBrand}`,
            tagline: "Excellence in Motion",
            brandColor: brandColors.primary,
        },
        sporty: {
            heroTitle: `UNLEASH ${primaryBrand.toUpperCase()}`,
            heroSubtitle: `Where ${primaryBrand} power meets cutting-edge performance`,
            tagline: "Built for Speed",
            brandColor: brandColors.primary,
        },
        family: {
            heroTitle: `Your Family's ${primaryBrand}`,
            heroSubtitle: `Safe, reliable ${primaryBrand} vehicles for every family`,
            tagline: "Trusted by Families",
            brandColor: brandColors.primary,
        }
    };

    // Services selected by dealer during onboarding
    const dealerServices = data.services || [];

    // Compute logo URL based on vehicle category
    const logoUrl = (() => {
        if (is2W) {
            const brandId = brandNameToId(primaryBrand, '2w');
            return brandId ? `/data/brand-logos/${brandId}.png` : undefined;
        }
        if (is3W) {
            const brandId = brandNameToId(primaryBrand, '3w');
            return brandId ? `/data/brand-logos/${brandId}.png` : undefined;
        }
        // 4W — use existing assets/logos path
        return `/assets/logos/${primaryBrand.toLowerCase().replace(/\s+/g, '-')}.png`;
    })();

    // Render the appropriate template with brand-specific data
    // All vehicle categories (2W, 3W, cars) now use the same 4W template switcher
    const renderTemplate = () => {
        const config = templateConfigs[templateId as keyof typeof templateConfigs] || templateConfigs.modern;

        const props = {
            brandName: primaryBrand,
            dealerName: dealerName,
            cars: displayCars,
            contactInfo: contactInfo,
            config: config,
            services: dealerServices,
            previewMode: true,
            sellsNewCars: true,
            sellsUsedCars: false,
            logoUrl: logoUrl,
            vehicleType: is3W ? '3w' as const : is2W ? '2w' as const : '4w' as const,
        };

        switch (templateId) {
            case 'luxury': return <LuxuryTemplate {...props} />;
            case 'sporty': return <SportyTemplate {...props} />;
            case 'family': return <FamilyTemplate {...props} />;
            default: return <ModernTemplate {...props} />;
        }
    };

    // Template color mapping
    const templateColors: Record<string, { bg: string; text: string; border: string }> = {
        modern: { bg: "bg-blue-600", text: "text-blue-600", border: "border-blue-600" },
        luxury: { bg: "bg-amber-600", text: "text-amber-600", border: "border-amber-600" },
        sporty: { bg: "bg-red-600", text: "text-red-600", border: "border-red-600" },
        family: { bg: "bg-teal-600", text: "text-teal-600", border: "border-teal-600" },
    };

    const currentColor = templateColors[templateId] || templateColors.modern;

    // Available brands for quick switching
    const popularBrands = [
        "Maruti Suzuki", "Hyundai", "Tata Motors", "Mahindra",
        "Toyota", "Honda", "Kia", "BMW", "Mercedes-Benz", "Audi"
    ];

    return (
        <>
            {/* Page Load Animation */}
            {showAnimation && (
                <TemplatePageLoader
                    brand={primaryBrand as any}
                    template={templateId}
                />
            )}

            <div className={cn(
                "min-h-screen preview-page-content",
                isReady && "ready"
            )}>
                {/* Preview Banner - Fixed at top */}
                <div className={cn(
                    "fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
                    isBannerExpanded ? "bg-background shadow-xl border-b border-border" : "bg-gray-900/95 backdrop-blur-sm"
                )}>
                    {/* Main Banner */}
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="h-12 flex items-center justify-between">
                            {/* Left - Back & Info */}
                            <div className="flex items-center gap-4">
                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm" className={cn(
                                        "gap-2",
                                        isBannerExpanded ? "text-foreground hover:bg-muted" : "text-white/80 hover:text-white hover:bg-white/10"
                                    )}>
                                        <ArrowLeft className="w-4 h-4" />
                                        <span className="hidden sm:inline">Dashboard</span>
                                    </Button>
                                </Link>

                                <div className="hidden md:flex items-center gap-3">
                                    <div className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
                                        currentColor.bg, "text-white"
                                    )}>
                                        <Eye className="w-3 h-3" />
                                        Preview Mode
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-2 text-sm",
                                        isBannerExpanded ? "text-muted-foreground" : "text-white/70"
                                    )}>
                                        <LayoutTemplate className="w-4 h-4" />
                                        <span className="capitalize font-medium">{templateId}</span>
                                        <span className={isBannerExpanded ? "text-muted-foreground/50" : "text-white/40"}>•</span>
                                        <CarIcon className="w-4 h-4" />
                                        <span className="font-medium">{primaryBrand}</span>
                                        <span className={isBannerExpanded ? "text-muted-foreground/50" : "text-white/40"}>•</span>
                                        <span className={isBannerExpanded ? "text-muted-foreground" : "text-white/50"}>
                                            {isLoading ? "Loading..." : `${displayCars.length} vehicles`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right - Actions */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsBannerExpanded(!isBannerExpanded)}
                                    className={cn(
                                        "gap-1",
                                        isBannerExpanded ? "text-foreground hover:bg-muted" : "text-white/80 hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    <ChevronDown className={cn(
                                        "w-4 h-4 transition-transform",
                                        isBannerExpanded && "rotate-180"
                                    )} />
                                    <span className="hidden sm:inline">{isBannerExpanded ? "Collapse" : "Options"}</span>
                                </Button>

                                <Link href="/admin">
                                    <Button
                                        size="sm"
                                        className={cn(
                                            "gap-2",
                                            currentColor.bg, "text-white hover:opacity-90"
                                        )}
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span className="hidden sm:inline">Change</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Expanded Panel */}
                    {isBannerExpanded && (
                        <div className="border-t border-border bg-background">
                            <div className="max-w-7xl mx-auto px-4 py-4">
                                {/* Template Selection */}
                                <div className="mb-4">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Template Style</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {['modern', 'luxury', 'sporty', 'family'].map((t) => (
                                            <Link
                                                key={t}
                                                href={`/preview?template=${t}&brand=${encodeURIComponent(primaryBrand)}`}
                                                className={cn(
                                                    "p-3 rounded-xl border-2 transition-all text-center",
                                                    templateId === t
                                                        ? `${templateColors[t].border} bg-muted`
                                                        : "border-border hover:border-border/80 hover:bg-muted/50"
                                                )}
                                            >
                                                <p className={cn(
                                                    "font-semibold capitalize",
                                                    templateId === t ? templateColors[t].text : "text-foreground"
                                                )}>
                                                    {t}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {t === 'modern' && "Blue & Clean"}
                                                    {t === 'luxury' && "Gold & Dark"}
                                                    {t === 'sporty' && "Red & Bold"}
                                                    {t === 'family' && "Teal & Warm"}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Brand Selection */}
                                <div className="mb-4">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Select Brand</p>
                                    <div className="flex flex-wrap gap-2">
                                        {popularBrands.map((brand) => {
                                            const brandData = automotiveBrands[brand as keyof typeof automotiveBrands];
                                            const isSelected = brand === primaryBrand;
                                            return (
                                                <Link
                                                    key={brand}
                                                    href={`/preview?template=${templateId}&brand=${encodeURIComponent(brand)}`}
                                                    className={cn(
                                                        "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
                                                        isSelected
                                                            ? "border-foreground bg-foreground text-background"
                                                            : "border-border hover:border-border/80 bg-background hover:bg-muted/50"
                                                    )}
                                                >
                                                    <div className="w-6 h-6 relative">
                                                        <Image
                                                            src={`/assets/logos/${brand.toLowerCase().replace(/\s+/g, '-')}.png`}
                                                            alt={brand}
                                                            fill
                                                            className="object-contain"
                                                            sizes="24px"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium">{brand}</span>
                                                    {isSelected && (
                                                        <div
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: brandData?.primary || '#333' }}
                                                        />
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Info Bar */}
                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-4 h-4 rounded"
                                                style={{ backgroundColor: brandColors.primary }}
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                Brand Color: <span className="font-mono text-xs">{brandColors.primary}</span>
                                            </span>
                                        </div>
                                        <span className="text-muted-foreground/40">|</span>
                                        <span className="text-sm text-muted-foreground">
                                            Showing <span className="font-semibold text-foreground">{displayCars.length}</span> {primaryBrand} cars
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link href={dealerSlug ? `/sites/${dealerSlug}` : `/preview?template=${templateId}&brand=${encodeURIComponent(primaryBrand)}`}>
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <ExternalLink className="w-4 h-4" />
                                                Open Full Site
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Template Content - pt-12 = preview banner height; template navbar sits below it */}
                <div className="pt-12">
                    {renderTemplate()}
                </div>
            </div>
        </>
    );
}

export default function PreviewPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading preview...</p>
                </div>
            </div>
        }>
            <PreviewContent />
        </Suspense>
    );
}

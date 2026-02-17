"use client"

/**
 * Preview Page - PRO Edition
 * Renders the selected template with brand-specific colors and cars
 */

import React, { useState, Suspense } from 'react';
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { getPrimaryBrand, automotiveBrands } from "@/lib/colors/automotive-brands";
import type { TemplateStyle } from "@/lib/templates";
import { allCars, getCarsByMake } from "@/lib/data/cars";
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
    Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Import PRO Template Components
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { LuxuryTemplate } from "@/components/templates/LuxuryTemplate";
import { SportyTemplate } from "@/components/templates/SportyTemplate";
import { FamilyTemplate } from "@/components/templates/FamilyTemplate";

function PreviewContent() {
    const { data, dealerSlug } = useOnboardingStore();
    const searchParams = useSearchParams();
    const urlBrand = searchParams.get('brand');
    const urlTemplate = searchParams.get('template');

    // Use URL params if available, otherwise fallback to store data
    const effectiveBrands = urlBrand ? [urlBrand] : (data.brands || ["Toyota"]);
    const primaryBrand = getPrimaryBrand(effectiveBrands);
    const templateId = (urlTemplate || data.styleTemplate || 'modern') as TemplateStyle;

    // Get brand-specific colors
    const brandConfig = automotiveBrands[primaryBrand as keyof typeof automotiveBrands] || automotiveBrands['Toyota'];
    const brandColors = {
        primary: brandConfig.primary,
        secondary: brandConfig.secondary || brandConfig.primary,
        gradient: brandConfig.gradient || `from-[${brandConfig.primary}] to-[${brandConfig.primary}]`,
        hover: brandConfig.hover || brandConfig.primary,
    };

    // Get cars for the selected brand - filter by make
    const brandCars = getCarsByMake(primaryBrand);
    // If no cars for this brand, show all cars
    const displayCars = brandCars.length > 0 ? brandCars : allCars;

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

    // Render the appropriate template with brand-specific data
    const renderTemplate = () => {
        const config = templateConfigs[templateId as keyof typeof templateConfigs] || templateConfigs.modern;

        switch (templateId) {
            case 'luxury':
                return (
                    <LuxuryTemplate
                        brandName={primaryBrand}
                        dealerName={dealerName}
                        cars={displayCars}
                        contactInfo={contactInfo}
                        config={config}
                        services={dealerServices}
                        previewMode
                    />
                );
            case 'sporty':
                return (
                    <SportyTemplate
                        brandName={primaryBrand}
                        dealerName={dealerName}
                        cars={displayCars}
                        contactInfo={contactInfo}
                        config={config}
                        services={dealerServices}
                        previewMode
                    />
                );
            case 'family':
                return (
                    <FamilyTemplate
                        brandName={primaryBrand}
                        dealerName={dealerName}
                        cars={displayCars}
                        contactInfo={contactInfo}
                        config={config}
                        services={dealerServices}
                        previewMode
                    />
                );
            case 'modern':
            default:
                return (
                    <ModernTemplate
                        brandName={primaryBrand}
                        dealerName={dealerName}
                        cars={displayCars}
                        contactInfo={contactInfo}
                        config={config}
                        services={dealerServices}
                        previewMode
                    />
                );
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
                                        <Car className="w-4 h-4" />
                                        <span className="font-medium">{primaryBrand}</span>
                                        <span className={isBannerExpanded ? "text-muted-foreground/50" : "text-white/40"}>•</span>
                                        <span className={isBannerExpanded ? "text-muted-foreground" : "text-white/50"}>{displayCars.length} cars</span>
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

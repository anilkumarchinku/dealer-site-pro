/**
 * Modern Template - Using Template System with Brand Colors
 * A sleek, professional design that adapts to any automotive brand
 */

'use client';

import Image from 'next/image';
import { FadeInImage } from '@/components/ui/FadeInImage';
import { Car } from '@/lib/types/car';
import { CarGrid } from '@/components/cars/CarGrid';
import { CarFilters } from '@/components/cars/CarFilters';
import { Button } from '@/components/ui/button';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { ReviewsSection } from '@/components/ui/ReviewsSection';
import { SocialLinks } from '@/components/templates/shared/SocialLinks';
import { getTemplateServiceMeta } from '@/components/templates/shared/service-meta';
import { OffersSection } from '@/components/templates/sections/OffersSection';
import { FAQSection } from '@/components/templates/sections/FAQSection';
import { ExchangeSection } from '@/components/templates/sections/ExchangeSection';
import { SellVehicleSection } from '@/components/templates/sections/SellVehicleSection';
import { NavEMIModal } from '@/components/ui/NavEMIModal';
import { FinanceSection } from '@/components/templates/sections/FinanceSection';
import { TrustBadgesSection } from '@/components/templates/sections/TrustBadgesSection';
import { ServiceBookingSection } from '@/components/templates/sections/ServiceBookingSection';
import { LocationsMapSection } from '@/components/templates/sections/LocationsMapSection';
import { VideoSection } from '@/components/templates/sections/VideoSection';
import { StickyEnquiryBar } from '@/components/ui/StickyEnquiryBar';
import { Reveal } from '@/components/ui/Reveal';
import { CountUp } from '@/components/ui/CountUp';
import { DealerChatbot } from '@/components/chatbot/DealerChatbot';
import CompareBar from '@/components/cars/CompareBar';
import { WishlistDrawer } from '@/components/ui/WishlistDrawer';
import { EVSection } from '@/components/ui/EVSection';
import { generateTemplateConfig } from '@/lib/templates';
import { getContrastText } from '@/lib/utils/color-contrast';
import { getScrapedImageUrls, brandNameToId } from '@/lib/utils/brand-model-images';
import { buildTemplateDetailBasePath, buildTemplateSiteBase } from '@/lib/utils/template-site-paths';
import {
    ArrowRight,
    Phone,
    MapPin,
    Mail,
    Clock,
    Shield,
    CheckCircle2,
    ChevronRight,
    Award,
    Car as CarIcon,
    MessageSquare,
    Menu,
    X,
    Send,
    Bike,
    Truck,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { EnquireSidebar } from '@/components/cars/EnquireSidebar';
import { EmiCalculator } from '@/components/ui/EmiCalculator';
import type { Service } from '@/lib/types';
import { getVehicleLabels } from '@/lib/utils/vehicle-labels';
import { validateLeadForm, hasLeadFormErrors, normalizeLeadPhone, type LeadFormErrors } from '@/lib/validations/lead';

// A car's engine.type / transmission.type can be a joined string (e.g.
// "Petrol / Diesel" or "Manual / Auto"). Split on " / " so a multi-value car
// matches any selected option, and normalize the Auto/Automatic alias both ways.
function normalizeTransmission(value: string): string {
    const v = value.trim().toLowerCase();
    if (v === 'auto' || v === 'automatic') return 'automatic';
    return v;
}

function matchesFuel(carFuel: string, selected: string[]): boolean {
    const carValues = carFuel.split(' / ').map(s => s.trim().toLowerCase());
    return selected.some(sel => carValues.includes(sel.trim().toLowerCase()));
}

function matchesTransmission(carTransmission: string, selected: string[]): boolean {
    const carValues = carTransmission.split(' / ').map(normalizeTransmission);
    return selected.some(sel => carValues.includes(normalizeTransmission(sel)));
}

interface ModernTemplateProps {
    brandName: string;
    dealerName: string;
    dealerId?: string;
    cars: Car[];
    contactInfo: {
        phone: string;
        email: string;
        address: string;
    };
    config?: {
        heroTitle?: string;
        heroSubtitle?: string;
    };
    previewMode?: boolean;
    services?: Service[];
    workingHours?: string | null;
    logoUrl?: string;
    heroImageUrl?: string;
    sellsNewCars?: boolean;
    sellsUsedCars?: boolean;
    branches?: Array<{ city: string; address: string; phone?: string }>;
    serviceCenters?: Array<{ id: string; name: string; address?: string; city?: string; phone?: string }>;
    isVerified?: boolean;
    vehicleType?: '2w' | '3w' | '4w';
    socialLinks?: { facebook: string | null; instagram: string | null; twitter?: string | null; youtube: string | null; linkedin?: string | null };
    sellVehicleHref?: string;
}

export function ModernTemplate({
    brandName,
    dealerName,
    dealerId = '',
    cars,
    contactInfo,
    config: customConfig,
    previewMode,
    services,
    workingHours,
    logoUrl,
    heroImageUrl,
    sellsNewCars = false,
    sellsUsedCars = false,
    branches,
    serviceCenters,
    isVerified = false,
    vehicleType,
    socialLinks,
    sellVehicleHref,
}: ModernTemplateProps) {
    const vl = getVehicleLabels(vehicleType);
    const pathname = usePathname();
    const siteBase = useMemo(() => buildTemplateSiteBase(pathname, vehicleType), [pathname, vehicleType]);
    const detailBasePath = useMemo(() => buildTemplateDetailBasePath({
        pathname,
        vehicleType,
        sellsNewCars,
        sellsUsedCars,
    }), [pathname, sellsNewCars, sellsUsedCars, vehicleType]);
    const isHybrid = sellsNewCars && sellsUsedCars;
    const [activeTab, setActiveTab] = useState<'inventory' | 'home'>('home');
    const [inventoryTab, setInventoryTab] = useState<'all' | 'new' | 'used'>('all');
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeCarIndex, setActiveCarIndex] = useState(0);
    const [heroPaused, setHeroPaused] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [enquireSidebarOpen, setEnquireSidebarOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [navEMIOpen, setNavEMIOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<{
        make?: string[]; bodyType?: string[]; fuelType?: string[];
        transmission?: string[]; year?: string[]; seating?: string[];
        priceRange?: { min: number; max: number };
    } | null>(null);

    // Lead form state
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [formErrors, setFormErrors] = useState<LeadFormErrors>({});
    const [consent, setConsent] = useState(false);

    // Get template configuration with brand colors
    const config = generateTemplateConfig(brandName, 'professional');
    const { brandColors } = config;

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Show all cars
    const featuredCars = cars;

    // Client-side filtered inventory (responds to CarFilters selections)
    const filteredInventoryCars = useMemo(() => {
        if (!activeFilters) return cars;
        let result = cars;
        const { make, bodyType, fuelType, transmission, year, seating, priceRange } = activeFilters;
        if (make?.length) result = result.filter(c => make.includes(c.make));
        if (bodyType?.length) result = result.filter(c => bodyType.includes(c.bodyType));
        if (fuelType?.length) result = result.filter(c => matchesFuel(c.engine.type, fuelType));
        if (transmission?.length) result = result.filter(c => matchesTransmission(c.transmission.type, transmission));
        if (year?.length) result = result.filter(c => year.includes(c.year.toString()));
        if (seating?.length) result = result.filter(c => seating.includes(String(c.dimensions?.seatingCapacity ?? '')));
        if (priceRange) result = result.filter(c => {
            const p = c.pricing?.exShowroom?.min ?? 0;
            return p >= priceRange.min && p <= priceRange.max;
        });
        return result;
    }, [cars, activeFilters]);

    // Navigate to a home-tab section — switches tab then smooth-scrolls
    const navigateTo = (sectionId: string) => {
        setActiveTab('home');
        setTimeout(() => {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
    };
    const mobileNavigateTo = (sectionId: string) => {
        setMobileMenuOpen(false);
        navigateTo(sectionId);
    };

    // Number of cards the hero rotates through (mirrors the index modulo below)
    const heroRotationCount = Math.min(featuredCars.length, 3);

    // Track the user's reduced-motion preference — never auto-rotate when set.
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setPrefersReducedMotion(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    // Rotate featured car — gated by reduced-motion and pause-on-hover/focus.
    useEffect(() => {
        if (heroRotationCount <= 1) return;
        if (prefersReducedMotion || heroPaused) return;
        const interval = setInterval(() => {
            setActiveCarIndex((prev) => (prev + 1) % heroRotationCount);
        }, 5000);
        return () => clearInterval(interval);
    }, [heroRotationCount, prefersReducedMotion, heroPaused]);

    const goToHeroCard = (index: number) =>
        setActiveCarIndex(((index % heroRotationCount) + heroRotationCount) % heroRotationCount);
    const nextHeroCard = () => goToHeroCard(activeCarIndex + 1);
    const prevHeroCard = () => goToHeroCard(activeCarIndex - 1);

    const heroTitle = customConfig?.heroTitle || 'Find Your Perfect Drive';
    const heroSubtitle = customConfig?.heroSubtitle || 'Explore our premium collection of certified vehicles';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validateLeadForm({ name: formData.name, phone: formData.phone, email: formData.email, consent });
        if (hasLeadFormErrors(errors)) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        setFormStatus('sending');
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dealer_id: dealerId,
                    name: formData.name.trim(),
                    phone: normalizeLeadPhone(formData.phone),
                    email: formData.email.trim(),
                    message: formData.message,
                    lead_source: 'contact_form',
                }),
            });
            setFormStatus(res.ok ? 'sent' : 'error');
        } catch {
            setFormStatus('error');
        }
    };

    const serviceList = services && services.length > 0 ? services : [];
    const showInventoryTab = vehicleType !== '2w' && vehicleType !== '3w';

    // Hero stats are derived from real dealer data — we never fabricate counts,
    // ratings, or "years in business". Only stats with a real value are shown.
    const uniqueBrandCount = new Set(cars.map(c => c.make)).size;
    const heroStats = [
        cars.length > 0 && { value: `${cars.length}`, label: cars.length === 1 ? 'Vehicle' : 'Vehicles', icon: CarIcon },
        uniqueBrandCount > 0 && { value: `${uniqueBrandCount}`, label: uniqueBrandCount === 1 ? 'Brand' : 'Brands', icon: Award },
        serviceList.length > 0 && { value: `${serviceList.length}`, label: serviceList.length === 1 ? 'Service' : 'Services', icon: Shield },
    ].filter(Boolean) as { value: string; label: string; icon: typeof CarIcon }[];

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Skip to main content — first focusable element for keyboard/AT users */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-gray-900 focus:shadow-lg focus:outline focus:outline-2 focus:outline-gray-900"
            >
                Skip to main content
            </a>
            {/* Navigation */}
            <nav
                className={`fixed ${previewMode ? 'top-12' : 'top-0'} left-0 right-0 z-50 transition-all duration-300 bg-white ${isScrolled ? 'shadow-lg' : 'shadow-sm border-b border-gray-100'}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-4 h-16">
                        {/* Logo */}
                        <div className="flex min-w-0 shrink-0 items-center cursor-pointer" onClick={() => setActiveTab('home')}>
                            <div className="relative w-10 h-10 mr-3 shrink-0">
                                {logoUrl ? (
                                    <Image
                                        src={logoUrl}
                                        alt={dealerName}
                                        fill
                                        className="object-contain transition-all duration-300"
                                        sizes="40px"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                    />
                                ) : (
                                    <span className="flex h-full w-full items-center justify-center rounded-lg bg-gray-900 text-sm font-bold text-white">
                                        {dealerName.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <span className="max-w-[180px] text-lg font-bold leading-tight text-gray-900 xl:max-w-none xl:text-xl">
                                {dealerName}
                            </span>
                        </div>

                        {/* Nav Links */}
                        <div className="hidden xl:flex flex-1 items-center justify-center gap-4 px-4 2xl:gap-6">
                            <button
                                onClick={() => setActiveTab('home')}
                                className="whitespace-nowrap font-medium transition-colors text-sm text-gray-600 hover:text-gray-900"
                                style={activeTab === 'home' ? { color: brandColors.primary } : {}}
                            >
                                Home
                            </button>
                            {showInventoryTab && (
                                <button
                                    onClick={() => setActiveTab('inventory')}
                                    className="whitespace-nowrap font-medium transition-colors text-sm text-gray-600 hover:text-gray-900"
                                    style={activeTab === 'inventory' ? { color: brandColors.primary } : {}}
                                >
                                    Inventory
                                </button>
                            )}
                            <button onClick={() => navigateTo('contact')} className="whitespace-nowrap font-medium transition-colors text-sm text-gray-600 hover:text-gray-900">
                                Contact
                            </button>
                            <button
                                onClick={() => setNavEMIOpen(true)}
                                className="whitespace-nowrap font-medium transition-colors text-sm text-gray-600 hover:text-gray-900"
                            >
                                EMI Calc
                            </button>
                            <button onClick={() => navigateTo('exchange-section')} className="whitespace-nowrap font-medium transition-colors text-sm text-gray-600 hover:text-gray-900">Exchange</button>
                            <button onClick={() => navigateTo('finance-section')} className="whitespace-nowrap font-medium transition-colors text-sm text-gray-600 hover:text-gray-900">Finance</button>
                            <button onClick={() => navigateTo('service-section')} className="whitespace-nowrap font-medium transition-colors text-sm text-gray-600 hover:text-gray-900">Service</button>
                            <button onClick={() => navigateTo('trust-section')} className="whitespace-nowrap font-medium transition-colors text-sm text-gray-600 hover:text-gray-900">Trust Us</button>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex shrink-0 items-center gap-2">
                            <WishlistDrawer cars={cars} dealerId={dealerId} brandColor={brandColors.primary} />
                            {sellVehicleHref && (
                                <Button
                                    variant="outline"
                                    className="hidden bg-transparent px-4 text-gray-700 border-gray-300 hover:bg-gray-100 lg:flex"
                                    asChild
                                >
                                    <a href={sellVehicleHref}>Sell Your Car</a>
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                className="hidden bg-transparent px-4 text-gray-700 border-gray-300 hover:bg-gray-100 lg:flex"
                                onClick={() => setEnquireSidebarOpen(true)}
                            >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Enquire Now
                            </Button>
                            <Button
                                className="hidden px-4 shadow-lg sm:inline-flex lg:px-5"
                                style={{ backgroundColor: brandColors.primary, color: getContrastText(brandColors.primary) }}
                                asChild
                            >
                                <a href={`tel:${contactInfo.phone}`}>
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call Now
                                </a>
                            </Button>
                            <span className="hidden sm:inline-flex">
                                <WhatsAppButton phone={contactInfo.phone} variant="nav" />
                            </span>
                            <button
                                className="xl:hidden p-2 rounded-lg transition-colors text-gray-900"
                                onClick={() => setMobileMenuOpen(o => !o)}
                                aria-label="Toggle navigation menu"
                                aria-expanded={mobileMenuOpen}
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="xl:hidden border-t border-gray-100 bg-white animate-fade-in-down">
                            <div className="px-4 py-3 space-y-1">
                                <button
                                    onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                                    className="block w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors text-gray-900 hover:bg-gray-100"
                                >
                                    Home
                                </button>
                                {showInventoryTab && (
                                    <button
                                        onClick={() => { setActiveTab('inventory'); setMobileMenuOpen(false); }}
                                        className="block w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors text-gray-900 hover:bg-gray-100"
                                    >
                                        Inventory
                                    </button>
                                )}
                                <button
                                    onClick={() => mobileNavigateTo('contact')}
                                    className="block w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors text-gray-900 hover:bg-gray-100"
                                >
                                    Contact
                                </button>
                                <button
                                    onClick={() => { setNavEMIOpen(true); setMobileMenuOpen(false); }}
                                    className="block w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors text-gray-900 hover:bg-gray-100"
                                >
                                    EMI Calc
                                </button>
                                <button onClick={() => mobileNavigateTo('exchange-section')} className="block w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors text-gray-900 hover:bg-gray-100">Exchange</button>
                                <button onClick={() => mobileNavigateTo('finance-section')} className="block w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors text-gray-900 hover:bg-gray-100">Finance</button>
                                <button onClick={() => mobileNavigateTo('service-section')} className="block w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors text-gray-900 hover:bg-gray-100">Service</button>
                                <button onClick={() => mobileNavigateTo('trust-section')} className="block w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors text-gray-900 hover:bg-gray-100">Trust Us</button>
                                {sellVehicleHref && (
                                    <a href={sellVehicleHref} className="block w-full px-3 py-2.5 rounded-lg font-medium transition-colors text-gray-900 hover:bg-gray-100">
                                        Sell Your Car
                                    </a>
                                )}
                                <div className="pt-2 border-t border-gray-200">
                                    <Button
                                        className="w-full"
                                        style={{ backgroundColor: brandColors.primary, color: getContrastText(brandColors.primary) }}
                                        onClick={() => { setEnquireSidebarOpen(true); setMobileMenuOpen(false); }}
                                    >
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Enquire Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <EnquireSidebar
                open={enquireSidebarOpen}
                onOpenChange={setEnquireSidebarOpen}
                dealerName={dealerName}
                dealerId={dealerId}
                brandColor={brandColors.primary}
                services={services}
                contactPhone={contactInfo.phone}
                vehicleType={vehicleType}
            />

            {/* Home Tab */}
            {activeTab === 'home' && (
                <div id="main-content" tabIndex={-1} className="animate-fade-in">
                    {/* Hero Section */}
                    <section className="relative min-h-[85vh] flex items-center bg-white overflow-hidden">
                        <div className="absolute inset-0">
                            {(() => {
                                const heroSrc = heroImageUrl;
                                return heroSrc
                                    ? <Image src={heroSrc} alt={`${brandName} Hero`} fill className="object-cover" sizes="100vw" priority />
                                    : null;
                            })()}
                            {/* Readable scrim: keep the left (headline) bright while the vehicle stays
                                clearly visible on the right. On mobile the gradient is near-solid so
                                text over the image keeps contrast. */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/30 lg:to-transparent" />
                        </div>

                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                {/* Text */}
                                <div className="text-gray-900 space-y-6">
                                    <div className="flex flex-wrap items-center gap-2 animate-fade-in-up">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50">
                                            <span className="text-sm font-medium text-gray-600">{dealerName}</span>
                                        </div>
                                        {isVerified && <VerifiedBadge variant="hero" />}
                                    </div>
                                    <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900 animate-fade-in-up animate-delay-100">
                                        {heroTitle}
                                    </h1>
                                    <p className="text-xl text-gray-600 animate-fade-in-up animate-delay-200">{heroSubtitle}</p>
                                    <div className="flex flex-wrap gap-4 animate-fade-in-up animate-delay-300">
                                        {showInventoryTab && (
                                            <Button
                                                size="lg"
                                                style={{ backgroundColor: brandColors.primary, color: getContrastText(brandColors.primary) }}
                                                onClick={() => setActiveTab('inventory')}
                                            >
                                                View Inventory
                                                <ArrowRight className="ml-2 w-5 h-5" />
                                            </Button>
                                        )}
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="bg-transparent text-gray-900 border-gray-300 hover:bg-gray-100"
                                            asChild
                                        >
                                            <a href="#contact">Get a Quote</a>
                                        </Button>
                                    </div>
                                </div>

                                {/* Featured Car Card */}
                                {featuredCars.length > 0 && (() => {
                                    const heroCar = featuredCars[activeCarIndex % featuredCars.length];
                                    const cat = heroCar.vehicleCategory as '2w' | '3w' | undefined;
                                    const scrapedSrc = (cat === '2w' || cat === '3w')
                                        ? getScrapedImageUrls(cat, brandNameToId(heroCar.make, cat), heroCar.model)[0]
                                        : '';
                                    const heroSrc = heroCar.images.hero || scrapedSrc || null;
                                    const heroPrice = heroCar.pricing.exShowroom.min != null
                                        ? heroCar.pricing.exShowroom.min.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
                                        : (heroCar.price || 'Price on request');
                                    const showHeroControls = heroRotationCount > 1;
                                    return (
                                        <div
                                            className="mt-4 max-w-md mx-auto w-full lg:mt-0 lg:max-w-none animate-scale-in animate-delay-300"
                                            role="group"
                                            aria-roledescription="carousel"
                                            aria-label="Featured vehicles"
                                            onMouseEnter={() => setHeroPaused(true)}
                                            onMouseLeave={() => setHeroPaused(false)}
                                            onFocusCapture={() => setHeroPaused(true)}
                                            onBlurCapture={() => setHeroPaused(false)}
                                        >
                                            <div className="relative">
                                                <div
                                                    key={activeCarIndex}
                                                    className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden hover-lift animate-fade-in"
                                                >
                                                    <div className="aspect-video relative bg-gray-50">
                                                        {heroSrc ? (
                                                            <FadeInImage
                                                                src={heroSrc}
                                                                alt={heroCar.model}
                                                                fill
                                                                className="object-cover"
                                                                sizes="(max-width: 1024px) 100vw, 420px"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full text-gray-300">
                                                                {(() => {
                                                                    const PlaceholderIcon = cat === '2w' ? Bike : cat === '3w' ? Truck : CarIcon;
                                                                    return <PlaceholderIcon className="w-16 h-16" aria-hidden="true" />;
                                                                })()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-6">
                                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                            {heroCar.make}{' '}{heroCar.model}
                                                        </h3>
                                                        <p className="text-3xl font-bold" style={{ color: brandColors.primary }}>
                                                            {heroPrice}
                                                        </p>
                                                    </div>
                                                </div>

                                                {showHeroControls && (
                                                    <>
                                                        {/* Prev / Next */}
                                                        <button
                                                            type="button"
                                                            onClick={prevHeroCard}
                                                            aria-label="Previous featured vehicle"
                                                            className="absolute left-3 top-1/3 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                                                        >
                                                            <ChevronRight className="w-5 h-5 rotate-180" aria-hidden="true" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={nextHeroCard}
                                                            aria-label="Next featured vehicle"
                                                            className="absolute right-3 top-1/3 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                                                        >
                                                            <ChevronRight className="w-5 h-5" aria-hidden="true" />
                                                        </button>

                                                        {/* Dot indicators */}
                                                        <div className="mt-4 flex items-center justify-center gap-2">
                                                            {Array.from({ length: heroRotationCount }).map((_, i) => {
                                                                const isActive = i === activeCarIndex % heroRotationCount;
                                                                return (
                                                                    <button
                                                                        key={i}
                                                                        type="button"
                                                                        onClick={() => goToHeroCard(i)}
                                                                        aria-label={`Show featured vehicle ${i + 1} of ${heroRotationCount}`}
                                                                        aria-current={isActive}
                                                                        className="h-2.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                                                                        style={{
                                                                            width: isActive ? '1.5rem' : '0.625rem',
                                                                            backgroundColor: isActive ? brandColors.primary : '#d1d5db',
                                                                        }}
                                                                    />
                                                                );
                                                            })}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </section>

                    {/* Stats Section — real dealer data only */}
                    {heroStats.length > 0 && (
                        <section className="relative -mt-16 z-20 max-w-6xl mx-auto px-4">
                            <Reveal
                                direction="up"
                                className={`bg-white rounded-2xl shadow-2xl p-8 grid gap-8 ${heroStats.length === 1 ? 'grid-cols-1' : heroStats.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}
                            >
                                {heroStats.map((stat, i) => (
                                    <div key={i} className="group text-center">
                                        <div
                                            className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                            style={{ backgroundColor: `${brandColors.primary}20` }}
                                        >
                                            <stat.icon className="w-6 h-6" style={{ color: brandColors.primary }} />
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900">
                                            <CountUp value={stat.value} />
                                        </p>
                                        <p className="text-sm text-gray-600">{stat.label}</p>
                                    </div>
                                ))}
                            </Reveal>
                        </section>
                    )}

                    {/* Services Section */}
                    {serviceList.length > 0 && (
                        <section className="py-16 bg-white">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <Reveal className="text-center mb-10">
                                    <span
                                        className="font-semibold text-sm uppercase tracking-wider"
                                        style={{ color: brandColors.primary }}
                                    >
                                        What We Offer
                                    </span>
                                    <h2 className="text-3xl font-bold text-gray-900 mt-2">Our Services</h2>
                                </Reveal>
                                <div className="flex flex-wrap justify-center gap-4">
                                    {serviceList.map((svc, i) => {
                                        const meta = getTemplateServiceMeta(svc as string, vehicleType);
                                        const Icon = meta.icon;
                                        return (
                                            <Reveal
                                                key={svc as string}
                                                direction="up"
                                                delay={(i % 6) * 70}
                                                className="group flex items-center gap-3 px-5 py-3 rounded-xl border bg-gray-50 hover-lift"
                                                style={{ borderColor: `${brandColors.primary}30` }}
                                            >
                                                <Icon className="w-6 h-6 shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ color: brandColors.primary }} aria-hidden="true" />
                                                <span className="font-semibold text-gray-800">{meta.label}</span>
                                            </Reveal>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Featured Cars */}
                    <section className="py-20 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <Reveal className="flex justify-between items-end mb-12">
                                <div>
                                    <span
                                        className="font-semibold text-sm uppercase tracking-wider"
                                        style={{ color: brandColors.primary }}
                                    >
                                        Our Collection
                                    </span>
                                    <h2 className="text-4xl font-bold text-gray-900 mt-2">Featured Vehicles</h2>
                                </div>
                                {showInventoryTab && (
                                    <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-100" onClick={() => setActiveTab('inventory')}>
                                        View All
                                        <ChevronRight className="ml-1 w-4 h-4" />
                                    </Button>
                                )}
                            </Reveal>
                            <CarGrid cars={featuredCars} brandColor={brandColors.primary} light summaryOnly detailBasePath={detailBasePath} dealerPhone={contactInfo.phone} dealerId={dealerId} />
                        </div>
                    </section>

                    {/* EV Section */}
                    <EVSection cars={cars} contactInfo={contactInfo} brandColor="#10b981" />

                    {/* Why Choose Us */}
                    <section className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <Reveal className="text-center mb-12">
                                <h2 className="text-4xl font-bold text-gray-900">Why Choose Us</h2>
                            </Reveal>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[
                                    { icon: Shield, title: 'Trusted Dealer', desc: 'Verified, transparent service' },
                                    { icon: Award, title: 'Fair Pricing', desc: 'Clear, upfront pricing' },
                                    { icon: Clock, title: 'Easy Process', desc: 'Simple, hassle-free buying' },
                                    { icon: CheckCircle2, title: 'Finance Options', desc: 'Flexible payment plans' },
                                ].map((feature, i) => (
                                    <Reveal key={i} direction="up" delay={i * 80} className="group p-6 rounded-xl bg-gray-50 hover-lift">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                                            style={{ backgroundColor: `${brandColors.primary}20` }}
                                        >
                                            <feature.icon className="w-6 h-6" style={{ color: brandColors.primary }} />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.desc}</p>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* EMI Calculator */}
                    <section className="py-20 bg-white">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <Reveal className="text-center mb-10">
                                <span
                                    className="font-semibold text-sm uppercase tracking-wider"
                                    style={{ color: brandColors.primary }}
                                >
                                    Finance Tool
                                </span>
                                <h2 className="text-4xl font-bold text-gray-900 mt-2">EMI Calculator</h2>
                                <p className="text-gray-600 mt-2">Enter your details to estimate your monthly payment</p>
                            </Reveal>
                            <Reveal direction="up" delay={100}>
                                <EmiCalculator brandColor={brandColors.primary} theme="light" />
                            </Reveal>
                        </div>
                    </section>

                    {/* Customer Reviews */}
                    <section className="py-16 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <Reveal>
                                <ReviewsSection dealerId={dealerId} brandColor={brandColors.primary} variant="light" />
                            </Reveal>
                        </div>
                    </section>

                    {/* Offers Section */}
                    <OffersSection brandColor={brandColors.primary} dealerName={dealerName} vehicleType={vehicleType} dealerPhone={contactInfo.phone} />

                    {/* Exchange Section */}
                    <div id="exchange-section">
                        <ExchangeSection brandColor={brandColors.primary} dealerId={dealerId} dealerName={dealerName} vehicleType={vehicleType} />
                    </div>

                    {/* Trust Badges */}
                    <div id="trust-section">
                        <TrustBadgesSection brandColor={brandColors.primary} dealerName={dealerName} vehicleType={vehicleType} />
                    </div>

                    {/* Finance Section */}
                    <div id="finance-section">
                        <FinanceSection brandColor={brandColors.primary} dealerId={dealerId} dealerName={dealerName} />
                    </div>

                    {/* Service Booking */}
                    <div id="service-section">
                        <ServiceBookingSection brandColor={brandColors.primary} dealerId={dealerId} dealerName={dealerName} vehicleType={vehicleType} branches={branches} serviceCenters={serviceCenters} />
                    </div>

                    {/* FAQ Section */}
                    <FAQSection brandColor={brandColors.primary} vehicleType={vehicleType} dealerName={dealerName} />

                    {/* Video Section */}
                    <VideoSection brandColor={brandColors.primary} brandName={brandName} vehicleType={vehicleType} />

                    {/* Lead Capture / Contact Us */}
                    <section id="contact" className="py-20 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid lg:grid-cols-2 gap-12 items-start">
                                {/* Left — info */}
                                <Reveal direction="right">
                                    <span
                                        className="font-semibold text-sm uppercase tracking-wider"
                                        style={{ color: brandColors.primary }}
                                    >
                                        Contact Us
                                    </span>
                                    <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">Get a Quote Today</h2>
                                    <p className="text-gray-600 mb-8">
                                        Fill in the form and one of our experts will get back to you promptly with the best deal available.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${brandColors.primary}20` }}>
                                                <Phone className="w-5 h-5" style={{ color: brandColors.primary }} />
                                            </div>
                                            <a href={`tel:${contactInfo.phone}`} className="text-gray-700 font-medium hover:underline">{contactInfo.phone}</a>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${brandColors.primary}20` }}>
                                                <Mail className="w-5 h-5" style={{ color: brandColors.primary }} />
                                            </div>
                                            <a href={`mailto:${contactInfo.email}`} className="text-gray-700 font-medium hover:underline">{contactInfo.email}</a>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${brandColors.primary}20` }}>
                                                <MapPin className="w-5 h-5" style={{ color: brandColors.primary }} />
                                            </div>
                                            <span className="text-gray-700">{contactInfo.address}</span>
                                        </div>
                                        {workingHours && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${brandColors.primary}20` }}>
                                                    <Clock className="w-5 h-5" style={{ color: brandColors.primary }} />
                                                </div>
                                                <span className="text-gray-700">{workingHours}</span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Google Maps Embed */}
                                    {contactInfo.address && (
                                        <div className="mt-6 rounded-xl overflow-hidden border border-gray-200 h-48">
                                            <iframe
                                                src={`https://maps.google.com/maps?q=${encodeURIComponent(contactInfo.address)}&output=embed`}
                                                className="w-full h-full"
                                                loading="lazy"
                                                title={`${dealerName} location map`}
                                                referrerPolicy="no-referrer-when-downgrade"
                                            />
                                        </div>
                                    )}
                                </Reveal>

                                {/* Right — form */}
                                <Reveal direction="left" delay={100} className="bg-white rounded-2xl shadow-xl p-8">
                                    {formStatus === 'sent' ? (
                                        <div className="text-center py-10 animate-scale-in">
                                            <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: brandColors.primary }} />
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                                            <p className="text-gray-600">We&apos;ll be in touch with you shortly.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <h3 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    aria-invalid={!!formErrors.name}
                                                    className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus-visible:ring-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 ${formErrors.name ? 'border-red-500' : 'border-gray-200'}`}
                                                    style={{ '--tw-ring-color': brandColors.primary } as React.CSSProperties}
                                                    placeholder="Your full name"
                                                />
                                                {formErrors.name && <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    inputMode="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    aria-invalid={!!formErrors.phone}
                                                    className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus-visible:ring-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 ${formErrors.phone ? 'border-red-500' : 'border-gray-200'}`}
                                                    style={{ '--tw-ring-color': brandColors.primary } as React.CSSProperties}
                                                    placeholder="10-digit mobile number"
                                                />
                                                {formErrors.phone && <p className="mt-1 text-xs text-red-600">{formErrors.phone}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    aria-invalid={!!formErrors.email}
                                                    className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus-visible:ring-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 ${formErrors.email ? 'border-red-500' : 'border-gray-200'}`}
                                                    style={{ '--tw-ring-color': brandColors.primary } as React.CSSProperties}
                                                    placeholder="your@email.com"
                                                />
                                                {formErrors.email && <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                                <textarea
                                                    rows={4}
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus-visible:ring-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 resize-none"
                                                    style={{ '--tw-ring-color': brandColors.primary } as React.CSSProperties}
                                                    placeholder="What vehicle are you interested in?"
                                                />
                                            </div>
                                            <div>
                                                <label className="flex items-start gap-2 text-xs text-gray-600">
                                                    <input
                                                        type="checkbox"
                                                        checked={consent}
                                                        onChange={(e) => { setConsent(e.target.checked); if (e.target.checked) setFormErrors(prev => ({ ...prev, consent: undefined })); }}
                                                        aria-invalid={!!formErrors.consent}
                                                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300"
                                                    />
                                                    <span>
                                                        I agree to be contacted about my enquiry and accept the{' '}
                                                        <a href={`${siteBase}/privacy`} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: brandColors.primary }}>Privacy Policy</a>.
                                                    </span>
                                                </label>
                                                {formErrors.consent && <p className="mt-1 text-xs text-red-600">{formErrors.consent}</p>}
                                            </div>
                                            {formStatus === 'error' && (
                                                <p className="text-red-600 text-sm">Something went wrong. Please try again or call us directly.</p>
                                            )}
                                            <Button
                                                type="submit"
                                                disabled={formStatus === 'sending'}
                                                className="w-full py-3 rounded-xl font-semibold"
                                                style={{ backgroundColor: brandColors.primary, color: getContrastText(brandColors.primary) }}
                                            >
                                                {formStatus === 'sending' ? (
                                                    'Sending...'
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4 mr-2" />
                                                        Send Enquiry
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    )}
                                </Reveal>
                            </div>
                        </div>

                        {/* Branch & Service Center Locations */}
                        <div className="mt-12">
                            <LocationsMapSection
                                dealerName={dealerName}
                                mainAddress={contactInfo.address}
                                mainPhone={contactInfo.phone}
                                branches={branches}
                                serviceCenters={serviceCenters?.map(sc => ({ name: sc.name, address: sc.address ?? '', city: sc.city, phone: sc.phone }))}
                                brandColor={brandColors.primary}
                            />
                        </div>
                    </section>
                </div>
            )}

            {/* Inventory Tab */}
            {showInventoryTab && activeTab === 'inventory' && (
                <div id="main-content" tabIndex={-1} className="pt-20 pb-12 bg-gray-50 min-h-screen animate-fade-in">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900">Inventory</h1>
                                <p className="text-gray-600 mt-2">Browse {cars.length}+ quality vehicles</p>
                            </div>
                            {isHybrid && (
                                <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-gray-200 shadow-sm w-fit">
                                    {([
                                        { id: 'all', label: `All (${cars.length})` },
                                        { id: 'new', label: `New (${cars.filter(c => c.condition === 'new').length})` },
                                        { id: 'used', label: `Pre-Owned (${cars.filter(c => c.condition !== 'new').length})` },
                                    ] as const).map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setInventoryTab(t.id)}
                                            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                                            style={inventoryTab === t.id ? { backgroundColor: brandColors.primary, color: getContrastText(brandColors.primary) } : { color: '#6b7280' }}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-72">
                                <div className="sticky top-24 rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-4 shadow-sm">
                                    <CarFilters hideBrand={sellsNewCars} onFilterChange={setActiveFilters} />
                                </div>
                            </div>
                            <div className="flex-1">
                                <CarGrid
                                    cars={isHybrid
                                        ? inventoryTab === 'new' ? filteredInventoryCars.filter(c => c.condition === 'new')
                                            : inventoryTab === 'used' ? filteredInventoryCars.filter(c => c.condition !== 'new')
                                                : filteredInventoryCars
                                        : filteredInventoryCars}
                                    brandColor={brandColors.primary}
                                    light
                                    summaryOnly
                                    detailBasePath={detailBasePath}
                                    dealerPhone={contactInfo.phone}
                                    dealerId={dealerId}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <SellVehicleSection dealerName={dealerName} sellHref={sellVehicleHref} brandColor={brandColors.primary} />

            {/* Footer */}
            <footer className="bg-gray-50 text-gray-900 py-12 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Brand Logo */}
                    <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
                        <div className="relative w-12 h-12 mr-3">
                            {logoUrl ? (
                                <Image
                                    src={logoUrl}
                                    alt={dealerName}
                                    fill
                                    className="object-contain"
                                    sizes="48px"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                />
                            ) : (
                                <span className="flex h-full w-full items-center justify-center rounded-lg bg-gray-900 text-base font-bold text-white">
                                    {dealerName.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div>
                            <span className="text-2xl font-bold block text-gray-900">{dealerName}</span>
                            <span className="text-sm text-gray-600">{vl.familyVehicle === 'bike' ? 'Your trusted two-wheeler partner' : vl.familyVehicle === 'auto' ? 'Your trusted three-wheeler partner' : 'Your trusted automotive partner'}</span>
                        </div>
                    </div>

                    <div className={`grid gap-8 ${branches && branches.length > 0 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-5 h-5" style={{ color: brandColors.primary }} />
                                    <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-5 h-5" style={{ color: brandColors.primary }} />
                                    <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-5 h-5 mt-1" style={{ color: brandColors.primary }} />
                                    <span>{contactInfo.address}</span>
                                </div>
                                {workingHours && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5" style={{ color: brandColors.primary }} />
                                        <span>{workingHours}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {branches && branches.length > 0 && (
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Our Branches</h4>
                                <div className="space-y-4">
                                    {branches.map((branch, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <p className="font-semibold text-gray-900 text-sm">{branch.city}</p>
                                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: brandColors.primary }} />
                                                <span>{branch.address}</span>
                                            </div>
                                            {branch.phone && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: brandColors.primary }} />
                                                    <a href={`tel:${branch.phone}`}>{branch.phone}</a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                            <div className="space-y-2">
                                <button onClick={() => setActiveTab('home')} className="block text-gray-600 hover:text-gray-900">
                                    Home
                                </button>
                                {showInventoryTab && (
                                    <button onClick={() => setActiveTab('inventory')} className="block text-gray-600 hover:text-gray-900">
                                        Inventory
                                    </button>
                                )}
                                <button onClick={() => navigateTo('contact')} className="block text-gray-600 hover:text-gray-900">Contact</button>
                                <button onClick={() => setNavEMIOpen(true)} className="block text-gray-600 hover:text-gray-900">EMI Calculator</button>
                                <button onClick={() => navigateTo('exchange-section')} className="block text-gray-600 hover:text-gray-900">Exchange</button>
                                <button onClick={() => navigateTo('finance-section')} className="block text-gray-600 hover:text-gray-900">Finance</button>
                                <button onClick={() => navigateTo('service-section')} className="block text-gray-600 hover:text-gray-900">Service Booking</button>
                                <button onClick={() => navigateTo('trust-section')} className="block text-gray-600 hover:text-gray-900">Why Trust Us</button>
                                <div className="border-t border-gray-100 mt-3 pt-3 space-y-2">
                                    <a href={`${siteBase}/about`} className="block text-gray-600 hover:text-gray-900">About Us</a>
                                    <a href={`${siteBase}/terms`} className="block text-gray-600 hover:text-gray-900">Terms &amp; Conditions</a>
                                    <a href={`${siteBase}/privacy`} className="block text-gray-600 hover:text-gray-900">Privacy Policy</a>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">{dealerName}</h4>
                            <p className="text-gray-600 mb-4">
                                Your trusted partner for quality vehicles. Committed to transparency and customer
                                satisfaction.
                            </p>
                            {/* Social Media Links */}
                            <SocialLinks
                                facebook={socialLinks?.facebook}
                                instagram={socialLinks?.instagram}
                                twitter={socialLinks?.twitter}
                                youtube={socialLinks?.youtube}
                                linkedin={socialLinks?.linkedin}
                            />
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
                        <p>© {new Date().getFullYear()} {dealerName}. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Compare Bar */}
            <NavEMIModal open={navEMIOpen} onOpenChange={setNavEMIOpen} brandColor={brandColors.primary} cars={cars} />
            <CompareBar brandColor={brandColors.primary} dealerId={dealerId} dealerPhone={contactInfo.phone} />

            {/* Sticky Mobile Bar */}
            <StickyEnquiryBar phone={contactInfo.phone} brandColor={brandColors.primary} vehicleType={vehicleType} />

            {/* Rule-Based Chatbot */}
            <DealerChatbot
                dealerName={dealerName}
                brandName={brandName}
                phone={contactInfo.phone}
                address={contactInfo.address}
                workingHours={workingHours}
                brandColor={brandColors.primary}
                vehicleType={vehicleType}
                cars={cars.slice(0, 8).map(c => ({ make: c.make, model: c.model, price: c.price, condition: c.condition }))}
                services={services as string[]}
            />

        </div>
    );
}

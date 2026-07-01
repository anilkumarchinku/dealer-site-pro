/**
 * Family Template - Using Template System with Brand Colors
 * A warm, welcoming design for family-oriented dealerships
 */

'use client';

import Image from 'next/image';
import { Car } from '@/lib/types/car';
import { CarGrid } from '@/components/cars/CarGrid';
import { CarFilters } from '@/components/cars/CarFilters';
import { Button } from '@/components/ui/button';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { ReviewsSection } from '@/components/ui/ReviewsSection';
import { OffersSection } from '@/components/templates/sections/OffersSection';
import { FAQSection } from '@/components/templates/sections/FAQSection';
import { ExchangeSection } from '@/components/templates/sections/ExchangeSection';
import { SellVehicleSection } from '@/components/templates/sections/SellVehicleSection';
import { StickyEnquiryBar } from '@/components/ui/StickyEnquiryBar';
import { DealerChatbot } from '@/components/chatbot/DealerChatbot';
import { NavEMIModal } from '@/components/ui/NavEMIModal';
import { FinanceSection } from '@/components/templates/sections/FinanceSection';
import { TrustBadgesSection } from '@/components/templates/sections/TrustBadgesSection';
import { ServiceBookingSection } from '@/components/templates/sections/ServiceBookingSection';
import { LocationsMapSection } from '@/components/templates/sections/LocationsMapSection';
import { VideoSection } from '@/components/templates/sections/VideoSection';
import { SocialLinks } from '@/components/templates/shared/SocialLinks';
import { getTemplateServiceMeta } from '@/components/templates/shared/service-meta';
import CompareBar from '@/components/cars/CompareBar';
import { WishlistDrawer } from '@/components/ui/WishlistDrawer';
import { EVSection } from '@/components/ui/EVSection';
import { generateTemplateConfig } from '@/lib/templates';
import { getContrastText, getReadableAccent } from '@/lib/utils/color-contrast';
import { buildTemplateDetailBasePath, buildTemplateSiteBase } from '@/lib/utils/template-site-paths';
import {
    ArrowRight,
    Phone,
    MapPin,
    Mail,
    Shield,
    Heart,
    Users,
    CheckCircle2,
    ChevronRight,
    PiggyBank,
    MessageSquare,
    Clock,
    Send,
    Menu,
    X,
    Car as CarIcon,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { EnquireSidebar } from '@/components/cars/EnquireSidebar';
import { EmiCalculator } from '@/components/ui/EmiCalculator';
import { Reveal } from '@/components/ui/Reveal';
import { CountUp } from '@/components/ui/CountUp';
import { FadeInImage } from '@/components/ui/FadeInImage';
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

interface FamilyTemplateProps {
    brandName: string;
    dealerName: string;
    dealerId?: string;
    cars: Car[];
    contactInfo: { phone: string; email: string; address: string };
    config?: { heroTitle?: string; heroSubtitle?: string; tagline?: string };
    previewMode?: boolean;
    services?: Service[];
    workingHours?: string | null;
    logoUrl?: string;
    heroImageUrl?: string;
    sellsNewCars?: boolean;
    sellsUsedCars?: boolean;
    branches?: Array<{ city: string; address: string; phone?: string }>;
    serviceCenters?: Array<{ id: string; name: string; address?: string; city?: string; phone?: string }>;
    outlets?: Array<{ brandName: string; outletName?: string | null; phone?: string | null; fullAddress?: string | null; city?: string | null; googleMapsUrl?: string | null; branches?: Array<{ city: string; address: string; phone?: string; whatsapp?: string }> | null }>;
    isVerified?: boolean;
    vehicleType?: '2w' | '3w' | '4w';
    socialLinks?: { facebook: string | null; instagram: string | null; twitter?: string | null; youtube: string | null; linkedin?: string | null };
    sellVehicleHref?: string;
    dealerOffers?: Array<{ id: string; title: string; description: string | null; tag: string | null; valid_until: string | null; image_url: string | null; promotion_type: string | null; outlet_name: string | null }>;
}

export function FamilyTemplate({
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
    outlets,
    isVerified = false,
    vehicleType,
    socialLinks,
    sellVehicleHref,
    dealerOffers,
}: FamilyTemplateProps) {
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
    const [enquireSidebarOpen, setEnquireSidebarOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [navEMIOpen, setNavEMIOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<{
        make?: string[]; bodyType?: string[]; fuelType?: string[];
        transmission?: string[]; year?: string[]; seating?: string[];
        priceRange?: { min: number; max: number };
    } | null>(null);
    const vehicleEmptyMessage = `No ${vl.vehicleSingular}s found matching your criteria.`;

    // Lead form state
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [formErrors, setFormErrors] = useState<LeadFormErrors>({});
    const [consent, setConsent] = useState(false);

    const config = generateTemplateConfig(brandName, 'family');
    const { brandColors } = config;
    const brandAccent = getReadableAccent(brandColors.primary);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const featuredCars = cars;

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

    const heroTitle = customConfig?.heroTitle || `Your Family's ${vl.perfectVehicle} Awaits`;
    const heroSubtitle = customConfig?.heroSubtitle || 'Safe, reliable, and affordable vehicles';
    const tagline = customConfig?.tagline || 'Trusted by Families';

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

    // Real dealer data only — no fabricated "happy families" / ratings.
    const uniqueBrandCount = new Set(cars.map(c => c.make)).size;
    const heroStats = [
        cars.length > 0 && { icon: CheckCircle2, value: `${cars.length}`, label: cars.length === 1 ? 'Vehicle' : 'Vehicles' },
        uniqueBrandCount > 0 && { icon: Shield, value: `${uniqueBrandCount}`, label: uniqueBrandCount === 1 ? 'Brand' : 'Brands' },
        serviceList.length > 0 && { icon: Users, value: `${serviceList.length}`, label: serviceList.length === 1 ? 'Service' : 'Services' },
    ].filter(Boolean) as { icon: typeof Users; value: string; label: string }[];

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            {/* Skip to main content — first focusable element for keyboard/AT users */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-gray-900 focus:shadow-lg focus:outline focus:outline-2 focus:outline-gray-900"
            >
                Skip to main content
            </a>
            <nav className={`fixed ${previewMode ? 'top-12' : 'top-0'} left-0 right-0 z-50 transition-all ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95'}`}>
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 shrink-0 items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
                            <div className="relative w-10 h-10">
                                {logoUrl ? (
                                    <Image
                                        src={logoUrl}
                                        alt={dealerName}
                                        fill
                                        className="object-contain"
                                        sizes="40px"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                    />
                                ) : (
                                    <span className="flex h-full w-full items-center justify-center rounded-lg bg-gray-900 text-sm font-bold text-white">
                                        {dealerName.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <span className="max-w-[180px] truncate text-lg font-semibold leading-tight text-gray-900 xl:max-w-[220px] xl:text-xl 2xl:max-w-[280px]">{dealerName}</span>
                        </div>
                        <div className="hidden xl:flex flex-1 items-center justify-center gap-3 px-3 2xl:gap-5">
                            <button onClick={() => setActiveTab('home')} className="whitespace-nowrap text-sm font-medium hover:opacity-70" style={activeTab === 'home' ? { color: brandAccent } : {}}>Home</button>
                            {showInventoryTab && (
                                <button onClick={() => setActiveTab('inventory')} className="whitespace-nowrap text-sm font-medium hover:opacity-70" style={activeTab === 'inventory' ? { color: brandAccent } : {}}>Inventory</button>
                            )}
                            <button onClick={() => navigateTo('contact')} className="whitespace-nowrap text-sm font-medium hover:opacity-70">Contact</button>
                            <button onClick={() => setNavEMIOpen(true)} className="whitespace-nowrap text-sm font-medium hover:opacity-70">EMI Calc</button>
                            <button onClick={() => navigateTo('exchange-section')} className="whitespace-nowrap text-sm font-medium hover:opacity-70">Exchange</button>
                            <button onClick={() => navigateTo('finance-section')} className="whitespace-nowrap text-sm font-medium hover:opacity-70">Finance</button>
                            <button onClick={() => navigateTo('service-section')} className="whitespace-nowrap text-sm font-medium hover:opacity-70">Service</button>
                            <button onClick={() => navigateTo('trust-section')} className="whitespace-nowrap text-sm font-medium hover:opacity-70">Trust Us</button>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <WishlistDrawer cars={cars} dealerId={dealerId} brandColor={brandColors.primary} />
                            {sellVehicleHref && (
                                <Button
                                    className="hidden rounded-full bg-white px-4 lg:flex"
                                    variant="outline"
                                    style={{ borderColor: brandColors.primary, color: brandAccent }}
                                    asChild
                                >
                                    <a href={sellVehicleHref}>Sell Your Car</a>
                                </Button>
                            )}
                            <Button
                                className="hidden rounded-full bg-white px-4 lg:flex"
                                variant="outline"
                                style={{ borderColor: brandColors.primary, color: brandAccent }}
                                onClick={() => setEnquireSidebarOpen(true)}
                            >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Enquire Now
                            </Button>
                            <Button className="hidden rounded-full px-4 sm:inline-flex lg:px-5" style={{ backgroundColor: brandColors.primary, color: getContrastText(brandColors.primary) }} asChild>
                                <a href={`tel:${contactInfo.phone}`}>
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call Us
                                </a>
                            </Button>
                            <span className="hidden sm:inline-flex">
                                <WhatsAppButton phone={contactInfo.phone} variant="nav" />
                            </span>
                            <button
                                className="xl:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
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
                        <div className="xl:hidden border-t border-gray-100 bg-white shadow-lg animate-fade-in-down">
                            <div className="px-4 py-3 space-y-1">
                                <button
                                    onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                                    className="block w-full text-left px-3 py-2.5 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                                >
                                    Home
                                </button>
                                {showInventoryTab && (
                                    <button
                                        onClick={() => { setActiveTab('inventory'); setMobileMenuOpen(false); }}
                                        className="block w-full text-left px-3 py-2.5 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                                    >
                                        Inventory
                                    </button>
                                )}
                                <button
                                    onClick={() => mobileNavigateTo('contact')}
                                    className="block w-full text-left px-3 py-2.5 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                                >
                                    Contact
                                </button>
                                <button
                                    onClick={() => { setNavEMIOpen(true); setMobileMenuOpen(false); }}
                                    className="block w-full text-left px-3 py-2.5 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                                >
                                    EMI Calc
                                </button>
                                <button onClick={() => mobileNavigateTo('exchange-section')} className="block w-full text-left px-3 py-2.5 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors">Exchange</button>
                                <button onClick={() => mobileNavigateTo('finance-section')} className="block w-full text-left px-3 py-2.5 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors">Finance</button>
                                <button onClick={() => mobileNavigateTo('service-section')} className="block w-full text-left px-3 py-2.5 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors">Service</button>
                                <button onClick={() => mobileNavigateTo('trust-section')} className="block w-full text-left px-3 py-2.5 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors">Trust Us</button>
                                {sellVehicleHref && (
                                    <a href={sellVehicleHref} className="block w-full px-3 py-2.5 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                                        Sell Your Car
                                    </a>
                                )}
                                <div className="pt-2 border-t border-gray-100">
                                    <Button
                                        className="w-full rounded-full"
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

            {activeTab === 'home' && (
                <div id="main-content" tabIndex={-1} className="animate-fade-in">
                    {/* Hero */}
                    <section className="relative pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <div className="flex flex-wrap items-center gap-3 animate-fade-in-up animate-delay-100">
                                        <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: brandColors.primary, color: getContrastText(brandColors.primary) }}>
                                            {tagline}
                                        </div>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold text-gray-700" style={{ borderColor: `${brandColors.primary}40`, backgroundColor: `${brandColors.primary}08` }}>
                                            {dealerName}
                                        </div>
                                        {isVerified && <VerifiedBadge variant="hero" />}
                                    </div>
                                    <h1 className="text-5xl md:text-6xl font-bold leading-tight animate-fade-in-up animate-delay-100">{heroTitle}</h1>
                                    <p className="text-xl text-gray-600 animate-fade-in-up animate-delay-200">{heroSubtitle}</p>
                                    <div className="flex flex-wrap gap-4 animate-fade-in-up animate-delay-300">
                                        {showInventoryTab && (
                                            <Button size="lg" className="rounded-full hover-lift" style={{ backgroundColor: brandColors.primary, color: getContrastText(brandColors.primary) }} onClick={() => setActiveTab('inventory')}>
                                                {vl.browseCTA}
                                                <ArrowRight className="ml-2 w-5 h-5" />
                                            </Button>
                                        )}
                                        <Button size="lg" variant="outline" className="rounded-full bg-white hover-lift" style={{ borderColor: brandColors.primary, color: brandAccent }} asChild>
                                            <a href="#contact">Talk to Our Team</a>
                                        </Button>
                                    </div>
                                </div>
                                <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
                                    {(() => {
                                        const heroSrc = heroImageUrl;
                                        return heroSrc
                                            ? <FadeInImage src={heroSrc} alt={`${brandName} Family`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
                                            : <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${brandColors.primary}33, ${brandColors.primary}11)` }} />;
                                    })()}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats — real dealer data only */}
                    {heroStats.length > 0 && (
                        <section className="py-16 border-y border-gray-200">
                            <div className="max-w-7xl mx-auto px-4">
                                <Reveal className={`grid gap-6 sm:gap-8 ${heroStats.length === 1 ? 'grid-cols-1' : heroStats.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
                                    {heroStats.map((stat, i) => (
                                        <div key={i} className="group text-center">
                                            <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: `${brandColors.primary}20` }}>
                                                <stat.icon className="w-6 h-6" style={{ color: brandAccent }} />
                                            </div>
                                            <p className="text-3xl font-bold"><CountUp value={stat.value} /></p>
                                            <p className="text-sm text-gray-600">{stat.label}</p>
                                        </div>
                                    ))}
                                </Reveal>
                            </div>
                        </section>
                    )}

                    {/* Services — family-friendly cards */}
                    {serviceList.length > 0 && (
                        <section className="py-16 bg-gray-50">
                            <div className="max-w-7xl mx-auto px-4">
                                <Reveal className="text-center mb-10">
                                    <span className="font-semibold uppercase tracking-wider text-sm" style={{ color: brandAccent }}>
                                        What We Offer
                                    </span>
                                    <h2 className="text-3xl font-bold mt-2">Services for Your Family</h2>
                                </Reveal>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {serviceList.map((svc, i) => {
                                        const meta = getTemplateServiceMeta(svc as string, vehicleType);
                                        const Icon = meta.icon;
                                        return (
                                            <Reveal
                                                key={svc as string}
                                                direction="up"
                                                delay={(i % 6) * 70}
                                                className="group flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm hover-lift border"
                                                style={{ borderColor: `${brandColors.primary}20` }}
                                            >
                                                <div
                                                    className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                                    style={{ backgroundColor: `${brandColors.primary}20` }}
                                                >
                                                    <Icon className="w-6 h-6" style={{ color: brandAccent }} aria-hidden="true" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{meta.label}</p>
                                                    <p className="text-sm text-gray-600 mt-0.5">{meta.desc}</p>
                                                </div>
                                            </Reveal>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Featured Cars */}
                    <section className="py-20 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4">
                            <Reveal className="text-center mb-12">
                                <span className="font-semibold uppercase tracking-wider text-sm" style={{ color: brandAccent }}>
                                    Our Collection
                                </span>
                                <h2 className="text-4xl font-bold mt-2">Family-Friendly Vehicles</h2>
                            </Reveal>
                            <CarGrid cars={featuredCars} brandColor={brandColors.primary} light summaryOnly detailBasePath={detailBasePath} dealerPhone={contactInfo.phone} dealerId={dealerId} showWishlistAction emptyMessage={vehicleEmptyMessage} />
                            {showInventoryTab && (
                                <div className="text-center mt-8">
                                    <Button variant="outline" size="lg" className="rounded-full bg-white text-gray-700 border-gray-300 hover:bg-gray-100" onClick={() => setActiveTab('inventory')}>
                                        View All Cars
                                        <ChevronRight className="ml-1 w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* EMI Calculator */}
                    <section className="py-16 bg-white">
                        <div className="max-w-4xl mx-auto px-4">
                            <Reveal className="text-center mb-8">
                                <span className="font-semibold uppercase tracking-wider text-sm" style={{ color: brandAccent }}>
                                    Finance Tool
                                </span>
                                <h2 className="text-3xl font-bold mt-2">EMI Calculator</h2>
                                <p className="text-gray-600 mt-2">Plan your budget with real inputs — price, down payment, tenure &amp; rate</p>
                            </Reveal>
                            <EmiCalculator brandColor={brandColors.primary} theme="light" />
                        </div>
                    </section>

                    {/* Why Families Choose Us */}
                    <section className="py-20">
                        <div className="max-w-7xl mx-auto px-4">
                            <Reveal as="h2" className="text-4xl font-bold text-center mb-16">Why Families Choose Us</Reveal>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[
                                    { icon: Shield, title: 'Safety First', desc: 'Every car thoroughly inspected' },
                                    { icon: PiggyBank, title: 'Best Value', desc: 'Transparent, fair pricing' },
                                    { icon: Heart, title: 'Family Service', desc: 'We treat you like family' },
                                    { icon: CheckCircle2, title: 'Easy Finance', desc: 'Flexible payment options' },
                                ].map((f, i) => (
                                    <Reveal key={i} direction="up" delay={(i % 6) * 70} className="group p-6 rounded-2xl bg-gray-50 hover-lift hover-scale">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: `${brandColors.primary}20` }}>
                                            <f.icon className="w-6 h-6" style={{ color: brandAccent }} />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                                        <p className="text-gray-600">{f.desc}</p>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* EV Section */}
                    <EVSection cars={cars} contactInfo={contactInfo} brandColor="#10b981" />

                    {/* Customer Reviews */}
                    <section className="py-16 bg-white">
                        <div className="max-w-7xl mx-auto px-4">
                            <ReviewsSection dealerId={dealerId} brandColor={brandColors.primary} variant="light" />
                        </div>
                    </section>

                    {/* Offers Section */}
                    <OffersSection brandColor={brandColors.primary} dealerName={dealerName} vehicleType={vehicleType} dealerPhone={contactInfo.phone} dealerOffers={dealerOffers} templateStyle="family" />

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

                    {/* Talk to Our Team — Lead Form */}
                    <section id="contact" className="py-20 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="grid lg:grid-cols-2 gap-12 items-start">
                                {/* Info */}
                                <Reveal direction="left">
                                    <span className="font-semibold uppercase tracking-wider text-sm" style={{ color: brandAccent }}>
                                        We&apos;re Here to Help
                                    </span>
                                    <h2 className="text-4xl font-bold mt-2 mb-4">Talk to Our Team</h2>
                                    <p className="text-gray-600 mb-8 text-lg">
                                        Have questions? Our friendly team is ready to help you find the perfect {vl.familyVehicle} for your family.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandColors.primary}20` }}>
                                                <Phone className="w-5 h-5" style={{ color: brandAccent }} />
                                            </div>
                                            <a href={`tel:${contactInfo.phone}`} className="text-gray-700 font-medium hover:underline">{contactInfo.phone}</a>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandColors.primary}20` }}>
                                                <Mail className="w-5 h-5" style={{ color: brandAccent }} />
                                            </div>
                                            <a href={`mailto:${contactInfo.email}`} className="text-gray-700 font-medium hover:underline">{contactInfo.email}</a>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${brandColors.primary}20` }}>
                                                <MapPin className="w-5 h-5" style={{ color: brandAccent }} />
                                            </div>
                                            <span className="text-gray-700 pt-2">{contactInfo.address}</span>
                                        </div>
                                        {workingHours && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandColors.primary}20` }}>
                                                    <Clock className="w-5 h-5" style={{ color: brandAccent }} />
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

                                {/* Form */}
                                <Reveal direction="right" className="bg-white rounded-2xl shadow-xl p-8">
                                    {formStatus === 'sent' ? (
                                        <div className="text-center py-10 animate-fade-in">
                                            <Heart className="w-16 h-16 mx-auto mb-4 animate-bounce-subtle" style={{ color: brandAccent }} />
                                            <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                                            <p className="text-gray-600">Our team will get back to you soon. We can&apos;t wait to help your family find the perfect {vl.familyVehicle}!</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <h3 className="text-xl font-bold mb-6">Send Us a Message</h3>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    aria-invalid={!!formErrors.name}
                                                    className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus-visible:ring-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 ${formErrors.name ? 'border-red-500' : 'border-gray-200'}`}
                                                    style={{ '--tw-ring-color': brandColors.primary } as React.CSSProperties}
                                                    placeholder="Full name"
                                                />
                                                {formErrors.name && <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
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
                                                    placeholder={`Which ${vl.familyVehicle} are you looking for? Any specific requirements?`}
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
                                                        <a href={`${siteBase}/privacy`} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: brandAccent }}>Privacy Policy</a>.
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
                                                className="w-full py-3 rounded-xl font-semibold hover-lift"
                                                style={{ backgroundColor: brandColors.primary, color: getContrastText(brandColors.primary) }}
                                            >
                                                {formStatus === 'sending' ? 'Sending...' : (
                                                    <>
                                                        <Send className="w-4 h-4 mr-2" />
                                                        Send Message
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
                                outlets={outlets}
                                brandColor={brandColors.primary}
                            />
                        </div>
                    </section>
                </div>
            )}

            {/* Inventory Tab */}
            {showInventoryTab && activeTab === 'inventory' && (
                <div id="main-content" tabIndex={-1} className="pt-24 pb-12 bg-gray-50 min-h-screen animate-fade-in">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                            <h1 className="text-4xl font-bold">Inventory</h1>
                            {/* Hybrid inventory tabs */}
                            {isHybrid && (
                                <div className="flex w-full items-center gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 shadow-sm sm:w-fit">
                                    {([
                                        { id: 'all', label: `All (${cars.length})` },
                                        { id: 'new', label: `New (${cars.filter(c => c.condition === 'new').length})` },
                                        { id: 'used', label: `Pre-Owned (${cars.filter(c => c.condition !== 'new').length})` },
                                    ] as const).map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setInventoryTab(t.id)}
                                            className="shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
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
                                <div className="sticky top-24 rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-4 shadow-sm"><CarFilters hideBrand={sellsNewCars} onFilterChange={setActiveFilters} /></div>
                            </div>
                            <div className="flex-1">
                                <CarGrid
                                    cars={isHybrid
                                        ? inventoryTab === 'new'
                                            ? filteredInventoryCars.filter(c => c.condition === 'new')
                                            : inventoryTab === 'used'
                                                ? filteredInventoryCars.filter(c => c.condition !== 'new')
                                                : filteredInventoryCars
                                        : filteredInventoryCars}
                                    brandColor={brandColors.primary}
                                    light
                                    summaryOnly
                                    detailBasePath={detailBasePath}
                                    dealerPhone={contactInfo.phone}
                                    dealerId={dealerId}
                                    showWishlistAction
                                    emptyMessage={vehicleEmptyMessage}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <SellVehicleSection dealerName={dealerName} sellHref={sellVehicleHref} brandColor={brandColors.primary} />

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-4">
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
                        <div className="min-w-0">
                            <span className="block break-words text-2xl font-bold">{dealerName}</span>
                            <span className="text-sm text-gray-600">Trusted by Families</span>
                        </div>
                    </div>

                    <div className={`grid gap-8 ${branches && branches.length > 0 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
                        <div>
                            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
                            <div className="space-y-2 text-gray-600">
                                <div className="flex min-w-0 items-center gap-2">
                                    <Phone className="w-4 h-4 shrink-0" style={{ color: brandAccent }} />
                                    <a className="min-w-0 break-words" href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
                                </div>
                                <div className="flex min-w-0 items-center gap-2">
                                    <Mail className="w-4 h-4 shrink-0" style={{ color: brandAccent }} />
                                    <a className="min-w-0 break-all" href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                                </div>
                                <div className="flex min-w-0 items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-1 shrink-0" style={{ color: brandAccent }} />
                                    <span className="min-w-0 break-words">{contactInfo.address}</span>
                                </div>
                                {workingHours && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" style={{ color: brandAccent }} />
                                        <span>{workingHours}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {branches && branches.length > 0 && (
                            <div>
                                <h4 className="font-bold text-lg mb-4">Our Branches</h4>
                                <div className="space-y-4 text-gray-600">
                                    {branches.map((branch, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <p className="font-semibold text-gray-900 text-sm">{branch.city}</p>
                                            <div className="flex items-start gap-2 text-sm">
                                                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: brandAccent }} />
                                                <span>{branch.address}</span>
                                            </div>
                                            {branch.phone && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: brandAccent }} />
                                                    <a href={`tel:${branch.phone}`}>{branch.phone}</a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div>
                            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
                            <div className="space-y-2 text-gray-600">
                                <button onClick={() => setActiveTab('home')} className="block hover:text-gray-900">Home</button>
                                {showInventoryTab && (
                                    <button onClick={() => setActiveTab('inventory')} className="block hover:text-gray-900">Inventory</button>
                                )}
                                <button onClick={() => navigateTo('contact')} className="block hover:text-gray-900">Contact</button>
                                <button onClick={() => setNavEMIOpen(true)} className="block hover:text-gray-900">EMI Calculator</button>
                                <button onClick={() => navigateTo('exchange-section')} className="block hover:text-gray-900">Exchange</button>
                                <button onClick={() => navigateTo('finance-section')} className="block hover:text-gray-900">Finance</button>
                                <button onClick={() => navigateTo('service-section')} className="block hover:text-gray-900">Service Booking</button>
                                <button onClick={() => navigateTo('trust-section')} className="block hover:text-gray-900">Why Trust Us</button>
                                <div className="border-t border-gray-100 mt-3 pt-3 space-y-2">
                                    <a href={`${siteBase}/about`} className="block hover:text-gray-900">About Us</a>
                                    <a href={`${siteBase}/terms`} className="block hover:text-gray-900">Terms &amp; Conditions</a>
                                    <a href={`${siteBase}/privacy`} className="block hover:text-gray-900">Privacy Policy</a>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-4">{dealerName}</h4>
                            <p className="text-gray-600">Your trusted partner for family-friendly vehicles. We&apos;re here to help you find the perfect {vl.familyVehicle}.</p>
                            {/* Social Media Links */}
                            <SocialLinks
                                className="mt-4"
                                facebook={socialLinks?.facebook}
                                instagram={socialLinks?.instagram}
                                twitter={socialLinks?.twitter}
                                youtube={socialLinks?.youtube}
                                linkedin={socialLinks?.linkedin}
                            />
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
                        <p>© {new Date().getFullYear()} {dealerName}</p>
                    </div>
                </div>
            </footer>

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

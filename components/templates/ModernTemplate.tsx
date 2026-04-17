/**
 * Modern Template - Using Template System with Brand Colors
 * A sleek, professional design that adapts to any automotive brand
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
import { NavEMIModal } from '@/components/ui/NavEMIModal';
import { FinanceSection } from '@/components/templates/sections/FinanceSection';
import { TrustBadgesSection } from '@/components/templates/sections/TrustBadgesSection';
import { ServiceBookingSection } from '@/components/templates/sections/ServiceBookingSection';
import { VideoSection } from '@/components/templates/sections/VideoSection';
import { StickyEnquiryBar } from '@/components/ui/StickyEnquiryBar';
import { DealerChatbot } from '@/components/chatbot/DealerChatbot';
import CompareBar from '@/components/cars/CompareBar';
import { WishlistDrawer } from '@/components/ui/WishlistDrawer';
import { EVSection } from '@/components/ui/EVSection';
import { generateTemplateConfig } from '@/lib/templates';
import { getBrandHeroImage } from '@/lib/utils/brand-hero';
import { getContrastText } from '@/lib/utils/color-contrast';
import { getScrapedImageUrls, brandNameToId } from '@/lib/utils/brand-model-images';
import {
    ArrowRight,
    Phone,
    MapPin,
    Mail,
    Clock,
    Shield,
    Star,
    CheckCircle2,
    ChevronRight,
    Award,
    Users,
    Car as CarIcon,
    MessageSquare,
    Menu,
    X,
    Send,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { EnquireSidebar } from '@/components/cars/EnquireSidebar';
import { EmiCalculator } from '@/components/ui/EmiCalculator';
import type { Service } from '@/lib/types';
import { getVehicleLabels } from '@/lib/utils/vehicle-labels';

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
    isVerified?: boolean;
    vehicleType?: '2w' | '3w' | '4w';
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
    isVerified = false,
    vehicleType,
}: ModernTemplateProps) {
    const vl = getVehicleLabels(vehicleType);
    const pathname = usePathname();
    const siteBase = useMemo(() => {
        const typeSuffix = vehicleType === '2w' ? '/two-wheelers' : vehicleType === '3w' ? '/three-wheelers' : '';
        if (pathname.startsWith('/sites/')) {
            const slugPart = pathname.split('/')[2] ?? '';
            return `/sites/${slugPart}${typeSuffix}`;
        }
        return typeSuffix;
    }, [pathname, vehicleType]);
    const SERVICE_LABELS: Record<string, { label: string; icon: string }> = {
        new_car_sales: { label: vl.newVehicle, icon: '🚗' },
        used_car_sales: { label: vl.usedVehicle, icon: '🔄' },
        financing: { label: 'Finance & EMI', icon: '💰' },
        service_maintenance: { label: 'Service & Repairs', icon: '🔧' },
        parts_accessories: { label: 'Parts & Accessories', icon: '⚙️' },
        test_drive: { label: vl.testDrive, icon: '🏎️' },
        insurance: { label: 'Insurance', icon: '🛡️' },
        extended_warranty: { label: 'Extended Warranty', icon: '✅' },
        roadside_assistance: { label: 'Roadside Assist', icon: '🆘' },
        car_exchange: { label: vl.exchange, icon: '🔃' },
    };
    const isHybrid = sellsNewCars && sellsUsedCars;
    const [activeTab, setActiveTab] = useState<'inventory' | 'home'>('home');
    const [inventoryTab, setInventoryTab] = useState<'all' | 'new' | 'used'>('all');
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeCarIndex, setActiveCarIndex] = useState(0);
    const [enquireSidebarOpen, setEnquireSidebarOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [navEMIOpen, setNavEMIOpen] = useState(false);

    // Lead form state
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

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

    // Rotate featured car
    useEffect(() => {
        if (featuredCars.length === 0) return;
        const interval = setInterval(() => {
            setActiveCarIndex((prev) => (prev + 1) % Math.min(featuredCars.length, 3));
        }, 5000);
        return () => clearInterval(interval);
    }, [featuredCars.length]);

    const heroTitle = customConfig?.heroTitle || 'Find Your Perfect Drive';
    const heroSubtitle = customConfig?.heroSubtitle || 'Explore our premium collection of certified vehicles';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) return;
        setFormStatus('sending');
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dealer_id: dealerId,
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
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

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Navigation */}
            <nav
                className={`fixed ${previewMode ? 'top-12' : 'top-0'} left-0 right-0 z-50 transition-all duration-300 bg-white ${isScrolled ? 'shadow-lg' : 'shadow-sm border-b border-gray-100'}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('home')}>
                            <div className="relative w-10 h-10 mr-3">
                                <Image
                                    src={logoUrl || `/assets/logos/${brandName.toLowerCase().replace(/\s+/g, '-')}.png`}
                                    alt={logoUrl ? dealerName : brandName}
                                    fill
                                    className="object-contain transition-all duration-300"
                                    sizes="40px"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                />
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                                {dealerName}
                            </span>
                        </div>

                        {/* Nav Links */}
                        <div className="hidden md:flex items-center gap-6">
                            <button
                                onClick={() => setActiveTab('home')}
                                className="font-medium transition-colors text-gray-600 hover:text-gray-900"
                                style={activeTab === 'home' ? { color: brandColors.primary } : {}}
                            >
                                Home
                            </button>
                            {showInventoryTab && (
                                <button
                                    onClick={() => setActiveTab('inventory')}
                                    className="font-medium transition-colors text-gray-600 hover:text-gray-900"
                                    style={activeTab === 'inventory' ? { color: brandColors.primary } : {}}
                                >
                                    Inventory
                                </button>
                            )}
                            <a href="#contact" className="font-medium transition-colors text-gray-600 hover:text-gray-900">
                                Contact
                            </a>
                            <button
                                onClick={() => setNavEMIOpen(true)}
                                className="font-medium transition-colors text-sm text-gray-600 hover:text-gray-900"
                            >
                                EMI Calc
                            </button>
                            <a href="#exchange-section" className="font-medium transition-colors text-sm text-gray-600 hover:text-gray-900">Exchange</a>
                            <a href="#finance-section" className="font-medium transition-colors text-sm text-gray-600 hover:text-gray-900">Finance</a>
                            <a href="#service-section" className="font-medium transition-colors text-sm text-gray-600 hover:text-gray-900">Service</a>
                            <a href="#trust-section" className="font-medium transition-colors text-sm text-gray-600 hover:text-gray-900">Trust Us</a>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex items-center gap-2">
                            <WishlistDrawer cars={cars} dealerId={dealerId} brandColor={brandColors.primary} />
                            <Button
                                variant="outline"
                                className="hidden sm:flex bg-transparent text-gray-700 border-gray-300 hover:bg-gray-100"
                                onClick={() => setEnquireSidebarOpen(true)}
                            >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Enquire Now
                            </Button>
                            <Button
                                className="text-white shadow-lg"
                                style={{ backgroundColor: brandColors.primary }}
                                asChild
                            >
                                <a href={`tel:${contactInfo.phone}`}>
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call Now
                                </a>
                            </Button>
                            <WhatsAppButton phone={contactInfo.phone} variant="nav" />
                            <button
                                className="md:hidden p-2 rounded-lg transition-colors text-gray-900"
                                onClick={() => setMobileMenuOpen(o => !o)}
                                aria-label="Toggle navigation menu"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-gray-100 bg-white">
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
                                <a
                                    href="#contact"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2.5 rounded-lg font-medium transition-colors text-gray-900 hover:bg-gray-100"
                                >
                                    Contact
                                </a>
                                <button
                                    onClick={() => { setNavEMIOpen(true); setMobileMenuOpen(false); }}
                                    className="block w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors text-gray-900 hover:bg-gray-100"
                                >
                                    EMI Calc
                                </button>
                                <a href="#exchange-section" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg font-medium transition-colors text-gray-900 hover:bg-gray-100">Exchange</a>
                                <a href="#finance-section" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg font-medium transition-colors text-gray-900 hover:bg-gray-100">Finance</a>
                                <a href="#service-section" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg font-medium transition-colors text-gray-900 hover:bg-gray-100">Service</a>
                                <a href="#trust-section" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg font-medium transition-colors text-gray-900 hover:bg-gray-100">Trust Us</a>
                                <div className="pt-2 border-t border-gray-200">
                                    <Button
                                        className="w-full text-white"
                                        style={{ backgroundColor: brandColors.primary }}
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
                <>
                    {/* Hero Section */}
                    <section className="relative min-h-[85vh] flex items-center bg-white overflow-hidden">
                        <div className="absolute inset-0">
                            {(() => {
                                const heroSrc = heroImageUrl || getBrandHeroImage(brandName, vehicleType);
                                return heroSrc
                                    ? <Image src={heroSrc} alt={`${brandName} Hero`} fill className="object-cover opacity-20" priority />
                                    : null;
                            })()}
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
                        </div>

                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                {/* Text */}
                                <div className="text-gray-900 space-y-6">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50">
                                            <span className="text-sm font-medium text-gray-600">{dealerName}</span>
                                        </div>
                                        {isVerified && <VerifiedBadge variant="hero" />}
                                    </div>
                                    <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
                                        {heroTitle}
                                    </h1>
                                    <p className="text-xl text-gray-500">{heroSubtitle}</p>
                                    <div className="flex flex-wrap gap-4">
                                        <Button
                                            size="lg"
                                            className="text-white"
                                            style={{ backgroundColor: brandColors.primary }}
                                            onClick={() => setActiveTab('inventory')}
                                        >
                                            View Inventory
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
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
                                    const heroCar = featuredCars[activeCarIndex];
                                    const cat = heroCar.vehicleCategory as '2w' | '3w' | undefined;
                                    const scrapedSrc = (cat === '2w' || cat === '3w')
                                        ? getScrapedImageUrls(cat, brandNameToId(heroCar.make, cat), heroCar.model)[0]
                                        : '';
                                    const heroSrc = heroCar.images.hero || scrapedSrc || null;
                                    const heroPrice = heroCar.pricing.exShowroom.min != null
                                        ? heroCar.pricing.exShowroom.min.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
                                        : (heroCar.price || 'Price on request');
                                    return (
                                        <div className="hidden lg:block">
                                            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                                                <div className="aspect-video relative bg-gray-50">
                                                    {heroSrc ? (
                                                        <Image
                                                            src={heroSrc}
                                                            alt={heroCar.model}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-5xl">
                                                            {cat === '2w' ? '🏍️' : cat === '3w' ? '🛺' : '🚗'}
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
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="relative -mt-16 z-20 max-w-6xl mx-auto px-4">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { value: '500+', label: 'Vehicles', icon: CarIcon },
                                { value: '10k+', label: 'Customers', icon: Users },
                                { value: '15+', label: 'Years', icon: Award },
                                { value: '4.9', label: 'Rating', icon: Star },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div
                                        className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: `${brandColors.primary}20` }}
                                    >
                                        <stat.icon className="w-6 h-6" style={{ color: brandColors.primary }} />
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Services Section */}
                    {serviceList.length > 0 && (
                        <section className="py-16 bg-white">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="text-center mb-10">
                                    <span
                                        className="font-semibold text-sm uppercase tracking-wider"
                                        style={{ color: brandColors.primary }}
                                    >
                                        What We Offer
                                    </span>
                                    <h2 className="text-3xl font-bold text-gray-900 mt-2">Our Services</h2>
                                </div>
                                <div className="flex flex-wrap justify-center gap-4">
                                    {serviceList.map((svc) => {
                                        const meta = SERVICE_LABELS[svc as string] ?? { label: svc as string, icon: '🚘' };
                                        return (
                                            <div
                                                key={svc as string}
                                                className="flex items-center gap-3 px-5 py-3 rounded-xl border bg-gray-50 hover:shadow-md transition-shadow"
                                                style={{ borderColor: `${brandColors.primary}30` }}
                                            >
                                                <span className="text-2xl">{meta.icon}</span>
                                                <span className="font-semibold text-gray-800">{meta.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Featured Cars */}
                    <section className="py-20 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-end mb-12">
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
                            </div>
                            <CarGrid cars={featuredCars} brandColor={brandColors.primary} light dealerPhone={contactInfo.phone} dealerId={dealerId} />
                        </div>
                    </section>

                    {/* EV Section */}
                    <EVSection cars={cars} contactInfo={contactInfo} brandColor="#10b981" />

                    {/* Why Choose Us */}
                    <section className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-bold text-gray-900">Why Choose Us</h2>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[
                                    { icon: Shield, title: 'Certified Quality', desc: '150-point inspection' },
                                    { icon: Award, title: 'Best Prices', desc: 'Transparent pricing' },
                                    { icon: Clock, title: 'Fast Delivery', desc: '24-48 hours' },
                                    { icon: CheckCircle2, title: 'Easy Financing', desc: 'Instant approval' },
                                ].map((feature, i) => (
                                    <div key={i} className="p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                            style={{ backgroundColor: `${brandColors.primary}20` }}
                                        >
                                            <feature.icon className="w-6 h-6" style={{ color: brandColors.primary }} />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* EMI Calculator */}
                    <section className="py-20 bg-white">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-10">
                                <span
                                    className="font-semibold text-sm uppercase tracking-wider"
                                    style={{ color: brandColors.primary }}
                                >
                                    Finance Tool
                                </span>
                                <h2 className="text-4xl font-bold text-gray-900 mt-2">EMI Calculator</h2>
                                <p className="text-gray-500 mt-2">Enter your details to estimate your monthly payment</p>
                            </div>
                            <EmiCalculator brandColor={brandColors.primary} theme="light" />
                        </div>
                    </section>

                    {/* Customer Reviews */}
                    <section className="py-16 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <ReviewsSection dealerId={dealerId} brandColor={brandColors.primary} variant="light" />
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
                        <ServiceBookingSection brandColor={brandColors.primary} dealerId={dealerId} dealerName={dealerName} vehicleType={vehicleType} />
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
                                <div>
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
                                </div>

                                {/* Right — form */}
                                <div className="bg-white rounded-2xl shadow-xl p-8">
                                    {formStatus === 'sent' ? (
                                        <div className="text-center py-10">
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
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 text-gray-900"
                                                    style={{ '--tw-ring-color': brandColors.primary } as React.CSSProperties}
                                                    placeholder="Your full name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 text-gray-900"
                                                    placeholder="Your phone number"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 text-gray-900"
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                                <textarea
                                                    rows={4}
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 text-gray-900 resize-none"
                                                    placeholder="What vehicle are you interested in?"
                                                />
                                            </div>
                                            {formStatus === 'error' && (
                                                <p className="text-red-600 text-sm">Something went wrong. Please try again or call us directly.</p>
                                            )}
                                            <Button
                                                type="submit"
                                                disabled={formStatus === 'sending'}
                                                className="w-full text-white py-3 rounded-xl font-semibold"
                                                style={{ backgroundColor: brandColors.primary }}
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
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* Inventory Tab */}
            {showInventoryTab && activeTab === 'inventory' && (
                <div className="pt-20 pb-12 bg-gray-50 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900">Our Inventory</h1>
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
                                    <CarFilters hideBrand={sellsNewCars} />
                                </div>
                            </div>
                            <div className="flex-1">
                                <CarGrid
                                    cars={isHybrid
                                        ? inventoryTab === 'new' ? cars.filter(c => c.condition === 'new')
                                            : inventoryTab === 'used' ? cars.filter(c => c.condition !== 'new')
                                                : cars : cars}
                                    brandColor={brandColors.primary}
                                    light
                                    dealerPhone={contactInfo.phone}
                                    dealerId={dealerId}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-gray-50 text-gray-900 py-12 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Brand Logo */}
                    <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
                        <div className="relative w-12 h-12 mr-3">
                            <Image
                                src={logoUrl || `/assets/logos/${brandName.toLowerCase().replace(/\s+/g, '-')}.png`}
                                alt={logoUrl ? dealerName : brandName}
                                fill
                                className="object-contain"
                                sizes="48px"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                        </div>
                        <div>
                            <span className="text-2xl font-bold block text-gray-900">{dealerName}</span>
                            <span className="text-sm text-gray-500">{vl.familyVehicle === 'bike' ? 'Your trusted two-wheeler partner' : vl.familyVehicle === 'auto' ? 'Your trusted three-wheeler partner' : 'Your trusted automotive partner'}</span>
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
                                            <div className="flex items-start gap-2 text-sm text-gray-500">
                                                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: brandColors.primary }} />
                                                <span>{branch.address}</span>
                                            </div>
                                            {branch.phone && (
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
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
                                <button onClick={() => setActiveTab('home')} className="block text-gray-500 hover:text-gray-900">
                                    Home
                                </button>
                                {showInventoryTab && (
                                    <button onClick={() => setActiveTab('inventory')} className="block text-gray-500 hover:text-gray-900">
                                        Inventory
                                    </button>
                                )}
                                <a href="#contact" className="block text-gray-500 hover:text-gray-900">Contact</a>
                                <button onClick={() => setNavEMIOpen(true)} className="block text-gray-500 hover:text-gray-900">EMI Calculator</button>
                                <a href="#exchange-section" className="block text-gray-500 hover:text-gray-900">Exchange</a>
                                <a href="#finance-section" className="block text-gray-500 hover:text-gray-900">Finance</a>
                                <a href="#service-section" className="block text-gray-500 hover:text-gray-900">Service Booking</a>
                                <a href="#trust-section" className="block text-gray-500 hover:text-gray-900">Why Trust Us</a>
                                <div className="border-t border-gray-100 mt-3 pt-3 space-y-2">
                                    <a href={`${siteBase}/about`} className="block text-gray-500 hover:text-gray-900">About Us</a>
                                    <a href={`${siteBase}/terms`} className="block text-gray-500 hover:text-gray-900">Terms &amp; Conditions</a>
                                    <a href={`${siteBase}/privacy`} className="block text-gray-500 hover:text-gray-900">Privacy Policy</a>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">{dealerName}</h4>
                            <p className="text-gray-500 mb-4">
                                Your trusted partner for quality vehicles. Committed to transparency and customer
                                satisfaction.
                            </p>
                            {/* Social Media Links */}
                            <div className="flex gap-3">
                                <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors" title="Facebook">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                                </a>
                                <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-pink-100 text-gray-500 hover:text-pink-600 transition-colors" title="Instagram">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path fill="white" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                                </a>
                                <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors" title="YouTube">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
                                </a>
                                <a href="#" aria-label="WhatsApp" className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-green-100 text-gray-500 hover:text-green-600 transition-colors" title="WhatsApp">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-400">
                        <p>© {new Date().getFullYear()} {dealerName}. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Compare Bar */}
            <NavEMIModal open={navEMIOpen} onOpenChange={setNavEMIOpen} brandColor={brandColors.primary} cars={cars} />
            <CompareBar brandColor={brandColors.primary} />

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

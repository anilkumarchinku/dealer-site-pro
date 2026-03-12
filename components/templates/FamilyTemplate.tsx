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
import { StickyEnquiryBar } from '@/components/ui/StickyEnquiryBar';
import { DealerChatbot } from '@/components/chatbot/DealerChatbot';
import { NavEMIModal } from '@/components/ui/NavEMIModal';
import { FinanceSection } from '@/components/templates/sections/FinanceSection';
import { TrustBadgesSection } from '@/components/templates/sections/TrustBadgesSection';
import { ServiceBookingSection } from '@/components/templates/sections/ServiceBookingSection';
import { VideoSection } from '@/components/templates/sections/VideoSection';
import CompareBar from '@/components/cars/CompareBar';
import { WishlistDrawer } from '@/components/ui/WishlistDrawer';
import { EVSection } from '@/components/ui/EVSection';
import { generateTemplateConfig } from '@/lib/templates';
import { getBrandHeroImage } from '@/lib/utils/brand-hero';
import { getContrastText } from '@/lib/utils/color-contrast';
import {
    ArrowRight,
    Phone,
    MapPin,
    Mail,
    Shield,
    Heart,
    Star,
    Users,
    CheckCircle2,
    ChevronRight,
    PiggyBank,
    MessageSquare,
    Clock,
    Send,
    Menu,
    X,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { EnquireSidebar } from '@/components/cars/EnquireSidebar';
import { EmiCalculator } from '@/components/ui/EmiCalculator';
import type { Service } from '@/lib/types';
import { getVehicleLabels } from '@/lib/utils/vehicle-labels';

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
    isVerified?: boolean;
    vehicleType?: '2w' | '3w' | '4w';
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
    isVerified = false,
    vehicleType,
}: FamilyTemplateProps) {
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
    const SERVICE_LABELS: Record<string, { label: string; icon: string; desc: string }> = {
        new_car_sales: { label: vl.newVehicle, icon: '🚗', desc: vl.newVehicleDesc },
        used_car_sales: { label: vl.usedVehicle, icon: '🔄', desc: 'Certified pre-owned at great prices' },
        financing: { label: 'Finance & EMI', icon: '💰', desc: 'Easy monthly plans for every budget' },
        service_maintenance: { label: 'Service & Repairs', icon: '🔧', desc: 'Expert care for your vehicle' },
        parts_accessories: { label: 'Parts & Accessories', icon: '⚙️', desc: 'Genuine parts for all makes' },
        test_drive: { label: vl.testDrive, icon: '🏎️', desc: vl.testDriveDesc },
        insurance: { label: 'Insurance', icon: '🛡️', desc: 'Complete vehicle protection plans' },
        extended_warranty: { label: 'Extended Warranty', icon: '✅', desc: 'Peace of mind, guaranteed' },
        roadside_assistance: { label: 'Roadside Assist', icon: '🆘', desc: '24/7 support wherever you are' },
        car_exchange: { label: vl.exchange, icon: '🔃', desc: vl.exchangeDesc },
    };
    const isHybrid = sellsNewCars && sellsUsedCars;
    const [activeTab, setActiveTab] = useState<'inventory' | 'home'>('home');
    const [inventoryTab, setInventoryTab] = useState<'all' | 'new' | 'used'>('all');
    const [isScrolled, setIsScrolled] = useState(false);
    const [enquireSidebarOpen, setEnquireSidebarOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [navEMIOpen, setNavEMIOpen] = useState(false);

    // Lead form state
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const config = generateTemplateConfig(brandName, 'family');
    const { brandColors } = config;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const featuredCars = cars;
    const heroTitle = customConfig?.heroTitle || `Your Family's ${vl.perfectVehicle} Awaits`;
    const heroSubtitle = customConfig?.heroSubtitle || 'Safe, reliable, and affordable vehicles';
    const tagline = customConfig?.tagline || 'Trusted by Families';

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
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <nav className={`fixed ${previewMode ? 'top-12' : 'top-0'} left-0 right-0 z-50 transition-all ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95'}`}>
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
                            <div className="relative w-10 h-10">
                                <Image
                                    src={logoUrl || `/assets/logos/${brandName.toLowerCase().replace(/\s+/g, '-')}.png`}
                                    alt={logoUrl ? dealerName : brandName}
                                    fill
                                    className="object-contain"
                                    sizes="40px"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                />
                            </div>
                            <span className="text-xl font-semibold">{dealerName}</span>
                        </div>
                        <div className="hidden md:flex items-center gap-6">
                            <button onClick={() => setActiveTab('home')} className="font-medium hover:opacity-70" style={activeTab === 'home' ? { color: brandColors.primary } : {}}>Home</button>
                            {showInventoryTab && (
                                <button onClick={() => setActiveTab('inventory')} className="font-medium hover:opacity-70" style={activeTab === 'inventory' ? { color: brandColors.primary } : {}}>Inventory</button>
                            )}
                            <a href="#contact" className="font-medium hover:opacity-70">Contact</a>
                            <button onClick={() => setNavEMIOpen(true)} className="font-medium hover:opacity-70">EMI Calc</button>
                            <a href="#exchange-section" className="font-medium hover:opacity-70">Exchange</a>
                            <a href="#finance-section" className="font-medium hover:opacity-70">Finance</a>
                            <a href="#service-section" className="font-medium hover:opacity-70">Service</a>
                            <a href="#trust-section" className="font-medium hover:opacity-70">Trust Us</a>
                        </div>
                        <div className="flex items-center gap-2">
                            <WishlistDrawer cars={cars} dealerId={dealerId} brandColor={brandColors.primary} />
                            <Button
                                className="rounded-full hidden sm:flex bg-white"
                                variant="outline"
                                style={{ borderColor: brandColors.primary, color: brandColors.primary }}
                                onClick={() => setEnquireSidebarOpen(true)}
                            >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Enquire Now
                            </Button>
                            <Button className="rounded-full text-white" style={{ backgroundColor: brandColors.primary }} asChild>
                                <a href={`tel:${contactInfo.phone}`}>
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call Us
                                </a>
                            </Button>
                            <WhatsAppButton phone={contactInfo.phone} variant="nav" />
                            <button
                                className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                onClick={() => setMobileMenuOpen(o => !o)}
                                aria-label="Toggle navigation menu"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
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
                                <a
                                    href="#contact"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2.5 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                                >
                                    Contact
                                </a>
                                <button
                                    onClick={() => { setNavEMIOpen(true); setMobileMenuOpen(false); }}
                                    className="block w-full text-left px-3 py-2.5 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                                >
                                    EMI Calc
                                </button>
                                <a href="#exchange-section" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors">Exchange</a>
                                <a href="#finance-section" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors">Finance</a>
                                <a href="#service-section" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors">Service</a>
                                <a href="#trust-section" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors">Trust Us</a>
                                <div className="pt-2 border-t border-gray-100">
                                    <Button
                                        className="w-full rounded-full text-white"
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

            {activeTab === 'home' && (
                <>
                    {/* Hero */}
                    <section className="relative pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: `${brandColors.primary}20`, color: brandColors.primary }}>
                                            {tagline}
                                        </div>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold text-gray-700" style={{ borderColor: `${brandColors.primary}40`, backgroundColor: `${brandColors.primary}08` }}>
                                            {dealerName}
                                        </div>
                                        {isVerified && <VerifiedBadge variant="hero" />}
                                    </div>
                                    <h1 className="text-5xl md:text-6xl font-bold leading-tight">{heroTitle}</h1>
                                    <p className="text-xl text-gray-600">{heroSubtitle}</p>
                                    <div className="flex flex-wrap gap-4">
                                        {showInventoryTab && (
                                            <Button size="lg" className="rounded-full text-white" style={{ backgroundColor: brandColors.primary }} onClick={() => setActiveTab('inventory')}>
                                                {vl.browseCTA}
                                                <ArrowRight className="ml-2 w-5 h-5" />
                                            </Button>
                                        )}
                                        <Button size="lg" variant="outline" className="rounded-full bg-white" style={{ borderColor: brandColors.primary, color: brandColors.primary }} asChild>
                                            <a href="#contact">Talk to Our Team</a>
                                        </Button>
                                    </div>
                                </div>
                                <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                                    <Image src={heroImageUrl || getBrandHeroImage(brandName)} alt={`${brandName} Family`} fill className="object-cover" priority />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats */}
                    <section className="py-16 border-y border-gray-200">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { icon: Users, value: '10k+', label: 'Happy Families' },
                                    { icon: Star, value: '4.9', label: 'Customer Rating' },
                                    { icon: Shield, value: '100%', label: 'Satisfaction' },
                                    { icon: CheckCircle2, value: '500+', label: 'Vehicles' },
                                ].map((stat, i) => (
                                    <div key={i} className="text-center">
                                        <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandColors.primary}20` }}>
                                            <stat.icon className="w-6 h-6" style={{ color: brandColors.primary }} />
                                        </div>
                                        <p className="text-3xl font-bold">{stat.value}</p>
                                        <p className="text-sm text-gray-600">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Services — family-friendly cards */}
                    {serviceList.length > 0 && (
                        <section className="py-16 bg-gray-50">
                            <div className="max-w-7xl mx-auto px-4">
                                <div className="text-center mb-10">
                                    <span className="font-semibold uppercase tracking-wider text-sm" style={{ color: brandColors.primary }}>
                                        What We Offer
                                    </span>
                                    <h2 className="text-3xl font-bold mt-2">Services for Your Family</h2>
                                </div>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {serviceList.map((svc) => {
                                        const meta = SERVICE_LABELS[svc as string] ?? { label: svc as string, icon: '🚘', desc: 'Premium service for you' };
                                        return (
                                            <div
                                                key={svc as string}
                                                className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border"
                                                style={{ borderColor: `${brandColors.primary}20` }}
                                            >
                                                <span className="text-3xl">{meta.icon}</span>
                                                <div>
                                                    <p className="font-bold text-gray-900">{meta.label}</p>
                                                    <p className="text-sm text-gray-500 mt-0.5">{meta.desc}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Featured Cars */}
                    <section className="py-20 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="text-center mb-12">
                                <span className="font-semibold uppercase tracking-wider text-sm" style={{ color: brandColors.primary }}>
                                    Our Collection
                                </span>
                                <h2 className="text-4xl font-bold mt-2">Family-Friendly Vehicles</h2>
                            </div>
                            <CarGrid cars={featuredCars} brandColor={brandColors.primary} light dealerPhone={contactInfo.phone} dealerId={dealerId} />
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
                            <div className="text-center mb-8">
                                <span className="font-semibold uppercase tracking-wider text-sm" style={{ color: brandColors.primary }}>
                                    Finance Tool
                                </span>
                                <h2 className="text-3xl font-bold mt-2">EMI Calculator</h2>
                                <p className="text-gray-600 mt-2">Plan your budget with real inputs — price, down payment, tenure &amp; rate</p>
                            </div>
                            <EmiCalculator brandColor={brandColors.primary} theme="light" />
                        </div>
                    </section>

                    {/* Why Families Choose Us */}
                    <section className="py-20">
                        <div className="max-w-7xl mx-auto px-4">
                            <h2 className="text-4xl font-bold text-center mb-16">Why Families Choose Us</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[
                                    { icon: Shield, title: 'Safety First', desc: 'Every car thoroughly inspected' },
                                    { icon: PiggyBank, title: 'Best Value', desc: 'Transparent, fair pricing' },
                                    { icon: Heart, title: 'Family Service', desc: 'We treat you like family' },
                                    { icon: CheckCircle2, title: 'Easy Finance', desc: 'Flexible payment options' },
                                ].map((f, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${brandColors.primary}20` }}>
                                            <f.icon className="w-6 h-6" style={{ color: brandColors.primary }} />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                                        <p className="text-gray-600">{f.desc}</p>
                                    </div>
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

                    {/* Talk to Our Team — Lead Form */}
                    <section id="contact" className="py-20 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="grid lg:grid-cols-2 gap-12 items-start">
                                {/* Info */}
                                <div>
                                    <span className="font-semibold uppercase tracking-wider text-sm" style={{ color: brandColors.primary }}>
                                        We&apos;re Here to Help
                                    </span>
                                    <h2 className="text-4xl font-bold mt-2 mb-4">Talk to Our Team</h2>
                                    <p className="text-gray-600 mb-8 text-lg">
                                        Have questions? Our friendly team is ready to help you find the perfect {vl.familyVehicle} for your family.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandColors.primary}20` }}>
                                                <Phone className="w-5 h-5" style={{ color: brandColors.primary }} />
                                            </div>
                                            <a href={`tel:${contactInfo.phone}`} className="text-gray-700 font-medium hover:underline">{contactInfo.phone}</a>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandColors.primary}20` }}>
                                                <Mail className="w-5 h-5" style={{ color: brandColors.primary }} />
                                            </div>
                                            <a href={`mailto:${contactInfo.email}`} className="text-gray-700 font-medium hover:underline">{contactInfo.email}</a>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${brandColors.primary}20` }}>
                                                <MapPin className="w-5 h-5" style={{ color: brandColors.primary }} />
                                            </div>
                                            <span className="text-gray-700 pt-2">{contactInfo.address}</span>
                                        </div>
                                        {workingHours && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandColors.primary}20` }}>
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

                                {/* Form */}
                                <div className="bg-white rounded-2xl shadow-xl p-8">
                                    {formStatus === 'sent' ? (
                                        <div className="text-center py-10">
                                            <Heart className="w-16 h-16 mx-auto mb-4" style={{ color: brandColors.primary }} />
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
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 text-gray-900 bg-gray-50 placeholder:text-gray-400"
                                                    placeholder="Full name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 text-gray-900 bg-gray-50 placeholder:text-gray-400"
                                                    placeholder="Your phone number"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 text-gray-900 bg-gray-50 placeholder:text-gray-400"
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                                <textarea
                                                    rows={4}
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 text-gray-900 bg-gray-50 resize-none placeholder:text-gray-400"
                                                    placeholder={`Which ${vl.familyVehicle} are you looking for? Any specific requirements?`}
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
                                                {formStatus === 'sending' ? 'Sending...' : (
                                                    <>
                                                        <Send className="w-4 h-4 mr-2" />
                                                        Send Message
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
                <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                            <h1 className="text-4xl font-bold">Our Inventory</h1>
                            {/* Hybrid inventory tabs */}
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
                                <div className="sticky top-24 bg-white rounded-2xl shadow-sm p-6"><CarFilters hideBrand={sellsNewCars} /></div>
                            </div>
                            <div className="flex-1">
                                <CarGrid
                                    cars={isHybrid
                                        ? inventoryTab === 'new'
                                            ? cars.filter(c => c.condition === 'new')
                                            : inventoryTab === 'used'
                                                ? cars.filter(c => c.condition !== 'new')
                                                : cars
                                        : cars}
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
            <footer className="bg-gray-50 border-t border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
                        <div className="relative w-12 h-12 mr-3">
                            <Image
                                src={logoUrl || `/assets/logos/${brandName.toLowerCase().replace(/\s+/g, '-')}.png`}
                                alt={logoUrl ? dealerName : brandName}
                                fill
                                className="object-contain"
                                sizes="48px"
                                style={{ filter: 'saturate(1.4) brightness(1.05) drop-shadow(0 4px 10px rgba(0,0,0,0.25)) drop-shadow(0 1px 3px rgba(0,0,0,0.15))' }}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                        </div>
                        <div>
                            <span className="text-2xl font-bold block">{dealerName}</span>
                            <span className="text-sm text-gray-500">Trusted by Families</span>
                        </div>
                    </div>

                    <div className={`grid gap-8 ${branches && branches.length > 0 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
                        <div>
                            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
                            <div className="space-y-2 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" style={{ color: brandColors.primary }} />
                                    <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" style={{ color: brandColors.primary }} />
                                    <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-1" style={{ color: brandColors.primary }} />
                                    <span>{contactInfo.address}</span>
                                </div>
                                {workingHours && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" style={{ color: brandColors.primary }} />
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
                                                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: brandColors.primary }} />
                                                <span>{branch.address}</span>
                                            </div>
                                            {branch.phone && (
                                                <div className="flex items-center gap-2 text-sm">
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
                            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
                            <div className="space-y-2 text-gray-600">
                                <button onClick={() => setActiveTab('home')} className="block hover:text-gray-900">Home</button>
                                {showInventoryTab && (
                                    <button onClick={() => setActiveTab('inventory')} className="block hover:text-gray-900">Inventory</button>
                                )}
                                <a href="#contact" className="block hover:text-gray-900">Contact</a>
                                <button onClick={() => setNavEMIOpen(true)} className="block hover:text-gray-900">EMI Calculator</button>
                                <a href="#exchange-section" className="block hover:text-gray-900">Exchange</a>
                                <a href="#finance-section" className="block hover:text-gray-900">Finance</a>
                                <a href="#service-section" className="block hover:text-gray-900">Service Booking</a>
                                <a href="#trust-section" className="block hover:text-gray-900">Why Trust Us</a>
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
                            <div className="flex gap-3 mt-4">
                                <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                                </a>
                                <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-pink-100 text-gray-500 hover:text-pink-600 transition-colors">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path fill="white" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                                </a>
                                <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
                                </a>
                                <a href="#" aria-label="WhatsApp" className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-green-100 text-gray-500 hover:text-green-600 transition-colors">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
                        <p>© {new Date().getFullYear()} {dealerName}</p>
                        <div className="flex items-center justify-center gap-3 mt-3">
                            <a
                                href="https://www.cyepro.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <div className="relative w-40 h-12">
                                    <Image src="/assets/cyepro-logo.png" alt="Cyepro" fill className="object-contain" sizes="160px" />
                                </div>
                            </a>
                            <span className="text-lg" style={{ color: '#E5197D' }}>|</span>
                            <span className="text-sm font-medium" style={{ color: '#E5197D' }}>India&apos;s leading CRM providers</span>
                        </div>
                    </div>
                </div>
            </footer>

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

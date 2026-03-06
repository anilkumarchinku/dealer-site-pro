/**
 * Sporty Template - Using Template System with Brand Colors
 * A bold, dynamic design for performance-focused dealerships
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
import { WishlistDrawer } from '@/components/ui/WishlistDrawer';
import { LanguageToggle, useLocale } from '@/components/ui/LanguageToggle';
import { t } from '@/lib/i18n/translations';
import { EVSection } from '@/components/ui/EVSection';
import { generateTemplateConfig } from '@/lib/templates';
import { getBrandHeroImage } from '@/lib/utils/brand-hero';
import { getContrastText } from '@/lib/utils/color-contrast';
import {
    ArrowRight,
    Phone,
    MapPin,
    Mail,
    Zap,
    Gauge,
    Timer,
    Shield,
    ChevronRight,
    Flame,
    Activity,
    TrendingUp,
    MessageSquare,
    Clock,
    CheckCircle2,
    Send,
    Menu,
    X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { EnquireSidebar } from '@/components/cars/EnquireSidebar';
import { EmiCalculator } from '@/components/ui/EmiCalculator';
import type { Service } from '@/lib/types';

const SERVICE_LABELS: Record<string, { label: string; icon: string }> = {
    new_car_sales: { label: 'New Cars', icon: '🚗' },
    used_car_sales: { label: 'Used Cars', icon: '🔄' },
    financing: { label: 'Finance & EMI', icon: '💰' },
    service_maintenance: { label: 'Service & Repairs', icon: '🔧' },
    parts_accessories: { label: 'Parts & Accessories', icon: '⚙️' },
    test_drive: { label: 'Test Drive', icon: '🏎️' },
    insurance: { label: 'Insurance', icon: '🛡️' },
    extended_warranty: { label: 'Extended Warranty', icon: '✅' },
    roadside_assistance: { label: 'Roadside Assist', icon: '🆘' },
    car_exchange: { label: 'Car Exchange', icon: '🔃' },
}

interface SportyTemplateProps {
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
        tagline?: string;
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
}

export function SportyTemplate({
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
}: SportyTemplateProps) {
    const isHybrid = sellsNewCars && sellsUsedCars;
    const [locale, setLocale] = useLocale();
    const [activeTab, setActiveTab] = useState<'inventory' | 'home'>('home');
    const [inventoryTab, setInventoryTab] = useState<'all' | 'new' | 'used'>('all');
    const [isScrolled, setIsScrolled] = useState(false);
    const [enquireSidebarOpen, setEnquireSidebarOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Lead form state
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const config = generateTemplateConfig(brandName, 'sporty');
    const { brandColors } = config;

    // Use brand primary color directly — white backgrounds ensure good contrast
    const brandAccent = brandColors.primary;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const featuredCars = cars;
    const heroTitle = customConfig?.heroTitle || 'UNLEASH THE POWER';
    const heroSubtitle = customConfig?.heroSubtitle || 'Experience raw performance';
    const tagline = customConfig?.tagline || 'Built for Speed';

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

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            {/* Navigation */}
            <nav className={`fixed ${previewMode ? 'top-12' : 'top-0'} left-0 right-0 z-50 transition-all ${isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('home')}>
                            <div className="relative w-10 h-10 mr-3">
                                <Image
                                    src={logoUrl || `/assets/logos/${brandName.toLowerCase().replace(/\s+/g, '-')}.png`}
                                    alt={logoUrl ? dealerName : brandName}
                                    fill
                                    className="object-contain"
                                    sizes="40px"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                />
                            </div>
                            <span className="text-xl font-bold text-gray-900">{dealerName}</span>
                        </div>
                        <div className="hidden md:flex items-center gap-6">
                            <button
                                onClick={() => setActiveTab('home')}
                                className="font-bold uppercase text-sm tracking-wider text-gray-600 hover:text-gray-900"
                                style={activeTab === 'home' ? { color: brandAccent } : {}}
                            >
                                Home
                            </button>
                            <button
                                onClick={() => setActiveTab('inventory')}
                                className="font-bold uppercase text-sm tracking-wider text-gray-600 hover:text-gray-900"
                                style={activeTab === 'inventory' ? { color: brandAccent } : {}}
                            >
                                Inventory
                            </button>
                            <a href="#contact" className="font-bold uppercase text-sm tracking-wider text-gray-600 hover:text-gray-900">
                                Contact
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <LanguageToggle locale={locale} onChange={setLocale} variant="dark" />
                            <WishlistDrawer cars={cars} dealerId={dealerId} brandColor={brandAccent} />
                            <Button
                                className="text-white font-bold hidden sm:flex"
                                style={{ backgroundColor: `${brandAccent}cc` }}
                                onClick={() => setEnquireSidebarOpen(true)}
                            >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                ENQUIRE
                            </Button>
                            <Button className="text-white font-bold" style={{ backgroundColor: brandAccent }} asChild>
                                <a href={`tel:${contactInfo.phone}`}>
                                    <Phone className="w-4 h-4 mr-2" />
                                    CALL NOW
                                </a>
                            </Button>
                            <button
                                className="md:hidden p-2 rounded-lg text-gray-900 transition-colors hover:bg-gray-100"
                                onClick={() => setMobileMenuOpen(o => !o)}
                                aria-label="Toggle navigation menu"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg">
                            <div className="px-4 py-3 space-y-1">
                                <button
                                    onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                                    className="block w-full text-left px-3 py-2.5 rounded-lg font-bold uppercase text-sm tracking-wider text-gray-900 hover:bg-gray-100 transition-colors"
                                >
                                    Home
                                </button>
                                <button
                                    onClick={() => { setActiveTab('inventory'); setMobileMenuOpen(false); }}
                                    className="block w-full text-left px-3 py-2.5 rounded-lg font-bold uppercase text-sm tracking-wider text-gray-900 hover:bg-gray-100 transition-colors"
                                >
                                    Inventory
                                </button>
                                <a
                                    href="#contact"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2.5 rounded-lg font-bold uppercase text-sm tracking-wider text-gray-900 hover:bg-gray-100 transition-colors"
                                >
                                    Contact
                                </a>
                                <div className="pt-2 border-t border-gray-200">
                                    <Button
                                        className="w-full text-white font-bold uppercase"
                                        style={{ backgroundColor: brandAccent }}
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
                brandColor={brandAccent}
                services={services}
                contactPhone={contactInfo.phone}
            />

            {/* Home Tab */}
            {activeTab === 'home' && (
                <>
                    {/* Hero Section */}
                    <section className="relative min-h-screen flex items-center overflow-hidden">
                        <div className="absolute inset-0">
                            <Image src={heroImageUrl || getBrandHeroImage(brandName)} alt={`${brandName} Hero`} fill className="object-cover opacity-30" priority />
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
                            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, ${brandAccent}15 100%)` }} />
                        </div>
                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                            <div className="max-w-3xl">
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <div className="inline-block px-4 py-2 rounded-md font-bold text-sm uppercase tracking-wider" style={{ backgroundColor: `${brandAccent}15`, borderLeft: `4px solid ${brandAccent}`, color: brandAccent }}>
                                        {tagline}
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 border border-gray-200">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-600">{dealerName}</span>
                                    </div>
                                    {isVerified && <VerifiedBadge variant="hero" />}
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black leading-none mb-6 tracking-tight text-gray-900">
                                    {heroTitle.split(' ').map((word, i) => (
                                        <span key={i} className={i === heroTitle.split(' ').length - 1 ? 'block' : ''} style={i === heroTitle.split(' ').length - 1 ? { color: brandAccent } : {}}>
                                            {word}{' '}
                                        </span>
                                    ))}
                                </h1>
                                <p className="text-2xl text-gray-500 mb-8">{heroSubtitle}</p>
                                <div className="flex flex-wrap gap-4">
                                    <Button size="lg" className="text-white font-bold text-lg uppercase tracking-wider" style={{ backgroundColor: brandAccent }} onClick={() => setActiveTab('inventory')}>
                                        EXPLORE
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                    <Button size="lg" variant="outline" className="font-bold uppercase border-2 bg-transparent hover:bg-white/10" style={{ borderColor: brandAccent, color: brandAccent }} asChild>
                                        <a href="#contact">BOOK TEST DRIVE</a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats */}
                    <section className="py-16 border-y" style={{ borderColor: `${brandAccent}33` }}>
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { icon: Gauge, value: '0-100', label: 'KM/H IN 3.2S' },
                                    { icon: Zap, value: '500+', label: 'HORSEPOWER' },
                                    { icon: Timer, value: '10k+', label: 'SATISFIED RIDERS' },
                                    { icon: Flame, value: '4.9★', label: 'PERFORMANCE RATING' },
                                ].map((stat, i) => (
                                    <div key={i} className="text-center">
                                        <stat.icon className="w-10 h-10 mx-auto mb-3" style={{ color: brandAccent }} />
                                        <p className="text-4xl font-black mb-1" style={{ color: brandAccent }}>{stat.value}</p>
                                        <p className="text-xs uppercase tracking-wider text-gray-500">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Services — sporty badges */}
                    {serviceList.length > 0 && (
                        <section className="py-16 border-b border-gray-200">
                            <div className="max-w-7xl mx-auto px-4">
                                <div className="mb-10">
                                    <span className="font-black text-sm uppercase tracking-widest" style={{ color: brandAccent }}>WHAT WE DO</span>
                                    <h2 className="text-4xl font-black mt-2 uppercase">Our Services</h2>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {serviceList.map((svc) => {
                                        const meta = SERVICE_LABELS[svc as string] ?? { label: svc as string, icon: '🚘' };
                                        return (
                                            <div
                                                key={svc as string}
                                                className="flex items-center gap-2 px-4 py-2.5 rounded-md border-2 font-bold text-sm uppercase tracking-wide transition-colors"
                                                style={{ borderColor: brandAccent, color: brandAccent, backgroundColor: `${brandAccent}15` }}
                                            >
                                                <span>{meta.icon}</span>
                                                <span>{meta.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Featured Cars */}
                    <section className="py-20">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="flex justify-between items-end mb-12">
                                <div>
                                    <span className="font-black text-sm uppercase tracking-widest" style={{ color: brandAccent }}>
                                        PERFORMANCE LINEUP
                                    </span>
                                    <h2 className="text-5xl font-black mt-2">FEATURED BEASTS</h2>
                                </div>
                                <Button variant="outline" className="border-2 font-bold uppercase bg-transparent" style={{ borderColor: brandAccent, color: brandAccent }} onClick={() => setActiveTab('inventory')}>
                                    VIEW ALL
                                    <ChevronRight className="ml-1 w-4 h-4" />
                                </Button>
                            </div>
                            <CarGrid cars={featuredCars} brandColor={brandAccent} dealerPhone={contactInfo.phone} dealerId={dealerId} />
                        </div>
                    </section>

                    {/* EV Section */}
                    <EVSection cars={cars} contactInfo={contactInfo} brandColor="#10b981" />

                    {/* Why Choose Us */}
                    <section className="py-20 border-t border-gray-200">
                        <div className="max-w-7xl mx-auto px-4">
                            <h2 className="text-5xl font-black text-center mb-16 text-gray-900">THE EDGE</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { icon: Shield, title: 'CERTIFIED', desc: 'Performance Verified' },
                                    { icon: Activity, title: 'TRACK-READY', desc: 'Race Tested' },
                                    { icon: TrendingUp, title: 'TOP SPEED', desc: 'Maximum Performance' },
                                    { icon: Flame, title: 'UNLEASHED', desc: 'Pure Power' },
                                ].map((feature, i) => (
                                    <div key={i} className="p-6 rounded-lg border-2 border-gray-200 hover:bg-gray-50 transition-colors">
                                        <feature.icon className="w-10 h-10 mb-4" style={{ color: brandAccent }} />
                                        <h3 className="text-xl font-black mb-2 uppercase text-gray-900">{feature.title}</h3>
                                        <p className="text-gray-500">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* EMI Calculator */}
                    <section className="py-20 border-t border-gray-200">
                        <div className="max-w-4xl mx-auto px-4">
                            <div className="mb-10">
                                <span className="font-black text-sm uppercase tracking-widest" style={{ color: brandAccent }}>
                                    FINANCE
                                </span>
                                <h2 className="text-5xl font-black mt-2 text-gray-900">EMI CALCULATOR</h2>
                                <p className="text-gray-500 mt-2">Know your numbers before you race to the showroom</p>
                            </div>
                            <EmiCalculator brandColor={brandAccent} theme="light" />
                        </div>
                    </section>

                    {/* Customer Reviews */}
                    <section className="py-16 bg-gray-950">
                        <div className="max-w-7xl mx-auto px-4">
                            <ReviewsSection dealerId={dealerId} brandColor={brandAccent} variant="dark" />
                        </div>
                    </section>

                    {/* Book a Test Drive — Lead Form */}
                    <section id="contact" className="py-20 border-t border-gray-200">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="grid lg:grid-cols-2 gap-12 items-start">
                                {/* Info */}
                                <div>
                                    <span className="font-black text-sm uppercase tracking-widest" style={{ color: brandAccent }}>GET IN TOUCH</span>
                                    <h2 className="text-5xl font-black mt-2 mb-6 uppercase text-gray-900">Book a Test Drive</h2>
                                    <p className="text-gray-500 mb-8 text-lg">
                                        Feel the power firsthand. Book your test drive today and experience performance like never before.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5" style={{ color: brandAccent }} />
                                            <a href={`tel:${contactInfo.phone}`} className="text-gray-600 hover:text-gray-900 font-bold">{contactInfo.phone}</a>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5" style={{ color: brandAccent }} />
                                            <a href={`mailto:${contactInfo.email}`} className="text-gray-600 hover:text-gray-900">{contactInfo.email}</a>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 mt-0.5" style={{ color: brandAccent }} />
                                            <span className="text-gray-600">{contactInfo.address}</span>
                                        </div>
                                        {workingHours && (
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-5 h-5" style={{ color: brandAccent }} />
                                                <span className="text-gray-600">{workingHours}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Form */}
                                <div className="rounded-lg border-2 border-gray-200 p-8 bg-white shadow-sm">
                                    {formStatus === 'sent' ? (
                                        <div className="text-center py-10">
                                            <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: brandAccent }} />
                                            <h3 className="text-2xl font-black uppercase mb-2 text-gray-900">Request Received!</h3>
                                            <p className="text-gray-500">Our team will confirm your test drive shortly.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <h3 className="text-xl font-black uppercase mb-6 text-gray-900">Test Drive Request</h3>
                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                                                    placeholder="Full name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Phone *</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                                                    placeholder="Your contact number"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Which car? / Message</label>
                                                <textarea
                                                    rows={4}
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 resize-none"
                                                    placeholder="Tell us which vehicle you want to test drive"
                                                />
                                            </div>
                                            {formStatus === 'error' && (
                                                <p className="text-red-600 text-sm">Something went wrong. Please call us directly.</p>
                                            )}
                                            <Button
                                                type="submit"
                                                disabled={formStatus === 'sending'}
                                                className="w-full text-white py-3 rounded-md font-black uppercase tracking-wider"
                                                style={{ backgroundColor: brandAccent }}
                                            >
                                                {formStatus === 'sending' ? 'SUBMITTING...' : (
                                                    <>
                                                        <Send className="w-4 h-4 mr-2" />
                                                        BOOK TEST DRIVE
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
            {activeTab === 'inventory' && (
                <div className="pt-20 pb-12 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                            <div>
                                <h1 className="text-5xl font-black uppercase">INVENTORY</h1>
                                <p className="text-gray-500 mt-2">{cars.length}+ {isHybrid ? 'Vehicles' : 'Performance Machines'}</p>
                            </div>
                            {isHybrid && (
                                <div className="flex items-center gap-1 p-1 rounded-lg border border-gray-200 w-fit">
                                    {([
                                        { id: 'all', label: `All (${cars.length})` },
                                        { id: 'new', label: `New (${cars.filter(c => c.condition === 'new').length})` },
                                        { id: 'used', label: `Pre-Owned (${cars.filter(c => c.condition !== 'new').length})` },
                                    ] as const).map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setInventoryTab(t.id)}
                                            className="px-4 py-1.5 rounded-md text-sm font-bold uppercase tracking-widest transition-all"
                                            style={inventoryTab === t.id ? { backgroundColor: brandAccent, color: getContrastText(brandAccent) } : { color: '#9ca3af' }}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-72">
                                <div className="sticky top-24 bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <CarFilters hideBrand={sellsNewCars} />
                                </div>
                            </div>
                            <div className="flex-1">
                                <CarGrid
                                    cars={isHybrid
                                        ? inventoryTab === 'new' ? cars.filter(c => c.condition === 'new')
                                            : inventoryTab === 'used' ? cars.filter(c => c.condition !== 'new')
                                                : cars : cars}
                                    brandColor={brandAccent}
                                    dealerPhone={contactInfo.phone}
                                    dealerId={dealerId}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="border-t border-gray-200 py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
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
                            <span className="text-2xl font-black block text-gray-900">{dealerName}</span>
                            <span className="text-sm text-gray-500 uppercase tracking-wider">Built for Speed</span>
                        </div>
                    </div>

                    <div className={`grid gap-8 ${branches && branches.length > 0 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
                        <div>
                            <h4 className="text-lg font-black uppercase mb-4 text-gray-900">CONTACT</h4>
                            <div className="space-y-3 text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-5 h-5" style={{ color: brandAccent }} />
                                    <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-5 h-5" style={{ color: brandAccent }} />
                                    <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-5 h-5 mt-1" style={{ color: brandAccent }} />
                                    <span>{contactInfo.address}</span>
                                </div>
                                {workingHours && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5" style={{ color: brandAccent }} />
                                        <span>{workingHours}</span>
                                    </div>
                                )}
                                {/* Google Maps Embed */}
                                {contactInfo.address && (
                                    <div className="mt-4 rounded-lg overflow-hidden border border-gray-700 h-40">
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
                        </div>
                        {branches && branches.length > 0 && (
                            <div>
                                <h4 className="text-lg font-black uppercase mb-4 text-gray-900">BRANCHES</h4>
                                <div className="space-y-4 text-gray-500">
                                    {branches.map((branch, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <p className="font-bold text-gray-900 text-sm uppercase">{branch.city}</p>
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
                            <h4 className="text-lg font-black uppercase mb-4 text-gray-900">QUICK LINKS</h4>
                            <div className="space-y-2 text-gray-500">
                                <button onClick={() => setActiveTab('home')} className="block hover:text-gray-900">Home</button>
                                <button onClick={() => setActiveTab('inventory')} className="block hover:text-gray-900">Inventory</button>
                                <a href="#contact" className="block hover:text-gray-900">Contact</a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-black uppercase mb-4 text-gray-900">{dealerName}</h4>
                            <p className="text-gray-500">Performance vehicles for those who demand the best. Experience the thrill.</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-400">
                        <p>© {new Date().getFullYear()} {dealerName}. All rights reserved.</p>
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

            {/* WhatsApp Float Button */}
            <WhatsAppButton phone={contactInfo.phone} />
        </div>
    );
}

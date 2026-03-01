/**
 * Luxury Template - Using Template System with Brand Colors
 * Elegant, sophisticated design for premium dealerships
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
import { ArrowRight, Phone, MapPin, Mail, Award, ShieldCheck, Star, ChevronRight, Crown, Clock, MessageSquare, CheckCircle2, Send, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { EnquireSidebar } from '@/components/cars/EnquireSidebar';
import { EmiCalculator } from '@/components/ui/EmiCalculator';
import type { Service } from '@/lib/types';

const SERVICE_LABELS: Record<string, { label: string; icon: string }> = {
    new_car_sales:       { label: 'New Cars',           icon: '🚗' },
    used_car_sales:      { label: 'Used Cars',           icon: '🔄' },
    financing:           { label: 'Finance & EMI',       icon: '💰' },
    service_maintenance: { label: 'Service & Repairs',   icon: '🔧' },
    parts_accessories:   { label: 'Parts & Accessories', icon: '⚙️' },
    test_drive:          { label: 'Test Drive',          icon: '🏎️' },
    insurance:           { label: 'Insurance',           icon: '🛡️' },
    extended_warranty:   { label: 'Extended Warranty',   icon: '✅' },
    roadside_assistance: { label: 'Roadside Assist',     icon: '🆘' },
    car_exchange:        { label: 'Car Exchange',        icon: '🔃' },
}

interface LuxuryTemplateProps {
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
}

export function LuxuryTemplate({
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
}: LuxuryTemplateProps) {
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

    const config = generateTemplateConfig(brandName, 'luxury');
    const { brandColors } = config;

    // Use brand primary color directly — white backgrounds ensure good contrast
    const brandAccent = brandColors.primary;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const featuredCars = cars;
    const heroTitle = customConfig?.heroTitle || 'THE ART OF PERFORMANCE';
    const heroSubtitle = customConfig?.heroSubtitle || 'Experience automotive excellence';
    const tagline = customConfig?.tagline || 'Excellence in Motion';

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
        <div className="min-h-screen bg-white text-gray-900 font-serif">
            <nav className={`fixed ${previewMode ? 'top-12' : 'top-0'} left-0 right-0 z-50 transition-all ${isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
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
                            <span className="text-2xl font-light tracking-widest text-gray-900">{dealerName}</span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <button onClick={() => setActiveTab('home')} className="text-sm tracking-wider text-gray-600 hover:text-gray-900" style={activeTab === 'home' ? { color: brandAccent } : {}}>Home</button>
                            <button onClick={() => setActiveTab('inventory')} className="text-sm tracking-wider text-gray-600 hover:text-gray-900" style={activeTab === 'inventory' ? { color: brandAccent } : {}}>Collection</button>
                            <a href="#contact" className="text-sm tracking-wider text-gray-600 hover:text-gray-900">Contact</a>
                        </div>
                        <div className="flex items-center gap-2">
                            <LanguageToggle locale={locale} onChange={setLocale} variant="light" />
                            <WishlistDrawer cars={cars} dealerId={dealerId} brandColor={brandAccent} />
                            <Button
                                variant="outline"
                                className="border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100 hidden sm:flex"
                                onClick={() => setEnquireSidebarOpen(true)}
                            >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Enquire Now
                            </Button>
                            <Button variant="outline" className="border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100" asChild>
                                <a href={`tel:${contactInfo.phone}`}>
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call
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
                                    className="block w-full text-left px-3 py-2.5 rounded-lg text-sm tracking-wider text-gray-900 hover:bg-gray-100 transition-colors"
                                >
                                    Home
                                </button>
                                <button
                                    onClick={() => { setActiveTab('inventory'); setMobileMenuOpen(false); }}
                                    className="block w-full text-left px-3 py-2.5 rounded-lg text-sm tracking-wider text-gray-900 hover:bg-gray-100 transition-colors"
                                >
                                    Collection
                                </button>
                                <a
                                    href="#contact"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2.5 rounded-lg text-sm tracking-wider text-gray-900 hover:bg-gray-100 transition-colors"
                                >
                                    Contact
                                </a>
                                <div className="pt-2 border-t border-gray-200">
                                    <Button
                                        className="w-full text-white"
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
                brandColor={brandAccent}
                services={services}
                contactPhone={contactInfo.phone}
            />

            {activeTab === 'home' && (
                <>
                    {/* Hero */}
                    <section className="relative min-h-screen flex items-center">
                        <div className="absolute inset-0">
                            <Image src={heroImageUrl || getBrandHeroImage(brandName)} alt={`${brandName} Luxury`} fill className="object-cover opacity-35" priority />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-white/80" />
                        </div>
                        <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 text-center">
                            <p className="text-sm tracking-widest uppercase mb-4" style={{ color: brandAccent }}>{tagline}</p>
                            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50">
                                    <Crown className="w-3.5 h-3.5 text-gray-500" />
                                    <span className="text-sm font-light tracking-widest text-gray-600">{dealerName}</span>
                                </div>
                                {isVerified && <VerifiedBadge variant="hero" />}
                            </div>
                            <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-8 leading-tight text-gray-900">{heroTitle}</h1>
                            <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">{heroSubtitle}</p>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Button size="lg" className="text-white" style={{ backgroundColor: brandAccent }} onClick={() => setActiveTab('inventory')}>
                                    Explore Collection
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                                <Button size="lg" variant="outline" className="border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100" asChild>
                                    <a href="#contact">Request Private Viewing</a>
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* EV Section */}
                    <EVSection cars={cars} contactInfo={contactInfo} brandColor="#10b981" />

                    {/* Services — luxury chips */}
                    {serviceList.length > 0 && (
                        <section className="py-16 bg-gray-50">
                            <div className="max-w-7xl mx-auto px-4">
                                <div className="text-center mb-10">
                                    <span className="text-sm tracking-widest uppercase" style={{ color: brandAccent }}>Our Services</span>
                                    <h2 className="text-3xl font-light mt-2">What We Offer</h2>
                                </div>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {serviceList.map((svc) => {
                                        const meta = SERVICE_LABELS[svc as string] ?? { label: svc as string, icon: '🚘' };
                                        return (
                                            <div
                                                key={svc as string}
                                                className="flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm tracking-wide"
                                                style={{ borderColor: `${brandAccent}60`, color: brandAccent, backgroundColor: `${brandAccent}10` }}
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

                    {/* Featured Collection */}
                    <section className="py-24 bg-white">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="text-center mb-16">
                                <span className="text-sm tracking-widest uppercase" style={{ color: brandAccent }}>Curated Selection</span>
                                <h2 className="text-5xl font-light mt-4 text-gray-900">Featured Collection</h2>
                            </div>
                            <CarGrid cars={featuredCars} brandColor={brandAccent} dealerPhone={contactInfo.phone} dealerId={dealerId} />
                            <div className="text-center mt-10">
                                <Button variant="outline" className="border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100" onClick={() => setActiveTab('inventory')}>
                                    View Full Collection
                                    <ChevronRight className="ml-1 w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* The Difference */}
                    <section className="py-24">
                        <div className="max-w-7xl mx-auto px-4">
                            <h2 className="text-5xl font-light text-center mb-16">The Difference</h2>
                            <div className="grid md:grid-cols-3 gap-12">
                                {[
                                    { icon: ShieldCheck, title: 'Certified Excellence', desc: 'Every detail perfected' },
                                    { icon: Award, title: 'Unmatched Service', desc: 'White-glove experience' },
                                    { icon: Star, title: 'Premium Selection', desc: 'Curated for perfection' },
                                ].map((f, i) => (
                                    <div key={i} className="text-center">
                                        <f.icon className="w-12 h-12 mx-auto mb-6" style={{ color: brandAccent }} />
                                        <h3 className="text-2xl font-light mb-4">{f.title}</h3>
                                        <p className="text-gray-500">{f.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* EMI Calculator */}
                    <section className="py-24">
                        <div className="max-w-4xl mx-auto px-4">
                            <div className="text-center mb-10">
                                <span className="text-sm tracking-widest uppercase" style={{ color: brandAccent }}>Finance</span>
                                <h2 className="text-5xl font-light mt-4">EMI Calculator</h2>
                                <p className="text-gray-500 mt-3">Plan your investment with precision</p>
                            </div>
                            <EmiCalculator brandColor={brandAccent} theme="light" />
                        </div>
                    </section>

                    {/* Customer Reviews */}
                    <section className="py-16 bg-white">
                        <div className="max-w-7xl mx-auto px-4">
                            <ReviewsSection dealerId={dealerId} brandColor={brandAccent} variant="light" />
                        </div>
                    </section>

                    {/* Request a Callback — Lead Form */}
                    <section id="contact" className="py-24 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="grid lg:grid-cols-2 gap-16 items-start">
                                {/* Info */}
                                <div>
                                    <span className="text-sm tracking-widest uppercase" style={{ color: brandAccent }}>Contact</span>
                                    <h2 className="text-5xl font-light mt-4 mb-6 text-gray-900">Request a Callback</h2>
                                    <p className="text-gray-500 mb-8 text-lg">
                                        Our advisors will personally reach out to curate the finest selection for your needs.
                                    </p>
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-4">
                                            <Phone className="w-5 h-5" style={{ color: brandAccent }} />
                                            <a href={`tel:${contactInfo.phone}`} className="text-gray-600 hover:text-gray-900 transition-colors">{contactInfo.phone}</a>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Mail className="w-5 h-5" style={{ color: brandAccent }} />
                                            <a href={`mailto:${contactInfo.email}`} className="text-gray-600 hover:text-gray-900 transition-colors">{contactInfo.email}</a>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <MapPin className="w-5 h-5 mt-0.5" style={{ color: brandAccent }} />
                                            <span className="text-gray-600">{contactInfo.address}</span>
                                        </div>
                                        {workingHours && (
                                            <div className="flex items-center gap-4">
                                                <Clock className="w-5 h-5" style={{ color: brandAccent }} />
                                                <span className="text-gray-600">{workingHours}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Form */}
                                <div className="border border-gray-200 rounded-2xl p-8 bg-white shadow-sm">
                                    {formStatus === 'sent' ? (
                                        <div className="text-center py-12">
                                            <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: brandAccent }} />
                                            <h3 className="text-2xl font-light mb-2 text-gray-900">Thank You</h3>
                                            <p className="text-gray-500">Our advisor will contact you shortly.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <h3 className="text-xl font-light tracking-wide mb-6 text-gray-900">Private Consultation Request</h3>
                                            <div>
                                                <label className="block text-xs tracking-widest text-gray-500 uppercase mb-2">Your Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                                                    placeholder="Full name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs tracking-widest text-gray-500 uppercase mb-2">Phone *</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                                                    placeholder="Your contact number"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs tracking-widest text-gray-500 uppercase mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs tracking-widest text-gray-500 uppercase mb-2">Message</label>
                                                <textarea
                                                    rows={4}
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 resize-none"
                                                    placeholder="Which vehicle interests you?"
                                                />
                                            </div>
                                            {formStatus === 'error' && (
                                                <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
                                            )}
                                            <Button
                                                type="submit"
                                                disabled={formStatus === 'sending'}
                                                className="w-full text-white py-3 rounded-lg font-light tracking-widest uppercase text-sm"
                                                style={{ backgroundColor: brandAccent }}
                                            >
                                                {formStatus === 'sending' ? 'Sending...' : (
                                                    <>
                                                        <Send className="w-4 h-4 mr-2" />
                                                        Submit Request
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
                <div className="pt-24 pb-12 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
                            <h1 className="text-5xl font-light">Our Collection</h1>
                            {isHybrid && (
                                <div className="flex items-center gap-1 p-1 rounded-lg border border-gray-200 w-fit">
                                    {([
                                        { id: 'all',  label: `All (${cars.length})` },
                                        { id: 'new',  label: `New (${cars.filter(c => c.condition === 'new').length})` },
                                        { id: 'used', label: `Pre-Owned (${cars.filter(c => c.condition !== 'new').length})` },
                                    ] as const).map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setInventoryTab(t.id)}
                                            className="px-4 py-1.5 rounded-md text-sm font-medium tracking-wider transition-all"
                                            style={inventoryTab === t.id ? { backgroundColor: brandAccent, color: getContrastText(brandAccent) } : { color: '#6b7280' }}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-72">
                                <div className="sticky top-24 bg-gray-50 rounded-lg p-6 border border-gray-200"><CarFilters hideBrand={sellsNewCars} /></div>
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
                            <span className="text-2xl font-light tracking-widest block text-gray-900">{dealerName}</span>
                            <span className="text-sm text-gray-500">Curating excellence since {new Date().getFullYear()}</span>
                        </div>
                    </div>

                    <div className={`grid gap-8 text-gray-500 ${branches && branches.length > 0 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
                        <div>
                            <h4 className="text-gray-900 font-light text-lg mb-4">Contact</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2"><Phone className="w-4 h-4" style={{ color: brandAccent }} /><a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a></div>
                                <div className="flex items-center gap-2"><Mail className="w-4 h-4" style={{ color: brandAccent }} /><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></div>
                                <div className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-1" style={{ color: brandAccent }} /><span>{contactInfo.address}</span></div>
                                {workingHours && (
                                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" style={{ color: brandAccent }} /><span>{workingHours}</span></div>
                                )}
                                {/* Google Maps Embed */}
                                {contactInfo.address && (
                                    <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 h-40">
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
                                <h4 className="text-gray-900 font-light text-lg mb-4">Our Showrooms</h4>
                                <div className="space-y-4">
                                    {branches.map((branch, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <p className="font-medium text-gray-900 text-sm">{branch.city}</p>
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
                            <h4 className="text-gray-900 font-light text-lg mb-4">Links</h4>
                            <button onClick={() => setActiveTab('home')} className="block mb-2 hover:text-gray-900">Home</button>
                            <button onClick={() => setActiveTab('inventory')} className="block hover:text-gray-900">Collection</button>
                        </div>
                        <div>
                            <h4 className="text-gray-900 font-light text-lg mb-4">{dealerName}</h4>
                            <p>Curating excellence in automotive luxury.</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-400">
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

            {/* WhatsApp Float Button */}
            <WhatsAppButton phone={contactInfo.phone} />
        </div>
    );
}

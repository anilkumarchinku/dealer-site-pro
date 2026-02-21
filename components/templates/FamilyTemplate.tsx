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
import { generateTemplateConfig } from '@/lib/templates';
import { getBrandHeroImage } from '@/lib/utils/brand-hero';
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
    Calculator,
    Send,
    Menu,
    X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { EnquireSidebar } from '@/components/cars/EnquireSidebar';
import type { Service } from '@/lib/types';

const SERVICE_LABELS: Record<string, { label: string; icon: string; desc: string }> = {
    new_car_sales:       { label: 'New Cars',           icon: '🚗', desc: 'Brand new vehicles direct from manufacturer' },
    used_car_sales:      { label: 'Used Cars',           icon: '🔄', desc: 'Certified pre-owned at great prices' },
    financing:           { label: 'Finance & EMI',       icon: '💰', desc: 'Easy monthly plans for every budget' },
    service_maintenance: { label: 'Service & Repairs',   icon: '🔧', desc: 'Expert care for your family vehicle' },
    parts_accessories:   { label: 'Parts & Accessories', icon: '⚙️', desc: 'Genuine parts for all makes' },
    test_drive:          { label: 'Test Drive',          icon: '🏎️', desc: 'Take your dream car for a spin' },
    insurance:           { label: 'Insurance',           icon: '🛡️', desc: 'Complete vehicle protection plans' },
    extended_warranty:   { label: 'Extended Warranty',   icon: '✅', desc: 'Peace of mind, guaranteed' },
    roadside_assistance: { label: 'Roadside Assist',     icon: '🆘', desc: '24/7 support wherever you are' },
    car_exchange:        { label: 'Car Exchange',        icon: '🔃', desc: 'Trade in your old car easily' },
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
}: FamilyTemplateProps) {
    const [activeTab, setActiveTab] = useState<'inventory' | 'home'>('home');
    const [isScrolled, setIsScrolled] = useState(false);
    const [enquireSidebarOpen, setEnquireSidebarOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Lead form state
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    // EMI Calculator state
    const [emiPrice, setEmiPrice] = useState('');
    const [emiResult, setEmiResult] = useState<number | null>(null);

    const config = generateTemplateConfig(brandName, 'family');
    const { brandColors } = config;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const featuredCars = cars;
    const heroTitle = customConfig?.heroTitle || "Your Family's Perfect Car Awaits";
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

    const calculateEmi = () => {
        const priceNum = parseFloat(emiPrice.replace(/[^0-9.]/g, ''));
        if (isNaN(priceNum) || priceNum <= 0) return;
        // Simple approximation: 2% of price per month for 5yr (~20% down, 10% pa interest)
        setEmiResult(Math.round(priceNum * 0.02));
    };

    const serviceList = services && services.length > 0 ? services : [];

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
                            <button onClick={() => setActiveTab('inventory')} className="font-medium hover:opacity-70" style={activeTab === 'inventory' ? { color: brandColors.primary } : {}}>Inventory</button>
                            <a href="#contact" className="font-medium hover:opacity-70">Contact</a>
                        </div>
                        <div className="flex items-center gap-2">
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
                                <button
                                    onClick={() => { setActiveTab('inventory'); setMobileMenuOpen(false); }}
                                    className="block w-full text-left px-3 py-2.5 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                                >
                                    Inventory
                                </button>
                                <a
                                    href="#contact"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2.5 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                                >
                                    Contact
                                </a>
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
                brandColor={brandColors.primary}
                services={services}
                contactPhone={contactInfo.phone}
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
                                    </div>
                                    <h1 className="text-5xl md:text-6xl font-bold leading-tight">{heroTitle}</h1>
                                    <p className="text-xl text-gray-600">{heroSubtitle}</p>
                                    <div className="flex flex-wrap gap-4">
                                        <Button size="lg" className="rounded-full text-white" style={{ backgroundColor: brandColors.primary }} onClick={() => setActiveTab('inventory')}>
                                            Browse Cars
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
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
                            <CarGrid cars={featuredCars} brandColor={brandColors.primary} light />
                            <div className="text-center mt-8">
                                <Button variant="outline" size="lg" className="rounded-full bg-white text-gray-700 border-gray-300 hover:bg-gray-100" onClick={() => setActiveTab('inventory')}>
                                    View All Cars
                                    <ChevronRight className="ml-1 w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* EMI Calculator */}
                    <section className="py-16 bg-white">
                        <div className="max-w-3xl mx-auto px-4">
                            <div className="text-center mb-8">
                                <span className="font-semibold uppercase tracking-wider text-sm" style={{ color: brandColors.primary }}>
                                    Finance Tool
                                </span>
                                <h2 className="text-3xl font-bold mt-2">Quick EMI Calculator</h2>
                                <p className="text-gray-600 mt-2">Get an instant estimate of your monthly payments</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-8 border" style={{ borderColor: `${brandColors.primary}30` }}>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Vehicle Price (₹)
                                        </label>
                                        <input
                                            type="number"
                                            value={emiPrice}
                                            onChange={(e) => { setEmiPrice(e.target.value); setEmiResult(null); }}
                                            placeholder="e.g. 800000"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-gray-900 bg-white"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button
                                            onClick={calculateEmi}
                                            className="rounded-xl text-white px-6 py-3 font-semibold w-full sm:w-auto"
                                            style={{ backgroundColor: brandColors.primary }}
                                        >
                                            <Calculator className="w-4 h-4 mr-2" />
                                            Calculate
                                        </Button>
                                    </div>
                                </div>
                                {emiResult !== null && (
                                    <div className="mt-6 p-5 rounded-xl text-center" style={{ backgroundColor: `${brandColors.primary}10`, borderLeft: `4px solid ${brandColors.primary}` }}>
                                        <p className="text-sm text-gray-600 mb-1">Approx. Monthly EMI</p>
                                        <p className="text-4xl font-bold" style={{ color: brandColors.primary }}>
                                            ₹{emiResult.toLocaleString('en-IN')}
                                            <span className="text-lg font-normal text-gray-600">/month</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">*Indicative estimate for 5-year loan at ~10% p.a. Actual EMI depends on bank terms.</p>
                                    </div>
                                )}
                            </div>
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
                                        Have questions? Our friendly team is ready to help you find the perfect car for your family.
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
                                </div>

                                {/* Form */}
                                <div className="bg-white rounded-2xl shadow-xl p-8">
                                    {formStatus === 'sent' ? (
                                        <div className="text-center py-10">
                                            <Heart className="w-16 h-16 mx-auto mb-4" style={{ color: brandColors.primary }} />
                                            <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                                            <p className="text-gray-600">Our team will get back to you soon. We can&apos;t wait to help your family find the perfect car!</p>
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
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-gray-900 bg-gray-50"
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
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-gray-900 bg-gray-50"
                                                    placeholder="Your phone number"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-gray-900 bg-gray-50"
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                                <textarea
                                                    rows={4}
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none text-gray-900 bg-gray-50 resize-none"
                                                    placeholder="Which car are you looking for? Any specific requirements?"
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
            {activeTab === 'inventory' && (
                <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4">
                        <h1 className="text-4xl font-bold mb-8">Our Inventory</h1>
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-72">
                                <div className="sticky top-24 bg-white rounded-2xl shadow-sm p-6"><CarFilters /></div>
                            </div>
                            <div className="flex-1"><CarGrid cars={cars} brandColor={brandColors.primary} light /></div>
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
                                src={`/assets/logos/${brandName.toLowerCase().replace(/\s+/g, '-')}.png`}
                                alt={brandName}
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

                    <div className="grid md:grid-cols-3 gap-8">
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
                        <div>
                            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
                            <div className="space-y-2 text-gray-600">
                                <button onClick={() => setActiveTab('home')} className="block hover:text-gray-900">Home</button>
                                <button onClick={() => setActiveTab('inventory')} className="block hover:text-gray-900">Inventory</button>
                                <a href="#contact" className="block hover:text-gray-900">Contact</a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-4">{dealerName}</h4>
                            <p className="text-gray-600">Your trusted partner for family-friendly vehicles. We&apos;re here to help you find the perfect car.</p>
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

            {/* WhatsApp Float Button */}
            <WhatsAppButton phone={contactInfo.phone} />
        </div>
    );
}

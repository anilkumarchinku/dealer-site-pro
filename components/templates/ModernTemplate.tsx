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
import { generateTemplateConfig } from '@/lib/templates';
import { getBrandHeroImage } from '@/lib/utils/brand-hero';
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
    Send,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { EnquireSidebar } from '@/components/cars/EnquireSidebar';
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
}: ModernTemplateProps) {
    const [activeTab, setActiveTab] = useState<'inventory' | 'home'>('home');
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeCarIndex, setActiveCarIndex] = useState(0);
    const [enquireSidebarOpen, setEnquireSidebarOpen] = useState(false);

    // Lead form state
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    // Get template configuration with brand colors
    const config = generateTemplateConfig(brandName, 'family');
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

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Navigation */}
            <nav
                className={`fixed ${previewMode ? 'top-12' : 'top-0'} left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('home')}>
                            <div className="relative w-10 h-10 mr-3">
                                <Image
                                    src={`/assets/logos/${brandName.toLowerCase().replace(/\s+/g, '-')}.png`}
                                    alt={brandName}
                                    fill
                                    className="object-contain transition-all duration-300"
                                    sizes="40px"
                                    style={{
                                        filter: isScrolled
                                            ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.25)) saturate(1.3)'
                                            : 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,255,255,0.9)) drop-shadow(0 0 20px rgba(255,255,255,0.5))'
                                    }}
                                />
                            </div>
                            <span className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                                {dealerName}
                            </span>
                        </div>

                        {/* Nav Links */}
                        <div className="hidden md:flex items-center gap-6">
                            <button
                                onClick={() => setActiveTab('home')}
                                className={`font-medium transition-colors ${
                                    activeTab === 'home'
                                        ? isScrolled ? 'text-gray-900' : 'text-white'
                                        : isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
                                }`}
                                style={activeTab === 'home' ? { color: brandColors.primary } : {}}
                            >
                                Home
                            </button>
                            <button
                                onClick={() => setActiveTab('inventory')}
                                className={`font-medium transition-colors ${
                                    activeTab === 'inventory'
                                        ? isScrolled ? 'text-gray-900' : 'text-white'
                                        : isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
                                }`}
                                style={activeTab === 'inventory' ? { color: brandColors.primary } : {}}
                            >
                                Inventory
                            </button>
                            <a
                                href="#contact"
                                className={`font-medium transition-colors ${
                                    isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
                                }`}
                            >
                                Contact
                            </a>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className={`hidden sm:flex bg-transparent ${isScrolled ? 'text-gray-700 border-gray-300 hover:bg-gray-100' : 'text-white border-white/40 hover:bg-white/10'}`}
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
                        </div>
                    </div>
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

            {/* Home Tab */}
            {activeTab === 'home' && (
                <>
                    {/* Hero Section */}
                    <section className="relative min-h-[85vh] flex items-center bg-gray-900 overflow-hidden">
                        <div className="absolute inset-0">
                            <Image
                                src={getBrandHeroImage(brandName)}
                                alt={`${brandName} Hero`}
                                fill
                                className="object-cover opacity-40"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
                        </div>

                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                {/* Text */}
                                <div className="text-white space-y-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
                                        <span className="text-sm font-medium text-white/90">{dealerName}</span>
                                    </div>
                                    <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                                        {heroTitle}
                                    </h1>
                                    <p className="text-xl text-gray-300">{heroSubtitle}</p>
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
                                            className="bg-transparent text-white border-white/40 hover:bg-white/10"
                                            asChild
                                        >
                                            <a href="#contact">Get a Quote</a>
                                        </Button>
                                    </div>
                                </div>

                                {/* Featured Car Card */}
                                {featuredCars.length > 0 && (
                                    <div className="hidden lg:block">
                                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
                                            <div className="aspect-video relative">
                                                <Image
                                                    src={featuredCars[activeCarIndex].images.hero}
                                                    alt={featuredCars[activeCarIndex].model}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-2xl font-bold text-white mb-2">
                                                    {featuredCars[activeCarIndex].make}{' '}
                                                    {featuredCars[activeCarIndex].model}
                                                </h3>
                                                <p
                                                    className="text-3xl font-bold"
                                                    style={{ color: brandColors.primary }}
                                                >
                                                    {(featuredCars[activeCarIndex].pricing.exShowroom.min ?? 0).toLocaleString(
                                                        'en-IN',
                                                        { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                                <Button variant="outline" onClick={() => setActiveTab('inventory')}>
                                    View All
                                    <ChevronRight className="ml-1 w-4 h-4" />
                                </Button>
                            </div>
                            <CarGrid cars={featuredCars} brandColor={brandColors.primary} />
                        </div>
                    </section>

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
            {activeTab === 'inventory' && (
                <div className="pt-20 pb-12 bg-gray-50 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-gray-900">Our Inventory</h1>
                            <p className="text-gray-600 mt-2">Browse {cars.length}+ quality vehicles</p>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-72">
                                <div className="sticky top-24 bg-white rounded-xl shadow-sm p-6">
                                    <CarFilters />
                                </div>
                            </div>
                            <div className="flex-1">
                                <CarGrid cars={cars} brandColor={brandColors.primary} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Brand Logo */}
                    <div className="flex items-center mb-8 pb-6 border-b border-gray-800">
                        <div className="relative w-12 h-12 mr-3">
                            <Image
                                src={`/assets/logos/${brandName.toLowerCase().replace(/\s+/g, '-')}.png`}
                                alt={brandName}
                                fill
                                className="object-contain"
                                sizes="48px"
                                style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 12px rgba(255,255,255,0.9)) drop-shadow(0 0 24px rgba(255,255,255,0.5))' }}
                            />
                        </div>
                        <div>
                            <span className="text-2xl font-bold block">{dealerName}</span>
                            <span className="text-sm text-gray-400">Your trusted automotive partner</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
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
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                            <div className="space-y-2">
                                <button onClick={() => setActiveTab('home')} className="block hover:text-gray-300">
                                    Home
                                </button>
                                <button onClick={() => setActiveTab('inventory')} className="block hover:text-gray-300">
                                    Inventory
                                </button>
                                <a href="#contact" className="block hover:text-gray-300">Contact</a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">{dealerName}</h4>
                            <p className="text-gray-400">
                                Your trusted partner for quality vehicles. Committed to transparency and customer
                                satisfaction.
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
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

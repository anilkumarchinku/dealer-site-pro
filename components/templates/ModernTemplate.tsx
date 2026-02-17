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
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface ModernTemplateProps {
    brandName: string; // Brand name for colors (e.g., "Toyota", "BMW")
    dealerName: string;
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
}

export function ModernTemplate({
    brandName,
    dealerName,
    cars,
    contactInfo,
    config: customConfig,
    previewMode,
}: ModernTemplateProps) {
    const [activeTab, setActiveTab] = useState<'inventory' | 'home'>('home');
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeCarIndex, setActiveCarIndex] = useState(0);

    // Get template configuration with brand colors
    const config = generateTemplateConfig(brandName, 'modern');
    const { brandColors } = config;

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Show all cars instead of just 6
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
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 bg-white shadow-sm">
                                <div className="relative w-8 h-8">
                                    <Image
                                        src={`/assets/logos/${brandName.toLowerCase().replace(/\s+/g, '-')}.png`}
                                        alt={brandName}
                                        fill
                                        className="object-contain"
                                        sizes="32px"
                                    />
                                </div>
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
                                        ? isScrolled
                                            ? 'text-gray-900'
                                            : 'text-white'
                                        : isScrolled
                                        ? 'text-gray-600 hover:text-gray-900'
                                        : 'text-white/80 hover:text-white'
                                }`}
                                style={activeTab === 'home' ? { color: brandColors.primary } : {}}
                            >
                                Home
                            </button>
                            <button
                                onClick={() => setActiveTab('inventory')}
                                className={`font-medium transition-colors ${
                                    activeTab === 'inventory'
                                        ? isScrolled
                                            ? 'text-gray-900'
                                            : 'text-white'
                                        : isScrolled
                                        ? 'text-gray-600 hover:text-gray-900'
                                        : 'text-white/80 hover:text-white'
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

                        {/* CTA Button */}
                        <Button
                            className="text-white shadow-lg"
                            style={{ backgroundColor: brandColors.primary }}
                        >
                            <Phone className="w-4 h-4 mr-2" />
                            Call Now
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Home Tab */}
            {activeTab === 'home' && (
                <>
                    {/* Hero Section */}
                    <section className="relative min-h-[85vh] flex items-center bg-gray-900 overflow-hidden">
                        {/* Background */}
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

                        {/* Content */}
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
                                    <div className="flex gap-4">
                                        <Button
                                            size="lg"
                                            className="text-white"
                                            style={{ backgroundColor: brandColors.primary }}
                                            onClick={() => setActiveTab('inventory')}
                                        >
                                            View Inventory
                                            <ArrowRight className="ml-2 w-5 h-5" />
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
                                                    {featuredCars[activeCarIndex].pricing.exShowroom.min.toLocaleString(
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
            <footer id="contact" className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Brand Logo */}
                    <div className="flex items-center mb-8 pb-6 border-b border-gray-800">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-3 bg-white">
                            <div className="relative w-10 h-10">
                                <Image
                                    src={`/assets/logos/${brandName.toLowerCase().replace(/\s+/g, '-')}.png`}
                                    alt={brandName}
                                    fill
                                    className="object-contain"
                                    sizes="40px"
                                />
                            </div>
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
                    </div>
                </div>
            </footer>
        </div>
    );
}

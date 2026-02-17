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
import { generateTemplateConfig } from '@/lib/templates';
import { getBrandHeroImage } from '@/lib/utils/brand-hero';
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
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { EnquireSidebar } from '@/components/cars/EnquireSidebar';
import type { Service } from '@/lib/types';

interface SportyTemplateProps {
    brandName: string;
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
        tagline?: string;
    };
    previewMode?: boolean;
    services?: Service[];
}

export function SportyTemplate({
    brandName,
    dealerName,
    cars,
    contactInfo,
    config: customConfig,
    previewMode,
    services,
}: SportyTemplateProps) {
    const [activeTab, setActiveTab] = useState<'inventory' | 'home'>('home');
    const [isScrolled, setIsScrolled] = useState(false);
    const [enquireSidebarOpen, setEnquireSidebarOpen] = useState(false);

    // Get template configuration with brand colors
    const config = generateTemplateConfig(brandName, 'sporty');
    const { brandColors } = config;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Show all cars instead of just 6
    const featuredCars = cars;
    const heroTitle = customConfig?.heroTitle || 'UNLEASH THE POWER';
    const heroSubtitle = customConfig?.heroSubtitle || 'Experience raw performance';
    const tagline = customConfig?.tagline || 'Built for Speed';

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            {/* Navigation */}
            <nav className={`fixed ${previewMode ? 'top-12' : 'top-0'} left-0 right-0 z-50 transition-all ${isScrolled ? 'bg-black/95 backdrop-blur-lg' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('home')}>
                            <div className="relative w-10 h-10 mr-3">
                                <Image
                                    src={`/assets/logos/${brandName.toLowerCase().replace(/\s+/g, '-')}.png`}
                                    alt={brandName}
                                    fill
                                    className="object-contain"
                                    sizes="40px"
                                    style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,255,255,0.9)) drop-shadow(0 0 20px rgba(255,255,255,0.5))' }}
                                />
                            </div>
                            <span className="text-xl font-bold">{dealerName}</span>
                        </div>
                        <div className="hidden md:flex items-center gap-6">
                            <button
                                onClick={() => setActiveTab('home')}
                                className="font-bold uppercase text-sm tracking-wider hover:opacity-80"
                                style={activeTab === 'home' ? { color: brandColors.primary } : {}}
                            >
                                Home
                            </button>
                            <button
                                onClick={() => setActiveTab('inventory')}
                                className="font-bold uppercase text-sm tracking-wider hover:opacity-80"
                                style={activeTab === 'inventory' ? { color: brandColors.primary } : {}}
                            >
                                Inventory
                            </button>
                            <a href="#contact" className="font-bold uppercase text-sm tracking-wider hover:opacity-80">
                                Contact
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                className="text-white font-bold hidden sm:flex"
                                style={{ backgroundColor: `${brandColors.primary}cc` }}
                                onClick={() => setEnquireSidebarOpen(true)}
                            >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                ENQUIRE
                            </Button>
                            <Button className="text-white font-bold" style={{ backgroundColor: brandColors.primary }} asChild>
                                <a href={`tel:${contactInfo.phone}`}>
                                    <Phone className="w-4 h-4 mr-2" />
                                    CALL NOW
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
                    <section className="relative min-h-screen flex items-center overflow-hidden">
                        <div className="absolute inset-0">
                            <Image src={getBrandHeroImage(brandName)} alt={`${brandName} Hero`} fill className="object-cover opacity-30" priority />
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />
                            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(0,0,0,0.9) 0%, ${brandColors.primary}22 100%)` }} />
                        </div>
                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                            <div className="max-w-3xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="inline-block px-4 py-2 rounded-md font-bold text-sm uppercase tracking-wider" style={{ backgroundColor: `${brandColors.primary}33`, borderLeft: `4px solid ${brandColors.primary}` }}>
                                        {tagline}
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 backdrop-blur-sm border border-white/20">
                                        <span className="text-xs font-bold uppercase tracking-wider text-white/80">{dealerName}</span>
                                    </div>
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black leading-none mb-6 tracking-tight">
                                    {heroTitle.split(' ').map((word, i) => (
                                        <span key={i} className={i === heroTitle.split(' ').length - 1 ? 'block' : ''} style={i === heroTitle.split(' ').length - 1 ? { color: brandColors.primary } : {}}>
                                            {word}{' '}
                                        </span>
                                    ))}
                                </h1>
                                <p className="text-2xl text-gray-300 mb-8">{heroSubtitle}</p>
                                <div className="flex gap-4">
                                    <Button size="lg" className="text-white font-bold text-lg uppercase tracking-wider" style={{ backgroundColor: brandColors.primary }} onClick={() => setActiveTab('inventory')}>
                                        EXPLORE
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats */}
                    <section className="py-16 border-y" style={{ borderColor: `${brandColors.primary}33` }}>
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { icon: Gauge, value: '0-100', label: 'KM/H IN 3.2S' },
                                    { icon: Zap, value: '500+', label: 'HORSEPOWER' },
                                    { icon: Timer, value: '10k+', label: 'SATISFIED RIDERS' },
                                    { icon: Flame, value: '4.9★', label: 'PERFORMANCE RATING' },
                                ].map((stat, i) => (
                                    <div key={i} className="text-center">
                                        <stat.icon className="w-10 h-10 mx-auto mb-3" style={{ color: brandColors.primary }} />
                                        <p className="text-4xl font-black mb-1" style={{ color: brandColors.primary }}>{stat.value}</p>
                                        <p className="text-xs uppercase tracking-wider text-gray-400">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Featured Cars */}
                    <section className="py-20">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="flex justify-between items-end mb-12">
                                <div>
                                    <span className="font-black text-sm uppercase tracking-widest" style={{ color: brandColors.primary }}>
                                        PERFORMANCE LINEUP
                                    </span>
                                    <h2 className="text-5xl font-black mt-2">FEATURED BEASTS</h2>
                                </div>
                                <Button variant="outline" className="border-2 font-bold uppercase" style={{ borderColor: brandColors.primary, color: brandColors.primary }} onClick={() => setActiveTab('inventory')}>
                                    VIEW ALL
                                    <ChevronRight className="ml-1 w-4 h-4" />
                                </Button>
                            </div>
                            <CarGrid cars={featuredCars} brandColor={brandColors.primary} />
                        </div>
                    </section>

                    {/* Why Choose Us */}
                    <section className="py-20 border-t" style={{ borderColor: `${brandColors.primary}33` }}>
                        <div className="max-w-7xl mx-auto px-4">
                            <h2 className="text-5xl font-black text-center mb-16">THE EDGE</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { icon: Shield, title: 'CERTIFIED', desc: 'Performance Verified' },
                                    { icon: Activity, title: 'TRACK-READY', desc: 'Race Tested' },
                                    { icon: TrendingUp, title: 'TOP SPEED', desc: 'Maximum Performance' },
                                    { icon: Flame, title: 'UNLEASHED', desc: 'Pure Power' },
                                ].map((feature, i) => (
                                    <div key={i} className="p-6 rounded-lg border-2 hover:bg-white/5 transition-colors" style={{ borderColor: `${brandColors.primary}33` }}>
                                        <feature.icon className="w-10 h-10 mb-4" style={{ color: brandColors.primary }} />
                                        <h3 className="text-xl font-black mb-2 uppercase">{feature.title}</h3>
                                        <p className="text-gray-400">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
                <div className="pt-20 pb-12 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="mb-8">
                            <h1 className="text-5xl font-black uppercase">INVENTORY</h1>
                            <p className="text-gray-400 mt-2">{cars.length}+ Performance Machines</p>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-72">
                                <div className="sticky top-24 bg-white/5 rounded-lg backdrop-blur-lg p-6 border" style={{ borderColor: `${brandColors.primary}33` }}>
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
            <footer id="contact" className="border-t py-12" style={{ borderColor: `${brandColors.primary}33` }}>
                <div className="max-w-7xl mx-auto px-4">
                    {/* Brand Logo */}
                    <div className="flex items-center mb-8 pb-6 border-b" style={{ borderColor: `${brandColors.primary}33` }}>
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
                            <span className="text-2xl font-black block">{dealerName}</span>
                            <span className="text-sm text-gray-400 uppercase tracking-wider">Built for Speed</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="text-lg font-black uppercase mb-4">CONTACT</h4>
                            <div className="space-y-3 text-gray-400">
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
                            <h4 className="text-lg font-black uppercase mb-4">QUICK LINKS</h4>
                            <div className="space-y-2 text-gray-400">
                                <button onClick={() => setActiveTab('home')} className="block hover:text-white">Home</button>
                                <button onClick={() => setActiveTab('inventory')} className="block hover:text-white">Inventory</button>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-black uppercase mb-4">{dealerName}</h4>
                            <p className="text-gray-400">Performance vehicles for those who demand the best. Experience the thrill.</p>
                        </div>
                    </div>
                    <div className="border-t mt-8 pt-8 text-center text-gray-400" style={{ borderColor: `${brandColors.primary}33` }}>
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
        </div>
    );
}

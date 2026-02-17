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
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface FamilyTemplateProps {
    brandName: string;
    dealerName: string;
    cars: Car[];
    contactInfo: { phone: string; email: string; address: string };
    config?: { heroTitle?: string; heroSubtitle?: string; tagline?: string };
    previewMode?: boolean;
}

export function FamilyTemplate({ brandName, dealerName, cars, contactInfo, config: customConfig, previewMode }: FamilyTemplateProps) {
    const [activeTab, setActiveTab] = useState<'inventory' | 'home'>('home');
    const [isScrolled, setIsScrolled] = useState(false);

    const config = generateTemplateConfig(brandName, 'family');
    const { brandColors } = config;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Show all cars instead of just 6
    const featuredCars = cars;
    const heroTitle = customConfig?.heroTitle || 'Your Family\'s Perfect Car Awaits';
    const heroSubtitle = customConfig?.heroSubtitle || 'Safe, reliable, and affordable vehicles';
    const tagline = customConfig?.tagline || 'Trusted by Families';

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <nav className={`fixed ${previewMode ? 'top-12' : 'top-0'} left-0 right-0 z-50 transition-all ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95'}`}>
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 shadow-sm">
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
                            <span className="text-xl font-semibold">{dealerName}</span>
                        </div>
                        <div className="hidden md:flex items-center gap-6">
                            <button onClick={() => setActiveTab('home')} className="font-medium hover:opacity-70" style={activeTab === 'home' ? { color: brandColors.primary } : {}}>Home</button>
                            <button onClick={() => setActiveTab('inventory')} className="font-medium hover:opacity-70" style={activeTab === 'inventory' ? { color: brandColors.primary } : {}}>Inventory</button>
                            <a href="#contact" className="font-medium hover:opacity-70">Contact</a>
                        </div>
                        <Button className="rounded-full text-white" style={{ backgroundColor: brandColors.primary }}>
                            <Phone className="w-4 h-4 mr-2" />
                            Call Us
                        </Button>
                    </div>
                </div>
            </nav>

            {activeTab === 'home' && (
                <>
                    <section className="relative pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: `${brandColors.primary}20`, color: brandColors.primary }}>
                                            {tagline}
                                        </div>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold text-gray-700" style={{ borderColor: `${brandColors.primary}40`, backgroundColor: `${brandColors.primary}08` }}>
                                            {dealerName}
                                        </div>
                                    </div>
                                    <h1 className="text-5xl md:text-6xl font-bold leading-tight">{heroTitle}</h1>
                                    <p className="text-xl text-gray-600">{heroSubtitle}</p>
                                    <div className="flex gap-4">
                                        <Button size="lg" className="rounded-full text-white" style={{ backgroundColor: brandColors.primary }} onClick={() => setActiveTab('inventory')}>
                                            Browse Cars
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                                    <Image src={getBrandHeroImage(brandName)} alt={`${brandName} Family`} fill className="object-cover" priority />
                                </div>
                            </div>
                        </div>
                    </section>

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

                    <section className="py-20 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="text-center mb-12">
                                <span className="font-semibold uppercase tracking-wider text-sm" style={{ color: brandColors.primary }}>
                                    Our Collection
                                </span>
                                <h2 className="text-4xl font-bold mt-2">Family-Friendly Vehicles</h2>
                            </div>
                            <CarGrid cars={featuredCars} brandColor={brandColors.primary} />
                            <div className="text-center mt-8">
                                <Button variant="outline" size="lg" className="rounded-full" onClick={() => setActiveTab('inventory')}>
                                    View All Cars
                                    <ChevronRight className="ml-1 w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </section>

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
                </>
            )}

            {activeTab === 'inventory' && (
                <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4">
                        <h1 className="text-4xl font-bold mb-8">Our Inventory</h1>
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-72">
                                <div className="sticky top-24 bg-white rounded-2xl shadow-sm p-6"><CarFilters /></div>
                            </div>
                            <div className="flex-1"><CarGrid cars={cars} brandColor={brandColors.primary} /></div>
                        </div>
                    </div>
                </div>
            )}

            <footer id="contact" className="bg-gray-50 border-t border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Brand Logo */}
                    <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3 bg-gray-100">
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
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
                            <div className="space-y-2 text-gray-600">
                                <button onClick={() => setActiveTab('home')} className="block hover:text-gray-900">Home</button>
                                <button onClick={() => setActiveTab('inventory')} className="block hover:text-gray-900">Inventory</button>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-4">{dealerName}</h4>
                            <p className="text-gray-600">Your trusted partner for family-friendly vehicles. We're here to help you find the perfect car.</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
                        <p>© {new Date().getFullYear()} {dealerName}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

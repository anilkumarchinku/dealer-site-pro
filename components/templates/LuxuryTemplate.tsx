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
import { generateTemplateConfig } from '@/lib/templates';
import { getBrandHeroImage } from '@/lib/utils/brand-hero';
import { ArrowRight, Phone, MapPin, Mail, Award, ShieldCheck, Star, ChevronRight, Crown } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LuxuryTemplateProps {
    brandName: string;
    dealerName: string;
    cars: Car[];
    contactInfo: { phone: string; email: string; address: string };
    config?: { heroTitle?: string; heroSubtitle?: string; tagline?: string };
    previewMode?: boolean;
}

export function LuxuryTemplate({ brandName, dealerName, cars, contactInfo, config: customConfig, previewMode }: LuxuryTemplateProps) {
    const [activeTab, setActiveTab] = useState<'inventory' | 'home'>('home');
    const [isScrolled, setIsScrolled] = useState(false);

    const config = generateTemplateConfig(brandName, 'luxury');
    const { brandColors } = config;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Show all cars instead of just 6
    const featuredCars = cars;
    const heroTitle = customConfig?.heroTitle || 'THE ART OF PERFORMANCE';
    const heroSubtitle = customConfig?.heroSubtitle || 'Experience automotive excellence';
    const tagline = customConfig?.tagline || 'Excellence in Motion';

    return (
        <div className="min-h-screen bg-gray-900 text-white font-serif">
            <nav className={`fixed ${previewMode ? 'top-12' : 'top-0'} left-0 right-0 z-50 transition-all ${isScrolled ? 'bg-gray-900/95 backdrop-blur-lg' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 backdrop-blur-sm">
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
                            <span className="text-2xl font-light tracking-widest">{dealerName}</span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <button onClick={() => setActiveTab('home')} className="text-sm tracking-wider hover:opacity-70" style={activeTab === 'home' ? { color: brandColors.primary } : {}}>Home</button>
                            <button onClick={() => setActiveTab('inventory')} className="text-sm tracking-wider hover:opacity-70" style={activeTab === 'inventory' ? { color: brandColors.primary } : {}}>Collection</button>
                            <a href="#contact" className="text-sm tracking-wider hover:opacity-70">Contact</a>
                        </div>
                        <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                            <Phone className="w-4 h-4 mr-2" />
                            Inquire
                        </Button>
                    </div>
                </div>
            </nav>

            {activeTab === 'home' && (
                <>
                    <section className="relative min-h-screen flex items-center">
                        <div className="absolute inset-0">
                            <Image src={getBrandHeroImage(brandName)} alt={`${brandName} Luxury`} fill className="object-cover opacity-20" priority />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-gray-900/80" />
                        </div>
                        <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 text-center">
                            <p className="text-sm tracking-widest uppercase mb-4" style={{ color: brandColors.primary }}>{tagline}</p>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-6">
                                <Crown className="w-3.5 h-3.5 text-white/60" />
                                <span className="text-sm font-light tracking-widest text-white/80">{dealerName}</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-8 leading-tight">{heroTitle}</h1>
                            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">{heroSubtitle}</p>
                            <Button size="lg" className="text-white" style={{ backgroundColor: brandColors.primary }} onClick={() => setActiveTab('inventory')}>
                                Explore Collection
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </section>

                    <section className="py-24 bg-black">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="text-center mb-16">
                                <span className="text-sm tracking-widest uppercase" style={{ color: brandColors.primary }}>Curated Selection</span>
                                <h2 className="text-5xl font-light mt-4">Featured Collection</h2>
                            </div>
                            <CarGrid cars={featuredCars} brandColor={brandColors.primary} />
                        </div>
                    </section>

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
                                        <f.icon className="w-12 h-12 mx-auto mb-6" style={{ color: brandColors.primary }} />
                                        <h3 className="text-2xl font-light mb-4">{f.title}</h3>
                                        <p className="text-gray-400">{f.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            )}

            {activeTab === 'inventory' && (
                <div className="pt-24 pb-12 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4">
                        <h1 className="text-5xl font-light mb-12">Our Collection</h1>
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-72">
                                <div className="sticky top-24 bg-white/5 rounded-lg p-6"><CarFilters /></div>
                            </div>
                            <div className="flex-1"><CarGrid cars={cars} brandColor={brandColors.primary} /></div>
                        </div>
                    </div>
                </div>
            )}

            <footer id="contact" className="border-t border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Brand Logo */}
                    <div className="flex items-center mb-8 pb-6 border-b border-white/10">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-3 bg-white/10 backdrop-blur-sm">
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
                            <span className="text-2xl font-light tracking-widest block text-white">{dealerName}</span>
                            <span className="text-sm text-gray-400">Curating excellence since {new Date().getFullYear()}</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 text-gray-400">
                        <div>
                            <h4 className="text-white font-light text-lg mb-4">Contact</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2"><Phone className="w-4 h-4" style={{ color: brandColors.primary }} /><a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a></div>
                                <div className="flex items-center gap-2"><Mail className="w-4 h-4" style={{ color: brandColors.primary }} /><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></div>
                                <div className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-1" style={{ color: brandColors.primary }} /><span>{contactInfo.address}</span></div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-light text-lg mb-4">Links</h4>
                            <button onClick={() => setActiveTab('home')} className="block mb-2 hover:text-white">Home</button>
                            <button onClick={() => setActiveTab('inventory')} className="block hover:text-white">Collection</button>
                        </div>
                        <div>
                            <h4 className="text-white font-light text-lg mb-4">{dealerName}</h4>
                            <p>Curating excellence in automotive luxury.</p>
                        </div>
                    </div>
                    <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-500">
                        <p>© {new Date().getFullYear()} {dealerName}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

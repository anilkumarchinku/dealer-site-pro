/**
 * SiteHeader — Global header with search, mega menu, and mobile nav
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import {
    Menu,
    ChevronDown,
    Car,
    Star,
    ArrowRight,
    Bike,
} from 'lucide-react';
import { getBrandLogo } from '@/lib/data/brand-logos';
import BrandLogo from '@/components/BrandLogo';
import { FOUR_W_BODY_TYPES } from '@/lib/data/four-wheelers';

const POPULAR_BRANDS = [
    'Maruti Suzuki', 'Hyundai', 'Tata Motors', 'Kia', 'Mahindra',
    'Toyota', 'Honda', 'MG', 'Skoda', 'Volkswagen',
];

const BODY_TYPE_ICONS: Record<string, string> = {
    Hatchback: '🚗',
    Sedan: '🚘',
    SUV: '🚙',
    MPV: '🚐',
    Coupe: '🏎️',
    Convertible: '🌤️',
    Pickup: '🛻',
};

const BUDGET_RANGES = [
    { label: 'Under 5 Lakh', min: 0, max: 500000 },
    { label: '5 - 10 Lakh', min: 500000, max: 1000000 },
    { label: '10 - 15 Lakh', min: 1000000, max: 1500000 },
    { label: '15 - 20 Lakh', min: 1500000, max: 2000000 },
    { label: '20 - 30 Lakh', min: 2000000, max: 3000000 },
    { label: 'Above 30 Lakh', min: 3000000, max: 10000000 },
];

const NAV_ITEMS = [
    { label: 'New Cars', href: '/marketplace?category=4w' },
    { label: 'Bikes & Scooters', href: '/marketplace?category=2w' },
    { label: 'Autos & 3W', href: '/marketplace?category=3w' },
    { label: 'Brands', href: '/brands' },
    { label: 'EMI Calculator', href: '/tools/emi-calculator' },
    { label: 'Car Valuation', href: '/tools/car-valuation' },
    { label: 'On-Road Price', href: '/tools/on-road-price' },
    { label: 'Insurance', href: '/tools/insurance-estimator' },
    { label: 'Sell Car', href: '/sell' },
];

export function SiteHeader() {
    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
    const megaMenuRef = useRef<HTMLDivElement>(null);

    // Close mega menu on click outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
                setActiveMegaMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <header className="sticky top-0 z-50 border-b border-[#FFFDF7]/10 bg-[#0B0E12] text-[#FFFDF7] shadow-[0_18px_40px_rgba(11,14,18,0.24)]">
            {/* Main Nav Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 gap-4">
                    {/* Logo */}
                    <div className="shrink-0">
                        <BrandLogo size="sm" />
                    </div>

                    {/* Desktop Nav Links */}
                    <nav className="hidden lg:flex items-center gap-1" ref={megaMenuRef}>
                        {/* New Cars with Mega Menu */}
                        <div className="relative">
                            <button
                                onMouseEnter={() => setActiveMegaMenu('cars')}
                                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                    activeMegaMenu === 'cars' ? 'bg-[#FFFDF7] text-[#0B0E12]' : 'text-[#B8AFA2] hover:bg-[#FFFDF7]/10 hover:text-[#FFFDF7]'
                                }`}
                            >
                                New Cars <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <Link href="/marketplace?category=2w" className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-[#B8AFA2] transition-colors hover:bg-[#FFFDF7]/10 hover:text-[#FFFDF7]">
                            <Bike className="w-3.5 h-3.5" /> Bikes
                        </Link>
                        <Link href="/marketplace?category=3w" className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-[#B8AFA2] transition-colors hover:bg-[#FFFDF7]/10 hover:text-[#FFFDF7]">
                            <span className="text-sm">🛺</span> Autos
                        </Link>
                        <Link href="/brands" className="rounded-md px-3 py-2 text-sm font-medium text-[#B8AFA2] transition-colors hover:bg-[#FFFDF7]/10 hover:text-[#FFFDF7]">
                            Brands
                        </Link>
                    </nav>

                    {/* Mobile: Hamburger */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80">
                                <SheetHeader>
                                    <SheetTitle className="flex items-center gap-2">
                                        <Car className="w-5 h-5 text-primary" />
                                        DealerSite Pro
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="mt-6 space-y-1">
                                    {NAV_ITEMS.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                    <Separator className="my-3" />
                                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Popular Brands</p>
                                    <div className="grid grid-cols-2 gap-1">
                                        {POPULAR_BRANDS.slice(0, 8).map((brand) => (
                                            <Link
                                                key={brand}
                                                href={`/marketplace?category=4w&q=${encodeURIComponent(brand)}`}
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                                            >
                                                {getBrandLogo(brand) ? (
                                                    <span className="inline-flex items-center justify-center rounded bg-white border border-slate-200 dark:border-slate-700 p-0.5 shrink-0">
                                                        <Image src={getBrandLogo(brand)!} alt={brand} width={18} height={18} unoptimized className="object-contain" />
                                                    </span>
                                                ) : (
                                                    <span className="w-[18px] h-[18px] rounded-full bg-muted text-[9px] font-bold flex items-center justify-center">{brand.charAt(0)}</span>
                                                )}
                                                {brand}
                                            </Link>
                                        ))}
                                    </div>
                                    <Separator className="my-3" />
                                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">By Budget</p>
                                    <div className="space-y-0.5">
                                        {BUDGET_RANGES.map((range) => (
                                            <Link
                                                key={range.label}
                                                href="/marketplace?category=4w"
                                                className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                                            >
                                                {range.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            {/* Mega Menu Dropdown */}
            {activeMegaMenu === 'cars' && (
                <div
                    className="absolute left-0 right-0 z-40 hidden border-b border-[#DED6CA] bg-[#FFFDF7] text-[#0B0E12] shadow-lg lg:block"
                    onMouseLeave={() => setActiveMegaMenu(null)}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="grid grid-cols-4 gap-8">
                            {/* Popular Brands */}
                            <div>
                                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#756F66]">Popular Brands</h3>
                                <div className="space-y-0.5">
                                    {POPULAR_BRANDS.map((brand) => (
                                        <Link
                                            key={brand}
                                            href={`/marketplace?category=4w&q=${encodeURIComponent(brand)}`}
                                            className="flex items-center gap-2.5 py-1.5 text-sm transition-colors hover:text-[#A8793A]"
                                            onClick={() => setActiveMegaMenu(null)}
                                        >
                                            {getBrandLogo(brand) ? (
                                                <span className="inline-flex items-center justify-center rounded bg-white border border-slate-200 dark:border-slate-700 p-0.5 shrink-0">
                                                    <Image src={getBrandLogo(brand)!} alt={brand} width={20} height={20} unoptimized className="object-contain" />
                                                </span>
                                            ) : (
                                                <span className="w-5 h-5 rounded-full bg-muted text-[10px] font-bold flex items-center justify-center">{brand.charAt(0)}</span>
                                            )}
                                            {brand}
                                        </Link>
                                    ))}
                                    <Link
                                        href="/brands"
                                        className="flex items-center gap-1 py-1.5 text-sm font-medium text-[#A8793A]"
                                        onClick={() => setActiveMegaMenu(null)}
                                    >
                                        View All Brands <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>

                            {/* Body Types */}
                            <div>
                                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#756F66]">By Body Type</h3>
                                <div className="space-y-1">
                                    {FOUR_W_BODY_TYPES.map((type) => (
                                        <Link
                                            key={type}
                                            href={`/marketplace?category=4w&q=${encodeURIComponent(type)}`}
                                            className="flex items-center gap-2 py-1.5 text-sm transition-colors hover:text-[#A8793A]"
                                            onClick={() => setActiveMegaMenu(null)}
                                        >
                                            <span className="text-base">{BODY_TYPE_ICONS[type] ?? '🚗'}</span>
                                            {type}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Budget Ranges */}
                            <div>
                                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#756F66]">By Budget</h3>
                                <div className="space-y-1">
                                    {BUDGET_RANGES.map((range) => (
                                        <Link
                                            key={range.label}
                                            href="/marketplace?category=4w"
                                            className="block py-1.5 text-sm transition-colors hover:text-[#A8793A]"
                                            onClick={() => setActiveMegaMenu(null)}
                                        >
                                            {range.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#756F66]">Explore</h3>
                                <div className="space-y-1">
                                    <Link
                                        href="/marketplace?category=4w"
                                        className="flex items-center gap-2 py-1.5 text-sm transition-colors hover:text-[#A8793A]"
                                        onClick={() => setActiveMegaMenu(null)}
                                    >
                                        <Star className="w-4 h-4" /> All Cars
                                    </Link>
                                    <Link
                                        href="/marketplace?category=2w"
                                        className="flex items-center gap-2 py-1.5 text-sm transition-colors hover:text-[#A8793A]"
                                        onClick={() => setActiveMegaMenu(null)}
                                    >
                                        <Bike className="w-4 h-4" /> Bikes & Scooters
                                    </Link>
                                    <Link
                                        href="/marketplace?category=3w"
                                        className="flex items-center gap-2 py-1.5 text-sm transition-colors hover:text-[#A8793A]"
                                        onClick={() => setActiveMegaMenu(null)}
                                    >
                                        <span className="text-base">🛺</span> Autos & 3W
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </header>
    );
}

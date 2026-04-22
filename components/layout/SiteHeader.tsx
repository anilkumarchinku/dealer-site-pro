/**
 * SiteHeader — Global header with search, mega menu, and mobile nav
 * CarDekho/Cars24 style navigation
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import {
    Search,
    Menu,
    X,
    ChevronDown,
    Car,
    Fuel,
    Calculator,
    Star,
    TrendingUp,
    ArrowRight,
    Bike,
} from 'lucide-react';
import type { Car as CarType } from '@/lib/types/car';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
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
    { label: 'New Cars', href: '/cars' },
    { label: 'Bikes & Scooters', href: '/#two-wheelers' },
    { label: 'Autos & 3W', href: '/#three-wheelers' },
    { label: 'Brands', href: '/brands' },
    { label: 'EMI Calculator', href: '/tools/emi-calculator' },
    { label: 'Car Valuation', href: '/tools/car-valuation' },
    { label: 'On-Road Price', href: '/tools/on-road-price' },
    { label: 'Insurance', href: '/tools/insurance-estimator' },
    { label: 'Sell Car', href: '/sell' },
];

export function SiteHeader() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<CarType[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const megaMenuRef = useRef<HTMLDivElement>(null);

    // Search with debounce
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`/api/cars?searchQuery=${encodeURIComponent(searchQuery)}&limit=6`);
                const data = await res.json();
                if (data.success) {
                    setSearchResults(data.data.cars);
                }
            } catch {
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Close search on click outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

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

    const handleSearchSelect = (carId: string) => {
        setIsSearchOpen(false);
        setSearchQuery('');
        router.push(`/cars/${carId}`);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearchOpen(false);
            router.push(`/cars?searchQuery=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    return (
        <header className="bg-background border-b sticky top-0 z-50">
            {/* Main Nav Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 gap-4">
                    {/* Logo */}
                    <div className="shrink-0">
                        <BrandLogo size="sm" />
                    </div>

                    {/* Search Bar — Desktop */}
                    <div ref={searchRef} className="hidden md:block relative flex-1 max-w-lg">
                        <form onSubmit={handleSearchSubmit}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search cars, brands, models..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsSearchOpen(true);
                                }}
                                onFocus={() => setIsSearchOpen(true)}
                                className="pl-9 h-9 bg-muted/50"
                            />
                        </form>

                        {/* Search Dropdown */}
                        {isSearchOpen && (searchResults.length > 0 || isSearching) && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg overflow-hidden z-50">
                                {isSearching && (
                                    <div className="px-4 py-3 text-sm text-muted-foreground">Searching...</div>
                                )}
                                {searchResults.map((car) => (
                                    <button
                                        key={car.id}
                                        onClick={() => handleSearchSelect(car.id)}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                                    >
                                        <div className="relative w-12 h-8 bg-muted rounded overflow-hidden shrink-0">
                                            {car.images.hero ? (
                                                <Image src={car.images.hero} alt="" fill unoptimized className="object-cover" />
                                            ) : (
                                                <Car className="w-4 h-4 m-auto text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate flex items-center gap-1.5">
                                                {getBrandLogo(car.make) && (
                                                    <Image src={getBrandLogo(car.make)!} alt={car.make} width={16} height={16} unoptimized className="object-contain shrink-0" />
                                                )}
                                                {car.make} {car.model}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{formatPriceInLakhs(car.pricing.exShowroom.min)}</p>
                                        </div>
                                    </button>
                                ))}
                                {searchQuery.trim() && !isSearching && (
                                    <button
                                        onClick={handleSearchSubmit as any}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-primary hover:bg-muted/50 border-t"
                                    >
                                        <Search className="w-3.5 h-3.5" />
                                        Search all cars for &ldquo;{searchQuery}&rdquo;
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Desktop Nav Links */}
                    <nav className="hidden lg:flex items-center gap-1" ref={megaMenuRef}>
                        {/* New Cars with Mega Menu */}
                        <div className="relative">
                            <button
                                onMouseEnter={() => setActiveMegaMenu('cars')}
                                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                    activeMegaMenu === 'cars' ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                New Cars <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <Link href="/#two-wheelers" className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md transition-colors">
                            <Bike className="w-3.5 h-3.5" /> Bikes
                        </Link>
                        <Link href="/#three-wheelers" className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md transition-colors">
                            <span className="text-sm">🛺</span> Autos
                        </Link>
                        <Link href="/brands" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md transition-colors">
                            Brands
                        </Link>
                    </nav>

                    {/* Mobile: Search + Hamburger */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <Search className="w-4 h-4" />
                        </Button>

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
                                                href={`/cars?make=${encodeURIComponent(brand)}`}
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                                            >
                                                {getBrandLogo(brand) ? (
                                                    <Image src={getBrandLogo(brand)!} alt={brand} width={18} height={18} unoptimized className="object-contain" />
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
                                                href={`/cars?minPrice=${range.min}&maxPrice=${range.max}`}
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
                    className="hidden lg:block absolute left-0 right-0 bg-background border-b shadow-lg z-40"
                    onMouseLeave={() => setActiveMegaMenu(null)}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="grid grid-cols-4 gap-8">
                            {/* Popular Brands */}
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Popular Brands</h3>
                                <div className="space-y-0.5">
                                    {POPULAR_BRANDS.map((brand) => (
                                        <Link
                                            key={brand}
                                            href={`/cars?make=${encodeURIComponent(brand)}`}
                                            className="flex items-center gap-2.5 py-1.5 text-sm hover:text-primary transition-colors"
                                            onClick={() => setActiveMegaMenu(null)}
                                        >
                                            {getBrandLogo(brand) ? (
                                                <Image src={getBrandLogo(brand)!} alt={brand} width={20} height={20} unoptimized className="object-contain" />
                                            ) : (
                                                <span className="w-5 h-5 rounded-full bg-muted text-[10px] font-bold flex items-center justify-center">{brand.charAt(0)}</span>
                                            )}
                                            {brand}
                                        </Link>
                                    ))}
                                    <Link
                                        href="/brands"
                                        className="flex items-center gap-1 py-1.5 text-sm text-primary font-medium"
                                        onClick={() => setActiveMegaMenu(null)}
                                    >
                                        View All Brands <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>

                            {/* Body Types */}
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">By Body Type</h3>
                                <div className="space-y-1">
                                    {FOUR_W_BODY_TYPES.map((type) => (
                                        <Link
                                            key={type}
                                            href={`/cars?bodyType=${encodeURIComponent(type)}`}
                                            className="flex items-center gap-2 py-1.5 text-sm hover:text-primary transition-colors"
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
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">By Budget</h3>
                                <div className="space-y-1">
                                    {BUDGET_RANGES.map((range) => (
                                        <Link
                                            key={range.label}
                                            href={`/cars?minPrice=${range.min}&maxPrice=${range.max}`}
                                            className="block py-1.5 text-sm hover:text-primary transition-colors"
                                            onClick={() => setActiveMegaMenu(null)}
                                        >
                                            {range.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Explore</h3>
                                <div className="space-y-1">
                                    <Link
                                        href="/cars"
                                        className="flex items-center gap-2 py-1.5 text-sm hover:text-primary transition-colors"
                                        onClick={() => setActiveMegaMenu(null)}
                                    >
                                        <Star className="w-4 h-4" /> All Cars
                                    </Link>
                                    <Link
                                        href="/#two-wheelers"
                                        className="flex items-center gap-2 py-1.5 text-sm hover:text-primary transition-colors"
                                        onClick={() => setActiveMegaMenu(null)}
                                    >
                                        <Bike className="w-4 h-4" /> Bikes & Scooters
                                    </Link>
                                    <Link
                                        href="/#three-wheelers"
                                        className="flex items-center gap-2 py-1.5 text-sm hover:text-primary transition-colors"
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

            {/* Mobile Search Bar */}
            {isSearchOpen && (
                <div className="lg:hidden border-t bg-background px-4 py-2">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search cars..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                            autoFocus
                        />
                    </form>
                    {searchResults.length > 0 && (
                        <div className="mt-2 space-y-1">
                            {searchResults.slice(0, 4).map((car) => (
                                <button
                                    key={car.id}
                                    onClick={() => handleSearchSelect(car.id)}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-left text-sm"
                                >
                                    <span className="font-medium flex items-center gap-1.5">
                                        {getBrandLogo(car.make) && (
                                            <Image src={getBrandLogo(car.make)!} alt={car.make} width={16} height={16} unoptimized className="object-contain shrink-0" />
                                        )}
                                        {car.make} {car.model}
                                    </span>
                                    <span className="text-muted-foreground text-xs ml-auto">{formatPriceInLakhs(car.pricing.exShowroom.min)}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}

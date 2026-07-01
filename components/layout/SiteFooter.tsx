/**
 * SiteFooter — Comprehensive footer with brand links, tools, and info
 */

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import BrandLogo from '@/components/BrandLogo';
import { FOUR_W_BODY_TYPES } from '@/lib/data/four-wheelers';

const POPULAR_BRANDS = [
    'Maruti Suzuki', 'Hyundai', 'Tata Motors', 'Kia', 'Mahindra',
    'Toyota', 'Honda', 'MG', 'BMW', 'Mercedes-Benz',
    'Skoda', 'Volkswagen', 'Audi', 'Volvo', 'Jeep',
];

const BUDGET_LINKS = [
    { label: 'Cars Under 5 Lakh', min: 0, max: 500000 },
    { label: 'Cars Under 10 Lakh', min: 0, max: 1000000 },
    { label: 'Cars Under 15 Lakh', min: 0, max: 1500000 },
    { label: 'Cars Under 20 Lakh', min: 0, max: 2000000 },
    { label: 'Cars Under 30 Lakh', min: 0, max: 3000000 },
    { label: 'Luxury Cars', min: 3000000, max: 10000000 },
];

export function SiteFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative border-t-0 bg-[#0B0E12] text-[#FFFDF7]">
            {/* Gradient separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {/* About */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <BrandLogo size="sm" className="[&>span]:text-[#FFFDF7] [&_.brand-logo-accent]:text-[#F3C77A]" />
                        </div>
                        <p className="text-sm leading-relaxed text-[#C7BFB4]">
                            India's trusted platform for new and used cars. Browse, compare, and find your perfect car.
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                            <Link href="/about" className="text-sm text-[#C7BFB4] transition-colors hover:text-[#FFFDF7]">
                                About
                            </Link>
                            <Link href="/careers" className="text-sm text-[#C7BFB4] transition-colors hover:text-[#FFFDF7]">
                                Careers
                            </Link>
                            <Link href="/press" className="text-sm text-[#C7BFB4] transition-colors hover:text-[#FFFDF7]">
                                Press
                            </Link>
                            <Link href="/contact" className="text-sm text-[#C7BFB4] transition-colors hover:text-[#FFFDF7]">
                                Contact
                            </Link>
                        </div>
                    </div>

                    {/* Popular Brands */}
                    <div>
                        <h4 className="mb-3 text-sm font-semibold text-[#FFFDF7]">Popular Brands</h4>
                        <ul className="space-y-1.5">
                            {POPULAR_BRANDS.slice(0, 8).map((brand) => (
                                <li key={brand}>
                                    <Link
                                        href={`/brands/${encodeURIComponent(brand)}`}
                                        className="text-sm text-[#C7BFB4] transition-colors hover:text-[#FFFDF7]"
                                    >
                                        {brand} Cars
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link href="/brands" className="text-sm font-medium text-[#F3C77A] transition-colors hover:text-[#FFE6A8] hover:underline">
                                    View All Brands
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* By Body Type */}
                    <div>
                        <h4 className="mb-3 text-sm font-semibold text-[#FFFDF7]">By Body Type</h4>
                        <ul className="space-y-1.5">
                            {FOUR_W_BODY_TYPES.map((type) => (
                                <li key={type}>
                                    <Link
                                        href={`/cars?bodyType=${encodeURIComponent(type)}`}
                                        className="text-sm text-[#C7BFB4] transition-colors hover:text-[#FFFDF7]"
                                    >
                                        {type} Cars
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* By Budget */}
                    <div>
                        <h4 className="mb-3 text-sm font-semibold text-[#FFFDF7]">By Budget</h4>
                        <ul className="space-y-1.5">
                            {BUDGET_LINKS.map((range) => (
                                <li key={range.label}>
                                    <Link
                                        href={`/cars?minPrice=${range.min}&maxPrice=${range.max}`}
                                        className="text-sm text-[#C7BFB4] transition-colors hover:text-[#FFFDF7]"
                                    >
                                        {range.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tools & More */}
                    <div>
                        <h4 className="mb-3 text-sm font-semibold text-[#FFFDF7]">Tools</h4>
                        <ul className="space-y-1.5">
                            <li>
                                <Link href="/tools/emi-calculator" className="text-sm text-[#C7BFB4] transition-colors hover:text-[#FFFDF7]">
                                    EMI Calculator
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools/on-road-price" className="text-sm text-[#C7BFB4] transition-colors hover:text-[#FFFDF7]">
                                    On-Road Price
                                </Link>
                            </li>
                            <li>
                                <Link href="/compare" className="text-sm text-[#C7BFB4] transition-colors hover:text-[#FFFDF7]">
                                    Compare Vehicles
                                </Link>
                            </li>
                            <li>
                                <Link href="/dealers" className="text-sm text-[#C7BFB4] transition-colors hover:text-[#FFFDF7]">
                                    Dealer Locator
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools/car-valuation" className="text-sm text-[#C7BFB4] transition-colors hover:text-[#FFFDF7]">
                                    Car Valuation
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools/insurance-estimator" className="text-sm text-[#C7BFB4] transition-colors hover:text-[#FFFDF7]">
                                    Insurance Estimator
                                </Link>
                            </li>
                            <li>
                                <Link href="/sell" className="text-sm text-[#C7BFB4] transition-colors hover:text-[#FFFDF7]">
                                    Sell Your Car
                                </Link>
                            </li>
                            <li>
                                <Link href="/cars" className="text-sm text-[#C7BFB4] transition-colors hover:text-[#FFFDF7]">
                                    All Cars
                                </Link>
                            </li>
                            <li>
                                <Link href="/brands" className="text-sm text-[#C7BFB4] transition-colors hover:text-[#FFFDF7]">
                                    All Brands
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-8 bg-[#FFFDF7]/10" />

                {/* Bottom Bar */}
                <div className="flex flex-col items-center justify-between gap-4 text-sm text-[#AFA79B] sm:flex-row">
                    <p>&copy; {year} DealerSite Pro. All rights reserved.</p>
                    <div className="flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center sm:justify-end">
                        <Link href="/privacy" className="transition-colors hover:text-[#FFFDF7]">Privacy Policy</Link>
                        <Link href="/terms" className="transition-colors hover:text-[#FFFDF7]">Terms of Service</Link>
                        <Link href="/disclaimer" className="transition-colors hover:text-[#FFFDF7]">Disclaimer</Link>
                        <Link href="/sitemap" className="transition-colors hover:text-[#FFFDF7]">Sitemap</Link>
                        <Link href="/contact" className="transition-colors hover:text-[#FFFDF7]">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

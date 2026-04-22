/**
 * SiteFooter — Comprehensive footer with brand links, tools, and info
 */

import Link from 'next/link';
import { Calculator, GitCompare, Star, Mail, Phone, MapPin } from 'lucide-react';
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
        <footer className="bg-muted/30 border-t-0 relative">
            {/* Gradient separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {/* About */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <BrandLogo size="sm" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            India's trusted platform for new and used cars. Browse, compare, and find your perfect car.
                        </p>
                    </div>

                    {/* Popular Brands */}
                    <div>
                        <h4 className="text-sm font-semibold mb-3">Popular Brands</h4>
                        <ul className="space-y-1.5">
                            {POPULAR_BRANDS.slice(0, 8).map((brand) => (
                                <li key={brand}>
                                    <Link
                                        href={`/brands/${encodeURIComponent(brand)}`}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {brand} Cars
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link href="/brands" className="text-sm text-primary font-medium hover:underline">
                                    View All Brands
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* By Body Type */}
                    <div>
                        <h4 className="text-sm font-semibold mb-3">By Body Type</h4>
                        <ul className="space-y-1.5">
                            {FOUR_W_BODY_TYPES.map((type) => (
                                <li key={type}>
                                    <Link
                                        href={`/cars?bodyType=${encodeURIComponent(type)}`}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {type} Cars
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* By Budget */}
                    <div>
                        <h4 className="text-sm font-semibold mb-3">By Budget</h4>
                        <ul className="space-y-1.5">
                            {BUDGET_LINKS.map((range) => (
                                <li key={range.label}>
                                    <Link
                                        href={`/cars?minPrice=${range.min}&maxPrice=${range.max}`}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {range.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tools & More */}
                    <div>
                        <h4 className="text-sm font-semibold mb-3">Tools</h4>
                        <ul className="space-y-1.5">
                            <li>
                                <Link href="/compare" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Compare Cars
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools/emi-calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    EMI Calculator
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools/on-road-price" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    On-Road Price
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools/car-valuation" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Car Valuation
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools/insurance-estimator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Insurance Estimator
                                </Link>
                            </li>
                            <li>
                                <Link href="/sell" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Sell Your Car
                                </Link>
                            </li>
                            <li>
                                <Link href="/cars" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    All Cars
                                </Link>
                            </li>
                            <li>
                                <Link href="/brands" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    All Brands
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>&copy; {year} DealerSite Pro. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

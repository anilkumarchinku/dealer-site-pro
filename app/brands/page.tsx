/**
 * All Brands Page — /brands
 * Grid of all car brands with model count and price range
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { getAllBrandsWithStats } from '@/lib/services/car-service';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { getBrandLogo } from '@/lib/data/brand-logos';

export const metadata: Metadata = {
    title: 'All Car Brands | DealerSite Pro',
    description: 'Browse all car brands — Maruti Suzuki, Hyundai, Tata, Kia, BMW, Mercedes, and more.',
};

export default async function BrandsPage() {
    const brands = await getAllBrandsWithStats();

    return (
        <>
        <SiteHeader />
        <div className="bg-background min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-foreground font-medium">All Brands</span>
                </nav>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">All Car Brands</h1>
                    <p className="text-muted-foreground mt-1">
                        Explore {brands.length} car brands and find your perfect car
                    </p>
                </div>

                {/* Brand Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {brands.map((brand) => (
                        <Link
                            key={brand.name}
                            href={`/brands/${encodeURIComponent(brand.name)}`}
                        >
                            <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group hover:bg-gradient-to-b hover:from-primary/5 hover:to-transparent">
                                <CardContent className="p-4 text-center">
                                    {/* Brand Logo */}
                                    <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                                        {getBrandLogo(brand.name) ? (
                                            <Image src={getBrandLogo(brand.name)!} alt={brand.name} width={56} height={56} className="object-contain" />
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-muted/50 border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                                                <span className="text-primary text-xl font-bold">{brand.name.charAt(0)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                                        {brand.name}
                                    </h3>

                                    <Badge variant="secondary" className="mt-1.5 text-[10px]">
                                        {brand.modelCount} {brand.modelCount === 1 ? 'Model' : 'Models'}
                                    </Badge>

                                    {brand.priceMin && (
                                        <p className="text-[11px] text-muted-foreground mt-2">
                                            {formatPriceInLakhs(brand.priceMin)}
                                            {brand.priceMax && brand.priceMax !== brand.priceMin && (
                                                <> - {formatPriceInLakhs(brand.priceMax)}</>
                                            )}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {brands.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground">No brands available yet.</p>
                    </div>
                )}
            </div>
        </div>
        <SiteFooter />
        </>
    );
}

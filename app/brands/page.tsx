/**
 * All Brands Page — /brands
 * Grid of all 2W, 3W, and 4W brands with model count and price range
 */

import { Metadata } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { getAllBrandsWithStats } from '@/lib/services/car-service';
import { loadTwoWheelerCatalogVehicles } from '@/lib/services/two-wheeler-static-catalog';
import { loadThreeWheelerCatalogVehicles } from '@/lib/services/three-wheeler-static-catalog';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Bike, Car, ChevronRight, Truck } from 'lucide-react';
import { getBrandLogo } from '@/lib/data/brand-logos';
import { BrandLogo } from '@/components/brands/BrandLogo';
import { brandLogoUrl, type VehicleImageCategory } from '@/lib/utils/site-assets';

export const metadata: Metadata = {
    title: 'All Vehicle Brands | DealerSite Pro',
    description: 'Browse two-wheeler, three-wheeler, and car brands in one place.',
};

type BrandDirectoryType = '2w' | '3w' | '4w';

type BrandCard = {
    name: string;
    modelCount: number;
    priceMin: number | null;
    priceMax: number | null;
    href: string;
    logoUrl: string | null;
};

const BRAND_TYPES = [
    { value: '2w', label: '2W', name: 'Two-Wheelers', icon: Bike },
    { value: '3w', label: '3W', name: 'Three-Wheelers', icon: Truck },
    { value: '4w', label: '4W', name: 'Cars', icon: Car },
] satisfies Array<{
    value: BrandDirectoryType;
    label: string;
    name: string;
    icon: typeof Car;
}>;

function normalizeBrandType(value: string | undefined): BrandDirectoryType {
    return value === '2w' || value === '3w' || value === '4w' ? value : '4w';
}

function existingPublicAsset(assetPath: string | null | undefined): string | null {
    if (!assetPath) return null;
    if (!assetPath.startsWith('/')) return assetPath;

    const cleanPath = assetPath.split('?')[0].replace(/^\/+/, '');
    const filePath = path.join(process.cwd(), 'public', cleanPath);
    return fs.existsSync(filePath) ? assetPath : null;
}

function buildStaticBrandCards(
    vehicles: Array<{ make: string; model: string; price_min_paise: number }>,
    category: Extract<VehicleImageCategory, '2w' | '3w'>
): BrandCard[] {
    const brandMap = new Map<string, { models: Set<string>; priceMin: number; priceMax: number }>();

    for (const vehicle of vehicles) {
        const brand = vehicle.make.trim();
        if (!brand) continue;

        const current = brandMap.get(brand) ?? {
            models: new Set<string>(),
            priceMin: 0,
            priceMax: 0,
        };

        current.models.add(vehicle.model);
        const priceInr = vehicle.price_min_paise > 0 ? Math.round(vehicle.price_min_paise / 100) : 0;
        if (priceInr > 0 && (current.priceMin === 0 || priceInr < current.priceMin)) current.priceMin = priceInr;
        if (priceInr > current.priceMax) current.priceMax = priceInr;
        brandMap.set(brand, current);
    }

    return Array.from(brandMap.entries())
        .map(([name, stats]) => ({
            name,
            modelCount: stats.models.size,
            priceMin: stats.priceMin || null,
            priceMax: stats.priceMax || null,
            href: `/brands/${encodeURIComponent(name)}?type=${category}`,
            logoUrl: existingPublicAsset(brandLogoUrl(name, category)),
        }))
        .sort((a, b) => b.modelCount - a.modelCount || a.name.localeCompare(b.name));
}

async function getBrandCards(type: BrandDirectoryType): Promise<BrandCard[]> {
    if (type === '2w') {
        return buildStaticBrandCards(loadTwoWheelerCatalogVehicles(), '2w');
    }

    if (type === '3w') {
        return buildStaticBrandCards(loadThreeWheelerCatalogVehicles(), '3w');
    }

    const brands = await getAllBrandsWithStats();
    return brands.map((brand) => ({
        ...brand,
        href: `/brands/${encodeURIComponent(brand.name)}`,
        logoUrl: existingPublicAsset(getBrandLogo(brand.name) ?? brandLogoUrl(brand.name, '4w')),
    }));
}

type Props = {
    searchParams?: Promise<{ type?: string }>;
};

export default async function BrandsPage({ searchParams }: Props) {
    const selectedType = normalizeBrandType((await searchParams)?.type);
    const selectedConfig = BRAND_TYPES.find((type) => type.value === selectedType) ?? BRAND_TYPES[2];
    const brands = await getBrandCards(selectedType);

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
                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">All Vehicle Brands</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Explore {brands.length} {selectedConfig.name.toLowerCase()} brands
                        </p>
                    </div>

                    <div className="inline-grid grid-cols-3 rounded-lg border border-border bg-muted/40 p-1 w-full sm:w-auto">
                        {BRAND_TYPES.map(({ value, label, name, icon: Icon }) => {
                            const active = value === selectedType;
                            return (
                                <Link
                                    key={value}
                                    href={`/brands?type=${value}`}
                                    className={[
                                        'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                                        active
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground',
                                    ].join(' ')}
                                    aria-current={active ? 'page' : undefined}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{label}</span>
                                    <span className="hidden md:inline text-xs font-medium opacity-70">{name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Brand Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {brands.map((brand) => (
                        <Link
                            key={brand.name}
                            href={brand.href}
                        >
                            <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group hover:bg-gradient-to-b hover:from-primary/5 hover:to-transparent">
                                <CardContent className="p-4 text-center">
                                    {/* Brand Logo — light chip so logos with baked-in white/opaque backgrounds
                                        render correctly in dark mode; falls back to a monogram if the asset is missing */}
                                    <BrandLogo name={brand.name} src={brand.logoUrl} />

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

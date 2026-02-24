/**
 * Brand Page — /brands/[brand]
 * Shows all models from a specific brand with body type tabs
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCarsByMakeAndBodyType, getAllBrandsWithStats } from '@/lib/services/car-service';
import { BrandPageContent } from '@/components/brands/BrandPageContent';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

interface Props {
    params: Promise<{ brand: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { brand } = await params;
    const decodedBrand = decodeURIComponent(brand);

    return {
        title: `${decodedBrand} Cars — Price, Models, Specs | DealerSite Pro`,
        description: `Explore all ${decodedBrand} car models with prices, specifications, and features.`,
    };
}

export default async function BrandPage({ params }: Props) {
    const { brand } = await params;
    const decodedBrand = decodeURIComponent(brand);

    const [cars, allBrands] = await Promise.all([
        getCarsByMakeAndBodyType(decodedBrand),
        getAllBrandsWithStats(),
    ]);

    const brandInfo = allBrands.find(b => b.name === decodedBrand);

    if (!brandInfo || cars.length === 0) {
        notFound();
    }

    return (
        <>
            <SiteHeader />
            <BrandPageContent
                brand={decodedBrand}
                cars={cars}
                brandInfo={brandInfo}
            />
            <SiteFooter />
        </>
    );
}

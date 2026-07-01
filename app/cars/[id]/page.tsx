/**
 * Car Detail Page
 * /app/cars/[id]/page.tsx
 */

import { Metadata } from 'next';
import { getCarById, getSimilarCars } from '@/lib/services/car-service';
import { CarDetailView } from '@/components/cars/CarDetailView';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { notFound } from 'next/navigation';
import { hydrateCarWithJsonDetails } from '@/lib/data/car-detail';
import { getCarsByMake } from '@/lib/data/cars';
import { FOUR_W_BRANDS, modelToSlug } from '@/lib/data/four-wheelers';
import type { Car } from '@/lib/types/car';

interface Props {
    params: Promise<{ id: string }>;
}

async function getStatic4wCarById(id: string): Promise<Car | null> {
    if (!id.startsWith('static-4w-')) return null;

    const rest = id.replace(/^static-4w-/, '');
    const brand = FOUR_W_BRANDS
        .slice()
        .sort((a, b) => b.brandId.length - a.brandId.length)
        .find((item) => rest.startsWith(`${item.brandId}-`));
    if (!brand) return null;

    const targetModelSlug = rest.slice(brand.brandId.length + 1);
    const cars = await getCarsByMake(brand.make);
    return cars.find((car) => modelToSlug(car.model) === targetModelSlug) ?? null;
}

async function getPublicCarById(id: string): Promise<Car | null> {
    return await getCarById(id) ?? await getStatic4wCarById(id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const car = await getPublicCarById(id);

    if (!car) {
        return {
            title: 'Car Not Found',
        };
    }

    return {
        title: `${car.make} ${car.model} Price, Images, Specs | DealerSite Pro`,
        description: `Check out ${car.make} ${car.model} price, specifications, features, and images.`,
    };
}

export default async function CarPage({ params }: Props) {
    const { id } = await params;
    const baseCar = await getPublicCarById(id);

    if (!baseCar) {
        notFound();
    }

    const car = await hydrateCarWithJsonDetails(baseCar);
    const similarCars = await getSimilarCars(id);

    return (
        <>
            <SiteHeader />
            <CarDetailView car={car} similarCars={similarCars} />
            <SiteFooter />
        </>
    );
}

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

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const car = await getCarById(id);

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
    const baseCar = await getCarById(id);

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

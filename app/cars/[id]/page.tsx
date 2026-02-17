/**
 * Car Detail Page
 * /app/cars/[id]/page.tsx
 */

import { Metadata } from 'next';
import { getCarById, getSimilarCars } from '@/lib/services/car-service';
import { CarDetailView } from '@/components/cars/CarDetailView';
import { notFound } from 'next/navigation';

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
    const car = await getCarById(id);

    if (!car) {
        notFound();
    }

    const similarCars = await getSimilarCars(id);

    return <CarDetailView car={car} similarCars={similarCars} />;
}

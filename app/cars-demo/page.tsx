import { getAllCars } from '@/lib/services/car-service';
import CarsDemoClient from './cars-demo-client';

export default async function CarsDemoPage() {
    const { cars } = await getAllCars({
        // Keep the demo page light enough for visual QA and stakeholder review.
        limit: 24,
    });

    return <CarsDemoClient initialCars={cars} />;
}

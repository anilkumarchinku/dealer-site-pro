import { getAllCars } from '@/lib/services/car-service';
import CarsDemoClient from './cars-demo-client';

export default async function CarsDemoPage() {
    // Fetch data on the server
    const { cars } = await getAllCars({
        limit: 100 // Fetch a good number for the demo
    });

    return <CarsDemoClient initialCars={cars} />;
}

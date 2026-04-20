import { permanentRedirect, notFound } from 'next/navigation';
import { getCarById } from '@/lib/services/car-service';

interface RootVehicleRedirectPageProps {
    params: Promise<{ id: string }>;
}

export default async function RootVehicleRedirectPage({ params }: RootVehicleRedirectPageProps) {
    const { id } = await params;
    const car = await getCarById(id);

    if (!car) {
        notFound();
    }

    permanentRedirect(`/cars/${id}`);
}

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CarDetailView } from '@/components/cars/CarDetailView';
import { allCars, getCarsByMake } from '@/lib/data/cars';
import { hydrateCarWithJsonDetails } from '@/lib/data/car-detail';
import { fetchDealerBySlug } from '@/lib/db/dealers';
import { fetchAllCyeproInventoryAsCars } from '@/lib/services/cyepro-service';
import type { Car } from '@/lib/types/car';
import type { DBVehicle } from '@/lib/db/vehicles';
import { dedupeByMakeModel, dedupeCaseInsensitiveStrings } from '@/lib/utils/listing-dedupe';

export const dynamic = 'force-dynamic';

interface SiteCarDetailPageProps {
    params: Promise<{ slug: string; id: string }>;
}

function fallbackMetaTitle(carName: string, dealerName: string, location: string) {
    return `${carName} for Sale in ${location} | ${dealerName}`.slice(0, 70);
}

function fallbackMetaDescription(carName: string, dealerName: string, location: string) {
    return `View ${carName} price, specs, fuel type, transmission, images and enquiry options at ${dealerName} in ${location}.`.slice(0, 160);
}

function dbVehiclesToCars(vehicles: DBVehicle[]): Car[] {
    return vehicles.map(v => ({
        id: v.id,
        make: v.make,
        model: v.model,
        variant: v.variant ?? '',
        year: v.year,
        bodyType: (v.body_type ?? 'SUV') as Car['bodyType'],
        segment: 'B' as Car['segment'],
        pricing: {
            exShowroom: {
                min: Math.round(v.price_paise / 100),
                max: Math.round(v.price_paise / 100),
                currency: 'INR' as const,
            },
        },
        engine: {
            type: (v.fuel_type ?? 'Petrol') as Car['engine']['type'],
            power: '—',
            torque: '—',
        },
        transmission: {
            type: (v.transmission ?? 'Manual') as Car['transmission']['type'],
        },
        performance: {},
        dimensions: { seatingCapacity: 5 },
        features: { keyFeatures: v.features ?? [] },
        images: { hero: '/placeholder-car.jpg', exterior: [], interior: [] },
        meta: {
            viewCount: v.views,
            dataSource: 'manual',
            sourceVehicleId: v.id,
            registrationNumber: v.registration_number,
            insurance: {
                status: v.insurance_status ?? 'unknown',
                provider: v.insurance_provider,
                validUntil: v.insurance_valid_until,
                quoteUrl: v.insurance_quote_url,
                lastCheckedAt: v.insurance_last_checked_at,
            },
        },
        price: `₹${(v.price_paise / 100).toLocaleString('en-IN')}`,
        condition: v.condition,
        vehicleCategory: '4w',
    }));
}

export async function generateMetadata({ params }: SiteCarDetailPageProps): Promise<Metadata> {
    const { slug, id } = await params;
    const dealer = await fetchDealerBySlug(slug);

    if (!dealer) {
        return {
            title: 'Vehicle Details | DealerSite Pro',
            description: 'Vehicle listing details powered by DealerSite Pro.',
        };
    }

    const manualVehicle = dealer.vehicles.find(vehicle => vehicle.id === id);
    if (manualVehicle) {
        const carName = [manualVehicle.year, manualVehicle.make, manualVehicle.model, manualVehicle.variant].filter(Boolean).join(' ');
        return {
            title: manualVehicle.meta_title || fallbackMetaTitle(carName, dealer.dealership_name, dealer.location),
            description: manualVehicle.meta_description || fallbackMetaDescription(carName, dealer.dealership_name, dealer.location),
            openGraph: {
                title: manualVehicle.meta_title || fallbackMetaTitle(carName, dealer.dealership_name, dealer.location),
                description: manualVehicle.meta_description || fallbackMetaDescription(carName, dealer.dealership_name, dealer.location),
                type: 'website',
                siteName: dealer.dealership_name,
                locale: 'en_IN',
            },
            twitter: {
                card: 'summary',
                title: manualVehicle.meta_title || fallbackMetaTitle(carName, dealer.dealership_name, dealer.location),
                description: manualVehicle.meta_description || fallbackMetaDescription(carName, dealer.dealership_name, dealer.location),
            },
            robots: { index: true, follow: true },
        };
    }

    const catalog = dealer.brandFilter
        ? await getCarsByMake(dealer.brandFilter)
        : (await Promise.all(dedupeCaseInsensitiveStrings(dealer.brands).map(brand => getCarsByMake(brand)))).flat();
    const catalogCar = catalog.find(car => car.id === id) ?? allCars.find(car => car.id === id);

    if (!catalogCar) {
        return {
            title: `${dealer.dealership_name} Vehicle | ${dealer.location}`,
            description: `Browse vehicle details and contact ${dealer.dealership_name} in ${dealer.location}.`,
        };
    }

    const carName = [catalogCar.year, catalogCar.make, catalogCar.model, catalogCar.variant].filter(Boolean).join(' ');
    return {
        title: fallbackMetaTitle(carName, dealer.dealership_name, dealer.location),
        description: fallbackMetaDescription(carName, dealer.dealership_name, dealer.location),
        robots: { index: true, follow: true },
    };
}

export default async function SiteCarDetailPage({ params }: SiteCarDetailPageProps) {
    const { slug, id } = await params;

    const dealer = await fetchDealerBySlug(slug);
    if (!dealer) notFound();

    if (dealer.vehicle_type === 'two-wheeler' || dealer.vehicle_type === 'three-wheeler') {
        notFound();
    }

    const {
        sells_new_cars,
        sells_used_cars,
        brandFilter,
        brands,
        vehicles,
        cyepro_api_key,
    } = dealer;

    let cars: Car[];

    if (brandFilter || (sells_new_cars && !sells_used_cars)) {
        const uniqueBrands = dedupeCaseInsensitiveStrings(brands);
        const catalog = brandFilter
            ? await getCarsByMake(brandFilter)
            : (await Promise.all(uniqueBrands.map(b => getCarsByMake(b)))).flat();
        cars = dedupeByMakeModel((catalog.length > 0 ? catalog : allCars.slice(0, 16)).map(c => ({
            ...c,
            condition: 'new' as const,
        })));
    } else {
        const cyeproCars = cyepro_api_key
            ? await fetchAllCyeproInventoryAsCars(cyepro_api_key)
            : [];

        if (cyeproCars.length > 0) {
            cars = cyeproCars;
        } else if (vehicles.length > 0) {
            cars = dbVehiclesToCars(vehicles);
        } else {
            cars = [];
        }
    }

    const selectedCar = cars.find(item => item.id === id);
    const car = selectedCar ? await hydrateCarWithJsonDetails(selectedCar) : null;
    if (!car) notFound();

    const similarCars = cars.filter(item => item.id !== id && item.make === car.make).slice(0, 4);

    return <CarDetailView car={car} similarCars={similarCars} siteSlug={slug} dealerId={dealer.id} dealerPhone={dealer.phone} />;
}

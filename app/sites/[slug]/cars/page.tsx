import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { PremiumUsedInventoryPage } from '@/components/templates/PremiumUsedInventoryPage';
import { PublicSiteAnalyticsTracker } from '@/components/analytics/PublicSiteAnalyticsTracker';
import { getCarsByMake } from '@/lib/data/cars';
import { fetchDealerBySlug } from '@/lib/db/dealers';
import type { DBVehicle } from '@/lib/db/vehicles';
import { fetchAllCyeproInventoryAsCars } from '@/lib/services/cyepro-service';
import { applyUsedVehiclePriceOffersToCars, fetchActiveUsedVehiclePriceOffers } from '@/lib/services/used-vehicle-price-offers';
import type { Car } from '@/lib/types/car';
import { dedupeByMakeModel, dedupeCaseInsensitiveStrings, dedupeInventoryCars } from '@/lib/utils/listing-dedupe';
import { publicDealerSitePath, publicVehicleHubPath, type VehicleHubSegment } from '@/lib/utils/public-site-routing';
import { brandLogoUrl, firstVehicleHeroImage, resolveDealerHeroImage, resolveDealerLogoImage } from '@/lib/utils/site-assets';
import { BASE_DOMAIN, dealerSiteHref } from '@/lib/utils/domain';

export const dynamic = 'force-dynamic';

interface DealerInventoryPageProps {
    params: Promise<{ slug: string }>;
}

function dbVehiclesToCars(vehicles: DBVehicle[]): Car[] {
    return vehicles.map(v => {
        const imageUrls = [v.image_url, ...(v.image_urls ?? [])]
            .filter((url, index, urls): url is string => Boolean(url) && urls.indexOf(url) === index);
        const keyFeatures = [
            ...(v.features ?? []),
            v.mileage_km ? `${v.mileage_km.toLocaleString('en-IN')} km driven` : null,
            v.color ? `Colour: ${v.color}` : null,
        ].filter((item): item is string => Boolean(item));

        return {
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
                power: '-',
                torque: '-',
            },
            transmission: {
                type: (v.transmission ?? 'Manual') as Car['transmission']['type'],
            },
            performance: {
                range: v.mileage_km,
            },
            dimensions: { seatingCapacity: 5 },
            features: { keyFeatures },
            images: { hero: imageUrls[0] ?? '', exterior: imageUrls, interior: [] },
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
            video_url: v.video_url,
            vehicleCategory: '4w',
        };
    });
}

async function loadDealerInventory(slug: string) {
    const dealer = await fetchDealerBySlug(slug, { includePrivate: true });
    if (!dealer) return null;

    const { sells_new_cars, sells_used_cars, brandFilter, brands, vehicles, cyepro_api_key } = dealer;
    let cars: Car[];
    let isUsedSite = sells_used_cars && !sells_new_cars;

    if (brandFilter || (sells_new_cars && !sells_used_cars)) {
        const uniqueBrands = dedupeCaseInsensitiveStrings(brands);
        const catalog = brandFilter
            ? await getCarsByMake(brandFilter)
            : (await Promise.all(uniqueBrands.map(brand => getCarsByMake(brand)))).flat();
        cars = dedupeByMakeModel(catalog.map(car => ({ ...car, condition: 'new' as const })));
        isUsedSite = false;
    } else {
        const cyeproCars = cyepro_api_key
            ? await fetchAllCyeproInventoryAsCars(cyepro_api_key, {}, undefined, '4w')
            : [];

        cars = dedupeInventoryCars([
            ...dbVehiclesToCars(vehicles),
            ...cyeproCars,
        ]);
        cars = applyUsedVehiclePriceOffersToCars(
            cars,
            await fetchActiveUsedVehiclePriceOffers(dealer.id),
        );
        isUsedSite = true;
    }

    return { dealer, cars, isUsedSite };
}

export async function generateMetadata({ params }: DealerInventoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const loaded = await loadDealerInventory(slug);

    if (!loaded) {
        return {
            title: 'Inventory | DealerSite Pro',
            description: 'Browse dealer inventory powered by DealerSite Pro.',
        };
    }

    const { dealer, cars } = loaded;
    const title = `${dealer.dealership_name} Inventory | ${dealer.location}`;
    const description = `Search ${cars.length} vehicles from ${dealer.dealership_name} in ${dealer.location}. Filter by brand, fuel, transmission, year, budget, and kilometres.`;
    const faviconUrl = resolveDealerLogoImage({
        uploadedLogo: dealer.logo_url,
        fallbackLogo: '/dealersite-pro-shield.png',
    }) ?? '/dealersite-pro-shield.png';

    return {
        title,
        description,
        icons: {
            icon: faviconUrl,
            shortcut: faviconUrl,
            apple: faviconUrl,
        },
        alternates: {
            canonical: `${dealerSiteHref(dealer.slug).replace(/\/$/, '')}/cars`,
        },
        openGraph: {
            title,
            description,
            type: 'website',
            siteName: dealer.dealership_name,
            locale: 'en_IN',
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

function vehicleHubHrefFactory(host: string, baseDomain: string, dealerSlug: string) {
    return (segment: VehicleHubSegment) => publicVehicleHubPath({
        dealerSlug,
        segment,
        host,
        baseDomain,
    });
}

export default async function DealerInventoryPage({ params }: DealerInventoryPageProps) {
    const { slug } = await params;
    const loaded = await loadDealerInventory(slug);
    if (!loaded) notFound();

    const { dealer, cars, isUsedSite } = loaded;
    const requestHeaders = await headers();
    const host = requestHeaders.get('host') ?? '';
    const baseDomain = BASE_DOMAIN;
    const vehicleHubHref = vehicleHubHrefFactory(host, baseDomain, dealer.slug);

    if (dealer.vehicle_type === 'two-wheeler') {
        redirect(vehicleHubHref('two-wheelers'));
    }

    if (dealer.vehicle_type === 'three-wheeler') {
        redirect(vehicleHubHref('three-wheelers'));
    }

    const siteBasePath = publicDealerSitePath({
        siteSlug: slug,
        host,
        baseDomain,
    });
    const brandName = isUsedSite
        ? (dealer.brands[0] ?? dealer.dealership_name)
        : (dealer.brandFilter ?? dealer.brands[0] ?? dealer.dealership_name);
    const logoUrl = resolveDealerLogoImage({
        uploadedLogo: dealer.logo_url,
        fallbackLogo: brandLogoUrl(brandName, '4w'),
        preferFallbackLogo: !isUsedSite,
    });
    const heroImageUrl = resolveDealerHeroImage({
        uploadedHeroImage: dealer.hero_image_url,
        inventoryHeroImage: firstVehicleHeroImage(cars),
    });

    return (
        <>
            <PublicSiteAnalyticsTracker dealerId={dealer.id} />
            <PremiumUsedInventoryPage
                brandName={brandName}
                dealerName={dealer.dealership_name}
                cars={cars}
                contactInfo={{
                    phone: dealer.phone,
                    email: dealer.email,
                    city: dealer.location,
                    address: dealer.full_address?.trim() || dealer.location,
                }}
                workingHours={dealer.working_hours}
                logoUrl={logoUrl}
                heroImageUrl={heroImageUrl}
                siteBasePath={siteBasePath}
            />
        </>
    );
}

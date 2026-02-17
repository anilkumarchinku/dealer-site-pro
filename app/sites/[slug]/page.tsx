import { notFound } from 'next/navigation'
import { ModernTemplate } from '@/components/templates/ModernTemplate'
import { LuxuryTemplate } from '@/components/templates/LuxuryTemplate'
import { SportyTemplate } from '@/components/templates/SportyTemplate'
import { FamilyTemplate } from '@/components/templates/FamilyTemplate'
import { allCars } from '@/lib/data/cars'
import { getCarsByMake } from '@/lib/data/cars'

interface SitePageProps {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ template?: string }>
}

// Mock dealer data generator (would come from DB)
const getDealerData = (slug: string) => {
    // Map: [brand name for colors, car make for filtering] - COMPREHENSIVE LIST
    const brandMap: Record<string, { colorBrand: string; carMake: string }> = {
        // Mass Market
        'maruti-suzuki': { colorBrand: 'Maruti Suzuki', carMake: 'Maruti Suzuki' },
        'maruti': { colorBrand: 'Maruti Suzuki', carMake: 'Maruti Suzuki' },
        'tata': { colorBrand: 'Tata Motors', carMake: 'Tata Motors' },
        'tata-motors': { colorBrand: 'Tata Motors', carMake: 'Tata Motors' },
        'mahindra': { colorBrand: 'Mahindra', carMake: 'Mahindra' },
        'hyundai': { colorBrand: 'Hyundai', carMake: 'Hyundai' },
        'honda': { colorBrand: 'Honda', carMake: 'Honda' },
        'toyota': { colorBrand: 'Toyota', carMake: 'Toyota' },
        'kia': { colorBrand: 'Kia', carMake: 'Kia' },
        'renault': { colorBrand: 'Renault', carMake: 'Renault' },
        'nissan': { colorBrand: 'Nissan', carMake: 'Nissan' },
        'volkswagen': { colorBrand: 'Volkswagen', carMake: 'Volkswagen' },
        // Mid-Premium
        'skoda': { colorBrand: 'Skoda', carMake: 'Skoda' },
        'mg': { colorBrand: 'MG', carMake: 'MG' },
        'jeep': { colorBrand: 'Jeep', carMake: 'Jeep' },
        'citroen': { colorBrand: 'Citroen', carMake: 'Citroen' },
        'force': { colorBrand: 'Force Motors', carMake: 'Force Motors' },
        'force-motors': { colorBrand: 'Force Motors', carMake: 'Force Motors' },
        'isuzu': { colorBrand: 'Isuzu', carMake: 'Isuzu' },
        // Luxury
        'mercedes': { colorBrand: 'Mercedes-Benz', carMake: 'Mercedes-Benz' },
        'mercedes-benz': { colorBrand: 'Mercedes-Benz', carMake: 'Mercedes-Benz' },
        'bmw': { colorBrand: 'BMW', carMake: 'BMW' },
        'audi': { colorBrand: 'Audi', carMake: 'Audi' },
        'jaguar': { colorBrand: 'Jaguar', carMake: 'Jaguar' },
        'land-rover': { colorBrand: 'Land Rover', carMake: 'Land Rover' },
        'landrover': { colorBrand: 'Land Rover', carMake: 'Land Rover' },
        'volvo': { colorBrand: 'Volvo', carMake: 'Volvo' },
        'lexus': { colorBrand: 'Lexus', carMake: 'Lexus' },
        'porsche': { colorBrand: 'Porsche', carMake: 'Porsche' },
        'bentley': { colorBrand: 'Bentley', carMake: 'Bentley' },
        'lamborghini': { colorBrand: 'Lamborghini', carMake: 'Lamborghini' },
        // Electric
        'byd': { colorBrand: 'BYD', carMake: 'BYD' },
        'tesla': { colorBrand: 'Tesla', carMake: 'Tesla' },
    };

    // Detect brand from slug
    const slugKey = slug.toLowerCase();
    const matchedBrand = Object.keys(brandMap).find(key => slugKey.includes(key));
    const brand = matchedBrand ? brandMap[matchedBrand] : { colorBrand: 'Maruti Suzuki', carMake: 'Maruti Suzuki' };

    return {
        name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ') + " Motors",
        specializedBrand: brand.carMake, // For filtering cars
        brandName: brand.colorBrand // For template colors
    };
}

export default async function SitePage({ params, searchParams }: SitePageProps) {
    const { slug } = await params
    const { template } = await searchParams

    if (!slug) notFound();

    const dealer = getDealerData(slug);

    // Get brand-specific cars
    let dealerCars = dealer.specializedBrand
        ? getCarsByMake(dealer.specializedBrand)
        : allCars;

    // If no cars found for this brand, show all cars
    if (dealerCars.length === 0) {
        dealerCars = allCars;
    }

    const contactInfo = {
        phone: "+91 98765 43210",
        email: `sales@${slug}.com`,
        address: "123 Auto Park, Main Road, City Center"
    };

    // Render template based on query param or default to modern
    const templateType = template || 'modern';

    switch (templateType) {
        case 'luxury':
            return (
                <LuxuryTemplate
                    brandName={dealer.brandName}
                    dealerName={dealer.name}
                    cars={dealerCars}
                    contactInfo={contactInfo}
                    config={{
                        heroTitle: "THE ART OF PERFORMANCE",
                        heroSubtitle: "Experience automotive excellence with our curated collection",
                        tagline: "Excellence in Motion"
                    }}
                />
            );
        case 'sporty':
            return (
                <SportyTemplate
                    brandName={dealer.brandName}
                    dealerName={dealer.name}
                    cars={dealerCars}
                    contactInfo={contactInfo}
                    config={{
                        heroTitle: "UNLEASH THE BEAST",
                        heroSubtitle: "Where raw power meets cutting-edge performance",
                        tagline: "Built for Speed"
                    }}
                />
            );
        case 'family':
            return (
                <FamilyTemplate
                    brandName={dealer.brandName}
                    dealerName={dealer.name}
                    cars={dealerCars}
                    contactInfo={contactInfo}
                    config={{
                        heroTitle: "Your Family's Perfect Car Awaits",
                        heroSubtitle: "Safe, reliable, and affordable vehicles for every family",
                        tagline: "Trusted by Families"
                    }}
                />
            );
        case 'modern':
        default:
            return (
                <ModernTemplate
                    brandName={dealer.brandName}
                    dealerName={dealer.name}
                    cars={dealerCars}
                    contactInfo={contactInfo}
                    config={{
                        heroTitle: "Drive Your Dreams",
                        heroSubtitle: "Discover your perfect vehicle from our premium collection"
                    }}
                />
            );
    }
}

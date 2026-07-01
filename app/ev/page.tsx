import type { Metadata } from 'next';
import { Zap } from 'lucide-react';
import { FooterPageShell } from '@/components/marketing/FooterPageShell';

export const metadata: Metadata = {
    title: 'EV Zone | DealerSite Pro',
    description: 'Explore electric cars, bikes, scooters, and autos.',
};

const EV_ITEMS = [
    { title: 'Electric cars', description: 'Browse car listings with electric powertrains and range-focused specs.', href: '/cars?fuelType=Electric', meta: '4W' },
    { title: 'Electric bikes and scooters', description: 'Open the 2W catalog and filter for electric models.', href: '/bikes?type=electric', meta: '2W' },
    { title: 'Electric autos', description: 'Explore three-wheeler EVs for passenger and cargo use.', href: '/autos?type=electric', meta: '3W' },
    { title: 'EMI planning', description: 'Estimate monthly payments before shortlisting an EV.', href: '/tools/emi-calculator', meta: 'Finance' },
    { title: 'On-road price', description: 'Include RTO, insurance, and local charges for realistic EV pricing.', href: '/tools/on-road-price', meta: 'Pricing' },
    { title: 'Find a dealer', description: 'Jump to dealer discovery and connect with a seller.', href: '/dealers', meta: 'Dealer' },
];

export default function EvPage() {
    return (
        <FooterPageShell
            title="EV Zone"
            description="A single starting point for electric vehicle discovery across cars, two-wheelers, and three-wheelers."
            icon={Zap}
            primaryAction={{ label: 'Browse electric cars', href: '/cars?fuelType=Electric' }}
            secondaryAction={{ label: 'Open EV scooters', href: '/bikes?type=electric' }}
            sections={[{ title: 'Electric discovery', items: EV_ITEMS }]}
        />
    );
}

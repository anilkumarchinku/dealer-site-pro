import type { Metadata } from 'next';
import { MapPin } from 'lucide-react';
import { FooterPageShell } from '@/components/marketing/FooterPageShell';

export const metadata: Metadata = {
    title: 'Dealer Locator | DealerSite Pro',
    description: 'Find dealers and generated dealership websites.',
};

const DEALER_ITEMS = [
    { title: 'Vehicle marketplace', description: 'Open marketplace discovery with dealer inventory and lead actions.', href: '/marketplace#dealers', meta: 'Marketplace' },
    { title: 'All brands', description: 'Choose a brand first, then view models and available dealer inventory.', href: '/brands', meta: 'Brands' },
    { title: 'Cars', description: 'Find new and marketplace-listed cars with filters.', href: '/cars', meta: '4W' },
    { title: 'Bikes and scooters', description: 'Browse two-wheeler dealers and model catalogs.', href: '/bikes', meta: '2W' },
    { title: 'Autos and 3W', description: 'Explore commercial and passenger three-wheeler inventory.', href: '/autos', meta: '3W' },
    { title: 'Contact DealerSite Pro', description: 'Reach the platform team for dealer website setup.', href: '/contact', meta: 'Support' },
];

export default function DealersPage() {
    return (
        <FooterPageShell
            title="Dealer Locator"
            description="Find the right dealership path by brand, vehicle category, and marketplace inventory."
            icon={MapPin}
            primaryAction={{ label: 'Open marketplace locator', href: '/marketplace#dealers' }}
            secondaryAction={{ label: 'Contact us', href: '/contact' }}
            sections={[{ title: 'Dealer discovery', items: DEALER_ITEMS }]}
        />
    );
}

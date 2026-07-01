import type { Metadata } from 'next';
import { CalendarClock } from 'lucide-react';
import { FooterPageShell } from '@/components/marketing/FooterPageShell';

export const metadata: Metadata = {
    title: 'Upcoming Vehicles | DealerSite Pro',
    description: 'Track new launches and coming-soon vehicles.',
};

const UPCOMING_ITEMS = [
    { title: 'New 2026 launches', description: 'Watch for new model additions as marketplace data refreshes.', href: '/cars?year=2026', meta: 'Cars' },
    { title: 'Coming EVs', description: 'Follow electric vehicles entering the catalog.', href: '/ev', meta: 'EV' },
    { title: 'New bikes and scooters', description: 'Browse the latest two-wheeler catalog by brand and type.', href: '/bikes', meta: '2W' },
    { title: 'New autos and 3W', description: 'Explore passenger and cargo three-wheelers.', href: '/autos', meta: '3W' },
    { title: 'Brand directory', description: 'Open all brands and jump into the latest models by maker.', href: '/brands', meta: 'Brands' },
    { title: 'Price planning', description: 'Use tools before a launch lands at the dealership.', href: '/tools/on-road-price', meta: 'Tools' },
];

export default function UpcomingPage() {
    return (
        <FooterPageShell
            title="Upcoming Vehicles"
            description="A clean home for launch discovery, coming-soon models, and new catalog additions."
            icon={CalendarClock}
            primaryAction={{ label: 'Browse 2026 cars', href: '/cars?year=2026' }}
            secondaryAction={{ label: 'Open all brands', href: '/brands' }}
            sections={[{ title: 'Launch lanes', items: UPCOMING_ITEMS }]}
        />
    );
}

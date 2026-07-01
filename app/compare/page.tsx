import type { Metadata } from 'next';
import { GitCompare } from 'lucide-react';
import { FooterPageShell } from '@/components/marketing/FooterPageShell';

export const metadata: Metadata = {
    title: 'Compare Vehicles | DealerSite Pro',
    description: 'Compare shortlisted vehicles from the live catalog.',
};

const COMPARE_ITEMS = [
    { title: 'Cars', description: 'Use the compare buttons on car cards to build a side-by-side shortlist.', href: '/cars', meta: '4W' },
    { title: 'Bikes and scooters', description: 'Browse two-wheelers and compare suitable commuter or premium options.', href: '/bikes', meta: '2W' },
    { title: 'Autos and 3W', description: 'Compare passenger and cargo three-wheelers by fuel, seats, and mileage.', href: '/autos', meta: '3W' },
];

export default function ComparePage() {
    return (
        <FooterPageShell
            title="Compare Vehicles"
            description="Start from a vehicle listing page, add models to compare, and review the selected vehicles together."
            icon={GitCompare}
            primaryAction={{ label: 'Compare cars', href: '/cars' }}
            secondaryAction={{ label: 'Browse brands', href: '/brands' }}
            sections={[{ title: 'Where compare works', items: COMPARE_ITEMS }]}
        />
    );
}

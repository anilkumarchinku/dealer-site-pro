import type { Metadata } from 'next';
import { Car } from 'lucide-react';
import { FooterPageShell } from '@/components/marketing/FooterPageShell';

export const metadata: Metadata = {
    title: 'Browse Vehicles by Body Type | DealerSite Pro',
    description: 'Find cars and commercial vehicles by body style.',
};

const BODY_TYPES = [
    { title: 'Hatchback', description: 'Compact city cars with easy parking and lower running costs.', href: '/cars?bodyType=Hatchback', meta: 'City' },
    { title: 'Sedan', description: 'Comfortable three-box cars for daily and highway driving.', href: '/cars?bodyType=Sedan', meta: 'Comfort' },
    { title: 'SUV', description: 'High-riding vehicles with road presence and flexible seating.', href: '/cars?bodyType=SUV', meta: 'Popular' },
    { title: 'MPV', description: 'Family and people-mover vehicles with more seats and space.', href: '/cars?bodyType=MPV', meta: 'Family' },
    { title: 'Coupe', description: 'Style-led cars with a sportier profile.', href: '/cars?bodyType=Coupe', meta: 'Style' },
    { title: 'Pickup', description: 'Utility-focused vehicles for commercial and lifestyle use.', href: '/cars?bodyType=Pickup', meta: 'Utility' },
];

export default function BodyTypePage() {
    return (
        <FooterPageShell
            title="Browse by Body Type"
            description="Start with the shape of vehicle you need, then continue into live inventory and filters."
            icon={Car}
            primaryAction={{ label: 'Open vehicle filters', href: '/cars' }}
            secondaryAction={{ label: 'Browse autos', href: '/autos' }}
            sections={[{ title: 'Body type lanes', items: BODY_TYPES }]}
        />
    );
}

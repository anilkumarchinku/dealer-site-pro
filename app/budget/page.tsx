import type { Metadata } from 'next';
import { WalletCards } from 'lucide-react';
import { FooterPageShell } from '@/components/marketing/FooterPageShell';

export const metadata: Metadata = {
    title: 'Browse Vehicles by Budget | DealerSite Pro',
    description: 'Start vehicle discovery from common Indian budget bands.',
};

const BUDGETS = [
    { title: 'Under 5 lakh', description: 'Entry-level cars, autos, scooters, and commuter vehicles.', href: '/cars?minPrice=0&maxPrice=500000', meta: 'Starter' },
    { title: '5 to 10 lakh', description: 'Compact cars and practical family-ready vehicles.', href: '/cars?minPrice=500000&maxPrice=1000000', meta: 'Popular' },
    { title: '10 to 15 lakh', description: 'Premium hatchbacks, compact SUVs, and stronger feature packs.', href: '/cars?minPrice=1000000&maxPrice=1500000', meta: 'Upgrade' },
    { title: '15 to 20 lakh', description: 'SUVs, sedans, and higher-spec automatic variants.', href: '/cars?minPrice=1500000&maxPrice=2000000', meta: 'Family' },
    { title: '20 to 30 lakh', description: 'Upper-segment SUVs, sedans, and feature-rich models.', href: '/cars?minPrice=2000000&maxPrice=3000000', meta: 'Premium' },
    { title: 'Above 30 lakh', description: 'Luxury, performance, and flagship models.', href: '/cars?minPrice=3000000', meta: 'Luxury' },
];

export default function BudgetPage() {
    return (
        <FooterPageShell
            title="Browse by Budget"
            description="Choose a price band first, then move into the live inventory filters with the budget already applied."
            icon={WalletCards}
            primaryAction={{ label: 'Open all cars', href: '/cars' }}
            secondaryAction={{ label: 'See all brands', href: '/brands' }}
            sections={[{ title: 'Budget lanes', items: BUDGETS }]}
        />
    );
}

import type { Metadata } from 'next';
import { ShieldAlert } from 'lucide-react';
import { FooterPageShell } from '@/components/marketing/FooterPageShell';

export const metadata: Metadata = {
    title: 'Disclaimer | DealerSite Pro',
    description: 'DealerSite Pro pricing, inventory, and tool disclaimer.',
};

const DISCLAIMER_ITEMS = [
    { title: 'Prices', description: 'Vehicle prices can vary by city, variant, stock state, taxes, insurance, and dealer offers.', meta: 'Pricing' },
    { title: 'Inventory', description: 'Marketplace and dealer inventory can change before a visitor submits an enquiry.', meta: 'Stock' },
    { title: 'Calculators', description: 'EMI and on-road price tools are estimates. Final finance and pricing depend on providers and dealers.', meta: 'Tools' },
    { title: 'Images and specs', description: 'Images and specifications are for discovery and should be confirmed with the dealer before purchase.', meta: 'Catalog' },
    { title: 'Dealer websites', description: 'Generated websites are operated with dealer-provided data, branding, and inventory inputs.', meta: 'Sites' },
    { title: 'Legal terms', description: 'Read the full terms for account, usage, and platform responsibilities.', href: '/terms', meta: 'Terms' },
];

export default function DisclaimerPage() {
    return (
        <FooterPageShell
            title="Disclaimer"
            description="Important notes about vehicle pricing, stock, images, specifications, calculators, and generated dealership websites."
            icon={ShieldAlert}
            primaryAction={{ label: 'Read terms', href: '/terms' }}
            secondaryAction={{ label: 'Privacy policy', href: '/privacy' }}
            sections={[{ title: 'What to confirm', items: DISCLAIMER_ITEMS }]}
        />
    );
}

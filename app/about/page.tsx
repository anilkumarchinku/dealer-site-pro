import type { Metadata } from 'next';
import { Building2 } from 'lucide-react';
import { FooterPageShell } from '@/components/marketing/FooterPageShell';

export const metadata: Metadata = {
    title: 'About DealerSite Pro',
    description: 'Learn about DealerSite Pro and its dealership website platform.',
};

const ABOUT_ITEMS = [
    { title: 'Dealer websites', description: 'Launch branded dealer sites with inventory, enquiries, finance tools, and lead flows.', href: '/onboarding', meta: 'Platform' },
    { title: 'Marketplace discovery', description: 'Let visitors browse vehicles across brands, budgets, and body types.', href: '/marketplace', meta: 'Discovery' },
    { title: 'Dealer dashboard', description: 'Manage inventory, leads, messages, domains, and customer engagement.', href: '/dashboard', meta: 'Operations' },
];

export default function AboutPage() {
    return (
        <FooterPageShell
            title="About DealerSite Pro"
            description="DealerSite Pro helps Indian vehicle dealers create, manage, and grow digital dealership experiences across cars, bikes, and autos."
            icon={Building2}
            primaryAction={{ label: 'Create my website', href: '/onboarding' }}
            secondaryAction={{ label: 'Explore marketplace', href: '/marketplace' }}
            sections={[{ title: 'What the platform covers', items: ABOUT_ITEMS }]}
        />
    );
}

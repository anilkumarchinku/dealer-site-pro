import type { Metadata } from 'next';
import { MessageSquare } from 'lucide-react';
import { FooterPageShell } from '@/components/marketing/FooterPageShell';

export const metadata: Metadata = {
    title: 'Contact | DealerSite Pro',
    description: 'Contact DealerSite Pro for sales, support, and partnerships.',
};

const CONTACT_ITEMS = [
    { title: 'Sales', description: 'Talk to us about launching a dealership website.', href: 'mailto:sales@dealersitepro.com?subject=DealerSite%20Pro%20sales', meta: 'Email' },
    { title: 'Support', description: 'Get help with an existing DealerSite Pro account or dashboard.', href: 'mailto:support@dealersitepro.com?subject=DealerSite%20Pro%20support', meta: 'Email' },
    { title: 'Privacy', description: 'Ask data privacy or account information questions.', href: 'mailto:privacy@dealersitepro.com?subject=DealerSite%20Pro%20privacy', meta: 'Email' },
];

export default function ContactPage() {
    return (
        <FooterPageShell
            title="Contact"
            description="Reach the DealerSite Pro team for sales, dealer onboarding, support, media, and privacy questions."
            icon={MessageSquare}
            primaryAction={{ label: 'Email sales', href: 'mailto:sales@dealersitepro.com?subject=DealerSite%20Pro%20sales' }}
            secondaryAction={{ label: 'Create my website', href: '/onboarding' }}
            sections={[{ title: 'Contact routes', items: CONTACT_ITEMS }]}
        />
    );
}

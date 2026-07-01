import type { Metadata } from 'next';
import { ScrollText } from 'lucide-react';
import { FooterPageShell } from '@/components/marketing/FooterPageShell';

export const metadata: Metadata = {
    title: 'Terms of Service | DealerSite Pro',
    description: 'Terms for using DealerSite Pro websites, dashboards, inventory tools, and lead management features.',
};

const TERMS_SECTIONS = [
    {
        title: 'Using the platform',
        items: [
            { title: 'Dealer accounts', description: 'Dealers are responsible for account access, team usage, business details, published content, and keeping contact information accurate.', meta: 'Account' },
            { title: 'Website publishing', description: 'DealerSite Pro provides templates, hosting workflows, forms, dashboard tools, analytics, and integrations for automotive dealership operations.', meta: 'Service' },
            { title: 'Acceptable use', description: 'Do not publish fraudulent listings, misleading claims, unlawful content, spam, malware, scraped personal data, or content that violates third-party rights.', meta: 'Rules' },
        ],
    },
    {
        title: 'Inventory and leads',
        items: [
            { title: 'Vehicle accuracy', description: 'Dealers must keep vehicle price, availability, images, specifications, offers, and ownership information current before accepting bookings or commitments.' },
            { title: 'Lead handling', description: 'Buyer enquiries, calls, WhatsApp actions, finance requests, service bookings, and exchange requests should be handled lawfully and promptly by the dealer.' },
            { title: 'Customer decisions', description: 'DealerSite Pro helps buyers discover and enquire. Final vehicle inspection, documents, finance approval, pricing, and sale terms are between buyer and dealer.' },
        ],
    },
    {
        title: 'Commercial and legal',
        items: [
            { title: 'Payments and domains', description: 'Paid plans, add-ons, custom domains, and third-party charges may have separate checkout, renewal, cancellation, and provider terms.' },
            { title: 'Platform content', description: 'Dealer-uploaded logos, images, listings, and descriptions remain dealer content. DealerSite Pro templates, software, and platform branding remain platform property.' },
            { title: 'Legal support', description: 'For contract, billing, acceptable-use, or platform policy questions, contact our legal team.', href: 'mailto:legal@dealersitepro.com' },
        ],
    },
];

export default function TermsPage() {
    return (
        <FooterPageShell
            title="Terms of Service"
            description="These terms explain how dealers and visitors should use DealerSite Pro websites, dashboards, inventory tools, and enquiry flows."
            icon={ScrollText}
            primaryAction={{ label: 'Contact legal team', href: 'mailto:legal@dealersitepro.com' }}
            secondaryAction={{ label: 'Privacy policy', href: '/privacy' }}
            sections={TERMS_SECTIONS}
        />
    );
}

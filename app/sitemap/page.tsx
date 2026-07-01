import type { Metadata } from 'next';
import { Map } from 'lucide-react';
import { FooterPageShell } from '@/components/marketing/FooterPageShell';

export const metadata: Metadata = {
    title: 'Sitemap | DealerSite Pro',
    description: 'Find important DealerSite Pro pages for company information, legal documents, dealer tools, and vehicle discovery.',
};

const SITEMAP_SECTIONS = [
    {
        title: 'Company',
        items: [
            { title: 'About', description: 'Learn what DealerSite Pro offers to vehicle dealers and buyers.', href: '/about' },
            { title: 'Careers', description: 'See areas where product, engineering, and dealer success contributors can connect with us.', href: '/careers' },
            { title: 'Press', description: 'Access press contact details and platform context for media enquiries.', href: '/press' },
            { title: 'Contact', description: 'Reach DealerSite Pro for support, sales, partnerships, or platform questions.', href: '/contact' },
        ],
    },
    {
        title: 'Legal',
        items: [
            { title: 'Privacy', description: 'Understand how dealer, inventory, visitor, and lead data is handled.', href: '/privacy' },
            { title: 'Terms', description: 'Review platform usage, dealer responsibilities, inventory rules, and commercial terms.', href: '/terms' },
            { title: 'Disclaimer', description: 'Read important notes about vehicle data, pricing, availability, finance, and third-party services.', href: '/disclaimer' },
            { title: 'XML sitemap', description: 'Open the machine-readable sitemap used by search engines.', href: '/sitemap.xml' },
        ],
    },
    {
        title: 'Dealer tools',
        items: [
            { title: 'Create website', description: 'Start onboarding and generate a dealer storefront.', href: '/onboarding' },
            { title: 'Dashboard', description: 'Manage inventory, leads, services, offers, content, and dealer operations.', href: '/dashboard' },
            { title: 'Lead dashboard', description: 'Review website leads, walk-in interest, customer enquiries, and follow-up activity.', href: '/dashboard/leads' },
            { title: 'Admin', description: 'Access operational admin tools where permitted.', href: '/admin' },
        ],
    },
    {
        title: 'Vehicle discovery',
        items: [
            { title: 'Marketplace', description: 'Browse dealer listings and vehicle discovery flows.', href: '/marketplace' },
            { title: 'Cars', description: 'Search cars across brands, body types, budgets, and filters.', href: '/cars' },
            { title: 'Brands', description: 'Explore vehicle brands and model collections.', href: '/brands' },
            { title: 'Compare', description: 'Compare vehicles side by side before shortlisting.', href: '/compare' },
        ],
    },
];

export default function SitemapPage() {
    return (
        <FooterPageShell
            title="Sitemap"
            description="A clean index of the important DealerSite Pro pages for company info, legal coverage, dealer tools, and vehicle discovery."
            icon={Map}
            primaryAction={{ label: 'Create my website', href: '/onboarding' }}
            secondaryAction={{ label: 'Contact us', href: '/contact' }}
            sections={SITEMAP_SECTIONS}
        />
    );
}

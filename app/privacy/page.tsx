import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { FooterPageShell } from '@/components/marketing/FooterPageShell';

export const metadata: Metadata = {
    title: 'Privacy Policy | DealerSite Pro',
    description: 'How DealerSite Pro collects, uses, protects, and manages dealer and buyer information.',
};

const PRIVACY_SECTIONS = [
    {
        title: 'What we collect',
        items: [
            { title: 'Dealer account details', description: 'Name, phone, email, dealership name, location, business profile, selected services, uploaded logo, hero images, and inventory content.', meta: 'Dealers' },
            { title: 'Buyer enquiry details', description: 'Lead forms can include name, phone, email, vehicle interest, message, test-drive request, finance request, service request, or exchange request.', meta: 'Customers' },
            { title: 'Usage and diagnostics', description: 'We record product usage, lead events, page visits, browser/device signals, and error diagnostics to operate and improve the platform.', meta: 'Analytics' },
        ],
    },
    {
        title: 'How we use data',
        items: [
            { title: 'Run dealer websites', description: 'We use dealer data to publish public sites, inventory pages, contact sections, forms, offers, location details, and dashboard views.' },
            { title: 'Route leads correctly', description: 'Buyer enquiries are routed to the relevant dealer dashboard and contact channels so teams can respond to walk-in, website, finance, and service interest.' },
            { title: 'Protect the service', description: 'Operational logs, permissions, and security checks help prevent misuse, debug issues, and keep API keys server-side.' },
        ],
    },
    {
        title: 'Control and support',
        items: [
            { title: 'Dealer controls', description: 'Dealers can update published content, vehicle listings, branding, services, and contact information from their dashboard.', href: '/dashboard' },
            { title: 'Privacy requests', description: 'For access, correction, deletion, or export requests, contact the DealerSite Pro privacy team.', href: 'mailto:privacy@dealersitepro.com' },
            { title: 'Third-party processors', description: 'Hosting, database, email, payments, analytics, and storage providers may process data only as needed to deliver platform functionality.' },
        ],
    },
];

export default function PrivacyPage() {
    return (
        <FooterPageShell
            title="Privacy Policy"
            description="DealerSite Pro handles dealership, inventory, and buyer lead data with practical controls, server-side secret handling, and clear support channels."
            icon={ShieldCheck}
            primaryAction={{ label: 'Contact privacy team', href: 'mailto:privacy@dealersitepro.com' }}
            secondaryAction={{ label: 'Read terms', href: '/terms' }}
            sections={PRIVACY_SECTIONS}
        />
    );
}

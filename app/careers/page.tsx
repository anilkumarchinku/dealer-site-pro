import type { Metadata } from 'next';
import { Briefcase } from 'lucide-react';
import { FooterPageShell } from '@/components/marketing/FooterPageShell';

export const metadata: Metadata = {
    title: 'Careers | DealerSite Pro',
    description: 'Work with DealerSite Pro.',
};

const CAREER_ITEMS = [
    { title: 'Product and design', description: 'Build polished dealership workflows, inventory tools, and buyer experiences.', href: 'mailto:careers@dealersitepro.com?subject=Product%20and%20design%20role', meta: 'Team' },
    { title: 'Engineering', description: 'Work across Next.js, Supabase, integrations, payments, and automotive data flows.', href: 'mailto:careers@dealersitepro.com?subject=Engineering%20role', meta: 'Team' },
    { title: 'Dealer success', description: 'Help dealers launch, maintain, and improve their digital storefronts.', href: 'mailto:careers@dealersitepro.com?subject=Dealer%20success%20role', meta: 'Team' },
];

export default function CareersPage() {
    return (
        <FooterPageShell
            title="Careers"
            description="We are building practical software for vehicle dealers, from storefronts to operations."
            icon={Briefcase}
            primaryAction={{ label: 'Email careers', href: 'mailto:careers@dealersitepro.com?subject=DealerSite%20Pro%20careers' }}
            secondaryAction={{ label: 'About us', href: '/about' }}
            sections={[{ title: 'Open interest areas', items: CAREER_ITEMS }]}
        />
    );
}

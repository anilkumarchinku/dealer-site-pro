import type { Metadata } from 'next';
import { Newspaper } from 'lucide-react';
import { FooterPageShell } from '@/components/marketing/FooterPageShell';

export const metadata: Metadata = {
    title: 'Press | DealerSite Pro',
    description: 'Press and media contact for DealerSite Pro.',
};

const PRESS_ITEMS = [
    { title: 'Company overview', description: 'DealerSite Pro builds dealership websites and marketplace discovery for Indian dealers.', href: '/about', meta: 'Background' },
    { title: 'Product screenshots', description: 'Open live marketplace and generated website examples from the running platform.', href: '/marketplace', meta: 'Assets' },
    { title: 'Media contact', description: 'Reach the team for announcements, product notes, and interviews.', href: 'mailto:press@dealersitepro.com?subject=DealerSite%20Pro%20press', meta: 'Contact' },
];

export default function PressPage() {
    return (
        <FooterPageShell
            title="Press"
            description="Media and company information for DealerSite Pro."
            icon={Newspaper}
            primaryAction={{ label: 'Email press team', href: 'mailto:press@dealersitepro.com?subject=DealerSite%20Pro%20press' }}
            secondaryAction={{ label: 'Read about us', href: '/about' }}
            sections={[{ title: 'Press resources', items: PRESS_ITEMS }]}
        />
    );
}

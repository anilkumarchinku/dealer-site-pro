/**
 * Compare Cars Page — /compare
 * Side-by-side car comparison
 */

import { Metadata } from 'next';
import { ComparePageContent } from '@/components/compare/ComparePageContent';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export const metadata: Metadata = {
    title: 'Compare Cars Side by Side | DealerSite Pro',
    description: 'Compare cars side by side — price, specs, features, mileage, and more.',
};

export default function ComparePage() {
    return (
        <>
            <SiteHeader />
            <ComparePageContent />
            <SiteFooter />
        </>
    );
}

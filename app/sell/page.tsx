/**
 * Sell Your Car — /sell
 * 3-step flow: Car Details → Schedule Inspection → Get Offer
 */

import { Metadata } from 'next';
import { SellCarFlow } from '@/components/tools/SellCarFlow';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export const metadata: Metadata = {
    title: 'Sell Your Car | DealerSite Pro',
    description: 'Get the best price for your car. Free valuation, doorstep inspection, and instant payment.',
};

export default function SellCarPage() {
    return (
        <>
            <SiteHeader />
            <SellCarFlow />
            <SiteFooter />
        </>
    );
}

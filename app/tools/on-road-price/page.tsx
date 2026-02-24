import { Metadata } from 'next';
import { OnRoadPriceCalculator } from '@/components/tools/OnRoadPriceCalculator';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export const metadata: Metadata = {
    title: 'On-Road Price Calculator | DealerSite Pro',
    description: 'Calculate the on-road price of any car including ex-showroom, RTO, insurance, and other charges.',
};

export default function OnRoadPricePage() {
    return (
        <>
            <SiteHeader />
            <OnRoadPriceCalculator />
            <SiteFooter />
        </>
    );
}

import { Metadata } from 'next';
import { CarValuationTool } from '@/components/tools/CarValuationTool';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export const metadata: Metadata = {
    title: 'Used Car Valuation — Check Your Car\'s Worth | DealerSite Pro',
    description: 'Get an instant estimated value for your used car. Enter details like brand, model, year, and mileage.',
};

export default function CarValuationPage() {
    return (
        <>
            <SiteHeader />
            <CarValuationTool />
            <SiteFooter />
        </>
    );
}

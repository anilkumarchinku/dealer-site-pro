/**
 * Insurance Estimator — /tools/insurance-estimator
 */

import { Metadata } from 'next';
import { InsuranceEstimator } from '@/components/tools/InsuranceEstimator';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export const metadata: Metadata = {
    title: 'Car Insurance Estimator | DealerSite Pro',
    description: 'Estimate your car insurance premium. Compare third-party and comprehensive plans.',
};

export default function InsuranceEstimatorPage() {
    return (
        <>
            <SiteHeader />
            <InsuranceEstimator />
            <SiteFooter />
        </>
    );
}

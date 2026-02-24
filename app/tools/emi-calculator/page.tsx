/**
 * Standalone EMI Calculator Page — /tools/emi-calculator
 */

import { Metadata } from 'next';
import { EmiCalculatorPageContent } from '@/components/tools/EmiCalculatorPage';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export const metadata: Metadata = {
    title: 'Car Loan EMI Calculator | DealerSite Pro',
    description: 'Calculate your car loan EMI instantly. Adjust vehicle price, down payment, tenure, and interest rate.',
};

export default function EmiCalculatorPage() {
    return (
        <>
            <SiteHeader />
            <EmiCalculatorPageContent />
            <SiteFooter />
        </>
    );
}

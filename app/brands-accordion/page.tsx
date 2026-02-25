/**
 * /brands-accordion  — Option B: Accordion Brand Cards
 *
 * Shows all 28 brands. Each card expands into an accordion of models
 * with fuel-coloured variant chips. Click a chip → slide-in spec sheet.
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { BrandsAccordionClient } from './BrandsAccordionClient';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'All Models & Variants | DealerSite Pro',
    description: 'Browse all car models and variants across 28 brands — specs, prices, fuel types and more.',
};

export default function BrandsAccordionPage() {
    return (
        <>
            <SiteHeader />
            <div className="bg-background min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-foreground font-medium">All Models & Variants</span>
                    </nav>

                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">All Models & Variants</h1>
                        <p className="text-muted-foreground mt-1">
                            28 brands · 173 models · 817+ variants — click any brand to explore models and variants
                        </p>

                        {/* Legend */}
                        <div className="flex flex-wrap gap-3 mt-4">
                            <span className="flex items-center gap-1.5 text-xs">
                                <span className="w-3 h-3 rounded-sm bg-blue-500/20 border border-blue-500/40 inline-block" /> Petrol
                            </span>
                            <span className="flex items-center gap-1.5 text-xs">
                                <span className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500/40 inline-block" /> Diesel
                            </span>
                            <span className="flex items-center gap-1.5 text-xs">
                                <span className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/40 inline-block" /> Electric
                            </span>
                            <span className="flex items-center gap-1.5 text-xs">
                                <span className="w-3 h-3 rounded-sm bg-teal-500/20 border border-teal-500/40 inline-block" /> CNG
                            </span>
                            <span className="text-xs text-muted-foreground">· Click a variant chip to see full specs</span>
                        </div>
                    </div>

                    {/* Client component renders all accordion cards */}
                    <BrandsAccordionClient />
                </div>
            </div>
            <SiteFooter />
        </>
    );
}

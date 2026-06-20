'use client';

import { Shield, Settings, CheckCircle2, Wrench, IndianRupee, LifeBuoy } from 'lucide-react';

interface TrustBadgesSectionProps {
    brandColor: string;
    dealerName: string;
    vehicleType?: '2w' | '3w' | '4w';
}

interface Badge {
    icon: React.ElementType;
    title: string;
    subtitle: string;
}

// Trust statements describe what the dealership offers — they are deliberately
// non-numeric value props, NOT fabricated metrics (no invented customer counts,
// star ratings, or certifications a dealer never earned).
const BADGES: Badge[] = [
    {
        icon: Shield,
        title: 'Authorised Dealer',
        subtitle: 'Genuine vehicles from authorised brands',
    },
    {
        icon: CheckCircle2,
        title: 'Genuine Spare Parts',
        subtitle: 'Only original manufacturer parts',
    },
    {
        icon: Settings,
        title: 'Trained Technicians',
        subtitle: 'Brand-certified service experts',
    },
    {
        icon: IndianRupee,
        title: 'Transparent Pricing',
        subtitle: 'Clear quotes with no hidden charges',
    },
    {
        icon: Wrench,
        title: 'Expert Service',
        subtitle: 'Maintenance, repairs and tune-ups',
    },
    {
        icon: LifeBuoy,
        title: 'Dedicated Support',
        subtitle: "We're here before and after your purchase",
    },
];

export function TrustBadgesSection({
    brandColor,
    dealerName,
    vehicleType: _vehicleType,
}: TrustBadgesSectionProps) {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-10">
                    <span
                        className="text-sm font-semibold uppercase tracking-widest"
                        style={{ color: brandColor }}
                    >
                        Our Promise
                    </span>
                    <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                        Why Trust Us
                    </h2>
                    <p className="mt-3 text-gray-600 max-w-xl mx-auto">
                        {dealerName} is committed to giving you the best vehicle buying experience in the region.
                    </p>
                </div>

                {/* Badge grid: 2 col mobile / 3 col desktop / 6 col xl */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                    {BADGES.map((badge) => {
                        const Icon = badge.icon;
                        return (
                            <div
                                key={badge.title}
                                className="bg-white rounded-2xl p-5 flex flex-col items-center text-center gap-3 border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                {/* Icon circle */}
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${brandColor}26` }}
                                >
                                    <Icon className="w-6 h-6" style={{ color: brandColor }} />
                                </div>

                                {/* Title */}
                                <h3 className="font-bold text-gray-900 text-sm leading-snug">
                                    {badge.title}
                                </h3>

                                {/* Subtitle */}
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    {badge.subtitle}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

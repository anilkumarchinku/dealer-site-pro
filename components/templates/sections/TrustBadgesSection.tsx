'use client';

import { Shield, Users, Star, Settings, CheckCircle2, Award } from 'lucide-react';

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

const BADGES: Badge[] = [
    {
        icon: Shield,
        title: 'Authorised Dealer',
        subtitle: 'Official brand authorized dealer',
    },
    {
        icon: Users,
        title: '10,000+ Happy Customers',
        subtitle: 'Trusted by thousands across the region',
    },
    {
        icon: Star,
        title: '5-Star Rated',
        subtitle: 'Top-rated on Google & Justdial',
    },
    {
        icon: Settings,
        title: 'Trained Technicians',
        subtitle: 'Brand-certified service experts',
    },
    {
        icon: CheckCircle2,
        title: 'Transparent Pricing',
        subtitle: 'No hidden charges, ever',
    },
    {
        icon: Award,
        title: 'ISO Certified',
        subtitle: 'Quality assured processes',
    },
];

function StarRating() {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
        </div>
    );
}

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
                    <p className="mt-3 text-gray-500 max-w-xl mx-auto">
                        {dealerName} is committed to giving you the best vehicle buying experience in the region.
                    </p>
                </div>

                {/* Badge grid: 2 col mobile / 3 col desktop / 6 col xl */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                    {BADGES.map((badge) => {
                        const Icon = badge.icon;
                        const isStarRated = badge.title === '5-Star Rated';
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

                                {/* Star rendering for the 5-star card */}
                                {isStarRated && <StarRating />}

                                {/* Subtitle */}
                                <p className="text-xs text-gray-500 leading-relaxed">
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

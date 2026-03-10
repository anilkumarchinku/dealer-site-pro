'use client';

import { ArrowLeftRight, Shield, BadgePercent, Users, PhoneCall } from 'lucide-react';

interface OffersSectionProps {
    brandColor: string;
    dealerName: string;
    vehicleType?: '2w' | '3w' | '4w';
    dealerPhone: string;
    dealerWhatsapp?: string;
}

function getOffers(vehicleType?: '2w' | '3w' | '4w') {
    const exchangeDesc =
        vehicleType === '2w'
            ? 'Get up to ₹30,000 exchange bonus on your old bike/scooter. T&C apply.'
            : vehicleType === '3w'
            ? 'Get up to ₹30,000 exchange bonus on your old auto/cargo vehicle. T&C apply.'
            : 'Get up to ₹30,000 exchange bonus on your old vehicle. T&C apply.';

    const emiDesc =
        vehicleType === '2w'
            ? 'Zero processing fee on loans. EMI starting ₹999/month.'
            : vehicleType === '3w'
            ? 'Zero processing fee on loans. EMI starting ₹1,999/month.'
            : 'Zero processing fee on loans. EMI starting ₹3,999/month.';

    return [
        {
            icon: ArrowLeftRight,
            title: 'Exchange Bonus',
            description: exchangeDesc,
            badge: 'Limited Time',
        },
        {
            icon: Shield,
            title: 'Free Insurance',
            description: '1-year comprehensive insurance FREE on all new vehicles purchased this month.',
            badge: 'This Month',
        },
        {
            icon: BadgePercent,
            title: 'Easy Finance',
            description: emiDesc,
            badge: 'Bank Offer',
        },
        {
            icon: Users,
            title: 'Corporate Discount',
            description: 'Special pricing for government employees, teachers & defence personnel.',
            badge: 'Special',
        },
    ];
}

export function OffersSection({
    brandColor,
    dealerName,
    vehicleType,
    dealerPhone,
    dealerWhatsapp,
}: OffersSectionProps) {
    const offers = getOffers(vehicleType);

    function getEnquireHref() {
        if (dealerWhatsapp) {
            const wa = dealerWhatsapp.replace(/\D/g, '');
            return `https://wa.me/${wa}?text=Hi%20${encodeURIComponent(dealerName)}%2C%20I%27d%20like%20to%20know%20more%20about%20your%20current%20offers.`;
        }
        return `tel:${dealerPhone}`;
    }

    const enquireHref = getEnquireHref();

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-10">
                    <span
                        className="text-sm font-semibold uppercase tracking-widest"
                        style={{ color: brandColor }}
                    >
                        Exclusive Offers
                    </span>
                    <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                        This Month&apos;s Schemes
                    </h2>
                    <p className="mt-3 text-gray-500 max-w-xl mx-auto">
                        Take advantage of these limited-time deals available exclusively at {dealerName}.
                    </p>
                </div>

                {/* Offer cards — 2×2 on sm, 4 across on lg */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {offers.map((offer) => {
                        const Icon = offer.icon;
                        return (
                            <div
                                key={offer.title}
                                className="bg-white rounded-2xl p-6 flex flex-col gap-4"
                                style={{ border: `1.5px solid ${brandColor}33` }}
                            >
                                {/* Icon circle */}
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${brandColor}26` }}
                                >
                                    <Icon className="w-6 h-6" style={{ color: brandColor }} />
                                </div>

                                {/* Badge */}
                                <span
                                    className="inline-flex self-start items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                                    style={{
                                        backgroundColor: `${brandColor}26`,
                                        color: brandColor,
                                    }}
                                >
                                    {offer.badge}
                                </span>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 mb-1">{offer.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        {offer.description}
                                    </p>
                                </div>

                                {/* Enquire link */}
                                <a
                                    href={enquireHref}
                                    className="text-sm font-semibold hover:underline mt-auto"
                                    style={{ color: brandColor }}
                                    target={dealerWhatsapp ? '_blank' : undefined}
                                    rel={dealerWhatsapp ? 'noopener noreferrer' : undefined}
                                >
                                    Enquire Now →
                                </a>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <a
                        href={`tel:${dealerPhone}`}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-base shadow-lg hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: brandColor }}
                    >
                        <PhoneCall className="w-5 h-5" />
                        Get Best Price Today
                    </a>
                </div>
            </div>
        </section>
    );
}

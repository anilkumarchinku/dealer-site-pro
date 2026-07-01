'use client';

import { ArrowLeftRight, Shield, BadgePercent, Users, PhoneCall, Building2, CalendarDays, Gift, Sparkles } from 'lucide-react';
import { getContrastText, getReadableAccent } from '@/lib/utils/color-contrast';

interface DealerOffer {
    id: string;
    title: string;
    description: string | null;
    tag: string | null;
    valid_until: string | null;
    image_url: string | null;
    promotion_type: string | null;
    outlet_name: string | null;
}

interface OffersSectionProps {
    brandColor: string;
    dealerName: string;
    vehicleType?: '2w' | '3w' | '4w';
    dealerPhone: string;
    dealerWhatsapp?: string;
    dealerOffers?: DealerOffer[];
    templateStyle?: 'modern' | 'luxury' | 'sporty' | 'family' | 'used';
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
    Finance:  { bg: '#dcfce7', text: '#15803d' },
    Exchange: { bg: '#dbeafe', text: '#1d4ed8' },
    Service:  { bg: '#f3e8ff', text: '#7e22ce' },
    Electric: { bg: '#fef9c3', text: '#a16207' },
    Offer:    { bg: '#ffedd5', text: '#c2410c' },
    Referral: { bg: '#fee2e2', text: '#b91c1c' },
    Seasonal: { bg: '#fce7f3', text: '#be185d' },
};

const FALLBACK_FESTIVAL_OFFERS: DealerOffer[] = [
    {
        id: 'festival-booking-benefit',
        title: 'Festival Booking Benefits',
        description: 'Ask our team about current festive booking benefits, accessory guidance, and delivery support.',
        tag: 'Seasonal',
        valid_until: null,
        image_url: null,
        promotion_type: 'festival',
        outlet_name: null,
    },
    {
        id: 'exchange-upgrade-week',
        title: 'Exchange Upgrade Week',
        description: 'Get exchange support and valuation guidance when upgrading from an older vehicle.',
        tag: 'Exchange',
        valid_until: null,
        image_url: null,
        promotion_type: 'exchange',
        outlet_name: null,
    },
    {
        id: 'easy-emi-fest',
        title: 'Easy EMI Desk',
        description: 'Speak with our finance desk for EMI planning, down-payment guidance, and document support.',
        tag: 'Finance',
        valid_until: null,
        image_url: null,
        promotion_type: 'finance',
        outlet_name: null,
    },
    {
        id: 'delivery-celebration',
        title: 'Celebration Delivery Pack',
        description: 'Plan a smoother festive handover with accessory, warranty, and first-service guidance.',
        tag: 'Offer',
        valid_until: null,
        image_url: null,
        promotion_type: 'delivery',
        outlet_name: null,
    },
];

function getOffers(vehicleType?: '2w' | '3w' | '4w') {
    const exchangeDesc =
        vehicleType === '2w'
            ? 'Trade in your old bike or scooter and get a fair value towards your new ride.'
            : vehicleType === '3w'
            ? 'Trade in your old auto or cargo vehicle and get a fair value towards your new one.'
            : 'Trade in your old vehicle and get a fair value towards your new one.';

    // Generic, non-committal value props — we don't advertise specific rates,
    // amounts, or schemes the dealer hasn't actually authored. Each card invites
    // the buyer to enquire for current details.
    return [
        {
            icon: ArrowLeftRight,
            title: 'Exchange Your Vehicle',
            description: exchangeDesc,
            badge: 'Exchange',
        },
        {
            icon: Shield,
            title: 'Insurance Assistance',
            description: 'We help you get your vehicle insured through trusted partners.',
            badge: 'Insurance',
        },
        {
            icon: BadgePercent,
            title: 'Easy Finance',
            description: 'Flexible EMI and loan options to suit your budget — ask us about plans.',
            badge: 'Finance',
        },
        {
            icon: Users,
            title: 'Corporate & Fleet',
            description: 'Buying for a business or fleet? Talk to us about tailored options.',
            badge: 'Corporate',
        },
    ];
}

export function OffersSection({
    brandColor,
    dealerName,
    vehicleType,
    dealerPhone,
    dealerWhatsapp,
    dealerOffers,
    templateStyle = 'modern',
}: OffersSectionProps) {
    const genericOffers = getOffers(vehicleType);
    const hasDealerOffers = dealerOffers && dealerOffers.length > 0;
    const carouselOffers = hasDealerOffers ? dealerOffers.slice(0, 5) : FALLBACK_FESTIVAL_OFFERS;

    // Readable text color for the brand-filled CTA (light brands need dark text).
    const onBrandText = getContrastText(brandColor);
    const brandAccent = getReadableAccent(brandColor);
    const isLuxury = templateStyle === 'luxury';
    const isSporty = templateStyle === 'sporty';
    const isFamily = templateStyle === 'family';
    const sectionClass = isSporty
        ? 'bg-[#090C10] text-white'
        : isLuxury
        ? 'bg-[#11100E] text-[#FFF8EE]'
        : isFamily
        ? 'bg-[#FFF5F7] text-gray-950'
        : 'bg-gray-50 text-gray-950';
    const cardClass = isSporty
        ? 'bg-[#121A24] text-white border-[#303A46] rounded-none'
        : isLuxury
        ? 'bg-[#1A1713] text-[#FFF8EE] border-[#4A3E31] rounded-[1.8rem]'
        : isFamily
        ? 'bg-white text-gray-950 border-[#F4C6D0] rounded-[1.8rem]'
        : 'bg-white text-gray-950 border-gray-200 rounded-2xl';
    const mutedTextClass = isSporty || isLuxury ? 'text-white/68' : 'text-gray-600';
    const headingClass = isSporty
        ? 'uppercase tracking-tight'
        : isLuxury
        ? 'font-light tracking-tight'
        : 'font-bold';
    const labelText = hasDealerOffers ? 'Festival Offers Live' : 'Festival Benefits';
    const subtitle = hasDealerOffers
        ? `Latest festival promotions from ${dealerName}, arranged for quick comparison.`
        : `${dealerName} can help with seasonal booking support, exchange, finance, and delivery assistance. Ask for the latest active benefits.`;

    function getEnquireHref() {
        if (dealerWhatsapp) {
            const wa = dealerWhatsapp.replace(/\D/g, '');
            return `https://wa.me/${wa}?text=Hi%20${encodeURIComponent(dealerName)}%2C%20I%27d%20like%20to%20know%20more%20about%20your%20current%20offers.`;
        }
        return `tel:${dealerPhone}`;
    }

    const enquireHref = getEnquireHref();

    return (
        <section className={`overflow-hidden py-16 ${sectionClass}`}>
            <div className="max-w-7xl mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-10">
                    <span
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-widest"
                        style={{ color: brandAccent }}
                    >
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                        {labelText}
                    </span>
                    <h2 className={`mt-4 text-3xl md:text-5xl ${headingClass}`}>
                        Festival Offers &amp; Promotions
                    </h2>
                    <p className={`mx-auto mt-3 max-w-2xl ${mutedTextClass}`}>
                        {subtitle}
                    </p>
                </div>

                {/* Dealer-authored or preview festival offers */}
                <div className="mb-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                        {carouselOffers.map((offer) => {
                            const tagColor = offer.tag ? TAG_COLORS[offer.tag] : null;
                            return (
                                <div
                                    key={offer.id}
                                    className={`flex min-w-0 flex-col overflow-hidden border shadow-xl shadow-black/5 ${cardClass}`}
                                    style={{ borderColor: `${brandColor}55` }}
                                >
                                    {/* Image */}
                                    {offer.image_url ? (
                                        <img
                                            src={offer.image_url}
                                            alt={offer.title}
                                            className="w-full h-40 object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="flex h-40 items-center justify-between overflow-hidden p-5"
                                            style={{
                                                background: isSporty
                                                    ? `linear-gradient(135deg, ${brandAccent} 0%, #101820 65%)`
                                                    : isLuxury
                                                    ? `linear-gradient(135deg, ${brandAccent} 0%, #342515 100%)`
                                                    : `linear-gradient(135deg, ${brandAccent} 0%, ${brandColor}22 100%)`,
                                            }}
                                        >
                                            <div className={isSporty || isLuxury ? 'text-white' : 'text-white'}>
                                                <p className="text-xs font-black uppercase tracking-[0.24em] opacity-80">Festival</p>
                                                <p className="mt-2 max-w-[12rem] text-2xl font-black leading-tight">Festival benefit</p>
                                            </div>
                                            <Gift className="h-16 w-16 text-white/85" aria-hidden="true" />
                                        </div>
                                    )}
                                    <div className="p-5 flex flex-col flex-1 gap-3">
                                        {/* Badges row */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {offer.outlet_name && (
                                                <span
                                                    className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                                                    style={{ backgroundColor: `${brandColor}18`, color: brandAccent }}
                                                >
                                                    <Building2 className="w-3 h-3" />
                                                    {offer.outlet_name}
                                                </span>
                                            )}
                                            {offer.tag && (
                                                <span
                                                    className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
                                                    style={{
                                                        backgroundColor: tagColor?.bg ?? `${brandColor}26`,
                                                        color: tagColor?.text ?? brandColor,
                                                    }}
                                                >
                                                    {offer.tag}
                                                </span>
                                            )}
                                            {offer.promotion_type && offer.promotion_type !== 'offer' && (
                                                <span
                                                    className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
                                                    style={{ backgroundColor: `${brandColor}15`, color: brandColor }}
                                                >
                                                    {offer.promotion_type.charAt(0).toUpperCase() + offer.promotion_type.slice(1)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Title & description */}
                                        <h3 className="text-lg font-bold">{offer.title}</h3>
                                        {offer.description && (
                                            <p className={`text-sm leading-relaxed ${mutedTextClass}`}>{offer.description}</p>
                                        )}

                                        {/* Valid until */}
                                        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                                            <p className={`inline-flex items-center gap-1 text-xs ${mutedTextClass}`}>
                                                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                                                {offer.valid_until
                                                    ? `Valid until ${new Date(offer.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                                                    : 'Ask showroom for dates'}
                                            </p>

                                            {/* Enquire link */}
                                            <a
                                                href={enquireHref}
                                                className="shrink-0 text-sm font-semibold hover:underline"
                                                style={{ color: brandAccent }}
                                                target={dealerWhatsapp ? '_blank' : undefined}
                                                rel={dealerWhatsapp ? 'noopener noreferrer' : undefined}
                                            >
                                                Enquire →
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {/* Generic value-prop cards */}
                <h3 className={`text-center text-lg font-semibold mb-6 ${isSporty || isLuxury ? 'text-white/86' : 'text-gray-800'}`}>
                    How We Help
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {genericOffers.map((offer) => {
                        const Icon = offer.icon;
                        return (
                            <div
                                key={offer.title}
                                className={`p-6 flex flex-col gap-4 border ${cardClass}`}
                                style={{ borderColor: `${brandColor}33` }}
                            >
                                {/* Icon circle */}
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${brandColor}26` }}
                                >
                                    <Icon className="w-6 h-6" style={{ color: brandAccent }} />
                                </div>

                                {/* Badge */}
                                <span
                                    className="inline-flex self-start items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                                    style={{
                                        backgroundColor: `${brandColor}26`,
                                        color: brandAccent,
                                    }}
                                >
                                    {offer.badge}
                                </span>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="font-bold mb-1">{offer.title}</h3>
                                    <p className={`text-sm leading-relaxed ${mutedTextClass}`}>
                                        {offer.description}
                                    </p>
                                </div>

                                {/* Enquire link */}
                                <a
                                    href={enquireHref}
                                    className="text-sm font-semibold hover:underline mt-auto"
                                    style={{ color: brandAccent }}
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
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base shadow-lg hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: brandColor, color: onBrandText }}
                    >
                        <PhoneCall className="w-5 h-5" />
                        Get Best Price Today
                    </a>
                </div>
            </div>
        </section>
    );
}

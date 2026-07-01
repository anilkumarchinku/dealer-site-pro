'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { usePathname } from 'next/navigation';
import {
    ArrowRight,
    BadgeCheck,
    CalendarDays,
    Car as CarIcon,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Fuel,
    Gauge,
    Mail,
    MapPin,
    MessageSquare,
    Menu,
    Phone,
    Search,
    ShieldCheck,
    SlidersHorizontal,
    Sparkles,
    Star,
    Tags,
    X,
} from 'lucide-react';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { ReviewsSection } from '@/components/ui/ReviewsSection';
import { StickyEnquiryBar } from '@/components/ui/StickyEnquiryBar';
import { EmiCalculator } from '@/components/ui/EmiCalculator';
import { OffersSection } from '@/components/templates/sections/OffersSection';
import { ExchangeSection } from '@/components/templates/sections/ExchangeSection';
import { FinanceSection } from '@/components/templates/sections/FinanceSection';
import { ServiceBookingSection } from '@/components/templates/sections/ServiceBookingSection';
import { FAQSection } from '@/components/templates/sections/FAQSection';
import { useLeadForm } from '@/components/templates/shared/useLeadForm';
import { getTemplateServiceMeta } from '@/components/templates/shared/service-meta';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
import { buildTemplateDetailBasePath } from '@/lib/utils/template-site-paths';
import { getContrastText, getReadableAccent } from '@/lib/utils/color-contrast';
import { brandNameToId, getVehicleImageUrls, isUsableVehicleImageUrl } from '@/lib/utils/brand-model-images';
import type { Car } from '@/lib/types/car';
import type { Service } from '@/lib/types';

interface PremiumUsedDealerTemplateProps {
    brandName: string;
    dealerName: string;
    dealerId?: string;
    cars: Car[];
    contactInfo: {
        phone: string;
        email: string;
        address: string;
        city?: string;
    };
    services?: Service[];
    workingHours?: string | null;
    logoUrl?: string;
    heroImageUrl?: string;
    heroImageUrls?: string[];
    sellsNewCars?: boolean;
    sellsUsedCars?: boolean;
    branches?: Array<{ city: string; address: string; phone?: string }>;
    serviceCenters?: Array<{ id: string; name: string; address?: string; city?: string; phone?: string }>;
    socialLinks?: { facebook: string | null; instagram: string | null; twitter?: string | null; youtube: string | null; linkedin?: string | null };
    sellVehicleHref?: string;
}

const FALLBACK_HEROES = [
    '/templates/premium-auto-drive/hero-1.jpg',
    '/templates/premium-auto-drive/hero-2.jpg',
    '/templates/premium-auto-drive/hero-3.jpg',
];

function uniqueValues(values: Array<string | number | null | undefined>) {
    return Array.from(new Set(values.map(String).map(v => v.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function uniqueValuesInOrder(values: Array<string | null | undefined>) {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const value of values) {
        const trimmed = value?.trim();
        if (!trimmed || seen.has(trimmed)) continue;
        seen.add(trimmed);
        result.push(trimmed);
    }
    return result;
}

function normalizeFilterValue(value: string | number | null | undefined) {
    return String(value ?? '').trim().toLowerCase();
}

function splitFilterValues(value: string | number | null | undefined) {
    return normalizeFilterValue(value)
        .split(/\s*(?:\/|\||,|\bor\b)\s*/i)
        .map(item => item.trim())
        .filter(Boolean);
}

function optionMatches(carValue: string | number | null | undefined, selected: string) {
    if (selected === 'all') return true;
    const normalizedSelected = normalizeFilterValue(selected);
    return splitFilterValues(carValue).some(value => value === normalizedSelected);
}

function carPrice(car: Car) {
    return car.offer?.price ?? car.pricing?.exShowroom?.min ?? 0;
}

function carKm(car: Car) {
    return car.performance?.range ?? 0;
}

function carImage(car: Car) {
    return carImages(car)[0] ?? null;
}

function carImages(car: Car) {
    return getVehicleImageUrls(
        '4w',
        brandNameToId(car.make || '', '4w'),
        car.model || '',
        car.images?.hero,
    ).filter(isUsableVehicleImageUrl)
        .concat((car.images?.exterior ?? []).filter(isUsableVehicleImageUrl));
}

function modelImageSourceKind(src: string | null | undefined) {
    const value = String(src ?? '').toLowerCase();
    if (
        value.includes('/storage/v1/object/public/dealer-assets/vehicles/') ||
        value.includes('/storage/v1/object/public/dealer-assets/sell-requests/') ||
        value.includes('/storage/v1/object/public/vehicle-images/')
    ) {
        return 'inventory-photo';
    }
    return 'resolved-model';
}

function formatKm(value?: number | null) {
    if (!value) return 'Low km';
    return `${value.toLocaleString('en-IN')} km`;
}

function buildWhatsAppUrl(phone: string, message: string) {
    const clean = phone.replace(/[^0-9]/g, '');
    const withCode = clean.startsWith('91') ? clean : `91${clean}`;
    return `https://wa.me/${withCode}?text=${encodeURIComponent(message)}`;
}

export function PremiumUsedDealerTemplate({
    brandName: _brandName,
    dealerId = '',
    dealerName,
    cars,
    contactInfo,
    services,
    workingHours,
    logoUrl,
    heroImageUrl,
    heroImageUrls,
    sellsNewCars = false,
    sellsUsedCars = true,
    branches,
    serviceCenters,
    sellVehicleHref,
}: PremiumUsedDealerTemplateProps) {
    const pathname = usePathname();
    const detailBasePath = useMemo(() => buildTemplateDetailBasePath({
        pathname,
        vehicleType: '4w',
        sellsNewCars,
        sellsUsedCars,
    }), [pathname, sellsNewCars, sellsUsedCars]);
    const inventoryHref = `${detailBasePath.replace(/\/$/, '') || ''}/cars`;

    const brandColor = '#d7a64a';
    const brandAccent = getReadableAccent(brandColor, '#7c4f12');
    const brandAccentOnDark = '#efbd5d';
    const onBrandColor = getContrastText(brandColor);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const [query, setQuery] = useState('');
    const [make, setMake] = useState('all');
    const [fuel, setFuel] = useState('all');
    const [transmission, setTransmission] = useState('all');
    const [year, setYear] = useState('all');
    const [budget, setBudget] = useState('all');
    const { formData, setFormData, formStatus, formErrors, consent, setConsent, handleSubmit } = useLeadForm(dealerId);

    const heroSlides = useMemo(() => {
        const uploadedImages = uniqueValuesInOrder([...(heroImageUrls ?? []), heroImageUrl]).slice(0, 5);
        const inventoryImages = cars
            .map(car => carImage(car))
            .filter(isUsableVehicleImageUrl);
        if (uploadedImages.length >= 2) return uploadedImages;
        return uniqueValuesInOrder([...uploadedImages, ...inventoryImages, ...FALLBACK_HEROES]).slice(0, 5);
    }, [cars, heroImageUrl, heroImageUrls]);

    useEffect(() => {
        if (heroSlides.length < 2) return;
        const timer = window.setInterval(() => {
            setActiveSlide(current => (current + 1) % heroSlides.length);
        }, 5500);
        return () => window.clearInterval(timer);
    }, [heroSlides.length]);

    const makes = useMemo(() => uniqueValues(cars.map(car => car.make)), [cars]);
    const fuels = useMemo(() => uniqueValues(cars.map(car => car.engine?.type)), [cars]);
    const transmissions = useMemo(() => uniqueValues(cars.map(car => car.transmission?.type)), [cars]);
    const years = useMemo(() => uniqueValues(cars.map(car => car.year)).sort((a, b) => Number(b) - Number(a)), [cars]);

    const filteredCars = useMemo(() => {
        const needle = query.trim().toLowerCase();
        const results = cars.filter(car => {
            const price = carPrice(car);
            const searchText = `${car.make} ${car.model} ${car.variant} ${car.year} ${car.engine?.type} ${car.transmission?.type}`.toLowerCase();
            const matchesBudget =
                budget === 'all' ||
                (budget === 'under-5' && price <= 500000) ||
                (budget === '5-10' && price > 500000 && price <= 1000000) ||
                (budget === '10-20' && price > 1000000 && price <= 2000000) ||
                (budget === 'above-20' && price > 2000000);

            return (
                (!needle || searchText.includes(needle)) &&
                optionMatches(car.make, make) &&
                optionMatches(car.engine?.type, fuel) &&
                optionMatches(car.transmission?.type, transmission) &&
                (year === 'all' || String(car.year) === year) &&
                matchesBudget
            );
        });

        return results;
    }, [budget, cars, fuel, make, query, transmission, year]);

    const offerCars = useMemo(() => {
        const withOffers = cars.filter(car => car.offer?.price);
        return (withOffers.length ? withOffers : cars).slice(0, 3);
    }, [cars]);
    const previewCars = useMemo(() => cars.slice(0, 6), [cars]);

    const stats = [
        { label: 'Available cars', value: `${cars.length}+` },
        { label: 'Brands in stock', value: `${makes.length}+` },
        { label: 'Verified listings', value: '100%' },
    ];
    const selectedServices = useMemo(() => {
        const serviceKeys = services?.length
            ? services.map(service => String(service))
            : ['used_car_sales', 'financing', 'trade_in', 'service_maintenance'];
        return serviceKeys.map(serviceKey => ({
            key: serviceKey,
            ...getTemplateServiceMeta(serviceKey, '4w'),
        }));
    }, [services]);

    return (
        <div
            className="min-h-screen bg-[#f7f5f0] text-[#111827]"
            style={{
                '--used-accent-text': brandAccent,
                '--used-accent-on-dark': brandAccentOnDark,
                '--used-accent-foreground': onBrandColor,
            } as CSSProperties}
        >
            <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#071018]/90 backdrop-blur-xl">
                <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <a href="#home" className="flex min-w-0 items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
                            {logoUrl ? (
                                <img src={logoUrl} alt={`${dealerName} logo`} className="h-full w-full object-contain p-1" />
                            ) : (
                                <CarIcon className="h-6 w-6 text-[#071018]" />
                            )}
                        </span>
                        <span className="min-w-0">
                            <span className="block truncate text-base font-bold text-white sm:text-lg">{dealerName}</span>
                            <span className="block truncate text-xs font-medium text-[#d7a64a]">Certified pre-owned showroom</span>
                        </span>
                    </a>

                    <nav className="hidden items-center gap-6 text-sm font-semibold text-white/75 lg:flex">
                        <a href={inventoryHref} className="hover:text-white">Inventory</a>
                        <a href="#offers" className="hover:text-white">Offers</a>
                        <a href="#finance" className="hover:text-white">Finance</a>
                        <a href="#service" className="hover:text-white">Service</a>
                        <a href="#services" className="hover:text-white">Services</a>
                        <a href="#contact" className="hover:text-white">Contact</a>
                    </nav>

                    <div className="hidden items-center gap-3 lg:flex">
                        <WhatsAppButton phone={contactInfo.phone} variant="nav" message={`Hi ${dealerName}, I want to know more about your used cars.`} />
                        <a
                            href={`tel:${contactInfo.phone}`}
                            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#d7a64a] px-4 text-sm font-bold transition hover:bg-[#efbd5d]"
                            style={{ color: onBrandColor }}
                        >
                            <Phone className="h-4 w-4" />
                            Call
                        </a>
                    </div>

                    <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-white lg:hidden"
                        aria-label="Toggle menu"
                        onClick={() => setMenuOpen(open => !open)}
                    >
                        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
                {menuOpen && (
                    <div className="border-t border-white/10 bg-[#071018] px-4 py-4 lg:hidden">
                        <div className="grid gap-3 text-sm font-semibold text-white/80">
                            {['inventory', 'offers', 'finance', 'service', 'services', 'contact'].map(item => (
                                <a key={item} href={item === 'inventory' ? inventoryHref : `#${item}`} onClick={() => setMenuOpen(false)} className="rounded-md px-2 py-2 hover:bg-white/10">
                                    {item === 'service' ? 'Book Service' : item[0].toUpperCase() + item.slice(1)}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            <main id="home">
                <section className="relative min-h-[720px] overflow-hidden bg-[#071018] pt-18 sm:min-h-[760px]">
                    {heroSlides.map((slide, index) => (
                        <div
                            key={slide}
                            className={`absolute inset-0 transition-opacity duration-700 ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img src={slide} alt="" className="h-full w-full object-cover" />
                        </div>
                    ))}
                    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(7,16,24,0.93)_0%,rgba(7,16,24,0.68)_48%,rgba(7,16,24,0.2)_100%)]" />

                    <div className="relative mx-auto grid min-h-[690px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
                        <div className="max-w-3xl text-white">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#efbd5d] backdrop-blur">
                                <Sparkles className="h-4 w-4" />
                                Premium second-hand dealer page
                            </div>
                            <h1 className="text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">
                                Find your next verified used car at {dealerName}
                            </h1>
                            <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
                                Browse live inventory, dealer offers, finance support, insurance help, and showroom contact details from one polished pre-owned storefront.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <a href={inventoryHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#d7a64a] px-6 text-sm font-black transition hover:bg-[#efbd5d]" style={{ color: onBrandColor }}>
                                    View Inventory
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                                <a href={`tel:${contactInfo.phone}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/25 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">
                                    <Phone className="h-4 w-4" />
                                    {contactInfo.phone}
                                </a>
                            </div>
                            <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 min-[420px]:grid-cols-3">
                                {stats.map(stat => (
                                    <div key={stat.label} className="rounded-md border border-white/14 bg-white/10 p-4 backdrop-blur">
                                        <p className="text-2xl font-black text-white">{stat.value}</p>
                                        <p className="mt-1 text-xs font-semibold text-white/65">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-lg border border-white/20 bg-white p-5 shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--used-accent-text)]">Search stock</p>
                                    <h2 className="mt-1 text-2xl font-black text-[#111827]">Find a used car</h2>
                                </div>
                                <SlidersHorizontal className="h-6 w-6 text-[var(--used-accent-text)]" />
                            </div>
                            <div className="grid gap-3">
                                <label className="relative block">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        value={query}
                                        onChange={event => setQuery(event.target.value)}
                                        placeholder="Search by model, variant, year"
                                        className="h-12 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium outline-none ring-[#d7a64a]/30 transition focus:ring-4"
                                    />
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <FilterSelect label="Brand" value={make} onChange={setMake} options={makes} />
                                    <FilterSelect label="Fuel" value={fuel} onChange={setFuel} options={fuels} />
                                    <FilterSelect label="Transmission" value={transmission} onChange={setTransmission} options={transmissions} />
                                    <FilterSelect label="Year" value={year} onChange={setYear} options={years} />
                                </div>
                                <FilterSelect
                                    label="Budget"
                                    value={budget}
                                    onChange={setBudget}
                                    options={[
                                        ['under-5', 'Under ₹5L'],
                                        ['5-10', '₹5L - ₹10L'],
                                        ['10-20', '₹10L - ₹20L'],
                                        ['above-20', 'Above ₹20L'],
                                    ]}
                                />
                                <a href={inventoryHref} className="inline-flex h-12 items-center justify-center rounded-md bg-[#071018] text-sm font-black text-white transition hover:bg-[#162433]">
                                    Show {filteredCars.length} matching cars
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setActiveSlide(current => (current - 1 + heroSlides.length) % heroSlides.length)}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur"
                            aria-label="Previous hero image"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                            {activeSlide + 1} / {heroSlides.length}
                        </span>
                        <button
                            type="button"
                            onClick={() => setActiveSlide(current => (current + 1) % heroSlides.length)}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur"
                            aria-label="Next hero image"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </section>

                <section className="bg-white py-5">
                    <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8">
                        {makes.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => {
                                    setMake(item);
                                    window.location.href = inventoryHref;
                                }}
                                className="shrink-0 rounded-md border border-slate-200 bg-[#f7f5f0] px-5 py-3 text-sm font-black text-slate-700 transition hover:border-[#d7a64a] hover:text-[#111827]"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </section>

                <section id="inventory-preview" className="py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--used-accent-text)]">Featured stock</p>
                                <h2 className="mt-2 text-3xl font-black text-[#111827] sm:text-4xl">A quick look at cars from {dealerName}</h2>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                                    See a preview of uploaded dealer vehicles here. Open the inventory page for full search, filters, sorting, and enquiries.
                                </p>
                            </div>
                            <a href={inventoryHref} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#071018] px-5 text-sm font-black text-white transition hover:bg-[#162433]">
                                Search all cars
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>

                        <div className="mb-5 flex items-center justify-between text-sm font-semibold text-slate-600">
                            <span>{previewCars.length} featured cars</span>
                            <a href={inventoryHref} className="font-black text-[var(--used-accent-text)] hover:underline">View all {cars.length} cars</a>
                        </div>

                        {previewCars.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {previewCars.map((car, index) => (
                                    <UsedCarCard
                                        key={car.id}
                                        car={car}
                                        images={carImages(car)}
                                        href={`${detailBasePath.replace(/\/$/, '')}/${car.id}`.replace(/^\/\//, '/')}
                                        phone={contactInfo.phone}
                                        dealerName={dealerName}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
                                <h3 className="text-xl font-black text-[#111827]">Inventory is being updated</h3>
                                <p className="mt-2 text-sm text-slate-600">Contact the showroom for the latest available vehicles.</p>
                                <a href={`tel:${contactInfo.phone}`} className="mt-5 inline-flex rounded-md bg-[#071018] px-5 py-3 text-sm font-black text-white">
                                    Call showroom
                                </a>
                            </div>
                        )}
                    </div>
                </section>

                <section id="offers" className="bg-[#071018] py-16 text-white sm:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--used-accent-on-dark)]">Dealer offers</p>
                                <h2 className="mt-2 text-3xl font-black sm:text-4xl">Today’s pre-owned deals</h2>
                            </div>
                            <a href={inventoryHref} className="inline-flex h-11 items-center gap-2 rounded-md border border-white/20 px-4 text-sm font-bold text-white transition hover:bg-white/10">
                                Browse all offers
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                        {offerCars.length > 0 ? (
                            <div className="grid gap-5 md:grid-cols-3">
                                {offerCars.map((car, index) => {
                                const price = carPrice(car);
                                const base = car.offer?.originalPrice ?? car.pricing.exShowroom.max ?? price;
                                const savings = base && base > price ? base - price : null;
                                const image = carImage(car);
                                if (!image) return null;
                                return (
                                    <a
                                        key={car.id}
                                        href={`${detailBasePath.replace(/\/$/, '')}/${car.id}`.replace(/^\/\//, '/')}
                                        data-vehicle-card="true"
                                        data-model-image-source={modelImageSourceKind(image)}
                                        className="group overflow-hidden rounded-lg border border-white/10 bg-white/8 transition hover:-translate-y-1 hover:bg-white/12"
                                    >
                                        <div className="relative h-48">
                                            <img src={image} alt={`${car.make} ${car.model}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                                            <span className="absolute left-4 top-4 rounded-full bg-[#d7a64a] px-3 py-1 text-xs font-black" style={{ color: onBrandColor }}>
                                                {car.offer?.label ?? 'Limited deal'}
                                            </span>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-lg font-black">{car.year} {car.make} {car.model}</h3>
                                            <p className="mt-2 text-3xl font-black text-[#efbd5d]">{formatPriceInLakhs(price)}</p>
                                            {savings ? <p className="mt-1 text-sm text-white/65">Save {formatPriceInLakhs(savings)}</p> : <p className="mt-1 text-sm text-white/65">Finance and exchange help available</p>}
                                        </div>
                                    </a>
                                );
                                })}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-white/10 bg-white/8 p-8 text-center">
                                <Tags className="mx-auto h-8 w-8 text-[#efbd5d]" />
                                <h3 className="mt-4 text-xl font-black">Offers will appear with inventory</h3>
                                <p className="mt-2 text-sm text-white/65">Contact the dealer for current purchase, exchange, and finance assistance.</p>
                            </div>
                        )}
                    </div>
                </section>

                <section id="emi" className="bg-white py-16 sm:py-20">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 text-center">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--used-accent-text)]">Finance tool</p>
                            <h2 className="mt-2 text-3xl font-black text-[#111827] sm:text-4xl">EMI Calculator</h2>
                            <p className="mt-3 text-sm text-slate-600">Estimate monthly payments before you enquire.</p>
                        </div>
                        <EmiCalculator brandColor={brandColor} theme="light" />
                    </div>
                </section>

                {dealerId && (
                    <section className="bg-white py-16">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <ReviewsSection dealerId={dealerId} brandColor={brandColor} variant="light" />
                        </div>
                    </section>
                )}

                <OffersSection brandColor={brandColor} dealerName={dealerName} vehicleType="4w" dealerPhone={contactInfo.phone} />

                <section id="sell" className="bg-white py-16 sm:py-20">
                    <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
                        <div className="overflow-hidden rounded-lg">
                            <img src="/templates/premium-auto-drive/sell-banner.jpg" alt="Sell your used car" className="h-full min-h-[360px] w-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--used-accent-text)]">Sell or exchange</p>
                            <h2 className="mt-2 text-3xl font-black text-[#111827] sm:text-4xl">Need to sell your car before buying?</h2>
                            <p className="mt-4 text-sm leading-7 text-slate-600">
                                Let {dealerName} help with inspection, valuation, exchange, and handover support.
                            </p>
                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                {['Instant evaluation', 'Exchange assistance', 'RC transfer support', 'Insurance guidance'].map(item => (
                                    <div key={item} className="flex items-center gap-3 rounded-md bg-[#f7f5f0] p-4 text-sm font-bold text-slate-700">
                                        <BadgeCheck className="h-5 w-5 text-[var(--used-accent-text)]" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                {sellVehicleHref && (
                                    <a href={sellVehicleHref} className="inline-flex h-12 items-center justify-center rounded-md bg-[#071018] px-6 text-sm font-black text-white transition hover:bg-[#162433]">
                                        Start Sell Request
                                    </a>
                                )}
                                <a href={buildWhatsAppUrl(contactInfo.phone, `Hi ${dealerName}, I want to sell or exchange my car.`)} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center rounded-md border border-slate-200 px-6 text-sm font-black text-[#111827] transition hover:border-[#d7a64a]">
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {dealerId && (
                    <div id="exchange">
                        <ExchangeSection brandColor={brandColor} dealerId={dealerId} dealerName={dealerName} vehicleType="4w" />
                    </div>
                )}

                <section id="services" className="py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--used-accent-text)]">Buyer support</p>
                            <h2 className="mt-2 text-3xl font-black text-[#111827] sm:text-4xl">Everything a pre-owned buyer expects</h2>
                        </div>
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                            {selectedServices.map((service, index) => {
                                const Icon = service.icon;
                                return (
                                    <div key={`${service.key}-${index}`} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                                        <Icon className="h-8 w-8 text-[var(--used-accent-text)]" />
                                        <h3 className="mt-4 text-lg font-black text-[#111827]">{service.label}</h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">{service.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="bg-[#eefbf6] py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">EV ready</p>
                            <h2 className="mt-2 text-3xl font-black text-[#111827] sm:text-4xl">Go electric with confidence</h2>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                                If your stock includes EVs, buyers can ask about range, charging, finance, insurance, and ownership support from the same dealer page.
                            </p>
                        </div>
                        <div className="grid gap-5 md:grid-cols-3">
                            {[
                                ['Range guidance', 'Compare real-world range and charging needs before booking a visit.'],
                                ['Charging support', 'Ask the showroom about home charging and public charging options.'],
                                ['EV finance help', 'Get assisted with loan and insurance options for used EV purchases.'],
                            ].map(([title, body]) => (
                                <div key={title} className="rounded-lg border border-emerald-100 bg-white p-6 shadow-sm">
                                    <ShieldCheck className="h-8 w-8 text-emerald-600" />
                                    <h3 className="mt-4 text-lg font-black text-[#111827]">{title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div id="finance">
                    <FinanceSection brandColor={brandColor} dealerId={dealerId} dealerName={dealerName} />
                </div>

                <div id="service">
                    <ServiceBookingSection
                        brandColor={brandColor}
                        dealerId={dealerId}
                        dealerName={dealerName}
                        vehicleType="4w"
                        branches={branches}
                        serviceCenters={serviceCenters}
                    />
                </div>

                <FAQSection brandColor={brandColor} vehicleType="4w" dealerName={dealerName} />

                <section id="contact" className="bg-white py-16 sm:py-20">
                    <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--used-accent-text)]">Talk to our team</p>
                            <h2 className="mt-2 text-3xl font-black text-[#111827] sm:text-4xl">Questions? We can help.</h2>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                Send an enquiry, ask for a callback, or visit {dealerName} in person.
                            </p>
                            <div className="mt-6 space-y-4 text-sm font-semibold text-slate-700">
                                <p className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-[var(--used-accent-text)]" /> {contactInfo.address}</p>
                                <p className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-[var(--used-accent-text)]" /> {contactInfo.phone}</p>
                                <p className="flex gap-3"><Mail className="h-5 w-5 shrink-0 text-[var(--used-accent-text)]" /> {contactInfo.email}</p>
                                {workingHours && <p className="flex gap-3"><CalendarDays className="h-5 w-5 shrink-0 text-[var(--used-accent-text)]" /> {workingHours}</p>}
                            </div>
                            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                <a href={`tel:${contactInfo.phone}`} className="inline-flex h-12 items-center justify-center rounded-md bg-[#d7a64a] px-6 text-sm font-black" style={{ color: onBrandColor }}>
                                    Call Showroom
                                </a>
                                <a href={`mailto:${contactInfo.email}`} className="inline-flex h-12 items-center justify-center rounded-md border border-slate-200 px-6 text-sm font-black text-[#111827]">
                                    Email Dealer
                                </a>
                            </div>
                            {contactInfo.address && (
                                <div className="mt-8 h-64 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                                    <iframe
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(contactInfo.address)}&output=embed`}
                                        className="h-full w-full"
                                        loading="lazy"
                                        title={`${dealerName} location map`}
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-[#f7f5f0] p-6 shadow-sm">
                            {formStatus === 'sent' ? (
                                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                                    <CheckCircle2 className="h-14 w-14 text-[var(--used-accent-text)]" />
                                    <h3 className="mt-4 text-2xl font-black text-[#111827]">Enquiry sent</h3>
                                    <p className="mt-2 text-sm text-slate-600">The dealer team will contact you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="mb-5 flex items-center gap-3">
                                        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white">
                                            <MessageSquare className="h-5 w-5 text-[var(--used-accent-text)]" />
                                        </span>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--used-accent-text)]">Send enquiry</p>
                                            <h3 className="text-xl font-black text-[#111827]">Contact {dealerName}</h3>
                                        </div>
                                    </div>
                                    <ContactInput
                                        label="Name"
                                        value={formData.name}
                                        onChange={value => setFormData({ ...formData, name: value })}
                                        error={formErrors.name}
                                        required
                                    />
                                    <ContactInput
                                        label="Phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={value => setFormData({ ...formData, phone: value })}
                                        error={formErrors.phone}
                                        required
                                    />
                                    <ContactInput
                                        label="Email"
                                        type="email"
                                        value={formData.email}
                                        onChange={value => setFormData({ ...formData, email: value })}
                                        error={formErrors.email}
                                    />
                                    <div>
                                        <label className="mb-1.5 block text-sm font-bold text-slate-700">Message</label>
                                        <textarea
                                            rows={4}
                                            value={formData.message}
                                            onChange={event => setFormData({ ...formData, message: event.target.value })}
                                            placeholder="Which used car are you interested in?"
                                            className="w-full resize-none rounded-md border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#d7a64a] focus:ring-4 focus:ring-[#d7a64a]/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-start gap-2 text-xs text-slate-600">
                                            <input
                                                type="checkbox"
                                                checked={consent}
                                                onChange={event => setConsent(event.target.checked)}
                                                aria-invalid={!!formErrors.consent}
                                                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300"
                                            />
                                            <span>I agree to be contacted about this enquiry.</span>
                                        </label>
                                        {formErrors.consent && <p className="mt-1 text-xs text-red-600">{formErrors.consent}</p>}
                                    </div>
                                    {formStatus === 'error' && <p className="text-sm font-semibold text-red-600">Something went wrong. Please call the showroom or try again.</p>}
                                    <button
                                        type="submit"
                                        disabled={formStatus === 'sending'}
                                        className="inline-flex h-12 w-full items-center justify-center rounded-md bg-[#071018] px-5 text-sm font-black text-white transition hover:bg-[#162433] disabled:opacity-60"
                                    >
                                        {formStatus === 'sending' ? 'Sending...' : 'Send Enquiry'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </section>

                <footer className="bg-[#071018] px-4 py-10 text-white sm:px-6 lg:px-8">
                    <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-white">
                                {logoUrl ? <img src={logoUrl} alt="" className="h-full w-full object-contain p-1" /> : <CarIcon className="h-5 w-5 text-[#071018]" />}
                            </span>
                            <div>
                                <p className="font-black">{dealerName}</p>
                                <p className="text-xs text-white/55">Powered by DealerSite Pro</p>
                            </div>
                        </div>
                        <p className="text-sm text-white/60">{contactInfo.address}</p>
                    </div>
                </footer>
            </main>
            <WhatsAppButton phone={contactInfo.phone} message={`Hi ${dealerName}, I found a used car on your website.`} />
            <StickyEnquiryBar phone={contactInfo.phone} brandColor={brandColor} vehicleType="4w" />
        </div>
    );
}

function FilterSelect({
    label,
    value,
    onChange,
    options,
    compact = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<string | [string, string]>;
    compact?: boolean;
}) {
    return (
        <label className="block">
            {!compact && <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-600">{label}</span>}
            <select
                value={value}
                onChange={event => onChange(event.target.value)}
                aria-label={label}
                className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-[#111827] outline-none transition focus:border-[#d7a64a] focus:ring-4 focus:ring-[#d7a64a]/20"
            >
                <option value="all">All {label}</option>
                {options.map(option => {
                    const optionValue = Array.isArray(option) ? option[0] : option;
                    const optionLabel = Array.isArray(option) ? option[1] : option;
                    return <option key={optionValue} value={optionValue}>{optionLabel}</option>;
                })}
            </select>
        </label>
    );
}

function ContactInput({
    label,
    value,
    onChange,
    error,
    type = 'text',
    required = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
    required?: boolean;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700">
                {label}{required ? ' *' : ''}
            </label>
            <input
                type={type}
                aria-required={required}
                value={value}
                onChange={event => onChange(event.target.value)}
                aria-invalid={!!error}
                className={`h-11 w-full rounded-md border bg-white px-4 text-sm outline-none transition focus:border-[#d7a64a] focus:ring-4 focus:ring-[#d7a64a]/20 ${error ? 'border-red-500' : 'border-slate-200'}`}
            />
            {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
        </div>
    );
}

function UsedCarCard({
    car,
    images,
    href,
    phone,
    dealerName,
}: {
    car: Car;
    images: string[];
    href: string;
    phone: string;
    dealerName: string;
}) {
    const [imageIndex, setImageIndex] = useState(0);
    const [imageFailed, setImageFailed] = useState(false);
    const image = images[imageIndex] ?? null;
    const price = carPrice(car);
    const original = car.offer?.originalPrice && car.offer.originalPrice > price ? car.offer.originalPrice : null;
    const title = `${car.year} ${car.make} ${car.model}`;
    if (!image || imageFailed) return null;

    function handleImageError() {
        if (imageIndex < images.length - 1) {
            setImageIndex(current => current + 1);
            return;
        }
        setImageFailed(true);
    }

    return (
        <article data-vehicle-card="true" data-model-image-source={modelImageSourceKind(image)} className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <a href={href} className="block">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img src={image} alt={title} onError={handleImageError} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute left-4 top-4 flex gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#111827] shadow-sm">Used</span>
                        {car.offer?.label && <span className="rounded-full bg-[#d7a64a] px-3 py-1 text-xs font-black text-[var(--used-accent-foreground)] shadow-sm">{car.offer.label}</span>}
                    </div>
                </div>
            </a>
            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <a href={href} className="line-clamp-2 text-lg font-black leading-tight text-[#111827] hover:text-[var(--used-accent-text)]">{title}</a>
                        {car.variant && <p className="mt-1 line-clamp-1 text-sm font-semibold text-slate-600">{car.variant}</p>}
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-[#f7f5f0] px-2.5 py-1 text-xs font-black text-[var(--used-accent-text)]">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        Verified
                    </div>
                </div>

                <div className="mt-4 flex items-end gap-2">
                    <p className="text-2xl font-black text-[#111827]">{formatPriceInLakhs(price)}</p>
                    {original && <p className="pb-1 text-sm font-semibold text-slate-400 line-through">{formatPriceInLakhs(original)}</p>}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                    <Spec icon={Fuel} label="Fuel" value={String(car.engine?.type || 'Fuel')} />
                    <Spec icon={Gauge} label="Driven" value={formatKm(carKm(car))} />
                    <Spec icon={CarIcon} label="Trans" value={String(car.transmission?.type || 'Manual')} />
                </div>

                <div className="mt-auto flex gap-2 pt-5">
                    <a href={href} className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-[#071018] px-3 text-sm font-black text-white transition hover:bg-[#162433]">
                        View Details
                    </a>
                    <a
                        href={buildWhatsAppUrl(phone, `Hi ${dealerName}, I want details for ${title}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 items-center justify-center rounded-md border border-green-200 bg-green-50 px-3 text-sm font-black text-green-700 transition hover:bg-green-100"
                    >
                        WhatsApp
                    </a>
                </div>
            </div>
        </article>
    );
}

function Spec({ icon: Icon, label, value }: { icon: typeof Fuel; label: string; value: string }) {
    return (
        <div className="rounded-md bg-[#f7f5f0] p-3">
            <Icon className="h-4 w-4 text-[var(--used-accent-text)]" />
            <p className="mt-2 text-[11px] font-black uppercase tracking-wide text-slate-600">{label}</p>
            <p className="mt-0.5 min-h-8 text-xs font-black leading-tight text-[#111827] line-clamp-2">{value}</p>
        </div>
    );
}

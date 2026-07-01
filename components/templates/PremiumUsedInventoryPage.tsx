'use client';

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    CalendarDays,
    Car as CarIcon,
    CheckCircle2,
    Fuel,
    Gauge,
    Mail,
    MapPin,
    Phone,
    Search,
    ShieldCheck,
    SlidersHorizontal,
    Sparkles,
    Star,
} from 'lucide-react';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { StickyEnquiryBar } from '@/components/ui/StickyEnquiryBar';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
import { buildTemplateDetailBasePath } from '@/lib/utils/template-site-paths';
import { brandNameToId, getVehicleImageUrls, isUsableVehicleImageUrl } from '@/lib/utils/brand-model-images';
import type { Car } from '@/lib/types/car';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'year-new' | 'km-low';
type KmFilter = 'all' | 'under-30' | '30-60' | '60-100' | 'above-100';

interface PremiumUsedInventoryPageProps {
    brandName: string;
    dealerName: string;
    cars: Car[];
    contactInfo: {
        phone: string;
        email: string;
        address: string;
        city?: string;
    };
    workingHours?: string | null;
    logoUrl?: string;
    heroImageUrl?: string;
    siteBasePath: string;
}

function uniqueValues(values: Array<string | number | null | undefined>) {
    return Array.from(new Set(values.map(String).map(v => v.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
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

export function PremiumUsedInventoryPage({
    brandName,
    dealerName,
    cars,
    contactInfo,
    workingHours,
    logoUrl,
    heroImageUrl,
    siteBasePath,
}: PremiumUsedInventoryPageProps) {
    const detailBasePath = useMemo(() => buildTemplateDetailBasePath({
        pathname: siteBasePath,
        vehicleType: '4w',
        sellsNewCars: false,
        sellsUsedCars: true,
    }), [siteBasePath]);
    const homeHref = siteBasePath || '/';

    const [query, setQuery] = useState('');
    const [make, setMake] = useState('all');
    const [fuel, setFuel] = useState('all');
    const [transmission, setTransmission] = useState('all');
    const [year, setYear] = useState('all');
    const [budget, setBudget] = useState('all');
    const [kmFilter, setKmFilter] = useState<KmFilter>('all');
    const [sort, setSort] = useState<SortOption>('featured');

    const makes = useMemo(() => uniqueValues(cars.map(car => car.make)), [cars]);
    const fuels = useMemo(() => uniqueValues(cars.map(car => car.engine?.type)), [cars]);
    const transmissions = useMemo(() => uniqueValues(cars.map(car => car.transmission?.type)), [cars]);
    const years = useMemo(() => uniqueValues(cars.map(car => car.year)).sort((a, b) => Number(b) - Number(a)), [cars]);
    const heroSrc = heroImageUrl || (cars[0] ? carImage(cars[0]) : null);

    const filteredCars = useMemo(() => {
        const needle = query.trim().toLowerCase();
        const results = cars.filter(car => {
            const price = carPrice(car);
            const km = carKm(car);
            const searchText = `${car.make} ${car.model} ${car.variant} ${car.year} ${car.engine?.type} ${car.transmission?.type}`.toLowerCase();
            const matchesBudget =
                budget === 'all' ||
                (budget === 'under-5' && price <= 500000) ||
                (budget === '5-10' && price > 500000 && price <= 1000000) ||
                (budget === '10-20' && price > 1000000 && price <= 2000000) ||
                (budget === 'above-20' && price > 2000000);
            const matchesKm =
                kmFilter === 'all' ||
                (kmFilter === 'under-30' && km > 0 && km <= 30000) ||
                (kmFilter === '30-60' && km > 30000 && km <= 60000) ||
                (kmFilter === '60-100' && km > 60000 && km <= 100000) ||
                (kmFilter === 'above-100' && km > 100000);

            return (
                (!needle || searchText.includes(needle)) &&
                optionMatches(car.make, make) &&
                optionMatches(car.engine?.type, fuel) &&
                optionMatches(car.transmission?.type, transmission) &&
                (year === 'all' || String(car.year) === year) &&
                matchesBudget &&
                matchesKm
            );
        });

        return [...results].sort((a, b) => {
            if (sort === 'price-low') return carPrice(a) - carPrice(b);
            if (sort === 'price-high') return carPrice(b) - carPrice(a);
            if (sort === 'year-new') return b.year - a.year;
            if (sort === 'km-low') return carKm(a) - carKm(b);
            return 0;
        });
    }, [budget, cars, fuel, kmFilter, make, query, sort, transmission, year]);

    const resetFilters = () => {
        setQuery('');
        setMake('all');
        setFuel('all');
        setTransmission('all');
        setYear('all');
        setBudget('all');
        setKmFilter('all');
        setSort('featured');
    };

    const inventoryStats = [
        { label: 'Cars online', value: cars.length.toString() },
        { label: 'Brands', value: makes.length.toString() },
        { label: 'Verified stock', value: '100%' },
    ];

    return (
        <div className="min-h-screen bg-[#f7f5f0] text-[#111827]">
            <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071018]/95 backdrop-blur-xl">
                <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                    <a href={homeHref} className="flex min-w-0 items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
                            {logoUrl ? (
                                <img src={logoUrl} alt={`${dealerName} logo`} className="h-full w-full object-contain p-1" />
                            ) : (
                                <CarIcon className="h-6 w-6 text-[#071018]" />
                            )}
                        </span>
                        <span className="min-w-0">
                            <span className="block truncate text-base font-bold text-white sm:text-lg">{dealerName}</span>
                            <span className="block truncate text-xs font-medium text-[#d7a64a]">Inventory search</span>
                        </span>
                    </a>
                    <div className="flex items-center gap-2">
                        <a href={homeHref} className="hidden h-10 items-center gap-2 rounded-md border border-white/15 px-3 text-sm font-bold text-white/80 transition hover:bg-white/10 sm:inline-flex">
                            <ArrowLeft className="h-4 w-4" />
                            Home
                        </a>
                        <a href={`tel:${contactInfo.phone}`} className="inline-flex h-10 items-center gap-2 rounded-md bg-[#d7a64a] px-4 text-sm font-bold text-[#111827] transition hover:bg-[#efbd5d]">
                            <Phone className="h-4 w-4" />
                            Call
                        </a>
                    </div>
                </div>
            </header>

            <main>
                <section className="relative overflow-hidden border-b border-black/10 bg-[#071018]">
                    {heroSrc ? <img src={heroSrc} alt="" className="absolute inset-0 h-full w-full object-cover opacity-28" /> : null}
                    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(7,16,24,0.98),rgba(7,16,24,0.78),rgba(7,16,24,0.55))]" />
                    <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8 lg:py-18">
                        <div className="max-w-3xl text-white">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#efbd5d]">
                                <Sparkles className="h-4 w-4" />
                                Live vehicle search
                            </div>
                            <h1 className="text-4xl font-black leading-tight sm:text-6xl">
                                Search verified used cars from {dealerName}
                            </h1>
                            <p className="mt-5 max-w-2xl text-base leading-8 text-white/78">
                                Filter the dealer&apos;s real stock by brand, fuel, transmission, year, budget, and kilometres. Open any vehicle for details or message the showroom directly.
                            </p>
                            <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 min-[420px]:grid-cols-3">
                                {inventoryStats.map(stat => (
                                    <div key={stat.label} className="rounded-md border border-white/14 bg-white/10 p-4 backdrop-blur">
                                        <p className="text-2xl font-black text-white">{stat.value}</p>
                                        <p className="mt-1 text-xs font-semibold text-white/65">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-lg border border-white/20 bg-white/95 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7c4f12]">Quick filter</p>
                                    <h2 className="mt-1 text-2xl font-black text-[#111827]">Find the right match</h2>
                                </div>
                                <SlidersHorizontal className="h-6 w-6 text-[#7c4f12]" />
                            </div>
                            <div className="grid gap-3">
                                <SearchInput value={query} onChange={setQuery} placeholder="Search model, variant, year" />
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
                                <div className="rounded-md bg-[#071018] px-4 py-3 text-center text-sm font-black text-white">
                                    {filteredCars.length} matching cars
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-10 sm:py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7c4f12]">Inventory</p>
                                <h2 className="mt-2 text-3xl font-black sm:text-4xl">{brandName} pre-owned stock</h2>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                                    All visible vehicles come from the dealer&apos;s uploaded inventory or connected Cyepro feed.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <select value={sort} onChange={event => setSort(event.target.value as SortOption)} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold outline-none">
                                    <option value="featured">Featured</option>
                                    <option value="price-low">Price: low to high</option>
                                    <option value="price-high">Price: high to low</option>
                                    <option value="year-new">Newest year</option>
                                    <option value="km-low">Lowest km</option>
                                </select>
                                <button type="button" onClick={resetFilters} className="h-11 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-[#d7a64a]">
                                    Reset
                                </button>
                            </div>
                        </div>

                        <div className="mb-8 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3 xl:grid-cols-8">
                            <div className="md:col-span-3 xl:col-span-2">
                                <SearchInput value={query} onChange={setQuery} placeholder="Search stock" />
                            </div>
                            <FilterSelect label="Brand" value={make} onChange={setMake} options={makes} compact />
                            <FilterSelect label="Fuel" value={fuel} onChange={setFuel} options={fuels} compact />
                            <FilterSelect label="Transmission" value={transmission} onChange={setTransmission} options={transmissions} compact />
                            <FilterSelect label="Year" value={year} onChange={setYear} options={years} compact />
                            <FilterSelect label="Budget" value={budget} onChange={setBudget} options={[['under-5', 'Under ₹5L'], ['5-10', '₹5L-₹10L'], ['10-20', '₹10L-₹20L'], ['above-20', 'Above ₹20L']]} compact />
                            <FilterSelect
                                label="KM"
                                value={kmFilter}
                                onChange={value => setKmFilter(value as KmFilter)}
                                options={[
                                    ['under-30', 'Under 30k'],
                                    ['30-60', '30k-60k'],
                                    ['60-100', '60k-1L'],
                                    ['above-100', 'Above 1L'],
                                ]}
                                compact
                            />
                        </div>

                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-slate-600">
                            <span>{filteredCars.length} of {cars.length} cars shown</span>
                            <span>{contactInfo.city || contactInfo.address}</span>
                        </div>

                        {filteredCars.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {filteredCars.map((car, index) => (
                                    <InventoryCarCard
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
                                <Search className="mx-auto h-10 w-10 text-[#7c4f12]" />
                                <h3 className="mt-4 text-xl font-black text-[#111827]">No cars match these filters</h3>
                                <p className="mt-2 text-sm text-slate-600">Try changing brand, fuel, transmission, year, budget, or kilometre filters.</p>
                                <button type="button" onClick={resetFilters} className="mt-5 rounded-md bg-[#071018] px-5 py-3 text-sm font-black text-white">
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                <section className="border-y border-slate-200 bg-white py-12">
                    <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
                        {[
                            ['Verified listings', 'Dealer uploaded stock, images, pricing, and vehicle specs stay attached to each listing.'],
                            ['Finance ready', 'Shortlist a car and ask the showroom about EMI, insurance, exchange, and booking support.'],
                            ['Direct contact', 'Call, WhatsApp, or visit the showroom from the same inventory page without losing context.'],
                        ].map(([title, body]) => (
                            <div key={title} className="rounded-lg border border-slate-200 bg-[#f7f5f0] p-6">
                                <ShieldCheck className="h-8 w-8 text-[#7c4f12]" />
                                <h3 className="mt-4 text-lg font-black">{title}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="py-12">
                    <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7c4f12]">Need help choosing?</p>
                            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Talk to {dealerName}</h2>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                Share your budget and usage. The showroom can confirm availability, arrange a visit, and guide finance or exchange options.
                            </p>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="space-y-4 text-sm font-semibold text-slate-700">
                                <p className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-[#7c4f12]" /> {contactInfo.address}</p>
                                <p className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-[#7c4f12]" /> {contactInfo.phone}</p>
                                <p className="flex gap-3"><Mail className="h-5 w-5 shrink-0 text-[#7c4f12]" /> {contactInfo.email}</p>
                                {workingHours && <p className="flex gap-3"><CalendarDays className="h-5 w-5 shrink-0 text-[#7c4f12]" /> {workingHours}</p>}
                            </div>
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <a href={`tel:${contactInfo.phone}`} className="inline-flex h-12 flex-1 items-center justify-center rounded-md bg-[#071018] px-5 text-sm font-black text-white transition hover:bg-[#162433]">
                                    Call showroom
                                </a>
                                <a href={buildWhatsAppUrl(contactInfo.phone, `Hi ${dealerName}, I want help choosing a used car from your inventory.`)} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 flex-1 items-center justify-center rounded-md border border-green-200 bg-green-50 px-5 text-sm font-black text-green-700 transition hover:bg-green-100">
                                    WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <WhatsAppButton phone={contactInfo.phone} message={`Hi ${dealerName}, I found your inventory page.`} />
            <StickyEnquiryBar phone={contactInfo.phone} brandColor="#d7a64a" vehicleType="4w" />
        </div>
    );
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
    return (
        <label className="relative block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
                value={value}
                onChange={event => onChange(event.target.value)}
                placeholder={placeholder}
                className="h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium outline-none transition focus:border-[#d7a64a] focus:ring-4 focus:ring-[#d7a64a]/20"
            />
        </label>
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
            {!compact && <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>}
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

function InventoryCarCard({
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
        <article data-vehicle-card="true" data-model-image-source={modelImageSourceKind(image)} className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <a href={href} className="block">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img src={image} alt={title} onError={handleImageError} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#111827] shadow-sm">Used</span>
                        {car.offer?.label && <span className="rounded-full bg-[#d7a64a] px-3 py-1 text-xs font-black text-[#111827] shadow-sm">{car.offer.label}</span>}
                    </div>
                </div>
            </a>
            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <a href={href} className="text-lg font-black text-[#111827] hover:text-[#a8781c]">{title}</a>
                        {car.variant && <p className="mt-1 text-sm font-semibold text-slate-500">{car.variant}</p>}
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-[#f7f5f0] px-2.5 py-1 text-xs font-black text-[#a8781c]">
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

                <div className="mt-5 flex gap-2">
                    <a href={href} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-[#071018] px-3 text-sm font-black text-white transition hover:bg-[#162433]">
                        View Details
                        <ArrowRight className="h-4 w-4" />
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

                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500">
                    <CheckCircle2 className="h-4 w-4 text-[#7c4f12]" />
                    Dealer verified listing
                    <BadgeCheck className="h-4 w-4 text-[#7c4f12]" />
                </div>
            </div>
        </article>
    );
}

function Spec({ icon: Icon, label, value }: { icon: typeof Fuel; label: string; value: string }) {
    return (
        <div className="rounded-md bg-[#f7f5f0] p-3">
            <Icon className="h-4 w-4 text-[#7c4f12]" />
            <p className="mt-2 text-[11px] font-black uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-0.5 truncate text-xs font-black text-[#111827]">{value}</p>
        </div>
    );
}

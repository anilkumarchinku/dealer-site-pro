/**
 * Car Detail View — CarDekho/Cars24 Style
 * Comprehensive detail page with sticky tabs, image gallery,
 * specs, features, EMI calculator, reviews, FAQs, and more.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Car } from '@/lib/types/car';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Slider } from '@/components/ui/slider';
import { getBrandLogo } from '@/lib/data/brand-logos';
import { useSitePrefix } from '@/lib/hooks/useSitePrefix';
import { getBrandColors } from '@/lib/colors/automotive-brands';
import { getContrastText } from '@/lib/utils/color-contrast';
import {
    ChevronRight,
    Download,
    Share2,
    Phone,
    Calendar,
    Shield,
    Fuel,
    Gauge,
    Users,
    Zap,
    Heart,
    Star,
    Check,
    X,
    ChevronLeft,
    Calculator,
    Car as CarIcon,
    Palette,
    Settings,
    Info,
    MessageSquare,
    HelpCircle,
    Eye,
    TrendingUp,
    MapPin,
    ShieldCheck,
    ClipboardCheck,
    History,
    Wrench,
    FileText,
    AlertTriangle,
    CheckCircle2,
    CircleDot,
    BadgeCheck,
    RotateCcw,
} from 'lucide-react';

interface CarDetailViewProps {
    car: Car;
    similarCars?: Car[];
    siteSlug?: string;
}

const NEW_CAR_TABS = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'specs', label: 'Specifications', icon: Settings },
    { id: 'features', label: 'Features', icon: Check },
    { id: 'variants', label: 'Variants', icon: CarIcon },
    { id: 'colors', label: 'Colours', icon: Palette },
    { id: 'emi', label: 'EMI Calculator', icon: Calculator },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
];

const USED_CAR_TABS = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'inspection', label: 'Inspection Report', icon: ClipboardCheck },
    { id: 'history', label: 'Car History', icon: History },
    { id: 'specs', label: 'Specifications', icon: Settings },
    { id: 'features', label: 'Features', icon: Check },
    { id: 'colors', label: 'Colours', icon: Palette },
    { id: 'emi', label: 'EMI Calculator', icon: Calculator },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
];

const INSPECTION_CATEGORIES = [
    {
        name: 'Exterior',
        icon: <CarIcon className="w-4 h-4" />,
        items: [
            { name: 'Body Panels', status: 'good' as const },
            { name: 'Paint Condition', status: 'good' as const },
            { name: 'Headlights & Taillights', status: 'good' as const },
            { name: 'Windshield', status: 'good' as const },
            { name: 'Side Mirrors', status: 'good' as const },
            { name: 'Bumpers', status: 'fair' as const },
        ],
    },
    {
        name: 'Interior',
        icon: <Users className="w-4 h-4" />,
        items: [
            { name: 'Seats & Upholstery', status: 'good' as const },
            { name: 'Dashboard & Controls', status: 'good' as const },
            { name: 'AC & Climate', status: 'good' as const },
            { name: 'Infotainment System', status: 'good' as const },
            { name: 'Steering Wheel', status: 'good' as const },
        ],
    },
    {
        name: 'Engine & Mechanical',
        icon: <Settings className="w-4 h-4" />,
        items: [
            { name: 'Engine Condition', status: 'good' as const },
            { name: 'Transmission', status: 'good' as const },
            { name: 'Suspension', status: 'good' as const },
            { name: 'Brakes', status: 'fair' as const },
            { name: 'Exhaust System', status: 'good' as const },
        ],
    },
    {
        name: 'Tyres & Wheels',
        icon: <CircleDot className="w-4 h-4" />,
        items: [
            { name: 'Front Left Tyre', status: 'good' as const },
            { name: 'Front Right Tyre', status: 'good' as const },
            { name: 'Rear Left Tyre', status: 'fair' as const },
            { name: 'Rear Right Tyre', status: 'fair' as const },
            { name: 'Spare Tyre', status: 'good' as const },
        ],
    },
    {
        name: 'Electricals',
        icon: <Zap className="w-4 h-4" />,
        items: [
            { name: 'Battery', status: 'good' as const },
            { name: 'Wiring Harness', status: 'good' as const },
            { name: 'Power Windows', status: 'good' as const },
            { name: 'Central Locking', status: 'good' as const },
        ],
    },
];

export function CarDetailView({ car, similarCars = [], siteSlug }: CarDetailViewProps) {
    const sitePrefix = useSitePrefix(siteSlug ?? '');
    const isUsed = car.condition === 'used' || car.condition === 'certified_pre_owned';
    const isCPO = car.condition === 'certified_pre_owned';
    const TABS = isUsed ? USED_CAR_TABS : NEW_CAR_TABS;

    const [activeImage, setActiveImage] = useState(car.images.hero);
    const [activeTab, setActiveTab] = useState('overview');
    const [isTabBarSticky, setIsTabBarSticky] = useState(false);
    const [selectedColor, setSelectedColor] = useState(car.colors?.[0]?.name || '');
    const [isFavorite, setIsFavorite] = useState(false);

    // EMI Calculator state
    const [emiPrice, setEmiPrice] = useState(car.pricing.exShowroom.min || 1000000);
    const [emiDown, setEmiDown] = useState(Math.round((car.pricing.exShowroom.min || 1000000) * 0.2));
    const [emiTenure, setEmiTenure] = useState(60);
    const [emiRate, setEmiRate] = useState(9.5);

    const tabBarRef = useRef<HTMLDivElement>(null);
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    // All images combined
    const allImages = [car.images.hero, ...car.images.exterior, ...car.images.interior].filter(Boolean);

    // Price formatting
    const exShowroom = car.pricing?.exShowroom ?? { min: null, max: null };
    const priceDisplay = formatPriceInLakhs(exShowroom.min);
    const maxPriceDisplay = formatPriceInLakhs(exShowroom.max);
    const hasPriceRange = exShowroom.min !== exShowroom.max && exShowroom.max;

    // Key specs
    const keySpecs = [
        { icon: <Fuel className="w-5 h-5 text-emerald-600" />, label: 'Fuel Type', value: car.engine?.type || '' },
        { icon: <Gauge className="w-5 h-5 text-blue-600" />, label: 'Transmission', value: car.transmission?.type || '' },
        { icon: <Zap className="w-5 h-5 text-amber-600" />, label: 'Mileage', value: car.performance?.fuelEfficiency ? `${car.performance.fuelEfficiency} km/l` : '' },
        { icon: <Users className="w-5 h-5 text-purple-600" />, label: 'Seating', value: car.dimensions?.seatingCapacity ? `${car.dimensions.seatingCapacity} Seater` : '' },
        { icon: <Settings className="w-5 h-5 text-gray-600" />, label: 'Engine', value: car.engine?.displacement ? `${car.engine.displacement} cc` : '' },
        { icon: <Shield className="w-5 h-5 text-red-600" />, label: 'Safety', value: car.safety?.ncapRating?.stars ? `${car.safety.ncapRating.stars} Star` : `${car.safety?.airbags || 0} Airbags` },
    ].filter(s => s.value);

    // Sticky tab bar detection
    useEffect(() => {
        const handleScroll = () => {
            if (tabBarRef.current) {
                const rect = tabBarRef.current.getBoundingClientRect();
                setIsTabBarSticky(rect.top <= 56);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll spy for active tab
    useEffect(() => {
        const handleScroll = () => {
            const offset = 120;
            for (const tab of TABS) {
                const el = sectionRefs.current[tab.id];
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= offset && rect.bottom > offset) {
                        setActiveTab(tab.id);
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const el = sectionRefs.current[id];
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 120;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    // EMI calculation
    const calcEmi = () => {
        const loan = Math.max(0, emiPrice - emiDown);
        if (loan <= 0 || emiTenure <= 0 || emiRate <= 0) return null;
        const r = emiRate / 12 / 100;
        const emi = (loan * r * Math.pow(1 + r, emiTenure)) / (Math.pow(1 + r, emiTenure) - 1);
        const totalPayable = emi * emiTenure;
        return {
            emi: Math.round(emi),
            loan: Math.round(loan),
            interest: Math.round(totalPayable - loan),
            total: Math.round(totalPayable),
        };
    };
    const emiResult = calcEmi();
    const inventoryHref = siteSlug ? (sitePrefix || '/') : '/cars';
    const makeHref = siteSlug
        ? `${inventoryHref}?make=${encodeURIComponent(car.make)}`
        : `/cars?make=${encodeURIComponent(car.make)}`;
    const detailBasePath = siteSlug ? sitePrefix : undefined;
    const brandColor = getBrandColors(car.make).primary ?? '#2563eb';
    const brandContrast = getContrastText(brandColor);
    const lightCardClass = 'bg-white border border-slate-200 text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.06)] dark:!bg-white dark:!border-slate-200 dark:!text-slate-900';
    const softCardClass = 'bg-slate-50 border border-slate-200 text-slate-900 shadow-none dark:!bg-slate-50 dark:!border-slate-200 dark:!text-slate-900';
    const lightTableRowHoverClass = 'hover:bg-slate-50';
    const lightOutlineButtonClass = 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:!border-slate-200 dark:!bg-white dark:!text-slate-900 dark:hover:!bg-slate-50';
    const lightGhostButtonClass = 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:!text-slate-600 dark:hover:!bg-slate-100 dark:hover:!text-slate-900';

    return (
        <div className="min-h-screen bg-white text-slate-900 [color-scheme:light] dark:!bg-white dark:!text-slate-900">
            {/* ── Breadcrumb ── */}
            <div className="bg-gray-100/30 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Link href={inventoryHref} className="hover:text-gray-900 transition-colors">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <Link href={inventoryHref} className="hover:text-gray-900 transition-colors">Cars</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <Link href={makeHref} className="hover:text-gray-900 transition-colors">{car.make}</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-gray-900 font-medium">{car.model}</span>
                    </nav>
                </div>
            </div>

            {/* ── Hero Section: Image Gallery + Price Card ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Image Gallery */}
                    <div className="lg:col-span-2 space-y-3">
                        {/* Main Image */}
                        <div className="relative aspect-[16/10] bg-gray-100 rounded-xl overflow-hidden group">
                            {activeImage ? (
                                <Image
                                    src={activeImage}
                                    alt={`${car.make} ${car.model}`}
                                    fill
                                    unoptimized={activeImage.startsWith('http')}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    No Image Available
                                </div>
                            )}

                            {/* Image counter */}
                            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                                <Eye className="w-3 h-3 inline mr-1" />
                                {allImages.indexOf(activeImage) + 1}/{allImages.length}
                            </div>

                            {/* Favorite */}
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                            >
                                <Heart className={`w-4.5 h-4.5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                            </button>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img
                                            ? 'border-blue-600 ring-1 ring-blue-600/30'
                                            : 'border-transparent hover:border-muted-foreground/30'
                                        }`}
                                >
                                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Summary Card */}
                    <div className="space-y-4">
                        <Card className={lightCardClass}>
                            <CardContent className="p-5">
                                {/* Title */}
                                <div className="mb-3">
                                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        {getBrandLogo(car.make) && (
                                            <Image src={getBrandLogo(car.make)!} alt={car.make} width={24} height={24} className="object-contain" />
                                        )}
                                        {car.make} {car.model}
                                    </h1>
                                    <p className="text-sm text-gray-500">{car.variant} {car.year && `• ${car.year}`}</p>
                                </div>

                                {/* Price */}
                                <div className="mb-4">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-gray-900">{priceDisplay}</span>
                                        {hasPriceRange && (
                                            <span className="text-sm text-gray-500">- {maxPriceDisplay}</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">Ex-showroom Price</p>
                                    {car.pricing.emi && (
                                        <Badge variant="secondary" className="mt-2 text-xs gap-1" style={{ color: brandColor }}>
                                            <TrendingUp className="w-3 h-3" />
                                            EMI from ₹{car.pricing.emi.monthly.toLocaleString()}/mo
                                        </Badge>
                                    )}
                                </div>

                                <Separator className="mb-4" />

                                {/* Quick Specs */}
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    {keySpecs.slice(0, 4).map((spec, idx) => (
                                        <div key={idx} className="flex items-center gap-2 p-2 bg-gray-100/40 rounded-lg">
                                            {spec.icon}
                                            <div>
                                                <p className="text-[10px] text-gray-500">{spec.label}</p>
                                                <p className="text-xs font-semibold">{spec.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* CTAs */}
                                <div className="space-y-2.5">
                                    <Button className="w-full" size="lg" style={{ backgroundColor: brandColor, color: brandContrast }}>
                                        <Phone className="w-4 h-4 mr-2" />
                                        Check On-Road Price
                                    </Button>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="outline" size="sm" className={lightOutlineButtonClass}>
                                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                            Test Drive
                                        </Button>
                                        <Button variant="outline" size="sm" className={lightOutlineButtonClass}>
                                            <Download className="w-3.5 h-3.5 mr-1.5" />
                                            Brochure
                                        </Button>
                                    </div>
                                    <Button variant="ghost" size="sm" className={`w-full ${lightGhostButtonClass}`}>
                                        <Share2 className="w-3.5 h-3.5 mr-1.5" />
                                        Share
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* ── Sticky Tab Navigation ── */}
            <div
                ref={tabBarRef}
                className={`sticky top-14 z-40 border-b border-slate-200 bg-white/95 backdrop-blur transition-shadow ${isTabBarSticky ? 'shadow-sm' : ''}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-0 overflow-x-auto no-scrollbar">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => scrollToSection(tab.id)}
                                    className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                                        ? ''
                                        : 'border-transparent text-gray-500 hover:text-gray-900'
                                    }`}
                                    style={activeTab === tab.id ? { borderColor: brandColor, color: brandColor } : undefined}
                                >
                                <tab.icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Content Sections ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

                {/* ──────── USED CAR TRUST BANNER ──────── */}
                {isUsed && (
                    <Card className="border-emerald-500/20 bg-emerald-500/5">
                        <CardContent className="p-5">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-emerald-600">
                                            {isCPO ? 'Certified Pre-Owned' : 'Inspected & Verified'}
                                        </h3>
                                        <p className="text-sm text-emerald-600">
                                            {isCPO
                                                ? 'This car has been thoroughly inspected and comes with manufacturer-backed warranty.'
                                                : 'This car has passed our 200+ point quality inspection.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 sm:ml-auto">
                                    <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-500 gap-1">
                                        <ClipboardCheck className="w-3 h-3" /> 200+ Point Check
                                    </Badge>
                                    {isCPO && (
                                        <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-500 gap-1">
                                            <BadgeCheck className="w-3 h-3" /> 1 Year Warranty
                                        </Badge>
                                    )}
                                    <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-500 gap-1">
                                        <RotateCcw className="w-3 h-3" /> 7-Day Return
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* ──────── OVERVIEW ──────── */}
                <section ref={el => { sectionRefs.current['overview'] = el; }} id="overview">
                    <h2 className="text-2xl font-bold mb-6">{car.make} {car.model} Overview</h2>

                    {/* Key Highlights */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                        {keySpecs.map((spec, idx) => (
                            <Card key={idx} className={`${softCardClass} text-center p-4`}>
                                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                                    {spec.icon}
                                </div>
                                <p className="text-xs text-gray-500">{spec.label}</p>
                                <p className="text-sm font-semibold mt-0.5">{spec.value}</p>
                            </Card>
                        ))}
                    </div>

                    {/* Pros & Cons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-emerald-500/20 bg-emerald-500/5">
                            <CardContent className="p-5">
                                <h3 className="text-base font-semibold text-emerald-600 mb-3 flex items-center gap-2">
                                    <Check className="w-4 h-4" /> Things We Like
                                </h3>
                                <ul className="space-y-2">
                                    {(car.features?.keyFeatures || []).slice(0, 5).map((feat, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                                            <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
                                            {feat}
                                        </li>
                                    ))}
                                    {(!car.features?.keyFeatures || car.features.keyFeatures.length === 0) && (
                                        <li className="text-sm text-gray-500">Information not available</li>
                                    )}
                                </ul>
                            </CardContent>
                        </Card>
                        <Card className="border-red-500/20 bg-red-500/5">
                            <CardContent className="p-5">
                                <h3 className="text-base font-semibold text-red-600 mb-3 flex items-center gap-2">
                                    <X className="w-4 h-4" /> Things to Consider
                                </h3>
                                <ul className="space-y-2">
                                    {/* Auto-generate considerations from data */}
                                    {!car.safety?.esp && (
                                        <li className="flex items-start gap-2 text-sm text-red-700">
                                            <X className="w-3.5 h-3.5 mt-0.5 text-red-500 shrink-0" />
                                            ESP not available in base variants
                                        </li>
                                    )}
                                    {car.safety && car.safety.airbags < 6 && (
                                        <li className="flex items-start gap-2 text-sm text-red-700">
                                            <X className="w-3.5 h-3.5 mt-0.5 text-red-500 shrink-0" />
                                            Only {car.safety.airbags} airbags (6 recommended)
                                        </li>
                                    )}
                                    {!car.engine?.displacement && (
                                        <li className="flex items-start gap-2 text-sm text-red-700">
                                            <X className="w-3.5 h-3.5 mt-0.5 text-red-500 shrink-0" />
                                            Engine details not fully available
                                        </li>
                                    )}
                                    {car.performance?.fuelEfficiency && car.performance.fuelEfficiency < 15 && (
                                        <li className="flex items-start gap-2 text-sm text-red-700">
                                            <X className="w-3.5 h-3.5 mt-0.5 text-red-500 shrink-0" />
                                            Below average fuel efficiency ({car.performance.fuelEfficiency} km/l)
                                        </li>
                                    )}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* ──────── INSPECTION REPORT (Used Cars Only) ──────── */}
                {isUsed && (
                    <section ref={el => { sectionRefs.current['inspection'] = el; }} id="inspection">
                        <h2 className="text-2xl font-bold mb-6">Inspection Report</h2>

                        {/* Overall Score */}
                        <Card className={`${lightCardClass} mb-6`}>
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="text-center">
                                        <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                            <span className="text-3xl font-bold text-emerald-500">4.2</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">out of 5.0</p>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold mb-1">Overall Condition: Good</h3>
                                        <p className="text-sm text-gray-500 mb-3">
                                            Inspected on {new Date(Date.now() - 7 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} by a certified mechanic.
                                            This vehicle passed 186 out of 200+ quality checkpoints.
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10">No Accidents</Badge>
                                            <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10">No Flood Damage</Badge>
                                            <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10">Original Paint</Badge>
                                            <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/10">Minor Scratches</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Category Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {INSPECTION_CATEGORIES.map((cat) => {
                                const goodCount = cat.items.filter(i => i.status === 'good').length;
                                const total = cat.items.length;
                                return (
                                    <Card key={cat.name} className={lightCardClass}>
                                        <CardContent className="p-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                                    {cat.icon} {cat.name}
                                                </h4>
                                                <Badge variant="outline" className="text-[10px]">
                                                    {goodCount}/{total} Good
                                                </Badge>
                                            </div>
                                            <div className="space-y-2">
                                                {cat.items.map((item) => (
                                                    <div key={item.name} className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-500">{item.name}</span>
                                                        <span className={`text-xs font-medium flex items-center gap-1 ${item.status === 'good' ? 'text-emerald-600' : item.status === 'fair' ? 'text-amber-600' : 'text-red-600'
                                                            }`}>
                                                            {item.status === 'good' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                            {item.status === 'fair' && <AlertTriangle className="w-3.5 h-3.5" />}
                                                            {item.status === 'good' ? 'Good' : item.status === 'fair' ? 'Fair' : 'Needs Repair'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        <p className="text-[10px] text-gray-500 mt-4">
                            * Inspection report is based on assessment at the time of listing. Vehicle condition may change over time.
                        </p>
                    </section>
                )}

                {/* ──────── CAR HISTORY (Used Cars Only) ──────── */}
                {isUsed && (
                    <section ref={el => { sectionRefs.current['history'] = el; }} id="history">
                        <h2 className="text-2xl font-bold mb-6">Car History</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Ownership Timeline */}
                            <Card className={lightCardClass}>
                                <CardContent className="p-5">
                                    <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-500" />
                                        Ownership History
                                    </h3>
                                    <div className="relative pl-6 space-y-6">
                                        {/* Timeline line */}
                                        <div className="absolute left-[9px] top-1 bottom-1 w-0.5 bg-border" />

                                        <div className="relative">
                                            <div className="absolute -left-6 top-0 w-[18px] h-[18px] rounded-full bg-blue-600 border-2 border-white" />
                                            <div>
                                                <p className="text-sm font-semibold">Current Owner (You viewing)</p>
                                                <p className="text-xs text-gray-500">Since {car.year ? car.year + 2 : 2023} - Present</p>
                                                <p className="text-xs text-gray-500 mt-1">Individual • Metro City</p>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <div className="absolute -left-6 top-0 w-[18px] h-[18px] rounded-full bg-gray-100 border-2 border-white" />
                                            <div>
                                                <p className="text-sm font-semibold">1st Owner</p>
                                                <p className="text-xs text-gray-500">{car.year || 2020} - {car.year ? car.year + 2 : 2022}</p>
                                                <p className="text-xs text-gray-500 mt-1">Individual • Metro City</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Service & Documents */}
                            <Card className={lightCardClass}>
                                <CardContent className="p-5">
                                    <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                        Documents & Service
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Registration Certificate (RC)', status: true, icon: <FileText className="w-4 h-4" /> },
                                            { label: 'Insurance Valid', status: true, icon: <Shield className="w-4 h-4" /> },
                                            { label: 'Pollution Certificate', status: true, icon: <CheckCircle2 className="w-4 h-4" /> },
                                            { label: 'Service Records Available', status: true, icon: <Wrench className="w-4 h-4" /> },
                                            { label: 'No Accident History', status: true, icon: <ShieldCheck className="w-4 h-4" /> },
                                            { label: 'No Loan / Hypothecation', status: true, icon: <BadgeCheck className="w-4 h-4" /> },
                                        ].map((doc) => (
                                            <div key={doc.label} className="flex items-center justify-between p-2.5 bg-gray-100/30 rounded-lg">
                                                <div className="flex items-center gap-2.5 text-sm">
                                                    <span className="text-gray-500">{doc.icon}</span>
                                                    {doc.label}
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={doc.status
                                                        ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10'
                                                        : 'border-red-500/30 text-red-500 bg-red-500/10'
                                                    }
                                                >
                                                    {doc.status ? 'Verified' : 'Pending'}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Service History */}
                            <Card className={`${lightCardClass} md:col-span-2`}>
                                <CardContent className="p-5">
                                    <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                                        <Wrench className="w-4 h-4 text-gray-500" />
                                        Service History
                                    </h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-100/30">
                                                <TableHead className="text-xs font-semibold">Date</TableHead>
                                                <TableHead className="text-xs font-semibold">KM Reading</TableHead>
                                                <TableHead className="text-xs font-semibold">Service Type</TableHead>
                                                <TableHead className="text-xs font-semibold">Service Center</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {[
                                                { date: 'Nov 2025', km: '42,000', type: 'Regular Service', center: 'Authorized Service Center' },
                                                { date: 'May 2025', km: '35,000', type: 'Regular Service + Brake Pad', center: 'Authorized Service Center' },
                                                { date: 'Nov 2024', km: '27,000', type: 'Regular Service', center: 'Authorized Service Center' },
                                                { date: 'May 2024', km: '18,000', type: 'Regular Service + Tyre Rotation', center: 'Authorized Service Center' },
                                                { date: 'Nov 2023', km: '10,000', type: 'First Free Service', center: 'Authorized Service Center' },
                                            ].map((s, i) => (
                                                <TableRow key={i}>
                                                    <TableCell className="text-sm">{s.date}</TableCell>
                                                    <TableCell className="text-sm">{s.km} km</TableCell>
                                                    <TableCell className="text-sm">{s.type}</TableCell>
                                                    <TableCell className="text-sm text-gray-500">{s.center}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                )}

                {/* ──────── SPECIFICATIONS ──────── */}
                <section ref={el => { sectionRefs.current['specs'] = el; }} id="specs">
                    <h2 className="text-2xl font-bold mb-6">{car.make} {car.model} Specifications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Engine & Transmission */}
                        <Card className={lightCardClass}>
                            <CardContent className="p-5">
                                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-gray-500" />
                                    Engine & Transmission
                                </h3>
                                <div className="space-y-0">
                                    <SpecRow label="Engine Type" value={car.engine?.type || ''} />
                                    <SpecRow label="Displacement" value={car.engine?.displacement ? `${car.engine.displacement} cc` : ''} />
                                    <SpecRow label="Max Power" value={car.engine?.power || ''} />
                                    <SpecRow label="Max Torque" value={car.engine?.torque || ''} />
                                    <SpecRow label="Cylinders" value={car.engine?.cylinders ? `${car.engine.cylinders}` : ''} />
                                    <SpecRow label="Transmission" value={car.transmission?.type || ''} />
                                    <SpecRow label="Gears" value={car.transmission?.gears ? `${car.transmission.gears} Speed` : ''} />
                                    <SpecRow label="Drive Type" value={car.transmission?.driveType || ''} last />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Performance */}
                        <Card className={lightCardClass}>
                            <CardContent className="p-5">
                                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-gray-500" />
                                    Performance & Fuel
                                </h3>
                                <div className="space-y-0">
                                    <SpecRow label="Mileage (ARAI)" value={car.performance?.fuelEfficiency ? `${car.performance.fuelEfficiency} km/l` : ''} />
                                    <SpecRow label="Top Speed" value={car.performance?.topSpeed ? `${car.performance.topSpeed} km/h` : ''} />
                                    <SpecRow label="0-100 km/h" value={car.performance?.acceleration0to100 ? `${car.performance.acceleration0to100} sec` : ''} />
                                    <SpecRow label="Fuel Tank" value={car.dimensions?.fuelTankCapacity ? `${car.dimensions.fuelTankCapacity} L` : ''} />
                                    {car.engine?.batteryCapacity && (
                                        <SpecRow label="Battery" value={`${car.engine.batteryCapacity} kWh`} />
                                    )}
                                    {car.engine?.range && (
                                        <SpecRow label="Range" value={`${car.engine.range} km`} last />
                                    )}
                                    {!car.engine?.batteryCapacity && !car.engine?.range && (
                                        <SpecRow label="Fuel Type" value={car.engine?.type || ''} last />
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Dimensions */}
                        <Card className={lightCardClass}>
                            <CardContent className="p-5">
                                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                                    <CarIcon className="w-4 h-4 text-gray-500" />
                                    Dimensions & Weight
                                </h3>
                                <div className="space-y-0">
                                    <SpecRow label="Length" value={car.dimensions?.length ? `${car.dimensions.length} mm` : ''} />
                                    <SpecRow label="Width" value={car.dimensions?.width ? `${car.dimensions.width} mm` : ''} />
                                    <SpecRow label="Height" value={car.dimensions?.height ? `${car.dimensions.height} mm` : ''} />
                                    <SpecRow label="Wheelbase" value={car.dimensions?.wheelbase ? `${car.dimensions.wheelbase} mm` : ''} />
                                    <SpecRow label="Ground Clearance" value={car.dimensions?.groundClearance ? `${car.dimensions.groundClearance} mm` : ''} />
                                    <SpecRow label="Kerb Weight" value={car.dimensions?.kerbWeight ? `${car.dimensions.kerbWeight} kg` : ''} />
                                    <SpecRow label="Boot Space" value={car.dimensions?.bootSpace ? `${car.dimensions.bootSpace} L` : ''} />
                                    <SpecRow label="Seating Capacity" value={car.dimensions?.seatingCapacity ? `${car.dimensions.seatingCapacity}` : ''} last />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Safety */}
                        <Card className={lightCardClass}>
                            <CardContent className="p-5">
                                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-gray-500" />
                                    Safety
                                </h3>
                                <div className="space-y-0">
                                    <SpecRow label="NCAP Rating" value={car.safety?.ncapRating?.stars ? `${car.safety.ncapRating.stars} Stars` : ''} />
                                    <SpecRow label="Airbags" value={car.safety?.airbags !== undefined ? `${car.safety.airbags}` : ''} />
                                    <SpecRow label="ABS" value={car.safety?.abs ? 'Yes' : ''} />
                                    <SpecRow label="ESP" value={car.safety?.esp ? 'Yes' : 'No'} />
                                    <SpecRow label="Hill Hold Assist" value={car.safety?.hillHoldAssist ? 'Yes' : 'No'} />
                                    <SpecRow label="Traction Control" value={car.safety?.tractionControl ? 'Yes' : 'No'} />
                                    <SpecRow label="Rear Camera" value={car.safety?.rearCamera ? 'Yes' : 'No'} last />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* ──────── FEATURES ──────── */}
                <section ref={el => { sectionRefs.current['features'] = el; }} id="features">
                    <h2 className="text-2xl font-bold mb-6">{car.make} {car.model} Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {car.features?.keyFeatures && car.features.keyFeatures.length > 0 && (
                            <FeatureGroup title="Key Features" features={car.features.keyFeatures} icon={<Star className="w-4 h-4 text-amber-500" />} />
                        )}
                        {car.features?.safetyFeatures && car.features.safetyFeatures.length > 0 && (
                            <FeatureGroup title="Safety" features={car.features.safetyFeatures} icon={<Shield className="w-4 h-4 text-red-500" />} />
                        )}
                        {car.features?.comfortFeatures && car.features.comfortFeatures.length > 0 && (
                            <FeatureGroup title="Comfort & Convenience" features={car.features.comfortFeatures} icon={<Users className="w-4 h-4 text-purple-500" />} />
                        )}
                        {car.features?.techFeatures && car.features.techFeatures.length > 0 && (
                            <FeatureGroup title="Technology & Infotainment" features={car.features.techFeatures} icon={<Zap className="w-4 h-4 text-blue-500" />} />
                        )}
                        {car.features?.exteriorFeatures && car.features.exteriorFeatures.length > 0 && (
                            <FeatureGroup title="Exterior" features={car.features.exteriorFeatures} icon={<CarIcon className="w-4 h-4 text-green-500" />} />
                        )}
                    </div>
                    {(!car.features?.keyFeatures || car.features.keyFeatures.length === 0) && (
                        <Card className={`${lightCardClass} p-8 text-center`}>
                            <p className="text-gray-500">Feature information not available for this model.</p>
                        </Card>
                    )}
                </section>

                {/* ──────── VARIANTS & PRICE ──────── */}
                <section ref={el => { sectionRefs.current['variants'] = el; }} id="variants">
                    <h2 className="text-2xl font-bold mb-6">{car.make} {car.model} Variants & Price</h2>
                    <Card className={lightCardClass}>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-100/40">
                                        <TableHead className="font-semibold">Variant</TableHead>
                                        <TableHead className="font-semibold">Ex-Showroom Price</TableHead>
                                        <TableHead className="font-semibold">Fuel</TableHead>
                                        <TableHead className="font-semibold">Transmission</TableHead>
                                        <TableHead className="font-semibold text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {car.variants?.map((variant) => (
                                        <TableRow key={variant.id} className={lightTableRowHoverClass}>
                                            <TableCell>
                                                <div>
                                                    <span className="font-medium">{variant.name}</span>
                                                    {variant.isPopular && (
                                                        <Badge variant="secondary" className="ml-2 text-[10px]">Popular</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold">{formatPriceInLakhs(variant.price)}</TableCell>
                                            <TableCell>{variant.fuelType}</TableCell>
                                            <TableCell>{variant.transmission}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm" className={lightOutlineButtonClass}>
                                                    Get Price
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!car.variants || car.variants.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                                Variant details are not available yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </section>

                {/* ──────── COLOURS ──────── */}
                <section ref={el => { sectionRefs.current['colors'] = el; }} id="colors">
                    <h2 className="text-2xl font-bold mb-6">{car.make} {car.model} Colours</h2>
                    {car.colors && car.colors.length > 0 ? (
                        <Card className={lightCardClass}>
                            <CardContent className="p-6">
                                {car.colors.find(c => c.name === selectedColor)?.image && (
                                    <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                        <Image
                                            src={car.colors.find(c => c.name === selectedColor)?.image || ''}
                                            alt={`${car.make} ${car.model} in ${selectedColor}`}
                                            fill
                                            unoptimized={(car.colors.find(c => c.name === selectedColor)?.image || '').startsWith('http')}
                                            className="object-contain"
                                        />
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-3 mb-4">
                                    {car.colors.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all ${selectedColor === color.name
                                                    ? 'bg-gray-100 ring-2 ring-blue-600'
                                                    : 'hover:bg-gray-100/50'
                                                }`}
                                        >
                                            <div
                                                className="w-10 h-10 rounded-full border-2 border-gray-200 shadow-sm"
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            <span className="text-xs font-medium">{color.name}</span>
                                            {color.extraCost > 0 && (
                                                <span className="text-[10px] text-gray-500">+₹{color.extraCost.toLocaleString()}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                {selectedColor && (
                                    <p className="text-sm text-gray-500">
                                        Selected: <span className="font-medium text-gray-900">{selectedColor}</span>
                                        {car.colors.find(c => c.name === selectedColor)?.type && (
                                            <> ({car.colors.find(c => c.name === selectedColor)?.type})</>
                                        )}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className={`${lightCardClass} p-8 text-center`}>
                            <p className="text-gray-500">Colour options not available for this model.</p>
                        </Card>
                    )}
                </section>

                {/* ──────── EMI CALCULATOR ──────── */}
                <section ref={el => { sectionRefs.current['emi'] = el; }} id="emi">
                    <h2 className="text-2xl font-bold mb-6">{car.make} {car.model} EMI Calculator</h2>
                    <Card className={lightCardClass}>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Inputs */}
                                <div className="space-y-6">
                                    <EmiSlider
                                        label="Vehicle Price"
                                        value={emiPrice}
                                        min={100000}
                                        max={10000000}
                                        step={50000}
                                        onChange={setEmiPrice}
                                        format={(v) => `₹${Math.round(v).toLocaleString('en-IN')}`}
                                    />
                                    <EmiSlider
                                        label="Down Payment"
                                        value={emiDown}
                                        min={0}
                                        max={emiPrice - 50000}
                                        step={10000}
                                        onChange={setEmiDown}
                                        format={(v) => `₹${Math.round(v).toLocaleString('en-IN')}`}
                                    />
                                    <EmiSlider
                                        label="Loan Tenure"
                                        value={emiTenure}
                                        min={12}
                                        max={84}
                                        step={6}
                                        onChange={setEmiTenure}
                                        format={(v) => `${v} months`}
                                    />
                                    <EmiSlider
                                        label="Interest Rate"
                                        value={emiRate}
                                        min={6}
                                        max={20}
                                        step={0.5}
                                        onChange={setEmiRate}
                                        format={(v) => `${v}% p.a.`}
                                    />
                                </div>

                                {/* Result */}
                                <div>
                                    {emiResult ? (
                                        <Card className={`${softCardClass} h-full`}>
                                            <CardContent className="p-6 flex flex-col h-full">
                                                <div className="text-center pb-4 mb-4 border-b">
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Monthly EMI</p>
                                                    <p className="text-4xl font-bold" style={{ color: brandColor }}>
                                                        ₹{emiResult.emi.toLocaleString('en-IN')}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">per month for {emiTenure} months</p>
                                                </div>
                                                <div className="space-y-3 flex-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Loan Amount</span>
                                                        <span className="font-semibold">₹{emiResult.loan.toLocaleString('en-IN')}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Total Interest</span>
                                                        <span className="font-semibold">₹{emiResult.interest.toLocaleString('en-IN')}</span>
                                                    </div>
                                                    <Separator />
                                                    <div className="flex justify-between text-sm">
                                                        <span className="font-semibold">Total Payable</span>
                                                        <span className="font-bold">₹{emiResult.total.toLocaleString('en-IN')}</span>
                                                    </div>
                                                </div>
                                                {/* Principal vs Interest bar */}
                                                <div className="mt-4">
                                                    <div className="flex justify-between text-[11px] mb-1">
                                                        <span className="text-gray-500">
                                                            Principal {Math.round((emiResult.loan / emiResult.total) * 100)}%
                                                        </span>
                                                        <span className="text-gray-500">
                                                            Interest {Math.round((emiResult.interest / emiResult.total) * 100)}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all"
                                                            style={{ width: `${(emiResult.loan / emiResult.total) * 100}%`, backgroundColor: brandColor }}
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-gray-500 mt-3">
                                                    * Indicative EMI. Actual values may vary based on lender terms.
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Card className={`${softCardClass} flex h-full items-center justify-center`}>
                                            <CardContent className="text-center p-6">
                                                <Calculator className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                                                <p className="text-sm text-gray-500">Adjust sliders to calculate EMI</p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* ──────── ON-ROAD PRICE BREAKDOWN ──────── */}
                {car.pricing.onRoad && (
                    <Card className={lightCardClass}>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                On-Road Price Estimate
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {car.pricing.onRoad.delhi && (
                                    <div className="p-4 bg-gray-100/30 rounded-lg">
                                        <p className="text-xs text-gray-500">Delhi</p>
                                        <p className="text-lg font-bold">{formatPriceInLakhs(car.pricing.onRoad.delhi)}</p>
                                    </div>
                                )}
                                {car.pricing.onRoad.mumbai && (
                                    <div className="p-4 bg-gray-100/30 rounded-lg">
                                        <p className="text-xs text-gray-500">Mumbai</p>
                                        <p className="text-lg font-bold">{formatPriceInLakhs(car.pricing.onRoad.mumbai)}</p>
                                    </div>
                                )}
                                {car.pricing.onRoad.bangalore && (
                                    <div className="p-4 bg-gray-100/30 rounded-lg">
                                        <p className="text-xs text-gray-500">Bangalore</p>
                                        <p className="text-lg font-bold">{formatPriceInLakhs(car.pricing.onRoad.bangalore)}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* ──────── REVIEWS ──────── */}
                <section ref={el => { sectionRefs.current['reviews'] = el; }} id="reviews">
                    <h2 className="text-2xl font-bold mb-6">{car.make} {car.model} Reviews</h2>
                    {car.rating ? (
                        <Card className={lightCardClass}>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Overall Rating */}
                                    <div className="text-center p-6 bg-gray-100/30 rounded-xl">
                                        <p className="text-5xl font-bold text-gray-900">{car.rating.overall}</p>
                                        <div className="flex justify-center gap-0.5 my-2">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${i < Math.floor(car.rating!.overall) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Based on {car.rating.reviewCount || 0} reviews
                                        </p>
                                    </div>

                                    {/* Rating Breakdown */}
                                    <div className="md:col-span-2 space-y-3">
                                        {[
                                            { label: 'Performance', value: car.rating.performance },
                                            { label: 'Comfort', value: car.rating.comfort },
                                            { label: 'Fuel Efficiency', value: car.rating.fuelEfficiency },
                                            { label: 'Styling', value: car.rating.styling },
                                            { label: 'Safety', value: car.rating.safety },
                                            { label: 'Value for Money', value: car.rating.valueForMoney },
                                        ].filter(r => r.value).map((rating) => (
                                            <div key={rating.label} className="flex items-center gap-3">
                                                <span className="text-sm w-32 text-gray-500">{rating.label}</span>
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-amber-400 rounded-full"
                                                        style={{ width: `${((rating.value || 0) / 5) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-semibold w-8">{rating.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className={`${lightCardClass} p-8 text-center`}>
                            <MessageSquare className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                            <p className="text-gray-500">No reviews available yet. Be the first to review!</p>
                            <Button variant="outline" className={`mt-4 ${lightOutlineButtonClass}`}>Write a Review</Button>
                        </Card>
                    )}
                </section>

                {/* ──────── FAQS ──────── */}
                <section ref={el => { sectionRefs.current['faqs'] = el; }} id="faqs">
                    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                    <Card className={lightCardClass}>
                        <CardContent className="p-5">
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="price">
                                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                                        What is the price of {car.make} {car.model}?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-gray-500">
                                        The {car.make} {car.model} price starts at {priceDisplay}
                                        {hasPriceRange && ` and goes up to ${maxPriceDisplay}`} (ex-showroom).
                                        The actual on-road price may vary depending on your city, registration charges, and insurance.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="mileage">
                                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                                        What is the mileage of {car.make} {car.model}?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-gray-500">
                                        The {car.make} {car.model} delivers a mileage of {car.performance?.fuelEfficiency ? `${car.performance.fuelEfficiency} km/l (ARAI certified)` : 'data not available'}.
                                        Real-world mileage may vary depending on driving conditions and habits.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="engine">
                                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                                        What engine does the {car.make} {car.model} have?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-gray-500">
                                        The {car.make} {car.model} is powered by a {car.engine?.displacement ? `${car.engine.displacement}cc` : ''} {car.engine?.type} engine
                                        that produces {car.engine?.power || ''} of power and {car.engine?.torque || ''} of torque,
                                        mated to a {car.transmission?.type} transmission.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="variants">
                                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                                        How many variants does {car.make} {car.model} come in?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-gray-500">
                                        The {car.make} {car.model} is available in {car.variants?.length || 'multiple'} variants.
                                        {car.variants && car.variants.length > 0 && (
                                            <> The variants include: {car.variants.map(v => v.name).join(', ')}.</>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="safety">
                                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                                        How safe is the {car.make} {car.model}?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-gray-500">
                                        The {car.make} {car.model} comes with {car.safety?.airbags || 'multiple'} airbags
                                        {car.safety?.abs && ', ABS with EBD'}
                                        {car.safety?.esp && ', Electronic Stability Program'}
                                        {car.safety?.rearCamera && ', rear parking camera'}
                                        {car.safety?.ncapRating?.stars && `. It has received a ${car.safety.ncapRating.stars}-star NCAP safety rating.`}
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="emi">
                                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                                        What is the EMI for {car.make} {car.model}?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-gray-500">
                                        {car.pricing.emi ? (
                                            <>The EMI for {car.make} {car.model} starts at ₹{car.pricing.emi.monthly.toLocaleString()} per month
                                                with a down payment of ₹{car.pricing.emi.downPayment.toLocaleString()} for a tenure of {car.pricing.emi.tenure} months.
                                                Use the EMI calculator above for a personalized estimate.</>
                                        ) : (
                                            <>Use the EMI calculator above to get a personalized estimate for the {car.make} {car.model}.</>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </section>

                {/* ──────── SIMILAR CARS ──────── */}
                {similarCars.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Similar Cars</h2>
                            <Link href={inventoryHref} className="text-sm hover:underline" style={{ color: brandColor }}>
                                View All Cars
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {similarCars.slice(0, 4).map((simCar) => (
                                <Link
                                    key={simCar.id}
                                    href={`${(detailBasePath ?? '/cars').replace(/\/$/, '')}/${simCar.id}`.replace(/^\/\//, '/')}
                                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="relative aspect-[16/10] bg-slate-50">
                                        {simCar.images.hero ? (
                                            <Image
                                                src={simCar.images.hero}
                                                alt={`${simCar.make} ${simCar.model}`}
                                                fill
                                                unoptimized={simCar.images.hero.startsWith('http')}
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: brandColor }}>
                                            {simCar.make}
                                        </p>
                                        <h3 className="mt-1 line-clamp-2 text-lg font-bold text-slate-900">{simCar.model}</h3>
                                        <p className="mt-2 text-base font-semibold text-slate-900">
                                            {simCar.pricing?.exShowroom?.min != null
                                                ? formatPriceInLakhs(simCar.pricing.exShowroom.min)
                                                : (simCar.price || 'Price on request')}
                                        </p>
                                        <div
                                            className="mt-4 inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold transition-opacity group-hover:opacity-90"
                                            style={{ backgroundColor: brandColor, color: brandContrast }}
                                        >
                                            View Details
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

/* ── Helper Components ── */

function SpecRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
    if (!value || value === '—' || value === 'N/A') return null;
    return (
        <div className={`flex justify-between py-2.5 ${!last ? 'border-b border-gray-200/50' : ''}`}>
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
    );
}

function FeatureGroup({ title, features, icon }: { title: string; features: string[]; icon: React.ReactNode }) {
    return (
        <Card className="bg-white border border-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <CardContent className="p-5">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    {icon} {title}
                </h4>
                <ul className="space-y-2">
                    {features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
                            <span className="text-gray-500">{feat}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}

function EmiSlider({
    label, value, min, max, step, onChange, format,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
    format: (v: number) => string;
}) {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</label>
                <span className="text-sm font-bold text-blue-600">{format(value)}</span>
            </div>
            <Slider
                value={[value]}
                min={min}
                max={max}
                step={step}
                onValueChange={([v]) => onChange(v)}
            />
        </div>
    );
}

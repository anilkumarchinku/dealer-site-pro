/**
 * Bike Detail Page — Full CarDekho-style detail page for two-wheelers.
 * /app/bikes/[id]/page.tsx
 *
 * Client component with sticky tab bar, hero + price card, specs,
 * features, variants, colours, EMI calculator, and similar bikes.
 * Fetches data client-side from /api/bikes/[id].
 */

'use client';

import { useState, useRef, useEffect, useCallback, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { getVehicleImageUrls, brandNameToId, modelToSlug, isUsableVehicleImageUrl } from '@/lib/utils/brand-model-images';
import { resolveVehicleColorHex } from '@/lib/utils/resolve-vehicle-color';
import {
    defaultTwoWheelerVariantName,
    normalizeTwoWheelerVariants,
    type TwoWheelerVariantSource,
} from '@/lib/utils/two-wheeler-variants';
import { OnRoadPriceDialog } from '@/components/two-wheelers/OnRoadPriceDialog';
import {
    ChevronRight,
    Share2,
    Fuel,
    Gauge,
    Zap,
    Bike,
    Shield,
    Sparkles,
    Settings,
    Calculator,
    Palette,
    Info,
    Check,
    Loader2,
} from 'lucide-react';
import { BikeDetailHeroImage } from './BikeDetailHeroImage';

// ── Types ────────────────────────────────────────────────────────
type BikeDetailVariant = TwoWheelerVariantSource

interface BikeListItem {
    id: string;
    make: string;
    model: string;
    variant: string | null;
    year: number;
    type: string;
    fuel_type: string;
    engine_cc: number | null;
    mileage_kmpl: number | string | null;
    range_km: number | null;
    top_speed_kmph: number | null;
    price_min_paise: number;
    image_url: string | null;
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

type BikeData = BikeListItem & {
    body_type?: string | null;
    transmission?: string | null;
    variants?: BikeDetailVariant[];
    features?: string[];
    key_features?: string[];
    safety_features?: string[];
    colors?: Array<string | { name: string; hex?: string }>;
    battery_kwh?: number | null;
    description?: string | null;
    power?: string | null;
    max_power?: string | null;
    torque?: string | null;
    charging_time_hours?: number | null;
    fuel_system?: string | null;
    fuel_tank_capacity?: number | null;
    kerb_weight?: number | null;
    seat_height?: number | null;
    ground_clearance?: number | null;
    wheelbase?: number | null;
}

interface BikeVariantRow {
    key: string;
    name: string;
    priceLabel: string;
    fuelLabel: string;
    engineOrBatteryLabel: string;
    isCurrent: boolean;
    href?: string;
}

interface Props {
    params: Promise<{ id: string }>;
}

function buildTwoWColorMetadataSlugCandidates(model: string): string[] {
    const base = modelToSlug(model);
    return Array.from(new Set([
        base,
        base.replace(/-20$/g, ''),
        base.replace(/-202\d$/g, ''),
        base.replace(/-fi/g, ''),
        base.replace(/-v(\d)$/g, '-$1'),
        base.replace(/-xc$/g, '-x'),
        base.replace(/-x$/g, '-xc'),
        base.replace(/-plus$/g, ''),
        base.replace(/-/g, ''),
        base.replace(/^pulsar-/, ''),
    ].filter(Boolean)));
}

function normalizeTwoWColorImagePath(
    image: string | null | undefined,
    brandId: string,
    modelSlug: string
): string | null {
    if (!image) return null;
    const cleanImage = image.trim();
    if (!cleanImage) return null;

    if (cleanImage.startsWith('/data/brand-model-images/2w-colors/')) {
        return cleanImage;
    }

    if (/^https?:\/\//i.test(cleanImage)) {
        return cleanImage;
    }

    const fileName = cleanImage.split('/').filter(Boolean).pop();
    if (!fileName) return null;

    return `/data/brand-model-images/2w-colors/${brandId}/${modelSlug}/${fileName}`;
}

// ── Tab definitions ──────────────────────────────────────────────
const TABS = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'specs', label: 'Specifications', icon: Settings },
    { id: 'features', label: 'Features', icon: Check },
    { id: 'variants', label: 'Variants & Price', icon: Bike },
    { id: 'colours', label: 'Colours', icon: Palette },
    { id: 'emi', label: 'EMI Calculator', icon: Calculator },
    { id: 'similar', label: 'Similar Bikes', icon: Bike },
];

function BikeDetailLandingThemeStyles() {
    return (
        <style>{`
            .bike-detail-landing-theme {
                --background: 48 100% 98%;
                --foreground: 220 24% 6%;
                --card: 48 100% 98%;
                --card-foreground: 220 24% 6%;
                --muted: 38 32% 93%;
                --muted-foreground: 36 7% 45%;
                --border: 36 25% 83%;
                --input: 36 25% 83%;
                --primary: 34 46% 44%;
                --primary-foreground: 48 100% 98%;
                --ring: 34 46% 44%;
                background:
                    radial-gradient(circle at 12% 6%, rgb(199 154 91 / 0.12), transparent 28%),
                    linear-gradient(180deg, #F5F1EA 0%, #FFFDF7 42%, #F4EFE6 100%);
                color: #0B0E12;
            }

            .bike-detail-landing-theme .bg-white {
                background-color: #FFFDF7 !important;
            }

            .bike-detail-landing-theme .bg-gray-50,
            .bike-detail-landing-theme .bg-gray-100,
            .bike-detail-landing-theme .hover\\:bg-gray-50:hover,
            .bike-detail-landing-theme .hover\\:bg-gray-100:hover {
                background-color: #F4EFE6 !important;
            }

            .bike-detail-landing-theme .text-gray-900 {
                color: #0B0E12 !important;
            }

            .bike-detail-landing-theme .text-gray-700,
            .bike-detail-landing-theme .text-muted-foreground {
                color: #756F66 !important;
            }

            .bike-detail-landing-theme .text-gray-400 {
                color: #A59D92 !important;
            }

            .bike-detail-landing-theme .text-blue-600,
            .bike-detail-landing-theme .text-amber-500,
            .bike-detail-landing-theme .text-red-500,
            .bike-detail-landing-theme .text-indigo-600 {
                color: #A8793A !important;
            }

            .bike-detail-landing-theme .text-blue-500,
            .bike-detail-landing-theme .text-orange-500,
            .bike-detail-landing-theme .text-amber-600 {
                color: #C79A5B !important;
            }

            .bike-detail-landing-theme .text-emerald-500,
            .bike-detail-landing-theme .text-emerald-600 {
                color: #2E7D50 !important;
            }

            .bike-detail-landing-theme .border-gray-100,
            .bike-detail-landing-theme .border-gray-200,
            .bike-detail-landing-theme .hover\\:border-gray-400:hover {
                border-color: #DED6CA !important;
            }

            .bike-detail-landing-theme .border-blue-600 {
                border-color: #A8793A !important;
            }

            .bike-detail-landing-theme .bg-blue-600,
            .bike-detail-landing-theme .hover\\:bg-blue-700:hover {
                background-color: #0B0E12 !important;
                color: #FFFDF7 !important;
            }

            .bike-detail-landing-theme .bg-blue-50 {
                background-color: rgb(199 154 91 / 0.14) !important;
            }

            .bike-detail-landing-theme .ring-blue-600,
            .bike-detail-landing-theme .focus\\:ring-blue-500:focus {
                --tw-ring-color: #A8793A !important;
            }

            .bike-detail-landing-theme .ring-blue-600\\/40 {
                --tw-ring-color: rgb(168 121 58 / 0.4) !important;
            }

            .bike-detail-landing-theme .focus\\:border-blue-500:focus {
                border-color: #A8793A !important;
            }

            .bike-detail-landing-theme .shadow-md,
            .bike-detail-landing-theme .shadow-sm,
            .bike-detail-landing-theme .hover\\:shadow-lg:hover {
                box-shadow: 0 18px 42px -32px rgb(11 14 18 / 0.5) !important;
            }

            .bike-detail-landing-theme [data-slot="badge"],
            .bike-detail-landing-theme .bg-secondary {
                border: 1px solid rgb(222 214 202 / 0.9);
                background-color: rgb(244 239 230 / 0.9) !important;
                color: #0B0E12 !important;
            }

            .bike-detail-landing-theme input,
            .bike-detail-landing-theme button {
                outline-color: #A8793A;
            }
        `}</style>
    );
}

// ── Helpers ──────────────────────────────────────────────────────
function formatPricePaise(paise: number): string {
    if (!paise || paise <= 0) return 'Price on request';
    const inr = paise / 100;
    if (inr >= 100000) {
        return `\u20B9${(inr / 100000).toFixed(2)} Lakh`;
    }
    return `\u20B9${inr.toLocaleString('en-IN')}`;
}

function normalizeVariantLabel(value: string | null | undefined): string {
    return String(value ?? '')
        .toLowerCase()
        .replace(/[^\w]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

function copyTextFallback(value: string): boolean {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        return document.execCommand('copy');
    } finally {
        document.body.removeChild(textarea);
    }
}

// ── Page Component ───────────────────────────────────────────────
export default function BikeDetailPage({ params }: Props) {
    const { id } = use(params);

    // Data state
    const [bike, setBike] = useState<BikeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [variants, setVariants] = useState<BikeListItem[]>([]);
    const [similarBikes, setSimilarBikes] = useState<BikeListItem[]>([]);
    const [colorImages, setColorImages] = useState<{ name: string; image: string }[]>([]);

    // UI state
    const [activeTab, setActiveTab] = useState('overview');
    const [isTabBarSticky, setIsTabBarSticky] = useState(false);
    const [selectedColorIdx, setSelectedColorIdx] = useState(0);
    const [onRoadOpen, setOnRoadOpen] = useState(false);
    const [shareStatus, setShareStatus] = useState<string | null>(null);
    const [shareFallbackUrl, setShareFallbackUrl] = useState<string | null>(null);

    // EMI Calculator state
    const [emiPrice, setEmiPrice] = useState(100000);
    const [emiDown, setEmiDown] = useState(20000);
    const [emiTenure, setEmiTenure] = useState(36);
    const [emiRate, setEmiRate] = useState(12);

    // Refs
    const tabBarRef = useRef<HTMLDivElement>(null);
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    // ── Fetch bike data ──────────────────────────────────────────
    useEffect(() => {
        async function fetchBike() {
            try {
                setLoading(true);
                const res = await fetch(`/api/bikes/${id}`);
                const json = await res.json();
                if (!json.success || !json.data) {
                    setError('Bike not found');
                    return;
                }
                setBike(json.data);

                // Set EMI defaults based on price
                const price = json.data.price_min_paise ?? 0;
                if (price > 0) {
                    const inr = price / 100;
                    setEmiPrice(inr);
                    setEmiDown(Math.round(inr * 0.2));
                }
            } catch {
                setError('Failed to load bike details');
            } finally {
                setLoading(false);
            }
        }
        fetchBike();
    }, [id]);

    // ── Fetch grouped model rows only as a fallback when raw variants are absent ──
    useEffect(() => {
        if (!bike || (Array.isArray(bike.variants) && bike.variants.length > 0)) return;
        async function fetchVariants() {
            try {
                const res = await fetch(
                    `/api/bikes?make=${encodeURIComponent(bike!.make)}&q=${encodeURIComponent(bike!.model)}&pageSize=20`
                );
                const json = await res.json();
                if (json.success && json.data?.vehicles) {
                    setVariants(json.data.vehicles);
                }
            } catch {
                // silently fail
            }
        }
        fetchVariants();
    }, [bike]);

    // ── Fetch similar bikes (same brand) ─────────────────────────
    useEffect(() => {
        if (!bike) return;
        async function fetchSimilar() {
            try {
                const res = await fetch(
                    `/api/bikes?make=${encodeURIComponent(bike!.make)}&pageSize=5`
                );
                const json = await res.json();
                if (json.success && json.data?.vehicles) {
                    const filtered = json.data.vehicles.filter(
                        (v: BikeListItem) => v.id !== id
                    );
                    setSimilarBikes(filtered.slice(0, 4));
                }
            } catch {
                // silently fail
            }
        }
        fetchSimilar();
    }, [bike, id]);

    // ── Fetch color images from 2w-colors gallery ────────────────
    // Fetch metadata.json directly from CDN (static file in public/)
    // instead of going through the API, because outputFileTracingExcludes
    // blocks fs access to brand-model-images/** in the serverless function.
    useEffect(() => {
        if (!bike) return;
        async function fetchColors() {
            try {
                const brandId = brandNameToId(bike!.make, '2w');
                const slugCandidates = buildTwoWColorMetadataSlugCandidates(bike!.model);

                for (const modelSlug of slugCandidates) {
                    const metadataUrl = `/data/brand-model-images/2w-colors/${brandId}/${modelSlug}/metadata.json`;
                    const res = await fetch(metadataUrl);
                    if (!res.ok) continue;

                    const meta = await res.json();
                    const colors = (meta.colors ?? [])
                        .map((c: { name?: string; image?: string; file?: string }) => ({
                            name: c.name?.trim() ?? '',
                            image: normalizeTwoWColorImagePath(c.image ?? c.file, brandId, modelSlug) ?? '',
                        }))
                        .filter((color: { name: string; image: string }) => color.name && isUsableVehicleImageUrl(color.image));

                    if (colors.length > 0) {
                        setColorImages(colors);
                        setSelectedColorIdx(0);
                        return;
                    }
                }
            } catch {
                // silently fail — no color gallery for this model
            }
        }
        fetchColors();
    }, [bike]);

    // ── Sticky tab bar detection ─────────────────────────────────
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

    // ── Scroll spy for active tab ────────────────────────────────
    useEffect(() => {
        const handleScroll = () => {
            const offset = 140;
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

    const scrollToSection = useCallback((sectionId: string) => {
        const el = sectionRefs.current[sectionId];
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 130;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, []);

    // ── EMI calculation ──────────────────────────────────────────
    const calcEmi = useCallback(() => {
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
    }, [emiPrice, emiDown, emiTenure, emiRate]);

    const emiResult = calcEmi();

    // ── Share handler ────────────────────────────────────────────
    useEffect(() => {
        if (!shareStatus) return undefined;
        if (shareStatus === 'Copy manually') return undefined;

        const timer = window.setTimeout(() => setShareStatus(null), 2200);
        return () => window.clearTimeout(timer);
    }, [shareStatus]);

    const handleShare = useCallback(async () => {
        const sharePayload = {
            title: bike ? `${bike.make} ${bike.model}` : 'Bike Details',
            url: window.location.href,
        };
        setShareFallbackUrl(null);

        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            try {
                setShareStatus('Link copied');
                await navigator.clipboard.writeText(window.location.href);
                return;
            } catch {
                if (copyTextFallback(window.location.href)) return;
                setShareStatus('Copy unavailable');
                // Fall through to native share when clipboard access is unavailable.
            }
        }

        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share(sharePayload);
                setShareStatus('Shared');
                setShareFallbackUrl(null);
                return;
            } catch (error) {
                if ((error as { name?: string })?.name === 'AbortError') {
                    setShareStatus('Share cancelled');
                    return;
                }
            }
        }

        setShareStatus('Copy manually');
        setShareFallbackUrl(window.location.href);
    }, [bike]);

    const openDealerDiscovery = useCallback(() => {
        setOnRoadOpen(false);
        window.location.href = '/';
    }, []);

    // ── Loading state ────────────────────────────────────────────
    if (loading) {
        return (
            <>
                <BikeDetailLandingThemeStyles />
                <SiteHeader />
                <main className="bike-detail-landing-theme min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-700">Loading bike details...</p>
                    </div>
                </main>
                <SiteFooter />
            </>
        );
    }

    // ── Error state ──────────────────────────────────────────────
    if (error || !bike) {
        return (
            <>
                <BikeDetailLandingThemeStyles />
                <SiteHeader />
                <main className="bike-detail-landing-theme min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Bike className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h1 className="text-xl font-bold text-gray-900 mb-2">Bike Not Found</h1>
                        <p className="text-gray-700 mb-4">{error || 'The bike you are looking for does not exist.'}</p>
                        <Link href="/bikes" className="text-blue-600 hover:underline font-medium">
                            Browse All Bikes
                        </Link>
                    </div>
                </main>
                <SiteFooter />
            </>
        );
    }

    // ── Derived values ───────────────────────────────────────────
    const fuelRaw = (bike.fuel_type ?? '').toLowerCase();
    const isElectric = fuelRaw === 'electric';
    const rawVehicleType = String(bike.type ?? bike.body_type ?? '').toLowerCase();
    const vehicleType = isElectric ? 'Electric' : rawVehicleType.includes('scooter') ? 'Scooter' : 'Motorcycle';
    const fuelLabel = isElectric ? 'Electric' : 'Petrol';
    const transmissionLabel = bike.transmission ?? (isElectric ? 'Automatic' : '--');
    const mileageKmpl = bike.mileage_kmpl ? Number(bike.mileage_kmpl) : null;
    const displayVariant = bike.variant && bike.variant.trim().toLowerCase() !== bike.model.trim().toLowerCase()
        ? bike.variant
        : null;
    const variant = displayVariant ? ` ${displayVariant}` : '';

    const detailVariants = normalizeTwoWheelerVariants(Array.isArray(bike.variants) ? bike.variants : []);
    const fallbackDetailVariant = normalizeTwoWheelerVariants([], {
        name: defaultTwoWheelerVariantName(bike.model, bike.variant),
        price_paise: bike.price_min_paise ?? 0,
    })[0];
    const onRoadVariants = detailVariants.length > 0
        ? detailVariants
        : fallbackDetailVariant
            ? [fallbackDetailVariant]
            : [];
    const normalizedBikeVariant = normalizeVariantLabel(bike.variant);
    const currentVariantName = detailVariants.length > 0
        ? (detailVariants.some((v) => normalizeVariantLabel(v.name ?? '') === normalizedBikeVariant)
            ? detailVariants.find((v) => normalizeVariantLabel(v.name ?? '') === normalizedBikeVariant)?.name
            : detailVariants[0]?.name)
        : null;

    const variantRows: BikeVariantRow[] = detailVariants.length > 0
        ? detailVariants.map((v, index: number) => {
            const fallbackPrice = index === 0 ? (bike.price_min_paise ?? 0) : 0;
            const effectivePrice = v.price_paise > 0 ? v.price_paise : fallbackPrice;

            return {
                key: `${v.name ?? 'variant'}-${index}`,
                name: v.name || `Variant ${index + 1}`,
                priceLabel: formatPricePaise(effectivePrice),
                fuelLabel: bike.fuel_type === 'electric' ? 'Electric' : 'Petrol',
                engineOrBatteryLabel: bike.fuel_type === 'electric'
                    ? (bike.range_km ? `${bike.range_km} km range` : '--')
                    : (bike.engine_cc ? `${bike.engine_cc} cc` : '--'),
                isCurrent: normalizeVariantLabel(v.name || '') === normalizeVariantLabel(currentVariantName),
            };
        })
        : variants.length > 0
            ? variants.map((v) => ({
                key: v.id,
                name: `${v.model} ${v.variant || ''}`.trim(),
                priceLabel: formatPricePaise(v.price_min_paise),
                fuelLabel: v.fuel_type === 'electric' ? 'Electric' : 'Petrol',
                engineOrBatteryLabel: v.fuel_type === 'electric'
                    ? (v.range_km ? `${v.range_km} km range` : '--')
                    : (v.engine_cc ? `${v.engine_cc} cc` : '--'),
                isCurrent: v.id === id,
                href: v.id !== id ? `/bikes/${v.id}` : undefined,
            }))
            : fallbackDetailVariant
                ? [{
                    key: 'default-variant',
                    name: fallbackDetailVariant.name,
                    priceLabel: formatPricePaise(fallbackDetailVariant.price_paise),
                    fuelLabel: bike.fuel_type === 'electric' ? 'Electric' : 'Petrol',
                    engineOrBatteryLabel: bike.fuel_type === 'electric'
                        ? (bike.range_km ? `${bike.range_km} km range` : '--')
                        : (bike.engine_cc ? `${bike.engine_cc} cc` : '--'),
                    isCurrent: true,
                }]
                : []

    // Image fallback chain
    const brandId = brandNameToId(bike.make, '2w');
    const imageUrls = getVehicleImageUrls('2w', brandId, bike.model, bike.image_url);
    // Features & safety from DB
    const features: string[] = bike.features ?? bike.key_features ?? [];
    const safetyFeatures: string[] = bike.safety_features ?? [];

    // Colors — API may return string[] or {name, hex}[] depending on data source
    const rawColors: Array<string | { name: string; hex?: string }> = bike.colors ?? [];
    const bikeColors: string[] = rawColors.map(
        (c) => typeof c === 'string' ? c : c.name
    );
    // Build hex lookup from API data (when {name, hex} objects are available)
    const apiColorHexMap: Record<string, string> = {};
    for (const c of rawColors) {
        if (typeof c === 'object' && c.hex) apiColorHexMap[c.name] = c.hex;
    }
    // Merge photo gallery colors + DB color names so ALL known colors show
    const allColors: { name: string; image: string | null }[] = [
        ...colorImages.map(c => ({ name: c.name, image: c.image as string | null })),
        ...bikeColors
            .filter(name => !colorImages.some(
                c => c.name.toLowerCase().trim() === name.toLowerCase().trim()
            ))
            .map((name): { name: string; image: string | null } => ({ name, image: null })),
    ];

    const selectedColorImage = allColors[selectedColorIdx]?.image ?? null;
    const heroImageUrls = selectedColorImage
        ? [selectedColorImage, ...imageUrls.filter((url) => url !== selectedColorImage)]
        : imageUrls;

    // Key specs for overview grid
    const keySpecs = [
        { icon: <Fuel className="w-5 h-5 text-emerald-600" />, label: 'Fuel Type', value: fuelLabel },
        { icon: <Gauge className="w-5 h-5 text-blue-600" />, label: 'Transmission', value: transmissionLabel !== '--' ? transmissionLabel : '' },
        { icon: <Zap className="w-5 h-5 text-amber-600" />, label: isElectric ? 'Range' : 'Mileage', value: isElectric ? (bike.range_km ? `${bike.range_km} km` : '') : (mileageKmpl ? `${mileageKmpl} kmpl` : '') },
        { icon: <Zap className="w-5 h-5 text-orange-500" />, label: isElectric ? 'Battery' : 'Engine', value: isElectric ? (bike.battery_kwh ? `${bike.battery_kwh} kWh` : '') : (bike.engine_cc ? `${bike.engine_cc} cc` : '') },
        { icon: <Gauge className="w-5 h-5 text-red-500" />, label: 'Top Speed', value: bike.top_speed_kmph ? `${bike.top_speed_kmph} kmph` : '' },
        { icon: <Bike className="w-5 h-5 text-indigo-600" />, label: 'Type', value: vehicleType },
    ].filter(s => s.value);

    // EMI estimate for price card
    const priceInr = (bike.price_min_paise ?? 0) / 100;
    const emiEstimate = priceInr > 0 ? Math.round((priceInr * 0.8 * (12 / 12 / 100) * Math.pow(1 + 12 / 12 / 100, 36)) / (Math.pow(1 + 12 / 12 / 100, 36) - 1)) : 0;

    return (
        <>
            <BikeDetailLandingThemeStyles />
            <SiteHeader />

            <div className="bike-detail-landing-theme min-h-screen text-gray-900">
                {/* ── Breadcrumb ── */}
                <div className="bg-gray-50 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <nav className="flex items-center gap-1.5 text-sm text-gray-700">
                            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                            <Link href="/bikes" className="hover:text-gray-900 transition-colors">Bikes</Link>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                            <Link
                                href={`/bikes?make=${encodeURIComponent(bike.make)}`}
                                className="hover:text-gray-900 transition-colors"
                            >
                                {bike.make}
                            </Link>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-900 font-medium">{bike.model}{variant}</span>
                        </nav>
                    </div>
                </div>

                {/* ── Hero Section: Image Gallery + Price Card ── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Image Gallery */}
                        <div className="lg:col-span-2 space-y-3">
                            {/* Main Image */}
                            <div className="relative aspect-[16/10] bg-gray-100 rounded-xl overflow-hidden">
                                <BikeDetailHeroImage
                                    imageUrls={heroImageUrls}
                                    alt={`${bike.make} ${bike.model}${variant}`}
                                />
                            </div>

                            {/* Colour thumbnail strip — swaps the hero image. Hidden when no colour gallery exists. */}
                            {colorImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1" role="group" aria-label="Colour options">
                                    {colorImages.map((color, idx) => (
                                        <button
                                            key={`${color.name}-${idx}`}
                                            type="button"
                                            onClick={() => setSelectedColorIdx(idx)}
                                            aria-label={`Show ${bike.make} ${bike.model} in ${color.name}`}
                                            aria-pressed={selectedColorIdx === idx}
                                            title={color.name}
                                            className={`relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-lg border bg-gray-50 transition-all ${
                                                selectedColorIdx === idx
                                                    ? 'border-blue-600 ring-2 ring-blue-600/40'
                                                    : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                        >
                                            <Image
                                                src={color.image}
                                                alt={`${bike.make} ${bike.model} in ${color.name}`}
                                                fill
                                                unoptimized
                                                sizes="96px"
                                                className="object-contain"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Price Summary Card */}
                        <div className="space-y-4">
                            <Card className="bg-white border border-gray-200 shadow-md">
                                <CardContent className="p-5">
                                    {/* Title */}
                                    <div className="mb-3">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                                            {bike.make}
                                        </p>
                                        <h1 className="text-xl font-bold text-gray-900">
                                            {bike.model}
                                        </h1>
                                        {displayVariant && (
                                            <p className="text-sm text-gray-700">{displayVariant}</p>
                                        )}
                                        {bike.year && (
                                            <p className="text-xs text-gray-700 mt-0.5">{bike.year} Model</p>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div className="mb-4 pb-4 border-b border-gray-100">
                                        <div className="text-3xl font-black text-gray-900 tracking-tight">
                                            {formatPricePaise(bike.price_min_paise ?? 0)}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Ex-showroom Price</p>
                                        {emiEstimate > 0 && (
                                            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                                                <Calculator className="w-3.5 h-3.5 shrink-0" />
                                                EMI from {'\u20B9'}{emiEstimate.toLocaleString('en-IN')}/month
                                            </div>
                                        )}
                                    </div>

                                    {/* Quick Specs */}
                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                        {keySpecs.slice(0, 4).map((spec, idx) => (
                                            <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                {spec.icon}
                                                <div>
                                                    <p className="text-[10px] text-gray-700">{spec.label}</p>
                                                    <p className="text-xs font-semibold text-gray-900">{spec.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTAs */}
                                    <div className="space-y-2.5">
                                        <Button
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                            size="lg"
                                            onClick={() => setOnRoadOpen(true)}
                                        >
                                            <Calculator className="w-4 h-4 mr-2" />
                                            Check On-Road Price
                                        </Button>
                                        <Button variant="outline" size="sm" className="w-full border-gray-200 text-gray-900 hover:bg-gray-50"
                                            onClick={handleShare}>
                                            <Share2 className="w-3.5 h-3.5 mr-1.5" />
                                            {shareStatus ?? 'Share'}
                                        </Button>
                                        {shareFallbackUrl && (
                                            <input
                                                aria-label="Share link"
                                                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700"
                                                readOnly
                                                value={shareFallbackUrl}
                                                onFocus={(event) => event.currentTarget.select()}
                                            />
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* ── Sticky Tab Navigation ── */}
                <div
                    ref={tabBarRef}
                    className={`sticky top-14 z-40 border-b border-gray-200 bg-white/95 backdrop-blur transition-shadow ${isTabBarSticky ? 'shadow-sm' : ''}`}
                >
                    <div className="max-w-7xl mx-auto min-w-0 px-4 py-1 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-1">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => scrollToSection(tab.id)}
                                    className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-700 hover:text-gray-900'
                                    }`}
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

                    {/* ──────── OVERVIEW ──────── */}
                    <section ref={el => { sectionRefs.current['overview'] = el; }} id="overview">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {bike.make} {bike.model} Overview
                        </h2>

                        {/* Key Highlights Strip */}
                        <div className="mb-8">
                            <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:grid-cols-3 lg:grid-cols-6">
                                {keySpecs.map((spec, idx) => (
                                    <div key={idx} className="flex min-w-0 flex-col items-center gap-2 border-b border-r border-gray-100 px-3 py-5 text-center last:border-r-0 sm:px-4 lg:border-b-0 lg:px-5">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                                            {spec.icon}
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 leading-tight">{spec.value}</p>
                                        <p className="text-[11px] text-gray-500 leading-tight">{spec.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        {bike.description && (
                            <Card className="bg-white border border-gray-200 shadow-sm">
                                <CardContent className="p-5">
                                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                                        About {bike.make} {bike.model}
                                    </h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">{bike.description}</p>
                                </CardContent>
                            </Card>
                        )}
                    </section>

                    {/* ──────── SPECIFICATIONS ──────── */}
                    <section ref={el => { sectionRefs.current['specs'] = el; }} id="specs">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {bike.make} {bike.model} Specifications
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Engine & Transmission */}
                            <Card className="bg-white border border-gray-200 shadow-sm">
                                <CardContent className="p-5">
                                    <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-900">
                                        <Settings className="w-4 h-4 text-gray-700" />
                                        Engine & Transmission
                                    </h3>
                                    <div className="space-y-0">
                                        <SpecRow label="Engine Type" value={isElectric ? 'Electric Motor' : (bike.engine_cc ? `${bike.engine_cc} cc` : '')} />
                                        {!isElectric && <SpecRow label="Displacement" value={bike.engine_cc ? `${bike.engine_cc} cc` : ''} />}
                                        <SpecRow label="Max Power" value={bike.power ?? bike.max_power ?? ''} />
                                        <SpecRow label="Max Torque" value={bike.torque ?? ''} />
                                        <SpecRow label="Transmission" value={transmissionLabel !== '--' ? transmissionLabel : ''} />
                                        <SpecRow label="Fuel Type" value={fuelLabel} />
                                        {isElectric && <SpecRow label="Battery" value={bike.battery_kwh ? `${bike.battery_kwh} kWh` : ''} />}
                                        {isElectric && <SpecRow label="Charging Time" value={bike.charging_time_hours ? `${bike.charging_time_hours} hrs` : ''} last />}
                                        {!isElectric && <SpecRow label="Fuel System" value={bike.fuel_system ?? ''} last />}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Performance & Fuel */}
                            <Card className="bg-white border border-gray-200 shadow-sm">
                                <CardContent className="p-5">
                                    <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-900">
                                        <Zap className="w-4 h-4 text-gray-700" />
                                        Performance & Fuel
                                    </h3>
                                    <div className="space-y-0">
                                        {isElectric ? (
                                            <>
                                                <SpecRow label="Range" value={bike.range_km ? `${bike.range_km} km` : ''} />
                                                <SpecRow label="Top Speed" value={bike.top_speed_kmph ? `${bike.top_speed_kmph} kmph` : ''} />
                                                <SpecRow label="Battery Capacity" value={bike.battery_kwh ? `${bike.battery_kwh} kWh` : ''} last />
                                            </>
                                        ) : (
                                            <>
                                                <SpecRow label="Mileage (ARAI)" value={mileageKmpl ? `${mileageKmpl} kmpl` : ''} />
                                                <SpecRow label="Top Speed" value={bike.top_speed_kmph ? `${bike.top_speed_kmph} kmph` : ''} />
                                                <SpecRow label="Fuel Tank Capacity" value={bike.fuel_tank_capacity ? `${bike.fuel_tank_capacity} L` : ''} last />
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Dimensions (if data available) */}
                            {(bike.kerb_weight || bike.seat_height || bike.ground_clearance || bike.wheelbase) && (
                                <Card className="bg-white border border-gray-200 shadow-sm md:col-span-2">
                                    <CardContent className="p-5">
                                        <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-900">
                                            <Bike className="w-4 h-4 text-gray-700" />
                                            Dimensions & Weight
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                            <div className="space-y-0">
                                                <SpecRow label="Kerb Weight" value={bike.kerb_weight ? `${bike.kerb_weight} kg` : ''} />
                                                <SpecRow label="Seat Height" value={bike.seat_height ? `${bike.seat_height} mm` : ''} />
                                            </div>
                                            <div className="space-y-0">
                                                <SpecRow label="Ground Clearance" value={bike.ground_clearance ? `${bike.ground_clearance} mm` : ''} />
                                                <SpecRow label="Wheelbase" value={bike.wheelbase ? `${bike.wheelbase} mm` : ''} last />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </section>

                    {/* ──────── FEATURES ──────── */}
                    <section ref={el => { sectionRefs.current['features'] = el; }} id="features">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {bike.make} {bike.model} Features
                        </h2>
                        {(features.length > 0 || safetyFeatures.length > 0) ? (
                            <div className="space-y-6">
                                {features.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-amber-500" />
                                            Key Features
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {features.map((feat: string, i: number) => (
                                                <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800">
                                                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                                    {feat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {safetyFeatures.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-red-500" />
                                            Safety Features
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {safetyFeatures.map((feat: string, i: number) => (
                                                <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-800">
                                                    <Shield className="w-3 h-3 text-red-500 shrink-0" />
                                                    {feat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-10 text-center">
                                <p className="text-sm text-gray-500">Feature information not available for this model.</p>
                            </div>
                        )}
                    </section>

                    {/* ──────── VARIANTS & PRICE ──────── */}
                    <section ref={el => { sectionRefs.current['variants'] = el; }} id="variants">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {bike.make} {bike.model} Variants & Price
                        </h2>
                        <Card className="bg-white border border-gray-200 shadow-sm">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                <th className="text-left text-xs font-semibold text-gray-700 px-4 py-3">Variant</th>
                                                <th className="text-left text-xs font-semibold text-gray-700 px-4 py-3">Ex-Showroom Price</th>
                                                <th className="text-left text-xs font-semibold text-gray-700 px-4 py-3">Fuel</th>
                                                <th className="text-left text-xs font-semibold text-gray-700 px-4 py-3">Engine/Battery</th>
                                                <th className="text-right text-xs font-semibold text-gray-700 px-4 py-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {variantRows.length > 0 ? (
                                                variantRows.map((v) => (
                                                    <tr key={v.key} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {v.name}
                                                                </span>
                                                                {v.isCurrent && (
                                                                    <Badge variant="secondary" className="text-[10px]">Current</Badge>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                                            {v.priceLabel}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-700">
                                                            {v.fuelLabel}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-700">
                                                            {v.engineOrBatteryLabel}
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            {v.href ? (
                                                                <Link href={v.href}>
                                                                    <Button variant="outline" size="sm" className="border-gray-200 text-gray-900 hover:bg-gray-50 text-xs">
                                                                        View Details
                                                                    </Button>
                                                                </Link>
                                                            ) : detailVariants.length > 0 ? (
                                                                <span className="text-xs text-gray-700">
                                                                    {v.isCurrent ? 'Viewing' : 'Included'}
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs text-gray-700">Viewing</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="text-center py-8 text-gray-700 text-sm">
                                                        Variant details are not available yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* ──────── COLOURS ──────── */}
                    <section ref={el => { sectionRefs.current['colours'] = el; }} id="colours">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {bike.make} {bike.model} Colours
                        </h2>
                        {allColors.length > 0 ? (
                            <div>
                                {/* Color photo preview — only shown when selected color has a photo */}
                                {allColors[selectedColorIdx]?.image && (
                                    <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                                        <Image
                                            src={allColors[selectedColorIdx].image!}
                                            alt={`${bike.make} ${bike.model} in ${allColors[selectedColorIdx].name}`}
                                            fill
                                            unoptimized
                                            className="object-contain"
                                        />
                                    </div>
                                )}

                                {/* All color swatches */}
                                <div className="flex flex-wrap gap-3 mb-5">
                                    {allColors.map((color, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedColorIdx(idx)}
                                            className={`group flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                                                selectedColorIdx === idx
                                                    ? 'bg-amber-50 ring-2 ring-amber-400'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <div
                                                className={`w-12 h-12 rounded-full border-2 shadow-sm transition-transform duration-200 group-hover:scale-110 ${
                                                    selectedColorIdx === idx
                                                        ? 'border-amber-400 scale-110'
                                                        : 'border-gray-200'
                                                }`}
                                                style={{ backgroundColor: apiColorHexMap[color.name] || colorNameToHex(color.name) }}
                                            />
                                            <span className="text-[11px] font-medium text-gray-800 max-w-[90px] text-center leading-tight">
                                                {color.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <p className="text-sm text-gray-600">
                                    Selected:{' '}
                                    <span className="font-semibold text-gray-900">{allColors[selectedColorIdx]?.name}</span>
                                    {!allColors[selectedColorIdx]?.image && (
                                        <span className="ml-2 text-xs text-gray-400">(photo not available)</span>
                                    )}
                                </p>
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <Palette className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-gray-500">Colour options not available for this model.</p>
                            </div>
                        )}
                    </section>

                    {/* ──────── EMI CALCULATOR ──────── */}
                    <section ref={el => { sectionRefs.current['emi'] = el; }} id="emi">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {bike.make} {bike.model} EMI Calculator
                        </h2>
                        <Card className="bg-white border border-gray-200 shadow-sm">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Inputs */}
                                    <div className="space-y-6">
                                        <EmiSlider
                                            label="Vehicle Price"
                                            value={emiPrice}
                                            min={10000}
                                            max={3000000}
                                            step={5000}
                                            onChange={setEmiPrice}
                                            unit="\u20B9"
                                            format={(v) => `\u20B9${Math.round(v).toLocaleString('en-IN')}`}
                                        />
                                        <EmiSlider
                                            label="Down Payment"
                                            value={emiDown}
                                            min={0}
                                            max={Math.max(emiPrice - 5000, 0)}
                                            step={5000}
                                            onChange={setEmiDown}
                                            unit="\u20B9"
                                            format={(v) => `\u20B9${Math.round(v).toLocaleString('en-IN')}`}
                                        />
                                        <EmiSlider
                                            label="Loan Tenure"
                                            value={emiTenure}
                                            min={6}
                                            max={60}
                                            step={6}
                                            onChange={setEmiTenure}
                                            unit="months"
                                            format={(v) => `${v} months`}
                                        />
                                        <EmiSlider
                                            label="Interest Rate"
                                            value={emiRate}
                                            min={6}
                                            max={24}
                                            step={0.5}
                                            onChange={setEmiRate}
                                            unit="% p.a."
                                            format={(v) => `${v}% p.a.`}
                                        />
                                    </div>

                                    {/* Result */}
                                    <div aria-live="polite">
                                        {emiResult ? (
                                            <Card className="bg-gray-50 border border-gray-200 h-full">
                                                <CardContent className="p-6 flex flex-col h-full">
                                                    <div className="text-center pb-4 mb-4 border-b border-gray-200">
                                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Monthly EMI</p>
                                                        <p className="text-4xl font-bold text-blue-600">
                                                            {'\u20B9'}{emiResult.emi.toLocaleString('en-IN')}
                                                        </p>
                                                        <p className="text-xs text-gray-700 mt-1">per month for {emiTenure} months</p>
                                                    </div>
                                                    <div className="space-y-3 flex-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-700">Loan Amount</span>
                                                            <span className="font-semibold text-gray-900">{'\u20B9'}{emiResult.loan.toLocaleString('en-IN')}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-700">Total Interest</span>
                                                            <span className="font-semibold text-gray-900">{'\u20B9'}{emiResult.interest.toLocaleString('en-IN')}</span>
                                                        </div>
                                                        <Separator />
                                                        <div className="flex justify-between text-sm">
                                                            <span className="font-semibold text-gray-900">Total Payable</span>
                                                            <span className="font-bold text-gray-900">{'\u20B9'}{emiResult.total.toLocaleString('en-IN')}</span>
                                                        </div>
                                                    </div>
                                                    {/* Principal vs Interest bar */}
                                                    <div className="mt-4">
                                                        <div className="flex justify-between text-[11px] mb-1">
                                                            <span className="text-gray-700">
                                                                Principal {Math.round((emiResult.loan / emiResult.total) * 100)}%
                                                            </span>
                                                            <span className="text-gray-700">
                                                                Interest {Math.round((emiResult.interest / emiResult.total) * 100)}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-blue-600 rounded-full transition-all"
                                                                style={{ width: `${(emiResult.loan / emiResult.total) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] text-gray-700 mt-3">
                                                        * Indicative EMI. Actual values may vary based on lender terms.
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            <Card className="bg-gray-50 border border-gray-200 flex h-full items-center justify-center">
                                                <CardContent className="text-center p-6">
                                                    <Calculator className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                                    <p className="text-sm text-gray-700">Adjust sliders to calculate EMI</p>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* ──────── SIMILAR BIKES ──────── */}
                    <section ref={el => { sectionRefs.current['similar'] = el; }} id="similar">
                        {similarBikes.length > 0 && (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Similar {bike.make} Bikes
                                    </h2>
                                    <Link
                                        href={`/bikes?make=${encodeURIComponent(bike.make)}`}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        View All
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {similarBikes.map((simBike) => {
                                        const simBrandId = brandNameToId(simBike.make, '2w');
                                        const simImageUrls = getVehicleImageUrls(
                                            '2w',
                                            simBrandId,
                                            simBike.model,
                                            simBike.image_url
                                        );
                                        if (simImageUrls.length === 0) return null;
                                        return (
                                            <Link
                                                key={simBike.id}
                                                href={`/bikes/${simBike.id}`}
                                                data-vehicle-card="true"
                                                data-model-image-source={modelImageSourceKind(simImageUrls[0])}
                                                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                            >
                                                <div className="relative aspect-[16/10] bg-gray-50">
                                                    <Image
                                                        src={simImageUrls[0]}
                                                        alt={`${simBike.make} ${simBike.model}`}
                                                        fill
                                                        unoptimized
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-600">
                                                        {simBike.make}
                                                    </p>
                                                    <h3 className="mt-1 line-clamp-2 text-base font-bold text-gray-900">
                                                        {simBike.model}
                                                    </h3>
                                                    {simBike.variant && (
                                                        <p className="text-xs text-gray-700 mt-0.5">{simBike.variant}</p>
                                                    )}
                                                    <p className="mt-2 text-sm font-semibold text-gray-900">
                                                        {formatPricePaise(simBike.price_min_paise)}
                                                    </p>
                                                    <div className="mt-3 inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-opacity group-hover:opacity-90">
                                                        View Details
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </section>

                    {/* ── Bottom CTA ── */}
                    <section className="text-center">
                        <Card className="bg-gray-50 border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Interested in {bike.make} {bike.model}?
                            </h2>
                            <p className="text-gray-700 mb-6">
                                Find an authorized dealer near you for the best price and offers.
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-8 py-3 font-bold text-base hover:bg-blue-700 transition-colors"
                            >
                                Find a Dealer <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </Card>
                    </section>
                </div>
            </div>

            <OnRoadPriceDialog
                open={onRoadOpen}
                onOpenChange={setOnRoadOpen}
                brand={bike.make}
                model={bike.model}
                defaultVariantLabel={displayVariant}
                exShowroomPaise={bike.price_min_paise ?? 0}
                fuelType={bike.fuel_type === 'electric' ? 'electric' : 'petrol'}
                engineCc={bike.engine_cc}
                variants={onRoadVariants.map((variant) => ({
                    name: variant.name,
                    price: variant.price_paise > 0 ? String(variant.price_paise / 100) : '',
                }))}
                brandColor="#A8793A"
                enquiryLabel="Find a Dealer"
                onEnquire={openDealerDiscovery}
            />
            <SiteFooter />
        </>
    );
}

// ── Helper Components ────────────────────────────────────────────

function SpecRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
    if (!value || value === '--' || value === 'N/A') return null;
    return (
        <div className={`flex justify-between py-2.5 ${!last ? 'border-b border-gray-100' : ''}`}>
            <span className="text-sm text-gray-700">{label}</span>
            <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
    );
}

function EmiSlider({
    label, value, min, max, step, onChange, format, unit,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
    format: (v: number) => string;
    unit?: string;
}) {
    // Clamp typed values into the valid slider range so the two controls stay in sync.
    const clamp = (v: number) => Math.min(max, Math.max(min, v));

    return (
        <div>
            <div className="flex justify-between items-center mb-2 gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">{label}</label>
                <div className="flex items-center gap-1">
                    <input
                        type="number"
                        value={value}
                        min={min}
                        max={max}
                        step={step}
                        aria-label={label}
                        onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === '') return;
                            onChange(clamp(Number(raw)));
                        }}
                        onBlur={(e) => onChange(clamp(Number(e.target.value) || min))}
                        className="w-24 rounded-md border border-gray-200 px-2 py-1 text-right text-sm font-bold text-blue-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {unit && <span className="text-xs text-gray-700 whitespace-nowrap">{unit}</span>}
                </div>
            </div>
            <Slider
                value={[value]}
                min={min}
                max={max}
                step={step}
                onValueChange={([v]) => onChange(v)}
            />
            <p className="mt-1 text-[11px] text-gray-700">{format(value)}</p>
        </div>
    );
}

/**
 * Maps common colour names to hex values for swatch display.
 * Falls back to a neutral gray if the colour name is unknown.
 */
function colorNameToHex(name: string): string {
    return resolveVehicleColorHex(name);
}

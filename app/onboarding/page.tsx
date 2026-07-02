"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Bike,
    Building2,
    Car,
    Check,
    CheckCircle2,
    FileSpreadsheet,
    Globe2,
    KeyRound,
    LayoutTemplate,
    ListChecks,
    Palette,
    PlusCircle,
    Rocket,
    ShieldCheck,
    Store,
    Truck,
    UploadCloud,
    type LucideIcon,
    Layers,
} from "lucide-react";

import {
    BrowserFrame,
    FlowStepper,
    FlowTopBar,
} from "@/components/onboarding/flow-shell";
import { BrandLogoMark } from "@/components/brand-logo-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getOnboardingAccountPrefill, getOnboardingResetPrefill } from "@/lib/onboarding/prefill";
import { isSupabaseReady, supabase } from "@/lib/supabase";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { cn } from "@/lib/utils";
import type { Brand, OnboardingStockMode, OnboardingVehicleSegment, OnboardingWebsitePlan } from "@/lib/types";

type StockMode = OnboardingStockMode;
type StockChoice = StockMode | "hybrid";
type VehicleType = OnboardingVehicleSegment;
type Phase = "stock" | "segments" | "brands" | "websites";

type StockOption = {
    id: StockChoice;
    title: string;
    description: string;
    icon: LucideIcon;
    tone: string;
};

type SegmentOption = {
    id: VehicleType;
    title: string;
    shortLabel: string;
    description: string;
    icon: LucideIcon;
    tone: string;
};

const HYBRID_BASE_WEBSITE_COUNT = 6;

const stockOptions: StockOption[] = [
    {
        id: "new",
        title: "New Vehicles",
        description: "Authorised OEM websites for brand-new stock.",
        icon: Building2,
        tone: "blue",
    },
    {
        id: "used",
        title: "Used / Pre-Owned",
        description: "Second-hand dealer websites with uploaded or synced inventory.",
        icon: Store,
        tone: "amber",
    },
    {
        id: "hybrid",
        title: "Hybrid Dealer",
        description: "New OEM websites plus matching pre-owned websites.",
        icon: Layers,
        tone: "violet",
    },
];

const segmentOptions: SegmentOption[] = [
    {
        id: "4w",
        title: "Cars / 4W",
        shortLabel: "Cars",
        description: "Hatchbacks, sedans, SUVs, EVs, and premium cars.",
        icon: Car,
        tone: "blue",
    },
    {
        id: "2w",
        title: "Two-Wheelers",
        shortLabel: "Bikes",
        description: "Bikes, scooters, EV scooters, and performance models.",
        icon: Bike,
        tone: "orange",
    },
    {
        id: "3w",
        title: "Three-Wheelers",
        shortLabel: "Autos",
        description: "Passenger autos, cargo vehicles, loaders, and e-rickshaws.",
        icon: Truck,
        tone: "green",
    },
];

const phaseSteps = [
    { label: "Business Mode" },
    { label: "Vehicle Types" },
    { label: "Brand Mapping" },
    { label: "My Websites" },
];

const toneClasses: Record<string, string> = {
    blue:   "border-[#CFE0FF] bg-[#EEF4FF] text-[#155EEF]",
    amber:  "border-[#F6D8A8] bg-[#FFF7EA] text-[#A85B00]",
    orange: "border-orange-200 bg-orange-50 text-orange-700",
    green:  "border-emerald-200 bg-emerald-50 text-emerald-700",
    violet: "border-violet-200 bg-violet-50 text-violet-700",
    slate:  "border-slate-200 bg-slate-50 text-slate-700",
};

const carBrands: Brand[] = [
    "Maruti Suzuki",
    "Hyundai",
    "Tata Motors",
    "Mahindra",
    "Toyota",
    "Honda",
    "Kia",
    "MG",
    "Mercedes-Benz",
    "BMW",
    "Audi",
    "BYD",
];

const twoWheelerBrands = [
    "Hero MotoCorp",
    "Honda",
    "TVS",
    "Bajaj",
    "Royal Enfield",
    "Yamaha",
    "Suzuki",
    "Ather Energy",
    "Ola Electric",
    "Revolt Motors",
    "Ampere",
    "River",
];

const threeWheelerBrands = [
    "Bajaj",
    "Piaggio",
    "Mahindra",
    "TVS",
    "Atul Auto",
    "Euler Motors",
    "Altigreen",
    "Omega Seiki",
    "Kinetic Green",
    "YC Electric",
    "Terra Motors",
    "Montra Electric",
];

const setupFlow = [
    { label: "Dealer profile", icon: Building2 },
    { label: "Website identity", icon: Palette },
    { label: "Inventory source", icon: UploadCloud },
    { label: "Services", icon: ListChecks },
    { label: "Template", icon: LayoutTemplate },
    { label: "Content", icon: Globe2 },
    { label: "Review", icon: CheckCircle2 },
    { label: "Publish", icon: Rocket },
];

const routeBySegment: Record<VehicleType, string> = {
    "4w": "/onboarding/step-1",
    "2w": "/onboarding/two-wheelers/step-1",
    "3w": "/onboarding/three-wheelers/step-1",
};

const vehicleTypeBySegment: Record<VehicleType, "car" | "two-wheeler" | "three-wheeler"> = {
    "4w": "car",
    "2w": "two-wheeler",
    "3w": "three-wheeler",
};

const segmentLabel: Record<VehicleType, string> = {
    "4w": "Cars",
    "2w": "Two-Wheelers",
    "3w": "Three-Wheelers",
};

function phaseNumber(phase: Phase) {
    return phase === "stock" ? 1 : phase === "segments" ? 2 : phase === "brands" ? 3 : 4;
}

function orderedModes(modes: StockMode[]) {
    return (["new", "used"] as StockMode[]).filter((mode) => modes.includes(mode));
}

function orderedSegments(segments: VehicleType[]) {
    return segmentOptions.map((option) => option.id).filter((segment) => segments.includes(segment));
}

function brandOptionsForSegment(segment: VehicleType) {
    if (segment === "4w") return carBrands;
    if (segment === "2w") return twoWheelerBrands;
    return threeWheelerBrands;
}

function modeLabel(mode: StockMode) {
    return mode === "new" ? "New" : "Pre-Owned";
}

function toWebsiteTitle(mode: StockMode, segment: VehicleType) {
    const segmentName = segmentLabel[segment];
    return `${modeLabel(mode)} ${segmentName}`;
}

function buildWebsitePlans(
    modes: StockMode[],
    segments: VehicleType[],
    brandsBySegment: Partial<Record<VehicleType, string[]>>,
): OnboardingWebsitePlan[] {
    return orderedSegments(segments).flatMap((segment) =>
        orderedModes(modes).flatMap((stock): OnboardingWebsitePlan[] => {
            if (stock === "used") {
                return [{
                    id: `${stock}-${segment}`,
                    stock,
                    segment,
                    title: toWebsiteTitle(stock, segment),
                    caption: `Second-hand ${segmentLabel[segment].toLowerCase()} website with dealer inventory.`,
                    route: routeBySegment[segment],
                }];
            }

            const selectedBrands = brandsBySegment[segment]?.length ? brandsBySegment[segment] : [undefined];
            return selectedBrands.map((brand) => {
                const plan: OnboardingWebsitePlan = {
                    id: brand ? `${stock}-${segment}-${slugify(brand)}` : `${stock}-${segment}`,
                    stock,
                    segment,
                    title: brand ? `${brand} ${segmentLabel[segment]}` : toWebsiteTitle(stock, segment),
                    caption: `${brand || "Authorised brand"} ${segmentLabel[segment].toLowerCase()} website with OEM model pages.`,
                    route: routeBySegment[segment],
                };
                if (brand) {
                    plan.brand = brand;
                }
                return plan;
            });
        })
    );
}

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function OnboardingIndexPage() {
    const router = useRouter();
    const pathname = usePathname();
    const {
        data,
        reset,
        setVehicleType,
        updateData,
        setSellsFourWheelers,
        setSellsThreeWheelers,
        setSellsTwoWheelers,
        setPendingWebsitePlans,
        setActiveWebsitePlanId,
    } = useOnboardingStore();

    const [phase, setPhase] = useState<Phase>("stock");
    const [selectedModes, setSelectedModes] = useState<StockMode[]>([]);
    const [selectedSegments, setSelectedSegments] = useState<VehicleType[]>([]);
    const [brandBySegment, setBrandBySegment] = useState<Partial<Record<VehicleType, string[]>>>({});
    const [isAdditionalLaunch, setIsAdditionalLaunch] = useState(data.launchMode === "additional");

    useEffect(() => {
        const requestedAdditionalLaunch = new URLSearchParams(window.location.search).get("mode") === "add-site";
        if (requestedAdditionalLaunch) {
            setIsAdditionalLaunch(true);
        }
        if (requestedAdditionalLaunch && data.launchMode !== "additional") {
            reset({ launchMode: "additional" });
        }
    }, [data.launchMode, reset]);

    useEffect(() => {
        if (!isSupabaseReady()) return;

        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) return;
            const requestedAdditionalLaunch = new URLSearchParams(window.location.search).get("mode") === "add-site";
            const additionalLaunch = requestedAdditionalLaunch || useOnboardingStore.getState().data.launchMode === "additional";

            supabase
                .from("dealers")
                .select("onboarding_complete, dealership_name, tagline, location, full_address, map_link, google_maps_url, years_in_business, phone, whatsapp, email, gstin, slug")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle()
                .then(({ data: dealer }) => {
                    if (dealer?.onboarding_complete && !additionalLaunch) {
                        router.replace("/dashboard");
                        return;
                    }

                    const prefill = getOnboardingAccountPrefill(data, {
                        userEmail: user.email,
                        metadata: user.user_metadata,
                        dealer,
                    });

                    if (Object.keys(prefill).length > 0) {
                        updateData(prefill);
                    }
                });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, updateData]);

    const isHybrid = selectedModes.length === 2;
    const includesNew = selectedModes.includes("new");
    const websitePlans = useMemo(
        () => buildWebsitePlans(selectedModes, selectedSegments, brandBySegment),
        [brandBySegment, selectedModes, selectedSegments]
    );
    const totalWebsites = websitePlans.length;
    const missingBrands = includesNew
        ? orderedSegments(selectedSegments).filter((segment) => !brandBySegment[segment]?.length)
        : [];
    const canContinueStock = selectedModes.length > 0;
    const canContinueSegments = selectedSegments.length > 0;
    const canContinueBrands = missingBrands.length === 0;
    const isDemoRoute = pathname === "/dealer-flow-demo";

    const isStockChoiceSelected = (choice: StockChoice) => {
        if (choice === "hybrid") return isHybrid;
        return selectedModes.includes(choice);
    };

    const toggleMode = (choice: StockChoice) => {
        if (choice === "hybrid") {
            setSelectedModes((current) => current.length === 2 ? [] : ["new", "used"]);
            return;
        }

        setSelectedModes((current) => {
            const next = current.includes(choice)
                ? current.filter((item) => item !== choice)
                : [...current, choice];
            return orderedModes(next);
        });
    };

    const toggleSegment = (segment: VehicleType) => {
        setSelectedSegments((current) => {
            if (current.includes(segment)) {
                const next = current.filter((item) => item !== segment);
                setBrandBySegment((brands) => {
                    const rest = { ...brands };
                    delete rest[segment];
                    return rest;
                });
                return next;
            }
            return [...current, segment];
        });
    };

    const toggleBrand = (segment: VehicleType, brand: string) => {
        setBrandBySegment((current) => {
            const selectedBrands = current[segment] ?? [];
            const nextBrands = selectedBrands.includes(brand)
                ? selectedBrands.filter((item) => item !== brand)
                : [...selectedBrands, brand];
            const next = { ...current };
            if (nextBrands.length) {
                next[segment] = nextBrands;
            } else {
                delete next[segment];
            }
            return next;
        });
    };

    const handleBack = () => {
        if (phase === "stock") {
            router.push(isDemoRoute ? "/" : "/dashboard");
            return;
        }
        if (phase === "segments") setPhase("stock");
        if (phase === "brands") setPhase("segments");
        if (phase === "websites") setPhase(includesNew ? "brands" : "segments");
    };

    const sendQueueToDashboard = () => {
        setPendingWebsitePlans(websitePlans);
        setActiveWebsitePlanId(null);
        router.push("/dashboard/webpage");
    };

    const handlePrimaryContinue = () => {
        if (phase === "stock" && canContinueStock) {
            setPhase("segments");
            return;
        }
        if (phase === "segments" && canContinueSegments) {
            if (includesNew) {
                setPhase("brands");
                return;
            }
            if (isDemoRoute) {
                setPhase("websites");
                return;
            }
            sendQueueToDashboard();
            return;
        }
        if (phase === "brands" && canContinueBrands) {
            if (isDemoRoute) {
                setPhase("websites");
                return;
            }
            sendQueueToDashboard();
        }
    };

    const handleStartWebsite = (plan: OnboardingWebsitePlan) => {
        const vehicleType = vehicleTypeBySegment[plan.segment];
        const has4w = plan.segment === "4w";
        const has2w = plan.segment === "2w";
        const has3w = plan.segment === "3w";
        const pickedBrand = plan.brand;

        reset({
            ...getOnboardingResetPrefill(data),
            launchMode: isAdditionalLaunch ? "additional" : "initial",
            dealershipName: data.dealershipName,
            phone: data.phone,
            whatsapp: data.whatsapp,
            email: data.email,
            location: data.location,
            fullAddress: data.fullAddress,
            mapLink: data.mapLink,
            gstin: data.gstin,
            slug: data.slug ? `${data.slug}-${slugify(plan.title)}`.slice(0, 63) : undefined,
        });
        setVehicleType(vehicleType);
        setSellsFourWheelers(has4w);
        setSellsTwoWheelers(has2w);
        setSellsThreeWheelers(has3w);
        setActiveWebsitePlanId(plan.id);
        updateData({
            dealerCategory: plan.stock,
            sellsNewCars: plan.stock === "new",
            sellsUsedCars: plan.stock === "used",
            sellsFourWheelers: has4w,
            sellsTwoWheelers: has2w,
            sellsThreeWheelers: has3w,
            launchMode: isAdditionalLaunch ? "additional" : "initial",
            brands: has4w && pickedBrand ? [pickedBrand as Brand] : [],
            brands2w: has2w && pickedBrand ? [pickedBrand] : [],
            brands3w: has3w && pickedBrand ? [pickedBrand] : [],
        });
        router.push(plan.route);
    };

    const continueLabel =
        phase === "stock" ? "Choose Vehicle Types" :
        phase === "segments" ? (includesNew ? "Map Brands" : "Show My Websites") :
        phase === "brands" ? "Show My Websites" :
        "Ready";

    return (
        <div className="dsp-app-skin dsp-onboarding-skin dsp-onboarding-canvas min-h-screen lg:h-dvh lg:overflow-hidden">
            <BrowserFrame className="min-h-screen w-full max-w-none rounded-none border-0 bg-transparent shadow-none lg:h-full lg:min-h-0" contentClassName="flex min-h-screen flex-col lg:h-full lg:min-h-0">
                <FlowTopBar
                    showBack
                    onBack={handleBack}
                    onExit={() => router.push("/dashboard")}
                />

                <main className="mx-auto flex w-full max-w-[1780px] flex-1 flex-col px-5 py-5 sm:px-8 lg:min-h-0 lg:overflow-hidden lg:px-8 lg:py-5 xl:px-10">
                    <FlowStepper steps={phaseSteps} currentStep={phaseNumber(phase)} />

                    <div className="mt-5 grid flex-1 gap-6 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_430px] xl:grid-cols-[minmax(0,1fr)_500px]">
                        <ScrollArea className="min-h-0 pr-1">
                        <section className="flex min-h-0 flex-col gap-5 pb-6">
                            {phase === "stock" && (
                                <div className="flex flex-col gap-5">
                                    <div>
                                        <Badge variant="outline" className="border-[#C7C1B6] bg-[#FFFDF7] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#A8793A]">
                                            Step 1 · Business mode
                                        </Badge>
                                        <h1 className="mt-2 text-[34px] font-black leading-tight tracking-[-0.04em] text-[#071436] xl:text-[42px]">
                                            What kind of dealer website are we creating?
                                        </h1>
                                        <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#62708A]">
                                            Select New, Used, or Hybrid. Hybrid automatically prepares separate new and pre-owned website setups.
                                        </p>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-3">
                                        {stockOptions.map((option) => {
                                            const selected = isStockChoiceSelected(option.id);
                                            return (
                                                <button
                                                    key={option.id}
                                                    type="button"
                                                    aria-pressed={selected}
                                                    onClick={() => toggleMode(option.id)}
                                                    className={cn(
                                                        "relative min-h-[220px] rounded-lg border bg-[#FFFDF7] p-5 text-left shadow-[0_14px_40px_rgba(11,14,18,0.06)] transition hover:-translate-y-0.5 hover:border-[#A8793A] hover:shadow-[0_20px_55px_rgba(11,14,18,0.10)] focus:outline-none focus:ring-2 focus:ring-[#A8793A]/30",
                                                        selected ? "border-[#A8793A] bg-[#FBF8F1] ring-1 ring-[#A8793A]/30" : "border-[#E7E0D7]"
                                                    )}
                                                >
                                                    <span className={cn("flex h-12 w-12 items-center justify-center rounded-full border", toneClasses[option.tone])}>
                                                        <option.icon className="h-6 w-6" />
                                                    </span>
                                                    <h2 className="mt-5 text-xl font-black tracking-[-0.02em] text-[#071436]">{option.title}</h2>
                                                    <p className="mt-2 text-sm font-semibold leading-6 text-[#62708A]">{option.description}</p>
                                                    {option.id === "hybrid" && (
                                                        <Badge variant="secondary" className="mt-3 rounded-md bg-[#F5E8D4] px-3 py-1.5 text-xs font-black text-[#7A5528]">
                                                            Starts with {HYBRID_BASE_WEBSITE_COUNT}: New + Used across 2W, 3W, and 4W.
                                                        </Badge>
                                                    )}
                                                    <span className={cn(
                                                        "absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border",
                                                        selected ? "border-[#0B0E12] bg-[#0B0E12] text-white" : "border-[#C7C1B6] bg-[#FFFDF7] text-transparent"
                                                    )}>
                                                        <Check className="h-4 w-4" />
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {isHybrid && (
                                        <div className="rounded-lg border border-[#C7C1B6] bg-[#FBF8F1] px-4 py-3 text-sm font-black text-[#7A5528]">
                                            Hybrid selected. Pick vehicle categories next; extra OEMs will add more new-brand websites.
                                        </div>
                                    )}
                                </div>
                            )}

                            {phase === "segments" && (
                                <div className="flex flex-col gap-5">
                                    <div>
                                        <Badge variant="outline" className="border-[#C7C1B6] bg-[#FFFDF7] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#A8793A]">
                                            Step 2 · Multi-select categories
                                        </Badge>
                                        <h1 className="mt-2 text-[34px] font-black leading-tight tracking-[-0.04em] text-[#071436] xl:text-[42px]">
                                            Select every vehicle category this dealer sells.
                                        </h1>
                                        <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#62708A]">
                                            You can choose 2W, 3W, 4W, or all of them. The website count updates instantly.
                                        </p>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-3">
                                        {segmentOptions.map((option) => {
                                            const selected = selectedSegments.includes(option.id);
                                            return (
                                                <button
                                                    key={option.id}
                                                    type="button"
                                                    aria-pressed={selected}
                                                    onClick={() => toggleSegment(option.id)}
                                                    className={cn(
                                                        "relative min-h-[210px] rounded-lg border bg-[#FFFDF7] p-5 text-left shadow-[0_14px_40px_rgba(11,14,18,0.06)] transition hover:-translate-y-0.5 hover:border-[#A8793A] hover:shadow-[0_20px_55px_rgba(11,14,18,0.10)] focus:outline-none focus:ring-2 focus:ring-[#A8793A]/30",
                                                        selected ? "border-[#A8793A] bg-[#FBF8F1] ring-1 ring-[#A8793A]/30" : "border-[#E7E0D7]"
                                                    )}
                                                >
                                                    <span className={cn("flex h-12 w-12 items-center justify-center rounded-full border", toneClasses[option.tone])}>
                                                        <option.icon className="h-6 w-6" />
                                                    </span>
                                                    <h2 className="mt-5 text-lg font-black tracking-[-0.02em] text-[#071436]">{option.title}</h2>
                                                    <p className="mt-2 text-sm font-semibold leading-6 text-[#62708A]">{option.description}</p>
                                                    <span className={cn(
                                                        "absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border",
                                                        selected ? "border-[#0B0E12] bg-[#0B0E12] text-white" : "border-[#C7C1B6] bg-[#FFFDF7] text-transparent"
                                                    )}>
                                                        <Check className="h-4 w-4" />
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {totalWebsites > 0 && (
                                        <Card className="border-[#E7E0D7] bg-[#FFFDF7] p-0 shadow-[0_14px_40px_rgba(11,14,18,0.06)]">
                                            <CardContent className="p-4">
                                            <p className="text-sm font-black text-[#071436]">
                                                {totalWebsites} website{totalWebsites === 1 ? "" : "s"} will be prepared.
                                            </p>
                                            <p className="mt-1 text-xs font-semibold text-[#62708A]">
                                                New sites follow selected OEMs. Used sites stay one inventory website per category.
                                            </p>
                                            {isHybrid && selectedSegments.length === 3 && (
                                                <p className="mt-3 rounded-md bg-[#071436] px-3 py-2 text-sm font-black text-white">
                                                    {totalWebsites} websites queued across all three categories.
                                                </p>
                                            )}
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            )}

                            {phase === "brands" && (
                                <div className="flex flex-col gap-5">
                                    <div>
                                        <Badge variant="outline" className="border-[#C7C1B6] bg-[#FFFDF7] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#A8793A]">
                                            Step 3 · Select OEM
                                        </Badge>
                                        <h1 className="mt-2 text-[34px] font-black leading-tight tracking-[-0.04em] text-[#071436] xl:text-[42px]">
                                            Select every OEM brand this dealer is authorised to sell.
                                        </h1>
                                        <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#62708A]">
                                            Pick multiple brands under 2W, 3W, or 4W. Each selected OEM gets its own new-vehicle website.
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-5">
                                        {orderedSegments(selectedSegments).map((segment) => {
                                            const option = segmentOptions.find((item) => item.id === segment);
                                            const selectedBrands = brandBySegment[segment] ?? [];
                                            const brands = brandOptionsForSegment(segment);
                                            return (
                                                <Card key={segment} className="border-[#E7E0D7] bg-[#FFFDF7] p-0 shadow-[0_16px_45px_rgba(11,14,18,0.07)]">
                                                    <CardHeader className="mb-0 flex-row items-start justify-between gap-4 p-5 pb-4">
                                                        <div className="flex items-start gap-3">
                                                            <span className={cn("flex h-10 w-10 items-center justify-center rounded-full border", toneClasses[option?.tone ?? "slate"])}>
                                                                {option && <option.icon className="h-5 w-5" />}
                                                            </span>
                                                            <div>
                                                                <CardTitle className="text-lg font-black text-[#071436]">{segmentLabel[segment]} OEM</CardTitle>
                                                                <CardDescription className="mt-1 text-sm font-semibold text-[#62708A]">
                                                                    Choose one or more authorised brands for this category.
                                                                </CardDescription>
                                                            </div>
                                                        </div>
                                                        {selectedBrands.length > 0 && (
                                                            <Badge variant="success" className="max-w-[210px] gap-2 rounded-full px-2.5 py-1 text-xs font-black">
                                                                <BrandLogoMark
                                                                    brand={selectedBrands[0]}
                                                                    segment={segment}
                                                                    className="h-6 w-6 rounded-full border-emerald-200"
                                                                    imageClassName="h-4 w-4"
                                                                />
                                                                <span className="truncate">
                                                                    {selectedBrands.length === 1 ? selectedBrands[0] : `${selectedBrands.length} selected`}
                                                                </span>
                                                            </Badge>
                                                        )}
                                                    </CardHeader>

                                                    <CardContent className="grid grid-cols-2 gap-3 px-5 pb-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                                                        {brands.map((brand) => {
                                                            const selected = selectedBrands.includes(brand);
                                                            return (
                                                                <button
                                                                    key={brand}
                                                                    type="button"
                                                                    onClick={() => toggleBrand(segment, brand)}
                                                                    aria-pressed={selected}
                                                                    className={cn(
                                                                        "relative flex min-h-[118px] flex-col items-center justify-center rounded-lg border px-3 py-4 text-center transition hover:-translate-y-0.5 hover:border-[#A8793A] hover:bg-[#FBF8F1] hover:shadow-[0_16px_34px_rgba(11,14,18,0.08)] focus:outline-none focus:ring-2 focus:ring-[#A8793A]/30",
                                                                        selected ? "border-[#A8793A] bg-[#FBF8F1] text-[#071436] ring-1 ring-[#A8793A]/30" : "border-[#E7E0D7] bg-white/70 text-[#35445C]"
                                                                    )}
                                                                >
                                                                    <span className={cn(
                                                                        "absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full border",
                                                                        selected ? "border-[#0B0E12] bg-[#0B0E12] text-white" : "border-[#C7C1B6] bg-[#FFFDF7] text-transparent"
                                                                    )}>
                                                                        <Check className="h-3 w-3" />
                                                                    </span>
                                                                    <BrandLogoMark
                                                                        brand={brand}
                                                                        segment={segment}
                                                                        className={cn(
                                                                            "h-14 w-14 rounded-md shadow-none",
                                                                            selected ? "border-[#A8793A] shadow-[0_10px_24px_rgba(168,121,58,0.16)]" : ""
                                                                        )}
                                                                        imageClassName="h-10 w-10"
                                                                    />
                                                                    <span className="mt-3 flex min-h-[32px] w-full items-center justify-center text-[12px] font-black leading-4 tracking-[-0.01em] text-[#071436]">
                                                                        <span className="max-w-full break-words">{brand}</span>
                                                                    </span>
                                                                </button>
                                                            );
                                                        })}
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {phase === "websites" && (
                                <div className="flex flex-col gap-5">
                                    <div>
                                        <Badge variant="outline" className="border-[#C7C1B6] bg-[#FFFDF7] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#A8793A]">
                                            Step 4 · My Websites preview
                                        </Badge>
                                        <h1 className="mt-2 text-[34px] font-black leading-tight tracking-[-0.04em] text-[#071436] xl:text-[42px]">
                                            Your website queue is ready.
                                        </h1>
                                        <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#62708A]">
                                            Each card starts the full website setup: profile, identity, inventory, services, template, content, review, and publish.
                                        </p>
                                    </div>

                                    <div className="grid gap-4 xl:grid-cols-2">
                                        {websitePlans.map((plan, index) => {
                                            const segment = segmentOptions.find((item) => item.id === plan.segment);
                                            return (
                                                <Card key={plan.id} className="overflow-hidden border-[#E7E0D7] bg-[#FFFDF7] p-0 shadow-[0_16px_45px_rgba(11,14,18,0.07)]">
                                                    <CardHeader className="mb-0 flex-row items-start justify-between gap-4 bg-[#FBF8F1] p-5">
                                                        <div className="flex items-start gap-3">
                                                            <span className={cn("flex h-11 w-11 items-center justify-center rounded-full border", toneClasses[segment?.tone ?? "slate"])}>
                                                                {segment && <segment.icon className="h-5 w-5" />}
                                                            </span>
                                                            <div>
                                                                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#155EEF]">
                                                                    Website {index + 1}
                                                                </p>
                                                                <CardTitle className="mt-1 text-xl font-black tracking-[-0.02em] text-[#071436]">{plan.title}</CardTitle>
                                                                <CardDescription className="mt-1 text-sm font-semibold leading-6 text-[#62708A]">{plan.caption}</CardDescription>
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            variant={plan.stock === "new" ? "outline" : "warning"}
                                                            className={cn(
                                                                "rounded-full px-3 py-1 text-xs font-black",
                                                                plan.stock === "new" && "border-[#C7C1B6] bg-[#FFFDF7] text-[#A8793A]"
                                                            )}
                                                        >
                                                            {modeLabel(plan.stock)}
                                                        </Badge>
                                                    </CardHeader>

                                                    <CardContent className="p-5">
                                                    <div className="grid grid-cols-2 gap-2 text-xs font-black text-[#35445C]">
                                                        <div className="rounded-md border border-[#E3E9F2] bg-[#F7F9FC] px-3 py-2">
                                                            Segment: {segmentLabel[plan.segment]}
                                                        </div>
                                                        <div className="rounded-md border border-[#E3E9F2] bg-[#F7F9FC] px-3 py-2">
                                                            {plan.brand ? (
                                                                <span className="flex items-center gap-2">
                                                                    <BrandLogoMark
                                                                        brand={plan.brand}
                                                                        segment={plan.segment}
                                                                        className="h-7 w-7 rounded-md"
                                                                        imageClassName="h-5 w-5"
                                                                    />
                                                                    Brand: {plan.brand}
                                                                </span>
                                                            ) : (
                                                            "Brand: Inventory based"
                                                        )}
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                                        {setupFlow.map((step) => (
                                                            <div key={step.label} className="flex items-center gap-2 rounded-md border border-[#E3E9F2] bg-white px-3 py-2 text-xs font-bold text-[#35445C]">
                                                                <step.icon className="h-4 w-4 text-[#155EEF]" />
                                                                {step.label}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    </CardContent>

                                                    <CardFooter className="mt-0 border-t border-[#E7E0D7] bg-[#FFFDF7] p-5 pt-5">
                                                    <Button
                                                        type="button"
                                                        onClick={() => handleStartWebsite(plan)}
                                                        className="h-11 w-full rounded-md bg-[#0B0E12] font-black text-[#FFFDF7] hover:bg-[#171717]"
                                                    >
                                                        Start This Website
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                    </CardFooter>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </section>
                        </ScrollArea>

                        <ScrollArea className="min-h-0">
                        <aside className="flex min-h-0 flex-col gap-4 pb-6">
                            <Card className="border-[#E7E0D7] bg-[#FFFDF7]/95 p-0 shadow-[0_18px_55px_rgba(11,14,18,0.08)]">
                                <CardHeader className="mb-0 p-5 pb-3">
                                    <Badge variant="outline" className="w-fit border-[#C7C1B6] bg-[#FBF8F1] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#A8793A]">
                                        Live plan
                                    </Badge>
                                <CardTitle className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#071436]">
                                    {totalWebsites || 0} website{totalWebsites === 1 ? "" : "s"}
                                </CardTitle>
                                <CardDescription className="mt-1 text-sm font-semibold text-[#62708A]">
                                    {selectedModes.length === 0
                                        ? "Select New, Used, or Hybrid to begin."
                                        : isHybrid
                                            ? "Hybrid mode: new and pre-owned websites are separated."
                                            : `${modeLabel(selectedModes[0])} mode selected.`}
                                </CardDescription>
                                </CardHeader>
                                <CardContent className="p-5 pt-0">
                                <Separator className="mb-4 bg-[#E7E0D7]" />

                                <div className="flex flex-col gap-3">
                                    <SummaryRow
                                        icon={ShieldCheck}
                                        label="Stock mode"
                                        value={selectedModes.length ? orderedModes(selectedModes).map(modeLabel).join(" + ") : "Not selected"}
                                    />
                                    <SummaryRow
                                        icon={Car}
                                        label="Vehicle categories"
                                        value={selectedSegments.length ? orderedSegments(selectedSegments).map((segment) => segmentOptions.find((item) => item.id === segment)?.shortLabel).join(", ") : "Not selected"}
                                    />
                                    <SummaryRow
                                        icon={KeyRound}
                                        label="Inventory options"
                                        value="Manual, CSV, Cyepro Sync, or add later"
                                    />
                                    <SummaryRow
                                        icon={FileSpreadsheet}
                                        label="Per-site flow"
                                        value="Profile to publish for each website"
                                    />
                                    <SummaryRow
                                        icon={Layers}
                                        label="Hybrid output"
                                        value={`Starts with ${HYBRID_BASE_WEBSITE_COUNT}; extra OEMs add new websites`}
                                    />
                                </div>
                                </CardContent>
                            </Card>

                            {phase !== "websites" ? (
                                <StaticDealerPreview />
                            ) : (
                                <Card className="border-[#242424] bg-[#0B0E12] p-0 text-[#FFFDF7] shadow-[0_22px_65px_rgba(11,14,18,0.22)]">
                                    <CardHeader className="mb-0 p-5 pb-3">
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#C79A5B]">Next screen after selection</p>
                                    <CardTitle className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#FFFDF7]">Dashboard: My Websites</CardTitle>
                                    <CardDescription className="mt-2 text-sm font-semibold leading-6 text-[#FFFDF7]/75">
                                        This preview shows exactly what the dealer should see before starting each individual website setup.
                                    </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-2 p-5 pt-0">
                                        {websitePlans.slice(0, 6).map((plan) => (
                                            <div key={plan.id} className="flex items-center justify-between gap-3 rounded-md bg-white/10 px-3 py-2 text-sm font-bold">
                                                <span className="flex min-w-0 items-center gap-2">
                                                    {plan.brand ? (
                                                        <BrandLogoMark
                                                            brand={plan.brand}
                                                            segment={plan.segment}
                                                            className="h-7 w-7 rounded-md"
                                                            imageClassName="h-5 w-5"
                                                        />
                                                    ) : (
                                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/10 text-white">
                                                            {plan.segment === "2w" ? <Bike className="h-4 w-4" /> : plan.segment === "3w" ? <Truck className="h-4 w-4" /> : <Car className="h-4 w-4" />}
                                                        </span>
                                                    )}
                                                    <span className="truncate">{plan.title}</span>
                                                </span>
                                                <span className="shrink-0 text-white/60">{plan.brand || "Used stock"}</span>
                                            </div>
                                        ))}
                                        {websitePlans.length > 6 && (
                                            <div className="rounded-md bg-white/10 px-3 py-2 text-sm font-black text-white/75">
                                                +{websitePlans.length - 6} more website{websitePlans.length - 6 === 1 ? "" : "s"} in the full queue
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {phase !== "websites" && (
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-11 rounded-md border-[#C7C1B6] bg-[#FFFDF7] px-4 font-black text-[#0B0E12] hover:border-[#A8793A] hover:bg-[#FBF8F1]"
                                        onClick={handleBack}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button
                                        type="button"
                                        className="h-11 flex-1 rounded-md bg-[#0B0E12] font-black text-[#FFFDF7] hover:bg-[#171717] disabled:opacity-50"
                                        onClick={handlePrimaryContinue}
                                        disabled={
                                            (phase === "stock" && !canContinueStock) ||
                                            (phase === "segments" && !canContinueSegments) ||
                                            (phase === "brands" && !canContinueBrands)
                                        }
                                    >
                                        {continueLabel}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            {phase === "websites" && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 w-full rounded-md border-[#C7C1B6] bg-[#FFFDF7] font-black text-[#0B0E12] hover:border-[#A8793A] hover:bg-[#FBF8F1]"
                                    onClick={() => setPhase(includesNew ? "brands" : "segments")}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Adjust Selection
                                </Button>
                            )}
                        </aside>
                        </ScrollArea>
                    </div>
                </main>
            </BrowserFrame>
        </div>
    );
}

function SummaryRow({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3 rounded-md border border-[#E7E0D7] bg-[#FBF8F1] px-3 py-2.5">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#A8793A]" />
            <div>
                <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#62708A]">{label}</p>
                <p className="mt-1 text-sm font-black text-[#071436]">{value}</p>
            </div>
        </div>
    );
}

function StaticDealerPreview() {
    return (
        <Card className="hidden overflow-hidden border-[#E7E0D7] bg-[#FFFDF7] p-0 shadow-[0_18px_55px_rgba(11,14,18,0.08)] lg:block">
            <div className="flex items-center justify-between border-b border-[#E7E0D7] px-5 py-3">
                <div>
                    <p className="text-sm font-black tracking-[-0.01em] text-[#071436]">Kumar Motors</p>
                    <p className="text-[11px] font-semibold text-[#62708A]">Your Journey, Our Priority</p>
                </div>
                <p className="text-xs font-black text-[#071436]">+91 98765 43210</p>
            </div>

            <div className="grid min-h-[230px] bg-[#0B0E12] sm:grid-cols-[1fr_1.2fr]">
                <div className="p-6 text-white">
                    <h3 className="text-[23px] font-black leading-[1.08] tracking-[-0.02em]">Reliable Vehicles. Trusted Service.</h3>
                    <p className="mt-3 text-[13px] font-medium leading-5 text-white/75">
                        Cars, bikes, and autos from trusted local dealers. Best prices, easy finance.
                    </p>
                    <span className="mt-5 inline-flex rounded-md bg-[#FFFDF7] px-4 py-2.5 text-xs font-black text-[#0B0E12]" aria-hidden="true">
                        View Inventory
                    </span>
                </div>
                <div className="flex items-center justify-center bg-gradient-to-br from-[#3B3024] to-[#FBF8F1]">
                    <div className="flex h-28 w-40 items-center justify-center rounded-lg border border-[#C7C1B6] bg-[#FFFDF7] shadow-[0_18px_45px_rgba(11,14,18,0.12)]">
                        <Car className="h-16 w-16 text-[#A8793A]" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2 p-3">
                {[
                    { icon: Car, label: "Cars" },
                    { icon: Bike, label: "Bikes" },
                    { icon: Truck, label: "Autos" },
                    { icon: Store, label: "Used" },
                ].map((item) => (
                    <div key={item.label} className="rounded-md border border-[#E7E0D7] bg-[#FBF8F1] p-2 text-center">
                        <item.icon className="mx-auto h-4 w-4 text-[#A8793A]" />
                        <p className="mt-1.5 text-[10px] font-black text-[#071436]">{item.label}</p>
                    </div>
                ))}
            </div>

            <div className="border-t border-[#E7E0D7] px-4 py-2.5">
                <p className="flex items-center gap-2 text-xs font-semibold text-[#A8793A]">
                    <Globe2 className="h-4 w-4" />
                    kumar-motors.dealersitepro.in
                </p>
            </div>
        </Card>
    );
}

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
import { Button } from "@/components/ui/button";
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

const MAX_WEBSITE_PLANS = 6;

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
        description: "New OEM website plus matching pre-owned website for one category.",
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
    brandsBySegment: Partial<Record<VehicleType, string>>,
): OnboardingWebsitePlan[] {
    return orderedSegments(segments).flatMap((segment) =>
        orderedModes(modes).map((stock) => {
            const brand = stock === "new" ? brandsBySegment[segment] : undefined;
            return {
                id: `${stock}-${segment}`,
                stock,
                segment,
                brand,
                title: toWebsiteTitle(stock, segment),
                caption: stock === "new"
                    ? `${brand || "Authorised brand"} website with OEM model pages.`
                    : `Second-hand ${segmentLabel[segment].toLowerCase()} website with dealer inventory.`,
                route: routeBySegment[segment],
            };
        })
    ).slice(0, MAX_WEBSITE_PLANS);
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
    const [brandBySegment, setBrandBySegment] = useState<Partial<Record<VehicleType, string>>>({});
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
        ? orderedSegments(selectedSegments).filter((segment) => !brandBySegment[segment])
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
            const next = current.includes(segment) ? [] : [segment];
            setBrandBySegment((brands) => {
                const nextBrand = next[0] ? brands[next[0]] : undefined;
                return next[0] && nextBrand ? { [next[0]]: nextBrand } : {};
            });
            return next;
        });
    };

    const handleBack = () => {
        if (phase === "stock") {
            router.push("/");
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
        <div className="dsp-onboarding-canvas min-h-screen lg:h-dvh lg:overflow-hidden">
            <BrowserFrame className="min-h-screen w-full max-w-none rounded-none border-0 shadow-none lg:h-full lg:min-h-0" contentClassName="dsp-onboarding-canvas flex min-h-screen flex-col lg:h-full lg:min-h-0">
                <FlowTopBar
                    showBack
                    onBack={handleBack}
                    onExit={() => router.push("/")}
                />

                <main className="flex flex-1 flex-col px-5 py-5 sm:px-8 lg:min-h-0 lg:overflow-hidden lg:px-8 lg:py-4 xl:px-10">
                    <FlowStepper steps={phaseSteps} currentStep={phaseNumber(phase)} />

                    <div className="mt-5 grid flex-1 gap-6 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_430px] xl:grid-cols-[minmax(0,1fr)_500px]">
                        <section className="min-h-0 overflow-y-auto pr-1">
                            {phase === "stock" && (
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#155EEF]">Step 1 · Business mode</p>
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
                                                        "relative min-h-[220px] rounded-lg border bg-white p-5 text-left shadow-[0_12px_34px_rgba(7,20,54,0.05)] transition hover:-translate-y-0.5 hover:border-[#155EEF] hover:shadow-[0_18px_48px_rgba(7,20,54,0.10)] focus:outline-none focus:ring-2 focus:ring-[#155EEF]",
                                                        selected ? "border-[#155EEF] bg-[#F5F8FF]" : "border-[#D8E0EA]"
                                                    )}
                                                >
                                                    <span className={cn("flex h-12 w-12 items-center justify-center rounded-full border", toneClasses[option.tone])}>
                                                        <option.icon className="h-6 w-6" />
                                                    </span>
                                                    <h2 className="mt-5 text-xl font-black tracking-[-0.02em] text-[#071436]">{option.title}</h2>
                                                    <p className="mt-2 text-sm font-semibold leading-6 text-[#62708A]">{option.description}</p>
                                                    {option.id === "hybrid" && (
                                                        <p className="mt-3 rounded-md bg-violet-100 px-3 py-2 text-xs font-black text-violet-800">
                                                            New + Used websites for one selected category.
                                                        </p>
                                                    )}
                                                    <span className={cn(
                                                        "absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border",
                                                        selected ? "border-[#155EEF] bg-[#155EEF] text-white" : "border-[#CAD5E2] bg-white text-transparent"
                                                    )}>
                                                        <Check className="h-4 w-4" />
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {isHybrid && (
                                        <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-black text-violet-800">
                                            Hybrid selected. Pick one vehicle category next; it will create separate new and pre-owned website setups.
                                        </div>
                                    )}
                                </div>
                            )}

                            {phase === "segments" && (
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#155EEF]">Step 2 · Vehicle category</p>
                                        <h1 className="mt-2 text-[34px] font-black leading-tight tracking-[-0.04em] text-[#071436] xl:text-[42px]">
                                            Select the vehicle category for this website setup.
                                        </h1>
                                        <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#62708A]">
                                            Choose one category: Cars / 4W, Two-Wheelers, or Three-Wheelers. You can add another website later from the dashboard.
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
                                                        "relative min-h-[210px] rounded-lg border bg-white p-5 text-left shadow-[0_12px_34px_rgba(7,20,54,0.05)] transition hover:-translate-y-0.5 hover:border-[#155EEF] hover:shadow-[0_18px_48px_rgba(7,20,54,0.10)] focus:outline-none focus:ring-2 focus:ring-[#155EEF]",
                                                        selected ? "border-[#155EEF] bg-[#F5F8FF]" : "border-[#D8E0EA]"
                                                    )}
                                                >
                                                    <span className={cn("flex h-12 w-12 items-center justify-center rounded-full border", toneClasses[option.tone])}>
                                                        <option.icon className="h-6 w-6" />
                                                    </span>
                                                    <h2 className="mt-5 text-lg font-black tracking-[-0.02em] text-[#071436]">{option.title}</h2>
                                                    <p className="mt-2 text-sm font-semibold leading-6 text-[#62708A]">{option.description}</p>
                                                    <span className={cn(
                                                        "absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border",
                                                        selected ? "border-[#155EEF] bg-[#155EEF] text-white" : "border-[#CAD5E2] bg-white text-transparent"
                                                    )}>
                                                        <Check className="h-4 w-4" />
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {totalWebsites > 0 && (
                                        <div className="rounded-lg border border-[#D8E0EA] bg-white p-4 shadow-[0_12px_34px_rgba(7,20,54,0.05)]">
                                            <p className="text-sm font-black text-[#071436]">
                                                {totalWebsites} website{totalWebsites === 1 ? "" : "s"} will be prepared.
                                            </p>
                                            <p className="mt-1 text-xs font-semibold text-[#62708A]">
                                                Formula: {selectedModes.length} stock mode{selectedModes.length === 1 ? "" : "s"} x one vehicle category.
                                            </p>
                                            {isHybrid && selectedSegments.length === 1 && (
                                                <p className="mt-3 rounded-md bg-[#071436] px-3 py-2 text-sm font-black text-white">
                                                    New and pre-owned websites will be queued for the selected category.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {phase === "brands" && (
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#155EEF]">Step 3 · Authorised brands</p>
                                        <h1 className="mt-2 text-[34px] font-black leading-tight tracking-[-0.04em] text-[#071436] xl:text-[42px]">
                                            Pick one authorised brand for each new-vehicle website.
                                        </h1>
                                        <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#62708A]">
                                            Used websites do not need a brand here. Their stock brands will come from inventory upload or sync.
                                        </p>
                                    </div>

                                    <div className="space-y-5">
                                        {orderedSegments(selectedSegments).map((segment) => {
                                            const option = segmentOptions.find((item) => item.id === segment);
                                            const selectedBrand = brandBySegment[segment];
                                            const brands = brandOptionsForSegment(segment);
                                            return (
                                                <section key={segment} className="rounded-lg border border-[#D8E0EA] bg-white p-5 shadow-[0_12px_34px_rgba(7,20,54,0.05)]">
                                                    <div className="mb-4 flex items-start justify-between gap-4">
                                                        <div className="flex items-start gap-3">
                                                            <span className={cn("flex h-10 w-10 items-center justify-center rounded-full border", toneClasses[option?.tone ?? "slate"])}>
                                                                {option && <option.icon className="h-5 w-5" />}
                                                            </span>
                                                            <div>
                                                                <h2 className="text-lg font-black text-[#071436]">{segmentLabel[segment]} brand</h2>
                                                                <p className="mt-1 text-sm font-semibold text-[#62708A]">
                                                                    Select the OEM brand for the new {segmentLabel[segment].toLowerCase()} website.
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {selectedBrand && (
                                                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                                                                Selected
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                                        {brands.map((brand) => {
                                                            const selected = selectedBrand === brand;
                                                            return (
                                                                <button
                                                                    key={brand}
                                                                    type="button"
                                                                    onClick={() => setBrandBySegment((current) => ({ ...current, [segment]: brand }))}
                                                                    className={cn(
                                                                        "flex min-h-[48px] items-center justify-between gap-3 rounded-md border px-3 py-2 text-left text-sm font-black transition hover:border-[#155EEF] hover:bg-[#F5F8FF] focus:outline-none focus:ring-2 focus:ring-[#155EEF]",
                                                                        selected ? "border-[#155EEF] bg-[#F5F8FF] text-[#071436]" : "border-[#D8E0EA] bg-white text-[#35445C]"
                                                                    )}
                                                                >
                                                                    <span>{brand}</span>
                                                                    <span className={cn(
                                                                        "flex h-5 w-5 items-center justify-center rounded-full border",
                                                                        selected ? "border-[#155EEF] bg-[#155EEF] text-white" : "border-[#CAD5E2] text-transparent"
                                                                    )}>
                                                                        <Check className="h-3.5 w-3.5" />
                                                                    </span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </section>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {phase === "websites" && (
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#155EEF]">Step 4 · My Websites preview</p>
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
                                                <article key={plan.id} className="rounded-lg border border-[#D8E0EA] bg-white p-5 shadow-[0_14px_42px_rgba(7,20,54,0.07)]">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex items-start gap-3">
                                                            <span className={cn("flex h-11 w-11 items-center justify-center rounded-full border", toneClasses[segment?.tone ?? "slate"])}>
                                                                {segment && <segment.icon className="h-5 w-5" />}
                                                            </span>
                                                            <div>
                                                                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#155EEF]">
                                                                    Website {index + 1}
                                                                </p>
                                                                <h2 className="mt-1 text-xl font-black tracking-[-0.02em] text-[#071436]">{plan.title}</h2>
                                                                <p className="mt-1 text-sm font-semibold leading-6 text-[#62708A]">{plan.caption}</p>
                                                            </div>
                                                        </div>
                                                        <span className={cn(
                                                            "rounded-full border px-3 py-1 text-xs font-black",
                                                            plan.stock === "new"
                                                                ? "border-[#CFE0FF] bg-[#EEF4FF] text-[#155EEF]"
                                                                : "border-[#F6D8A8] bg-[#FFF7EA] text-[#A85B00]"
                                                        )}>
                                                            {modeLabel(plan.stock)}
                                                        </span>
                                                    </div>

                                                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-black text-[#35445C]">
                                                        <div className="rounded-md border border-[#E3E9F2] bg-[#F7F9FC] px-3 py-2">
                                                            Segment: {segmentLabel[plan.segment]}
                                                        </div>
                                                        <div className="rounded-md border border-[#E3E9F2] bg-[#F7F9FC] px-3 py-2">
                                                            Brand: {plan.brand || "Inventory based"}
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

                                                    <Button
                                                        type="button"
                                                        onClick={() => handleStartWebsite(plan)}
                                                        className="mt-5 h-11 w-full rounded-md bg-[#155EEF] font-black text-white hover:bg-[#0F4FD3]"
                                                    >
                                                        Start This Website
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </article>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </section>

                        <aside className="min-h-0 space-y-4 overflow-y-auto">
                            <div className="rounded-lg border border-[#D8E0EA] bg-white p-5 shadow-[0_14px_42px_rgba(7,20,54,0.07)]">
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#155EEF]">Live plan</p>
                                <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#071436]">
                                    {totalWebsites || 0} website{totalWebsites === 1 ? "" : "s"}
                                </h2>
                                <p className="mt-1 text-sm font-semibold text-[#62708A]">
                                    {selectedModes.length === 0
                                        ? "Select New, Used, or Hybrid to begin."
                                        : isHybrid
                                            ? "Hybrid mode: new and pre-owned websites are separated."
                                            : `${modeLabel(selectedModes[0])} mode selected.`}
                                </p>

                                <div className="mt-4 space-y-3">
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
                                        value="New + Used websites for the selected category"
                                    />
                                </div>
                            </div>

                            {phase !== "websites" ? (
                                <StaticDealerPreview />
                            ) : (
                                <div className="rounded-lg border border-[#D8E0EA] bg-[#071436] p-5 text-white shadow-[0_18px_48px_rgba(7,20,54,0.16)]">
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">Next screen after selection</p>
                                    <h3 className="mt-2 text-2xl font-black tracking-[-0.03em]">Dashboard: My Websites</h3>
                                    <p className="mt-2 text-sm font-semibold leading-6 text-white/75">
                                        This preview shows exactly what the dealer should see before starting each individual website setup.
                                    </p>
                                    <div className="mt-4 space-y-2">
                                        {websitePlans.slice(0, 6).map((plan) => (
                                            <div key={plan.id} className="flex items-center justify-between gap-3 rounded-md bg-white/10 px-3 py-2 text-sm font-bold">
                                                <span>{plan.title}</span>
                                                <span className="text-white/60">{plan.brand || "Used stock"}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {phase !== "websites" && (
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-11 rounded-md border-[#D8E0EA] px-4 font-black"
                                        onClick={handleBack}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button
                                        type="button"
                                        className="h-11 flex-1 rounded-md bg-[#155EEF] font-black text-white hover:bg-[#0F4FD3] disabled:opacity-50"
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
                                    className="h-11 w-full rounded-md border-[#D8E0EA] font-black"
                                    onClick={() => setPhase(includesNew ? "brands" : "segments")}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Adjust Selection
                                </Button>
                            )}
                        </aside>
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
        <div className="flex items-start gap-3 rounded-md border border-[#E3E9F2] bg-[#F7F9FC] px-3 py-2.5">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#155EEF]" />
            <div>
                <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#62708A]">{label}</p>
                <p className="mt-1 text-sm font-black text-[#071436]">{value}</p>
            </div>
        </div>
    );
}

function StaticDealerPreview() {
    return (
        <div className="hidden overflow-hidden rounded-lg border border-[#CAD5E2] bg-white shadow-[0_16px_44px_rgba(7,20,54,0.08)] lg:block">
            <div className="flex items-center justify-between border-b border-[#E3E9F2] px-5 py-3">
                <div>
                    <p className="text-sm font-black tracking-[-0.01em] text-[#071436]">Kumar Motors</p>
                    <p className="text-[11px] font-semibold text-[#62708A]">Your Journey, Our Priority</p>
                </div>
                <p className="text-xs font-black text-[#071436]">+91 98765 43210</p>
            </div>

            <div className="grid min-h-[230px] bg-[#071436] sm:grid-cols-[1fr_1.2fr]">
                <div className="p-6 text-white">
                    <h3 className="text-[23px] font-black leading-[1.08] tracking-[-0.02em]">Reliable Vehicles. Trusted Service.</h3>
                    <p className="mt-3 text-[13px] font-medium leading-5 text-white/75">
                        Cars, bikes, and autos from trusted local dealers. Best prices, easy finance.
                    </p>
                    <span className="mt-5 inline-flex rounded-md bg-[#155EEF] px-4 py-2.5 text-xs font-black text-white" aria-hidden="true">
                        View Inventory
                    </span>
                </div>
                <div className="flex items-center justify-center bg-gradient-to-br from-[#DCE5F0] to-[#F7F9FC]">
                    <div className="flex h-28 w-40 items-center justify-center rounded-xl border border-[#CAD5E2] bg-white shadow-[0_18px_45px_rgba(7,20,54,0.12)]">
                        <Car className="h-16 w-16 text-[#155EEF]" />
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
                    <div key={item.label} className="rounded-md border border-[#E3E9F2] bg-[#F7F9FC] p-2 text-center">
                        <item.icon className="mx-auto h-4 w-4 text-[#155EEF]" />
                        <p className="mt-1.5 text-[10px] font-black text-[#071436]">{item.label}</p>
                    </div>
                ))}
            </div>

            <div className="border-t border-[#E3E9F2] px-4 py-2.5">
                <p className="flex items-center gap-2 text-xs font-semibold text-[#155EEF]">
                    <Globe2 className="h-4 w-4" />
                    kumar-motors.dealersitepro.in
                </p>
            </div>
        </div>
    );
}

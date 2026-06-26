"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Bike, Car, CheckCircle2, Layers, RefreshCw, ShieldCheck, Sparkles, Truck } from "lucide-react";

import {
    BrowserFrame,
    coreFlowSteps,
    DealerPreviewCard,
    FlowStepper,
    FlowTopBar,
} from "@/components/onboarding/flow-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getOnboardingAccountPrefill, getOnboardingResetPrefill } from "@/lib/onboarding/prefill";
import { isSupabaseReady, supabase } from "@/lib/supabase";
import { useOnboardingStore } from "@/lib/store/onboarding-store";

type Condition = "new" | "used" | "both";
type VehicleType = "4w" | "2w" | "3w";

// Sub-step A — the condition applies to ALL vehicle types chosen in sub-step B.
const conditionOptions: { id: Condition; title: string; description: string; icon: typeof Car; tone: string }[] = [
    { id: "new",  title: "New Vehicles",     description: "Authorised dealer for brand-new vehicles from OEMs.", icon: Sparkles,  tone: "blue" },
    { id: "used", title: "Used / Pre-Owned", description: "Pre-owned, certified or second-hand vehicles.",       icon: RefreshCw, tone: "amber" },
    { id: "both", title: "Both New & Used",  description: "You sell new OEM stock and pre-owned vehicles.",       icon: Layers,    tone: "violet" },
];

// Sub-step B — multi-select; any combination is allowed.
const vehicleTypeOptions: { id: VehicleType; title: string; description: string; icon: typeof Car; tone: string }[] = [
    { id: "4w", title: "Cars (4-Wheeler)", description: "Hatchbacks, sedans, SUVs and more.",   icon: Car,   tone: "blue" },
    { id: "2w", title: "Two-Wheelers",     description: "Bikes, scooters and EV two-wheelers.",  icon: Bike,  tone: "indigo" },
    { id: "3w", title: "Three-Wheelers",   description: "Passenger autos, cargo and loaders.",   icon: Truck, tone: "green" },
];

const toneClasses: Record<string, string> = {
    blue:   "border-[#155EEF] bg-[#F5F8FF] text-[#155EEF]",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-600",
    green:  "border-emerald-200 bg-emerald-50 text-emerald-600",
    amber:  "border-amber-200 bg-amber-50 text-amber-600",
    violet: "border-violet-200 bg-violet-50 text-violet-600",
    slate:  "border-slate-200 bg-slate-50 text-slate-700",
};

export default function OnboardingIndexPage() {
    const router = useRouter();
    const {
        data,
        reset,
        setVehicleType,
        updateData,
        setSellsFourWheelers,
        setSellsThreeWheelers,
        setSellsTwoWheelers,
    } = useOnboardingStore();

    // Two sub-steps within the "Choose Type" stage.
    const [phase, setPhase] = useState<"condition" | "types">("condition");
    const [condition, setCondition] = useState<Condition | null>(null);
    const [types, setTypes] = useState<Set<VehicleType>>(new Set());

    useEffect(() => {
        if (!isSupabaseReady()) return;

        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) return;

            supabase
                .from("dealers")
                .select("onboarding_complete, dealership_name, tagline, location, full_address, map_link, google_maps_url, years_in_business, phone, whatsapp, email, gstin, slug")
                .eq("user_id", user.id)
                .maybeSingle()
                .then(({ data: dealer }) => {
                    if (dealer?.onboarding_complete) {
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
    }, []);

    const toggleType = (id: VehicleType) => {
        setTypes((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // Primary vehicle type drives which flow we enter first (cars → 2W → 3W).
    const primaryRoute: Record<"car" | "two-wheeler" | "three-wheeler", string> = {
        car: "/onboarding/step-1",
        "two-wheeler": "/onboarding/two-wheelers/step-1",
        "three-wheeler": "/onboarding/three-wheelers/step-1",
    };

    const handleContinue = () => {
        if (!condition || types.size === 0) return;

        const has4w = types.has("4w");
        const has2w = types.has("2w");
        const has3w = types.has("3w");
        const sellsNew = condition === "new" || condition === "both";
        const sellsUsed = condition === "used" || condition === "both";

        const primary: "car" | "two-wheeler" | "three-wheeler" =
            has4w ? "car" : has2w ? "two-wheeler" : "three-wheeler";

        reset(getOnboardingResetPrefill(data));
        setVehicleType(primary);
        setSellsFourWheelers(has4w);
        setSellsTwoWheelers(has2w);
        setSellsThreeWheelers(has3w);
        updateData({
            dealerCategory: condition,
            // These DB columns are legacy-named "cars", but shared public
            // templates use them as the dealer's new/used stock mode.
            sellsNewCars: sellsNew,
            sellsUsedCars: sellsUsed,
            // Mirror the store-root segment flags into `data` so saveDealer can read them.
            sellsFourWheelers: has4w,
            sellsTwoWheelers: has2w,
            sellsThreeWheelers: has3w,
        });
        router.push(primaryRoute[primary]);
    };

    const conditionTitle = condition ? conditionOptions.find((c) => c.id === condition)?.title : null;

    return (
        <div className="dsp-onboarding-canvas min-h-screen lg:h-dvh lg:overflow-hidden">
            <BrowserFrame className="min-h-screen w-full max-w-none rounded-none border-0 shadow-none lg:h-full lg:min-h-0" contentClassName="dsp-onboarding-canvas flex min-h-screen flex-col lg:h-full lg:min-h-0">
                <FlowTopBar
                    showBack
                    onBack={() => (phase === "types" ? setPhase("condition") : router.push("/"))}
                    onExit={() => router.push("/")}
                />
                <main className="flex flex-1 flex-col px-5 py-5 sm:px-8 lg:min-h-0 lg:overflow-hidden lg:px-8 lg:py-4 xl:px-10">
                    <FlowStepper steps={coreFlowSteps} currentStep={1} />

                    <div className="mt-5 grid flex-1 gap-6 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_500px] xl:grid-cols-[minmax(0,1fr)_580px] 2xl:grid-cols-[minmax(0,1fr)_620px]">
                        <section className="flex min-h-0 flex-col">
                            {phase === "condition" ? (
                                <>
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#155EEF]">Step 1 of 2 · Choose Type</p>
                                    <h1 className="mt-2 text-[30px] font-black leading-tight tracking-[-0.035em] text-[#071436] xl:text-[32px]">
                                        What do you sell?
                                    </h1>
                                    <p className="mt-2 max-w-xl text-sm font-medium leading-5 text-[#62708A]">
                                        Tell us whether you deal in new, pre-owned, or both. You&apos;ll pick your vehicle types next.
                                    </p>

                                    <div className="mt-5 grid flex-1 auto-rows-fr gap-3 sm:grid-cols-3">
                                        {conditionOptions.map((option) => {
                                            const isSelected = condition === option.id;
                                            return (
                                                <button
                                                    key={option.id}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={isSelected}
                                                    onClick={() => setCondition(option.id)}
                                                    className={cn(
                                                        "group relative flex min-h-[150px] flex-col items-center justify-center rounded-lg border p-4 text-center shadow-[0_10px_28px_rgba(7,20,54,0.04)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#155EEF]",
                                                        isSelected
                                                            ? "border-[#155EEF] bg-[#F5F8FF] shadow-[0_16px_42px_rgba(7,20,54,0.08)]"
                                                            : "border-[#D8E0EA] bg-white hover:border-[#155EEF] hover:shadow-[0_16px_42px_rgba(7,20,54,0.08)]"
                                                    )}
                                                >
                                                    <span className={cn("mx-auto flex h-12 w-12 items-center justify-center rounded-full border", toneClasses[option.tone])}>
                                                        <option.icon className="h-6 w-6" />
                                                    </span>
                                                    <h2 className="mt-3 text-[15px] font-black text-[#071436]">{option.title}</h2>
                                                    <p className="mx-auto mt-1.5 max-w-[220px] text-xs font-medium leading-5 text-[#62708A]">{option.description}</p>
                                                    {isSelected && (
                                                        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border border-[#155EEF] bg-[#155EEF] text-white">
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#62708A]">
                                        <span className="flex items-center gap-2 rounded-full border border-[#D8E0EA] bg-white px-3 py-1.5">
                                            <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
                                            Free subdomain included
                                        </span>
                                        <span className="flex items-center gap-2 rounded-full border border-[#D8E0EA] bg-white px-3 py-1.5">
                                            <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                                            Change or add types later
                                        </span>
                                    </div>

                                    <Button
                                        type="button"
                                        className="mt-4 h-11 w-full rounded-md bg-[#155EEF] text-sm font-black text-white hover:bg-[#0F4FD3] disabled:cursor-not-allowed disabled:opacity-50 lg:hidden"
                                        onClick={() => condition && setPhase("types")}
                                        disabled={!condition}
                                    >
                                        Continue
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#155EEF]">Step 2 of 2 · {conditionTitle}</p>
                                    <h1 className="mt-2 text-[30px] font-black leading-tight tracking-[-0.035em] text-[#071436] xl:text-[32px]">
                                        Which vehicle types do you sell?
                                    </h1>
                                    <p className="mt-2 max-w-xl text-sm font-medium leading-5 text-[#62708A]">
                                        Select all that apply — cars, bikes, autos, or any mix. Your <strong className="text-[#35445C]">{conditionTitle}</strong> choice applies to each.
                                    </p>

                                    <div className="mt-5 grid flex-1 auto-rows-fr gap-3 sm:grid-cols-3">
                                        {vehicleTypeOptions.map((option) => {
                                            const isSelected = types.has(option.id);
                                            return (
                                                <button
                                                    key={option.id}
                                                    type="button"
                                                    role="checkbox"
                                                    aria-checked={isSelected}
                                                    onClick={() => toggleType(option.id)}
                                                    className={cn(
                                                        "group relative flex min-h-[150px] flex-col items-center justify-center rounded-lg border p-4 text-center shadow-[0_10px_28px_rgba(7,20,54,0.04)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#155EEF]",
                                                        isSelected
                                                            ? "border-[#155EEF] bg-[#F5F8FF] shadow-[0_16px_42px_rgba(7,20,54,0.08)]"
                                                            : "border-[#D8E0EA] bg-white hover:border-[#155EEF] hover:shadow-[0_16px_42px_rgba(7,20,54,0.08)]"
                                                    )}
                                                >
                                                    <span className={cn("mx-auto flex h-12 w-12 items-center justify-center rounded-full border", toneClasses[option.tone])}>
                                                        <option.icon className="h-6 w-6" />
                                                    </span>
                                                    <h2 className="mt-3 text-[15px] font-black text-[#071436]">{option.title}</h2>
                                                    <p className="mx-auto mt-1.5 max-w-[220px] text-xs font-medium leading-5 text-[#62708A]">{option.description}</p>
                                                    <span className={cn(
                                                        "absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border transition",
                                                        isSelected
                                                            ? "border-[#155EEF] bg-[#155EEF] text-white"
                                                            : "border-[#D8E0EA] text-transparent group-hover:border-[#155EEF] group-hover:bg-[#155EEF] group-hover:text-white"
                                                    )}>
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-4 flex gap-3 lg:hidden">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-11 rounded-md border-[#D8E0EA] px-4 text-sm font-black"
                                            onClick={() => setPhase("condition")}
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back
                                        </Button>
                                        <Button
                                            type="button"
                                            className="h-11 flex-1 rounded-md bg-[#155EEF] text-sm font-black text-white hover:bg-[#0F4FD3] disabled:cursor-not-allowed disabled:opacity-50"
                                            onClick={handleContinue}
                                            disabled={types.size === 0}
                                        >
                                            Continue{types.size > 0 ? ` (${types.size})` : ""}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </section>

                        <aside className="hidden min-h-0 lg:flex lg:flex-col">
                            <DealerPreviewCard className="min-h-0 flex-1" />
                            {phase === "condition" ? (
                                <Button
                                    type="button"
                                    className="mt-3 h-10 w-full rounded-md bg-[#155EEF] text-sm font-black text-white hover:bg-[#0F4FD3] disabled:cursor-not-allowed disabled:opacity-50"
                                    onClick={() => condition && setPhase("types")}
                                    disabled={!condition}
                                >
                                    {condition ? "Continue" : "Select to continue"}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <div className="mt-3 flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-10 rounded-md border-[#D8E0EA] px-4 text-sm font-black"
                                        onClick={() => setPhase("condition")}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button
                                        type="button"
                                        className="h-10 flex-1 rounded-md bg-[#155EEF] text-sm font-black text-white hover:bg-[#0F4FD3] disabled:cursor-not-allowed disabled:opacity-50"
                                        onClick={handleContinue}
                                        disabled={types.size === 0}
                                    >
                                        {types.size === 0 ? "Select to continue" : `Continue (${types.size})`}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </aside>
                    </div>
                </main>
            </BrowserFrame>
        </div>
    );
}

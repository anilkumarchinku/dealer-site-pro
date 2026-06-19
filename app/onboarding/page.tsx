"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Bike, Car, CheckCircle2, ShieldCheck, Store, Truck } from "lucide-react";

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

const typeOptions = [
    {
        id: "cars",
        title: "Cars (4 Wheeler)",
        description: "Maruti Suzuki, Hyundai, Tata and more.",
        icon: Car,
        route: "/onboarding/step-1",
        tone: "blue",
        vehicleType: "car" as const,
        data: { dealerCategory: "new" as const, sellsNewCars: true, sellsUsedCars: false },
    },
    {
        id: "two-wheelers",
        title: "Two-Wheelers",
        description: "Hero MotoCorp, Honda, Bajaj and more.",
        icon: Bike,
        route: "/onboarding/two-wheelers/step-1",
        tone: "indigo",
        vehicleType: "two-wheeler" as const,
        data: { dealerCategory: "both" as const, sellsNewCars: true, sellsUsedCars: true },
    },
    {
        id: "three-wheelers",
        title: "Three-Wheelers",
        description: "Auto rickshaw, cargo, loader and more.",
        icon: Truck,
        route: "/onboarding/three-wheelers/step-1",
        tone: "green",
        vehicleType: "three-wheeler" as const,
        data: { dealerCategory: "both" as const, sellsNewCars: true, sellsUsedCars: true },
    },
    {
        id: "used",
        title: "Used Vehicles",
        description: "Pre-owned cars, bikes, autos and more.",
        icon: Store,
        route: "/onboarding/step-1",
        tone: "slate",
        vehicleType: "car" as const,
        data: { dealerCategory: "used" as const, sellsNewCars: false, sellsUsedCars: true },
    },
];

const toneClasses: Record<string, string> = {
    blue: "border-[#155EEF] bg-[#F5F8FF] text-[#155EEF]",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-600",
    green: "border-emerald-200 bg-emerald-50 text-emerald-600",
    slate: "border-slate-200 bg-slate-50 text-slate-700",
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

    // Multi-select: dealers can pick any combination of the four (e.g. Cars + Used,
    // Two-Wheelers + Used, all four). "Used Vehicles" is a category modifier, not a
    // separate vehicle type — combining it with a type means new AND used.
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const toggle = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // The four cards map to separate per-type onboarding flows. With multiple types
    // selected we route into ONE primary flow (Cars/Used → cars, then Two-, then
    // Three-Wheelers) and carry the rest in the sells-X flags the later steps read.
    const primaryRoute: Record<"car" | "two-wheeler" | "three-wheeler", string> = {
        car: "/onboarding/step-1",
        "two-wheeler": "/onboarding/two-wheelers/step-1",
        "three-wheeler": "/onboarding/three-wheelers/step-1",
    };

    const handleContinue = () => {
        if (selected.size === 0) return;
        const has = (id: string) => selected.has(id);

        const hasUsed = has("used");
        const hasNewType = has("cars") || has("two-wheelers") || has("three-wheelers");
        const sellsFour = has("cars") || has("used"); // "used" defaults to the cars (4W) context
        const sellsTwo = has("two-wheelers");
        const sellsThree = has("three-wheelers");

        // Primary vehicle type drives which flow we enter next.
        const primary: "car" | "two-wheeler" | "three-wheeler" =
            has("cars") || has("used")
                ? "car"
                : has("two-wheelers")
                    ? "two-wheeler"
                    : "three-wheeler";

        const dealerCategory = hasUsed && hasNewType ? "both" : hasUsed ? "used" : "new";

        reset(getOnboardingResetPrefill(data));
        setVehicleType(primary);
        setSellsFourWheelers(sellsFour);
        setSellsTwoWheelers(sellsTwo);
        setSellsThreeWheelers(sellsThree);
        updateData({
            dealerCategory,
            sellsNewCars: hasNewType,
            sellsUsedCars: hasUsed,
        });
        router.push(primaryRoute[primary]);
    };

    return (
        <div className="min-h-screen bg-white lg:h-dvh lg:overflow-hidden">
            <BrowserFrame className="min-h-screen w-full max-w-none rounded-none border-0 shadow-none lg:h-full lg:min-h-0" contentClassName="flex min-h-screen flex-col bg-white lg:h-full lg:min-h-0">
                <FlowTopBar
                    showBack
                    onBack={() => router.push("/")}
                    onExit={() => router.push("/")}
                />
                <main className="flex flex-1 flex-col px-5 py-5 sm:px-8 lg:min-h-0 lg:overflow-hidden lg:px-8 lg:py-4 xl:px-10">
                    <FlowStepper steps={coreFlowSteps} currentStep={1} />

                    <div className="mt-5 grid flex-1 gap-6 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_500px] xl:grid-cols-[minmax(0,1fr)_580px] 2xl:grid-cols-[minmax(0,1fr)_620px]">
                        <section className="flex min-h-0 flex-col">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#155EEF]">Choose Type</p>
                            <h1 className="mt-2 text-[30px] font-black leading-tight tracking-[-0.035em] text-[#071436] xl:text-[32px]">
                                What type of business do you run?
                            </h1>
                            <p className="mt-2 max-w-xl text-sm font-medium leading-5 text-[#62708A]">
                                Select all that apply — you can combine types (e.g. Cars + Used Vehicles). We will tailor the website setup around your choices.
                            </p>

                            <div className="mt-5 grid flex-1 auto-rows-fr gap-3 sm:grid-cols-2">
                                {typeOptions.map((option) => {
                                    const isSelected = selected.has(option.id);
                                    return (
                                        <button
                                            key={option.id}
                                            type="button"
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            onClick={() => toggle(option.id)}
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

                            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#62708A]">
                                <span className="flex items-center gap-2 rounded-full border border-[#D8E0EA] bg-white px-3 py-1.5">
                                    <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
                                    Free subdomain included
                                </span>
                                <span className="flex items-center gap-2 rounded-full border border-[#D8E0EA] bg-white px-3 py-1.5">
                                    <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                                    Change or add vehicle types later
                                </span>
                            </div>

                            <Button
                                type="button"
                                className="mt-4 h-11 w-full rounded-md bg-[#155EEF] text-sm font-black text-white hover:bg-[#0F4FD3] disabled:cursor-not-allowed disabled:opacity-50 lg:hidden"
                                onClick={handleContinue}
                                disabled={selected.size === 0}
                            >
                                Continue{selected.size > 0 ? ` (${selected.size})` : ""}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </section>

                        <aside className="hidden min-h-0 lg:flex lg:flex-col">
                            <DealerPreviewCard className="min-h-0 flex-1" />
                            <Button
                                type="button"
                                className="mt-3 h-10 w-full rounded-md bg-[#155EEF] text-sm font-black text-white hover:bg-[#0F4FD3] disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={handleContinue}
                                disabled={selected.size === 0}
                            >
                                {selected.size === 0 ? "Select to continue" : `Continue (${selected.size})`}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </aside>
                    </div>
                </main>
            </BrowserFrame>
        </div>
    );
}

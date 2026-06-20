"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    FileUp,
    PlusCircle,
    Rocket,
    Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import type { InventorySource } from "@/lib/types";

type InventoryMode = "manual" | "upload" | "cyepro";

const options = [
    {
        id: "manual" as const,
        title: "Add Manually",
        caption: "Add vehicles one by one, or in bulk later.",
        badge: null,
        icon: PlusCircle,
    },
    {
        id: "upload" as const,
        title: "Upload Catalog",
        caption: "Upload Excel or CSV file of your inventory.",
        badge: null,
        icon: FileUp,
    },
    {
        id: "cyepro" as const,
        title: "Cyepro Sync",
        caption: "Website leads land in your Cyepro CRM, with live inventory sync where enabled.",
        badge: "Recommended",
        icon: Rocket,
    },
];

export default function Step2InventoryPage() {
    const router = useRouter();
    const { data, updateData, setStep } = useOnboardingStore();

    const [mode, setMode] = useState<InventoryMode | null>(
        data.inventorySource === "cyepro" ? "cyepro" :
        data.inventorySource === "own" ? "upload" :
        null
    );
    const [selected, setSelected] = useState<InventorySource | null>(data.inventorySource ?? null);
    const [apiKey, setApiKey] = useState(data.cyeproApiKey ?? "");
    const [showKey, setShowKey] = useState(false);
    const [keyError, setKeyError] = useState("");

    useEffect(() => { setStep(2); }, [setStep]);

    const handleBack = () => router.push("/onboarding/step-2-used");

    const selectMode = (nextMode: InventoryMode) => {
        setMode(nextMode);
        setSelected(nextMode === "cyepro" ? "cyepro" : "own");
        setKeyError("");
    };

    const handleContinue = () => {
        if (mode === "cyepro") {
            if (!apiKey.trim()) {
                setKeyError("Please enter your Cyepro API key to continue");
                return;
            }
            updateData({ inventorySource: "cyepro", cyeproApiKey: apiKey.trim() });
            setStep(3);
            router.push("/onboarding/step-3");
            return;
        }

        if (mode === "manual") {
            updateData({ inventorySource: "own" });
            setStep(3);
            router.push("/onboarding/step-3");
            return;
        }

        if (mode === "upload" || selected === "own") {
            updateData({ inventorySource: "own" });
            router.push("/onboarding/step-2-inventory/bulk-upload");
        }
    };

    const handleSkip = () => {
        updateData({ inventorySource: undefined, cyeproApiKey: undefined });
        setStep(3);
        router.push("/onboarding/step-3");
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#155EEF]">Inventory Setup</p>
                <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#071436]">
                    Add your inventory
                </h1>
                <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#62708A]">
                    Choose how you want to add vehicles to your website. You can change this later from the dashboard.
                </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                {options.map((option) => {
                    const active = mode === option.id;
                    return (
                        <button
                            key={option.id}
                            type="button"
                            aria-pressed={active}
                            onClick={() => selectMode(option.id)}
                            className={cn(
                                "relative rounded-lg border bg-white p-5 text-left shadow-[0_14px_42px_rgba(7,20,54,0.05)] transition hover:-translate-y-0.5 hover:border-[#155EEF] hover:shadow-[0_18px_52px_rgba(7,20,54,0.10)] focus:outline-none focus:ring-2 focus:ring-[#155EEF]",
                                active ? "border-[#155EEF] bg-[#F5F8FF]" : "border-[#D8E0EA]"
                            )}
                        >
                            {active && (
                                <CheckCircle2 className="absolute right-4 top-4 h-5 w-5 text-[#155EEF]" />
                            )}
                            <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[#CFE0FF] bg-[#EEF4FF] text-[#155EEF]">
                                <option.icon className="h-6 w-6" />
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <h2 className="text-base font-black text-[#071436]">{option.title}</h2>
                                {option.badge && (
                                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700">
                                        {option.badge}
                                    </span>
                                )}
                            </div>
                            <p className="mt-2 text-sm font-medium leading-6 text-[#62708A]">{option.caption}</p>
                        </button>
                    );
                })}
            </div>

            {/* Announce the current selection for screen readers (cards convey it via colour/check otherwise). */}
            <p className="sr-only" role="status" aria-live="polite">
                {mode
                    ? `${options.find((option) => option.id === mode)?.title ?? ""} selected`
                    : "No inventory method selected"}
            </p>

            {mode === "cyepro" && (
                <div className="rounded-lg border border-[#D8E0EA] bg-[#F7F9FC] p-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-[#155EEF]">
                            <Zap className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-black text-[#071436]">Enter your Cyepro API Key</h3>
                            <p className="mt-1 text-xs font-medium leading-5 text-[#62708A]">
                                This same key sends generated website leads to your Cyepro CRM account. Find it in your Cyepro dashboard under Settings, API Access.
                            </p>
                            <div className="relative mt-4">
                                <input
                                    type={showKey ? "text" : "password"}
                                    value={apiKey}
                                    onChange={(event) => { setApiKey(event.target.value); setKeyError(""); }}
                                    placeholder="Paste your Cyepro API key here"
                                    className={cn(
                                        "h-11 w-full rounded-md border bg-white px-4 pr-11 text-sm font-mono text-[#071436] outline-none focus:ring-2 focus:ring-[#155EEF]",
                                        keyError ? "border-red-400" : "border-[#D8E0EA]"
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowKey((value) => !value)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#62708A] hover:text-[#071436]"
                                >
                                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {keyError && <p className="mt-2 text-xs font-semibold text-red-600">{keyError}</p>}
                        </div>
                    </div>
                </div>
            )}

            <div className="rounded-lg border border-[#D8E0EA] bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-black text-[#071436]">Inventory Preview</h2>
                    <span className="text-xs font-bold text-[#62708A]">Sample rows</span>
                </div>
                <div className="overflow-hidden rounded-md border border-[#E3E9F2]">
                    <div className="grid grid-cols-4 bg-[#F7F9FC] px-4 py-3 text-xs font-black text-[#62708A]">
                        <span>Vehicle</span>
                        <span>Year</span>
                        <span>Price</span>
                        <span>Status</span>
                    </div>
                    {[
                        ["Maruti Swift", "2024", "Rs 6,45,000", "Active"],
                        ["Hero Splendor Plus", "2024", "Rs 78,900", "Active"],
                        ["Bajaj Maxima Z", "2024", "Rs 2,45,000", "Active"],
                    ].map((row) => (
                        <div key={row[0]} className="grid grid-cols-4 border-t border-[#E3E9F2] px-4 py-3 text-sm font-semibold text-[#35445C]">
                            <span>{row[0]}</span>
                            <span>{row[1]}</span>
                            <span>{row[2]}</span>
                            <span className="flex items-center gap-2 text-emerald-700">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                {row[3]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={handleBack} className="border-[#D8E0EA]">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="text-[#62708A]" onClick={handleSkip}>
                        Skip for now
                    </Button>
                    <Button
                        onClick={handleContinue}
                        disabled={!mode}
                        className="h-11 rounded-md bg-[#155EEF] px-6 font-black text-white hover:bg-[#0F4FD3]"
                    >
                        {mode === "upload" ? "Set Up Upload" : mode === "cyepro" ? "Connect & Continue" : "Save & Continue"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

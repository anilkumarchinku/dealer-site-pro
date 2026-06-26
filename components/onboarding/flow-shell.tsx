"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
    ArrowLeft,
    Bike,
    Car,
    Check,
    CheckCircle2,
    Circle,
    Globe2,
    Headphones,
    ShieldCheck,
    Store,
    Truck,
    X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { dealerSiteUrl } from "@/lib/utils/domain";

type FlowStep = {
    label: string;
    caption?: string;
};

type DealerPreviewProps = {
    dealerName?: string | null;
    slug?: string | null;
    phone?: string | null;
    city?: string | null;
    className?: string;
};

export function OnboardingLogo({ className = "" }: { className?: string }) {
    return (
        <Link href="/" className={cn("inline-flex items-center gap-3 text-[#071436]", className)}>
            <Image
                src="/dealersite-pro-shield.png"
                alt="DealerSite Pro"
                width={34}
                height={34}
                className="h-8 w-8 object-contain"
                priority
            />
            <span className="text-lg font-black tracking-[-0.02em]">
                DealerSite <span className="text-[#155EEF]">Pro</span>
            </span>
        </Link>
    );
}

export function BrowserFrame({
    children,
    className = "",
    contentClassName = "",
}: {
    children: ReactNode;
    className?: string;
    contentClassName?: string;
}) {
    return (
        <div className={cn("overflow-hidden rounded-lg border border-[#CAD5E2] bg-white shadow-[0_22px_70px_rgba(7,20,54,0.10)]", className)}>
            <div className={contentClassName}>{children}</div>
        </div>
    );
}

type FlowTopBarProps = {
    showHelp?: boolean;
    showBack?: boolean;
    onBack?: () => void;
    onExit?: () => void;
};

export function FlowTopBar({
    showHelp = true,
    showBack = false,
    onBack,
    onExit,
}: FlowTopBarProps) {
    return (
        <div className="flex min-h-12 items-center justify-between gap-4 border-b border-[#E3E9F2] px-5 sm:px-7">
            <div className="flex min-w-0 items-center gap-3">
                <OnboardingLogo className="min-w-0" />
            </div>

            <div className="flex shrink-0 items-center gap-3">
                {showHelp && (
                    <div className="hidden items-center gap-2 text-xs font-semibold text-[#35445C] md:flex">
                        <Headphones className="h-4 w-4 text-[#155EEF]" />
                        <span>Need help?</span>
                        <span className="font-black text-[#071436]">1800-000-1234</span>
                    </div>
                )}
                {showBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        aria-label="Go back"
                        className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md border border-[#D8E0EA] bg-white px-2.5 text-xs font-black text-[#35445C] transition hover:border-[#155EEF] hover:bg-[#F5F8FF] hover:text-[#155EEF] focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Back</span>
                    </button>
                )}
                {onExit && (
                    <button
                        type="button"
                        onClick={onExit}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-transparent px-2.5 text-xs font-black text-[#35445C] transition hover:border-[#D8E0EA] hover:bg-[#F7F9FC] hover:text-[#071436] focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
                    >
                        <X className="h-4 w-4" />
                        <span className="hidden sm:inline">Exit</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export function FlowStepper({ steps, currentStep }: { steps: FlowStep[]; currentStep: number }) {
    return (
        <div className="rounded-lg border border-[#E7E0D7] bg-[#FFFDF7] px-3 py-2 shadow-[0_12px_34px_rgba(11,14,18,0.05)] sm:px-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const complete = stepNumber < currentStep;
                    const active = stepNumber === currentStep;

                    return (
                        <div key={step.label} className="flex min-w-0 flex-1 items-center gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <span
                                    className={cn(
                                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-black transition",
                                        complete && "border-[#2E8B5A] bg-[#2E8B5A] text-white",
                                        active && "border-[#0B0E12] bg-[#0B0E12] text-white shadow-[0_0_0_4px_rgba(168,121,58,0.18)]",
                                        !complete && !active && "border-[#E7E0D7] bg-[#FFFDF7] text-[#A39E94]"
                                    )}
                                >
                                    {complete ? <Check className="h-4 w-4" /> : stepNumber}
                                </span>
                                <span className="min-w-0">
                                    <span className={cn("block truncate text-[11px] font-black sm:text-xs", active ? "text-[#A8793A]" : complete ? "text-[#2E8B5A]" : "text-[#6F6A61]")}>
                                        {step.label}
                                    </span>
                                    {step.caption && <span className="block truncate text-[11px] font-medium text-[#A39E94]">{step.caption}</span>}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <span className={cn("hidden h-px min-w-8 flex-1 sm:block", stepNumber < currentStep ? "bg-[#2E8B5A]" : "bg-[#E7E0D7]")} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export const coreFlowSteps: FlowStep[] = [
    { label: "Choose Type" },
    { label: "Dealer Details" },
    { label: "Inventory & Services" },
    { label: "Website Design" },
    { label: "Launch" },
];

export function DealerPreviewCard({ dealerName, slug, phone, city, className }: DealerPreviewProps) {
    const name = dealerName?.trim() || "Kumar Motors";
    const siteSlug = slug?.trim() || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    return (
        <div className={cn("flex flex-col overflow-hidden rounded-lg border border-[#CAD5E2] bg-white shadow-[0_16px_44px_rgba(7,20,54,0.08)]", className)}>
            <div className="flex items-center justify-between border-b border-[#E3E9F2] px-5 py-3">
                <div className="flex items-center gap-2.5">
                    <Image src="/dealersite-pro-shield.png" alt="" width={24} height={24} className="h-6 w-6 object-contain" />
                    <div>
                        <p className="text-sm font-black tracking-[-0.01em] text-[#071436]">{name}</p>
                        <p className="text-[11px] font-semibold text-[#62708A]">{city || "Your Journey, Our Priority"}</p>
                    </div>
                </div>
                <p className="hidden text-xs font-black text-[#071436] sm:block">{phone || "+91 98765 43210"}</p>
            </div>

            <div className="grid min-h-[230px] flex-1 bg-[#071436] sm:grid-cols-[1.05fr_1.35fr]">
                <div className="p-6 text-white">
                    <h3 className="text-[23px] font-black leading-[1.08] tracking-[-0.02em]">Reliable Vehicles. Trusted Service.</h3>
                    <p className="mt-3 max-w-xs text-[13px] font-medium leading-5 text-white/75">
                        Cars, bikes, and autos from trusted local dealers. Best prices, easy finance.
                    </p>
                    <span className="mt-5 inline-flex rounded-md bg-[#155EEF] px-4 py-2.5 text-xs font-black text-white" aria-hidden="true">
                        View Inventory
                    </span>
                </div>
                <div className="relative min-h-[230px] bg-gradient-to-r from-[#223047] to-[#E8EDF4]">
                    <Image
                        src="/data/brand-model-images/4w/hyundai/creta.jpg"
                        alt="Dealer website preview vehicle"
                        fill
                        unoptimized
                        className="origin-right scale-110 object-contain object-right p-0 mix-blend-multiply"
                    />
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
                    {dealerSiteUrl(siteSlug)}
                </p>
            </div>
        </div>
    );
}

type LaunchChecklistProps = {
    uploadedCount?: number;
    hasDealerDetails?: boolean;
    hasContactDetails?: boolean;
    hasInventorySetup?: boolean;
    /** True once the site has been published, so post-publish items can flip to done. */
    published?: boolean;
};

export function LaunchChecklist({
    uploadedCount = 0,
    hasDealerDetails = false,
    hasContactDetails = false,
    hasInventorySetup = false,
    published = false,
}: LaunchChecklistProps) {
    // Each item carries its own completion state so we don't show a green check
    // for things that aren't actually verified yet (e.g. before publish).
    const items: { label: string; done: boolean }[] = [
        { label: "Dealer details added", done: hasDealerDetails },
        {
            label: uploadedCount > 0 ? `Inventory uploaded (${uploadedCount} vehicles)` : "Inventory setup",
            done: hasInventorySetup || uploadedCount > 0,
        },
        { label: "Contact details added", done: hasContactDetails },
        {
            label: published ? "Website pages ready" : "Website pages — generated on publish",
            done: published,
        },
        {
            label: published ? "SEO basics configured" : "SEO basics — applied on publish",
            done: published,
        },
    ];

    return (
        <div className="rounded-lg border border-[#D8E0EA] bg-white p-5 shadow-[0_14px_42px_rgba(7,20,54,0.07)]">
            <h3 className="text-base font-black text-[#071436]">Launch Checklist</h3>
            <div className="mt-4 space-y-3">
                {items.map((item) => (
                    <div
                        key={item.label}
                        className={cn(
                            "flex items-center gap-3 text-sm font-semibold",
                            item.done ? "text-[#35445C]" : "text-[#8A97AA]"
                        )}
                    >
                        {item.done ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16A34A]" />
                        ) : (
                            <Circle className="h-4 w-4 shrink-0 text-[#B6C0D0]" />
                        )}
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function SecurityPanel() {
    return (
        <div className="flex h-full flex-col justify-between bg-[#071436] p-8 text-white">
            <div>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#155EEF]/20">
                    <ShieldCheck className="h-10 w-10 text-white" />
                </div>
                <h2 className="mt-8 text-2xl font-black leading-tight">Your business is in safe hands.</h2>
                <div className="mt-6 space-y-3 text-sm font-semibold text-white/80">
                    {["Bank-level security", "Your data is always protected", "We never share your information"].map((item) => (
                        <p key={item} className="flex items-center gap-3">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                            {item}
                        </p>
                    ))}
                </div>
            </div>

            <div className="mt-10 border-t border-white/15 pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Trusted by dealers across India</p>
                <div className="mt-4 space-y-3 text-sm font-black">
                    <p>Maruti Suzuki</p>
                    <p>Hero MotoCorp</p>
                    <p>Bajaj Auto</p>
                </div>
            </div>
        </div>
    );
}

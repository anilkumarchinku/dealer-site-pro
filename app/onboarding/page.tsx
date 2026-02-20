"use client"
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DealerCategory } from "@/lib/types";

const DEALER_TYPES: {
    id: DealerCategory;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    description: string;
    highlights: string[];
    accentClass: string;
    badgeClass: string;
    borderClass: string;
    bgClass: string;
}[] = [
    {
        id: "new",
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="14" width="40" height="22" rx="4" fill="#2563eb" opacity="0.15" />
                <rect x="8" y="18" width="32" height="14" rx="2" fill="#2563eb" opacity="0.25" />
                <circle cx="14" cy="34" r="4" fill="#2563eb" />
                <circle cx="34" cy="34" r="4" fill="#2563eb" />
                <path d="M10 20l4-8h20l4 8" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 26h2M42 26h2" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                <circle cx="24" cy="8" r="3" fill="#6366f1" />
                <path d="M24 11v7" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "1st Hand Dealer",
        subtitle: "New Car Authorised Dealer",
        description: "You sell brand new vehicles directly from manufacturers. Showcase your authorised dealership with premium templates built for OEM partners.",
        highlights: [
            "OEM brand-matched colour schemes",
            "Multi-brand & single-brand layouts",
            "New car enquiry & booking flows",
            "Certified dealership badge",
        ],
        accentClass: "text-blue-600",
        badgeClass: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
        borderClass: "border-blue-500/30 hover:border-blue-500/70",
        bgClass: "hover:bg-blue-500/3",
    },
    {
        id: "used",
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="14" width="40" height="22" rx="4" fill="#b8962e" opacity="0.15" />
                <rect x="8" y="18" width="32" height="14" rx="2" fill="#b8962e" opacity="0.25" />
                <circle cx="14" cy="34" r="4" fill="#b8962e" />
                <circle cx="34" cy="34" r="4" fill="#b8962e" />
                <path d="M10 20l4-8h20l4 8" stroke="#b8962e" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 26h2M42 26h2" stroke="#b8962e" strokeWidth="2" strokeLinecap="round" />
                <path d="M18 10 C18 10 20 8 24 8 C28 8 30 10 30 10" stroke="#003328" strokeWidth="2" strokeLinecap="round" fill="none" />
                <circle cx="24" cy="6" r="3" fill="#003328" />
            </svg>
        ),
        title: "2nd Hand Dealer",
        subtitle: "Pre-Owned / Used Car Dealer",
        description: "You deal in pre-owned vehicles across all makes and models. Get a premium, trust-building website with your own brand identity and colour palette.",
        highlights: [
            "Your own logo & brand colours",
            "Bentley-inspired premium palettes",
            "Pre-owned inventory showcase",
            "Trust badges & inspection reports",
        ],
        accentClass: "text-amber-700",
        badgeClass: "bg-amber-500/10 text-amber-700 border border-amber-500/20",
        borderClass: "border-amber-500/30 hover:border-amber-600/70",
        bgClass: "hover:bg-amber-500/3",
    },
    {
        id: "both",
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="16" width="20" height="16" rx="3" fill="#2563eb" opacity="0.18" />
                <rect x="26" y="16" width="20" height="16" rx="3" fill="#b8962e" opacity="0.18" />
                <circle cx="10" cy="34" r="3" fill="#2563eb" />
                <circle cx="20" cy="34" r="3" fill="#2563eb" />
                <circle cx="28" cy="34" r="3" fill="#b8962e" />
                <circle cx="38" cy="34" r="3" fill="#b8962e" />
                <path d="M4 22l3-6h12l3 6" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M28 22l3-6h12l3 6" stroke="#b8962e" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M22 24h4" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
                <circle cx="24" cy="10" r="3" fill="#6366f1" />
                <path d="M22 10h-3M26 10h3" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "Both New & Used",
        subtitle: "Hybrid Dealership",
        description: "You sell both brand new authorised vehicles and pre-owned cars. Get the best of both worlds — OEM brand pages plus a used car inventory showcase.",
        highlights: [
            "New car OEM pages + used inventory",
            "Unified brand identity",
            "New & pre-owned enquiry flows",
            "Full service & trade-in support",
        ],
        accentClass: "text-violet-600",
        badgeClass: "bg-violet-500/10 text-violet-600 border border-violet-500/20",
        borderClass: "border-violet-500/30 hover:border-violet-500/70",
        bgClass: "hover:bg-violet-500/3",
    },
];

export default function OnboardingIndexPage() {
    const router = useRouter();
    const { updateData, reset } = useOnboardingStore();

    const handleSelect = (category: DealerCategory) => {
        reset();
        updateData({ dealerCategory: category });
        router.push("/onboarding/step-1");
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-8">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-3 hover:opacity-70 transition-opacity"
                    >
                        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                            <svg className="w-5 h-5 text-primary-foreground" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M18 9l-5-5H3a1 1 0 00-1 1v10a1 1 0 001 1h10l5-5z" />
                            </svg>
                        </div>
                        <span className="text-lg font-semibold">DealerSite Pro</span>
                    </button>
                    <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                        Exit
                    </Button>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
                <div className="w-full max-w-5xl mx-auto space-y-10">

                    {/* Hero text */}
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            Setup in under 5 minutes
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            What kind of dealership<br className="hidden sm:block" /> are you?
                        </h1>
                        <p className="text-muted-foreground text-base max-w-md mx-auto">
                            We&apos;ll personalise your entire onboarding experience and website templates based on your business type.
                        </p>
                    </div>

                    {/* Selection cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {DEALER_TYPES.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => handleSelect(type.id)}
                                className={cn(
                                    "group relative w-full text-left rounded-2xl border-2 p-6 transition-all duration-200",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    "active:scale-[0.98]",
                                    type.borderClass,
                                    type.bgClass
                                )}
                            >
                                {/* Icon */}
                                <div className="mb-5">
                                    <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center border border-border">
                                        {type.icon}
                                    </div>
                                </div>

                                {/* Badge */}
                                <div className={cn("inline-flex text-xs font-medium px-2.5 py-1 rounded-full mb-3", type.badgeClass)}>
                                    {type.subtitle}
                                </div>

                                {/* Title */}
                                <h2 className={cn("text-xl font-bold mb-2", type.accentClass)}>
                                    {type.title}
                                </h2>

                                {/* Description */}
                                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                                    {type.description}
                                </p>

                                {/* Highlights */}
                                <ul className="space-y-1.5">
                                    {type.highlights.map((h) => (
                                        <li key={h} className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <CheckCircle2 className={cn("w-3.5 h-3.5 flex-shrink-0", type.accentClass)} />
                                            {h}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA arrow */}
                                <div className={cn(
                                    "mt-6 flex items-center gap-1.5 text-sm font-semibold transition-all",
                                    type.accentClass,
                                    "group-hover:gap-3"
                                )}>
                                    Get started
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Reset note */}
                    <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                        <RotateCcw className="w-3 h-3" />
                        Already started? Your progress is saved automatically.
                    </p>
                </div>
            </main>

            <footer className="border-t py-6 px-8">
                <div className="container max-w-3xl mx-auto">
                    <p className="text-xs text-muted-foreground text-center">
                        Need help? Contact our support team at support@dealersitepro.com
                    </p>
                </div>
            </footer>
        </div>
    );
}

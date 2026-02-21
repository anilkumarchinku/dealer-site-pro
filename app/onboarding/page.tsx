"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Car, ArrowRight, Building2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const DEALER_TYPES = [
    {
        id: "new" as const,
        emoji: "🏢",
        label: "1st Hand",
        sublabel: "New Cars",
        description: "Authorised dealer selling brand-new cars directly from manufacturers.",
        features: ["New model showcases", "Brand-specific website", "OEM inventory sync"],
        accentColor: "blue",
        available: true,
    },
    {
        id: "used" as const,
        emoji: "🚙",
        label: "2nd Hand",
        sublabel: "Pre-Owned",
        description: "Used and pre-owned car dealer with your own stock or Cyepro inventory.",
        features: ["Bulk CSV upload", "Cyepro API sync", "Prestige colour themes"],
        accentColor: "amber",
        available: true,
    },
    {
        id: "hybrid" as const,
        emoji: "🔀",
        label: "Hybrid",
        sublabel: "New + Used",
        description: "Sell both brand-new and pre-owned vehicles from one dealership.",
        features: ["Dual inventory", "Two websites in one", "Full flexibility"],
        accentColor: "violet",
        available: false,
    },
] as const;

const accentStyles: Record<string, { border: string; bg: string; text: string; badge: string; ring: string }> = {
    blue: {
        border: "border-blue-500/40 hover:border-blue-500/80",
        bg:     "hover:bg-blue-500/5",
        text:   "text-blue-600 dark:text-blue-400",
        badge:  "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
        ring:   "focus-visible:ring-blue-500/50",
    },
    amber: {
        border: "border-amber-500/40 hover:border-amber-500/80",
        bg:     "hover:bg-amber-500/5",
        text:   "text-amber-600 dark:text-amber-400",
        badge:  "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        ring:   "focus-visible:ring-amber-500/50",
    },
    violet: {
        border: "border-muted-foreground/20",
        bg:     "",
        text:   "text-muted-foreground",
        badge:  "bg-muted text-muted-foreground border-muted-foreground/20",
        ring:   "",
    },
};

export default function OnboardingIndexPage() {
    const router = useRouter();
    const { updateData, reset } = useOnboardingStore();

    // Clear any stale persisted data so the user always starts fresh.
    useEffect(() => {
        reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelect = (category: "new" | "used") => {
        reset();
        updateData({ dealerCategory: category });
        router.push("/onboarding/step-1");
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-8">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-3 hover:opacity-70 transition-opacity"
                    >
                        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                            <Car className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-semibold text-foreground">DealerSite Pro</span>
                    </button>
                    <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                        Exit
                    </Button>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
                <div className="w-full max-w-3xl mx-auto space-y-10">

                    {/* Hero */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Sparkles className="w-3.5 h-3.5" />
                            Setup in under 5 minutes
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                            What type of dealer are you?
                        </h1>
                        <p className="text-muted-foreground text-base max-w-md mx-auto">
                            Choose the option that best describes your dealership — we&apos;ll tailor your website setup accordingly.
                        </p>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {DEALER_TYPES.map((dt) => {
                            const styles = accentStyles[dt.accentColor];
                            return dt.available ? (
                                <button
                                    key={dt.id}
                                    onClick={() => handleSelect(dt.id as "new" | "used")}
                                    className={cn(
                                        "group relative w-full rounded-2xl border-2 p-6 transition-all duration-200 text-left",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]",
                                        "bg-card shadow-sm hover:shadow-md",
                                        styles.border,
                                        styles.bg,
                                        styles.ring,
                                    )}
                                >
                                    {/* Arrow hint on hover */}
                                    <ArrowRight className={cn(
                                        "absolute top-4 right-4 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
                                        styles.text,
                                    )} />

                                    {/* Icon */}
                                    <div className="text-4xl mb-4">{dt.emoji}</div>

                                    {/* Title */}
                                    <div className="mb-1">
                                        <span className={cn("text-xl font-bold", styles.text)}>{dt.label}</span>
                                        <span className="ml-2 text-xs font-medium text-muted-foreground">{dt.sublabel}</span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                        {dt.description}
                                    </p>

                                    {/* Feature pills */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {dt.features.map((f) => (
                                            <span
                                                key={f}
                                                className={cn(
                                                    "text-[11px] px-2 py-0.5 rounded-full border font-medium",
                                                    styles.badge,
                                                )}
                                            >
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </button>
                            ) : (
                                <div
                                    key={dt.id}
                                    className={cn(
                                        "relative w-full rounded-2xl border-2 p-6 text-left",
                                        "border-dashed border-muted-foreground/20 bg-muted/30 cursor-not-allowed opacity-60"
                                    )}
                                >
                                    {/* Coming Soon badge */}
                                    <Badge variant="outline" className="absolute top-3 right-3 text-[10px] uppercase tracking-wide">
                                        Coming Soon
                                    </Badge>

                                    <div className="text-4xl mb-4">{dt.emoji}</div>

                                    <div className="mb-1">
                                        <span className="text-xl font-bold text-muted-foreground">{dt.label}</span>
                                        <span className="ml-2 text-xs font-medium text-muted-foreground">{dt.sublabel}</span>
                                    </div>

                                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                        {dt.description}
                                    </p>

                                    <div className="flex flex-wrap gap-1.5">
                                        {dt.features.map((f) => (
                                            <span
                                                key={f}
                                                className="text-[11px] px-2 py-0.5 rounded-full border border-muted-foreground/20 text-muted-foreground font-medium"
                                            >
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Trust line */}
                    <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>500+ dealers live</span>
                        </div>
                        <div className="w-px h-3 bg-border" />
                        <div className="flex items-center gap-1.5">
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Can change anytime</span>
                        </div>
                        <div className="w-px h-3 bg-border" />
                        <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>100% free</span>
                        </div>
                    </div>

                </div>
            </main>

            <footer className="border-t border-border py-6 px-8">
                <p className="text-xs text-muted-foreground text-center">
                    Need help? Contact us at support@dealersitepro.com
                </p>
            </footer>
        </div>
    );
}

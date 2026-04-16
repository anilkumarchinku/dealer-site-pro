"use client"
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sparkles, Building2, RefreshCw, ArrowRight, ArrowLeft, Bike } from "lucide-react";
import { cn } from "@/lib/utils";

const DEALER_TYPES = [
    {
        id: "new" as const,
        emoji: "🏍️",
        label: "New Bikes",
        sublabel: "Authorised Dealer",
        description: "Sell brand-new bikes and scooters. Authorised dealer for one or more OEM brands.",
        features: ["Brand showcase pages", "New model launches", "OEM brand integration"],
        color: "blue",
    },
    {
        id: "used" as const,
        emoji: "🔄",
        label: "Used Bikes",
        sublabel: "Pre-Owned",
        description: "Sell pre-owned bikes and scooters with your own stock.",
        features: ["Stock listing", "Inspection badge", "Lead generation"],
        color: "amber",
    },
    {
        id: "both" as const,
        emoji: "🏪",
        label: "New + Used",
        sublabel: "Hybrid Dealer",
        description: "Sell both new and pre-owned two-wheelers from one dealership.",
        features: ["Dual inventory", "New + Used sections", "Full flexibility"],
        color: "violet",
    },
] as const;

const colorStyles: Record<string, { border: string; bg: string; text: string; badge: string }> = {
    blue:   { border: "border-blue-500/40 hover:border-blue-500/80",     bg: "hover:bg-blue-500/5",   text: "text-blue-600 dark:text-blue-400",   badge: "bg-blue-500/10 text-blue-700 border-blue-500/20"   },
    amber:  { border: "border-amber-500/40 hover:border-amber-500/80",   bg: "hover:bg-amber-500/5",  text: "text-amber-600 dark:text-amber-400", badge: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
    violet: { border: "border-violet-500/40 hover:border-violet-500/80", bg: "hover:bg-violet-500/5", text: "text-violet-600 dark:text-violet-400", badge: "bg-violet-500/10 text-violet-700 border-violet-500/20" },
};

export default function TwoWheelerIndexPage() {
    const router = useRouter();
    const { updateData, reset, setVehicleType } = useOnboardingStore();

    const handleSelect = (category: "new" | "used" | "both") => {
        reset();
        setVehicleType('two-wheeler');
        if (category === "both") {
            updateData({ dealerCategory: "both", sellsNewCars: true, sellsUsedCars: true });
        } else if (category === "new") {
            updateData({ dealerCategory: "new", sellsNewCars: true, sellsUsedCars: false });
        } else {
            updateData({ dealerCategory: "used", sellsNewCars: false, sellsUsedCars: true });
        }
        router.push("/onboarding/two-wheelers/step-1");
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
                            <Bike className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-semibold text-foreground">DealerSite Pro</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Button variant="ghost" size="sm" onClick={() => router.push("/onboarding")}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
                <div className="w-full max-w-3xl mx-auto space-y-10">
                    {/* Hero */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Sparkles className="w-3.5 h-3.5" />
                            Two-Wheeler Dealership Setup
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                            What type of two-wheeler dealer are you?
                        </h1>
                        <p className="text-muted-foreground text-base max-w-md mx-auto">
                            Choose the option that best describes your dealership — we&apos;ll tailor your website setup accordingly.
                        </p>
                    </div>

                    {/* Dealer type cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {DEALER_TYPES.map((dt) => {
                            const s = colorStyles[dt.color];
                            return (
                                <button
                                    key={dt.id}
                                    onClick={() => handleSelect(dt.id)}
                                    className={cn(
                                        "group relative w-full rounded-2xl border-2 overflow-hidden transition-all duration-200 text-left",
                                        "focus:outline-none active:scale-[0.98] bg-card shadow-sm hover:shadow-md",
                                        s.border, s.bg,
                                    )}
                                >
                                    <div className="p-6 flex flex-col gap-4">
                                        <span className="text-4xl">{dt.emoji}</span>
                                        <div>
                                            <p className={cn("text-xl font-bold", s.text)}>{dt.label}</p>
                                            <p className="text-sm text-muted-foreground">{dt.sublabel}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {dt.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {dt.features.map((f) => (
                                                <span key={f} className={cn("text-[11px] px-2 py-0.5 rounded-full border font-medium", s.badge)}>
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                        <ArrowRight className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity", s.text)} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Trust line */}
                    <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>200+ 2W dealers live</span>
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

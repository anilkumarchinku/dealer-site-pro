"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Car, ArrowRight, Building2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   SVG Illustrations — one per dealer type
───────────────────────────────────────────── */

function NewCarIllustration() {
    return (
        <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style={{ display: 'block' }}>
            {/* Showroom floor gradient */}
            <defs>
                <linearGradient id="bg-new" x1="0" y1="0" x2="280" y2="140" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#eff6ff" />
                    <stop offset="100%" stopColor="#dbeafe" />
                </linearGradient>
                <linearGradient id="car-new" x1="40" y1="60" x2="240" y2="120" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#1d4ed8" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.2" />
                </linearGradient>
            </defs>

            {/* Background */}
            <rect width="280" height="140" fill="url(#bg-new)" rx="12" />

            {/* Showroom floor line */}
            <ellipse cx="140" cy="118" rx="100" ry="8" fill="#bfdbfe" opacity="0.5" />

            {/* Showroom glass wall columns */}
            <rect x="20" y="15" width="3" height="90" rx="1.5" fill="#93c5fd" opacity="0.4" />
            <rect x="257" y="15" width="3" height="90" rx="1.5" fill="#93c5fd" opacity="0.4" />
            <rect x="20" y="15" width="240" height="2" rx="1" fill="#93c5fd" opacity="0.4" />

            {/* Ceiling light bar */}
            <rect x="90" y="12" width="100" height="6" rx="3" fill="#93c5fd" opacity="0.5" />
            <rect x="100" y="18" width="80" height="30" rx="2" fill="white" opacity="0.15" />

            {/* Car body — sleek sedan */}
            {/* Shadow */}
            <ellipse cx="148" cy="116" rx="80" ry="6" fill="#1e40af" opacity="0.12" />

            {/* Car lower body */}
            <path d="M 55 100 Q 58 88 80 86 L 210 86 Q 232 86 238 92 L 242 100 Q 244 104 240 107 L 56 107 Q 52 107 53 102 Z"
                fill="url(#car-new)" />

            {/* Car roof */}
            <path d="M 95 86 Q 102 66 120 62 L 188 62 Q 202 62 210 72 L 215 86 Z"
                fill="url(#car-new)" />

            {/* Windshield */}
            <path d="M 98 86 Q 105 70 120 66 L 162 66 L 168 86 Z"
                fill="#bfdbfe" opacity="0.85" />

            {/* Rear window */}
            <path d="M 172 86 L 175 68 L 190 70 L 208 80 L 210 86 Z"
                fill="#bfdbfe" opacity="0.6" />

            {/* Door line */}
            <path d="M 168 86 L 170 107" stroke="#1d4ed8" strokeWidth="1" opacity="0.4" />

            {/* Front detail */}
            <rect x="238" y="95" width="8" height="3" rx="1.5" fill="#fbbf24" opacity="0.9" />
            <rect x="50" y="96" width="6" height="3" rx="1.5" fill="#fef08a" opacity="0.9" />

            {/* Wheels */}
            <circle cx="100" cy="107" r="14" fill="#1e3a8a" />
            <circle cx="100" cy="107" r="10" fill="#1e40af" />
            <circle cx="100" cy="107" r="5" fill="#93c5fd" />
            <circle cx="100" cy="107" r="2" fill="white" />

            <circle cx="196" cy="107" r="14" fill="#1e3a8a" />
            <circle cx="196" cy="107" r="10" fill="#1e40af" />
            <circle cx="196" cy="107" r="5" fill="#93c5fd" />
            <circle cx="196" cy="107" r="2" fill="white" />

            {/* NEW badge */}
            <rect x="192" y="22" width="54" height="22" rx="11" fill="#1d4ed8" />
            <text x="219" y="37" textAnchor="middle" fontSize="9" fontWeight="700" fill="white" fontFamily="system-ui">✦ NEW</text>

            {/* Stars / sparkle */}
            <circle cx="42" cy="30" r="3" fill="#60a5fa" opacity="0.7" />
            <circle cx="36" cy="42" r="2" fill="#93c5fd" opacity="0.5" />
            <circle cx="54" cy="24" r="1.5" fill="#3b82f6" opacity="0.6" />
        </svg>
    );
}

function UsedCarIllustration() {
    return (
        <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style={{ display: 'block' }}>
            <defs>
                <linearGradient id="bg-used" x1="0" y1="0" x2="280" y2="140" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#fffbeb" />
                    <stop offset="100%" stopColor="#fef3c7" />
                </linearGradient>
                <linearGradient id="car-used" x1="40" y1="60" x2="240" y2="120" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#92400e" />
                    <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
            </defs>

            {/* Background */}
            <rect width="280" height="140" fill="url(#bg-used)" rx="12" />

            {/* Ground / lot line */}
            <rect x="0" y="118" width="280" height="22" rx="0" fill="#fde68a" opacity="0.3" />
            <line x1="0" y1="118" x2="280" y2="118" stroke="#f59e0b" strokeWidth="1" opacity="0.4" />

            {/* Lot flags string */}
            <path d="M 10 20 Q 70 16 140 18 Q 210 20 270 16" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="0" fill="none" opacity="0.6" />
            {[30, 60, 90, 120, 150, 180, 210, 240].map((x, i) => (
                <polygon key={i} points={`${x},18 ${x + 7},18 ${x + 3.5},26`}
                    fill={i % 3 === 0 ? "#f59e0b" : i % 3 === 1 ? "#ef4444" : "#10b981"}
                    opacity="0.7" />
            ))}

            {/* Small car in background (left) */}
            <g opacity="0.45" transform="translate(15, 75) scale(0.55)">
                <path d="M 10 50 Q 14 35 32 32 L 110 32 Q 130 32 136 40 L 140 50 Q 142 54 138 57 L 12 57 Q 8 57 9 52 Z" fill="#78716c" />
                <path d="M 40 32 Q 46 18 60 15 L 95 15 Q 108 15 114 25 L 118 32 Z" fill="#78716c" />
                <path d="M 42 32 Q 48 20 60 18 L 88 18 L 92 32 Z" fill="#a8a29e" opacity="0.5" />
                <circle cx="35" cy="57" r="10" fill="#44403c" />
                <circle cx="35" cy="57" r="5" fill="#78716c" />
                <circle cx="118" cy="57" r="10" fill="#44403c" />
                <circle cx="118" cy="57" r="5" fill="#78716c" />
            </g>

            {/* Small car in background (right) */}
            <g opacity="0.45" transform="translate(178, 72) scale(0.5)">
                <path d="M 10 50 Q 14 35 32 32 L 110 32 Q 130 32 136 40 L 140 50 Q 142 54 138 57 L 12 57 Q 8 57 9 52 Z" fill="#059669" />
                <path d="M 40 32 Q 46 18 60 15 L 95 15 Q 108 15 114 25 L 118 32 Z" fill="#059669" />
                <path d="M 42 32 Q 48 20 60 18 L 88 18 L 92 32 Z" fill="#6ee7b7" opacity="0.5" />
                <circle cx="35" cy="57" r="10" fill="#064e3b" />
                <circle cx="35" cy="57" r="5" fill="#059669" />
                <circle cx="118" cy="57" r="10" fill="#064e3b" />
                <circle cx="118" cy="57" r="5" fill="#059669" />
            </g>

            {/* Main car — SUV/crossover */}
            <ellipse cx="145" cy="116" rx="78" ry="5" fill="#b45309" opacity="0.15" />

            {/* Car body */}
            <path d="M 62 98 Q 65 84 88 81 L 208 81 Q 230 81 236 88 L 240 98 Q 242 103 238 106 L 65 106 Q 60 106 61 101 Z"
                fill="url(#car-used)" />

            {/* Car roof (taller, SUV-like) */}
            <path d="M 96 81 Q 100 61 116 57 L 192 57 Q 206 57 213 68 L 218 81 Z"
                fill="url(#car-used)" />

            {/* Windshield */}
            <path d="M 99 81 Q 103 64 116 60 L 158 60 L 164 81 Z"
                fill="#fde68a" opacity="0.7" />

            {/* Rear window */}
            <path d="M 168 81 L 170 62 L 188 65 L 212 76 L 214 81 Z"
                fill="#fde68a" opacity="0.5" />

            {/* Roof rack lines */}
            <line x1="120" y1="57" x2="190" y2="57" stroke="#92400e" strokeWidth="2.5" opacity="0.5" />

            {/* Headlight */}
            <rect x="236" y="92" width="6" height="4" rx="2" fill="#fde68a" opacity="0.9" />
            <rect x="58" y="93" width="5" height="4" rx="2" fill="#fef9c3" opacity="0.8" />

            {/* Wheels */}
            <circle cx="102" cy="106" r="14" fill="#78350f" />
            <circle cx="102" cy="106" r="10" fill="#92400e" />
            <circle cx="102" cy="106" r="5" fill="#fde68a" />
            <circle cx="102" cy="106" r="2" fill="white" />

            <circle cx="198" cy="106" r="14" fill="#78350f" />
            <circle cx="198" cy="106" r="10" fill="#92400e" />
            <circle cx="198" cy="106" r="5" fill="#fde68a" />
            <circle cx="198" cy="106" r="2" fill="white" />

            {/* Price tag */}
            <rect x="194" y="20" width="62" height="26" rx="6" fill="#f59e0b" />
            <rect x="196" y="22" width="58" height="22" rx="4" fill="#fffbeb" />
            <text x="225" y="31" textAnchor="middle" fontSize="7" fill="#92400e" fontWeight="600" fontFamily="system-ui">CERTIFIED</text>
            <text x="225" y="40" textAnchor="middle" fontSize="8" fill="#b45309" fontWeight="700" fontFamily="system-ui">PRE-OWNED</text>

            {/* Checkmark badge */}
            <circle cx="30" cy="32" r="12" fill="#10b981" opacity="0.9" />
            <path d="M 24 32 L 28 36 L 36 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    );
}

function HybridIllustration() {
    return (
        <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style={{ display: 'block' }}>
            <defs>
                <linearGradient id="bg-hybrid" x1="0" y1="0" x2="280" y2="140" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#f5f3ff" />
                    <stop offset="100%" stopColor="#ede9fe" />
                </linearGradient>
            </defs>

            {/* Background */}
            <rect width="280" height="140" fill="url(#bg-hybrid)" rx="12" />

            {/* Divider line */}
            <line x1="140" y1="20" x2="140" y2="120" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />

            {/* LEFT — New car (small) */}
            <g transform="translate(8, 35) scale(0.72)">
                {/* shadow */}
                <ellipse cx="85" cy="103" rx="60" ry="4" fill="#7c3aed" opacity="0.1" />
                {/* body */}
                <path d="M 18 80 Q 22 66 42 63 L 122 63 Q 140 63 144 70 L 148 80 Q 150 84 146 87 L 22 87 Q 18 87 18 83 Z" fill="#7c3aed" opacity="0.7" />
                {/* roof */}
                <path d="M 50 63 Q 56 47 70 44 L 108 44 Q 120 44 126 55 L 130 63 Z" fill="#7c3aed" opacity="0.7" />
                {/* windshield */}
                <path d="M 53 63 Q 57 49 68 47 L 100 47 L 104 63 Z" fill="#ddd6fe" opacity="0.7" />
                {/* wheels */}
                <circle cx="48" cy="87" r="11" fill="#4c1d95" opacity="0.7" />
                <circle cx="48" cy="87" r="5" fill="#c4b5fd" opacity="0.7" />
                <circle cx="130" cy="87" r="11" fill="#4c1d95" opacity="0.7" />
                <circle cx="130" cy="87" r="5" fill="#c4b5fd" opacity="0.7" />
            </g>

            {/* NEW badge (left car) */}
            <rect x="18" y="20" width="34" height="14" rx="7" fill="#7c3aed" opacity="0.8" />
            <text x="35" y="30" textAnchor="middle" fontSize="7" fontWeight="700" fill="white" fontFamily="system-ui">NEW</text>

            {/* PLUS symbol in center */}
            <circle cx="140" cy="72" r="14" fill="white" />
            <circle cx="140" cy="72" r="12" fill="#ede9fe" />
            <text x="140" y="77" textAnchor="middle" fontSize="16" fontWeight="700" fill="#7c3aed" fontFamily="system-ui">+</text>

            {/* RIGHT — Used car (small) */}
            <g transform="translate(148, 40) scale(0.68)">
                {/* shadow */}
                <ellipse cx="82" cy="100" rx="58" ry="4" fill="#6d28d9" opacity="0.08" />
                {/* body */}
                <path d="M 14 78 Q 18 64 36 60 L 118 60 Q 138 60 142 68 L 146 78 Q 148 82 144 85 L 16 85 Q 12 85 13 80 Z" fill="#a78bfa" opacity="0.6" />
                {/* roof SUV-like */}
                <path d="M 44 60 Q 48 43 62 40 L 104 40 Q 118 40 124 52 L 128 60 Z" fill="#a78bfa" opacity="0.6" />
                {/* windshield */}
                <path d="M 47 60 Q 50 46 62 43 L 96 43 L 100 60 Z" fill="#ddd6fe" opacity="0.55" />
                {/* wheels */}
                <circle cx="44" cy="85" r="11" fill="#4c1d95" opacity="0.6" />
                <circle cx="44" cy="85" r="5" fill="#c4b5fd" opacity="0.6" />
                <circle cx="126" cy="85" r="11" fill="#4c1d95" opacity="0.6" />
                <circle cx="126" cy="85" r="5" fill="#c4b5fd" opacity="0.6" />
            </g>

            {/* PRE-OWNED badge (right car) */}
            <rect x="212" y="20" width="52" height="14" rx="7" fill="#a78bfa" opacity="0.8" />
            <text x="238" y="30" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="white" fontFamily="system-ui">PRE-OWNED</text>

            {/* Ground line */}
            <line x1="10" y1="118" x2="270" y2="118" stroke="#c4b5fd" strokeWidth="1" opacity="0.4" />

            {/* Arrow */}
            <path d="M 118 112 L 140 105 L 162 112" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
        </svg>
    );
}

const ILLUSTRATIONS: Record<string, React.ReactNode> = {
    new:    <NewCarIllustration />,
    used:   <UsedCarIllustration />,
    hybrid: <HybridIllustration />,
};

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const DEALER_TYPES = [
    {
        id: "new" as const,
        label: "1st Hand",
        sublabel: "New Cars",
        description: "Authorised dealer selling brand-new cars directly from manufacturers.",
        features: ["New model showcases", "Brand-specific website", "OEM inventory sync"],
        accentColor: "blue",
        available: true,
    },
    {
        id: "used" as const,
        label: "2nd Hand",
        sublabel: "Pre-Owned",
        description: "Used and pre-owned car dealer with your own stock or Cyepro inventory.",
        features: ["Bulk CSV upload", "Cyepro API sync", "Prestige colour themes"],
        accentColor: "amber",
        available: true,
    },
    {
        id: "hybrid" as const,
        label: "Hybrid",
        sublabel: "New + Used",
        description: "Sell both brand-new and pre-owned vehicles from one dealership.",
        features: ["Dual inventory", "New + Used sections", "Full flexibility"],
        accentColor: "violet",
        available: true,
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

    useEffect(() => {
        reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelect = (category: "new" | "used" | "hybrid") => {
        reset();
        if (category === "hybrid") {
            updateData({
                dealerCategory: "both",
                sellsNewCars: true,
                sellsUsedCars: true,
            });
        } else {
            updateData({ dealerCategory: category });
        }
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
                                    onClick={() => handleSelect(dt.id as "new" | "used" | "hybrid")}
                                    className={cn(
                                        "group relative w-full rounded-2xl border-2 overflow-hidden transition-all duration-200 text-left",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]",
                                        "bg-card shadow-sm hover:shadow-md",
                                        styles.border,
                                        styles.bg,
                                        styles.ring,
                                    )}
                                >
                                    {/* Illustration banner */}
                                    <div className="w-full h-[130px] overflow-hidden block">
                                        {ILLUSTRATIONS[dt.id]}
                                    </div>

                                    {/* Card content */}
                                    <div className="p-5">
                                        {/* Arrow hint on hover */}
                                        <ArrowRight className={cn(
                                            "absolute top-[138px] right-4 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
                                            styles.text,
                                        )} />

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
                                    </div>
                                </button>
                            ) : (
                                <div
                                    key={dt.id}
                                    className={cn(
                                        "relative w-full rounded-2xl border-2 overflow-hidden text-left",
                                        "border-dashed border-muted-foreground/20 bg-muted/30 cursor-not-allowed opacity-60"
                                    )}
                                >
                                    {/* Coming Soon badge */}
                                    <Badge variant="outline" className="absolute top-3 right-3 z-10 text-[10px] uppercase tracking-wide bg-background">
                                        Coming Soon
                                    </Badge>

                                    {/* Illustration banner */}
                                    <div className="w-full h-[130px] overflow-hidden block grayscale opacity-70">
                                        {ILLUSTRATIONS[dt.id]}
                                    </div>

                                    {/* Card content */}
                                    <div className="p-5">
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

"use client"

/**
 * Admin Dashboard - PRO Edition
 * Professional control center for template and brand management
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Check,
    ExternalLink,
    RefreshCw,
    LayoutTemplate,
    Car,
    Sparkles,
    Crown,
    Zap,
    Heart,
    Settings,
    Eye,
    ChevronRight,
    Palette,
    Globe,
    TrendingUp,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { automotiveBrands } from "@/lib/colors/automotive-brands";
import { getAllCars } from "@/lib/services/car-service";
import type { Car as CarType } from "@/lib/types/car";
import { CarGrid } from "@/components/cars/CarGrid";
import brandModelsData from "@/lib/data/brand-models.json";

const ADMIN_CARS_PREVIEW_LIMIT = 12;

const TEMPLATES = [
    {
        id: "modern",
        name: "Modern",
        description: "Clean lines, blue gradients, floating navigation. Perfect for contemporary dealerships.",
        icon: Sparkles,
        gradient: "from-blue-500 to-indigo-600",
        bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
        borderColor: "border-blue-200",
        accentColor: "text-blue-600",
        preview: "Blue & Indigo",
    },
    {
        id: "luxury",
        name: "Luxury",
        description: "Elegant serif typography, gold accents, cinematic hero. For premium brands.",
        icon: Crown,
        gradient: "from-amber-500 to-yellow-600",
        bgColor: "bg-gradient-to-br from-neutral-900 to-neutral-800",
        borderColor: "border-amber-500/30",
        accentColor: "text-amber-500",
        preview: "Gold & Black",
        dark: true,
    },
    {
        id: "sporty",
        name: "Sporty",
        description: "High-energy design, aggressive angles, racing aesthetic. For performance cars.",
        icon: Zap,
        gradient: "from-red-500 to-rose-600",
        bgColor: "bg-gradient-to-br from-gray-900 to-red-950",
        borderColor: "border-red-500/30",
        accentColor: "text-red-500",
        preview: "Red & Black",
        dark: true,
    },
    {
        id: "family",
        name: "Family",
        description: "Warm, friendly design with teal accents. Safe, trustworthy feel for families.",
        icon: Heart,
        gradient: "from-teal-500 to-emerald-600",
        bgColor: "bg-gradient-to-br from-teal-50 to-emerald-50",
        borderColor: "border-teal-200",
        accentColor: "text-teal-600",
        preview: "Teal & Emerald",
    },
];

// ── Dynamic brand lists from brand-models.json (always up-to-date) ────────────
const ALL_2W_TRADITIONAL = (brandModelsData.twoWheelers.traditional as { brand: string }[]).map(b => b.brand);
const ALL_2W_ELECTRIC = (brandModelsData.twoWheelers.electric as { brand: string }[]).map(b => b.brand);
const ALL_3W = (brandModelsData.threeWheelers as { brand: string }[]).map(b => b.brand);

const BRAND_CATEGORIES = [
    {
        name: "Mass Market",
        brands: ["Maruti Suzuki", "Tata Motors", "Mahindra", "Hyundai", "Honda", "Toyota", "Kia", "Renault", "Nissan", "Volkswagen"]
    },
    {
        name: "Premium",
        brands: ["Skoda", "MG", "Jeep", "Citroen", "Force Motors", "Isuzu"]
    },
    {
        name: "Luxury",
        brands: ["Mercedes-Benz", "BMW", "Audi", "Jaguar", "Land Rover", "Volvo", "Lexus", "Porsche", "Bentley", "Lamborghini", "Aston Martin"]
    },
    {
        name: "Electric",
        brands: ["BYD", "Tesla", "VinFast", "Ola Electric", "Ather Energy"]
    },
    {
        name: "Two Wheelers (ICE)",
        brands: ALL_2W_TRADITIONAL,
    },
    {
        name: "Two Wheelers (EV)",
        brands: ALL_2W_ELECTRIC,
    },
    {
        name: "Three Wheelers",
        brands: ALL_3W,
    }
];

const ALL_BRANDS = BRAND_CATEGORIES.flatMap(cat => cat.brands);


// Map of brand name -> brandId for all 2W/3W brands (from brand-models.json)
const BRAND_ID_MAP: Record<string, string> = {};
[
    ...(brandModelsData.twoWheelers.traditional as { brand: string; brandId: string }[]),
    ...(brandModelsData.twoWheelers.electric as { brand: string; brandId: string }[]),
    ...(brandModelsData.threeWheelers as { brand: string; brandId: string }[]),
].forEach(b => { BRAND_ID_MAP[b.brand] = b.brandId; });

const KNOWN_LOGOS: Record<string, string> = {
    "Hero MotoCorp": "/assets/logos/2w/hero-motocorp.svg",
    "Honda Motorcycle & Scooter India": "/assets/logos/2w/honda-motorcycles.svg",
    "TVS Motor Company": "/assets/logos/2w/tvs-motor.svg",
    "Bajaj Auto": "/assets/logos/2w/bajaj-auto.svg",
    "Bajaj Auto (3W)": "/assets/logos/2w/bajaj-auto.svg",
    "Yamaha India": "/assets/logos/2w/yamaha.svg",
    "Suzuki Motorcycle India": "/assets/logos/2w/suzuki-motorcycle.svg",
    "Royal Enfield": "/assets/logos/2w/royal-enfield.svg",
    "KTM India": "/assets/logos/2w/ktm.svg",
    "Kawasaki India": "/assets/logos/2w/kawasaki.svg",
    "Ola Electric": "/assets/logos/2w/ola-electric.svg",
    "Ather Energy": "/assets/logos/2w/ather-energy.svg",
    "Aprilia India": "/assets/logos/2w/aprilia.svg",
    "BMW Motorrad India": "/assets/logos/2w/bmw-motorrad.svg",
    "Ducati India": "/assets/logos/2w/ducati.svg",
    "Harley-Davidson India": "/assets/logos/2w/harley-davidson.svg",
    "Husqvarna India": "/assets/logos/2w/husqvarna.svg",
    "Triumph India": "/assets/logos/2w/triumph.svg",
    "Vespa India": "/assets/logos/2w/vespa.svg",
    "CFMoto India": "/assets/logos/2w/cfmoto.png",
    "Mahindra (3W)": "/assets/logos/mahindra.png",
    "Mahindra Two Wheelers": "/assets/logos/mahindra.png",
    "Piaggio Ape": "/assets/logos/piaggio.png",
    "Greaves Electric Mobility": "/assets/logos/greaves.png",
    "Kinetic Green": "/assets/logos/kinetic.png",
    "TVS King": "/assets/logos/2w/tvs-motor.svg",
    "Vida (Hero MotoCorp)": "/assets/logos/2w/hero-motocorp.svg",
    // Brands whose file extension differs from .png
    "Hop Electric": "/data/brand-logos/hop-electric.svg",
    "Okinawa Autotech": "/data/brand-logos/okinawa-autotech.webp",
};

/** Build ordered list of candidate URLs to try for a brand logo */
function getBrandLogoSrcs(brandName: string): string[] {
    const brandId = BRAND_ID_MAP[brandName];
    const known = KNOWN_LOGOS[brandName];
    const slug = brandName.toLowerCase().replace(/\s+/g, '-');
    const srcs: string[] = [];
    if (known) srcs.push(known);
    if (brandId) {
        srcs.push(`/data/brand-logos/${brandId}.png`);
        srcs.push(`/data/brand-logos/${brandId}.svg`);
        srcs.push(`/data/brand-logos/${brandId}.webp`);
    }
    srcs.push(`/assets/logos/${slug}.png`);
    srcs.push(`/assets/logos/${slug}.svg`);
    return srcs;
}

/** Cascades through candidate URLs; shows initial avatar as final fallback */
function BrandLogo({ brandName }: { brandName: string }) {
    const srcs = getBrandLogoSrcs(brandName);
    const [idx, setIdx] = useState(0);

    if (idx >= srcs.length) {
        return (
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border border-border">
                <span className="text-muted-foreground font-bold text-lg">{brandName.charAt(0)}</span>
            </div>
        );
    }

    return (
        <div className="w-12 h-12 relative flex items-center justify-center">
            <img
                key={srcs[idx]}
                src={srcs[idx]}
                alt={brandName}
                onError={() => setIdx(i => i + 1)}
                className="max-w-full max-h-full object-contain"
            />
        </div>
    );
}

export default function AdminDashboard() {

    const router = useRouter();
    const { data, updateData } = useOnboardingStore();

    const [selectedTemplate, setSelectedTemplate] = useState<string>(data.styleTemplate || "modern");
    const [selectedBrand, setSelectedBrand] = useState<string>(data.brands?.[0] || "Toyota");
    const [isLaunching, setIsLaunching] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [cars, setCars] = useState<CarType[]>([]);
    const [sessionChecked, setSessionChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [usernameInput, setUsernameInput] = useState("admin");
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    // ── Step 1: Check whether an admin session cookie already exists ─────────
    useEffect(() => {
        let isMounted = true;

        fetch('/api/admin/session')
            .then(async (res) => {
                const json = await res.json();
                if (!isMounted) return;
                setIsAuthenticated(Boolean(json.authenticated));
            })
            .catch(() => {
                if (!isMounted) return;
                setIsAuthenticated(false);
            })
            .finally(() => {
                if (isMounted) {
                    setSessionChecked(true);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [])

    const handleLogout = async () => {
        await fetch('/api/admin/session', { method: 'DELETE' });
        setIsAuthenticated(false);
        setPasswordInput('');
        setPasswordError('');
        router.refresh();
    };

    // ── Step 2: Verify admin credentials via dedicated session route ─────────
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordLoading(true);
        try {
            const res = await fetch('/api/admin/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameInput, password: passwordInput }),
            });
            const json = await res.json();
            if (json.success) {
                setIsAuthenticated(true);
                setPasswordInput('');
            } else {
                setPasswordError('Invalid admin credentials. Try again.');
                setPasswordInput('');
            }
        } catch {
            setPasswordError('Something went wrong. Try again.');
        } finally {
            setPasswordLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) return
        let isMounted = true;
        getAllCars({ limit: ADMIN_CARS_PREVIEW_LIMIT }).then(res => {
            if (isMounted) setCars(res.cars);
        });
        return () => { isMounted = false; };
    }, [isAuthenticated])

    if (!sessionChecked) return null

    // ── Direct admin login prompt ────────────────────────────────────────────
    if (!isAuthenticated) return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center space-y-1">
                    <div className="text-3xl font-bold">🔐</div>
                    <h1 className="text-xl font-semibold text-foreground">Admin Access</h1>
                    <p className="text-sm text-muted-foreground">Enter admin credentials to continue</p>
                </div>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Admin username"
                        value={usernameInput}
                        onChange={e => setUsernameInput(e.target.value)}
                        autoFocus
                        disabled={passwordLoading}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="password"
                        placeholder="Admin password"
                        value={passwordInput}
                        onChange={e => setPasswordInput(e.target.value)}
                        disabled={passwordLoading}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {passwordError && (
                        <p className="text-sm text-destructive">{passwordError}</p>
                    )}
                    <Button type="submit" className="w-full" disabled={passwordLoading || !usernameInput || !passwordInput}>
                        {passwordLoading ? 'Verifying…' : 'Enter Admin Panel'}
                    </Button>
                </form>
            </div>
        </div>
    )


    const handleLaunch = async () => {
        setIsLaunching(true);

        try {
            // Wait for store update first
            updateData({
                styleTemplate: selectedTemplate as any,
                brands: [selectedBrand as any],
            });

            // Persist to actual Supabase Database via our secure server route if dealerId is known
            const { dealerId } = useOnboardingStore.getState();
            if (dealerId) {
                const res = await fetch("/api/admin/deploy-template", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        dealerId,
                        template: selectedTemplate,
                        brands: [selectedBrand]
                    })
                });
                const responseData = await res.json();
                if (!res.ok) {
                    console.error("Failed to deploy to Supabase:", responseData.error);
                }
            } else {
                console.warn("No active Dealer ID found. Previewing locally only.");
            }

            // Redirect user to preview
            setTimeout(() => {
                router.push(`/preview?brand=${encodeURIComponent(selectedBrand)}&template=${selectedTemplate}`);
            }, 600);

        } catch (e) {
            console.error("Deploy error", e);
            setIsLaunching(false);
        }
    };


    const filteredBrands = activeCategory === "all"
        ? ALL_BRANDS
        : BRAND_CATEGORIES.find(cat => cat.name === activeCategory)?.brands || [];

    const selectedTemplateData = TEMPLATES.find(t => t.id === selectedTemplate);

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Premium Header */}
            <header className="bg-background border-b border-border sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                                <Settings className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-foreground">Admin Dashboard</h1>
                                <p className="text-xs text-muted-foreground">Template Control Center</p>
                            </div>
                        </div>

                        {/* Current Selection */}
                        <div className="hidden md:flex items-center gap-6">
                            <Button
                                variant="outline"
                                onClick={() => router.push("/admin/inventory-audit")}
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Inventory Audit
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                            <div className="flex items-center gap-4 px-4 py-2 bg-muted/50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <Palette className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Template:</span>
                                    <span className="text-sm font-semibold text-foreground capitalize">{selectedTemplate}</span>
                                </div>
                                <div className="w-px h-4 bg-border" />
                                <div className="flex items-center gap-2">
                                    <Car className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Brand:</span>
                                    <span className="text-sm font-semibold text-foreground">{selectedBrand}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleLaunch}
                                disabled={isLaunching}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/30"
                            >
                                {isLaunching ? (
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Eye className="w-4 h-4 mr-2" />
                                )}
                                Preview Site
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Templates", value: "4", icon: LayoutTemplate, color: "blue" },
                        { label: "Brands", value: ALL_BRANDS.length.toString(), icon: Car, color: "emerald" },
                        { label: "Categories", value: BRAND_CATEGORIES.length.toString(), icon: Globe, color: "violet" },
                        { label: "Active", value: "1", icon: TrendingUp, color: "amber" },
                    ].map((stat, i) => (
                        <Card key={i} className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center",
                                    stat.color === "blue" && "bg-blue-100 text-blue-600",
                                    stat.color === "emerald" && "bg-emerald-100 text-emerald-600",
                                    stat.color === "violet" && "bg-violet-100 text-violet-600",
                                    stat.color === "amber" && "bg-amber-100 text-amber-600",
                                )}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Templates Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                <LayoutTemplate className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">Choose Template</h2>
                                <p className="text-sm text-muted-foreground">Select the perfect design for your dealership</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TEMPLATES.map((template) => {
                            const Icon = template.icon;
                            const isSelected = selectedTemplate === template.id;

                            return (
                                <Card
                                    key={template.id}
                                    className={cn(
                                        "cursor-pointer transition-all duration-300 overflow-hidden group",
                                        "hover:shadow-xl hover:-translate-y-1",
                                        isSelected && "ring-2 ring-offset-2 ring-blue-500 shadow-xl scale-[1.02]"
                                    )}
                                    onClick={() => setSelectedTemplate(template.id)}
                                >
                                    {/* Preview Area */}
                                    <div className={cn(
                                        "aspect-[4/3] relative overflow-hidden",
                                        template.bgColor
                                    )}>
                                        {/* Template Preview Image */}
                                        <Image
                                            src={`/assets/templates/${template.id}.png`}
                                            alt={template.name}
                                            fill
                                            className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* Gradient Overlay */}
                                        <div className={cn(
                                            "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity",
                                            `bg-gradient-to-br ${template.gradient}`
                                        )} />

                                        {/* Selected Badge */}
                                        {isSelected && (
                                            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                                                <Check className="w-4 h-4" />
                                            </div>
                                        )}

                                        {/* Template Icon */}
                                        <div className={cn(
                                            "absolute bottom-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm",
                                            template.dark ? "bg-white/20" : "bg-black/10"
                                        )}>
                                            <Icon className={cn("w-5 h-5", template.dark ? "text-white" : "text-foreground/70")} />
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-foreground">{template.name}</h3>
                                            <span className={cn(
                                                "text-xs font-medium px-2 py-1 rounded-full",
                                                `bg-gradient-to-r ${template.gradient} text-white`
                                            )}>
                                                {template.preview}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* Brands Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                <Car className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">Select Brand</h2>
                                <p className="text-sm text-muted-foreground">Choose the automotive brand to showcase</p>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={() => setActiveCategory("all")}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                    activeCategory === "all"
                                        ? "bg-foreground text-background"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                )}
                            >
                                All ({ALL_BRANDS.length})
                            </button>
                            {BRAND_CATEGORIES.map(cat => (
                                <button
                                    key={cat.name}
                                    onClick={() => setActiveCategory(cat.name)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                        activeCategory === cat.name
                                            ? "bg-foreground text-background"
                                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                                    )}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {filteredBrands.map((brandName) => {
                            const isSelected = selectedBrand === brandName;
                            const brandConfig = automotiveBrands[brandName as keyof typeof automotiveBrands];
                            const brandColor = brandConfig?.primary || '#3B82F6';

                            return (
                                <Card
                                    key={brandName}
                                    className={cn(
                                        "p-4 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 relative",
                                        "hover:shadow-lg hover:-translate-y-1",
                                        isSelected
                                            ? "ring-2 bg-muted/30 shadow-lg"
                                            : "hover:bg-muted/30"
                                    )}
                                    style={isSelected ? { borderColor: brandColor } : {}}
                                    onClick={() => setSelectedBrand(brandName)}
                                >
                                    <BrandLogo brandName={brandName} />
                                    <span className={cn(
                                        "text-xs font-medium text-center line-clamp-1",
                                        isSelected ? "font-bold" : "text-muted-foreground"
                                    )}
                                        style={isSelected ? { color: brandColor } : {}}>
                                        {brandName}
                                    </span>

                                    {/* Brand Color Indicator */}
                                    <div
                                        className="w-full h-1 rounded-full mt-1"
                                        style={{ backgroundColor: brandColor }}
                                    />

                                    {isSelected && (
                                        <div
                                            className="absolute top-2 right-2 w-5 h-5 rounded-full text-white flex items-center justify-center"
                                            style={{ backgroundColor: brandColor }}
                                        >
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* Browse All Cars Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <Car className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">Browse All Available Cars</h2>
                                <p className="text-sm text-muted-foreground">Click any car to view details and specifications</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/cars')}
                        >
                            View All with Filters
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>

                    <CarGrid
                        cars={cars}
                        variant="compact"
                        showEMI={true}
                        onViewDetails={(carId) => router.push(`/cars/${carId}`)}
                    />
                </section>

                {/* Preview Card */}
                <section>
                    <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-full blur-3xl" />

                        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-5 h-5 text-amber-400" />
                                    <span className="text-amber-400 text-sm font-medium">Ready to Preview</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">
                                    {selectedBrand} with {selectedTemplateData?.name} Template
                                </h3>
                                <p className="text-white/60 mb-4">
                                    See how your dealership website will look with the selected template and brand combination.
                                </p>
                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={handleLaunch}
                                        disabled={isLaunching}
                                        size="lg"
                                        className="bg-white text-gray-900 hover:bg-gray-100"
                                    >
                                        {isLaunching ? (
                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                        )}
                                        Launch Preview
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-white/20 text-white hover:bg-white/10"
                                        onClick={() => router.push('/dashboard')}
                                    >
                                        Go to Dashboard
                                    </Button>
                                </div>
                            </div>

                            {/* Preview Thumbnail */}
                            <div className="relative w-full md:w-72 aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                                <Image
                                    src={`/assets/templates/${selectedTemplate}.png`}
                                    alt="Template Preview"
                                    fill
                                    className="object-cover"
                                />
                                <div className={cn(
                                    "absolute inset-0 opacity-30",
                                    `bg-gradient-to-br ${selectedTemplateData?.gradient}`
                                )} />
                            </div>
                        </div>
                    </Card>
                </section>
            </main>

            {/* Mobile Fixed Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg">
                <Button
                    onClick={handleLaunch}
                    disabled={isLaunching}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    size="lg"
                >
                    {isLaunching ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Eye className="w-4 h-4 mr-2" />
                    )}
                    Preview: {selectedTemplate} / {selectedBrand}
                </Button>
            </div>
        </div>
    );
}

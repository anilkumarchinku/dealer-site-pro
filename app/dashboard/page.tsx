"use client"
import { useState, useEffect } from "react";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WebsiteLiveBanner from "@/components/WebsiteLiveBanner";
import Link from "next/link";
import {
    Users, Car, Calendar, Plus, ArrowRight, Eye,
    Mail, Phone, Clock, Target, Zap, BarChart3, Loader2, ChevronDown,
    Check, Pencil, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isSupabaseReady, supabase } from "@/lib/supabase";
import type { Brand } from "@/lib/types";
import { fetchAnalyticsSummary, fetchTopVehicles, type TopVehicle } from "@/lib/db/analytics";
import { fetchLeads, type ExternalLead } from "@/lib/db/leads";
import { DealerScorecard } from "@/components/dashboard/DealerScorecard";

const CAR_BRANDS: { name: Brand; logo: string }[] = [
    { name: "Maruti Suzuki",  logo: "/assets/logos/maruti-suzuki.png" },
    { name: "Tata Motors",    logo: "/assets/logos/tata-motors.png" },
    { name: "Mahindra",       logo: "/assets/logos/mahindra.png" },
    { name: "Hyundai",        logo: "/assets/logos/hyundai.png" },
    { name: "Honda",          logo: "/assets/logos/honda.png" },
    { name: "Toyota",         logo: "/assets/logos/toyota.png" },
    { name: "Kia",            logo: "/assets/logos/kia.png" },
    { name: "Renault",        logo: "/assets/logos/renault.png" },
    { name: "Nissan",         logo: "/assets/logos/nissan.png" },
    { name: "Volkswagen",     logo: "/assets/logos/volkswagen.png" },
    { name: "Skoda",          logo: "/assets/logos/skoda.png" },
    { name: "MG",             logo: "/assets/logos/mg.png" },
    { name: "Jeep",           logo: "/assets/logos/jeep.png" },
    { name: "Citroen",        logo: "/assets/logos/citroen.png" },
    { name: "Force Motors",   logo: "/assets/logos/force-motors.png" },
    { name: "Isuzu",          logo: "/assets/logos/isuzu.png" },
    { name: "Mercedes-Benz",  logo: "/assets/logos/mercedes-benz.png" },
    { name: "BMW",            logo: "/assets/logos/bmw.png" },
    { name: "Audi",           logo: "/assets/logos/audi.png" },
    { name: "Jaguar",         logo: "/assets/logos/jaguar.png" },
    { name: "Land Rover",     logo: "/assets/logos/land-rover.png" },
    { name: "Volvo",          logo: "/assets/logos/volvo.png" },
    { name: "Lexus",          logo: "/assets/logos/lexus.png" },
    { name: "Porsche",        logo: "/assets/logos/porsche.png" },
    { name: "Bentley",        logo: "/assets/logos/bentley.png" },
    { name: "Lamborghini",    logo: "/assets/logos/lamborghini.png" },
    { name: "BYD",            logo: "/assets/logos/byd.png" },
    { name: "Tesla",          logo: "/assets/logos/tesla.png" },
]

const QUICK_ACTIONS = [
    { label: "Add Vehicle", href: "/dashboard/inventory/add", icon: Plus,      color: "blue"    },
    { label: "View Leads",  href: "/dashboard/leads",          icon: Users,     color: "emerald" },
    { label: "Analytics",   href: "/dashboard/analytics",      icon: BarChart3, color: "violet"  },
    { label: "Messages",    href: "/dashboard/messages",       icon: Mail,      color: "amber"   },
];

const COLOR = {
    blue:    { bg: "bg-primary/10",     text: "text-primary"     },
    emerald: { bg: "bg-green-500/10",   text: "text-green-500"   },
    violet:  { bg: "bg-violet-500/10",  text: "text-violet-500"  },
    amber:   { bg: "bg-amber-500/10",   text: "text-amber-500"   },
};

const priorityColors = {
    hot:  { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20", dot: "bg-destructive" },
    warm: { bg: "bg-amber-500/10",   text: "text-amber-500",   border: "border-amber-500/20",   dot: "bg-amber-500"   },
    cold: { bg: "bg-primary/10",     text: "text-primary",     border: "border-primary/20",     dot: "bg-primary"     },
};

export default function DashboardPage() {
    const { data, dealerId, dealerSlug, updateData } = useOnboardingStore();
    const primaryBrand = data.brands?.[0] ?? "Maruti Suzuki";
    const isMultiBrand  = (data.brands?.length ?? 0) > 1;
    const isFirstHand   = data.sellsNewCars && !data.sellsUsedCars;
    const previewSlug = dealerSlug ?? data.slug ?? "";

    const [showBrandPicker, setShowBrandPicker] = useState(false);

    // Info & Brands editing
    const [editingBrands, setEditingBrands] = useState(false);
    const [selectedBrands, setSelectedBrands] = useState<Brand[]>([]);
    const [savingBrands, setSavingBrands] = useState(false);
    const [brandSearch, setBrandSearch] = useState("");

    const [statsLoading, setStatsLoading] = useState(false);
    const [leadsLoading, setLeadsLoading] = useState(false);
    const [visitors, setVisitors]         = useState<number | null>(null);
    const [leadsCount, setLeadsCount]     = useState<number | null>(null);
    const [testDrives, setTestDrives]     = useState<number | null>(null);
    const [recentLeads, setRecentLeads]   = useState<ExternalLead[]>([]);
    const [topVehicles, setTopVehicles]   = useState<TopVehicle[]>([]);

    // Safety net: if dealerId is missing from local store (new device / cleared cache),
    // fetch it from DB. If user has no dealer record at all, send them to onboarding.
    useEffect(() => {
        if (!isSupabaseReady() || dealerId) return;
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) return;
            supabase
                .from("dealers")
                .select("id, onboarding_complete")
                .eq("user_id", user.id)
                .maybeSingle()
                .then(({ data: dealer }) => {
                    if (!dealer) {
                        window.location.href = "/onboarding";
                    } else {
                        useOnboardingStore.setState({ dealerId: dealer.id });
                    }
                });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isSupabaseReady() || !dealerId) return;

        setStatsLoading(true);
        fetchAnalyticsSummary(dealerId, 30)
            .then(s => {
                if (s) {
                    setVisitors(s.visitors);
                    setLeadsCount(s.leads);
                    setTestDrives(s.testDrives);
                }
            })
            .catch(() => {})
            .finally(() => setStatsLoading(false));

        setLeadsLoading(true);
        Promise.all([
            fetchLeads(dealerId),
            fetchTopVehicles(dealerId, 4),
        ]).then(([leads, vehicles]) => {
            setRecentLeads(leads.slice(0, 4));
            setTopVehicles(vehicles);
        }).catch(() => {}).finally(() => setLeadsLoading(false));
        return;
    }, [dealerId]);

    async function saveCarBrands() {
        if (!dealerId) return;
        setSavingBrands(true);
        try {
            await supabase.from("dealer_brands").delete().eq("dealer_id", dealerId);
            if (selectedBrands.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await (supabase.from("dealer_brands") as any).insert(
                    selectedBrands.map((name, i) => ({
                        dealer_id:  dealerId,
                        brand_name: name,
                        is_primary: i === 0,
                    }))
                );
            }
            updateData({ brands: selectedBrands });
            setEditingBrands(false);
        } finally {
            setSavingBrands(false);
        }
    }

    const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

    const timeAgo = (iso: string): string => {
        if (!iso) return "";
        const diff = Date.now() - new Date(iso).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    };

    const formatType = (type: string) =>
        type.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

    const STATS = [
        { label: "Total Visitors", value: visitors,   icon: Eye,      color: "blue"    as const },
        { label: "Active Leads",   value: leadsCount, icon: Users,    color: "emerald" as const },
        { label: "Test Drives",    value: testDrives, icon: Calendar, color: "violet"  as const },
        { label: "Inventory",      value: null,       icon: Car,      color: "amber"   as const },
    ];

    return (
        <div className="space-y-8 pb-8 animate-fade-in">
            {/* Welcome */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Welcome back, {data.dealershipName || "Dealer"}!
                    </h1>
                    <p className="text-muted-foreground">Here's what's happening with your dealership today.</p>
                    {data.brands && data.brands.length > 0 && (
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="text-sm text-muted-foreground">Brands:</span>
                            {data.brands.map((brand, i) => (
                                <span
                                    key={brand}
                                    className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-medium border",
                                        i === 0
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-secondary text-secondary-foreground border-border"
                                    )}
                                >
                                    {brand} {i === 0 && "★"}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {/* View Website — single brand: direct link; multi-brand: picker */}
                    {isMultiBrand ? (
                        <div className="relative">
                            <Button
                                variant="outline"
                                className="gap-2"
                                onClick={() => setShowBrandPicker(v => !v)}
                            >
                                <Eye className="w-4 h-4" />
                                View Website
                                <ChevronDown className={cn("w-4 h-4 transition-transform", showBrandPicker && "rotate-180")} />
                            </Button>
                            {showBrandPicker && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowBrandPicker(false)} />
                                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover shadow-lg z-20 overflow-hidden">
                                        <div className="px-3 py-2 border-b border-border">
                                            <p className="text-xs font-medium text-muted-foreground">Choose a brand website</p>
                                        </div>
                                        {data.brands?.map(brand => (
                                            <Link
                                                key={brand}
                                                href={`/preview?brand=${encodeURIComponent(brand)}&template=${data.styleTemplate || "modern"}${previewSlug ? `&slug=${encodeURIComponent(previewSlug)}` : ''}`}
                                                onClick={() => setShowBrandPicker(false)}
                                            >
                                                <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 cursor-pointer">
                                                    <div className="p-1.5 rounded-lg bg-primary/10">
                                                        <Car className="w-3.5 h-3.5 text-primary" />
                                                    </div>
                                                    <span className="text-sm font-medium">{brand}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <Link href={`/preview?brand=${encodeURIComponent(primaryBrand)}&template=${data.styleTemplate || "modern"}${previewSlug ? `&slug=${encodeURIComponent(previewSlug)}` : ''}`}>
                            <Button variant="outline" className="gap-2">
                                <Eye className="w-4 h-4" />
                                View Website
                            </Button>
                        </Link>
                    )}
                    {!isFirstHand && (
                        <Link href="/dashboard/inventory/add">
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add Vehicle
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* ── Info & Brands ─────────────────────────────────────────── */}
            <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="font-semibold text-base">Info &amp; Brands</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {data.dealershipName || "Your dealership"} · {data.location || ""}
                        </p>
                    </div>
                    {!editingBrands && (
                        <Button size="sm" variant="outline" onClick={() => { setSelectedBrands(data.brands ?? []); setBrandSearch(""); setEditingBrands(true); }}>
                            <Pencil className="w-3.5 h-3.5 mr-1.5" />
                            {(data.brands?.length ?? 0) === 0 ? "Select Brands" : "Edit Brands"}
                        </Button>
                    )}
                </div>

                {!editingBrands && (
                    (data.brands?.length ?? 0) > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {data.brands!.map((brand, i) => {
                                const match = CAR_BRANDS.find(b => b.name === brand)
                                return (
                                    <div key={brand} className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border border-border">
                                        {match && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={match.logo} alt={brand} className="w-6 h-6 rounded-full object-contain" onError={e => (e.currentTarget.style.display = "none")} />
                                        )}
                                        <span className="text-sm font-medium">{brand}</span>
                                        {i === 0 && <span className="text-[10px] text-muted-foreground">(Primary)</span>}
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No brands selected yet. Click &quot;Select Brands&quot; to choose your car brands.</p>
                    )
                )}

                {editingBrands && (
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Search brands..."
                            value={brandSearch}
                            onChange={e => setBrandSearch(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                            {CAR_BRANDS.filter(b => !brandSearch.trim() || b.name.toLowerCase().includes(brandSearch.toLowerCase())).map(b => {
                                const isSel = selectedBrands.includes(b.name)
                                return (
                                    <button
                                        key={b.name}
                                        onClick={() => setSelectedBrands(prev => isSel ? prev.filter(x => x !== b.name) : [...prev, b.name])}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all text-left ${isSel ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/30 text-foreground hover:border-primary/40"}`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={b.logo} alt={b.name} className="w-6 h-6 object-contain" onError={e => (e.currentTarget.style.display = "none")} />
                                        <span className="flex-1 truncate text-xs">{b.name}</span>
                                        {isSel && <Check className="w-3 h-3 shrink-0" />}
                                    </button>
                                )
                            })}
                        </div>
                        {selectedBrands.length > 0 && (
                            <p className="text-xs text-muted-foreground">{selectedBrands.length} brand{selectedBrands.length > 1 ? "s" : ""} selected · First is primary</p>
                        )}
                        <div className="flex items-center gap-2 pt-1">
                            <Button size="sm" onClick={saveCarBrands} disabled={savingBrands || selectedBrands.length === 0}>
                                {savingBrands ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Check className="w-3.5 h-3.5 mr-1.5" />}
                                Save Brands
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingBrands(false)} disabled={savingBrands}>
                                <X className="w-3.5 h-3.5 mr-1.5" />Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Go Live Banner */}
            {dealerId && (
                <WebsiteLiveBanner
                    dealerId={dealerId}
                    dealershipName={data.dealershipName || "your dealership"}
                    vehicleCount={topVehicles.length}
                    sellsNewCars={data.sellsNewCars ?? false}
                    sellsUsedCars={data.sellsUsedCars ?? false}
                    brands={data.brands ?? []}
                    slug={data.slug ?? ""}
                />
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, i) => (
                    <Card key={i} className="hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="mb-4">
                                <div className={cn("p-3 rounded-xl w-fit", COLOR[stat.color].bg)}>
                                    <stat.icon className={cn("w-6 h-6", COLOR[stat.color].text)} />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-3xl font-bold">
                                {statsLoading
                                    ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                    : stat.value !== null ? fmt(stat.value) : "—"
                                }
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Leads */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex-row items-center justify-between pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <Users className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Recent Leads</CardTitle>
                                <p className="text-sm text-muted-foreground">Latest inquiries from customers</p>
                            </div>
                        </div>
                        <Link href="/dashboard/leads">
                            <Button variant="ghost" size="sm" className="gap-1">
                                View All <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {leadsLoading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 animate-pulse">
                                        <div className="w-12 h-12 rounded-full bg-muted shrink-0" />
                                        <div className="flex-1 space-y-2 pt-1">
                                            <div className="h-3.5 bg-muted rounded-full w-1/3" />
                                            <div className="h-3 bg-muted rounded-full w-1/2" />
                                            <div className="h-3 bg-muted rounded-full w-2/3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : recentLeads.length === 0 ? (
                            <div className="text-center py-16 text-muted-foreground">
                                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p className="font-medium">No leads yet</p>
                                <p className="text-sm mt-1">New customer inquiries will appear here</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentLeads.map((lead) => {
                                    const pc = priorityColors[lead.priority as keyof typeof priorityColors] ?? priorityColors.cold;
                                    const initials = lead.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                                    return (
                                        <div key={lead.id} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0">
                                                {initials}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="font-semibold text-foreground">{lead.name}</h4>
                                                    <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border", pc.bg, pc.text, pc.border)}>
                                                        <div className={cn("w-1.5 h-1.5 rounded-full", pc.dot)} />
                                                        {lead.priority.toUpperCase()}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    <span className="font-medium text-foreground">{formatType(lead.type)}</span>
                                                    {lead.vehicle_interest ? ` • ${lead.vehicle_interest}` : ""}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</span>
                                                    {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>}
                                                </div>
                                            </div>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                                                <Clock className="w-3 h-3" />{timeAgo(lead.created_at)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Right column */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-violet-500/10">
                                    <Zap className="w-5 h-5 text-violet-500" />
                                </div>
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            {QUICK_ACTIONS.filter(a => !(isFirstHand && a.href === "/dashboard/inventory/add")).map((action, i) => (
                                <Link key={i} href={action.href}>
                                    <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 hover:bg-muted/50">
                                        <div className={cn("p-2 rounded-lg", COLOR[action.color as keyof typeof COLOR].bg)}>
                                            <action.icon className={cn("w-5 h-5", COLOR[action.color as keyof typeof COLOR].text)} />
                                        </div>
                                        <span className="text-xs font-medium">{action.label}</span>
                                    </Button>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Performance Scorecard */}
                    <DealerScorecard
                        dealerId={dealerId ?? ''}
                        inventoryCount={topVehicles.length}
                        leadsCount={leadsCount ?? 0}
                        isVerified={false}
                        avgRating={0}
                        reviewCount={0}
                        profileComplete={!!(data.dealershipName && data.phone && data.email)}
                    />

                    {/* Top Vehicles */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Car className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Top Vehicles</CardTitle>
                                    <p className="text-sm text-muted-foreground">Most viewed this month</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {leadsLoading ? (
                                <div className="flex items-center justify-center py-4 text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                </div>
                            ) : topVehicles.length === 0 ? (
                                <div className="text-center py-4 text-muted-foreground">
                                    <Car className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">Add vehicles to track performance</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {topVehicles.map((v, i) => (
                                        <div key={v.id} className="flex items-center gap-4">
                                            <span className="text-sm text-muted-foreground w-5">{i + 1}.</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{v.make} {v.model}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{v.views}</span>
                                                <span className="flex items-center gap-1"><Target className="w-3 h-3" />{v.leads_count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

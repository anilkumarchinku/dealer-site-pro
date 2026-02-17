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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isSupabaseReady } from "@/lib/supabase";
import { fetchAnalyticsSummary, fetchTopVehicles, type TopVehicle } from "@/lib/db/analytics";
import { fetchLeads, type ExternalLead } from "@/lib/db/leads";

const QUICK_ACTIONS = [
    { label: "Add Vehicle", href: "/dashboard/inventory/add", icon: Plus,      color: "blue"    },
    { label: "View Leads",  href: "/dashboard/leads",          icon: Users,     color: "emerald" },
    { label: "Analytics",   href: "/dashboard/analytics",      icon: BarChart3, color: "violet"  },
    { label: "Messages",    href: "/dashboard/messages",       icon: Mail,      color: "amber"   },
];

const COLOR = {
    blue:    { bg: "bg-blue-500/10",    text: "text-blue-500"    },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500" },
    violet:  { bg: "bg-violet-500/10",  text: "text-violet-500"  },
    amber:   { bg: "bg-amber-500/10",   text: "text-amber-500"   },
};

const priorityColors = {
    hot:  { bg: "bg-red-500/10",   text: "text-red-500",   border: "border-red-500/20",   dot: "bg-red-500"   },
    warm: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20", dot: "bg-amber-500" },
    cold: { bg: "bg-blue-500/10",  text: "text-blue-500",  border: "border-blue-500/20",  dot: "bg-blue-500"  },
};

export default function DashboardPage() {
    const { data, dealerId } = useOnboardingStore();
    const primaryBrand = data.brands?.[0] ?? "Maruti Suzuki";
    const isMultiBrand  = (data.brands?.length ?? 0) > 1;

    const [showBrandPicker, setShowBrandPicker] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);
    const [leadsLoading, setLeadsLoading] = useState(false);
    const [visitors, setVisitors]         = useState<number | null>(null);
    const [leadsCount, setLeadsCount]     = useState<number | null>(null);
    const [testDrives, setTestDrives]     = useState<number | null>(null);
    const [recentLeads, setRecentLeads]   = useState<ExternalLead[]>([]);
    const [topVehicles, setTopVehicles]   = useState<TopVehicle[]>([]);

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
    }, [dealerId]);

    const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

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
                    <h1 className="text-3xl font-bold text-foreground">
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
                                                href={`/preview?brand=${encodeURIComponent(brand)}&template=${data.styleTemplate || "modern"}`}
                                                onClick={() => setShowBrandPicker(false)}
                                            >
                                                <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 cursor-pointer">
                                                    <div className="p-1.5 rounded-lg bg-blue-500/10">
                                                        <Car className="w-3.5 h-3.5 text-blue-500" />
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
                        <Link href={`/preview?brand=${encodeURIComponent(primaryBrand)}&template=${data.styleTemplate || "modern"}`}>
                            <Button variant="outline" className="gap-2">
                                <Eye className="w-4 h-4" />
                                View Website
                            </Button>
                        </Link>
                    )}
                    <Link href="/dashboard/inventory/add">
                        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                            <Plus className="w-4 h-4" />
                            Add Vehicle
                        </Button>
                    </Link>
                </div>
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
                            <div className="p-2 rounded-lg bg-emerald-500/10">
                                <Users className="w-5 h-5 text-emerald-500" />
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
                            <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-sm">Loading leads…</span>
                            </div>
                        ) : recentLeads.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
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
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
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
                                                    <span className="font-medium text-foreground">{lead.type.replace("_", " ")}</span>
                                                    {lead.vehicle_interest ? ` • ${lead.vehicle_interest}` : ""}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</span>
                                                    {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>}
                                                </div>
                                            </div>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                                                <Clock className="w-3 h-3" />{lead.created_at}
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
                            {QUICK_ACTIONS.map((action, i) => (
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

                    {/* Top Vehicles */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10">
                                    <Car className="w-5 h-5 text-blue-500" />
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
                                        <div key={v.id} className="flex items-center gap-3">
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

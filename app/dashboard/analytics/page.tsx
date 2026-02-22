"use client"
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Users, Eye, MousePointer, Car, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchAnalyticsSummary, fetchTopVehicles, type AnalyticsSummary, type TopVehicle } from "@/lib/db/analytics";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { isSupabaseReady } from "@/lib/supabase";


const DATE_RANGE_DAYS: Record<string, number> = {
    "last-7-days": 7, "last-30-days": 30, "last-90-days": 90,
};

export default function AnalyticsPage() {
    const { dealerId } = useOnboardingStore();
    const [dateRange, setDateRange] = useState("last-30-days");
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [topVehicles, setTopVehicles] = useState<TopVehicle[]>([]);
    const [loading, setLoading] = useState(false);

    const useDB = isSupabaseReady() && !!dealerId;

    useEffect(() => {
        if (!useDB) return;
        const days = DATE_RANGE_DAYS[dateRange] ?? 30;
        setLoading(true);
        Promise.all([
            fetchAnalyticsSummary(dealerId!, days),
            fetchTopVehicles(dealerId!, 5),
        ]).then(([s, tv]) => {
            setSummary(s);
            setTopVehicles(tv);
        }).finally(() => setLoading(false));
    }, [dealerId, dateRange, useDB]);

    // Format large numbers
    const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

    // Derived display values — all zero/empty when no data loaded
    const data = summary;
    const rows = data?.rows ?? [];
    const maxVisitors = Math.max(...rows.map((r: AnalyticsSummary["rows"][0]) => r.unique_visitors), 1);

    const totalTraffic = data ? (data.organic + data.social + data.direct + data.referral || 1) : 1;
    const trafficSources = [
        { source: "Organic Search", visits: data?.organic  ?? 0, percentage: data ? Math.round((data.organic  / totalTraffic) * 100) : 0, color: "bg-blue-500"    },
        { source: "Social Media",   visits: data?.social   ?? 0, percentage: data ? Math.round((data.social   / totalTraffic) * 100) : 0, color: "bg-violet-500"  },
        { source: "Direct",         visits: data?.direct   ?? 0, percentage: data ? Math.round((data.direct   / totalTraffic) * 100) : 0, color: "bg-emerald-500" },
        { source: "Referral",       visits: data?.referral ?? 0, percentage: data ? Math.round((data.referral / totalTraffic) * 100) : 0, color: "bg-amber-500"   },
    ];

    // Top pages aggregated from daily rows
    const topPages = (() => {
        if (!data || rows.length === 0) return [];
        const agg: Record<string, number> = {};
        rows.forEach((r: AnalyticsSummary["rows"][0]) => {
            (r.top_pages || []).forEach((p: { page: string; views: number }) => {
                agg[p.page] = (agg[p.page] ?? 0) + p.views;
            });
        });
        const entries = Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 5);
        if (entries.length === 0) return [];
        const maxV = entries[0][1] || 1;
        return entries.map(([page, views]) => ({ page, views, percentage: Math.round(views / maxV * 100) }));
    })();

    const STATS = [
        { label: "Total Visitors", value: loading ? null : (data ? fmt(data.visitors)      : "—"), icon: Eye,          bg: "bg-primary/10",    text: "text-primary"    },
        { label: "New Leads",      value: loading ? null : (data ? String(data.leads)      : "—"), icon: Users,        bg: "bg-green-500/10", text: "text-green-500" },
        { label: "Page Views",     value: loading ? null : (data ? fmt(data.pageViews)     : "—"), icon: MousePointer, bg: "bg-violet-500/10",  text: "text-violet-500"  },
        { label: "Test Drives",    value: loading ? null : (data ? String(data.testDrives) : "—"), icon: Car,          bg: "bg-amber-500/10",   text: "text-amber-500"   },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Analytics</h1>
                    <p className="text-muted-foreground">Track your website performance and visitor behavior</p>
                </div>
                {!useDB && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full font-medium">
                        Demo data
                    </span>
                )}
            </div>

            {/* Date Range */}
            <Card variant="glass">
                <CardContent className="py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Showing data for:</span>
                            <Select value={dateRange} onValueChange={setDateRange}>
                                <SelectTrigger className="w-[160px] h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="last-7-days">Last 7 days</SelectItem>
                                    <SelectItem value="last-30-days">Last 30 days</SelectItem>
                                    <SelectItem value="last-90-days">Last 90 days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {data ? `${data.avgMobilePct}% mobile · ${data.avgDesktopPct}% desktop` : "—"}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className={cn("p-3 rounded-xl", stat.bg)}>
                                    <stat.icon className={cn("w-6 h-6", stat.text)} />
                                </div>
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <p className="text-3xl font-bold">
                                    {stat.value === null
                                        ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                        : stat.value}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Visitors Bar Chart */}
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle>Daily Visitors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-64 flex items-center justify-center text-muted-foreground gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-sm">Loading…</span>
                            </div>
                        ) : rows.length === 0 ? (
                            <div className="h-64 flex items-center justify-center text-muted-foreground">
                                <p className="text-sm">No visitor data yet</p>
                            </div>
                        ) : (
                            <>
                                <div className="h-64 flex items-end justify-between gap-1">
                                    {rows.map((row, i) => (
                                        <div
                                            key={i}
                                            title={`${row.date}: ${row.unique_visitors} visitors`}
                                            className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all hover:opacity-80 cursor-default"
                                            style={{ height: `${Math.max(4, (row.unique_visitors / maxVisitors) * 100)}%` }}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                                    <span>{rows[0]?.date?.slice(5)}</span>
                                    <span>{rows[Math.floor(rows.length / 2)]?.date?.slice(5)}</span>
                                    <span>{rows[rows.length - 1]?.date?.slice(5)}</span>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Traffic Sources */}
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle>Traffic Sources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {trafficSources.map((source, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">{source.source}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {source.visits.toLocaleString("en-IN")} ({source.percentage}%)
                                    </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all", source.color)}
                                        style={{ width: `${source.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Top Pages + Top Vehicles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Pages */}
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle>Top Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topPages.map((page, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <span className="text-sm text-muted-foreground w-5">{index + 1}.</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-sm">{page.page}</span>
                                            <span className="text-xs text-muted-foreground">{page.views.toLocaleString("en-IN")}</span>
                                        </div>
                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${page.percentage}%` }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Vehicles */}
                <Card variant="glass">
                    <CardHeader>
                        <CardTitle>Top Performing Vehicles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Loading…</span>
                            </div>
                        ) : topVehicles.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Car className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">Add vehicles to see performance data</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {topVehicles.map((v, i) => (
                                    <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                                        <span className="text-sm text-muted-foreground w-5">{i + 1}.</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{v.make} {v.model}</p>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" /> {v.views}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" /> {v.leads_count}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

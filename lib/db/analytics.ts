"use client";

import { supabase, isSupabaseReady } from "@/lib/supabase";

export interface AnalyticsDayRow {
    date: string;
    unique_visitors: number;
    page_views: number;
    leads_count: number;
    test_drives_count: number;
    calls_count: number;
    whatsapp_count: number;
    organic_traffic: number;
    social_traffic: number;
    direct_traffic: number;
    referral_traffic: number;
    mobile_pct: number | null;
    desktop_pct: number | null;
    top_pages: { page: string; views: number }[];
}

export interface AnalyticsSummary {
    visitors: number;
    pageViews: number;
    leads: number;
    testDrives: number;
    organic: number;
    social: number;
    direct: number;
    referral: number;
    // Derived
    avgMobilePct: number;
    avgDesktopPct: number;
    rows: AnalyticsDayRow[];   // daily rows for the bar chart
}

export interface TopVehicle {
    id: string;
    make: string;
    model: string;
    views: number;
    leads_count: number;
}

// ── Fetch analytics for a date range ─────────────────────────
export async function fetchAnalyticsSummary(
    dealerId: string,
    days = 30
): Promise<AnalyticsSummary | null> {
    if (!isSupabaseReady()) return null;

    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await supabase
        .from("analytics_daily")
        .select(`
            date, unique_visitors, page_views,
            leads_count, test_drives_count, calls_count, whatsapp_count,
            organic_traffic, social_traffic, direct_traffic, referral_traffic,
            mobile_pct, desktop_pct, top_pages
        `)
        .eq("dealer_id", dealerId)
        .gte("date", since.toISOString().split("T")[0])
        .order("date", { ascending: true });

    if (error) {
        console.warn("[fetchAnalyticsSummary]", error.message);
        return null;
    }

    const rows = (data ?? []) as AnalyticsDayRow[];
    if (rows.length === 0) return null;

    const sum = (key: keyof AnalyticsDayRow) =>
        rows.reduce((s, r) => s + ((r[key] as number) ?? 0), 0);

    const mobilePcts = rows.filter(r => r.mobile_pct != null).map(r => r.mobile_pct!);
    const desktopPcts = rows.filter(r => r.desktop_pct != null).map(r => r.desktop_pct!);

    return {
        visitors:     sum("unique_visitors"),
        pageViews:    sum("page_views"),
        leads:        sum("leads_count"),
        testDrives:   sum("test_drives_count"),
        organic:      sum("organic_traffic"),
        social:       sum("social_traffic"),
        direct:       sum("direct_traffic"),
        referral:     sum("referral_traffic"),
        avgMobilePct:  mobilePcts.length  ? Math.round(mobilePcts.reduce((a, b) => a + b, 0)  / mobilePcts.length)  : 65,
        avgDesktopPct: desktopPcts.length ? Math.round(desktopPcts.reduce((a, b) => a + b, 0) / desktopPcts.length) : 28,
        rows,
    };
}

// ── Fetch top performing vehicles ────────────────────────────
export async function fetchTopVehicles(
    dealerId: string,
    limit = 5
): Promise<TopVehicle[]> {
    if (!isSupabaseReady()) return [];

    const { data, error } = await supabase
        .from("vehicles")
        .select("id, make, model, views, leads_count")
        .eq("dealer_id", dealerId)
        .neq("status", "inactive")
        .order("views", { ascending: false })
        .limit(limit);

    if (error) {
        console.warn("[fetchTopVehicles]", error.message);
        return [];
    }

    return (data ?? []).map((v: { id: string; make: string; model: string; views: number; leads_count: number }) => ({
        id:          v.id,
        make:        v.make,
        model:       v.model,
        views:       v.views,
        leads_count: v.leads_count,
    }));
}

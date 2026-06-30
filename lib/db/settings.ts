"use client";

import { supabase, isSupabaseReady } from "@/lib/supabase";
import type { Json } from "@/lib/database.types";

export interface DealerProfile {
    dealership_name: string;
    tagline?: string | null;
    location: string | null;
    full_address?: string | null;
    phone: string | null;
    whatsapp?: string | null;
    email: string | null;
    gstin?: string | null;
    years_in_business?: number | null;
    style_template: string | null;
    subdomain?: string | null;
}

export interface TemplateConfig {
    hero_title?: string | null;
    hero_subtitle?: string | null;
    hero_cta_text?: string | null;
    features_title?: string | null;
    facebook_url?: string | null;
    instagram_url?: string | null;
    twitter_url?: string | null;
    youtube_url?: string | null;
    linkedin_url?: string | null;
    working_hours?: string | null;
}

export interface NotificationSettings {
    new_leads: boolean;
    test_drives: boolean;
    service_bookings: boolean;
    new_reviews: boolean;
    weekly_report: boolean;
}

type DynamicSettingsTable = {
    select(columns: string): {
        eq(column: string, value: unknown): {
            single(): Promise<{ data: NotificationSettings | null; error: { message: string } | null }>
        }
    }
    upsert(
        payload: NotificationSettings & { dealer_id: string },
        options: { onConflict: string }
    ): Promise<{ error: { message: string } | null }>
}

function dynamicTable(table: string): DynamicSettingsTable {
    return (supabase as unknown as { from(name: string): DynamicSettingsTable }).from(table)
}

// ── Outlet types ──────────────────────────────────────────────
export interface OutletRow {
    id: string;
    brand_name: string;
    vehicle_type: string | null;
    is_primary: boolean;
    outlet_name: string | null;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    full_address: string | null;
    city: string | null;
    state: string | null;
    google_maps_url: string | null;
    branches: Json | null;
}

export interface OutletProfileUpdate {
    outlet_name?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    email?: string | null;
    full_address?: string | null;
    city?: string | null;
    state?: string | null;
    google_maps_url?: string | null;
    branches?: Json | null;
}

// ── Fetch all outlets for a dealer ────────────────────────────
export async function fetchDealerOutlets(
    dealerId: string
): Promise<OutletRow[]> {
    if (!isSupabaseReady()) return [];

    const { data, error } = await supabase
        .from("dealer_brands")
        .select("id, brand_name, vehicle_type, is_primary, outlet_name, phone, whatsapp, email, full_address, city, state, google_maps_url, branches")
        .eq("dealer_id", dealerId)
        .order("is_primary", { ascending: false });

    if (error) {
        console.error("[fetchDealerOutlets]", error.message);
        return [];
    }
    return (data ?? []) as unknown as OutletRow[];
}

// ── Update a single outlet's profile ──────────────────────────
export async function updateOutletProfile(
    outletId: string,
    dealerId: string,
    fields: OutletProfileUpdate
): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseReady()) return { success: true };

    const { error } = await supabase
        .from("dealer_brands")
        .update(fields)
        .eq("id", outletId)
        .eq("dealer_id", dealerId);

    if (error) return { success: false, error: error.message };
    return { success: true };
}

// ── Create "Used Cars" outlet for hybrid dealers ──────────────
export async function createUsedCarsOutlet(
    dealerId: string,
    fields?: OutletProfileUpdate
): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseReady()) return { success: true };

    const { error } = await supabase
        .from("dealer_brands")
        .insert({
            dealer_id: dealerId,
            brand_name: "Used Cars",
            vehicle_type: "used",
            is_primary: false,
            ...(fields ?? {}),
        });

    if (error) return { success: false, error: error.message };
    return { success: true };
}

// ── Fetch dealer profile by ID ────────────────────────────────
export async function fetchDealerProfile(
    dealerId: string
): Promise<DealerProfile | null> {
    if (!isSupabaseReady()) return null;

    const { data, error } = await supabase
        .from("dealers")
        .select(`
            dealership_name, tagline, location, full_address,
            phone, whatsapp, email, gstin, years_in_business,
            style_template, subdomain
        `)
        .eq("id", dealerId)
        .single();

    if (error) {
        console.error("[fetchDealerProfile]", error.message);
        return null;
    }
    return data as unknown as DealerProfile;
}

// ── Update dealer profile ─────────────────────────────────────
export async function updateDealerProfile(
    dealerId: string,
    profile: Partial<DealerProfile>
): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseReady()) return { success: true }; // graceful no-op

    const { error } = await supabase
        .from("dealers")
        .update(profile)
        .eq("id", dealerId);

    if (error) return { success: false, error: error.message };
    return { success: true };
}

// ── Fetch template config ─────────────────────────────────────
export async function fetchTemplateConfig(
    dealerId: string
): Promise<TemplateConfig | null> {
    if (!isSupabaseReady()) return null;

    const { data, error } = await supabase
        .from("dealer_template_configs")
        .select("*")
        .eq("dealer_id", dealerId)
        .single();

    if (error) {
        console.error("[fetchTemplateConfig]", error.message);
        return null;
    }
    return data as unknown as TemplateConfig;
}

// ── Update template config ────────────────────────────────────
export async function updateTemplateConfig(
    dealerId: string,
    config: Partial<TemplateConfig>
): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseReady()) return { success: true };

    const { error } = await supabase
        .from("dealer_template_configs")
        .upsert({ dealer_id: dealerId, ...config }, { onConflict: "dealer_id" });

    if (error) return { success: false, error: error.message };
    return { success: true };
}

// ── Fetch notification settings ───────────────────────────────
export async function fetchNotificationSettings(
    dealerId: string
): Promise<NotificationSettings | null> {
    if (!isSupabaseReady()) return null;

    const { data, error } = await dynamicTable("notification_settings")
        .select("new_leads, test_drives, service_bookings, new_reviews, weekly_report")
        .eq("dealer_id", dealerId)
        .single();

    if (error) {
        console.error("[fetchNotificationSettings]", error.message);
        return null;
    }
    return data as NotificationSettings | null;
}

// ── Save notification settings ────────────────────────────────
export async function saveNotificationSettings(
    dealerId: string,
    settings: NotificationSettings
): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseReady()) return { success: true };

    const { error } = await dynamicTable("notification_settings")
        .upsert({ dealer_id: dealerId, ...settings }, { onConflict: "dealer_id" });

    if (error) return { success: false, error: error.message };
    return { success: true };
}

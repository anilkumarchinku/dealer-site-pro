"use client";

import { supabase, isSupabaseReady } from "@/lib/supabase";

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
        .from("notification_settings")
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
        .from("notification_settings")
        .upsert({ dealer_id: dealerId, ...settings }, { onConflict: "dealer_id" });

    if (error) return { success: false, error: error.message };
    return { success: true };
}

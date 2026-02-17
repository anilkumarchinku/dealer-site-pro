"use client";

import { supabase, isSupabaseReady } from "@/lib/supabase";

export interface DealerProfile {
    dealership_name: string;
    tagline?: string;
    location: string;
    full_address?: string;
    phone: string;
    whatsapp?: string;
    email: string;
    gstin?: string;
    years_in_business?: number;
    style_template: string;
    subdomain?: string;
}

export interface TemplateConfig {
    hero_title?: string;
    hero_subtitle?: string;
    hero_cta_text?: string;
    features_title?: string;
    facebook_url?: string;
    instagram_url?: string;
    twitter_url?: string;
    youtube_url?: string;
    linkedin_url?: string;
    working_hours?: string;
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
    return data;
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
    return data;
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

    const { data, error } = await supabase
        .from("notification_settings")
        .select("new_leads, test_drives, service_bookings, new_reviews, weekly_report")
        .eq("dealer_id", dealerId)
        .single();

    if (error) {
        console.error("[fetchNotificationSettings]", error.message);
        return null;
    }
    return data;
}

// ── Save notification settings ────────────────────────────────
export async function saveNotificationSettings(
    dealerId: string,
    settings: NotificationSettings
): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseReady()) return { success: true };

    const { error } = await supabase
        .from("notification_settings")
        .upsert({ dealer_id: dealerId, ...settings }, { onConflict: "dealer_id" });

    if (error) return { success: false, error: error.message };
    return { success: true };
}

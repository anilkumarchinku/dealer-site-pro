"use client";

import { supabase, isSupabaseReady } from "@/lib/supabase";
import { generateSlug, makeSlugUnique } from "@/lib/utils/slug";
import type { OnboardingData } from "@/lib/types";

export interface SaveDealerResult {
    success: boolean;
    dealerId?: string;
    slug?: string;
    error?: string;
}

/**
 * Saves the complete onboarding data to Supabase.
 * Inserts: dealers, dealer_brands, dealer_services, dealer_template_configs
 *
 * Safe to call even when Supabase is not configured — returns success:true
 * with no dealerId so the UI can proceed without blocking the user.
 */
export async function saveDealer(
    data: Partial<OnboardingData>,
    existingDealerId?: string
): Promise<SaveDealerResult> {
    // Graceful no-op when Supabase isn't set up yet
    if (!isSupabaseReady()) {
        return { success: true };
    }

    try {
        // ── Generate a unique slug ──────────────────────────────
        const baseSlug = generateSlug(data.dealershipName || "dealer");

        // Check for slug conflicts in DB
        const { data: existingSlugs } = await supabase
            .from("dealers")
            .select("slug")
            .like("slug", `${baseSlug}%`);

        const takenSlugs = (existingSlugs ?? [])
            .map((r: { slug: string }) => r.slug)
            .filter(Boolean);

        const slug = makeSlugUnique(baseSlug, data.location, takenSlugs);

        // ── Upsert dealers row ──────────────────────────────────
        const dealerPayload = {
            dealership_name:     data.dealershipName ?? "",
            tagline:             data.tagline ?? null,
            location:            data.location ?? "",
            full_address:        data.fullAddress ?? null,
            map_link:            data.mapLink ?? null,
            years_in_business:   data.yearsInBusiness ?? null,
            phone:               data.phone ?? "",
            whatsapp:            data.whatsapp ?? null,
            email:               data.email ?? "",
            gstin:               data.gstin ?? null,
            sells_new_cars:      data.sellsNewCars ?? false,
            sells_used_cars:     data.sellsUsedCars ?? false,
            inventory_system:    data.inventorySystem ?? null,
            style_template:      data.styleTemplate ?? "family",
            dealer_type:         data.dealerType ?? null,
            slug,
            subdomain:           slug,
            onboarding_step:     5,
            onboarding_complete: true,
        };

        let dealerId = existingDealerId;

        // Get current auth user to link user_id
        const { data: { user } } = await supabase.auth.getUser();

        if (existingDealerId) {
            // Update existing dealer (slug/subdomain already set at registration)
            const { error } = await supabase
                .from("dealers")
                .update({ ...dealerPayload, slug: undefined, subdomain: undefined })
                .eq("id", existingDealerId);

            if (error) throw error;
        } else {
            // Fallback: insert if no dealer was created at registration
            const { data: inserted, error } = await supabase
                .from("dealers")
                .insert({
                    ...dealerPayload,
                    ...(user ? { user_id: user.id } : {}),
                })
                .select("id")
                .single();

            if (error) throw error;
            dealerId = inserted.id;
        }

        if (!dealerId) throw new Error("No dealer ID returned");

        // ── Insert dealer_brands ────────────────────────────────
        if (data.brands && data.brands.length > 0) {
            // Delete existing brands first (clean upsert)
            await supabase.from("dealer_brands").delete().eq("dealer_id", dealerId);

            const brandRows = data.brands.map((brand, i) => ({
                dealer_id:  dealerId,
                brand_name: brand,
                is_primary: i === 0,
            }));

            const { error } = await supabase.from("dealer_brands").insert(brandRows);
            if (error) throw error;
        }

        // ── Insert dealer_services ──────────────────────────────
        if (data.services && data.services.length > 0) {
            await supabase.from("dealer_services").delete().eq("dealer_id", dealerId);

            const serviceRows = data.services.map((service) => ({
                dealer_id:    dealerId,
                service_name: service,
                is_active:    true,
            }));

            const { error } = await supabase.from("dealer_services").insert(serviceRows);
            if (error) throw error;
        }

        // ── Upsert dealer_template_configs ──────────────────────
        const tc = data.templateConfig;
        if (tc) {
            const configPayload = {
                dealer_id:      dealerId,
                hero_title:     tc.heroTitle ?? null,
                hero_subtitle:  tc.heroSubtitle ?? null,
                hero_cta_text:  tc.heroCtaText ?? "View Inventory",
                features_title: tc.featuresTitle ?? "Why Choose Us",
                facebook_url:   tc.facebook ?? null,
                instagram_url:  tc.instagram ?? null,
                twitter_url:    tc.twitter ?? null,
                youtube_url:    tc.youtube ?? null,
                linkedin_url:   tc.linkedin ?? null,
                working_hours:  tc.workingHours ?? null,
            };

            const { error } = await supabase
                .from("dealer_template_configs")
                .upsert(configPayload, { onConflict: "dealer_id" });

            if (error) throw error;
        }

        return { success: true, dealerId, slug };

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[saveDealer] error:", message);
        return { success: false, error: message };
    }
}

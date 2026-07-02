"use client";

import { supabase, isSupabaseReady } from "@/lib/supabase";
import { generateSlug, makeSlugUnique } from "@/lib/utils/slug";
import { dealerSiteUrl } from "@/lib/utils/domain";
import type { OnboardingData } from "@/lib/types";
import type { Database, Json } from "@/lib/database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Upload a base64 image to Supabase Storage and return the public URL, or null on failure */
async function uploadBase64Image(
    client: SupabaseClient<Database>,
    base64: string,
    dealerId: string,
    fieldName: string
): Promise<string | null> {
    try {
        if (!base64 || !base64.startsWith('data:')) return null
        const [header, rawData] = base64.split(',')
        if (!rawData) return null
        const mime = header.match(/:(.*?);/)?.[1] ?? 'image/png'
        const ext = mime.split('/')[1]?.replace('svg+xml', 'svg').replace('jpeg', 'jpg') ?? 'png'
        const binary = atob(rawData)
        const array = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i)
        const blob = new Blob([array], { type: mime })
        const path = `dealers/${dealerId}/${fieldName}.${ext}`
        const { error } = await client.storage
            .from('dealer-assets')
            .upload(path, blob, { upsert: true, contentType: mime })
        if (error) return null
        const { data: { publicUrl } } = client.storage.from('dealer-assets').getPublicUrl(path)
        return publicUrl
    } catch {
        return null
    }
}

function isMissingHeroImagesColumn(error: { code?: string; message?: string; details?: string } | null | undefined) {
    const text = `${error?.code ?? ''} ${error?.message ?? ''} ${error?.details ?? ''}`.toLowerCase();
    return text.includes("hero_image_urls") && (text.includes("column") || text.includes("schema cache") || text.includes("does not exist"));
}

function existingImageUrl(value: string | null | undefined) {
    const trimmed = value?.trim();
    if (!trimmed || trimmed.startsWith("data:")) return null;
    return trimmed;
}

async function resolveHeroImageUrls(
    client: SupabaseClient<Database>,
    data: Partial<OnboardingData>,
    dealerId: string,
) {
    const requestedImages = (data.heroImages?.length ? data.heroImages : data.heroImage ? [data.heroImage] : [])
        .filter(Boolean)
        .slice(0, 5);
    const uploadedUrls: string[] = [];

    for (const [index, image] of requestedImages.entries()) {
        const currentUrl = existingImageUrl(image);
        if (currentUrl) {
            uploadedUrls.push(currentUrl);
            continue;
        }

        const pathName = index === 0 ? "hero" : `hero-${index + 1}`;
        const uploadedUrl = await uploadBase64Image(client, image, dealerId, pathName);
        if (uploadedUrl) uploadedUrls.push(uploadedUrl);
    }

    return Array.from(new Set(uploadedUrls)).slice(0, 5);
}

export interface SaveDealerResult {
    success: boolean;
    dealerId?: string;
    slug?: string;
    error?: string;
}

/**
 * Client-safe slug-availability check used as a TOCTOU guard immediately before writing.
 *
 * NOTE: this intentionally mirrors lib/services/domain-service.ts `isSlugAvailable`, including
 * the previously-missing authoritative `dealers.slug` check. We do NOT import that function here
 * because it transitively pulls in `@/lib/supabase-server` (which uses `next/headers`) and this
 * module is a "use client" module — importing it would break the client build. Keep the two
 * checks in sync.
 *
 * Recommend adding a DB UNIQUE index on `dealers.slug` (+ dealer_domains.subdomain/site_slug) so
 * uniqueness is enforced atomically and this app-level guard becomes a UX nicety rather than the
 * only protection. (Migration handled separately.)
 */
async function isSlugAvailableClient(slug: string, excludeDealerId?: string): Promise<boolean> {
    try {
        const [legacyResult, routingSubResult, routingSiteResult, dealerResult] = await Promise.all([
            supabase.from("domains").select("slug").eq("slug", slug).maybeSingle(),
            supabase.from("dealer_domains").select("subdomain").eq("subdomain", slug).maybeSingle(),
            supabase.from("dealer_domains").select("site_slug").eq("site_slug", slug).maybeSingle(),
            // Authoritative routing column — the site routes from dealers.slug.
            supabase.from("dealers").select("id, slug").eq("slug", slug).maybeSingle(),
        ]);

        const dealerRow = dealerResult.data as { id?: string } | null;
        const dealerConflict = Boolean(
            dealerRow && (!excludeDealerId || dealerRow.id !== excludeDealerId)
        );

        return !legacyResult.data && !routingSubResult.data && !routingSiteResult.data && !dealerConflict;
    } catch {
        // Fail OPEN on unexpected query errors so a transient DB hiccup doesn't block onboarding;
        // the DB unique constraint (recommended above) is the real backstop.
        return true;
    }
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
    existingDealerId?: string,
    vehicleType?: 'car' | 'two-wheeler' | 'three-wheeler'
): Promise<SaveDealerResult> {
    // Supabase must be configured — fail loudly in production
    if (!isSupabaseReady()) {
        if (process.env.NODE_ENV === 'production') {
            return { success: false, error: 'Database not configured. Please contact support.' }
        }
        // Dev-only no-op — lets UI be tested without a real Supabase instance
        const slug = data.slug || generateSlug(data.dealershipName || "dealer")
        return { success: true, slug }
    }

    try {
        // ── Determine slug ──────────────────────────────────────
        // Prefer the slug the user picked in step-1 (data.slug).
        // Fall back to generating one from dealership name only if not set.
        let slug: string;

        if (data.slug) {
            slug = data.slug;
        } else {
            const baseSlug = generateSlug(data.dealershipName || "dealer");

            const { data: existingSlugs } = await supabase
                .from("dealers")
                .select("slug")
                .like("slug", `${baseSlug}%`);

            const takenSlugs = (existingSlugs ?? [])
                .map((r: { slug: string | null }) => r.slug)
                .filter((s): s is string => Boolean(s));

            slug = makeSlugUnique(baseSlug, data.location, takenSlugs);
        }

        const carBrands = (data.brands ?? []).slice(0, 1);
        const twoWheelerBrands = (data.brands2w ?? []).slice(0, 1);
        const threeWheelerBrands = (data.brands3w ?? []).slice(0, 1);
        const dealerType =
            data.sellsNewCars && data.sellsUsedCars ? "hybrid" :
            data.sellsNewCars ? "single_oem" :
            data.sellsUsedCars ? "used_only" :
            data.dealerType ?? null;

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
            branches:            data.hasMultipleBranches && data.branches && data.branches.length > 0 ? data.branches : null,
            // DB CHECK constraint: ('luxury','family','sporty','modern','professional')
        style_template: (() => {
            const VALID = ['luxury', 'family', 'sporty', 'modern', 'professional'];
            const raw = data.styleTemplate ?? 'family';
            return VALID.includes(raw) ? raw : 'family';
        })(),
            dealer_type:         dealerType,
            vehicle_type:        vehicleType ?? 'car',
            sells_two_wheelers:   data.sellsTwoWheelers ?? (vehicleType === 'two-wheeler'),
            sells_three_wheelers: data.sellsThreeWheelers ?? (vehicleType === 'three-wheeler'),
            sells_four_wheelers:  data.sellsFourWheelers ?? (vehicleType === 'car' || !vehicleType),
            slug,
            subdomain:           slug,
            onboarding_step:     5,
            onboarding_complete: true,
        };

        const isAdditionalLaunch = data.launchMode === "additional";
        let dealerId = isAdditionalLaunch ? undefined : existingDealerId;

        // Get current auth user to link user_id
        const { data: { user } } = await supabase.auth.getUser();

        // ── Ownership check — prevent one user updating another dealer's row ──
        if (dealerId && user) {
            const { data: owned } = await supabase
                .from('dealers')
                .select('id')
                .eq('id', dealerId)
                .eq('user_id', user.id)
                .maybeSingle();
            if (!owned) throw new Error('Unauthorized: dealer does not belong to current user');
        }

        if (dealerId) {
            // Happy path: update the dealer created at registration.
            // Use user-picked slug (data.slug) first; fall back to existing DB slug.
            const { data: cur } = await supabase
                .from("dealers").select("slug").eq("id", dealerId).maybeSingle();
            const finalSlug = slug || cur?.slug || slug;

            // SECURITY/CORRECTNESS (TOCTOU guard): re-validate slug availability immediately
            // before writing, excluding THIS dealer's own row (so re-saving an unchanged slug
            // is allowed). The slug may have been picked much earlier (step-1), so another
            // dealer could have claimed it in the meantime. Recommend a DB UNIQUE index on
            // dealers.slug to make this atomic — see isSlugAvailableClient() note.
            if (!(await isSlugAvailableClient(finalSlug, dealerId))) {
                return { success: false, error: 'This site name is already taken. Please choose a different one.' };
            }

            const { data: updatedRows, error } = await supabase
                .from("dealers")
                .update({ ...dealerPayload, slug: finalSlug, subdomain: finalSlug })
                .eq("id", dealerId)
                .select("id");

            if (error) throw error;
            // 0 rows changed ⇒ a tampered/non-existent id was supplied. Previously this
            // silently "succeeded" (returned success with a dealerId that was never written).
            // Fail closed. (Ownership is additionally enforced above when a user is present.)
            if (!updatedRows || updatedRows.length === 0) {
                throw new Error('Dealer not found or update not permitted');
            }
        } else {
            // existingDealerId is missing (Zustand wiped by page-refresh).
            // The DB trigger may have already created a stub dealer row for this user,
            // so try to find it before inserting — avoids the 409 unique_violation on user_id.
            if (user) {
                const { data: stubDealer } = isAdditionalLaunch
                    ? { data: null }
                    : await supabase
                        .from("dealers")
                        .select("id, slug")
                        .eq("user_id", user.id)
                        .eq("onboarding_complete", false)
                        .maybeSingle();

                if (stubDealer) {
                    // Row exists — update it in place, prefer user-picked slug
                    const finalSlug = slug || stubDealer.slug || "";

                    // TOCTOU guard — re-validate availability before writing, excluding this
                    // dealer's own (stub) row.
                    if (!(await isSlugAvailableClient(finalSlug, stubDealer.id))) {
                        return { success: false, error: 'This site name is already taken. Please choose a different one.' };
                    }

                    const { data: updatedRows, error } = await supabase
                        .from("dealers")
                        .update({ ...dealerPayload, slug: finalSlug, subdomain: finalSlug })
                        .eq("id", stubDealer.id)
                        .eq("user_id", user.id)
                        .select("id");

                    if (error) throw error;
                    // 0 rows changed ⇒ stub no longer owned by this user. Fail closed.
                    if (!updatedRows || updatedRows.length === 0) {
                        throw new Error('Dealer not found or update not permitted');
                    }
                    dealerId = stubDealer.id;
                } else {
                    // Truly new — insert with slug.
                    // TOCTOU guard — re-validate availability immediately before inserting.
                    if (!(await isSlugAvailableClient(slug))) {
                        return { success: false, error: 'This site name is already taken. Please choose a different one.' };
                    }

                    const { data: inserted, error } = await supabase
                        .from("dealers")
                        .insert({ ...dealerPayload, user_id: user.id })
                        .select("id")
                        .single();

                    if (error) throw error;
                    dealerId = inserted.id;
                }
            } else {
                // No auth session — insert without user_id (graceful fallback, will fail at DB level without auth)
                // TOCTOU guard — re-validate availability immediately before inserting.
                if (!(await isSlugAvailableClient(slug))) {
                    return { success: false, error: 'This site name is already taken. Please choose a different one.' };
                }

                const { data: inserted, error } = await supabase
                    .from("dealers")
                    .insert({ ...dealerPayload, user_id: '' })
                    .select("id")
                    .single();

                if (error) throw error;
                dealerId = inserted.id;
            }
        }

        if (!dealerId) throw new Error("No dealer ID returned");

        // ── Upload logo and used-site hero carousel images to storage ──────
        const logoUrl  = data.brandLogo ? await uploadBase64Image(supabase, data.brandLogo, dealerId, 'logo') : null
        const heroUrls = await resolveHeroImageUrls(supabase, data, dealerId)

        if (logoUrl || heroUrls.length > 0) {
            const imageUpdate: Record<string, string | string[]> = {}
            if (logoUrl) imageUpdate.logo_url = logoUrl
            if (heroUrls.length > 0) {
                imageUpdate.hero_image_url = heroUrls[0]
                imageUpdate.hero_image_urls = heroUrls
            }
            const { error: imageUpdateError } = await supabase.from('dealers').update(imageUpdate).eq('id', dealerId)

            if (imageUpdateError) {
                if (!isMissingHeroImagesColumn(imageUpdateError)) throw imageUpdateError

                const legacyImageUpdate: Record<string, string> = {}
                if (logoUrl) legacyImageUpdate.logo_url = logoUrl
                if (heroUrls[0]) legacyImageUpdate.hero_image_url = heroUrls[0]
                if (Object.keys(legacyImageUpdate).length > 0) {
                    const { error: legacyUpdateError } = await supabase.from('dealers').update(legacyImageUpdate).eq('id', dealerId)
                    if (legacyUpdateError) throw legacyUpdateError
                }
            }
        }

        // ── Upsert dealer_brands (preserves outlet data) ─────────
        // Persist all three per-vehicle-type brand arrays, each tagged with its own
        // vehicle_type and per-group is_primary (first brand in each group is primary).
        // Outlet-level fields from data.outlets are merged in when available.
        const outletMap = new Map(
            (data.outlets ?? []).map(o => [`${o.brandName}::${o.vehicleType}`, o])
        );

        const brandRows = [
            ...carBrands.map((b, i) => ({ brand_name: b, vehicle_type: 'cars', is_primary: i === 0 })),
            ...twoWheelerBrands.map((b, i) => ({ brand_name: b, vehicle_type: '2w',   is_primary: i === 0 })),
            ...threeWheelerBrands.map((b, i) => ({ brand_name: b, vehicle_type: '3w',   is_primary: i === 0 })),
        ].map(r => {
            const outlet = outletMap.get(`${r.brand_name}::${r.vehicle_type}`);
            return {
                ...r,
                dealer_id:    dealerId,
                outlet_name:  outlet?.outletName  ?? null,
                phone:        outlet?.phone       ?? null,
                whatsapp:     outlet?.whatsapp    ?? null,
                email:        outlet?.email       ?? null,
                full_address: outlet?.fullAddress  ?? null,
                city:         outlet?.city         ?? null,
                state:        outlet?.state        ?? null,
                google_maps_url: outlet?.googleMapsUrl ?? null,
                branches:     outlet?.branches && outlet.branches.length > 0 ? (outlet.branches as unknown as Json) : null,
            };
        });

        if (brandRows.length > 0) {
            // Remove brands no longer in the list, then upsert current ones.
            // This preserves outlet data for brands that are kept.
            const currentBrandKeys = brandRows.map(r => `${r.brand_name}::${r.vehicle_type}`);

            const { data: existingBrands } = await supabase
                .from("dealer_brands")
                .select("id, brand_name, vehicle_type")
                .eq("dealer_id", dealerId);

            // Delete rows for brands that were removed
            const toDelete = (existingBrands ?? []).filter(
                eb => !currentBrandKeys.includes(`${eb.brand_name}::${eb.vehicle_type}`)
            );
            if (toDelete.length > 0) {
                await supabase
                    .from("dealer_brands")
                    .delete()
                    .in("id", toDelete.map(r => r.id));
            }

            // Upsert remaining brands — update existing, insert new
            for (const row of brandRows) {
                const existing = (existingBrands ?? []).find(
                    eb => eb.brand_name === row.brand_name && eb.vehicle_type === row.vehicle_type
                );
                if (existing) {
                    await supabase
                        .from("dealer_brands")
                        .update(row)
                        .eq("id", existing.id);
                } else {
                    await supabase
                        .from("dealer_brands")
                        .insert(row);
                }
            }
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

        // ── Save Cyepro API key if provided (4W: inventorySource=cyepro; 2W/3W: key entered directly) ─
        if (data.cyeproApiKey) {
            const { error: keyErr } = await supabase
                .from('dealers')
                .update({ cyepro_api_key: data.cyeproApiKey })
                .eq('id', dealerId)
            if (keyErr) console.warn('[saveDealer] cyepro key save failed:', keyErr.message)
        }

        // ── Save bulk-uploaded vehicles if dealer chose own stock ──
        if (data.inventorySource === 'own' && data.uploadedVehicles?.length) {
            // Soft-delete any previously uploaded vehicles for this dealer
            await supabase
                .from('vehicles')
                .update({ status: 'inactive' })
                .eq('dealer_id', dealerId)
                .eq('condition', 'used')

            const vehicleRows = data.uploadedVehicles.map(v => ({
                dealer_id:    dealerId,
                make:         v.make,
                model:        v.model,
                variant:      v.variant      ?? null,
                year:         v.year,
                price_paise:  v.price_inr * 100, // CSV is in ₹, DB stores paise
                on_road_price_paise: v.on_road_price_inr ? v.on_road_price_inr * 100 : null,
                mileage_km:   v.km_driven    ?? null,
                fuel_type:    v.fuel         ?? null,
                transmission: v.transmission ?? null,
                color:        v.color        ?? null,
                body_type:    v.body_type    ?? null,
                seating_capacity: v.seating_capacity ?? null,
                engine_cc:    v.engine_cc    ?? null,
                vin:          v.vin ?? v.reg_number ?? null,
                features:     v.features ?? [],
                description:  v.description ?? null,
                meta_title:   v.meta_title ?? null,
                meta_description: v.meta_description ?? null,
                insurance_status: v.insurance_status ?? 'unknown',
                insurance_provider: v.insurance_provider ?? null,
                insurance_valid_until: v.insurance_valid_until ?? null,
                condition:    v.condition ?? 'used' as const,
                status:       v.status ?? 'available' as const,
                is_featured:  v.is_featured ?? false,
                image_url:    v.image_url ?? v.image_urls?.[0] ?? null,
                image_urls:   v.image_urls ?? (v.image_url ? [v.image_url] : []),
                views:        0,             // DB column is "views" not "view_count"
            }))

            const { error: vErr } = await supabase.from('vehicles').insert(vehicleRows)
            if (vErr) throw new Error(`Vehicle insert failed: ${vErr.message}`)
        }

        // ── Auto-register free subdomain domain record ──────────
        const subdomainValue = dealerSiteUrl(slug)

        const { error: domainErr } = await supabase
            .from('domains')
            .upsert(
                {
                    dealer_id:  dealerId,
                    domain:     subdomainValue,
                    slug,
                    type:       'subdomain',
                    status:     'active',
                    ssl_status: 'active',
                    is_primary: true,
                    auto_renew: false,
                },
                { onConflict: 'dealer_id' }
            )

        if (domainErr) {
            // Non-fatal — domain record is best-effort
            console.warn('[saveDealer] domain upsert failed:', domainErr.message)
        }

        return { success: true, dealerId, slug };

    } catch (err: unknown) {
        // Supabase throws PostgrestError (not a standard Error), so check both
        let message = "Unknown error";
        if (err instanceof Error) {
            message = err.message;
        } else if (err && typeof err === "object" && "message" in err) {
            message = String((err as { message: unknown }).message);
        }
        console.error("[saveDealer] error:", message, err);
        return { success: false, error: message };
    }
}

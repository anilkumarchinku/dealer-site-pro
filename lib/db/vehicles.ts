"use client";

import { supabase, isSupabaseReady } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

export interface DBVehicle {
    id: string;
    dealer_id: string;
    vin?: string;
    registration_number?: string;
    make: string;
    model: string;
    variant?: string;
    year: number;
    price_paise: number;      // ex-showroom price in paise (divide by 100 for ₹)
    mileage_km?: number;
    color?: string;
    body_type?: string;
    transmission?: string;
    fuel_type?: string;
    features: string[];
    description?: string;
    image_url?: string;
    video_url?: string;
    meta_title?: string;
    meta_description?: string;
    insurance_status?: "unknown" | "active" | "expired" | "expiring_soon";
    insurance_provider?: string;
    insurance_valid_until?: string;
    insurance_quote_url?: string;
    insurance_last_checked_at?: string;
    condition: "new" | "used" | "certified_pre_owned";
    status: "available" | "reserved" | "sold" | "inactive";
    views: number;
    created_at: string;
}

export interface AddVehiclePayload {
    dealer_id: string;
    vin?: string;
    registration_number?: string;
    make: string;
    model: string;
    variant?: string;
    year: number;
    price_paise: number;
    mileage_km?: number;
    color?: string;
    body_type?: string;
    transmission?: string;
    fuel_type?: string;
    features?: string[];
    description?: string;
    image_url?: string;
    video_url?: string;
    meta_title?: string;
    meta_description?: string;
    insurance_status?: "unknown" | "active" | "expired" | "expiring_soon";
    insurance_provider?: string;
    insurance_valid_until?: string;
    insurance_quote_url?: string;
    insurance_last_checked_at?: string;
    condition?: "new" | "used" | "certified_pre_owned";
}

export type UpdateVehiclePayload = Partial<Omit<AddVehiclePayload, "dealer_id">> & {
    status?: DBVehicle["status"];
};

// ── Fetch vehicles for a dealer with pagination ───────────────
export async function fetchVehicles(
    dealerId: string,
    page = 1,
    pageSize = 50
): Promise<{ vehicles: DBVehicle[]; total: number }> {
    if (!isSupabaseReady()) return { vehicles: [], total: 0 };

    const from = (page - 1) * pageSize;
    const to   = from + pageSize - 1;

    const { data, error, count } = await supabase
        .from("vehicles")
        .select("*", { count: "exact" })
        .eq("dealer_id", dealerId)
        .neq("status", "inactive")
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) {
        console.error("[fetchVehicles]", error.message);
        return { vehicles: [], total: 0 };
    }
    return { vehicles: (data ?? []) as unknown as DBVehicle[], total: count ?? 0 };
}

export async function fetchVehicleById(
    dealerId: string,
    id: string
): Promise<{ vehicle: DBVehicle | null; error?: string }> {
    if (!isSupabaseReady()) return { vehicle: null, error: "Supabase not configured" };

    const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("dealer_id", dealerId)
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("[fetchVehicleById]", error.message);
        return { vehicle: null, error: error.message };
    }

    return { vehicle: data as unknown as DBVehicle | null };
}

// ── Add a single vehicle ─────────────────────────────────────
export async function addVehicle(
    payload: AddVehiclePayload
): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!isSupabaseReady()) {
        return { success: false, error: "Supabase not configured" };
    }

    const { data, error } = await supabase
        .from("vehicles")
        .insert({
            ...payload,
            features:  payload.features ?? [],
            condition: payload.condition ?? "used",
            status:    "available",
            views: 0,
        })
        .select("id")
        .single();

    if (error) {
        console.error("[addVehicle]", error.message);
        return { success: false, error: error.message };
    }
    return { success: true, id: data.id };
}

// ── Bulk insert vehicles ──────────────────────────────────────
export async function bulkAddVehicles(
    payloads: AddVehiclePayload[]
): Promise<{ success: boolean; count: number; errors: string[] }> {
    if (!isSupabaseReady()) return { success: false, count: 0, errors: ["Supabase not configured"] };

    const rows: Database["public"]["Tables"]["vehicles"]["Insert"][] = payloads.map(p => ({
        ...p,
        features:   p.features  ?? [],
        condition:  p.condition ?? "used",
        status:     "available" as const,
        views: 0,
    }));

    const { data, error } = await supabase.from("vehicles").insert(rows).select("id");

    if (error) {
        console.error("[bulkAddVehicles]", error.message);
        return { success: false, count: 0, errors: [error.message] };
    }
    return { success: true, count: data?.length ?? 0, errors: [] };
}

export async function updateVehicle(
    id: string,
    dealerId: string,
    payload: UpdateVehiclePayload
): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseReady()) return { success: false, error: "Supabase not configured" };

    const { error } = await supabase
        .from("vehicles")
        .update(payload as Database["public"]["Tables"]["vehicles"]["Update"])
        .eq("id", id)
        .eq("dealer_id", dealerId);

    if (error) {
        console.error("[updateVehicle]", error.message);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function updateVehicleStatus(
    id: string,
    dealerId: string,
    status: DBVehicle["status"]
): Promise<{ success: boolean; error?: string }> {
    return updateVehicle(id, dealerId, { status });
}

// ── Delete a vehicle ─────────────────────────────────────────
export async function deleteVehicle(
    id: string
): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseReady()) return { success: false, error: "Supabase not configured" };

    // Soft delete — set status to inactive
    const { error } = await supabase
        .from("vehicles")
        .update({ status: "inactive" })
        .eq("id", id);

    if (error) return { success: false, error: error.message };
    return { success: true };
}

// ── Increment view count ─────────────────────────────────────
export async function incrementVehicleView(id: string) {
    if (!isSupabaseReady()) return;
    await supabase.rpc("increment_vehicle_view", { vehicle_id: id });
}

"use client";

import { supabase, isSupabaseReady } from "@/lib/supabase";

export interface DBVehicle {
    id: string;
    dealer_id: string;
    vin?: string;
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
    condition: "new" | "used" | "certified_pre_owned";
    status: "available" | "reserved" | "sold" | "inactive";
    view_count: number;
    created_at: string;
}

export interface AddVehiclePayload {
    dealer_id: string;
    vin?: string;
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
    condition?: "new" | "used" | "certified_pre_owned";
}

// ── Fetch all vehicles for a dealer ──────────────────────────
export async function fetchVehicles(dealerId: string): Promise<DBVehicle[]> {
    if (!isSupabaseReady()) return [];

    const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("dealer_id", dealerId)
        .neq("status", "inactive")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("[fetchVehicles]", error.message);
        return [];
    }
    return data ?? [];
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
            view_count: 0,
        })
        .select("id")
        .single();

    if (error) {
        console.error("[addVehicle]", error.message);
        return { success: false, error: error.message };
    }
    return { success: true, id: data.id };
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

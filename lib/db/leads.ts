"use client";

import { supabase, isSupabaseReady } from "@/lib/supabase";

export type LeadType = "inquiry" | "test_drive" | "quote" | "service" | "trade_in" | "financing";
export type LeadPriority = "hot" | "warm" | "cold";
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";
export type CyeproSyncStatus = "pending" | "synced" | "failed" | "skipped";

export interface ExternalLead {
    id: string;
    dealer_id: string;
    name: string;
    email: string;
    phone: string;
    type: LeadType;
    vehicle_interest?: string;
    message?: string;
    priority: LeadPriority;
    status: LeadStatus;
    cyepro_sync_status?: CyeproSyncStatus;
    cyepro_error?: string;
    source: string;
    created_at: string;
    updated_at: string;
}

export interface LeadFilters {
    priority?: LeadPriority | "all";
    status?: LeadStatus | "all";
    search?: string;
}

// Derive priority from lead age (hot < 24h, warm < 7d, cold otherwise)
function derivePriority(createdAt: string): LeadPriority {
    const ageMs = Date.now() - new Date(createdAt).getTime();
    if (ageMs < 24 * 60 * 60 * 1000) return "hot";
    if (ageMs < 7 * 24 * 60 * 60 * 1000) return "warm";
    return "cold";
}

// Map lead_source to LeadType
function mapLeadSource(source: string | null): LeadType {
    switch (source) {
        case "test_drive": return "test_drive";
        case "car_enquiry": return "inquiry";
        case "whatsapp": return "inquiry";
        case "phone": return "inquiry";
        case "quote": return "quote";
        default: return "inquiry";
    }
}

export async function fetchLeads(
    dealerId: string,
    _filters?: LeadFilters
): Promise<ExternalLead[]> {
    if (!isSupabaseReady()) return [];

    const { data, error } = await supabase
        .from("leads")
        .select("id, dealer_id, customer_name, customer_email, customer_phone, lead_type, vehicle_id, vehicle_interest, source, utm_source, message, status, cyepro_sync_status, cyepro_error, created_at")
        .eq("dealer_id", dealerId)
        .order("created_at", { ascending: false });

    if (error) {
        console.warn("[fetchLeads]", error.message);
        return [];
    }

    return (data ?? []).map((row: {
        id: string;
        dealer_id: string;
        customer_name: string;
        customer_email: string | null;
        customer_phone: string;
        lead_type: string | null;
        vehicle_id: string | null;
        vehicle_interest: string | null;
        source: string | null;
        utm_source: string | null;
        message: string | null;
        status: string;
        cyepro_sync_status?: CyeproSyncStatus | null;
        cyepro_error?: string | null;
        created_at: string;
    }) => ({
        id: row.id,
        dealer_id: row.dealer_id,
        name: row.customer_name,
        email: row.customer_email ?? "",
        phone: row.customer_phone,
        type: mapLeadSource(row.lead_type),
        vehicle_interest: row.vehicle_interest ?? row.vehicle_id ?? undefined,
        message: row.message ?? undefined,
        priority: derivePriority(row.created_at),
        source: row.utm_source ?? row.source ?? "Website",
        status: (row.status as LeadStatus) ?? "new",
        cyepro_sync_status: row.cyepro_sync_status ?? undefined,
        cyepro_error: row.cyepro_error ?? undefined,
        created_at: row.created_at,
        updated_at: row.created_at,
    }));
}

// SECURITY: `db()`/service-role bypasses RLS, so dealer_id scoping here is the ONLY
// tenant boundary. Without it any dealer could mutate another dealer's lead status by
// guessing/enumerating a lead id (IDOR). `dealerId` is optional ONLY for backward
// compatibility with existing callers that have not yet been updated; when provided we
// scope the mutation by dealer_id.
// TODO(security): make `dealerId` REQUIRED once all callers pass it. Known caller that
// must be updated (outside this file's ownership):
//   app/dashboard/leads/page.tsx:67 → updateLeadStatus(id, "contacted")
//     ➜  updateLeadStatus(id, "contacted", dealerId)
export async function updateLeadStatus(
    leadId: string,
    status: LeadStatus,
    dealerId?: string
): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseReady()) return { success: false, error: "Supabase not configured" };

    let query = supabase
        .from("leads")
        // @ts-ignore - Supabase type inference issue with the leads table
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", leadId);

    if (dealerId) {
        query = query.eq("dealer_id", dealerId);
    }

    const { error } = await query;

    if (error) {
        console.warn("[updateLeadStatus]", error.message);
        return { success: false, error: error.message };
    }

    return { success: true };
}

"use client";

import { supabase, isSupabaseReady } from "@/lib/supabase";

export type LeadType = "inquiry" | "test_drive" | "quote" | "service" | "trade_in" | "financing";
export type LeadPriority = "hot" | "warm" | "cold";
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

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
        .select("id, dealer_id, customer_name, customer_email, customer_phone, lead_type, vehicle_id, message, status, created_at")
        .eq("dealer_id", dealerId)
        .order("created_at", { ascending: false })
        .limit(200);

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
        message: string | null;
        status: string;
        created_at: string;
    }) => ({
        id: row.id,
        dealer_id: row.dealer_id,
        name: row.customer_name,
        email: row.customer_email ?? "",
        phone: row.customer_phone,
        type: mapLeadSource(row.lead_type),
        vehicle_interest: row.vehicle_id ?? undefined,
        message: row.message ?? undefined,
        priority: derivePriority(row.created_at),
        status: (row.status as LeadStatus) ?? "new",
        created_at: row.created_at,
        updated_at: row.created_at,
    }));
}

export async function updateLeadStatus(
    leadId: string,
    status: LeadStatus
): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseReady()) return { success: false, error: "Supabase not configured" };

    const { error } = await supabase
        .from("leads")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", leadId);

    if (error) {
        console.warn("[updateLeadStatus]", error.message);
        return { success: false, error: error.message };
    }

    return { success: true };
}

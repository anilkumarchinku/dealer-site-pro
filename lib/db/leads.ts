"use client";

/**
 * Leads — External API
 *
 * Leads come from an EXTERNAL API (not directly from the local DB).
 * This file provides the type definitions and a fetch wrapper that will
 * be connected once the external API endpoint is confirmed.
 *
 * When the API is ready, replace the TODO section with the real call.
 */

export type LeadType     = "inquiry" | "test_drive" | "quote" | "service" | "trade_in" | "financing";
export type LeadPriority = "hot" | "warm" | "cold";
export type LeadStatus   = "new" | "contacted" | "qualified" | "converted" | "lost";

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

// ── TODO: Replace with real external API call ─────────────────
// const LEADS_API_BASE = process.env.NEXT_PUBLIC_LEADS_API_URL;

export async function fetchLeads(
    _dealerId: string,
    _filters?: LeadFilters
): Promise<ExternalLead[]> {
    // TODO: Connect to external leads API
    // Example:
    // const res = await fetch(`${LEADS_API_BASE}/dealers/${_dealerId}/leads`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // const data = await res.json();
    // return data.leads;

    // Returns empty — real data comes from external API
    return [];
}

// ── Update lead status via external API ──────────────────────
export async function updateLeadStatus(
    leadId: string,
    status: LeadStatus
): Promise<{ success: boolean; error?: string }> {
    // TODO: PATCH to external API
    console.log("[updateLeadStatus] TODO:", leadId, status);
    return { success: true };
}

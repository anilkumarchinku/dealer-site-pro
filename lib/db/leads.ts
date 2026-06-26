"use client";

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
    notes?: string;
    follow_up_date?: string | null;
    contacted_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface LeadFilters {
    priority?: LeadPriority | "all";
    status?: LeadStatus | "all";
    search?: string;
}

type LeadApiRow = {
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
    priority?: string | null;
    notes?: string | null;
    follow_up_date?: string | null;
    contacted_at?: string | null;
    cyepro_sync_status?: CyeproSyncStatus | null;
    cyepro_error?: string | null;
    created_at: string;
    updated_at?: string | null;
};

function isPriority(value: unknown): value is LeadPriority {
    return value === "hot" || value === "warm" || value === "cold";
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
        case "quote": return "quote";
        case "service": return "service";
        case "trade_in": return "trade_in";
        case "financing": return "financing";
        case "inquiry": return "inquiry";
        case "car_enquiry": return "inquiry";
        case "whatsapp": return "inquiry";
        case "phone": return "inquiry";
        default: return "inquiry";
    }
}

async function readApiError(response: Response): Promise<string> {
    try {
        const payload = await response.json() as { error?: string };
        return payload.error || response.statusText;
    } catch {
        return response.statusText;
    }
}

function mapLeadRow(row: LeadApiRow): ExternalLead {
    return {
        id: row.id,
        dealer_id: row.dealer_id,
        name: row.customer_name,
        email: row.customer_email ?? "",
        phone: row.customer_phone,
        type: mapLeadSource(row.lead_type),
        vehicle_interest: row.vehicle_interest ?? row.vehicle_id ?? undefined,
        message: row.message ?? undefined,
        // Walk-in leads carry an explicit, dealer-chosen priority; website leads
        // fall back to age-based priority (hot < 24h, warm < 7d, cold otherwise).
        priority: row.source === "walk_in" && isPriority(row.priority)
            ? row.priority
            : derivePriority(row.created_at),
        source: row.utm_source ?? row.source ?? "Website",
        notes: row.notes ?? undefined,
        follow_up_date: row.follow_up_date ?? null,
        contacted_at: row.contacted_at ?? null,
        status: (row.status as LeadStatus) ?? "new",
        cyepro_sync_status: row.cyepro_sync_status ?? undefined,
        cyepro_error: row.cyepro_error ?? undefined,
        created_at: row.created_at,
        updated_at: row.updated_at ?? row.created_at,
    };
}

export async function fetchLeads(
    _dealerId?: string,
    _filters?: LeadFilters
): Promise<ExternalLead[]> {
    const response = await fetch("/api/leads", {
        cache: "no-store",
        credentials: "include",
    });

    if (!response.ok) {
        console.warn("[fetchLeads]", await readApiError(response));
        return [];
    }

    const payload = await response.json() as { leads?: LeadApiRow[] };
    return (payload.leads ?? []).map(mapLeadRow);
}

// SECURITY: mutations go through the /api/leads PATCH route, which authenticates
// the caller and scopes the update by the session's dealer on the server. That
// server-side scoping is the real tenant boundary that prevents one dealer from
// mutating another dealer's lead status by guessing/enumerating a lead id (IDOR).
// `dealerId` is forwarded when provided so the server can additionally assert the
// lead belongs to the expected dealer; it stays optional for backward compatibility
// with callers that have not yet been updated to pass it.
export async function updateLeadStatus(
    leadId: string,
    status: LeadStatus,
    dealerId?: string
): Promise<{ success: boolean; error?: string }> {
    const response = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
            dealerId ? { id: leadId, status, dealer_id: dealerId } : { id: leadId, status }
        ),
    });

    if (!response.ok) {
        const error = await readApiError(response);
        console.warn("[updateLeadStatus]", error);
        return { success: false, error };
    }

    return { success: true };
}

export interface WalkInLeadInput {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    vehicle_interest?: string;
    priority?: LeadPriority;
    lead_type?: LeadType;
    follow_up_date?: string | null;
    notes?: string;
    message?: string;
}

// Manually capture a walk-in / phone lead into the dealer's inbox.
export async function createWalkInLead(
    input: WalkInLeadInput
): Promise<{ success: boolean; id?: string; error?: string }> {
    const response = await fetch("/api/dashboard/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await readApiError(response);
        console.warn("[createWalkInLead]", error);
        return { success: false, error };
    }

    const payload = await response.json() as { id?: string };
    return { success: true, id: payload.id };
}

// Partial lead update: status, follow-up date, or "mark called" (records
// contacted_at + flips status to contacted). Server scopes by dealer.
export async function patchLead(
    leadId: string,
    fields: { status?: LeadStatus; follow_up_date?: string | null; mark_called?: boolean }
): Promise<{ success: boolean; error?: string }> {
    const response = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: leadId, ...fields }),
    });

    if (!response.ok) {
        const error = await readApiError(response);
        console.warn("[patchLead]", error);
        return { success: false, error };
    }

    return { success: true };
}

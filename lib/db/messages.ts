"use client";

import { supabase, isSupabaseReady } from "@/lib/supabase";

export interface DBMessage {
    id: string;
    dealer_id: string;
    sender_name: string;
    sender_email?: string;
    sender_phone?: string;
    subject?: string;
    content: string;
    is_read: boolean;
    is_starred: boolean;
    is_archived: boolean;
    read_at?: string;
    replied_at?: string;
    created_at: string;
}

// ── Fetch messages for a dealer ───────────────────────────────
export async function fetchMessages(
    dealerId: string,
    { includeArchived = false } = {}
): Promise<DBMessage[]> {
    if (!isSupabaseReady()) return [];

    let query = supabase
        .from("messages")
        .select("*")
        .eq("dealer_id", dealerId)
        .order("created_at", { ascending: false });

    if (!includeArchived) {
        query = query.eq("is_archived", false);
    }

    const { data, error } = await query;

    if (error) {
        console.error("[fetchMessages]", error.message);
        return [];
    }
    return (data ?? []) as DBMessage[];
}

// ── Mark a message as read ────────────────────────────────────
export async function markMessageRead(
    messageId: string
): Promise<{ success: boolean }> {
    if (!isSupabaseReady()) return { success: false };

    const { error } = await supabase
        .from("messages")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("id", messageId);

    return { success: !error };
}

// ── Toggle starred status ─────────────────────────────────────
export async function toggleMessageStar(
    messageId: string,
    starred: boolean
): Promise<{ success: boolean }> {
    if (!isSupabaseReady()) return { success: false };

    const { error } = await supabase
        .from("messages")
        .update({ is_starred: starred })
        .eq("id", messageId);

    return { success: !error };
}

// ── Archive a message ─────────────────────────────────────────
export async function archiveMessage(
    messageId: string
): Promise<{ success: boolean }> {
    if (!isSupabaseReady()) return { success: false };

    const { error } = await supabase
        .from("messages")
        .update({ is_archived: true })
        .eq("id", messageId);

    return { success: !error };
}

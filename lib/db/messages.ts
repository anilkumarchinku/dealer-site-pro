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

// SECURITY: `db()`/service-role bypasses RLS, so dealer_id scoping in these mutations is
// the ONLY tenant boundary. Without it any dealer could read/star/archive another dealer's
// message by guessing/enumerating a message id (IDOR). `dealerId` is optional ONLY for
// backward compatibility with existing callers not yet updated; when provided we scope the
// mutation by dealer_id.
// TODO(security): make `dealerId` REQUIRED once all callers pass it. Known callers that
// must be updated (outside this file's ownership), all in app/dashboard/messages/page.tsx:
//   :55 markMessageRead(msg.id)             ➜ markMessageRead(msg.id, dealerId)
//   :64 toggleMessageStar(msg.id, newVal)   ➜ toggleMessageStar(msg.id, newVal, dealerId)
//   :71 archiveMessage(msgId)               ➜ archiveMessage(msgId, dealerId)
// (Each call site already has `dealerId` in scope and guards `if (dealerId)`.)

// ── Mark a message as read ────────────────────────────────────
export async function markMessageRead(
    messageId: string,
    dealerId?: string
): Promise<{ success: boolean }> {
    if (!isSupabaseReady()) return { success: false };

    let query = supabase
        .from("messages")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("id", messageId);

    if (dealerId) {
        query = query.eq("dealer_id", dealerId);
    }

    const { error } = await query;

    return { success: !error };
}

// ── Toggle starred status ─────────────────────────────────────
export async function toggleMessageStar(
    messageId: string,
    starred: boolean,
    dealerId?: string
): Promise<{ success: boolean }> {
    if (!isSupabaseReady()) return { success: false };

    let query = supabase
        .from("messages")
        .update({ is_starred: starred })
        .eq("id", messageId);

    if (dealerId) {
        query = query.eq("dealer_id", dealerId);
    }

    const { error } = await query;

    return { success: !error };
}

// ── Archive a message ─────────────────────────────────────────
export async function archiveMessage(
    messageId: string,
    dealerId?: string
): Promise<{ success: boolean }> {
    if (!isSupabaseReady()) return { success: false };

    let query = supabase
        .from("messages")
        .update({ is_archived: true })
        .eq("id", messageId);

    if (dealerId) {
        query = query.eq("dealer_id", dealerId);
    }

    const { error } = await query;

    return { success: !error };
}

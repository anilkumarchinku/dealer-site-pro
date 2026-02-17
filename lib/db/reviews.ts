"use client";

import { supabase, isSupabaseReady } from "@/lib/supabase";

// Matches actual DB columns in `reviews` table
export interface DBReview {
    id: string;
    dealer_id: string;
    customer_name: string;
    customer_email?: string;
    rating: number;           // 1–5
    title?: string;
    content?: string;         // DB column name
    status: string;           // 'pending' | 'published' | 'rejected'
    is_featured: boolean;
    admin_reply?: string;     // DB column name for dealer response
    replied_at?: string;
    source: string;           // 'website' | 'google' | 'facebook' | 'justdial' | 'cardekho'
    created_at: string;
    updated_at: string;

    // Convenience aliases used in the UI
    review_text?: string;     // alias for content
    dealer_response?: string; // alias for admin_reply
    platform?: string;        // alias for source
    is_published?: boolean;   // derived from status === 'published'
}

// ── Normalize DB row → UI shape ───────────────────────────────
function normalize(row: Record<string, unknown>): DBReview {
    return {
        ...(row as unknown as DBReview),
        review_text:     row.content as string | undefined,
        dealer_response: row.admin_reply as string | undefined,
        platform:        row.source as string | undefined,
        is_published:    row.status === "published",
    };
}

// ── Fetch published reviews for a dealer ─────────────────────
export async function fetchReviews(dealerId: string): Promise<DBReview[]> {
    if (!isSupabaseReady()) return [];

    const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("dealer_id", dealerId)
        .eq("status", "published")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("[fetchReviews]", error.message);
        return [];
    }
    return (data ?? []).map(normalize);
}

// ── Save dealer response to a review ─────────────────────────
export async function respondToReview(
    reviewId: string,
    responseText: string
): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseReady()) return { success: false, error: "Supabase not configured" };

    const { error } = await supabase
        .from("reviews")
        .update({
            admin_reply: responseText,
            replied_at:  new Date().toISOString(),
            status:      "published",   // auto-publish when dealer replies
        })
        .eq("id", reviewId);

    if (error) return { success: false, error: error.message };
    return { success: true };
}

// ── Compute avg rating + total from an array (used for UI) ───
export function computeReviewStats(reviews: DBReview[]) {
    if (reviews.length === 0) return { avgRating: 0, total: 0, responded: 0 };
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    const responded = reviews.filter((r) => !!(r.admin_reply ?? r.dealer_response)).length;
    return {
        avgRating: parseFloat(avg.toFixed(1)),
        total:     reviews.length,
        responded,
    };
}

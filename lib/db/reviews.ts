"use client";

export type ReviewModerationStatus = "pending" | "approved" | "rejected" | "flagged";

export interface DBReview {
    id: string;
    dealer_id: string;
    reviewer_name: string;
    reviewer_phone?: string | null;
    rating: number;
    review_text?: string | null;
    car_purchased?: string | null;
    is_approved: boolean;
    moderation_status: ReviewModerationStatus;
    admin_reply?: string | null;
    replied_at?: string | null;
    source?: string | null;
    created_at: string;
    updated_at?: string | null;

    customer_name: string;
    status: ReviewModerationStatus;
    dealer_response?: string | null;
    platform?: string | null;
    is_published?: boolean;
}

function normalize(row: Partial<DBReview>): DBReview {
    const moderation = (row.moderation_status ?? (row.is_approved ? "approved" : "pending")) as ReviewModerationStatus;

    return {
        id: row.id ?? "",
        dealer_id: row.dealer_id ?? "",
        reviewer_name: row.reviewer_name ?? row.customer_name ?? "Customer",
        reviewer_phone: row.reviewer_phone ?? null,
        rating: row.rating ?? 0,
        review_text: row.review_text ?? null,
        car_purchased: row.car_purchased ?? null,
        is_approved: row.is_approved ?? moderation === "approved",
        moderation_status: moderation,
        admin_reply: row.admin_reply ?? row.dealer_response ?? null,
        replied_at: row.replied_at ?? null,
        source: row.source ?? "website",
        created_at: row.created_at ?? new Date().toISOString(),
        updated_at: row.updated_at ?? null,
        customer_name: row.reviewer_name ?? row.customer_name ?? "Customer",
        status: moderation,
        dealer_response: row.admin_reply ?? row.dealer_response ?? null,
        platform: row.source ?? row.platform ?? "website",
        is_published: moderation === "approved",
    };
}

async function fetchReviewsByStatus(dealerId: string, status: ReviewModerationStatus): Promise<DBReview[]> {
    const res = await fetch(`/api/reviews?dealer_id=${encodeURIComponent(dealerId)}&status=${status}`, {
        credentials: "include",
    });

    if (!res.ok) return [];
    const data = await res.json().catch(() => null) as { reviews?: Partial<DBReview>[] } | null;
    return (data?.reviews ?? []).map(normalize);
}

async function moderateReview(
    dealerId: string,
    reviewId: string,
    action: "approve" | "reject" | "flag" | "respond",
    adminReply?: string
): Promise<{ success: boolean; error?: string }> {
    const res = await fetch("/api/reviews", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            dealer_id: dealerId,
            review_id: reviewId,
            action,
            admin_reply: adminReply,
        }),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => null) as { error?: string } | null;
        return { success: false, error: data?.error ?? "Failed to update review" };
    }

    return { success: true };
}

export async function fetchReviews(dealerId: string): Promise<DBReview[]> {
    return fetchReviewsByStatus(dealerId, "approved");
}

export async function fetchPendingReviews(dealerId: string): Promise<DBReview[]> {
    return fetchReviewsByStatus(dealerId, "pending");
}

export async function fetchFlaggedReviews(dealerId: string): Promise<DBReview[]> {
    return fetchReviewsByStatus(dealerId, "flagged");
}

export async function fetchRejectedReviews(dealerId: string): Promise<DBReview[]> {
    return fetchReviewsByStatus(dealerId, "rejected");
}

export async function respondToReview(
    dealerId: string,
    reviewId: string,
    responseText: string
): Promise<{ success: boolean; error?: string }> {
    return moderateReview(dealerId, reviewId, "respond", responseText);
}

export async function approveReview(
    dealerId: string,
    reviewId: string
): Promise<{ success: boolean; error?: string }> {
    return moderateReview(dealerId, reviewId, "approve");
}

export async function rejectReview(
    dealerId: string,
    reviewId: string
): Promise<{ success: boolean; error?: string }> {
    return moderateReview(dealerId, reviewId, "reject");
}

export async function flagReview(
    dealerId: string,
    reviewId: string
): Promise<{ success: boolean; error?: string }> {
    return moderateReview(dealerId, reviewId, "flag");
}

export function computeReviewStats(reviews: DBReview[]) {
    if (reviews.length === 0) return { avgRating: 0, total: 0, responded: 0 };
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    const responded = reviews.filter((r) => !!(r.admin_reply ?? r.dealer_response)).length;
    return {
        avgRating: parseFloat(avg.toFixed(1)),
        total: reviews.length,
        responded,
    };
}

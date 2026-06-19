"use client"
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, Eye, EyeOff, Star, ThumbsUp, Reply, ExternalLink, MessageSquare, CheckCircle, Clock, Loader2, ShieldCheck, XCircle, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchReviews, fetchPendingReviews, fetchFlaggedReviews, fetchRejectedReviews, respondToReview, approveReview, rejectReview, flagReview, curateReview, computeReviewStats, type DBReview } from "@/lib/db/reviews";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { PremiumPageHeader } from "@/components/dashboard/premium-ui";
import { toast } from "@/lib/utils/toast";


export default function ReviewsPage() {
    const { dealerId } = useOnboardingStore();
    const [reviews, setReviews] = useState<DBReview[]>([]);
    const [pendingReviews, setPendingReviews] = useState<DBReview[]>([]);
    const [flaggedReviews, setFlaggedReviews] = useState<DBReview[]>([]);
    const [rejectedReviews, setRejectedReviews] = useState<DBReview[]>([]);
    const [loading, setLoading] = useState(false);
    const [respondingTo, setRespondingTo] = useState<string | null>(null);
    const [responseText, setResponseText] = useState("");
    const [approvingId, setApprovingId] = useState<string | null>(null);
    const [moderatingId, setModeratingId] = useState<string | null>(null);
    const [curatingId, setCuratingId] = useState<string | null>(null);

    useEffect(() => {
        if (!dealerId) return;
        setLoading(true);
        Promise.all([
            fetchReviews(dealerId),
            fetchPendingReviews(dealerId),
            fetchFlaggedReviews(dealerId),
            fetchRejectedReviews(dealerId),
        ])
            .then(([published, pending, flagged, rejected]) => {
                setReviews(published);
                setPendingReviews(pending);
                setFlaggedReviews(flagged);
                setRejectedReviews(rejected);
            })
            .finally(() => setLoading(false));
        return;
    }, [dealerId]);

    const displayReviews = reviews;

    const stats = computeReviewStats(displayReviews);
    const pendingCount = pendingReviews.length;
    const flaggedCount = flaggedReviews.length;
    const rejectedCount = rejectedReviews.length;

    const handleRespond = async (reviewId: string) => {
        if (!dealerId || !responseText.trim()) return;
        const result = await respondToReview(dealerId, reviewId, responseText);
        if (result.success) {
            setReviews(prev => prev.map(r =>
                r.id === reviewId ? { ...r, dealer_response: responseText, admin_reply: responseText } : r
            ));
            setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
            setFlaggedReviews(prev => prev.filter(r => r.id !== reviewId));
            setRespondingTo(null);
            setResponseText("");
        }
    };

    const handleApprove = async (reviewId: string) => {
        if (!dealerId) return;
        setApprovingId(reviewId);
        const result = await approveReview(dealerId, reviewId);
        if (result.success) {
            const approved = pendingReviews.find(r => r.id === reviewId) ?? flaggedReviews.find(r => r.id === reviewId) ?? rejectedReviews.find(r => r.id === reviewId);
            if (approved) {
                setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
                setFlaggedReviews(prev => prev.filter(r => r.id !== reviewId));
                setRejectedReviews(prev => prev.filter(r => r.id !== reviewId));
                setReviews(prev => [{ ...approved, status: "approved", moderation_status: "approved", is_approved: true, is_published: true }, ...prev]);
            }
            toast.success("Review approved and published");
        } else {
            toast.error("Failed to approve review");
        }
        setApprovingId(null);
    };

    const handleToggleTestimonial = async (review: DBReview) => {
        if (!dealerId) return;
        setCuratingId(review.id);
        const nextVisible = !review.show_on_homepage;
        const result = await curateReview(dealerId, review.id, { show_on_homepage: nextVisible });
        if (result.success) {
            setReviews(prev => prev.map(r => r.id === review.id ? { ...r, show_on_homepage: nextVisible } : r));
            toast.success(nextVisible ? "Testimonial shown on website" : "Testimonial hidden from website");
        } else {
            toast.error("Failed to update testimonial visibility");
        }
        setCuratingId(null);
    };

    const handleMoveTestimonial = async (review: DBReview, direction: "up" | "down") => {
        if (!dealerId) return;
        const currentIndex = reviews.findIndex(r => r.id === review.id);
        const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
        if (currentIndex < 0 || targetIndex < 0 || targetIndex >= reviews.length) return;

        const reordered = [...reviews];
        const [moved] = reordered.splice(currentIndex, 1);
        reordered.splice(targetIndex, 0, moved);
        const withOrder = reordered.map((item, index) => ({ ...item, display_order: index }));

        setCuratingId(review.id);
        const results = await Promise.all(withOrder.map(item =>
            curateReview(dealerId, item.id, { display_order: item.display_order })
        ));
        if (results.every(result => result.success)) {
            setReviews(withOrder);
            toast.success("Testimonial order updated");
        } else {
            toast.error("Failed to update testimonial order");
        }
        setCuratingId(null);
    };

    const handleModerate = async (review: DBReview, action: "reject" | "flag") => {
        if (!dealerId) return;
        setModeratingId(review.id);
        const result = action === "reject"
            ? await rejectReview(dealerId, review.id)
            : await flagReview(dealerId, review.id);

        if (result.success) {
            setPendingReviews(prev => prev.filter(r => r.id !== review.id));
            setReviews(prev => prev.filter(r => r.id !== review.id));
            setFlaggedReviews(prev => action === "flag" ? [{ ...review, moderation_status: "flagged", status: "flagged", is_approved: false }, ...prev.filter(r => r.id !== review.id)] : prev.filter(r => r.id !== review.id));
            setRejectedReviews(prev => action === "reject" ? [{ ...review, moderation_status: "rejected", status: "rejected", is_approved: false }, ...prev.filter(r => r.id !== review.id)] : prev.filter(r => r.id !== review.id));
            toast.success(action === "reject" ? "Review rejected" : "Review flagged");
        } else {
            toast.error("Failed to update review");
        }
        setModeratingId(null);
    };

    const formatDate = (dateStr: string) => {
        // Already relative strings for demo data; real ISO dates get formatted
        if (dateStr.includes("ago") || dateStr.includes("week")) return dateStr;
        return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    };

    const renderReviewCard = (review: DBReview, isPending?: boolean) => (
        <div key={review.id} className="p-4 rounded-xl bg-muted/30 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {review.customer_name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-semibold text-foreground">{review.customer_name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary" className="capitalize text-xs px-1.5 py-0">
                                {review.platform}
                            </Badge>
                            <span>•</span>
                            <span>{formatDate(review.created_at)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={cn(
                                "w-4 h-4",
                                star <= review.rating ? "text-amber-400 fill-amber-400" : "text-muted"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Review Text */}
            <p className="text-muted-foreground text-sm">&quot;{review.review_text}&quot;</p>

            {/* Dealer response */}
            {review.dealer_response && (
                <div className="pl-3 border-l-2 border-primary/30">
                    <p className="text-xs text-muted-foreground mb-0.5 font-medium">Your response:</p>
                    <p className="text-sm text-foreground">{review.dealer_response}</p>
                </div>
            )}

            {/* Actions */}
            {isPending ? (
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        onClick={() => handleApprove(review.id)}
                        disabled={approvingId === review.id}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {approvingId === review.id
                            ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                            : <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                        }
                        Approve
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleModerate(review, "flag")}
                        disabled={moderatingId === review.id}
                    >
                        <Flag className="w-3.5 h-3.5 mr-1" />
                        Flag
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleModerate(review, "reject")}
                        disabled={moderatingId === review.id}
                        className="text-red-600 hover:text-red-700"
                    >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Reject
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {review.status === "approved" && (
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleTestimonial(review)}
                                disabled={curatingId === review.id}
                            >
                                {review.show_on_homepage ? (
                                    <><EyeOff className="w-4 h-4 mr-2" />Hide from Website</>
                                ) : (
                                    <><Eye className="w-4 h-4 mr-2" />Show on Website</>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMoveTestimonial(review, "up")}
                                disabled={curatingId === review.id || reviews.findIndex(r => r.id === review.id) === 0}
                            >
                                <ArrowUp className="w-4 h-4 mr-2" />Up
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMoveTestimonial(review, "down")}
                                disabled={curatingId === review.id || reviews.findIndex(r => r.id === review.id) === reviews.length - 1}
                            >
                                <ArrowDown className="w-4 h-4 mr-2" />Down
                            </Button>
                            <Badge variant="outline" className={cn(
                                "text-xs",
                                review.show_on_homepage
                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                    : "bg-muted text-muted-foreground"
                            )}>
                                {review.show_on_homepage ? "Shown in testimonials" : "Hidden from testimonials"}
                            </Badge>
                        </div>
                    )}
                    {respondingTo === review.id ? (
                    <div className="space-y-2">
                        <Textarea
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Write your response…"
                            rows={3}
                            className="resize-none"
                        />
                        <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleRespond(review.id)}
                                className="bg-primary hover:bg-primary/90">
                                Post Response
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => { setRespondingTo(null); setResponseText(""); }}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        {review.dealer_response ? (
                            <Badge variant="outline" className="bg-green-500/10 text-emerald-600 border-emerald-500/20 gap-1">
                                <ThumbsUp className="w-3 h-3" />
                                Responded
                            </Badge>
                        ) : (
                            <Button variant="outline" size="sm" onClick={() => setRespondingTo(review.id)}>
                                <Reply className="w-4 h-4 mr-2" />
                                Respond
                            </Button>
                        )}
                    </div>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <PremiumPageHeader
                eyebrow="Reputation"
                title="Customer Feedback"
                description="Approve service ratings and testimonials before they appear on the website"
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-card/80">
                    <CardContent className="p-5">
                        <div className="mb-4">
                            <div className="p-3 rounded-xl w-fit bg-amber-500/10">
                                <Star className="w-6 h-6 text-amber-500" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Average Rating</p>
                            <p className="text-3xl font-black tracking-tight">{loading ? "—" : stats.avgRating || "—"}</p>
                            {!loading && stats.avgRating > 0 && (
                                <div className="flex items-center gap-0.5 mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={cn(
                                                "w-3.5 h-3.5",
                                                star <= Math.round(stats.avgRating) ? "text-amber-400 fill-amber-400" : "text-muted"
                                            )}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-card/80">
                    <CardContent className="p-5">
                        <div className="mb-4">
                            <div className="p-3 rounded-xl w-fit bg-primary/10">
                                <MessageSquare className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Published Feedback</p>
                            <p className="text-3xl font-black tracking-tight">{loading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : stats.total}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-card/80">
                    <CardContent className="p-5">
                        <div className="mb-4">
                            <div className="p-3 rounded-xl w-fit bg-green-500/10">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Responded</p>
                            <p className="text-3xl font-black tracking-tight">{loading ? "—" : stats.responded}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-card/80">
                    <CardContent className="p-5">
                        <div className="mb-4">
                            <div className="p-3 rounded-xl w-fit bg-violet-500/10">
                                <Clock className="w-6 h-6 text-violet-500" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Awaiting Approval</p>
                            <p className="text-3xl font-black tracking-tight">{loading ? "—" : pendingCount}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Reviews Tabs */}
            <Card variant="glass" className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-black tracking-tight">Feedback Moderation</CardTitle>
                    </div>
                    <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on Google
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Tabs defaultValue="published">
                        <TabsList>
                            <TabsTrigger value="published">
                                Published
                                {stats.total > 0 && (
                                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                        {stats.total}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="pending">
                                Pending
                                {pendingCount > 0 && (
                                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-semibold">
                                        {pendingCount}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="flagged">
                                Flagged
                                {flaggedCount > 0 && (
                                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-600 text-xs font-semibold">
                                        {flaggedCount}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="rejected">
                                Rejected
                                {rejectedCount > 0 && (
                                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                                        {rejectedCount}
                                    </span>
                                )}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="published" className="space-y-4 mt-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-sm">Loading reviews…</span>
                                </div>
                            ) : displayReviews.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                    <p className="font-medium">No published feedback yet</p>
                                    <p className="text-sm mt-1">Approved customer testimonials will appear here</p>
                                </div>
                            ) : (
                                displayReviews.map((review) => renderReviewCard(review, false))
                            )}
                        </TabsContent>

                        <TabsContent value="pending" className="space-y-4 mt-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-sm">Loading reviews…</span>
                                </div>
                            ) : pendingReviews.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <ShieldCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                    <p className="font-medium">No pending feedback</p>
                                    <p className="text-sm mt-1">New service ratings awaiting approval will appear here</p>
                                </div>
                            ) : (
                                pendingReviews.map((review) => renderReviewCard(review, true))
                            )}
                        </TabsContent>

                        <TabsContent value="flagged" className="space-y-4 mt-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-sm">Loading reviewsâ€¦</span>
                                </div>
                            ) : flaggedReviews.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Flag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                    <p className="font-medium">No flagged reviews</p>
                                    <p className="text-sm mt-1">Reviews needing additional moderation will appear here</p>
                                </div>
                            ) : (
                                flaggedReviews.map((review) => renderReviewCard(review, true))
                            )}
                        </TabsContent>

                        <TabsContent value="rejected" className="space-y-4 mt-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-sm">Loading reviewsâ€¦</span>
                                </div>
                            ) : rejectedReviews.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <XCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                    <p className="font-medium">No rejected reviews</p>
                                    <p className="text-sm mt-1">Rejected reviews are retained here for audit</p>
                                </div>
                            ) : (
                                rejectedReviews.map((review) => renderReviewCard(review, true))
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

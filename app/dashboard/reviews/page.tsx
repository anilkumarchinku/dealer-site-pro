"use client"
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star, ThumbsUp, Reply, ExternalLink, MessageSquare, CheckCircle, Clock, Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchReviews, fetchPendingReviews, respondToReview, approveReview, computeReviewStats, type DBReview } from "@/lib/db/reviews";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { toast } from "@/lib/utils/toast";


export default function ReviewsPage() {
    const { dealerId } = useOnboardingStore();
    const [reviews, setReviews] = useState<DBReview[]>([]);
    const [pendingReviews, setPendingReviews] = useState<DBReview[]>([]);
    const [loading, setLoading] = useState(false);
    const [respondingTo, setRespondingTo] = useState<string | null>(null);
    const [responseText, setResponseText] = useState("");
    const [approvingId, setApprovingId] = useState<string | null>(null);

    useEffect(() => {
        if (!dealerId) return;
        setLoading(true);
        Promise.all([
            fetchReviews(dealerId),
            fetchPendingReviews(dealerId),
        ])
            .then(([published, pending]) => {
                setReviews(published);
                setPendingReviews(pending);
            })
            .finally(() => setLoading(false));
        return;
    }, [dealerId]);

    const displayReviews = reviews;

    const stats = computeReviewStats(displayReviews);
    const pendingCount = pendingReviews.length;

    const handleRespond = async (reviewId: string) => {
        if (!responseText.trim()) return;
        const result = await respondToReview(reviewId, responseText);
        if (result.success) {
            setReviews(prev => prev.map(r =>
                r.id === reviewId ? { ...r, dealer_response: responseText } : r
            ));
            setRespondingTo(null);
            setResponseText("");
        }
    };

    const handleApprove = async (reviewId: string) => {
        setApprovingId(reviewId);
        const result = await approveReview(reviewId);
        if (result.success) {
            const approved = pendingReviews.find(r => r.id === reviewId);
            if (approved) {
                setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
                setReviews(prev => [{ ...approved, status: "published", is_published: true }, ...prev]);
            }
            toast.success("Review approved and published");
        } else {
            toast.error("Failed to approve review");
        }
        setApprovingId(null);
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
                </div>
            ) : (
                /* Reply inline form */
                respondingTo === review.id ? (
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
                )
            )}
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold">Reviews</h1>
                <p className="text-muted-foreground">Manage and respond to customer reviews</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="mb-4">
                            <div className="p-3 rounded-xl w-fit bg-amber-500/10">
                                <Star className="w-6 h-6 text-amber-500" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Average Rating</p>
                            <p className="text-3xl font-bold">{loading ? "—" : stats.avgRating || "—"}</p>
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
                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="mb-4">
                            <div className="p-3 rounded-xl w-fit bg-primary/10">
                                <MessageSquare className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total Reviews</p>
                            <p className="text-3xl font-bold">{loading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : stats.total}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="mb-4">
                            <div className="p-3 rounded-xl w-fit bg-green-500/10">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Responded</p>
                            <p className="text-3xl font-bold">{loading ? "—" : stats.responded}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="mb-4">
                            <div className="p-3 rounded-xl w-fit bg-violet-500/10">
                                <Clock className="w-6 h-6 text-violet-500" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Awaiting Approval</p>
                            <p className="text-3xl font-bold">{loading ? "—" : pendingCount}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Reviews Tabs */}
            <Card variant="glass">
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Reviews</CardTitle>
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
                                    <p className="font-medium">No reviews yet</p>
                                    <p className="text-sm mt-1">Customer reviews will appear here</p>
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
                                    <p className="font-medium">No pending reviews</p>
                                    <p className="text-sm mt-1">New customer reviews awaiting approval will appear here</p>
                                </div>
                            ) : (
                                pendingReviews.map((review) => renderReviewCard(review, true))
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

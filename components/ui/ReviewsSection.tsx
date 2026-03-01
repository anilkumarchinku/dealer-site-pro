/**
 * ReviewsSection
 * Fetches & displays buyer reviews for a dealer, plus a submission form.
 * Used inside dealer site templates.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquare, ThumbsUp, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Review {
    id: string;
    reviewer_name: string;
    rating: number;
    review_text: string | null;
    car_purchased: string | null;
    created_at: string;
}

interface ReviewsSectionProps {
    dealerId: string;
    brandColor?: string;
    /** Visual variant — light background (Modern/Family) or dark (Luxury/Sporty) */
    variant?: 'light' | 'dark';
}

function StarRow({ value, interactive = false, onSelect }: { value: number; interactive?: boolean; onSelect?: (n: number) => void }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(n => (
                <button
                    key={n}
                    type="button"
                    disabled={!interactive}
                    onMouseEnter={() => interactive && setHover(n)}
                    onMouseLeave={() => interactive && setHover(0)}
                    onClick={() => onSelect?.(n)}
                    className={interactive ? 'cursor-pointer' : 'cursor-default'}
                >
                    <Star
                        className="w-4 h-4 transition-colors"
                        fill={n <= (hover || value) ? '#f59e0b' : 'none'}
                        stroke={n <= (hover || value) ? '#f59e0b' : '#9ca3af'}
                    />
                </button>
            ))}
        </div>
    );
}

function ReviewCard({ review, variant }: { review: Review; variant: 'light' | 'dark' }) {
    const date = new Date(review.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    const bg = variant === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100';
    const nameColor = variant === 'dark' ? 'text-white' : 'text-gray-900';
    const textColor = variant === 'dark' ? 'text-gray-300' : 'text-gray-600';
    const metaColor = variant === 'dark' ? 'text-gray-400' : 'text-gray-400';

    return (
        <div className={`rounded-2xl border p-5 ${bg}`}>
            <div className="flex items-start justify-between mb-2">
                <div>
                    <p className={`font-semibold text-sm ${nameColor}`}>{review.reviewer_name}</p>
                    {review.car_purchased && (
                        <p className={`text-xs mt-0.5 ${metaColor}`}>{review.car_purchased}</p>
                    )}
                </div>
                <div className="flex flex-col items-end gap-1">
                    <StarRow value={review.rating} />
                    <p className={`text-[11px] ${metaColor}`}>{date}</p>
                </div>
            </div>
            {review.review_text && (
                <p className={`text-sm leading-relaxed ${textColor}`}>&quot;{review.review_text}&quot;</p>
            )}
        </div>
    );
}

export function ReviewsSection({ dealerId, brandColor = '#2563eb', variant = 'light' }: ReviewsSectionProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [avgRating, setAvgRating] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [form, setForm] = useState({ name: '', rating: 0, text: '', car: '' });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
    const [submitMsg, setSubmitMsg] = useState('');

    const fetchReviews = useCallback(async () => {
        try {
            const res = await fetch(`/api/reviews?dealer_id=${dealerId}`)
            if (!res.ok) return
            const data = await res.json()
            setReviews(data.reviews ?? [])
            setAvgRating(data.avgRating ?? 0)
            setTotal(data.total ?? 0)
        } catch { /* silent */ } finally {
            setLoading(false)
        }
    }, [dealerId])

    useEffect(() => { fetchReviews() }, [fetchReviews])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.rating) { setSubmitMsg('Please select a star rating.'); setSubmitStatus('error'); return; }
        setSubmitStatus('loading')
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dealer_id:       dealerId,
                    reviewer_name:   form.name,
                    rating:          form.rating,
                    review_text:     form.text || null,
                    car_purchased:   form.car || null,
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            setSubmitStatus('done')
            setSubmitMsg(data.message)
            setForm({ name: '', rating: 0, text: '', car: '' })
        } catch (err) {
            setSubmitStatus('error')
            setSubmitMsg(err instanceof Error ? err.message : 'Something went wrong')
        }
    }

    const headingColor = variant === 'dark' ? 'text-white' : 'text-gray-900'
    const subColor     = variant === 'dark' ? 'text-gray-400' : 'text-gray-600'
    const inputCls     = variant === 'dark'
        ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-white/30'
        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400'
    const labelCls     = variant === 'dark' ? 'text-gray-300' : 'text-gray-700'

    return (
        <section className="py-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-5 h-5" style={{ color: brandColor }} />
                        <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: brandColor }}>Customer Reviews</span>
                    </div>
                    <h2 className={`text-3xl font-bold ${headingColor}`}>What Buyers Say</h2>
                    {total > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                            <StarRow value={Math.round(avgRating)} />
                            <span className={`text-sm font-semibold ${headingColor}`}>{avgRating}</span>
                            <span className={`text-sm ${subColor}`}>({total} review{total !== 1 ? 's' : ''})</span>
                        </div>
                    )}
                </div>
                <Button
                    onClick={() => setShowForm(f => !f)}
                    className="gap-2 shrink-0"
                    style={{ backgroundColor: brandColor }}
                >
                    <ThumbsUp className="w-4 h-4" />
                    Write a Review
                </Button>
            </div>

            {/* Review Form */}
            {showForm && (
                <div className={`rounded-2xl border p-6 mb-8 ${variant === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                    {submitStatus === 'done' ? (
                        <div className="text-center py-4">
                            <ThumbsUp className="w-10 h-10 mx-auto mb-2" style={{ color: brandColor }} />
                            <p className={`font-semibold ${headingColor}`}>{submitMsg}</p>
                            <Button variant="ghost" className="mt-3" onClick={() => { setShowForm(false); setSubmitStatus('idle'); }}>Close</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className={`font-bold text-lg mb-4 ${headingColor}`}>Share Your Experience</h3>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Your Name *</label>
                                    <input
                                        type="text" required
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        placeholder="Full name"
                                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 ${inputCls}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Car Purchased (optional)</label>
                                    <input
                                        type="text"
                                        value={form.car}
                                        onChange={e => setForm({ ...form, car: e.target.value })}
                                        placeholder="e.g. Maruti Swift VXi"
                                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 ${inputCls}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-xs font-semibold mb-2 ${labelCls}`}>Rating *</label>
                                <StarRow value={form.rating} interactive onSelect={n => setForm({ ...form, rating: n })} />
                            </div>

                            <div>
                                <label className={`block text-xs font-semibold mb-1.5 ${labelCls}`}>Your Review (optional)</label>
                                <textarea
                                    rows={3}
                                    value={form.text}
                                    onChange={e => setForm({ ...form, text: e.target.value })}
                                    placeholder="Tell others about your experience..."
                                    maxLength={500}
                                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 resize-none ${inputCls}`}
                                />
                                <p className={`text-[11px] mt-1 text-right ${subColor}`}>{form.text.length}/500</p>
                            </div>

                            {submitStatus === 'error' && (
                                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{submitMsg}</p>
                            )}

                            <div className="flex gap-3">
                                <Button type="submit" disabled={submitStatus === 'loading'} className="gap-2" style={{ backgroundColor: brandColor }}>
                                    {submitStatus === 'loading'
                                        ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Submitting...</span>
                                        : <><Send className="w-4 h-4" />Submit Review</>
                                    }
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* Reviews List */}
            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`rounded-2xl h-32 animate-pulse ${variant === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`} />
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                    <Star className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p className={`text-sm ${subColor}`}>No reviews yet. Be the first to review!</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reviews.map(r => <ReviewCard key={r.id} review={r} variant={variant} />)}
                </div>
            )}
        </section>
    );
}

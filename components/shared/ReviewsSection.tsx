"use client"

import { useEffect, useState } from "react"

interface Review {
    id: string
    reviewer_name: string
    rating: number
    review_text: string
    car_purchased: string
    created_at: string
}

interface Props {
    dealerId: string
}

function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <svg
                    key={s}
                    className={`w-3.5 h-3.5 ${s <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-300"}`}
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    )
}

export function ReviewsSection({ dealerId }: Props) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [avgRating, setAvgRating] = useState(0)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        if (!dealerId) return
        fetch(`/api/reviews?dealer_id=${dealerId}`)
            .then(res => res.json())
            .then(data => {
                setReviews(data.reviews ?? [])
                setAvgRating(data.avgRating ?? 0)
                setTotal(data.total ?? 0)
            })
            .catch(() => {
                // Silently fail — render nothing
            })
    }, [dealerId])

    if (total === 0) return null

    const top3 = reviews.slice(0, 3)

    return (
        <section className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold">Customer Reviews</h2>
                <span className="text-2xl font-bold text-amber-500">{avgRating}</span>
                <Stars rating={Math.round(avgRating)} />
                <span className="text-sm text-muted-foreground">({total} reviews)</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
                {top3.map(review => (
                    <div key={review.id} className="bg-card border border-border rounded-2xl p-4 space-y-2">
                        <div>
                            <p className="font-semibold text-sm">{review.reviewer_name}</p>
                            <p className="text-xs text-muted-foreground">{review.car_purchased}</p>
                        </div>
                        <Stars rating={review.rating} />
                        <p className="text-sm text-muted-foreground line-clamp-2">{review.review_text}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

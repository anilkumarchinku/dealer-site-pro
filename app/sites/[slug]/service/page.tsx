import { notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase-server"
import { fetchDealerBySlug } from "@/lib/db/dealers"
import { PublicServiceCentersPage } from "@/components/service/PublicServiceCentersPage"

export const dynamic = "force-dynamic"

type PageProps = {
    params: Promise<{ slug: string }>
}

export default async function DealerServicePage({ params }: PageProps) {
    const { slug } = await params
    const dealer = await fetchDealerBySlug(slug)
    if (!dealer) notFound()

    // New service module tables may lag generated DB types.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any
    const [centersResult, tiersResult, reviewsResult] = await Promise.all([
        supabase
            .from("service_centers")
            .select("*")
            .eq("dealer_id", dealer.id)
            .eq("is_active", true)
            .order("display_order", { ascending: true })
            .order("created_at", { ascending: false }),
        supabase
            .from("service_pricing_tiers")
            .select("*")
            .eq("dealer_id", dealer.id)
            .eq("is_active", true)
            .order("display_order", { ascending: true })
            .order("created_at", { ascending: false }),
        supabase
            .from("service_center_reviews")
            .select("*")
            .eq("dealer_id", dealer.id)
            .eq("is_approved", true)
            .eq("moderation_status", "approved")
            .eq("show_on_homepage", true)
            .order("display_order", { ascending: true })
            .order("created_at", { ascending: false }),
    ])

    // A failed query (network/permission error) is NOT the same as a dealer
    // with zero service centers — distinguish so we don't show an honest-looking
    // empty state when we actually couldn't load the data.
    if (centersResult.error) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600" aria-hidden="true">
                        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Couldn&apos;t load service centers</h1>
                    <p className="mt-2 text-gray-600">
                        Something went wrong while loading service details. Please try again, or contact {dealer.dealership_name} directly.
                    </p>
                    <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <a
                            href={`/sites/${slug}/service`}
                            className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-600"
                        >
                            Retry
                        </a>
                        {dealer.phone && (
                            <a
                                href={`tel:${dealer.phone}`}
                                className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Call {dealer.phone}
                            </a>
                        )}
                    </div>
                </div>
            </main>
        )
    }

    return (
        <PublicServiceCentersPage
            dealerId={dealer.id}
            dealerName={dealer.dealership_name}
            siteSlug={slug}
            centers={centersResult.data ?? []}
            tiers={tiersResult.data ?? []}
            initialReviews={reviewsResult.data ?? []}
        />
    )
}

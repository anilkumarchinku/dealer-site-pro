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

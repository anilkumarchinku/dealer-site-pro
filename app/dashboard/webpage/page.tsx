"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { supabase } from "@/lib/supabase"
import { useDashboardSiteOrigin } from "@/lib/hooks/use-dashboard-site-origin"
import { buildDashboardSiteCards, type DashboardSiteCard } from "@/lib/utils/dashboard-site-cards"
import { dashboardSiteDisplayUrl, dashboardSiteHref, dashboardSitePath } from "@/lib/utils/dashboard-site-links"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SiteDomainModal } from "@/components/SiteDomainModal"
import { cn } from "@/lib/utils"
import {
    Copy, Check, ExternalLink, Globe,
    Edit3, Loader2,
} from "lucide-react"

type DealerBrandRow = {
    brand_name: string
    vehicle_type: string | null
}

function brandsForType(rows: DealerBrandRow[], types: string[], fallback: string[]): string[] {
    const normalizedTypes = new Set(types.map(type => type.toLowerCase()))
    const brands = [...new Set(rows
        .filter(row => row.vehicle_type && normalizedTypes.has(row.vehicle_type.toLowerCase()))
        .map(row => row.brand_name))]

    return brands.length > 0 ? brands : [...new Set(fallback)]
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function WebpagePage() {
    const router = useRouter()
    const { dealerId, setDealerId, setDealerSlug, setVehicleType, setSellsTwoWheelers, setSellsThreeWheelers, setSellsFourWheelers, data } = useOnboardingStore()

    const [sites,           setSites]           = useState<DashboardSiteCard[]>([])
    const [loading,         setLoading]         = useState(true)
    const [copied,          setCopied]          = useState<string | null>(null)
    const [domainSite,      setDomainSite]      = useState<DashboardSiteCard | null>(null)
    const [dealerName,      setDealerName]      = useState(data.dealershipName ?? "")

    // ── Always fetch fresh from DB on mount — avoids stale Zustand state ────
    useEffect(() => {
        async function selfInit() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) { setLoading(false); return }

                const { data: dealerRaw } = await supabase
                    .from("dealers")
                    .select("id, slug, dealership_name, sells_new_cars, sells_used_cars, vehicle_type, sells_two_wheelers, sells_three_wheelers, sells_four_wheelers")
                    .eq("user_id", user.id)
                    .eq("onboarding_complete", true)
                    .maybeSingle()
                const dealer = dealerRaw
                if (!dealer?.slug) { setLoading(false); return }

                // Fetch brands from dealer_brands
                const { data: brandsRaw } = await supabase
                    .from("dealer_brands")
                    .select("brand_name, vehicle_type")
                    .eq("dealer_id", dealer.id)
                    .order("is_primary", { ascending: false })
                const brandRows = (brandsRaw ?? []) as DealerBrandRow[]
                const brands = brandRows.map(b => b.brand_name)

                // Sync to store
                setDealerId(dealer.id)
                setDealerSlug(dealer.slug)
                setDealerName(dealer.dealership_name)
                const vtype =
                    dealer.vehicle_type === 'two-wheeler' || dealer.vehicle_type === 'three-wheeler'
                        ? dealer.vehicle_type
                        : 'car'
                setVehicleType(vtype)
                const isNew  = dealer.sells_new_cars  ?? false
                const isUsed = dealer.sells_used_cars ?? false
                // Fallback: if boolean flags are missing, infer from vehicle_type
                const has2W  = dealer.sells_two_wheelers   ?? (vtype === 'two-wheeler')
                const has3W  = dealer.sells_three_wheelers ?? (vtype === 'three-wheeler')
                const has4W  = dealer.sells_four_wheelers  ?? (vtype === 'car')
                setSellsTwoWheelers(has2W)
                setSellsThreeWheelers(has3W)
                setSellsFourWheelers(has4W)

                const activeSegmentCount = [has4W || vtype === 'car', has2W || vtype === 'two-wheeler', has3W || vtype === 'three-wheeler'].filter(Boolean).length
                const carBrands = brandsForType(brandRows, ['cars', 'car', '4w'], activeSegmentCount === 1 ? brands : [])
                const twoWheelerBrands = brandsForType(brandRows, ['2w', 'two-wheeler'], activeSegmentCount === 1 ? brands : [])
                const threeWheelerBrands = brandsForType(brandRows, ['3w', 'three-wheeler'], activeSegmentCount === 1 ? brands : [])

                setSites(buildDashboardSiteCards({
                    slug: dealer.slug,
                    dealerName: dealer.dealership_name,
                    carBrands,
                    twoWheelerBrands,
                    threeWheelerBrands,
                    isNew,
                    isUsed,
                    vehicleType: vtype,
                    has2W,
                    has3W,
                    has4W,
                }))
            } finally {
                setLoading(false)
            }
        }
        selfInit()
        return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleCopy(slug: string) {
        navigator.clipboard.writeText(dashboardSiteHref(slug))
        setCopied(slug)
        setTimeout(() => setCopied(null), 2000)
    }

    // ── Render ────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    const isMulti = sites.length > 1

    return (
        <div className="space-y-6 animate-fade-in">

            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold">My Webpages</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {isMulti
                            ? `${sites.length} webpages generated from your selected vehicle and stock types.`
                            : "Preview your dealer website, edit the design, or set up a custom domain."}
                    </p>
                </div>
            </div>

            {/* ── Site cards ── */}
            <div className={cn(
                "grid gap-6",
                isMulti
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1 max-w-2xl"
            )}>
                {sites.map(site => (
                    <SiteCard
                        key={site.slug}
                        site={site}
                        isMulti={isMulti}
                        dealerName={dealerName}
                        copied={copied}
                        onCopy={handleCopy}
                        onEdit={() => router.push(`/dashboard/webpage/${site.slug}`)}
                        onDomain={() => setDomainSite(site)}
                    />
                ))}
            </div>

            {/* ── Domain modal ── */}
            {domainSite && dealerId && (
                <SiteDomainModal
                    site={domainSite}
                    dealerId={dealerId}
                    dealerName={dealerName || "Your Site"}
                    onClose={() => setDomainSite(null)}
                />
            )}
        </div>
    )
}

// ── SiteCard sub-component ─────────────────────────────────────────────────────

interface SiteCardProps {
    site:       DashboardSiteCard
    isMulti:    boolean
    dealerName: string
    copied:     string | null
    onCopy:     (slug: string) => void
    onEdit:     () => void
    onDomain:   () => void
}

// Bentley prestige palette — used for all used-car site accents
const BENTLEY = { primary: '#003328', accent: '#B8962E' } as const

function SiteCard({ site, isMulti, dealerName, copied, onCopy, onEdit, onDomain }: SiteCardProps) {
    const siteOrigin  = useDashboardSiteOrigin()
    const liveUrl     = dashboardSitePath(site.slug)
    const displayUrl  = dashboardSiteDisplayUrl(site.slug, siteOrigin)
    const previewPath = site.previewPath ?? dashboardSitePath(site.slug)
    const isCopied    = copied === site.slug
    const [iframeLoaded, setIframeLoaded] = useState(false)

    return (
        <Card variant="glass" className="overflow-hidden flex flex-col">

            {/* Brand / Used badge */}
            {isMulti && (
                <div className="px-4 pt-4 pb-1">
                    <span className={cn(
                        "inline-block px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider",
                        site.isUsed
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                            : "bg-primary/10 text-primary"
                    )}>
                        {site.label}
                    </span>
                </div>
            )}

            {/* Preview thumbnail — scaled-down iframe */}
            <div className="relative mx-4 mt-3 rounded-xl overflow-hidden border border-border bg-gray-900" style={{ height: 200 }}>
                {/* Loading shimmer shown until iframe fires onLoad */}
                {!iframeLoaded && (
                    <div className="absolute inset-0 flex flex-col gap-3 p-4 animate-pulse">
                        <div className="h-5 w-1/2 rounded bg-gray-700" />
                        <div className="h-3 w-3/4 rounded bg-gray-700" />
                        <div className="flex-1 rounded bg-gray-800" />
                    </div>
                )}
                <iframe
                    src={previewPath}
                    title={`Preview: ${site.label}`}
                    scrolling="no"
                    onLoad={() => setIframeLoaded(true)}
                    style={{
                        width:           "200%",
                        height:          "200%",
                        transform:       "scale(0.5)",
                        transformOrigin: "top left",
                        pointerEvents:   "none",
                        opacity:         iframeLoaded ? 1 : 0,
                        transition:      "opacity 0.3s ease",
                    }}
                />
                {/* Transparent overlay prevents pointer interaction in card view */}
                <div className="absolute inset-0" />
            </div>

            {/* Info + actions */}
            <CardContent className="p-4 flex flex-col gap-3 flex-1">

                {/* Name + live URL */}
                <div>
                    <p className="text-sm font-semibold leading-snug">
                        {isMulti || site.showLabel
                            ? `${dealerName} — ${site.label}`
                            : dealerName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <a
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-primary hover:underline truncate"
                        >
                            {displayUrl}
                        </a>
                    </div>
                </div>

                {/* Copy / Open */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs h-8"
                        onClick={() => onCopy(site.slug)}
                    >
                        {isCopied
                            ? <><Check className="w-3.5 h-3.5 text-green-500" /> Copied!</>
                            : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" asChild>
                        <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3.5 h-3.5" />
                            Open
                        </a>
                    </Button>
                </div>

                {/* Edit / Domain */}
                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border">
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1.5"
                        onClick={onEdit}
                    >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Design
                    </Button>
                    {site.isUsed ? (
                        <Button
                            size="sm"
                            className="flex-1 gap-1.5 hover:opacity-90"
                            style={{ background: BENTLEY.primary, color: BENTLEY.accent }}
                            onClick={onDomain}
                        >
                            <Globe className="w-3.5 h-3.5" />
                            Domain
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            className="flex-1 gap-1.5 bg-primary hover:bg-primary/90"
                            onClick={onDomain}
                        >
                            <Globe className="w-3.5 h-3.5" />
                            Domain
                        </Button>
                    )}
                </div>

            </CardContent>
        </Card>
    )
}

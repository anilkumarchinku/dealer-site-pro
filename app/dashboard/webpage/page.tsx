"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { supabase } from "@/lib/supabase"
import { brandToUrlSlug, dealerSiteUrl, dealerSiteHref } from "@/lib/utils/domain"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SiteDomainModal } from "@/components/SiteDomainModal"
import { cn } from "@/lib/utils"
import {
    Copy, Check, ExternalLink, Globe,
    Edit3, Loader2, Plus,
} from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────────────

interface SiteCard {
    /** Full URL slug, e.g. "abhi-motors-tata" or "abhi-motors-used" */
    slug: string
    /** Brand name for multi-OEM, or null for single-OEM / used-car dealer */
    brand: string | null
    /** Display label shown on the card */
    label: string
    /** True for the hybrid dealer's used-car sub-site */
    isUsed?: boolean
    /** Override preview iframe path (used for 2W/3W dealers) */
    previewPath?: string
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function WebpagePage() {
    const router = useRouter()
    const { dealerId, dealerSlug, setDealerId, setDealerSlug, setVehicleType, setSellsTwoWheelers, setSellsThreeWheelers, setSellsFourWheelers, data, vehicleType, sellsTwoWheelers, sellsThreeWheelers, sellsFourWheelers } = useOnboardingStore()

    const [sites,           setSites]           = useState<SiteCard[]>([])
    const [loading,         setLoading]         = useState(true)
    const [copied,          setCopied]          = useState<string | null>(null)
    const [domainSite,      setDomainSite]      = useState<SiteCard | null>(null)
    const [sellsUsedCars,   setSellsUsedCars]   = useState(data.sellsUsedCars ?? false)
    const [sellsNewCars,    setSellsNewCars]     = useState(data.sellsNewCars ?? true)

    // ── Bootstrap: if store not yet populated, load from DB ──────────────────
    useEffect(() => {
        // Always fetch fresh data from DB if vehicleType is missing — guards against
        // stale Zustand state where dealerSlug is cached but vehicleType wasn't saved.
        if (dealerSlug && vehicleType) return

        async function selfInit() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return
                const { data: dealerRaw } = await supabase
                    .from("dealers")
                    .select("id, slug, sells_new_cars, sells_used_cars, vehicle_type, sells_two_wheelers, sells_three_wheelers, sells_four_wheelers")
                    .eq("user_id", user.id)
                    .eq("onboarding_complete", true)
                    .maybeSingle()
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const dealer = dealerRaw as any
                if (dealer?.id)   setDealerId(dealer.id)
                if (dealer?.slug) setDealerSlug(dealer.slug)
                if (dealer?.sells_used_cars != null) setSellsUsedCars(dealer.sells_used_cars)
                if (dealer?.sells_new_cars  != null) setSellsNewCars(dealer.sells_new_cars)
                if (dealer?.vehicle_type)   setVehicleType(dealer.vehicle_type)
                if (dealer?.sells_two_wheelers   != null) setSellsTwoWheelers(dealer.sells_two_wheelers)
                if (dealer?.sells_three_wheelers != null) setSellsThreeWheelers(dealer.sells_three_wheelers)
                if (dealer?.sells_four_wheelers  != null) setSellsFourWheelers(dealer.sells_four_wheelers)
            } finally {
                setLoading(false)
            }
        }
        selfInit()
        return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // ── Build site cards whenever slug / brands / dealer type change ─────────
    useEffect(() => {
        if (!dealerSlug) return
        buildSiteCards(dealerSlug, data.brands ?? [], sellsNewCars, sellsUsedCars, vehicleType, sellsTwoWheelers, sellsThreeWheelers, sellsFourWheelers)
        setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dealerSlug, data.brands, sellsNewCars, sellsUsedCars, vehicleType, sellsTwoWheelers, sellsThreeWheelers, sellsFourWheelers])

    function build2WCards(slug: string, brands: string[]): SiteCard[] {
        if (brands.length <= 1) {
            return [{
                slug:        `${slug}/two-wheelers`,
                brand:       null,
                label:       data.dealershipName ?? "My 2W Site",
                previewPath: `/sites/${slug}/two-wheelers`,
            }]
        }
        return brands.map(brand => {
            const brandSlug = `${slug}-${brandToUrlSlug(brand)}`
            return { slug: `${brandSlug}/two-wheelers`, brand, label: brand, previewPath: `/sites/${brandSlug}/two-wheelers` }
        })
    }

    function build3WCards(slug: string, brands: string[]): SiteCard[] {
        if (brands.length <= 1) {
            return [{
                slug:        `${slug}/three-wheelers`,
                brand:       null,
                label:       data.dealershipName ?? "My 3W Site",
                previewPath: `/sites/${slug}/three-wheelers`,
            }]
        }
        return brands.map(brand => {
            const brandSlug = `${slug}-${brandToUrlSlug(brand)}`
            return { slug: `${brandSlug}/three-wheelers`, brand, label: brand, previewPath: `/sites/${brandSlug}/three-wheelers` }
        })
    }

    function buildCarCards(slug: string, brands: string[], isNew: boolean, isUsed: boolean): SiteCard[] {
        const isHybrid = isNew && isUsed
        if (isUsed && !isNew) {
            return [{ slug, brand: null, label: data.dealershipName ?? "My Site", isUsed: true }]
        }
        if (brands.length <= 1 && !isHybrid) {
            return [{ slug, brand: null, label: data.dealershipName ?? "My Site" }]
        }
        if (isHybrid) {
            const brandCards: SiteCard[] = brands.length > 0
                ? brands.map(brand => ({ slug: `${slug}-${brandToUrlSlug(brand)}`, brand, label: brand }))
                : [{ slug, brand: null, label: data.dealershipName ?? "My Site" }]
            return [...brandCards, { slug: `${slug}-used`, brand: null, label: "Pre-Owned", isUsed: true }]
        }
        return brands.map(brand => ({ slug: `${slug}-${brandToUrlSlug(brand)}`, brand, label: brand }))
    }

    function buildSiteCards(slug: string, brands: string[], isNew: boolean, isUsed: boolean, vtype: string, has2W: boolean, has3W: boolean, has4W: boolean) {
        const effectiveHasCars = vtype === 'car'           || has4W
        const effectiveHas2W   = vtype === 'two-wheeler'   || has2W
        const effectiveHas3W   = vtype === 'three-wheeler' || has3W

        // ── Multi-segment dealer — combine all active site cards ─────────────
        const isMultiSegment = [effectiveHasCars, effectiveHas2W, effectiveHas3W].filter(Boolean).length > 1
        if (isMultiSegment) {
            const allCards: SiteCard[] = []
            if (effectiveHas2W)   allCards.push(...build2WCards(slug, brands))
            if (effectiveHas3W)   allCards.push(...build3WCards(slug, brands))
            if (effectiveHasCars) {
                // 4W cards use the existing car logic
                const carCards = buildCarCards(slug, brands, isNew, isUsed)
                allCards.push(...carCards)
            }
            setSites(allCards)
            return
        }

        // ── Single 2W / 3W dealers ───────────────────────────────────────────
        // Single-brand: one card → /sites/{slug}/two-wheelers
        // Multi-brand:  one card per brand → /sites/{slug}-{brand}/two-wheelers
        if (vtype === 'two-wheeler' || vtype === 'three-wheeler') {
            const hubPath = vtype === 'two-wheeler' ? 'two-wheelers' : 'three-wheelers'

            if (brands.length <= 1) {
                setSites([{
                    slug:        `${slug}/${hubPath}`,
                    brand:       null,
                    label:       data.dealershipName ?? "My Site",
                    previewPath: `/sites/${slug}/${hubPath}`,
                }])
            } else {
                setSites(brands.map(brand => {
                    const brandSlug = `${slug}-${brandToUrlSlug(brand)}`
                    return {
                        slug:        `${brandSlug}/${hubPath}`,
                        brand,
                        label:       brand,
                        previewPath: `/sites/${brandSlug}/${hubPath}`,
                    }
                }))
            }
            return
        }

        // ── 4W / car dealers ────────────────────────────────────────────────
        setSites(buildCarCards(slug, brands, isNew, isUsed))
    }

    function handleCopy(slug: string) {
        navigator.clipboard.writeText(dealerSiteHref(slug))
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
                            ? `${sites.length} brand-specific sites — each can have its own domain and design.`
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
                        dealerName={data.dealershipName ?? ""}
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
                    dealerName={data.dealershipName ?? "Your Site"}
                    onClose={() => setDomainSite(null)}
                />
            )}
        </div>
    )
}

// ── SiteCard sub-component ─────────────────────────────────────────────────────

interface SiteCardProps {
    site:       SiteCard
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
    const liveUrl     = dealerSiteHref(site.slug)
    const displayUrl  = dealerSiteUrl(site.slug)
    const previewPath = site.previewPath ?? `/sites/${site.slug}`
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
                        {site.isUsed ? "Pre-Owned / Used Cars" : site.label}
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
                        {isMulti
                            ? site.isUsed
                                ? `${dealerName} — Pre-Owned`
                                : `${dealerName} — ${site.label}`
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

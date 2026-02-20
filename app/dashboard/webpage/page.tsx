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
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function WebpagePage() {
    const router = useRouter()
    const { dealerId, dealerSlug, setDealerId, setDealerSlug, data } = useOnboardingStore()

    const [sites,           setSites]           = useState<SiteCard[]>([])
    const [loading,         setLoading]         = useState(true)
    const [copied,          setCopied]          = useState<string | null>(null)
    const [domainSite,      setDomainSite]      = useState<SiteCard | null>(null)
    const [sellsUsedCars,   setSellsUsedCars]   = useState(data.sellsUsedCars ?? false)
    const [sellsNewCars,    setSellsNewCars]     = useState(data.sellsNewCars ?? true)

    // ── Bootstrap: if store not yet populated, load from DB ──────────────────
    useEffect(() => {
        if (dealerSlug) return

        async function selfInit() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return
                const { data: dealer } = await supabase
                    .from("dealers")
                    .select("id, slug, sells_new_cars, sells_used_cars")
                    .eq("user_id", user.id)
                    .eq("onboarding_complete", true)
                    .maybeSingle()
                if (dealer?.id)   setDealerId(dealer.id)
                if (dealer?.slug) setDealerSlug(dealer.slug)
                if (dealer?.sells_used_cars != null) setSellsUsedCars(dealer.sells_used_cars)
                if (dealer?.sells_new_cars  != null) setSellsNewCars(dealer.sells_new_cars)
            } finally {
                setLoading(false)
            }
        }
        selfInit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // ── Build site cards whenever slug / brands / dealer type change ─────────
    useEffect(() => {
        if (!dealerSlug) return
        buildSiteCards(dealerSlug, data.brands ?? [], sellsNewCars, sellsUsedCars)
        setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dealerSlug, data.brands, sellsNewCars, sellsUsedCars])

    function buildSiteCards(slug: string, brands: string[], isNew: boolean, isUsed: boolean) {
        const isHybrid = isNew && isUsed

        if (isUsed && !isNew) {
            // Pure used-car dealer: one site
            setSites([{
                slug,
                brand: null,
                label: data.dealershipName ?? "My Site",
                isUsed: true,
            }])
        } else if (brands.length <= 1 && !isHybrid) {
            // Single-OEM new-car dealer: one main site
            setSites([{
                slug,
                brand: null,
                label: data.dealershipName ?? "My Site",
            }])
        } else if (isHybrid) {
            // Hybrid: brand-specific new-car sites + a used-car site
            const brandCards: SiteCard[] = brands.length > 0
                ? brands.map(brand => ({
                    slug:  `${slug}-${brandToUrlSlug(brand)}`,
                    brand,
                    label: brand,
                }))
                : [{ slug, brand: null, label: data.dealershipName ?? "My Site" }]
            setSites([
                ...brandCards,
                {
                    slug:   `${slug}-used`,
                    brand:  null,
                    label:  "Pre-Owned",
                    isUsed: true,
                },
            ])
        } else {
            // Multi-OEM new-car dealer: one card per brand
            setSites(brands.map(brand => ({
                slug:  `${slug}-${brandToUrlSlug(brand)}`,
                brand,
                label: brand,
            })))
        }
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
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
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
    const previewPath = `/sites/${site.slug}`
    const isCopied    = copied === site.slug

    return (
        <Card variant="glass" className="overflow-hidden flex flex-col">

            {/* Brand / Used badge */}
            {isMulti && (
                <div className="px-4 pt-4 pb-1">
                    <span className={cn(
                        "inline-block px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider",
                        site.isUsed
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    )}>
                        {site.isUsed ? "Pre-Owned / Used Cars" : site.label}
                    </span>
                </div>
            )}

            {/* Preview thumbnail — scaled-down iframe */}
            <div className="relative mx-4 mt-3 rounded-xl overflow-hidden border border-border bg-muted/20" style={{ height: 200 }}>
                <iframe
                    src={previewPath}
                    title={`Preview: ${site.label}`}
                    scrolling="no"
                    style={{
                        width:           "200%",
                        height:          "200%",
                        transform:       "scale(0.5)",
                        transformOrigin: "top left",
                        pointerEvents:   "none",
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
                            className="text-xs font-mono text-blue-500 hover:underline truncate"
                        >
                            {displayUrl}
                        </a>
                    </div>
                </div>

                {/* Copy / Open */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onCopy(site.slug)}
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                        {isCopied
                            ? <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!</>
                            : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                    </button>
                    <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open
                    </a>
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
                        <button
                            onClick={onDomain}
                            className="flex-1 flex items-center justify-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-90"
                            style={{ background: BENTLEY.primary, color: BENTLEY.accent }}
                        >
                            <Globe className="w-3.5 h-3.5" />
                            Domain
                        </button>
                    ) : (
                        <Button
                            size="sm"
                            className="flex-1 gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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

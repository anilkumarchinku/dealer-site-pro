"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { supabase } from "@/lib/supabase"
import { useDashboardSiteOrigin } from "@/lib/hooks/use-dashboard-site-origin"
import { buildDashboardSiteCards, type DashboardSiteCard } from "@/lib/utils/dashboard-site-cards"
import { dashboardSiteDisplayUrl, dashboardSiteHref, dashboardSitePath } from "@/lib/utils/dashboard-site-links"
import { BrandLogoMark } from "@/components/brand-logo-mark"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SiteDomainModal } from "@/components/SiteDomainModal"
import { cn } from "@/lib/utils"
import {
    Copy, Check, ExternalLink, Globe,
    Bike, Car, Edit3, Loader2, Palette, Plus, Rocket, Store, Truck, UploadCloud, ListChecks,
} from "lucide-react"
import { getOnboardingResetPrefill } from "@/lib/onboarding/prefill"
import type { Brand, OnboardingWebsitePlan, OnboardingVehicleSegment } from "@/lib/types"

type DealerBrandRow = {
    dealer_id?: string
    brand_name: string
    vehicle_type: string | null
}

type DealerRow = {
    id: string
    slug: string | null
    dealership_name: string
    sells_new_cars: boolean | null
    sells_used_cars: boolean | null
    vehicle_type: string | null
    sells_two_wheelers: boolean | null
    sells_three_wheelers: boolean | null
    sells_four_wheelers: boolean | null
}

const vehicleTypeBySegment: Record<OnboardingVehicleSegment, "car" | "two-wheeler" | "three-wheeler"> = {
    "4w": "car",
    "2w": "two-wheeler",
    "3w": "three-wheeler",
}

const segmentLabel: Record<OnboardingVehicleSegment, string> = {
    "4w": "Cars",
    "2w": "Two-Wheelers",
    "3w": "Three-Wheelers",
}

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
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
    const {
        dealerId,
        setDealerId,
        setDealerSlug,
        setVehicleType,
        setSellsTwoWheelers,
        setSellsThreeWheelers,
        setSellsFourWheelers,
        reset,
        updateData,
        pendingWebsitePlans,
        setActiveWebsitePlanId,
        clearPendingWebsitePlans,
        data,
    } = useOnboardingStore()

    const [sites,           setSites]           = useState<DashboardSiteCard[]>([])
    const [loading,         setLoading]         = useState(true)
    const [copied,          setCopied]          = useState<string | null>(null)
    const [domainSite,      setDomainSite]      = useState<DashboardSiteCard | null>(null)
    const [dealerName,      setDealerName]      = useState(data.dealershipName ?? "")

    // ── Always fetch fresh from DB on mount — avoids stale Zustand state ────
    useEffect(() => {
        async function selfInit() {
            setLoading(true)
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) { setLoading(false); return }

                const { data: dealersRaw } = await supabase
                    .from("dealers")
                    .select("id, slug, dealership_name, sells_new_cars, sells_used_cars, vehicle_type, sells_two_wheelers, sells_three_wheelers, sells_four_wheelers")
                    .eq("user_id", user.id)
                    .eq("onboarding_complete", true)
                    .order("created_at", { ascending: false })
                const dealers = ((dealersRaw ?? []) as DealerRow[]).filter(dealer => dealer.slug)
                if (dealers.length === 0) { setLoading(false); return }

                const dealerIds = dealers.map(dealer => dealer.id)
                const { data: brandsRaw } = await supabase
                    .from("dealer_brands")
                    .select("dealer_id, brand_name, vehicle_type, is_primary")
                    .in("dealer_id", dealerIds)
                    .order("is_primary", { ascending: false })
                const brandRows = (brandsRaw ?? []) as DealerBrandRow[]
                const rowsByDealer = new Map<string, DealerBrandRow[]>()
                for (const row of brandRows) {
                    if (!row.dealer_id) continue
                    rowsByDealer.set(row.dealer_id, [...(rowsByDealer.get(row.dealer_id) ?? []), row])
                }

                const activeDealer = dealers.find(dealer => dealer.id === dealerId) ?? dealers[0]
                if (!activeDealer) { setLoading(false); return }

                // Sync to store
                setDealerId(activeDealer.id)
                if (activeDealer.slug) setDealerSlug(activeDealer.slug)
                setDealerName(activeDealer.dealership_name)
                const vtype =
                    activeDealer.vehicle_type === 'two-wheeler' || activeDealer.vehicle_type === 'three-wheeler'
                        ? activeDealer.vehicle_type
                        : 'car'
                setVehicleType(vtype)
                // Fallback: if boolean flags are missing, infer from vehicle_type
                const has2W  = activeDealer.sells_two_wheelers   ?? (vtype === 'two-wheeler')
                const has3W  = activeDealer.sells_three_wheelers ?? (vtype === 'three-wheeler')
                const has4W  = activeDealer.sells_four_wheelers  ?? (vtype === 'car')
                setSellsTwoWheelers(has2W)
                setSellsThreeWheelers(has3W)
                setSellsFourWheelers(has4W)

                const allSites = dealers.flatMap((dealer) => {
                    const currentRows = rowsByDealer.get(dealer.id) ?? []
                    const brands = currentRows.map(b => b.brand_name)
                    const currentVtype =
                        dealer.vehicle_type === 'two-wheeler' || dealer.vehicle_type === 'three-wheeler'
                            ? dealer.vehicle_type
                            : 'car'
                    const currentHas2W = dealer.sells_two_wheelers   ?? (currentVtype === 'two-wheeler')
                    const currentHas3W = dealer.sells_three_wheelers ?? (currentVtype === 'three-wheeler')
                    const currentHas4W = dealer.sells_four_wheelers  ?? (currentVtype === 'car')
                    const activeSegmentCount = [
                        currentHas4W || currentVtype === 'car',
                        currentHas2W || currentVtype === 'two-wheeler',
                        currentHas3W || currentVtype === 'three-wheeler',
                    ].filter(Boolean).length
                    const carBrands = brandsForType(currentRows, ['cars', 'car', '4w'], activeSegmentCount === 1 ? brands : [])
                    const twoWheelerBrands = brandsForType(currentRows, ['2w', 'two-wheeler'], activeSegmentCount === 1 ? brands : [])
                    const threeWheelerBrands = brandsForType(currentRows, ['3w', 'three-wheeler'], activeSegmentCount === 1 ? brands : [])

                    return buildDashboardSiteCards({
                        slug: dealer.slug ?? "",
                        dealerName: dealer.dealership_name,
                        carBrands,
                        twoWheelerBrands,
                        threeWheelerBrands,
                        isNew: dealer.sells_new_cars ?? false,
                        isUsed: dealer.sells_used_cars ?? false,
                        vehicleType: currentVtype,
                        has2W: currentHas2W,
                        has3W: currentHas3W,
                        has4W: currentHas4W,
                    }).map(site => ({
                        ...site,
                        dealerId: dealer.id,
                        dealerName: dealer.dealership_name,
                    }))
                })

                setSites(allSites)
            } finally {
                setLoading(false)
            }
        }
        selfInit()
        const refreshSites = () => {
            selfInit()
        }
        window.addEventListener("dealer-stock-mode-updated", refreshSites)
        return () => window.removeEventListener("dealer-stock-mode-updated", refreshSites)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleCopy(slug: string) {
        navigator.clipboard.writeText(dashboardSiteHref(slug))
        setCopied(slug)
        setTimeout(() => setCopied(null), 2000)
    }

    function handleAddWebsite() {
        clearPendingWebsitePlans()
        reset({ launchMode: "additional" })
        router.push("/onboarding?mode=add-site")
    }

    function handleStartPendingWebsite(plan: OnboardingWebsitePlan) {
        const vehicleType = vehicleTypeBySegment[plan.segment]
        const has4w = plan.segment === "4w"
        const has2w = plan.segment === "2w"
        const has3w = plan.segment === "3w"
        const pickedBrand = plan.brand

        reset({
            ...getOnboardingResetPrefill(data),
            launchMode: data.launchMode ?? "initial",
            dealershipName: data.dealershipName,
            phone: data.phone,
            whatsapp: data.whatsapp,
            email: data.email,
            location: data.location,
            fullAddress: data.fullAddress,
            mapLink: data.mapLink,
            gstin: data.gstin,
            slug: data.slug ? `${data.slug}-${slugify(plan.title)}`.slice(0, 63) : undefined,
        })
        setVehicleType(vehicleType)
        setSellsFourWheelers(has4w)
        setSellsTwoWheelers(has2w)
        setSellsThreeWheelers(has3w)
        setActiveWebsitePlanId(plan.id)
        updateData({
            dealerCategory: plan.stock,
            sellsNewCars: plan.stock === "new",
            sellsUsedCars: plan.stock === "used",
            sellsFourWheelers: has4w,
            sellsTwoWheelers: has2w,
            sellsThreeWheelers: has3w,
            launchMode: data.launchMode ?? "initial",
            brands: has4w && pickedBrand ? [pickedBrand as Brand] : [],
            brands2w: has2w && pickedBrand ? [pickedBrand] : [],
            brands3w: has3w && pickedBrand ? [pickedBrand] : [],
        })
        router.push(plan.route)
    }

    // ── Render ────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    const totalCards = sites.length + pendingWebsitePlans.length
    const isMulti = totalCards > 1

    return (
        <div className="space-y-6 animate-fade-in">

            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold">My Webpages</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {pendingWebsitePlans.length > 0
                            ? `${pendingWebsitePlans.length} pending setup${pendingWebsitePlans.length === 1 ? "" : "s"} ready. Start each website when you are ready.`
                            : isMulti
                            ? `${sites.length} webpages generated from your selected vehicle and stock types.`
                            : "Preview your dealer website, edit the design, or set up a custom domain."}
                    </p>
                </div>
                <Button type="button" className="rounded-xl gap-2" onClick={handleAddWebsite}>
                    <Plus className="h-4 w-4" />
                    Add New Website
                </Button>
            </div>

            {pendingWebsitePlans.length > 0 && (
                <PendingWebsitesHero plans={pendingWebsitePlans} />
            )}

            {pendingWebsitePlans.length > 0 && (
                <section className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-muted-foreground">
                            Pending Website Setups
                        </h2>
                        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {pendingWebsitePlans.length} queued
                        </span>
                    </div>
                    <div className={cn(
                        "grid gap-6",
                        totalCards > 1
                            ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                            : "grid-cols-1 max-w-2xl"
                    )}>
                        {pendingWebsitePlans.map((plan) => (
                            <PendingWebsiteCard
                                key={plan.id}
                                plan={plan}
                                onStart={() => handleStartPendingWebsite(plan)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* ── Site cards ── */}
            {sites.length > 0 && (
                <section className="space-y-3">
                    {pendingWebsitePlans.length > 0 && (
                        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-muted-foreground">
                            Published Webpages
                        </h2>
                    )}
                    <div className={cn(
                        "grid gap-6",
                        totalCards > 1
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
                </section>
            )}

            {/* ── Domain modal ── */}
            {domainSite && (domainSite.dealerId ?? dealerId) && (
                <SiteDomainModal
                    site={domainSite}
                    dealerId={domainSite.dealerId ?? dealerId!}
                    dealerName={domainSite.dealerName || dealerName || "Your Site"}
                    onClose={() => setDomainSite(null)}
                />
            )}
        </div>
    )
}

function PendingWebsitesHero({ plans }: { plans: OnboardingWebsitePlan[] }) {
    const newCount = plans.filter(plan => plan.stock === "new").length
    const usedCount = plans.filter(plan => plan.stock === "used").length
    const visiblePlans = plans.slice(0, 6)
    const hiddenCount = Math.max(plans.length - visiblePlans.length, 0)

    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[#071436] via-[#0B1D3F] to-[#1B2437] text-white shadow-[0_24px_70px_rgba(7,20,54,0.18)]">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="p-6 sm:p-7">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">My Websites Queue</p>
                    <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight tracking-[-0.04em]">
                        Continue every generated website from one place.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-white/70">
                        New, pre-owned, and hybrid websites stay separated here, so each one can finish its own profile, identity, inventory, services, and publish flow.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-[#071436]">
                            {plans.length} setup{plans.length === 1 ? "" : "s"} queued
                        </span>
                        <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-white">
                            {newCount} new
                        </span>
                        <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-white">
                            {usedCount} pre-owned
                        </span>
                    </div>
                </div>

                <div className="border-t border-white/10 bg-white/[0.06] p-4 lg:border-l lg:border-t-0">
                    <div className="grid gap-2">
                        {visiblePlans.map((plan) => (
                            <div key={plan.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3">
                                {plan.brand ? (
                                    <BrandLogoMark
                                        brand={plan.brand}
                                        segment={plan.segment}
                                        className="h-10 w-10 rounded-lg"
                                        imageClassName="h-7 w-7"
                                    />
                                ) : (
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                                        {plan.segment === "2w" ? <Bike className="h-5 w-5" /> : plan.segment === "3w" ? <Truck className="h-5 w-5" /> : <Car className="h-5 w-5" />}
                                    </span>
                                )}
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-black">{plan.title}</p>
                                    <p className="truncate text-xs font-semibold text-white/60">
                                        {plan.brand || "Inventory driven"} - {segmentLabel[plan.segment]}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {hiddenCount > 0 && (
                            <div className="rounded-xl border border-white/10 bg-white/10 p-3 text-sm font-black text-white/75">
                                +{hiddenCount} more website{hiddenCount === 1 ? "" : "s"} ready below
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

// ── SiteCard sub-component ─────────────────────────────────────────────────────

function PendingWebsiteCard({
    plan,
    onStart,
}: {
    plan: OnboardingWebsitePlan
    onStart: () => void
}) {
    const segmentIcon =
        plan.segment === "2w" ? Bike :
        plan.segment === "3w" ? Truck :
        Car
    const SegmentIcon = segmentIcon
    const stockLabel = plan.stock === "new" ? "New" : "Pre-Owned"
    const isUsed = plan.stock === "used"
    const brandLabel = plan.brand || "Inventory based"
    const checklist = [
        { label: "Dealer profile", icon: Store },
        { label: "Website identity", icon: Palette },
        { label: "Inventory", icon: UploadCloud },
        { label: "Services", icon: ListChecks },
        { label: "Publish", icon: Rocket },
    ]

    return (
        <Card variant="glass" className="overflow-hidden border-primary/20 bg-background">
            <div className={cn(
                "relative overflow-hidden border-b p-4",
                isUsed
                    ? "border-amber-500/20 bg-[#FFF7EA]"
                    : "border-primary/15 bg-[#F5F8FF]"
            )}>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                        {plan.brand ? (
                            <BrandLogoMark
                                brand={plan.brand}
                                segment={plan.segment}
                                className={cn(
                                    "h-12 w-12 rounded-xl",
                                    isUsed ? "border-amber-500/20" : "border-primary/20"
                                )}
                                imageClassName="h-9 w-9"
                            />
                        ) : (
                            <div className={cn(
                                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border",
                                isUsed
                                    ? "border-amber-500/20 bg-white text-amber-700"
                                    : "border-primary/20 bg-white text-primary"
                            )}>
                                <SegmentIcon className="h-5 w-5" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <span className={cn(
                                "inline-flex rounded-md border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em]",
                                isUsed
                                    ? "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                                    : "border-primary/20 bg-primary/10 text-primary"
                            )}>
                                Pending {stockLabel}
                            </span>
                            <p className="mt-3 truncate text-lg font-black tracking-[-0.02em]">{plan.title}</p>
                            <p className="mt-1 text-sm font-semibold text-muted-foreground">{brandLabel}</p>
                        </div>
                    </div>
                    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-black text-muted-foreground">
                        {segmentLabel[plan.segment]}
                    </span>
                </div>
            </div>

            <CardContent className="flex flex-1 flex-col gap-4 p-4">
                <div>
                    <p className="text-sm font-semibold leading-6 text-muted-foreground">{plan.caption}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                    <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                        Segment: {segmentLabel[plan.segment]}
                    </div>
                    <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                        Brand: {brandLabel}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {checklist.map((item) => (
                        <div key={item.label} className="flex items-center gap-2 rounded-lg border border-border bg-background/70 px-3 py-2 text-xs font-medium text-muted-foreground">
                            <item.icon className="h-3.5 w-3.5 text-primary" />
                            {item.label}
                        </div>
                    ))}
                </div>

                <Button type="button" className="mt-auto w-full gap-2 rounded-xl" onClick={onStart}>
                    Continue Onboarding
                    <Rocket className="h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    )
}

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
    const liveUrl     = dashboardSiteHref(site.slug, siteOrigin)
    const displayUrl  = dashboardSiteDisplayUrl(site.slug, siteOrigin)
    const previewPath = site.previewPath ?? dashboardSitePath(site.slug)
    const isCopied    = copied === site.slug
    const [iframeLoaded, setIframeLoaded] = useState(false)
    const displayName = site.dealerName || dealerName

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
                            ? `${displayName} — ${site.label}`
                            : displayName}
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

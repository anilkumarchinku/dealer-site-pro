"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Monitor, Edit3, CheckCircle, Loader2,
    ExternalLink, RefreshCw, Smartphone,
    ChevronDown, Save, Globe, Copy, Check,
    ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { dealerSiteHref, dealerSiteUrl } from "@/lib/utils/domain"

// ── Types ──────────────────────────────────────────────────────────────────────

type DeviceView = "desktop" | "mobile"

interface EditForm {
    styleTemplate: string
    heroTitle:     string
    heroSubtitle:  string
    heroCtaText:   string
    tagline:       string
    workingHours:  string
}

const TEMPLATES = [
    { id: "family",       label: "Family",       desc: "Friendly blue — great for all dealers"   },
    { id: "luxury",       label: "Luxury",       desc: "Black & minimal — premium feel"           },
    { id: "modern",       label: "Modern",       desc: "Dark indigo — tech-forward look"          },
    { id: "sporty",       label: "Sporty",       desc: "Bold red & white — performance dealers"   },
]

// ── Component ──────────────────────────────────────────────────────────────────

export default function SiteEditorPage() {
    const params    = useParams()
    const router    = useRouter()
    const siteSlug  = params.siteSlug as string

    const { dealerId, dealerSlug, setDealerId, setDealerSlug } = useOnboardingStore()

    // The brand-slug is whatever comes after "{dealerSlug}-" in the siteSlug.
    // e.g. siteSlug="abhi-motors-tata", dealerSlug="abhi-motors" → brandSlug="tata"
    // For the main site (siteSlug === dealerSlug) brandSlug is null.
    const brandSlug: string | null =
        dealerSlug && siteSlug !== dealerSlug && siteSlug.startsWith(dealerSlug + '-')
            ? siteSlug.slice(dealerSlug.length + 1)
            : null

    const [device,       setDevice]       = useState<DeviceView>("desktop")
    const [editOpen,     setEditOpen]     = useState(false)
    const [saving,       setSaving]       = useState(false)
    const [saveOk,       setSaveOk]       = useState(false)
    const [iframeKey,    setIframeKey]    = useState(0)
    const [copied,       setCopied]       = useState(false)
    const [initializing, setInitializing] = useState(true)

    const [editForm, setEditForm] = useState<EditForm>({
        styleTemplate: "family",
        heroTitle:     "",
        heroSubtitle:  "",
        heroCtaText:   "Explore Inventory",
        tagline:       "",
        workingHours:  "",
    })

    // ── Bootstrap: load dealer if store not yet populated ────────────────────
    useEffect(() => {
        if (dealerId) { loadEditorData(dealerId); return }

        async function selfInit() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return
                const { data: dealer } = await supabase
                    .from("dealers")
                    .select("id, slug")
                    .eq("user_id", user.id)
                    .maybeSingle()
                if (dealer?.id)   { setDealerId(dealer.id);   await loadEditorData(dealer.id) }
                if (dealer?.slug) setDealerSlug(dealer.slug)
            } finally {
                setInitializing(false)
            }
        }
        selfInit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (dealerId) loadEditorData(dealerId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dealerId, brandSlug])

    async function loadEditorData(id: string) {
        setInitializing(true)
        try {
            if (brandSlug) {
                // Brand-specific config from dealer_site_configs
                const { data: siteConfig } = await supabase
                    .from("dealer_site_configs")
                    .select("style_template, hero_title, hero_subtitle, hero_cta_text, tagline, working_hours")
                    .eq("dealer_id", id)
                    .eq("brand_slug", brandSlug)
                    .maybeSingle()

                // Fall back to main config for defaults
                const { data: mainConfig } = await supabase
                    .from("dealer_template_configs")
                    .select("hero_title, hero_subtitle, hero_cta_text, working_hours")
                    .eq("dealer_id", id)
                    .maybeSingle()

                const { data: dealer } = await supabase
                    .from("dealers")
                    .select("style_template, tagline")
                    .eq("id", id)
                    .single()

                setEditForm({
                    styleTemplate: siteConfig?.style_template ?? dealer?.style_template ?? "family",
                    heroTitle:     siteConfig?.hero_title     ?? mainConfig?.hero_title     ?? "",
                    heroSubtitle:  siteConfig?.hero_subtitle  ?? mainConfig?.hero_subtitle  ?? "",
                    heroCtaText:   siteConfig?.hero_cta_text  ?? mainConfig?.hero_cta_text  ?? "Explore Inventory",
                    tagline:       siteConfig?.tagline        ?? dealer?.tagline            ?? "",
                    workingHours:  siteConfig?.working_hours  ?? mainConfig?.working_hours  ?? "",
                })
            } else {
                // Main site — use dealer_template_configs
                const { data: dealer } = await supabase
                    .from("dealers")
                    .select("style_template, tagline, slug")
                    .eq("id", id)
                    .single()

                if (dealer?.slug && !dealerSlug) setDealerSlug(dealer.slug)

                const { data: tc } = await supabase
                    .from("dealer_template_configs")
                    .select("hero_title, hero_subtitle, hero_cta_text, working_hours")
                    .eq("dealer_id", id)
                    .maybeSingle()

                setEditForm({
                    styleTemplate: dealer?.style_template ?? "family",
                    heroTitle:     tc?.hero_title    ?? "",
                    heroSubtitle:  tc?.hero_subtitle ?? "",
                    heroCtaText:   tc?.hero_cta_text ?? "Explore Inventory",
                    tagline:       dealer?.tagline   ?? "",
                    workingHours:  tc?.working_hours ?? "",
                })
            }
        } finally {
            setInitializing(false)
        }
    }

    // ── Save ─────────────────────────────────────────────────────────────────
    async function handleSave() {
        if (!dealerId) return
        setSaving(true)
        setSaveOk(false)

        if (brandSlug) {
            // Upsert into dealer_site_configs
            await supabase
                .from("dealer_site_configs")
                .upsert({
                    dealer_id:     dealerId,
                    brand_slug:    brandSlug,
                    style_template: editForm.styleTemplate,
                    hero_title:    editForm.heroTitle    || null,
                    hero_subtitle: editForm.heroSubtitle || null,
                    hero_cta_text: editForm.heroCtaText  || null,
                    tagline:       editForm.tagline      || null,
                    working_hours: editForm.workingHours || null,
                }, { onConflict: 'dealer_id,brand_slug' })
        } else {
            // Update dealers + dealer_template_configs (main site)
            await supabase
                .from("dealers")
                .update({
                    style_template: editForm.styleTemplate,
                    tagline:        editForm.tagline || null,
                })
                .eq("id", dealerId)

            const { data: existing } = await supabase
                .from("dealer_template_configs")
                .select("id")
                .eq("dealer_id", dealerId)
                .maybeSingle()

            if (existing) {
                await supabase
                    .from("dealer_template_configs")
                    .update({
                        hero_title:    editForm.heroTitle    || null,
                        hero_subtitle: editForm.heroSubtitle || null,
                        hero_cta_text: editForm.heroCtaText  || null,
                        working_hours: editForm.workingHours || null,
                    })
                    .eq("dealer_id", dealerId)
            } else {
                await supabase
                    .from("dealer_template_configs")
                    .insert({
                        dealer_id:     dealerId,
                        hero_title:    editForm.heroTitle    || null,
                        hero_subtitle: editForm.heroSubtitle || null,
                        hero_cta_text: editForm.heroCtaText  || null,
                        working_hours: editForm.workingHours || null,
                    })
            }
        }

        setSaving(false)
        setSaveOk(true)
        setIframeKey(k => k + 1)
        setTimeout(() => setSaveOk(false), 3000)
    }

    function handleCopyUrl() {
        navigator.clipboard.writeText(dealerSiteHref(siteSlug))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // ── Derived ───────────────────────────────────────────────────────────────
    const previewUrl     = `/sites/${siteSlug}`
    const liveUrl        = dealerSiteHref(siteSlug)
    const liveUrlDisplay = dealerSiteUrl(siteSlug)

    // Brand label for the page heading
    const brandLabel = brandSlug
        ? brandSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : null

    return (
        <div className="space-y-6 animate-fade-in">

            {/* ── Header ── */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/dashboard/webpage")}
                        className="gap-1.5 text-muted-foreground"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        My Webpages
                    </Button>
                    {brandLabel && (
                        <>
                            <span className="text-muted-foreground">/</span>
                            <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                                {brandLabel}
                            </span>
                        </>
                    )}
                </div>

                <Button
                    onClick={handleSave}
                    disabled={saving || !dealerId}
                    size="lg"
                    className="gap-2 font-semibold bg-primary hover:bg-primary/90"
                >
                    {saving ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    ) : saveOk ? (
                        <><CheckCircle className="w-4 h-4" /> Saved!</>
                    ) : (
                        <><Save className="w-4 h-4" /> Save Changes</>
                    )}
                </Button>
            </div>

            {/* ── Live URL Banner ── */}
            <Card variant="glass" className="border-emerald-500/30 bg-emerald-500/5">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                Live
                            </span>
                        </div>

                        <a
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm font-mono text-primary hover:underline"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            {liveUrlDisplay}
                            <ExternalLink className="w-3 h-3" />
                        </a>

                        <div className="ml-auto flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCopyUrl}
                                className="gap-1.5 h-8 text-xs"
                            >
                                {copied
                                    ? <><Check className="w-3.5 h-3.5 text-green-500" /> Copied!</>
                                    : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                            </Button>
                            <Button size="sm" asChild className="gap-1.5 h-8 text-xs">
                                <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Visit Site
                                </a>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Main: Preview + Edit Panel ── */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

                {/* Preview */}
                <Card variant="glass" className="overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between border-b border-border px-4 py-2">
                        <span className="flex items-center gap-1.5 text-sm font-medium">
                            <Monitor className="w-3.5 h-3.5" />
                            Preview
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setDevice("desktop")}
                                className={cn(
                                    "p-1.5 rounded-lg transition-colors",
                                    device === "desktop"
                                        ? "bg-muted text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                                title="Desktop view"
                            >
                                <Monitor className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setDevice("mobile")}
                                className={cn(
                                    "p-1.5 rounded-lg transition-colors",
                                    device === "mobile"
                                        ? "bg-muted text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                                title="Mobile view"
                            >
                                <Smartphone className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIframeKey(k => k + 1)}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                title="Refresh preview"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <a
                                href={liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                title="Open live site"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* iframe */}
                    <div className={cn("bg-muted/30 flex justify-center p-4", "min-h-[600px]")}>
                        {initializing ? (
                            <div className="flex flex-col items-center justify-center h-[400px] gap-3">
                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                <p className="text-muted-foreground text-sm">Loading preview…</p>
                            </div>
                        ) : (
                            <iframe
                                key={iframeKey}
                                src={previewUrl}
                                className={cn(
                                    "rounded-xl border border-border shadow-lg bg-white transition-all duration-300",
                                    device === "desktop" ? "w-full h-[580px]" : "w-[390px] h-[580px]"
                                )}
                                title="Site preview"
                            />
                        )}
                    </div>
                </Card>

                {/* Edit panel */}
                <div className="space-y-4">
                    <Card variant="glass">
                        <button
                            onClick={() => setEditOpen(o => !o)}
                            className="w-full flex items-center justify-between p-4 text-left"
                        >
                            <div className="flex items-center gap-2 font-semibold">
                                <Edit3 className="w-4 h-4 text-primary" />
                                Edit Design
                            </div>
                            <ChevronDown className={cn(
                                "w-4 h-4 text-muted-foreground transition-transform",
                                editOpen && "rotate-180"
                            )} />
                        </button>

                        {editOpen && (
                            <CardContent className="pt-0 space-y-4">

                                {/* Template picker */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                        Template Style
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {TEMPLATES.map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => setEditForm(f => ({ ...f, styleTemplate: t.id }))}
                                                className={cn(
                                                    "p-3 rounded-xl border-2 text-left transition-all",
                                                    editForm.styleTemplate === t.id
                                                        ? "border-primary bg-primary/10"
                                                        : "border-border hover:border-muted-foreground/40"
                                                )}
                                            >
                                                <p className="text-sm font-semibold">{t.label}</p>
                                                <p className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                        Hero Title
                                    </label>
                                    <Input
                                        value={editForm.heroTitle}
                                        onChange={e => setEditForm(f => ({ ...f, heroTitle: e.target.value }))}
                                        placeholder="Welcome to Kumar Motors"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                        Hero Subtitle
                                    </label>
                                    <Input
                                        value={editForm.heroSubtitle}
                                        onChange={e => setEditForm(f => ({ ...f, heroSubtitle: e.target.value }))}
                                        placeholder="Your trusted dealer in Mumbai"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                        Button Text
                                    </label>
                                    <Input
                                        value={editForm.heroCtaText}
                                        onChange={e => setEditForm(f => ({ ...f, heroCtaText: e.target.value }))}
                                        placeholder="Explore Inventory"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                        Tagline
                                    </label>
                                    <Input
                                        value={editForm.tagline}
                                        onChange={e => setEditForm(f => ({ ...f, tagline: e.target.value }))}
                                        placeholder="Driven by Trust"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                        Working Hours
                                    </label>
                                    <Input
                                        value={editForm.workingHours}
                                        onChange={e => setEditForm(f => ({ ...f, workingHours: e.target.value }))}
                                        placeholder="Mon–Sat: 9am – 7pm"
                                    />
                                </div>

                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full"
                                    variant="outline"
                                >
                                    {saving ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                                    ) : saveOk ? (
                                        <><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Saved!</>
                                    ) : (
                                        <><Save className="w-4 h-4 mr-2" /> Save Changes</>
                                    )}
                                </Button>

                                <p className="text-xs text-muted-foreground text-center">
                                    Changes reflect on your live site immediately after saving.
                                </p>

                            </CardContent>
                        )}
                    </Card>
                </div>

            </div>
        </div>
    )
}

"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Monitor, Code2, Edit3, Rocket, CheckCircle, Loader2,
    XCircle, ExternalLink, Github, RefreshCw, Smartphone,
    ChevronDown, Save, Globe, GitCommit
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab        = "preview" | "code"
type DeviceView = "desktop" | "mobile"
type DeployStatus = "idle" | "creating_repo" | "pushing_code" | "deploying" | "live" | "error"

interface EditForm {
    styleTemplate: string
    heroTitle:     string
    heroSubtitle:  string
    heroCtaText:   string
    tagline:       string
    workingHours:  string
}

interface DeployRecord {
    id:             string
    status:         string
    site_url:       string | null
    version_number: number | null
    commit_message: string | null
    created_at:     string
    vercel_deploy_id: string | null
    is_current:     boolean | null
}

const TEMPLATES = [
    { id: "family",  label: "Family",  desc: "Friendly blue — great for all dealers"   },
    { id: "luxury",  label: "Luxury",  desc: "Black & minimal — premium feel"           },
    { id: "modern",  label: "Modern",  desc: "Dark indigo — tech-forward look"          },
    { id: "sporty",  label: "Sporty",  desc: "Bold red & white — performance dealers"   },
]

const DEPLOY_STEPS = [
    { key: "creating_repo", label: "Creating GitHub repo"   },
    { key: "pushing_code",  label: "Pushing site code"      },
    { key: "deploying",     label: "Deploying on Vercel"    },
    { key: "live",          label: "Your site is live!"     },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function WebpagePage() {
    const { dealerId, dealerSlug, setDealerId, setDealerSlug } = useOnboardingStore()

    const [tab,        setTab]        = useState<Tab>("preview")
    const [device,     setDevice]     = useState<DeviceView>("desktop")
    const [editOpen,   setEditOpen]   = useState(false)
    const [saving,     setSaving]     = useState(false)
    const [saveOk,     setSaveOk]     = useState(false)
    const [iframeKey,  setIframeKey]  = useState(0)   // bump to reload iframe

    const [deployStatus,  setDeployStatus]  = useState<DeployStatus>("idle")
    const [deployId,      setDeployId]      = useState<string | null>(null)
    const [siteUrl,       setSiteUrl]       = useState<string | null>(null)
    const [deployError,   setDeployError]   = useState<string | null>(null)
    const [deployments,   setDeployments]   = useState<DeployRecord[]>([])

    const [configCode, setConfigCode]   = useState("")
    const [editForm,   setEditForm]     = useState<EditForm>({
        styleTemplate: "family",
        heroTitle:     "",
        heroSubtitle:  "",
        heroCtaText:   "Explore Inventory",
        tagline:       "",
        workingHours:  "",
    })

    // Local slug state — updated from either the Zustand store or a direct DB query
    const [localSlug,   setLocalSlug]   = useState<string | null>(dealerSlug)
    const [initializing, setInitializing] = useState(!dealerSlug)

    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // ── Watch Zustand store: layout's syncFromDB will set dealerSlug ──────────
    // When the dashboard layout resolves the dealer and updates the Zustand store,
    // this effect picks it up and updates our local slug immediately.
    useEffect(() => {
        if (dealerSlug) {
            setLocalSlug(dealerSlug)
            setInitializing(false)
        }
    }, [dealerSlug])

    // ── Self-initialise: resolve slug directly from DB (runs in parallel) ─────
    useEffect(() => {
        // Already resolved
        if (localSlug || dealerSlug) { setInitializing(false); return }

        async function selfInit() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return
                const { data: dealer } = await supabase
                    .from("dealers")
                    .select("id, slug")
                    .eq("user_id", user.id)
                    .eq("onboarding_complete", true)
                    .maybeSingle()
                if (!dealer?.slug) return
                if (dealer.id)  setDealerId(dealer.id)
                setDealerSlug(dealer.slug)   // updates Zustand store
                setLocalSlug(dealer.slug)    // updates local state immediately
            } finally {
                setInitializing(false)
            }
        }
        selfInit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // ── Load dealer data once dealerId is known ───────────────────────────────
    useEffect(() => {
        if (!dealerId) return
        loadDealerData()
    }, [dealerId])

    async function loadDealerData() {
        if (!dealerId) return
        const { data: dealer } = await supabase
            .from("dealers")
            .select("style_template, tagline, slug")
            .eq("id", dealerId)
            .single()

        // Keep slug in sync in case it wasn't in the store yet
        if (dealer?.slug && !dealerSlug) setDealerSlug(dealer.slug)

        const { data: tc } = await supabase
            .from("dealer_template_configs")
            .select("hero_title, hero_subtitle, hero_cta_text, working_hours")
            .eq("dealer_id", dealerId)
            .single()

        // Load full deployment history (most recent first)
        const { data: history } = await supabase
            .from("dealer_deployments")
            .select("id, status, site_url, version_number, commit_message, created_at, vercel_deploy_id, is_current")
            .eq("dealer_id", dealerId)
            .order("created_at", { ascending: false })
            .limit(20)

        const allDeps = history ?? []
        setDeployments(allDeps)

        if (dealer) {
            setEditForm(prev => ({
                ...prev,
                styleTemplate: dealer.style_template ?? "family",
                tagline:       dealer.tagline ?? "",
                heroTitle:     tc?.hero_title     ?? "",
                heroSubtitle:  tc?.hero_subtitle  ?? "",
                heroCtaText:   tc?.hero_cta_text  ?? "Explore Inventory",
                workingHours:  tc?.working_hours  ?? "",
            }))
        }

        // Derive deploy state from history
        const building = allDeps.find(d => d.status === "building" || d.status === "queued")
        const current  = allDeps.find(d => d.is_current) ?? allDeps.find(d => d.status === "ready")

        if (building?.id) {
            setDeployStatus("deploying")
            setDeployId(building.id)
            if (building.site_url) setSiteUrl(building.site_url)
            pollRef.current = setInterval(() => pollStatus(building.id), 5000)
        } else if (current) {
            setDeployStatus("live")
            setSiteUrl(current.site_url)
            setDeployId(current.id)
        } else if (allDeps.length > 0 && allDeps[0].status === "error") {
            setDeployStatus("error")
            setDeployError("Previous deployment failed. Click Retry to try again.")
        }
    }

    // ── Reload just the deployment list (called after poll completes) ─────────
    async function loadDeployments() {
        if (!dealerId) return
        const { data: history } = await supabase
            .from("dealer_deployments")
            .select("id, status, site_url, version_number, commit_message, created_at, vercel_deploy_id, is_current")
            .eq("dealer_id", dealerId)
            .order("created_at", { ascending: false })
            .limit(20)
        setDeployments(history ?? [])
    }

    // ── Generate config code preview ──────────────────────────────────────────
    useEffect(() => {
        if (!localSlug) return
        setConfigCode(`// dealer.config.ts — auto-generated
// Pushed to GitHub on every "Go Live" / save

import type { DealerConfig } from './types/dealer-config'

const config: DealerConfig = {
    slug:          '${localSlug}',
    styleTemplate: '${editForm.styleTemplate}',
    tagline:       ${editForm.tagline ? `'${editForm.tagline}'` : "null"},
    hero: {
        title:    '${editForm.heroTitle   || "Welcome to your dealership"}',
        subtitle: '${editForm.heroSubtitle || "Your trusted car dealership"}',
        ctaText:  '${editForm.heroCtaText || "Explore Inventory"}',
    },
    workingHours: ${editForm.workingHours ? `'${editForm.workingHours}'` : "null"},
    // ... rest of config generated from your onboarding data
}

export default config`)
    }, [editForm, localSlug])

    // ── Save edits to Supabase ────────────────────────────────────────────────
    async function handleSave() {
        if (!dealerId) return
        setSaving(true)
        setSaveOk(false)

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
            .single()

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

        setSaving(false)
        setSaveOk(true)
        setIframeKey(k => k + 1)   // reload preview
        setTimeout(() => setSaveOk(false), 3000)
    }

    // ── Poll deploy status ────────────────────────────────────────────────────
    const pollStatus = useCallback(async (id: string) => {
        const res  = await fetch(`/api/deploy/status/${id}`)
        const data = await res.json()
        if (data.status === "ready") {
            setDeployStatus("live")
            setSiteUrl(data.siteUrl)
            if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
            loadDeployments()   // refresh history — shows new commit as ✓ Live
        } else if (data.status === "error") {
            setDeployStatus("error")
            setDeployError(data.error ?? "Build failed")
            if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
            loadDeployments()   // refresh history — shows failed commit
        } else {
            setDeployStatus("deploying")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // ── Go Live / Republish ───────────────────────────────────────────────────
    async function handleGoLive() {
        if (!dealerId) return
        // Clear any in-flight poll before starting fresh
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
        setDeployError(null)
        setDeployStatus("creating_repo")

        // Save latest edits first
        await handleSave()

        setDeployStatus("pushing_code")

        const res  = await fetch("/api/deploy", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ dealerId }),
        })
        const data = await res.json()

        if (!res.ok || !data.success) {
            setDeployStatus("error")
            setDeployError(data.error ?? "Deployment failed")
            return
        }

        setDeployStatus("deploying")
        setSiteUrl(data.siteUrl)

        // Use Supabase record ID if available, fall back to Vercel build ID
        const pollId = data.deployId ?? data.buildId
        if (!pollId) {
            setDeployStatus("error")
            setDeployError("Deployment started but status tracking failed — check Vercel dashboard.")
            return
        }
        setDeployId(pollId)

        // Refresh history immediately so new commit appears in the list
        await loadDeployments()

        // Poll every 5s
        pollRef.current = setInterval(() => pollStatus(pollId), 5000)
    }

    useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current) }, [])

    // ── Derived ───────────────────────────────────────────────────────────────
    const isDeploying = ["creating_repo", "pushing_code", "deploying"].includes(deployStatus)
    const isLive      = deployStatus === "live"
    // Use localSlug (updated from both DB query + Zustand watcher) for the iframe URL
    const previewUrl  = localSlug ? `/sites/${localSlug}` : null
    const currentStepIndex = DEPLOY_STEPS.findIndex(s => s.key === deployStatus)

    return (
        <div className="space-y-6 animate-fade-in">

            {/* ── Header ── */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold">My Webpage</h1>
                    <p className="text-muted-foreground">
                        Preview your site, edit the design, and go live in one click
                    </p>
                </div>

                {/* Go Live / Redeploy button */}
                <Button
                    onClick={handleGoLive}
                    disabled={isDeploying || !dealerId}
                    size="lg"
                    className={cn(
                        "gap-2 font-semibold",
                        isLive
                            ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    )}
                >
                    {isDeploying ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
                    ) : isLive ? (
                        <><RefreshCw className="w-4 h-4" /> Republish</>
                    ) : (
                        <><Rocket className="w-4 h-4" /> Go Live</>
                    )}
                </Button>
            </div>

            {/* ── Deploy Progress Bar ── */}
            {(isDeploying || isLive || deployStatus === "error") && deployStatus !== "idle" && (
                <Card variant="glass">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3 flex-wrap">
                            {DEPLOY_STEPS.map((step, i) => {
                                const done    = isLive ? true : i < currentStepIndex
                                const active  = !isLive && i === currentStepIndex
                                const isError = deployStatus === "error" && i === currentStepIndex
                                return (
                                    <div key={step.key} className="flex items-center gap-2">
                                        {done    && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                                        {active  && <Loader2     className="w-4 h-4 text-blue-500 animate-spin shrink-0" />}
                                        {isError && <XCircle     className="w-4 h-4 text-red-500 shrink-0" />}
                                        {!done && !active && !isError && (
                                            <div className="w-4 h-4 rounded-full border-2 border-border shrink-0" />
                                        )}
                                        <span className={cn(
                                            "text-sm",
                                            done    ? "text-foreground font-medium" :
                                            active  ? "text-blue-500 font-medium"   :
                                            isError ? "text-red-500"                :
                                                      "text-muted-foreground"
                                        )}>{step.label}</span>
                                        {i < DEPLOY_STEPS.length - 1 && (
                                            <div className={cn(
                                                "hidden md:block h-px w-6",
                                                done ? "bg-emerald-500" : "bg-border"
                                            )} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {isLive && siteUrl && (
                            <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <Globe className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                    Your site is live!
                                </span>
                                <a
                                    href={siteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-auto flex items-center gap-1.5 text-sm text-blue-500 hover:underline"
                                >
                                    {siteUrl.replace("https://", "")}
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        )}

                        {deployStatus === "error" && deployError && (
                            <div className="mt-3 flex items-center justify-between gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                <div className="flex items-center gap-2">
                                    <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                                    <p className="text-sm text-red-400">{deployError}</p>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={handleGoLive}
                                    disabled={isDeploying}
                                    className="gap-1.5 shrink-0 bg-red-500 hover:bg-red-600 text-white"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Retry
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* ── Main Content ── */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

                {/* ── Left: Preview + Code ── */}
                <Card variant="glass" className="overflow-hidden">
                    {/* Tab bar */}
                    <div className="flex items-center justify-between border-b border-border px-4 py-2">
                        <div className="flex gap-1">
                            {(["preview", "code"] as Tab[]).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize",
                                        tab === t
                                            ? "bg-foreground text-background"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {t === "preview" ? <Monitor className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
                                    {t === "preview" ? "Preview" : "Code"}
                                </button>
                            ))}
                        </div>

                        {tab === "preview" && (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setDevice("desktop")}
                                    className={cn(
                                        "p-1.5 rounded-lg transition-colors",
                                        device === "desktop" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Monitor className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setDevice("mobile")}
                                    className={cn(
                                        "p-1.5 rounded-lg transition-colors",
                                        device === "mobile" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
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
                                {siteUrl && (
                                    <a
                                        href={siteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                        title="Open live site"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Preview iframe */}
                    {tab === "preview" && (
                        <div className={cn(
                            "bg-muted/30 flex justify-center p-4",
                            device === "desktop" ? "min-h-[600px]" : "min-h-[600px]"
                        )}>
                            {previewUrl ? (
                                <iframe
                                    key={iframeKey}
                                    src={previewUrl}
                                    className={cn(
                                        "rounded-xl border border-border shadow-lg bg-white transition-all duration-300",
                                        device === "desktop" ? "w-full h-[580px]" : "w-[390px] h-[580px]"
                                    )}
                                    title="Site preview"
                                />
                            ) : initializing ? (
                                <div className="flex flex-col items-center justify-center h-[400px] text-center gap-3">
                                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                                    <p className="text-muted-foreground text-sm">Loading your site preview…</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[400px] text-center gap-3">
                                    <Monitor className="w-12 h-12 text-muted-foreground/30" />
                                    <p className="text-muted-foreground text-sm">
                                        Complete onboarding to see your preview
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Code view */}
                    {tab === "code" && (
                        <div className="p-4">
                            <div className="rounded-xl bg-gray-950 border border-border overflow-auto">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                                    <span className="text-xs text-white/40 font-mono">dealer.config.ts</span>
                                    <span className="text-xs text-white/30">auto-generated · pushed on Go Live</span>
                                </div>
                                <pre className="p-4 text-sm font-mono text-green-400 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                                    {configCode || "// Loading config..."}
                                </pre>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                This file is automatically generated from your dealer data and pushed to GitHub every time you click Go Live.
                            </p>
                        </div>
                    )}
                </Card>

                {/* ── Right: Edit Panel ── */}
                <div className="space-y-4">

                    {/* Edit toggle */}
                    <Card variant="glass">
                        <button
                            onClick={() => setEditOpen(o => !o)}
                            className="w-full flex items-center justify-between p-4 text-left"
                        >
                            <div className="flex items-center gap-2 font-semibold">
                                <Edit3 className="w-4 h-4 text-blue-500" />
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
                                                        ? "border-blue-500 bg-blue-500/10"
                                                        : "border-border hover:border-muted-foreground/40"
                                                )}
                                            >
                                                <p className="text-sm font-semibold">{t.label}</p>
                                                <p className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Hero Title */}
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

                                {/* Hero Subtitle */}
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

                                {/* CTA Button Text */}
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

                                {/* Tagline */}
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

                                {/* Working Hours */}
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

                                {/* Save button */}
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full"
                                    variant="outline"
                                >
                                    {saving ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                                    ) : saveOk ? (
                                        <><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Saved!</>
                                    ) : (
                                        <><Save className="w-4 h-4 mr-2" /> Save Changes</>
                                    )}
                                </Button>

                                <p className="text-xs text-muted-foreground text-center">
                                    Save updates the preview. Click Go Live to publish changes.
                                </p>
                            </CardContent>
                        )}
                    </Card>

                    {/* Live site card */}
                    {isLive && siteUrl && (
                        <Card className="hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-5 space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-xl bg-emerald-500/10">
                                        <Globe className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Site is Live</p>
                                        <p className="text-xs text-muted-foreground">Your website is publicly accessible</p>
                                    </div>
                                </div>
                                <a
                                    href={siteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between w-full p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                                >
                                    <span className="text-sm font-mono text-blue-500 truncate">
                                        {siteUrl.replace("https://", "")}
                                    </span>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0 ml-2" />
                                </a>
                            </CardContent>
                        </Card>
                    )}

                    {/* GitHub card */}
                    <Card className="hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 rounded-xl bg-violet-500/10">
                                    <Github className="w-5 h-5 text-violet-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">GitHub Repo</p>
                                    <p className="text-xs text-muted-foreground">Auto-created on first Go Live</p>
                                </div>
                            </div>
                            {localSlug ? (
                                <p className="text-xs font-mono text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
                                    github.com/wearecyepro-hue/dealer-{localSlug}
                                </p>
                            ) : (
                                <p className="text-xs text-muted-foreground">Complete onboarding to see your repo</p>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>

            {/* ── Deployment History (commit log) ── */}
            {deployments.length > 0 && (
                <Card variant="glass">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <GitCommit className="w-4 h-4 text-violet-500" />
                            <h3 className="text-sm font-semibold">Deployment History</h3>
                            <span className="text-xs text-muted-foreground ml-auto">
                                {deployments.length} deploy{deployments.length !== 1 ? "s" : ""}
                            </span>
                        </div>

                        <div className="space-y-0">
                            {deployments.map((dep, i) => {
                                const isCurrentLive = dep.is_current === true ||
                                    (!deployments.some(d => d.is_current) && dep.status === "ready" && i === deployments.findIndex(d => d.status === "ready"))
                                const isBuilding = dep.status === "building" || dep.status === "queued"
                                const isFailed   = dep.status === "error"
                                const isReady    = dep.status === "ready"

                                return (
                                    <div
                                        key={dep.id}
                                        className={cn(
                                            "flex items-start gap-3 py-3 border-b border-border/40 last:border-0",
                                            isCurrentLive && "bg-emerald-500/5 -mx-5 px-5 rounded-xl"
                                        )}
                                    >
                                        {/* Timeline dot + line */}
                                        <div className="flex flex-col items-center shrink-0 mt-0.5">
                                            {isBuilding && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                                            {isReady    && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                            {isFailed   && <XCircle className="w-4 h-4 text-red-500" />}
                                            {i < deployments.length - 1 && (
                                                <div className="w-px h-full min-h-[16px] bg-border/50 mt-1" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {/* Version badge */}
                                                <span className="text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                                    v{dep.version_number ?? "?"}
                                                </span>

                                                {/* Status chip */}
                                                <span className={cn(
                                                    "text-[11px] px-2 py-0.5 rounded-full font-semibold",
                                                    isReady    ? "bg-emerald-500/15 text-emerald-500" :
                                                    isFailed   ? "bg-red-500/15 text-red-500"         :
                                                                 "bg-blue-500/15 text-blue-500"
                                                )}>
                                                    {isReady ? "Live" : isFailed ? "Failed" : "Building…"}
                                                </span>

                                                {/* Current badge */}
                                                {isCurrentLive && (
                                                    <span className="text-[11px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-semibold">
                                                        ● Current
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-xs text-muted-foreground mt-1 truncate">
                                                {dep.commit_message ?? "Dashboard deploy"}
                                                {" · "}
                                                {formatDistanceToNow(new Date(dep.created_at), { addSuffix: true })}
                                            </p>
                                        </div>

                                        {/* Open link */}
                                        {dep.site_url && (
                                            <a
                                                href={dep.site_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                                title="Open this deployment"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

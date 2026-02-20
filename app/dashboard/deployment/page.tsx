"use client"

import { useState, useEffect, useCallback } from "react"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Rocket, Github, Globe, CheckCircle, XCircle,
    Loader2, RefreshCw, ExternalLink, Clock, Zap, Store
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────────────────────

type DeployStatus = "idle" | "queued" | "building" | "ready" | "error"

interface DeployState {
    deployId:   string | null
    siteUrl:    string | null
    githubRepo: string | null
    vercelUrl:  string | null
    status:     DeployStatus
    progress:   number
    error:      string | null
}

// ── Pipeline steps shown in the UI ───────────────────────────────────────────

const PIPELINE_STEPS = [
    { id: "generate",  label: "Generate site config",      progressMin: 0  },
    { id: "github",    label: "Create GitHub repo",         progressMin: 20 },
    { id: "push",      label: "Push dealer config",         progressMin: 35 },
    { id: "vercel",    label: "Create Vercel project",      progressMin: 50 },
    { id: "deploy",    label: "Trigger deployment",         progressMin: 65 },
    { id: "build",     label: "Vercel building site",       progressMin: 75 },
    { id: "live",      label: "Site is live!",              progressMin: 100 },
]

function getStepStatus(
    stepProgress: number,
    currentProgress: number,
    overallStatus: DeployStatus,
): "pending" | "active" | "done" | "error" {
    if (overallStatus === "error" && currentProgress < stepProgress + 15)
        return "error"
    if (currentProgress >= stepProgress + 15) return "done"
    if (currentProgress >= stepProgress)      return "active"
    return "pending"
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DeploymentPage() {
    const { dealerId } = useOnboardingStore()

    // Dealer type fetched from Supabase — null while loading
    const [isFirstHand, setIsFirstHand]     = useState<boolean | null>(null)
    const [multiTenantUrl, setMultiTenantUrl] = useState<string | null>(null)
    const [dealerLoading, setDealerLoading] = useState(true)

    // Fetch dealer type on mount
    useEffect(() => {
        if (!dealerId) { setDealerLoading(false); return }

        async function load() {
            try {
                const { data } = await supabase
                    .from('dealers')
                    .select('sells_new_cars, sells_used_cars, slug')
                    .eq('id', dealerId!)
                    .single()
                if (!data) return
                // All dealers use the multi-tenant platform
                setIsFirstHand(true)
                if (data.slug) {
                    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'dealersitepro.com'
                    const useSubdomain = process.env.NEXT_PUBLIC_USE_SUBDOMAIN === 'true'
                    setMultiTenantUrl(
                        useSubdomain
                            ? `https://${data.slug}.${baseDomain}`
                            : `https://${baseDomain}/sites/${data.slug}`
                    )
                }
            } finally {
                setDealerLoading(false)
            }
        }
        load()
    }, [dealerId])

    const [state, setState] = useState<DeployState>({
        deployId:   null,
        siteUrl:    null,
        githubRepo: null,
        vercelUrl:  null,
        status:     "idle",
        progress:   0,
        error:      null,
    })

    // ── Poll status while building ────────────────────────────────────────────
    const pollStatus = useCallback(async (deployId: string) => {
        try {
            const res  = await fetch(`/api/deploy/status/${deployId}`)
            const data = await res.json()
            setState(prev => ({
                ...prev,
                status:   data.status,
                progress: data.progress ?? prev.progress,
                siteUrl:  data.siteUrl  ?? prev.siteUrl,
                error:    data.error    ?? null,
            }))
        } catch {
            // silently ignore poll errors
        }
    }, [])

    useEffect(() => {
        if (!state.deployId) return
        if (state.status === "ready" || state.status === "error") return

        const interval = setInterval(() => pollStatus(state.deployId!), 5000)
        return () => clearInterval(interval)
    }, [state.deployId, state.status, pollStatus])

    // ── Trigger deploy ────────────────────────────────────────────────────────
    const handleDeploy = async () => {
        if (!dealerId) return
        setState(prev => ({ ...prev, status: "queued", progress: 5, error: null }))

        try {
            const res  = await fetch("/api/deploy", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ dealerId }),
            })
            const data = await res.json()

            if (!res.ok || !data.success) {
                setState(prev => ({
                    ...prev,
                    status: "error",
                    error:  data.error ?? "Deployment failed",
                }))
                return
            }

            setState(prev => ({
                ...prev,
                deployId:   data.deployId,
                siteUrl:    data.siteUrl,
                githubRepo: data.githubRepo,
                vercelUrl:  data.vercelUrl,
                status:     "building",
                progress:   30,
            }))
        } catch (err) {
            setState(prev => ({
                ...prev,
                status: "error",
                error:  err instanceof Error ? err.message : "Unexpected error",
            }))
        }
    }

    // ── Derived ───────────────────────────────────────────────────────────────
    const isRunning = state.status === "queued" || state.status === "building"
    const isReady   = state.status === "ready"
    const isError   = state.status === "error"
    const isIdle    = state.status === "idle"

    // ── Loading state ─────────────────────────────────────────────────────────
    if (dealerLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    // ── 1st Hand Dealer: Multi-Tenant (site already live, no action needed) ──
    if (isFirstHand) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div>
                    <h1 className="text-2xl font-bold">Your Site</h1>
                    <p className="text-muted-foreground">
                        Your site runs on our shared platform — no separate deployment needed.
                    </p>
                </div>

                <Card variant="glass">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Store className="w-5 h-5 text-emerald-500" />
                            You&apos;re Live on Our Platform
                        </CardTitle>
                        <CardDescription>
                            Your dealership website is hosted on DealerSite Pro&apos;s shared infrastructure.
                            Your inventory is always up to date — no redeployment required when you add or update vehicles.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
                            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Site is live
                            </p>
                            {multiTenantUrl && (
                                <a
                                    href={multiTenantUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-blue-500 hover:underline"
                                >
                                    <Globe className="w-4 h-4" />
                                    {multiTenantUrl}
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                                <span>Instant inventory updates — add a car and it appears on your site immediately</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                                <span>Shared SSL &amp; CDN — fast, secure, always on</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                                <span>Custom domain — connect your own domain in the Domains section</span>
                            </div>
                        </div>

                        {multiTenantUrl && (
                            <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                                <a href={multiTenantUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 w-4 h-4" />
                                    View My Site
                                </a>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    // ── 2nd Hand / Hybrid Dealer: Standalone GitHub + Vercel pipeline ─────────
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Deploy Your Site</h1>
                <p className="text-muted-foreground">
                    Your site gets its own private GitHub repo and Vercel deployment — fully isolated and customisable.
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="mb-4">
                            <div className="p-3 rounded-xl w-fit bg-blue-500/10">
                                <Github className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">GitHub Repo</p>
                        <p className="text-sm font-semibold mt-1 truncate">
                            {state.githubRepo ?? "—"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="mb-4">
                            <div className="p-3 rounded-xl w-fit bg-violet-500/10">
                                <Zap className="w-6 h-6 text-violet-500" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Build Status</p>
                        <p className={cn(
                            "text-sm font-semibold mt-1 capitalize",
                            isReady ? "text-emerald-500" :
                            isError ? "text-red-500"     :
                            isRunning ? "text-amber-500" : "text-muted-foreground"
                        )}>
                            {state.status === "idle" ? "Not deployed yet" : state.status}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="mb-4">
                            <div className="p-3 rounded-xl w-fit bg-emerald-500/10">
                                <Globe className="w-6 h-6 text-emerald-500" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Live URL</p>
                        {state.siteUrl ? (
                            <a
                                href={state.siteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-semibold mt-1 text-blue-500 hover:underline flex items-center gap-1 truncate"
                            >
                                {state.siteUrl.replace("https://", "")}
                                <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                        ) : (
                            <p className="text-sm text-muted-foreground mt-1">—</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Main deploy card */}
            <Card variant="glass">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Rocket className="w-5 h-5" />
                        Deployment Pipeline
                    </CardTitle>
                    <CardDescription>
                        Each deployment creates a private GitHub repo with your site code
                        and publishes it on Vercel — your own standalone site, fully separate.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Progress bar */}
                    {!isIdle && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Progress</span>
                                <span>{state.progress}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-700",
                                        isReady   ? "bg-emerald-500" :
                                        isError   ? "bg-red-500"     :
                                                    "bg-blue-500"
                                    )}
                                    style={{ width: `${state.progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Pipeline steps */}
                    <div className="space-y-3">
                        {PIPELINE_STEPS.map((step) => {
                            const stepStatus = isIdle
                                ? "pending"
                                : getStepStatus(step.progressMin, state.progress, state.status)

                            return (
                                <div key={step.id} className="flex items-center gap-3">
                                    <div className="shrink-0">
                                        {stepStatus === "done"   && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                                        {stepStatus === "active" && <Loader2     className="w-5 h-5 text-blue-500 animate-spin" />}
                                        {stepStatus === "error"  && <XCircle     className="w-5 h-5 text-red-500" />}
                                        {stepStatus === "pending" && (
                                            <div className="w-5 h-5 rounded-full border-2 border-border" />
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-sm",
                                        stepStatus === "done"    ? "text-foreground font-medium" :
                                        stepStatus === "active"  ? "text-blue-500 font-medium"   :
                                        stepStatus === "error"   ? "text-red-500"                :
                                                                   "text-muted-foreground"
                                    )}>
                                        {step.label}
                                    </span>
                                    {stepStatus === "active" && (
                                        <span className="text-xs text-muted-foreground animate-pulse ml-auto">
                                            In progress...
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Error message */}
                    {isError && state.error && (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-500">
                            <strong>Error:</strong> {state.error}
                        </div>
                    )}

                    {/* Success message */}
                    {isReady && state.siteUrl && (
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
                            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Your site is live!
                            </p>
                            <a
                                href={state.siteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-blue-500 hover:underline"
                            >
                                <Globe className="w-4 h-4" />
                                {state.siteUrl}
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <Button
                            onClick={handleDeploy}
                            disabled={isRunning || !dealerId}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                            {isRunning ? (
                                <>
                                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                    Deploying...
                                </>
                            ) : isReady ? (
                                <>
                                    <RefreshCw className="mr-2 w-4 h-4" />
                                    Redeploy
                                </>
                            ) : (
                                <>
                                    <Rocket className="mr-2 w-4 h-4" />
                                    Deploy Site
                                </>
                            )}
                        </Button>

                        {state.vercelUrl && (
                            <Button variant="outline" asChild>
                                <a href={state.vercelUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 w-4 h-4" />
                                    View on Vercel
                                </a>
                            </Button>
                        )}

                        {state.githubRepo && (
                            <Button variant="outline" asChild>
                                <a href={state.githubRepo} target="_blank" rel="noopener noreferrer">
                                    <Github className="mr-2 w-4 h-4" />
                                    View Repo
                                </a>
                            </Button>
                        )}
                    </div>

                    {!dealerId && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Complete onboarding first to unlock deployment.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

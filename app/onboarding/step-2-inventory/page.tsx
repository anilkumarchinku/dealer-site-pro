"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { Button } from "@/components/ui/button"
import {
    ArrowRight, ArrowLeft, Eye, EyeOff,
    CheckCircle2, Zap, Database, ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { InventorySource } from "@/lib/types"

// ── Bentley prestige palette (same as used-car site) ─────────────────────────
const BENTLEY = { primary: '#003328', accent: '#B8962E' }

export default function Step2InventoryPage() {
    const router  = useRouter()
    const { data, updateData, setStep } = useOnboardingStore()

    const [selected,    setSelected]    = useState<InventorySource | null>(
        data.inventorySource ?? null
    )
    const [apiKey,      setApiKey]      = useState(data.cyeproApiKey ?? "")
    const [showKey,     setShowKey]     = useState(false)
    const [keyError,    setKeyError]    = useState("")

    useEffect(() => { setStep(2) }, [setStep])

    // ── Navigation ────────────────────────────────────────────────────────────
    const handleBack = () => router.push("/onboarding/step-2-used")

    const handleContinue = () => {
        if (selected === "cyepro") {
            if (!apiKey.trim()) {
                setKeyError("Please enter your Cyepro API key to continue")
                return
            }
            updateData({ inventorySource: "cyepro", cyeproApiKey: apiKey.trim() })
            setStep(3)
            router.push("/onboarding/step-3")
        } else if (selected === "own") {
            updateData({ inventorySource: "own" })
            router.push("/onboarding/step-2-inventory/bulk-upload")
        }
    }

    const handleSkip = () => {
        updateData({ inventorySource: undefined, cyeproApiKey: undefined })
        setStep(3)
        router.push("/onboarding/step-3")
    }

    return (
        <div className="space-y-8 animate-fade-in">

            {/* ── Heading ── */}
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Step 2 of 5 — Inventory
                </p>
                <h1 className="text-2xl font-bold tracking-tight">
                    How do you manage your vehicle stock?
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
                    We&apos;ll connect your inventory to your website so buyers see live, up-to-date listings.
                    Choose the option that fits your business.
                </p>
            </div>

            {/* ── Option cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* ── Option 1: Cyepro ── */}
                <button
                    onClick={() => { setSelected("cyepro"); setKeyError("") }}
                    className={cn(
                        "group relative text-left rounded-2xl border-2 p-6 transition-all duration-200",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        "active:scale-[0.98]",
                        selected === "cyepro"
                            ? "border-amber-500/60"
                            : "border-border hover:border-amber-400/50"
                    )}
                    style={selected === "cyepro"
                        ? { background: `${BENTLEY.primary}08` }
                        : undefined}
                >
                    {/* Selected check */}
                    {selected === "cyepro" && (
                        <div className="absolute top-4 right-4">
                            <CheckCircle2 className="w-5 h-5 text-amber-600" />
                        </div>
                    )}

                    {/* Icon */}
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border"
                        style={{
                            background:   `${BENTLEY.primary}15`,
                            borderColor:  `${BENTLEY.accent}30`,
                        }}
                    >
                        <Zap className="w-6 h-6" style={{ color: BENTLEY.accent }} />
                    </div>

                    {/* Badge */}
                    <span
                        className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 border"
                        style={{
                            background:  `${BENTLEY.accent}15`,
                            color:       BENTLEY.primary,
                            borderColor: `${BENTLEY.accent}30`,
                        }}
                    >
                        Cyepro Connected
                    </span>

                    <h2 className="text-lg font-bold mb-2" style={{ color: BENTLEY.primary }}>
                        I use Cyepro
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        You already have a Cyepro account. Connect your API key and your live inventory
                        will sync automatically to your website.
                    </p>

                    <ul className="mt-4 space-y-1.5">
                        {[
                            "Live, real-time stock sync",
                            "No manual uploads needed",
                            "Auto-updates when sold",
                        ].map(f => (
                            <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
                                {f}
                            </li>
                        ))}
                    </ul>

                    <div
                        className={cn(
                            "mt-5 flex items-center gap-1.5 text-sm font-semibold transition-all",
                            "group-hover:gap-3"
                        )}
                        style={{ color: BENTLEY.primary }}
                    >
                        Connect Cyepro
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </button>

                {/* ── Option 2: Own inventory ── */}
                <button
                    onClick={() => { setSelected("own"); setKeyError("") }}
                    className={cn(
                        "group relative text-left rounded-2xl border-2 p-6 transition-all duration-200",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        "active:scale-[0.98]",
                        selected === "own"
                            ? "border-blue-500/60 bg-blue-500/5"
                            : "border-border hover:border-blue-500/40"
                    )}
                >
                    {/* Selected check */}
                    {selected === "own" && (
                        <div className="absolute top-4 right-4">
                            <CheckCircle2 className="w-5 h-5 text-blue-500" />
                        </div>
                    )}

                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                        <Database className="w-6 h-6 text-blue-500" />
                    </div>

                    {/* Badge */}
                    <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 bg-blue-500/10 text-blue-600 border border-blue-500/20">
                        Manual Upload
                    </span>

                    <h2 className="text-lg font-bold mb-2 text-blue-600">
                        My Own Inventory
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        No Cyepro account? No problem. Upload your vehicles from a spreadsheet —
                        we&apos;ll guide you through it step by step.
                    </p>

                    <ul className="mt-4 space-y-1.5">
                        {[
                            "Upload from Excel / CSV",
                            "Simple column mapping",
                            "Add more vehicles anytime",
                        ].map(f => (
                            <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-blue-500" />
                                {f}
                            </li>
                        ))}
                    </ul>

                    <div className={cn(
                        "mt-5 flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-all",
                        "group-hover:gap-3"
                    )}>
                        Set up bulk upload
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </button>
            </div>

            {/* ── Cyepro API key input (expands when selected) ── */}
            {selected === "cyepro" && (
                <div
                    className="rounded-2xl border-2 p-6 space-y-4 animate-fade-in"
                    style={{ borderColor: `${BENTLEY.accent}40`, background: `${BENTLEY.primary}06` }}
                >
                    <div>
                        <h3 className="text-sm font-semibold mb-1" style={{ color: BENTLEY.primary }}>
                            Enter your Cyepro API Key
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Find this in your Cyepro dashboard under Settings → API Access.
                            It&apos;s stored securely and never exposed to visitors.
                        </p>
                    </div>

                    <div className="relative">
                        <input
                            type={showKey ? "text" : "password"}
                            value={apiKey}
                            onChange={(e) => { setApiKey(e.target.value); setKeyError("") }}
                            placeholder="Paste your Cyepro API key here…"
                            className={cn(
                                "w-full h-11 text-sm font-mono rounded-xl border px-4 pr-11",
                                "bg-background focus:outline-none focus:ring-2 focus:ring-ring",
                                keyError ? "border-destructive" : "border-input"
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => setShowKey(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>

                    {keyError && (
                        <p className="text-xs text-destructive">{keyError}</p>
                    )}

                    <p className="text-xs text-muted-foreground">
                        Required headers that will be sent automatically:
                        <span className="font-mono ml-1 text-foreground">SERVICE-TYPE-ID: 460 · timeZone: Asia/Calcutta</span>
                    </p>
                </div>
            )}

            {/* ── Footer actions ── */}
            <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                </Button>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        className="text-muted-foreground text-sm"
                        onClick={handleSkip}
                    >
                        Skip for now
                    </Button>

                    {selected && (
                        <Button onClick={handleContinue} className="gap-2">
                            {selected === "own" ? "Set Up Upload" : "Connect & Continue"}
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>

        </div>
    )
}

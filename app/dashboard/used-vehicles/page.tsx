"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import {
    Bike, Truck, Plus, RefreshCw, TrendingUp,
    Car, Settings, ArrowRight, Package
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface UsedStats {
    twoWheeler:   { total: number; loading: boolean }
    threeWheeler: { total: number; loading: boolean }
}

export default function UsedVehiclesPage() {
    const { dealerId, sellsTwoWheelers: sells2W, sellsThreeWheelers: sells3W } = useOnboardingStore()

    const [stats, setStats] = useState<UsedStats>({
        twoWheeler:   { total: 0, loading: true },
        threeWheeler: { total: 0, loading: true },
    })
    const [cyeproConnected, setCyeproConnected] = useState(false)

    const loadStats = useCallback(async () => {
        if (!dealerId) return

        setStats(prev => ({
            twoWheeler:   { ...prev.twoWheeler,   loading: true },
            threeWheeler: { ...prev.threeWheeler, loading: true },
        }))

        const [tw, thw, settings] = await Promise.allSettled([
            fetch(`/api/two-wheelers/used?dealerId=${dealerId}&pageSize=1`).then(r => r.json()),
            fetch(`/api/three-wheelers/used?dealerId=${dealerId}&pageSize=1`).then(r => r.json()),
            fetch(`/api/inventory/cyepro/test`).then(r => r.json()),
        ])

        setStats({
            twoWheeler:   {
                total:   tw.status === 'fulfilled' ? (tw.value.total ?? 0) : 0,
                loading: false,
            },
            threeWheeler: {
                total:   thw.status === 'fulfilled' ? (thw.value.total ?? 0) : 0,
                loading: false,
            },
        })

        if (settings.status === 'fulfilled') {
            setCyeproConnected(settings.value.hasApiKey === true)
        }
    }, [dealerId])

    useEffect(() => { loadStats() }, [loadStats])

    const totalUsed = stats.twoWheeler.total + stats.threeWheeler.total
    const isLoading = stats.twoWheeler.loading || stats.threeWheeler.loading

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Used / 2nd Hand Vehicles</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {isLoading ? "Loading stock..." : `${totalUsed} vehicle${totalUsed !== 1 ? "s" : ""} in stock across all categories`}
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={loadStats} disabled={isLoading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total */}
                <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Car className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Used Stock</p>
                        <p className="text-3xl font-bold">
                            {isLoading ? <span className="inline-block w-8 h-7 bg-muted/40 rounded animate-pulse" /> : totalUsed}
                        </p>
                    </div>
                </div>

                {/* 2W */}
                <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Bike className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Used 2-Wheelers</p>
                        <p className="text-3xl font-bold">
                            {stats.twoWheeler.loading
                                ? <span className="inline-block w-8 h-7 bg-muted/40 rounded animate-pulse" />
                                : stats.twoWheeler.total}
                        </p>
                    </div>
                </div>

                {/* 3W */}
                <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <Truck className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Used 3-Wheelers</p>
                        <p className="text-3xl font-bold">
                            {stats.threeWheeler.loading
                                ? <span className="inline-block w-8 h-7 bg-muted/40 rounded animate-pulse" />
                                : stats.threeWheeler.total}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link
                        href="/dashboard/two-wheelers/used/add"
                        className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors group"
                    >
                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Plus className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">Add Used 2-Wheeler</p>
                            <p className="text-xs text-muted-foreground">Bike, scooter, moped, electric</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    <Link
                        href="/dashboard/three-wheelers/used/add"
                        className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors group"
                    >
                        <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Plus className="w-5 h-5 text-amber-500" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">Add Used 3-Wheeler</p>
                            <p className="text-xs text-muted-foreground">Auto, e-rickshaw, cargo</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Inventory Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 2W Used */}
                {(sells2W || true) && (
                    <div className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="p-5 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bike className="w-5 h-5 text-blue-500" />
                                <div>
                                    <h3 className="font-semibold text-sm">2-Wheeler Stock</h3>
                                    <p className="text-xs text-muted-foreground">
                                        {stats.twoWheeler.loading ? "..." : `${stats.twoWheeler.total} vehicles`}
                                    </p>
                                </div>
                            </div>
                            <Button asChild size="sm" variant="outline">
                                <Link href="/dashboard/two-wheelers/used">View All</Link>
                            </Button>
                        </div>
                        <div className="p-5 space-y-3">
                            <Link
                                href="/dashboard/two-wheelers/used"
                                className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors group"
                            >
                                <Package className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm flex-1">View full inventory</span>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                            <Link
                                href="/dashboard/two-wheelers/used/add"
                                className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 hover:bg-blue-500/10 transition-colors group"
                            >
                                <Plus className="w-4 h-4 text-blue-500" />
                                <span className="text-sm flex-1 text-blue-600 dark:text-blue-400">Add new listing</span>
                                <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* 3W Used */}
                {(sells3W || true) && (
                    <div className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="p-5 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Truck className="w-5 h-5 text-amber-500" />
                                <div>
                                    <h3 className="font-semibold text-sm">3-Wheeler Stock</h3>
                                    <p className="text-xs text-muted-foreground">
                                        {stats.threeWheeler.loading ? "..." : `${stats.threeWheeler.total} vehicles`}
                                    </p>
                                </div>
                            </div>
                            <Button asChild size="sm" variant="outline">
                                <Link href="/dashboard/three-wheelers/used">View All</Link>
                            </Button>
                        </div>
                        <div className="p-5 space-y-3">
                            <Link
                                href="/dashboard/three-wheelers/used"
                                className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors group"
                            >
                                <Package className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm flex-1">View full inventory</span>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                            <Link
                                href="/dashboard/three-wheelers/used/add"
                                className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 transition-colors group"
                            >
                                <Plus className="w-4 h-4 text-amber-500" />
                                <span className="text-sm flex-1 text-amber-600 dark:text-amber-400">Add new listing</span>
                                <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Cyepro API Integration Banner */}
            <div className={`rounded-2xl border p-5 flex items-start gap-4 ${
                cyeproConnected
                    ? "border-green-200 bg-green-50 dark:border-green-800/40 dark:bg-green-900/10"
                    : "border-border bg-muted/20"
            }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    cyeproConnected ? "bg-green-500/10" : "bg-muted/40"
                }`}>
                    <TrendingUp className={`w-5 h-5 ${cyeproConnected ? "text-green-600" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-sm">
                        Cyepro Inventory Sync
                        {cyeproConnected && (
                            <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                                Connected
                            </span>
                        )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {cyeproConnected
                            ? "Your Cyepro inventory is synced and showing on your dealer website."
                            : "Connect your Cyepro API key to auto-sync your used vehicle inventory from Cyepro."}
                    </p>
                </div>
                <Button asChild size="sm" variant={cyeproConnected ? "outline" : "default"}>
                    <Link href="/dashboard/settings#cyepro">
                        <Settings className="w-4 h-4 mr-2" />
                        {cyeproConnected ? "Manage" : "Connect"}
                    </Link>
                </Button>
            </div>
        </div>
    )
}

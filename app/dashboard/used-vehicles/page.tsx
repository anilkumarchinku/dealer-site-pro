"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import {
    Bike, Truck, Plus, RefreshCw, TrendingUp,
    Car, Settings, ArrowRight, Package, Tag, Save, X, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchVehicles } from "@/lib/db/vehicles"
import type { Car as SiteCar } from "@/lib/types/car"
import type { DBVehicle } from "@/lib/db/vehicles"
import type { TwoWheelerUsedVehicle } from "@/lib/types/two-wheeler"
import type { ThreeWheelerUsedVehicle } from "@/lib/types/three-wheeler"

interface UsedStats {
    twoWheeler:   { total: number; loading: boolean }
    threeWheeler: { total: number; loading: boolean }
}

type OfferCategory = "2w" | "3w" | "4w"
type OfferSourceType = "manual" | "cyepro"

interface PriceOffer {
    vehicle_category: OfferCategory
    source_type: OfferSourceType
    source_vehicle_id: string
    offer_price_paise: number
    offer_label?: string | null
    valid_until?: string | null
}

interface OfferVehicle {
    key: string
    category: OfferCategory
    sourceType: OfferSourceType
    sourceVehicleId: string
    title: string
    subtitle: string
    originalPricePaise: number
    currentOfferPricePaise: number | null
}

function offerKey(category: OfferCategory, sourceType: OfferSourceType, sourceVehicleId: string) {
    return `${category}:${sourceType}:${sourceVehicleId}`
}

function formatPaise(value: number) {
    return `₹${Math.round(value / 100).toLocaleString("en-IN")}`
}

function priceInputFromPaise(value?: number | null) {
    return typeof value === "number" && value > 0 ? String(Math.round(value / 100)) : ""
}

function parseRupeesToPaise(value: string) {
    const amount = Number(value)
    return Number.isFinite(amount) && amount >= 0 ? Math.round(amount * 100) : null
}

export default function UsedVehiclesPage() {
    const { dealerId, sellsTwoWheelers: sells2W, sellsThreeWheelers: sells3W } = useOnboardingStore()

    const [stats, setStats] = useState<UsedStats>({
        twoWheeler:   { total: 0, loading: true },
        threeWheeler: { total: 0, loading: true },
    })
    const [cyeproConnected, setCyeproConnected] = useState(false)
    const [offerVehicles, setOfferVehicles] = useState<OfferVehicle[]>([])
    const [offerInputs, setOfferInputs] = useState<Record<string, string>>({})
    const [offersLoading, setOffersLoading] = useState(false)
    const [savingKey, setSavingKey] = useState<string | null>(null)
    const [offerMessage, setOfferMessage] = useState("")
    const [bulkDiscount, setBulkDiscount] = useState("")

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

    const loadOfferVehicles = useCallback(async () => {
        if (!dealerId) return

        setOffersLoading(true)
        setOfferMessage("")

        const [offersRes, twRes, thwRes, manualRes, cyeproRes] = await Promise.allSettled([
            fetch("/api/used-vehicle-price-offers").then(r => r.json()),
            fetch(`/api/two-wheelers/used?dealerId=${dealerId}&pageSize=100`).then(r => r.json()),
            fetch(`/api/three-wheelers/used?dealerId=${dealerId}&pageSize=100`).then(r => r.json()),
            fetchVehicles(dealerId, 1, 100),
            fetch("/api/inventory/cyepro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dealerId, fetchAll: true, maxVehicles: 100, size: 50 }),
            }).then(r => r.ok ? r.json() : { cars: [] }),
        ])

        const offers: PriceOffer[] = offersRes.status === "fulfilled" ? (offersRes.value.offers ?? []) : []
        const offerMap = new Map(offers.map((offer) => [
            offerKey(offer.vehicle_category, offer.source_type, offer.source_vehicle_id),
            offer,
        ]))

        const vehicles: OfferVehicle[] = []

        if (manualRes.status === "fulfilled") {
            const manualVehicles = manualRes.value.vehicles as DBVehicle[]
            manualVehicles
                .filter((vehicle) => vehicle.condition === "used" || vehicle.condition === "certified_pre_owned")
                .forEach((vehicle) => {
                    const key = offerKey("4w", "manual", vehicle.id)
                    vehicles.push({
                        key,
                        category: "4w",
                        sourceType: "manual",
                        sourceVehicleId: vehicle.id,
                        title: `${vehicle.make} ${vehicle.model}`,
                        subtitle: [vehicle.variant, vehicle.year, "Manual 4W"].filter(Boolean).join(" · "),
                        originalPricePaise: vehicle.price_paise,
                        currentOfferPricePaise: offerMap.get(key)?.offer_price_paise ?? null,
                    })
                })
        }

        if (cyeproRes.status === "fulfilled") {
            const cyeproCars = (cyeproRes.value.cars ?? []) as SiteCar[]
            cyeproCars.forEach((car) => {
                const sourceVehicleId = car.meta?.sourceVehicleId ?? car.id
                const key = offerKey("4w", "cyepro", sourceVehicleId)
                const price = car.pricing?.exShowroom?.min
                if (typeof price !== "number" || price <= 0) return
                vehicles.push({
                    key,
                    category: "4w",
                    sourceType: "cyepro",
                    sourceVehicleId,
                    title: `${car.make} ${car.model}`,
                    subtitle: [car.variant, car.year, "Cyepro 4W"].filter(Boolean).join(" · "),
                    originalPricePaise: Math.round(price * 100),
                    currentOfferPricePaise: offerMap.get(key)?.offer_price_paise ?? null,
                })
            })
        }

        if (twRes.status === "fulfilled") {
            const twoWheelers = (twRes.value.vehicles ?? []) as TwoWheelerUsedVehicle[]
            twoWheelers.forEach((vehicle) => {
                const key = offerKey("2w", "manual", vehicle.id)
                vehicles.push({
                    key,
                    category: "2w",
                    sourceType: "manual",
                    sourceVehicleId: vehicle.id,
                    title: `${vehicle.brand} ${vehicle.model}`,
                    subtitle: [vehicle.variant, vehicle.year, "Used 2W"].filter(Boolean).join(" · "),
                    originalPricePaise: vehicle.price_paise,
                    currentOfferPricePaise: offerMap.get(key)?.offer_price_paise ?? vehicle.offer_price_paise ?? null,
                })
            })
        }

        if (thwRes.status === "fulfilled") {
            const threeWheelers = (thwRes.value.vehicles ?? []) as ThreeWheelerUsedVehicle[]
            threeWheelers.forEach((vehicle) => {
                const key = offerKey("3w", "manual", vehicle.id)
                vehicles.push({
                    key,
                    category: "3w",
                    sourceType: "manual",
                    sourceVehicleId: vehicle.id,
                    title: `${vehicle.brand} ${vehicle.model}`,
                    subtitle: [vehicle.variant, vehicle.year, "Used 3W"].filter(Boolean).join(" · "),
                    originalPricePaise: vehicle.price_paise,
                    currentOfferPricePaise: offerMap.get(key)?.offer_price_paise ?? vehicle.offer_price_paise ?? null,
                })
            })
        }

        const uniqueVehicles = Array.from(new Map(vehicles.map(vehicle => [vehicle.key, vehicle])).values())
        setOfferVehicles(uniqueVehicles)
        setOfferInputs(Object.fromEntries(uniqueVehicles.map(vehicle => [
            vehicle.key,
            priceInputFromPaise(vehicle.currentOfferPricePaise),
        ])))
        setOffersLoading(false)
    }, [dealerId])

    useEffect(() => {
        loadStats()
        loadOfferVehicles()
    }, [loadStats, loadOfferVehicles])

    const saveOffer = async (vehicle: OfferVehicle) => {
        const offerPricePaise = parseRupeesToPaise(offerInputs[vehicle.key] ?? "")
        if (offerPricePaise == null || offerPricePaise <= 0) {
            setOfferMessage("Enter a valid offer price first.")
            return false
        }
        if (offerPricePaise >= vehicle.originalPricePaise) {
            setOfferMessage("Offer price should be less than the current price.")
            return false
        }

        setSavingKey(vehicle.key)
        const res = await fetch("/api/used-vehicle-price-offers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                vehicle_category: vehicle.category,
                source_type: vehicle.sourceType,
                source_vehicle_id: vehicle.sourceVehicleId,
                offer_price_paise: offerPricePaise,
                offer_label: "Offer price",
            }),
        })
        setSavingKey(null)

        if (!res.ok) {
            const data = await res.json().catch(() => null)
            setOfferMessage(data?.error ?? "Could not save offer price.")
            return false
        }

        setOfferVehicles(prev => prev.map(item =>
            item.key === vehicle.key ? { ...item, currentOfferPricePaise: offerPricePaise } : item
        ))
        setOfferMessage("Offer price saved. It will show on the generated pre-owned website cards.")
        return true
    }

    const clearOffer = async (vehicle: OfferVehicle) => {
        setSavingKey(vehicle.key)
        const params = new URLSearchParams({
            vehicle_category: vehicle.category,
            source_type: vehicle.sourceType,
            source_vehicle_id: vehicle.sourceVehicleId,
        })
        const res = await fetch(`/api/used-vehicle-price-offers?${params.toString()}`, { method: "DELETE" })
        setSavingKey(null)

        if (!res.ok) {
            const data = await res.json().catch(() => null)
            setOfferMessage(data?.error ?? "Could not clear offer price.")
            return
        }

        setOfferInputs(prev => ({ ...prev, [vehicle.key]: "" }))
        setOfferVehicles(prev => prev.map(item =>
            item.key === vehicle.key ? { ...item, currentOfferPricePaise: null } : item
        ))
        setOfferMessage("Offer price cleared.")
    }

    const applyBulkDiscount = () => {
        const percent = Number(bulkDiscount)
        if (!Number.isFinite(percent) || percent <= 0 || percent >= 100) {
            setOfferMessage("Enter a discount percentage between 1 and 99.")
            return
        }
        setOfferInputs(prev => ({
            ...prev,
            ...Object.fromEntries(offerVehicles.map(vehicle => [
                vehicle.key,
                String(Math.max(0, Math.round((vehicle.originalPricePaise * (100 - percent)) / 10000))),
            ])),
        }))
        setOfferMessage(`${percent}% discount filled for visible used vehicles. Save the rows you want to publish.`)
    }

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
                <Button variant="outline" size="sm" onClick={() => { loadStats(); loadOfferVehicles(); }} disabled={isLoading || offersLoading}>
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

            {/* Used Price Offers */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="p-5 border-b border-border flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Tag className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-base">Used Vehicle Offer Prices</h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                Add a discounted display price for pre-owned cards without changing the original inventory price.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="number"
                            min="1"
                            max="99"
                            value={bulkDiscount}
                            onChange={e => setBulkDiscount(e.target.value)}
                            placeholder="Discount %"
                            className="h-10 w-full sm:w-32 rounded-lg border border-input bg-background px-3 text-sm"
                        />
                        <Button type="button" variant="outline" size="sm" onClick={applyBulkDiscount} disabled={offerVehicles.length === 0}>
                            Fill All
                        </Button>
                    </div>
                </div>

                {offerMessage && (
                    <div className="px-5 py-3 border-b border-border text-sm text-muted-foreground">
                        {offerMessage}
                    </div>
                )}

                <div className="max-h-[520px] overflow-auto">
                    {offersLoading ? (
                        <div className="p-8 flex items-center justify-center text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Loading used stock offers...
                        </div>
                    ) : offerVehicles.length === 0 ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            No used vehicles found yet. Add used stock or connect Cyepro to create card offers.
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {offerVehicles.map((vehicle) => {
                                const saving = savingKey === vehicle.key
                                const hasOffer = typeof vehicle.currentOfferPricePaise === "number" && vehicle.currentOfferPricePaise > 0
                                return (
                                    <div key={vehicle.key} className="grid gap-3 p-4 lg:grid-cols-[1.5fr_140px_180px_170px] lg:items-center">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-semibold text-sm truncate">{vehicle.title}</p>
                                                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium uppercase text-muted-foreground">
                                                    {vehicle.category} · {vehicle.sourceType}
                                                </span>
                                                {hasOffer && (
                                                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                                                        Offer live
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 truncate">{vehicle.subtitle}</p>
                                        </div>

                                        <div>
                                            <p className="text-[11px] uppercase tracking-widest text-muted-foreground/70">Current</p>
                                            <p className="font-semibold text-sm">{formatPaise(vehicle.originalPricePaise)}</p>
                                        </div>

                                        <label className="block">
                                            <span className="text-[11px] uppercase tracking-widest text-muted-foreground/70">Offer Price</span>
                                            <div className="mt-1 flex h-10 items-center rounded-lg border border-input bg-background px-3">
                                                <span className="text-sm text-muted-foreground">₹</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={offerInputs[vehicle.key] ?? ""}
                                                    onChange={e => setOfferInputs(prev => ({ ...prev, [vehicle.key]: e.target.value }))}
                                                    className="h-full min-w-0 flex-1 bg-transparent pl-1 text-sm outline-none"
                                                    placeholder="Offer"
                                                />
                                            </div>
                                        </label>

                                        <div className="flex gap-2 lg:justify-end">
                                            <Button type="button" size="sm" onClick={() => saveOffer(vehicle)} disabled={saving}>
                                                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                                Save
                                            </Button>
                                            <Button type="button" size="sm" variant="outline" onClick={() => clearOffer(vehicle)} disabled={saving || !hasOffer}>
                                                <X className="w-4 h-4 mr-2" />
                                                Clear
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
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

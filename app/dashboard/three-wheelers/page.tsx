"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { Truck, ListFilter, Wrench, CreditCard, Plus, TrendingUp, Users, Check, Pencil, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import brandData from "@/lib/data/brand-models.json"
import type { Brand } from "@/lib/types"

interface Stats {
    totalVehicles:  number
    usedVehicles:   number
    newLeads:       number
    pendingService: number
    totalBookings:  number
}

const ALL_3W_BRANDS = (brandData.threeWheelers as { brandId: string; brand: string }[])

function BrandLogo({ brandId, brand }: { brandId: string; brand: string }) {
    const [failed, setFailed] = useState(false)
    if (failed) {
        return (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {brand.charAt(0)}
            </div>
        )
    }
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={`/data/brand-logos/${brandId}.png`}
            alt={brand}
            className="w-8 h-8 rounded-full object-contain bg-white border border-gray-100"
            onError={() => setFailed(true)}
        />
    )
}

export default function ThreeWheelersDashboardPage() {
    const { dealerId, data, updateData } = useOnboardingStore()
    const [stats, setStats] = useState<Stats>({
        totalVehicles:  0,
        usedVehicles:   0,
        newLeads:       0,
        pendingService: 0,
        totalBookings:  0,
    })
    const [loading, setLoading] = useState(true)

    // Brand editing state
    const [brands, setBrands]           = useState<string[]>([])
    const [editing, setEditing]         = useState(false)
    const [selected, setSelected]       = useState<string[]>([])
    const [saving, setSaving]           = useState(false)
    const [brandSearch, setBrandSearch] = useState("")

    // Load 3W brands from DB on mount — scoped by vehicle_type to prevent collision with 2W
    useEffect(() => {
        if (!dealerId) return
        supabase
            .from("dealer_brands")
            .select("brand_name")
            .eq("dealer_id", dealerId)
            .eq("vehicle_type", "3w")
            .order("is_primary", { ascending: false })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then(({ data: rows }: { data: any[] | null }) => {
                const names = rows?.map((r: { brand_name: string }) => r.brand_name) ?? []
                setBrands(names)
            })
    }, [dealerId])

    useEffect(() => {
        if (!dealerId) return
        const did = dealerId

        async function loadStats() {
            try {
                const [vehicles, used, leads, service, bookings] = await Promise.all([
                    supabase.from("thw_vehicles").select("id", { count: "exact", head: true }).eq("dealer_id", did).eq("status", "active"),
                    supabase.from("thw_used_vehicles").select("id", { count: "exact", head: true }).eq("dealer_id", did).eq("status", "available"),
                    supabase.from("thw_leads").select("id", { count: "exact", head: true }).eq("dealer_id", did).eq("status", "new"),
                    supabase.from("thw_service_bookings").select("id", { count: "exact", head: true }).eq("dealer_id", did).eq("status", "pending"),
                    supabase.from("thw_bookings").select("id", { count: "exact", head: true }).eq("dealer_id", did),
                ])

                setStats({
                    totalVehicles:  vehicles.count ?? 0,
                    usedVehicles:   used.count      ?? 0,
                    newLeads:       leads.count     ?? 0,
                    pendingService: service.count   ?? 0,
                    totalBookings:  bookings.count  ?? 0,
                })
            } catch {
                // silently fail
            } finally {
                setLoading(false)
            }
        }

        loadStats()
    }, [dealerId])

    function startEditing() {
        setSelected([...brands])
        setBrandSearch("")
        setEditing(true)
    }

    function toggleBrand(name: string) {
        setSelected(prev =>
            prev.includes(name) ? prev.filter(b => b !== name) : [...prev, name]
        )
    }

    async function saveBrands() {
        if (!dealerId) return
        setSaving(true)
        try {
            // Delete only 3W rows — vehicle_type column prevents touching 2W brands
            await supabase.from("dealer_brands").delete()
                .eq("dealer_id", dealerId)
                .eq("vehicle_type", "3w")
            if (selected.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await (supabase.from("dealer_brands") as any).insert(
                    selected.map((name, i) => ({
                        dealer_id:    dealerId,
                        brand_name:   name,
                        is_primary:   i === 0,
                        vehicle_type: "3w",
                    }))
                )
            }
            setBrands(selected)
            updateData({ brands: selected as Brand[] })
            setEditing(false)
        } finally {
            setSaving(false)
        }
    }

    const filteredBrands = brandSearch.trim()
        ? ALL_3W_BRANDS.filter(b => b.brand.toLowerCase().includes(brandSearch.toLowerCase()))
        : ALL_3W_BRANDS

    const quickActions = [
        { label: "Add New Vehicle",  href: "/dashboard/three-wheelers/inventory/add", icon: Plus },
        { label: "Add Used Vehicle", href: "/dashboard/three-wheelers/used/add",      icon: Plus },
        { label: "View Leads",       href: "/dashboard/three-wheelers/leads",          icon: Users },
        { label: "Service Bookings", href: "/dashboard/three-wheelers/service",        icon: Wrench },
    ]

    const statCards = [
        { label: "New Vehicles",    value: stats.totalVehicles,  icon: Truck,       href: "/dashboard/three-wheelers/inventory" },
        { label: "Used Stock",      value: stats.usedVehicles,   icon: ListFilter,  href: "/dashboard/three-wheelers/used" },
        { label: "New Leads",       value: stats.newLeads,       icon: TrendingUp,  href: "/dashboard/three-wheelers/leads" },
        { label: "Service Pending", value: stats.pendingService, icon: Wrench,      href: "/dashboard/three-wheelers/service" },
        { label: "Bookings",        value: stats.totalBookings,  icon: CreditCard,  href: "/dashboard/three-wheelers/bookings" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">3-Wheeler Dashboard</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage your 3W inventory, leads, and bookings</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/three-wheelers/inventory/add">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Vehicle
                    </Link>
                </Button>
            </div>

            {/* ── Info & Brands ─────────────────────────────────────────────── */}
            <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="font-semibold text-base">Info &amp; Brands</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {data.dealershipName || "Your dealership"} · {data.location || ""}
                        </p>
                    </div>
                    {!editing && (
                        <Button size="sm" variant="outline" onClick={startEditing}>
                            <Pencil className="w-3.5 h-3.5 mr-1.5" />
                            {brands.length === 0 ? "Select Brands" : "Edit Brands"}
                        </Button>
                    )}
                </div>

                {/* Current brands */}
                {!editing && (
                    brands.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {brands.map((name, i) => {
                                const match = ALL_3W_BRANDS.find(b => b.brand === name)
                                return (
                                    <div key={name} className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border border-border">
                                        {match && <BrandLogo brandId={match.brandId} brand={name} />}
                                        <span className="text-sm font-medium">{name}</span>
                                        {i === 0 && <span className="text-[10px] text-muted-foreground">(Primary)</span>}
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No brands selected yet. Click &quot;Select Brands&quot; to add your 3W brands.</p>
                    )
                )}

                {/* Brand picker (edit mode) */}
                {editing && (
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Search brands..."
                            value={brandSearch}
                            onChange={e => setBrandSearch(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                            {filteredBrands.map(b => {
                                const isSelected = selected.includes(b.brand)
                                return (
                                    <button
                                        key={b.brandId}
                                        onClick={() => toggleBrand(b.brand)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all text-left ${
                                            isSelected
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border bg-muted/30 text-foreground hover:border-primary/40"
                                        }`}
                                    >
                                        <BrandLogo brandId={b.brandId} brand={b.brand} />
                                        <span className="flex-1 truncate">{b.brand}</span>
                                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                                    </button>
                                )
                            })}
                        </div>
                        {selected.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                                {selected.length} brand{selected.length > 1 ? "s" : ""} selected · First selected is primary
                            </p>
                        )}
                        <div className="flex items-center gap-2 pt-1">
                            <Button size="sm" onClick={saveBrands} disabled={saving || selected.length === 0}>
                                {saving ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Check className="w-3.5 h-3.5 mr-1.5" />}
                                Save Brands
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditing(false)} disabled={saving}>
                                <X className="w-3.5 h-3.5 mr-1.5" />
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {statCards.map((card) => (
                    <Link
                        key={card.label}
                        href={card.href}
                        className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2 hover:border-primary/40 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">{card.label}</p>
                            <card.icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-2xl font-bold">
                            {loading ? <span className="animate-pulse">—</span> : card.value}
                        </p>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {quickActions.map((action) => (
                        <Button key={action.label} variant="outline" asChild className="h-12 justify-start gap-2">
                            <Link href={action.href}>
                                <action.icon className="w-4 h-4" />
                                {action.label}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Navigation Cards */}
            <div className="grid md:grid-cols-2 gap-4">
                <Link
                    href="/dashboard/three-wheelers/inventory"
                    className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Truck className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">New Inventory</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Manage passenger autos, cargo 3W, electric, and school vans.</p>
                </Link>
                <Link
                    href="/dashboard/three-wheelers/used"
                    className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <ListFilter className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Used Stock</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Pre-owned 3W vehicles with condition grading and permit details.</p>
                </Link>
                <Link
                    href="/dashboard/three-wheelers/leads"
                    className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Leads & Enquiries</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Demo requests, best price queries, fleet and finance enquiries.</p>
                </Link>
                <Link
                    href="/dashboard/three-wheelers/service"
                    className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Wrench className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Service Bookings</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Manage workshop appointments including CNG kit and body work.</p>
                </Link>
            </div>
        </div>
    )
}

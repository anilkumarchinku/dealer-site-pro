"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { Bike, ListFilter, Wrench, CreditCard, Plus, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Stats {
    totalVehicles: number
    usedVehicles: number
    newLeads: number
    pendingService: number
    totalBookings: number
}

export default function TwoWheelersDashboardPage() {
    const { dealerId } = useOnboardingStore()
    const [stats, setStats] = useState<Stats>({
        totalVehicles: 0,
        usedVehicles:  0,
        newLeads:      0,
        pendingService: 0,
        totalBookings: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!dealerId) return
        const did = dealerId

        async function loadStats() {
            try {
                const [vehicles, used, leads, service, bookings] = await Promise.all([
                    supabase.from("tw_vehicles").select("id", { count: "exact", head: true }).eq("dealer_id", did).eq("status", "active"),
                    supabase.from("tw_used_vehicles").select("id", { count: "exact", head: true }).eq("dealer_id", did).eq("status", "available"),
                    supabase.from("tw_leads").select("id", { count: "exact", head: true }).eq("dealer_id", did).eq("status", "new"),
                    supabase.from("tw_service_bookings").select("id", { count: "exact", head: true }).eq("dealer_id", did).eq("status", "pending"),
                    supabase.from("tw_bookings").select("id", { count: "exact", head: true }).eq("dealer_id", did),
                ])

                setStats({
                    totalVehicles:  vehicles.count  ?? 0,
                    usedVehicles:   used.count       ?? 0,
                    newLeads:       leads.count      ?? 0,
                    pendingService: service.count    ?? 0,
                    totalBookings:  bookings.count   ?? 0,
                })
            } catch {
                // silently fail
            } finally {
                setLoading(false)
            }
        }

        loadStats()
    }, [dealerId])

    const quickActions = [
        { label: "Add New Vehicle",  href: "/dashboard/two-wheelers/inventory/add", icon: Plus },
        { label: "Add Used Vehicle", href: "/dashboard/two-wheelers/used/add",      icon: Plus },
        { label: "View Leads",       href: "/dashboard/two-wheelers/leads",          icon: Users },
        { label: "Service Bookings", href: "/dashboard/two-wheelers/service",        icon: Wrench },
    ]

    const statCards = [
        { label: "New Vehicles",      value: stats.totalVehicles,  icon: Bike,       href: "/dashboard/two-wheelers/inventory" },
        { label: "Used Stock",        value: stats.usedVehicles,   icon: ListFilter, href: "/dashboard/two-wheelers/used" },
        { label: "New Leads",         value: stats.newLeads,       icon: TrendingUp, href: "/dashboard/two-wheelers/leads" },
        { label: "Service Pending",   value: stats.pendingService, icon: Wrench,     href: "/dashboard/two-wheelers/service" },
        { label: "Bookings",          value: stats.totalBookings,  icon: CreditCard, href: "/dashboard/two-wheelers/bookings" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">2-Wheeler Dashboard</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage your 2W inventory, leads, and bookings</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/two-wheelers/inventory/add">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Vehicle
                    </Link>
                </Button>
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
                    href="/dashboard/two-wheelers/inventory"
                    className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Bike className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">New Inventory</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Manage your new bikes, scooters, and electric 2W stock.</p>
                </Link>
                <Link
                    href="/dashboard/two-wheelers/used"
                    className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <ListFilter className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Used Stock</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Certified pre-owned and used 2W vehicles with condition grading.</p>
                </Link>
                <Link
                    href="/dashboard/two-wheelers/leads"
                    className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Leads & Enquiries</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Test ride requests, best price queries, finance and more.</p>
                </Link>
                <Link
                    href="/dashboard/two-wheelers/service"
                    className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Wrench className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Service Bookings</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Manage workshop appointments and service schedules.</p>
                </Link>
            </div>
        </div>
    )
}

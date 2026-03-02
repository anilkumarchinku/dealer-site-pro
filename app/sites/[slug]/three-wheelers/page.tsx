"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { VehicleCard } from "@/components/three-wheelers/VehicleCard"
import { LeadFormModal } from "@/components/three-wheelers/LeadFormModal"
import type { ThreeWheelerVehicle } from "@/lib/types/three-wheeler"

export default function ThreeWheelersHomePage() {
    const params = useParams()
    const slug   = params.slug as string
    const [dealer, setDealer] = useState<{ id: string; dealership_name: string; phone: string; location: string } | null>(null)
    const [featured, setFeatured]     = useState<ThreeWheelerVehicle[]>([])
    const [loading, setLoading]       = useState(true)
    const [leadVehicleId, setLeadVehicleId] = useState<string | null>(null)

    useEffect(() => {
        if (!slug) return
        async function load() {
            const { data: d } = await supabase
                .from("dealers")
                .select("id, dealership_name, phone, location")
                .eq("slug", slug)
                .single()
            if (!d) { setLoading(false); return }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dealer = d as any
            setDealer(dealer)

            const res  = await fetch(`/api/three-wheelers?dealerId=${dealer.id}&pageSize=6&sortBy=views`)
            const data = await res.json()
            setFeatured(data.vehicles ?? [])
            setLoading(false)
        }
        load()
    }, [slug])

    if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>
    if (!dealer) return <div className="min-h-screen flex items-center justify-center">Dealer not found</div>

    const categories = [
        { label: "Passenger Auto",  href: `/sites/${slug}/three-wheelers/passenger`,  emoji: "🛺" },
        { label: "Cargo 3W",        href: `/sites/${slug}/three-wheelers/cargo`,       emoji: "📦" },
        { label: "Electric 3W",     href: `/sites/${slug}/three-wheelers/electric`,    emoji: "⚡" },
        { label: "Used 3W",         href: `/sites/${slug}/three-wheelers/used`,        emoji: "🔄" },
    ]

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="bg-gradient-to-br from-primary/10 via-background to-background py-16 px-4">
                <div className="max-w-5xl mx-auto text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold">{dealer.dealership_name}</h1>
                    <p className="text-lg text-muted-foreground">Your trusted 3-Wheeler destination in {dealer.location}</p>
                    <div className="flex flex-wrap justify-center gap-3 pt-2">
                        <Link href={`/sites/${slug}/three-wheelers/passenger`} className="bg-primary text-primary-foreground rounded-lg px-5 py-2.5 font-medium hover:opacity-90">Browse Autos</Link>
                        <Link href={`/sites/${slug}/three-wheelers/service`} className="border border-border rounded-lg px-5 py-2.5 font-medium hover:bg-muted/50">Book Service</Link>
                        <Link href={`/sites/${slug}/three-wheelers/emi-calculator`} className="border border-border rounded-lg px-5 py-2.5 font-medium hover:bg-muted/50">EMI Calculator</Link>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="max-w-5xl mx-auto px-4 py-10">
                <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map(c => (
                        <Link
                            key={c.label}
                            href={c.href}
                            className="flex flex-col items-center gap-3 p-6 bg-card border border-border rounded-2xl hover:border-primary/40 hover:shadow-md transition-all"
                        >
                            <span className="text-4xl">{c.emoji}</span>
                            <span className="font-semibold text-center">{c.label}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured */}
            {featured.length > 0 && (
                <section className="max-w-5xl mx-auto px-4 py-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Popular Models</h2>
                        <Link href={`/sites/${slug}/three-wheelers/passenger`} className="text-sm text-primary hover:underline">View all →</Link>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {featured.map(v => (
                            <VehicleCard
                                key={v.id}
                                vehicle={v}
                                slug={slug}
                                onLead={vid => setLeadVehicleId(vid)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Services strip */}
            <section className="bg-muted/30 py-10 px-4">
                <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
                    {[
                        { icon: "🔧", title: "Expert Service",    text: "CNG, electrical, and body work specialists" },
                        { icon: "💳", title: "Fleet Finance",     text: "Special rates for fleet buyers"             },
                        { icon: "📋", title: "Permit Assistance", text: "Help with route and vehicle permits"        },
                    ].map(s => (
                        <div key={s.title} className="space-y-2">
                            <div className="text-3xl">{s.icon}</div>
                            <h3 className="font-semibold">{s.title}</h3>
                            <p className="text-sm text-muted-foreground">{s.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick links */}
            <section className="max-w-5xl mx-auto px-4 py-10">
                <div className="grid sm:grid-cols-3 gap-4">
                    <Link href={`/sites/${slug}/three-wheelers/cargo`} className="p-4 border border-border rounded-xl hover:border-primary/40 transition-colors">
                        <p className="font-semibold">📦 Cargo Vehicles</p>
                        <p className="text-sm text-muted-foreground mt-1">Piaggio Ape, Mahindra Alfa & more</p>
                    </Link>
                    <Link href={`/sites/${slug}/three-wheelers/electric`} className="p-4 border border-border rounded-xl hover:border-primary/40 transition-colors">
                        <p className="font-semibold">⚡ Electric 3W</p>
                        <p className="text-sm text-muted-foreground mt-1">Zero emission, low running cost</p>
                    </Link>
                    <Link href={`/sites/${slug}/three-wheelers/emi-calculator`} className="p-4 border border-border rounded-xl hover:border-primary/40 transition-colors">
                        <p className="font-semibold">🧮 EMI Calculator</p>
                        <p className="text-sm text-muted-foreground mt-1">Plan your monthly payments</p>
                    </Link>
                </div>
            </section>

            {/* Lead modal */}
            <LeadFormModal
                dealerId={dealer.id}
                vehicleId={leadVehicleId ?? undefined}
                leadType="best_price"
                title="Get Best Price"
                isOpen={!!leadVehicleId}
                onClose={() => setLeadVehicleId(null)}
            />
        </div>
    )
}

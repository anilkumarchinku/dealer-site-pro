"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { ServiceBookingForm } from "@/components/two-wheelers/ServiceBookingForm"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

export default function ServiceBookingPage() {
    const params = useParams()
    const slug   = params.slug as string
    const prefix = useSitePrefix(slug)
    const [dealerId, setDealerId] = useState<string | null>(null)

    useEffect(() => {
        if (!slug) return
        supabase.from("dealers").select("id").eq("slug", slug).single()
            .then(({ data }) => { // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (data) setDealerId((data as any).id) })
    }, [slug])

    const services = [
        { emoji: "🔧", name: "General Service",  desc: "Full inspection and tune-up"        },
        { emoji: "🛢️", name: "Oil Change",        desc: "Engine oil + filter replacement"    },
        { emoji: "🔩", name: "Tyre Service",      desc: "Puncture repair, alignment, balance" },
        { emoji: "⚡", name: "Battery Service",   desc: "Battery check and replacement"      },
        { emoji: "🔨", name: "Repair Work",       desc: "Accident, electrical, brake repair"  },
        { emoji: "📋", name: "AMC Package",       desc: "Annual maintenance contract"         },
    ]

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="mb-8">
                    <Link href={`${prefix}/two-wheelers`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <ChevronLeft className="w-4 h-4" /> Back
                    </Link>
                    <h1 className="text-3xl font-bold mt-4">Book Service</h1>
                    <p className="text-muted-foreground mt-2">Schedule a service appointment at our workshop.</p>
                </div>

                {/* Services offered */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
                    {services.map(s => (
                        <div key={s.name} className="bg-card border border-border rounded-xl p-4 text-sm">
                            <span className="text-2xl">{s.emoji}</span>
                            <p className="font-medium mt-2">{s.name}</p>
                            <p className="text-muted-foreground text-xs mt-0.5">{s.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="text-xl font-semibold mb-6">Book an Appointment</h2>
                    {dealerId ? (
                        <ServiceBookingForm dealerId={dealerId} />
                    ) : (
                        <div className="text-center text-muted-foreground py-10">Loading...</div>
                    )}
                </div>
            </div>
        </div>
    )
}

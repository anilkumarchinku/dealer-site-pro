"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { VehicleDetailGallery } from "@/components/two-wheelers/VehicleDetailGallery"
import type { TwoWheelerVehicle } from "@/lib/types/two-wheeler"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

export default function ComparePage() {
    const params       = useParams()
    const searchParams = useSearchParams()
    const slug         = params.slug as string
    const ids          = searchParams.get("ids")?.split(",").filter(Boolean) ?? []
    const prefix       = useSitePrefix(slug)

    const [vehicles, setVehicles] = useState<TwoWheelerVehicle[]>([])
    const [loading,  setLoading]  = useState(true)

    useEffect(() => {
        if (ids.length === 0) { setLoading(false); return }
        Promise.all(ids.map(id => fetch(`/api/two-wheelers/${id}`).then(r => r.ok ? r.json() : null)))
            .then(results => {
                setVehicles(results.filter(Boolean) as TwoWheelerVehicle[])
                setLoading(false)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>

    if (vehicles.length < 2) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
                <p className="text-lg font-medium">Select at least 2 vehicles to compare</p>
                <Link href={`${prefix}/two-wheelers/bikes`} className="bg-primary text-primary-foreground rounded-lg px-5 py-2.5 text-sm font-medium">Browse Vehicles</Link>
            </div>
        )
    }

    const rows: { label: string; key: (v: TwoWheelerVehicle) => string | number | null }[] = [
        { label: "Brand",          key: v => v.brand },
        { label: "Model",          key: v => v.model },
        { label: "Variant",        key: v => v.variant ?? "—" },
        { label: "Year",           key: v => v.year },
        { label: "Type",           key: v => v.type },
        { label: "Fuel Type",      key: v => v.fuel_type },
        { label: "Engine",         key: v => v.engine_cc ? `${v.engine_cc}cc` : "—" },
        { label: "Battery",        key: v => v.battery_kwh ? `${v.battery_kwh} kWh` : "—" },
        { label: "Mileage",        key: v => v.mileage_kmpl ? `${v.mileage_kmpl} kmpl` : "—" },
        { label: "Range",          key: v => v.range_km ? `${v.range_km} km` : "—" },
        { label: "Top Speed",      key: v => v.top_speed_kmph ? `${v.top_speed_kmph} kmph` : "—" },
        { label: "Ex-Showroom",    key: v => `₹${(v.ex_showroom_price_paise / 100).toLocaleString("en-IN")}` },
        { label: "EMI from",       key: v => v.emi_starting_paise ? `₹${(v.emi_starting_paise / 100).toLocaleString("en-IN")}/mo` : "—" },
        { label: "BS6",            key: v => v.bs6_compliant ? "Yes" : "No" },
        { label: "FAME Eligible",  key: v => v.fame_subsidy_eligible ? "Yes" : "No" },
    ]

    return (
        <div className="min-h-screen max-w-5xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href={`${prefix}/two-wheelers`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="w-4 h-4" /> Back
                </Link>
                <h1 className="text-2xl font-bold mt-4">Compare Models</h1>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    {/* Header with images */}
                    <thead>
                        <tr>
                            <th className="w-40 text-left py-3 pr-4 font-medium text-muted-foreground align-top">Specification</th>
                            {vehicles.map(v => (
                                <th key={v.id} className="py-3 px-3 text-center align-top">
                                    <div className="w-full max-w-[200px] mx-auto">
                                        <VehicleDetailGallery images={v.images.slice(0, 1)} alt={`${v.brand} ${v.model}`} />
                                        <p className="font-semibold mt-2">{v.brand} {v.model}</p>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={row.label} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                                <td className="py-3 pr-4 font-medium text-muted-foreground">{row.label}</td>
                                {vehicles.map(v => (
                                    <td key={v.id} className="py-3 px-3 text-center">{row.key(v) ?? "—"}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>

                    {/* CTAs */}
                    <tfoot>
                        <tr>
                            <td />
                            {vehicles.map(v => (
                                <td key={v.id} className="py-4 px-3 text-center">
                                    <Link
                                        href={`${prefix}/two-wheelers/${v.id}`}
                                        className="inline-block bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90"
                                    >
                                        View Details
                                    </Link>
                                </td>
                            ))}
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}

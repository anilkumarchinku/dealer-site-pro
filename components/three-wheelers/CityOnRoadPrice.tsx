"use client"

import { useState } from "react"
import type { ThreeWheelerFuelType } from "@/lib/types/three-wheeler"

interface Props {
    exShowroomPaise: number
    fuelType: ThreeWheelerFuelType
}

const RTO_RATES: Record<string, { name: string; pct: number }> = {
    KA: { name: "Karnataka",       pct: 7 },
    MH: { name: "Maharashtra",     pct: 7 },
    TN: { name: "Tamil Nadu",      pct: 6 },
    DL: { name: "Delhi",           pct: 5 },
    UP: { name: "Uttar Pradesh",   pct: 7 },
    GJ: { name: "Gujarat",         pct: 6 },
    RJ: { name: "Rajasthan",       pct: 6 },
    HR: { name: "Haryana",         pct: 6 },
    AP: { name: "Andhra Pradesh",  pct: 7 },
    TS: { name: "Telangana",       pct: 8 },
    MP: { name: "Madhya Pradesh",  pct: 6 },
    KL: { name: "Kerala",          pct: 6 },
    WB: { name: "West Bengal",     pct: 7 },
    PB: { name: "Punjab",          pct: 6 },
    BR: { name: "Bihar",           pct: 6 },
}

const INSURANCE: Record<string, number> = {
    electric: 6500,
    cng:      8200,
    lpg:      8200,
    petrol:   9500,
    diesel:   9500,
}

const HANDLING = 10000

function fmt(n: number) {
    return n.toLocaleString("en-IN")
}

export function CityOnRoadPrice({ exShowroomPaise, fuelType }: Props) {
    const [stateCode, setStateCode] = useState("KA")

    const exShowroom = exShowroomPaise / 100
    const rtoInfo    = RTO_RATES[stateCode]
    const rto        = Math.round(exShowroom * rtoInfo.pct / 100)
    const insurance  = INSURANCE[fuelType] ?? INSURANCE.petrol
    const onRoad     = exShowroom + rto + insurance + HANDLING

    return (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mt-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <h3 className="text-base font-semibold">On-Road Price</h3>
                <select
                    value={stateCode}
                    onChange={e => setStateCode(e.target.value)}
                    className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                    {Object.entries(RTO_RATES).map(([code, { name }]) => (
                        <option key={code} value={code}>{name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Ex-Showroom</span>
                    <span className="font-medium">₹{fmt(exShowroom)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">RTO Registration ({rtoInfo.pct}%)</span>
                    <span className="font-medium">₹{fmt(rto)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Insurance (1-yr commercial)</span>
                    <span className="font-medium">₹{fmt(insurance)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">Handling &amp; Logistics</span>
                    <span className="font-medium">₹{fmt(HANDLING)}</span>
                </div>
                <div className="flex justify-between pt-2">
                    <span className="font-semibold">Total On-Road</span>
                    <span className="font-bold text-primary text-base">₹{fmt(onRoad)}</span>
                </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
                * Approximate. Commercial vehicle charges vary by state and use case.
            </p>
        </div>
    )
}

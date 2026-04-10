"use client"

import { useState } from "react"

interface Props {
    exShowroomPaise: number
    engineCc: number | null
    fuelType: "petrol" | "electric"
}

const RTO_RATES: Record<string, { name: string; petrolPct: number; electricPct: number }> = {
    KA: { name: "Karnataka",      petrolPct: 13, electricPct: 4  },
    MH: { name: "Maharashtra",    petrolPct: 10, electricPct: 7  },
    TN: { name: "Tamil Nadu",     petrolPct: 10, electricPct: 5  },
    DL: { name: "Delhi",          petrolPct: 4,  electricPct: 0  },
    UP: { name: "Uttar Pradesh",  petrolPct: 11, electricPct: 5  },
    GJ: { name: "Gujarat",        petrolPct: 12, electricPct: 5  },
    RJ: { name: "Rajasthan",      petrolPct: 10, electricPct: 4  },
    HR: { name: "Haryana",        petrolPct: 8,  electricPct: 4  },
    AP: { name: "Andhra Pradesh", petrolPct: 10, electricPct: 5  },
    TS: { name: "Telangana",      petrolPct: 12, electricPct: 6  },
    MP: { name: "Madhya Pradesh", petrolPct: 8,  electricPct: 4  },
    KL: { name: "Kerala",         petrolPct: 8,  electricPct: 4  },
    WB: { name: "West Bengal",    petrolPct: 10, electricPct: 5  },
    PB: { name: "Punjab",         petrolPct: 9,  electricPct: 4  },
    BR: { name: "Bihar",          petrolPct: 9,  electricPct: 4  },
}

function getInsurance(engineCc: number | null, fuelType: "petrol" | "electric"): number {
    if (fuelType === "electric") return 4200
    if (!engineCc || engineCc === 0) return 2901
    if (engineCc <= 75)  return 2901
    if (engineCc <= 150) return 3851
    if (engineCc <= 350) return 7897
    return 13034
}

function fmt(amount: number): string {
    return "₹" + Math.round(amount).toLocaleString("en-IN")
}

export function CityOnRoadPrice({ exShowroomPaise, engineCc, fuelType }: Props) {
    const [stateCode, setStateCode] = useState("KA")

    const state       = RTO_RATES[stateCode]
    const isElectric  = fuelType === "electric"
    const exShowroom  = exShowroomPaise / 100
    const rtoPct      = isElectric ? state.electricPct : state.petrolPct
    const rtoCharges  = Math.round(exShowroom * rtoPct / 100)
    const insurance   = getInsurance(engineCc, fuelType)
    const handling    = 7500
    const onRoad      = exShowroom + rtoCharges + insurance + handling

    return (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="text-lg font-bold">On-Road Price</h3>
                <select
                    value={stateCode}
                    onChange={e => setStateCode(e.target.value)}
                    className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                    {Object.entries(RTO_RATES).map(([code, s]) => (
                        <option key={code} value={code}>{s.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-0">
                {[
                    { label: "Ex-Showroom",            value: fmt(exShowroom) },
                    { label: `RTO Registration (${rtoPct}%)`, value: fmt(rtoCharges) },
                    { label: "Insurance (5-yr)",        value: fmt(insurance) },
                    { label: "Handling & Logistics",   value: fmt(handling) },
                ].map((row, i) => (
                    <div key={i} className="flex justify-between py-2.5 border-b border-primary/10 text-sm">
                        <span className="text-muted-foreground">{row.label}</span>
                        <span className="font-medium">{row.value}</span>
                    </div>
                ))}

                <div className="flex justify-between pt-3 mt-1">
                    <span className="font-bold text-base">Total On-Road</span>
                    <span className="font-bold text-lg text-primary">{fmt(onRoad)}</span>
                </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
                * Approximate. Actual charges may vary by city and insurance provider.
            </p>
        </div>
    )
}

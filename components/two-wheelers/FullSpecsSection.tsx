import type { TwoWheelerVehicle } from "@/lib/types/two-wheeler"

interface Props { vehicle: TwoWheelerVehicle }

interface SpecRow {
    label: string
    value: string | null | undefined
}

function SpecTable({ rows }: { rows: SpecRow[] }) {
    const visible = rows.filter(r => r.value != null && r.value !== "")
    if (visible.length === 0) return null
    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            {visible.map((r, i) => (
                <div key={i} className={`flex justify-between gap-4 py-2.5 text-sm ${i !== visible.length - 1 ? "border-b border-border/60" : ""}`}>
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className="font-medium text-right">{r.value}</span>
                </div>
            ))}
        </div>
    )
}

interface SectionBlock {
    heading: string
    rows: SpecRow[]
}

export function FullSpecsSection({ vehicle }: Props) {
    const isElectric = vehicle.fuel_type === "electric"

    const sections: SectionBlock[] = [
        {
            heading: "Engine & Performance",
            rows: [
                { label: "Engine (cc)",   value: vehicle.engine_cc != null ? String(vehicle.engine_cc) : null },
                { label: "Max Power",     value: vehicle.max_power },
                { label: "Torque",        value: vehicle.torque },
                { label: "Transmission", value: vehicle.transmission },
                { label: "Fuel Type",    value: vehicle.fuel_type ? vehicle.fuel_type.charAt(0).toUpperCase() + vehicle.fuel_type.slice(1) : null },
                { label: "Mileage",      value: vehicle.mileage_kmpl != null ? `${vehicle.mileage_kmpl} kmpl` : null },
                { label: "Top Speed",    value: vehicle.top_speed_kmph != null ? `${vehicle.top_speed_kmph} kmph` : null },
            ],
        },
        ...(isElectric ? [{
            heading: "Electric",
            rows: [
                { label: "Battery",          value: vehicle.battery_kwh != null ? `${vehicle.battery_kwh} kWh` : null },
                { label: "Range",            value: vehicle.range_km != null ? `${vehicle.range_km} km` : null },
                { label: "Charging Time",    value: vehicle.charging_time_hours != null ? `${vehicle.charging_time_hours} hrs` : null },
                { label: "Battery Warranty", value: vehicle.battery_warranty_years != null ? `${vehicle.battery_warranty_years} years` : null },
            ],
        }] : []),
        {
            heading: "Dimensions",
            rows: [
                { label: "Length",    value: vehicle.length_mm != null ? `${vehicle.length_mm} mm` : null },
                { label: "Width",     value: vehicle.width_mm != null ? `${vehicle.width_mm} mm` : null },
                { label: "Height",    value: vehicle.height_mm != null ? `${vehicle.height_mm} mm` : null },
                { label: "Wheelbase", value: vehicle.wheelbase_mm != null ? `${vehicle.wheelbase_mm} mm` : null },
            ],
        },
        {
            heading: "Compliance & Safety",
            rows: [
                { label: "BS6 Compliant",     value: vehicle.bs6_compliant ? "Yes" : "No" },
                { label: "FAME II Eligible",  value: vehicle.fame_subsidy_eligible ? "Yes" : "No" },
            ],
        },
    ]

    const hasVariants = vehicle.all_variants && vehicle.all_variants.length > 1

    // Check if any section has at least one visible row
    const visibleSections = sections.filter(s =>
        s.rows.some(r => r.value != null && r.value !== "")
    )

    if (visibleSections.length === 0 && !hasVariants) return null

    return (
        <section className="mt-10">
            <h2 className="text-xl font-bold mb-5">Full Specifications</h2>

            <div className="space-y-8">
                {visibleSections.map(s => (
                    <div key={s.heading}>
                        <h3 className="text-base font-semibold text-foreground mb-3">{s.heading}</h3>
                        <SpecTable rows={s.rows} />
                    </div>
                ))}

                {hasVariants && (
                    <div>
                        <h3 className="text-base font-semibold text-foreground mb-3">Variants</h3>
                        <div className="overflow-x-auto rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-2 text-muted-foreground font-medium">Variant Name</th>
                                        <th className="text-right py-2 text-muted-foreground font-medium">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicle.all_variants!.map((v, i) => (
                                        <tr key={i} className="border-b border-border/50 last:border-b-0">
                                            <td className="py-2.5 text-muted-foreground">{v.name}</td>
                                            <td className="py-2.5 font-medium text-right">
                                                ₹{(v.price_paise / 100).toLocaleString("en-IN")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

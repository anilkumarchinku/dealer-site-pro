import type { ThreeWheelerVehicle } from "@/lib/types/three-wheeler"

interface Props { vehicle: ThreeWheelerVehicle }

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

type SpecRow = { label: string; value: string | null | undefined }

function SpecSection({ title, rows }: { title: string; rows: SpecRow[] }) {
    const visibleRows = rows.filter(r => r.value != null && r.value !== "")
    if (visibleRows.length === 0) return null
    return (
        <>
            <h3 className="text-base font-semibold text-foreground mb-3 mt-6">{title}</h3>
            {visibleRows.map(row => (
                <div key={row.label} className="flex justify-between py-2.5 border-b border-border/50 text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium text-right">{row.value}</span>
                </div>
            ))}
        </>
    )
}

export function FullSpecsSection({ vehicle }: Props) {
    const engineRows: SpecRow[] = [
        { label: "Fuel Type",         value: vehicle.fuel_type.toUpperCase() },
        { label: "Engine (cc)",       value: vehicle.engine_cc ? `${vehicle.engine_cc} cc` : null },
        { label: "Max Power",         value: vehicle.max_power },
        { label: "Torque",            value: vehicle.torque },
        { label: "Transmission",      value: vehicle.transmission },
        { label: "Max Speed",         value: vehicle.max_speed_kmph ? `${vehicle.max_speed_kmph} kmph` : null },
        { label: "Wheelbase",         value: vehicle.wheelbase_mm ? `${vehicle.wheelbase_mm} mm` : null },
        { label: "Mileage (petrol)",  value: vehicle.mileage_kmpl ? `${vehicle.mileage_kmpl} kmpl` : null },
        { label: "CNG Mileage",       value: vehicle.cng_mileage_km_per_kg ? `${vehicle.cng_mileage_km_per_kg} km/kg` : null },
    ]

    const electricRows: SpecRow[] = vehicle.fuel_type === "electric" ? [
        { label: "Battery",           value: vehicle.battery_kwh ? `${vehicle.battery_kwh} kWh` : null },
        { label: "Range",             value: vehicle.range_km ? `${vehicle.range_km} km` : null },
        { label: "Charging Time",     value: vehicle.charging_time_hours ? `${vehicle.charging_time_hours} hrs` : null },
        { label: "Battery Warranty",  value: vehicle.battery_warranty_years ? `${vehicle.battery_warranty_years} years` : null },
    ] : []

    const cargoRows: SpecRow[] = [
        { label: "Payload",           value: vehicle.payload_kg ? `${vehicle.payload_kg} kg` : null },
        { label: "GVW",               value: vehicle.gvw_kg ? `${vehicle.gvw_kg} kg` : null },
        { label: "Body Type",         value: vehicle.body_type ? capitalize(vehicle.body_type.replace("_", " ")) : null },
        { label: "Passenger Capacity",value: vehicle.passenger_capacity ? `${vehicle.passenger_capacity} persons` : null },
    ]

    const regulatoryRows: SpecRow[] = [
        { label: "Permit Type",       value: vehicle.permit_type ? capitalize(vehicle.permit_type.replace("_", " ")) : null },
        { label: "BS6 Compliant",     value: vehicle.bs6_compliant ? "Yes" : "No" },
        { label: "FAME II Eligible",  value: vehicle.fame_subsidy_eligible ? "Yes" : "No" },
    ]

    return (
        <section className="mt-10">
            <h2 className="text-xl font-bold mb-5">Full Specifications</h2>
            <SpecSection title="Engine & Performance" rows={engineRows} />
            {vehicle.fuel_type === "electric" && (
                <SpecSection title="Electric" rows={electricRows} />
            )}
            <SpecSection title="Cargo & Capacity" rows={cargoRows} />
            <SpecSection title="Regulatory" rows={regulatoryRows} />
            {vehicle.all_variants && vehicle.all_variants.length > 1 && (
                <>
                    <h3 className="text-base font-semibold text-foreground mb-3 mt-6">Variants</h3>
                    {vehicle.all_variants.map(variant => (
                        <div key={variant.name} className="flex justify-between py-2.5 border-b border-border/50 text-sm">
                            <span className="text-muted-foreground">{variant.name}</span>
                            <span className="font-medium text-right">
                                ₹{(variant.price_paise / 100).toLocaleString("en-IN")}
                            </span>
                        </div>
                    ))}
                </>
            )}
        </section>
    )
}

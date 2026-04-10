"use client"

import type { ThreeWheelerFilters, ThreeWheelerType, ThreeWheelerFuelType, ThreeWheelerBodyType, ThreeWheelerPermit } from "@/lib/types/three-wheeler"

interface Props {
    filters:        ThreeWheelerFilters
    onChange:       (f: ThreeWheelerFilters) => void
    brands?:        string[]
    showCargo?:     boolean
    showPassenger?: boolean
    onClose:        () => void
}

const TYPES: { value: ThreeWheelerType; label: string }[] = [
    { value: "passenger",  label: "Passenger Auto" },
    { value: "cargo",      label: "Cargo / Goods"  },
    { value: "electric",   label: "Electric"        },
    { value: "school_van", label: "School Van"      },
]

const FUEL_TYPES: { value: ThreeWheelerFuelType; label: string }[] = [
    { value: "petrol",   label: "Petrol"   },
    { value: "diesel",   label: "Diesel"   },
    { value: "cng",      label: "CNG"      },
    { value: "electric", label: "Electric" },
    { value: "lpg",      label: "LPG"      },
]

const BODY_TYPES: { value: ThreeWheelerBodyType; label: string }[] = [
    { value: "flatbed",     label: "Flatbed"     },
    { value: "closed_body", label: "Closed Body" },
    { value: "tipper",      label: "Tipper"      },
    { value: "container",   label: "Container"   },
    { value: "tanker",      label: "Tanker"      },
    { value: "pickup",      label: "Pickup"      },
]

const PAYLOAD_RANGES = [
    { label: "Up to 500 kg",   min: 0,    max: 500       },
    { label: "500 – 750 kg",   min: 500,  max: 750       },
    { label: "750 kg – 1 ton", min: 750,  max: 1000      },
    { label: "Above 1 ton",    min: 1000, max: undefined  },
]

const PERMIT_TYPES: { value: ThreeWheelerPermit; label: string }[] = [
    { value: "city",      label: "City Permit"      },
    { value: "state",     label: "State Permit"     },
    { value: "all_india", label: "All India Permit" },
]

const PRICE_RANGES = [
    { label: "Under ₹1.5L",   min: 0,         max: 15000000  },
    { label: "₹1.5L – ₹2.5L", min: 15000000,  max: 25000000  },
    { label: "₹2.5L – ₹4L",   min: 25000000,  max: 40000000  },
    { label: "₹4L – ₹6L",     min: 40000000,  max: 60000000  },
    { label: "Above ₹6L",     min: 60000000,  max: undefined  },
]

export function MobileFilterDrawer({ filters, onChange, brands = [], showCargo = false, showPassenger = false, onClose }: Props) {
    function toggle<T>(field: keyof ThreeWheelerFilters, value: T) {
        onChange({
            ...filters,
            [field]: filters[field] === value ? undefined : value,
            page: 1,
        })
    }

    return (
        <div className="fixed inset-0 z-50 md:hidden">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            {/* Sheet */}
            <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="font-semibold text-base">Filters</h2>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted">✕</button>
                </div>

                {/* Filter content */}
                <div className="p-4 space-y-6 text-sm">
                    {/* Sort By */}
                    <div>
                        <p className="font-medium mb-2">Sort By</p>
                        <select
                            value={filters.sortBy ?? "newest"}
                            onChange={e => onChange({ ...filters, sortBy: e.target.value as ThreeWheelerFilters["sortBy"], page: 1 })}
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="views">Most Popular</option>
                        </select>
                    </div>

                    {/* Type */}
                    <div>
                        <p className="font-medium mb-2">Type</p>
                        <div className="flex flex-wrap gap-2">
                            {TYPES.map(t => (
                                <button
                                    key={t.value}
                                    onClick={() => toggle("type", t.value)}
                                    className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                                        filters.type === t.value
                                            ? "border-primary bg-primary/10 text-primary font-medium"
                                            : "border-border hover:bg-muted/50"
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Fuel Type */}
                    <div>
                        <p className="font-medium mb-2">Fuel Type</p>
                        <div className="flex flex-wrap gap-2">
                            {FUEL_TYPES.map(f => (
                                <button
                                    key={f.value}
                                    onClick={() => toggle("fuelType", f.value)}
                                    className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                                        filters.fuelType === f.value
                                            ? "border-primary bg-primary/10 text-primary font-medium"
                                            : "border-border hover:bg-muted/50"
                                    }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Body Type (cargo only) */}
                    {showCargo && (
                        <div>
                            <p className="font-medium mb-2">Body Type</p>
                            <div className="flex flex-wrap gap-2">
                                {BODY_TYPES.map(b => (
                                    <button
                                        key={b.value}
                                        onClick={() => toggle("bodyType", b.value)}
                                        className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                                            filters.bodyType === b.value
                                                ? "border-primary bg-primary/10 text-primary font-medium"
                                                : "border-border hover:bg-muted/50"
                                        }`}
                                    >
                                        {b.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Payload Range (cargo only) */}
                    {showCargo && (
                        <div>
                            <p className="font-medium mb-2">Payload Capacity</p>
                            <div className="flex flex-wrap gap-2">
                                {PAYLOAD_RANGES.map(r => (
                                    <button
                                        key={r.label}
                                        onClick={() => onChange({ ...filters, minPayload: r.min, maxPayload: r.max, page: 1 })}
                                        className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                                            filters.minPayload === r.min && filters.maxPayload === r.max
                                                ? "border-primary bg-primary/10 text-primary font-medium"
                                                : "border-border hover:bg-muted/50"
                                        }`}
                                    >
                                        {r.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Permit Type (passenger only) */}
                    {showPassenger && (
                        <div>
                            <p className="font-medium mb-2">Permit Type</p>
                            <div className="flex flex-wrap gap-2">
                                {PERMIT_TYPES.map(p => (
                                    <button
                                        key={p.value}
                                        onClick={() => toggle("permitType", p.value)}
                                        className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                                            filters.permitType === p.value
                                                ? "border-primary bg-primary/10 text-primary font-medium"
                                                : "border-border hover:bg-muted/50"
                                        }`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Brand */}
                    {brands.length > 0 && (
                        <div>
                            <p className="font-medium mb-2">Brand</p>
                            <div className="flex flex-wrap gap-2">
                                {brands.map(b => (
                                    <button
                                        key={b}
                                        onClick={() => toggle("brand", b)}
                                        className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                                            filters.brand === b
                                                ? "border-primary bg-primary/10 text-primary font-medium"
                                                : "border-border hover:bg-muted/50"
                                        }`}
                                    >
                                        {b}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Price Range */}
                    <div>
                        <p className="font-medium mb-2">Price Range</p>
                        <div className="flex flex-wrap gap-2">
                            {PRICE_RANGES.map(r => (
                                <button
                                    key={r.label}
                                    onClick={() => onChange({ ...filters, minPrice: r.min, maxPrice: r.max, page: 1 })}
                                    className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                                        filters.minPrice === r.min && filters.maxPrice === r.max
                                            ? "border-primary bg-primary/10 text-primary font-medium"
                                            : "border-border hover:bg-muted/50"
                                    }`}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border">
                    <button
                        onClick={onClose}
                        className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    )
}

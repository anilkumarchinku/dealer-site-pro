"use client"

import type { TwoWheelerFilters, TwoWheelerType, TwoWheelerFuelType } from "@/lib/types/two-wheeler"

interface Props {
    filters:  TwoWheelerFilters
    onChange: (f: TwoWheelerFilters) => void
    brands?:  string[]
    onClose:  () => void
}

const TYPES: { value: TwoWheelerType; label: string }[] = [
    { value: "bike",     label: "Bikes"    },
    { value: "scooter",  label: "Scooters" },
    { value: "moped",    label: "Mopeds"   },
    { value: "electric", label: "Electric" },
]

const FUEL_TYPES: { value: TwoWheelerFuelType; label: string }[] = [
    { value: "petrol",   label: "Petrol"   },
    { value: "electric", label: "Electric" },
]

const PRICE_RANGES = [
    { label: "Under ₹50K",  min: 0,        max: 5000000  },
    { label: "₹50K – ₹1L",  min: 5000000,  max: 10000000 },
    { label: "₹1L – ₹1.5L", min: 10000000, max: 15000000 },
    { label: "₹1.5L – ₹2L", min: 15000000, max: 20000000 },
    { label: "Above ₹2L",   min: 20000000, max: undefined },
]

export function MobileFilterDrawer({ filters, onChange, brands = [], onClose }: Props) {
    function toggle<T>(field: keyof TwoWheelerFilters, value: T) {
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
                            onChange={e => onChange({ ...filters, sortBy: e.target.value as TwoWheelerFilters["sortBy"], page: 1 })}
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

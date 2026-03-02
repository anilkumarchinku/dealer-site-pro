"use client"

import type { TwoWheelerFilters, TwoWheelerType, TwoWheelerFuelType, TwoWheelerStockStatus } from "@/lib/types/two-wheeler"

interface Props {
    filters:   TwoWheelerFilters
    onChange:  (filters: TwoWheelerFilters) => void
    brands?:   string[]
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
    { label: "Under ₹50K",        min: 0,        max: 5000000  },
    { label: "₹50K – ₹1L",        min: 5000000,  max: 10000000 },
    { label: "₹1L – ₹1.5L",       min: 10000000, max: 15000000 },
    { label: "₹1.5L – ₹2L",       min: 15000000, max: 20000000 },
    { label: "Above ₹2L",          min: 20000000, max: undefined },
]

export function FilterSidebar({ filters, onChange, brands = [] }: Props) {
    function toggle<T>(field: keyof TwoWheelerFilters, value: T) {
        onChange({
            ...filters,
            [field]: filters[field] === value ? undefined : value,
            page: 1,
        })
    }

    function clearAll() {
        onChange({ sortBy: "newest", page: 1, pageSize: filters.pageSize })
    }

    const hasActive = !!(filters.type || filters.brand || filters.fuelType || filters.stockStatus || filters.minPrice)

    return (
        <aside className="space-y-6 text-sm">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold">Filters</h2>
                {hasActive && (
                    <button onClick={clearAll} className="text-xs text-primary hover:underline">Clear all</button>
                )}
            </div>

            {/* Sort */}
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
                <div className="space-y-1.5">
                    {TYPES.map(t => (
                        <button
                            key={t.value}
                            onClick={() => toggle("type", t.value)}
                            className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
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

            {/* Fuel */}
            <div>
                <p className="font-medium mb-2">Fuel Type</p>
                <div className="space-y-1.5">
                    {FUEL_TYPES.map(f => (
                        <button
                            key={f.value}
                            onClick={() => toggle("fuelType", f.value)}
                            className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
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
                    <div className="space-y-1.5">
                        {brands.map(b => (
                            <button
                                key={b}
                                onClick={() => toggle("brand", b)}
                                className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
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
                <div className="space-y-1.5">
                    {PRICE_RANGES.map(r => (
                        <button
                            key={r.label}
                            onClick={() => onChange({ ...filters, minPrice: r.min, maxPrice: r.max, page: 1 })}
                            className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
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
        </aside>
    )
}

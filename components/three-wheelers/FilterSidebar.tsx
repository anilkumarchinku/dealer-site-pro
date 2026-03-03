"use client"

import type { ThreeWheelerFilters, ThreeWheelerType, ThreeWheelerFuelType, ThreeWheelerStockStatus } from "@/lib/types/three-wheeler"

interface Props {
    filters:   ThreeWheelerFilters
    onChange:  (filters: ThreeWheelerFilters) => void
    brands?:   string[]
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

const PRICE_RANGES = [
    { label: "Under ₹1.5L",   min: 0,         max: 15000000  },
    { label: "₹1.5L – ₹2.5L", min: 15000000,  max: 25000000  },
    { label: "₹2.5L – ₹4L",   min: 25000000,  max: 40000000  },
    { label: "₹4L – ₹6L",     min: 40000000,  max: 60000000  },
    { label: "Above ₹6L",     min: 60000000,  max: undefined  },
]

const STOCK_STATUSES: { value: ThreeWheelerStockStatus; label: string }[] = [
    { value: "available",      label: "In Stock"       },
    { value: "booking_open",   label: "Booking Open"   },
    { value: "out_of_stock",   label: "Out of Stock"   },
]

export function FilterSidebar({ filters, onChange, brands = [] }: Props) {
    function toggle<T>(field: keyof ThreeWheelerFilters, value: T) {
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

            {/* Stock Status */}
            <div>
                <p className="font-medium mb-2">Availability</p>
                <div className="space-y-1.5">
                    {STOCK_STATUSES.map(s => (
                        <button
                            key={s.value}
                            onClick={() => toggle("stockStatus", s.value)}
                            className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                                filters.stockStatus === s.value
                                    ? "border-primary bg-primary/10 text-primary font-medium"
                                    : "border-border hover:bg-muted/50"
                            }`}
                        >
                            {s.label}
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

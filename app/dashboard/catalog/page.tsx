"use client"

import { useEffect, useState, useMemo } from "react"
import { Search, Car, Bike, Truck, RefreshCw, ImageOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { CatalogModel } from "@/app/api/admin/catalog/route"

// ── Category config ────────────────────────────────────────────────────────

const CATEGORIES = [
    { key: "4w" as const, label: "4-Wheeler",  Icon: Car,   color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200"   },
    { key: "2w" as const, label: "2-Wheeler",  Icon: Bike,  color: "text-green-600",  bg: "bg-green-50",  border: "border-green-200"  },
    { key: "3w" as const, label: "3-Wheeler",  Icon: Truck, color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200"  },
] as const

type CategoryKey = "4w" | "2w" | "3w"

// ── Model card ─────────────────────────────────────────────────────────────

function ModelCard({ m }: { m: CatalogModel }) {
    const [imgSrc, setImgSrc] = useState(m.imageUrl ?? "")
    const [failed, setFailed] = useState(!m.imageUrl)

    const brandLogoSrc = `/data/brand-logos/${m.brandId}.png`

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
            {/* Image */}
            <div className="relative aspect-[16/10] bg-gray-50 overflow-hidden">
                {!failed ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={imgSrc}
                        alt={`${m.brand} ${m.model}`}
                        className="w-full h-full object-cover"
                        onError={() => {
                            // Try PNG fallback for 2W/3W Supabase images
                            if (m.category !== "4w" && imgSrc.endsWith(".jpg")) {
                                setImgSrc(imgSrc.replace(".jpg", ".png"))
                            } else {
                                setFailed(true)
                            }
                        }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <ImageOff className="w-8 h-8 text-gray-300" />
                    </div>
                )}

                {/* Category pill */}
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    m.category === "4w" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    m.category === "2w" ? "bg-green-50 text-green-700 border-green-200" :
                    "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                    {m.category.toUpperCase()}
                </span>
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col gap-1 flex-1">
                {/* Brand row */}
                <div className="flex items-center gap-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={brandLogoSrc}
                        alt=""
                        className="w-4 h-4 object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                    />
                    <p className="text-[11px] text-gray-500 font-medium truncate">{m.brand}</p>
                </div>

                {/* Model name */}
                <p className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">{m.model}</p>

                {/* Price + fuel */}
                <div className="flex items-center gap-2 mt-auto pt-1">
                    {m.price && (
                        <p className="text-xs text-emerald-700 font-semibold truncate">{m.price}</p>
                    )}
                    {m.fuelType && (
                        <span className="ml-auto text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full shrink-0">
                            {m.fuelType}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function CatalogPage() {
    const [models, setModels] = useState<CatalogModel[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<CategoryKey>("4w")
    const [search, setSearch] = useState("")

    useEffect(() => {
        fetch("/api/admin/catalog")
            .then((r) => r.json())
            .then((d) => setModels(d.models ?? []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const counts = useMemo(() => ({
        "4w": models.filter((m) => m.category === "4w").length,
        "2w": models.filter((m) => m.category === "2w").length,
        "3w": models.filter((m) => m.category === "3w").length,
    }), [models])

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim()
        return models.filter((m) => {
            if (m.category !== activeTab) return false
            if (!q) return true
            return m.model.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q)
        })
    }, [models, activeTab, search])

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Vehicle Catalog</h1>
                <p className="text-sm text-gray-500 mt-1">
                    All models in the system — {models.length} total across 4W, 2W, 3W
                </p>
            </div>

            {/* Category tabs */}
            <div className="flex gap-3 flex-wrap">
                {CATEGORIES.map(({ key, label, Icon, color, bg, border }) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                            activeTab === key
                                ? `${bg} ${color} ${border} shadow-sm`
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                        }`}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            activeTab === key ? `${bg} ${color}` : "bg-gray-100 text-gray-500"
                        }`}>
                            {loading ? "…" : counts[key]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                    placeholder="Search brand or model…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex items-center gap-3 text-gray-400 py-16 justify-center">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Loading catalog…</span>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400 text-sm">
                    {search ? `No results for "${search}"` : "No models found in this category."}
                </div>
            ) : (
                <>
                    <p className="text-xs text-gray-400">
                        Showing {filtered.length} model{filtered.length !== 1 ? "s" : ""}
                        {search ? ` matching "${search}"` : ""}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filtered.map((m) => (
                            <ModelCard key={m.id} m={m} />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

"use client"

import { useState, useMemo } from "react"
import { Search, Car, Bike, Truck, ImageOff, Fuel, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { CatalogModel } from "@/lib/types/catalog"

type CategoryKey = "4w" | "2w" | "3w"

// ── Website-style card ──────────────────────────────────────────────────────

function ModelCard({ m }: { m: CatalogModel }) {
    const [imgSrc, setImgSrc] = useState(m.imageUrl ?? "")
    const [failed, setFailed] = useState(!m.imageUrl)
    const isEV = m.fuelType?.toLowerCase().includes("electric")

    return (
        <div className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 w-52 shrink-0">
            {/* Image */}
            <div className="relative h-32 bg-gray-50 overflow-hidden">
                {!failed ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={imgSrc}
                        alt={`${m.brand} ${m.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => {
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
                {isEV && (
                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <Zap className="w-2.5 h-2.5" /> EV
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="p-2.5 flex flex-col gap-0.5 flex-1">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider truncate">{m.brand}</p>
                <p className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">{m.model}</p>
                <div className="flex items-center gap-1.5 mt-auto pt-1.5 border-t border-gray-100">
                    {m.fuelType && (
                        <span className="flex items-center gap-0.5 text-[10px] text-gray-500">
                            <Fuel className="w-3 h-3" />{m.fuelType}
                        </span>
                    )}
                    {m.price && (
                        <span className="ml-auto text-[10px] font-semibold text-emerald-700 truncate">{m.price}</span>
                    )}
                </div>
            </div>
        </div>
    )
}

// ── Brand row ───────────────────────────────────────────────────────────────

function BrandSection({ brand, brandId, models }: { brand: string; brandId: string; models: CatalogModel[] }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={`/data/brand-logos/${brandId}.png`}
                    alt=""
                    className="w-7 h-7 object-contain rounded bg-white border border-gray-100 p-0.5 shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                />
                <h3 className="text-sm font-bold text-gray-800">{brand}</h3>
                <span className="text-xs text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-full shrink-0">
                    {models.length}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                {models.map((m) => <ModelCard key={m.id} m={m} />)}
            </div>
        </div>
    )
}

// ── Main client ──────────────────────────────────────────────────────────────

interface Props {
    models: CatalogModel[]
}

const TABS = [
    { key: "4w" as CategoryKey, label: "4-Wheeler", Icon: Car,   cls: "bg-blue-600  border-blue-600  text-white" },
    { key: "2w" as CategoryKey, label: "2-Wheeler", Icon: Bike,  cls: "bg-green-600 border-green-600 text-white" },
    { key: "3w" as CategoryKey, label: "3-Wheeler", Icon: Truck, cls: "bg-amber-600 border-amber-600 text-white" },
]

export function CatalogClient({ models }: Props) {
    const [activeTab, setActiveTab] = useState<CategoryKey>("4w")
    const [search, setSearch]       = useState("")

    const counts = useMemo(() => ({
        "4w": models.filter((m) => m.category === "4w").length,
        "2w": models.filter((m) => m.category === "2w").length,
        "3w": models.filter((m) => m.category === "3w").length,
    }), [models])

    const brandGroups = useMemo(() => {
        const q = search.toLowerCase().trim()
        const filtered = models.filter((m) => {
            if (m.category !== activeTab) return false
            if (!q) return true
            return m.model.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q)
        })
        const map = new Map<string, { brand: string; brandId: string; models: CatalogModel[] }>()
        for (const m of filtered) {
            if (!map.has(m.brand)) map.set(m.brand, { brand: m.brand, brandId: m.brandId, models: [] })
            map.get(m.brand)!.models.push(m)
        }
        return Array.from(map.values())
    }, [models, activeTab, search])

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6 space-y-5 max-w-screen-2xl mx-auto">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Vehicle Catalog</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{models.length} models across all brands</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 flex-wrap">
                    {TABS.map(({ key, label, Icon, cls }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                                activeTab === key ? cls : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                activeTab === key ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
                            }`}>
                                {counts[key]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <Input placeholder="Search brand or model…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-white" />
                </div>

                {/* Brand sections */}
                {brandGroups.length === 0 ? (
                    <p className="text-sm text-gray-400 py-12 text-center">
                        {search ? `No results for "${search}"` : "No models found."}
                    </p>
                ) : (
                    <div className="space-y-8">
                        {brandGroups.map((g) => (
                            <BrandSection key={g.brand} brand={g.brand} brandId={g.brandId} models={g.models} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

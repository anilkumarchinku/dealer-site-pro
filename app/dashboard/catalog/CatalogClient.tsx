"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, Car, Bike, Truck, Send, Eye, Fuel, Zap, Info, Plus, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CatalogBrand, CatalogCategory, CatalogModel } from "@/lib/types/catalog"
import type { Car as CarType } from "@/lib/types/car"
import { QuickViewModal } from "@/components/cars/QuickViewModal"
import { EnquiryModal } from "@/components/cars/EnquiryModal"
import { getContrastText } from "@/lib/utils/color-contrast"
import { getVehicleImageUrls } from "@/lib/utils/brand-model-images"

type CategoryKey = CatalogCategory

type AddModelForm = {
    category: CategoryKey
    brand: string
    model: string
    variant: string
    year: string
    fuelType: string
    bodyType: string
    price: string
    imageUrl: string
}

// ── Brand accent colours ────────────────────────────────────────────────────

const BRAND_COLORS: Record<string, string> = {
    "tata":           "#1a4189",
    "maruti-suzuki":  "#003399",
    "hyundai":        "#002C5F",
    "honda":          "#CC0000",
    "mahindra":       "#c8102e",
    "kia":            "#BB162B",
    "toyota":         "#EB0A1E",
    "volkswagen":     "#1a2f6e",
    "skoda":          "#4BA82E",
    "mg":             "#e30613",
    "renault":        "#ffcc00",
    "nissan":         "#C3002F",
    "jeep":           "#2c2c2c",
    "citroen":        "#8b0000",
    "byd":            "#1890FF",
    "force-motors":   "#003973",
    "isuzu":          "#003087",
    "vinfast":        "#00b140",
    "bmw":            "#1C69D4",
    "audi":           "#BB0A30",
    "mercedes-benz":  "#222222",
    "porsche":        "#D5001C",
    "lamborghini":    "#c09800",
    "ferrari":        "#CC0000",
    "land-rover":     "#005A2B",
    "jaguar":         "#1a1a1a",
    "lexus":          "#1a1a1a",
    "volvo":          "#003057",
    "mini":           "#1a1a1a",
    "aston-martin":   "#005f5f",
    "bentley":        "#B6922E",
    "maserati":       "#1a1f7c",
    "rolls-royce":    "#2c2c2c",
}

function getBrandColor(brandId: string): string {
    return BRAND_COLORS[brandId] ?? "#2563eb"
}

// ── CatalogModel → minimal Car stub (for modals only) ──────────────────────

function toCar(m: CatalogModel): CarType {
    return {
        id: m.id,
        make: m.brand,
        model: m.model,
        variant: "",
        year: new Date().getFullYear(),
        bodyType: "SUV",
        segment: "B",
        pricing: {
            exShowroom: { min: null, max: null, currency: "INR" },
        },
        engine: {
            type: m.fuelType ?? "Petrol",
            power: "",
            torque: "",
        },
        transmission: { type: "" },
        performance: {},
        dimensions: { seatingCapacity: null },
        features: { keyFeatures: [] },
        images: {
            hero: m.imageUrl ?? "",
            exterior: m.imageUrl ? [m.imageUrl] : [],
            interior: [],
        },
        meta: {},
        price: m.price ?? undefined,
        vehicleCategory: m.category,
    }
}

// ── Catalog card — uses CDN image directly, same visual as CarCard ──────────

function CatalogCard({ m, brandColor }: { m: CatalogModel; brandColor: string }) {
    const [imgFailed, setImgFailed]       = useState(false)
    const [fallbackIdx, setFallbackIdx]   = useState(0)
    const [qvOpen,    setQvOpen]          = useState(false)
    const [enquireOpen, setEnquireOpen]   = useState(false)

    const isEV = m.fuelType?.toLowerCase().includes("electric")
    const car  = useMemo(() => toCar(m), [m])
    const imageCandidates = useMemo(
        () => getVehicleImageUrls(m.category, m.brandId, m.model, m.imageUrl),
        [m.brandId, m.category, m.imageUrl, m.model],
    )
    const resolvedImageSrc = imageCandidates[fallbackIdx] ?? null
    const logoId = m.logoId ?? m.brandId

    return (
        <>
            <div
                className="group relative flex flex-col overflow-hidden bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer h-full dark:bg-slate-950 dark:border-slate-800 dark:hover:border-slate-700"
                onClick={() => setEnquireOpen(true)}
            >
                {/* ── Image ── */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-50 dark:bg-slate-900">
                    {resolvedImageSrc && !imgFailed ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={resolvedImageSrc}
                            alt={`${m.brand} ${m.model}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={() => {
                                if (fallbackIdx < imageCandidates.length - 1) {
                                    setFallbackIdx((current) => current + 1)
                                } else {
                                    setImgFailed(true)
                                }
                            }}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <span className="text-4xl">
                                {m.category === "2w" ? "🏍️" : m.category === "3w" ? "🛺" : "🚗"}
                            </span>
                        </div>
                    )}

                    {/* EV badge */}
                    {isEV && (
                        <span className="absolute top-2 left-2 flex items-center gap-0.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            <Zap className="w-2.5 h-2.5" /> EV
                        </span>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Quick View — visible on hover */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="w-full bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white shadow-md dark:bg-slate-950/90 dark:text-slate-100 dark:hover:bg-slate-900"
                            onClick={(e) => { e.stopPropagation(); setQvOpen(true) }}
                        >
                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                            Quick View
                        </Button>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="flex flex-col flex-1 p-3 pt-2.5">
                    {/* Brand */}
                    <div className="flex items-center gap-1.5 mb-0.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`/data/brand-logos/${logoId}.png`}
                            alt=""
                            className="w-4 h-4 object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                        />
                        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: brandColor }}>
                            {m.brand}
                        </p>
                    </div>

                    {/* Model */}
                    <h3 className="text-base font-bold leading-tight line-clamp-1 text-gray-900 dark:text-slate-100 mb-1.5">
                        {m.model}
                    </h3>

                    {/* Price */}
                    <div className="mb-2">
                        <p className="text-lg font-bold text-gray-900 dark:text-slate-100">
                            {m.price ?? "Price on request"}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-slate-400">Ex-showroom price</p>
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-slate-800 mb-2" />

                    {/* Specs row */}
                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                        {m.fuelType && (
                            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-1.5 dark:bg-slate-900 dark:border-slate-800">
                                <Fuel className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span className="text-[10px] text-gray-700 dark:text-slate-300 truncate">{m.fuelType}</span>
                            </div>
                        )}
                    </div>

                    {/* CTA row */}
                    <div className="flex gap-2 mt-auto">
                        <Button
                            className="flex-1"
                            size="sm"
                            style={{ backgroundColor: brandColor, color: getContrastText(brandColor) }}
                            onClick={(e) => { e.stopPropagation(); setEnquireOpen(true) }}
                        >
                            <Send className="w-3.5 h-3.5 mr-1.5" />
                            Enquire
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="shrink-0 gap-1 text-xs h-8 px-2.5 font-medium bg-transparent dark:bg-slate-950/60 dark:hover:bg-slate-900"
                            style={{ borderColor: brandColor, color: brandColor }}
                            onClick={(e) => { e.stopPropagation(); setQvOpen(true) }}
                            title="Quick View"
                        >
                            <Info className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Bottom accent */}
                <div
                    className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
                    style={{ backgroundColor: brandColor }}
                />
            </div>

            {/* Modals */}
            <QuickViewModal
                car={car}
                open={qvOpen}
                onOpenChange={setQvOpen}
                onEnquireNow={() => { setQvOpen(false); setEnquireOpen(true) }}
                brandColor={brandColor}
                resolvedImageSrc={resolvedImageSrc}
            />
            <EnquiryModal
                car={car}
                open={enquireOpen}
                onOpenChange={setEnquireOpen}
                brandColor={brandColor}
                resolvedImageSrc={resolvedImageSrc}
            />
        </>
    )
}

// ── Brand row ───────────────────────────────────────────────────────────────

function BrandSection({
    brand,
    brandId,
    logoId,
    models,
    category,
    onAddModel,
}: {
    brand: string
    brandId: string
    logoId?: string | null
    models: CatalogModel[]
    category: CategoryKey
    onAddModel: () => void
}) {
    const color = getBrandColor(brandId)
    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={`/data/brand-logos/${logoId ?? brandId}.png`}
                    alt=""
                    className="w-7 h-7 object-contain rounded bg-white border border-gray-100 p-0.5 shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                />
                <h3 className="text-sm font-bold text-gray-800 dark:text-slate-100">{brand}</h3>
                <span className="text-[10px] uppercase tracking-wide text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-full shrink-0 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400">
                    {category.toUpperCase()}
                </span>
                <span className="text-xs text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-full shrink-0 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400">
                    {models.length}
                </span>
                <div className="min-w-10 flex-1 h-px bg-gray-200 dark:bg-slate-800" />
                <Button size="sm" variant="outline" className="h-8 gap-1.5 bg-transparent" onClick={onAddModel}>
                    <Plus className="h-3.5 w-3.5" />
                    Add Model
                </Button>
            </div>

            {models.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white/70 p-6 text-sm text-gray-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                    No models are linked to this OEM yet. Add the released model to make it available in the catalog.
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1">
                    {models.map((m) => (
                        <div key={m.id} className="w-56 shrink-0">
                            <CatalogCard m={m} brandColor={color} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ── Main client ──────────────────────────────────────────────────────────────

interface Props {
    models?: CatalogModel[]
}

const TABS = [
    { key: "4w" as CategoryKey, label: "4-Wheeler", Icon: Car,   cls: "bg-blue-600  border-blue-600  text-white" },
    { key: "2w" as CategoryKey, label: "2-Wheeler", Icon: Bike,  cls: "bg-green-600 border-green-600 text-white" },
    { key: "3w" as CategoryKey, label: "3-Wheeler", Icon: Truck, cls: "bg-amber-600 border-amber-600 text-white" },
]

function normalizeCatalogKey(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim()
}

function modelIdentity(model: Pick<CatalogModel, "category" | "brand" | "model">) {
    return `${model.category}:${normalizeCatalogKey(model.brand)}:${normalizeCatalogKey(model.model)}`
}

function blankAddModelForm(category: CategoryKey, brand = ""): AddModelForm {
    return {
        category,
        brand,
        model: "",
        variant: "",
        year: String(new Date().getFullYear()),
        fuelType: "",
        bodyType: "",
        price: "",
        imageUrl: "",
    }
}

function AddModelDialog({
    open,
    onOpenChange,
    form,
    setForm,
    brands,
    saving,
    error,
    success,
    onSubmit,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    form: AddModelForm
    setForm: (updater: AddModelForm | ((current: AddModelForm) => AddModelForm)) => void
    brands: CatalogBrand[]
    saving: boolean
    error: string | null
    success: string | null
    onSubmit: () => void
}) {
    const categoryBrands = brands.filter((brand) => brand.category === form.category)

    function updateCategory(category: CategoryKey) {
        const firstBrand = brands.find((brand) => brand.category === category)
        setForm((current) => ({
            ...current,
            category,
            brand: firstBrand?.brand ?? "",
        }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add OEM Model</DialogTitle>
                    <DialogDescription>
                        Add a newly released model under one of your selected OEMs.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Vehicle Category</Label>
                        <Select value={form.category} onValueChange={(value) => updateCategory(value as CategoryKey)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TABS.map((tab) => (
                                    <SelectItem key={tab.key} value={tab.key}>
                                        {tab.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>OEM</Label>
                        <Select
                            value={form.brand}
                            onValueChange={(brand) => setForm((current) => ({ ...current, brand }))}
                            disabled={categoryBrands.length === 0}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select OEM" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryBrands.map((brand) => (
                                    <SelectItem key={`${brand.category}-${brand.brand}`} value={brand.brand}>
                                        {brand.brand}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Model Name</Label>
                        <Input
                            value={form.model}
                            onChange={(event) => setForm((current) => ({ ...current, model: event.target.value }))}
                            placeholder="e.g. Curvv EV, Xoom 160"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Variant</Label>
                        <Input
                            value={form.variant}
                            onChange={(event) => setForm((current) => ({ ...current, variant: event.target.value }))}
                            placeholder="Optional"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Year</Label>
                        <Input
                            value={form.year}
                            onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))}
                            inputMode="numeric"
                            placeholder="2026"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Fuel Type</Label>
                        <Input
                            value={form.fuelType}
                            onChange={(event) => setForm((current) => ({ ...current, fuelType: event.target.value }))}
                            placeholder="Petrol, Diesel, Electric"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Body Type</Label>
                        <Input
                            value={form.bodyType}
                            onChange={(event) => setForm((current) => ({ ...current, bodyType: event.target.value }))}
                            placeholder="SUV, Scooter, Passenger"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Ex-showroom Price (Rs.)</Label>
                        <Input
                            value={form.price}
                            onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                            inputMode="numeric"
                            placeholder="750000"
                        />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <Label>Image URL</Label>
                        <Input
                            value={form.imageUrl}
                            onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
                            placeholder="https://..."
                        />
                    </div>
                </div>

                {error && (
                    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                        {success}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={onSubmit} disabled={saving || !form.brand || !form.model.trim()}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                        Save Model
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function CatalogClient({ models: initialModels }: Props) {
    const [models, setModels] = useState<CatalogModel[]>(initialModels ?? [])
    const [brands, setBrands] = useState<CatalogBrand[]>([])
    const [isLoading, setIsLoading] = useState(!initialModels)
    const [activeTab, setActiveTab] = useState<CategoryKey>("4w")
    const [search, setSearch]       = useState("")
    const [addOpen, setAddOpen] = useState(false)
    const [addForm, setAddForm] = useState<AddModelForm>(() => blankAddModelForm("4w"))
    const [savingModel, setSavingModel] = useState(false)
    const [addError, setAddError] = useState<string | null>(null)
    const [addSuccess, setAddSuccess] = useState<string | null>(null)

    useEffect(() => {
        if (initialModels) {
            setModels(initialModels)
            setIsLoading(false)
            return
        }

        let cancelled = false

        const loadCatalog = async () => {
            try {
                const response = await fetch('/api/dashboard/catalog', { cache: 'no-store' })
                if (!response.ok) throw new Error('Failed to load catalog')

                const payload = await response.json() as { models?: CatalogModel[]; brands?: CatalogBrand[] }
                if (!cancelled) {
                    setModels(Array.isArray(payload.models) ? payload.models : [])
                    setBrands(Array.isArray(payload.brands) ? payload.brands : [])
                }
            } catch {
                if (!cancelled) {
                    setModels([])
                    setBrands([])
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false)
                }
            }
        }

        loadCatalog()

        return () => {
            cancelled = true
        }
    }, [initialModels])

    const counts = useMemo(() => ({
        "4w": models.filter((m) => m.category === "4w").length,
        "2w": models.filter((m) => m.category === "2w").length,
        "3w": models.filter((m) => m.category === "3w").length,
    }), [models])

    const brandSections = useMemo(() => {
        const q = search.toLowerCase().trim()
        return brands
            .filter((brand) => brand.category === activeTab)
            .map((brand) => {
                const brandModels = models.filter((model) =>
                    model.category === brand.category &&
                    normalizeCatalogKey(model.brand) === normalizeCatalogKey(brand.brand)
                )
                const brandMatches = !q || brand.brand.toLowerCase().includes(q)
                const filteredModels = brandModels.filter((model) =>
                    !q || brandMatches || model.model.toLowerCase().includes(q)
                )

                if (q && !brandMatches && filteredModels.length === 0) return null

                return {
                    ...brand,
                    models: filteredModels,
                }
            })
            .filter((section): section is CatalogBrand & { models: CatalogModel[] } => Boolean(section))
    }, [models, brands, activeTab, search])

    const selectedCount = brands.length
    const activeCategoryBrands = brands.filter((brand) => brand.category === activeTab)

    function openAddModel(brand?: CatalogBrand) {
        const targetBrand =
            brand ??
            activeCategoryBrands[0] ??
            brands[0] ??
            null

        if (!targetBrand) return

        setAddError(null)
        setAddSuccess(null)
        setAddForm(blankAddModelForm(targetBrand.category, targetBrand.brand))
        setAddOpen(true)
    }

    async function saveModel() {
        setAddError(null)
        setAddSuccess(null)

        if (!addForm.brand || !addForm.model.trim()) {
            setAddError("Choose an OEM and enter a model name.")
            return
        }

        setSavingModel(true)
        try {
            const response = await fetch("/api/dashboard/catalog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    category: addForm.category,
                    brand: addForm.brand,
                    model: addForm.model,
                    variant: addForm.variant || null,
                    year: addForm.year || null,
                    fuelType: addForm.fuelType || null,
                    bodyType: addForm.bodyType || null,
                    price: addForm.price || null,
                    imageUrl: addForm.imageUrl || null,
                }),
            })
            const payload = await response.json().catch(() => null) as { model?: CatalogModel; error?: string } | null
            if (!response.ok || !payload?.model) {
                throw new Error(payload?.error ?? "Failed to save model")
            }

            setModels((current) => {
                const identity = modelIdentity(payload.model!)
                const exists = current.some((model) => modelIdentity(model) === identity)
                if (exists) {
                    return current.map((model) => modelIdentity(model) === identity ? payload.model! : model)
                }
                return [...current, payload.model!]
            })
            setActiveTab(payload.model.category)
            setAddSuccess(`${payload.model.brand} ${payload.model.model} saved.`)
            setTimeout(() => setAddOpen(false), 700)
        } catch (error) {
            setAddError(error instanceof Error ? error.message : "Failed to save model")
        } finally {
            setSavingModel(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            <div className="p-6 space-y-5 max-w-screen-2xl mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Vehicle Catalog</h1>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                            {selectedCount} selected OEMs, {models.length} models
                        </p>
                    </div>
                    <Button className="w-full gap-2 sm:w-auto" onClick={() => openAddModel()} disabled={brands.length === 0}>
                        <Plus className="h-4 w-4" />
                        Add Model
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 flex-wrap">
                    {TABS.map(({ key, label, Icon, cls }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                                activeTab === key ? cls : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                activeTab === key ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500 dark:bg-slate-900 dark:text-slate-400"
                            }`}>
                                {counts[key]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <Input
                            placeholder="Search brand or model..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                        />
                    </div>
                    {!isLoading && activeCategoryBrands.length > 0 && (
                        <p className="text-xs text-gray-500 dark:text-slate-400">
                            Showing {activeCategoryBrands.length} selected OEM{activeCategoryBrands.length === 1 ? "" : "s"} in this category.
                        </p>
                    )}
                </div>

                {isLoading && (
                    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-500 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                        Loading catalog models...
                    </div>
                )}

                {/* Brand sections */}
                {!isLoading && brandSections.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">
                            {brands.length === 0
                                ? "No OEMs selected for this dealer."
                                : search
                                    ? `No results for "${search}"`
                                    : "No OEMs selected in this category."}
                        </p>
                        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                            Select OEMs from onboarding or the category dashboard, then add any newly released models here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {brandSections.map((g) => (
                            <BrandSection
                                key={`${g.category}-${g.brand}`}
                                brand={g.brand}
                                brandId={g.brandId}
                                logoId={g.logoId}
                                category={g.category}
                                models={g.models}
                                onAddModel={() => openAddModel(g)}
                            />
                        ))}
                    </div>
                )}
            </div>
            <AddModelDialog
                open={addOpen}
                onOpenChange={setAddOpen}
                form={addForm}
                setForm={setAddForm}
                brands={brands}
                saving={savingModel}
                error={addError}
                success={addSuccess}
                onSubmit={saveModel}
            />
        </div>
    )
}

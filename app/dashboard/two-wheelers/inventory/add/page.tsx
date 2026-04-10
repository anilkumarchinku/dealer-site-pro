"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { Button } from "@/components/ui/button"
import { VehicleImageUpload } from "@/components/two-wheelers/VehicleImageUpload"
import { ArrowLeft, Sparkles, ChevronDown } from "lucide-react"
import Link from "next/link"
import brandData from "@/lib/data/brand-models.json"
import { getScrapedImageUrls } from "@/lib/utils/brand-model-images"

const TYPES   = ["bike", "scooter", "moped", "electric"] as const
const FUEL    = ["petrol", "electric"] as const
const STOCK   = ["available", "booking_open", "out_of_stock"] as const

const LOGO_EXT: Record<string, string> = {
    "hop-electric": "svg", "okinawa-autotech": "webp",
}
const ALL_2W_BRANDS = [
    ...(brandData.twoWheelers.traditional as { brandId: string; brand: string; models: Record<string, string[]> }[]),
    ...(brandData.twoWheelers.electric    as { brandId: string; brand: string; models: Record<string, string[]> }[]),
]

export default function AddTwoWheelerVehiclePage() {
    const router = useRouter()
    const { dealerId } = useOnboardingStore()
    const [saving,       setSaving]       = useState(false)
    const [aiLoading,    setAiLoading]    = useState(false)
    const [error,        setError]        = useState("")
    const [images,       setImages]       = useState<string[]>([])
    const [brandOpen,    setBrandOpen]    = useState(false)
    const [brandSearch,  setBrandSearch]  = useState("")

    const [form, setForm] = useState({
        type:                    "bike" as typeof TYPES[number],
        brand:                   "",
        model:                   "",
        variant:                 "",
        year:                    new Date().getFullYear(),
        fuel_type:               "petrol" as typeof FUEL[number],
        engine_cc:               "",
        battery_kwh:             "",
        mileage_kmpl:            "",
        range_km:                "",
        top_speed_kmph:          "",
        ex_showroom_price_paise: "",
        on_road_price_paise:     "",
        emi_starting_paise:      "",
        stock_status:            "available" as typeof STOCK[number],
        bs6_compliant:           true,
        fame_subsidy_eligible:   false,
        charging_time_hours:     "",
        battery_warranty_years:  "",
        description:             "",
        features:                "",
        brochure_url:            "",
    })

    const selectedBrandData = useMemo(
        () => ALL_2W_BRANDS.find(b => b.brand === form.brand),
        [form.brand]
    )
    const modelOptions = useMemo(() => {
        if (!selectedBrandData) return []
        return Object.values(selectedBrandData.models).flat() as string[]
    }, [selectedBrandData])
    const filteredBrands = useMemo(
        () => ALL_2W_BRANDS.filter(b => b.brand.toLowerCase().includes(brandSearch.toLowerCase())),
        [brandSearch]
    )

    // Auto-fill scraped image when brand+model selected and no images uploaded yet
    useEffect(() => {
        if (!form.brand || !form.model || images.length > 0) return
        const brandEntry = ALL_2W_BRANDS.find(b => b.brand === form.brand)
        if (!brandEntry) return
        const [jpgUrl] = getScrapedImageUrls("2w", brandEntry.brandId, form.model)
        setImages([jpgUrl])
    }, [form.brand, form.model]) // eslint-disable-line react-hooks/exhaustive-deps

    function set(field: string, value: string | boolean | number) {
        setForm(f => ({ ...f, [field]: value }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!dealerId) {
            setError("Unable to identify your dealer account. Please refresh the page and try again.")
            return
        }
        if (!form.brand || !form.model || !form.ex_showroom_price_paise) {
            setError("Brand, model, and ex-showroom price are required.")
            return
        }
        setSaving(true)
        setError("")

        const payload = {
            dealer_id:               dealerId,
            type:                    form.type,
            brand:                   form.brand.trim(),
            model:                   form.model.trim(),
            variant:                 form.variant.trim() || null,
            year:                    Number(form.year),
            fuel_type:               form.fuel_type,
            engine_cc:               form.engine_cc               ? Number(form.engine_cc)               : null,
            battery_kwh:             form.battery_kwh             ? Number(form.battery_kwh)             : null,
            mileage_kmpl:            form.mileage_kmpl            ? Number(form.mileage_kmpl)            : null,
            range_km:                form.range_km                ? Number(form.range_km)                : null,
            top_speed_kmph:          form.top_speed_kmph          ? Number(form.top_speed_kmph)          : null,
            ex_showroom_price_paise: Math.round(Number(form.ex_showroom_price_paise) * 100),
            on_road_price_paise:     form.on_road_price_paise     ? Math.round(Number(form.on_road_price_paise) * 100)     : null,
            emi_starting_paise:      form.emi_starting_paise      ? Math.round(Number(form.emi_starting_paise) * 100)      : null,
            stock_status:            form.stock_status,
            bs6_compliant:           form.bs6_compliant,
            fame_subsidy_eligible:   form.fame_subsidy_eligible,
            charging_time_hours:     form.charging_time_hours     ? Number(form.charging_time_hours)     : null,
            battery_warranty_years:  form.battery_warranty_years  ? Number(form.battery_warranty_years)  : null,
            description:             form.description.trim() || null,
            features:                form.features.split("\n").map(s => s.trim()).filter(Boolean),
            images,
            brochure_url:            form.brochure_url.trim() || null,
            colors:                  [],
            status:                  "active",
        }

        try {
            const res = await fetch("/api/two-wheelers", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(payload),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? "Failed to add vehicle")
            router.push("/dashboard/two-wheelers/inventory")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setSaving(false)
        }
    }

    async function generateDescription() {
        if (!form.brand || !form.model) { setError("Enter brand and model first."); return }
        setAiLoading(true); setError("")
        try {
            const res = await fetch("/api/ai/generate-description", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    make: form.brand, model: form.model,
                    variant: form.variant || undefined,
                    year: form.year,
                    fuel_type: form.fuel_type,
                    mileage_km: form.mileage_kmpl ? Number(form.mileage_kmpl) : undefined,
                    features: form.features.split("\n").map(s => s.trim()).filter(Boolean),
                }),
            })
            const data = await res.json()
            if (data.description) set("description", data.description)
            else setError(data.error ?? "AI generation failed")
        } catch { setError("AI generation failed") }
        finally { setAiLoading(false) }
    }

    const isElectric = form.type === "electric" || form.fuel_type === "electric"

    return (
        <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/two-wheelers/inventory"><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <h1 className="text-2xl font-bold">Add New 2W Vehicle</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Basic Info */}
                <fieldset className="bg-card border border-border rounded-xl p-5 space-y-4">
                    <legend className="text-sm font-semibold px-1">Basic Information</legend>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Type *</label>
                            <select value={form.type} onChange={e => set("type", e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Fuel Type *</label>
                            <select value={form.fuel_type} onChange={e => set("fuel_type", e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                {FUEL.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {/* Brand picker */}
                        <div className="col-span-1 relative">
                            <label className="text-sm font-medium">Brand *</label>
                            <button type="button" onClick={() => setBrandOpen(o => !o)}
                                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm flex items-center gap-2 text-left">
                                {selectedBrandData ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={`/data/brand-logos/${selectedBrandData.brandId}.${LOGO_EXT[selectedBrandData.brandId] ?? "png"}`}
                                            alt="" className="w-5 h-5 object-contain"
                                            onError={e => { e.currentTarget.style.display = "none" }} />
                                        <span className="truncate">{selectedBrandData.brand}</span>
                                    </>
                                ) : <span className="text-muted-foreground">Select brand</span>}
                                <ChevronDown className="w-4 h-4 ml-auto shrink-0 text-muted-foreground" />
                            </button>
                            {brandOpen && (
                                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-64 overflow-hidden flex flex-col">
                                    <div className="p-2 border-b border-border">
                                        <input autoFocus type="text" placeholder="Search..." value={brandSearch}
                                            onChange={e => setBrandSearch(e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm rounded-md border border-input bg-background focus:outline-none" />
                                    </div>
                                    <div className="overflow-y-auto">
                                        {filteredBrands.map(b => (
                                            <button key={b.brandId} type="button"
                                                onClick={() => { set("brand", b.brand); set("model", ""); setBrandOpen(false); setBrandSearch(""); }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent text-left">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={`/data/brand-logos/${b.brandId}.${LOGO_EXT[b.brandId] ?? "png"}`}
                                                    alt="" className="w-5 h-5 object-contain shrink-0"
                                                    onError={e => { e.currentTarget.style.display = "none" }} />
                                                <span>{b.brand}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Model dropdown */}
                        <div className="col-span-1">
                            <label className="text-sm font-medium">Model *</label>
                            {modelOptions.length > 0 ? (
                                <select value={form.model} onChange={e => set("model", e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                    <option value="">Select model</option>
                                    {modelOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                    <option value="__other__">Other (type below)</option>
                                </select>
                            ) : (
                                <input value={form.model} onChange={e => set("model", e.target.value)}
                                    placeholder="e.g. Splendor Plus"
                                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                            )}
                            {form.model === "__other__" && (
                                <input placeholder="Type model name" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                    onChange={e => set("model", e.target.value)} />
                            )}
                        </div>

                        <div className="col-span-1">
                            <label className="text-sm font-medium">Variant</label>
                            <input value={form.variant} onChange={e => set("variant", e.target.value)} placeholder="Optional" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Year *</label>
                        <input type="number" value={form.year} onChange={e => set("year", Number(e.target.value))} min={2000} max={2030} className="mt-1 w-32 rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                    </div>
                </fieldset>

                {/* Technical Specs */}
                <fieldset className="bg-card border border-border rounded-xl p-5 space-y-4">
                    <legend className="text-sm font-semibold px-1">Technical Specs</legend>

                    <div className="grid grid-cols-3 gap-4">
                        {!isElectric && (
                            <div>
                                <label className="text-sm font-medium">Engine CC</label>
                                <input type="number" value={form.engine_cc} onChange={e => set("engine_cc", e.target.value)} placeholder="125" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                            </div>
                        )}
                        {isElectric && (
                            <>
                                <div>
                                    <label className="text-sm font-medium">Battery kWh</label>
                                    <input type="number" step="0.1" value={form.battery_kwh} onChange={e => set("battery_kwh", e.target.value)} placeholder="3.0" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Range (km)</label>
                                    <input type="number" value={form.range_km} onChange={e => set("range_km", e.target.value)} placeholder="120" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Charging (hrs)</label>
                                    <input type="number" step="0.5" value={form.charging_time_hours} onChange={e => set("charging_time_hours", e.target.value)} placeholder="4" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                                </div>
                            </>
                        )}
                        {!isElectric && (
                            <div>
                                <label className="text-sm font-medium">Mileage (kmpl)</label>
                                <input type="number" step="0.1" value={form.mileage_kmpl} onChange={e => set("mileage_kmpl", e.target.value)} placeholder="60" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                            </div>
                        )}
                        <div>
                            <label className="text-sm font-medium">Top Speed (kmph)</label>
                            <input type="number" value={form.top_speed_kmph} onChange={e => set("top_speed_kmph", e.target.value)} placeholder="90" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={form.bs6_compliant} onChange={e => set("bs6_compliant", e.target.checked)} className="rounded" />
                            BS6 Compliant
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={form.fame_subsidy_eligible} onChange={e => set("fame_subsidy_eligible", e.target.checked)} className="rounded" />
                            FAME Subsidy Eligible
                        </label>
                    </div>
                </fieldset>

                {/* Pricing */}
                <fieldset className="bg-card border border-border rounded-xl p-5 space-y-4">
                    <legend className="text-sm font-semibold px-1">Pricing (₹)</legend>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium">Ex-Showroom *</label>
                            <input type="number" value={form.ex_showroom_price_paise} onChange={e => set("ex_showroom_price_paise", e.target.value)} placeholder="75000" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">On-Road</label>
                            <input type="number" value={form.on_road_price_paise} onChange={e => set("on_road_price_paise", e.target.value)} placeholder="85000" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">EMI Starting</label>
                            <input type="number" value={form.emi_starting_paise} onChange={e => set("emi_starting_paise", e.target.value)} placeholder="2500" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Stock Status</label>
                        <select value={form.stock_status} onChange={e => set("stock_status", e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                            {STOCK.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                        </select>
                    </div>
                </fieldset>

                {/* Media & Description */}
                <fieldset className="bg-card border border-border rounded-xl p-5 space-y-4">
                    <legend className="text-sm font-semibold px-1">Media & Details</legend>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Vehicle Images</label>
                        <VehicleImageUpload value={images} onChange={setImages} maxImages={6} />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Brochure URL</label>
                        <input value={form.brochure_url} onChange={e => set("brochure_url", e.target.value)} placeholder="https://..." className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Features (one per line)</label>
                        <textarea value={form.features} onChange={e => set("features", e.target.value)} rows={4} placeholder="LED Headlight&#10;Digital Instrument Cluster&#10;USB Charging Port" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-sm font-medium">Description</label>
                            <button
                                type="button"
                                onClick={generateDescription}
                                disabled={aiLoading}
                                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline disabled:opacity-50"
                            >
                                <Sparkles className="w-3 h-3" />
                                {aiLoading ? "Generating..." : "Generate with AI"}
                            </button>
                        </div>
                        <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                    </div>
                </fieldset>

                {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2">{error}</p>}

                <div className="flex items-center gap-3">
                    <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Add Vehicle"}</Button>
                    <Button type="button" variant="outline" asChild><Link href="/dashboard/two-wheelers/inventory">Cancel</Link></Button>
                </div>
            </form>
        </div>
    )
}

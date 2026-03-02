"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const TYPES  = ["passenger", "cargo", "electric", "school_van"] as const
const FUEL   = ["petrol", "diesel", "cng", "electric", "lpg"] as const
const GRADES = ["A", "B", "C"] as const
const RC     = ["clear", "hypothecation", "pending"] as const

export default function AddUsedThreeWheelerPage() {
    const router = useRouter()
    const { dealerId } = useOnboardingStore()
    const [saving, setSaving] = useState(false)
    const [error,  setError]  = useState("")
    const [images, setImages]  = useState<string[]>([])

    const [form, setForm] = useState({
        type:                     "passenger" as typeof TYPES[number],
        brand:                    "",
        model:                    "",
        variant:                  "",
        year:                     new Date().getFullYear(),
        fuel_type:                "cng" as typeof FUEL[number],
        km_driven:                "",
        no_of_owners:             "1",
        condition_grade:          "A" as typeof GRADES[number],
        rc_status:                "clear" as typeof RC[number],
        vehicle_reg_no:           "",
        insurance_valid_until:    "",
        permit_valid_until:       "",
        fitness_certificate_valid: "",
        certified_pre_owned:      false,
        price_paise:              "",
        negotiable:               false,
        description:              "",
    })

    function set(field: string, value: string | boolean | number) {
        setForm(f => ({ ...f, [field]: value }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!dealerId) return
        if (!form.brand || !form.model || !form.km_driven || !form.price_paise) {
            setError("Brand, model, KM driven, and price are required.")
            return
        }
        setSaving(true)
        setError("")

        const payload = {
            dealer_id:                dealerId,
            type:                     form.type,
            brand:                    form.brand.trim(),
            model:                    form.model.trim(),
            variant:                  form.variant.trim() || null,
            year:                     Number(form.year),
            fuel_type:                form.fuel_type,
            km_driven:                Number(form.km_driven),
            no_of_owners:             Number(form.no_of_owners),
            condition_grade:          form.condition_grade || null,
            rc_status:                form.rc_status || null,
            vehicle_reg_no:           form.vehicle_reg_no.trim() || null,
            insurance_valid_until:    form.insurance_valid_until || null,
            permit_valid_until:       form.permit_valid_until || null,
            fitness_certificate_valid: form.fitness_certificate_valid || null,
            certified_pre_owned:      form.certified_pre_owned,
            price_paise:              Math.round(Number(form.price_paise) * 100),
            negotiable:               form.negotiable,
            images,
            description:              form.description.trim() || null,
            status:                   "available",
        }

        try {
            const res = await fetch("/api/three-wheelers/used", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(payload),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? "Failed to add vehicle")
            router.push("/dashboard/three-wheelers/used")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/three-wheelers/used"><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <h1 className="text-2xl font-bold">Add Used 3W Vehicle</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <fieldset className="bg-card border border-border rounded-xl p-5 space-y-4">
                    <legend className="text-sm font-semibold px-1">Vehicle Details</legend>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Type *</label>
                            <select value={form.type} onChange={e => set("type", e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                {TYPES.map(t => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Fuel Type *</label>
                            <select value={form.fuel_type} onChange={e => set("fuel_type", e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                {FUEL.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium">Brand *</label>
                            <input value={form.brand} onChange={e => set("brand", e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Model *</label>
                            <input value={form.model} onChange={e => set("model", e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Variant</label>
                            <input value={form.variant} onChange={e => set("variant", e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium">Year *</label>
                            <input type="number" value={form.year} onChange={e => set("year", Number(e.target.value))} min={1990} max={2030} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">KM Driven *</label>
                            <input type="number" value={form.km_driven} onChange={e => set("km_driven", e.target.value)} placeholder="50000" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Owners</label>
                            <input type="number" value={form.no_of_owners} onChange={e => set("no_of_owners", e.target.value)} min={1} max={5} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Registration Number</label>
                        <input value={form.vehicle_reg_no} onChange={e => set("vehicle_reg_no", e.target.value)} placeholder="MH12AB1234" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                    </div>
                </fieldset>

                <fieldset className="bg-card border border-border rounded-xl p-5 space-y-4">
                    <legend className="text-sm font-semibold px-1">Condition & Documents</legend>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Condition Grade</label>
                            <select value={form.condition_grade} onChange={e => set("condition_grade", e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">RC Status</label>
                            <select value={form.rc_status} onChange={e => set("rc_status", e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                                {RC.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium">Insurance Valid Until</label>
                            <input type="date" value={form.insurance_valid_until} onChange={e => set("insurance_valid_until", e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Permit Valid Until</label>
                            <input type="date" value={form.permit_valid_until} onChange={e => set("permit_valid_until", e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Fitness Certificate</label>
                            <input type="date" value={form.fitness_certificate_valid} onChange={e => set("fitness_certificate_valid", e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={form.certified_pre_owned} onChange={e => set("certified_pre_owned", e.target.checked)} className="rounded" />
                            Certified Pre-Owned
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={form.negotiable} onChange={e => set("negotiable", e.target.checked)} className="rounded" />
                            Price Negotiable
                        </label>
                    </div>
                </fieldset>

                <fieldset className="bg-card border border-border rounded-xl p-5 space-y-4">
                    <legend className="text-sm font-semibold px-1">Pricing & Media</legend>
                    <div>
                        <label className="text-sm font-medium">Selling Price (₹) *</label>
                        <input type="number" value={form.price_paise} onChange={e => set("price_paise", e.target.value)} placeholder="120000" className="mt-1 w-48 rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                    </div>
                </fieldset>

                {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2">{error}</p>}

                <div className="flex items-center gap-3">
                    <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Add Vehicle"}</Button>
                    <Button type="button" variant="outline" asChild><Link href="/dashboard/three-wheelers/used">Cancel</Link></Button>
                </div>
            </form>
        </div>
    )
}

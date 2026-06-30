"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PhoneInput } from "@/components/ui/phone-input"
import {
    ArrowRight, ArrowLeft, Building2, ChevronDown, ChevronUp,
    Plus, Trash2, MapPin,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { OutletData, OutletBranch } from "@/lib/types"

interface OutletForm extends OutletData {
    expanded: boolean
}

export default function Step1bOutletsPage() {
    const router = useRouter()
    const { data, updateData } = useOnboardingStore()

    // Build initial outlet forms from selected brands
    const allBrands = [
        ...(data.brands ?? []).map(b => ({ name: b, type: "cars" })),
        ...(data.brands2w ?? []).map(b => ({ name: b, type: "2w" })),
        ...(data.brands3w ?? []).map(b => ({ name: b, type: "3w" })),
        // Add "Used Cars" outlet for hybrid dealers
        ...(data.sellsUsedCars ? [{ name: "Used Cars", type: "used" }] : []),
    ]

    const [outlets, setOutlets] = useState<OutletForm[]>(() => {
        // Pre-fill from store if outlets were already set
        const existing = data.outlets ?? []
        return allBrands.map((brand, i) => {
            const saved = existing.find(
                o => o.brandName === brand.name && o.vehicleType === brand.type
            )
            return {
                brandName: brand.name,
                vehicleType: brand.type,
                outletName: saved?.outletName ?? "",
                phone: saved?.phone ?? data.phone ?? "",
                whatsapp: saved?.whatsapp ?? data.whatsapp ?? "",
                email: saved?.email ?? data.email ?? "",
                fullAddress: saved?.fullAddress ?? data.fullAddress ?? "",
                city: saved?.city ?? "",
                state: saved?.state ?? "",
                googleMapsUrl: saved?.googleMapsUrl ?? "",
                branches: saved?.branches ?? [],
                expanded: i === 0, // expand first by default
            }
        })
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    // Redirect back if no brands selected
    useEffect(() => {
        if (allBrands.length === 0) {
            router.replace("/onboarding/step-1")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const toggleExpand = (idx: number) => {
        setOutlets(prev =>
            prev.map((o, i) => (i === idx ? { ...o, expanded: !o.expanded } : o))
        )
    }

    const updateOutlet = (idx: number, field: keyof OutletData, value: string) => {
        setOutlets(prev =>
            prev.map((o, i) => (i === idx ? { ...o, [field]: value } : o))
        )
    }

    const addBranch = (idx: number) => {
        setOutlets(prev =>
            prev.map((o, i) =>
                i === idx
                    ? { ...o, branches: [...(o.branches ?? []), { city: "", address: "" }] }
                    : o
            )
        )
    }

    const removeBranch = (outletIdx: number, branchIdx: number) => {
        setOutlets(prev =>
            prev.map((o, i) =>
                i === outletIdx
                    ? { ...o, branches: (o.branches ?? []).filter((_, j) => j !== branchIdx) }
                    : o
            )
        )
    }

    const updateBranch = (outletIdx: number, branchIdx: number, field: keyof OutletBranch, value: string) => {
        setOutlets(prev =>
            prev.map((o, i) =>
                i === outletIdx
                    ? {
                        ...o,
                        branches: (o.branches ?? []).map((b, j) =>
                            j === branchIdx ? { ...b, [field]: value } : b
                        ),
                    }
                    : o
            )
        )
    }

    const handleBack = () => {
        router.push("/onboarding/step-1")
    }

    const handleNext = () => {
        setIsSubmitting(true)

        // Save outlet data to store
        const outletData: OutletData[] = outlets.map(o => ({
            brandName: o.brandName,
            vehicleType: o.vehicleType,
            outletName: o.outletName || undefined,
            phone: o.phone || undefined,
            whatsapp: o.whatsapp || undefined,
            email: o.email || undefined,
            fullAddress: o.fullAddress || undefined,
            city: o.city || undefined,
            state: o.state || undefined,
            googleMapsUrl: o.googleMapsUrl || undefined,
            branches: (o.branches ?? []).filter(b => b.city && b.address),
        }))

        updateData({ outlets: outletData })

        // Navigate to next step based on dealer category
        const isFirstHand = data.dealerCategory === "new"
        if (isFirstHand) {
            router.push("/onboarding/step-2-inventory")
        } else {
            router.push("/onboarding/step-2-used")
        }
        setIsSubmitting(false)
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Outlet Details</h1>
                <p className="text-muted-foreground text-sm">
                    Set up contact info and locations for each outlet. Fields are pre-filled with your main dealership details — customize per outlet as needed.
                </p>
            </div>

            {/* Outlet Cards */}
            {outlets.map((outlet, idx) => (
                <Card key={`${outlet.brandName}-${outlet.vehicleType}`} variant="glass" className="rounded-2xl border-border/70 bg-card/90 shadow-sm">
                    {/* Collapsible Header */}
                    <div
                        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/30 transition-colors rounded-t-2xl"
                        onClick={() => toggleExpand(idx)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Building2 className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{outlet.brandName}</p>
                                {outlet.city && (
                                    <p className="text-xs text-muted-foreground">{outlet.city}{outlet.state ? `, ${outlet.state}` : ""}</p>
                                )}
                            </div>
                            {outlet.vehicleType === "used" && (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                    Used Cars
                                </span>
                            )}
                        </div>
                        {outlet.expanded ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                    </div>

                    {/* Expanded Form */}
                    {outlet.expanded && (
                        <CardContent className="space-y-4 pt-0 pb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Outlet Name (optional)"
                                    placeholder={outlet.brandName}
                                    value={outlet.outletName ?? ""}
                                    onChange={e => updateOutlet(idx, "outletName", e.target.value)}
                                />
                                <Input
                                    label="Phone"
                                    placeholder="+91 98765 43210"
                                    value={outlet.phone ?? ""}
                                    onChange={e => updateOutlet(idx, "phone", e.target.value)}
                                />
                                <Input
                                    label="WhatsApp"
                                    placeholder="+91 98765 43210"
                                    value={outlet.whatsapp ?? ""}
                                    onChange={e => updateOutlet(idx, "whatsapp", e.target.value)}
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="outlet@dealer.com"
                                    value={outlet.email ?? ""}
                                    onChange={e => updateOutlet(idx, "email", e.target.value)}
                                />
                                <Input
                                    label="City"
                                    placeholder="Hyderabad"
                                    value={outlet.city ?? ""}
                                    onChange={e => updateOutlet(idx, "city", e.target.value)}
                                />
                                <Input
                                    label="State"
                                    placeholder="Telangana"
                                    value={outlet.state ?? ""}
                                    onChange={e => updateOutlet(idx, "state", e.target.value)}
                                />
                            </div>
                            <Input
                                label="Full Address"
                                placeholder="Plot 123, Road No. 45, Jubilee Hills"
                                value={outlet.fullAddress ?? ""}
                                onChange={e => updateOutlet(idx, "fullAddress", e.target.value)}
                            />
                            <Input
                                label="Google Maps URL"
                                placeholder="https://www.google.com/maps/place/..."
                                value={outlet.googleMapsUrl ?? ""}
                                onChange={e => updateOutlet(idx, "googleMapsUrl", e.target.value)}
                            />
                            <details className="text-xs text-muted-foreground mt-1">
                                <summary className="cursor-pointer font-medium">How to get your Maps URL?</summary>
                                <ol className="list-decimal ml-4 mt-1 space-y-0.5">
                                    <li>Open <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Maps</a></li>
                                    <li>Search for your outlet location</li>
                                    <li>Click the pin on the map</li>
                                    <li>Click &ldquo;Share&rdquo; then &ldquo;Copy link&rdquo;</li>
                                    <li>Paste it above</li>
                                </ol>
                            </details>

                            {/* Branches */}
                            <div className="pt-2">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-medium flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                        Branches
                                    </p>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-xs gap-1"
                                        onClick={() => addBranch(idx)}
                                    >
                                        <Plus className="w-3 h-3" /> Add Branch
                                    </Button>
                                </div>

                                {(outlet.branches ?? []).length === 0 && (
                                    <p className="text-xs text-muted-foreground italic">
                                        No branches added. Click &ldquo;Add Branch&rdquo; if this outlet has additional locations.
                                    </p>
                                )}

                                {(outlet.branches ?? []).map((branch, bIdx) => (
                                    <div key={bIdx} className="grid grid-cols-[1fr_1fr_2fr_auto] gap-2 mb-2">
                                        <Input
                                            placeholder="City"
                                            value={branch.city}
                                            onChange={e => updateBranch(idx, bIdx, "city", e.target.value)}
                                        />
                                        <Input
                                            placeholder="State"
                                            value={branch.state ?? ""}
                                            onChange={e => updateBranch(idx, bIdx, "state", e.target.value)}
                                        />
                                        <Input
                                            placeholder="Address"
                                            value={branch.address}
                                            onChange={e => updateBranch(idx, bIdx, "address", e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 w-9 p-0 text-destructive"
                                            onClick={() => removeBranch(idx, bIdx)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    )}
                </Card>
            ))}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
                <Button variant="ghost" onClick={handleBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button onClick={handleNext} disabled={isSubmitting} className="gap-2">
                    Continue <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

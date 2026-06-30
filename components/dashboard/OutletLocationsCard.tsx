"use client"

import { useState, useCallback } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    MapPin, Building2, Phone, Mail, ChevronDown, ChevronUp,
    Edit2, Save, X, Plus, MessageCircle, Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { OutletRow, OutletProfileUpdate } from "@/lib/db/settings"
import type { Json } from "@/lib/database.types"
import { updateOutletProfile, createUsedCarsOutlet } from "@/lib/db/settings"

interface OutletBranch {
    city: string
    state?: string
    address: string
    phone?: string
}

interface Props {
    dealerId: string
    outlets: OutletRow[]
    mainAddress: string
    mainPhone: string
    mainEmail: string
    branches: Array<{ city: string; state?: string; address: string; phone?: string }>
    serviceCenters: Array<{ id: string; name: string; address: string; city: string | null; phone: string | null; working_hours: string | null }>
    sellsUsedCars: boolean
    onOutletsChange: (outlets: OutletRow[]) => void
}

export function OutletLocationsCard({
    dealerId,
    outlets,
    mainAddress,
    mainPhone,
    mainEmail,
    branches,
    serviceCenters,
    sellsUsedCars,
    onOutletsChange,
}: Props) {
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState<OutletProfileUpdate>({})
    const [editBranches, setEditBranches] = useState<OutletBranch[]>([])
    const [saving, setSaving] = useState(false)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [addingUsedCars, setAddingUsedCars] = useState(false)

    const hasUsedCarsOutlet = outlets.some(o => o.vehicle_type === "used")

    const startEdit = useCallback((outlet: OutletRow) => {
        setEditingId(outlet.id)
        setEditForm({
            outlet_name: outlet.outlet_name ?? "",
            phone: outlet.phone ?? "",
            whatsapp: outlet.whatsapp ?? "",
            email: outlet.email ?? "",
            full_address: outlet.full_address ?? "",
            city: outlet.city ?? "",
            state: outlet.state ?? "",
            google_maps_url: outlet.google_maps_url ?? "",
        })
        setEditBranches(
            Array.isArray(outlet.branches)
                ? (outlet.branches as unknown as OutletBranch[])
                : []
        )
    }, [])

    const cancelEdit = useCallback(() => {
        setEditingId(null)
        setEditForm({})
        setEditBranches([])
    }, [])

    const saveEdit = useCallback(async () => {
        if (!editingId) return
        setSaving(true)
        const fields: OutletProfileUpdate = {
            ...editForm,
            branches: editBranches.length > 0 ? (editBranches as unknown as Json) : null,
        }
        const result = await updateOutletProfile(editingId, dealerId, fields)
        if (result.success) {
            onOutletsChange(
                outlets.map(o =>
                    o.id === editingId
                        ? {
                            ...o,
                            outlet_name: (fields.outlet_name as string) || null,
                            phone: (fields.phone as string) || null,
                            whatsapp: (fields.whatsapp as string) || null,
                            email: (fields.email as string) || null,
                            full_address: (fields.full_address as string) || null,
                            city: (fields.city as string) || null,
                            state: (fields.state as string) || null,
                            google_maps_url: (fields.google_maps_url as string) || null,
                            branches: fields.branches ?? null,
                        }
                        : o
                )
            )
            setEditingId(null)
            setEditForm({})
            setEditBranches([])
        }
        setSaving(false)
    }, [editingId, editForm, editBranches, dealerId, outlets, onOutletsChange])

    const addUsedCarsOutlet = useCallback(async () => {
        setAddingUsedCars(true)
        const result = await createUsedCarsOutlet(dealerId)
        if (result.success) {
            // Refresh — caller should re-fetch
            onOutletsChange([
                ...outlets,
                {
                    id: crypto.randomUUID(),
                    brand_name: "Used Cars",
                    vehicle_type: "used",
                    is_primary: false,
                    outlet_name: null,
                    phone: null,
                    whatsapp: null,
                    email: null,
                    full_address: null,
                    city: null,
                    state: null,
                    google_maps_url: null,
                    branches: null,
                },
            ])
        }
        setAddingUsedCars(false)
    }, [dealerId, outlets, onOutletsChange])

    const addBranch = useCallback(() => {
        setEditBranches(prev => [...prev, { city: "", address: "" }])
    }, [])

    const removeBranch = useCallback((idx: number) => {
        setEditBranches(prev => prev.filter((_, i) => i !== idx))
    }, [])

    const updateBranch = useCallback((idx: number, field: keyof OutletBranch, value: string) => {
        setEditBranches(prev =>
            prev.map((b, i) => (i === idx ? { ...b, [field]: value } : b))
        )
    }, [])

    return (
        <Card variant="glass" className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
            <CardHeader>
                <CardTitle className="flex items-center gap-2.5 text-lg">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    Dealership Locations
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Main Office */}
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">Main Office</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">Primary</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{mainAddress || "Address not set"}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                        {mainPhone && <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{mainPhone}</span>}
                        {mainEmail && <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" />{mainEmail}</span>}
                    </div>
                </div>

                {/* Outlets */}
                {outlets.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Outlets ({outlets.length})
                        </p>
                        <div className="grid gap-3">
                            {outlets.map(outlet => {
                                const isEditing = editingId === outlet.id
                                const isExpanded = expandedId === outlet.id
                                const displayName = outlet.outlet_name || outlet.brand_name
                                const outletBranches = Array.isArray(outlet.branches) ? (outlet.branches as unknown as OutletBranch[]) : []

                                return (
                                    <div key={outlet.id} className="rounded-xl border border-border bg-muted/30 overflow-hidden">
                                        {/* Header */}
                                        <div
                                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={() => !isEditing && setExpandedId(isExpanded ? null : outlet.id)}
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <Building2 className="w-4 h-4 text-primary shrink-0" />
                                                <span className="text-sm font-semibold truncate">{displayName}</span>
                                                {outlet.city && (
                                                    <span className="text-xs text-muted-foreground">— {outlet.city}</span>
                                                )}
                                                {outlet.vehicle_type === "used" && (
                                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Used</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                {!isEditing && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0"
                                                        onClick={(e) => { e.stopPropagation(); startEdit(outlet) }}
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                )}
                                                {!isEditing && (isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />)}
                                            </div>
                                        </div>

                                        {/* Expanded View */}
                                        {isExpanded && !isEditing && (
                                            <div className="px-4 pb-4 space-y-2 border-t border-border/50">
                                                {outlet.full_address && (
                                                    <p className="text-sm text-muted-foreground pt-3">
                                                        <MapPin className="w-3 h-3 inline mr-1" />{outlet.full_address}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                    {outlet.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{outlet.phone}</span>}
                                                    {outlet.whatsapp && <span className="inline-flex items-center gap-1"><MessageCircle className="w-3 h-3" />{outlet.whatsapp}</span>}
                                                    {outlet.email && <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" />{outlet.email}</span>}
                                                </div>
                                                {outletBranches.length > 0 && (
                                                    <div className="pt-2">
                                                        <p className="text-xs font-medium text-muted-foreground mb-1">Branches ({outletBranches.length})</p>
                                                        {outletBranches.map((b, i) => (
                                                            <div key={i} className="text-xs text-muted-foreground ml-4 py-0.5">
                                                                {b.city}{b.state ? `, ${b.state}` : ""} — {b.address}
                                                                {b.phone && <span className="ml-2">({b.phone})</span>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {!outlet.phone && !outlet.email && !outlet.full_address && (
                                                    <p className="text-xs text-muted-foreground/60 pt-2 italic">
                                                        No outlet-specific contact info set. Using main office details.
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Edit Form */}
                                        {isEditing && (
                                            <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-3">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <Input
                                                        label="Outlet Name"
                                                        placeholder={outlet.brand_name}
                                                        value={(editForm.outlet_name as string) ?? ""}
                                                        onChange={e => setEditForm(f => ({ ...f, outlet_name: e.target.value }))}
                                                    />
                                                    <Input
                                                        label="Phone"
                                                        placeholder="+91 98765 43210"
                                                        value={(editForm.phone as string) ?? ""}
                                                        onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                                                    />
                                                    <Input
                                                        label="WhatsApp"
                                                        placeholder="+91 98765 43210"
                                                        value={(editForm.whatsapp as string) ?? ""}
                                                        onChange={e => setEditForm(f => ({ ...f, whatsapp: e.target.value }))}
                                                    />
                                                    <Input
                                                        label="Email"
                                                        type="email"
                                                        placeholder="outlet@dealer.com"
                                                        value={(editForm.email as string) ?? ""}
                                                        onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                                                    />
                                                    <Input
                                                        label="City"
                                                        placeholder="Hyderabad"
                                                        value={(editForm.city as string) ?? ""}
                                                        onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))}
                                                    />
                                                    <Input
                                                        label="State"
                                                        placeholder="Telangana"
                                                        value={(editForm.state as string) ?? ""}
                                                        onChange={e => setEditForm(f => ({ ...f, state: e.target.value }))}
                                                    />
                                                </div>
                                                <Input
                                                    label="Full Address"
                                                    placeholder="Plot 123, Road No. 45, Jubilee Hills"
                                                    value={(editForm.full_address as string) ?? ""}
                                                    onChange={e => setEditForm(f => ({ ...f, full_address: e.target.value }))}
                                                />
                                                <Input
                                                    label="Google Maps URL"
                                                    placeholder="https://www.google.com/maps/place/..."
                                                    value={(editForm.google_maps_url as string) ?? ""}
                                                    onChange={e => setEditForm(f => ({ ...f, google_maps_url: e.target.value }))}
                                                />

                                                {/* Branch Editor */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-xs font-medium text-muted-foreground">Branches</p>
                                                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={addBranch}>
                                                            <Plus className="w-3 h-3" /> Add Branch
                                                        </Button>
                                                    </div>
                                                    {editBranches.map((branch, idx) => (
                                                        <div key={idx} className="grid grid-cols-[1fr_1fr_2fr_auto] gap-2 mb-2">
                                                            <Input
                                                                placeholder="City"
                                                                value={branch.city}
                                                                onChange={e => updateBranch(idx, "city", e.target.value)}
                                                            />
                                                            <Input
                                                                placeholder="State"
                                                                value={branch.state ?? ""}
                                                                onChange={e => updateBranch(idx, "state", e.target.value)}
                                                            />
                                                            <Input
                                                                placeholder="Address"
                                                                value={branch.address}
                                                                onChange={e => updateBranch(idx, "address", e.target.value)}
                                                            />
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-9 w-9 p-0 text-destructive"
                                                                onClick={() => removeBranch(idx)}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Save / Cancel */}
                                                <div className="flex items-center gap-2 pt-2">
                                                    <Button size="sm" className="gap-1.5" onClick={saveEdit} disabled={saving}>
                                                        <Save className="w-3.5 h-3.5" />
                                                        {saving ? "Saving..." : "Save"}
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="gap-1.5" onClick={cancelEdit}>
                                                        <X className="w-3.5 h-3.5" /> Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Add Used Cars Outlet */}
                {sellsUsedCars && !hasUsedCarsOutlet && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 text-xs"
                        onClick={addUsedCarsOutlet}
                        disabled={addingUsedCars}
                    >
                        <Plus className="w-3.5 h-3.5" />
                        {addingUsedCars ? "Adding..." : "Add Used Cars Outlet"}
                    </Button>
                )}

                {/* Dealer-level Branches (from dealers.branches) */}
                {branches.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Branches ({branches.length})
                        </p>
                        <div className="grid gap-2">
                            {branches.map((branch, idx) => (
                                <div key={idx} className="rounded-xl border border-border bg-muted/30 p-4">
                                    <p className="text-sm font-semibold">{branch.city}{branch.state ? `, ${branch.state}` : ""}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{branch.address}</p>
                                    {branch.phone && (
                                        <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
                                            <Phone className="w-3 h-3" />{branch.phone}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Service Centers */}
                {serviceCenters.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Service Centers ({serviceCenters.length})
                        </p>
                        <div className="grid gap-2">
                            {serviceCenters.map(sc => (
                                <div key={sc.id} className="rounded-xl border border-border bg-muted/30 p-4">
                                    <p className="text-sm font-semibold">{sc.name}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{sc.address}{sc.city ? `, ${sc.city}` : ""}</p>
                                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                                        {sc.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{sc.phone}</span>}
                                        {sc.working_hours && <span>{sc.working_hours}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {outlets.length === 0 && branches.length === 0 && serviceCenters.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                        No outlets, branches, or service centers configured. You can add them during onboarding or contact support.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

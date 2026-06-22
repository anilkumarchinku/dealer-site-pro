"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { deriveInsuranceStatus, getChallanSummary, parseIndianDate, parseMakeModel, type RCData } from "@/lib/utils/rc-mapper"
import { AlertCircle, Camera, CheckCircle, Clock, ExternalLink, FileSearch, IndianRupee, Loader2, Phone, RefreshCw, Search, ShieldCheck, XCircle } from "lucide-react"
import { PremiumPageHeader } from "@/components/dashboard/premium-ui"
import { timeAgo } from "@/lib/utils/format"

type SellRequestStatus = "new" | "reviewing" | "contacted" | "approved" | "rejected" | "listed"
type FieldSource = "seller" | "rc"
type ListingOverrideKey =
    | "make"
    | "model"
    | "year"
    | "fuel_type"
    | "color"
    | "registration_number"
    | "vin"
    | "owner_count"
    | "insurance_provider"
    | "insurance_valid_until"
    | "insurance_status"

type ListingOverrides = Partial<Record<ListingOverrideKey, string | number>>
type FieldChoiceMap = Partial<Record<ListingOverrideKey, FieldSource>>
type RCLookupState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "done"; data: RCData & { _demo?: boolean; _cache?: "redis" | "memory" } }
    | { status: "error"; error: string }

interface ComparisonField {
    key: ListingOverrideKey
    label: string
    sellerValue: string | number | null
    rcValue: string | number | null
    helper?: string
}

interface SellRequest {
    id: string
    seller_name: string
    seller_phone: string
    seller_email: string | null
    make: string
    model: string | null
    variant: string | null
    year: number
    fuel_type: string
    transmission: string | null
    registration_number: string | null
    vin: string | null
    mileage_km: number
    owner_count: string | null
    expected_price_paise: number | null
    color: string | null
    body_type: string | null
    features: string[] | null
    city: string | null
    address: string | null
    preferred_date: string | null
    preferred_slot: string | null
    estimated_low_paise: number | null
    estimated_high_paise: number | null
    photo_urls: string[] | null
    insurance_status: "unknown" | "active" | "expired" | "expiring_soon" | null
    insurance_provider: string | null
    insurance_valid_until: string | null
    insurance_quote_url: string | null
    video_url: string | null
    accident_history: "unknown" | "none" | "minor" | "major" | null
    flood_damage: boolean | null
    service_history_available: boolean | null
    rc_available: boolean | null
    loan_active: boolean | null
    notes: string | null
    status: SellRequestStatus
    approved_vehicle_id: string | null
    created_at: string
}

const statusStyles: Record<SellRequestStatus, string> = {
    new: "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/20",
    reviewing: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20",
    contacted: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
    rejected: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20",
    listed: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20",
}

function formatPaise(value: number | null | undefined) {
    if (!value) return "N/A"
    return `Rs. ${Math.round(value / 100).toLocaleString("en-IN")}`
}

function formatRange(low: number | null, high: number | null) {
    if (!low || !high) return "Estimate pending"
    return `${formatPaise(low)} - ${formatPaise(high)}`
}

function bestListingPricePaise(request: SellRequest) {
    return request.estimated_high_paise
        ?? request.estimated_low_paise
        ?? request.expected_price_paise
        ?? 0
}

function yesNo(value: boolean | null | undefined) {
    if (typeof value !== "boolean") return "N/A"
    return value ? "Yes" : "No"
}

function detailChip(label: string, value: string | null | undefined) {
    if (!value) return null
    return <span className="rounded-full border px-2 py-1">{label}: {value}</span>
}

function VehiclePhotos({ urls }: { urls: string[] | null }) {
    const photoUrls = (urls ?? []).filter(Boolean)

    if (photoUrls.length === 0) {
        return (
            <div className="flex h-24 w-full items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 text-xs text-muted-foreground sm:w-40">
                <div className="text-center">
                    <Camera className="mx-auto mb-1 h-5 w-5" />
                    No photos
                </div>
            </div>
        )
    }

    return (
        <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
            {photoUrls.slice(0, 8).map((url, index) => (
                <a
                    key={`${url}-${index}`}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-muted"
                    title={`Open photo ${index + 1}`}
                >
                    <img
                        src={url}
                        alt={`Seller vehicle photo ${index + 1}`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        {index + 1}/{photoUrls.length}
                    </span>
                </a>
            ))}
        </div>
    )
}

function cleanDisplayValue(value: unknown) {
    if (value === undefined || value === null) return null
    if (typeof value === "number") return Number.isFinite(value) ? String(value) : null
    const text = String(value).trim()
    return text || null
}

function hasDisplayValue(value: string | number | null) {
    return cleanDisplayValue(value) !== null
}

function displayValue(value: string | number | null) {
    return cleanDisplayValue(value) ?? "Not provided"
}

function formatDateValue(value: string | number | null | undefined) {
    return cleanDisplayValue(value)
}

function InfoRow({ label, value, highlight = false }: { label: string; value: string | number | null | undefined; highlight?: boolean }) {
    const display = cleanDisplayValue(value)
    if (!display) return null
    return (
        <div className="flex justify-between gap-3 border-b border-border/60 py-2 last:border-0">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className={cn("max-w-[65%] text-right text-xs font-semibold", highlight ? "text-red-500" : "text-foreground")}>
                {display}
            </span>
        </div>
    )
}

function ownerCountLabel(value: number | undefined) {
    if (!value || !Number.isFinite(value) || value < 1) return null
    if (value === 1) return "1st"
    if (value === 2) return "2nd"
    if (value === 3) return "3rd"
    return `${value}th+`
}

function extractRcYear(rcData: RCData) {
    const isoDate = parseIndianDate(rcData.registration_date ?? "")
    if (!isoDate) return null
    const year = Number(isoDate.slice(0, 4))
    return Number.isFinite(year) ? year : null
}

function getRcListingValues(rcData: RCData): ListingOverrides {
    const makeModel = rcData.make_model ? parseMakeModel(rcData.make_model) : null
    const insuranceValidUntil = parseIndianDate(rcData.insurance_upto ?? "")

    return {
        make: cleanDisplayValue(makeModel?.make) ?? undefined,
        model: cleanDisplayValue(makeModel?.model) ?? undefined,
        year: extractRcYear(rcData) ?? undefined,
        fuel_type: cleanDisplayValue(rcData.fuel_type) ?? undefined,
        color: cleanDisplayValue(rcData.color) ?? undefined,
        registration_number: cleanDisplayValue(rcData.rc_number)?.toUpperCase() ?? undefined,
        vin: cleanDisplayValue(rcData.chassis_number) ?? undefined,
        owner_count: ownerCountLabel(rcData.owner_count) ?? undefined,
        insurance_provider: cleanDisplayValue(rcData.insurance_company) ?? undefined,
        insurance_valid_until: insuranceValidUntil ?? undefined,
        insurance_status: insuranceValidUntil ? deriveInsuranceStatus(insuranceValidUntil) : undefined,
    }
}

function buildComparisonFields(request: SellRequest, rcData: RCData): ComparisonField[] {
    const rc = getRcListingValues(rcData)
    const fields: ComparisonField[] = [
        { key: "make", label: "Make", sellerValue: request.make, rcValue: rc.make ?? null },
        { key: "model", label: "Model", sellerValue: request.model, rcValue: rc.model ?? null },
        { key: "year", label: "Year", sellerValue: request.year, rcValue: rc.year ?? null, helper: "RC year is derived from registration date." },
        { key: "fuel_type", label: "Fuel", sellerValue: request.fuel_type, rcValue: rc.fuel_type ?? null },
        { key: "color", label: "Colour", sellerValue: request.color, rcValue: rc.color ?? null },
        { key: "registration_number", label: "Number plate", sellerValue: request.registration_number, rcValue: rc.registration_number ?? null },
        { key: "vin", label: "VIN / Chassis", sellerValue: request.vin, rcValue: rc.vin ?? null },
        { key: "owner_count", label: "Owner count", sellerValue: request.owner_count, rcValue: rc.owner_count ?? null },
        { key: "insurance_provider", label: "Insurer", sellerValue: request.insurance_provider, rcValue: rc.insurance_provider ?? null },
        { key: "insurance_valid_until", label: "Insurance valid until", sellerValue: formatDateValue(request.insurance_valid_until), rcValue: rc.insurance_valid_until ?? null },
        { key: "insurance_status", label: "Insurance status", sellerValue: request.insurance_status, rcValue: rc.insurance_status ?? null },
    ]

    return fields.filter(field => hasDisplayValue(field.sellerValue) || hasDisplayValue(field.rcValue))
}

function defaultFieldChoice(field: ComparisonField): FieldSource {
    return !hasDisplayValue(field.sellerValue) && hasDisplayValue(field.rcValue) ? "rc" : "seller"
}

function buildListingOverrides(request: SellRequest, rcData: RCData, choices: FieldChoiceMap | undefined): ListingOverrides | undefined {
    const overrides: ListingOverrides = {}

    for (const field of buildComparisonFields(request, rcData)) {
        const source = choices?.[field.key] ?? defaultFieldChoice(field)
        if (source === "rc" && hasDisplayValue(field.rcValue)) {
            overrides[field.key] = field.rcValue as string | number
        }
    }

    return Object.keys(overrides).length > 0 ? overrides : undefined
}

export default function SellRequestsPage() {
    const [requests, setRequests] = useState<SellRequest[]>([])
    const [loading, setLoading] = useState(false)
    const [savingId, setSavingId] = useState("")
    const [query, setQuery] = useState("")
    const [status, setStatus] = useState<SellRequestStatus | "all">("new")
    const [listingPrices, setListingPrices] = useState<Record<string, string>>({})
    const [rcLookups, setRcLookups] = useState<Record<string, RCLookupState>>({})
    const [rcInputs, setRcInputs] = useState<Record<string, string>>({})
    const [fieldChoices, setFieldChoices] = useState<Record<string, FieldChoiceMap>>({})

    const loadRequests = async () => {
        setLoading(true)
        const res = await fetch("/api/sell-requests")
        const data = await res.json().catch(() => null)
        setRequests(data?.requests ?? [])
        setLoading(false)
    }

    useEffect(() => { loadRequests() }, [])

    const filtered = useMemo(() => requests.filter(request => {
        const text = [
            request.seller_name,
            request.seller_phone,
            request.make,
            request.model,
            request.registration_number,
            request.vin,
        ].filter(Boolean).join(" ").toLowerCase()
        return text.includes(query.toLowerCase()) && (status === "all" || request.status === status)
    }), [query, requests, status])

    const updateStatus = async (request: SellRequest, nextStatus: SellRequestStatus) => {
        setSavingId(request.id)
        const listingPrice = listingPrices[request.id]?.trim()
        const listingPricePaise = nextStatus === "listed" && listingPrice
            ? Math.round(Number(listingPrice) * 100)
            : undefined
        const rcState = rcLookups[request.id]
        const listingOverrides = nextStatus === "listed" && rcState?.status === "done"
            ? buildListingOverrides(request, rcState.data, fieldChoices[request.id])
            : undefined

        const res = await fetch("/api/sell-requests", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: request.id,
                status: nextStatus,
                listing_price_paise: Number.isFinite(listingPricePaise) ? listingPricePaise : undefined,
                listing_overrides: listingOverrides,
            }),
        })
        const data = await res.json().catch(() => null)
        if (res.ok) {
            setRequests(prev => prev.map(item => item.id === request.id
                ? { ...item, ...(data?.request ?? {}), status: data?.request?.status ?? nextStatus }
                : item))
            setListingPrices(prev => {
                const next = { ...prev }
                delete next[request.id]
                return next
            })
        }
        setSavingId("")
    }

    const lookupRegistration = async (request: SellRequest) => {
        const rc = (rcInputs[request.id] ?? request.registration_number ?? "")
            .toUpperCase()
            .replace(/[\s-]/g, "")
        if (!rc) return

        setRcLookups(prev => ({ ...prev, [request.id]: { status: "loading" } }))

        const res = await fetch("/api/vehicles/rc-lookup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rc }),
        })
        const data = await res.json().catch(() => null)

        if (!res.ok || !data?.success) {
            setRcLookups(prev => ({
                ...prev,
                [request.id]: { status: "error", error: data?.error ?? "RC lookup failed" },
            }))
            return
        }

        setRcLookups(prev => ({
            ...prev,
            [request.id]: {
                status: "done",
                data: {
                    ...(data.data ?? {}),
                    _cache: data.data?._cache ?? (data.cached ? "redis" : undefined),
                },
            },
        }))
    }

    const setFieldChoice = (requestId: string, field: ListingOverrideKey, source: FieldSource) => {
        setFieldChoices(prev => ({
            ...prev,
            [requestId]: {
                ...(prev[requestId] ?? {}),
                [field]: source,
            },
        }))
    }

    const setAllFieldChoices = (request: SellRequest, rcData: RCData, source: FieldSource) => {
        const nextChoices: FieldChoiceMap = {}
        for (const field of buildComparisonFields(request, rcData)) {
            if (source === "rc" && !hasDisplayValue(field.rcValue)) continue
            nextChoices[field.key] = source
        }
        setFieldChoices(prev => ({ ...prev, [request.id]: nextChoices }))
    }

    const renderRcComparison = (request: SellRequest) => {
        const state = rcLookups[request.id]
        if (!state || state.status === "idle") return null

        if (state.status === "loading") {
            return (
                <div className="flex items-center gap-2 rounded-xl border bg-muted/30 p-3 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking registration details...
                </div>
            )
        }

        if (state.status === "error") {
            return (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{state.error}</span>
                </div>
            )
        }

        const fields = buildComparisonFields(request, state.data)
        const choices = fieldChoices[request.id] ?? {}
        const challanSummary = getChallanSummary(state.data)

        return (
            <div className="space-y-3 rounded-xl border bg-muted/20 p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            <h3 className="text-sm font-semibold">Registration details comparison</h3>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Choose the source that should be copied to the public inventory listing.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {state.data._demo && <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-700">Demo data</span>}
                        {state.data._cache && <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-700">Cached</span>}
                        <Button type="button" variant="outline" size="sm" onClick={() => setAllFieldChoices(request, state.data, "seller")}>
                            Use seller
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => setAllFieldChoices(request, state.data, "rc")}>
                            Use RC
                        </Button>
                    </div>
                </div>

                {state.data.blacklisted && (
                    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        RC lookup says this vehicle is blacklisted. Verify before listing.
                    </div>
                )}

                <div className="grid gap-2">
                    {fields.map(field => {
                        const selected = choices[field.key] ?? defaultFieldChoice(field)
                        const rcAvailable = hasDisplayValue(field.rcValue)
                        return (
                            <div key={field.key} className="grid gap-2 rounded-lg border bg-background p-3 text-sm lg:grid-cols-[140px_1fr_1fr_140px]">
                                <div>
                                    <p className="font-medium">{field.label}</p>
                                    {field.helper && <p className="mt-1 text-[11px] text-muted-foreground">{field.helper}</p>}
                                </div>
                                <div className={cn("rounded-md border px-3 py-2", selected === "seller" ? "border-primary bg-primary/5" : "bg-muted/20")}>
                                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Seller</p>
                                    <p className="break-words font-medium">{displayValue(field.sellerValue)}</p>
                                </div>
                                <div className={cn("rounded-md border px-3 py-2", selected === "rc" ? "border-primary bg-primary/5" : "bg-muted/20", !rcAvailable && "opacity-60")}>
                                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">RC lookup</p>
                                    <p className="break-words font-medium">{displayValue(field.rcValue)}</p>
                                </div>
                                <div className="flex items-center gap-2 lg:flex-col lg:items-stretch">
                                    <Button type="button" size="sm" variant={selected === "seller" ? "default" : "outline"} onClick={() => setFieldChoice(request.id, field.key, "seller")}>
                                        Seller
                                    </Button>
                                    <Button type="button" size="sm" variant={selected === "rc" ? "default" : "outline"} disabled={!rcAvailable} onClick={() => setFieldChoice(request.id, field.key, "rc")}>
                                        RC
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 xl:grid-cols-4">
                    {detailChip("Owner", state.data.owner_name)}
                    {detailChip("RTO", state.data.rto)}
                    {detailChip("State", state.data.state)}
                    {detailChip("Challan", challanSummary.status)}
                    {detailChip("Engine", state.data.engine_number)}
                    {detailChip("Class", state.data.vehicle_class)}
                    {detailChip("RC validity", state.data.rc_validity_upto)}
                    {detailChip("Fitness", state.data.fitness_upto)}
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                    <div className="rounded-xl border bg-background p-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vehicle</p>
                        <InfoRow label="RC Number" value={state.data.rc_number} />
                        <InfoRow label="Make & Model" value={state.data.make_model} />
                        <InfoRow label="Vehicle Class" value={state.data.vehicle_class} />
                        <InfoRow label="Fuel Type" value={state.data.fuel_type} />
                        <InfoRow label="Colour" value={state.data.color} />
                        <InfoRow label="Body Type" value={state.data.body_type} />
                        <InfoRow label="Seating" value={state.data.seating_capacity} />
                        <InfoRow label="State / RTO" value={state.data.rto ? `${state.data.rto}${state.data.state ? `, ${state.data.state}` : ""}` : state.data.state} />
                    </div>

                    <div className="rounded-xl border bg-background p-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Registration & Insurance</p>
                        <InfoRow label="Owner Name" value={state.data.owner_name} />
                        <InfoRow label="Registration Date" value={state.data.registration_date} />
                        <InfoRow label="Owner Count" value={state.data.owner_count} />
                        <InfoRow label="RC Status" value={state.data.rc_status} />
                        <InfoRow label="Tax Upto" value={state.data.tax_upto} />
                        <InfoRow label="Insurance Valid Upto" value={state.data.insurance_upto} />
                        <InfoRow label="Insurer" value={state.data.insurance_company} />
                        <InfoRow label="Fitness Valid Upto" value={state.data.fitness_upto} />
                        <InfoRow label="RC Validity" value={state.data.rc_validity_upto} />
                        <InfoRow label="Financer" value={state.data.financer} />
                        <InfoRow label="e-Challan" value={challanSummary.status} highlight={challanSummary.hasPending} />
                        <InfoRow label="NOC Details" value={state.data.noc_details} />
                        <InfoRow label="Engine No." value={state.data.engine_number} />
                        <InfoRow label="Chassis No." value={state.data.chassis_number} />
                    </div>
                </div>

                {state.data.challans?.length ? (
                    <div className="rounded-xl border bg-background p-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Challan Details</p>
                        <div className="space-y-2">
                            {state.data.challans.slice(0, 5).map((challan, index) => (
                                <div key={`${challan.challan_number ?? index}`} className="rounded-lg border bg-muted/20 p-3 text-xs">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-muted-foreground">Challan No.</p>
                                            <p className="font-semibold">{challan.challan_number ?? `Record ${index + 1}`}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-muted-foreground">Amount</p>
                                            <p className="font-semibold">{challan.amount ? `Rs. ${challan.amount}` : "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 grid gap-1 sm:grid-cols-2">
                                        <p><span className="text-muted-foreground">Status:</span> {challan.challan_status ?? "N/A"}</p>
                                        <p><span className="text-muted-foreground">Date:</span> {challan.challan_date ?? "N/A"}</p>
                                        <p><span className="text-muted-foreground">State:</span> {challan.state ?? "N/A"}</p>
                                        <p><span className="text-muted-foreground">Place:</span> {challan.challan_place ?? "N/A"}</p>
                                    </div>
                                    {challan.offense_details && <p className="mt-2 text-muted-foreground">{challan.offense_details}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <PremiumPageHeader
                eyebrow="Acquisitions"
                title="Sell Requests"
                description="Review seller-submitted cars, then approve them into live inventory."
                actions={
                    <Button variant="outline" size="sm" onClick={loadRequests} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                        Refresh
                    </Button>
                }
            />

            <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search seller, car, plate, VIN..." className="pl-9" />
                    </div>
                    <Select value={status} onValueChange={value => setStatus(value as SellRequestStatus | "all")}>
                        <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="new">Pending approval</SelectItem>
                            {Object.keys(statusStyles).map(item => (
                                item === "new" ? null :
                                <SelectItem key={item} value={item}>{item}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <div className="space-y-3">
                {loading ? (
                    <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80"><CardContent className="p-8 text-center text-sm text-muted-foreground">Loading sell requests...</CardContent></Card>
                ) : filtered.length === 0 ? (
                    <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80"><CardContent className="p-8 text-center text-sm text-muted-foreground">No sell requests found.</CardContent></Card>
                ) : filtered.map(request => (
                    <Card key={request.id} className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                        <CardContent className="grid gap-4 p-4 xl:grid-cols-[1fr_190px]">
                            <div className="min-w-0 space-y-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="font-black tracking-tight">{request.make} {request.model} {request.variant}</h2>
                                    <span className={cn("rounded-full border px-2 py-0.5 text-xs font-medium capitalize", statusStyles[request.status])}>
                                        {request.status}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{timeAgo(request.created_at)}</span>
                                </div>

                                <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 xl:grid-cols-4">
                                    <span>{request.year} / {request.fuel_type} / {request.transmission ?? "Transmission N/A"}</span>
                                    <span>{request.mileage_km.toLocaleString("en-IN")} km / {request.owner_count ?? "Owner N/A"}</span>
                                    <span>{request.registration_number ?? "Plate N/A"}</span>
                                    <span>{request.city ?? "City N/A"} {request.preferred_date ? `/ ${request.preferred_date}` : ""}</span>
                                </div>

                                <VehiclePhotos urls={request.photo_urls} />

                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    {detailChip("Body", request.body_type)}
                                    {detailChip("Colour", request.color)}
                                    {detailChip("VIN", request.vin)}
                                    <span className="rounded-full border px-2 py-1">Expected: {formatPaise(request.expected_price_paise)}</span>
                                    <span className="rounded-full border px-2 py-1">Insurance: {request.insurance_status ?? "unknown"}</span>
                                    {detailChip("Provider", request.insurance_provider)}
                                    {detailChip("Valid until", request.insurance_valid_until)}
                                </div>

                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    <span className="rounded-full border px-2 py-1">Accident: {request.accident_history ?? "unknown"}</span>
                                    <span className="rounded-full border px-2 py-1">Flood: {yesNo(request.flood_damage)}</span>
                                    <span className="rounded-full border px-2 py-1">Service history: {yesNo(request.service_history_available)}</span>
                                    <span className="rounded-full border px-2 py-1">RC: {yesNo(request.rc_available)}</span>
                                    <span className="rounded-full border px-2 py-1">Loan: {yesNo(request.loan_active)}</span>
                                </div>

                                {request.features?.length ? (
                                    <div className="flex flex-wrap gap-2">
                                        {request.features.slice(0, 8).map(feature => (
                                            <span key={feature} className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">{feature}</span>
                                        ))}
                                    </div>
                                ) : null}

                                <div className="flex flex-wrap gap-4 text-sm">
                                    <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{request.seller_name} / {request.seller_phone}</span>
                                    <span className="flex items-center gap-1.5"><IndianRupee className="h-4 w-4" />{formatRange(request.estimated_low_paise, request.estimated_high_paise)}</span>
                                    {request.preferred_slot && <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{request.preferred_slot}</span>}
                                </div>

                                {request.address && <p className="text-sm text-muted-foreground">Address: {request.address}</p>}
                                {request.notes && <p className="line-clamp-2 text-sm text-muted-foreground">{request.notes}</p>}

                                <div className="flex flex-wrap gap-2">
                                    {(request.photo_urls ?? []).slice(0, 4).map((url, index) => (
                                        <a key={url} href={url} target="_blank" rel="noreferrer" className="text-xs font-medium text-primary hover:underline">
                                            Photo {index + 1}
                                        </a>
                                    ))}
                                    {request.video_url && (
                                        <a href={request.video_url} target="_blank" rel="noreferrer" className="text-xs font-medium text-primary hover:underline">
                                            Video
                                        </a>
                                    )}
                                    {request.insurance_quote_url && (
                                        <a href={request.insurance_quote_url} target="_blank" rel="noreferrer" className="text-xs font-medium text-primary hover:underline">
                                            Insurance link
                                        </a>
                                    )}
                                </div>

                                {renderRcComparison(request)}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 xl:flex-col xl:items-stretch">
                                <Input
                                    value={rcInputs[request.id] ?? request.registration_number ?? ""}
                                    onChange={event => setRcInputs(prev => ({
                                        ...prev,
                                        [request.id]: event.target.value.toUpperCase().replace(/\s/g, ""),
                                    }))}
                                    placeholder="RC number"
                                    className="h-9 min-w-40 text-sm uppercase"
                                    maxLength={12}
                                />
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={!(rcInputs[request.id] ?? request.registration_number)?.trim() || rcLookups[request.id]?.status === "loading"}
                                    onClick={() => lookupRegistration(request)}
                                >
                                    {rcLookups[request.id]?.status === "loading"
                                        ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        : <FileSearch className="mr-2 h-4 w-4" />
                                    }
                                    Verify RC
                                </Button>
                                <Button size="sm" variant="outline" disabled={savingId === request.id} onClick={() => updateStatus(request, "contacted")}>
                                    <Phone className="mr-2 h-4 w-4" />Contacted
                                </Button>
                                {request.status === "listed" && request.approved_vehicle_id ? (
                                    <Button asChild size="sm" variant="outline">
                                        <a href={`/dashboard/inventory/${request.approved_vehicle_id}/edit`}>
                                            <ExternalLink className="mr-2 h-4 w-4" />Edit Listing
                                        </a>
                                    </Button>
                                ) : (
                                    <>
                                        <Input
                                            type="number"
                                            min={0}
                                            step={10000}
                                            placeholder={`Listing ${formatPaise(bestListingPricePaise(request))}`}
                                            value={listingPrices[request.id] ?? ""}
                                            onChange={event => setListingPrices(prev => ({ ...prev, [request.id]: event.target.value }))}
                                            className="h-9 min-w-40 text-sm"
                                        />
                                        <Button size="sm" disabled={savingId === request.id} onClick={() => updateStatus(request, "listed")}>
                                            {savingId === request.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                            Approve & List
                                        </Button>
                                    </>
                                )}
                                <Button size="sm" variant="outline" disabled={savingId === request.id} onClick={() => updateStatus(request, "rejected")}>
                                    <XCircle className="mr-2 h-4 w-4" />Reject
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

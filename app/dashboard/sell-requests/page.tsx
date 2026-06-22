"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { deriveInsuranceStatus, parseIndianDate, parseMakeModel, type RCData } from "@/lib/utils/rc-mapper"
import { AlertCircle, CheckCircle, Clock, ExternalLink, FileSearch, IndianRupee, Loader2, Phone, RefreshCw, Search, ShieldCheck, XCircle } from "lucide-react"

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
    new: "bg-green-50 text-green-700 border-green-200",
    reviewing: "bg-blue-50 text-blue-700 border-blue-200",
    contacted: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    listed: "bg-purple-50 text-purple-700 border-purple-200",
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

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const hours = Math.floor(diff / 36e5)
    if (hours < 1) return "just now"
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
}

function detailChip(label: string, value: string | null | undefined) {
    if (!value) return null
    return <span className="rounded-full border px-2 py-1">{label}: {value}</span>
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

function formatDateValue(value: string | null | undefined) {
    if (!value) return null
    return value
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
        if (!request.registration_number) return

        setRcLookups(prev => ({ ...prev, [request.id]: { status: "loading" } }))

        const res = await fetch("/api/vehicles/rc-lookup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rc: request.registration_number }),
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
                    {detailChip("Challan", state.data.challan_status ?? (state.data.challan_count != null ? `${state.data.challan_count} pending` : null))}
                    {detailChip("Engine", state.data.engine_number)}
                    {detailChip("Class", state.data.vehicle_class)}
                    {detailChip("RC validity", state.data.rc_validity_upto)}
                    {detailChip("Fitness", state.data.fitness_upto)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Sell Requests</h1>
                    <p className="text-sm text-muted-foreground">Review seller-submitted cars, then approve them into live inventory.</p>
                </div>
                <Button variant="outline" size="sm" onClick={loadRequests} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Refresh
                </Button>
            </div>

            <Card>
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
                    <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Loading sell requests...</CardContent></Card>
                ) : filtered.length === 0 ? (
                    <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">No sell requests found.</CardContent></Card>
                ) : filtered.map(request => (
                    <Card key={request.id}>
                        <CardContent className="grid gap-4 p-4 xl:grid-cols-[1fr_190px]">
                            <div className="min-w-0 space-y-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="font-semibold">{request.make} {request.model} {request.variant}</h2>
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
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={!request.registration_number || rcLookups[request.id]?.status === "loading"}
                                    onClick={() => lookupRegistration(request)}
                                >
                                    {rcLookups[request.id]?.status === "loading"
                                        ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        : <FileSearch className="mr-2 h-4 w-4" />
                                    }
                                    {request.registration_number ? "Verify RC" : "No plate"}
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

"use client"

/**
 * Platform Maintainer 360 — command center for the DealerSite Pro team.
 * Global KPIs, Cyepro vs non-Cyepro split, and a per-dealer table with a
 * drill-down drawer (leads, services, inventory, images). Gated by the admin
 * session; redirects to /admin (login) when unauthenticated.
 */

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
    Activity, Boxes, Building2, Car, ChevronLeft, Database, Gauge, Globe,
    MessageSquare, LayoutGrid, Loader2, RefreshCw, Search, Star, TrendingUp, Trophy, Users, Wrench, X,
} from "lucide-react"
import { OperationsAlertsPanel } from "@/components/admin/OperationsAlertsPanel"

const ACCENT = "#A8793A"

type Dealer = {
    id: string
    dealership_name: string | null
    logo_url: string | null
    slug: string | null
    subdomain: string | null
    location: string | null
    email: string | null
    phone: string | null
    vehicle_type: string | null
    is_active: boolean | null
    onboarding_complete: boolean | null
    created_at: string | null
    cyepro_enabled: boolean
    inventory_system: string | null
    leads_4w: number; leads_2w: number; leads_3w: number; leads_total: number
    service_bookings: number
    vehicles_total: number
    test_drives: number
    sell_requests: number
    messages_count: number
    reviews_count: number
    avg_rating: number | null
    active_subscriptions: number
    mrr_paise: number
    subscription_plan: string | null
    revenue_paise: number
    score: number
    rank: number
    percentile: number
    rank_leads: number
    rank_service: number
    rank_vehicles: number
    rank_engagement: number
}

type Kpis = {
    totalUsers: number | null
    totalDealers: number
    activeDealers: number
    onboardedDealers: number
    newDealers30d: number
    withCyepro: number
    withoutCyepro: number
    totalLeads: number
    leads4w: number; leads2w: number; leads3w: number
    totalServiceBookings: number
    totalVehicles: number
    totalTestDrives: number
    totalSellRequests: number
    activeSubscriptions: number
    mrrPaise: number
    revenuePaise: number
    byVehicleType: Record<string, number>
}

type DetailData = {
    dealer: Dealer
    vehicles: {
        id: string; category: "4w" | "2w" | "3w"; title: string; subtitle: string | null
        images: string[]; price_paise: number | null; status: string | null
    }[]
    recentLeads: Record<string, unknown>[]
}

const inr = (paise: number | null | undefined) => {
    const r = Math.round((paise ?? 0) / 100)
    if (r >= 1e7) return `₹${(r / 1e7).toFixed(2)} Cr`
    if (r >= 1e5) return `₹${(r / 1e5).toFixed(2)} L`
    if (r >= 1e3) return `₹${(r / 1e3).toFixed(0)}k`
    return `₹${r}`
}
const num = (n: number | null | undefined) => (n ?? 0).toLocaleString("en-IN")
const initials = (name?: string | null) =>
    (name || "?").split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")
const leadText = (lead: Record<string, unknown>, key: string) =>
    typeof lead[key] === "string" ? (lead[key] as string).trim() : ""
const leadDate = (lead: Record<string, unknown>) => {
    const created = leadText(lead, "created_at")
    return created ? new Date(created).toLocaleDateString("en-IN") : "—"
}

function Logo({ url, name, size = 40 }: { url: string | null; name: string | null; size?: number }) {
    const [err, setErr] = useState(false)
    if (url && !err) {
        // eslint-disable-next-line @next/next/no-img-element
        return (
            <img src={url} alt={name || ""} onError={() => setErr(true)}
                style={{ width: size, height: size }}
                className="rounded-lg object-contain bg-white border border-[#E7E0D7] p-0.5 shrink-0" />
        )
    }
    return (
        <div style={{ width: size, height: size, background: ACCENT }}
            className="rounded-lg shrink-0 grid place-items-center text-white text-xs font-bold">
            {initials(name)}
        </div>
    )
}

function RankBadge({ rank }: { rank: number }) {
    const medal = rank === 1 ? "#D4AF37" : rank === 2 ? "#A8A29E" : rank === 3 ? "#B07B45" : null
    if (medal) {
        return (
            <span className="inline-grid place-items-center w-7 h-7 rounded-full text-white text-xs font-bold shrink-0"
                style={{ background: medal }}>{rank}</span>
        )
    }
    return (
        <span className="inline-grid place-items-center w-7 h-7 rounded-full bg-muted text-muted-foreground text-xs font-semibold shrink-0">
            {rank}
        </span>
    )
}

function ModelImg({ images, alt }: { images: string[]; alt: string }) {
    const [idx, setIdx] = useState(0)
    if (!images.length || idx >= images.length) {
        return null
    }
    // eslint-disable-next-line @next/next/no-img-element
    return (
        <img src={images[idx]} alt={alt} onError={() => setIdx((i) => i + 1)}
            className="w-full h-full object-cover" data-model-image-source="admin-360-inventory" />
    )
}

type SortKey = "rank" | "leads_total" | "service_bookings" | "vehicles_total" | "created_at" | "dealership_name"

export default function Admin360Page() {
    const router = useRouter()
    const [authChecked, setAuthChecked] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [kpis, setKpis] = useState<Kpis | null>(null)
    const [dealers, setDealers] = useState<Dealer[]>([])

    const [search, setSearch] = useState("")
    const [cyeproFilter, setCyeproFilter] = useState<"all" | "cyepro" | "non">("all")
    const [sortKey, setSortKey] = useState<SortKey>("rank")
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

    const [selected, setSelected] = useState<Dealer | null>(null)
    const [detail, setDetail] = useState<DetailData | null>(null)
    const [detailLoading, setDetailLoading] = useState(false)

    const load = useCallback(() => {
        setLoading(true)
        setError("")
        fetch("/api/admin/dealers-360")
            .then((r) => r.json())
            .then((j) => {
                if (j.error) { setError(j.error); return }
                setKpis(j.kpis); setDealers(j.dealers ?? [])
            })
            .catch(() => setError("Failed to load dealer 360"))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        fetch("/api/admin/session")
            .then((r) => r.json())
            .then((j) => {
                if (!j.authenticated) { router.replace("/admin"); return }
                setAuthChecked(true); load()
            })
            .catch(() => router.replace("/admin"))
    }, [router, load])

    const openDealer = useCallback((d: Dealer) => {
        setSelected(d); setDetail(null); setDetailLoading(true)
        fetch(`/api/admin/dealers-360/${d.id}`)
            .then((r) => r.json())
            .then((j) => { if (!j.error) setDetail(j) })
            .finally(() => setDetailLoading(false))
    }, [])

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        let rows = dealers.filter((d) => {
            if (cyeproFilter === "cyepro" && !d.cyepro_enabled) return false
            if (cyeproFilter === "non" && d.cyepro_enabled) return false
            if (!q) return true
            return [d.dealership_name, d.location, d.subdomain, d.email]
                .some((v) => v?.toLowerCase().includes(q))
        })
        rows = [...rows].sort((a, b) => {
            const av = a[sortKey] ?? 0, bv = b[sortKey] ?? 0
            const cmp = typeof av === "string" || typeof bv === "string"
                ? String(av).localeCompare(String(bv))
                : (Number(av) - Number(bv))
            return sortDir === "asc" ? cmp : -cmp
        })
        return rows
    }, [dealers, search, cyeproFilter, sortKey, sortDir])

    const toggleSort = (k: SortKey) => {
        if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
        else { setSortKey(k); setSortDir(k === "rank" || k === "dealership_name" ? "asc" : "desc") }
    }

    if (!authChecked) {
        return (
            <div className="min-h-screen grid place-items-center">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: ACCENT }} />
            </div>
        )
    }

    return (
        <div className="min-h-screen px-4 md:px-8 py-6 max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push("/admin")}
                        className="p-2 rounded-lg border border-[#E7E0D7] bg-card hover:bg-muted transition">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Gauge className="w-6 h-6" style={{ color: ACCENT }} /> Platform 360
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Everything across DealerSite Pro — users, dealers, leads, services & revenue
                        </p>
                    </div>
                </div>
                <button onClick={load}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ background: ACCENT }}>
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl border border-[#C7453E]/30 bg-[#C7453E]/5 text-[#C7453E] text-sm">
                    {error}
                </div>
            )}

            <OperationsAlertsPanel />

            {/* KPI grid */}
            {kpis && (
                <>
                    <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                        <Kpi icon={<Users className="w-4 h-4" />} label="Total users" value={num(kpis.totalUsers ?? 0)} />
                        <Kpi icon={<Building2 className="w-4 h-4" />} label="Dealers" value={num(kpis.totalDealers)} sub={`${kpis.activeDealers} active`} />
                        <Kpi icon={<TrendingUp className="w-4 h-4" />} label="Leads" value={num(kpis.totalLeads)} sub={`${kpis.newDealers30d} new dealers/30d`} />
                        <Kpi icon={<Wrench className="w-4 h-4" />} label="Service bookings" value={num(kpis.totalServiceBookings)} />
                        <Kpi icon={<Boxes className="w-4 h-4" />} label="Vehicles" value={num(kpis.totalVehicles)} />
                        <Kpi icon={<Database className="w-4 h-4" />} label="Active subs" value={num(kpis.activeSubscriptions)} sub={inr(kpis.mrrPaise) + " MRR"} />
                    </div>

                    {/* Cyepro split + vehicle types */}
                    <div className="grid lg:grid-cols-3 gap-3 mb-6">
                        <div className="lg:col-span-2 p-5 rounded-2xl bg-card border border-[#E7E0D7]">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold flex items-center gap-2 text-sm">
                                    <Database className="w-4 h-4" style={{ color: ACCENT }} /> Cyepro integration
                                </h3>
                                <span className="text-xs text-muted-foreground">{kpis.totalDealers} dealers</span>
                            </div>
                            <SplitBar withC={kpis.withCyepro} without={kpis.withoutCyepro} />
                            <div className="flex gap-6 mt-4 text-sm">
                                <Legend color={ACCENT} label="With Cyepro (DMS)" value={kpis.withCyepro} />
                                <Legend color="#0B0E12" label="Without Cyepro" value={kpis.withoutCyepro} />
                            </div>
                        </div>
                        <div className="p-5 rounded-2xl bg-card border border-[#E7E0D7]">
                            <h3 className="font-semibold flex items-center gap-2 text-sm mb-3">
                                <LayoutGrid className="w-4 h-4" style={{ color: ACCENT }} /> By vehicle type
                            </h3>
                            <div className="space-y-2">
                                {Object.entries(kpis.byVehicleType).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                                    <div key={k} className="flex items-center justify-between text-sm">
                                        <span className="capitalize text-muted-foreground">{k}</span>
                                        <span className="font-semibold">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Leaderboard */}
            {dealers.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
                        <Trophy className="w-4 h-4" style={{ color: ACCENT }} /> Top performers
                        <span className="text-xs font-normal text-muted-foreground">· weighted by leads, service, inventory, engagement & revenue</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {dealers.slice(0, 6).map((d) => (
                            <button key={d.id} onClick={() => openDealer(d)}
                                className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-[#E7E0D7] text-left hover:border-[#A8793A] transition">
                                <RankBadge rank={d.rank} />
                                <Logo url={d.logo_url} name={d.dealership_name} />
                                <div className="min-w-0 flex-1">
                                    <div className="font-semibold truncate">{d.dealership_name || "Unnamed"}</div>
                                    <div className="text-xs text-muted-foreground truncate">
                                        {num(d.leads_total)} leads · {num(d.vehicles_total)} vehicles
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="text-lg font-bold" style={{ color: ACCENT }}>{d.score}</div>
                                    <div className="text-[10px] text-muted-foreground">score</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap mb-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search dealers, location, domain…"
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-card border border-[#E7E0D7] text-sm outline-none focus:border-[#A8793A]" />
                </div>
                <div className="flex rounded-lg border border-[#E7E0D7] overflow-hidden text-sm">
                    {([["all", "All"], ["cyepro", "Cyepro"], ["non", "No Cyepro"]] as const).map(([k, lbl]) => (
                        <button key={k} onClick={() => setCyeproFilter(k)}
                            className={`px-3 py-2 transition ${cyeproFilter === k ? "text-white" : "bg-card hover:bg-muted"}`}
                            style={cyeproFilter === k ? { background: ACCENT } : undefined}>{lbl}</button>
                    ))}
                </div>
            </div>

            {/* Dealer table */}
            <div className="rounded-2xl border border-[#E7E0D7] bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[920px] text-sm">
                        <thead>
                            <tr className="text-left text-muted-foreground border-b border-[#E7E0D7] bg-muted/40">
                                <Th onClick={() => toggleSort("rank")} active={sortKey === "rank"} dir={sortDir}>#</Th>
                                <Th onClick={() => toggleSort("dealership_name")} active={sortKey === "dealership_name"} dir={sortDir}>Dealer</Th>
                                <th className="px-3 py-3 font-medium text-right">Score</th>
                                <th className="px-3 py-3 font-medium">Cyepro</th>
                                <Th onClick={() => toggleSort("leads_total")} active={sortKey === "leads_total"} dir={sortDir} right>Leads</Th>
                                <Th onClick={() => toggleSort("service_bookings")} active={sortKey === "service_bookings"} dir={sortDir} right>Service</Th>
                                <Th onClick={() => toggleSort("vehicles_total")} active={sortKey === "vehicles_total"} dir={sortDir} right>Vehicles</Th>
                                <th className="px-3 py-3 font-medium text-right">Subs/MRR</th>
                                <th className="px-3 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr><td colSpan={9} className="px-3 py-10 text-center text-muted-foreground">
                                    <Loader2 className="w-5 h-5 animate-spin inline" /> Loading…
                                </td></tr>
                            )}
                            {!loading && filtered.map((d) => (
                                <tr key={d.id} onClick={() => openDealer(d)}
                                    className="border-b border-[#E7E0D7]/60 hover:bg-muted/50 cursor-pointer transition">
                                    <td className="px-3 py-3"><RankBadge rank={d.rank} /></td>
                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-3">
                                            <Logo url={d.logo_url} name={d.dealership_name} />
                                            <div className="min-w-0">
                                                <div className="font-semibold truncate max-w-[220px]">{d.dealership_name || "Unnamed"}</div>
                                                <div className="text-xs text-muted-foreground truncate max-w-[220px]">
                                                    {d.location || "—"}{d.subdomain ? ` · ${d.subdomain}` : ""}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 text-right font-bold" style={{ color: ACCENT }}>{d.score}</td>
                                    <td className="px-3 py-3">
                                        {d.cyepro_enabled
                                            ? <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ background: ACCENT }}>Cyepro</span>
                                            : <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">Manual</span>}
                                    </td>
                                    <td className="px-3 py-3 text-right font-semibold">{num(d.leads_total)}</td>
                                    <td className="px-3 py-3 text-right">{num(d.service_bookings)}</td>
                                    <td className="px-3 py-3 text-right">{num(d.vehicles_total)}</td>
                                    <td className="px-3 py-3 text-right">
                                        {d.active_subscriptions > 0
                                            ? <span className="font-medium">{d.active_subscriptions} · {inr(d.mrr_paise)}</span>
                                            : <span className="text-muted-foreground">—</span>}
                                    </td>
                                    <td className="px-3 py-3">
                                        <StatusDot active={d.is_active} onboarded={d.onboarding_complete} />
                                    </td>
                                </tr>
                            ))}
                            {!loading && filtered.length === 0 && (
                                <tr><td colSpan={9} className="px-3 py-10 text-center text-muted-foreground">No dealers match.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{filtered.length} of {dealers.length} dealers</p>

            {/* Detail drawer */}
            {selected && (
                <DetailDrawer dealer={selected} detail={detail} loading={detailLoading} total={dealers.length} onClose={() => setSelected(null)} />
            )}
        </div>
    )
}

function Kpi({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
    return (
        <div className="p-4 rounded-2xl bg-card border border-[#E7E0D7]">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">{icon}{label}</div>
            <div className="text-2xl font-bold tracking-tight">{value}</div>
            {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
        </div>
    )
}

function SplitBar({ withC, without }: { withC: number; without: number }) {
    const total = Math.max(1, withC + without)
    return (
        <div className="flex h-3 rounded-full overflow-hidden bg-muted">
            <div style={{ width: `${(withC / total) * 100}%`, background: ACCENT }} />
            <div style={{ width: `${(without / total) * 100}%`, background: "#0B0E12" }} />
        </div>
    )
}

function Legend({ color, label, value }: { color: string; label: string; value: number }) {
    return (
        <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm" style={{ background: color }} />
            <span className="text-muted-foreground">{label}</span>
            <span className="font-semibold">{value}</span>
        </div>
    )
}

function Th({ children, onClick, active, dir, right }: {
    children: React.ReactNode; onClick?: () => void; active?: boolean; dir?: string; right?: boolean
}) {
    return (
        <th className={`px-3 py-3 font-medium ${right ? "text-right" : ""} ${onClick ? "cursor-pointer select-none" : ""}`}
            onClick={onClick}>
            <span className={active ? "text-foreground" : ""}>{children}{active ? (dir === "asc" ? " ▲" : " ▼") : ""}</span>
        </th>
    )
}

function StatusDot({ active, onboarded }: { active: boolean | null; onboarded: boolean | null }) {
    const color = !active ? "#A39E94" : onboarded ? "#2E8B5A" : ACCENT
    const label = !active ? "Inactive" : onboarded ? "Live" : "Onboarding"
    return (
        <span className="inline-flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ background: color }} />{label}
        </span>
    )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="p-3 rounded-xl bg-muted/50 border border-[#E7E0D7]">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] mb-0.5">{icon}{label}</div>
            <div className="text-lg font-bold">{value}</div>
        </div>
    )
}

function RankCell({ label, rank, total }: { label: string; rank: number; total: number }) {
    return (
        <div className="text-center">
            <div className="text-[10px] text-muted-foreground">{label}</div>
            <div className="text-sm font-bold">#{rank}</div>
            <div className="text-[9px] text-muted-foreground">/ {total}</div>
        </div>
    )
}

function DetailDrawer({ dealer, detail, loading, total, onClose }: {
    dealer: Dealer; detail: DetailData | null; loading: boolean; total: number; onClose: () => void
}) {
    const d = detail?.dealer ?? dealer
    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full max-w-xl h-full bg-[#FBF8F1] shadow-2xl overflow-y-auto">
                <div className="sticky top-0 bg-[#FBF8F1]/95 backdrop-blur border-b border-[#E7E0D7] px-5 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <Logo url={d.logo_url} name={d.dealership_name} size={44} />
                        <div>
                            <h2 className="font-bold leading-tight">{d.dealership_name || "Unnamed"}</h2>
                            <p className="text-xs text-muted-foreground">{d.location || "—"}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
                </div>

                <div className="p-5 space-y-5">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                        {d.cyepro_enabled
                            ? <span className="px-2.5 py-1 rounded-full text-xs font-medium text-white" style={{ background: ACCENT }}>Cyepro DMS</span>
                            : <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">Manual inventory</span>}
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground capitalize">{d.vehicle_type || "—"}</span>
                        {d.subscription_plan && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground capitalize">{d.subscription_plan}</span>}
                        {d.subdomain && (
                            <a href={`https://${d.subdomain}`} target="_blank" rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 border border-[#E7E0D7] hover:border-[#A8793A]">
                                <Globe className="w-3 h-3" /> {d.subdomain}
                            </a>
                        )}
                    </div>

                    {/* Ranking */}
                    <div className="rounded-2xl border border-[#E7E0D7] p-4" style={{ background: "linear-gradient(135deg, rgba(168,121,58,0.10), transparent)" }}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <RankBadge rank={dealer.rank} />
                                <div>
                                    <div className="text-sm font-semibold flex items-center gap-1.5">
                                        <Trophy className="w-3.5 h-3.5" style={{ color: ACCENT }} /> Overall rank
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        #{dealer.rank} of {total} · {dealer.percentile}th percentile
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold" style={{ color: ACCENT }}>{dealer.score}</div>
                                <div className="text-[10px] text-muted-foreground">performance score</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E7E0D7] sm:grid-cols-4">
                            <RankCell label="Leads" rank={dealer.rank_leads} total={total} />
                            <RankCell label="Service" rank={dealer.rank_service} total={total} />
                            <RankCell label="Inventory" rank={dealer.rank_vehicles} total={total} />
                            <RankCell label="Engage" rank={dealer.rank_engagement} total={total} />
                        </div>
                    </div>

                    {/* 360 stat grid */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <Stat icon={<TrendingUp className="w-3 h-3" />} label="Leads" value={num(d.leads_total)} />
                        <Stat icon={<Wrench className="w-3 h-3" />} label="Service" value={num(d.service_bookings)} />
                        <Stat icon={<Boxes className="w-3 h-3" />} label="Vehicles" value={num(d.vehicles_total)} />
                        <Stat icon={<Car className="w-3 h-3" />} label="Test drives" value={num(d.test_drives)} />
                        <Stat icon={<Activity className="w-3 h-3" />} label="Sell reqs" value={num(d.sell_requests)} />
                        <Stat icon={<MessageSquare className="w-3 h-3" />} label="Messages" value={num(d.messages_count)} />
                        <Stat icon={<Star className="w-3 h-3" />} label="Reviews" value={`${num(d.reviews_count)}${d.avg_rating ? ` · ${d.avg_rating}★` : ""}`} />
                        <Stat icon={<Database className="w-3 h-3" />} label="Active subs" value={num(d.active_subscriptions)} />
                        <Stat icon={<TrendingUp className="w-3 h-3" />} label="MRR" value={inr(d.mrr_paise)} />
                    </div>

                    {/* Leads by category */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Leads by category</h3>
                        <div className="flex gap-2">
                            <CatPill label="4W" value={d.leads_4w} />
                            <CatPill label="2W" value={d.leads_2w} />
                            <CatPill label="3W" value={d.leads_3w} />
                        </div>
                    </div>

                    {/* Recent lead models */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Recent leads & models</h3>
                        {loading && <div className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>}
                        {!loading && detail && detail.recentLeads.length === 0 && (
                            <p className="text-sm text-muted-foreground">No recent leads yet.</p>
                        )}
                        {!loading && detail && detail.recentLeads.length > 0 && (
                            <div className="space-y-2">
                                {detail.recentLeads.slice(0, 6).map((lead, index) => {
                                    const name = leadText(lead, "customer_name") || leadText(lead, "name") || "Unknown lead"
                                    const source = leadText(lead, "source") || leadText(lead, "lead_source") || "unknown"
                                    const model =
                                        leadText(lead, "vehicle_interest") ||
                                        leadText(lead, "vehicle_model") ||
                                        leadText(lead, "car_name") ||
                                        "Model not captured"
                                    const message = leadText(lead, "message")
                                    return (
                                        <div key={leadText(lead, "id") || `${name}-${index}`}
                                            className="rounded-xl border border-[#E7E0D7] bg-card p-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-sm truncate">{name}</div>
                                                    <div className="text-xs text-muted-foreground truncate">{model}</div>
                                                </div>
                                                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                                                    {source.replace(/_/g, " ")}
                                                </span>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
                                                <span className="truncate">{message || "No message"}</span>
                                                <span className="shrink-0">{leadDate(lead)}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Inventory model cards (with images) */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Recent inventory</h3>
                        {loading && <div className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>}
                        {!loading && detail && detail.vehicles.length === 0 && (
                            <p className="text-sm text-muted-foreground">No inventory uploaded.</p>
                        )}
                        {!loading && detail && detail.vehicles.length > 0 && (
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                {detail.vehicles.map((v) => (
                                    <div key={v.id} className="rounded-xl border border-[#E7E0D7] bg-card overflow-hidden">
                                        <div className="aspect-[4/3] bg-muted grid place-items-center overflow-hidden">
                                            <ModelImg images={v.images} alt={v.title} />
                                        </div>
                                        <div className="p-2">
                                            <div className="text-xs font-semibold truncate">{v.title}</div>
                                            <div className="text-[11px] text-muted-foreground truncate">
                                                {v.subtitle || v.category.toUpperCase()}
                                            </div>
                                            {v.price_paise ? <div className="text-[11px] font-semibold mt-0.5" style={{ color: ACCENT }}>{inr(v.price_paise)}</div> : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Contact */}
                    <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-[#E7E0D7]">
                        {d.email && <div>✉ {d.email}</div>}
                        {d.phone && <div>☎ {d.phone}</div>}
                        <div>Joined {d.created_at ? new Date(d.created_at).toLocaleDateString("en-IN") : "—"}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function CatPill({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex-1 rounded-xl border border-[#E7E0D7] bg-card px-3 py-2 text-center">
            <div className="text-[11px] text-muted-foreground">{label}</div>
            <div className="text-base font-bold">{num(value)}</div>
        </div>
    )
}

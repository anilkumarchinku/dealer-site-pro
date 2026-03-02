"use client"

import { useEffect, useState, useCallback } from "react"
import { useOnboardingStore } from "@/lib/store/onboarding-store"
import type { ThreeWheelerLead, ThreeWheelerLeadStatus } from "@/lib/types/three-wheeler"

const STATUS_COLORS: Record<ThreeWheelerLeadStatus, string> = {
    new:       "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    converted: "bg-green-100 text-green-700",
    lost:      "bg-gray-100 text-gray-700",
}

const STATUSES: ThreeWheelerLeadStatus[] = ["new", "contacted", "converted", "lost"]

export default function ThreeWheelerLeadsPage() {
    const { dealerId } = useOnboardingStore()
    const [leads, setLeads]           = useState<ThreeWheelerLead[]>([])
    const [total, setTotal]           = useState(0)
    const [loading, setLoading]       = useState(true)
    const [filterStatus, setFilterStatus] = useState<string>("")

    const load = useCallback(async () => {
        if (!dealerId) return
        setLoading(true)
        try {
            const params = new URLSearchParams({ pageSize: "50" })
            if (filterStatus) params.set("status", filterStatus)
            const res  = await fetch(`/api/three-wheelers/leads?${params}`)
            const data = await res.json()
            setLeads(data.leads ?? [])
            setTotal(data.total ?? 0)
        } finally {
            setLoading(false)
        }
    }, [dealerId, filterStatus])

    useEffect(() => { load() }, [load])

    async function updateStatus(id: string, status: ThreeWheelerLeadStatus) {
        await fetch("/api/three-wheelers/leads", {
            method:  "PATCH",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ id, status }),
        })
        load()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">3W Leads</h1>
                    <p className="text-muted-foreground text-sm">{total} lead{total !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">Filter:</label>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
                    >
                        <option value="">All Statuses</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-muted/30 animate-pulse" />)}
                </div>
            ) : leads.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-lg font-medium">No leads yet</p>
                    <p className="text-sm mt-1">Leads from your public 3W site will appear here.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Name</th>
                                <th className="px-4 py-3 text-left font-medium">Phone</th>
                                <th className="px-4 py-3 text-left font-medium">Type</th>
                                <th className="px-4 py-3 text-left font-medium">Fleet Size</th>
                                <th className="px-4 py-3 text-left font-medium">Message</th>
                                <th className="px-4 py-3 text-left font-medium">Date</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {leads.map(lead => (
                                <tr key={lead.id} className="hover:bg-muted/10">
                                    <td className="px-4 py-3 font-medium">{lead.name}</td>
                                    <td className="px-4 py-3">
                                        <a href={`tel:${lead.phone}`} className="text-primary hover:underline">{lead.phone}</a>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground capitalize">{lead.lead_type.replace("_", " ")}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{lead.fleet_size ?? "—"}</td>
                                    <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{lead.message ?? "—"}</td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {new Date(lead.created_at).toLocaleDateString("en-IN")}
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={lead.status}
                                            onChange={e => updateStatus(lead.id, e.target.value as ThreeWheelerLeadStatus)}
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium border-0 cursor-pointer ${STATUS_COLORS[lead.status]}`}
                                        >
                                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

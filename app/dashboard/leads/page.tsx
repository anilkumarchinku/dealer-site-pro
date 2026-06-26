"use client"
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Search, Filter, Mail, Phone, CheckCircle, Loader2, RefreshCw, Clock, TrendingUp, Globe, Inbox, ChevronLeft, ChevronRight, Plus, PhoneCall, CalendarClock, UserPlus } from "lucide-react";
import { fetchLeads, createWalkInLead, patchLead, type ExternalLead } from "@/lib/db/leads";
import { toast } from "@/lib/utils/toast";
import { PremiumEmptyState, PremiumPageHeader } from "@/components/dashboard/premium-ui";
import { timeAgo, titleCaseFromSnake as formatLeadType } from "@/lib/utils/format";

function formatSourceUrl(url: string): string {
    if (!url) return "";
    try {
        return new URL(url).hostname.replace("www.", "");
    } catch {
        return url;
    }
}

// Local YYYY-MM-DD for the user's timezone (follow_up_date is a plain date)
function todayISO(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function isoDaysFromNow(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const isOpenLead = (l: ExternalLead) =>
    l.status !== "contacted" && l.status !== "converted" && l.status !== "lost";
// A follow-up is "due" when its date is today or earlier and the lead is still open.
function isFollowUpDue(l: ExternalLead): boolean {
    return Boolean(l.follow_up_date) && isOpenLead(l) && (l.follow_up_date as string) <= todayISO();
}
function followUpLabel(date: string): { text: string; overdue: boolean; due: boolean } {
    const today = todayISO();
    if (date < today) return { text: `Overdue · ${date}`, overdue: true, due: true };
    if (date === today) return { text: "Due today", overdue: false, due: true };
    return { text: `Follow up ${date}`, overdue: false, due: false };
}

const priorityConfig = {
    hot: { bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-600 dark:text-red-300", border: "border-red-200 dark:border-red-500/20", dot: "bg-red-500", label: "HOT" },
    warm: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-300", border: "border-amber-200 dark:border-amber-500/20", dot: "bg-amber-500", label: "WARM" },
    cold: { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-300", border: "border-blue-200 dark:border-blue-500/20", dot: "bg-blue-500", label: "COLD" },
};

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    new: { bg: "bg-green-50 dark:bg-green-500/10", text: "text-green-700 dark:text-green-300", label: "New" },
    contacted: { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-700 dark:text-blue-300", label: "Contacted" },
    qualified: { bg: "bg-purple-50 dark:bg-purple-500/10", text: "text-purple-700 dark:text-purple-300", label: "Qualified" },
    converted: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-300", label: "Converted" },
    lost: { bg: "bg-muted", text: "text-muted-foreground", label: "Lost" },
};

const cyeproSyncConfig: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-300", label: "CRM pending" },
    synced: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-300", label: "CRM synced" },
    failed: { bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-700 dark:text-red-300", label: "CRM failed" },
    skipped: { bg: "bg-slate-100 dark:bg-slate-500/10", text: "text-slate-600 dark:text-slate-300", label: "CRM skipped" },
};

const PAGE_SIZE = 20;

export default function LeadsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPriority, setFilterPriority] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [apiLeads, setApiLeads] = useState<ExternalLead[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [view, setView] = useState<"all" | "walkin" | "followup">("all");

    // Add walk-in lead dialog
    const [showAdd, setShowAdd] = useState(false);
    const [saving, setSaving] = useState(false);
    const emptyForm = {
        customer_name: "", customer_phone: "", customer_email: "",
        vehicle_interest: "", priority: "warm" as "hot" | "warm" | "cold",
        follow_up_date: isoDaysFromNow(2), notes: "",
    };
    const [form, setForm] = useState(emptyForm);

    const loadLeads = () => {
        setLoading(true);
        fetchLeads()
            .then(data => setApiLeads(data))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadLeads(); }, []); // eslint-disable-line

    // "He called the customer" — records contacted_at + flips status to contacted.
    const handleMarkCalled = async (id: string) => {
        const result = await patchLead(id, { mark_called: true });
        if (!result.success) {
            toast.error(result.error ?? "Couldn't update the lead. Please try again.");
            return;
        }
        const now = new Date().toISOString();
        setApiLeads(prev => prev.map(l => l.id === id ? { ...l, status: "contacted" as const, contacted_at: now } : l));
        toast.success("Marked as called ✓");
    };

    // Snooze a follow-up by N days (re-schedules the reminder).
    const handleSnooze = async (id: string, days: number) => {
        const next = isoDaysFromNow(days);
        const result = await patchLead(id, { follow_up_date: next });
        if (!result.success) {
            toast.error(result.error ?? "Couldn't reschedule. Please try again.");
            return;
        }
        setApiLeads(prev => prev.map(l => l.id === id ? { ...l, follow_up_date: next } : l));
        toast.success(`Follow-up moved to ${next}`);
    };

    const handleAddWalkIn = async () => {
        if (!form.customer_name.trim() || !form.customer_phone.trim()) {
            toast.error("Name and phone are required.");
            return;
        }
        setSaving(true);
        const result = await createWalkInLead({
            customer_name: form.customer_name.trim(),
            customer_phone: form.customer_phone.trim(),
            customer_email: form.customer_email.trim() || undefined,
            vehicle_interest: form.vehicle_interest.trim() || undefined,
            priority: form.priority,
            follow_up_date: form.follow_up_date || null,
            notes: form.notes.trim() || undefined,
        });
        setSaving(false);
        if (!result.success) {
            toast.error(result.error ?? "Couldn't add the lead. Please try again.");
            return;
        }
        toast.success("Walk-in lead added ✓");
        setShowAdd(false);
        setForm(emptyForm);
        loadLeads();
        setView("walkin");
    };

    const followUpDueCount = apiLeads.filter(isFollowUpDue).length;
    const walkInCount = apiLeads.filter(l => l.source === "walk_in").length;

    const filteredLeads = apiLeads.filter(lead => {
        const matchesView =
            view === "all" ? true :
            view === "walkin" ? lead.source === "walk_in" :
            isFollowUpDue(lead);
        const matchesSearch =
            lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (lead.vehicle_interest ?? "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === "all" || lead.priority === filterPriority;
        const matchesStatus = filterStatus === "all" || lead.status === filterStatus;
        return matchesView && matchesSearch && matchesPriority && matchesStatus;
    });

    const totalFiltered = filteredLeads.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const startIdx = (safePage - 1) * PAGE_SIZE;
    const endIdx = Math.min(startIdx + PAGE_SIZE, totalFiltered);
    const pagedLeads = filteredLeads.slice(startIdx, endIdx);

    const hotCount = apiLeads.filter(l => l.priority === "hot").length;
    const newCount = apiLeads.filter(l => l.status === "new").length;

    const isFiltered = searchQuery || filterPriority !== "all" || filterStatus !== "all";

    return (
        <div className="space-y-6 animate-fade-in">
            <PremiumPageHeader
                eyebrow="CRM"
                title="Lead inbox"
                description="Prioritize enquiries by intent, source, status, and the next action needed from your team."
                actions={
                    <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        {hotCount > 0 && (
                            <span className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 font-medium text-xs">
                                {hotCount} hot
                            </span>
                        )}
                        {newCount > 0 && (
                            <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200 font-medium text-xs">
                                {newCount} new
                            </span>
                        )}
                        <span className="text-sm text-muted-foreground">{apiLeads.length} total</span>
                    </div>
                    <Button onClick={() => setShowAdd(true)} className="rounded-xl gap-2">
                        <Plus className="w-4 h-4" /> Add walk-in lead
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={loadLeads}
                        disabled={loading}
                        title="Refresh leads"
                        className="rounded-xl text-muted-foreground"
                    >
                        {loading
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <RefreshCw className="w-4 h-4" />
                        }
                    </Button>
                </div>
                }
            >
                <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-bold text-muted-foreground">
                        {apiLeads.length} total
                    </span>
                    <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                        {hotCount} hot
                    </span>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                        {newCount} new
                    </span>
                </div>
            </PremiumPageHeader>

            {/* Summary Stat Chips */}
            {apiLeads.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: "Total", value: apiLeads.length, color: "bg-muted/50 text-muted-foreground border-border" },
                        { label: "Hot", value: apiLeads.filter(l => l.priority === "hot").length, color: "bg-red-50 text-red-600 border-red-200" },
                        { label: "Warm", value: apiLeads.filter(l => l.priority === "warm").length, color: "bg-amber-50 text-amber-600 border-amber-200" },
                        { label: "New", value: apiLeads.filter(l => l.status === "new").length, color: "bg-green-50 text-green-700 border-green-200" },
                        { label: "Converted", value: apiLeads.filter(l => l.status === "converted").length, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                    ].map((chip) => (
                        <div key={chip.label} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium", chip.color)}>
                            <TrendingUp className="w-3 h-3" />
                            <span>{chip.label}: {chip.value}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* View tabs */}
            <div className="flex flex-wrap items-center gap-2">
                {([
                    { key: "all", label: "All leads", icon: Inbox, count: apiLeads.length },
                    { key: "walkin", label: "Walk-ins", icon: UserPlus, count: walkInCount },
                    { key: "followup", label: "Follow-ups due", icon: CalendarClock, count: followUpDueCount },
                ] as const).map((t) => {
                    const active = view === t.key;
                    const alert = t.key === "followup" && t.count > 0;
                    return (
                        <button
                            key={t.key}
                            onClick={() => { setView(t.key); setPage(1); }}
                            className={cn(
                                "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition",
                                active
                                    ? "bg-foreground text-background border-foreground"
                                    : "bg-card text-muted-foreground border-border hover:text-foreground"
                            )}
                        >
                            <t.icon className="w-4 h-4" />
                            {t.label}
                            {t.count > 0 && (
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-full text-xs font-bold",
                                    active ? "bg-background/20" : alert ? "bg-red-100 text-red-600" : "bg-muted text-muted-foreground"
                                )}>
                                    {t.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Follow-up reminder banner */}
            {followUpDueCount > 0 && view !== "followup" && (
                <button
                    onClick={() => { setView("followup"); setPage(1); }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl border border-amber-300 bg-amber-50 text-amber-800 text-sm font-medium dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200 hover:bg-amber-100 transition text-left"
                >
                    <CalendarClock className="w-5 h-5 shrink-0" />
                    {followUpDueCount} lead{followUpDueCount > 1 ? "s" : ""} need a follow-up call today. Click to review →
                </button>
            )}

            {/* Filters */}
            <Card variant="glass" className="rounded-2xl border-border/70 bg-card/90 p-0 shadow-sm dark:bg-card/80">
                <CardContent className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search by name, email, or vehicle..."
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            <Select value={filterPriority} onValueChange={(v) => { setFilterPriority(v); setPage(1); }}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="All Priorities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    <SelectItem value="hot">🔴 Hot</SelectItem>
                                    <SelectItem value="warm">🟡 Warm</SelectItem>
                                    <SelectItem value="cold">🔵 Cold</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="contacted">Contacted</SelectItem>
                                    <SelectItem value="qualified">Qualified</SelectItem>
                                    <SelectItem value="converted">Converted</SelectItem>
                                </SelectContent>
                            </Select>
                            {isFiltered && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { setFilterPriority("all"); setFilterStatus("all"); setSearchQuery(""); setPage(1); }}
                                    className="h-8 text-xs text-muted-foreground hover:text-foreground px-2"
                                >
                                    Clear filters
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Leads List */}
            <Card variant="glass" className="rounded-2xl border-border/70 bg-card/90 p-0 shadow-sm dark:bg-card/80">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="divide-y divide-border">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-4">
                                    <div className="w-10 h-10 rounded-full bg-muted/50 animate-pulse shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3.5 bg-muted/50 rounded-full animate-pulse w-1/3" />
                                        <div className="h-3 bg-muted/50 rounded-full animate-pulse w-1/2" />
                                        <div className="h-3 bg-muted/50 rounded-full animate-pulse w-2/3" />
                                    </div>
                                    <div className="h-8 w-24 bg-muted/50 rounded-lg animate-pulse shrink-0" />
                                </div>
                            ))}
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="p-5">
                            <PremiumEmptyState
                                icon={view === "followup" ? CalendarClock : view === "walkin" ? UserPlus : Inbox}
                                title={
                                    view === "followup" ? "No follow-ups due"
                                        : view === "walkin" ? "No walk-in leads yet"
                                            : isFiltered ? "No leads match your filters" : "No leads yet"
                                }
                                description={
                                    view === "followup" ? "You're all caught up — no follow-up calls scheduled for today."
                                        : view === "walkin" ? "Click “Add walk-in lead” to log an in-store or phone enquiry and set a follow-up reminder."
                                            : isFiltered ? "Try adjusting your search, priority, or status filters."
                                                : "When customers submit enquiries from your website, they will appear here."
                                }
                            />
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto -mx-4 sm:mx-0">
                                <div className="divide-y divide-border min-w-[600px]">
                                    {pagedLeads.map((lead) => {
                                        const pc = priorityConfig[lead.priority as keyof typeof priorityConfig] ?? priorityConfig.cold;
                                        const sc = statusConfig[lead.status] ?? statusConfig.new;
                                        const cc = lead.cyepro_sync_status ? cyeproSyncConfig[lead.cyepro_sync_status] : null;
                                        const initials = lead.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                                        const isDone = lead.status === "contacted" || lead.status === "converted";
                                        return (
                                            <div
                                                key={lead.id}
                                                className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors"
                                            >
                                                {/* Avatar with priority color */}
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                                                    pc.bg, pc.text
                                                )}>
                                                    {initials}
                                                </div>

                                                {/* Lead Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                                        <h3 className="font-semibold text-sm">{lead.name}</h3>
                                                        <span className={cn(
                                                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border",
                                                            pc.bg, pc.text, pc.border
                                                        )}>
                                                            <span className={cn("w-1.5 h-1.5 rounded-full", pc.dot)} />
                                                            {pc.label}
                                                        </span>
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-full text-xs font-medium",
                                                            sc.bg, sc.text
                                                        )}>
                                                            {sc.label}
                                                        </span>
                                                        {cc && (
                                                            <span
                                                                className={cn("px-2 py-0.5 rounded-full text-xs font-medium", cc.bg, cc.text)}
                                                                title={lead.cyepro_error || cc.label}
                                                            >
                                                                {cc.label}
                                                            </span>
                                                        )}
                                                        {lead.source === "walk_in" && (
                                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground inline-flex items-center gap-1">
                                                                <UserPlus className="w-3 h-3" /> Walk-in
                                                            </span>
                                                        )}
                                                        {lead.follow_up_date && isOpenLead(lead) && (() => {
                                                            const f = followUpLabel(lead.follow_up_date as string);
                                                            return (
                                                                <span className={cn(
                                                                    "px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1",
                                                                    f.overdue ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300"
                                                                        : f.due ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300"
                                                                            : "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300"
                                                                )}>
                                                                    <CalendarClock className="w-3 h-3" /> {f.text}
                                                                </span>
                                                            );
                                                        })()}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-1">
                                                        {formatLeadType(lead.type)}
                                                        {lead.vehicle_interest ? ` · ${lead.vehicle_interest}` : ""}
                                                    </p>
                                                    {lead.message && (
                                                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                                            {lead.message}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Mail className="w-3 h-3" />{lead.email}
                                                        </span>
                                                        {lead.phone && (
                                                            <span className="flex items-center gap-1">
                                                                <Phone className="w-3 h-3" />{lead.phone}
                                                            </span>
                                                        )}
                                                        {lead.source && lead.source !== 'website' && lead.source !== 'Website' && (
                                                            <a
                                                                href={lead.source.startsWith('http') ? lead.source : `https://${lead.source}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1 text-blue-500 hover:underline max-w-[200px] truncate"
                                                                title={lead.source}
                                                            >
                                                                <Globe className="w-3 h-3 shrink-0" />
                                                                <span className="truncate">{formatSourceUrl(lead.source)}</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Time */}
                                                <div className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                                                    <Clock className="w-3 h-3" />
                                                    {timeAgo(lead.created_at)}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        title={`Email ${lead.name}`}
                                                        onClick={() => window.open(`mailto:${lead.email}`, "_blank")}
                                                    >
                                                        <Mail className="w-4 h-4" />
                                                    </Button>
                                                    {lead.phone && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            title={`Call ${lead.name}`}
                                                            onClick={() => window.open(`tel:${lead.phone}`, "_blank")}
                                                        >
                                                            <Phone className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    {isFollowUpDue(lead) && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-xs"
                                                            title="Snooze follow-up by 2 days"
                                                            onClick={() => handleSnooze(lead.id, 2)}
                                                        >
                                                            <Clock className="w-3.5 h-3.5 mr-1" /> Snooze
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant={isDone ? "ghost" : "outline"}
                                                        size="sm"
                                                        className="text-xs"
                                                        onClick={() => !isDone && handleMarkCalled(lead.id)}
                                                        disabled={isDone}
                                                    >
                                                        {isDone
                                                            ? <CheckCircle className="w-3.5 h-3.5 mr-1 text-green-600" />
                                                            : <PhoneCall className="w-3.5 h-3.5 mr-1" />}
                                                        {lead.status === "converted" ? "Converted" : lead.status === "contacted" ? "Called ✓" : "Mark called"}
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Pagination */}
                            {totalFiltered > PAGE_SIZE && (
                                <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                                    <p className="text-xs text-muted-foreground">
                                        Showing {startIdx + 1}–{endIdx} of {totalFiltered} leads
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-xs"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={safePage <= 1}
                                        >
                                            <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-xs"
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={safePage >= totalPages}
                                        >
                                            Next
                                            <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Add walk-in lead dialog */}
            <Dialog open={showAdd} onOpenChange={(o) => { setShowAdd(o); if (!o) setForm(emptyForm); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserPlus className="w-5 h-5" /> Add walk-in lead
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="wl-name">Customer name *</Label>
                                <Input id="wl-name" value={form.customer_name}
                                    onChange={(e) => setForm(f => ({ ...f, customer_name: e.target.value }))}
                                    placeholder="Ramesh Kumar" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="wl-phone">Phone *</Label>
                                <Input id="wl-phone" value={form.customer_phone}
                                    onChange={(e) => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                                    placeholder="9876543210" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="wl-email">Email (optional)</Label>
                            <Input id="wl-email" type="email" value={form.customer_email}
                                onChange={(e) => setForm(f => ({ ...f, customer_email: e.target.value }))}
                                placeholder="ramesh@email.com" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="wl-vehicle">Vehicle of interest</Label>
                            <Input id="wl-vehicle" value={form.vehicle_interest}
                                onChange={(e) => setForm(f => ({ ...f, vehicle_interest: e.target.value }))}
                                placeholder="e.g. Hyundai Creta SX" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label>Priority</Label>
                                <Select value={form.priority} onValueChange={(v) => setForm(f => ({ ...f, priority: v as "hot" | "warm" | "cold" }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hot">🔴 Hot</SelectItem>
                                        <SelectItem value="warm">🟡 Warm</SelectItem>
                                        <SelectItem value="cold">🔵 Cold</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="wl-followup">Follow-up on</Label>
                                <Input id="wl-followup" type="date" min={todayISO()} value={form.follow_up_date}
                                    onChange={(e) => setForm(f => ({ ...f, follow_up_date: e.target.value }))} />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 7].map((d) => (
                                <button key={d} type="button"
                                    onClick={() => setForm(f => ({ ...f, follow_up_date: isoDaysFromNow(d) }))}
                                    className={cn(
                                        "px-2.5 py-1 rounded-lg text-xs border transition",
                                        form.follow_up_date === isoDaysFromNow(d)
                                            ? "bg-foreground text-background border-foreground"
                                            : "bg-card border-border text-muted-foreground hover:text-foreground"
                                    )}>
                                    +{d}d
                                </button>
                            ))}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="wl-notes">Notes</Label>
                            <Textarea id="wl-notes" rows={2} value={form.notes}
                                onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                                placeholder="Budget, trade-in, test-drive plans…" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAdd(false)} disabled={saving}>Cancel</Button>
                        <Button onClick={handleAddWalkIn} disabled={saving} className="gap-2">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            Add lead
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

"use client"
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Search, Filter, Mail, Phone, CheckCircle, Loader2, RefreshCw, Clock, TrendingUp, Globe, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchLeads, updateLeadStatus, type ExternalLead } from "@/lib/db/leads";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { toast } from "@/lib/utils/toast";

function timeAgo(iso: string): string {
    if (!iso) return "";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function formatLeadType(type: string): string {
    return type.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function formatSourceUrl(url: string): string {
    if (!url) return "";
    try {
        return new URL(url).hostname.replace("www.", "");
    } catch {
        return url;
    }
}

const priorityConfig = {
    hot: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", dot: "bg-red-500", label: "HOT" },
    warm: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", dot: "bg-amber-500", label: "WARM" },
    cold: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", dot: "bg-blue-500", label: "COLD" },
};

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    new: { bg: "bg-green-50", text: "text-green-700", label: "New" },
    contacted: { bg: "bg-blue-50", text: "text-blue-700", label: "Contacted" },
    qualified: { bg: "bg-purple-50", text: "text-purple-700", label: "Qualified" },
    converted: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Converted" },
    lost: { bg: "bg-gray-100", text: "text-gray-600", label: "Lost" },
};

const PAGE_SIZE = 20;

export default function LeadsPage() {
    const { dealerId } = useOnboardingStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPriority, setFilterPriority] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [apiLeads, setApiLeads] = useState<ExternalLead[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const loadLeads = () => {
        if (!dealerId) return;
        setLoading(true);
        fetchLeads(dealerId)
            .then(data => setApiLeads(data))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadLeads(); }, [dealerId]); // eslint-disable-line

    const handleMarkContacted = async (id: string) => {
        await updateLeadStatus(id, "contacted");
        setApiLeads(prev => prev.map(l => l.id === id ? { ...l, status: "contacted" as const } : l));
        toast.success("Lead updated");
    };

    const filteredLeads = apiLeads.filter(lead => {
        const matchesSearch =
            lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (lead.vehicle_interest ?? "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === "all" || lead.priority === filterPriority;
        const matchesStatus = filterStatus === "all" || lead.status === filterStatus;
        return matchesSearch && matchesPriority && matchesStatus;
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Leads</h1>
                    <p className="text-muted-foreground">Manage and follow up with customer inquiries</p>
                </div>
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
                    {dealerId && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={loadLeads}
                            disabled={loading}
                            title="Refresh leads"
                            className="text-muted-foreground"
                        >
                            {loading
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <RefreshCw className="w-4 h-4" />
                            }
                        </Button>
                    )}
                </div>
            </div>

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

            {/* Filters */}
            <Card variant="glass">
                <CardContent className="py-4">
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
            <Card variant="glass">
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
                        <div className="text-center py-16 text-muted-foreground">
                            <Inbox className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">
                                {isFiltered
                                    ? "No leads match your filters"
                                    : "No leads yet"}
                            </p>
                            <p className="text-sm mt-1">
                                {isFiltered
                                    ? "Try adjusting your search or filters"
                                    : "When customers submit enquiries from your website, they'll appear here."}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto -mx-4 sm:mx-0">
                                <div className="divide-y divide-border min-w-[600px]">
                                    {pagedLeads.map((lead) => {
                                        const pc = priorityConfig[lead.priority as keyof typeof priorityConfig] ?? priorityConfig.cold;
                                        const sc = statusConfig[lead.status] ?? statusConfig.new;
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
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-1">
                                                        {formatLeadType(lead.type)}
                                                        {lead.vehicle_interest ? ` · ${lead.vehicle_interest}` : ""}
                                                    </p>
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
                                                    <Button
                                                        variant={isDone ? "ghost" : "outline"}
                                                        size="sm"
                                                        className="text-xs"
                                                        onClick={() => !isDone && handleMarkContacted(lead.id)}
                                                        disabled={isDone}
                                                    >
                                                        <CheckCircle className={cn("w-3.5 h-3.5 mr-1", isDone && "text-green-600")} />
                                                        {lead.status === "converted" ? "Converted" : lead.status === "contacted" ? "Done" : "Mark Done"}
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
        </div>
    );
}

"use client"
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Search, Filter, Mail, Phone, MoreVertical, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { fetchLeads, updateLeadStatus, type ExternalLead } from "@/lib/db/leads";
import { useOnboardingStore } from "@/lib/store/onboarding-store";


export default function LeadsPage() {
    const { dealerId } = useOnboardingStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPriority, setFilterPriority] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [apiLeads, setApiLeads] = useState<ExternalLead[]>([]);
    const [loading, setLoading] = useState(false);

    const loadLeads = () => {
        if (!dealerId) return;
        setLoading(true);
        fetchLeads(dealerId)
            .then(data => setApiLeads(data))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadLeads(); }, [dealerId]); // eslint-disable-line

    const LEADS = apiLeads;

    const handleMarkContacted = async (id: string) => {
        await updateLeadStatus(id, "contacted");
        setApiLeads(prev => prev.map(l => l.id === id ? { ...l, status: "contacted" as const } : l));
    };

    const priorityColors = {
        hot: "bg-red-500/20 text-red-400 border-red-500/30",
        warm: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        cold: "bg-primary/20 text-blue-400 border-primary/30",
    };

    const statusColors = {
        new: "bg-green-500/20 text-green-400",
        contacted: "bg-primary/20 text-blue-400",
        qualified: "bg-purple-500/20 text-purple-400",
        converted: "bg-emerald-500/20 text-emerald-400",
        lost: "bg-gray-500/20 text-gray-400",
    };

    const filteredLeads = LEADS.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (lead.vehicle_interest ?? "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === "all" || lead.priority === filterPriority;
        const matchesStatus = filterStatus === "all" || lead.status === filterStatus;
        return matchesSearch && matchesPriority && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Leads</h1>
                    <p className="text-muted-foreground">Manage and follow up with customer inquiries</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{LEADS.length} total leads</span>
                    {dealerId && (
                        <button
                            onClick={loadLeads}
                            disabled={loading}
                            className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground disabled:opacity-50"
                            title="Refresh leads"
                        >
                            {loading
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <RefreshCw className="w-4 h-4" />
                            }
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <Card variant="glass">
                <CardContent className="py-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search leads..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            <Select value={filterPriority} onValueChange={setFilterPriority}>
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

                            <Select value={filterStatus} onValueChange={setFilterStatus}>
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
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Leads List */}
            <Card variant="glass">
                <CardContent className="p-0">
                    <div className="divide-y divide-border">
                        {filteredLeads.map((lead) => (
                            <div
                                key={lead.id}
                                className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
                            >
                                {/* Priority Badge */}
                                <div className={cn(
                                    "px-2 py-1 rounded-md text-xs font-bold border",
                                    priorityColors[lead.priority as keyof typeof priorityColors]
                                )}>
                                    {lead.priority.toUpperCase()}
                                </div>

                                {/* Lead Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold">{lead.name}</h3>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-xs",
                                            statusColors[lead.status as keyof typeof statusColors]
                                        )}>
                                            {lead.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        {lead.type.replace("_", " ")} • {lead.vehicle_interest}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Mail className="w-3 h-3" /> {lead.email}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Phone className="w-3 h-3" /> {lead.phone}
                                        </span>
                                    </div>
                                </div>

                                {/* Time */}
                                <div className="text-sm text-muted-foreground">
                                    {lead.created_at}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm">
                                        <Mail className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <Phone className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleMarkContacted(lead.id)}
                                        disabled={lead.status === "contacted"}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        {lead.status === "contacted" ? "Contacted" : "Mark Contacted"}
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Search, Plus, Car, CheckCircle, LayoutGrid, Building2, Loader2, Sparkles, RefreshCw } from "lucide-react";
import { fetchVehicles, deleteVehicle, type DBVehicle } from "@/lib/db/vehicles";
import { useOnboardingStore } from "@/lib/store/onboarding-store";

const STAT_CONFIG = [
    { label: "Total Stock",  icon: Car,        bg: "bg-primary/10",    text: "text-primary" },
    { label: "Active",       icon: CheckCircle, bg: "bg-green-500/10", text: "text-green-500" },
    { label: "Categories",   icon: LayoutGrid,  bg: "bg-violet-500/10",  text: "text-violet-500" },
    { label: "Brands",       icon: Building2,   bg: "bg-amber-500/10",   text: "text-amber-500" },
];

type ConditionTab = "all" | "new" | "used";

export default function InventoryPage() {
    const { dealerId, data } = useOnboardingStore();
    const isHybrid = data.sellsNewCars && data.sellsUsedCars;

    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [activeTab, setActiveTab] = useState<ConditionTab>("all");

    // DB vehicles (added by dealer via form)
    const [dbVehicles, setDbVehicles] = useState<DBVehicle[]>([]);
    const [loading, setLoading] = useState(false);

    const load = () => {
        if (!dealerId) return;
        setLoading(true);
        fetchVehicles(dealerId)
            .then(setDbVehicles)
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [dealerId]); // eslint-disable-line

    // ── Tab filtering ─────────────────────────────────────────
    const tabFiltered = dbVehicles.filter(v => {
        if (activeTab === "new") return v.condition === "new";
        if (activeTab === "used") return v.condition === "used" || v.condition === "certified_pre_owned";
        return true;
    });

    // ── Search + category filtering ───────────────────────────
    const filteredDB = tabFiltered.filter(v => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q);
        const matchesCategory = filterCategory === "all" || v.body_type === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = Array.from(new Set(tabFiltered.map(v => v.body_type).filter(Boolean)));

    // ── Stat values (always over full list) ──────────────────
    const newCount  = dbVehicles.filter(v => v.condition === "new").length;
    const usedCount = dbVehicles.filter(v => v.condition !== "new").length;
    const statValues = [
        dbVehicles.length,
        dbVehicles.filter(v => v.status === "available").length,
        Array.from(new Set(dbVehicles.map(v => v.body_type).filter(Boolean))).length,
        new Set(dbVehicles.map(v => v.make)).size,
    ];

    const handleDeleteDB = async (id: string) => {
        await deleteVehicle(id);
        setDbVehicles(prev => prev.filter(v => v.id !== id));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Vehicle Inventory</h1>
                    <p className="text-muted-foreground">
                        {isHybrid
                            ? "Manage your new and pre-owned stock"
                            : "Manage your dealership's stock"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {dealerId && (
                        <button
                            onClick={load}
                            disabled={loading}
                            className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground disabled:opacity-50"
                            title="Refresh"
                        >
                            {loading
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <RefreshCw className="w-4 h-4" />}
                        </button>
                    )}
                    <Link href="/dashboard/inventory/add">
                        <Button className="gap-2 bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4" />
                            Add Vehicle
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {STAT_CONFIG.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="mb-4">
                                <div className={`p-3 rounded-xl w-fit ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.text}`} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <p className="text-3xl font-bold">
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : statValues[index]}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Hybrid breakdown banner */}
            {isHybrid && !loading && dbVehicles.length > 0 && (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                    <Sparkles className="w-5 h-5 text-violet-500 shrink-0" />
                    <div className="flex items-center gap-6 flex-wrap text-sm">
                        <span className="font-medium text-foreground">Hybrid Stock Breakdown:</span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="font-semibold text-blue-600 dark:text-blue-400">{newCount}</span>
                            <span className="text-muted-foreground">New Cars</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="font-semibold text-amber-600 dark:text-amber-400">{usedCount}</span>
                            <span className="text-muted-foreground">Pre-Owned</span>
                        </span>
                    </div>
                </div>
            )}

            {/* Condition Tabs (hybrid only) */}
            {isHybrid && (
                <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl w-fit border border-border">
                    {(["all", "new", "used"] as ConditionTab[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                                activeTab === tab
                                    ? tab === "new"
                                        ? "bg-blue-500 text-white shadow-sm"
                                        : tab === "used"
                                            ? "bg-amber-500 text-white shadow-sm"
                                            : "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab === "all"  && `All (${dbVehicles.length})`}
                            {tab === "new"  && `New Cars (${newCount})`}
                            {tab === "used" && `Pre-Owned (${usedCount})`}
                        </button>
                    ))}
                </div>
            )}

            {/* Filters */}
            <Card variant="glass">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search make, model or variant..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat} value={cat as string}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Inventory Table */}
            {loading ? (
                <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Loading inventory…</span>
                </div>
            ) : dbVehicles.length === 0 ? (
                <Card variant="glass">
                    <CardContent className="py-16 text-center text-muted-foreground">
                        <Car className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No vehicles added yet</p>
                        <p className="text-sm mt-1">Click &quot;Add Vehicle&quot; to add your first listing</p>
                        {isHybrid && (
                            <p className="text-xs mt-2 text-violet-500">
                                Tip: Use the condition field to mark each vehicle as New or Used
                            </p>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <DBVehicleTable
                    vehicles={filteredDB}
                    onDelete={handleDeleteDB}
                    showCondition={isHybrid}
                />
            )}

            <p className="text-xs text-muted-foreground text-center">
                Showing {filteredDB.length} of {dbVehicles.length} vehicles
            </p>
        </div>
    );
}

// ── Lightweight table for DB vehicles ─────────────────────────
function DBVehicleTable({
    vehicles,
    onDelete,
    showCondition = false,
}: {
    vehicles: DBVehicle[];
    onDelete: (id: string) => void;
    showCondition?: boolean;
}) {
    const formatPrice = (paise: number) =>
        `₹${(paise / 100).toLocaleString("en-IN")}`;

    const conditionBadge = (condition: DBVehicle["condition"]) => {
        if (condition === "new") return { label: "New", cls: "bg-blue-500/10 text-blue-600 border-blue-500/20" };
        if (condition === "certified_pre_owned") return { label: "CPO", cls: "bg-violet-500/10 text-violet-600 border-violet-500/20" };
        return { label: "Used", cls: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
    };

    return (
        <div className="w-full overflow-auto rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                    <tr>
                        <th className="px-4 py-3">Vehicle</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Year</th>
                        <th className="px-4 py-3">Type</th>
                        {showCondition && <th className="px-4 py-3">Condition</th>}
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {vehicles.map(v => {
                        const badge = conditionBadge(v.condition);
                        return (
                            <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="font-semibold text-foreground">{v.make} {v.model}</div>
                                    {v.variant && <div className="text-xs text-muted-foreground">{v.variant}</div>}
                                </td>
                                <td className="px-4 py-3 font-medium text-foreground">
                                    {formatPrice(v.price_paise)}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">{v.year}</td>
                                <td className="px-4 py-3 text-muted-foreground">{v.body_type ?? "—"}</td>
                                {showCondition && (
                                    <td className="px-4 py-3">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                            badge.cls
                                        )}>
                                            {badge.label}
                                        </span>
                                    </td>
                                )}
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 capitalize">
                                        {v.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-3 text-xs text-destructive hover:bg-destructive/10"
                                        onClick={() => onDelete(v.id)}
                                    >
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                    {vehicles.length === 0 && (
                        <tr>
                            <td colSpan={showCondition ? 7 : 6} className="px-4 py-8 text-center text-muted-foreground">
                                No vehicles match your search.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

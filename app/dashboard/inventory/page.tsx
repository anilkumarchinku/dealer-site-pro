"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Search, Plus, Car, CheckCircle, LayoutGrid, Building2, Loader2, Sparkles, RefreshCw, Upload, ShieldCheck, AlertTriangle } from "lucide-react";
import { fetchVehicles, deleteVehicle, updateVehicleStatus, type DBVehicle } from "@/lib/db/vehicles";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import BulkUploadModal from "@/components/BulkUploadModal";
import { RCLookupWidget } from "@/components/dashboard/RCLookupWidget";
import { ApiUsageWidget } from "@/components/dashboard/ApiUsageWidget";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PremiumEmptyState, PremiumPageHeader } from "@/components/dashboard/premium-ui";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { Skeleton } from "@/components/ui/skeleton";
import { confirm } from "@/components/ui/confirm-dialog";
import { toast } from "@/lib/utils/toast";

const STAT_CONFIG = [
    { label: "Total Stock",  icon: Car,        bg: "bg-primary/10",    text: "text-primary" },
    { label: "Active",       icon: CheckCircle, bg: "bg-green-500/10", text: "text-green-500" },
    { label: "Categories",   icon: LayoutGrid,  bg: "bg-violet-500/10",  text: "text-violet-500" },
    { label: "Brands",       icon: Building2,   bg: "bg-amber-500/10",   text: "text-amber-500" },
];

type ConditionTab = "all" | "new" | "used";

function getInsuranceBadge(vehicle: DBVehicle) {
    const expiry = vehicle.insurance_valid_until ? new Date(`${vehicle.insurance_valid_until}T00:00:00`) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (expiry && expiry.getTime() < today.getTime()) {
        return { label: "Expired", cls: "bg-red-500/10 text-red-600 border-red-500/20", icon: AlertTriangle };
    }
    if (vehicle.insurance_status === "expired") {
        return { label: "Expired", cls: "bg-red-500/10 text-red-600 border-red-500/20", icon: AlertTriangle };
    }
    if (vehicle.insurance_status === "expiring_soon") {
        return { label: "Expiring Soon", cls: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: AlertTriangle };
    }
    if (vehicle.insurance_status === "active") {
        return { label: "Active", cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: ShieldCheck };
    }
    return { label: "Unknown", cls: "bg-muted text-muted-foreground border-border", icon: ShieldCheck };
}

export default function InventoryPage() {
    const { dealerId, data } = useOnboardingStore();
    const isHybrid      = data.sellsNewCars && data.sellsUsedCars;
    const isFirstHand   = data.sellsNewCars && !data.sellsUsedCars;
    const canAddVehicles = !isFirstHand; // 2nd hand + hybrid can add vehicles

    const [showBulkUpload, setShowBulkUpload] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [activeTab, setActiveTab] = useState<ConditionTab>("all");
    const [showDrafts, setShowDrafts] = useState(true);

    // DB vehicles (added by dealer via form)
    const PAGE_SIZE = 50;
    const [dbVehicles, setDbVehicles] = useState<DBVehicle[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const load = () => {
        if (!dealerId) return;
        setLoading(true);
        setPage(1);
        fetchVehicles(dealerId, 1, PAGE_SIZE)
            .then(({ vehicles, total }) => {
                setDbVehicles(vehicles);
                setTotal(total);
            })
            .finally(() => setLoading(false));
    };

    const loadMore = () => {
        if (!dealerId || loadingMore) return;
        const nextPage = page + 1;
        setLoadingMore(true);
        fetchVehicles(dealerId, nextPage, PAGE_SIZE)
            .then(({ vehicles, total }) => {
                // Append new page, de-duplicating by id in case of overlap
                setDbVehicles(prev => {
                    const seen = new Set(prev.map(v => v.id));
                    return [...prev, ...vehicles.filter(v => !seen.has(v.id))];
                });
                setTotal(total);
                setPage(nextPage);
            })
            .finally(() => setLoadingMore(false));
    };

    const hasMore = dbVehicles.length < total;

    useEffect(() => { load(); }, [dealerId]); // eslint-disable-line

    // ── Tab filtering ─────────────────────────────────────────
    const tabFiltered = dbVehicles.filter(v => {
        if (activeTab === "new") return v.condition === "new";
        if (activeTab === "used") return v.condition === "used" || v.condition === "certified_pre_owned";
        return true;
    });

    // ── Search + category + draft filtering ───────────────────────────
    const filteredDB = tabFiltered.filter(v => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
            v.make.toLowerCase().includes(q)
            || v.model.toLowerCase().includes(q)
            || (v.variant ?? "").toLowerCase().includes(q)
            || (v.registration_number ?? "").toLowerCase().includes(q);
        const matchesCategory = filterCategory === "all" || v.body_type === filterCategory;
        const matchesDraft = showDrafts || v.status !== "draft";
        return matchesSearch && matchesCategory && matchesDraft;
    });

    const categories = Array.from(new Set(tabFiltered.map(v => v.body_type).filter(Boolean)));

    // ── Stat values (always over full list) ──────────────────
    const newCount  = dbVehicles.filter(v => v.condition === "new").length;
    const usedCount = dbVehicles.filter(v => v.condition !== "new").length;
    const statValues = [
        total || dbVehicles.length,
        dbVehicles.filter(v => v.status === "available").length,
        Array.from(new Set(dbVehicles.map(v => v.body_type).filter(Boolean))).length,
        new Set(dbVehicles.map(v => v.make)).size,
    ];

    const handleDeleteDB = async (id: string) => {
        const vehicle = dbVehicles.find(v => v.id === id);
        const name = vehicle ? `${vehicle.make} ${vehicle.model}`.trim() : "this listing";
        const ok = await confirm({
            title: "Remove this listing?",
            description: `"${name}" will be removed from your public website. You can re-add it later, but it will no longer appear to customers.`,
            confirmText: "Remove listing",
            destructive: true,
        });
        if (!ok) return;

        const result = await deleteVehicle(id, dealerId ?? undefined);
        if (!result.success) {
            toast.error(result.error ?? "Couldn't remove the listing. Please try again.");
            return;
        }
        setDbVehicles(prev => prev.filter(v => v.id !== id));
        toast.success("Listing removed.");
    };

    const handleMarkSold = async (id: string) => {
        if (!dealerId) return;
        const result = await updateVehicleStatus(id, dealerId, "sold");
        if (!result.success) {
            toast.error(result.error ?? "Couldn't mark the vehicle as sold. Please try again.");
            return;
        }
        setDbVehicles(prev => prev.map(v => v.id === id ? { ...v, status: "sold" } : v));
        toast.success("Marked as sold.");
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Bulk Upload Modal */}
            {dealerId && (
                <BulkUploadModal
                    isOpen={showBulkUpload}
                    onClose={() => setShowBulkUpload(false)}
                    dealerId={dealerId}
                    onSuccess={(count) => { setShowBulkUpload(false); load(); }}
                />
            )}

            <PremiumPageHeader
                eyebrow="Catalog"
                title="Vehicle Inventory"
                description={isHybrid
                    ? "Manage new and pre-owned stock across your public website and dealer dashboard."
                    : "Manage dealership stock, listing status, insurance details, and buyer-ready catalog data."}
                actions={
                    <>
                    {dealerId && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={load}
                            disabled={loading}
                            title="Refresh"
                            className="rounded-xl text-muted-foreground"
                        >
                            {loading
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <RefreshCw className="w-4 h-4" />}
                        </Button>
                    )}
                    {canAddVehicles ? (
                        <>
                            <Button
                                variant="outline"
                                className="h-11 rounded-xl gap-2"
                                onClick={() => setShowBulkUpload(true)}
                            >
                                <Upload className="w-4 h-4" />
                                Bulk Upload
                            </Button>
                            <Link href="/dashboard/inventory/add">
                                <Button className="h-11 rounded-xl gap-2 bg-blue-600 hover:bg-blue-700">
                                    <Plus className="w-4 h-4" />
                                    Add Vehicle
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <Button disabled className="h-11 rounded-xl gap-2 opacity-40 cursor-not-allowed" title="Only hybrid & used-car dealers can add vehicles">
                            <Plus className="w-4 h-4" />
                            Add Vehicle
                        </Button>
                    )}
                    </>
                }
            >
                <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-bold text-muted-foreground">
                        {total} total
                    </span>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                        {dbVehicles.filter(v => v.status === "available").length} live
                    </span>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                        {dbVehicles.filter(v => v.status === "draft").length} drafts
                    </span>
                </div>
            </PremiumPageHeader>

            {/* RC Lookup & Usage Tracking */}
            {(data.sellsUsedCars || data.sellsNewCars) && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <RCLookupWidget />
                    </div>
                    <div>
                        <ApiUsageWidget />
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {STAT_CONFIG.map((stat, index) => (
                    <Reveal key={index} direction="up" delay={index * 80} className="h-full">
                        <Card className="stat-card hover-lift h-full rounded-2xl border-border/70 bg-card/90 p-0 shadow-sm transition-colors hover:border-blue-200 dark:bg-card/80 dark:hover:border-blue-500/30">
                            <CardContent className="p-5">
                                <div className="mb-5 flex items-center justify-between">
                                    <div className={`p-3 rounded-xl w-fit shadow-sm ${stat.bg}`}>
                                        <stat.icon className={`w-6 h-6 ${stat.text}`} />
                                    </div>
                                    <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                                        Stock
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    {loading ? (
                                        <Skeleton className="mt-1 h-8 w-16" />
                                    ) : (
                                        <p className="text-3xl font-black tracking-tight">
                                            <CountUp value={String(statValues[index])} />
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </Reveal>
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
            <Card variant="glass" className="rounded-2xl border-border/70 bg-card/90 p-0 shadow-sm dark:bg-card/80">
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

                        <Button
                            variant={showDrafts ? "default" : "outline"}
                            onClick={() => setShowDrafts(!showDrafts)}
                            className="gap-2"
                        >
                            {showDrafts ? "Hide Drafts" : "Show Drafts"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Inventory Table */}
            {loading ? (
                <div className="w-full overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 border-b border-border/50 p-4 last:border-0">
                            <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
                            <Skeleton className="h-4 flex-1" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                    ))}
                </div>
            ) : dbVehicles.length === 0 ? (
                <PremiumEmptyState
                    icon={Car}
                    title="No vehicles added yet"
                    description={isHybrid
                        ? "Add your first listing and use the condition field to mark each vehicle as new or used."
                        : "Add your first listing so customers can discover it on your dealer website."}
                    action={canAddVehicles && (
                        <Link href="/dashboard/inventory/add">
                            <Button className="rounded-xl bg-blue-600 hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Vehicle
                            </Button>
                        </Link>
                    )}
                />
            ) : (
                <DBVehicleTable
                    vehicles={filteredDB}
                    onDelete={handleDeleteDB}
                    onMarkSold={handleMarkSold}
                    showCondition={isHybrid}
                />
            )}

            {/* Load more */}
            {!loading && hasMore && (
                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="h-11 rounded-xl gap-2"
                    >
                        {loadingMore ? (
                            <><Loader2 className="w-4 h-4 animate-spin" />Loading...</>
                        ) : (
                            <>Load more ({total - dbVehicles.length} remaining)</>
                        )}
                    </Button>
                </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
                Showing {filteredDB.length} of {total || dbVehicles.length} vehicles
            </p>
        </div>
    );
}

// ── Lightweight table for DB vehicles ─────────────────────────
function DBVehicleTable({
    vehicles,
    onDelete,
    onMarkSold,
    showCondition = false,
}: {
    vehicles: DBVehicle[];
    onDelete: (id: string) => void;
    onMarkSold: (id: string) => void;
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
        <div className="w-full overflow-auto rounded-2xl border border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Insurance</TableHead>
                        {showCondition && <TableHead>Condition</TableHead>}
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vehicles.map((v, idx) => {
                        const badge = conditionBadge(v.condition);
                        const insuranceBadge = getInsuranceBadge(v);
                        const InsuranceIcon = insuranceBadge.icon;
                        return (
                            <TableRow key={v.id} className="animate-fade-in" style={{ animationDelay: `${(idx % 12) * 35}ms` }}>
                                <TableCell>
                                    <div className="font-semibold text-foreground">{v.make} {v.model}</div>
                                    {v.variant && <div className="text-xs text-muted-foreground">{v.variant}</div>}
                                    {v.registration_number && (
                                        <div className="mt-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                                            Plate {v.registration_number}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {formatPrice(v.price_paise)}
                                </TableCell>
                                <TableCell className="text-muted-foreground">{v.year}</TableCell>
                                <TableCell className="text-muted-foreground">{v.body_type ?? "—"}</TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <Badge className={cn("border text-xs gap-1", insuranceBadge.cls)} variant="outline">
                                            <InsuranceIcon className="h-3 w-3" />
                                            {insuranceBadge.label}
                                        </Badge>
                                        {v.insurance_valid_until && (
                                            <div className="text-[11px] text-muted-foreground">
                                                Until {new Date(v.insurance_valid_until).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                {showCondition && (
                                    <TableCell>
                                        <Badge className={cn("border text-xs", badge.cls)} variant="outline">
                                            {badge.label}
                                        </Badge>
                                    </TableCell>
                                )}
                                <TableCell>
                                    {v.status === "draft" ? (
                                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20" variant="outline">
                                            Draft (Incomplete)
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-green-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 capitalize" variant="outline">
                                            {v.status}
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        {v.status === "draft" ? (
                                            <>
                                                <Button asChild variant="ghost" size="sm" className="h-8 px-3 text-xs">
                                                    <Link href={`/dashboard/inventory/add?vehicleId=${v.id}`}>
                                                        Complete
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-3 text-xs text-destructive hover:bg-destructive/10"
                                                    onClick={() => onDelete(v.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button asChild variant="ghost" size="sm" className="h-8 px-3 text-xs">
                                                    <Link href={`/dashboard/inventory/${v.id}/edit`}>Edit</Link>
                                                </Button>
                                                {v.status !== "sold" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-3 text-xs"
                                                        onClick={() => onMarkSold(v.id)}
                                                    >
                                                        Sold
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-3 text-xs text-destructive hover:bg-destructive/10"
                                                    onClick={() => onDelete(v.id)}
                                                >
                                                    Remove
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {vehicles.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={showCondition ? 8 : 7} className="py-8 text-center text-muted-foreground">
                                No vehicles match your search.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Car, CheckCircle, LayoutGrid, Building2, Loader2 } from "lucide-react";
import { fetchVehicles, deleteVehicle, type DBVehicle } from "@/lib/db/vehicles";
import { useOnboardingStore } from "@/lib/store/onboarding-store";

const STAT_CONFIG = [
    { label: "Total Stock",  icon: Car,        bg: "bg-blue-500/10",    text: "text-blue-500" },
    { label: "Active",       icon: CheckCircle, bg: "bg-emerald-500/10", text: "text-emerald-500" },
    { label: "Categories",   icon: LayoutGrid,  bg: "bg-violet-500/10",  text: "text-violet-500" },
    { label: "Brands",       icon: Building2,   bg: "bg-amber-500/10",   text: "text-amber-500" },
];

export default function InventoryPage() {
    const { dealerId } = useOnboardingStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("all");

    // DB vehicles (added by dealer via form)
    const [dbVehicles, setDbVehicles] = useState<DBVehicle[]>([]);
    const [loading, setLoading] = useState(false);

    // Load from DB when configured + dealer exists
    useEffect(() => {
        if (!dealerId) return;
        setLoading(true);
        fetchVehicles(dealerId)
            .then(setDbVehicles)
            .finally(() => setLoading(false));
    }, [dealerId]);

    // ── Filtering ────────────────────────────────────────────
    const filteredDB = dbVehicles.filter(v => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q);
        const matchesCategory = filterCategory === "all" || v.body_type === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = Array.from(new Set(dbVehicles.map(v => v.body_type).filter(Boolean)));

    // ── Stat values ─────────────────────────────────────────
    const statValues = [
        dbVehicles.length,
        dbVehicles.filter(v => v.status === "available").length,
        categories.length,
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
                    <p className="text-muted-foreground">Manage your dealership's stock</p>
                </div>
                <Link href="/dashboard/inventory/add">
                    <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <Plus className="w-4 h-4" />
                        Add Vehicle
                    </Button>
                </Link>
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
                        <p className="text-sm mt-1">Click "Add Vehicle" to add your first listing</p>
                    </CardContent>
                </Card>
            ) : (
                <DBVehicleTable
                    vehicles={filteredDB}
                    onDelete={handleDeleteDB}
                />
            )}

            <p className="text-xs text-muted-foreground text-center">
                Showing {filteredDB.length} vehicles
            </p>
        </div>
    );
}

// ── Lightweight table for DB vehicles ─────────────────────────
function DBVehicleTable({
    vehicles,
    onDelete,
}: {
    vehicles: DBVehicle[];
    onDelete: (id: string) => void;
}) {
    const formatPrice = (paise: number) =>
        `₹${(paise / 100).toLocaleString("en-IN")}`;

    return (
        <div className="w-full overflow-auto rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                    <tr>
                        <th className="px-4 py-3">Vehicle</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Year</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {vehicles.map(v => (
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
                            <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 capitalize">
                                    {v.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-3 text-xs text-red-500 hover:bg-red-500/10"
                                    onClick={() => onDelete(v.id)}
                                >
                                    Remove
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {vehicles.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                No vehicles match your search.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

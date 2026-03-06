"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Search, RefreshCw, AlertCircle, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AuditModel = {
    type: string;
    brandId: string;
    originalBrand: string;
    model: string;
    slug: string;
    isMissing: boolean;
    imageUrl: string | null;
};

type AuditStats = {
    total: number;
    missing: number;
    present: number;
};

export default function InventoryAuditPage() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState<AuditStats | null>(null);
    const [models, setModels] = useState<AuditModel[]>([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterMissing, setFilterMissing] = useState<boolean | null>(null);
    const [filterType, setFilterType] = useState<string | null>(null);

    const fetchAudit = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        try {
            const res = await fetch('/api/admin/audit-images');
            const data = await res.json();
            if (data.models) {
                setStats(data.stats);
                setModels(data.models);
            }
        } catch (error) {
            console.error("Error fetching audit data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAudit();
    }, []);

    const filteredModels = models.filter(m => {
        const matchesSearch = (m.originalBrand + " " + m.model).toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMissing = filterMissing === null ? true : m.isMissing === filterMissing;
        const matchesType = filterType === null ? true : m.type === filterType;
        return matchesSearch && matchesMissing && matchesType;
    });

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500 font-medium">Scanning local directories for images...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Image Directory Audit</h1>
                    <p className="text-gray-500 mt-1">Monitor the local server storage and see which 2W/3W images are successfully synced.</p>
                </div>
                <Button
                    variant="outline"
                    className="gap-2 shrink-0 bg-white"
                    onClick={() => fetchAudit(true)}
                    disabled={refreshing}
                >
                    <RefreshCw className={cn("w-4 h-4 text-blue-600", refreshing && "animate-spin")} />
                    Refresh Scan
                </Button>
            </div>

            {/* Stats Overview */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100/50 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                <ImageIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-sm font-medium text-gray-500">Total Catalog Models</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-emerald-50 to-white border-emerald-100/50 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{stats.present}</p>
                                <p className="text-sm font-medium text-gray-500">Images Available</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-rose-50 to-white border-rose-100/50 shadow-sm relative overflow-hidden">
                        {stats.missing > 0 && <div className="absolute top-0 right-0 w-2 h-full bg-rose-500" />}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{stats.missing}</p>
                                <p className="text-sm font-medium text-gray-500">Images Missing</p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search model or brand..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-white"
                    />
                </div>
                <div className="flex gap-2 shrink-0">
                    <Button
                        variant={filterMissing === null ? "default" : "outline"}
                        onClick={() => setFilterMissing(null)}
                        className="bg-gray-900 text-white"
                    >
                        All Status
                    </Button>
                    <Button
                        variant={filterMissing === true ? "default" : "outline"}
                        onClick={() => setFilterMissing(true)}
                        className={cn(filterMissing === true && "bg-rose-600 hover:bg-rose-700 text-white")}
                    >
                        Missing
                    </Button>
                    <Button
                        variant={filterMissing === false ? "default" : "outline"}
                        onClick={() => setFilterMissing(false)}
                        className={cn(filterMissing === false && "bg-emerald-600 hover:bg-emerald-700 text-white")}
                    >
                        Available
                    </Button>
                </div>
                <div className="flex gap-2 shrink-0 border-l pl-4">
                    <Button
                        variant={filterType === "2w" ? "default" : "outline"}
                        onClick={() => setFilterType(filterType === "2w" ? null : "2w")}
                        className={cn(filterType === "2w" && "bg-blue-600 hover:bg-blue-700 text-white")}
                    >
                        2W Only
                    </Button>
                    <Button
                        variant={filterType === "3w" ? "default" : "outline"}
                        onClick={() => setFilterType(filterType === "3w" ? null : "3w")}
                        className={cn(filterType === "3w" && "bg-purple-600 hover:bg-purple-700 text-white")}
                    >
                        3W Only
                    </Button>
                </div>
            </div>

            {/* Grid */}
            {filteredModels.length === 0 ? (
                <div className="py-20 text-center border rounded-2xl border-dashed bg-gray-50">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No models found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredModels.map((model, idx) => (
                        <Card key={`${model.brandId}-${model.slug}-${idx}`} className={cn(
                            "overflow-hidden group hover:shadow-md transition-all shadow-sm",
                            model.isMissing ? "border-rose-100/50 bg-rose-50/10" : "bg-white border-gray-100"
                        )}>
                            <div className="relative aspect-video bg-gray-50/50 flex items-center justify-center p-2 border-b border-gray-100">
                                {model.isMissing ? (
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <XCircle className="w-8 h-8 text-rose-300" />
                                        <span className="text-xs font-medium uppercase tracking-wider text-rose-400">Missing Image</span>
                                    </div>
                                ) : (
                                    <img
                                        src={model.imageUrl!}
                                        alt={model.model}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                )}

                                {/* Badge Overlay */}
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-white/90 backdrop-blur shadow-sm uppercase font-bold tracking-wider text-gray-500">
                                        {model.type}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-3">
                                <p className="text-xs font-medium text-gray-500 mb-0.5 line-clamp-1">{model.originalBrand}</p>
                                <h4 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">{model.model}</h4>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

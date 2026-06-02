"use client"

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchVehicles, type DBVehicle } from "@/lib/db/vehicles";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { cn } from "@/lib/utils";

function insuranceState(vehicle: DBVehicle) {
    const expiry = vehicle.insurance_valid_until ? new Date(`${vehicle.insurance_valid_until}T00:00:00`) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = expiry ? Math.ceil((expiry.getTime() - today.getTime()) / 86400000) : null;

    if (days !== null && days < 0) return { label: "Expired", days, priority: 0, cls: "bg-red-500/10 text-red-600 border-red-500/20" };
    if (vehicle.insurance_status === "expired") return { label: "Expired", days, priority: 0, cls: "bg-red-500/10 text-red-600 border-red-500/20" };
    if ((days !== null && days <= 30) || vehicle.insurance_status === "expiring_soon") {
        return { label: "Expiring Soon", days, priority: 1, cls: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
    }
    if (vehicle.insurance_status === "active") return { label: "Active", days, priority: 2, cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" };
    return { label: "Unknown", days, priority: 3, cls: "bg-muted text-muted-foreground border-border" };
}

function formatDate(value?: string) {
    if (!value) return "Not recorded";
    return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function InsuranceDashboardPage() {
    const { dealerId } = useOnboardingStore();
    const [vehicles, setVehicles] = useState<DBVehicle[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!dealerId) return;
        setLoading(true);
        fetchVehicles(dealerId, 1, 200)
            .then(({ vehicles }) => setVehicles(vehicles))
            .finally(() => setLoading(false));
    }, [dealerId]);

    const rows = useMemo(() => {
        return vehicles
            .map(vehicle => ({ vehicle, state: insuranceState(vehicle) }))
            .filter(row => row.state.priority <= 1 || row.state.label === "Unknown")
            .sort((a, b) => a.state.priority - b.state.priority);
    }, [vehicles]);

    const expired = rows.filter(row => row.state.label === "Expired").length;
    const expiring = rows.filter(row => row.state.label === "Expiring Soon").length;
    const unknown = rows.filter(row => row.state.label === "Unknown").length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Insurance</h1>
                <p className="text-muted-foreground">Review expired, expiring, and unchecked policy status for 4W listings.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-5">
                        <AlertTriangle className="mb-3 h-5 w-5 text-red-600" />
                        <p className="text-sm text-muted-foreground">Expired</p>
                        <p className="text-3xl font-bold">{expired}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-5">
                        <AlertTriangle className="mb-3 h-5 w-5 text-amber-600" />
                        <p className="text-sm text-muted-foreground">Expiring Soon</p>
                        <p className="text-3xl font-bold">{expiring}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-5">
                        <ShieldCheck className="mb-3 h-5 w-5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Unchecked</p>
                        <p className="text-3xl font-bold">{unknown}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listings Requiring Insurance Review</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Loading insurance status...
                        </div>
                    ) : (
                        <div className="overflow-auto rounded-xl border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Vehicle</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Insurer</TableHead>
                                        <TableHead>Valid Until</TableHead>
                                        <TableHead>Quote Link</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rows.map(({ vehicle, state }) => (
                                        <TableRow key={vehicle.id}>
                                            <TableCell>
                                                <div className="font-semibold">{vehicle.make} {vehicle.model}</div>
                                                <div className="text-xs text-muted-foreground">{vehicle.year}{vehicle.variant ? ` · ${vehicle.variant}` : ""}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn("border", state.cls)}>{state.label}</Badge>
                                            </TableCell>
                                            <TableCell>{vehicle.insurance_provider || "Not recorded"}</TableCell>
                                            <TableCell>
                                                <div>{formatDate(vehicle.insurance_valid_until)}</div>
                                                {state.days !== null && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {state.days < 0 ? `${Math.abs(state.days)} days overdue` : `${state.days} days left`}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {vehicle.insurance_quote_url ? (
                                                    <Button asChild variant="outline" size="sm" className="gap-1.5">
                                                        <a href={vehicle.insurance_quote_url} target="_blank" rel="noreferrer">
                                                            Open <ExternalLink className="h-3.5 w-3.5" />
                                                        </a>
                                                    </Button>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">Not set</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {rows.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                                                No expired or unchecked insurance listings.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    <div className="mt-4">
                        <Button asChild variant="outline">
                            <Link href="/dashboard/inventory/add">Add insurance details on a new listing</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

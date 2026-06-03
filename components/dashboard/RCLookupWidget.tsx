/**
 * RCLookupWidget
 * Dealer dashboard widget to look up vehicle RC history.
 * Used when evaluating a used car for purchase.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, AlertCircle, CheckCircle2, Car, FileText, Shield, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface ChallanData {
    challan_number?: string;
    offense_details?: string;
    challan_place?: string | null;
    challan_date?: string;
    state?: string;
    amount?: number | string;
    challan_status?: string | null;
    court_challan?: boolean | null;
}

interface RCData {
    rc_number: string;
    owner_name?: string;
    registration_date?: string;
    vehicle_class?: string;
    fuel_type?: string;
    make_model?: string;
    engine_number?: string;
    chassis_number?: string;
    color?: string;
    insurance_upto?: string;
    insurance_company?: string;
    insurance_policy_number?: string;
    insurance_policy_type?: string;
    fitness_upto?: string;
    rc_validity_upto?: string;
    owner_count?: number;
    challan_count?: number;
    challan_status?: string;
    state?: string;
    rto?: string;
    blacklisted?: boolean;
    noc_details?: string;
    challans?: ChallanData[];
    _demo?: boolean;
    _cache?: 'redis' | 'memory';
}

function InfoRow({ label, value, highlight }: { label: string; value?: string; highlight?: boolean }) {
    if (!value) return null;
    return (
        <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
            <span className="text-xs text-gray-500">{label}</span>
            <span className={`text-xs font-semibold text-right max-w-[60%] ${highlight ? 'text-red-600' : 'text-gray-900'}`}>{value}</span>
        </div>
    );
}

export function RCLookupWidget() {
    const router = useRouter();
    const [rc, setRc] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
    const [data, setData] = useState<RCData | null>(null);
    const [error, setError] = useState('');
    const [showChallans, setShowChallans] = useState(false);
    const [isAddingToInventory, setIsAddingToInventory] = useState(false);
    const [addToInventorySuccess, setAddToInventorySuccess] = useState(false);

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setData(null);
        setShowChallans(false);
        setAddToInventorySuccess(false);
        setStatus('loading');
        try {
            const res = await fetch('/api/vehicles/rc-lookup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rc }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error ?? 'Lookup failed');
            setData({ ...json.data, _cache: json.data?._cache ?? (json.cached ? 'redis' : undefined) });
            setStatus('done');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lookup failed');
            setStatus('error');
        }
    };

    const handleAddToInventory = async () => {
        if (!data) return;

        setIsAddingToInventory(true);
        setError('');

        try {
            const res = await fetch('/api/vehicles/create-draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rcData: data }),
            });

            const json = await res.json();

            if (!res.ok) {
                // Handle duplicate error specially
                if (res.status === 409 && json.vehicleId) {
                    throw new Error('This vehicle is already in your inventory');
                }
                throw new Error(json.error ?? 'Failed to add to inventory');
            }

            setAddToInventorySuccess(true);

            // Redirect to Add Vehicle form with the draft ID after 1 second
            setTimeout(() => {
                router.push(`/dashboard/inventory/add?vehicleId=${json.vehicleId}`);
            }, 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add to inventory');
        } finally {
            setIsAddingToInventory(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                        <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <CardTitle>RC / Vehicle History Lookup</CardTitle>
                        <CardDescription>Check registration details before buying a used car</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Input */}
                <form onSubmit={handleLookup} className="flex gap-2">
                    <input
                        type="text"
                        value={rc}
                        onChange={e => setRc(e.target.value.toUpperCase())}
                        placeholder="e.g. MH01AB1234"
                        maxLength={12}
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 placeholder:text-gray-400 uppercase"
                    />
                    <Button type="submit" disabled={status === 'loading' || !rc.trim()} className="gap-1.5">
                        {status === 'loading'
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Search className="w-4 h-4" />
                        }
                        Lookup
                    </Button>
                </form>

                {/* Error */}
                {status === 'error' && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl p-3">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}

                {/* Results */}
                {data && status === 'done' && (
                    <div className="space-y-4">
                        {data._demo && (
                            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                Demo data - configure Surepass env vars for live results
                            </div>
                        )}

                        {data._cache && (
                            <div className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                Served from 24-hour RC lookup cache
                            </div>
                        )}

                        {/* Status banner */}
                        <div className={`flex items-center gap-2 rounded-xl p-3 ${data.blacklisted ? 'bg-red-50 border border-red-200' : 'bg-emerald-50 border border-emerald-200'}`}>
                            {data.blacklisted
                                ? <><AlertCircle className="w-5 h-5 text-red-600" /><span className="text-sm font-semibold text-red-700">Vehicle is BLACKLISTED — do not purchase</span></>
                                : <><CheckCircle2 className="w-5 h-5 text-emerald-600" /><span className="text-sm font-semibold text-emerald-700">Vehicle is clear — not blacklisted</span></>
                            }
                        </div>

                        {/* Add to Inventory button */}
                        {addToInventorySuccess ? (
                            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                Draft created! Redirecting to complete details...
                            </div>
                        ) : (
                            <Button
                                onClick={handleAddToInventory}
                                disabled={isAddingToInventory || data.blacklisted}
                                className={`w-full gap-2 ${data.blacklisted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                variant={data.blacklisted ? 'destructive' : 'default'}
                            >
                                {isAddingToInventory ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Adding to Inventory...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        {data.blacklisted ? 'Cannot Add Blacklisted Vehicle' : 'Add to Inventory'}
                                    </>
                                )}
                            </Button>
                        )}

                        {/* Vehicle info */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Car className="w-4 h-4 text-gray-400" />
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Vehicle</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                                    <InfoRow label="RC Number"       value={data.rc_number} />
                                    <InfoRow label="Make & Model"    value={data.make_model} />
                                    <InfoRow label="Vehicle Class"   value={data.vehicle_class} />
                                    <InfoRow label="Fuel Type"       value={data.fuel_type} />
                                    <InfoRow label="Color"           value={data.color} />
                                    <InfoRow label="State / RTO"     value={data.rto ? `${data.rto}, ${data.state ?? ''}` : data.state} />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="w-4 h-4 text-gray-400" />
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Registration & Insurance</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                                    <InfoRow label="Owner Name"      value={data.owner_name} />
                                    <InfoRow label="Registration Date" value={data.registration_date} />
                                    <InfoRow label="Owner Count" value={data.owner_count ? String(data.owner_count) : undefined} />
                                    <InfoRow label="Insurance Valid Upto" value={data.insurance_upto} />
                                    <InfoRow label="Insurer" value={data.insurance_company} />
                                    <InfoRow label="Policy Number" value={data.insurance_policy_number} />
                                    <InfoRow label="Policy Type" value={data.insurance_policy_type} />
                                    <InfoRow label="Fitness Valid Upto" value={data.fitness_upto} />
                                    <InfoRow label="RC Validity" value={data.rc_validity_upto} />
                                    <InfoRow label="e-Challan" value={data.challan_status ?? (data.challan_count != null ? `${data.challan_count} pending challan(s)` : undefined)} highlight={(data.challan_count ?? 0) > 0} />
                                    <InfoRow label="NOC Details"     value={data.noc_details} />
                                    <InfoRow label="Engine No."      value={data.engine_number} />
                                    <InfoRow label="Chassis No."     value={data.chassis_number} />
                                </div>
                            </div>
                        </div>

                        {data.challan_status && (
                            <div className="rounded-xl border border-gray-200 bg-white p-3">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Challan Check</p>
                                        <p className={`text-sm font-semibold ${(data.challan_count ?? 0) > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                                            {data.challan_status}
                                        </p>
                                    </div>
                                    {data.challans && data.challans.length > 0 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowChallans(prev => !prev)}
                                        >
                                            {showChallans ? 'Hide Challan Details' : 'Check Details'}
                                        </Button>
                                    )}
                                </div>

                                {showChallans && data.challans && data.challans.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {data.challans.map((challan, index) => (
                                            <div key={`${challan.challan_number ?? index}`} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Challan No.</p>
                                                        <p className="text-sm font-semibold text-gray-900">{challan.challan_number ?? `Record ${index + 1}`}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500">Amount</p>
                                                        <p className="text-sm font-semibold text-gray-900">{challan.amount ? `Rs ${challan.amount}` : 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 grid gap-2 text-xs text-gray-600 sm:grid-cols-2">
                                                    <p><span className="font-medium text-gray-800">Status:</span> {challan.challan_status ?? 'Pending'}</p>
                                                    <p><span className="font-medium text-gray-800">Date:</span> {challan.challan_date ?? 'N/A'}</p>
                                                    <p><span className="font-medium text-gray-800">State:</span> {challan.state ?? 'N/A'}</p>
                                                    <p><span className="font-medium text-gray-800">Court:</span> {challan.court_challan ? 'Yes' : 'No'}</p>
                                                </div>
                                                {challan.offense_details && (
                                                    <p className="mt-2 text-xs text-gray-700">{challan.offense_details}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

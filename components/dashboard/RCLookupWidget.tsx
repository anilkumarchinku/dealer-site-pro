/**
 * RCLookupWidget
 * Dealer dashboard widget to look up vehicle RC history.
 * Used when evaluating a used car for purchase.
 */

'use client';

import { useState } from 'react';
import { Search, AlertCircle, CheckCircle2, Car, FileText, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

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
    fitness_upto?: string;
    state?: string;
    rto?: string;
    blacklisted?: boolean;
    noc_details?: string;
    _demo?: boolean;
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
    const [rc, setRc] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
    const [data, setData] = useState<RCData | null>(null);
    const [error, setError] = useState('');

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setData(null);
        setStatus('loading');
        try {
            const res = await fetch('/api/vehicles/rc-lookup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rc }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error ?? 'Lookup failed');
            setData(json.data);
            setStatus('done');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lookup failed');
            setStatus('error');
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
                                Demo data — configure RAPIDOR_API_KEY for live results
                            </div>
                        )}

                        {/* Status banner */}
                        <div className={`flex items-center gap-2 rounded-xl p-3 ${data.blacklisted ? 'bg-red-50 border border-red-200' : 'bg-emerald-50 border border-emerald-200'}`}>
                            {data.blacklisted
                                ? <><AlertCircle className="w-5 h-5 text-red-600" /><span className="text-sm font-semibold text-red-700">Vehicle is BLACKLISTED — do not purchase</span></>
                                : <><CheckCircle2 className="w-5 h-5 text-emerald-600" /><span className="text-sm font-semibold text-emerald-700">Vehicle is clear — not blacklisted</span></>
                            }
                        </div>

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
                                    <InfoRow label="Insurance Valid Upto" value={data.insurance_upto} />
                                    <InfoRow label="Fitness Valid Upto" value={data.fitness_upto} />
                                    <InfoRow label="NOC Details"     value={data.noc_details} />
                                    <InfoRow label="Engine No."      value={data.engine_number} />
                                    <InfoRow label="Chassis No."     value={data.chassis_number} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

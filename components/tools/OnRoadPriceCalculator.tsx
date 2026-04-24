/**
 * On-Road Price Calculator
 * Shared 4W estimator using the same state engine as the car detail popup.
 */

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, MapPin, Calculator, Info, Car, FileText, Shield, Percent, CreditCard } from 'lucide-react';
import {
    calculateCarOnRoadPrice,
    formatInr,
    INDIAN_STATE_OPTIONS,
    type IndianStateCode,
} from '@/lib/utils/on-road-price';

export function OnRoadPriceCalculator() {
    const [exShowroom, setExShowroom] = useState(1000000);
    const [fuelType, setFuelType] = useState('Petrol');
    const [engineCc, setEngineCc] = useState(1197);
    const [stateCode, setStateCode] = useState<IndianStateCode>('DL');
    const [financed, setFinanced] = useState(false);

    const breakdown = useMemo(() => calculateCarOnRoadPrice({
        exShowroom,
        fuelType,
        engineCc: fuelType === 'Electric' ? null : engineCc,
        stateCode,
        financed,
    }), [engineCc, exShowroom, financed, fuelType, stateCode]);

    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-foreground font-medium">On-Road Price Calculator</span>
                </nav>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <MapPin className="w-8 h-8 text-primary" />
                        On-Road Price Calculator
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-3xl">
                        Estimate the purchase-time price of a new car by adding state road tax, registration fees,
                        insurance, FASTag, TCS and optional hypothecation above the ex-showroom price.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] gap-6">
                    <Card>
                        <CardContent className="p-6 space-y-5">
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Ex-Showroom Price (₹)</Label>
                                <Input
                                    type="number"
                                    value={exShowroom}
                                    onChange={(e) => setExShowroom(Math.max(0, Number(e.target.value) || 0))}
                                    min={100000}
                                    max={100000000}
                                    step={50000}
                                />
                                <p className="text-xs text-muted-foreground mt-1">{formatInr(exShowroom)}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium mb-2 block">State</Label>
                                <Select value={stateCode} onValueChange={(value) => setStateCode(value as IndianStateCode)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-80">
                                        {INDIAN_STATE_OPTIONS.map((state) => (
                                            <SelectItem key={state.code} value={state.code}>{state.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-sm font-medium mb-2 block">Fuel Type</Label>
                                <Select value={fuelType} onValueChange={setFuelType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'].map((option) => (
                                            <SelectItem key={option} value={option}>{option}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {fuelType !== 'Electric' && (
                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Engine Displacement (cc)</Label>
                                    <Input
                                        type="number"
                                        value={engineCc}
                                        onChange={(e) => setEngineCc(Math.max(0, Number(e.target.value) || 0))}
                                        min={0}
                                        max={7000}
                                        step={100}
                                    />
                                </div>
                            )}

                            <div className="flex items-start gap-3 rounded-xl border border-border p-4">
                                <Checkbox
                                    id="tool-financed"
                                    checked={financed}
                                    onCheckedChange={(checked) => setFinanced(Boolean(checked))}
                                    className="mt-0.5"
                                />
                                <div>
                                    <Label htmlFor="tool-financed" className="text-sm font-medium cursor-pointer">Vehicle financed</Label>
                                    <p className="text-xs text-muted-foreground mt-1">Adds hypothecation charges.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{breakdown.stateName}</p>
                                        <h3 className="text-xl font-semibold">Estimated On-Road Price</h3>
                                    </div>
                                    <div className="rounded-2xl bg-primary/10 px-5 py-4 text-right">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Total payable</p>
                                        <p className="text-3xl font-bold text-primary">{formatInr(breakdown.total)}</p>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    {[
                                        ['Ex-showroom price', breakdown.exShowroom],
                                        [`Road tax / registration (${breakdown.roadTaxPercent}%)`, breakdown.roadTax],
                                        ['Registration fee', breakdown.registrationFee],
                                        ['Smart card fee', breakdown.smartCardFee],
                                        ['HSRP / number plate', breakdown.hsrpFee],
                                        ['FASTag', breakdown.fastagFee],
                                        ['Insurance', breakdown.insurance],
                                        ...(breakdown.tcs > 0 ? [['TCS (1%)', breakdown.tcs] as const] : []),
                                        ...(breakdown.hypothecationFee > 0 ? [['Hypothecation', breakdown.hypothecationFee] as const] : []),
                                    ].map(([label, amount]) => (
                                        <div key={label} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{label}</span>
                                            <span className="font-medium">{formatInr(Number(amount))}</span>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="my-4" />

                                <div className="flex justify-between">
                                    <span className="font-semibold">On-Road Price</span>
                                    <span className="text-lg font-bold text-primary">{formatInr(breakdown.total)}</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-4">
                                    * Insurance is estimated unless exact catalog insurance exists. Final payable amount can vary by insurer,
                                    dealer discount, city-level levy and accessories.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                                    <Info className="w-4 h-4 text-primary" />
                                    What gets added above ex-showroom price?
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                            <Car className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground mb-1">Road Tax / RTO</p>
                                            <p>State-dependent lifetime tax added at the time of registration.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                            <FileText className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground mb-1">Registration & HSRP</p>
                                            <p>Registration fee, smart card and number plate charges paid during registration.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                                            <Shield className="w-4 h-4 text-purple-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground mb-1">Insurance</p>
                                            <p>Comprehensive insurance plus the mandatory third-party component for a new purchase.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                                            <Percent className="w-4 h-4 text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground mb-1">TCS & Finance Fees</p>
                                            <p>TCS applies above ₹10 lakh, and hypothecation is added when the car is financed.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                                    <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                                        <CreditCard className="w-4 h-4" />
                                        Data availability check
                                    </div>
                                    <p>
                                        The project already has ex-showroom price, fuel type and engine data for cars. It does not store live
                                        insurer quotes or dealer-specific extras, so those are estimated or left out of the calculator.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

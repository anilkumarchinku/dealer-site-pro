/**
 * Insurance Estimator Tool
 * Estimate car insurance premium for third-party and comprehensive plans
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ChevronRight, Shield, ShieldCheck, Info, Check, Star } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => String(CURRENT_YEAR - i));
const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];

const CITIES = [
    { name: 'Delhi', zone: 'A' },
    { name: 'Mumbai', zone: 'A' },
    { name: 'Bangalore', zone: 'A' },
    { name: 'Hyderabad', zone: 'A' },
    { name: 'Chennai', zone: 'A' },
    { name: 'Kolkata', zone: 'A' },
    { name: 'Pune', zone: 'A' },
    { name: 'Ahmedabad', zone: 'B' },
    { name: 'Jaipur', zone: 'B' },
    { name: 'Lucknow', zone: 'B' },
];

const CC_RANGES = [
    { label: 'Up to 1000cc', value: '1000', tpPremium: 2094 },
    { label: '1001 - 1500cc', value: '1500', tpPremium: 3416 },
    { label: '1501 - 2000cc', value: '2000', tpPremium: 7897 },
    { label: 'Above 2000cc', value: '3000', tpPremium: 7897 },
    { label: 'Electric Vehicle', value: 'ev', tpPremium: 2094 },
];

function toIN(n: number) {
    return Math.round(n).toLocaleString('en-IN');
}

function calculatePremium(
    carValue: number,
    yearOfPurchase: number,
    ccRange: string,
    city: string,
    fuelType: string,
    hasNcb: boolean,
    ncbPercent: number,
) {
    const age = CURRENT_YEAR - yearOfPurchase;
    const ccData = CC_RANGES.find(c => c.value === ccRange) || CC_RANGES[1];
    const cityData = CITIES.find(c => c.name === city);
    const zoneMultiplier = cityData?.zone === 'A' ? 1.0 : 0.92;

    // Depreciation on IDV (Insured Declared Value)
    const depreciationRates: Record<number, number> = {
        0: 0, 1: 0.15, 2: 0.20, 3: 0.30, 4: 0.40, 5: 0.50,
    };
    const depRate = age >= 5 ? 0.50 : depreciationRates[age] || 0;
    const idv = Math.round(carValue * (1 - depRate));

    // Third Party Premium (fixed by IRDAI)
    const tpPremium = ccData.tpPremium;

    // Own Damage Premium
    const odBaseRate = fuelType === 'Electric' ? 0.018 : fuelType === 'Diesel' ? 0.032 : 0.028;
    let odPremium = Math.round(idv * odBaseRate * zoneMultiplier);

    // NCB discount on OD
    if (hasNcb) {
        odPremium = Math.round(odPremium * (1 - ncbPercent / 100));
    }

    // PA cover (mandatory)
    const paCover = 1100;

    // Add-ons for comprehensive
    const roadAssist = 500;
    const engineProtect = Math.round(idv * 0.003);
    const zeroDepreciation = Math.round(idv * 0.008);
    const returnToInvoice = Math.round(idv * 0.004);

    const comprehensiveBase = odPremium + tpPremium + paCover;
    const comprehensiveWithAddons = comprehensiveBase + roadAssist + engineProtect + zeroDepreciation + returnToInvoice;

    // GST 18%
    const tpTotal = Math.round((tpPremium + paCover) * 1.18);
    const compBaseTotal = Math.round(comprehensiveBase * 1.18);
    const compFullTotal = Math.round(comprehensiveWithAddons * 1.18);

    return {
        idv,
        tpPremium: tpTotal,
        comprehensiveBase: compBaseTotal,
        comprehensiveFull: compFullTotal,
        breakdown: {
            odPremium,
            tpPremium,
            paCover,
            roadAssist,
            engineProtect,
            zeroDepreciation,
            returnToInvoice,
            gst: Math.round(comprehensiveWithAddons * 0.18),
        },
    };
}

export function InsuranceEstimator() {
    const [carValue, setCarValue] = useState(800000);
    const [yearOfPurchase, setYearOfPurchase] = useState(String(CURRENT_YEAR));
    const [ccRange, setCcRange] = useState('1500');
    const [city, setCity] = useState('Delhi');
    const [fuelType, setFuelType] = useState('Petrol');
    const [hasNcb, setHasNcb] = useState(false);
    const [ncbPercent, setNcbPercent] = useState(20);
    const [showResult, setShowResult] = useState(false);

    const result = useMemo(() => {
        return calculatePremium(carValue, Number(yearOfPurchase), ccRange, city, fuelType, hasNcb, ncbPercent);
    }, [carValue, yearOfPurchase, ccRange, city, fuelType, hasNcb, ncbPercent]);

    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-foreground font-medium">Insurance Estimator</span>
                </nav>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Shield className="w-8 h-8 text-primary" />
                        Car Insurance Estimator
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl">
                        Get an estimated premium for your car insurance. Compare third-party and comprehensive plans.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input Form */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Car Value (Ex-Showroom ₹)</Label>
                                <Input
                                    type="number"
                                    value={carValue}
                                    onChange={(e) => setCarValue(Number(e.target.value))}
                                    min={100000} max={50000000} step={50000}
                                />
                                <p className="text-xs text-muted-foreground mt-1">₹{toIN(carValue)}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Year of Purchase</Label>
                                    <Select value={yearOfPurchase} onValueChange={setYearOfPurchase}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {YEARS.map((y) => (
                                                <SelectItem key={y} value={y}>{y}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Fuel Type</Label>
                                    <Select value={fuelType} onValueChange={setFuelType}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {FUEL_TYPES.map((f) => (
                                                <SelectItem key={f} value={f}>{f}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium mb-2 block">Engine Capacity</Label>
                                <Select value={ccRange} onValueChange={setCcRange}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {CC_RANGES.map((cc) => (
                                            <SelectItem key={cc.value} value={cc.value}>{cc.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-sm font-medium mb-2 block">City</Label>
                                <Select value={city} onValueChange={setCity}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {CITIES.map((c) => (
                                            <SelectItem key={c.name} value={c.name}>{c.name} (Zone {c.zone})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="ncb"
                                    checked={hasNcb}
                                    onChange={(e) => setHasNcb(e.target.checked)}
                                    className="w-4 h-4 rounded border-border"
                                />
                                <div className="flex-1">
                                    <Label htmlFor="ncb" className="text-sm font-medium cursor-pointer">I have No Claim Bonus (NCB)</Label>
                                    <p className="text-xs text-muted-foreground">Discount for claim-free years</p>
                                </div>
                                {hasNcb && (
                                    <Select value={String(ncbPercent)} onValueChange={(v) => setNcbPercent(Number(v))}>
                                        <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {[20, 25, 35, 45, 50].map((p) => (
                                                <SelectItem key={p} value={String(p)}>{p}%</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>

                            <Button className="w-full" size="lg" onClick={() => setShowResult(true)}>
                                Estimate Premium
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Results */}
                    <div className="space-y-4">
                        {showResult ? (
                            <>
                                {/* IDV */}
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Insured Declared Value (IDV)</p>
                                                <p className="text-lg font-bold">₹{toIN(result.idv)}</p>
                                            </div>
                                            <Badge variant="outline">Your car&apos;s insured value</Badge>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Plan Comparison */}
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Third Party */}
                                    <Card>
                                        <CardContent className="p-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-base font-semibold flex items-center gap-2">
                                                        <Shield className="w-4 h-4 text-blue-500" />
                                                        Third-Party Only
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground mt-0.5">Mandatory by law</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-blue-600">₹{toIN(result.tpPremium)}</p>
                                                    <p className="text-[10px] text-muted-foreground">incl. GST</p>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-600" /> Covers damage to others</div>
                                                <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-600" /> Personal accident cover</div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Comprehensive Basic */}
                                    <Card className="border-primary/30">
                                        <CardContent className="p-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-base font-semibold flex items-center gap-2">
                                                        <ShieldCheck className="w-4 h-4 text-primary" />
                                                        Comprehensive
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground mt-0.5">Recommended for most buyers</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-primary">₹{toIN(result.comprehensiveBase)}</p>
                                                    <p className="text-[10px] text-muted-foreground">incl. GST</p>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-600" /> Everything in Third-Party</div>
                                                <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-600" /> Own damage protection</div>
                                                <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-600" /> Theft coverage</div>
                                                <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-600" /> Natural disaster coverage</div>
                                            </div>
                                            <Badge variant="secondary" className="mt-3 text-[10px]">
                                                <Star className="w-3 h-3 mr-1" /> Most Popular
                                            </Badge>
                                        </CardContent>
                                    </Card>

                                    {/* Comprehensive + Add-ons */}
                                    <Card>
                                        <CardContent className="p-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-base font-semibold flex items-center gap-2">
                                                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                                        Comprehensive + Add-ons
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground mt-0.5">Maximum protection</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-emerald-600">₹{toIN(result.comprehensiveFull)}</p>
                                                    <p className="text-[10px] text-muted-foreground">incl. GST</p>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-600" /> Everything in Comprehensive</div>
                                                <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-600" /> Zero Depreciation</div>
                                                <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-600" /> Engine Protection</div>
                                                <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-600" /> Roadside Assistance</div>
                                                <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-600" /> Return to Invoice</div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Detailed Breakdown */}
                                <Card>
                                    <CardContent className="p-5">
                                        <h4 className="text-sm font-semibold mb-3">Premium Breakdown (Comprehensive + Add-ons)</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Own Damage Premium</span>
                                                <span className="font-medium">₹{toIN(result.breakdown.odPremium)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Third-Party Premium</span>
                                                <span className="font-medium">₹{toIN(result.breakdown.tpPremium)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">PA Cover</span>
                                                <span className="font-medium">₹{toIN(result.breakdown.paCover)}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Zero Depreciation</span>
                                                <span className="font-medium">₹{toIN(result.breakdown.zeroDepreciation)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Engine Protection</span>
                                                <span className="font-medium">₹{toIN(result.breakdown.engineProtect)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Roadside Assistance</span>
                                                <span className="font-medium">₹{toIN(result.breakdown.roadAssist)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Return to Invoice</span>
                                                <span className="font-medium">₹{toIN(result.breakdown.returnToInvoice)}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">GST (18%)</span>
                                                <span className="font-medium">₹{toIN(result.breakdown.gst)}</span>
                                            </div>
                                            <div className="flex justify-between font-semibold">
                                                <span>Total Premium</span>
                                                <span className="text-primary">₹{toIN(result.comprehensiveFull)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <Card className="h-full flex items-center justify-center">
                                <CardContent className="text-center p-8">
                                    <Shield className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-base font-semibold mb-2">Get Your Estimate</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                        Fill in your car details and click &quot;Estimate Premium&quot; to see insurance options.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <Card className="mt-8">
                    <CardContent className="p-6">
                        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                            <Info className="w-4 h-4 text-blue-500" />
                            Understanding Car Insurance
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                                <p className="font-medium text-foreground mb-1">Third-Party Insurance</p>
                                <p>Mandatory by law. Covers damage caused to other people, vehicles, or property in an accident. Does not cover damage to your own car.</p>
                            </div>
                            <div>
                                <p className="font-medium text-foreground mb-1">Comprehensive Insurance</p>
                                <p>Covers everything in third-party plus damage to your own vehicle from accidents, theft, natural disasters, fire, and vandalism.</p>
                            </div>
                            <div>
                                <p className="font-medium text-foreground mb-1">IDV (Insured Declared Value)</p>
                                <p>The maximum amount your insurer will pay if your car is stolen or totally damaged. It decreases each year due to depreciation.</p>
                            </div>
                            <div>
                                <p className="font-medium text-foreground mb-1">No Claim Bonus (NCB)</p>
                                <p>A discount on your premium for every claim-free year. Starts at 20% and can go up to 50% after 5 consecutive claim-free years.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

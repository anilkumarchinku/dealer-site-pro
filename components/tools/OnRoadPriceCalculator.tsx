/**
 * On-Road Price Calculator
 * Breaks down ex-showroom + RTO + insurance + other charges
 */

'use client';

import { useState, useMemo } from 'react';
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
import { ChevronRight, MapPin, Calculator, Info } from 'lucide-react';

const CITIES = [
    { name: 'Delhi', rtoPercent: 4.0, insuranceMultiplier: 1.0 },
    { name: 'Mumbai', rtoPercent: 7.0, insuranceMultiplier: 1.05 },
    { name: 'Bangalore', rtoPercent: 5.5, insuranceMultiplier: 1.02 },
    { name: 'Hyderabad', rtoPercent: 5.0, insuranceMultiplier: 1.01 },
    { name: 'Chennai', rtoPercent: 6.0, insuranceMultiplier: 1.03 },
    { name: 'Kolkata', rtoPercent: 5.0, insuranceMultiplier: 0.98 },
    { name: 'Pune', rtoPercent: 6.5, insuranceMultiplier: 1.02 },
    { name: 'Ahmedabad', rtoPercent: 5.0, insuranceMultiplier: 0.97 },
    { name: 'Jaipur', rtoPercent: 4.5, insuranceMultiplier: 0.96 },
    { name: 'Lucknow', rtoPercent: 4.5, insuranceMultiplier: 0.95 },
];

function toIN(n: number) {
    return Math.round(n).toLocaleString('en-IN');
}

export function OnRoadPriceCalculator() {
    const [exShowroom, setExShowroom] = useState(1000000);
    const [city, setCity] = useState('Delhi');

    const cityData = CITIES.find(c => c.name === city) || CITIES[0];

    const breakdown = useMemo(() => {
        const rto = Math.round(exShowroom * (cityData.rtoPercent / 100));
        const baseInsurance = Math.round(exShowroom * 0.028 * cityData.insuranceMultiplier);
        const tcs = exShowroom > 1000000 ? Math.round(exShowroom * 0.01) : 0;
        const fastag = 500;
        const hypothecation = 1500;
        const total = exShowroom + rto + baseInsurance + tcs + fastag + hypothecation;

        return {
            exShowroom,
            rto,
            insurance: baseInsurance,
            tcs,
            fastag,
            hypothecation,
            total,
        };
    }, [exShowroom, cityData]);

    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    <p className="text-muted-foreground mt-2 max-w-2xl">
                        Calculate the complete on-road price of your car including registration, insurance, and other charges.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Inputs */}
                    <Card>
                        <CardContent className="p-6 space-y-5">
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Ex-Showroom Price (₹)</Label>
                                <Input
                                    type="number"
                                    value={exShowroom}
                                    onChange={(e) => setExShowroom(Number(e.target.value))}
                                    min={100000}
                                    max={50000000}
                                    step={50000}
                                />
                                <p className="text-xs text-muted-foreground mt-1">₹{toIN(exShowroom)}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium mb-2 block">City</Label>
                                <Select value={city} onValueChange={setCity}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CITIES.map((c) => (
                                            <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">
                                    RTO: {cityData.rtoPercent}% for {city}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Breakdown */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-base font-semibold mb-4">Price Breakdown — {city}</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Ex-Showroom Price</span>
                                    <span className="font-medium">₹{toIN(breakdown.exShowroom)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">RTO Registration ({cityData.rtoPercent}%)</span>
                                    <span className="font-medium">₹{toIN(breakdown.rto)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Insurance (Comprehensive)</span>
                                    <span className="font-medium">₹{toIN(breakdown.insurance)}</span>
                                </div>
                                {breakdown.tcs > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">TCS (1%)</span>
                                        <span className="font-medium">₹{toIN(breakdown.tcs)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">FASTag</span>
                                    <span className="font-medium">₹{toIN(breakdown.fastag)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Hypothecation Charges</span>
                                    <span className="font-medium">₹{toIN(breakdown.hypothecation)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="font-semibold">On-Road Price</span>
                                    <span className="text-lg font-bold text-primary">₹{toIN(breakdown.total)}</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-4">
                                * Indicative pricing. Actual charges may vary based on vehicle type, engine size, and dealer offers.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Info */}
                <Card className="mt-8">
                    <CardContent className="p-6">
                        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                            <Info className="w-4 h-4 text-blue-500" />
                            What is included in On-Road Price?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                                <p className="font-medium text-foreground mb-1">Ex-Showroom Price</p>
                                <p>Base price of the vehicle set by the manufacturer, excluding taxes and registration.</p>
                            </div>
                            <div>
                                <p className="font-medium text-foreground mb-1">RTO Registration</p>
                                <p>One-time registration charges paid to Regional Transport Office. Varies by state (3-12%).</p>
                            </div>
                            <div>
                                <p className="font-medium text-foreground mb-1">Insurance</p>
                                <p>Mandatory comprehensive motor insurance for the first year. Includes third-party liability cover.</p>
                            </div>
                            <div>
                                <p className="font-medium text-foreground mb-1">TCS (Tax Collected at Source)</p>
                                <p>1% tax applicable on vehicles priced above ₹10 lakh, collected by the dealer on behalf of the government.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

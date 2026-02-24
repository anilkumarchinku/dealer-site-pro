/**
 * Car Valuation Tool
 * Enter car details to get an estimated resale value
 */

'use client';

import { useState } from 'react';
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
import { ChevronRight, Car, TrendingDown, TrendingUp, Calculator, Info, Calendar, Gauge, Users } from 'lucide-react';
import { CAR_MAKES } from '@/lib/data/cars';

const BODY_TYPES = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Compact SUV', 'Luxury'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const OWNERS = ['1st', '2nd', '3rd', '4th+'];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 15 }, (_, i) => String(CURRENT_YEAR - i));

function toIN(n: number) {
    return Math.round(n).toLocaleString('en-IN');
}

interface ValuationResult {
    estimatedLow: number;
    estimatedHigh: number;
    depreciation: number;
    condition: 'Excellent' | 'Good' | 'Fair';
}

function calculateValuation(
    originalPrice: number,
    year: number,
    kmDriven: number,
    owners: string,
    fuelType: string,
): ValuationResult | null {
    if (!originalPrice || originalPrice <= 0) return null;

    const age = CURRENT_YEAR - year;
    if (age < 0) return null;

    // Base depreciation curve (% of value retained)
    const baseRetention = Math.max(0.15, 1 - (age * 0.08) - (age > 5 ? (age - 5) * 0.04 : 0));

    // KM driven adjustment (penalize high mileage)
    const expectedKm = age * 12000;
    const kmRatio = kmDriven / Math.max(expectedKm, 1);
    const kmAdjustment = kmRatio > 1.5 ? -0.08 : kmRatio < 0.7 ? 0.05 : 0;

    // Owner adjustment
    const ownerAdjustment = owners === '1st' ? 0.03 : owners === '2nd' ? 0 : owners === '3rd' ? -0.05 : -0.10;

    // Fuel type adjustment (diesel/electric hold value better)
    const fuelAdjustment = fuelType === 'Diesel' ? 0.03 : fuelType === 'Electric' ? 0.05 : fuelType === 'CNG' ? -0.02 : 0;

    const totalRetention = Math.max(0.10, Math.min(0.95, baseRetention + kmAdjustment + ownerAdjustment + fuelAdjustment));

    const estimatedMid = originalPrice * totalRetention;
    const estimatedLow = Math.round(estimatedMid * 0.90);
    const estimatedHigh = Math.round(estimatedMid * 1.10);
    const depreciation = Math.round((1 - totalRetention) * 100);

    const condition: 'Excellent' | 'Good' | 'Fair' =
        totalRetention > 0.65 ? 'Excellent' : totalRetention > 0.45 ? 'Good' : 'Fair';

    return { estimatedLow, estimatedHigh, depreciation, condition };
}

export function CarValuationTool() {
    const [brand, setBrand] = useState('');
    const [year, setYear] = useState(String(CURRENT_YEAR - 3));
    const [fuelType, setFuelType] = useState('Petrol');
    const [originalPrice, setOriginalPrice] = useState(800000);
    const [kmDriven, setKmDriven] = useState(35000);
    const [owners, setOwners] = useState('1st');
    const [result, setResult] = useState<ValuationResult | null>(null);
    const [showResult, setShowResult] = useState(false);

    const handleCalculate = () => {
        const val = calculateValuation(originalPrice, Number(year), kmDriven, owners, fuelType);
        setResult(val);
        setShowResult(true);
    };

    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-foreground font-medium">Car Valuation</span>
                </nav>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Car className="w-8 h-8 text-primary" />
                        Used Car Valuation
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl">
                        Get an instant estimate of your car's current market value. Enter your car details below.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input Form */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Brand</Label>
                                <Select value={brand} onValueChange={setBrand}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select brand" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CAR_MAKES.map((make) => (
                                            <SelectItem key={make} value={make}>{make}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Year</Label>
                                    <Select value={year} onValueChange={setYear}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
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
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {FUEL_TYPES.map((f) => (
                                                <SelectItem key={f} value={f}>{f}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium mb-2 block">Original Purchase Price (₹)</Label>
                                <Input
                                    type="number"
                                    value={originalPrice}
                                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                                    min={100000}
                                    max={50000000}
                                    step={50000}
                                />
                                <p className="text-xs text-muted-foreground mt-1">₹{toIN(originalPrice)}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium mb-2 block">Kilometers Driven</Label>
                                <Input
                                    type="number"
                                    value={kmDriven}
                                    onChange={(e) => setKmDriven(Number(e.target.value))}
                                    min={0}
                                    max={500000}
                                    step={1000}
                                />
                                <p className="text-xs text-muted-foreground mt-1">{toIN(kmDriven)} km</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium mb-2 block">Number of Owners</Label>
                                <Select value={owners} onValueChange={setOwners}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {OWNERS.map((o) => (
                                            <SelectItem key={o} value={o}>{o} Owner</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button className="w-full" size="lg" onClick={handleCalculate}>
                                <Calculator className="w-4 h-4 mr-2" />
                                Get Valuation
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Result */}
                    <div>
                        {showResult && result ? (
                            <Card className="h-full">
                                <CardContent className="p-6 flex flex-col h-full">
                                    <h3 className="text-base font-semibold mb-1">Estimated Market Value</h3>
                                    <p className="text-xs text-muted-foreground mb-4">
                                        {brand || 'Your car'} • {year} • {toIN(kmDriven)} km • {owners} owner
                                    </p>

                                    {/* Price Range */}
                                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 text-center mb-6">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Estimated Value Range</p>
                                        <div className="flex items-center justify-center gap-3">
                                            <span className="text-2xl font-bold">₹{toIN(result.estimatedLow)}</span>
                                            <span className="text-muted-foreground">—</span>
                                            <span className="text-2xl font-bold text-primary">₹{toIN(result.estimatedHigh)}</span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="p-3 bg-muted/30 rounded-lg text-center">
                                            <p className="text-xs text-muted-foreground">Depreciation</p>
                                            <p className="text-lg font-bold flex items-center justify-center gap-1">
                                                <TrendingDown className="w-4 h-4 text-red-500 dark:text-red-400" />
                                                {result.depreciation}%
                                            </p>
                                        </div>
                                        <div className="p-3 bg-muted/30 rounded-lg text-center">
                                            <p className="text-xs text-muted-foreground">Condition</p>
                                            <div className="mt-1">
                                                <Badge variant={
                                                    result.condition === 'Excellent' ? 'default' :
                                                    result.condition === 'Good' ? 'secondary' : 'outline'
                                                }>
                                                    {result.condition}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="my-3" />

                                    {/* Tips */}
                                    <div className="space-y-2 flex-1">
                                        <p className="text-xs font-semibold">Factors affecting value:</p>
                                        <ul className="text-xs text-muted-foreground space-y-1">
                                            <li>• Service history and maintenance records</li>
                                            <li>• Accident history and body condition</li>
                                            <li>• Tyre and brake condition</li>
                                            <li>• Insurance claim history</li>
                                            <li>• City of registration (metro vs non-metro)</li>
                                        </ul>
                                    </div>

                                    <p className="text-[10px] text-muted-foreground mt-3">
                                        * This is an estimated range based on market trends. Actual selling price may vary based on vehicle condition, location, and demand.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="h-full flex items-center justify-center">
                                <CardContent className="text-center p-8">
                                    <Car className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-base font-semibold mb-2">Enter Car Details</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                        Fill in your car details on the left and click "Get Valuation" to see an estimated market value.
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
                            How Car Valuation Works
                        </h2>
                        <div className="text-sm text-muted-foreground space-y-2">
                            <p>
                                Our valuation algorithm considers the following factors to estimate your car's current market value:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                <div className="p-3 bg-muted/30 rounded-lg flex gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground text-xs mb-1">Age Depreciation</p>
                                        <p className="text-xs">Cars lose ~8% value per year for the first 5 years, then ~4% per year after.</p>
                                    </div>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-lg flex gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <Gauge className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground text-xs mb-1">Mileage Impact</p>
                                        <p className="text-xs">Higher-than-average mileage reduces value, while low mileage adds a premium.</p>
                                    </div>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-lg flex gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                                        <Users className="w-4 h-4 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground text-xs mb-1">Ownership History</p>
                                        <p className="text-xs">Single-owner cars retain more value. Each additional owner reduces the estimated price.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

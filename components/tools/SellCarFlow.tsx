/**
 * Sell Car Flow — 3-step wizard
 * Step 1: Car Details + Instant Valuation
 * Step 2: Schedule Inspection
 * Step 3: Get Offer Summary
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
import {
    ChevronRight,
    Car,
    Calendar,
    IndianRupee,
    Check,
    MapPin,
    Phone,
    Clock,
    ShieldCheck,
    Banknote,
    ArrowRight,
    ArrowLeft,
    Sparkles,
} from 'lucide-react';
import { CAR_MAKES } from '@/lib/data/cars';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 15 }, (_, i) => String(CURRENT_YEAR - i));
const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const OWNERS = ['1st', '2nd', '3rd', '4th+'];
const TIME_SLOTS = ['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM'];

const CITIES = [
    'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
];

function toIN(n: number) {
    return Math.round(n).toLocaleString('en-IN');
}

function estimateValue(originalPrice: number, year: number, kmDriven: number, owners: string, fuelType: string) {
    const age = CURRENT_YEAR - year;
    const baseRetention = Math.max(0.15, 1 - (age * 0.08) - (age > 5 ? (age - 5) * 0.04 : 0));
    const expectedKm = age * 12000;
    const kmRatio = kmDriven / Math.max(expectedKm, 1);
    const kmAdj = kmRatio > 1.5 ? -0.08 : kmRatio < 0.7 ? 0.05 : 0;
    const ownerAdj = owners === '1st' ? 0.03 : owners === '2nd' ? 0 : owners === '3rd' ? -0.05 : -0.10;
    const fuelAdj = fuelType === 'Diesel' ? 0.03 : fuelType === 'Electric' ? 0.05 : fuelType === 'CNG' ? -0.02 : 0;
    const retention = Math.max(0.10, Math.min(0.95, baseRetention + kmAdj + ownerAdj + fuelAdj));
    const mid = originalPrice * retention;
    return { low: Math.round(mid * 0.90), high: Math.round(mid * 1.10), mid: Math.round(mid) };
}

export function SellCarFlow() {
    const [step, setStep] = useState(1);

    // Step 1: Car Details
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState(String(CURRENT_YEAR - 3));
    const [fuelType, setFuelType] = useState('Petrol');
    const [originalPrice, setOriginalPrice] = useState(800000);
    const [kmDriven, setKmDriven] = useState(35000);
    const [owners, setOwners] = useState('1st');

    // Step 2: Schedule
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhone] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');

    const valuation = estimateValue(originalPrice, Number(year), kmDriven, owners, fuelType);

    // Generate next 7 dates
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return {
            value: d.toISOString().split('T')[0],
            label: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
        };
    });

    const canProceedStep1 = brand && year && originalPrice > 0 && kmDriven >= 0;
    const canProceedStep2 = city && address && phoneNumber && selectedDate && selectedSlot;

    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-foreground font-medium">Sell Your Car</span>
                </nav>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Banknote className="w-8 h-8 text-primary" />
                        Sell Your Car
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl">
                        Get the best price for your car in 3 simple steps. Free inspection at your doorstep.
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-0 mb-8">
                    {[
                        { num: 1, label: 'Car Details', icon: Car },
                        { num: 2, label: 'Schedule Inspection', icon: Calendar },
                        { num: 3, label: 'Get Offer', icon: IndianRupee },
                    ].map((s, i) => (
                        <div key={s.num} className="flex items-center flex-1">
                            <div className="flex items-center gap-2 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                                    step > s.num ? 'bg-primary text-primary-foreground' :
                                    step === s.num ? 'bg-primary text-primary-foreground' :
                                    'bg-muted text-muted-foreground'
                                }`}>
                                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                                </div>
                                <span className={`text-sm font-medium hidden sm:block ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {s.label}
                                </span>
                            </div>
                            {i < 2 && (
                                <div className={`h-0.5 flex-1 mx-2 ${step > s.num ? 'bg-primary' : 'bg-muted'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* ── Step 1: Car Details ── */}
                {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <h3 className="text-base font-semibold">Enter Car Details</h3>

                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Brand</Label>
                                    <Select value={brand} onValueChange={setBrand}>
                                        <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                                        <SelectContent>
                                            {CAR_MAKES.map((m) => (
                                                <SelectItem key={m} value={m}>{m}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Model Name</Label>
                                    <Input
                                        placeholder="e.g. Swift, Creta, Nexon"
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">Year</Label>
                                        <Select value={year} onValueChange={setYear}>
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
                                    <Label className="text-sm font-medium mb-2 block">Original Purchase Price (₹)</Label>
                                    <Input
                                        type="number"
                                        value={originalPrice}
                                        onChange={(e) => setOriginalPrice(Number(e.target.value))}
                                        min={100000} max={50000000} step={50000}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">₹{toIN(originalPrice)}</p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Kilometers Driven</Label>
                                    <Input
                                        type="number"
                                        value={kmDriven}
                                        onChange={(e) => setKmDriven(Number(e.target.value))}
                                        min={0} max={500000} step={1000}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">{toIN(kmDriven)} km</p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Number of Owners</Label>
                                    <Select value={owners} onValueChange={setOwners}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {OWNERS.map((o) => (
                                                <SelectItem key={o} value={o}>{o} Owner</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Instant Valuation Preview */}
                        <div className="space-y-4">
                            <Card className="border-primary/20 bg-primary/5">
                                <CardContent className="p-6 text-center">
                                    <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                                    <h3 className="text-base font-semibold mb-1">Instant Valuation</h3>
                                    <p className="text-xs text-muted-foreground mb-4">
                                        {brand || 'Your car'} {model} • {year} • {toIN(kmDriven)} km
                                    </p>
                                    <div className="bg-background rounded-xl p-5 mb-4">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Estimated Value</p>
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-2xl font-bold">₹{toIN(valuation.low)}</span>
                                            <span className="text-muted-foreground">—</span>
                                            <span className="text-2xl font-bold text-primary">₹{toIN(valuation.high)}</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">
                                        * Final offer may vary after physical inspection
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-5">
                                    <h4 className="text-sm font-semibold mb-3">Why sell with us?</h4>
                                    <div className="space-y-3">
                                        {[
                                            { icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />, text: 'Free doorstep inspection' },
                                            { icon: <Banknote className="w-4 h-4 text-blue-600" />, text: 'Best price guarantee' },
                                            { icon: <Clock className="w-4 h-4 text-amber-600" />, text: 'Payment within 24 hours' },
                                            { icon: <Car className="w-4 h-4 text-purple-600" />, text: 'Free RC transfer assistance' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2.5 text-sm">
                                                {item.icon}
                                                <span className="text-muted-foreground">{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Button
                                className="w-full"
                                size="lg"
                                disabled={!canProceedStep1}
                                onClick={() => setStep(2)}
                            >
                                Get Best Price
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* ── Step 2: Schedule Inspection ── */}
                {step === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <h3 className="text-base font-semibold">Schedule Free Inspection</h3>

                                <div>
                                    <Label className="text-sm font-medium mb-2 block">City</Label>
                                    <Select value={city} onValueChange={setCity}>
                                        <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                                        <SelectContent>
                                            {CITIES.map((c) => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Pickup Address</Label>
                                    <Input
                                        placeholder="Enter your full address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Phone Number</Label>
                                    <Input
                                        type="tel"
                                        placeholder="Enter your mobile number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhone(e.target.value)}
                                        maxLength={10}
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-3 block">Select Date</Label>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                        {dates.map((d) => (
                                            <button
                                                key={d.value}
                                                onClick={() => setSelectedDate(d.value)}
                                                className={`p-2.5 rounded-lg border text-center text-xs font-medium transition-all ${
                                                    selectedDate === d.value
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-border hover:border-primary/50'
                                                }`}
                                            >
                                                {d.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-3 block">Select Time Slot</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {TIME_SLOTS.map((slot) => (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`p-2.5 rounded-lg border text-center text-xs font-medium transition-all ${
                                                    selectedSlot === slot
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-border hover:border-primary/50'
                                                }`}
                                            >
                                                <Clock className="w-3 h-3 inline mr-1" />
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Summary Sidebar */}
                        <div className="space-y-4">
                            <Card>
                                <CardContent className="p-5">
                                    <h4 className="text-sm font-semibold mb-3">Your Car</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Brand</span>
                                            <span className="font-medium">{brand}</span>
                                        </div>
                                        {model && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Model</span>
                                                <span className="font-medium">{model}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Year</span>
                                            <span className="font-medium">{year}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">KM Driven</span>
                                            <span className="font-medium">{toIN(kmDriven)} km</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Estimated Value</span>
                                            <span className="font-bold text-primary">₹{toIN(valuation.mid)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                                </Button>
                                <Button
                                    className="flex-1"
                                    disabled={!canProceedStep2}
                                    onClick={() => setStep(3)}
                                >
                                    Confirm <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Step 3: Offer Summary ── */}
                {step === 3 && (
                    <div className="max-w-lg mx-auto">
                        <Card className="border-primary/20">
                            <CardContent className="p-8 text-center">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-8 h-8 text-emerald-600" />
                                </div>

                                <h2 className="text-2xl font-bold mb-2">Inspection Scheduled!</h2>
                                <p className="text-muted-foreground mb-6">
                                    Our expert will visit you for a free car inspection.
                                </p>

                                <Card className="bg-muted/30 mb-6">
                                    <CardContent className="p-5 text-left space-y-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Car className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Car:</span>
                                            <span className="font-medium">{brand} {model} ({year})</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Location:</span>
                                            <span className="font-medium">{city}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Date:</span>
                                            <span className="font-medium">{selectedDate && new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Time:</span>
                                            <span className="font-medium">{selectedSlot}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Phone:</span>
                                            <span className="font-medium">{phoneNumber}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold">Estimated Offer</span>
                                            <span className="text-lg font-bold text-primary">₹{toIN(valuation.low)} - ₹{toIN(valuation.high)}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="space-y-3 text-left mb-6">
                                    <h4 className="text-sm font-semibold">What happens next?</h4>
                                    <div className="space-y-2.5">
                                        {[
                                            'Our expert will inspect your car at the scheduled time',
                                            'You will receive a final offer within 30 minutes of inspection',
                                            'Accept the offer and get paid within 24 hours',
                                            'We handle all paperwork including RC transfer',
                                        ].map((text, i) => (
                                            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                                    {i + 1}
                                                </div>
                                                {text}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                                        Sell Another Car
                                    </Button>
                                    <Link href="/cars" className="flex-1">
                                        <Button className="w-full">Browse Cars</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

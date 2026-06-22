/**
 * Sell Car Flow - public seller intake for used-car dealers.
 */

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
    Loader2,
    AlertCircle,
    FileText,
} from 'lucide-react';
import { CAR_MAKES } from '@/lib/data/cars-static';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 20 }, (_, i) => String(CURRENT_YEAR - i));
const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const TRANSMISSIONS = ['Manual', 'Automatic', 'AMT', 'CVT', 'DCT'];
const BODY_TYPES = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Crossover', 'Coupe', 'Convertible', 'Pickup', 'Van', 'Wagon'];
const OWNERS = ['1st', '2nd', '3rd', '4th+'];
const TIME_SLOTS = ['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM'];
const INSURANCE_STATUSES = [
    { value: 'unknown', label: 'Not sure' },
    { value: 'active', label: 'Active' },
    { value: 'expiring_soon', label: 'Expiring soon' },
    { value: 'expired', label: 'Expired' },
] as const;
const ACCIDENT_HISTORY = [
    { value: 'unknown', label: 'Not sure' },
    { value: 'none', label: 'No accident' },
    { value: 'minor', label: 'Minor repairs' },
    { value: 'major', label: 'Major accident' },
] as const;
const FEATURE_OPTIONS = [
    'Airbags',
    'ABS',
    'Alloy Wheels',
    'Backup Camera',
    'Bluetooth',
    'Cruise Control',
    'Leather Seats',
    'Navigation System',
    'Parking Sensors',
    'Sunroof',
    'Apple CarPlay',
    'Android Auto',
];

const CITIES = [
    'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
];

type SellCarFlowProps = {
    initialDealerId?: string | null;
    dealerName?: string | null;
    returnHref?: string;
    browseHref?: string;
};

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

function parseLinks(value: string) {
    return value
        .split(/\r?\n|,/)
        .map(link => link.trim())
        .filter(Boolean);
}

export function SellCarFlow({
    initialDealerId,
    dealerName,
    returnHref = '/',
    browseHref = '/cars',
}: SellCarFlowProps = {}) {
    const searchParams = useSearchParams();
    const dealerId = initialDealerId ?? searchParams.get('dealerId');
    const [step, setStep] = useState(1);

    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [variant, setVariant] = useState('');
    const [year, setYear] = useState(String(CURRENT_YEAR - 3));
    const [bodyType, setBodyType] = useState('SUV');
    const [color, setColor] = useState('');
    const [fuelType, setFuelType] = useState('Petrol');
    const [transmission, setTransmission] = useState('Manual');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [vin, setVin] = useState('');
    const [originalPrice, setOriginalPrice] = useState(800000);
    const [expectedPrice, setExpectedPrice] = useState(0);
    const [kmDriven, setKmDriven] = useState(35000);
    const [owners, setOwners] = useState('1st');
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    const [sellerName, setSellerName] = useState('');
    const [phoneNumber, setPhone] = useState('');
    const [sellerEmail, setSellerEmail] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [insuranceStatus, setInsuranceStatus] = useState<'unknown' | 'active' | 'expired' | 'expiring_soon'>('unknown');
    const [insuranceProvider, setInsuranceProvider] = useState('');
    const [insuranceValidUntil, setInsuranceValidUntil] = useState('');
    const [insuranceQuoteUrl, setInsuranceQuoteUrl] = useState('');
    const [accidentHistory, setAccidentHistory] = useState<'unknown' | 'none' | 'minor' | 'major'>('unknown');
    const [floodDamage, setFloodDamage] = useState(false);
    const [serviceHistoryAvailable, setServiceHistoryAvailable] = useState(false);
    const [rcAvailable, setRcAvailable] = useState(true);
    const [loanActive, setLoanActive] = useState(false);
    const [photoLinks, setPhotoLinks] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');
    const [submitError, setSubmitError] = useState('');
    const [requestId, setRequestId] = useState('');

    const valuation = estimateValue(originalPrice, Number(year), kmDriven, owners, fuelType);
    const sellerExpectedPrice = expectedPrice > 0 ? expectedPrice : valuation.mid;
    const photoUrls = useMemo(() => parseLinks(photoLinks).slice(0, 12), [photoLinks]);
    const pageTitle = dealerName ? `Sell your car to ${dealerName}` : 'Sell Your Car';

    const dates = useMemo(() => Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return {
            value: d.toISOString().split('T')[0],
            label: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
        };
    }), []);

    const canProceedStep1 = Boolean(brand && model && year && originalPrice > 0 && kmDriven >= 0);
    const canProceedStep2 = Boolean(sellerName && phoneNumber.length === 10 && city && address && selectedDate && selectedSlot);

    const toggleFeature = (feature: string) => {
        setSelectedFeatures(prev => prev.includes(feature)
            ? prev.filter(item => item !== feature)
            : [...prev, feature]);
    };

    const submitSellRequest = async () => {
        if (!canProceedStep2 || submitStatus === 'submitting') return;

        setSubmitStatus('submitting');
        setSubmitError('');

        const res = await fetch('/api/sell-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dealer_id: dealerId,
                seller_name: sellerName,
                seller_phone: phoneNumber,
                seller_email: sellerEmail,
                make: brand,
                model,
                variant,
                year: Number(year),
                body_type: bodyType,
                color,
                fuel_type: fuelType,
                transmission,
                registration_number: registrationNumber,
                vin,
                mileage_km: kmDriven,
                owner_count: owners,
                expected_price_paise: Math.round(sellerExpectedPrice * 100),
                features: selectedFeatures,
                city,
                address,
                preferred_date: selectedDate,
                preferred_slot: selectedSlot,
                estimated_low_paise: Math.round(valuation.low * 100),
                estimated_high_paise: Math.round(valuation.high * 100),
                photo_urls: photoUrls,
                insurance_status: insuranceStatus,
                insurance_provider: insuranceProvider,
                insurance_valid_until: insuranceValidUntil,
                insurance_quote_url: insuranceQuoteUrl,
                video_url: videoUrl,
                accident_history: accidentHistory,
                flood_damage: floodDamage,
                service_history_available: serviceHistoryAvailable,
                rc_available: rcAvailable,
                loan_active: loanActive,
                notes,
            }),
        });

        const data = await res.json().catch(() => null);
        if (!res.ok) {
            setSubmitStatus('error');
            setSubmitError(data?.error ?? 'Could not submit your request. Please try again.');
            return;
        }

        setRequestId(data.requestId ?? '');
        setSubmitStatus('submitted');
        setStep(3);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Link href={returnHref} className="transition-colors hover:text-foreground">Home</Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">Sell Your Car</span>
                </nav>

                <div className="mb-8">
                    <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
                        <Banknote className="h-8 w-8 text-primary" />
                        {pageTitle}
                    </h1>
                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        Submit your car details for dealer review, inspection, and offline offer confirmation.
                    </p>
                </div>

                <div className="mb-8 flex items-center gap-0">
                    {[
                        { num: 1, label: 'Car Details', icon: Car },
                        { num: 2, label: 'Seller Review', icon: Calendar },
                        { num: 3, label: 'Submitted', icon: IndianRupee },
                    ].map((item, index) => (
                        <div key={item.num} className="flex flex-1 items-center">
                            <div className="flex flex-1 items-center gap-2">
                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                    step >= item.num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                }`}>
                                    {step > item.num ? <Check className="h-4 w-4" /> : item.num}
                                </div>
                                <span className={`hidden text-sm font-medium sm:block ${step >= item.num ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {item.label}
                                </span>
                            </div>
                            {index < 2 && (
                                <div className={`mx-2 h-0.5 flex-1 ${step > item.num ? 'bg-primary' : 'bg-muted'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="space-y-6">
                            <Card>
                                <CardContent className="space-y-4 p-6">
                                    <h2 className="text-base font-semibold">Vehicle identity</h2>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Brand</Label>
                                            <Select value={brand} onValueChange={setBrand}>
                                                <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                                                <SelectContent>
                                                    {CAR_MAKES.map(make => (
                                                        <SelectItem key={make} value={make}>{make}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Model</Label>
                                            <Input placeholder="Swift, Creta, Nexon" value={model} onChange={e => setModel(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Variant</Label>
                                            <Input placeholder="VXi, SX, ZX" value={variant} onChange={e => setVariant(e.target.value)} />
                                        </div>
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Year</Label>
                                            <Select value={year} onValueChange={setYear}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {YEARS.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Body Type</Label>
                                            <Select value={bodyType} onValueChange={setBodyType}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {BODY_TYPES.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Colour</Label>
                                            <Input placeholder="White, Grey, Red" value={color} onChange={e => setColor(e.target.value)} />
                                        </div>
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">VIN / Chassis Number</Label>
                                            <Input placeholder="Optional" value={vin} onChange={e => setVin(e.target.value.toUpperCase())} maxLength={50} />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Fuel Type</Label>
                                            <Select value={fuelType} onValueChange={setFuelType}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {FUEL_TYPES.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Transmission</Label>
                                            <Select value={transmission} onValueChange={setTransmission}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {TRANSMISSIONS.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Number Plate</Label>
                                            <Input
                                                placeholder="TS09AB1234"
                                                value={registrationNumber}
                                                onChange={e => setRegistrationNumber(e.target.value.toUpperCase())}
                                                maxLength={20}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="space-y-4 p-6">
                                    <h2 className="text-base font-semibold">Pricing, usage, and features</h2>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Approx original/new price (Rs.)</Label>
                                            <Input
                                                type="number"
                                                value={originalPrice || ''}
                                                onChange={e => setOriginalPrice(Number(e.target.value))}
                                                min={100000}
                                                max={50000000}
                                                step={50000}
                                            />
                                            <p className="mt-1 text-xs text-muted-foreground">Rs. {toIN(originalPrice)}</p>
                                        </div>
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Expected selling price (Rs.)</Label>
                                            <Input
                                                type="number"
                                                placeholder={`Suggested Rs. ${toIN(valuation.mid)}`}
                                                value={expectedPrice || ''}
                                                onChange={e => setExpectedPrice(Number(e.target.value))}
                                                min={0}
                                                max={50000000}
                                                step={10000}
                                            />
                                            <p className="mt-1 text-xs text-muted-foreground">Leave blank to use valuation midpoint.</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Kilometers Driven</Label>
                                            <Input
                                                type="number"
                                                value={kmDriven || ''}
                                                onChange={e => setKmDriven(Number(e.target.value))}
                                                min={0}
                                                max={500000}
                                                step={1000}
                                            />
                                            <p className="mt-1 text-xs text-muted-foreground">{toIN(kmDriven)} km</p>
                                        </div>
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Number of Owners</Label>
                                            <Select value={owners} onValueChange={setOwners}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {OWNERS.map(item => (
                                                        <SelectItem key={item} value={item}>{item} Owner</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="mb-3 block text-sm font-medium">Key Features</Label>
                                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                            {FEATURE_OPTIONS.map(feature => (
                                                <label key={feature} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFeatures.includes(feature)}
                                                        onChange={() => toggleFeature(feature)}
                                                        className="h-4 w-4 accent-primary"
                                                    />
                                                    <span>{feature}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-4">
                            <Card className="border-primary/20 bg-primary/5">
                                <CardContent className="p-6 text-center">
                                    <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary" />
                                    <h2 className="mb-1 text-base font-semibold">Instant Valuation</h2>
                                    <p className="mb-4 text-xs text-muted-foreground">
                                        {brand || 'Your car'} {model} - {year} - {toIN(kmDriven)} km
                                    </p>
                                    <div className="mb-4 rounded-xl bg-background p-5">
                                        <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Estimated Value</p>
                                        <div className="flex flex-wrap items-center justify-center gap-2">
                                            <span className="text-2xl font-bold">Rs. {toIN(valuation.low)}</span>
                                            <span className="text-muted-foreground">to</span>
                                            <span className="text-2xl font-bold text-primary">Rs. {toIN(valuation.high)}</span>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">
                                        Final offer depends on inspection and document verification.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-5">
                                    <h3 className="mb-3 text-sm font-semibold">Dealer review includes</h3>
                                    <div className="space-y-3">
                                        {[
                                            { icon: <ShieldCheck className="h-4 w-4 text-emerald-500" />, text: 'Document and RC verification' },
                                            { icon: <Banknote className="h-4 w-4 text-blue-500" />, text: 'Offline price confirmation' },
                                            { icon: <Clock className="h-4 w-4 text-amber-500" />, text: 'Inspection slot follow-up' },
                                            { icon: <Car className="h-4 w-4 text-primary" />, text: 'Inventory listing after approval' },
                                        ].map(item => (
                                            <div key={item.text} className="flex items-center gap-2.5 text-sm">
                                                {item.icon}
                                                <span className="text-muted-foreground">{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Button className="w-full" size="lg" disabled={!canProceedStep1} onClick={() => setStep(2)}>
                                Continue
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-6">
                            <Card>
                                <CardContent className="space-y-4 p-6">
                                    <h2 className="text-base font-semibold">Seller and inspection details</h2>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Name</Label>
                                            <Input placeholder="Your name" value={sellerName} onChange={e => setSellerName(e.target.value)} />
                                        </div>
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Phone Number</Label>
                                            <Input
                                                type="tel"
                                                placeholder="10 digit mobile number"
                                                value={phoneNumber}
                                                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                maxLength={10}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Email</Label>
                                            <Input type="email" placeholder="you@example.com" value={sellerEmail} onChange={e => setSellerEmail(e.target.value)} />
                                        </div>
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">City</Label>
                                            <Select value={city} onValueChange={setCity}>
                                                <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                                                <SelectContent>
                                                    {CITIES.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="mb-2 block text-sm font-medium">Inspection Address</Label>
                                        <Input placeholder="Full address" value={address} onChange={e => setAddress(e.target.value)} />
                                    </div>

                                    <div>
                                        <Label className="mb-3 block text-sm font-medium">Preferred Date</Label>
                                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                            {dates.map(item => (
                                                <button
                                                    key={item.value}
                                                    type="button"
                                                    onClick={() => setSelectedDate(item.value)}
                                                    className={`rounded-lg border p-2.5 text-center text-xs font-medium transition-all ${
                                                        selectedDate === item.value
                                                            ? 'border-primary bg-primary/10 text-primary'
                                                            : 'border-border hover:border-primary/50'
                                                    }`}
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="mb-3 block text-sm font-medium">Preferred Time Slot</Label>
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            {TIME_SLOTS.map(slot => (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={`rounded-lg border p-2.5 text-center text-xs font-medium transition-all ${
                                                        selectedSlot === slot
                                                            ? 'border-primary bg-primary/10 text-primary'
                                                            : 'border-border hover:border-primary/50'
                                                    }`}
                                                >
                                                    <Clock className="mr-1 inline h-3 w-3" />
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="space-y-4 p-6">
                                    <h2 className="text-base font-semibold">Documents and condition</h2>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Insurance Status</Label>
                                            <Select value={insuranceStatus} onValueChange={value => setInsuranceStatus(value as typeof insuranceStatus)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {INSURANCE_STATUSES.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Insurance Provider</Label>
                                            <Input placeholder="Optional" value={insuranceProvider} onChange={e => setInsuranceProvider(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Insurance Valid Until</Label>
                                            <Input type="date" value={insuranceValidUntil} onChange={e => setInsuranceValidUntil(e.target.value)} />
                                        </div>
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Insurance / Quote Link</Label>
                                            <Input placeholder="https://..." value={insuranceQuoteUrl} onChange={e => setInsuranceQuoteUrl(e.target.value)} />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="mb-2 block text-sm font-medium">Accident History</Label>
                                        <Select value={accidentHistory} onValueChange={value => setAccidentHistory(value as typeof accidentHistory)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {ACCIDENT_HISTORY.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {[
                                            { label: 'RC available', checked: rcAvailable, onChange: setRcAvailable },
                                            { label: 'Service history available', checked: serviceHistoryAvailable, onChange: setServiceHistoryAvailable },
                                            { label: 'Active loan on vehicle', checked: loanActive, onChange: setLoanActive },
                                            { label: 'Flood damage reported', checked: floodDamage, onChange: setFloodDamage },
                                        ].map(item => (
                                            <label key={item.label} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={item.checked}
                                                    onChange={e => item.onChange(e.target.checked)}
                                                    className="h-4 w-4 accent-primary"
                                                />
                                                <span>{item.label}</span>
                                            </label>
                                        ))}
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Photo Links</Label>
                                            <textarea
                                                rows={4}
                                                placeholder="Paste image links, one per line"
                                                value={photoLinks}
                                                onChange={e => setPhotoLinks(e.target.value)}
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">Walkaround Video Link</Label>
                                            <Input placeholder="https://..." value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
                                            <Label className="mb-2 mt-4 block text-sm font-medium">Notes</Label>
                                            <textarea
                                                rows={3}
                                                placeholder="Service, tyre, battery, dent, repaint, or other details"
                                                value={notes}
                                                onChange={e => setNotes(e.target.value)}
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-4">
                            <Card>
                                <CardContent className="p-5">
                                    <h3 className="mb-3 text-sm font-semibold">Request Summary</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between gap-3">
                                            <span className="text-muted-foreground">Vehicle</span>
                                            <span className="text-right font-medium">{brand} {model} {variant}</span>
                                        </div>
                                        <div className="flex justify-between gap-3">
                                            <span className="text-muted-foreground">Year</span>
                                            <span className="font-medium">{year}</span>
                                        </div>
                                        <div className="flex justify-between gap-3">
                                            <span className="text-muted-foreground">KM Driven</span>
                                            <span className="font-medium">{toIN(kmDriven)} km</span>
                                        </div>
                                        <div className="flex justify-between gap-3">
                                            <span className="text-muted-foreground">Expected Price</span>
                                            <span className="font-medium">Rs. {toIN(sellerExpectedPrice)}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between gap-3">
                                            <span className="font-semibold">Valuation Range</span>
                                            <span className="text-right font-bold text-primary">Rs. {toIN(valuation.low)} - Rs. {toIN(valuation.high)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                                    <ArrowLeft className="mr-1 h-4 w-4" /> Back
                                </Button>
                                <Button className="flex-1" disabled={!canProceedStep2 || submitStatus === 'submitting'} onClick={submitSellRequest}>
                                    {submitStatus === 'submitting' ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
                                    Submit <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                            </div>

                            {submitStatus === 'error' && (
                                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>{submitError}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="mx-auto max-w-xl">
                        <Card className="border-primary/20">
                            <CardContent className="p-8 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                                    <Check className="h-8 w-8 text-emerald-500" />
                                </div>

                                <h2 className="mb-2 text-2xl font-bold">Sell Request Submitted</h2>
                                <p className="mb-6 text-muted-foreground">
                                    The dealer team will review your vehicle details and contact you offline.
                                </p>
                                {requestId && (
                                    <p className="mb-6 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                                        Request ID: {requestId}
                                    </p>
                                )}

                                <div className="mb-6 space-y-3 rounded-lg bg-muted/30 p-5 text-left">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Car className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Car:</span>
                                        <span className="font-medium">{brand} {model} ({year})</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Location:</span>
                                        <span className="font-medium">{city}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Date:</span>
                                        <span className="font-medium">{selectedDate && new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Time:</span>
                                        <span className="font-medium">{selectedSlot}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Phone:</span>
                                        <span className="font-medium">{phoneNumber}</span>
                                    </div>
                                    {registrationNumber && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Plate:</span>
                                            <span className="font-medium">{registrationNumber}</span>
                                        </div>
                                    )}
                                    <Separator />
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-sm font-semibold">Estimated Offer</span>
                                        <span className="text-right text-lg font-bold text-primary">Rs. {toIN(valuation.low)} - Rs. {toIN(valuation.high)}</span>
                                    </div>
                                </div>

                                <div className="mb-6 space-y-2.5 text-left">
                                    {[
                                        'Admin reviews the vehicle, photos, and documents',
                                        'The team contacts you to verify condition and price',
                                        'If approved, the vehicle can be listed in dealer inventory',
                                    ].map((text, index) => (
                                        <div key={text} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                                {index + 1}
                                            </div>
                                            {text}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                                        Sell Another Car
                                    </Button>
                                    <Link href={browseHref} className="flex-1">
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

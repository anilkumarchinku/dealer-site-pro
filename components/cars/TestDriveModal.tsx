/**
 * TestDriveModal — Multi-step test drive booking
 * Step 1: Choose date  →  Step 2: Choose time  →  Step 3: Your details  →  Step 4: Confirmed
 */

'use client';

import { useState, useMemo } from 'react';
import type { Car } from '@/lib/types/car';
import {
    Calendar,
    Phone,
    User,
    Mail,
    X,
    CheckCircle2,
    ChevronLeft,
    Clock,
    Car as CarIcon,
    MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateLeadForm } from '@/lib/validations/client';

interface TestDriveModalProps {
    car: Car;
    dealerId: string;
    dealerName?: string;
    dealerPhone?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    brandColor?: string;
    vehicleType?: '2w' | '3w' | '4w';
}

type Status = 'idle' | 'loading' | 'sent' | 'error';
type Step = 1 | 2 | 3 | 4;

interface FormState {
    name: string;
    phone: string;
    email: string;
}

// Time slots split into periods
const TIME_SLOTS = {
    Morning: ['9:00 AM', '10:00 AM', '11:00 AM'],
    Afternoon: ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'],
    Evening: ['4:00 PM', '5:00 PM', '6:00 PM'],
};

/** Build next N date tiles starting from today, skipping Sundays */
function buildDateTiles(count = 10) {
    const tiles: { date: Date; label: string; day: string; month: string }[] = [];
    const d = new Date();
    while (tiles.length < count) {
        if (d.getDay() !== 0) { // 0 = Sunday
            tiles.push({
                date: new Date(d),
                label: String(d.getDate()).padStart(2, '0'),
                day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
                month: d.toLocaleDateString('en-IN', { month: 'short' }),
            });
        }
        d.setDate(d.getDate() + 1);
    }
    return tiles;
}

function toDateStr(date: Date) {
    return date.toISOString().split('T')[0];
}

function formatDisplayDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
}

/** Verb to use for test drive label based on vehicle type */
function testDriveVerb(vehicleType?: '2w' | '3w' | '4w') {
    if (vehicleType === '2w') return 'Test Ride';
    if (vehicleType === '3w') return 'Trial Run';
    return 'Test Drive';
}

export function TestDriveModal({
    car,
    dealerId,
    dealerName,
    dealerPhone,
    open,
    onOpenChange,
    brandColor = '#2563eb',
    vehicleType,
}: TestDriveModalProps) {
    const [step, setStep] = useState<Step>(1);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [form, setForm] = useState<FormState>({ name: '', phone: '', email: '' });
    const [status, setStatus] = useState<Status>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const dateTiles = useMemo(() => buildDateTiles(10), []);
    const carLabel = `${car.make} ${car.model}${car.variant ? ' · ' + car.variant : ''}`;
    const verb = testDriveVerb(vehicleType ?? car.vehicleCategory as '2w' | '3w' | undefined);

    if (!open) return null;

    const handleClose = () => {
        onOpenChange(false);
        setTimeout(() => {
            setStep(1);
            setSelectedDate('');
            setSelectedTime('');
            setForm({ name: '', phone: '', email: '' });
            setStatus('idle');
            setErrorMsg('');
        }, 300);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateLeadForm(form);
        if (Object.keys(validationErrors).length > 0) {
            setErrorMsg(Object.values(validationErrors).join('. '));
            return;
        }
        setStatus('loading');
        setErrorMsg('');
        try {
            const res = await fetch('/api/test-drive', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dealer_id: dealerId,
                    car_id: car.id,
                    car_name: carLabel,
                    preferred_date: selectedDate,
                    preferred_time: selectedTime,
                    name: form.name.trim(),
                    phone: form.phone.trim(),
                    email: form.email.trim() || null,
                    vehicle_type: vehicleType ?? car.vehicleCategory ?? '4w',
                }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error ?? 'Booking failed');
            }
            setStatus('sent');
            setStep(4);
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
            setStatus('error');
        }
    };

    const whatsappMsg = dealerPhone
        ? `https://wa.me/${dealerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
            `Hi! I've booked a ${verb} for ${carLabel} on ${formatDisplayDate(selectedDate)} at ${selectedTime}. Please confirm. Name: ${form.name}, Phone: ${form.phone}`
          )}`
        : null;

    // ── Step progress bar ────────────────────────────────────────────────────
    const totalSteps = 3;
    const progress = Math.round(((Math.min(step, totalSteps) - 1) / (totalSteps - 1)) * 100);

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        {step > 1 && step < 4 && (
                            <button
                                onClick={() => setStep(s => (s - 1) as Step)}
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors mr-1"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </button>
                        )}
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-100 shadow-sm"
                            style={{ backgroundColor: `${brandColor}15` }}>
                            <CarIcon className="w-5 h-5" style={{ color: brandColor }} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: brandColor }}>
                                Book {verb}
                            </p>
                            <p className="text-xs font-semibold text-gray-700 leading-tight line-clamp-1">{carLabel}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                {/* ── Progress bar (Steps 1–3) ── */}
                {step < 4 && (
                    <div className="px-5 pt-3 pb-1">
                        <div className="flex items-center justify-between mb-1.5">
                            {['Choose Date', 'Choose Time', 'Your Details'].map((label, i) => (
                                <div key={label} className="flex flex-col items-center gap-0.5" style={{ width: '30%' }}>
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors"
                                        style={step > i + 1
                                            ? { backgroundColor: brandColor, color: '#fff' }
                                            : step === i + 1
                                            ? { backgroundColor: brandColor, color: '#fff' }
                                            : { backgroundColor: '#f3f4f6', color: '#9ca3af' }}
                                    >
                                        {step > i + 1 ? '✓' : i + 1}
                                    </div>
                                    <p className="text-[9px] text-gray-500 text-center leading-none">{label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${progress}%`, backgroundColor: brandColor }}
                            />
                        </div>
                    </div>
                )}

                {/* ── Body ── */}
                <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">

                    {/* STEP 1 — Choose Date */}
                    {step === 1 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                Select a preferred date
                            </p>
                            <div className="grid grid-cols-5 gap-2">
                                {dateTiles.map(tile => {
                                    const ds = toDateStr(tile.date);
                                    const isSelected = selectedDate === ds;
                                    return (
                                        <button
                                            key={ds}
                                            onClick={() => setSelectedDate(ds)}
                                            className="flex flex-col items-center py-2.5 px-1 rounded-xl border-2 transition-all duration-150 hover:scale-105"
                                            style={isSelected
                                                ? { backgroundColor: brandColor, borderColor: brandColor, color: '#fff' }
                                                : { backgroundColor: '#f9fafb', borderColor: '#e5e7eb', color: '#374151' }}
                                        >
                                            <span className={`text-[9px] font-semibold uppercase ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                                                {tile.day}
                                            </span>
                                            <span className={`text-base font-bold leading-none my-0.5 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                                {tile.label}
                                            </span>
                                            <span className={`text-[9px] ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                                                {tile.month}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2 text-center">Sundays excluded · Slots available Mon–Sat</p>
                            <Button
                                className="w-full mt-4 gap-2 font-semibold"
                                disabled={!selectedDate}
                                onClick={() => setStep(2)}
                                style={{ backgroundColor: selectedDate ? brandColor : undefined }}
                            >
                                Continue → Choose Time
                            </Button>
                        </div>
                    )}

                    {/* STEP 2 — Choose Time */}
                    {step === 2 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {formatDisplayDate(selectedDate)}
                            </p>
                            <p className="text-[10px] text-gray-400 mb-3">Pick a time slot that works for you</p>
                            {Object.entries(TIME_SLOTS).map(([period, slots]) => (
                                <div key={period} className="mb-3">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{period}</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {slots.map(slot => {
                                            const isSelected = selectedTime === slot;
                                            return (
                                                <button
                                                    key={slot}
                                                    onClick={() => setSelectedTime(slot)}
                                                    className="py-2.5 rounded-xl border-2 text-xs font-semibold transition-all duration-150 hover:scale-105"
                                                    style={isSelected
                                                        ? { backgroundColor: brandColor, borderColor: brandColor, color: '#fff' }
                                                        : { backgroundColor: '#f9fafb', borderColor: '#e5e7eb', color: '#374151' }}
                                                >
                                                    {slot}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                            <Button
                                className="w-full mt-2 gap-2 font-semibold"
                                disabled={!selectedTime}
                                onClick={() => setStep(3)}
                                style={{ backgroundColor: selectedTime ? brandColor : undefined }}
                            >
                                Continue → Your Details
                            </Button>
                        </div>
                    )}

                    {/* STEP 3 — Your Details */}
                    {step === 3 && (
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Booking summary pill */}
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
                                style={{ backgroundColor: `${brandColor}12`, color: brandColor }}>
                                <Calendar className="w-3.5 h-3.5 shrink-0" />
                                {formatDisplayDate(selectedDate)} &nbsp;·&nbsp; {selectedTime}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    <User className="w-3.5 h-3.5 inline mr-1" />Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Your name"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-gray-400"
                                    style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    <Phone className="w-3.5 h-3.5 inline mr-1" />Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={form.phone}
                                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                    placeholder="10-digit mobile number"
                                    maxLength={13}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-gray-400"
                                    style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    <Mail className="w-3.5 h-3.5 inline mr-1" />Email <span className="font-normal text-gray-400">(optional)</span>
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    placeholder="you@email.com"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-gray-400"
                                    style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
                                />
                            </div>

                            {errorMsg && (
                                <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{errorMsg}</p>
                            )}

                            <Button
                                type="submit"
                                disabled={status === 'loading' || !form.name.trim() || !form.phone.trim()}
                                className="w-full gap-2 font-semibold"
                                style={{ backgroundColor: brandColor }}
                            >
                                {status === 'loading' ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        Booking…
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="w-4 h-4" />
                                        Confirm {verb}
                                    </>
                                )}
                            </Button>

                            <p className="text-center text-[10px] text-gray-400">
                                Our team will call within 1 hour to confirm your slot
                            </p>
                        </form>
                    )}

                    {/* STEP 4 — Confirmation */}
                    {step === 4 && (
                        <div className="text-center py-4">
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                style={{ backgroundColor: `${brandColor}15` }}
                            >
                                <CheckCircle2 className="w-9 h-9" style={{ color: brandColor }} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{verb} Booked!</h3>
                            <p className="text-sm text-gray-500 mb-5">
                                We&apos;ll call you to confirm your slot shortly.
                            </p>

                            {/* Booking summary card */}
                            <div className="text-left bg-gray-50 rounded-2xl p-4 space-y-2.5 mb-5 border border-gray-100">
                                <Row icon={<CarIcon className="w-3.5 h-3.5" style={{ color: brandColor }} />} label="Vehicle" value={carLabel} />
                                <Row icon={<Calendar className="w-3.5 h-3.5" style={{ color: brandColor }} />} label="Date" value={formatDisplayDate(selectedDate)} />
                                <Row icon={<Clock className="w-3.5 h-3.5" style={{ color: brandColor }} />} label="Time" value={selectedTime} />
                                <Row icon={<User className="w-3.5 h-3.5" style={{ color: brandColor }} />} label="Name" value={form.name} />
                                <Row icon={<Phone className="w-3.5 h-3.5" style={{ color: brandColor }} />} label="Phone" value={form.phone} />
                                {dealerName && (
                                    <Row icon={<MapPin className="w-3.5 h-3.5" style={{ color: brandColor }} />} label="Dealer" value={dealerName} />
                                )}
                            </div>

                            <div className="flex gap-2">
                                {whatsappMsg && (
                                    <a
                                        href={whatsappMsg}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                        Share on WhatsApp
                                    </a>
                                )}
                                <Button
                                    onClick={handleClose}
                                    className="flex-1"
                                    variant="outline"
                                >
                                    Done
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/** Small summary row used in Step 4 */
function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-2">
            <div className="mt-0.5 shrink-0">{icon}</div>
            <div className="min-w-0">
                <p className="text-[10px] text-gray-400 leading-none">{label}</p>
                <p className="text-xs font-semibold text-gray-800 leading-snug">{value}</p>
            </div>
        </div>
    );
}

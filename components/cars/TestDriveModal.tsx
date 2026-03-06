/**
 * TestDriveModal
 * Lets a buyer book a home test drive for a specific car.
 * Submits to /api/leads with lead_source: 'test_drive'.
 */

'use client';

import { useState } from 'react';
import { Car } from '@/lib/types/car';
import { Calendar, Phone, User, X, CheckCircle2, Car as CarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TestDriveModalProps {
    car: Car;
    dealerId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    brandColor?: string;
}

type FormState = { name: string; phone: string; date: string; timeSlot: string };
type Status = 'idle' | 'loading' | 'sent' | 'error';

const TIME_SLOTS = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'];

/** Returns today's date in YYYY-MM-DD (min selectable date) */
function todayStr() {
    return new Date().toISOString().split('T')[0];
}

/** Returns date 30 days ahead as YYYY-MM-DD (max selectable) */
function maxDateStr() {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
}

export function TestDriveModal({ car, dealerId, open, onOpenChange, brandColor = '#2563eb' }: TestDriveModalProps) {
    const [form, setForm] = useState<FormState>({ name: '', phone: '', date: '', timeSlot: '' });
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState('');

    if (!open) return null;

    const carLabel = `${car.make} ${car.model}${car.variant ? ' ' + car.variant : ''}`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!form.date || !form.timeSlot) {
            setError('Please choose a date and time slot.');
            return;
        }

        setStatus('loading');
        try {
            const message = `Test drive request for ${carLabel}. Preferred date: ${form.date} at ${form.timeSlot}.`;
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dealer_id: dealerId,
                    name: form.name,
                    phone: form.phone,
                    message,
                    car_id: car.id,
                    car_name: carLabel,
                    lead_source: 'test_drive',
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error ?? 'Failed to submit');
            }

            setStatus('sent');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setStatus('error');
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        // Reset after close animation
        setTimeout(() => { setStatus('idle'); setForm({ name: '', phone: '', date: '', timeSlot: '' }); setError(''); }, 300);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-5 py-4 flex items-center justify-between bg-white border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-gray-100 shadow-sm">
                            <CarIcon className="w-5 h-5" style={{ color: brandColor }} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: brandColor }}>Book a Test Drive</p>
                            <p className="text-sm font-bold text-gray-900 leading-tight">{carLabel}</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-5">
                    {status === 'sent' ? (
                        <div className="text-center py-6">
                            <CheckCircle2 className="w-14 h-14 mx-auto mb-3" style={{ color: brandColor }} />
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Drive Booked!</h3>
                            <p className="text-gray-600 text-sm">
                                We&apos;ve received your test drive request for the {carLabel}.<br />
                                Our team will call you to confirm the schedule.
                            </p>
                            <Button className="mt-5 w-full" onClick={handleClose} style={{ backgroundColor: brandColor }}>
                                Done
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    <User className="w-3.5 h-3.5 inline mr-1" />Your Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="Full name"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-gray-400"
                                    style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    <Phone className="w-3.5 h-3.5 inline mr-1" />Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    placeholder="10-digit mobile number"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-gray-400"
                                    style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    <Calendar className="w-3.5 h-3.5 inline mr-1" />Preferred Date *
                                </label>
                                <input
                                    type="date"
                                    required
                                    min={todayStr()}
                                    max={maxDateStr()}
                                    value={form.date}
                                    onChange={e => setForm({ ...form, date: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:border-transparent"
                                    style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
                                />
                            </div>

                            {/* Time Slot */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Preferred Time Slot *</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {TIME_SLOTS.map(slot => (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => setForm({ ...form, timeSlot: slot })}
                                            className="py-2 rounded-xl border text-xs font-medium transition-all"
                                            style={form.timeSlot === slot
                                                ? { backgroundColor: brandColor, color: '#fff', borderColor: brandColor }
                                                : { backgroundColor: '#f9fafb', color: '#374151', borderColor: '#e5e7eb' }}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                            )}

                            <Button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full gap-2"
                                style={{ backgroundColor: brandColor }}
                            >
                                {status === 'loading' ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        Booking...
                                    </span>
                                ) : (
                                    <>
                                        <Calendar className="w-4 h-4" />
                                        Confirm Test Drive
                                    </>
                                )}
                            </Button>

                            <p className="text-center text-[11px] text-gray-400">
                                Our team will call to confirm within 1 hour
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

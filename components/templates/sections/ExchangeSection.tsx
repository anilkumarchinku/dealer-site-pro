'use client';

import { useState } from 'react';
import { CheckCircle2, ArrowLeftRight } from 'lucide-react';

interface ExchangeSectionProps {
    brandColor: string;
    dealerId: string;
    dealerName: string;
    vehicleType?: '2w' | '3w' | '4w';
}

interface ExchangeFormData {
    make: string;
    model: string;
    year: string;
    kmDriven: string;
    condition: string;
    name: string;
    phone: string;
}

const YEAR_OPTIONS = Array.from({ length: 10 }, (_, i) => String(2024 - i));

const KM_OPTIONS = [
    'Under 10,000 km',
    '10,000 – 30,000 km',
    '30,000 – 60,000 km',
    '60,000 – 1,00,000 km',
    'Over 1,00,000 km',
];

const CONDITION_OPTIONS = ['Excellent', 'Good', 'Fair', 'Poor'];

function getVehicleLabel(vehicleType?: '2w' | '3w' | '4w') {
    if (vehicleType === '2w') return 'Bike';
    if (vehicleType === '3w') return 'Auto';
    return 'Vehicle';
}

export function ExchangeSection({
    brandColor,
    dealerId,
    dealerName,
    vehicleType,
}: ExchangeSectionProps) {
    const vehicleLabel = getVehicleLabel(vehicleType);

    const [form, setForm] = useState<ExchangeFormData>({
        make: '',
        model: '',
        year: '',
        kmDriven: '',
        condition: '',
        name: '',
        phone: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        const message = `Exchange enquiry — Vehicle: ${form.make} ${form.model} (${form.year}), ${form.kmDriven}, Condition: ${form.condition}`;

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dealer_id: dealerId,
                    name: form.name,
                    phone: form.phone,
                    lead_source: 'exchange',
                    message,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error ?? 'Submission failed. Please try again.');
            }

            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setSubmitting(false);
        }
    }

    const inputClass =
        'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition';

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left — Info */}
                    <div>
                        <span
                            className="text-sm font-semibold uppercase tracking-widest"
                            style={{ color: brandColor }}
                        >
                            Get Best Value
                        </span>
                        <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                            Exchange Your Old {vehicleLabel}
                        </h2>
                        <p className="mt-4 text-gray-500 leading-relaxed">
                            Trade in your existing vehicle and get the best exchange value. Quick
                            evaluation, transparent pricing, zero hassle.
                        </p>

                        {/* Benefits */}
                        <ul className="mt-8 space-y-4">
                            {[
                                'Free vehicle evaluation',
                                'Instant price estimate',
                                'Best market rates guaranteed',
                            ].map((benefit) => (
                                <li key={benefit} className="flex items-center gap-3">
                                    <CheckCircle2
                                        className="w-5 h-5 shrink-0"
                                        style={{ color: brandColor }}
                                    />
                                    <span className="text-gray-700 font-medium">{benefit}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Trust note */}
                        <div className="mt-8 flex items-center gap-3">
                            <div
                                className="flex items-center justify-center w-12 h-12 rounded-full"
                                style={{ backgroundColor: `${brandColor}1a` }}
                            >
                                <ArrowLeftRight className="w-6 h-6" style={{ color: brandColor }} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">10,000+ vehicles exchanged</p>
                                <div className="flex items-center gap-0.5 mt-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <svg
                                            key={s}
                                            className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="ml-1 text-xs text-gray-500">4.8 / 5</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right — Form */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: `${brandColor}1a` }}
                                >
                                    <CheckCircle2 className="w-8 h-8" style={{ color: brandColor }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Request Received!</h3>
                                <p className="text-gray-500 text-sm max-w-xs">
                                    We&apos;ll call with your estimate within 2 hours!
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h3 className="font-bold text-gray-900 text-lg mb-2">
                                    Get Exchange Value
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Vehicle Make
                                        </label>
                                        <input
                                            name="make"
                                            value={form.make}
                                            onChange={handleChange}
                                            placeholder="e.g. Honda"
                                            className={inputClass}
                                            style={
                                                { '--tw-ring-color': brandColor } as React.CSSProperties
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Vehicle Model
                                        </label>
                                        <input
                                            name="model"
                                            value={form.model}
                                            onChange={handleChange}
                                            placeholder="e.g. Activa 6G"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Year
                                        </label>
                                        <select
                                            name="year"
                                            value={form.year}
                                            onChange={handleChange}
                                            className={inputClass}
                                        >
                                            <option value="">Select year</option>
                                            {YEAR_OPTIONS.map((y) => (
                                                <option key={y} value={y}>
                                                    {y}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            KM Driven
                                        </label>
                                        <select
                                            name="kmDriven"
                                            value={form.kmDriven}
                                            onChange={handleChange}
                                            className={inputClass}
                                        >
                                            <option value="">Select range</option>
                                            {KM_OPTIONS.map((k) => (
                                                <option key={k} value={k}>
                                                    {k}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Condition
                                    </label>
                                    <select
                                        name="condition"
                                        value={form.condition}
                                        onChange={handleChange}
                                        className={inputClass}
                                    >
                                        <option value="">Select condition</option>
                                        {CONDITION_OPTIONS.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <hr className="border-gray-100" />

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Your Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Full name"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        required
                                        type="tel"
                                        placeholder="10-digit mobile number"
                                        className={inputClass}
                                    />
                                </div>

                                {error && (
                                    <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                                    style={{ backgroundColor: brandColor }}
                                >
                                    {submitting ? 'Submitting…' : 'Get Exchange Value'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

'use client';

import { useId, useState } from 'react';
import { CheckCircle2, ArrowLeftRight } from 'lucide-react';
import { normalizeLeadPhone } from '@/lib/validations/lead';
import { getContrastText } from '@/lib/utils/color-contrast';

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

const YEAR_OPTIONS = Array.from({ length: 10 }, (_, i) =>
    String(new Date().getFullYear() - i),
);

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

    // Readable text color for the brand-filled CTA (light brands need dark text).
    const onBrandText = getContrastText(brandColor);

    // Stable, unique ids so each label is programmatically tied to its input.
    const fieldId = useId();
    const ids = {
        make: `${fieldId}-make`,
        model: `${fieldId}-model`,
        year: `${fieldId}-year`,
        kmDriven: `${fieldId}-km`,
        condition: `${fieldId}-condition`,
        name: `${fieldId}-name`,
        phone: `${fieldId}-phone`,
    };

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
                    phone: normalizeLeadPhone(form.phone),
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
                        <p className="mt-4 text-gray-600 leading-relaxed">
                            Trade in your existing vehicle and get the best exchange value. Quick
                            evaluation, transparent pricing, zero hassle.
                        </p>

                        {/* Benefits */}
                        <ul className="mt-8 space-y-4">
                            {[
                                'Free vehicle evaluation',
                                'Quick price estimate',
                                'Fair, competitive exchange value',
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
                        {/*
                          Removed fabricated trust metrics ("10,000+ vehicles exchanged"
                          and a "4.8 / 5" star rating) that were hardcoded for every dealer.
                          Show real, per-dealer exchange stats here only when the data exists.
                        */}
                        <div className="mt-8 flex items-center gap-3">
                            <div
                                className="flex items-center justify-center w-12 h-12 rounded-full"
                                style={{ backgroundColor: `${brandColor}1a` }}
                            >
                                <ArrowLeftRight className="w-6 h-6" style={{ color: brandColor }} />
                            </div>
                            <p className="font-semibold text-gray-900">
                                Get a fair, transparent exchange value for your old {vehicleLabel.toLowerCase()}.
                            </p>
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
                                <p className="text-gray-600 text-sm max-w-xs">
                                    We&apos;ll get back to you with your estimate soon.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h3 className="font-bold text-gray-900 text-lg mb-2">
                                    Get Exchange Value
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor={ids.make} className="block text-xs font-medium text-gray-600 mb-1">
                                            Vehicle Make
                                        </label>
                                        <input
                                            id={ids.make}
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
                                        <label htmlFor={ids.model} className="block text-xs font-medium text-gray-600 mb-1">
                                            Vehicle Model
                                        </label>
                                        <input
                                            id={ids.model}
                                            name="model"
                                            value={form.model}
                                            onChange={handleChange}
                                            placeholder="e.g. Activa 6G"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor={ids.year} className="block text-xs font-medium text-gray-600 mb-1">
                                            Year
                                        </label>
                                        <select
                                            id={ids.year}
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
                                        <label htmlFor={ids.kmDriven} className="block text-xs font-medium text-gray-600 mb-1">
                                            KM Driven
                                        </label>
                                        <select
                                            id={ids.kmDriven}
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
                                    <label htmlFor={ids.condition} className="block text-xs font-medium text-gray-600 mb-1">
                                        Condition
                                    </label>
                                    <select
                                        id={ids.condition}
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
                                    <label htmlFor={ids.name} className="block text-xs font-medium text-gray-600 mb-1">
                                        Your Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id={ids.name}
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Full name"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor={ids.phone} className="block text-xs font-medium text-gray-600 mb-1">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id={ids.phone}
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
                                    className="w-full py-3.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                                    style={{ backgroundColor: brandColor, color: onBrandText }}
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

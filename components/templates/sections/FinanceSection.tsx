'use client';

import { useState } from 'react';
import { CheckCircle2, Zap, Home, Percent } from 'lucide-react';

interface FinanceSectionProps {
    brandColor: string;
    dealerId?: string;
    dealerName: string;
}

const BANKS = [
    { name: 'SBI', color: '#1a3c8f' },
    { name: 'HDFC Bank', color: '#dc2626' },
    { name: 'ICICI Bank', color: '#ea580c' },
    { name: 'Axis Bank', color: '#7c3aed' },
    { name: 'Kotak Mahindra', color: '#c8102e' },
    { name: 'Bajaj Finserv', color: '#2563eb' },
];

const LOAN_AMOUNT_OPTIONS = [
    'Under ₹5L',
    '₹5–10L',
    '₹10–20L',
    'Above ₹20L',
];

const BENEFITS = [
    { icon: Zap, title: 'Zero Down Payment', subtitle: 'Drive home today without any upfront payment' },
    { icon: CheckCircle2, title: 'Instant Approval', subtitle: 'Get loan approval within minutes, not days' },
    { icon: Home, title: 'Doorstep Service', subtitle: 'Our finance executive visits you at home' },
];

interface FormState {
    name: string;
    phone: string;
    loanAmount: string;
}

export function FinanceSection({ brandColor, dealerId, dealerName }: FinanceSectionProps) {
    const [form, setForm] = useState<FormState>({ name: '', phone: '', loanAmount: 'Under ₹5L' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dealer_id: dealerId,
                    name: form.name,
                    phone: form.phone,
                    message: `Finance inquiry. Loan amount needed: ${form.loanAmount}.`,
                    lead_source: 'finance_inquiry',
                }),
            });
            if (!res.ok) throw new Error('Submission failed');
            setSubmitted(true);
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-10">
                    <span
                        className="text-sm font-semibold uppercase tracking-widest"
                        style={{ color: brandColor }}
                    >
                        Easy Finance
                    </span>
                    <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                        Finance Made Easy
                    </h2>
                    <p className="mt-3 text-gray-500 max-w-xl mx-auto">
                        Get the best financing options from India&apos;s top lenders, available at {dealerName}.
                    </p>
                </div>

                {/* Finance highlights */}
                <div
                    className="rounded-2xl p-6 md:p-8 mb-10 text-white"
                    style={{ backgroundColor: brandColor }}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Percent className="w-5 h-5 opacity-80" />
                                <span className="text-2xl font-bold">8.5%</span>
                            </div>
                            <p className="text-sm opacity-80">Interest rates from 8.5% p.a.</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold mb-1">100%</p>
                            <p className="text-sm opacity-80">Up to 100% on-road funding</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold mb-1">12–84</p>
                            <p className="text-sm opacity-80">Flexible tenure: 12–84 months</p>
                        </div>
                    </div>
                </div>

                {/* Partner banks */}
                <div className="mb-10">
                    <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">
                        Finance Partners
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {BANKS.map((bank) => (
                            <span
                                key={bank.name}
                                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white shadow-sm"
                                style={{ backgroundColor: bank.color }}
                            >
                                {bank.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Benefits + Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    {/* Benefit cards */}
                    <div className="space-y-4">
                        {BENEFITS.map((benefit) => {
                            const Icon = benefit.icon;
                            return (
                                <div
                                    key={benefit.title}
                                    className="bg-white rounded-2xl p-5 flex items-start gap-4"
                                    style={{ border: `1.5px solid ${brandColor}33` }}
                                >
                                    <div
                                        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: `${brandColor}26` }}
                                    >
                                        <Icon className="w-5 h-5" style={{ color: brandColor }} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-0.5">{benefit.title}</h3>
                                        <p className="text-sm text-gray-500">{benefit.subtitle}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Lead form */}
                    <div
                        className="bg-white rounded-2xl p-6 md:p-8"
                        style={{ border: `1.5px solid ${brandColor}33` }}
                    >
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: `${brandColor}26` }}
                                >
                                    <CheckCircle2 className="w-8 h-8" style={{ color: brandColor }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Thank You!</h3>
                                <p className="text-gray-500 max-w-xs">
                                    Our finance team will call you within 24 hours to discuss the best loan options for you.
                                </p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-lg font-bold text-gray-900 mb-5">Apply for Finance</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Your Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2"
                                            style={{ ['--tw-ring-color' as string]: brandColor }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="10-digit mobile number"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2"
                                            style={{ ['--tw-ring-color' as string]: brandColor }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Loan Amount Needed
                                        </label>
                                        <select
                                            name="loanAmount"
                                            value={form.loanAmount}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2"
                                            style={{ ['--tw-ring-color' as string]: brandColor }}
                                        >
                                            {LOAN_AMOUNT_OPTIONS.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {error && (
                                        <p className="text-sm text-red-500">{error}</p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                                        style={{ backgroundColor: brandColor }}
                                    >
                                        {submitting ? 'Submitting…' : 'Get Finance Options'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

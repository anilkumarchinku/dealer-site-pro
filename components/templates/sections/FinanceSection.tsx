'use client';

import { useId, useState } from 'react';
import { CheckCircle2, Zap, Home, Landmark, ShieldCheck, CreditCard } from 'lucide-react';
import { getContrastText, getReadableAccent } from '@/lib/utils/color-contrast';
import { normalizeLeadPhone } from '@/lib/validations/lead';

interface FinanceSectionProps {
    brandColor: string;
    dealerId?: string;
    dealerName: string;
}

// Generic value props describing the kinds of financing we help arrange.
// We deliberately avoid naming specific banks as confirmed tie-ups or quoting
// fixed rates — actual partners and terms vary, so we invite the buyer to enquire.
const FINANCE_HIGHLIGHTS = [
    'Loans through leading banks & NBFCs',
    'Competitive interest rates',
    'High on-road funding available',
    'Flexible tenure options',
];

const LOAN_AMOUNT_OPTIONS = [
    'Under ₹5L',
    '₹5–10L',
    '₹10–20L',
    'Above ₹20L',
];

const BENEFITS = [
    { icon: Zap, title: 'Low Down Payment Options', subtitle: 'Ask about minimal-upfront plans that may be available' },
    { icon: CheckCircle2, title: 'Quick Processing', subtitle: 'We help move your application along as fast as possible' },
    { icon: Home, title: 'Doorstep Assistance', subtitle: 'Our finance executive can help you with paperwork' },
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

    // Readable text color for surfaces filled with the brand color (light brands
    // like yellow/lime need dark text, not white).
    const onBrandText = getContrastText(brandColor);
    const brandAccent = getReadableAccent(brandColor);
    const financePrecheckHref = `/api/finance/precheck?source=dealer-site-pro${dealerId ? `&dealer=${encodeURIComponent(dealerId)}` : ''}`;
    const insuranceHref = `/tools/insurance-estimator${dealerId ? `?dealer=${encodeURIComponent(dealerId)}` : ''}`;
    const fastagHref = `/api/fastag/recharge?source=dealer-site-pro${dealerId ? `&dealer=${encodeURIComponent(dealerId)}` : ''}`;

    // Stable, unique ids so each label is programmatically tied to its input.
    const fieldId = useId();
    const ids = {
        name: `${fieldId}-name`,
        phone: `${fieldId}-phone`,
        loanAmount: `${fieldId}-loan`,
    };

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
                    phone: normalizeLeadPhone(form.phone),
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
                        style={{ color: brandAccent }}
                    >
                        Easy Finance
                    </span>
                    <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                        Finance Made Easy
                    </h2>
                    <p className="mt-3 text-gray-600 max-w-xl mx-auto">
                        {dealerName} helps you arrange financing through leading banks and NBFCs. Rates and terms are indicative — contact us for current options.
                    </p>
                </div>

                {/* Finance highlights */}
                <div
                    className="rounded-2xl p-6 md:p-8 mb-10"
                    style={{ backgroundColor: brandColor, color: onBrandText }}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                        {FINANCE_HIGHLIGHTS.map((highlight) => (
                            <div key={highlight} className="flex flex-col items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                                <p className="text-sm font-medium">{highlight}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Finance partners — generic, not named tie-ups */}
                <div className="mb-10">
                    <div className="flex items-center justify-center gap-2 mb-5">
                        <Landmark className="w-4 h-4" style={{ color: brandAccent }} aria-hidden="true" />
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-600">
                            Financing Through Leading Banks &amp; NBFCs
                        </p>
                    </div>
                    <p className="text-center text-sm text-gray-600 max-w-lg mx-auto">
                        We work with a range of lenders to find a plan that suits you. Ask us which options are currently available for your purchase.
                    </p>
                </div>

                <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {[
                        { href: financePrecheckHref, icon: Landmark, title: 'Finance Pre-check', text: 'Check partner eligibility before the showroom call.' },
                        { href: insuranceHref, icon: ShieldCheck, title: 'Insurance Quote', text: 'Estimate cover and ask the dealer for assistance.' },
                        { href: fastagHref, icon: CreditCard, title: 'FASTag Recharge', text: 'Continue to the configured recharge partner.' },
                    ].map((action) => {
                        const Icon = action.icon;
                        return (
                            <a
                                key={action.title}
                                href={action.href}
                                className="group rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <span
                                    className="mb-4 flex h-11 w-11 items-center justify-center rounded-full"
                                    style={{ backgroundColor: `${brandColor}1f`, color: brandAccent }}
                                >
                                    <Icon className="h-5 w-5" />
                                </span>
                                <span className="block text-sm font-bold text-gray-900">{action.title}</span>
                                <span className="mt-1 block text-sm leading-6 text-gray-600">{action.text}</span>
                            </a>
                        );
                    })}
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
                                        <Icon className="w-5 h-5" style={{ color: brandAccent }} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-0.5">{benefit.title}</h3>
                                        <p className="text-sm text-gray-600">{benefit.subtitle}</p>
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
                                    <CheckCircle2 className="w-8 h-8" style={{ color: brandAccent }} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Thank You!</h3>
                                <p className="text-gray-600 max-w-xs">
                                    Our finance team will call you shortly to discuss the loan options available for you.
                                </p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-lg font-bold text-gray-900 mb-5">Apply for Finance</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor={ids.name} className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Your Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id={ids.name}
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
                                        <label htmlFor={ids.phone} className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id={ids.phone}
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
                                        <label htmlFor={ids.loanAmount} className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Loan Amount Needed
                                        </label>
                                        <select
                                            id={ids.loanAmount}
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
                                        className="w-full py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                                        style={{ backgroundColor: brandColor, color: onBrandText }}
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

'use client';

import { useState, useMemo } from 'react';
import { PhoneCall, Calculator } from 'lucide-react';

interface OnRoadPriceSectionProps {
    brandColor: string;
    vehicleType?: '2w' | '3w' | '4w';
    dealerPhone?: string;
}

const RTO_OPTIONS = [
    { label: '8% (HP/UP/Bihar)', value: 0.08 },
    { label: '9% (MH/GJ)', value: 0.09 },
    { label: '10% (KA/TN/AP)', value: 0.10 },
    { label: '12% (DL)', value: 0.12 },
];

function getPriceRange(vehicleType?: '2w' | '3w' | '4w') {
    if (vehicleType === '2w') return { min: 10000, max: 500000, defaultVal: 80000, step: 5000 };
    if (vehicleType === '3w') return { min: 50000, max: 1000000, defaultVal: 200000, step: 10000 };
    return { min: 50000, max: 5000000, defaultVal: 800000, step: 10000 };
}

function formatLakhs(amount: number): string {
    const lakhs = amount / 100000;
    return `₹${lakhs.toFixed(2)}L`;
}

function formatINR(amount: number): string {
    return `₹${amount.toLocaleString('en-IN')}`;
}

export function OnRoadPriceSection({
    brandColor,
    vehicleType,
    dealerPhone,
}: OnRoadPriceSectionProps) {
    const range = getPriceRange(vehicleType);

    const [exShowroom, setExShowroom] = useState(range.defaultVal);
    const [rtoRate, setRtoRate] = useState(0.09);
    const [accessories, setAccessories] = useState(5000);

    const rto = useMemo(() => Math.round(exShowroom * rtoRate), [exShowroom, rtoRate]);
    const insurance = useMemo(() => Math.round(exShowroom * 0.035), [exShowroom]);
    const tcs = useMemo(() => (exShowroom > 1000000 ? Math.round(exShowroom * 0.01) : 0), [exShowroom]);
    const total = useMemo(
        () => exShowroom + rto + insurance + tcs + accessories,
        [exShowroom, rto, insurance, tcs, accessories],
    );

    const breakdown = [
        { label: 'Ex-Showroom Price', amount: exShowroom },
        { label: `RTO / Registration (${(rtoRate * 100).toFixed(0)}%)`, amount: rto },
        { label: 'Insurance (3.5%)', amount: insurance },
        ...(tcs > 0 ? [{ label: 'TCS (1%)', amount: tcs }] : []),
        { label: 'Accessories', amount: accessories },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-10">
                    <span
                        className="text-sm font-semibold uppercase tracking-widest"
                        style={{ color: brandColor }}
                    >
                        Pricing Tool
                    </span>
                    <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                        On-Road Price Calculator
                    </h2>
                    <p className="mt-3 text-gray-500 max-w-xl mx-auto">
                        Get an instant estimate of your total on-road cost including taxes, insurance and more.
                    </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 space-y-6" style={{ border: `1.5px solid ${brandColor}33` }}>
                    {/* Ex-showroom slider */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Ex-Showroom Price
                            </label>
                            <span className="text-base font-bold" style={{ color: brandColor }}>
                                {formatLakhs(exShowroom)}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={range.min}
                            max={range.max}
                            step={range.step}
                            value={exShowroom}
                            onChange={(e) => setExShowroom(Number(e.target.value))}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                            style={{ accentColor: brandColor }}
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>{formatLakhs(range.min)}</span>
                            <span>{formatLakhs(range.max)}</span>
                        </div>
                    </div>

                    {/* RTO select */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            RTO / Registration Tax
                        </label>
                        <select
                            value={rtoRate}
                            onChange={(e) => setRtoRate(Number(e.target.value))}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2"
                            style={{ ['--tw-ring-color' as string]: brandColor }}
                        >
                            {RTO_OPTIONS.map((opt) => (
                                <option key={opt.label} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Read-only computed fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                            <p className="text-xs text-gray-400 mb-0.5">Insurance (3.5% — read-only)</p>
                            <p className="text-sm font-semibold text-gray-800">{formatINR(insurance)}</p>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                            <p className="text-xs text-gray-400 mb-0.5">
                                TCS {exShowroom > 1000000 ? '(1% — above ₹10L)' : '(0% — below ₹10L)'}
                            </p>
                            <p className="text-sm font-semibold text-gray-800">{formatINR(tcs)}</p>
                        </div>
                    </div>

                    {/* Accessories */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Accessories / Extras (₹)
                        </label>
                        <input
                            type="number"
                            min={0}
                            step={500}
                            value={accessories}
                            onChange={(e) => setAccessories(Math.max(0, Number(e.target.value)))}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2"
                            style={{ ['--tw-ring-color' as string]: brandColor }}
                        />
                    </div>

                    {/* Total box */}
                    <div
                        className="rounded-2xl px-6 py-5 text-white"
                        style={{ backgroundColor: brandColor }}
                    >
                        <p className="text-sm font-medium opacity-80 mb-1">Total On-Road Price</p>
                        <p className="text-3xl font-bold">{formatINR(total)}</p>
                        <p className="text-sm opacity-70 mt-1">{formatLakhs(total)}</p>
                    </div>

                    {/* Breakdown table */}
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Component</th>
                                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {breakdown.map((row, i) => (
                                    <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-4 py-2.5 text-gray-700">{row.label}</td>
                                        <td className="px-4 py-2.5 text-right font-medium text-gray-800">
                                            {formatINR(row.amount)}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="border-t border-gray-200 font-bold">
                                    <td className="px-4 py-3 text-gray-900">Total On-Road Price</td>
                                    <td className="px-4 py-3 text-right" style={{ color: brandColor }}>
                                        {formatINR(total)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* CTA */}
                    {dealerPhone && (
                        <div className="text-center">
                            <a
                                href={`tel:${dealerPhone}`}
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-base shadow-lg hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: brandColor }}
                            >
                                <PhoneCall className="w-5 h-5" />
                                Get Exact On-Road Price
                            </a>
                        </div>
                    )}

                    {!dealerPhone && (
                        <div className="text-center">
                            <div
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium"
                                style={{ backgroundColor: `${brandColor}15`, color: brandColor }}
                            >
                                <Calculator className="w-4 h-4" />
                                Contact dealer for exact pricing
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

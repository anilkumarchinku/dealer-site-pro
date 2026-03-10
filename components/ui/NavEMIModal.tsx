'use client';

/**
 * NavEMIModal
 * EMI Calculator accessible from the navbar.
 * Lets users pick a model → variant (with ex-showroom price auto-filled),
 * then calculates monthly EMI based on down payment / tenure / rate.
 */

import { useState, useMemo } from 'react';
import { X, Calculator, ChevronDown } from 'lucide-react';
import type { Car } from '@/lib/types/car';

interface NavEMIModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    brandColor: string;
    cars: Car[];
}

function calcEMI(principal: number, annualRate: number, months: number): number {
    if (principal <= 0 || months <= 0) return 0;
    const r = annualRate / 12 / 100;
    if (r === 0) return principal / months;
    return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
}

function fmt(n: number) {
    return '₹' + n.toLocaleString('en-IN');
}

export function NavEMIModal({ open, onOpenChange, brandColor, cars }: NavEMIModalProps) {
    // ── Unique models from cars prop ────────────────────────────────────────
    // Use \0 as separator so multi-word makes (e.g. "Maruti Suzuki") are handled correctly
    const models = useMemo(() => {
        const seen = new Set<string>();
        const out: Array<{ key: string; label: string }> = [];
        cars.forEach(c => {
            const key = `${c.make}\0${c.model}`;
            if (!seen.has(key)) { seen.add(key); out.push({ key, label: `${c.make} ${c.model}` }); }
        });
        return out;
    }, [cars]);

    // ── State ───────────────────────────────────────────────────────────────
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(-1);
    const [downPayment, setDownPayment] = useState(100000);
    const [tenure, setTenure] = useState(60);
    const [rate, setRate] = useState(9);

    // ── Variants for selected model ─────────────────────────────────────────
    const variants = useMemo(() => {
        if (!selectedModel) return [];
        const [make, model] = selectedModel.split('\0');
        return cars.filter(c => c.make === make && c.model === model);
    }, [selectedModel, cars]);

    // ── Selected car & price ────────────────────────────────────────────────
    const selectedCar = selectedVariantIdx >= 0 ? variants[selectedVariantIdx] : null;
    const exShowroom = selectedCar?.pricing?.exShowroom?.min ?? 0;

    // When model changes reset variant and down payment
    const handleModelChange = (model: string) => {
        setSelectedModel(model);
        setSelectedVariantIdx(-1);
        setDownPayment(100000);
    };

    const handleVariantChange = (idx: number) => {
        setSelectedVariantIdx(idx);
        const car = variants[idx];
        const price = car?.pricing?.exShowroom?.min ?? 0;
        // default down payment = 20% of ex-showroom
        setDownPayment(Math.round(price * 0.2));
    };

    const principal = Math.max(0, exShowroom - downPayment);
    const monthlyEMI = calcEMI(principal, rate, tenure);
    const totalPayable = monthlyEMI * tenure + downPayment;
    const totalInterest = totalPayable - exShowroom;

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
        >
            <div
                className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100" style={{ borderTop: `4px solid ${brandColor}` }}>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${brandColor}15` }}>
                            <Calculator className="w-4 h-4" style={{ color: brandColor }} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">EMI Calculator</h2>
                            <p className="text-xs text-gray-500">Select model &amp; variant to get started</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-5 space-y-5">

                    {/* Model + Variant selectors */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Select Model</label>
                            <div className="relative">
                                <select
                                    value={selectedModel}
                                    onChange={e => handleModelChange(e.target.value)}
                                    className="w-full appearance-none px-3 py-2.5 pr-8 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-blue-400 cursor-pointer"
                                >
                                    <option value="">-- Choose Model --</option>
                                    {models.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Select Variant</label>
                            <div className="relative">
                                <select
                                    value={selectedVariantIdx}
                                    onChange={e => handleVariantChange(Number(e.target.value))}
                                    disabled={variants.length === 0}
                                    className="w-full appearance-none px-3 py-2.5 pr-8 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-blue-400 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <option value="-1">-- Choose Variant --</option>
                                    {variants.map((v, i) => {
                                        const price = v.pricing?.exShowroom?.min;
                                        const label = v.variant
                                            ? `${v.variant}${price ? ` — ₹${(price / 100000).toFixed(2)}L` : ''}`
                                            : `Base${price ? ` — ₹${(price / 100000).toFixed(2)}L` : ''}`;
                                        return <option key={i} value={i}>{label}</option>;
                                    })}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Ex-showroom price pill */}
                    {exShowroom > 0 && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ borderColor: `${brandColor}40`, backgroundColor: `${brandColor}08` }}>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">Ex-Showroom Price</p>
                                <p className="text-xl font-bold" style={{ color: brandColor }}>{fmt(exShowroom)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Loan Amount</p>
                                <p className="text-base font-semibold text-gray-800">{fmt(principal)}</p>
                            </div>
                        </div>
                    )}

                    {/* Down Payment slider */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Down Payment</label>
                            <span className="text-sm font-bold" style={{ color: brandColor }}>{fmt(downPayment)}</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={exShowroom > 0 ? Math.floor(exShowroom * 0.8) : 2000000}
                            step={5000}
                            value={downPayment}
                            onChange={e => setDownPayment(Number(e.target.value))}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer"
                            style={{ accentColor: brandColor }}
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                            <span>₹0</span>
                            <span>{exShowroom > 0 ? `₹${((exShowroom * 0.8) / 100000).toFixed(1)}L` : '₹20L'}</span>
                        </div>
                    </div>

                    {/* Tenure + Rate */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Tenure (Months)</label>
                            <div className="relative">
                                <select
                                    value={tenure}
                                    onChange={e => setTenure(Number(e.target.value))}
                                    className="w-full appearance-none px-3 py-2.5 pr-8 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-blue-400"
                                >
                                    {[12, 24, 36, 48, 60, 72, 84].map(m => (
                                        <option key={m} value={m}>{m} months ({m / 12} yr{m > 12 ? 's' : ''})</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Interest Rate (%)</label>
                            <input
                                type="number"
                                min={6}
                                max={20}
                                step={0.1}
                                value={rate}
                                onChange={e => setRate(Number(e.target.value))}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                    </div>

                    {/* EMI Result */}
                    {monthlyEMI > 0 && (
                        <div className="rounded-xl p-4 text-white" style={{ backgroundColor: brandColor }}>
                            <p className="text-sm font-medium opacity-80 mb-1">Monthly EMI</p>
                            <p className="text-4xl font-black tracking-tight">{fmt(monthlyEMI)}<span className="text-base font-normal opacity-70 ml-1">/mo</span></p>
                            <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-3 gap-2 text-xs">
                                <div>
                                    <p className="opacity-70">Loan Amount</p>
                                    <p className="font-semibold">{fmt(principal)}</p>
                                </div>
                                <div>
                                    <p className="opacity-70">Total Interest</p>
                                    <p className="font-semibold">{fmt(totalInterest > 0 ? totalInterest : 0)}</p>
                                </div>
                                <div>
                                    <p className="opacity-70">Total Payable</p>
                                    <p className="font-semibold">{fmt(totalPayable)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

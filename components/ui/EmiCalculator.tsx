'use client';

import { useState, useEffect, useCallback } from 'react';

interface EmiCalculatorProps {
    /** Brand accent color (hex) used for highlights, sliders, result card */
    brandColor: string;
    /** Visual theme — pass 'dark' for black/dark-bg templates (Luxury, Sporty) */
    theme?: 'light' | 'dark';
}

interface EmiResult {
    emi: number;
    loanAmount: number;
    totalInterest: number;
    totalPayable: number;
    principalPct: number;
}

function toIN(n: number) {
    return Math.round(n).toLocaleString('en-IN');
}

export function EmiCalculator({ brandColor, theme = 'light' }: EmiCalculatorProps) {
    const dark = theme === 'dark';

    /* ── Inputs ── */
    const [price,    setPrice]    = useState(1000000);
    const [down,     setDown]     = useState(200000);
    const [tenure,   setTenure]   = useState(60);   // months
    const [rate,     setRate]     = useState(9.5);  // % p.a.

    /* ── Result ── */
    const [result, setResult] = useState<EmiResult | null>(null);

    /* ── Live calculation ── */
    const calculate = useCallback(() => {
        const loan = Math.max(0, price - down);
        if (loan <= 0 || tenure <= 0 || rate <= 0) { setResult(null); return; }

        const r   = rate / 12 / 100;
        const emi = (loan * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1);
        const totalPayable  = emi * tenure;
        const totalInterest = totalPayable - loan;
        const principalPct  = Math.round((loan / totalPayable) * 100);

        setResult({
            emi:           Math.round(emi),
            loanAmount:    Math.round(loan),
            totalInterest: Math.round(totalInterest),
            totalPayable:  Math.round(totalPayable),
            principalPct,
        });
    }, [price, down, tenure, rate]);

    useEffect(() => { calculate(); }, [calculate]);

    /* ── Styles ── */
    const card        = dark ? 'bg-white/5 border-white/10'   : 'bg-gray-50 border-gray-200';
    const label       = dark ? 'text-gray-400'                : 'text-gray-500';
    const inputCls    = dark
        ? 'bg-white/10 border-white/20 text-white focus:border-white/50'
        : 'bg-white border-gray-300 text-gray-900 focus:border-gray-400';
    const resultCard  = dark ? 'bg-black/40 border-white/10' : 'bg-white border-gray-200 shadow-sm';
    const resultLabel = dark ? 'text-gray-400'               : 'text-gray-500';
    const resultVal   = dark ? 'text-white'                  : 'text-gray-900';
    const divider     = dark ? 'border-white/10'             : 'border-gray-100';
    const trackBg     = dark ? '#ffffff22'                   : '#e5e7eb';

    /* Progress: % of slider filled */
    const tenurePct  = ((tenure - 12) / (84 - 12)) * 100;
    const ratePct    = ((rate - 6) / (20 - 6)) * 100;

    return (
        <div className={`rounded-2xl border p-6 md:p-8 ${card}`}>
            <div className="grid md:grid-cols-2 gap-8">

                {/* ── Left: Inputs ── */}
                <div className="space-y-6">

                    {/* Vehicle Price */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className={`text-xs font-semibold uppercase tracking-wider ${label}`}>
                                Vehicle Price
                            </label>
                            <span className="text-sm font-bold" style={{ color: brandColor }}>
                                ₹{toIN(price)}
                            </span>
                        </div>
                        <input
                            type="number"
                            min={100000}
                            max={10000000}
                            step={50000}
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-colors ${inputCls}`}
                            placeholder="10,00,000"
                        />
                    </div>

                    {/* Down Payment */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className={`text-xs font-semibold uppercase tracking-wider ${label}`}>
                                Down Payment
                            </label>
                            <span className="text-sm font-bold" style={{ color: brandColor }}>
                                ₹{toIN(down)}
                            </span>
                        </div>
                        <input
                            type="number"
                            min={0}
                            max={price - 1}
                            step={10000}
                            value={down}
                            onChange={(e) => setDown(Math.min(Number(e.target.value), price - 1))}
                            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-colors ${inputCls}`}
                            placeholder="2,00,000"
                        />
                    </div>

                    {/* Loan Tenure — slider */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className={`text-xs font-semibold uppercase tracking-wider ${label}`}>
                                Loan Tenure
                            </label>
                            <span className="text-sm font-bold" style={{ color: brandColor }}>
                                {tenure} mo &nbsp;·&nbsp; {(tenure / 12).toFixed(tenure % 12 === 0 ? 0 : 1)} yrs
                            </span>
                        </div>
                        <input
                            type="range"
                            min={12} max={84} step={6}
                            value={tenure}
                            onChange={(e) => setTenure(Number(e.target.value))}
                            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, ${brandColor} ${tenurePct}%, ${trackBg} ${tenurePct}%)`,
                                accentColor: brandColor,
                            }}
                        />
                        <div className={`flex justify-between text-[11px] mt-1.5 ${label}`}>
                            <span>1 yr</span><span>3 yrs</span><span>5 yrs</span><span>7 yrs</span>
                        </div>
                    </div>

                    {/* Interest Rate — slider */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className={`text-xs font-semibold uppercase tracking-wider ${label}`}>
                                Interest Rate (p.a.)
                            </label>
                            <span className="text-sm font-bold" style={{ color: brandColor }}>
                                {rate.toFixed(1)}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min={6} max={20} step={0.5}
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, ${brandColor} ${ratePct}%, ${trackBg} ${ratePct}%)`,
                                accentColor: brandColor,
                            }}
                        />
                        <div className={`flex justify-between text-[11px] mt-1.5 ${label}`}>
                            <span>6%</span><span>10%</span><span>15%</span><span>20%</span>
                        </div>
                    </div>
                </div>

                {/* ── Right: Results ── */}
                <div>
                    {result ? (
                        <div className={`rounded-xl border h-full flex flex-col p-6 ${resultCard}`}>

                            {/* Monthly EMI — hero */}
                            <div className="text-center pb-5 mb-5" style={{ borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#f0f0f0'}` }}>
                                <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${resultLabel}`}>Monthly EMI</p>
                                <p className="text-5xl font-bold leading-none" style={{ color: brandColor }}>
                                    ₹{toIN(result.emi)}
                                </p>
                                <p className={`text-xs mt-1.5 ${resultLabel}`}>per month for {tenure} months</p>
                            </div>

                            {/* Breakdown */}
                            <div className="space-y-3 flex-1">
                                <div className="flex justify-between text-sm">
                                    <span className={resultLabel}>Loan Amount</span>
                                    <span className={`font-semibold ${resultVal}`}>₹{toIN(result.loanAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className={resultLabel}>Total Interest</span>
                                    <span className={`font-semibold ${resultVal}`}>₹{toIN(result.totalInterest)}</span>
                                </div>
                                <div className={`flex justify-between text-sm pt-3 border-t ${divider}`}>
                                    <span className={`font-semibold ${resultLabel}`}>Total Payable</span>
                                    <span className={`font-bold text-base ${resultVal}`}>₹{toIN(result.totalPayable)}</span>
                                </div>
                            </div>

                            {/* Principal vs Interest bar */}
                            <div className="mt-5">
                                <div className="flex justify-between text-[11px] mb-1.5">
                                    <span className={`flex items-center gap-1 ${resultLabel}`}>
                                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: brandColor }} />
                                        Principal {result.principalPct}%
                                    </span>
                                    <span className={`flex items-center gap-1 ${resultLabel}`}>
                                        Interest {100 - result.principalPct}%
                                        <span className={`w-2 h-2 rounded-full inline-block ${dark ? 'bg-white/20' : 'bg-gray-200'}`} />
                                    </span>
                                </div>
                                <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-white/10' : 'bg-gray-100'}`}>
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ width: `${result.principalPct}%`, backgroundColor: brandColor }}
                                    />
                                </div>
                            </div>

                            <p className={`text-[10px] leading-relaxed mt-4 ${resultLabel}`}>
                                * Indicative only. Actual EMI may vary based on lender terms, processing fees &amp; credit profile.
                            </p>
                        </div>
                    ) : (
                        <div className={`rounded-xl border h-full min-h-[280px] flex flex-col items-center justify-center p-6 text-center ${resultCard}`}>
                            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                                style={{ backgroundColor: `${brandColor}20` }}>
                                <span className="text-2xl">💰</span>
                            </div>
                            <p className={`text-sm font-medium ${resultLabel}`}>
                                Enter a valid vehicle price and down payment to see your EMI breakdown
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * EVSection
 * Shown on dealer sites when EV inventory is present.
 * Features:
 *   - EV car grid (filtered)
 *   - Range calculator (km/day → days per charge)
 *   - Nearby charging stations map embed (PlugShare / EVCS)
 *   - Govt incentives quick-reference (FAME-II, state subsidy)
 */

'use client';

import { useState } from 'react';
import { Zap, MapPin, IndianRupee, ChevronDown, ChevronUp } from 'lucide-react';
import type { Car } from '@/lib/types/car';
import { Button } from '@/components/ui/button';

interface EVSectionProps {
    cars: Car[];
    contactInfo: { address?: string; city?: string };
    brandColor?: string;
}

// Popular EV models with range data (km)
const EV_RANGE_DB: Record<string, number> = {
    'Tata Nexon EV': 465,
    'Tata Tiago EV': 315,
    'Tata Punch EV': 421,
    'MG ZS EV': 461,
    'Hyundai Creta EV': 473,
    'Hyundai Ioniq 5': 631,
    'Kia EV6': 708,
    'BYD Atto 3': 521,
    'Mahindra XEV 9e': 656,
    'Ola S1 Pro': 181,  // scooter
};

// FAME-II & top state incentives
const INCENTIVES = [
    { title: 'FAME-II Subsidy',       amount: '₹10,000–1.5 lakh', note: 'on select electric 2W/3W/4W' },
    { title: 'Delhi EV Policy',       amount: 'Up to ₹1.5 lakh',  note: '+ road tax & registration waiver' },
    { title: 'Maharashtra EV Policy', amount: 'Up to ₹2.5 lakh',  note: 'on EV purchase + GST rebate' },
    { title: 'Gujarat EV Policy',     amount: 'Up to ₹1.5 lakh',  note: 'for 4W EVs + registration waiver' },
    { title: 'Income Tax Section 80EEB', amount: '₹1.5 lakh',     note: 'deduction on EV loan interest' },
];

function RangeCalculator({ brandColor }: { brandColor: string }) {
    const [kmPerDay, setKmPerDay] = useState(40);
    const [selectedRange, setSelectedRange] = useState(400);

    const daysPerCharge = Math.round(selectedRange / kmPerDay);
    const chargesPerMonth = Math.round(30 / daysPerCharge);
    const annualSavings = Math.round((kmPerDay * 365 * 7) / 25);  // vs petrol at ₹105/l, 15 kmpl

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5" style={{ color: brandColor }} />
                <h3 className="font-bold text-gray-900">Range Calculator</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                        <span>Daily driving distance</span>
                        <span className="font-bold" style={{ color: brandColor }}>{kmPerDay} km/day</span>
                    </div>
                    <input
                        type="range" min={10} max={150} step={5} value={kmPerDay}
                        onChange={e => setKmPerDay(Number(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gray-200"
                        style={{ accentColor: brandColor }}
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>10 km</span><span>150 km</span></div>
                </div>

                <div>
                    <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                        <span>EV Range (ARAI)</span>
                        <span className="font-bold" style={{ color: brandColor }}>{selectedRange} km</span>
                    </div>
                    <input
                        type="range" min={150} max={750} step={25} value={selectedRange}
                        onChange={e => setSelectedRange(Number(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gray-200"
                        style={{ accentColor: brandColor }}
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>150 km</span><span>750 km</span></div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="text-center bg-gray-50 rounded-xl p-3">
                        <p className="text-xl font-black" style={{ color: brandColor }}>{daysPerCharge}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">Days per charge</p>
                    </div>
                    <div className="text-center bg-gray-50 rounded-xl p-3">
                        <p className="text-xl font-black" style={{ color: brandColor }}>{chargesPerMonth}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">Charges/month</p>
                    </div>
                    <div className="text-center bg-emerald-50 rounded-xl p-3">
                        <p className="text-xl font-black text-emerald-600">₹{(annualSavings / 1000).toFixed(0)}k</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">Annual savings*</p>
                    </div>
                </div>
                <p className="text-[10px] text-gray-400">* vs petrol at ₹105/L, 15 km/L. Electricity at ₹8/unit.</p>
            </div>
        </div>
    );
}

function IncentivesAccordion({ brandColor }: { brandColor: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
                <div className="flex items-center gap-2">
                    <IndianRupee className="w-5 h-5" style={{ color: brandColor }} />
                    <span className="font-bold text-gray-900">Govt. EV Incentives & Subsidies</span>
                </div>
                {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {open && (
                <div className="px-6 pb-5 space-y-3">
                    {INCENTIVES.map((inc, i) => (
                        <div key={i} className="flex items-start justify-between gap-3 py-2.5 border-t border-gray-100">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{inc.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{inc.note}</p>
                            </div>
                            <span className="text-sm font-bold shrink-0" style={{ color: brandColor }}>{inc.amount}</span>
                        </div>
                    ))}
                    <p className="text-[11px] text-gray-400 pt-1">Subsidies subject to change. Verify with RTO / dealer.</p>
                </div>
            )}
        </div>
    );
}

export function EVSection({ cars, contactInfo, brandColor = '#10b981' }: EVSectionProps) {
    const evCars = cars.filter(c =>
        c.engine?.type?.toLowerCase().includes('electric') ||
        c.make?.toLowerCase().includes('ola') ||
        c.make?.toLowerCase().includes('ather')
    );

    if (evCars.length === 0) return null;

    const city = contactInfo.city ?? contactInfo.address ?? 'India';
    const mapQuery = `EV charging station near ${city}`;

    return (
        <section className="py-16 bg-gradient-to-br from-emerald-50 to-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5" style={{ color: brandColor }} />
                    <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: brandColor }}>Electric Vehicles</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Go Electric</h2>
                <p className="text-gray-600 mb-8 max-w-xl">
                    Lower fuel costs, zero emissions, govt. incentives up to ₹2.5 lakh. Make the switch today.
                </p>

                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    <RangeCalculator brandColor={brandColor} />
                    <IncentivesAccordion brandColor={brandColor} />
                </div>

                {/* Charging Map */}
                <div className="rounded-2xl overflow-hidden border border-emerald-200 mb-8">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border-b border-emerald-100">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800">EV Charging Stations near {city}</span>
                    </div>
                    <div className="h-56">
                        <iframe
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                            className="w-full h-full"
                            loading="lazy"
                            title="EV charging stations map"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>

                {/* EV Cars CTA */}
                <div className="text-center">
                    <p className="text-gray-600 text-sm mb-3">We have {evCars.length} electric vehicle{evCars.length !== 1 ? 's' : ''} in stock</p>
                    <Button style={{ backgroundColor: brandColor }} className="gap-2 text-white">
                        <Zap className="w-4 h-4" />
                        View EV Inventory
                    </Button>
                </div>
            </div>
        </section>
    );
}

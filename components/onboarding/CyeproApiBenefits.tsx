"use client";

import { Check, Minus, RefreshCw, ShieldCheck, UploadCloud, Users, Zap } from "lucide-react";

const benefits = [
    {
        icon: Users,
        title: "Website leads go to Cyepro CRM",
        description: "Buyer enquiries from the website can land in the dealer's Cyepro lead workflow.",
    },
    {
        icon: RefreshCw,
        title: "Live stock sync where enabled",
        description: "Vehicle updates can reflect from Cyepro without rebuilding the website manually.",
    },
    {
        icon: UploadCloud,
        title: "Less Excel / CSV work",
        description: "Dealers avoid repeated uploads when their Cyepro inventory is already maintained.",
    },
    {
        icon: ShieldCheck,
        title: "Cleaner buyer experience",
        description: "Sold and updated vehicles can stay cleaner on the public website when sync is active.",
    },
];

const comparisonRows = [
    { label: "New website leads", cyepro: "Auto-route to CRM", manual: "Follow up manually" },
    { label: "Stock changes", cyepro: "Sync from Cyepro", manual: "Edit or upload again" },
    { label: "Setup effort", cyepro: "One API key", manual: "Ongoing file work" },
];

export function CyeproApiBenefits() {
    return (
        <aside className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-emerald-200 bg-white text-emerald-700">
                    <Zap className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-sm font-black text-[#071436]">Why connect Cyepro?</p>
                    <p className="mt-1 text-xs font-medium leading-5 text-[#62708A]">
                        The API key connects the dealer website with Cyepro, so leads and stock can work together instead of becoming double entry.
                    </p>
                </div>
            </div>

            <div className="mt-4 grid gap-2">
                {benefits.map((benefit) => (
                    <div key={benefit.title} className="flex gap-3 rounded-md border border-emerald-100 bg-white/80 p-3">
                        <benefit.icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                        <div>
                            <p className="text-xs font-black text-[#071436]">{benefit.title}</p>
                            <p className="mt-0.5 text-[11px] font-medium leading-4 text-[#62708A]">{benefit.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-md border border-[#E3E9F2] bg-white">
                <div className="grid grid-cols-[1.15fr_1fr_1fr] gap-2 bg-[#F7F9FC] px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em]">
                    <span className="text-[#62708A]">Impact</span>
                    <span className="text-emerald-700">Cyepro</span>
                    <span className="text-[#62708A]">Manual</span>
                </div>
                {comparisonRows.map((row) => (
                    <div key={row.label} className="grid grid-cols-[1.15fr_1fr_1fr] gap-2 border-t border-[#F0F3F8] px-3 py-2.5 text-[11px]">
                        <span className="font-bold text-[#071436]">{row.label}</span>
                        <span className="flex items-start gap-1.5 font-semibold text-emerald-700">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            <span>{row.cyepro}</span>
                        </span>
                        <span className="flex items-start gap-1.5 font-medium text-[#62708A]">
                            <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A4B0C2]" />
                            <span>{row.manual}</span>
                        </span>
                    </div>
                ))}
            </div>
        </aside>
    );
}

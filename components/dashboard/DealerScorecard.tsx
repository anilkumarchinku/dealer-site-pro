/**
 * DealerScorecard
 * Dealer performance scorecard shown on the main dashboard.
 * Calculates a composite score (0–100) across 5 pillars:
 *   1. Inventory Completeness  (25 pts)
 *   2. Lead Response Speed     (20 pts)
 *   3. Customer Reviews        (20 pts)
 *   4. Profile Completeness    (20 pts)
 *   5. Verification Status     (15 pts)
 */

'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Car, Users, Star, ShieldCheck, BadgeInfo, ChevronDown, ChevronUp } from 'lucide-react';

interface ScorecardData {
    inventoryScore: number;       // 0–25: based on # active listings
    leadScore: number;            // 0–20: based on lead response rate
    reviewScore: number;          // 0–20: based on avg rating & count
    profileScore: number;         // 0–20: based on profile fields filled
    verificationScore: number;    // 0–15: 0 or 15
}

interface DealerScorecardProps {
    dealerId: string;
    inventoryCount?: number;
    leadsCount?: number;
    isVerified?: boolean;
    avgRating?: number;
    reviewCount?: number;
    /** Whether dealer has filled key profile fields */
    profileComplete?: boolean;
}

function scoreColor(score: number): string {
    if (score >= 80) return '#10b981';  // emerald
    if (score >= 60) return '#f59e0b';  // amber
    return '#ef4444';                   // red
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
    const r = (size / 2) - 8;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    const color = scoreColor(score);

    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={8} />
            <circle
                cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={color} strokeWidth={8}
                strokeDasharray={`${circ}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
        </svg>
    );
}

interface PillarRowProps {
    icon: React.ReactNode;
    label: string;
    score: number;
    max: number;
    tip: string;
}

function PillarRow({ icon, label, score, max, tip }: PillarRowProps) {
    const pct = (score / max) * 100;
    const color = scoreColor(pct);
    return (
        <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-500">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">{label}</span>
                    <span className="text-xs font-bold" style={{ color }}>{score}/{max}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                </div>
            </div>
            <div className="relative group">
                <BadgeInfo className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute right-0 bottom-5 w-52 bg-gray-900 text-white text-[11px] rounded-lg p-2.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 leading-relaxed shadow-xl">
                    {tip}
                </div>
            </div>
        </div>
    );
}

export function DealerScorecard({
    inventoryCount = 0,
    leadsCount = 0,
    isVerified = false,
    avgRating = 0,
    reviewCount = 0,
    profileComplete = false,
}: DealerScorecardProps) {
    const [expanded, setExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true) }, []);

    // ── Score calculations ──────────────────────────────────────────────────
    // Inventory: 5 pts per listing, max 25
    const inventoryScore = Math.min(25, inventoryCount * 5);

    // Leads: assume dealers with leads are responding (simplified — real impl reads response_time from DB)
    // 20 pts if ≥5 leads handled, 10 pts for 1–4
    const leadScore = leadsCount >= 5 ? 20 : leadsCount >= 1 ? 10 : 0;

    // Reviews: avg 4.5+ = 20, 4+ = 15, 3+ = 10, has any = 5
    const reviewScore = avgRating >= 4.5 && reviewCount >= 3 ? 20
        : avgRating >= 4.0 && reviewCount >= 2 ? 15
        : avgRating >= 3.0 && reviewCount >= 1 ? 10
        : reviewCount >= 1 ? 5 : 0;

    // Profile: simple heuristic passed in
    const profileScore = profileComplete ? 20 : 10;

    // Verification: binary
    const verScore = isVerified ? 15 : 0;

    const total = inventoryScore + leadScore + reviewScore + profileScore + verScore;

    const grade = total >= 90 ? 'A+' : total >= 80 ? 'A' : total >= 70 ? 'B' : total >= 60 ? 'C' : 'D';
    const gradeLabel = total >= 80 ? 'Excellent' : total >= 60 ? 'Good' : total >= 40 ? 'Needs Work' : 'Getting Started';

    const mainColor = scoreColor(total);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-900">Performance Score</span>
                </div>
                <button
                    onClick={() => setExpanded(e => !e)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>

            {/* Score Ring + Summary */}
            <div className="flex items-center gap-5 px-5 py-5">
                <div className="relative shrink-0">
                    {mounted && <ScoreRing score={total} size={80} />}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-black" style={{ color: mainColor }}>{grade}</span>
                        <span className="text-[10px] text-gray-500 font-medium">{total}/100</span>
                    </div>
                </div>
                <div>
                    <p className="text-base font-bold text-gray-900">{gradeLabel}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {total >= 80
                            ? 'Your dealership profile is performing great. Keep it up!'
                            : total >= 60
                                ? 'Good progress! A few more steps to reach the top tier.'
                                : 'Complete your profile to attract more buyers.'}
                    </p>
                </div>
            </div>

            {/* Pillars — expandable */}
            {expanded && (
                <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
                    <PillarRow
                        icon={<Car className="w-4 h-4" />}
                        label="Inventory" score={inventoryScore} max={25}
                        tip={`Add at least 5 vehicles to earn full points. You have ${inventoryCount} listing${inventoryCount !== 1 ? 's' : ''}.`}
                    />
                    <PillarRow
                        icon={<Users className="w-4 h-4" />}
                        label="Lead Activity" score={leadScore} max={20}
                        tip="Earn points by receiving and responding to buyer leads."
                    />
                    <PillarRow
                        icon={<Star className="w-4 h-4" />}
                        label="Customer Reviews" score={reviewScore} max={20}
                        tip={`Collect 3+ reviews with 4.5+ stars for max points. Current: ${reviewCount} reviews, ${avgRating || '—'} avg rating.`}
                    />
                    <PillarRow
                        icon={<BadgeInfo className="w-4 h-4" />}
                        label="Profile Completeness" score={profileScore} max={20}
                        tip="Fill in your dealership name, address, phone, email, logo, and working hours."
                    />
                    <PillarRow
                        icon={<ShieldCheck className="w-4 h-4" />}
                        label="DealerSite Verified" score={verScore} max={15}
                        tip="Complete the Verified Dealer checklist to earn the badge and 15 bonus points."
                    />
                </div>
            )}
        </div>
    );
}

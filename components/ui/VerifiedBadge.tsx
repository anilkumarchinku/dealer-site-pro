'use client'

import { ShieldCheck } from 'lucide-react'

interface VerifiedBadgeProps {
    /** 'hero' = large badge for dealer site header, 'card' = small inline badge */
    variant?: 'hero' | 'card'
    className?: string
}

export function VerifiedBadge({ variant = 'card', className }: VerifiedBadgeProps) {
    if (variant === 'hero') {
        return (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 ${className ?? ''}`}>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-600">DealerSite Verified</span>
            </div>
        )
    }

    return (
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 ${className ?? ''}`}>
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-semibold text-emerald-600">Verified</span>
        </div>
    )
}

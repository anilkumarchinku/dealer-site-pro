'use client';

import * as React from 'react';
import { useScrollReveal } from '@/lib/hooks/useScrollReveal';

export interface CountUpProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Final display value, may include a suffix/prefix e.g. "500+", "10k+", "4.9", "₹2.5L". */
    value: string;
    /** Animation duration in ms. Default 1500. */
    durationMs?: number;
}

/** Splits "10k+" into { prefix:"", num:10, decimals:0, suffix:"k+" }. */
function parseValue(value: string) {
    const match = value.match(/^(\D*)([\d,]*\.?\d+)(.*)$/);
    if (!match) return null;
    const [, prefix, numRaw, suffix] = match;
    const numericStr = numRaw.replace(/,/g, '');
    const num = parseFloat(numericStr);
    if (Number.isNaN(num)) return null;
    const dot = numericStr.indexOf('.');
    const decimals = dot === -1 ? 0 : numericStr.length - dot - 1;
    return { prefix, num, decimals, suffix };
}

/**
 * Animates a number counting up from 0 to its target when scrolled into view.
 * Preserves any prefix/suffix (e.g. "10k+", "4.9") and the original decimal places.
 * Falls back to the static value under reduced motion or if the value can't be parsed.
 */
export function CountUp({ value, durationMs = 1500, ...props }: CountUpProps) {
    const parsed = React.useMemo(() => parseValue(value), [value]);
    const { ref, isRevealed } = useScrollReveal<HTMLSpanElement>();
    const [display, setDisplay] = React.useState(value);

    React.useEffect(() => {
        if (!parsed || !isRevealed) return;

        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || typeof requestAnimationFrame === 'undefined') {
            setDisplay(value);
            return;
        }

        let raf = 0;
        let start: number | null = null;
        const { prefix, num, decimals, suffix } = parsed;

        const tick = (now: number) => {
            if (start === null) start = now;
            const progress = Math.min((now - start) / durationMs, 1);
            // easeOutCubic for a natural deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = (num * eased).toFixed(decimals);
            setDisplay(`${prefix}${current}${suffix}`);
            if (progress < 1) raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [parsed, isRevealed, value, durationMs]);

    // If unparseable, just render the value as-is (no ref needed).
    if (!parsed) return <span {...props}>{value}</span>;

    return (
        <span ref={ref} {...props}>
            {display}
        </span>
    );
}

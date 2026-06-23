'use client';

import { useEffect, useRef, useState } from 'react';

export interface UseScrollRevealOptions {
    /** Fraction of the element that must be visible before revealing (0–1). Default 0.15. */
    threshold?: number;
    /** Margin around the root viewport, e.g. "0px 0px -10% 0px" to trigger slightly early. */
    rootMargin?: string;
    /** Reveal only the first time the element enters the viewport. Default true. */
    once?: boolean;
}

/**
 * Reveals an element when it scrolls into view.
 *
 * Returns a `ref` to attach to the target and an `isRevealed` flag. Pair with the
 * `.reveal-on-scroll` CSS class (see globals.css) — add `.revealed` when `isRevealed`
 * is true. Falls back to revealed-immediately when IntersectionObserver is unavailable
 * or the user prefers reduced motion, so content is never left hidden.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
    options: UseScrollRevealOptions = {}
) {
    const { threshold = 0.15, rootMargin = '0px 0px -10% 0px', once = true } = options;
    const ref = useRef<T>(null);
    const [isRevealed, setIsRevealed] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        // Respect reduced-motion and environments without IntersectionObserver:
        // show content right away.
        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
            setIsRevealed(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsRevealed(true);
                        if (once) observer.unobserve(entry.target);
                    } else if (!once) {
                        setIsRevealed(false);
                    }
                });
            },
            { threshold, rootMargin }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return { ref, isRevealed };
}

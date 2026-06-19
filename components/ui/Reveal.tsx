'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useScrollReveal, type UseScrollRevealOptions } from '@/lib/hooks/useScrollReveal';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale';

export interface RevealProps
    extends React.HTMLAttributes<HTMLDivElement>,
        UseScrollRevealOptions {
    /** Direction the element animates in from. Default "up". */
    direction?: RevealDirection;
    /** Delay before the reveal transition starts, in milliseconds. */
    delay?: number;
    /** Render as a different element/component while keeping reveal behavior. */
    as?: React.ElementType;
}

/**
 * Wraps content so it fades/slides in when scrolled into view.
 *
 * Visual-only: it adds the `.reveal-on-scroll` class (and `.revealed` once visible)
 * defined in globals.css. Honors reduced-motion via useScrollReveal. Children render
 * normally; layout is unchanged.
 */
export const Reveal = React.forwardRef<HTMLDivElement, RevealProps>(
    (
        {
            direction = 'up',
            delay,
            as: Component = 'div',
            threshold,
            rootMargin,
            once,
            className,
            style,
            children,
            ...props
        },
        forwardedRef
    ) => {
        const { ref, isRevealed } = useScrollReveal<HTMLDivElement>({ threshold, rootMargin, once });

        // Merge the internal observer ref with any forwarded ref.
        React.useImperativeHandle(forwardedRef, () => ref.current as HTMLDivElement);

        return (
            <Component
                ref={ref}
                className={cn('reveal-on-scroll', `reveal-${direction}`, isRevealed && 'revealed', className)}
                style={delay != null ? { ...style, transitionDelay: `${delay}ms` } : style}
                {...props}
            >
                {children}
            </Component>
        );
    }
);
Reveal.displayName = 'Reveal';

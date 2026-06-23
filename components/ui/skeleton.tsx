import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Animation style. "shimmer" sweeps a highlight across; "pulse" fades in/out. Default "shimmer". */
    variant?: 'shimmer' | 'pulse';
}

/**
 * Loading placeholder. Size and shape it with className (e.g. "h-48 w-full rounded-xl").
 *
 * "shimmer" reuses the `.shimmer` keyframes from globals.css over a muted base;
 * "pulse" uses Tailwind's animate-pulse. Purely presentational.
 */
export function Skeleton({ variant = 'shimmer', className, ...props }: SkeletonProps) {
    if (variant === 'pulse') {
        return <div className={cn('animate-pulse rounded-md bg-muted/60', className)} {...props} />;
    }

    return (
        <div className={cn('relative overflow-hidden rounded-md bg-muted/60', className)} {...props}>
            {/* Reuses the `shimmer` keyframes (animates background-position); the inline
                gradient guarantees a visible highlight sweep on any theme. */}
            <span
                className="shimmer absolute inset-0"
                aria-hidden="true"
                style={{
                    background:
                        'linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.45), transparent)',
                    backgroundSize: '200% 100%',
                }}
            />
        </div>
    );
}

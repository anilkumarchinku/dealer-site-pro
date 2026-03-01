/**
 * WishlistButton — heart icon that toggles a car in/out of the wishlist.
 * Used inside CarCard.
 */

'use client';

import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
    carId: string;
    className?: string;
}

export function WishlistButton({ carId, className }: WishlistButtonProps) {
    const { has, toggle } = useWishlistStore();
    const saved = has(carId);

    return (
        <button
            type="button"
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            onClick={(e) => { e.stopPropagation(); toggle(carId); }}
            className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200',
                saved
                    ? 'bg-red-500 text-white shadow-md scale-110'
                    : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white shadow',
                className
            )}
        >
            <Heart
                className="w-3.5 h-3.5"
                fill={saved ? 'currentColor' : 'none'}
                strokeWidth={saved ? 0 : 2}
            />
        </button>
    );
}

/**
 * CarGrid Component
 * Grid layout for displaying multiple car cards
 */

'use client';

import { CarCard } from './CarCard';
import type { Car } from '@/lib/types/car';
import { cn } from '@/lib/utils';

interface CarGridProps {
    cars: Car[];
    variant?: 'compact' | 'detailed';
    showEMI?: boolean;
    onViewDetails?: (carId: string) => void;
    onCompare?: (carId: string) => void;
    className?: string;
    emptyMessage?: string;
    brandColor?: string;
    /** Use white/light card styling (for light-background templates like Modern/Family) */
    light?: boolean;
}

export function CarGrid({
    cars,
    variant = 'compact',
    showEMI = true,
    onViewDetails,
    onCompare,
    className,
    emptyMessage = 'No cars found matching your criteria.',
    brandColor,
    light,
}: CarGridProps) {
    if (cars.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🚗</div>
                <p className={cn('text-lg', light ? 'text-gray-600' : 'text-gray-300')}>{emptyMessage}</p>
                <p className={cn('text-sm mt-2', light ? 'text-gray-500' : 'text-gray-400')}>Try adjusting your filters</p>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
                className
            )}
        >
            {cars.map((car) => (
                <CarCard
                    key={car.id}
                    car={car}
                    variant={variant}
                    showEMI={showEMI}
                    onViewDetails={onViewDetails}
                    onCompare={onCompare}
                    brandColor={brandColor}
                    light={light}
                />
            ))}
        </div>
    );
}

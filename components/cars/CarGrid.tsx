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
}: CarGridProps) {
    if (cars.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🚗</div>
                <p className="text-gray-600 text-lg">{emptyMessage}</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
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
                />
            ))}
        </div>
    );
}

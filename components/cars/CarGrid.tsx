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
    summaryOnly?: boolean;
    onViewDetails?: (carId: string) => void;
    onCompare?: (carId: string) => void;
    className?: string;
    emptyMessage?: string;
    brandColor?: string;
    /** Use white/light card styling (for light-background templates like Modern/Family) */
    light?: boolean;
    /** Base path for dealer-scoped detail pages, e.g. "/sites/demo-dealer" or "" on custom domains */
    detailBasePath?: string;
    /** Dealer phone number — enables per-car WhatsApp button */
    dealerPhone?: string;
    /** Dealer ID — enables test drive booking modal */
    dealerId?: string;
}

export function CarGrid({
    cars,
    variant = 'compact',
    showEMI = true,
    summaryOnly = false,
    onViewDetails,
    onCompare,
    className,
    emptyMessage = 'No cars found matching your criteria.',
    brandColor,
    light,
    detailBasePath,
    dealerPhone,
    dealerId,
}: CarGridProps) {
    if (cars.length === 0) {
        return (
            <div className="text-center py-16 px-4">
                <div className="text-5xl mb-3">🚗</div>
                <p className="text-base font-medium text-gray-900">{emptyMessage}</p>
                <p className="text-sm mt-1 text-gray-500">Try adjusting your filters</p>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5',
                className
            )}
        >
            {cars.map((car) => (
                <CarCard
                    key={car.id}
                    car={car}
                    variant={variant}
                    showEMI={showEMI}
                    summaryOnly={summaryOnly}
                    onViewDetails={onViewDetails}
                    onCompare={onCompare}
                    brandColor={brandColor}
                    light={light}
                    detailBasePath={detailBasePath}
                    dealerPhone={dealerPhone}
                    dealerId={dealerId}
                />
            ))}
        </div>
    );
}

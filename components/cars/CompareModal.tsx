'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';
import { useCompareStore } from '@/lib/store/compare-store';
import { Car } from '@/lib/types/car';

interface CompareModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    brandColor: string;
}

interface CompareRow {
    label: string;
    getValue: (car: Car) => string;
}

const COMPARE_ROWS: CompareRow[] = [
    {
        label: 'Price',
        getValue: (car) => {
            if (car.price) return car.price;
            const { min, max } = car.pricing.exShowroom;
            if (min && max && min !== max) {
                return `₹${(min / 100000).toFixed(1)}L – ₹${(max / 100000).toFixed(1)}L`;
            }
            if (min) return `₹${(min / 100000).toFixed(1)} Lakh`;
            return '';
        },
    },
    {
        label: 'Fuel Type',
        getValue: (car) => car.engine.type ?? '',
    },
    {
        label: 'Transmission',
        getValue: (car) => car.transmission.type ?? '',
    },
    {
        label: 'Mileage',
        getValue: (car) =>
            car.performance.fuelEfficiency
                ? `${car.performance.fuelEfficiency} km/l`
                : '',
    },
    {
        label: 'Engine',
        getValue: (car) =>
            car.engine.displacement
                ? `${car.engine.displacement} cc`
                : car.engine.batteryCapacity
                ? `${car.engine.batteryCapacity} kWh`
                : '',
    },
    {
        label: 'Seating',
        getValue: (car) =>
            car.dimensions.seatingCapacity
                ? `${car.dimensions.seatingCapacity} seats`
                : '',
    },
    {
        label: 'Body Type',
        getValue: (car) => car.bodyType ?? '',
    },
    {
        label: 'Condition',
        getValue: (car) => {
            const map: Record<string, string> = {
                new: 'New',
                used: 'Used',
                certified_pre_owned: 'Certified Pre-Owned',
            };
            return car.condition ? (map[car.condition] ?? car.condition) : '';
        },
    },
];

export default function CompareModal({ open, onOpenChange, brandColor }: CompareModalProps) {
    const { selectedCars } = useCompareStore();

    const handleEnquire = (car: Car) => {
        // Dispatch a custom event so the host page can open its enquiry modal
        window.dispatchEvent(
            new CustomEvent('dsp:enquire', { detail: { carId: car.id } })
        );
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="!max-w-[95vw] w-full sm:!max-w-4xl p-0 overflow-hidden"
            >
                {/* Header */}
                <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                        Compare Vehicles
                    </DialogTitle>
                    <DialogClose className="rounded-sm opacity-70 hover:opacity-100 transition-opacity">
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogHeader>

                {/* Scrollable comparison table */}
                <div className="overflow-x-auto overflow-y-auto max-h-[75vh]">
                    <table className="w-full text-sm border-collapse">
                        <thead className="sticky top-0 z-10 bg-white">
                            <tr className="border-b border-gray-200">
                                {/* Feature label column */}
                                <th className="w-36 min-w-[9rem] py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 sticky left-0 z-20">
                                    Feature
                                </th>

                                {/* Car columns */}
                                {selectedCars.map((car) => (
                                    <th
                                        key={car.id}
                                        className="min-w-[10rem] py-4 px-4 align-top"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="relative w-full h-24 rounded-xl overflow-hidden bg-gray-100">
                                                <Image
                                                    src={car.images.hero}
                                                    alt={`${car.make} ${car.model}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 640px) 45vw, 240px"
                                                />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-semibold text-gray-900 text-sm leading-tight">
                                                    {car.make} {car.model}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate max-w-[9rem]">
                                                    {car.variant}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleEnquire(car)}
                                                style={{ backgroundColor: brandColor }}
                                                className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-white
                                                           hover:opacity-90 transition-opacity"
                                            >
                                                Enquire
                                            </button>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {COMPARE_ROWS.map((row, rowIdx) => (
                                <tr
                                    key={row.label}
                                    className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                >
                                    {/* Sticky feature label */}
                                    <td
                                        className={`py-3 px-4 text-xs font-medium text-gray-500 sticky left-0 z-10 ${
                                            rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                        }`}
                                    >
                                        {row.label}
                                    </td>

                                    {/* Car values */}
                                    {selectedCars.map((car) => (
                                        <td
                                            key={car.id}
                                            className="py-3 px-4 text-sm text-gray-800 text-center font-medium"
                                        >
                                            {row.getValue(car)}
                                        </td>
                                    ))}

                                    {/* Empty placeholder cells for missing cars */}
                                    {Array.from({ length: 3 - selectedCars.length }).map((_, i) => (
                                        <td key={`empty-${i}`} className="py-3 px-4 text-center text-gray-300">
                                            —
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DialogContent>
        </Dialog>
    );
}

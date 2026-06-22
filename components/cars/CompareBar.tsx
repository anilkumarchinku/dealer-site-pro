'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Plus, GitCompare } from 'lucide-react';
import { useCompareStore } from '@/lib/store/compare-store';
import { resolveCarImage } from '@/lib/utils/car-image';
import CompareModal from './CompareModal';

const MAX_SLOTS = 3;

interface CompareBarProps {
    brandColor?: string;
    /** Dealer ID — forwarded to the enquiry modal so leads can be saved */
    dealerId?: string;
    /** Dealer phone — enables WhatsApp quick-connect in the enquiry modal */
    dealerPhone?: string;
}

export default function CompareBar({ brandColor = '#2563eb', dealerId, dealerPhone }: CompareBarProps) {
    const { selectedCars, removeCar, clearCars } = useCompareStore();
    const [modalOpen, setModalOpen] = useState(false);

    if (selectedCars.length < 1) return null;

    const emptySlots = MAX_SLOTS - selectedCars.length;
    const canCompare = selectedCars.length >= 2;
    const needed = 2 - selectedCars.length;

    return (
        <>
            <div
                className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40
                           flex items-center gap-3 px-4 py-3
                           bg-white border border-gray-200 rounded-2xl shadow-2xl
                           animate-in slide-in-from-bottom-4 duration-300"
            >
                {/* Car slots */}
                <div className="flex items-center gap-2">
                    {selectedCars.map((car) => (
                        <div
                            key={car.id}
                            className="relative flex flex-col items-center w-16 group"
                        >
                            <div className="relative w-14 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                <Image
                                    src={resolveCarImage(car)}
                                    alt={`${car.make} ${car.model}`}
                                    fill
                                    className="object-cover"
                                    sizes="56px"
                                    unoptimized
                                />
                            </div>
                            <p className="mt-0.5 text-[10px] text-gray-600 text-center leading-tight max-w-full truncate">
                                {car.make} {car.model}
                            </p>
                            {/* Remove button */}
                            <button
                                onClick={() => removeCar(car.id)}
                                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gray-700 text-white
                                           rounded-full flex items-center justify-center
                                           opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label={`Remove ${car.make} ${car.model}`}
                            >
                                <X className="w-2.5 h-2.5" />
                            </button>
                        </div>
                    ))}

                    {/* Empty slots */}
                    {Array.from({ length: emptySlots }).map((_, i) => (
                        <div
                            key={`empty-${i}`}
                            className="flex flex-col items-center w-16"
                        >
                            <div className="w-14 h-10 rounded-lg border-2 border-dashed border-gray-300
                                            flex items-center justify-center bg-gray-50">
                                <Plus className="w-4 h-4 text-gray-600" />
                            </div>
                            <p className="mt-0.5 text-[10px] text-gray-600 text-center leading-tight">
                                Add car
                            </p>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="w-px h-10 bg-gray-200" />

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-stretch gap-0.5">
                        <button
                            onClick={() => setModalOpen(true)}
                            disabled={!canCompare}
                            aria-describedby={!canCompare ? 'compare-hint' : undefined}
                            style={canCompare ? { backgroundColor: brandColor } : undefined}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white
                                       transition-opacity disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            <GitCompare className="w-4 h-4" />
                            Compare Now
                        </button>
                        {!canCompare && (
                            <p id="compare-hint" className="text-[10px] text-gray-600 text-center leading-tight">
                                Add {needed} more to compare
                            </p>
                        )}
                    </div>

                    <button
                        onClick={clearCars}
                        className="flex items-center justify-center w-8 h-8 rounded-xl
                                   border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Clear all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <CompareModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                brandColor={brandColor}
                dealerId={dealerId}
                dealerPhone={dealerPhone}
            />
        </>
    );
}

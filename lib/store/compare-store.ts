/**
 * Compare Store — persisted to localStorage
 * Tracks up to 3 cars the buyer has selected for side-by-side comparison.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Car } from '@/lib/types/car';

interface CompareStore {
    selectedCars: Car[];
    addCar:     (car: Car) => void;
    removeCar:  (carId: string) => void;
    clearCars:  () => void;
    isSelected: (carId: string) => boolean;
}

export const useCompareStore = create<CompareStore>()(
    persist(
        (set, get) => ({
            selectedCars: [],
            addCar: (car) => set(s => {
                if (s.selectedCars.some(c => c.id === car.id)) return s;
                if (s.selectedCars.length >= 3) return s;
                return { selectedCars: [...s.selectedCars, car] };
            }),
            removeCar:  (carId) => set(s => ({ selectedCars: s.selectedCars.filter(c => c.id !== carId) })),
            clearCars:  () => set({ selectedCars: [] }),
            isSelected: (carId) => get().selectedCars.some(c => c.id === carId),
        }),
        { name: 'dsp-compare' }
    )
);

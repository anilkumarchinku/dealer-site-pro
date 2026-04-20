/**
 * Wishlist Store — persisted to localStorage
 * Tracks car IDs the buyer has saved on a dealer site.
 * Also caches minimal car data so saved cars show up even if
 * the current inventory no longer contains them (e.g. Cyepro API drift).
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CarSnapshot {
    id: string;
    make: string;
    model: string;
    variant?: string;
    image?: string;
    priceMin?: number;   // ex-showroom min in rupees
    price?: string;      // formatted price string e.g. "₹5.20 L"
}

interface WishlistStore {
    items: string[];
    savedCarData: Record<string, CarSnapshot>;
    add:     (id: string) => void;
    remove:  (id: string) => void;
    toggle:  (id: string) => void;
    has:     (id: string) => boolean;
    clear:   () => void;
    /** Sync snapshots for any wishlisted car found in the current cars array */
    hydrate: (snapshots: CarSnapshot[]) => void;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            savedCarData: {},
            add:    (id) => set(s => ({ items: s.items.includes(id) ? s.items : [...s.items, id] })),
            remove: (id) => set(s => {
                const { [id]: _removed, ...rest } = s.savedCarData;
                return { items: s.items.filter(i => i !== id), savedCarData: rest };
            }),
            toggle: (id) => get().has(id) ? get().remove(id) : get().add(id),
            has:    (id) => get().items.includes(id),
            clear:  () => set({ items: [], savedCarData: {} }),
            hydrate: (snapshots) => set(s => {
                const newData = { ...s.savedCarData };
                snapshots.forEach(snap => {
                    if (s.items.includes(snap.id)) {
                        newData[snap.id] = snap;
                    }
                });
                return { savedCarData: newData };
            }),
        }),
        { name: 'dsp-wishlist' }
    )
);

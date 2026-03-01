/**
 * Wishlist Store — persisted to localStorage
 * Tracks car IDs the buyer has saved on a dealer site.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
    items: string[];   // car IDs
    add:    (id: string) => void;
    remove: (id: string) => void;
    toggle: (id: string) => void;
    has:    (id: string) => boolean;
    clear:  () => void;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            add:    (id) => set(s => ({ items: s.items.includes(id) ? s.items : [...s.items, id] })),
            remove: (id) => set(s => ({ items: s.items.filter(i => i !== id) })),
            toggle: (id) => get().has(id) ? get().remove(id) : get().add(id),
            has:    (id) => get().items.includes(id),
            clear:  () => set({ items: [] }),
        }),
        { name: 'dsp-wishlist' }
    )
);

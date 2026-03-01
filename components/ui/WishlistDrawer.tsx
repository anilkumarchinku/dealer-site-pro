/**
 * WishlistDrawer
 * Slide-out panel showing saved cars + optional price drop alert signup.
 * Triggered by a heart icon in the site header.
 */

'use client';

import { useState } from 'react';
import { Heart, X, Bell, Send, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import type { Car } from '@/lib/types/car';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { formatPriceInLakhs } from '@/lib/utils/car-utils';

interface WishlistDrawerProps {
    cars: Car[];   // all dealer cars — we filter by wishlist IDs
    dealerId: string;
    brandColor?: string;
}

export function WishlistDrawer({ cars, dealerId, brandColor = '#2563eb' }: WishlistDrawerProps) {
    const [open, setOpen] = useState(false);
    const [alertEmail, setAlertEmail] = useState('');
    const [alertStatus, setAlertStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
    const { items, remove, clear } = useWishlistStore();

    const savedCars = cars.filter(c => items.includes(c.id));

    const handleAlertSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setAlertStatus('loading');
        try {
            // Submit as a lead with source 'price_alert'
            const carNames = savedCars.map(c => `${c.make} ${c.model}`).join(', ');
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dealer_id:   dealerId,
                    name:        alertEmail.split('@')[0],
                    phone:       '0000000000',  // placeholder — email-only alert
                    email:       alertEmail,
                    message:     `Price drop alert request for: ${carNames}`,
                    lead_source: 'price_alert',
                }),
            });
            if (!res.ok) throw new Error();
            setAlertStatus('done');
        } catch {
            setAlertStatus('error');
        }
    };

    return (
        <>
            {/* Trigger button */}
            <button
                onClick={() => setOpen(true)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Wishlist"
            >
                <Heart className="w-5 h-5 text-gray-600" />
                {items.length > 0 && (
                    <span
                        className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                        style={{ backgroundColor: brandColor }}
                    >
                        {items.length}
                    </span>
                )}
            </button>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-50 flex justify-end"
                    onClick={() => setOpen(false)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    {/* Drawer */}
                    <div
                        className="relative w-full max-w-sm bg-white h-full flex flex-col shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4" style={{ color: brandColor }} />
                                <span className="font-semibold text-gray-900">Saved Cars ({items.length})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {items.length > 0 && (
                                    <button onClick={clear} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1">
                                        <Trash2 className="w-3 h-3" />Clear
                                    </button>
                                )}
                                <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                    <X className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Car list */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                            {savedCars.length === 0 ? (
                                <div className="text-center py-16">
                                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                                    <p className="text-gray-500 text-sm font-medium">No saved cars yet</p>
                                    <p className="text-gray-400 text-xs mt-1">Tap the ♥ on any car to save it</p>
                                </div>
                            ) : savedCars.map(car => {
                                const price = formatPriceInLakhs(car.pricing?.exShowroom?.min ?? null);
                                return (
                                    <div key={car.id} className="flex gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                                        {car.images.hero ? (
                                            <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-white">
                                                <Image src={car.images.hero} alt={`${car.make} ${car.model}`} fill className="object-cover" sizes="80px" />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-14 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 text-2xl">🚗</div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold uppercase tracking-wide truncate" style={{ color: brandColor }}>{car.make}</p>
                                            <p className="text-sm font-bold text-gray-900 leading-tight">{car.model}</p>
                                            {car.variant && <p className="text-xs text-gray-500 truncate">{car.variant}</p>}
                                            <p className="text-sm font-bold mt-1 text-gray-900">{price}</p>
                                        </div>
                                        <button onClick={() => remove(car.id)} className="shrink-0 text-gray-300 hover:text-red-500 transition-colors mt-1">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Price Drop Alert */}
                        {savedCars.length > 0 && (
                            <div className="border-t border-gray-100 px-4 py-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Bell className="w-4 h-4" style={{ color: brandColor }} />
                                    <span className="text-sm font-semibold text-gray-900">Get Price Drop Alerts</span>
                                </div>
                                {alertStatus === 'done' ? (
                                    <p className="text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">
                                        You&apos;re subscribed! We&apos;ll email you if any price drops.
                                    </p>
                                ) : (
                                    <form onSubmit={handleAlertSignup} className="flex gap-2">
                                        <input
                                            type="email" required
                                            value={alertEmail}
                                            onChange={e => setAlertEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gray-400 text-gray-900 bg-white placeholder:text-gray-400"
                                        />
                                        <Button type="submit" size="sm" disabled={alertStatus === 'loading'} style={{ backgroundColor: brandColor }}>
                                            <Send className="w-3.5 h-3.5" />
                                        </Button>
                                    </form>
                                )}
                                {alertStatus === 'error' && <p className="text-xs text-red-500 mt-1">Failed to subscribe. Please try again.</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

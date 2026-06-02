"use client"

import { useEffect, useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type Category = "new_listings" | "price_drops" | "announcements";

const CATEGORY_LABELS: Record<Category, string> = {
    new_listings: "New arrivals",
    price_drops: "Price drops",
    announcements: "Announcements",
};

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

export function PushPreferenceCenter({ dealerId }: { dealerId: string }) {
    const [supported, setSupported] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>(["new_listings", "price_drops"]);

    useEffect(() => {
        const available = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
        setSupported(available);
        if (!available) return;
        navigator.serviceWorker.ready
            .then(reg => reg.pushManager.getSubscription())
            .then(subscription => setSubscribed(Boolean(subscription)))
            .catch(() => setSubscribed(false));
    }, []);

    const toggleCategory = (category: Category) => {
        setCategories(prev => prev.includes(category)
            ? prev.filter(item => item !== category)
            : [...prev, category]);
    };

    const subscribe = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (!publicKey) throw new Error("Push notifications are not configured yet.");
            const permission = await Notification.requestPermission();
            if (permission !== "granted") throw new Error("Notification permission was not granted.");

            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey),
            });

            const res = await fetch("/api/push-subscriptions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dealer_id: dealerId, subscription, categories, filters: {} }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error ?? "Failed to save notification preferences.");
            setSubscribed(true);
            setMessage("Notifications enabled for this device.");
        } catch (err) {
            setMessage(err instanceof Error ? err.message : "Failed to enable notifications.");
        } finally {
            setLoading(false);
        }
    };

    const unsubscribe = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                await fetch("/api/push-subscriptions", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ endpoint: subscription.endpoint }),
                });
                await subscription.unsubscribe();
            }
            setSubscribed(false);
            setMessage("Notifications disabled for this device.");
        } catch (err) {
            setMessage(err instanceof Error ? err.message : "Failed to disable notifications.");
        } finally {
            setLoading(false);
        }
    };

    if (!supported) return null;

    return (
        <section className="border-t border-slate-200 bg-white px-4 py-8">
            <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Inventory Alerts</h2>
                    <p className="mt-1 text-sm text-slate-600">Get device notifications for matching stock updates from this showroom.</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                        {(Object.keys(CATEGORY_LABELS) as Category[]).map(category => (
                            <label key={category} className="flex items-center gap-2 text-sm text-slate-700">
                                <Checkbox
                                    checked={categories.includes(category)}
                                    onCheckedChange={() => toggleCategory(category)}
                                    disabled={loading || subscribed}
                                />
                                {CATEGORY_LABELS[category]}
                            </label>
                        ))}
                    </div>
                    {message && <p className="mt-2 text-xs text-slate-500">{message}</p>}
                </div>
                <Button
                    type="button"
                    onClick={subscribed ? unsubscribe : subscribe}
                    disabled={loading}
                    variant={subscribed ? "outline" : "default"}
                    className="shrink-0 gap-2"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : subscribed ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                    {subscribed ? "Disable Alerts" : "Enable Alerts"}
                </Button>
            </div>
        </section>
    );
}

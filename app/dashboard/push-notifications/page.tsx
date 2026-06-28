"use client"

import { useEffect, useState } from "react";
import { Bell, Loader2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useOnboardingStore } from "@/lib/store/onboarding-store";

type Broadcast = {
    id: string;
    title: string;
    body: string;
    category: string;
    status: string;
    sent_count: number;
    failed_count: number;
    created_at: string;
    error_message?: string | null;
}

export default function PushNotificationsPage() {
    const { dealerId } = useOnboardingStore();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [category, setCategory] = useState("announcements");
    const [targetUrl, setTargetUrl] = useState("");
    const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
    const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const load = () => {
        fetch("/api/push-broadcasts")
            .then(res => res.json())
            .then(json => setBroadcasts(json.broadcasts ?? []))
            .catch(() => setBroadcasts([]));
        fetch("/api/push-subscriptions")
            .then(res => res.json())
            .then(json => setSubscriberCount(json.count ?? 0))
            .catch(() => setSubscriberCount(null));
    };

    useEffect(() => { load(); }, []);

    const send = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dealerId) return;
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("/api/push-broadcasts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dealer_id: dealerId,
                    title,
                    body,
                    category,
                    target_url: targetUrl,
                }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error ?? "Failed to send broadcast");
            setMessage(`Sent to ${json.sent} device(s).`);
            setTitle("");
            setBody("");
            setTargetUrl("");
            load();
        } catch (err) {
            setMessage(err instanceof Error ? err.message : "Failed to send broadcast");
            load();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Push Notifications</h1>
                <p className="text-muted-foreground">
                    Broadcast new listings, price drops, and announcements to opted-in devices.
                    {subscriberCount !== null && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                            {subscriberCount} active subscriber{subscriberCount !== 1 ? "s" : ""}
                        </span>
                    )}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        New Broadcast
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={send} className="grid gap-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">Title</label>
                                <Input value={title} onChange={e => setTitle(e.target.value)} maxLength={80} required />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">Category</label>
                                <select value={category} onChange={e => setCategory(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="announcements">Announcements</option>
                                    <option value="new_listings">New Listings</option>
                                    <option value="price_drops">Price Drops</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Message</label>
                            <textarea value={body} onChange={e => setBody(e.target.value)} maxLength={220} required className="min-h-[100px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
                            <p className="mt-1 text-xs text-muted-foreground">{body.length}/220 characters</p>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Target URL</label>
                            <Input type="url" value={targetUrl} onChange={e => setTargetUrl(e.target.value)} placeholder="https://..." />
                        </div>
                        {message && <p className="text-sm text-muted-foreground">{message}</p>}
                        <Button type="submit" disabled={loading || !title || !body} className="w-fit gap-2">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Send Broadcast
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Broadcasts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {broadcasts.map(item => (
                        <div key={item.id} className="rounded-xl border p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                                </div>
                                <Badge variant="outline" className="capitalize">{item.status}</Badge>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                {item.category.replace(/_/g, " ")} · sent {item.sent_count} · failed {item.failed_count} · {new Date(item.created_at).toLocaleString("en-IN")}
                            </p>
                            {item.error_message && <p className="mt-1 text-xs text-red-600">{item.error_message}</p>}
                        </div>
                    ))}
                    {broadcasts.length === 0 && (
                        <p className="py-8 text-center text-sm text-muted-foreground">No push broadcasts yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

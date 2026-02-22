"use client"
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    MessageSquare, Search, Star, Archive, Mail, MailOpen,
    Phone, Loader2, RefreshCw,
} from "lucide-react";
import {
    fetchMessages, markMessageRead, toggleMessageStar, archiveMessage,
    type DBMessage,
} from "@/lib/db/messages";
import { useOnboardingStore } from "@/lib/store/onboarding-store";


function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function MessagesPage() {
    const { dealerId } = useOnboardingStore();

    const [messages, setMessages] = useState<DBMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<DBMessage | null>(null);

    const load = () => {
        if (!dealerId) return;
        setLoading(true);
        fetchMessages(dealerId)
            .then(setMessages)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (dealerId) load();
    }, [dealerId]); // eslint-disable-line

    const displayMessages = messages.filter(m =>
        !m.is_archived &&
        (m.sender_name.toLowerCase().includes(search.toLowerCase()) ||
         (m.subject ?? "").toLowerCase().includes(search.toLowerCase()) ||
         m.content.toLowerCase().includes(search.toLowerCase()))
    );

    const unread = displayMessages.filter(m => !m.is_read).length;

    const handleSelect = async (msg: DBMessage) => {
        setSelected(msg);
        if (!msg.is_read) {
            const updated = messages.map(m => m.id === msg.id ? { ...m, is_read: true } : m);
            setMessages(updated);
            if (dealerId) await markMessageRead(msg.id);
        }
    };

    const handleStar = async (e: React.MouseEvent, msg: DBMessage) => {
        e.stopPropagation();
        const newVal = !msg.is_starred;
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_starred: newVal } : m));
        if (selected?.id === msg.id) setSelected(prev => prev ? { ...prev, is_starred: newVal } : null);
        if (dealerId) await toggleMessageStar(msg.id, newVal);
    };

    const handleArchive = async (e: React.MouseEvent, msgId: string) => {
        e.stopPropagation();
        setMessages(prev => prev.filter(m => m.id !== msgId));
        if (selected?.id === msgId) setSelected(null);
        if (dealerId) await archiveMessage(msgId);
    };

    const STATS = [
        { label: "Total Messages", value: displayMessages.length, icon: MessageSquare, bg: "bg-primary/10", text: "text-primary" },
        { label: "Unread",         value: unread,                  icon: Mail,          bg: "bg-amber-500/10",  text: "text-amber-500"  },
        { label: "Starred",        value: displayMessages.filter(m => m.is_starred).length, icon: Star, bg: "bg-violet-500/10", text: "text-violet-500" },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Messages</h1>
                    <p className="text-muted-foreground">Customer messages and inquiries</p>
                </div>
                <div className="flex items-center gap-3">
                    {dealerId && (
                        <button
                            onClick={load}
                            disabled={loading}
                            className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground disabled:opacity-50"
                            title="Refresh"
                        >
                            {loading
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <RefreshCw className="w-4 h-4" />
                            }
                        </button>
                    )}
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STATS.map((s, i) => (
                    <Card key={i} className="hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="mb-4">
                                <div className={cn("p-3 rounded-xl w-fit", s.bg)}>
                                    <s.icon className={cn("w-6 h-6", s.text)} />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{s.label}</p>
                            <p className="text-3xl font-bold">{s.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Inbox */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Message list */}
                <div className="space-y-3">
                    {/* Search */}
                    <Card variant="glass">
                        <CardContent className="py-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search messages…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {loading ? (
                        <Card variant="glass">
                            <CardContent className="py-12 flex items-center justify-center gap-2 text-muted-foreground">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-sm">Loading messages…</span>
                            </CardContent>
                        </Card>
                    ) : displayMessages.length === 0 ? (
                        <Card variant="glass">
                            <CardContent className="py-16 text-center text-muted-foreground">
                                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="text-sm">{search ? "No messages match your search" : "No messages yet"}</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card variant="glass">
                            <CardContent className="p-0">
                                <div className="divide-y divide-border">
                                    {displayMessages.map(msg => (
                                        <div
                                            key={msg.id}
                                            onClick={() => handleSelect(msg)}
                                            className={cn(
                                                "flex items-start gap-3 p-4 cursor-pointer transition-colors",
                                                selected?.id === msg.id ? "bg-primary/5" : "hover:bg-muted/30",
                                                !msg.is_read && "bg-primary/5"
                                            )}
                                        >
                                            {/* Read indicator */}
                                            <div className="mt-1 shrink-0">
                                                {msg.is_read
                                                    ? <MailOpen className="w-4 h-4 text-muted-foreground" />
                                                    : <Mail className="w-4 h-4 text-primary" />
                                                }
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <span className={cn("text-sm truncate", !msg.is_read && "font-semibold")}>
                                                        {msg.sender_name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                                                        {timeAgo(msg.created_at)}
                                                    </span>
                                                </div>
                                                <p className={cn("text-sm truncate", !msg.is_read ? "text-foreground font-medium" : "text-muted-foreground")}>
                                                    {msg.subject || "(No subject)"}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                                    {msg.content}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col items-center gap-1 shrink-0">
                                                <button
                                                    onClick={e => handleStar(e, msg)}
                                                    className="p-1 rounded hover:bg-muted/50 transition-colors"
                                                    title={msg.is_starred ? "Unstar" : "Star"}
                                                >
                                                    <Star className={cn("w-3.5 h-3.5", msg.is_starred ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
                                                </button>
                                                <button
                                                    onClick={e => handleArchive(e, msg.id)}
                                                    className="p-1 rounded hover:bg-muted/50 transition-colors"
                                                    title="Archive"
                                                >
                                                    <Archive className="w-3.5 h-3.5 text-muted-foreground" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Message detail */}
                <div>
                    {selected ? (
                        <Card variant="glass" className="h-full">
                            <CardContent className="p-6 space-y-4">
                                {/* Sender info */}
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold">{selected.subject || "(No subject)"}</h2>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                        <span className="font-medium text-foreground">{selected.sender_name}</span>
                                        {selected.sender_email && (
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-3.5 h-3.5" /> {selected.sender_email}
                                            </span>
                                        )}
                                        {selected.sender_phone && (
                                            <span className="flex items-center gap-1">
                                                <Phone className="w-3.5 h-3.5" /> {selected.sender_phone}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(selected.created_at).toLocaleString("en-IN", {
                                            dateStyle: "medium", timeStyle: "short",
                                        })}
                                    </p>
                                </div>

                                <div className="border-t border-border" />

                                {/* Message body */}
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.content}</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card variant="glass" className="h-full">
                            <CardContent className="py-24 text-center text-muted-foreground">
                                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">Select a message to read</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

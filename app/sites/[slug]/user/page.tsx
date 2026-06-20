"use client"

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, Car, Gift, Loader2, MapPin, Phone, Search, Store, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Dealer = {
    dealership_name: string;
    location: string;
    full_address?: string | null;
    phone: string;
    whatsapp?: string | null;
    email: string;
    branches?: Array<{ city?: string; state?: string; address?: string; phone?: string }> | null;
    tagline?: string | null;
}

type Lead = {
    id: string;
    lead_type: string;
    status: string;
    vehicle_interest?: string | null;
    message?: string | null;
    created_at: string;
}

type TestDrive = {
    id: string;
    vehicle_interest?: string | null;
    preferred_date?: string | null;
    preferred_time?: string | null;
    status: string;
    created_at: string;
}

type SellRequest = {
    id: string;
    make: string;
    model?: string | null;
    variant?: string | null;
    year?: number | null;
    expected_price?: number | null;
    status: string;
    preferred_date?: string | null;
    created_at: string;
}

type Vehicle = {
    id: string;
    make: string;
    model: string;
    variant?: string | null;
    year: number;
    price_paise: number;
    fuel_type?: string | null;
    transmission?: string | null;
    mileage_km?: number | null;
}

type Offer = {
    id: string;
    title: string;
    description?: string | null;
    tag?: string | null;
    valid_until?: string | null;
}

type PanelData = {
    dealer: Dealer;
    history: {
        inquiries: Lead[];
        test_drives: TestDrive[];
        sell_requests: SellRequest[];
    };
    new_arrivals: Vehicle[];
    offers: Offer[];
}

function formatDate(value?: string | null) {
    if (!value) return "Not scheduled";
    return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatPrice(paise?: number | null) {
    if (!paise) return "Price on request";
    return `₹${Math.round(paise / 100).toLocaleString("en-IN")}`;
}

export default function CustomerPanelPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [stage, setStage] = useState<"request" | "verify">("request");
    const [info, setInfo] = useState("");
    const [data, setData] = useState<PanelData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Step 1: send a one-time code to the customer's email to prove ownership.
    const sendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setInfo("");
        setData(null);
        try {
            const res = await fetch("/api/customer-panel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ step: "send-otp", slug, email }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error ?? "Could not send verification code");
            setStage("verify");
            setInfo(json.message ?? "We sent a 6-digit code to your email.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not send verification code");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: verify the code; PII is only returned on success.
    const verifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/customer-panel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ step: "verify", slug, email, code, phone }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error ?? "Could not verify code");
            setData(json);
            setInfo("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not verify code");
        } finally {
            setLoading(false);
        }
    };

    const resetFlow = () => {
        setStage("request");
        setCode("");
        setError("");
        setInfo("");
        setData(null);
    };

    return (
        <main className="min-h-screen bg-slate-50 text-slate-950">
            <div className="mx-auto max-w-6xl px-4 py-8">
                <Link href={`/sites/${slug}`} className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-950">
                    <ArrowLeft className="h-4 w-4" />
                    Back to showroom
                </Link>

                <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Customer Panel
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stage === "request" ? (
                                <form onSubmit={sendCode} className="space-y-4">
                                    <p className="text-sm text-slate-500">
                                        Verify your email to view your activity. We&apos;ll send a one-time code to confirm it&apos;s you.
                                    </p>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Email</label>
                                        <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Phone <span className="font-normal text-slate-400">(optional)</span></label>
                                        <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit mobile number" autoComplete="tel" />
                                        <p className="mt-1 text-xs text-slate-400">Also match records under this number.</p>
                                    </div>
                                    {error && <p className="text-sm text-red-600">{error}</p>}
                                    <Button type="submit" disabled={loading || !email.trim()} className="w-full gap-2">
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                        Send Verification Code
                                    </Button>
                                </form>
                            ) : (
                                <form onSubmit={verifyCode} className="space-y-4">
                                    {info && <p className="text-sm text-emerald-600">{info}</p>}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">6-digit code</label>
                                        <Input
                                            value={code}
                                            onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                            placeholder="123456"
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            maxLength={6}
                                        />
                                        <p className="mt-1 text-xs text-slate-400">Sent to {email}</p>
                                    </div>
                                    {error && <p className="text-sm text-red-600">{error}</p>}
                                    <Button type="submit" disabled={loading || code.length !== 6} className="w-full gap-2">
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <User className="h-4 w-4" />}
                                        Verify &amp; View My Details
                                    </Button>
                                    <Button type="button" variant="ghost" onClick={resetFlow} className="w-full" disabled={loading}>
                                        Use a different email
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        {!data ? (
                            <Card>
                                <CardContent className="py-16 text-center text-slate-500">
                                    Enter your phone or email to view vehicle history, showroom updates, and offers.
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                <section className="rounded-2xl bg-slate-950 p-6 text-white">
                                    <p className="text-sm text-slate-300">Welcome back to</p>
                                    <h1 className="mt-1 text-3xl font-bold">{data.dealer.dealership_name}</h1>
                                    <p className="mt-2 max-w-2xl text-slate-300">{data.dealer.tagline || `Your showroom in ${data.dealer.location}`}</p>
                                    <div className="mt-5 flex flex-wrap gap-3 text-sm">
                                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5"><MapPin className="h-4 w-4" />{data.dealer.location}</span>
                                        <a className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5" href={`tel:${data.dealer.phone}`}><Phone className="h-4 w-4" />{data.dealer.phone}</a>
                                    </div>
                                </section>

                                <section className="grid gap-4 md:grid-cols-3">
                                    <SummaryCard icon={<Search className="h-5 w-5" />} label="Inquiries" value={data.history.inquiries.length} />
                                    <SummaryCard icon={<Calendar className="h-5 w-5" />} label="Test Drives" value={data.history.test_drives.length} />
                                    <SummaryCard icon={<Car className="h-5 w-5" />} label="Sell Requests" value={data.history.sell_requests.length} />
                                </section>

                                <PanelSection title="History" icon={<Calendar className="h-5 w-5" />}>
                                    <div className="grid gap-3">
                                        {data.history.test_drives.map(item => (
                                            <HistoryRow key={item.id} title={item.vehicle_interest || "Vehicle test drive"} subtitle={`${formatDate(item.preferred_date)}${item.preferred_time ? ` at ${item.preferred_time}` : ""}`} status={item.status} />
                                        ))}
                                        {data.history.sell_requests.map(item => (
                                            <HistoryRow key={item.id} title={[item.year, item.make, item.model, item.variant].filter(Boolean).join(" ")} subtitle={`Expected ${formatPrice(item.expected_price ? item.expected_price * 100 : null)} · submitted ${formatDate(item.created_at)}`} status={item.status} />
                                        ))}
                                        {data.history.inquiries.map(item => (
                                            <HistoryRow key={item.id} title={item.vehicle_interest || item.lead_type.replace(/_/g, " ")} subtitle={formatDate(item.created_at)} status={item.status} />
                                        ))}
                                        {data.history.inquiries.length + data.history.test_drives.length + data.history.sell_requests.length === 0 && (
                                            <p className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">No activity found for this contact yet.</p>
                                        )}
                                    </div>
                                </PanelSection>

                                <PanelSection title="Upcoming New Arrivals" icon={<Car className="h-5 w-5" />}>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {data.new_arrivals.map(vehicle => (
                                            <Link key={vehicle.id} href={`/sites/${slug}/${vehicle.id}`} className="rounded-xl border bg-white p-4 transition hover:border-slate-400">
                                                <p className="font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                                                <p className="mt-1 text-sm text-slate-600">{vehicle.variant || "Available stock"}</p>
                                                <p className="mt-3 font-bold">{formatPrice(vehicle.price_paise)}</p>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {vehicle.fuel_type && <Badge variant="outline">{vehicle.fuel_type}</Badge>}
                                                    {vehicle.transmission && <Badge variant="outline">{vehicle.transmission}</Badge>}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </PanelSection>

                                <PanelSection title="Showroom Details" icon={<Store className="h-5 w-5" />}>
                                    <div className="rounded-xl border bg-white p-4">
                                        <p className="font-semibold">{data.dealer.dealership_name}</p>
                                        <p className="mt-1 text-sm text-slate-600">{data.dealer.full_address || data.dealer.location}</p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <a className="text-sm font-medium text-blue-600 hover:underline" href={`tel:${data.dealer.phone}`}>Call showroom</a>
                                            {data.dealer.whatsapp && <a className="text-sm font-medium text-blue-600 hover:underline" href={`https://wa.me/${data.dealer.whatsapp.replace(/\D/g, "")}`}>WhatsApp</a>}
                                            <a className="text-sm font-medium text-blue-600 hover:underline" href={`mailto:${data.dealer.email}`}>Email</a>
                                        </div>
                                    </div>
                                    {data.dealer.branches?.length ? (
                                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                            {data.dealer.branches.map((branch, index) => (
                                                <div key={index} className="rounded-xl border bg-white p-4 text-sm">
                                                    <p className="font-semibold">{branch.city || `Branch ${index + 1}`}</p>
                                                    <p className="mt-1 text-slate-600">{branch.address}</p>
                                                    {branch.phone && <p className="mt-2 text-slate-600">{branch.phone}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                </PanelSection>

                                <PanelSection title="Promotions" icon={<Gift className="h-5 w-5" />}>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {data.offers.map(offer => (
                                            <div key={offer.id} className="rounded-xl border bg-white p-4">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="font-semibold">{offer.title}</p>
                                                    {offer.tag && <Badge>{offer.tag}</Badge>}
                                                </div>
                                                {offer.description && <p className="mt-2 text-sm text-slate-600">{offer.description}</p>}
                                                {offer.valid_until && <p className="mt-3 text-xs text-slate-500">Valid until {formatDate(offer.valid_until)}</p>}
                                            </div>
                                        ))}
                                        {data.offers.length === 0 && <p className="text-sm text-slate-500">No active promotions right now.</p>}
                                    </div>
                                </PanelSection>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
    return (
        <Card>
            <CardContent className="p-5">
                <div className="mb-3 text-slate-500">{icon}</div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-3xl font-bold">{value}</p>
            </CardContent>
        </Card>
    );
}

function PanelSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <section>
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold">{icon}{title}</h2>
            {children}
        </section>
    );
}

function HistoryRow({ title, subtitle, status }: { title: string; subtitle: string; status: string }) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border bg-white p-4">
            <div>
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
            </div>
            <Badge variant="outline" className="capitalize">{status.replace(/_/g, " ")}</Badge>
        </div>
    );
}

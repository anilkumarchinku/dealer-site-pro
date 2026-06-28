"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, BadgeCheck, ImagePlus, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchVehicleById, updateVehicle, updateVehicleStatus, type DBVehicle } from "@/lib/db/vehicles";
import { useOnboardingStore } from "@/lib/store/onboarding-store";

type InsuranceStatus = NonNullable<DBVehicle["insurance_status"]>;

const BODY_TYPES = ["Sedan", "Hatchback", "SUV", "MUV", "Coupe", "Convertible", "Pickup", "Van", "Wagon", "Crossover"];
const TRANSMISSIONS = ["Manual", "Automatic", "AMT", "CVT", "DCT", "iMT"];
const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid", "LPG"];
const CONDITIONS: DBVehicle["condition"][] = ["new", "used", "certified_pre_owned"];
const STATUSES: DBVehicle["status"][] = ["available", "reserved", "sold", "inactive"];
const INSURANCE_STATUSES: InsuranceStatus[] = ["unknown", "active", "expiring_soon", "expired"];
const MAX_VEHICLE_IMAGES = 10;

/** Convert any YouTube URL to an embed URL */
function toYouTubeEmbed(url: string): string | null {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function deriveInsuranceStatus(validUntil: string, fallback: InsuranceStatus): InsuranceStatus {
    if (!validUntil) return fallback;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(`${validUntil}T00:00:00`);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
    if (daysUntilExpiry < 0) return "expired";
    if (daysUntilExpiry <= 30) return "expiring_soon";
    return "active";
}

function toDateInput(value?: string) {
    return value ? value.slice(0, 10) : "";
}

export default function EditVehiclePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { dealerId, data } = useOnboardingStore();
    const isHybrid = data.sellsNewCars && data.sellsUsedCars;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [vehicle, setVehicle] = useState<DBVehicle | null>(null);
    const [form, setForm] = useState({
        vin: "",
        registration_number: "",
        make: "",
        model: "",
        variant: "",
        year: "",
        price_inr: "",
        mileage_km: "",
        color: "",
        body_type: "SUV",
        transmission: "Manual",
        fuel_type: "Petrol",
        condition: "used" as DBVehicle["condition"],
        status: "available" as DBVehicle["status"],
        features: "",
        description: "",
        image_url: "",
        video_url: "",
        meta_title: "",
        meta_description: "",
        insurance_status: "unknown" as InsuranceStatus,
        insurance_provider: "",
        insurance_valid_until: "",
        insurance_quote_url: "",
    });
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

    useEffect(() => {
        if (!dealerId || !id) return;
        setLoading(true);
        fetchVehicleById(dealerId, id)
            .then(({ vehicle, error }) => {
                if (error) throw new Error(error);
                if (!vehicle) throw new Error("Vehicle not found");
                setVehicle(vehicle);
                setForm({
                    vin: vehicle.vin ?? "",
                    registration_number: vehicle.registration_number ?? "",
                    make: vehicle.make,
                    model: vehicle.model,
                    variant: vehicle.variant ?? "",
                    year: String(vehicle.year),
                    price_inr: String(Math.round(vehicle.price_paise / 100)),
                    mileage_km: vehicle.mileage_km != null ? String(vehicle.mileage_km) : "",
                    color: vehicle.color ?? "",
                    body_type: vehicle.body_type ?? "SUV",
                    transmission: vehicle.transmission ?? "Manual",
                    fuel_type: vehicle.fuel_type ?? "Petrol",
                    condition: vehicle.condition,
                    status: vehicle.status,
                    features: (vehicle.features ?? []).join("\n"),
                    description: vehicle.description ?? "",
                    image_url: vehicle.image_url ?? "",
                    video_url: vehicle.video_url ?? "",
                    meta_title: vehicle.meta_title ?? "",
                    meta_description: vehicle.meta_description ?? "",
                    insurance_status: vehicle.insurance_status ?? "unknown",
                    insurance_provider: vehicle.insurance_provider ?? "",
                    insurance_valid_until: toDateInput(vehicle.insurance_valid_until),
                    insurance_quote_url: vehicle.insurance_quote_url ?? "",
                });
                setExistingImageUrls([...(vehicle.image_urls ?? []), vehicle.image_url ?? ""].filter((url, index, urls): url is string => Boolean(url) && urls.indexOf(url) === index));
                setNewImages([]);
                setNewImagePreviews([]);
            })
            .catch(err => setError(err instanceof Error ? err.message : "Failed to load vehicle"))
            .finally(() => setLoading(false));
    }, [dealerId, id]);

    function set(field: keyof typeof form, value: string) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;
        const remaining = MAX_VEHICLE_IMAGES - existingImageUrls.length - newImages.length;
        const toAdd = files.slice(0, Math.max(remaining, 0));
        setNewImages(prev => [...prev, ...toAdd]);
        toAdd.forEach(file => {
            const reader = new FileReader();
            reader.onload = event => setNewImagePreviews(prev => [...prev, String(event.target?.result ?? "")]);
            reader.readAsDataURL(file);
        });
        e.target.value = "";
    }

    function removeExistingImage(index: number) {
        setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
    }

    function removeNewImage(index: number) {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!dealerId || !vehicle) return;
        setSaving(true);
        setError("");

        const uploadedUrls: string[] = [];
        for (const image of newImages) {
            const uploadData = new FormData();
            uploadData.append("file", image);
            const uploadRes = await fetch("/api/vehicles/upload-image", {
                method: "POST",
                body: uploadData,
            });
            const uploadJson = await uploadRes.json();
            if (!uploadRes.ok) {
                setSaving(false);
                setError(uploadJson.error ?? "Failed to upload vehicle photo");
                return;
            }
            uploadedUrls.push(uploadJson.url);
        }
        const imageUrls = [...existingImageUrls, ...uploadedUrls].slice(0, MAX_VEHICLE_IMAGES);
        const imageUrl = imageUrls[0];

        const result = await updateVehicle(vehicle.id, dealerId, {
            vin: form.vin.trim() || undefined,
            registration_number: form.registration_number.trim().toUpperCase() || undefined,
            make: form.make.trim(),
            model: form.model.trim(),
            variant: form.variant.trim() || undefined,
            year: Number(form.year) || new Date().getFullYear(),
            price_paise: Math.round((Number(form.price_inr) || 0) * 100),
            mileage_km: form.mileage_km ? Number(form.mileage_km) : undefined,
            color: form.color.trim() || undefined,
            body_type: form.body_type,
            transmission: form.transmission,
            fuel_type: form.fuel_type,
            condition: form.condition,
            status: form.status,
            features: form.features.split("\n").map(item => item.trim()).filter(Boolean),
            description: form.description.trim() || undefined,
            image_url: imageUrl,
            image_urls: imageUrls,
            video_url: form.video_url.trim()
                ? (toYouTubeEmbed(form.video_url.trim()) ?? form.video_url.trim())
                : undefined,
            meta_title: form.meta_title.trim() || undefined,
            meta_description: form.meta_description.trim() || undefined,
            insurance_status: deriveInsuranceStatus(form.insurance_valid_until, form.insurance_status),
            insurance_provider: form.insurance_provider.trim() || undefined,
            insurance_valid_until: form.insurance_valid_until || undefined,
            insurance_quote_url: form.insurance_quote_url.trim() || undefined,
            insurance_last_checked_at: form.insurance_valid_until ? new Date().toISOString() : undefined,
        });

        setSaving(false);
        if (!result.success) {
            setError(result.error ?? "Failed to update vehicle");
            return;
        }
        // Fire-and-forget push notification if price dropped
        const newPricePaise = Math.round((Number(form.price_inr) || 0) * 100);
        if (vehicle && vehicle.price_paise > 0 && newPricePaise > 0 && newPricePaise < vehicle.price_paise) {
            fetch('/api/push-trigger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'price_drop',
                    vehicle: { make: form.make.trim(), model: form.model.trim(), year: Number(form.year) },
                    old_price_paise: vehicle.price_paise,
                    new_price_paise: newPricePaise,
                }),
            }).catch(() => { /* push trigger failure is non-fatal */ })
        }
        router.push("/dashboard/inventory");
    }

    async function markSold() {
        if (!dealerId || !vehicle) return;
        setSaving(true);
        setError("");
        const result = await updateVehicleStatus(vehicle.id, dealerId, "sold");
        setSaving(false);
        if (!result.success) {
            setError(result.error ?? "Failed to mark vehicle sold");
            return;
        }
        router.push("/dashboard/inventory");
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading vehicle...
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6 pb-8">
            <div className="rounded-2xl border border-border/70 bg-card/90 p-5 shadow-sm dark:bg-card/80 sm:p-6 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild className="rounded-xl">
                        <Link href="/dashboard/inventory" aria-label="Back to inventory"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div>
                        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.24em] text-blue-600 dark:text-blue-300">Inventory editor</p>
                        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Edit Vehicle</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Update listing details, SEO, insurance, and stock status.</p>
                    </div>
                </div>
                <Button type="button" variant="outline" disabled={saving || !vehicle || form.status === "sold"} onClick={markSold} className="rounded-xl gap-2">
                    <BadgeCheck className="h-4 w-4" />
                    Mark Sold
                </Button>
            </div>

            {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                <CardHeader>
                    <CardTitle>Vehicle Photos</CardTitle>
                    <CardDescription>Upload up to {MAX_VEHICLE_IMAGES} photos. The first photo is shown on the buyer-facing inventory card.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {existingImageUrls.map((url, index) => (
                            <div key={url} className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt={`Vehicle photo ${index + 1}`} className="h-full w-full object-cover" />
                                {index === 0 && <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">Main</span>}
                                <button type="button" onClick={() => removeExistingImage(index)} className="absolute right-1 top-1 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-red-600 shadow">Remove</button>
                            </div>
                        ))}
                        {newImagePreviews.map((src, index) => (
                            <div key={`${src}-${index}`} className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={src} alt={`New vehicle photo ${index + 1}`} className="h-full w-full object-cover" />
                                {existingImageUrls.length === 0 && index === 0 && <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">Main</span>}
                                <button type="button" onClick={() => removeNewImage(index)} className="absolute right-1 top-1 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-red-600 shadow">Remove</button>
                            </div>
                        ))}
                        {existingImageUrls.length + newImages.length === 0 && (
                            <div className="col-span-full flex aspect-video items-center justify-center rounded-xl border border-dashed border-border bg-muted text-sm text-muted-foreground">
                                No images uploaded
                            </div>
                        )}
                    </div>
                    <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                        <ImagePlus className="h-4 w-4" />
                        Add Photos ({existingImageUrls.length + newImages.length}/{MAX_VEHICLE_IMAGES})
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} disabled={saving || existingImageUrls.length + newImages.length >= MAX_VEHICLE_IMAGES} />
                    </label>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                <CardHeader>
                    <CardTitle>Basic Details</CardTitle>
                    <CardDescription>Core inventory fields shown on the public listing.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <Field label="Make" value={form.make} onChange={value => set("make", value)} required />
                    <Field label="Model" value={form.model} onChange={value => set("model", value)} required />
                    <Field label="Variant" value={form.variant} onChange={value => set("variant", value)} />
                    <Field label="VIN" value={form.vin} onChange={value => set("vin", value.toUpperCase())} />
                    <Field label="Registration Number / Number Plate" value={form.registration_number} onChange={value => set("registration_number", value.toUpperCase())} />
                    <Field label="Year" type="number" value={form.year} onChange={value => set("year", value)} />
                    <Field label="Price (INR)" type="number" value={form.price_inr} onChange={value => set("price_inr", value)} />
                    <Field label="Kilometers" type="number" value={form.mileage_km} onChange={value => set("mileage_km", value)} />
                    <Field label="Color" value={form.color} onChange={value => set("color", value)} />
                    <SelectField label="Body Type" value={form.body_type} options={BODY_TYPES} onChange={value => set("body_type", value)} />
                    <SelectField label="Transmission" value={form.transmission} options={TRANSMISSIONS} onChange={value => set("transmission", value)} />
                    <SelectField label="Fuel Type" value={form.fuel_type} options={FUEL_TYPES} onChange={value => set("fuel_type", value)} />
                    <SelectField label="Status" value={form.status} options={STATUSES} onChange={value => set("status", value as DBVehicle["status"])} />
                    {isHybrid && (
                        <SelectField label="Condition" value={form.condition} options={CONDITIONS} onChange={value => set("condition", value as DBVehicle["condition"])} />
                    )}
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                <CardHeader>
                    <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium">Features</label>
                        <textarea value={form.features} onChange={e => set("features", e.target.value)} placeholder="One feature per line" className="min-h-[110px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Description</label>
                        <textarea value={form.description} onChange={e => set("description", e.target.value)} className="min-h-[120px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Youtube className="h-5 w-5 text-red-500" />
                        Video Walkaround
                        <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
                    </CardTitle>
                    <CardDescription>Listings with a video get more enquiries — paste your YouTube link.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Field label="YouTube URL" type="url" value={form.video_url} onChange={value => set("video_url", value)} />
                    {toYouTubeEmbed(form.video_url) && (
                        <div className="aspect-video overflow-hidden rounded-xl border border-border">
                            <iframe
                                src={toYouTubeEmbed(form.video_url)!}
                                className="h-full w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Vehicle walkaround video"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                <CardHeader>
                    <CardTitle>Insurance</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <SelectField label="Insurance Status" value={form.insurance_status} options={INSURANCE_STATUSES} onChange={value => set("insurance_status", value as InsuranceStatus)} />
                    <Field label="Valid Until" type="date" value={form.insurance_valid_until} onChange={value => set("insurance_valid_until", value)} />
                    <Field label="Insurer" value={form.insurance_provider} onChange={value => set("insurance_provider", value)} />
                    <Field label="Quote Comparison URL" type="url" value={form.insurance_quote_url} onChange={value => set("insurance_quote_url", value)} />
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                <CardHeader>
                    <CardTitle>SEO Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Field label="Meta Title" value={form.meta_title} onChange={value => set("meta_title", value)} maxLength={70} />
                    <div>
                        <label className="mb-2 block text-sm font-medium">Meta Description</label>
                        <textarea value={form.meta_description} onChange={e => set("meta_description", e.target.value)} maxLength={160} className="min-h-[90px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
                        <p className="mt-1 text-xs text-muted-foreground">{form.meta_description.length}/160 characters</p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-3 pb-8">
                <Button type="button" variant="outline" asChild>
                    <Link href="/dashboard/inventory">Cancel</Link>
                </Button>
                <Button type="submit" disabled={saving || !form.make || !form.model} className="flex-1 gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                </Button>
            </div>
        </form>
    );
}

function Field({
    label,
    value,
    onChange,
    type = "text",
    required = false,
    maxLength,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
    maxLength?: number;
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium">{label}{required && <span className="text-red-500"> *</span>}</label>
            <Input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} maxLength={maxLength} />
            {maxLength && <p className="mt-1 text-xs text-muted-foreground">{value.length}/{maxLength} characters</p>}
        </div>
    );
}

function SelectField({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string;
    options: readonly string[];
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium">{label}</label>
            <select value={value} onChange={e => onChange(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                {options.map(option => (
                    <option key={option} value={option}>{option.replace(/_/g, " ")}</option>
                ))}
            </select>
        </div>
    );
}

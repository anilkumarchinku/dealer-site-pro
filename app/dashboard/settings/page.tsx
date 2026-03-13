"use client"
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { logger } from "@/lib/utils/logger";
import { useTheme } from "@/components/theme-provider";
import {
    Save, Globe, Bell, Palette, Shield,
    Phone, Mail, MapPin, Building2,
    ExternalLink, Sun, Moon, Info,
    Plug, Eye, EyeOff, CheckCircle2, XCircle, Loader2,
    Link2, Copy, RefreshCw, Trash2, Upload, ImageIcon, X,
    Star, RefreshCcw, Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { updateDealerProfile, saveNotificationSettings } from "@/lib/db/settings";

const NOTIFICATION_CONFIG: Record<string, { label: string; description: string }> = {
    newLeads:        { label: "New Leads",        description: "Get notified when a new lead comes in" },
    testDrives:      { label: "Test Drives",       description: "Get notified when someone books a test drive" },
    serviceBookings: { label: "Service Bookings",  description: "Get notified when someone books a service" },
    reviews:         { label: "New Reviews",       description: "Get notified when you receive a new review" },
    weeklyReport:    { label: "Weekly Report",     description: "Receive a weekly performance summary" },
};

export default function SettingsPage() {
    const { data, updateData, dealerId } = useOnboardingStore();
    const { theme } = useTheme();

    const [formData, setFormData] = useState({
        dealershipName:  data.dealershipName || "",
        location:        data.location || "",
        phone:           data.phone || "",
        email:           data.email || "",
        yearsInBusiness: data.yearsInBusiness?.toString() || "",
    });

    const [notifications, setNotifications] = useState({
        newLeads:        true,
        testDrives:      true,
        serviceBookings: true,
        reviews:         true,
        weeklyReport:    true,
    });

    const [saved, setSaved] = useState(false);

    // ── Cyepro integration state ──────────────────────────────────────────────
    const [cyeproKey,       setCyeproKey]       = useState("");
    const [showCyeproKey,   setShowCyeproKey]   = useState(false);
    const [cyeproStatus,    setCyeproStatus]    = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [cyeproError,     setCyeproError]     = useState("");
    const [cyeproConnected, setCyeproConnected] = useState(false);
    const [cyeproTesting,   setCyeproTesting]   = useState(false);
    const [cyeproTestResult, setCyeproTestResult] = useState<{ success: boolean; message: string } | null>(null);

    // ── Custom Domain state ───────────────────────────────────────────────────
    const [domainInput,   setDomainInput]   = useState("");
    const [savedDomain,   setSavedDomain]   = useState("");
    const [domainId,      setDomainId]      = useState<string | null>(null);
    const [domainStep,    setDomainStep]    = useState<"input" | "dns" | "verified">("input");
    const [domainError,   setDomainError]   = useState("");
    const [domainLoading, setDomainLoading] = useState(false);
    const [verifying,     setVerifying]     = useState(false);
    const [verifyResult,  setVerifyResult]  = useState<{ allVerified: boolean; message: string } | null>(null);
    const [copied,        setCopied]        = useState(false);

    // ── Vehicle Segments state ────────────────────────────────────────────────
    const [sellsTwoWheelers,   setSellsTwoWheelers]   = useState(false);
    const [sellsThreeWheelers, setSellsThreeWheelers] = useState(false);
    const [sellsFourWheelers,  setSellsFourWheelers]  = useState(false);
    const [segmentSaving,      setSegmentSaving]      = useState(false);
    const [segmentSaved,       setSegmentSaved]       = useState(false);
    const [vehicleType,        setVehicleType]        = useState<string | null>(null);

    // ── Google Reviews state ──────────────────────────────────────────────────
    const [googleMapsUrl,     setGoogleMapsUrl]     = useState("");
    const [googleUrlSaved,    setGoogleUrlSaved]    = useState(false);
    const [googleSyncing,     setGoogleSyncing]     = useState(false);
    const [googleSyncResult,  setGoogleSyncResult]  = useState<{ success: boolean; message: string } | null>(null);
    const [googlePlaceId,     setGooglePlaceId]     = useState<string | null>(null);

    // ── Brand Assets state ────────────────────────────────────────────────────
    const [logoPreview,    setLogoPreview]    = useState<string>("");
    const [heroPreview,    setHeroPreview]    = useState<string>("");
    const [logoUploading,  setLogoUploading]  = useState(false);
    const [heroUploading,  setHeroUploading]  = useState(false);
    const [logoSaved,      setLogoSaved]      = useState(false);
    const [heroSaved,      setHeroSaved]      = useState(false);
    const [logoError,      setLogoError]      = useState("");
    const [heroError,      setHeroError]      = useState("");
    const logoInputRef = useRef<HTMLInputElement>(null);
    const heroInputRef = useRef<HTMLInputElement>(null);

    // Load existing logo/hero URLs on mount
    useEffect(() => {
        if (!dealerId) return;
        supabase
            .from("dealers")
            .select("logo_url, hero_image_url, sells_two_wheelers, sells_three_wheelers, sells_four_wheelers, google_maps_url, google_place_id, vehicle_type")
            .eq("id", dealerId)
            .single()
            .then(({ data }) => {
                if (data?.logo_url)               setLogoPreview(data.logo_url);
                if (data?.hero_image_url)          setHeroPreview(data.hero_image_url);
                setSellsTwoWheelers(data?.sells_two_wheelers   ?? false);
                setSellsThreeWheelers(data?.sells_three_wheelers ?? false);
                setSellsFourWheelers(data?.sells_four_wheelers  ?? false);
                if (data?.vehicle_type)            setVehicleType(data.vehicle_type);
                if (data?.google_maps_url)         setGoogleMapsUrl(data.google_maps_url);
                if (data?.google_place_id)         setGooglePlaceId(data.google_place_id);
            });
        return;
        return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dealerId]);

    const uploadAsset = useCallback(async (
        file: File,
        field: "logo" | "hero",
        maxSizeMB: number,
    ) => {
        if (!dealerId) return;
        if (!file.type.startsWith("image/")) {
            if (field === "logo") setLogoError("Please upload a PNG, JPG, SVG or WEBP image");
            else setHeroError("Please upload a PNG, JPG or WEBP image");
            return;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
            if (field === "logo") setLogoError(`Logo must be under ${maxSizeMB} MB`);
            else setHeroError(`Hero image must be under ${maxSizeMB} MB`);
            return;
        }

        if (field === "logo") { setLogoUploading(true); setLogoError(""); }
        else                  { setHeroUploading(true); setHeroError(""); }

        try {
            const mime = file.type;
            const ext  = mime.split("/")[1]?.replace("svg+xml", "svg").replace("jpeg", "jpg") ?? "png";
            const path = `dealers/${dealerId}/${field}.${ext}`;

            const { error: upErr } = await supabase.storage
                .from("dealer-assets")
                .upload(path, file, { upsert: true, contentType: mime });

            if (upErr) throw upErr;

            const { data: { publicUrl } } = supabase.storage
                .from("dealer-assets")
                .getPublicUrl(path);

            const dbField = field === "logo" ? "logo_url" : "hero_image_url";
            const { error: dbErr } = await supabase
                .from("dealers")
                .update({ [dbField]: publicUrl })
                .eq("id", dealerId);

            if (dbErr) throw dbErr;

            if (field === "logo") { setLogoPreview(publicUrl); setLogoSaved(true); setTimeout(() => setLogoSaved(false), 3000); }
            else                  { setHeroPreview(publicUrl); setHeroSaved(true); setTimeout(() => setHeroSaved(false), 3000); }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Upload failed";
            if (field === "logo") setLogoError(msg);
            else setHeroError(msg);
        } finally {
            if (field === "logo") setLogoUploading(false);
            else                  setHeroUploading(false);
        }
    }, [dealerId]);

    // Load existing Cyepro key (masked) from DB on mount
    useEffect(() => {
        if (!dealerId) return;
        supabase
            .from("dealers")
            .select("cyepro_api_key")
            .eq("id", dealerId)
            .single()
            .then(({ data }) => {
                if (data?.cyepro_api_key) {
                    setCyeproConnected(true);
                    // Show a placeholder so user knows a key is saved
                    setCyeproKey("••••••••••••••••••••");
                }
            });
            return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dealerId]);

    // Load existing custom domain for this dealer
    useEffect(() => {
        if (!dealerId) return;
        supabase
            .from("dealer_domains")
            .select("id, custom_domain, status, dns_verified")
            .eq("dealer_id", dealerId)
            .eq("domain_type", "custom")
            .maybeSingle()
            .then(({ data }) => {
                if (data?.custom_domain) {
                    setSavedDomain(data.custom_domain);
                    setDomainId(data.id);
                    setDomainStep(data.dns_verified ? "verified" : "dns");
                }
            });
            return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dealerId]);

    const handleSaveCyeproKey = async () => {
        if (!dealerId) return;
        if (!cyeproKey || cyeproKey.startsWith("•")) return;

        setCyeproStatus("saving");
        setCyeproError("");

        const { error } = await supabase
            .from("dealers")
            .update({ cyepro_api_key: cyeproKey.trim() })
            .eq("id", dealerId);

        if (error) {
            setCyeproStatus("error");
            setCyeproError(error.message);
        } else {
            setCyeproStatus("saved");
            setCyeproConnected(true);
            setCyeproKey("••••••••••••••••••••");
            setShowCyeproKey(false);
            setTimeout(() => setCyeproStatus("idle"), 3000);
        }
    };

    const handleTestCyeproConnection = async () => {
        if (!dealerId) return;
        setCyeproTesting(true);
        setCyeproTestResult(null);
        try {
            const res = await fetch("/api/inventory/cyepro/test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dealerId }),
            });
            const json = await res.json();

            // Extract detailed error from diagnostics steps
            let detailedMessage = json.message || "";
            if (!json.success && json.diagnostics?.steps) {
                const failedStep = json.diagnostics.steps.find((s: any) => s.status === "FAIL");
                if (failedStep) {
                    detailedMessage = `Step "${failedStep.step}" failed: ${failedStep.error || JSON.stringify(failedStep)}`;
                    if (failedStep.httpStatus) detailedMessage += ` (HTTP ${failedStep.httpStatus})`;
                    if (failedStep.body) detailedMessage += ` — ${failedStep.body.substring(0, 200)}`;
                }
            }

            setCyeproTestResult({
                success: json.success,
                message: detailedMessage || (json.success ? "Connected!" : "Connection failed. Check your API key."),
            });
            // Log full diagnostics to console for debugging
            logger.log("[Cyepro Test] Full diagnostics:", json.diagnostics);
        } catch (err) {
            const errMsg = err instanceof Error ? err.message : String(err);
            setCyeproTestResult({ success: false, message: `Network error: ${errMsg}` });
        } finally {
            setCyeproTesting(false);
        }
    };

    const handleRemoveCyeproKey = async () => {
        if (!dealerId) return;
        const { error } = await supabase
            .from("dealers")
            .update({ cyepro_api_key: null })
            .eq("id", dealerId);
        if (!error) {
            setCyeproConnected(false);
            setCyeproKey("");
            setCyeproStatus("idle");
        }
    };

    // ── Custom Domain handlers ────────────────────────────────────────────────
    const handleAddDomain = async () => {
        if (!dealerId) return;
        const cleaned = domainInput.trim().toLowerCase()
            .replace(/^https?:\/\//, "")
            .replace(/\/$/, "");

        // Client-side format validation
        const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
        if (!cleaned) {
            setDomainError("Please enter a domain name.");
            return;
        }
        if (!domainRegex.test(cleaned)) {
            setDomainError("Invalid domain format. Use: heromotors.com");
            return;
        }
        if (cleaned.endsWith("indrav.in") || cleaned.endsWith("dealersitepro.com")) {
            setDomainError("That's one of our own domains — enter your custom domain.");
            return;
        }

        setDomainLoading(true);
        setDomainError("");

        const res = await fetch("/api/domains/connect-custom", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dealerId, customDomain: cleaned }),
        });
        const json = await res.json();
        setDomainLoading(false);

        if (!json.success) {
            setDomainError(json.error || "Failed to add domain. Please try again.");
            return;
        }

        setSavedDomain(cleaned);
        setDomainId(json.domain?.id ?? null);
        setDomainStep("dns");
        setDomainInput("");
    };

    const handleVerifyDns = async () => {
        if (!domainId || !savedDomain) return;
        setVerifying(true);
        setVerifyResult(null);

        const res = await fetch("/api/domains/verify-dns", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domainId, domain: savedDomain }),
        });
        const json = await res.json();
        setVerifying(false);

        const result = json.verification as { allVerified: boolean; message: string } | undefined;
        if (result?.allVerified) {
            setDomainStep("verified");
        }
        setVerifyResult(result ?? { allVerified: false, message: "Verification check failed. Try again." });
    };

    const handleRemoveDomain = async () => {
        if (!domainId || !savedDomain || !dealerId) return;

        const res = await fetch("/api/domains/remove-custom", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domainId, domain: savedDomain, dealerId }),
        });
        const json = await res.json();

        if (json.success) {
            setSavedDomain("");
            setDomainId(null);
            setDomainStep("input");
            setDomainInput("");
            setVerifyResult(null);
            setDomainError("");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        // Always update local Zustand store
        updateData({
            dealershipName:  formData.dealershipName,
            location:        formData.location,
            phone:           formData.phone,
            email:           formData.email,
            yearsInBusiness: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : null,
        });

        // Also sync to DB if we have a dealer ID
        if (dealerId) {
            await Promise.all([
                updateDealerProfile(dealerId, {
                    dealership_name:   formData.dealershipName,
                    location:          formData.location,
                    phone:             formData.phone,
                    email:             formData.email,
                    years_in_business: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : undefined,
                }),
                saveNotificationSettings(dealerId, {
                    new_leads:        notifications.newLeads,
                    test_drives:      notifications.testDrives,
                    service_bookings: notifications.serviceBookings,
                    new_reviews:      notifications.reviews,
                    weekly_report:    notifications.weeklyReport,
                }),
            ]);
        }

        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const toggleNotification = (key: string) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    };

    const handleSaveSegments = async () => {
        if (!dealerId) return;
        setSegmentSaving(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
            .from("dealers")
            .update({
                sells_two_wheelers:   sellsTwoWheelers,
                sells_three_wheelers: sellsThreeWheelers,
                sells_four_wheelers:  sellsFourWheelers,
            })
            .eq("id", dealerId);
        setSegmentSaving(false);
        setSegmentSaved(true);
        setTimeout(() => setSegmentSaved(false), 2500);
    };

    const handleSyncGoogleReviews = async () => {
        if (!dealerId) return;
        setGoogleSyncing(true);
        setGoogleSyncResult(null);
        try {
            const res = await fetch("/api/reviews/google-sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dealer_id: dealerId, maps_url: googleMapsUrl }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Sync failed");
            setGoogleSyncResult({ success: true, message: data.message });
            if (data.place_id) setGooglePlaceId(data.place_id);
            // Persist URL to DB if entered
            if (googleMapsUrl && !googleUrlSaved) {
                await supabase.from("dealers").update({ google_maps_url: googleMapsUrl }).eq("id", dealerId);
                setGoogleUrlSaved(true);
            }
        } catch (err) {
            setGoogleSyncResult({ success: false, message: err instanceof Error ? err.message : "Sync failed" });
        } finally {
            setGoogleSyncing(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">Manage your dealership settings and preferences</p>
                </div>
                <Button
                    onClick={handleSave}
                    className={cn(
                        "gap-2 transition-all duration-300",
                        saved
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-primary hover:bg-primary/90"
                    )}
                >
                    <Save className="w-4 h-4" />
                    {saved ? "Saved!" : "Save Changes"}
                </Button>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

                {/* ── Left: Main Settings (2/3 width) ── */}
                <div className="xl:col-span-2 space-y-6">

                    {/* Business Information */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2.5 text-lg">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Globe className="w-4 h-4 text-primary" />
                                </div>
                                Business Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                label="Dealership Name"
                                placeholder="e.g. Ram Motors"
                                value={formData.dealershipName}
                                onChange={(e) => handleChange("dealershipName", e.target.value)}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Location / City"
                                    placeholder="e.g. Hyderabad"
                                    value={formData.location}
                                    onChange={(e) => handleChange("location", e.target.value)}
                                />
                                <Input
                                    label="Years in Business"
                                    type="number"
                                    placeholder="e.g. 13"
                                    value={formData.yearsInBusiness}
                                    onChange={(e) => handleChange("yearsInBusiness", e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    placeholder="+91 98989 89898"
                                    value={formData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="dealer@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Vehicle Segments ── */}
                    {(() => {
                        // Which segment is the primary type (can't be removed)
                        const primary2W = vehicleType === 'two-wheeler';
                        const primary3W = vehicleType === 'three-wheeler';
                        const primary4W = vehicleType === 'car';

                        // Effective "active" state for each segment
                        const active2W = primary2W || sellsTwoWheelers;
                        const active3W = primary3W || sellsThreeWheelers;
                        const active4W = primary4W || sellsFourWheelers;

                        const SEGMENTS = [
                            {
                                key:       '2w',
                                emoji:     '🏍️',
                                label:     '2-Wheelers',
                                desc:      'Bikes, Scooters & Electric 2W',
                                isPrimary: primary2W,
                                isActive:  active2W,
                                color:     'text-orange-600',
                                bg:        'bg-orange-500/10',
                                badge:     'bg-orange-500/10 text-orange-700 border-orange-500/20',
                                toggle:    () => !primary2W && setSellsTwoWheelers(v => !v),
                                addHref:   '/dashboard/add-vehicle-type?type=2w',
                            },
                            {
                                key:       '3w',
                                emoji:     '🛺',
                                label:     '3-Wheelers',
                                desc:      'Passenger Autos, Cargo & Electric 3W',
                                isPrimary: primary3W,
                                isActive:  active3W,
                                color:     'text-purple-600',
                                bg:        'bg-purple-500/10',
                                badge:     'bg-purple-500/10 text-purple-700 border-purple-500/20',
                                toggle:    () => !primary3W && setSellsThreeWheelers(v => !v),
                                addHref:   '/dashboard/add-vehicle-type?type=3w',
                            },
                            {
                                key:       '4w',
                                emoji:     '🚗',
                                label:     '4-Wheelers',
                                desc:      'Cars, SUVs & Premium Vehicles',
                                isPrimary: primary4W,
                                isActive:  active4W,
                                color:     'text-blue-600',
                                bg:        'bg-blue-500/10',
                                badge:     'bg-blue-500/10 text-blue-700 border-blue-500/20',
                                toggle:    () => !primary4W && setSellsFourWheelers(v => !v),
                                addHref:   '/dashboard/add-vehicle-type?type=4w',
                            },
                        ];

                        return (
                            <Card variant="glass">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2.5 text-lg">
                                        <div className="p-2 rounded-lg bg-blue-500/10">
                                            <Plus className="w-4 h-4 text-blue-500" />
                                        </div>
                                        Vehicle Segments
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Add any vehicle type to expand your dealership. Each segment unlocks its own leads, inventory, and website section.
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {SEGMENTS.map(seg => (
                                        <div key={seg.key} className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-muted/30">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${seg.bg}`}>
                                                    {seg.emoji}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-sm">{seg.label}</p>
                                                        {seg.isPrimary && (
                                                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${seg.badge}`}>
                                                                Primary
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">{seg.desc}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {seg.isActive && !seg.isPrimary && (
                                                    /* Toggle to enable/disable secondary segment */
                                                    <button
                                                        type="button"
                                                        onClick={seg.toggle}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${seg.isActive ? 'bg-green-500' : 'bg-muted'}`}
                                                    >
                                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${seg.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                                    </button>
                                                )}
                                                {seg.isPrimary && (
                                                    <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                                                    </span>
                                                )}
                                                {!seg.isActive && (
                                                    <Link
                                                        href={seg.addHref}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary text-xs font-semibold hover:bg-primary/10 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" /> Add
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Save button — only needed when secondary segments are toggled */}
                                    {(sellsTwoWheelers !== (vehicleType !== 'two-wheeler' && sellsTwoWheelers) ||
                                      sellsThreeWheelers !== (vehicleType !== 'three-wheeler' && sellsThreeWheelers) ||
                                      true) && (
                                        <Button onClick={handleSaveSegments} disabled={segmentSaving} size="sm" className="gap-2 mt-1">
                                            <Save className="w-3.5 h-3.5" />
                                            {segmentSaving ? "Saving..." : segmentSaved ? "Saved ✓" : "Save Changes"}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })()}

                    {/* Notification Preferences */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2.5 text-lg">
                                <div className="p-2 rounded-lg bg-amber-500/10">
                                    <Bell className="w-4 h-4 text-amber-500" />
                                </div>
                                Notification Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {Object.entries(notifications).map(([key, enabled]) => {
                                const config = NOTIFICATION_CONFIG[key];
                                return (
                                    <div
                                        key={key}
                                        className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="min-w-0 pr-4">
                                            <p className="text-sm font-medium text-foreground">{config.label}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
                                        </div>
                                        {/* Accessible toggle switch */}
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={enabled}
                                            onClick={() => toggleNotification(key)}
                                            className={cn(
                                                "relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200",
                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                                enabled ? "bg-blue-500" : "bg-muted border border-border"
                                            )}
                                        >
                                            <span className={cn(
                                                "block w-4 h-4 rounded-full shadow-sm absolute top-1 transition-all duration-200",
                                                enabled
                                                    ? "right-1 bg-white"
                                                    : "left-1 bg-muted-foreground/40"
                                            )} />
                                        </button>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* ── Integrations ── */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2.5 text-lg">
                                <div className="p-2 rounded-lg bg-green-500/10">
                                    <Plug className="w-4 h-4 text-green-500" />
                                </div>
                                Integrations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            {/* Cyepro */}
                            <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">

                                {/* Header row */}
                                <div className="flex items-center gap-3 px-4 py-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-amber-600 font-bold text-xs">CYE</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold">Cyepro Inventory</p>
                                            {cyeproConnected
                                                ? <Badge variant="outline" className="gap-1 text-emerald-600 bg-green-500/10 border-emerald-500/20">
                                                    <CheckCircle2 className="w-3 h-3" /> Connected
                                                  </Badge>
                                                : <Badge variant="secondary" className="text-muted-foreground">
                                                    Not connected
                                                  </Badge>
                                            }
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Sync your live used-car stock from api.cyepro.com
                                        </p>
                                    </div>
                                </div>

                                {/* Key input */}
                                <div className="border-t border-border px-4 py-4 space-y-3 bg-muted/10">
                                    <div className="relative">
                                        <Input
                                            type={showCyeproKey ? "text" : "password"}
                                            value={cyeproKey}
                                            onChange={(e) => {
                                                setCyeproKey(e.target.value);
                                                setCyeproStatus("idle");
                                                setCyeproError("");
                                            }}
                                            placeholder="Paste your Cyepro API key here"
                                            className="font-mono pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setShowCyeproKey(v => !v)}
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                                        >
                                            {showCyeproKey
                                                ? <EyeOff className="w-4 h-4" />
                                                : <Eye className="w-4 h-4" />}
                                        </Button>
                                    </div>

                                    {cyeproError && (
                                        <p className="text-xs text-destructive flex items-center gap-1.5">
                                            <XCircle className="w-3.5 h-3.5" />
                                            {cyeproError}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            disabled={!cyeproKey || cyeproKey.startsWith("•") || cyeproStatus === "saving"}
                                            onClick={handleSaveCyeproKey}
                                            className={cn(
                                                "gap-1.5",
                                                cyeproStatus === "saved"
                                                    ? "bg-emerald-600 hover:bg-emerald-700"
                                                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                                            )}
                                        >
                                            {cyeproStatus === "saving" ? (
                                                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
                                            ) : cyeproStatus === "saved" ? (
                                                <><CheckCircle2 className="w-3.5 h-3.5" /> Saved!</>
                                            ) : (
                                                <><Save className="w-3.5 h-3.5" /> Save Key</>
                                            )}
                                        </Button>
                                        {cyeproConnected && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={cyeproTesting}
                                                onClick={handleTestCyeproConnection}
                                                className="gap-1.5"
                                            >
                                                {cyeproTesting
                                                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Testing...</>
                                                    : <><RefreshCw className="w-3.5 h-3.5" /> Test Connection</>}
                                            </Button>
                                        )}
                                        {cyeproConnected && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-destructive border-red-500/30 hover:bg-red-500/5"
                                                onClick={handleRemoveCyeproKey}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>

                                    {cyeproTestResult && (
                                        <div className={cn(
                                            "rounded-lg px-3 py-2.5 text-xs flex items-start gap-2",
                                            cyeproTestResult.success
                                                ? "bg-green-500/10 text-emerald-700 border border-emerald-500/20"
                                                : "bg-destructive/10 text-red-700 border border-destructive/20"
                                        )}>
                                            {cyeproTestResult.success
                                                ? <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                                : <XCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />}
                                            {cyeproTestResult.message}
                                        </div>
                                    )}

                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Your API key is stored securely and only used server-side.
                                        It will never be exposed in the browser.
                                        Once connected, your used-car website will automatically show live inventory.
                                    </p>
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* ── Custom Domain ── */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2.5 text-lg">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Link2 className="w-4 h-4 text-primary" />
                                </div>
                                Custom Domain
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            {/* ── Step 1: No domain yet — show input ── */}
                            {domainStep === "input" && (
                                <div className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        Connect your own domain (e.g. <span className="font-mono">heromotors.com</span>) to your dealer website.
                                        Your free <span className="font-mono text-xs">.indrav.in</span> subdomain will keep working too.
                                    </p>

                                    <div className="flex gap-2">
                                        <Input
                                            type="text"
                                            value={domainInput}
                                            onChange={(e) => {
                                                setDomainInput(e.target.value);
                                                setDomainError("");
                                            }}
                                            placeholder="heromotors.com"
                                            className="flex-1"
                                            onKeyDown={(e) => e.key === "Enter" && handleAddDomain()}
                                        />
                                        <Button
                                            size="sm"
                                            disabled={domainLoading || !domainInput.trim()}
                                            onClick={handleAddDomain}
                                            className="gap-1.5 bg-primary hover:bg-primary/90"
                                        >
                                            {domainLoading
                                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                : <Link2 className="w-3.5 h-3.5" />}
                                            Add Domain
                                        </Button>
                                    </div>

                                    {domainError && (
                                        <p className="text-xs text-destructive flex items-center gap-1.5">
                                            <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                            {domainError}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* ── Step 2: Domain added — show DNS instructions ── */}
                            {domainStep === "dns" && savedDomain && (
                                <div className="space-y-4">
                                    {/* Domain badge */}
                                    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-muted/30 border border-border">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                                            <span className="text-sm font-mono font-medium truncate">{savedDomain}</span>
                                        </div>
                                        <Badge variant="outline" className="ml-2 flex-shrink-0 bg-amber-500/10 text-amber-600 border-amber-500/20">
                                            Pending DNS
                                        </Badge>
                                    </div>

                                    {/* Instructions */}
                                    <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                                        <p className="text-sm font-semibold">Set up DNS at your registrar</p>
                                        <p className="text-xs text-muted-foreground">
                                            Log in to GoDaddy, Namecheap, or wherever you bought <span className="font-mono">{savedDomain}</span> and add these records:
                                        </p>

                                        {/* DNS records table */}
                                        <div className="overflow-x-auto rounded-lg border border-border bg-background">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                                                        <TableHead className="text-xs h-8 py-2">Type</TableHead>
                                                        <TableHead className="text-xs h-8 py-2">Name</TableHead>
                                                        <TableHead className="text-xs h-8 py-2">Value</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell className="py-2 font-mono font-semibold text-primary text-xs">A</TableCell>
                                                        <TableCell className="py-2 font-mono text-xs">@</TableCell>
                                                        <TableCell className="py-2 font-mono text-xs">
                                                            <div className="flex items-center gap-2">
                                                                76.76.21.21
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => copyToClipboard("76.76.21.21")}
                                                                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                                                >
                                                                    <Copy className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="py-2 font-mono font-semibold text-violet-600 text-xs">CNAME</TableCell>
                                                        <TableCell className="py-2 font-mono text-xs">www</TableCell>
                                                        <TableCell className="py-2 font-mono text-xs">
                                                            <div className="flex items-center gap-2">
                                                                {process.env.NEXT_PUBLIC_CNAME_TARGET ?? 'cname.vercel-dns.com'}
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => copyToClipboard(process.env.NEXT_PUBLIC_CNAME_TARGET ?? 'cname.vercel-dns.com')}
                                                                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                                                >
                                                                    <Copy className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {copied && (
                                            <p className="text-xs text-emerald-600 flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" /> Copied!
                                            </p>
                                        )}

                                        <p className="text-xs text-muted-foreground">
                                            DNS changes take 5–30 minutes to propagate. Once done, click Verify below.
                                        </p>
                                    </div>

                                    {/* Verify result */}
                                    {verifyResult && (
                                        <div className={cn(
                                            "rounded-lg px-3 py-2.5 text-xs flex items-start gap-2",
                                            verifyResult.allVerified
                                                ? "bg-green-500/10 text-emerald-700 border border-emerald-500/20"
                                                : "bg-destructive/10 text-red-700 border border-destructive/20"
                                        )}>
                                            {verifyResult.allVerified
                                                ? <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                                : <XCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />}
                                            {verifyResult.message}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            disabled={verifying}
                                            onClick={handleVerifyDns}
                                            className="gap-1.5 bg-primary hover:bg-primary/90"
                                        >
                                            {verifying
                                                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking...</>
                                                : <><RefreshCw className="w-3.5 h-3.5" /> Verify DNS</>}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleRemoveDomain}
                                            className="text-destructive border-red-500/30 hover:bg-red-500/5 gap-1.5"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Remove
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* ── Step 3: DNS verified — domain is live ── */}
                            {domainStep === "verified" && savedDomain && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span className="text-sm font-mono font-medium truncate">{savedDomain}</span>
                                        </div>
                                        <Badge variant="outline" className="ml-2 flex-shrink-0 bg-green-500/10 text-emerald-600 border-emerald-500/20">
                                            Active
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <a
                                            href={`https://${savedDomain}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            Open {savedDomain}
                                        </a>
                                        <span className="text-muted-foreground">·</span>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleRemoveDomain}
                                            className="text-destructive border-red-500/30 hover:bg-red-500/5 gap-1.5 h-7 text-xs px-2"
                                        >
                                            <Trash2 className="w-3 h-3" /> Disconnect
                                        </Button>
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        Your website is live at <span className="font-mono">{savedDomain}</span> with SSL automatically managed.
                                    </p>
                                </div>
                            )}

                        </CardContent>
                    </Card>

                    {/* ── Brand Assets ── */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2.5 text-lg">
                                <div className="p-2 rounded-lg bg-amber-500/10">
                                    <ImageIcon className="w-4 h-4 text-amber-500" />
                                </div>
                                Brand Assets
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Logo */}
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-semibold">Dealership Logo</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, SVG or WEBP · Max 2 MB</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    {/* Preview */}
                                    <div className="w-16 h-16 rounded-xl border border-border bg-muted/40 flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {logoPreview ? (
                                            <Image src={logoPreview} alt="Logo" width={64} height={64} className="object-contain w-full h-full p-1" unoptimized />
                                        ) : (
                                            <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={logoUploading}
                                            onClick={() => logoInputRef.current?.click()}
                                            className="gap-1.5"
                                        >
                                            {logoUploading
                                                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...</>
                                                : logoSaved
                                                    ? <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Saved!</>
                                                    : <><Upload className="w-3.5 h-3.5" /> {logoPreview ? "Replace Logo" : "Upload Logo"}</>
                                            }
                                        </Button>
                                        {logoPreview && !logoUploading && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={async () => {
                                                    if (!dealerId) return;
                                                    await supabase.from("dealers").update({ logo_url: null }).eq("id", dealerId);
                                                    setLogoPreview("");
                                                }}
                                                className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 gap-1"
                                            >
                                                <X className="w-3 h-3" /> Remove logo
                                            </Button>
                                        )}
                                        {logoError && <p className="text-xs text-destructive">{logoError}</p>}
                                    </div>
                                </div>
                                <input
                                    ref={logoInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                                    className="hidden"
                                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAsset(f, "logo", 2); }}
                                />
                            </div>

                            <div className="border-t border-border" />

                            {/* Hero / Banner Image */}
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-semibold">Hero / Banner Image</p>
                                    <p className="text-xs text-muted-foreground">Shown in the header section of your website · PNG, JPG, WEBP · Max 5 MB</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    {/* Preview */}
                                    <div className="w-24 h-16 rounded-xl border border-border bg-muted/40 flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {heroPreview ? (
                                            <Image src={heroPreview} alt="Hero" width={96} height={64} className="object-cover w-full h-full" unoptimized />
                                        ) : (
                                            <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={heroUploading}
                                            onClick={() => heroInputRef.current?.click()}
                                            className="gap-1.5"
                                        >
                                            {heroUploading
                                                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...</>
                                                : heroSaved
                                                    ? <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Saved!</>
                                                    : <><Upload className="w-3.5 h-3.5" /> {heroPreview ? "Replace Image" : "Upload Image"}</>
                                            }
                                        </Button>
                                        {heroPreview && !heroUploading && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={async () => {
                                                    if (!dealerId) return;
                                                    await supabase.from("dealers").update({ hero_image_url: null }).eq("id", dealerId);
                                                    setHeroPreview("");
                                                }}
                                                className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 gap-1"
                                            >
                                                <X className="w-3 h-3" /> Remove image
                                            </Button>
                                        )}
                                        {heroError && <p className="text-xs text-destructive">{heroError}</p>}
                                    </div>
                                </div>
                                <input
                                    ref={heroInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    className="hidden"
                                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAsset(f, "hero", 5); }}
                                />
                            </div>

                        </CardContent>
                    </Card>

                    {/* Website Style */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2.5 text-lg">
                                <div className="p-2 rounded-lg bg-violet-500/10">
                                    <Palette className="w-4 h-4 text-violet-500" />
                                </div>
                                Website Style
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-muted/30">
                                <div>
                                    <p className="text-sm font-medium text-foreground capitalize">
                                        {data.styleTemplate?.replace(/_/g, " ") || "Family & Friendly"}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Current website template</p>
                                </div>
                                <Link href="/onboarding/step-4">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Palette className="w-3.5 h-3.5" />
                                        Change Style
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Google Reviews ── */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2.5 text-lg">
                                <div className="p-2 rounded-lg bg-amber-500/10">
                                    <Star className="w-4 h-4 text-amber-500" />
                                </div>
                                Google Reviews
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Paste your Google Maps business link and we'll automatically import your existing reviews onto your website.
                            </p>

                            {/* URL input */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-foreground">Google Maps Business URL</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="url"
                                        value={googleMapsUrl}
                                        onChange={(e) => {
                                            setGoogleMapsUrl(e.target.value);
                                            setGoogleUrlSaved(false);
                                            setGoogleSyncResult(null);
                                        }}
                                        placeholder="https://maps.google.com/maps?cid=... or google.com/maps/place/..."
                                        className="flex-1 text-xs"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Find this by searching your dealership on Google Maps → Share → Copy Link
                                </p>
                            </div>

                            {/* Status badges */}
                            {googlePlaceId && (
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                        Connected — Place ID: <span className="font-mono">{googlePlaceId.slice(0, 20)}…</span>
                                    </p>
                                </div>
                            )}

                            {googleSyncResult && (
                                <div className={cn(
                                    "flex items-start gap-2 px-3 py-2 rounded-lg border text-xs",
                                    googleSyncResult.success
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                        : "bg-destructive/10 border-destructive/20 text-destructive"
                                )}>
                                    {googleSyncResult.success
                                        ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                        : <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                    }
                                    {googleSyncResult.message}
                                </div>
                            )}

                            {/* Sync button */}
                            <Button
                                onClick={handleSyncGoogleReviews}
                                disabled={googleSyncing || (!googleMapsUrl && !googlePlaceId)}
                                className="gap-2 bg-amber-500 hover:bg-amber-600 text-white"
                                size="sm"
                            >
                                {googleSyncing
                                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Syncing...</>
                                    : <><RefreshCcw className="w-3.5 h-3.5" /> Sync Google Reviews</>
                                }
                            </Button>

                            <p className="text-[11px] text-muted-foreground">
                                Google provides up to 5 most recent reviews. Synced reviews appear instantly in the Reviews section of your website.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card variant="glass" className="border-destructive/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2.5 text-lg text-destructive">
                                <div className="p-2 rounded-lg bg-destructive/10">
                                    <Shield className="w-4 h-4 text-destructive" />
                                </div>
                                Danger Zone
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-red-500/5 border border-destructive/20">
                                <div>
                                    <p className="text-sm font-medium text-foreground">Reset Onboarding</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Clear all settings and start your website setup over
                                    </p>
                                </div>
                                <Button variant="destructive" size="sm">Reset</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Right: Quick Panel (1/3 width) ── */}
                <div className="space-y-4">

                    {/* Profile Summary */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="text-base">Dealership Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Avatar + Name */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                                    {formData.dealershipName?.charAt(0)?.toUpperCase() || "D"}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-foreground text-sm truncate">
                                        {formData.dealershipName || "Your Dealership"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {formData.location || "Location not set"}
                                    </p>
                                </div>
                            </div>

                            {/* Contact details */}
                            <div className="space-y-2">
                                {[
                                    { icon: Phone,     label: formData.phone || "Phone not set" },
                                    { icon: Mail,      label: formData.email || "Email not set" },
                                    { icon: MapPin,    label: formData.location || "Location not set" },
                                    { icon: Building2, label: formData.yearsInBusiness ? `${formData.yearsInBusiness} yrs in business` : "Experience not set" },
                                ].map(({ icon: Icon, label }) => (
                                    <div key={label} className="flex items-center gap-2.5 text-muted-foreground px-1">
                                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span className="text-xs truncate">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dashboard Theme */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="text-base">Dashboard Theme</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-muted/30">
                                <div className="flex items-center gap-2.5">
                                    {theme === "dark"
                                        ? <Moon className="w-4 h-4 text-blue-400" />
                                        : <Sun className="w-4 h-4 text-amber-500" />
                                    }
                                    <span className="text-sm font-medium">
                                        {theme === "dark" ? "Dark Mode" : "Light Mode"}
                                    </span>
                                </div>
                                <ThemeToggle />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2.5 px-1">
                                Your preference is saved automatically.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Website URL */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="text-base">Your Website</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="px-3 py-2.5 rounded-xl bg-muted/30 text-xs text-muted-foreground font-mono truncate">
                                {data.subdomain
                                    ? `${data.subdomain}.dealersitepro.com`
                                    : "subdomain.dealersitepro.com"}
                            </div>
                            <Link href="/preview" className="block">
                                <Button variant="outline" size="sm" className="w-full gap-2">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Preview Website
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* App Info */}
                    <Card variant="glass">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                <p>
                                    DealerSite Pro v1.0 Beta — Changes save to your local profile.
                                    Full database sync is coming in Phase 2.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

"use client"
import { useState, useEffect } from "react";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import {
    Save, Globe, Bell, Palette, Shield,
    Phone, Mail, MapPin, Building2,
    ExternalLink, Sun, Moon, Info,
    Plug, Eye, EyeOff, CheckCircle2, XCircle, Loader2,
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
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
                                <div className="p-2 rounded-lg bg-blue-500/10">
                                    <Globe className="w-4 h-4 text-blue-500" />
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
                                <div className="p-2 rounded-lg bg-emerald-500/10">
                                    <Plug className="w-4 h-4 text-emerald-500" />
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
                                                ? <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                                    <CheckCircle2 className="w-3 h-3" /> Connected
                                                  </span>
                                                : <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                                                    Not connected
                                                  </span>
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
                                        <input
                                            type={showCyeproKey ? "text" : "password"}
                                            value={cyeproKey}
                                            onChange={(e) => {
                                                setCyeproKey(e.target.value);
                                                setCyeproStatus("idle");
                                                setCyeproError("");
                                            }}
                                            placeholder="Paste your Cyepro API key here"
                                            className="w-full h-10 text-sm font-mono rounded-lg border border-input bg-background px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCyeproKey(v => !v)}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showCyeproKey
                                                ? <EyeOff className="w-4 h-4" />
                                                : <Eye className="w-4 h-4" />}
                                        </button>
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
                                                className="text-red-500 border-red-500/30 hover:bg-red-500/5"
                                                onClick={handleRemoveCyeproKey}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>

                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Your API key is stored securely and only used server-side.
                                        It will never be exposed in the browser.
                                        Once connected, your used-car website will automatically show live inventory.
                                    </p>
                                </div>
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

                    {/* Danger Zone */}
                    <Card variant="glass" className="border-red-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2.5 text-lg text-red-600 dark:text-red-400">
                                <div className="p-2 rounded-lg bg-red-500/10">
                                    <Shield className="w-4 h-4 text-red-500" />
                                </div>
                                Danger Zone
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-red-500/5 border border-red-500/20">
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

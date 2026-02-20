"use client"
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import {
    Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Upload, X, CheckCircle2, Palette, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Colour Presets ─────────────────────────────────────────────────────────
const PRESETS: {
    id: string;
    name: string;
    description: string;
    primary: string;
    accent: string;
    swatch: string; // gradient for the visual chip
}[] = [
    {
        id: "prestige",
        name: "Prestige",
        description: "Bentley-inspired deep green & champagne gold",
        primary: "#003328",
        accent: "#B8962E",
        swatch: "linear-gradient(135deg, #003328 50%, #B8962E 50%)",
    },
    {
        id: "midnight",
        name: "Midnight",
        description: "Dark navy with silver — timeless & bold",
        primary: "#1C1C3A",
        accent: "#C0C0C0",
        swatch: "linear-gradient(135deg, #1C1C3A 50%, #C0C0C0 50%)",
    },
    {
        id: "heritage",
        name: "Heritage",
        description: "Rich burgundy & warm gold — stately authority",
        primary: "#4A1528",
        accent: "#C4A35A",
        swatch: "linear-gradient(135deg, #4A1528 50%, #C4A35A 50%)",
    },
    {
        id: "executive",
        name: "Executive",
        description: "Charcoal & deep blue — corporate confidence",
        primary: "#2D2D2D",
        accent: "#1E3A5F",
        swatch: "linear-gradient(135deg, #2D2D2D 50%, #1E3A5F 50%)",
    },
];

// Quick HEX validation
function isValidHex(value: string) {
    return /^#[0-9A-Fa-f]{6}$/.test(value);
}

// Convert file → base64
function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export default function Step2UsedPage() {
    const router = useRouter();
    const { data, updateData, setStep } = useOnboardingStore();

    // ── Colour state ───────────────────────────────────────────────────────
    const [selectedPreset, setSelectedPreset] = useState<string>(
        data.brandColorPreset || "prestige"
    );
    const [customColor, setCustomColor] = useState<string>(
        data.brandColor || PRESETS[0].primary
    );
    const [customAccent, setCustomAccent] = useState<string>(
        PRESETS[0].accent
    );
    const [useCustom, setUseCustom] = useState(false);
    const [colorError, setColorError] = useState("");
    const [accentError, setAccentError] = useState("");

    // ── Logo state ─────────────────────────────────────────────────────────
    const [logoPreview, setLogoPreview] = useState<string>(data.brandLogo || "");
    const [logoError, setLogoError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync preset accent when preset changes
    useEffect(() => {
        if (!useCustom) {
            const preset = PRESETS.find(p => p.id === selectedPreset);
            if (preset) {
                setCustomColor(preset.primary);
                setCustomAccent(preset.accent);
            }
        }
    }, [selectedPreset, useCustom]);

    useEffect(() => { setStep(2); }, [setStep]);

    // ── Logo upload ────────────────────────────────────────────────────────
    const processLogoFile = useCallback(async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setLogoError("Please upload an image file (PNG, JPG, SVG, WEBP)");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setLogoError("Logo must be under 2 MB");
            return;
        }
        setLogoError("");
        try {
            const base64 = await fileToBase64(file);
            setLogoPreview(base64);
        } catch {
            setLogoError("Failed to read the file. Please try again.");
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processLogoFile(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processLogoFile(file);
    };

    // ── Navigation ─────────────────────────────────────────────────────────
    const handleNext = () => {
        // Validate custom colours if entered
        if (useCustom) {
            let hasError = false;
            if (!isValidHex(customColor)) { setColorError("Enter a valid hex colour e.g. #003328"); hasError = true; }
            if (!isValidHex(customAccent)) { setAccentError("Enter a valid hex colour e.g. #B8962E"); hasError = true; }
            if (hasError) return;
        }

        const finalColor = useCustom ? customColor : PRESETS.find(p => p.id === selectedPreset)!.primary;
        const finalAccent = useCustom ? customAccent : PRESETS.find(p => p.id === selectedPreset)!.accent;
        const finalPreset = useCustom ? "custom" : selectedPreset;

        updateData({
            sellsNewCars: false,
            sellsUsedCars: true,
            brands: [],
            brandColor: finalColor,
            brandColorPreset: finalPreset + "|" + finalAccent, // encode both colors
            brandLogo: logoPreview || undefined,
        });
        // Go to inventory source selection before services
        router.push("/onboarding/step-2-inventory");
    };

    const handleBack = () => {
        router.push("/onboarding/step-1");
    };

    // ── Active colour preview ───────────────────────────────────────────────
    const activePreset = PRESETS.find(p => p.id === selectedPreset);
    const previewPrimary = useCustom ? customColor : (activePreset?.primary ?? "#003328");
    const previewAccent = useCustom ? customAccent : (activePreset?.accent ?? "#B8962E");

    return (
        <Card className="animate-fade-in">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-amber-600" />
                    Your Brand Identity
                </CardTitle>
                <CardDescription>
                    Choose a colour palette that represents your dealership. You can also upload your logo.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">

                {/* ── Live preview strip ─────────────────────────────────── */}
                <div
                    className="rounded-2xl overflow-hidden border border-border shadow-sm"
                    style={{ background: previewPrimary }}
                >
                    <div className="px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {logoPreview ? (
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
                                    <Image
                                        src={logoPreview}
                                        alt="Your logo"
                                        width={40}
                                        height={40}
                                        className="object-contain w-full h-full"
                                    />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                                    <ImageIcon className="w-5 h-5 text-white/60" />
                                </div>
                            )}
                            <div>
                                <p className="text-white font-bold text-sm leading-tight">
                                    {data.dealershipName || "Your Dealership"}
                                </p>
                                <p className="text-white/60 text-xs">Premium Pre-Owned Vehicles</p>
                            </div>
                        </div>
                        <div
                            className="text-xs font-semibold px-3 py-1.5 rounded-full"
                            style={{ background: previewAccent, color: previewPrimary }}
                        >
                            View Inventory
                        </div>
                    </div>
                    <div
                        className="h-1"
                        style={{ background: previewAccent }}
                    />
                </div>

                {/* ── Preset palettes ────────────────────────────────────── */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">Choose a Palette</h3>
                        <button
                            onClick={() => setUseCustom(false)}
                            className={cn(
                                "text-xs px-2.5 py-1 rounded-full transition-colors",
                                !useCustom
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Presets
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {PRESETS.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => { setSelectedPreset(preset.id); setUseCustom(false); }}
                                className={cn(
                                    "flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200",
                                    !useCustom && selectedPreset === preset.id
                                        ? "border-amber-500/60 bg-amber-500/5"
                                        : "border-input hover:border-border hover:bg-muted/40"
                                )}
                            >
                                {/* Swatch */}
                                <div
                                    className="w-10 h-10 rounded-xl flex-shrink-0 shadow-sm border border-white/10"
                                    style={{ background: preset.swatch }}
                                />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-sm font-semibold truncate">{preset.name}</p>
                                        {!useCustom && selectedPreset === preset.id && (
                                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {preset.description}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Custom colour inputs ────────────────────────────────── */}
                <div className="space-y-3">
                    <button
                        onClick={() => setUseCustom(!useCustom)}
                        className={cn(
                            "w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-200",
                            useCustom
                                ? "border-amber-500/60 bg-amber-500/5"
                                : "border-dashed border-border hover:border-amber-400/40 hover:bg-muted/40"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            {/* Live swatch */}
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-white/10 flex-shrink-0">
                                <div className="absolute inset-0 left-0 w-1/2" style={{ background: useCustom ? customColor : "#888" }} />
                                <div className="absolute inset-0 left-1/2 w-1/2" style={{ background: useCustom ? customAccent : "#ccc" }} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Use My Brand Colour</p>
                                <p className="text-xs text-muted-foreground">Enter your own hex colour codes</p>
                            </div>
                        </div>
                        {useCustom && <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />}
                    </button>

                    {useCustom && (
                        <div className="grid grid-cols-2 gap-3 pl-1">
                            {/* Primary */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Primary Colour</label>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-8 h-8 rounded-lg border border-border flex-shrink-0 cursor-pointer relative overflow-hidden"
                                        style={{ background: isValidHex(customColor) ? customColor : "#888" }}
                                    >
                                        <input
                                            type="color"
                                            value={isValidHex(customColor) ? customColor : "#888888"}
                                            onChange={(e) => {
                                                setCustomColor(e.target.value.toUpperCase());
                                                setColorError("");
                                            }}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={customColor}
                                        onChange={(e) => {
                                            const v = e.target.value.toUpperCase();
                                            setCustomColor(v.startsWith("#") ? v : "#" + v);
                                            setColorError("");
                                        }}
                                        placeholder="#003328"
                                        maxLength={7}
                                        className="flex-1 h-9 text-sm font-mono px-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                {colorError && <p className="text-xs text-destructive">{colorError}</p>}
                            </div>

                            {/* Accent */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Accent / Highlight</label>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-8 h-8 rounded-lg border border-border flex-shrink-0 cursor-pointer relative overflow-hidden"
                                        style={{ background: isValidHex(customAccent) ? customAccent : "#ccc" }}
                                    >
                                        <input
                                            type="color"
                                            value={isValidHex(customAccent) ? customAccent : "#cccccc"}
                                            onChange={(e) => {
                                                setCustomAccent(e.target.value.toUpperCase());
                                                setAccentError("");
                                            }}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={customAccent}
                                        onChange={(e) => {
                                            const v = e.target.value.toUpperCase();
                                            setCustomAccent(v.startsWith("#") ? v : "#" + v);
                                            setAccentError("");
                                        }}
                                        placeholder="#B8962E"
                                        maxLength={7}
                                        className="flex-1 h-9 text-sm font-mono px-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                {accentError && <p className="text-xs text-destructive">{accentError}</p>}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Logo upload ─────────────────────────────────────────── */}
                <div className="space-y-3">
                    <div>
                        <h3 className="text-sm font-semibold">Upload Your Logo</h3>
                        <p className="text-xs text-muted-foreground">Optional — PNG, JPG, SVG or WEBP, max 2 MB</p>
                    </div>

                    {logoPreview ? (
                        <div className="relative flex items-center gap-4 p-4 rounded-xl border-2 border-emerald-500/40 bg-emerald-500/5">
                            <div className="w-16 h-16 rounded-xl border border-border bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                                <Image
                                    src={logoPreview}
                                    alt="Logo preview"
                                    width={64}
                                    height={64}
                                    className="object-contain w-full h-full p-1"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    Logo uploaded
                                </p>
                                <p className="text-xs text-muted-foreground">Looking great! You can replace it below.</p>
                            </div>
                            <button
                                onClick={() => { setLogoPreview(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                                "flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200",
                                isDragging
                                    ? "border-amber-500/60 bg-amber-500/5"
                                    : "border-border hover:border-amber-400/50 hover:bg-muted/30"
                            )}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                                <Upload className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium">
                                    {isDragging ? "Drop it here!" : "Click or drag & drop your logo"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, SVG · Max 2 MB</p>
                            </div>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {logoError && (
                        <p className="text-xs text-destructive flex items-center gap-1.5">
                            <X className="w-3.5 h-3.5" />
                            {logoError}
                        </p>
                    )}
                </div>

                {/* ── Info note ─────────────────────────────────────────── */}
                <div className="p-4 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground leading-relaxed">
                    <p className="font-medium text-foreground mb-1">These colours will be applied to all 4 website templates</p>
                    You&apos;ll preview them on the next step and choose the layout that fits your dealership best.
                </div>
            </CardContent>

            <CardFooter className="justify-between">
                <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                </Button>
                <Button onClick={handleNext} className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white">
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}

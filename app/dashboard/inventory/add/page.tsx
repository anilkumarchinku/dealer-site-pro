"use client"
import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Sparkles, Check, Loader2, Car, ImagePlus, X, Camera, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { addVehicle, fetchVehicleById, updateVehicle } from "@/lib/db/vehicles";
import { useOnboardingStore } from "@/lib/store/onboarding-store";

const FEATURES = [
    "Leather Seats", "Sunroof / Moonroof", "Navigation System", "Backup Camera",
    "Heated Seats", "Bluetooth", "All-Wheel Drive", "Third Row Seating",
    "Apple CarPlay", "Android Auto", "Keyless Entry", "Remote Start",
    "Cruise Control", "Lane Assist", "Parking Sensors", "Ventilated Seats",
];

const MAX_VEHICLE_IMAGES = 10;

interface FormData {
    vin: string;
    registration_number: string;
    make: string;
    model: string;
    variant: string;
    year: string;
    price_paise: string;
    mileage_km: string;
    color: string;
    transmission: string;
    fuel_type: string;
    features: string[];
    description: string;
    meta_title: string;
    meta_description: string;
    insurance_status: "unknown" | "active" | "expired" | "expiring_soon";
    insurance_provider: string;
    insurance_valid_until: string;
    insurance_quote_url: string;
    video_url: string;
    condition: "new" | "used" | "certified_pre_owned";
}

/** Convert any YouTube URL to an embed URL */
function toYouTubeEmbed(url: string): string | null {
    if (!url) return null
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

function deriveInsuranceStatus(validUntil: string, fallback: FormData["insurance_status"]): FormData["insurance_status"] {
    if (!validUntil) return fallback;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(`${validUntil}T00:00:00`);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
    if (daysUntilExpiry < 0) return "expired";
    if (daysUntilExpiry <= 30) return "expiring_soon";
    return "active";
}

function AddVehiclePageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vehicleId = searchParams.get('vehicleId');
    const { dealerId, data } = useOnboardingStore();
    const isHybrid    = data.sellsNewCars && data.sellsUsedCars;
    const isFirstHand = data.sellsNewCars && !data.sellsUsedCars;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const makeRef  = useRef<HTMLInputElement>(null);
    const modelRef = useRef<HTMLInputElement>(null);

    // IMPORTANT: All hooks must be declared before any early returns
    const [isDraftMode, setIsDraftMode] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        vin: "",
        registration_number: "",
        make: "",
        model: "",
        variant: "",
        year: "",
        price_paise: "",
        mileage_km: "",
        color: "",
        transmission: "Automatic",
        fuel_type: "Petrol",
        features: [],
        description: "",
        meta_title: "",
        meta_description: "",
        insurance_status: "unknown",
        insurance_provider: "",
        insurance_valid_until: "",
        insurance_quote_url: "",
        video_url: "",
        condition: "used",
    });
    const [images, setImages]         = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAIGenerating, setIsAIGenerating] = useState(false);
    const [isSaving, setIsSaving]     = useState(false);
    const [saveError, setSaveError]   = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ make?: string; model?: string }>({});

    // Load draft vehicle data if vehicleId is present
    useEffect(() => {
        if (!vehicleId || !dealerId) return;

        const loadDraft = async () => {
            const { vehicle, error } = await fetchVehicleById(dealerId, vehicleId);

            if (error || !vehicle) {
                setSaveError('Failed to load draft vehicle');
                return;
            }

            if (vehicle.status !== 'draft') {
                setSaveError('This vehicle is not a draft');
                return;
            }

            // Pre-populate form with draft data
            setIsDraftMode(true);
            setFormData({
                vin: vehicle.vin || '',
                registration_number: vehicle.registration_number || '',
                make: vehicle.make,
                model: vehicle.model,
                variant: vehicle.variant || '',
                year: vehicle.year.toString(),
                price_paise: '', // Leave empty for dealer to fill
                mileage_km: vehicle.mileage_km?.toString() || '',
                color: vehicle.color || '',
                transmission: vehicle.transmission || 'Automatic',
                fuel_type: vehicle.fuel_type || 'Petrol',
                features: vehicle.features || [],
                description: vehicle.description || '',
                meta_title: vehicle.meta_title || '',
                meta_description: vehicle.meta_description || '',
                insurance_status: vehicle.insurance_status || 'unknown',
                insurance_provider: vehicle.insurance_provider || '',
                insurance_valid_until: vehicle.insurance_valid_until || '',
                insurance_quote_url: vehicle.insurance_quote_url || '',
                video_url: vehicle.video_url || '',
                condition: vehicle.condition,
            });
        };

        loadDraft();
    }, [vehicleId, dealerId]);

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear inline error for this field as the dealer corrects it
        if (field === "make" || field === "model") {
            setFieldErrors(prev => (prev[field] ? { ...prev, [field]: undefined } : prev));
        }
    };

    const toggleFeature = (feature: string) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.includes(feature)
                ? prev.features.filter(f => f !== feature)
                : [...prev.features, feature]
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;
        const remaining = MAX_VEHICLE_IMAGES - images.length;
        const toAdd = files.slice(0, remaining);
        setImages(prev => [...prev, ...toAdd]);
        toAdd.forEach(file => {
            const reader = new FileReader();
            reader.onload = ev => {
                setImagePreviews(prev => [...prev, ev.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
        // Reset input so same file can be re-selected
        e.target.value = "";
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const generateFromVIN = async () => {
        if (!formData.vin) {
            setSaveError("Please enter a VIN");
            return;
        }
        setIsGenerating(true);
        setSaveError(null);
        try {
            const response = await fetch('/api/vehicles/decode-vin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vin: formData.vin })
            });
            const data = await response.json();
            if (data.success) {
                setFormData(prev => ({
                    ...prev,
                    make:      data.make      || prev.make,
                    model:     data.model     || prev.model,
                    year:      data.year?.toString() || prev.year,
                    fuel_type: data.fuel_type || prev.fuel_type,
                }));
            } else {
                setSaveError(data.error || 'Failed to decode VIN');
            }
        } catch {
            setSaveError('Error decoding VIN');
        } finally {
            setIsGenerating(false);
        }
    };

    const generateAIDescription = async () => {
        if (!formData.make || !formData.model) {
            setSaveError('Please enter Make and Model before generating a description.');
            return;
        }
        setIsAIGenerating(true);
        setSaveError(null);
        try {
            const res = await fetch('/api/ai/generate-description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    make:         formData.make,
                    model:        formData.model,
                    variant:      formData.variant || undefined,
                    year:         parseInt(formData.year) || undefined,
                    fuel_type:    formData.fuel_type || undefined,
                    transmission: formData.transmission || undefined,
                    color:        formData.color || undefined,
                    mileage_km:   parseInt(formData.mileage_km) || undefined,
                    condition:    formData.condition,
                    features:     formData.features.length ? formData.features : undefined,
                    price_lakhs:  formData.price_paise ? (parseFloat(formData.price_paise)).toFixed(2) : undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? 'AI generation failed');
            if (data.description) {
                setFormData(prev => ({ ...prev, description: data.description }));
            }
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : 'AI generation failed');
        } finally {
            setIsAIGenerating(false);
        }
    };

    const generateSeoMeta = () => {
        if (!formData.make || !formData.model) {
            setSaveError('Please enter Make and Model before generating SEO metadata.');
            return;
        }
        const vehicleName = [formData.year, formData.make, formData.model, formData.variant].filter(Boolean).join(' ');
        const location = data.location ? ` in ${data.location}` : '';
        const priceText = formData.price_paise
            ? ` at ₹${Number(formData.price_paise).toLocaleString('en-IN')}`
            : '';
        setFormData(prev => ({
            ...prev,
            meta_title: `${vehicleName} for Sale${location} | ${data.dealershipName || 'DealerSite Pro'}`.slice(0, 70),
            meta_description: `Explore ${vehicleName}${priceText}${location}. View price, fuel type, transmission, kilometers, features and contact ${data.dealershipName || 'the dealer'} for a test drive.`.slice(0, 160),
        }));
    };

    const handleSave = async () => {
        if (!dealerId) { setSaveError("Dealer ID not found"); return; }

        // ── Inline per-field validation for required fields ──────
        const errors: { make?: string; model?: string } = {};
        if (!formData.make.trim())  errors.make  = "Make is required";
        if (!formData.model.trim()) errors.model = "Model is required";
        setFieldErrors(errors);
        if (errors.make || errors.model) {
            setSaveError("Please fill in the highlighted required fields.");
            // Scroll/focus the FIRST invalid field
            const firstInvalidRef = errors.make ? makeRef : modelRef;
            firstInvalidRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            firstInvalidRef.current?.focus({ preventScroll: true });
            return;
        }

        setIsSaving(true);
        setSaveError(null);
        try {
            const imageUrls: string[] = [];
            for (const image of images) {
                const uploadData = new FormData();
                uploadData.append("file", image);
                const uploadRes = await fetch("/api/vehicles/upload-image", {
                    method: "POST",
                    body: uploadData,
                });
                const uploadJson = await uploadRes.json();
                if (!uploadRes.ok) {
                    throw new Error(uploadJson.error ?? "Failed to upload vehicle photo");
                }
                imageUrls.push(uploadJson.url);
            }
            const imageUrl = imageUrls[0];

            // Prepare vehicle data
            const vehicleData = {
                dealer_id:    dealerId,
                vin:          formData.vin,
                registration_number: formData.registration_number.trim().toUpperCase() || undefined,
                make:         formData.make,
                model:        formData.model,
                variant:      formData.variant,
                year:         parseInt(formData.year) || new Date().getFullYear(),
                price_paise:  Math.round((parseFloat(formData.price_paise) || 0) * 100),
                mileage_km:   parseInt(formData.mileage_km) || 0,
                color:        formData.color,
                transmission: formData.transmission,
                fuel_type:    formData.fuel_type,
                features:     formData.features,
                description:  formData.description,
                image_url:    imageUrl,
                image_urls:   imageUrls,
                video_url:    toYouTubeEmbed(formData.video_url) ?? (formData.video_url || undefined),
                meta_title:       formData.meta_title,
                meta_description: formData.meta_description,
                insurance_status: deriveInsuranceStatus(formData.insurance_valid_until, formData.insurance_status),
                insurance_provider: formData.insurance_provider || undefined,
                insurance_valid_until: formData.insurance_valid_until || undefined,
                insurance_quote_url: formData.insurance_quote_url || undefined,
                insurance_last_checked_at: formData.insurance_valid_until ? new Date().toISOString() : undefined,
                condition:    formData.condition,
            };

            // Update draft or create new vehicle
            const result = isDraftMode && vehicleId
                ? await updateVehicle(vehicleId, dealerId, {
                      ...vehicleData,
                      status: "available", // Change from draft to available
                  })
                : await addVehicle(vehicleData);

            if (result.success) {
                // Fire-and-forget social post (non-blocking)
                const carName = [formData.year, formData.make, formData.model, formData.variant].filter(Boolean).join(' ')
                const priceNum = parseFloat(formData.price_paise)
                const priceText = priceNum > 0
                    ? `₹${(priceNum / 100000).toFixed(1)} Lakh`
                    : 'Price on Request'
                fetch('/api/social/post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dealer_id:  dealerId,
                        car_name:   carName,
                        price_text: priceText,
                        fuel_type:  formData.fuel_type || undefined,
                        color:      formData.color || undefined,
                        image_url:   imageUrl,
                    }),
                }).catch(() => { /* social post failure is non-fatal */ })
                // Fire-and-forget push notification to opted-in subscribers
                fetch('/api/push-trigger', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'new_listing',
                        vehicle: { make: formData.make, model: formData.model, year: Number(formData.year), price_paise: priceNum || null },
                    }),
                }).catch(() => { /* push trigger failure is non-fatal */ })
                router.push('/dashboard/inventory');
            } else {
                setSaveError(result.error || 'Failed to save vehicle');
            }
        } catch {
            setSaveError('Error saving vehicle');
        } finally {
            setIsSaving(false);
        }
    };

    // Conditional early return — after all hooks
    if (isFirstHand) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                    <Car className="w-10 h-10 text-amber-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Not Available for Your Plan</h1>
                <p className="text-muted-foreground max-w-md mb-2">
                    Vehicle adding is only available for <strong>hybrid</strong> and <strong>used-car</strong> dealers.
                </p>
                <p className="text-sm text-muted-foreground max-w-md mb-8">
                    As a new-car dealer, your brand catalog is managed automatically — no manual inventory needed.
                </p>
                <Button onClick={() => router.push('/dashboard/inventory')} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="pb-8">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="rounded-2xl border border-border/70 bg-card/90 p-5 shadow-sm dark:bg-card/80 sm:p-6">
                    <div className="flex items-start gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/dashboard/inventory')}
                        className="rounded-xl"
                        aria-label="Back to inventory"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.24em] text-blue-600 dark:text-blue-300">Inventory setup</p>
                        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{isDraftMode ? 'Complete Vehicle Details' : 'Add Vehicle'}</h1>
                        <p className="mt-2 max-w-2xl text-muted-foreground text-sm leading-6">
                            {isDraftMode ? 'Fill in the missing details to publish this vehicle' : 'Add a new vehicle to your inventory'}
                        </p>
                    </div>
                    </div>
                </div>

                {saveError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                        <X className="w-4 h-4 shrink-0" />
                        {saveError}
                    </div>
                )}

                {/* Photo Upload */}
                <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Camera className="w-5 h-5 text-muted-foreground" />
                            Vehicle Photos
                        </CardTitle>
                        <CardDescription>
                            Add photos to attract more buyers — listings with photos get 4× more enquiries
                            <span className="ml-1 text-xs">({images.length}/{MAX_VEHICLE_IMAGES})</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {imagePreviews.map((src, i) => (
                                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                                        >
                                            <X className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                    {i === 0 && (
                                        <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded font-medium">
                                            Main
                                        </span>
                                    )}
                                </div>
                            ))}
                            {images.length < MAX_VEHICLE_IMAGES && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isSaving}
                                    className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
                                >
                                    <ImagePlus className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                                    <span className="text-xs text-gray-400 group-hover:text-primary transition-colors">Add Photo</span>
                                </button>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                        {images.length === 0 && (
                            <p className="text-xs text-muted-foreground mt-3 text-center">
                                JPG, PNG, WEBP · Max {MAX_VEHICLE_IMAGES} photos · First photo will be the main listing image
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Identification Section */}
                <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                    <CardHeader>
                        <CardTitle>Vehicle Identification</CardTitle>
                        <CardDescription>Enter VIN for decoding and number plate for public listing display</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">VIN <span className="text-muted-foreground font-normal">(optional)</span></label>
                            <div className="flex gap-2">
                                <Input
                                    value={formData.vin}
                                    onChange={(e) => handleChange('vin', e.target.value.toUpperCase())}
                                    placeholder="e.g. MA3EYD61S00123456"
                                    disabled={isGenerating || isSaving}
                                    className="font-mono tracking-wide"
                                />
                                <Button
                                    onClick={generateFromVIN}
                                    disabled={!formData.vin || isGenerating || isSaving}
                                    variant="outline"
                                >
                                    {isGenerating ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Decoding...</>
                                    ) : (
                                        <><Sparkles className="w-4 h-4 mr-2" />Decode</>
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Registration Number / Number Plate <span className="text-muted-foreground font-normal">(optional)</span></label>
                            <Input
                                value={formData.registration_number}
                                onChange={(e) => handleChange('registration_number', e.target.value.toUpperCase())}
                                placeholder="e.g. TS09AB1234"
                                disabled={isSaving}
                                className="font-mono tracking-wide"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Basic Details */}
                <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                    <CardHeader>
                        <CardTitle>Basic Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Make <span className="text-red-500">*</span></label>
                                <Input
                                    ref={makeRef}
                                    value={formData.make}
                                    onChange={(e) => handleChange('make', e.target.value)}
                                    placeholder="e.g., Maruti Suzuki"
                                    disabled={isSaving}
                                    aria-invalid={!!fieldErrors.make}
                                    className={cn(fieldErrors.make && "border-red-500 focus-visible:ring-red-500")}
                                />
                                {fieldErrors.make && <p className="mt-1 text-xs text-red-600">{fieldErrors.make}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Model <span className="text-red-500">*</span></label>
                                <Input
                                    ref={modelRef}
                                    value={formData.model}
                                    onChange={(e) => handleChange('model', e.target.value)}
                                    placeholder="e.g., Swift"
                                    disabled={isSaving}
                                    aria-invalid={!!fieldErrors.model}
                                    className={cn(fieldErrors.model && "border-red-500 focus-visible:ring-red-500")}
                                />
                                {fieldErrors.model && <p className="mt-1 text-xs text-red-600">{fieldErrors.model}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Variant / Trim</label>
                                <Input
                                    value={formData.variant}
                                    onChange={(e) => handleChange('variant', e.target.value)}
                                    placeholder="e.g., VXI, ZXI+, AT"
                                    disabled={isSaving}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Year</label>
                                <Input
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) => handleChange('year', e.target.value)}
                                    placeholder="e.g., 2022"
                                    min="1990"
                                    max={new Date().getFullYear() + 1}
                                    disabled={isSaving}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Price (₹)</label>
                                <Input
                                    type="number"
                                    value={formData.price_paise}
                                    onChange={(e) => handleChange('price_paise', e.target.value)}
                                    placeholder="e.g., 650000"
                                    disabled={isSaving}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Color</label>
                                <Input
                                    value={formData.color}
                                    onChange={(e) => handleChange('color', e.target.value)}
                                    placeholder="e.g., Pearl White"
                                    disabled={isSaving}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Specifications */}
                <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                    <CardHeader>
                        <CardTitle>Specifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Mileage (km)</label>
                                <Input
                                    type="number"
                                    value={formData.mileage_km}
                                    onChange={(e) => handleChange('mileage_km', e.target.value)}
                                    placeholder="e.g., 32000"
                                    disabled={isSaving}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Transmission</label>
                                <select
                                    value={formData.transmission}
                                    onChange={(e) => handleChange('transmission', e.target.value)}
                                    disabled={isSaving}
                                    className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option>Automatic</option>
                                    <option>Manual</option>
                                    <option>CVT</option>
                                    <option>DCT</option>
                                    <option>AMT</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Fuel Type</label>
                                <select
                                    value={formData.fuel_type}
                                    onChange={(e) => handleChange('fuel_type', e.target.value)}
                                    disabled={isSaving}
                                    className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option>Petrol</option>
                                    <option>Diesel</option>
                                    <option>CNG</option>
                                    <option>Electric</option>
                                    <option>Hybrid</option>
                                    <option>LPG</option>
                                </select>
                            </div>
                            {isHybrid && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Condition</label>
                                    <select
                                        value={formData.condition}
                                        onChange={(e) => handleChange('condition', e.target.value as FormData["condition"])}
                                        disabled={isSaving}
                                        className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="new">New</option>
                                        <option value="used">Used</option>
                                        <option value="certified_pre_owned">Certified Pre-Owned</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Features */}
                <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                    <CardHeader>
                        <CardTitle>Features & Highlights</CardTitle>
                        <CardDescription>
                            Select all features this vehicle has
                            {formData.features.length > 0 && (
                                <span className="ml-1 font-medium text-primary">· {formData.features.length} selected</span>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2.5">
                            {FEATURES.map(feature => {
                                const selected = formData.features.includes(feature);
                                return (
                                    <button
                                        key={feature}
                                        type="button"
                                        onClick={() => toggleFeature(feature)}
                                        disabled={isSaving}
                                        className={cn(
                                            "flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all text-left",
                                            selected
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-input hover:border-primary/40 text-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                                            selected ? "border-primary bg-primary" : "border-input"
                                        )}>
                                            {selected && <Check className="w-2.5 h-2.5 text-white" />}
                                        </div>
                                        {feature}
                                    </button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Description */}
                <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <CardTitle>Description</CardTitle>
                                <CardDescription>Add a compelling description to attract buyers</CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={generateAIDescription}
                                disabled={isAIGenerating || isSaving}
                                className="gap-1.5 shrink-0 border-purple-200 text-purple-700 hover:bg-purple-50"
                            >
                                {isAIGenerating ? (
                                    <><Loader2 className="w-3.5 h-3.5 animate-spin" />Generating...</>
                                ) : (
                                    <><Sparkles className="w-3.5 h-3.5" />Generate with AI</>
                                )}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Describe the vehicle — or click &quot;Generate with AI&quot; to auto-write a description..."
                            disabled={isSaving || isAIGenerating}
                            className="w-full px-3 py-2.5 border border-input rounded-xl text-sm min-h-[120px] resize-none bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        <p className="text-xs text-muted-foreground mt-2">{formData.description.length}/500 characters</p>
                    </CardContent>
                </Card>

                {/* Insurance */}
                <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                    <CardHeader>
                        <CardTitle>Insurance</CardTitle>
                        <CardDescription>Track policy status and add a partner quote link for this listing</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Status</label>
                                <select
                                    value={formData.insurance_status}
                                    onChange={(e) => handleChange('insurance_status', e.target.value)}
                                    disabled={isSaving}
                                    className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="unknown">Unknown</option>
                                    <option value="active">Active</option>
                                    <option value="expiring_soon">Expiring Soon</option>
                                    <option value="expired">Expired</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Valid Until</label>
                                <Input
                                    type="date"
                                    value={formData.insurance_valid_until}
                                    onChange={(e) => handleChange('insurance_valid_until', e.target.value)}
                                    disabled={isSaving}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Insurer</label>
                                <Input
                                    value={formData.insurance_provider}
                                    onChange={(e) => handleChange('insurance_provider', e.target.value)}
                                    placeholder="e.g., ICICI Lombard"
                                    disabled={isSaving}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Quote Comparison URL</label>
                                <Input
                                    type="url"
                                    value={formData.insurance_quote_url}
                                    onChange={(e) => handleChange('insurance_quote_url', e.target.value)}
                                    placeholder="https://partner.example.com/quote"
                                    disabled={isSaving}
                                />
                            </div>
                        </div>
                        {formData.insurance_valid_until && (
                            <p className="text-xs text-muted-foreground">
                                Saved status will be {deriveInsuranceStatus(formData.insurance_valid_until, formData.insurance_status).replace(/_/g, ' ')} based on the expiry date.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* SEO Metadata */}
                <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <CardTitle>SEO Metadata</CardTitle>
                                <CardDescription>Customize the title and description shown by search engines for this listing</CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={generateSeoMeta}
                                disabled={isSaving}
                                className="gap-1.5 shrink-0"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Auto-generate
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Meta Title</label>
                            <Input
                                value={formData.meta_title}
                                onChange={(e) => handleChange('meta_title', e.target.value)}
                                placeholder="2022 Maruti Suzuki Swift for Sale in Hyderabad"
                                maxLength={70}
                                disabled={isSaving}
                            />
                            <p className="text-xs text-muted-foreground mt-1">{formData.meta_title.length}/70 characters</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Meta Description</label>
                            <textarea
                                value={formData.meta_description}
                                onChange={(e) => handleChange('meta_description', e.target.value)}
                                placeholder="Explore price, fuel type, transmission, kilometers and contact the dealer for a test drive."
                                maxLength={160}
                                disabled={isSaving}
                                className="w-full px-3 py-2.5 border border-input rounded-xl text-sm min-h-[90px] resize-none bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <p className="text-xs text-muted-foreground mt-1">{formData.meta_description.length}/160 characters</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Video Walkaround */}
                <Card className="rounded-2xl border-border/70 bg-card/90 shadow-sm dark:bg-card/80">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Youtube className="w-5 h-5 text-red-500" />
                            Video Walkaround
                            <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
                        </CardTitle>
                        <CardDescription>
                            Listings with a video get 3× more enquiries — paste your YouTube link
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Input
                            value={formData.video_url}
                            onChange={(e) => handleChange('video_url', e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            disabled={isSaving}
                        />
                        {toYouTubeEmbed(formData.video_url) && (
                            <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video">
                                <iframe
                                    src={toYouTubeEmbed(formData.video_url)!}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="Vehicle walkaround video"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3 pb-8">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/dashboard/inventory')}
                        disabled={isSaving}
                        className="px-6"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !formData.make || !formData.model}
                        className="flex-1"
                    >
                        {isSaving ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                        ) : isDraftMode ? (
                            <><Upload className="w-4 h-4 mr-2" />Publish Vehicle</>
                        ) : (
                            <><Upload className="w-4 h-4 mr-2" />Add Vehicle to Inventory</>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Wrap in Suspense to handle useSearchParams
export default function AddVehiclePage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <AddVehiclePageContent />
        </Suspense>
    );
}

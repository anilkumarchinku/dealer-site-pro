"use client"
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Sparkles, Check, Loader2, Car, ImagePlus, X, Camera, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { addVehicle } from "@/lib/db/vehicles";
import { useOnboardingStore } from "@/lib/store/onboarding-store";

const FEATURES = [
    "Leather Seats", "Sunroof / Moonroof", "Navigation System", "Backup Camera",
    "Heated Seats", "Bluetooth", "All-Wheel Drive", "Third Row Seating",
    "Apple CarPlay", "Android Auto", "Keyless Entry", "Remote Start",
    "Cruise Control", "Lane Assist", "Parking Sensors", "Ventilated Seats",
];

interface FormData {
    vin: string;
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
    video_url: string;
    condition: "new" | "used" | "certified_pre_owned";
}

/** Convert any YouTube URL to an embed URL */
function toYouTubeEmbed(url: string): string | null {
    if (!url) return null
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

export default function AddVehiclePage() {
    const router = useRouter();
    const { dealerId, data } = useOnboardingStore();
    const isHybrid    = data.sellsNewCars && data.sellsUsedCars;
    const isFirstHand = data.sellsNewCars && !data.sellsUsedCars;
    const fileInputRef = useRef<HTMLInputElement>(null);

    // IMPORTANT: All hooks must be declared before any early returns
    const [formData, setFormData] = useState<FormData>({
        vin: "",
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
        video_url: "",
        condition: "used",
    });
    const [images, setImages]         = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAIGenerating, setIsAIGenerating] = useState(false);
    const [isSaving, setIsSaving]     = useState(false);
    const [saveError, setSaveError]   = useState<string | null>(null);

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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
        const remaining = 5 - images.length;
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

    const handleSave = async () => {
        if (!dealerId) { setSaveError("Dealer ID not found"); return; }
        if (!formData.make || !formData.model) {
            setSaveError("Please fill in make and model");
            return;
        }
        setIsSaving(true);
        setSaveError(null);
        try {
            const result = await addVehicle({
                dealer_id:    dealerId,
                vin:          formData.vin,
                make:         formData.make,
                model:        formData.model,
                year:         parseInt(formData.year) || new Date().getFullYear(),
                price_paise:  Math.round((parseFloat(formData.price_paise) || 0) * 100),
                mileage_km:   parseInt(formData.mileage_km) || 0,
                color:        formData.color,
                transmission: formData.transmission,
                fuel_type:    formData.fuel_type,
                features:     formData.features,
                description:  formData.description,
                condition:    formData.condition,
            });
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
                    }),
                }).catch(() => { /* social post failure is non-fatal */ })
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
                <Button onClick={() => router.back()} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="py-4">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Add Vehicle</h1>
                        <p className="text-muted-foreground text-sm">Add a new vehicle to your inventory</p>
                    </div>
                </div>

                {saveError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                        <X className="w-4 h-4 shrink-0" />
                        {saveError}
                    </div>
                )}

                {/* Photo Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Camera className="w-5 h-5 text-muted-foreground" />
                            Vehicle Photos
                        </CardTitle>
                        <CardDescription>
                            Add photos to attract more buyers — listings with photos get 4× more enquiries
                            <span className="ml-1 text-xs">({images.length}/5)</span>
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
                            {images.length < 5 && (
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
                                JPG, PNG, WEBP · Max 5 photos · First photo will be the main listing image
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* VIN Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Vehicle Identification</CardTitle>
                        <CardDescription>Enter VIN to auto-fill make, model, and year</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>

                {/* Basic Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Make <span className="text-red-500">*</span></label>
                                <Input
                                    value={formData.make}
                                    onChange={(e) => handleChange('make', e.target.value)}
                                    placeholder="e.g., Maruti Suzuki"
                                    disabled={isSaving}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Model <span className="text-red-500">*</span></label>
                                <Input
                                    value={formData.model}
                                    onChange={(e) => handleChange('model', e.target.value)}
                                    placeholder="e.g., Swift"
                                    disabled={isSaving}
                                />
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
                <Card>
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
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm bg-white text-gray-900 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
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
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm bg-white text-gray-900 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
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
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm bg-white text-gray-900 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
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
                <Card>
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
                                                : "border-gray-200 hover:border-primary/40 text-gray-700 hover:bg-gray-50"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                                            selected ? "border-primary bg-primary" : "border-gray-300"
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
                <Card>
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
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm min-h-[120px] resize-none bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
                        />
                        <p className="text-xs text-muted-foreground mt-2">{formData.description.length}/500 characters</p>
                    </CardContent>
                </Card>

                {/* Video Walkaround */}
                <Card>
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
                        onClick={() => router.back()}
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
                        ) : (
                            <><Upload className="w-4 h-4 mr-2" />Add Vehicle to Inventory</>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

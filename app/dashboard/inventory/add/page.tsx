"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Sparkles, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { addVehicle } from "@/lib/db/vehicles";
import { useOnboardingStore } from "@/lib/store/onboarding-store";

const FEATURES = [
    "Leather Seats", "Sunroof", "Navigation", "Backup Camera",
    "Heated Seats", "Bluetooth", "All-Wheel Drive", "Third Row",
    "Apple CarPlay", "Android Auto", "Keyless Entry", "Remote Start",
];

export default function AddVehiclePage() {
    const router = useRouter();
    const { dealerId } = useOnboardingStore();
    const [formData, setFormData] = useState({
        vin: "",
        make: "",
        model: "",
        year: "",
        price: "",
        mileage: "",
        color: "",
        transmission: "Automatic",
        fuelType: "Petrol",
        features: [] as string[],
        description: "",
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const handleChange = (field: string, value: string) => {
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

    const handleGenerateDescription = () => {
        if (!formData.make || !formData.model || !formData.year) {
            alert("Please fill in make, model, and year first");
            return;
        }

        setIsGenerating(true);
        setTimeout(() => {
            const features = formData.features.length > 0
                ? `Equipped with ${formData.features.slice(0, 3).join(", ")}${formData.features.length > 3 ? " and more" : ""}, `
                : "";

            setFormData(prev => ({
                ...prev,
                description: `This stunning ${formData.year} ${formData.make} ${formData.model} is in excellent condition and ready for its new owner. ${features}this vehicle offers the perfect blend of style, comfort, and reliability. With ${formData.mileage ? formData.mileage.toLocaleString() + " miles" : "low mileage"}, it's been well-maintained and is priced to sell. Don't miss this opportunity – schedule your test drive today!`
            }));
            setIsGenerating(false);
        }, 1500);
    };

    const handleSubmit = async () => {
        if (!formData.make || !formData.model || !formData.year || !formData.price) {
            setSaveError("Please fill in Make, Model, Year and Price.");
            return;
        }
        if (!dealerId) {
            setSaveError("Dealer profile not found. Please complete onboarding first.");
            return;
        }

        setSaveError(null);
        setIsSaving(true);

        const result = await addVehicle({
            dealer_id:   dealerId,
            vin:         formData.vin || undefined,
            make:        formData.make,
            model:       formData.model,
            year:        parseInt(formData.year),
            price_paise: Math.round(parseFloat(formData.price) * 100), // ₹ → paise
            mileage_km:  formData.mileage ? parseInt(formData.mileage) : undefined,
            color:       formData.color || undefined,
            transmission: formData.transmission as "Manual" | "Automatic" | "AMT" | "CVT" | "DCT" | "iMT",
            fuel_type:   formData.fuelType as "Petrol" | "Diesel" | "CNG" | "Electric" | "Hybrid",
            features:    formData.features,
            description: formData.description || undefined,
            condition:   "used",
        });

        setIsSaving(false);

        if (result.success) {
            router.push("/dashboard/inventory");
        } else {
            setSaveError(result.error ?? "Failed to save vehicle. Please try again.");
        }
    };

    // Shared select class — bg and text both use CSS variables so dark/light both work
    const selectCls = "w-full h-11 px-4 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors";

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/inventory")} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Add Vehicle</h1>
                    <p className="text-muted-foreground">Add a used car to your inventory</p>
                </div>
            </div>

            {/* Two-column layout: form (left) + side panel (right) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

                {/* ── Main Form ── */}
                <div className="xl:col-span-2 space-y-6">
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle>Vehicle Information</CardTitle>
                            <CardDescription>Enter the details or scan VIN for auto-fill</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* VIN */}
                            <div>
                                <label className="block text-sm font-medium mb-2">VIN (Vehicle Identification Number)</label>
                                <Input
                                    placeholder="1HGBH41JXMN109186"
                                    value={formData.vin}
                                    onChange={(e) => handleChange("vin", e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground mt-1.5">Enter VIN to auto-fill vehicle details</p>
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Make <span className="text-red-500">*</span></label>
                                    <select
                                        value={formData.make}
                                        onChange={(e) => handleChange("make", e.target.value)}
                                        className={selectCls}
                                    >
                                        <option value="">Select Make</option>
                                        <option value="Honda">Honda</option>
                                        <option value="Toyota">Toyota</option>
                                        <option value="Maruti Suzuki">Maruti Suzuki</option>
                                        <option value="Hyundai">Hyundai</option>
                                        <option value="Tata">Tata</option>
                                        <option value="Mahindra">Mahindra</option>
                                        <option value="Kia">Kia</option>
                                        <option value="BMW">BMW</option>
                                        <option value="Mercedes-Benz">Mercedes-Benz</option>
                                        <option value="Audi">Audi</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Model <span className="text-red-500">*</span></label>
                                    <Input
                                        placeholder="e.g. City, Creta, Nexon"
                                        value={formData.model}
                                        onChange={(e) => handleChange("model", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Year <span className="text-red-500">*</span></label>
                                    <select
                                        value={formData.year}
                                        onChange={(e) => handleChange("year", e.target.value)}
                                        className={selectCls}
                                    >
                                        <option value="">Select Year</option>
                                        {Array.from({ length: 25 }, (_, i) => 2025 - i).map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Price & Mileage */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Price (₹) <span className="text-red-500">*</span></label>
                                    <Input
                                        placeholder="e.g. 850000"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => handleChange("price", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Mileage (km) <span className="text-red-500">*</span></label>
                                    <Input
                                        placeholder="e.g. 32450"
                                        type="number"
                                        value={formData.mileage}
                                        onChange={(e) => handleChange("mileage", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Color, Transmission, Fuel */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Color</label>
                                    <Input
                                        placeholder="e.g. Pearl White"
                                        value={formData.color}
                                        onChange={(e) => handleChange("color", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Transmission</label>
                                    <select
                                        value={formData.transmission}
                                        onChange={(e) => handleChange("transmission", e.target.value)}
                                        className={selectCls}
                                    >
                                        <option value="automatic">Automatic</option>
                                        <option value="manual">Manual</option>
                                        <option value="amt">AMT</option>
                                        <option value="cvt">CVT</option>
                                        <option value="dct">DCT</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Fuel Type</label>
                                    <select
                                        value={formData.fuelType}
                                        onChange={(e) => handleChange("fuelType", e.target.value)}
                                        className={selectCls}
                                    >
                                        <option value="petrol">Petrol</option>
                                        <option value="diesel">Diesel</option>
                                        <option value="cng">CNG</option>
                                        <option value="electric">Electric</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>
                            </div>

                            {/* Features */}
                            <div>
                                <label className="block text-sm font-medium mb-3">Features</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                    {FEATURES.map(feature => (
                                        <button
                                            key={feature}
                                            type="button"
                                            onClick={() => toggleFeature(feature)}
                                            className={cn(
                                                "px-3 py-2 rounded-lg text-sm border transition-all flex items-center gap-2 text-left",
                                                formData.features.includes(feature)
                                                    ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                                    : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground hover:bg-muted/50"
                                            )}
                                        >
                                            {formData.features.includes(feature) && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                                            {feature}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleGenerateDescription}
                                        disabled={isGenerating}
                                        className="gap-2"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        {isGenerating ? "Generating..." : "AI Generate"}
                                    </Button>
                                </div>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    placeholder="Describe the vehicle condition, history, special features..."
                                    rows={4}
                                    className="w-full p-4 rounded-xl bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
                                />
                            </div>
                        </CardContent>

                        <CardFooter className="flex-col items-stretch gap-3">
                            {saveError && (
                                <p className="text-sm text-red-600 dark:text-red-400 px-1">{saveError}</p>
                            )}
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => router.push("/dashboard/inventory")} disabled={isSaving}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSaving}
                                    className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                    {isSaving ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                                    ) : "Save & Publish"}
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                {/* ── Right Side Panel ── */}
                <div className="space-y-4">
                    {/* Photo Upload */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="text-base">Vehicle Photos</CardTitle>
                            <CardDescription>Add up to 30 photos</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-muted-foreground transition-colors cursor-pointer">
                                <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground mb-1">Drag & drop photos here</p>
                                <p className="text-xs text-muted-foreground">JPG, PNG up to 10 MB each</p>
                                <Button variant="outline" size="sm" className="mt-4">
                                    Browse Photos
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Tips */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle className="text-base">Tips for Better Listings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2.5 text-sm text-muted-foreground">
                                {[
                                    "Add clear exterior & interior photos",
                                    "Include service history details",
                                    "Mention any recent maintenance",
                                    "Use AI Generate for description",
                                    "Select all relevant features",
                                ].map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">
                                            {i + 1}
                                        </span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

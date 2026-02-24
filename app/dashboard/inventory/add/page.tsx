"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Sparkles, Check, Loader2, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { addVehicle } from "@/lib/db/vehicles";
import { useOnboardingStore } from "@/lib/store/onboarding-store";

const FEATURES = [
    "Leather Seats", "Sunroof", "Navigation", "Backup Camera",
    "Heated Seats", "Bluetooth", "All-Wheel Drive", "Third Row",
    "Apple CarPlay", "Android Auto", "Keyless Entry", "Remote Start",
];

interface FormData {
    vin: string;
    make: string;
    model: string;
    year: string;
    price_paise: string;
    mileage_km: string;
    color: string;
    transmission: string;
    fuel_type: string;
    features: string[];
    description: string;
    condition: "new" | "used" | "certified_pre_owned";
}

export default function AddVehiclePage() {
    const router = useRouter();
    const { dealerId, data } = useOnboardingStore();
    const isHybrid    = data.sellsNewCars && data.sellsUsedCars;
    const isFirstHand = data.sellsNewCars && !data.sellsUsedCars;

    // IMPORTANT: All hooks must be declared before any early returns
    const [formData, setFormData] = useState<FormData>({
        vin: "",
        make: "",
        model: "",
        year: "",
        price_paise: "",
        mileage_km: "",
        color: "",
        transmission: "Automatic",
        fuel_type: "Petrol",
        features: [],
        description: "",
        condition: "used",
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

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
                    make: data.make || prev.make,
                    model: data.model || prev.model,
                    year: data.year?.toString() || prev.year,
                    fuel_type: data.fuel_type || prev.fuel_type,
                }));
            } else {
                setSaveError(data.error || 'Failed to decode VIN');
            }
        } catch (err) {
            setSaveError('Error decoding VIN');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!dealerId) {
            setSaveError("Dealer ID not found");
            return;
        }
        if (!formData.vin || !formData.make || !formData.model) {
            setSaveError("Please fill in VIN, make, and model");
            return;
        }

        setIsSaving(true);
        setSaveError(null);

        try {
            const result = await addVehicle({ 
                dealer_id: dealerId,
                vin: formData.vin,
                make: formData.make,
                model: formData.model,
                year: parseInt(formData.year) || new Date().getFullYear(),
                price_paise: Math.round((parseFloat(formData.price_paise) || 0) * 100),
                mileage_km: parseInt(formData.mileage_km) || 0,
                color: formData.color,
                transmission: formData.transmission,
                fuel_type: formData.fuel_type,
                features: formData.features,
                description: formData.description,
                condition: formData.condition
            });
            if (result.success) {
                router.push('/dashboard/inventory');
            } else {
                setSaveError(result.error || 'Failed to save vehicle');
            }
        } catch (err) {
            setSaveError('Error saving vehicle');
        } finally {
            setIsSaving(false);
        }
    };

    // Now the conditional early return
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
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold">Add Vehicle</h1>
                        <p className="text-muted-foreground">Add a new vehicle to your inventory</p>
                    </div>
                </div>

                {saveError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {saveError}
                    </div>
                )}

                {/* VIN Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Vehicle Identification</CardTitle>
                        <CardDescription>Enter VIN to auto-populate details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">VIN</label>
                            <div className="flex gap-2">
                                <Input
                                    value={formData.vin}
                                    onChange={(e) => handleChange('vin', e.target.value)}
                                    placeholder="Enter VIN"
                                    disabled={isGenerating || isSaving}
                                />
                                <Button
                                    onClick={generateFromVIN}
                                    disabled={!formData.vin || isGenerating || isSaving}
                                    variant="outline"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Decoding...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Decode
                                        </>
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
                                <label className="block text-sm font-medium mb-2">Make</label>
                                <Input
                                    value={formData.make}
                                    onChange={(e) => handleChange('make', e.target.value)}
                                    placeholder="e.g., Toyota"
                                    disabled={isSaving}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Model</label>
                                <Input
                                    value={formData.model}
                                    onChange={(e) => handleChange('model', e.target.value)}
                                    placeholder="e.g., Camry"
                                    disabled={isSaving}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Year</label>
                                <Input
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) => handleChange('year', e.target.value)}
                                    placeholder="e.g., 2024"
                                    disabled={isSaving}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Price</label>
                                <Input
                                    type="number"
                                    value={formData.price_paise}
                                    onChange={(e) => handleChange('price_paise', e.target.value)}
                                    placeholder="e.g., 25000"
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
                                    placeholder="e.g., 50000"
                                    disabled={isSaving}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Color</label>
                                <Input
                                    value={formData.color}
                                    onChange={(e) => handleChange('color', e.target.value)}
                                    placeholder="e.g., Black"
                                    disabled={isSaving}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Transmission</label>
                                <select
                                    value={formData.transmission}
                                    onChange={(e) => handleChange('transmission', e.target.value)}
                                    disabled={isSaving}
                                    className="w-full px-3 py-2 border border-input rounded-md text-sm"
                                >
                                    <option>Automatic</option>
                                    <option>Manual</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Fuel Type</label>
                                <select
                                    value={formData.fuel_type}
                                    onChange={(e) => handleChange('fuel_type', e.target.value)}
                                    disabled={isSaving}
                                    className="w-full px-3 py-2 border border-input rounded-md text-sm"
                                >
                                    <option>Petrol</option>
                                    <option>Diesel</option>
                                    <option>CNG</option>
                                    <option>Electric</option>
                                    <option>Hybrid</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Features */}
                <Card>
                    <CardHeader>
                        <CardTitle>Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            {FEATURES.map(feature => (
                                <button
                                    key={feature}
                                    onClick={() => toggleFeature(feature)}
                                    disabled={isSaving}
                                    className={cn(
                                        "p-3 rounded-lg border-2 text-sm font-medium transition-all",
                                        formData.features.includes(feature)
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-input hover:border-primary/50"
                                    )}
                                >
                                    {formData.features.includes(feature) && (
                                        <Check className="w-4 h-4 inline mr-2" />
                                    )}
                                    {feature}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Description */}
                <Card>
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Add any additional details about this vehicle..."
                            disabled={isSaving}
                            className="w-full px-3 py-2 border border-input rounded-md text-sm min-h-[100px]"
                        />
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !formData.vin || !formData.make || !formData.model}
                        className="flex-1"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Add Vehicle
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

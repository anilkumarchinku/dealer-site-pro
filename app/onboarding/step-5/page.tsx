"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, LayoutTemplate, Type, Globe } from "lucide-react";

export default function Step5Page() {
    const router = useRouter();
    const { data, updateData, setStep } = useOnboardingStore();

    // Local state for form fields
    const [config, setConfig] = useState({
        heroTitle: data.templateConfig?.heroTitle || "",
        heroSubtitle: data.templateConfig?.heroSubtitle || "",
        heroCtaText: data.templateConfig?.heroCtaText || "View Inventory",
        featuresTitle: data.templateConfig?.featuresTitle || "Why Choose Us",
        workingHours: data.templateConfig?.workingHours || "",
        facebook: data.templateConfig?.facebook || "",
        instagram: data.templateConfig?.instagram || "",
        twitter: data.templateConfig?.twitter || "",
        youtube: data.templateConfig?.youtube || "",
        linkedin: data.templateConfig?.linkedin || ""
    });

    useEffect(() => {
        setStep(5);
    }, [setStep]);

    // Update store when config changes
    const handleChange = (field: keyof typeof config, value: string) => {
        const newConfig = { ...config, [field]: value };
        setConfig(newConfig);
        updateData({
            templateConfig: newConfig
        });
    };

    const handleNext = () => {
        // Validation could go here if needed
        setStep(6);
        router.push("/onboarding/step-6");
    };

    const handleBack = () => {
        router.push("/onboarding/step-4");
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LayoutTemplate className="w-6 h-6 text-primary" />
                        Customize Your Website
                    </CardTitle>
                    <CardDescription>
                        Personalize the text on your new website. You can always change this later.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Hero Section Configuration */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground border-b border-border pb-2">
                            <Type className="w-4 h-4" />
                            Hero Section (Top of Page)
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="heroTitle">Main Headline</Label>
                                <Input
                                    id="heroTitle"
                                    placeholder="e.g. Find Your Dream Car Today"
                                    value={config.heroTitle}
                                    onChange={(e) => handleChange('heroTitle', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">The big text at the top of your homepage.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="heroSubtitle">Sub-headline</Label>
                                <Input
                                    id="heroSubtitle"
                                    placeholder="e.g. Best deals on new and used cars in [City]"
                                    value={config.heroSubtitle}
                                    onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="heroCtaText">Main Button Text</Label>
                                <Input
                                    id="heroCtaText"
                                    placeholder="e.g. View Inventory"
                                    value={config.heroCtaText}
                                    onChange={(e) => handleChange('heroCtaText', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Features Section Configuration */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground border-b border-border pb-2">
                            <Type className="w-4 h-4" />
                            Features Section
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="featuresTitle">Section Title</Label>
                            <Input
                                id="featuresTitle"
                                placeholder="e.g. Why Shop With Us?"
                                value={config.featuresTitle}
                                onChange={(e) => handleChange('featuresTitle', e.target.value)}
                            />
                        </div>
                    </div>

                </CardContent>

                <CardFooter className="justify-between">
                    <Button variant="ghost" onClick={handleBack}>
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back
                    </Button>
                    <Button onClick={handleNext} className="px-8">
                        Next: Review
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </CardFooter>
            </Card>

            {/* Preview Hint */}
            <div className="rounded-xl p-4 flex gap-3 border border-primary/20 bg-primary/5">
                <div className="p-1.5 rounded-lg bg-primary/10 h-fit">
                    <Globe className="w-4 h-4 text-primary" />
                </div>
                <div>
                    <h4 className="font-semibold text-foreground">Pro Tip</h4>
                    <p className="text-sm text-muted-foreground">
                        The "Preview" button in the top right corner shows your changes in real-time!
                    </p>
                </div>
            </div>
        </div>
    );
}

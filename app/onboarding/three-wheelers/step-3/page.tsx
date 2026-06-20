"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StyleTemplate } from "@/lib/types";

const TEMPLATES: { id: StyleTemplate; name: string; description: string; preview: { bg: string; accent: string } }[] = [
    {
        id: "luxury",
        name: "Modern",
        description: "Clean, minimal layout with bold typography. Great for electric 3W brands.",
        preview: { bg: "from-slate-900 to-slate-800", accent: "bg-green-500" },
    },
    {
        id: "family",
        name: "Classic",
        description: "Warm, trustworthy design that appeals to commercial operators.",
        preview: { bg: "from-green-50 to-white", accent: "bg-green-600" },
    },
    {
        id: "professional",
        name: "Professional",
        description: "Corporate-grade layout, ideal for fleet and cargo vehicle dealers.",
        preview: { bg: "from-gray-100 to-white", accent: "bg-gray-800" },
    },
    {
        id: "sporty",
        name: "Dynamic",
        description: "Bold, energetic design for EV and modern three-wheeler brands.",
        preview: { bg: "from-teal-900 to-gray-900", accent: "bg-teal-500" },
    },
];

export default function ThreeWheelerStep3Page() {
    const router = useRouter();
    const { data, updateData, setStep } = useOnboardingStore();

    const [selected, setSelected] = useState<StyleTemplate>(
        (data.styleTemplate as StyleTemplate) || "luxury"
    );

    useEffect(() => { setStep(3); }, [setStep]);
    useEffect(() => {
        setSelected((data.styleTemplate as StyleTemplate) || "luxury");
    }, [data.styleTemplate]);

    const handleNext = () => {
        updateData({ styleTemplate: selected });
        setStep(4);
        router.push("/onboarding/three-wheelers/step-4");
    };

    return (
        <Card className="animate-fade-in">
            <CardHeader>
                <CardTitle>Pick a style for your website</CardTitle>
                <CardDescription>
                    All styles include the same features — just a different look and feel. You can change this anytime.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {TEMPLATES.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelected(t.id)}
                            aria-pressed={selected === t.id}
                            className={cn(
                                "rounded-2xl border-2 overflow-hidden text-left transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                selected === t.id ? "border-primary shadow-md" : "border-border"
                            )}
                        >
                            {/* Mini preview */}
                            <div className={cn("h-36 bg-gradient-to-br p-4 relative", t.preview.bg)}>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={cn("w-6 h-6 rounded", t.preview.accent)} />
                                    <div className="flex gap-1.5">
                                        {[40, 28, 36].map((w, i) => (
                                            <div key={i} className="h-1.5 rounded-full bg-current opacity-20" style={{ width: w }} />
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="h-4 w-48 rounded bg-current opacity-30" />
                                    <div className="h-2.5 w-36 rounded bg-current opacity-15" />
                                    <div className="mt-2 flex gap-2">
                                        <div className={cn("h-6 w-20 rounded-md", t.preview.accent)} />
                                        <div className="h-6 w-20 rounded-md border border-current opacity-30" />
                                    </div>
                                </div>
                                {selected === t.id && (
                                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                        <Check className="w-3.5 h-3.5 text-primary-foreground" />
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-card">
                                <p className="font-semibold">{t.name}</p>
                                <p className="text-sm text-muted-foreground mt-0.5">{t.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="justify-between">
                <Button variant="ghost" onClick={() => router.push("/onboarding/three-wheelers/step-2")}>
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                </Button>
                <Button onClick={handleNext}>
                    Continue with {TEMPLATES.find((t) => t.id === selected)?.name}
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}

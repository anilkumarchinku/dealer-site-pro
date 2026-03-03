"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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

    const handleNext = () => {
        updateData({ styleTemplate: selected });
        setStep(4);
        router.push("/onboarding/three-wheelers/step-4");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-8">
                    <div>
                        <p className="text-sm font-medium">Choose Your Website Style</p>
                        <p className="text-xs text-muted-foreground">Step 3 of 4 — You can change this anytime</p>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <main className="flex-1 container max-w-4xl mx-auto px-8 py-10">
                <div className="space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold">Pick a style for your website</h1>
                        <p className="text-muted-foreground">All styles include the same features — just a different look and feel</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {TEMPLATES.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setSelected(t.id)}
                                className={cn(
                                    "rounded-2xl border-2 overflow-hidden text-left transition-all hover:shadow-lg",
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
                </div>
            </main>

            <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur">
                <div className="container max-w-4xl mx-auto px-8 py-4 flex justify-between items-center">
                    <Button variant="ghost" onClick={() => router.push("/onboarding/three-wheelers/step-2")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <Button onClick={handleNext} size="lg" className="px-8">
                        Continue with {TEMPLATES.find((t) => t.id === selected)?.name}
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

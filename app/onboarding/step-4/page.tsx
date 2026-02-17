"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { TemplateSelector } from "@/components/onboarding/TemplateSelector";
import { validateCombination, getSmartRecommendation } from "@/lib/templates/template-validation";
import type { TemplateStyle } from "@/lib/templates";
import type { Brand } from "@/lib/types";

export default function Step4Page() {
    const router = useRouter();
    const { data, updateData, setStep } = useOnboardingStore();
    const [showBlockedWarning, setShowBlockedWarning] = useState(false);

    const handleSelect = (templateId: TemplateStyle) => {
        updateData({ styleTemplate: templateId });
    };

    const handleNext = () => {
        // Validate combination before proceeding
        const primaryBrand = data.brands?.[0] as Brand;
        const template = data.styleTemplate as TemplateStyle;

        if (primaryBrand && template) {
            const validation = validateCombination(primaryBrand, template);

            // Block if combination is not allowed
            if (validation.shouldBlock) {
                setShowBlockedWarning(true);
                return;
            }
        }

        // Proceed to next step
        setStep(5);
        router.push("/onboarding/step-5");
    };

    const handleBack = () => {
        router.push("/onboarding/step-3");
    };

    useEffect(() => {
        setStep(4);
    }, [setStep]);

    // Get smart recommendation for the user's brands
    const recommendation = data.brands ? getSmartRecommendation(data.brands as Brand[]) : null;

    return (
        <TemplateSelector
            selectedTemplate={data.styleTemplate as TemplateStyle}
            onSelect={handleSelect}
            onBack={handleBack}
            onNext={handleNext}
            primaryBrand={data.brands?.[0] as Brand}
            recommendation={recommendation}
            showBlockedWarning={showBlockedWarning}
        />
    );
}

"use client"
import { useRouter, usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Car, X } from "lucide-react";

/**
 * shadcn/ui inspired Onboarding Layout
 * Clean, professional design for the onboarding flow
 * Note: Step 4 (template selector) uses its own dark theme
 */
export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    // Extract step number from pathname
    const stepMatch = pathname.match(/step-(\d)/);
    const step = stepMatch ? parseInt(stepMatch[1]) : 1;

    // Step 4 (template selector) has its own dark layout
    const isTemplateStep = step === 4;

    if (isTemplateStep) {
        return <>{children}</>;
    }

    // Step 4 is invisible (own layout), so map steps 5→4 and 6→5
    // giving 5 visible progress steps: Info, Brands, Services, Customize, Review
    const progressStep = step > 4 ? step - 1 : step;
    const progressLabels = ["Your Info", "Brands", "Services", "Customize", "Review"];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header - shadcn/ui style */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-8">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-3 hover:opacity-70 transition-opacity"
                    >
                        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                            <Car className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-semibold">DealerSite Pro</span>
                    </button>

                    <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                        <X className="w-4 h-4 mr-2" />
                        Exit
                    </Button>
                </div>
            </header>

            {/* Progress */}
            <div className="container max-w-3xl mx-auto w-full px-8 pt-12 pb-8">
                <Progress currentStep={progressStep} totalSteps={5} labels={progressLabels} />
            </div>

            {/* Main Content */}
            <main className="flex-1 container max-w-3xl mx-auto px-8 pb-12">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t py-6 px-8">
                <div className="container max-w-3xl mx-auto">
                    <p className="text-xs text-muted-foreground text-center">
                        Need help? Contact our support team at support@dealersitepro.com
                    </p>
                </div>
            </footer>
        </div>
    );
}

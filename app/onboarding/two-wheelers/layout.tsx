"use client"
import { useRouter, usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Bike, X } from "lucide-react";

/**
 * Two-Wheeler Onboarding Layout
 *
 * Routes:
 *   /onboarding/two-wheelers           – Dealer type picker (own full-page layout)
 *   /onboarding/two-wheelers/step-1    – Business info + Brands
 *   /onboarding/two-wheelers/step-2    – Services
 *   /onboarding/two-wheelers/step-3    – Template selector (own dark layout)
 *   /onboarding/two-wheelers/step-4    – Customize text
 *   /onboarding/two-wheelers/step-5    – Review & complete
 */
export default function TwoWheelerOnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    // Index page & template selector: own full-page layout
    if (
        pathname === "/onboarding/two-wheelers" ||
        pathname === "/onboarding/two-wheelers/"
    ) {
        return <>{children}</>;
    }

    const stepMatch = pathname.match(/step-(\d+)/);
    const stepNum = stepMatch ? parseInt(stepMatch[1]) : 1;

    // Step 3 (template selector): full-screen, no header needed
    if (stepNum === 3) {
        return <>{children}</>;
    }

    // Map URL step to visible progress step
    // step-1 → 1 (Info & Brands)
    // step-2 → 2 (Services)
    // step-3 → hidden (Template)
    // step-4 → 3 (Customize)
    // step-5 → 4 (Review)
    const progressStep =
        stepNum === 1 ? 1 :
        stepNum === 2 ? 2 :
        stepNum === 4 ? 3 :
        stepNum === 5 ? 4 : 1;

    const totalSteps = 4;
    const progressLabels = ["Info & Brands", "Services", "Customize", "Review"];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-8">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-3 hover:opacity-70 transition-opacity"
                    >
                        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                            <Bike className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-semibold">DealerSite Pro</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                            <X className="w-4 h-4 mr-2" />
                            Exit
                        </Button>
                    </div>
                </div>
            </header>

            {/* Progress */}
            <div className="container max-w-3xl mx-auto w-full px-8 pt-12 pb-8">
                <Progress currentStep={progressStep} totalSteps={totalSteps} labels={progressLabels} />
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

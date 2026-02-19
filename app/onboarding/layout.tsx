"use client"
import { useRouter, usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Car, X } from "lucide-react";
import { useOnboardingStore } from "@/lib/store/onboarding-store";

/**
 * Onboarding Layout
 *
 * Routes:
 *   /onboarding           – Dealer type picker (no progress bar, own header)
 *   /onboarding/step-1    – Business info  (step 1)
 *   /onboarding/step-2    – Brands (new dealers, step 2)
 *   /onboarding/step-2-used – Branding/logo (used dealers, step 2)
 *   /onboarding/step-3    – Services (step 3)
 *   /onboarding/step-4    – Template selector (own dark layout)
 *   /onboarding/step-5    – Customise text (step 4 visible)
 *   /onboarding/step-6    – Review & complete (step 5 visible)
 */
export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const isUsedCarDealer = useOnboardingStore((s) => s.isUsedCarDealer());

    // ── Index page: has its own full-page layout ───────────────────────────
    if (pathname === "/onboarding" || pathname === "/onboarding/") {
        return <>{children}</>;
    }

    // ── Step 4 (template selector): own dark theme ─────────────────────────
    const stepMatch = pathname.match(/step-(\d+)/);
    const stepNum = stepMatch ? parseInt(stepMatch[1]) : 1;

    if (stepNum === 4) {
        return <>{children}</>;
    }

    // ── Progress mapping ───────────────────────────────────────────────────
    //  Visible steps depend on dealer type:
    //
    //  New dealers  : Info | Brands | Services | Customize | Review  (5 steps)
    //  Used dealers : Info | Branding | Services | Customize | Review (5 steps)
    //
    //  Step 4 (template selector) is hidden; steps 5 & 6 map to 4 & 5.

    let progressStep: number;
    if (pathname.includes("step-2-used")) {
        progressStep = 2;
    } else if (stepNum > 4) {
        progressStep = stepNum - 1; // step-5 → 4, step-6 → 5
    } else {
        progressStep = stepNum;
    }

    const progressLabels = isUsedCarDealer
        ? ["Your Info", "Branding", "Services", "Customise", "Review"]
        : ["Your Info", "Brands", "Services", "Customise", "Review"];

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

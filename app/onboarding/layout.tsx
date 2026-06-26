"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { BrowserFrame, coreFlowSteps, FlowStepper, FlowTopBar } from "@/components/onboarding/flow-shell";

function getBackHref(pathname: string) {
    if (pathname.includes("/bulk-upload")) return "/onboarding/step-2-inventory";
    if (pathname.includes("step-6")) return "/onboarding/step-5";
    if (pathname.includes("step-5")) return "/onboarding/step-4";
    if (pathname.includes("step-4")) return "/onboarding/step-3";
    if (pathname.includes("step-3")) return "/onboarding/step-2-inventory";
    if (pathname.includes("step-2")) return "/onboarding/step-1";
    return "/onboarding";
}

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    if (pathname === "/onboarding" || pathname === "/onboarding/") {
        return (
            <div className="dsp-app-skin dsp-onboarding-skin min-h-screen">
                {children}
            </div>
        );
    }

    if (
        pathname.startsWith("/onboarding/two-wheelers") ||
        pathname.startsWith("/onboarding/three-wheelers")
    ) {
        return (
            <div className="dsp-app-skin dsp-onboarding-skin min-h-screen">
                {children}
            </div>
        );
    }

    const stepMatch = pathname.match(/step-(\d+)/);
    const stepNum = stepMatch ? parseInt(stepMatch[1]) : 1;

    const visibleStep =
        stepNum <= 1 ? 2 :
        pathname.includes("step-2") || stepNum === 3 ? 3 :
        stepNum === 4 || stepNum === 5 ? 4 :
        stepNum >= 6 ? 5 :
        2;

    return (
        <div className="dsp-app-skin dsp-onboarding-skin min-h-screen">
            <BrowserFrame className="min-h-screen w-full max-w-none rounded-none border-0 shadow-none" contentClassName="dsp-onboarding-canvas min-h-screen">
                <FlowTopBar
                    onBack={() => router.push(getBackHref(pathname))}
                    onExit={() => router.push("/")}
                />

                <main className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
                    <button
                        type="button"
                        onClick={() => router.push(getBackHref(pathname))}
                        aria-label="Go back"
                        className="mb-3 inline-flex h-10 w-fit shrink-0 items-center justify-center gap-1.5 rounded-md border border-[#D8E0EA] bg-white px-3 text-sm font-black text-[#35445C] transition hover:border-[#155EEF] hover:bg-[#F5F8FF] hover:text-[#155EEF] focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </button>
                    <FlowStepper steps={coreFlowSteps} currentStep={visibleStep} />
                    <div className="mt-7">
                        {children}
                    </div>
                </main>
            </BrowserFrame>
        </div>
    );
}

"use client";

import { usePathname, useRouter } from "next/navigation";

import { BrowserFrame, coreFlowSteps, FlowStepper, FlowTopBar } from "@/components/onboarding/flow-shell";

function getBackHref(pathname: string) {
    if (pathname.includes("step-5")) return "/onboarding/three-wheelers/step-4";
    if (pathname.includes("step-4")) return "/onboarding/three-wheelers/step-3";
    if (pathname.includes("step-3")) return "/onboarding/three-wheelers/step-2";
    if (pathname.includes("step-2")) return "/onboarding/three-wheelers/step-1";
    return "/onboarding";
}

export default function ThreeWheelerOnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    if (
        pathname === "/onboarding/three-wheelers" ||
        pathname === "/onboarding/three-wheelers/"
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
        stepNum === 2 ? 3 :
        stepNum === 3 || stepNum === 4 ? 4 :
        stepNum >= 5 ? 5 :
        2;

    return (
        <div className="dsp-app-skin dsp-onboarding-skin min-h-screen">
            <BrowserFrame className="min-h-screen w-full max-w-none rounded-none border-0 shadow-none" contentClassName="dsp-onboarding-canvas min-h-screen">
                <FlowTopBar
                    showBack
                    onBack={() => router.push(getBackHref(pathname))}
                    onExit={() => router.push("/")}
                />
                <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-10">
                    <FlowStepper steps={coreFlowSteps} currentStep={visibleStep} />
                    <div className="mt-8">
                        {children}
                    </div>
                </main>
            </BrowserFrame>
        </div>
    );
}

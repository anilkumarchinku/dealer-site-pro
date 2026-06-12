"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { OnboardingLogo } from "@/components/onboarding/flow-shell";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isRegister = pathname === "/auth/register";

    return (
        <div className={isRegister ? "relative min-h-screen bg-white" : "relative min-h-screen bg-[#F7F9FC]"}>
            <div className="absolute right-4 top-4 z-20">
                <ThemeToggle />
            </div>

            <div className={isRegister ? "relative flex min-h-screen flex-col items-center justify-center" : "relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-8"}>
                {!isRegister && (
                    <div className="mb-8">
                        <OnboardingLogo />
                    </div>
                )}

                <div className={isRegister ? "w-full" : "w-full max-w-md"}>
                    {children}
                </div>

                <p className="mt-8 text-center text-xs text-[#62708A]">
                    By continuing you agree to our{" "}
                    <Link href="/terms" className="font-semibold text-[#155EEF] hover:underline">
                        Terms of Service
                    </Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="font-semibold text-[#155EEF] hover:underline">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    );
}

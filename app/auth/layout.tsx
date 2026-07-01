"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Car, ShieldCheck } from "lucide-react";

import BrandLogo from "@/components/BrandLogo";
import { OnboardingLogo } from "@/components/onboarding/flow-shell";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isRegister = pathname === "/auth/register";

    if (!isRegister) {
        return (
            <div className="dsp-app-skin dsp-onboarding-skin relative min-h-screen overflow-hidden bg-muted text-foreground">
                <div className="absolute right-4 top-4 z-20">
                    <ThemeToggle />
                </div>

                <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
                    <section className="relative hidden overflow-hidden bg-[#071A3D] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
                        <div className="relative z-10">
                            <BrandLogo className="[&>span]:text-white [&_.brand-logo-accent]:text-[#C79A5B]" />
                        </div>

                        <div className="relative z-10 max-w-xl">
                            <p className="mb-4 text-xs font-black uppercase tracking-[0.26em] text-blue-300">
                                Dealer workspace
                            </p>
                            <h1 className="text-5xl font-black leading-[0.98] tracking-tight xl:text-6xl">
                                Manage your website, stock, and leads from one place.
                            </h1>
                            <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">
                                Sign in to continue building your dealership website, track enquiries, and keep every listing up to date.
                            </p>
                        </div>

                        <div className="relative z-10 grid gap-3">
                            {[
                                { icon: ShieldCheck, label: "Secure dealer account" },
                                { icon: Bell,        label: "Lead and message alerts" },
                                { icon: Car,         label: "Cars, bikes, and autos supported" },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-slate-100">
                                    <item.icon className="h-4 w-4 text-blue-300" />
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-8">
                        <div className="mb-8 lg:hidden">
                            <OnboardingLogo />
                        </div>

                        <div className="w-full max-w-md">
                            {children}
                        </div>

                        <p className="mt-8 max-w-md text-center text-xs leading-5 text-slate-600 dark:text-slate-300">
                            By continuing you agree to our{" "}
                            <Link href="/terms" className="font-semibold text-[#7C4F12] hover:underline dark:text-[#F3C77A]">
                                Terms of Service
                            </Link>
                            {" "}and{" "}
                            <Link href="/privacy" className="font-semibold text-[#7C4F12] hover:underline dark:text-[#F3C77A]">
                                Privacy Policy
                            </Link>
                        </p>
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div className="dsp-app-skin dsp-onboarding-skin relative min-h-screen bg-background">
            {/* No floating ThemeToggle here: the register page renders FlowTopBar (a
                full-width, fixed-light header), so a floating toggle would overlap it.
                The register screen is part of the light onboarding flow. */}
            <div className="relative flex min-h-screen flex-col items-center justify-center">
                <div className="w-full">
                    {children}
                </div>

                <p className="mt-8 text-center text-xs text-slate-600 dark:text-slate-300">
                    By continuing you agree to our{" "}
                    <Link href="/terms" className="font-semibold text-[#7C4F12] hover:underline dark:text-[#F3C77A]">
                        Terms of Service
                    </Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="font-semibold text-[#7C4F12] hover:underline dark:text-[#F3C77A]">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    );
}

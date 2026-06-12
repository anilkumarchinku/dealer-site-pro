"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Database, Loader2, ShieldCheck } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function ResetPage() {
    const router = useRouter();

    useEffect(() => {
        localStorage.clear();

        const timer = setTimeout(() => {
            router.push("/onboarding");
        }, 1000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F6F9FD] px-4 py-10 text-[#07142F]">
            <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#D8E2F0] bg-white shadow-[0_24px_90px_rgba(7,20,47,0.12)] lg:grid-cols-[0.95fr_1.05fr]">
                <div className="bg-[#071A3D] p-8 text-white sm:p-10">
                    <BrandLogo className="[&>span]:text-white" />
                    <div className="mt-16 max-w-md">
                        <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-blue-300">
                            Fresh start
                        </p>
                        <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                            Clearing saved setup data.
                        </h1>
                        <p className="mt-5 text-base leading-7 text-slate-300">
                            We are removing local draft data from this browser and taking you back to onboarding.
                            Your backend account and dealer records are not deleted from here.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col justify-center p-8 sm:p-10">
                    <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#155EEF]">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight">Preparing a clean onboarding session</h2>
                    <p className="mt-3 text-base leading-7 text-[#60708A]">
                        You will be redirected automatically in a moment.
                    </p>

                    <div className="mt-8 grid gap-3">
                        {[
                            { icon: Database, label: "Browser onboarding cache cleared" },
                            { icon: ShieldCheck, label: "Backend data stays protected" },
                            { icon: CheckCircle2, label: "Redirecting to setup" },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-[#DDE6F2] bg-[#F8FBFF] px-4 py-3 text-sm font-bold text-[#24324A]">
                                <item.icon className="h-4 w-4 text-[#155EEF]" />
                                {item.label}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 inline-flex items-center gap-2 text-sm font-black text-[#155EEF]">
                        Going to onboarding
                        <ArrowRight className="h-4 w-4" />
                    </div>
                </div>
            </section>
        </main>
    );
}

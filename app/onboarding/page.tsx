"use client"
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Button } from "@/components/ui/button";
import { Sparkles, Car } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OnboardingIndexPage() {
    const router = useRouter();
    const { updateData, reset } = useOnboardingStore();

    const handleSelect = (isFirstHand: boolean) => {
        reset();
        updateData({ dealerCategory: isFirstHand ? "new" : "used" });
        router.push("/onboarding/step-1");
    };

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
                        Exit
                    </Button>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
                <div className="w-full max-w-lg mx-auto space-y-10 text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        Setup in under 5 minutes
                    </div>

                    {/* Question */}
                    <div className="space-y-3">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            Are you an authorised<br className="hidden sm:block" /> 1st hand dealer?
                        </h1>
                        <p className="text-muted-foreground text-base">
                            Do you sell brand new cars directly from manufacturers?
                        </p>
                    </div>

                    {/* Yes / No */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleSelect(true)}
                            className={cn(
                                "group relative w-full rounded-2xl border-2 p-8 transition-all duration-200",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
                                "border-blue-500/30 hover:border-blue-500/70 hover:bg-blue-500/5"
                            )}
                        >
                            <div className="text-4xl mb-3">✅</div>
                            <div className="text-xl font-bold text-blue-600">Yes</div>
                            <p className="text-sm text-muted-foreground mt-1">New car authorised dealer</p>
                        </button>

                        <button
                            onClick={() => handleSelect(false)}
                            className={cn(
                                "group relative w-full rounded-2xl border-2 p-8 transition-all duration-200",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
                                "border-amber-500/30 hover:border-amber-600/70 hover:bg-amber-500/5"
                            )}
                        >
                            <div className="text-4xl mb-3">🚙</div>
                            <div className="text-xl font-bold text-amber-700">No</div>
                            <p className="text-sm text-muted-foreground mt-1">Pre-owned / used car dealer</p>
                        </button>
                    </div>

                </div>
            </main>

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

"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Button } from "@/components/ui/button";
import { Sparkles, Car } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OnboardingIndexPage() {
    const router = useRouter();
    const { updateData, reset } = useOnboardingStore();

    // Clear any stale persisted data (e.g. from a previous session) so the
    // user always starts fresh from this selection screen.
    useEffect(() => {
        reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelect = (category: "new" | "used") => {
        reset();
        updateData({ dealerCategory: category });
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
                <div className="w-full max-w-2xl mx-auto space-y-10 text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        Setup in under 5 minutes
                    </div>

                    {/* Question */}
                    <div className="space-y-3">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            What type of dealer are you?
                        </h1>
                        <p className="text-muted-foreground text-base">
                            Choose the option that best describes your dealership
                        </p>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                        {/* 1st Hand */}
                        <button
                            onClick={() => handleSelect("new")}
                            className={cn(
                                "group relative w-full rounded-2xl border-2 p-8 transition-all duration-200 text-left",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
                                "border-blue-500/30 hover:border-blue-500/70 hover:bg-blue-500/5"
                            )}
                        >
                            <div className="text-4xl mb-3">🏢</div>
                            <div className="text-lg font-bold text-blue-600 mb-1">1st Hand</div>
                            <p className="text-sm text-muted-foreground">
                                Authorised new car dealer selling directly from manufacturers
                            </p>
                        </button>

                        {/* 2nd Hand */}
                        <button
                            onClick={() => handleSelect("used")}
                            className={cn(
                                "group relative w-full rounded-2xl border-2 p-8 transition-all duration-200 text-left",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
                                "border-amber-500/30 hover:border-amber-600/70 hover:bg-amber-500/5"
                            )}
                        >
                            <div className="text-4xl mb-3">🚙</div>
                            <div className="text-lg font-bold text-amber-700 mb-1">2nd Hand</div>
                            <p className="text-sm text-muted-foreground">
                                Pre-owned / used car dealer
                            </p>
                        </button>

                        {/* Hybrid — Coming Soon */}
                        <div
                            className={cn(
                                "relative w-full rounded-2xl border-2 p-8 text-left",
                                "border-dashed border-muted-foreground/20 bg-muted/30 cursor-not-allowed opacity-60"
                            )}
                        >
                            {/* Coming Soon badge */}
                            <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-muted-foreground/20 uppercase tracking-wide">
                                Coming Soon
                            </span>
                            <div className="text-4xl mb-3">🔀</div>
                            <div className="text-lg font-bold text-muted-foreground mb-1">Hybrid</div>
                            <p className="text-sm text-muted-foreground">
                                Sell both new &amp; pre-owned cars
                            </p>
                        </div>

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

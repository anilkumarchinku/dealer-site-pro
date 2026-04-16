"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { saveDealer } from "@/lib/actions/save-dealer";
import { dealerSiteUrl, dealerSiteHref } from "@/lib/utils/domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    CheckCircle, ArrowLeft, ArrowRight, Globe, Shield,
    Loader2, AlertCircle, ExternalLink, Link as LinkIcon,
} from "lucide-react";

export default function ThreeWheelerStep5Page() {
    const router = useRouter();
    const { data, setStep, dealerId, setDealerId, vehicleType, setVehicleType } = useOnboardingStore();
    const [saving,       setSaving]       = useState(false);
    const [saveError,    setSaveError]    = useState<string | null>(null);
    const [showSuccess,  setShowSuccess]  = useState(false);
    const [liveSiteSlug, setLiveSiteSlug] = useState<string | null>(null);
    const [copied,       setCopied]       = useState(false);
    const [showUpgrade,  setShowUpgrade]  = useState(true);

    useEffect(() => { setStep(5); }, [setStep]);
    useEffect(() => { setVehicleType('three-wheeler'); }, [setVehicleType]);

    const handleFinish = async () => {
        setSaving(true);
        setSaveError(null);
        try {
            const result = await saveDealer(data, dealerId ?? undefined, vehicleType as 'three-wheeler');
            if (result.success) {
                if (result.dealerId) setDealerId(result.dealerId);
                if (result.slug)     setLiveSiteSlug(result.slug);
                setShowSuccess(true);
            } else {
                setSaveError(result.error ?? "Failed to save. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleCopyUrl = () => {
        if (!liveSiteSlug) return;
        navigator.clipboard.writeText(dealerSiteHref(liveSiteSlug)).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (showSuccess) {
        const liveUrl  = liveSiteSlug ? dealerSiteUrl(liveSiteSlug) : null;
        const liveHref = liveSiteSlug ? dealerSiteHref(liveSiteSlug) : null;
        return (
            <div className="space-y-6 animate-fade-in flex flex-col items-center justify-center min-h-[60vh]">
                <Card className="w-full max-w-lg">
                    <CardContent className="p-8 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="p-4 rounded-full bg-green-500/10">
                                <CheckCircle className="w-16 h-16 text-green-500" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-foreground">
                                Your Dealership Website is Live! 🛺
                            </h1>
                            <p className="text-muted-foreground">
                                Congratulations! Customers can now find{" "}
                                <span className="font-semibold text-foreground">{data.dealershipName}</span>{" "}
                                online.
                            </p>
                        </div>

                        {liveUrl && (
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground text-left">Your live site URL</p>
                                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-3">
                                    <span className="flex-1 font-mono text-sm text-foreground break-all text-left">
                                        {liveUrl}
                                    </span>
                                    <Button variant="ghost" size="sm" className="shrink-0" onClick={handleCopyUrl}>
                                        {copied ? "Copied!" : "Copy"}
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                            {["Free SSL included", "Live in seconds", "No setup required"].map((item) => (
                                <div key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            {liveHref && (
                                <Button variant="outline" className="flex-1 gap-2 rounded-xl" onClick={() => window.open(liveHref, "_blank")}>
                                    <ExternalLink className="w-4 h-4" />
                                    Preview Your Site
                                </Button>
                            )}
                            <Button className="flex-1 gap-2 rounded-xl" onClick={() => router.push("/dashboard")}>
                                Go to Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        Review Your Information
                    </CardTitle>
                    <CardDescription>Everything looks good! Review your details below.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <p className="text-sm text-muted-foreground">Dealership Name</p>
                            <p className="font-semibold text-foreground">{data.dealershipName}</p>
                            {data.tagline && <p className="text-sm text-muted-foreground italic">&ldquo;{data.tagline}&rdquo;</p>}
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-semibold text-foreground">{data.email}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-semibold text-foreground">{data.phone}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-semibold text-foreground">{data.location}</p>
                        </div>
                    </div>

                    {data.brands && data.brands.length > 0 && (
                        <div className="border-t border-border pt-4">
                            <p className="text-sm text-muted-foreground mb-2">Brands</p>
                            <div className="flex flex-wrap gap-2">
                                {data.brands.map((brand) => (
                                    <span key={brand} className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 text-sm rounded-full border border-green-500/20">
                                        {brand}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.services && data.services.length > 0 && (
                        <div className="border-t border-border pt-4">
                            <p className="text-sm text-muted-foreground mb-2">Services ({data.services.length})</p>
                            <div className="flex flex-wrap gap-1.5">
                                {data.services.map((s) => (
                                    <span key={s} className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full border border-border">
                                        {s.replace(/_/g, ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground mb-1">Website Template</p>
                        <p className="font-semibold capitalize text-foreground">{data.styleTemplate} Style</p>
                    </div>

                    {/* FREE Subdomain */}
                    <div className="border-t border-border pt-4">
                        <div className="rounded-xl p-4 border border-primary/20 bg-primary/5">
                            <div className="flex items-start gap-3">
                                <Globe className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-foreground mb-1">Your FREE Website Domain</h4>
                                    <div className="rounded-lg px-3 py-2 border border-primary/30 bg-background font-mono text-sm text-primary break-all">
                                        {dealerSiteUrl(data.slug || data.dealershipName?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "")}
                                    </div>
                                    <div className="mt-3 flex items-center gap-2 text-xs text-primary">
                                        <Shield className="w-4 h-4" />
                                        <span>Free SSL certificate included · No setup required</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {saveError && (
                        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{saveError}</span>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="justify-between">
                    <Button variant="ghost" onClick={() => router.push("/onboarding/three-wheelers/step-4")} disabled={saving}>
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back
                    </Button>
                    <Button onClick={handleFinish} size="lg" className="px-8 gap-2" disabled={saving}>
                        {saving ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                        ) : (
                            "Complete Setup & Go to Dashboard"
                        )}
                    </Button>
                </CardFooter>
            </Card>

            {/* Domain Upgrade */}
            {showUpgrade && (
                <div className="space-y-4">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-foreground mb-2">Want a Professional Domain?</h3>
                        <p className="text-muted-foreground">Upgrade with a custom domain for better branding</p>
                    </div>
                    <div className="max-w-md mx-auto">
                        <Card className="border-2 border-primary/30 hover:border-primary/60 transition-colors relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                                POPULAR
                            </div>
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <LinkIcon className="w-6 h-6 text-primary" />
                                    <CardTitle className="text-xl">PRO Tier</CardTitle>
                                </div>
                                <CardDescription className="text-lg font-semibold text-foreground">₹499/month</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="font-medium text-foreground">Connect Your Own Domain</p>
                                <div className="space-y-2">
                                    {[
                                        "Use your existing domain (e.g. myauto.com)",
                                        "Free SSL certificate (HTTPS)",
                                        "Step-by-step DNS setup guide",
                                        "Professional email setup support",
                                    ].map((item) => (
                                        <div key={item} className="flex items-start gap-2 text-sm">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-muted-foreground">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                                <Button className="w-full" onClick={() => router.push("/dashboard/domains")}>
                                    Connect My Domain
                                </Button>
                                <Button variant="link" className="h-auto text-muted-foreground text-xs" onClick={() => setShowUpgrade(false)}>
                                    No thanks, I&apos;ll use my free subdomain for now →
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}

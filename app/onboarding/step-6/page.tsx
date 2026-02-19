"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { saveDealer } from "@/lib/actions/save-dealer";
import { dealerSiteUrl, dealerSiteHref, BASE_DOMAIN } from "@/lib/utils/domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    CheckCircle, ArrowLeft, ArrowRight, Crown, Link as LinkIcon,
    Sparkles, Globe, Shield, Zap, Loader2, AlertCircle, ExternalLink,
} from "lucide-react";

export default function Step6Page() {
    const router = useRouter();
    const { data, setStep, dealerId, setDealerId } = useOnboardingStore();
    const [showUpgradeOptions, setShowUpgradeOptions] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [liveSiteSlug, setLiveSiteSlug] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setStep(6);
    }, [setStep]);

    const handleFinish = async () => {
        setSaving(true);
        setSaveError(null);

        try {
            const result = await saveDealer(data, dealerId ?? undefined);
            if (result.success) {
                if (result.dealerId) setDealerId(result.dealerId);
                if (result.slug) setLiveSiteSlug(result.slug);
                setShowSuccess(true);
            } else {
                setSaveError(result.error ?? "Failed to save. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        router.push("/onboarding/step-5");
    };

    const handleCopyUrl = () => {
        if (!liveSiteSlug) return;
        navigator.clipboard.writeText(dealerSiteHref(liveSiteSlug)).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (showSuccess && liveSiteSlug) {
        const liveUrl = dealerSiteUrl(liveSiteSlug);
        const liveHref = dealerSiteHref(liveSiteSlug);
        return (
            <div className="space-y-6 animate-fade-in flex flex-col items-center justify-center min-h-[60vh]">
                <Card className="w-full max-w-lg">
                    <CardContent className="p-8 text-center space-y-6">
                        {/* Big check icon */}
                        <div className="flex justify-center">
                            <div className="p-4 rounded-full bg-emerald-500/10">
                                <CheckCircle className="w-16 h-16 text-emerald-500" />
                            </div>
                        </div>

                        {/* Title & subtitle */}
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-foreground">
                                Your Dealership Website is Live!
                            </h1>
                            <p className="text-muted-foreground">
                                Congratulations! Customers can now find{" "}
                                <span className="font-semibold text-foreground">
                                    {data.dealershipName}
                                </span>{" "}
                                online.
                            </p>
                        </div>

                        {/* Live URL box with copy */}
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground text-left">Your live site URL</p>
                            <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-3">
                                <span className="flex-1 font-mono text-sm text-foreground break-all text-left">
                                    {liveUrl}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="shrink-0 text-muted-foreground hover:text-foreground"
                                    onClick={handleCopyUrl}
                                >
                                    {copied ? "Copied!" : "Copy"}
                                </Button>
                            </div>
                        </div>

                        {/* 3 checklist items */}
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                            {[
                                "Free SSL included",
                                "Live in seconds",
                                "No setup required",
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1 gap-2 rounded-xl"
                                onClick={() => window.open(liveHref, "_blank")}
                            >
                                <ExternalLink className="w-4 h-4" />
                                Preview Your Site
                            </Button>
                            <Button
                                className="flex-1 gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                onClick={() => router.push("/dashboard")}
                            >
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
            {/* Main Review Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                        Review Your Information
                    </CardTitle>
                    <CardDescription>
                        Everything looks good! Review your details below.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Dealership Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <p className="text-sm text-muted-foreground">Dealership Name</p>
                            <p className="font-semibold text-foreground">{data.dealershipName}</p>
                            {data.tagline && (
                                <p className="text-sm text-muted-foreground italic">"{data.tagline}"</p>
                            )}
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-semibold text-foreground">{data.email}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-semibold text-foreground">{data.phone}</p>
                            {data.whatsapp && (
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                                    WhatsApp: {data.whatsapp}
                                </p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-semibold text-foreground">{data.location}</p>
                            {data.fullAddress && (
                                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{data.fullAddress}</p>
                            )}
                        </div>

                        {data.gstin && (
                            <div className="col-span-2 md:col-span-1">
                                <p className="text-sm text-muted-foreground">GSTIN</p>
                                <p className="font-mono text-sm text-foreground">{data.gstin}</p>
                            </div>
                        )}

                        {data.templateConfig?.workingHours && (
                            <div className="col-span-2 md:col-span-1">
                                <p className="text-sm text-muted-foreground">Hours</p>
                                <p className="text-sm text-foreground">{data.templateConfig.workingHours}</p>
                            </div>
                        )}
                    </div>

                    {data.brands && data.brands.length > 0 && (
                        <div className="border-t border-border pt-4">
                            <p className="text-sm text-muted-foreground mb-2">Authorized Brands</p>
                            <div className="flex flex-wrap gap-2">
                                {data.brands.map((brand) => (
                                    <span
                                        key={brand}
                                        className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm rounded-full border border-blue-500/20"
                                    >
                                        {brand}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground mb-1">Website Template</p>
                        <p className="font-semibold capitalize text-foreground">{data.styleTemplate} Style</p>
                    </div>

                    {/* FREE Subdomain Info */}
                    <div className="border-t border-border pt-4">
                        <div className="rounded-xl p-4 border border-blue-500/20 bg-blue-500/5">
                            <div className="flex items-start gap-3">
                                <Globe className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-foreground mb-1">Your FREE Website Domain</h4>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Your dealer website will be live at:
                                    </p>
                                    <div className="rounded-lg px-3 py-2 border border-blue-500/30 bg-background font-mono text-sm text-blue-600 dark:text-blue-400 break-all">
                                        {dealerSiteUrl(data.slug || data.dealershipName?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "")}
                                    </div>
                                    <div className="mt-3 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                                        <Shield className="w-4 h-4" />
                                        <span>Free SSL certificate included · No setup required</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save error */}
                    {saveError && (
                        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-600 dark:text-red-400">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{saveError}</span>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="justify-between">
                    <Button variant="ghost" onClick={handleBack} disabled={saving}>
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back
                    </Button>
                    <Button
                        onClick={handleFinish}
                        size="lg"
                        className="px-8 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving…
                            </>
                        ) : (
                            "Complete Setup & Go to Dashboard"
                        )}
                    </Button>
                </CardFooter>
            </Card>

            {/* Domain Upgrade Offers */}
            {showUpgradeOptions && (
                <div className="space-y-4">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                            Want a Professional Domain?
                        </h3>
                        <p className="text-muted-foreground">
                            Upgrade your website with a custom domain for better branding and credibility
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* PRO Tier */}
                        <Card className="border-2 border-blue-500/30 hover:border-blue-500/60 transition-colors relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                POPULAR
                            </div>
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <LinkIcon className="w-6 h-6 text-blue-500" />
                                    <CardTitle className="text-xl">PRO Tier</CardTitle>
                                </div>
                                <CardDescription className="text-lg font-semibold text-foreground">
                                    ₹499/month
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="font-medium text-foreground">Connect Your Own Domain</p>
                                <p className="text-sm text-muted-foreground">
                                    Already have a domain? Connect it to your DealerSite Pro website with easy DNS setup.
                                </p>
                                <div className="space-y-2">
                                    {[
                                        "Use your existing domain (e.g. mydealer.com)",
                                        "Free SSL certificate (HTTPS)",
                                        "Step-by-step DNS setup guide",
                                        "Professional email setup support",
                                    ].map((item) => (
                                        <div key={item} className="flex items-start gap-2 text-sm">
                                            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-muted-foreground">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="rounded-xl p-3 border border-blue-500/20 bg-blue-500/5">
                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                        Perfect if you already own a domain
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                    onClick={() => router.push("/dashboard/domains")}
                                >
                                    Connect My Domain
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* PREMIUM Tier */}
                        <Card className="border-2 border-violet-500/30 hover:border-violet-500/60 transition-colors relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                                <Crown className="w-3 h-3" />
                                PREMIUM
                            </div>
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-6 h-6 text-violet-500" />
                                    <CardTitle className="text-xl">PREMIUM Tier</CardTitle>
                                </div>
                                <CardDescription className="text-lg font-semibold text-foreground">
                                    ₹999/month
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="font-medium text-foreground">Get a Brand New Domain</p>
                                <p className="text-sm text-muted-foreground">
                                    Don't have a domain? We'll help you find and register the perfect one — fully managed.
                                </p>
                                <div className="space-y-2">
                                    {[
                                        "Search & purchase new domains (.com, .in, etc.)",
                                        "Automatic DNS configuration (zero setup!)",
                                        "Free SSL certificate (HTTPS)",
                                        "Auto-renewal & domain management",
                                    ].map((item) => (
                                        <div key={item} className="flex items-start gap-2 text-sm">
                                            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-muted-foreground">{item}</span>
                                        </div>
                                    ))}
                                    <div className="flex items-start gap-2 text-sm">
                                        <Zap className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-foreground font-semibold">Live instantly — no waiting!</span>
                                    </div>
                                </div>
                                <div className="rounded-xl p-3 border border-violet-500/20 bg-violet-500/5">
                                    <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                                        Fully managed — we handle everything!
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700"
                                    onClick={() => router.push("/dashboard/domains")}
                                >
                                    <Crown className="w-4 h-4 mr-2" />
                                    Get My Domain
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Comparison Note */}
                    <Card variant="glass">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-xl bg-blue-500/10">
                                    <Globe className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-foreground mb-2">Not sure which to choose?</h4>
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <p><strong className="text-foreground">Choose PRO</strong> if you already own a domain like "yourcompany.com"</p>
                                        <p><strong className="text-foreground">Choose PREMIUM</strong> if you need help finding and purchasing a new domain</p>
                                        <p><strong className="text-foreground">Stay FREE</strong> for now and upgrade anytime from your dashboard</p>
                                    </div>
                                    <Button
                                        variant="link"
                                        className="mt-3 px-0 h-auto text-blue-600 dark:text-blue-400"
                                        onClick={() => setShowUpgradeOptions(false)}
                                    >
                                        No thanks, I'll stick with my free subdomain for now →
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

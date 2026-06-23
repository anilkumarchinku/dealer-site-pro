"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    AlertCircle,
    ArrowRight,
    CheckCircle,
    Clock,
    Copy,
    ExternalLink,
    Globe2,
    Loader2,
    Rocket,
    ShieldCheck,
} from "lucide-react";

import { DealerPreviewCard, LaunchChecklist } from "@/components/onboarding/flow-shell";
import { Button } from "@/components/ui/button";
import { saveDealer } from "@/lib/actions/save-dealer";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { dealerSiteHref, dealerSiteUrl } from "@/lib/utils/domain";
import { validateOnboardingReadyForSave } from "@/lib/validations/onboarding";

export default function Step6Page() {
    const router = useRouter();
    const { data, setStep, dealerId, setDealerId } = useOnboardingStore();
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [liveSiteSlug, setLiveSiteSlug] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setStep(6);
        return;
    }, [setStep]);

    const fallbackSlug = data.slug || data.dealershipName?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "";
    const displaySlug = liveSiteSlug || fallbackSlug;
    const displayUrl = dealerSiteUrl(displaySlug);
    const displayHref = dealerSiteHref(displaySlug);
    const uploadedCount = data.uploadedVehicles?.length ?? 0;

    const handleFinish = async () => {
        const validationErrors = validateOnboardingReadyForSave(data);
        if (validationErrors.length > 0) {
            setSaveError(validationErrors[0]);
            return;
        }

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

    const handleCopyUrl = () => {
        if (!displaySlug) return;
        navigator.clipboard.writeText(displayHref).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (showSuccess && liveSiteSlug) {
        return (
            <div className="mx-auto max-w-3xl py-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                    <CheckCircle className="h-11 w-11 text-emerald-600" />
                </div>
                <h1 className="mt-6 text-4xl font-black tracking-[-0.04em] text-[#071436]">
                    Your dealership website is live.
                </h1>
                <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-6 text-[#62708A]">
                    Customers can now find {data.dealershipName || "your dealership"} online.
                </p>

                <div className="mx-auto mt-6 flex max-w-xl items-center gap-2 rounded-lg border border-[#D8E0EA] bg-[#F7F9FC] p-3 text-left">
                    <Globe2 className="h-5 w-5 shrink-0 text-[#155EEF]" />
                    <span className="flex-1 break-all font-mono text-sm font-black text-[#071436]">{displayUrl}</span>
                    <Button variant="outline" size="sm" onClick={handleCopyUrl} className="border-[#D8E0EA]">
                        <Copy className="mr-2 h-4 w-4" />
                        {copied ? "Copied" : "Copy"}
                    </Button>
                </div>

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button variant="outline" className="h-12 rounded-md border-[#D8E0EA] px-6 font-black" onClick={() => window.open(displayHref, "_blank")}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Preview Website
                    </Button>
                    <Button className="h-12 rounded-md bg-[#155EEF] px-6 font-black text-white hover:bg-[#0F4FD3]" onClick={() => router.push("/dashboard")}>
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-7">
            <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#155EEF]">Launch</p>
                <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#071436]">
                    Review and launch your website
                </h1>
                <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#62708A]">
                    Everything looks good. You are ready to go live.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                <section>
                    <DealerPreviewCard
                        dealerName={data.dealershipName}
                        slug={displaySlug}
                        phone={data.phone}
                        city={data.location}
                    />
                </section>

                <aside className="space-y-4">
                    <div className="rounded-lg border border-[#D8E0EA] bg-white p-5 shadow-[0_14px_42px_rgba(7,20,54,0.07)]">
                        <h2 className="text-base font-black text-[#071436]">Your Website</h2>
                        <a href={displayHref} target="_blank" rel="noreferrer" className="mt-3 block break-all text-sm font-black text-[#155EEF] hover:underline">
                            {displayUrl}
                        </a>
                        {showSuccess ? (
                            <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-3">
                                <p className="flex items-center gap-2 text-sm font-black text-emerald-700">
                                    <CheckCircle className="h-4 w-4" />
                                    Domain status
                                </p>
                                <p className="mt-1 text-xs font-semibold text-emerald-700">Connected</p>
                            </div>
                        ) : (
                            <div className="mt-5 rounded-md border border-[#D8E0EA] bg-[#F7F9FC] p-3">
                                <p className="flex items-center gap-2 text-sm font-black text-[#62708A]">
                                    <Clock className="h-4 w-4" />
                                    Domain status
                                </p>
                                <p className="mt-1 text-xs font-semibold text-[#62708A]">Pending — connects on publish</p>
                            </div>
                        )}
                    </div>

                    <LaunchChecklist
                        uploadedCount={uploadedCount}
                        hasDealerDetails={Boolean(data.dealershipName?.trim() && data.location?.trim())}
                        hasContactDetails={Boolean(data.phone?.trim() && data.email?.trim())}
                        published={showSuccess}
                    />

                    <div className="rounded-lg border border-[#D8E0EA] bg-[#F7F9FC] p-5">
                        <p className="flex items-center gap-2 text-sm font-black text-[#071436]">
                            <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
                            Free SSL and SEO basics included
                        </p>
                    </div>
                </aside>
            </div>

            {saveError && (
                <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{saveError}</span>
                </div>
            )}

            <div className="flex items-center justify-end pt-2">
                <Button
                    onClick={handleFinish}
                    className="h-12 rounded-md bg-[#16A34A] px-7 font-black text-white hover:bg-[#15803D]"
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Publishing
                        </>
                    ) : (
                        <>
                            <Rocket className="mr-2 h-4 w-4" />
                            Publish Website
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

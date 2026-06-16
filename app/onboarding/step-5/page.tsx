"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Clock,
    Globe,
    ImageIcon,
    LayoutTemplate,
    MousePointerClick,
    Sparkles,
    Type,
} from "lucide-react";

import { SocialLinksFields } from "@/components/onboarding/SocialLinksFields";
import { WebsiteImageFields } from "@/components/onboarding/WebsiteImageFields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPrefilledTemplateConfig } from "@/lib/onboarding/prefill";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import {
    getOptionalHttpUrlError,
    hasValidationErrors,
    type OnboardingSocialField,
    validateTemplateSocialUrls,
} from "@/lib/validations/onboarding";

const inputClassName =
    "h-12 rounded-lg border-[#D8E0EA] bg-white px-4 text-base font-medium text-[#071436] shadow-[0_8px_22px_rgba(7,20,54,0.03)] placeholder:text-[#8A97AA] focus-visible:ring-[#155EEF]";

function SectionPanel({
    icon: Icon,
    eyebrow,
    title,
    description,
    children,
}: {
    icon: typeof Type;
    eyebrow: string;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-xl border border-[#D8E0EA] bg-white p-5 shadow-[0_12px_34px_rgba(7,20,54,0.05)]">
            <div className="mb-5 flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#CFE0FF] bg-[#EEF4FF] text-[#155EEF]">
                    <Icon className="h-5 w-5" />
                </span>
                <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#155EEF]">{eyebrow}</p>
                    <h3 className="mt-1 text-lg font-black tracking-[-0.02em] text-[#071436]">{title}</h3>
                    <p className="mt-1 text-sm font-medium leading-6 text-[#62708A]">{description}</p>
                </div>
            </div>
            {children}
        </section>
    );
}

function FieldBlock({
    id,
    label,
    hint,
    value,
    placeholder,
    onChange,
}: {
    id: string;
    label: string;
    hint?: string;
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-black text-[#35445C]">
                {label}
            </Label>
            <Input
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className={inputClassName}
            />
            {hint && <p className="text-xs font-medium text-[#62708A]">{hint}</p>}
        </div>
    );
}

export default function Step5Page() {
    const router = useRouter();
    const { data, updateData, setStep } = useOnboardingStore();

    const [config, setConfig] = useState(() => getPrefilledTemplateConfig(data, "car"));
    const [urlErrors, setUrlErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setStep(5);
    }, [setStep]);

    useEffect(() => {
        setConfig(getPrefilledTemplateConfig(data, "car"));
    }, [data]);

    const handleChange = (field: keyof typeof config, value: string) => {
        const newConfig = { ...config, [field]: value };
        setConfig(newConfig);
        updateData({ templateConfig: newConfig });

        if (["facebook", "instagram", "twitter", "youtube", "linkedin"].includes(field)) {
            setUrlErrors((prev) => ({
                ...prev,
                [field]: getOptionalHttpUrlError(value, "Enter a valid URL starting with http:// or https://"),
            }));
        }
    };

    const handleNext = () => {
        const nextUrlErrors = validateTemplateSocialUrls(config);
        setUrlErrors(nextUrlErrors);
        if (hasValidationErrors(nextUrlErrors)) return;

        updateData({ templateConfig: config });
        setStep(6);
        router.push("/onboarding/step-6");
    };

    const handleBack = () => {
        router.push("/onboarding/step-4");
    };

    return (
        <div className="animate-fade-in space-y-6">
            <Card className="overflow-hidden rounded-xl border-[#D8E0EA] bg-white shadow-[0_18px_55px_rgba(7,20,54,0.08)]">
                <CardHeader className="border-b border-[#E3E9F2] bg-gradient-to-r from-[#F8FBFF] to-white px-7 py-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#155EEF]">
                                Website Copy
                            </p>
                            <CardTitle className="flex items-center gap-3 text-3xl font-black tracking-[-0.035em] text-[#071436]">
                                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EEF4FF] text-[#155EEF]">
                                    <LayoutTemplate className="h-5 w-5" />
                                </span>
                                Customize Your Website
                            </CardTitle>
                            <CardDescription className="mt-3 max-w-2xl text-base font-medium leading-6 text-[#62708A]">
                                Fine tune the text, links, images, and operating details before the final review.
                            </CardDescription>
                        </div>
                        <div className="w-fit rounded-full border border-[#CFE0FF] bg-white px-4 py-2 text-sm font-black text-[#155EEF] shadow-[0_10px_24px_rgba(21,94,239,0.08)]">
                            Step 5 of 6
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-7 py-6">
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                        <div className="space-y-5">
                            <SectionPanel
                                icon={Type}
                                eyebrow="Hero"
                                title="Top of page"
                                description="These lines are the first thing visitors see on the dealer website."
                            >
                                <div className="grid gap-4">
                                    <FieldBlock
                                        id="heroTitle"
                                        label="Main Headline"
                                        placeholder="e.g. Find Your Dream Car Today"
                                        value={config.heroTitle}
                                        onChange={(value) => handleChange("heroTitle", value)}
                                        hint="The largest headline in the hero section."
                                    />
                                    <FieldBlock
                                        id="heroSubtitle"
                                        label="Sub-headline"
                                        placeholder="e.g. Best deals on new and used cars in Hyderabad"
                                        value={config.heroSubtitle}
                                        onChange={(value) => handleChange("heroSubtitle", value)}
                                    />
                                    <FieldBlock
                                        id="heroCtaText"
                                        label="Main Button Text"
                                        placeholder="e.g. View Inventory"
                                        value={config.heroCtaText}
                                        onChange={(value) => handleChange("heroCtaText", value)}
                                    />
                                </div>
                            </SectionPanel>

                            <div className="grid gap-5 lg:grid-cols-2">
                                <SectionPanel
                                    icon={Sparkles}
                                    eyebrow="Highlights"
                                    title="Features section"
                                    description="Name the section that explains why customers should choose this dealership."
                                >
                                    <FieldBlock
                                        id="featuresTitle"
                                        label="Section Title"
                                        placeholder="e.g. Why Shop With Us?"
                                        value={config.featuresTitle}
                                        onChange={(value) => handleChange("featuresTitle", value)}
                                    />
                                </SectionPanel>

                                <SectionPanel
                                    icon={Clock}
                                    eyebrow="Optional"
                                    title="Business hours"
                                    description="Add showroom hours if the dealer wants them visible on the site."
                                >
                                    <FieldBlock
                                        id="workingHours"
                                        label="Working Hours"
                                        placeholder="e.g. Mon-Sat: 9AM - 7PM, Sun: 10AM - 5PM"
                                        value={config.workingHours}
                                        onChange={(value) => handleChange("workingHours", value)}
                                    />
                                </SectionPanel>
                            </div>

                            <SectionPanel
                                icon={Globe}
                                eyebrow="Online Presence"
                                title="Social media links"
                                description="Optional links for the website footer and contact areas."
                            >
                                <SocialLinksFields
                                    values={config}
                                    errors={urlErrors}
                                    onChange={(field: OnboardingSocialField, value: string) => handleChange(field, value)}
                                />
                            </SectionPanel>

                            <SectionPanel
                                icon={ImageIcon}
                                eyebrow="Brand Assets"
                                title="Website images"
                                description="Upload custom visuals or let DealerSite Pro use matching defaults."
                            >
                                <WebsiteImageFields
                                    logoValue={data.brandLogo}
                                    heroValue={data.heroImage}
                                    onLogoChange={(value) => updateData({ brandLogo: value })}
                                    onHeroChange={(value) => updateData({ heroImage: value })}
                                />
                            </SectionPanel>
                        </div>

                        <aside className="space-y-5">
                            <div className="sticky top-6 rounded-xl border border-[#D8E0EA] bg-[#071436] p-5 text-white shadow-[0_20px_55px_rgba(7,20,54,0.16)]">
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-200">
                                    Live Copy Preview
                                </p>
                                <div className="mt-5 rounded-lg bg-white p-4 text-[#071436]">
                                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#155EEF]">
                                        {data.dealershipName || "Your Dealership"}
                                    </p>
                                    <h3 className="mt-3 text-2xl font-black leading-tight tracking-[-0.035em]">
                                        {config.heroTitle || "Find Your Dream Vehicle Today"}
                                    </h3>
                                    <p className="mt-3 text-sm font-medium leading-6 text-[#62708A]">
                                        {config.heroSubtitle || "Trusted vehicles, transparent pricing, and easy finance."}
                                    </p>
                                    <button className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-[#155EEF] px-5 text-sm font-black text-white">
                                        {config.heroCtaText || "View Inventory"}
                                    </button>
                                </div>

                                <div className="mt-5 space-y-3">
                                    {[
                                        "Hero copy ready",
                                        config.featuresTitle ? "Feature title added" : "Feature title uses default",
                                        config.workingHours ? "Business hours added" : "Business hours optional",
                                    ].map((item) => (
                                        <div key={item} className="flex items-center gap-2 text-sm font-bold text-white/85">
                                            <CheckCircle2 className="h-4 w-4 text-[#7DD3FC]" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-xl border border-[#CFE0FF] bg-[#F5F8FF] p-5">
                                <div className="flex gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#155EEF]">
                                        <MousePointerClick className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <h4 className="font-black text-[#071436]">Review before launch</h4>
                                        <p className="mt-1 text-sm font-medium leading-6 text-[#62708A]">
                                            The next screen shows the final setup summary before publishing.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </CardContent>

                <CardFooter className="justify-between border-t border-[#E3E9F2] bg-[#F8FBFF] px-7 py-4">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="font-black text-[#35445C] hover:bg-white hover:text-[#155EEF]"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        className="h-11 rounded-md bg-[#155EEF] px-6 font-black text-white hover:bg-[#0F4FD3]"
                    >
                        Next: Review
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

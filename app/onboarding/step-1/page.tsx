"use client"
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, CheckCircle, XCircle, Globe, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

// Sanitize input into a URL-safe slug
function toSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 63);
}

export default function Step1Page() {
    const router = useRouter();
    const { data, updateData, setStep } = useOnboardingStore();

    const [formData, setFormData] = useState({
        dealershipName: data.dealershipName || "",
        tagline: data.tagline || "",
        location: data.location || "",
        fullAddress: data.fullAddress || "",
        mapLink: data.mapLink || "",
        yearsInBusiness: data.yearsInBusiness?.toString() || "",
        phone: data.phone || "",
        whatsapp: data.whatsapp || "",
        email: data.email || "",
        gstin: data.gstin || "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Slug / site name state
    const [siteSlug, setSiteSlug] = useState(data.slug || "");
    const [slugEdited, setSlugEdited] = useState(false);   // true once user manually edits
    const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
    const [slugError, setSlugError] = useState("");
    const checkRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Auto-generate slug from dealership name (unless user has manually edited it)
    useEffect(() => {
        if (!slugEdited && formData.dealershipName) {
            setSiteSlug(toSlug(formData.dealershipName));
        }
    }, [formData.dealershipName, slugEdited]);

    // Debounced availability check whenever slug changes
    useEffect(() => {
        if (!siteSlug) { setSlugStatus("idle"); return; }

        if (checkRef.current) clearTimeout(checkRef.current);
        setSlugStatus("checking");

        checkRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/domains/check-slug?slug=${encodeURIComponent(siteSlug)}`);
                if (!res.ok) { setSlugStatus("idle"); return; }
                const result = await res.json();
                if (!result.success) {
                    setSlugStatus("invalid");
                    setSlugError(result.error || "Invalid site name");
                } else {
                    setSlugStatus(result.available ? "available" : "taken");
                    setSlugError(result.message || "");
                }
            } catch {
                setSlugStatus("idle");
            }
        }, 600);

        return () => { if (checkRef.current) clearTimeout(checkRef.current); };
    }, [siteSlug]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const handleSlugChange = (value: string) => {
        const sanitized = toSlug(value);
        setSiteSlug(sanitized);
        setSlugEdited(true);
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.dealershipName.trim()) newErrors.dealershipName = "Dealership name is required";
        if (!formData.location.trim())       newErrors.location       = "Location is required";
        if (!formData.phone.trim())          newErrors.phone          = "Phone number is required";
        if (!formData.email.trim())          newErrors.email          = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
        if (!siteSlug)                       newErrors.siteSlug       = "Site name is required";
        if (slugStatus === "taken")          newErrors.siteSlug       = "This site name is already taken";
        if (slugStatus === "invalid")        newErrors.siteSlug       = slugError;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (!validate()) return;
        if (slugStatus === "checking") return; // wait for check

        setIsSubmitting(true);
        try {
            updateData({
                dealershipName: formData.dealershipName,
                tagline:        formData.tagline,
                location:       formData.location,
                fullAddress:    formData.fullAddress,
                mapLink:        formData.mapLink,
                yearsInBusiness: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : null,
                phone:          formData.phone,
                whatsapp:       formData.whatsapp || formData.phone,
                email:          formData.email,
                gstin:          formData.gstin,
                slug:           siteSlug,
            });
            setStep(2);
            router.push("/onboarding/step-2");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => { setStep(1); }, [setStep]);

    // Site base URL for the preview
    const baseUrl = typeof window !== "undefined"
        ? window.location.origin
        : "https://dealer-site-pro.vercel.app";

    return (
        <Card className="animate-fade-in">
            <CardHeader>
                <CardTitle>Tell us about your dealership</CardTitle>
                <CardDescription>
                    We&apos;ll use this information to create your personalised website
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Dealership Name */}
                <Input
                    label="Dealership Name"
                    placeholder="Kumar Motors"
                    value={formData.dealershipName}
                    onChange={(e) => handleChange("dealershipName", e.target.value)}
                    error={errors.dealershipName}
                    helperText="What's your business called?"
                    required
                />

                {/* Site Name / Slug Picker */}
                {siteSlug && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Your Site URL
                        </label>

                        {/* URL Preview bar */}
                        <div className={cn(
                            "flex items-center rounded-xl border-2 overflow-hidden transition-colors",
                            slugStatus === "available" ? "border-emerald-500/40 bg-emerald-500/5" :
                            slugStatus === "taken"     ? "border-red-500/40    bg-red-500/5"     :
                            slugStatus === "invalid"   ? "border-red-500/40    bg-red-500/5"     :
                                                         "border-border        bg-muted/30"
                        )}>
                            {/* Fixed prefix */}
                            <span className="px-3 py-2.5 text-sm text-muted-foreground bg-muted/50 border-r border-border whitespace-nowrap select-none">
                                {baseUrl}/sites/
                            </span>

                            {/* Editable slug */}
                            <input
                                type="text"
                                value={siteSlug}
                                onChange={(e) => handleSlugChange(e.target.value)}
                                className="flex-1 px-3 py-2.5 text-sm font-mono bg-transparent text-foreground focus:outline-none"
                                placeholder="your-dealership-name"
                                spellCheck={false}
                            />

                            {/* Status icon */}
                            <div className="px-3">
                                {slugStatus === "checking"  && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                                {slugStatus === "available" && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                {(slugStatus === "taken" || slugStatus === "invalid") && <XCircle className="w-4 h-4 text-red-500" />}
                            </div>
                        </div>

                        {/* Status message */}
                        {slugStatus === "available" && (
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Available! Your site will be live at this URL.
                            </p>
                        )}
                        {(slugStatus === "taken" || slugStatus === "invalid") && (
                            <p className="text-xs text-red-500 flex items-center gap-1.5">
                                <XCircle className="w-3.5 h-3.5" />
                                {slugError}
                            </p>
                        )}
                        {errors.siteSlug && slugStatus !== "taken" && slugStatus !== "invalid" && (
                            <p className="text-xs text-red-500">{errors.siteSlug}</p>
                        )}

                        {/* Brand URL note */}
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Edit3 className="w-3 h-3 shrink-0" />
                            After you pick brands, e.g.{" "}
                            <code className="font-mono bg-muted px-1 rounded">{siteSlug}-toyota</code>{" "}
                            will also work automatically.
                        </p>
                    </div>
                )}

                <Input
                    label="Location"
                    placeholder="Mumbai, Maharashtra"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    error={errors.location}
                    helperText="What city are you in?"
                    required
                />

                <Input
                    label="Years in Business"
                    placeholder="10"
                    type="number"
                    value={formData.yearsInBusiness}
                    onChange={(e) => handleChange("yearsInBusiness", e.target.value)}
                    helperText="How long have you been open? (Leave blank if new)"
                />

                <Input
                    label="Phone Number"
                    placeholder="+91 98765 43210"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    error={errors.phone}
                    required
                />

                <Input
                    label="Email"
                    placeholder="info@kumarmotors.in"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    error={errors.email}
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Tagline (Optional)"
                        placeholder="Driven by Trust"
                        value={formData.tagline}
                        onChange={(e) => handleChange("tagline", e.target.value)}
                        helperText="A short slogan for your brand"
                    />
                    <Input
                        label="GSTIN (Optional)"
                        placeholder="22AAAAA0000A1Z5"
                        value={formData.gstin}
                        onChange={(e) => handleChange("gstin", e.target.value)}
                        helperText="Adds credibility to your site"
                    />
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Full Address (Optional)
                        </label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="123 Main Street, Industrial Area, City, State - Pin Code"
                            value={formData.fullAddress}
                            onChange={(e) => handleChange("fullAddress", e.target.value)}
                        />
                        <p className="text-[0.8rem] text-muted-foreground">
                            Displayed in the footer and contact page.
                        </p>
                    </div>

                    <Input
                        label="Google Maps Link (Optional)"
                        placeholder="https://maps.google.com/..."
                        value={formData.mapLink}
                        onChange={(e) => handleChange("mapLink", e.target.value)}
                        helperText="Paste your location's share link here"
                    />
                </div>

                <Input
                    label="WhatsApp Number (Optional)"
                    placeholder="Same as phone"
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => handleChange("whatsapp", e.target.value)}
                    helperText="For instant chat button on site"
                />
            </CardContent>

            <CardFooter className="justify-end">
                <Button
                    onClick={handleNext}
                    disabled={isSubmitting || slugStatus === "checking" || slugStatus === "taken" || slugStatus === "invalid"}
                >
                    {isSubmitting || slugStatus === "checking" ? (
                        <>
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            {slugStatus === "checking" ? "Checking availability..." : "Saving..."}
                        </>
                    ) : (
                        <>
                            Continue
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}

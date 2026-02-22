"use client"
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, CheckCircle, XCircle, Globe, Edit3, Check, Building2, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { BASE_DOMAIN, USE_SUBDOMAIN } from "@/lib/utils/domain";
import type { Brand } from "@/lib/types";

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

const BRANDS: { name: Brand; logo: string }[] = [
    { name: "Maruti Suzuki",  logo: "/assets/logos/maruti-suzuki.png" },
    { name: "Tata Motors",    logo: "/assets/logos/tata-motors.png" },
    { name: "Mahindra",       logo: "/assets/logos/mahindra.png" },
    { name: "Hyundai",        logo: "/assets/logos/hyundai.png" },
    { name: "Honda",          logo: "/assets/logos/honda.png" },
    { name: "Toyota",         logo: "/assets/logos/toyota.png" },
    { name: "Kia",            logo: "/assets/logos/kia.png" },
    { name: "Renault",        logo: "/assets/logos/renault.png" },
    { name: "Nissan",         logo: "/assets/logos/nissan.png" },
    { name: "Volkswagen",     logo: "/assets/logos/volkswagen.png" },
    { name: "Skoda",          logo: "/assets/logos/skoda.png" },
    { name: "MG",             logo: "/assets/logos/mg.png" },
    { name: "Jeep",           logo: "/assets/logos/jeep.png" },
    { name: "Citroen",        logo: "/assets/logos/citroen.png" },
    { name: "Force Motors",   logo: "/assets/logos/force-motors.png" },
    { name: "Isuzu",          logo: "/assets/logos/isuzu.png" },
    { name: "Mercedes-Benz",  logo: "/assets/logos/mercedes-benz.png" },
    { name: "BMW",            logo: "/assets/logos/bmw.png" },
    { name: "Audi",           logo: "/assets/logos/audi.png" },
    { name: "Jaguar",         logo: "/assets/logos/jaguar.png" },
    { name: "Land Rover",     logo: "/assets/logos/land-rover.png" },
    { name: "Volvo",          logo: "/assets/logos/volvo.png" },
    { name: "Lexus",          logo: "/assets/logos/lexus.png" },
    { name: "Porsche",        logo: "/assets/logos/porsche.png" },
    { name: "Bentley",        logo: "/assets/logos/bentley.png" },
    { name: "Lamborghini",    logo: "/assets/logos/lamborghini.png" },
    { name: "BYD",            logo: "/assets/logos/byd.png" },
    { name: "Tesla",          logo: "/assets/logos/tesla.png" },
];

export default function Step1Page() {
    const router = useRouter();
    const { data, updateData, setStep } = useOnboardingStore();

    const isFirstHand = data.dealerCategory === 'new';
    const isHybrid    = data.dealerCategory === 'both';
    const showBrandPicker = isFirstHand || isHybrid;

    const [formData, setFormData] = useState({
        dealershipName:  data.dealershipName || "",
        tagline:         data.tagline || "",
        location:        data.location || "",
        fullAddress:     data.fullAddress || "",
        mapLink:         data.mapLink || "",
        yearsInBusiness: data.yearsInBusiness?.toString() || "",
        phone:           data.phone || "",
        whatsapp:        data.whatsapp || "",
        email:           data.email || "",
        gstin:           data.gstin || "",
    });

    const [errors,       setErrors]       = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Slug / site name state
    const [siteSlug,   setSiteSlug]   = useState(data.slug || "");
    const [slugEdited, setSlugEdited] = useState(false);
    const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
    const [slugError,  setSlugError]  = useState("");
    const checkRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // OEM brand state (1st hand only)
    const [selectedBrands, setSelectedBrands] = useState<Brand[]>(data.brands || []);
    const [brandError,     setBrandError]     = useState("");

    // Auto-generate slug from dealership name
    useEffect(() => {
        if (!slugEdited && formData.dealershipName) {
            setSiteSlug(toSlug(formData.dealershipName));
        }
    }, [formData.dealershipName, slugEdited]);

    // Debounced slug availability check
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
        setSiteSlug(toSlug(value));
        setSlugEdited(true);
    };

    const toggleBrand = (brand: Brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
        setBrandError("");
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
        if (slugStatus === "checking") return;

        // For 1st hand and hybrid, require at least one OEM brand
        if (showBrandPicker && selectedBrands.length === 0) {
            setBrandError("Please select at least one brand you're authorised to sell");
            document.getElementById("brand-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        setIsSubmitting(true);
        try {
            updateData({
                dealershipName:  formData.dealershipName,
                tagline:         formData.tagline,
                location:        formData.location,
                fullAddress:     formData.fullAddress,
                mapLink:         formData.mapLink,
                yearsInBusiness: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : null,
                phone:           formData.phone,
                whatsapp:        formData.whatsapp || formData.phone,
                email:           formData.email,
                gstin:           formData.gstin,
                slug:            siteSlug,
                ...(isFirstHand && {
                    brands:        selectedBrands,
                    sellsNewCars:  true,
                    sellsUsedCars: false,
                }),
                ...(isHybrid && {
                    brands:        selectedBrands,
                    sellsNewCars:  true,
                    sellsUsedCars: true,
                }),
            });
            setStep(2);

            if (isFirstHand) {
                // 1st hand: brands captured here — skip step-2, go straight to Services
                router.push("/onboarding/step-3");
            } else {
                // 2nd hand & hybrid → brand colours/logo for the used section
                router.push("/onboarding/step-2-used");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => { setStep(1); }, [setStep]);

    const urlPrefix = USE_SUBDOMAIN ? null             : `${BASE_DOMAIN}/sites/`
    const urlSuffix = USE_SUBDOMAIN ? `.${BASE_DOMAIN}` : null

    return (
        <Card className="animate-fade-in">
            <CardHeader>
                {/* ── Dealer type badge ── */}
                <div className="mb-3">
                    <span className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border",
                        isHybrid
                            ? "bg-violet-500/10 text-violet-600 border-violet-500/20"
                            : isFirstHand
                                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                    )}>
                        {isHybrid
                            ? <><Building2 className="w-3.5 h-3.5" /><span>+</span><Car className="w-3.5 h-3.5" /></>
                            : isFirstHand
                                ? <Building2 className="w-3.5 h-3.5" />
                                : <Car className="w-3.5 h-3.5" />}
                        {isHybrid
                            ? "Hybrid Dealer — New + Pre-Owned Cars"
                            : isFirstHand
                                ? "1st Hand Dealer — Authorised New Car Dealership"
                                : "2nd Hand Dealer — Pre-Owned Cars"}
                    </span>
                </div>

                <CardTitle>Tell us about your dealership</CardTitle>
                <CardDescription>
                    {isHybrid
                        ? "We'll build you a combined website showcasing both your new OEM models and pre-owned stock"
                        : isFirstHand
                            ? "We'll use this to build your authorised dealership website with OEM brand pages"
                            : "We'll use this to create your premium pre-owned car website"}
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

                        <div className={cn(
                            "flex items-center rounded-xl border-2 overflow-hidden transition-colors",
                            slugStatus === "available" ? "border-emerald-500/40 bg-emerald-500/5" :
                            slugStatus === "taken"     ? "border-red-500/40    bg-red-500/5"     :
                            slugStatus === "invalid"   ? "border-red-500/40    bg-red-500/5"     :
                                                         "border-border        bg-muted/30"
                        )}>
                            {urlPrefix && (
                                <span className="px-3 py-2.5 text-sm text-muted-foreground bg-muted/50 border-r border-border whitespace-nowrap select-none">
                                    {urlPrefix}
                                </span>
                            )}
                            <input
                                type="text"
                                value={siteSlug}
                                onChange={(e) => handleSlugChange(e.target.value)}
                                className="flex-1 px-3 py-2.5 text-sm font-mono bg-transparent text-foreground focus:outline-none"
                                placeholder="your-dealership-name"
                                spellCheck={false}
                            />
                            {urlSuffix && (
                                <span className="px-3 py-2.5 text-sm text-muted-foreground bg-muted/50 border-l border-border whitespace-nowrap select-none">
                                    {urlSuffix}
                                </span>
                            )}
                            <div className="px-3">
                                {slugStatus === "checking"  && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                                {slugStatus === "available" && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                {(slugStatus === "taken" || slugStatus === "invalid") && <XCircle className="w-4 h-4 text-red-500" />}
                            </div>
                        </div>

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

                        {isFirstHand && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <Edit3 className="w-3 h-3 shrink-0" />
                                After picking brands, e.g.{" "}
                                <code className="font-mono bg-muted px-1 rounded">
                                    {USE_SUBDOMAIN
                                        ? `${siteSlug}-toyota${urlSuffix}`
                                        : `${urlPrefix}${siteSlug}-toyota`}
                                </code>{" "}
                                will also work automatically.
                            </p>
                        )}
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
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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

                {/* ── OEM Brand Selection (1st hand + hybrid) ──────────────────── */}
                {showBrandPicker && (
                    <div id="brand-section" className="border-t border-border pt-6 space-y-4">
                        {isHybrid && (
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-violet-500/5 border border-violet-500/20">
                                <span className="text-lg">🔀</span>
                                <div>
                                    <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">New Cars (OEM Section)</p>
                                    <p className="text-xs text-muted-foreground">Select the brands you&apos;re authorised to sell new. Your pre-owned stock will be set up in the next step.</p>
                                </div>
                            </div>
                        )}
                        <div>
                            <h3 className="text-base font-semibold flex items-center gap-2">
                                <span className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                                    isHybrid
                                        ? "bg-violet-500/10 border border-violet-500/20 text-violet-600"
                                        : "bg-blue-500/10 border border-blue-500/20 text-blue-600"
                                )}>
                                    OEM
                                </span>
                                Which brands are you authorised to sell?
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Select all OEM brands you hold an authorised dealership for
                            </p>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {BRANDS.map((brand) => (
                                <button
                                    key={brand.name}
                                    type="button"
                                    onClick={() => toggleBrand(brand.name)}
                                    className={cn(
                                        "p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all hover:bg-accent relative",
                                        selectedBrands.includes(brand.name)
                                            ? "border-blue-500 bg-blue-500/5"
                                            : "border-input"
                                    )}
                                >
                                    <div className="relative w-10 h-10 flex items-center justify-center">
                                        <Image
                                            src={brand.logo}
                                            alt={brand.name}
                                            width={40}
                                            height={40}
                                            className="object-contain"
                                        />
                                    </div>
                                    <span className="text-xs font-medium truncate w-full text-center leading-tight">
                                        {brand.name}
                                    </span>
                                    {selectedBrands.includes(brand.name) && (
                                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                                            <Check className="w-2.5 h-2.5 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {selectedBrands.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                                Selected:{" "}
                                <strong className="text-foreground">
                                    {selectedBrands.length} brand{selectedBrands.length > 1 ? "s" : ""}
                                </strong>
                                {selectedBrands.length <= 3 && (
                                    <span className="text-muted-foreground"> ({selectedBrands.join(", ")})</span>
                                )}
                                {selectedBrands.length > 1 && (
                                    <span className="ml-2 text-xs text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                                        Multi-OEM Dealer
                                    </span>
                                )}
                            </p>
                        )}

                        {brandError && (
                            <p className="text-sm text-destructive flex items-center gap-1.5">
                                <XCircle className="w-4 h-4 flex-shrink-0" />
                                {brandError}
                            </p>
                        )}
                    </div>
                )}
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

"use client"
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import { ArrowRight, Loader2, CheckCircle, XCircle, Globe, Edit3, Check, Building2, Car, ExternalLink, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { BASE_DOMAIN, USE_SUBDOMAIN } from "@/lib/utils/domain";
import type { Brand } from "@/lib/types";
import {
    getOnboardingBranchPrefill,
    getOnboardingContactFormPrefill,
} from "@/lib/onboarding/prefill";
import {
    formatOnboardingPhone,
    validateOnboardingContactStep,
} from "@/lib/validations/onboarding";
import brandData from "@/lib/data/brand-models.json";

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
    { name: "VinFast",        logo: "/assets/logos/vinfast.png" },
    { name: "MINI",           logo: "/assets/logos/mini.png" },
];

// Secondary 2W/3W brand lists — reused when a cars-primary dealer also sells those types.
const LOGO_EXT: Record<string, string> = {
    "hop-electric": "svg", "okinawa-autotech": "webp",
};
function logoSrc(brandId: string) {
    return `/data/brand-logos/${brandId}.${LOGO_EXT[brandId] ?? "png"}`;
}

type TwoWheelerBrandEntry = { brandId: string; brand: string; electric: boolean };
const TWO_WHEELER_BRANDS: TwoWheelerBrandEntry[] = [
    ...(brandData.twoWheelers.traditional as { brandId: string; brand: string }[]).map(b => ({ ...b, electric: false })),
    ...(brandData.twoWheelers.electric    as { brandId: string; brand: string }[]).map(b => ({ ...b, electric: true  })),
];
const THREE_WHEELER_BRANDS = (brandData.threeWheelers as { brandId: string; brand: string }[]);

export default function Step1Page() {
    const router = useRouter();
    const { data, updateData, setStep } = useOnboardingStore();

    const isFirstHand = data.dealerCategory === 'new';
    const isHybrid    = data.dealerCategory === 'both';
    const showBrandPicker = isFirstHand || isHybrid;

    const [formData, setFormData] = useState(() => getOnboardingContactFormPrefill(data));

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
    const [cyeproKey,      setCyeproKey]      = useState(data.cyeproApiKey ?? "");
    const [showCyeproKey,  setShowCyeproKey]  = useState(false);
    const [cyeproError,    setCyeproError]    = useState("");

    // Secondary 2W/3W brand pickers — for cars-primary dealers who also sell those types (optional).
    const showTwoWheelers   = Boolean(data.sellsTwoWheelers);
    const showThreeWheelers = Boolean(data.sellsThreeWheelers);

    // Human-readable label of every vehicle type this dealer sells, for the header
    // badge/description. Cars (4W) is always present on this flow; 2W/3W are added
    // when selected — e.g. "Cars", "Cars & Bikes", "Cars, Bikes & Autos".
    const vehicleKinds = [
        "Cars",
        showTwoWheelers ? "Bikes" : null,
        showThreeWheelers ? "Autos" : null,
    ].filter(Boolean) as string[];
    const vehicleTypesLabel = vehicleKinds.length <= 1
        ? vehicleKinds[0]
        : `${vehicleKinds.slice(0, -1).join(", ")} & ${vehicleKinds[vehicleKinds.length - 1]}`;
    const [selectedBrands2w, setSelectedBrands2w] = useState<string[]>(data.brands2w || []);
    const [selectedBrands3w, setSelectedBrands3w] = useState<string[]>(data.brands3w || []);
    const [brand2wSearch, setBrand2wSearch] = useState("");
    const [brand3wSearch, setBrand3wSearch] = useState("");

    // Multiple branches state (1st hand / hybrid only)
    const [hasMultipleBranches, setHasMultipleBranches] = useState(data.hasMultipleBranches || false);
    const [branches, setBranches] = useState(() => getOnboardingBranchPrefill(data.branches));
    const [branchErrors, setBranchErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const nextFormData = getOnboardingContactFormPrefill(data);
        setFormData(nextFormData);
        setSiteSlug(data.slug || (nextFormData.dealershipName ? toSlug(nextFormData.dealershipName) : ""));
        setSlugEdited(Boolean(data.slug));
        setSelectedBrands(data.brands || []);
        setSelectedBrands2w(data.brands2w || []);
        setSelectedBrands3w(data.brands3w || []);
        setCyeproKey(data.cyeproApiKey ?? "");
        setHasMultipleBranches(Boolean(data.hasMultipleBranches));
        setBranches(getOnboardingBranchPrefill(data.branches));
    }, [data]);

    // Auto-generate slug from dealership name
    useEffect(() => {
        if (!slugEdited && formData.dealershipName) {
            setSiteSlug(toSlug(formData.dealershipName));
        }
        return;
    }, [formData.dealershipName, slugEdited]);

    // Debounced slug availability check
    useEffect(() => {
        if (!siteSlug) { setSlugStatus("idle"); return; }
        if (checkRef.current) clearTimeout(checkRef.current);
        setSlugStatus("checking");

        checkRef.current = setTimeout(async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            try {
                const res = await fetch(`/api/domains/check-slug?slug=${encodeURIComponent(siteSlug)}`, { signal: controller.signal });
                clearTimeout(timeoutId);
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
                clearTimeout(timeoutId);
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

    const toggleBrand2w = (brand: string) => {
        setSelectedBrands2w(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const toggleBrand3w = (brand: string) => {
        setSelectedBrands3w(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    // Scroll to and focus an element (mirrors the focus-first-error pattern used elsewhere)
    const focusElement = (el: HTMLElement | null) => {
        if (!el) return;
        requestAnimationFrame(() => {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.focus();
        });
    };

    // Given per-field errors, find and focus the first invalid field in visual order.
    // Returns true if a field was focused.
    const focusFirstError = (
        fieldErrors: Record<string, string>,
        nextBranchErrors: Record<string, string>
    ): boolean => {
        // Ordered to match the on-screen field order.
        const fieldOrder = [
            "dealershipName",
            "siteSlug",
            "location",
            "phone",
            "email",
            "gstin",
            "mapLink",
            "whatsapp",
        ];

        for (const field of fieldOrder) {
            if (!fieldErrors[field]) continue;
            const el = document.getElementById(`step1-${field}`);
            if (el) {
                focusElement(el);
                return true;
            }
        }

        // Branch errors come after the basic fields; focus the first errored branch input.
        const firstBranchKey = Object.keys(nextBranchErrors)[0];
        if (firstBranchKey) {
            const el = document.getElementById(`step1-branch-${firstBranchKey}`);
            if (el) {
                focusElement(el);
                return true;
            }
        }

        return false;
    };

    const validate = () => {
        const { errors: newErrors, branchErrors: nextBranchErrors } = validateOnboardingContactStep({
            ...formData,
            siteSlug,
            slugStatus,
            slugError,
            hasMultipleBranches,
            branches,
        });

        setBranchErrors(nextBranchErrors);
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            focusFirstError(newErrors, nextBranchErrors);
            return false;
        }
        return true;
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

        // Cyepro API key is optional — a dealer without a Cyepro CRM can still finish
        // onboarding and add the key later from dashboard Settings.

        setIsSubmitting(true);
        try {
            const fullPhone = formatOnboardingPhone(formData.phone);
            const fullWhatsapp = formData.whatsapp ? formatOnboardingPhone(formData.whatsapp) : fullPhone;

            updateData({
                dealershipName:  formData.dealershipName,
                tagline:         formData.tagline,
                location:        formData.location,
                fullAddress:     formData.fullAddress,
                mapLink:         formData.mapLink,
                yearsInBusiness: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : null,
                phone:           fullPhone,
                whatsapp:        fullWhatsapp,
                email:           formData.email.trim().toLowerCase(),
                gstin:           formData.gstin.toUpperCase(),
                slug:            siteSlug,
                cyeproApiKey:     cyeproKey.trim() || undefined,
                hasMultipleBranches: hasMultipleBranches,
                branches: hasMultipleBranches
                    ? branches.filter(b => b.city && b.address).map(b => ({
                        ...b,
                        phone: formatOnboardingPhone(b.phone || ""),
                    }))
                    : [],
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
                // Secondary 2W/3W selections (optional; only relevant when those flags are set).
                ...(showTwoWheelers   && { brands2w: selectedBrands2w }),
                ...(showThreeWheelers && { brands3w: selectedBrands3w }),
            });
            setStep(2);

            // Multi-brand or hybrid dealers → outlet details step before inventory
            const needsOutletStep = (isFirstHand || isHybrid)
                && (selectedBrands.length > 1 || isHybrid);

            if (needsOutletStep) {
                router.push("/onboarding/step-1b-outlets");
            } else if (isFirstHand) {
                router.push("/onboarding/step-2-inventory");
            } else {
                router.push("/onboarding/step-2-used");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => { setStep(1); }, [setStep]);

    const urlPrefix = USE_SUBDOMAIN ? null             : `${BASE_DOMAIN}/sites/`
    const urlSuffix = USE_SUBDOMAIN ? `.${BASE_DOMAIN}` : null

    // Build the full preview URL for the slug
    const previewUrl = siteSlug
        ? USE_SUBDOMAIN
            ? `https://${siteSlug}.${BASE_DOMAIN}`
            : `https://${BASE_DOMAIN}/sites/${siteSlug}`
        : null;

    return (
        <div className="space-y-6">
            {/* Two info cards across the top of the page */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-[#D8E0EA] bg-[#F7F9FC] p-5">
                    <h2 className="text-sm font-black text-[#071436]">Quick tips</h2>
                    <div className="mt-4 space-y-3">
                        {[
                            "Use your real business name",
                            "Add the correct city for local SEO",
                            "You can connect your own domain later",
                        ].map((tip) => (
                            <p key={tip} className="flex gap-2 text-sm font-medium leading-6 text-[#35445C]">
                                <CheckCircle className="mt-1 h-4 w-4 shrink-0 text-[#16A34A]" />
                                {tip}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg border border-[#D8E0EA] bg-white p-5 shadow-[0_14px_42px_rgba(7,20,54,0.06)]">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#155EEF]">Website URL</p>
                    <p className="mt-3 break-all text-sm font-black text-[#071436]">
                        {previewUrl || "https://kumarmotors.dealersitepro.in"}
                    </p>
                    <p className="mt-2 text-xs font-medium leading-5 text-[#62708A]">
                        This preview updates as you edit the dealership name.
                    </p>
                </div>
            </div>

        <Card className="animate-fade-in rounded-lg border-[#D8E0EA] bg-white p-0 shadow-[0_14px_42px_rgba(7,20,54,0.07)]">
            <CardHeader className="border-b border-[#E3E9F2] p-6">
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
                            ? `Hybrid Dealer — New + Pre-Owned ${vehicleTypesLabel}`
                            : isFirstHand
                                ? `1st Hand Dealer — Authorised New ${vehicleTypesLabel}`
                                : `2nd Hand Dealer — Pre-Owned ${vehicleTypesLabel}`}
                    </span>
                </div>

                <CardTitle>Tell us about your dealership</CardTitle>
                <CardDescription>
                    {isHybrid
                        ? `We'll build you a combined website showcasing both your new and pre-owned ${vehicleTypesLabel.toLowerCase()}`
                        : isFirstHand
                            ? `We'll use this to build your authorised dealership website for new ${vehicleTypesLabel.toLowerCase()}`
                            : `We'll use this to create your premium pre-owned ${vehicleTypesLabel.toLowerCase()} website`}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
                {/* Dealership Name + Location */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Input
                        id="step1-dealershipName"
                        label="Dealership Name"
                        placeholder="Kumar Motors"
                        maxLength={50}
                        value={formData.dealershipName}
                        onChange={(e) => handleChange("dealershipName", e.target.value)}
                        error={errors.dealershipName}
                        helperText={`What's your business called? (${formData.dealershipName.length}/50)`}
                        required
                    />

                    <Input
                        id="step1-location"
                        label="Location"
                        placeholder="Mumbai, Maharashtra"
                        maxLength={200}
                        value={formData.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                        error={errors.location}
                        helperText={`What city are you in? (${formData.location.length}/200)`}
                        required
                    />
                </div>

                {/* Site Name / Slug Picker — always visible when dealership name is set */}
                {(siteSlug || formData.dealershipName.trim()) && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
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
                                id="step1-siteSlug"
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
                            <div className="px-3 flex items-center gap-1.5">
                                {slugStatus === "checking"  && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                                {slugStatus === "available" && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                {(slugStatus === "taken" || slugStatus === "invalid") && <XCircle className="w-4 h-4 text-red-500" />}
                                {slugStatus === "available" && previewUrl && (
                                    <a href={previewUrl} target="_blank" rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-foreground" title="Preview site">
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {slugStatus === "available" && (
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Available! Your site will be live at this URL.
                            </p>
                        )}
                        {slugStatus === "taken" && (
                            <div className="space-y-1">
                                <p className="text-xs text-red-500 flex items-center gap-1.5">
                                    <XCircle className="w-3.5 h-3.5" />
                                    {slugError || "This site name is already taken."}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Try{" "}
                                    <button
                                        type="button"
                                        className="font-mono underline text-blue-600 hover:text-blue-700"
                                        onClick={() => { setSiteSlug(`${siteSlug}-2`); setSlugEdited(true); }}
                                    >
                                        {siteSlug}-2
                                    </button>
                                    {" "}instead
                                </p>
                            </div>
                        )}
                        {slugStatus === "invalid" && (
                            <p className="text-xs text-red-500 flex items-center gap-1.5">
                                <XCircle className="w-3.5 h-3.5" />
                                {slugError}
                            </p>
                        )}
                        {errors.siteSlug && slugStatus !== "taken" && slugStatus !== "invalid" && (
                            <p className="text-xs text-red-500">{errors.siteSlug}</p>
                        )}

                        {isFirstHand && siteSlug && (
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

                {/* Multiple Branches Section (1st Hand & Hybrid only) */}
                {showBrandPicker && (
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={hasMultipleBranches}
                                    onChange={(e) => setHasMultipleBranches(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300"
                                />
                                Do you have multiple branches/showrooms?
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">
                                Add your branch locations so customers can find all your showrooms
                            </p>
                        </div>

                        {hasMultipleBranches && (
                            <div className="space-y-3 border-t border-blue-200 dark:border-blue-900 pt-4">
                                {branches.map((branch, idx) => (
                                    <div key={idx} className="space-y-2 pb-3 border-b border-blue-200 dark:border-blue-900 last:border-b-0">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                                                Branch {idx + 1}
                                            </label>
                                            {branches.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setBranches(branches.filter((_, i) => i !== idx))}
                                                    className="text-xs text-red-500 hover:text-red-700"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <input
                                                    id={`step1-branch-${idx}-city`}
                                                    type="text"
                                                    placeholder="City *"
                                                    maxLength={50}
                                                    value={branch.city}
                                                    onChange={(e) => {
                                                        const newBranches = [...branches];
                                                        newBranches[idx] = { ...newBranches[idx], city: e.target.value };
                                                        setBranches(newBranches);
                                                    }}
                                                    className={cn(
                                                        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                                        branchErrors[`${idx}-city`] && "border-red-500"
                                                    )}
                                                />
                                                {branchErrors[`${idx}-city`] && <p className="text-xs text-red-500 mt-1">{branchErrors[`${idx}-city`]}</p>}
                                            </div>
                                            <div>
                                                <input
                                                    id={`step1-branch-${idx}-state`}
                                                    type="text"
                                                    placeholder="State *"
                                                    maxLength={50}
                                                    value={branch.state || ""}
                                                    onChange={(e) => {
                                                        const newBranches = [...branches];
                                                        newBranches[idx] = { ...newBranches[idx], state: e.target.value };
                                                        setBranches(newBranches);
                                                    }}
                                                    className={cn(
                                                        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                                        branchErrors[`${idx}-state`] && "border-red-500"
                                                    )}
                                                />
                                                {branchErrors[`${idx}-state`] && <p className="text-xs text-red-500 mt-1">{branchErrors[`${idx}-state`]}</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <textarea
                                                id={`step1-branch-${idx}-address`}
                                                placeholder="Full address * (e.g., 123 Main St, Mumbai, MH 400001)"
                                                maxLength={150}
                                                value={branch.address}
                                                onChange={(e) => {
                                                    const newBranches = [...branches];
                                                    newBranches[idx] = { ...newBranches[idx], address: e.target.value };
                                                    setBranches(newBranches);
                                                }}
                                                className={cn(
                                                    "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground min-h-[60px] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                                    branchErrors[`${idx}-address`] && "border-red-500"
                                                )}
                                            />
                                            <div className="flex justify-between mt-1">
                                                {branchErrors[`${idx}-address`]
                                                    ? <p className="text-xs text-red-500">{branchErrors[`${idx}-address`]}</p>
                                                    : <span />}
                                                <p className="text-xs text-muted-foreground">{(branch.address || "").length}/150</p>
                                            </div>
                                        </div>
                                        <div>
                                            <PhoneInput
                                                id={`step1-branch-${idx}-phone`}
                                                value={branch.phone || ""}
                                                countryCode={branch.phoneCountryCode || "+91"}
                                                onValueChange={(v) => {
                                                    const newBranches = [...branches];
                                                    newBranches[idx] = { ...newBranches[idx], phone: v };
                                                    setBranches(newBranches);
                                                }}
                                                onCountryCodeChange={(c) => {
                                                    const newBranches = [...branches];
                                                    newBranches[idx] = { ...newBranches[idx], phoneCountryCode: c };
                                                    setBranches(newBranches);
                                                }}
                                                error={branchErrors[`${idx}-phone`]}
                                                required
                                                lockCountryCode
                                            />
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => setBranches([...branches, { city: "", state: "", address: "", phone: "", phoneCountryCode: "+91" }])}
                                    className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium py-2 border border-dashed border-blue-300 dark:border-blue-600 rounded-md"
                                >
                                    + Add Another Branch
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Phone Number + Email */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Phone Number with country code */}
                    <PhoneInput
                        id="step1-phone"
                        label="Phone Number"
                        value={formData.phone}
                        countryCode={formData.phoneCountryCode}
                        onValueChange={v => handleChange("phone", v)}
                        onCountryCodeChange={c => setFormData(prev => ({ ...prev, phoneCountryCode: c }))}
                        error={errors.phone}
                        required
                        lockCountryCode
                    />

                    <Input
                        id="step1-email"
                        label="Email"
                        placeholder="info@kumarmotors.in"
                        type="email"
                        maxLength={100}
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        error={errors.email}
                        required
                    />
                </div>

                {/* Years in Business + GSTIN */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Input
                        label="Years in Business"
                        placeholder="10"
                        type="text"
                        inputMode="numeric"
                        maxLength={3}
                        value={formData.yearsInBusiness}
                        onChange={(e) => handleChange("yearsInBusiness", e.target.value.replace(/\D/g, "").slice(0, 3))}
                        helperText="How long have you been open? (Leave blank if new)"
                    />
                    <Input
                        id="step1-gstin"
                        label="GSTIN (Optional)"
                        placeholder="22AAAAA0000A1Z5"
                        maxLength={15}
                        value={formData.gstin}
                        onChange={(e) => handleChange("gstin", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15))}
                        error={errors.gstin}
                        helperText="15 alphanumeric characters"
                    />
                </div>

                {/* Tagline + WhatsApp */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Input
                        label="Tagline (Optional)"
                        placeholder="Driven by Trust"
                        maxLength={50}
                        value={formData.tagline}
                        onChange={(e) => handleChange("tagline", e.target.value)}
                        helperText={`A short slogan (${formData.tagline.length}/50)`}
                    />
                    {/* WhatsApp Number with country code */}
                    <PhoneInput
                        id="step1-whatsapp"
                        label="WhatsApp Number (Optional)"
                        value={formData.whatsapp}
                        countryCode={formData.whatsappCountryCode}
                        onValueChange={v => handleChange("whatsapp", v)}
                        onCountryCodeChange={c => setFormData(prev => ({ ...prev, whatsappCountryCode: c }))}
                        error={errors.whatsapp}
                        helperText="For instant chat button on site"
                        lockCountryCode
                    />
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-foreground">
                            Full Address (Optional)
                        </label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="123 Main Street, Industrial Area, City, State - Pin Code"
                            value={formData.fullAddress}
                            onChange={(e) => handleChange("fullAddress", e.target.value)}
                        />
                        <p className="text-[0.8rem] text-muted-foreground">
                            Displayed in the footer and contact page.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Input
                            id="step1-mapLink"
                            label="Google Maps Link (Optional)"
                            placeholder="https://www.google.com/maps/place/Your+Dealership/..."
                            value={formData.mapLink}
                            onChange={(e) => handleChange("mapLink", e.target.value)}
                            error={errors.mapLink}
                            helperText="This embeds an interactive map on your website's contact page"
                        />
                        <details className="text-xs text-muted-foreground">
                            <summary className="cursor-pointer font-medium text-foreground hover:underline">How to get your Google Maps link?</summary>
                            <ol className="mt-2 space-y-1 list-decimal list-inside pl-1">
                                <li>Open <strong>Google Maps</strong> on your phone or computer</li>
                                <li>Search for your <strong>dealership name</strong></li>
                                <li>Tap/click on your business listing</li>
                                <li>Tap the <strong>Share</strong> button</li>
                                <li>Select <strong>Copy link</strong> and paste it here</li>
                            </ol>
                            <p className="mt-2 font-mono text-[10px] bg-slate-100 dark:bg-slate-800 rounded px-2 py-1 break-all">e.g. https://www.google.com/maps/place/Bharat+-+Hyundai+Showroom+Gachibowli/@17.4318917,78.3253504,15z/</p>
                        </details>
                    </div>
                </div>

                {/* ── Cyepro CRM key for new/hybrid 4W dealers ─────────────── */}
                {showBrandPicker && (
                    <div id="cyepro-section" className="rounded-xl border border-blue-200 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/20 p-4 space-y-3">
                        <div>
                            <label className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                Cyepro API Key <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">
                                This key sends generated website leads to the dealer&apos;s specific Cyepro CRM account. You can add or update it later from Settings.
                            </p>
                        </div>
                        <div className="relative">
                            <input
                                id="step1-cyeproKey"
                                type={showCyeproKey ? "text" : "password"}
                                value={cyeproKey}
                                onChange={(e) => {
                                    setCyeproKey(e.target.value);
                                    setCyeproError("");
                                }}
                                placeholder="Paste your Cyepro API key here"
                                className={cn(
                                    "w-full px-3 py-2 pr-10 text-sm font-mono rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring",
                                    cyeproError ? "border-red-500" : "border-input"
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCyeproKey(v => !v)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showCyeproKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {cyeproError && (
                            <p className="text-xs text-red-500 flex items-center gap-1.5">
                                <XCircle className="w-3.5 h-3.5" />
                                {cyeproError}
                            </p>
                        )}
                    </div>
                )}

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

                {/* ── Secondary 2W Brand Selection (cars-primary dealer who also sells 2W) ── */}
                {showBrandPicker && showTwoWheelers && (
                    <div id="brand-section-2w" className="border-t border-border pt-6 space-y-4">
                        <div>
                            <h3 className="text-base font-semibold flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-600">
                                    2W
                                </span>
                                Which two-wheeler brands do you sell?
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Optional — select any two-wheeler brands you also sell
                            </p>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search brands..."
                                value={brand2wSearch}
                                onChange={e => setBrand2wSearch(e.target.value)}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {TWO_WHEELER_BRANDS
                                .filter(b => b.brand.toLowerCase().includes(brand2wSearch.toLowerCase()))
                                .map(brand => {
                                    const selected = selectedBrands2w.includes(brand.brand);
                                    const initials = brand.brand.split(" ").map((w: string) => w[0]).join("").substring(0, 2).toUpperCase();
                                    return (
                                        <button key={brand.brandId} type="button" onClick={() => toggleBrand2w(brand.brand)}
                                            className={cn("p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all hover:bg-accent relative",
                                                selected ? "border-indigo-500 bg-indigo-500/5" : "border-input"
                                            )}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={logoSrc(brand.brandId)} alt={brand.brand} className="w-10 h-10 object-contain rounded-lg bg-white border border-slate-200 dark:border-slate-700 p-1"
                                                onError={e => {
                                                    e.currentTarget.style.display = "none";
                                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                                                    if (fallback) fallback.style.display = "flex";
                                                }} />
                                            <span className="w-10 h-10 rounded-full bg-muted text-muted-foreground text-xs font-bold items-center justify-center hidden">{initials}</span>
                                            <span className="text-xs font-medium text-center leading-tight">{brand.brand}</span>
                                            {selected && <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                                        </button>
                                    );
                                })}
                        </div>

                        {selectedBrands2w.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                                Selected:{" "}
                                <strong className="text-foreground">
                                    {selectedBrands2w.length} brand{selectedBrands2w.length > 1 ? "s" : ""}
                                </strong>
                                {selectedBrands2w.length <= 3 && (
                                    <span> ({selectedBrands2w.join(", ")})</span>
                                )}
                            </p>
                        )}
                    </div>
                )}

                {/* ── Secondary 3W Brand Selection (cars-primary dealer who also sells 3W) ── */}
                {showBrandPicker && showThreeWheelers && (
                    <div id="brand-section-3w" className="border-t border-border pt-6 space-y-4">
                        <div>
                            <h3 className="text-base font-semibold flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-green-500/10 border border-green-500/20 text-green-600">
                                    3W
                                </span>
                                Which three-wheeler brands do you sell?
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Optional — select any three-wheeler brands you also sell
                            </p>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search brands..."
                                value={brand3wSearch}
                                onChange={e => setBrand3wSearch(e.target.value)}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {THREE_WHEELER_BRANDS
                                .filter(b => b.brand.toLowerCase().includes(brand3wSearch.toLowerCase()))
                                .map(brand => {
                                    const selected = selectedBrands3w.includes(brand.brand);
                                    const initials = brand.brand.split(" ").map((w: string) => w[0]).join("").substring(0, 2).toUpperCase();
                                    return (
                                        <button key={brand.brandId} type="button" onClick={() => toggleBrand3w(brand.brand)}
                                            className={cn("p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all hover:bg-accent relative",
                                                selected ? "border-green-500 bg-green-500/5" : "border-input"
                                            )}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={logoSrc(brand.brandId)} alt={brand.brand} className="w-10 h-10 object-contain rounded-lg bg-white border border-slate-200 dark:border-slate-700 p-1"
                                                onError={e => {
                                                    e.currentTarget.style.display = "none";
                                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                                                    if (fallback) fallback.style.display = "flex";
                                                }} />
                                            <span className="w-10 h-10 rounded-full bg-muted text-muted-foreground text-xs font-bold items-center justify-center hidden">{initials}</span>
                                            <span className="text-xs font-medium text-center leading-tight">{brand.brand}</span>
                                            {selected && <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                                        </button>
                                    );
                                })}
                        </div>

                        {selectedBrands3w.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                                Selected:{" "}
                                <strong className="text-foreground">
                                    {selectedBrands3w.length} brand{selectedBrands3w.length > 1 ? "s" : ""}
                                </strong>
                                {selectedBrands3w.length <= 3 && (
                                    <span> ({selectedBrands3w.join(", ")})</span>
                                )}
                            </p>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="justify-between px-6 pb-6">
                <Button variant="outline" type="button" onClick={() => router.push("/onboarding")} className="border-[#D8E0EA]">
                    Back
                </Button>
                <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting || slugStatus === "checking" || slugStatus === "taken" || slugStatus === "invalid"}
                    className="bg-[#155EEF] font-black text-white hover:bg-[#0F4FD3]"
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
        </div>
    );
}

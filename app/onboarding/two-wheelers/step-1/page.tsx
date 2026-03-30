"use client"
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle, XCircle, Globe, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { BASE_DOMAIN, USE_SUBDOMAIN } from "@/lib/utils/domain";
import brandData from "@/lib/data/brand-models.json";

function toSlug(value: string) {
    return value.toLowerCase().trim()
        .replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-').replace(/^-+|-+$/g, '').substring(0, 63);
}

const LOGO_EXT: Record<string, string> = {
    "hop-electric": "svg", "okinawa-autotech": "webp",
};
function logoSrc(brandId: string) {
    return `/data/brand-logos/${brandId}.${LOGO_EXT[brandId] ?? "png"}`;
}

type BrandEntry = { brandId: string; brand: string; electric: boolean };

const TWO_WHEELER_BRANDS: BrandEntry[] = [
    ...(brandData.twoWheelers.traditional as { brandId: string; brand: string }[]).map(b => ({ ...b, electric: false })),
    ...(brandData.twoWheelers.electric    as { brandId: string; brand: string }[]).map(b => ({ ...b, electric: true  })),
];

export default function TwoWheelerStep1Page() {
    const router = useRouter();
    const { data, updateData, setStep } = useOnboardingStore();

    const isNewDealer  = data.dealerCategory === 'new';
    const isHybrid     = data.dealerCategory === 'both';
    const showBrands   = isNewDealer || isHybrid;

    const [formData, setFormData] = useState({
        dealershipName:  data.dealershipName  || "",
        tagline:         data.tagline         || "",
        location:        data.location        || "",
        fullAddress:     data.fullAddress     || "",
        mapLink:         data.mapLink         || "",
        yearsInBusiness: data.yearsInBusiness?.toString() || "",
        phone:           data.phone           || "",
        whatsapp:        data.whatsapp        || "",
        email:           data.email           || "",
        gstin:           data.gstin           || "",
    });

    const [errors,       setErrors]       = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [siteSlug,   setSiteSlug]   = useState(data.slug || "");
    const [slugEdited, setSlugEdited] = useState(false);
    const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
    const [slugError,  setSlugError]  = useState("");
    const checkRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [selectedBrands, setSelectedBrands] = useState<string[]>(
        (data.brands as string[]) || []
    );
    const [brandError,  setBrandError]  = useState("");
    const [brandSearch, setBrandSearch] = useState("");

    useEffect(() => {
        if (!slugEdited && formData.dealershipName) {
            setSiteSlug(toSlug(formData.dealershipName));
        }
    }, [formData.dealershipName, slugEdited]);

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
                    setSlugStatus("invalid"); setSlugError(result.error || "Invalid site name");
                } else {
                    setSlugStatus(result.available ? "available" : "taken");
                    setSlugError(result.message || "");
                }
            } catch { setSlugStatus("idle"); }
        }, 600);
        return () => { if (checkRef.current) clearTimeout(checkRef.current); };
    }, [siteSlug]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
        setBrandError("");
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!formData.dealershipName.trim()) e.dealershipName = "Dealership name is required";
        if (!formData.location.trim())       e.location       = "Location is required";
        if (!formData.phone.trim())          e.phone          = "Phone number is required";
        if (!formData.email.trim())          e.email          = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Please enter a valid email";
        if (!siteSlug)                       e.siteSlug       = "Site name is required";
        if (slugStatus === "taken")          e.siteSlug       = "This site name is already taken";
        if (slugStatus === "invalid")        e.siteSlug       = slugError;
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = async () => {
        if (!validate()) return;
        if (slugStatus === "checking") return;
        if (showBrands && selectedBrands.length === 0) {
            setBrandError("Please select at least one brand you sell");
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                brands:          selectedBrands as any,
            });
            setStep(2);
            router.push("/onboarding/two-wheelers/step-2");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => { setStep(1); }, [setStep]);

    const urlPrefix = USE_SUBDOMAIN ? null             : `${BASE_DOMAIN}/sites/`;
    const urlSuffix = USE_SUBDOMAIN ? `.${BASE_DOMAIN}` : null;

    const dealerLabel = isHybrid ? "New + Used 2W Dealer"
        : isNewDealer  ? "New Bike Dealer"
        : "Pre-Owned Bike Dealer";

    return (
        <Card className="animate-fade-in">
            <CardHeader>
                <div className="mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border bg-orange-500/10 text-orange-700 border-orange-500/20">
                        🏍️ {dealerLabel}
                    </span>
                </div>
                <CardTitle>Tell us about your dealership</CardTitle>
                <CardDescription>
                    We&apos;ll use this to build your two-wheeler dealership website.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <Input
                    label="Dealership Name"
                    placeholder="Kumar Bikes"
                    value={formData.dealershipName}
                    onChange={(e) => handleChange("dealershipName", e.target.value)}
                    error={errors.dealershipName}
                    helperText="What's your business called?"
                    required
                />

                {/* Slug Picker */}
                {siteSlug && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Your Site URL
                        </label>
                        <div className={cn(
                            "flex items-center rounded-xl border-2 overflow-hidden transition-colors",
                            slugStatus === "available" ? "border-emerald-500/40 bg-emerald-500/5" :
                            slugStatus === "taken"     ? "border-red-500/40 bg-red-500/5"         :
                            slugStatus === "invalid"   ? "border-red-500/40 bg-red-500/5"         :
                                                         "border-border bg-muted/30"
                        )}>
                            {urlPrefix && (
                                <span className="px-3 py-2.5 text-sm text-muted-foreground bg-muted/50 border-r border-border whitespace-nowrap select-none">
                                    {urlPrefix}
                                </span>
                            )}
                            <input
                                type="text"
                                value={siteSlug}
                                onChange={(e) => { setSiteSlug(toSlug(e.target.value)); setSlugEdited(true); }}
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
                    placeholder="5"
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
                    placeholder="info@kumarbikes.in"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    error={errors.email}
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Tagline (Optional)"
                        placeholder="Ride Your Dream"
                        value={formData.tagline}
                        onChange={(e) => handleChange("tagline", e.target.value)}
                    />
                    <Input
                        label="GSTIN (Optional)"
                        placeholder="22AAAAA0000A1Z5"
                        value={formData.gstin}
                        onChange={(e) => handleChange("gstin", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-gray-700 dark:text-gray-200">
                        Full Address (Optional)
                    </label>
                    <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="123 Main Street, Industrial Area, City, State - Pin Code"
                        value={formData.fullAddress}
                        onChange={(e) => handleChange("fullAddress", e.target.value)}
                    />
                </div>

                <Input
                    label="Google Maps Link (Optional)"
                    placeholder="https://maps.google.com/..."
                    value={formData.mapLink}
                    onChange={(e) => handleChange("mapLink", e.target.value)}
                    helperText="Paste your location's share link here"
                />

                <Input
                    label="WhatsApp Number (Optional)"
                    placeholder="Same as phone"
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => handleChange("whatsapp", e.target.value)}
                    helperText="For instant chat button on site"
                />

                {/* Brand picker — for new and hybrid dealers */}
                {showBrands && (
                    <div id="brand-section" className="border-t border-border pt-6 space-y-4">
                        <div>
                            <h3 className="text-base font-semibold flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-orange-500/10 border border-orange-500/20 text-orange-600">
                                    OEM
                                </span>
                                Which two-wheeler brands do you sell?
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Select all brands you are authorised to sell
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search brands..."
                                value={brandSearch}
                                onChange={e => setBrandSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        {/* ICE Brands */}
                        {(() => {
                            const iceFiltered = TWO_WHEELER_BRANDS.filter(b => !b.electric && b.brand.toLowerCase().includes(brandSearch.toLowerCase()));
                            const evFiltered  = TWO_WHEELER_BRANDS.filter(b =>  b.electric && b.brand.toLowerCase().includes(brandSearch.toLowerCase()));
                            return (
                                <>
                                    {iceFiltered.length > 0 && (
                                        <>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Conventional (ICE)</p>
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                {iceFiltered.map(brand => {
                                                    const selected = selectedBrands.includes(brand.brand);
                                                    const initials = brand.brand.split(" ").map((w: string) => w[0]).join("").substring(0, 2).toUpperCase();
                                                    return (
                                                        <button key={brand.brandId} type="button" onClick={() => toggleBrand(brand.brand)}
                                                            className={cn("p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all hover:bg-accent relative",
                                                                selected ? "border-orange-500 bg-orange-500/5" : "border-input"
                                                            )}>
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={logoSrc(brand.brandId)} alt={brand.brand} className="w-10 h-10 object-contain"
                                                                onError={e => { e.currentTarget.style.display = "none"; (e.currentTarget.nextElementSibling as HTMLElement | null)?.style && ((e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex"); }} />
                                                            <span className="w-10 h-10 rounded-full bg-muted text-muted-foreground text-xs font-bold items-center justify-center hidden">{initials}</span>
                                                            <span className="text-xs font-medium text-center leading-tight">{brand.brand}</span>
                                                            {selected && <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                    {evFiltered.length > 0 && (
                                        <>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">⚡ Electric</p>
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                {evFiltered.map(brand => {
                                                    const selected = selectedBrands.includes(brand.brand);
                                                    const initials = brand.brand.split(" ").map((w: string) => w[0]).join("").substring(0, 2).toUpperCase();
                                                    return (
                                                        <button key={brand.brandId} type="button" onClick={() => toggleBrand(brand.brand)}
                                                            className={cn("p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all hover:bg-accent relative",
                                                                selected ? "border-orange-500 bg-orange-500/5" : "border-input"
                                                            )}>
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={logoSrc(brand.brandId)} alt={brand.brand} className="w-10 h-10 object-contain"
                                                                onError={e => { e.currentTarget.style.display = "none"; (e.currentTarget.nextElementSibling as HTMLElement | null)?.style && ((e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex"); }} />
                                                            <span className="w-10 h-10 rounded-full bg-muted text-muted-foreground text-xs font-bold items-center justify-center hidden">{initials}</span>
                                                            <span className="text-xs font-medium text-center leading-tight">{brand.brand}</span>
                                                            {selected && <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                </>
                            );
                        })()}

                        {selectedBrands.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                                Selected:{" "}
                                <strong className="text-foreground">
                                    {selectedBrands.length} brand{selectedBrands.length > 1 ? "s" : ""}
                                </strong>
                                {selectedBrands.length <= 3 && (
                                    <span> ({selectedBrands.join(", ")})</span>
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

            <CardFooter className="justify-between">
                <Button variant="ghost" onClick={() => router.push("/onboarding/two-wheelers")}>
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={isSubmitting || slugStatus === "checking" || slugStatus === "taken" || slugStatus === "invalid"}
                >
                    {isSubmitting || slugStatus === "checking" ? (
                        <>
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            {slugStatus === "checking" ? "Checking..." : "Saving..."}
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

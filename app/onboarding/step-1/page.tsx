"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";

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
    const [isCreatingSubdomain, setIsCreatingSubdomain] = useState(false);
    const [subdomainPreview, setSubdomainPreview] = useState("");

    // Preview subdomain as user types
    useEffect(() => {
        if (formData.dealershipName) {
            const preview = formData.dealershipName
                .toLowerCase()
                .trim()
                .replace(/[\s_]+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-')
                .replace(/^-+|-+$/g, '')
                .substring(0, 63);
            setSubdomainPreview(preview ? `${preview}.dealersitepro.com` : "");
        } else {
            setSubdomainPreview("");
        }
    }, [formData.dealershipName]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.dealershipName.trim()) {
            newErrors.dealershipName = "Dealership name is required";
        }
        if (!formData.location.trim()) {
            newErrors.location = "Location is required";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (validate()) {
            setIsCreatingSubdomain(true);

            try {
                // Save form data to store
                updateData({
                    dealershipName: formData.dealershipName,
                    tagline: formData.tagline,
                    location: formData.location,
                    fullAddress: formData.fullAddress,
                    mapLink: formData.mapLink,
                    yearsInBusiness: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : null,
                    phone: formData.phone,
                    whatsapp: formData.whatsapp || formData.phone, // Default to phone if empty
                    email: formData.email,
                    gstin: formData.gstin,
                });

                // Create subdomain
                // TODO: Replace with actual dealer ID from authentication
                const tempDealerId = `temp-${Date.now()}`;

                const response = await fetch('/api/domains/create-subdomain', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dealerId: tempDealerId,
                        businessName: formData.dealershipName,
                        city: formData.location
                    })
                });

                // Check if response is JSON before parsing
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const result = await response.json();

                    if (result.success && result.domain) {
                        // Store subdomain in onboarding data
                        updateData({
                            subdomain: result.domain.domain,
                            slug: result.domain.slug
                        });
                    }
                }
                // If not JSON response, Supabase isn't configured - skip subdomain creation

            } catch (error) {
                console.log('Subdomain creation skipped - Supabase not configured');
                // Continue anyway
            } finally {
                setIsCreatingSubdomain(false);
            }

            // Always proceed to next step
            setStep(2);
            router.push("/onboarding/step-2");
        }
    };

    useEffect(() => {
        setStep(1);
    }, [setStep]);

    return (
        <Card className="animate-fade-in">
            <CardHeader>
                <CardTitle>Tell us about your dealership</CardTitle>
                <CardDescription>
                    We'll use this information to create your personalized website
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <Input
                    label="Dealership Name"
                    placeholder="ABC Motors"
                    value={formData.dealershipName}
                    onChange={(e) => handleChange("dealershipName", e.target.value)}
                    error={errors.dealershipName}
                    helperText="What's your business called?"
                    required
                />

                {subdomainPreview && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-blue-900 mb-1">
                                    Your free website URL:
                                </p>
                                <p className="text-lg font-mono font-bold text-blue-600">
                                    {subdomainPreview}
                                </p>
                                <p className="text-xs text-blue-700 mt-1">
                                    ✨ Free forever • SSL included • Live instantly
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <Input
                    label="Location"
                    placeholder="Atlanta, GA"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    error={errors.location}
                    helperText="What city are you in?"
                    required
                />

                <Input
                    label="Years in Business"
                    placeholder="25"
                    type="number"
                    value={formData.yearsInBusiness}
                    onChange={(e) => handleChange("yearsInBusiness", e.target.value)}
                    helperText="How long have you been open? (Leave blank if new)"
                />

                <Input
                    label="Phone Number"
                    placeholder="(555) 123-4567"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    error={errors.phone}
                    required
                />

                <Input
                    label="Email"
                    placeholder="info@abcmotors.com"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    error={errors.email}
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Tagline (Optional)"
                        placeholder="e.g. Driven by Trust"
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
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                <Button onClick={handleNext} disabled={isCreatingSubdomain}>
                    {isCreatingSubdomain ? (
                        <>
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            Creating your website...
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

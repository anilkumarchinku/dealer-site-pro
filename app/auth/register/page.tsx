"use client"
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { PhoneInput, validatePhone } from "@/components/ui/phone-input";
import { Loader2, AlertCircle, CheckCircle, Mail } from "lucide-react";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
    const { updateData, reset } = useOnboardingStore();

    const [form, setForm] = useState({
        fullName: "",
        mobileNumber: "",
        mobileCountryCode: "+91",
        dealershipName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    const [consentGiven, setConsentGiven] = useState(false);

    const update = (field: string, value: string) =>
        setForm(prev => ({ ...prev, [field]: value }));

    const validate = (): string | null => {
        if (!form.fullName.trim()) return "Full name is required";
        if (!form.mobileNumber.trim()) return "Mobile number is required";
        const phoneCheck = validatePhone(form.mobileNumber, form.mobileCountryCode);
        if (!phoneCheck.valid) return phoneCheck.error!;
        if (!form.dealershipName.trim()) return "Dealership name is required";
        if (!form.email.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email address";
        if (!form.password) return "Password is required";
        if (form.password.length < 20) return "Password must be at least 20 characters";
        if (form.password !== form.confirmPassword) return "Passwords do not match";
        if (!consentGiven) return "Please agree to the Privacy Policy and Terms of Service to continue";
        return null;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) { setError(validationError); return; }

        setLoading(true);
        try {
            const fullPhone = `${form.mobileCountryCode}${form.mobileNumber.replace(/\D/g, "")}`;

            reset();
            updateData({
                dealershipName: form.dealershipName.trim(),
                phone: fullPhone,
                email: form.email.trim().toLowerCase(),
            });

            const { error: authError } = await supabase.auth.signUp({
                email: form.email.trim().toLowerCase(),
                password: form.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/login`,
                    data: {
                        full_name: form.fullName.trim(),
                        phone: fullPhone,
                        dealership_name: form.dealershipName.trim(),
                    },
                },
            });

            if (authError) {
                setError(authError.message);
                return;
            }

            setSent(true);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">Create your account</CardTitle>
                <CardDescription>Set up your dealership in minutes — it&apos;s free</CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
                {sent ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-600 dark:text-emerald-400">
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            <span>Verification email sent to <strong>{form.email}</strong></span>
                        </div>

                        <div className="text-center space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Please check your email and click the verification link.
                                Once verified, you can{" "}
                                <Link href="/auth/login" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                    log in with your email and password
                                </Link>.
                            </p>

                            <button
                                type="button"
                                onClick={() => { setSent(false); setError(null); }}
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                Didn&apos;t receive it?{" "}
                                <span className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Try again</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                placeholder="Please enter the full name"
                                maxLength={50}
                                value={form.fullName}
                                onChange={e => update("fullName", e.target.value)}
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground">{form.fullName.length}/50 characters</p>
                        </div>

                        {/* Mobile Number */}
                        <PhoneInput
                            id="mobile"
                            label="Mobile Number"
                            value={form.mobileNumber}
                            countryCode={form.mobileCountryCode}
                            onValueChange={v => update("mobileNumber", v)}
                            onCountryCodeChange={c => update("mobileCountryCode", c)}
                            disabled={loading}
                            required
                        />

                        {/* Dealership Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="dealership">Dealership Name</Label>
                            <Input
                                id="dealership"
                                placeholder="Raj Motors"
                                maxLength={50}
                                value={form.dealershipName}
                                onChange={e => update("dealershipName", e.target.value)}
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground">{form.dealershipName.length}/50 characters</p>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Business Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="rajesh@rajmotors.in"
                                maxLength={100}
                                value={form.email}
                                onChange={e => update("email", e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <PasswordInput
                                id="password"
                                placeholder="Min 20 characters"
                                minLength={20}
                                maxLength={128}
                                value={form.password}
                                onChange={e => update("password", e.target.value)}
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground">Use letters, numbers, and special characters</p>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <PasswordInput
                                id="confirmPassword"
                                placeholder="Re-enter password"
                                minLength={20}
                                maxLength={128}
                                value={form.confirmPassword}
                                onChange={e => update("confirmPassword", e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-600 dark:text-red-400">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            size="lg"
                            disabled={loading || !consentGiven}
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account…</>
                            ) : (
                                <><Mail className="w-4 h-4 mr-2" /> Create Account</>
                            )}
                        </Button>

                        {/* DPDP Act consent checkbox */}
                        <div className="flex items-start gap-2.5">
                            <input
                                id="consent"
                                type="checkbox"
                                checked={consentGiven}
                                onChange={e => setConsentGiven(e.target.checked)}
                                disabled={loading}
                                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-input accent-blue-600"
                            />
                            <label htmlFor="consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                                I agree to the{" "}
                                <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</Link>
                                {" "}and{" "}
                                <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>.
                                {" "}I consent to DealerSite Pro processing my personal data as described therein (DPDP Act, 2023).
                            </label>
                        </div>

                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}

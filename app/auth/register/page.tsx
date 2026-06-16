"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, CheckCircle, Loader2, Mail } from "lucide-react";

import { BrowserFrame, FlowTopBar, SecurityPanel } from "@/components/onboarding/flow-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
    formatRegistrationPhone,
    REGISTRATION_PASSWORD_MIN_LENGTH,
    validateRegistrationMobileNumber,
} from "@/lib/services/registration-availability-service";
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

    const update = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const validate = (): string | null => {
        if (!form.fullName.trim()) return "Full name is required";
        const phoneError = validateRegistrationMobileNumber(form.mobileNumber);
        if (phoneError) return phoneError;
        if (!form.dealershipName.trim()) return "Dealership name is required";
        if (!form.email.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email address";
        if (!form.password) return "Password is required";
        if (form.password.length < REGISTRATION_PASSWORD_MIN_LENGTH) {
            return `Password must be at least ${REGISTRATION_PASSWORD_MIN_LENGTH} characters`;
        }
        if (form.password !== form.confirmPassword) return "Passwords do not match";
        if (!consentGiven) return "Please agree to the Privacy Policy and Terms of Service to continue";
        return null;
    };

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const email = form.email.trim().toLowerCase();
            const fullPhone = formatRegistrationPhone(form.mobileNumber);

            const availabilityResponse = await fetch("/api/auth/registration-availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    mobileNumber: form.mobileNumber,
                }),
            });
            const availability = await availabilityResponse.json().catch(() => null) as { error?: string } | null;

            if (!availabilityResponse.ok) {
                setError(availability?.error ?? "Could not validate registration details. Please try again.");
                return;
            }

            reset();
            updateData({
                dealershipName: form.dealershipName.trim(),
                phone: fullPhone,
                email,
            });

            const { error: authError } = await supabase.auth.signUp({
                email,
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
                if (/already|registered|exists/i.test(authError.message)) {
                    setError("This email is already registered. Please login instead.");
                } else {
                    setError(authError.message);
                }
                return;
            }

            setSent(true);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <BrowserFrame className="min-h-screen w-full max-w-none rounded-none border-0 shadow-none" contentClassName="bg-white">
            <FlowTopBar />
            <div className="grid lg:grid-cols-[390px_1fr]">
                <div className="hidden lg:block">
                    <SecurityPanel />
                </div>

                <div className="px-5 py-8 sm:px-10 lg:px-12">
                    <div className="mx-auto max-w-xl">
                        <div className="mb-7">
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#155EEF]">02 Register</p>
                            <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#071436]">
                                Create your account
                            </h1>
                            <p className="mt-2 text-sm font-medium leading-6 text-[#62708A]">
                                Start building your dealership website today.
                            </p>
                        </div>

                        {sent ? (
                            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
                                <div className="flex items-center gap-3 text-sm font-semibold text-emerald-700">
                                    <CheckCircle className="h-5 w-5 shrink-0" />
                                    Verification email sent to <strong>{form.email}</strong>
                                </div>
                                <p className="mt-4 text-sm leading-6 text-[#35445C]">
                                    Please check your email and click the verification link. Once verified, you can{" "}
                                    <Link href="/auth/login" className="font-black text-[#155EEF] hover:underline">
                                        log in with your email and password
                                    </Link>.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => { setSent(false); setError(null); }}
                                    className="mt-4 text-sm font-black text-[#155EEF] hover:underline"
                                >
                                    Did not receive it? Try again
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-4">
                                <Input
                                    label="Full Name"
                                    id="fullName"
                                    placeholder="Raj Kumar"
                                    maxLength={50}
                                    value={form.fullName}
                                    onChange={(event) => update("fullName", event.target.value)}
                                    disabled={loading}
                                    appearance="light"
                                />

                                <PhoneInput
                                    id="mobile"
                                    label="Mobile Number"
                                    value={form.mobileNumber}
                                    countryCode={form.mobileCountryCode}
                                    onValueChange={(value) => update("mobileNumber", value)}
                                    onCountryCodeChange={(code) => update("mobileCountryCode", code)}
                                    helperText="10 digits only"
                                    disabled={loading}
                                    required
                                    lockCountryCode
                                />

                                <Input
                                    label="Dealership Name"
                                    id="dealership"
                                    placeholder="Kumar Motors"
                                    maxLength={50}
                                    value={form.dealershipName}
                                    onChange={(event) => update("dealershipName", event.target.value)}
                                    disabled={loading}
                                    appearance="light"
                                />

                                <Input
                                    label="Business Email"
                                    id="email"
                                    type="email"
                                    placeholder="raj.kumar@kumarmotors.in"
                                    maxLength={100}
                                    value={form.email}
                                    onChange={(event) => update("email", event.target.value)}
                                    disabled={loading}
                                    appearance="light"
                                />

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="password">Password</Label>
                                        <PasswordInput
                                            id="password"
                                            placeholder={`Min ${REGISTRATION_PASSWORD_MIN_LENGTH} characters`}
                                            minLength={REGISTRATION_PASSWORD_MIN_LENGTH}
                                            maxLength={128}
                                            value={form.password}
                                            onChange={(event) => update("password", event.target.value)}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <PasswordInput
                                            id="confirmPassword"
                                            placeholder="Re-enter password"
                                            minLength={REGISTRATION_PASSWORD_MIN_LENGTH}
                                            maxLength={128}
                                            value={form.confirmPassword}
                                            onChange={(event) => update("confirmPassword", event.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2 text-xs font-semibold text-[#35445C] sm:grid-cols-3">
                                    <span className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-[#16A34A]" /> 8+ characters</span>
                                    <span className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-[#16A34A]" /> 1 number</span>
                                    <span className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-[#16A34A]" /> 1 special character</span>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="flex items-start gap-2.5">
                                    <input
                                        id="consent"
                                        type="checkbox"
                                        checked={consentGiven}
                                        onChange={(event) => setConsentGiven(event.target.checked)}
                                        disabled={loading}
                                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-[#CAD5E2] accent-[#155EEF]"
                                    />
                                    <label htmlFor="consent" className="cursor-pointer text-xs font-medium leading-relaxed text-[#62708A]">
                                        I agree to the{" "}
                                        <Link href="/terms" className="font-bold text-[#155EEF] hover:underline">Terms of Service</Link>
                                        {" "}and{" "}
                                        <Link href="/privacy" className="font-bold text-[#155EEF] hover:underline">Privacy Policy</Link>.
                                    </label>
                                </div>

                                <Button
                                    type="submit"
                                    className="h-12 w-full rounded-md bg-[#155EEF] text-sm font-black text-white hover:bg-[#0F4FD3]"
                                    disabled={loading || !consentGiven}
                                >
                                    {loading ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account</>
                                    ) : (
                                        <><Mail className="mr-2 h-4 w-4" /> Create Account</>
                                    )}
                                </Button>

                                <p className="text-center text-sm font-medium text-[#62708A]">
                                    Already have an account?{" "}
                                    <Link href="/auth/login" className="font-black text-[#155EEF] hover:underline">
                                        Login
                                    </Link>
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </BrowserFrame>
    );
}

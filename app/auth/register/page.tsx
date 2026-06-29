"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";

import { BrowserFrame, FlowTopBar, SecurityPanel } from "@/components/onboarding/flow-shell";
import { Alert } from "@/components/ui/alert";
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

// ── per-field validators ──────────────────────────────────────────────────────

function validateFullName(v: string) {
    if (!v.trim()) return "Full name is required";
    if (v.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s.''-]+$/.test(v.trim())) return "Name can only contain letters and spaces";
    return null;
}

function validateMobile(v: string) {
    return validateRegistrationMobileNumber(v);
}

function validateDealership(v: string) {
    if (!v.trim()) return "Dealership name is required";
    if (v.trim().length < 2) return "Must be at least 2 characters";
    return null;
}

function validateEmail(v: string) {
    if (!v.trim()) return "Business email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return "Enter a valid email address";
    return null;
}

function validatePassword(v: string) {
    if (!v) return "Password is required";
    if (v.length < REGISTRATION_PASSWORD_MIN_LENGTH)
        return `Password must be at least ${REGISTRATION_PASSWORD_MIN_LENGTH} characters`;
    if (!/[0-9]/.test(v)) return "Password must include at least 1 number";
    if (!/[^a-zA-Z0-9]/.test(v)) return "Password must include at least 1 special character";
    return null;
}

function validateConfirm(password: string, confirm: string) {
    if (!confirm) return "Please confirm your password";
    if (password !== confirm) return "Passwords do not match";
    return null;
}

// ── inline error ──────────────────────────────────────────────────────────────

function FieldError({ message }: { message: string | null }) {
    if (!message) return null;
    return (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
            <XCircle className="h-3.5 w-3.5 shrink-0" />
            {message}
        </p>
    );
}

// ── password strength pills ───────────────────────────────────────────────────

function StrengthPill({ ok, label }: { ok: boolean; label: string }) {
    return (
        <span className={`flex items-center gap-1.5 ${ok ? "text-emerald-600" : "text-red-500"}`}>
            {ok
                ? <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                : <XCircle className="h-3.5 w-3.5 shrink-0" />}
            {label}
        </span>
    );
}

// ── page ──────────────────────────────────────────────────────────────────────

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

    // which fields the user has interacted with
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    const [consentGiven, setConsentGiven] = useState(false);

    const update = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const touch = (field: string) =>
        setTouched((prev) => ({ ...prev, [field]: true }));

    // live per-field errors (only shown after touched)
    const errors = {
        fullName:      validateFullName(form.fullName),
        mobileNumber:  validateMobile(form.mobileNumber),
        dealershipName: validateDealership(form.dealershipName),
        email:         validateEmail(form.email),
        password:      validatePassword(form.password),
        confirmPassword: validateConfirm(form.password, form.confirmPassword),
    };

    // password strength checks
    const pwChecks = {
        length:  form.password.length >= REGISTRATION_PASSWORD_MIN_LENGTH,
        number:  /[0-9]/.test(form.password),
        special: /[^a-zA-Z0-9]/.test(form.password),
    };

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitError(null);

        // touch everything so all errors show
        setTouched({ fullName: true, mobileNumber: true, dealershipName: true, email: true, password: true, confirmPassword: true });

        const firstError = Object.values(errors).find(Boolean);
        if (firstError) return;
        if (!consentGiven) {
            setSubmitError("Please agree to the Terms of Service and Privacy Policy to continue");
            return;
        }

        setLoading(true);
        try {
            const email = form.email.trim().toLowerCase();
            const fullPhone = formatRegistrationPhone(form.mobileNumber);

            const availabilityResponse = await fetch("/api/auth/registration-availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, mobileNumber: form.mobileNumber }),
            });
            const availability = await availabilityResponse.json().catch(() => null) as { error?: string } | null;
            if (!availabilityResponse.ok) {
                setSubmitError(availability?.error ?? "Could not validate registration details. Please try again.");
                return;
            }

            reset();
            updateData({ dealershipName: form.dealershipName.trim(), phone: fullPhone, email });

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
                setSubmitError(
                    /already|registered|exists/i.test(authError.message)
                        ? "This email is already registered. Please login instead."
                        : authError.message
                );
                return;
            }

            setSent(true);
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <BrowserFrame className="min-h-screen w-full max-w-none rounded-none border-0 shadow-none" contentClassName="bg-background">
            <FlowTopBar />
            <div className="grid lg:grid-cols-[390px_1fr]">
                <div className="hidden lg:block">
                    <SecurityPanel />
                </div>

                <div className="px-5 py-8 sm:px-10 lg:px-12">
                    <div className="mx-auto max-w-xl">
                        <div className="mb-7">
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">02 Register</p>
                            <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-foreground">
                                Create your account
                            </h1>
                            <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">
                                Start building your dealership website today.
                            </p>
                        </div>

                        {sent ? (
                            <Alert
                                variant="success"
                                icon={<CheckCircle />}
                                title={<>Verification email sent to <strong>{form.email}</strong></>}
                            >
                                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                    Please check your email and click the verification link. Once verified, you can{" "}
                                    <Link href="/auth/login" className="font-black text-primary hover:underline">
                                        log in with your email and password
                                    </Link>.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => { setSent(false); setSubmitError(null); }}
                                    className="mt-4 text-sm font-black text-primary hover:underline"
                                >
                                    Did not receive it? Try again
                                </button>
                            </Alert>
                        ) : (
                            <form onSubmit={handleRegister} noValidate className="space-y-4">

                                {/* Full Name */}
                                <div>
                                    <Input
                                        label="Full Name"
                                        id="fullName"
                                        placeholder="Raj Kumar"
                                        maxLength={50}
                                        value={form.fullName}
                                        onChange={(e) => update("fullName", e.target.value)}
                                        onBlur={() => touch("fullName")}
                                        disabled={loading}
                                        className={touched.fullName && errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    />
                                    {touched.fullName && <FieldError message={errors.fullName} />}
                                </div>

                                {/* Mobile */}
                                <div onBlur={() => touch("mobileNumber")}>
                                    <PhoneInput
                                        id="mobile"
                                        label="Mobile Number"
                                        value={form.mobileNumber}
                                        countryCode={form.mobileCountryCode}
                                        onValueChange={(value) => update("mobileNumber", value)}
                                        onCountryCodeChange={(code) => update("mobileCountryCode", code)}
                                        helperText={touched.mobileNumber && errors.mobileNumber ? undefined : "10 digits only"}
                                        error={touched.mobileNumber ? errors.mobileNumber ?? undefined : undefined}
                                        disabled={loading}
                                        required
                                        lockCountryCode
                                    />
                                </div>

                                {/* Dealership Name */}
                                <div>
                                    <Input
                                        label="Dealership Name"
                                        id="dealership"
                                        placeholder="Kumar Motors"
                                        maxLength={50}
                                        value={form.dealershipName}
                                        onChange={(e) => update("dealershipName", e.target.value)}
                                        onBlur={() => touch("dealershipName")}
                                        disabled={loading}
                                        className={touched.dealershipName && errors.dealershipName ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    />
                                    {touched.dealershipName && <FieldError message={errors.dealershipName} />}
                                </div>

                                {/* Business Email */}
                                <div>
                                    <Input
                                        label="Business Email"
                                        id="email"
                                        type="email"
                                        placeholder="raj.kumar@kumarmotors.in"
                                        maxLength={100}
                                        value={form.email}
                                        onChange={(e) => update("email", e.target.value)}
                                        onBlur={() => touch("email")}
                                        disabled={loading}
                                        className={touched.email && errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    />
                                    {touched.email && <FieldError message={errors.email} />}
                                </div>

                                {/* Password + Confirm */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="password">Password</Label>
                                        <PasswordInput
                                            id="password"
                                            placeholder={`Min ${REGISTRATION_PASSWORD_MIN_LENGTH} characters`}
                                            minLength={REGISTRATION_PASSWORD_MIN_LENGTH}
                                            maxLength={128}
                                            value={form.password}
                                            onChange={(e) => update("password", e.target.value)}
                                            onBlur={() => touch("password")}
                                            disabled={loading}
                                            className={touched.password && errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                                        />
                                        {touched.password && <FieldError message={errors.password} />}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <PasswordInput
                                            id="confirmPassword"
                                            placeholder="Re-enter password"
                                            minLength={REGISTRATION_PASSWORD_MIN_LENGTH}
                                            maxLength={128}
                                            value={form.confirmPassword}
                                            onChange={(e) => update("confirmPassword", e.target.value)}
                                            onBlur={() => touch("confirmPassword")}
                                            disabled={loading}
                                            className={touched.confirmPassword && errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
                                        />
                                        {touched.confirmPassword && <FieldError message={errors.confirmPassword} />}
                                    </div>
                                </div>

                                {/* Password strength — live */}
                                <div className="grid gap-2 text-xs font-semibold sm:grid-cols-3">
                                    <StrengthPill ok={pwChecks.length}  label="8+ characters" />
                                    <StrengthPill ok={pwChecks.number}  label="1 number" />
                                    <StrengthPill ok={pwChecks.special} label="1 special character" />
                                </div>

                                {submitError && <Alert variant="error">{submitError}</Alert>}

                                {/* Consent */}
                                <div className="flex items-start gap-2.5">
                                    <input
                                        id="consent"
                                        type="checkbox"
                                        checked={consentGiven}
                                        onChange={(e) => setConsentGiven(e.target.checked)}
                                        disabled={loading}
                                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-primary"
                                    />
                                    <label htmlFor="consent" className="cursor-pointer text-xs font-medium leading-relaxed text-muted-foreground">
                                        I agree to the{" "}
                                        <Link href="/terms" className="font-bold text-primary hover:underline">Terms of Service</Link>
                                        {" "}and{" "}
                                        <Link href="/privacy" className="font-bold text-primary hover:underline">Privacy Policy</Link>.
                                    </label>
                                </div>

                                <Button
                                    type="submit"
                                    className="h-12 w-full rounded-xl text-sm font-black"
                                    disabled={loading || !consentGiven}
                                >
                                    {loading ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account</>
                                    ) : (
                                        <><Mail className="mr-2 h-4 w-4" /> Create Account</>
                                    )}
                                </Button>

                                <p className="text-center text-sm font-medium text-muted-foreground">
                                    Already have an account?{" "}
                                    <Link href="/auth/login" className="font-black text-primary hover:underline">
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

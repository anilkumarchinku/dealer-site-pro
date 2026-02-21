"use client"
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle, Mail } from "lucide-react";
import { registerUser } from "@/lib/db/auth";
import { useOnboardingStore } from "@/lib/store/onboarding-store";

export default function RegisterPage() {
    const { setDealerId, updateData, reset } = useOnboardingStore();

    const [form, setForm] = useState({
        fullName: "",
        mobileNumber: "",
        dealershipName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

    const update = (field: string, value: string) =>
        setForm(prev => ({ ...prev, [field]: value }));

    const validate = (): string | null => {
        if (!form.fullName.trim())        return "Full name is required";
        if (!form.mobileNumber.trim())    return "Mobile number is required";
        if (!/^[6-9]\d{9}$/.test(form.mobileNumber.replace(/\s/g, "")))
                                          return "Enter a valid 10-digit Indian mobile number";
        if (!form.dealershipName.trim())  return "Dealership name is required";
        if (!form.email.trim())           return "Email is required";
        if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email address";
        if (form.password.length < 8)     return "Password must be at least 8 characters";
        if (form.password !== form.confirmPassword) return "Passwords do not match";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) { setError(validationError); return; }

        setLoading(true);
        try {
            const result = await registerUser({
                fullName:       form.fullName.trim(),
                mobileNumber:   form.mobileNumber.trim().replace(/\s/g, ""),
                dealershipName: form.dealershipName.trim(),
                email:          form.email.trim().toLowerCase(),
                password:       form.password,
            });

            if (!result.success) {
                setError(result.error ?? "Registration failed. Please try again.");
                return;
            }

            // Pre-fill onboarding store with registration data
            reset();
            if (result.dealerId) setDealerId(result.dealerId);
            updateData({
                dealershipName: form.dealershipName.trim(),
                phone:          form.mobileNumber.trim().replace(/\s/g, ""),
                email:          form.email.trim().toLowerCase(),
            });

            if (result.needsEmailConfirmation) {
                setNeedsEmailConfirmation(true);
                return;
            }

            setSuccess(true);
            // Small delay so user sees success state, then full reload to /onboarding
            // (window.location.href ensures the Supabase session cookie is flushed
            //  before the request hits middleware — router.push races with it)
            setTimeout(() => { window.location.href = "/onboarding"; }, 1000);

        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">Create your account</CardTitle>
                <CardDescription>Set up your dealership in minutes — it's free</CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
                {needsEmailConfirmation ? (
                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                        <div className="p-4 rounded-full bg-blue-500/10">
                            <Mail className="w-10 h-10 text-blue-500" />
                        </div>
                        <h3 className="font-semibold text-lg">Check your email</h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            We sent a confirmation link to <strong>{form.email}</strong>.
                            Click the link to verify your email and continue setup.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Already confirmed?{" "}
                            <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                ) : success ? (
                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                        <div className="p-4 rounded-full bg-emerald-500/10">
                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h3 className="font-semibold text-lg">Account Created!</h3>
                        <p className="text-sm text-muted-foreground">
                            Redirecting you to set up your dealership…
                        </p>
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                placeholder="Rajesh Kumar"
                                value={form.fullName}
                                onChange={e => update("fullName", e.target.value)}
                                autoComplete="name"
                                disabled={loading}
                            />
                        </div>

                        {/* Mobile Number */}
                        <div className="space-y-1.5">
                            <Label htmlFor="mobileNumber">Mobile Number</Label>
                            <div className="flex gap-2">
                                <div className="flex items-center px-3 rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground shrink-0">
                                    +91
                                </div>
                                <Input
                                    id="mobileNumber"
                                    placeholder="98765 43210"
                                    value={form.mobileNumber}
                                    onChange={e => update("mobileNumber", e.target.value.replace(/[^\d\s]/g, ""))}
                                    maxLength={12}
                                    autoComplete="tel"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Dealership Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="dealershipName">Dealership Name</Label>
                            <Input
                                id="dealershipName"
                                placeholder="Ram Motors"
                                value={form.dealershipName}
                                onChange={e => update("dealershipName", e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="rajesh@rammotors.in"
                                value={form.email}
                                onChange={e => update("email", e.target.value)}
                                autoComplete="email"
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 8 characters"
                                    value={form.password}
                                    onChange={e => update("password", e.target.value)}
                                    autoComplete="new-password"
                                    disabled={loading}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Repeat your password"
                                    value={form.confirmPassword}
                                    onChange={e => update("confirmPassword", e.target.value)}
                                    autoComplete="new-password"
                                    disabled={loading}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
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
                            disabled={loading}
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account…</>
                            ) : (
                                "Create Free Account"
                            )}
                        </Button>

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

"use client"
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle, Mail, Lock } from "lucide-react";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
    const { updateData, reset } = useOnboardingStore();

    const [form, setForm] = useState({
        fullName: "",
        mobileNumber: "",
        dealershipName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const update = (field: string, value: string) =>
        setForm(prev => ({ ...prev, [field]: value }));

    const validate = (): string | null => {
        if (!form.fullName.trim()) return "Full name is required";
        if (!form.mobileNumber.trim()) return "Mobile number is required";
        if (!/^[6-9]\d{9}$/.test(form.mobileNumber.replace(/\s/g, "")))
            return "Enter a valid 10-digit Indian mobile number";
        if (!form.dealershipName.trim()) return "Dealership name is required";
        if (!form.email.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email address";
        if (!form.password) return "Password is required";
        if (form.password.length < 12) return "Password must be at least 12 characters";
        if (form.password !== form.confirmPassword) return "Passwords do not match";
        return null;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) { setError(validationError); return; }

        setLoading(true);
        try {
            // Store form data in onboarding store
            reset();
            updateData({
                dealershipName: form.dealershipName.trim(),
                phone: form.mobileNumber.trim().replace(/\s/g, ""),
                email: form.email.trim().toLowerCase(),
            });

            const { error: authError } = await supabase.auth.signUp({
                email: form.email.trim().toLowerCase(),
                password: form.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/login`,
                    data: {
                        full_name: form.fullName.trim(),
                        phone: form.mobileNumber.trim().replace(/\s/g, ""),
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
                <CardDescription>Set up your dealership in minutes — it's free</CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
                {sent ? (
                    // Success: verification email sent
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
                                Didn't receive it?{" "}
                                <span className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Try again</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    // Registration Form
                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                placeholder="Rajesh Kumar"
                                value={form.fullName}
                                onChange={e => update("fullName", e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        {/* Mobile Number */}
                        <div className="space-y-1.5">
                            <Label htmlFor="mobile">Mobile Number</Label>
                            <Input
                                id="mobile"
                                placeholder="98765 43210"
                                value={form.mobileNumber}
                                onChange={e => update("mobileNumber", e.target.value)}
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground">10-digit Indian mobile number</p>
                        </div>

                        {/* Dealership Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="dealership">Dealership Name</Label>
                            <Input
                                id="dealership"
                                placeholder="Raj Motors"
                                value={form.dealershipName}
                                onChange={e => update("dealershipName", e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Business Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="rajesh@rajmotors.in"
                                value={form.email}
                                onChange={e => update("email", e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Min 12 characters"
                                value={form.password}
                                onChange={e => update("password", e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Re-enter password"
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
                            disabled={loading}
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account…</>
                            ) : (
                                <><Mail className="w-4 h-4 mr-2" /> Create Account</>
                            )}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                Sign in
                            </Link>
                        </p>

                        <p className="text-xs text-muted-foreground text-center">
                            By signing up, you agree to our{" "}
                            <Link href="/terms" className="hover:underline">Terms of Service</Link> and{" "}
                            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                        </p>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}

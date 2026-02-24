"use client"
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle, Mail } from "lucide-react";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { verifyOtpAndRegister } from "@/lib/actions/auth-otp";

export default function RegisterPage() {
    const { updateData, reset } = useOnboardingStore();

    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [form, setForm] = useState({
        fullName: "",
        mobileNumber: "",
        dealershipName: "",
        email: "",
    });
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

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
        return null;
    };

    // Step 1: Send OTP
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) { setError(validationError); return; }

        setLoading(true);
        try {
            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email.trim().toLowerCase(), purpose: 'register' }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to send OTP");
                return;
            }

            setSuccess(true);
            setStep('otp');
            setError(null);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP and register
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!otp || otp.length !== 6) {
            setError("Please enter a 6-digit code");
            return;
        }

        setLoading(true);
        try {
            const result = await verifyOtpAndRegister(
                form.email.trim().toLowerCase(),
                otp,
                {
                    fullName: form.fullName.trim(),
                    mobileNumber: form.mobileNumber.trim().replace(/\s/g, ""),
                    dealershipName: form.dealershipName.trim(),
                }
            );

            if (!result.success) {
                setError(result.error || "Registration failed");
                return;
            }

            // Pre-fill onboarding store
            reset();
            updateData({
                dealershipName: form.dealershipName.trim(),
                phone:          form.mobileNumber.trim().replace(/\s/g, ""),
                email:          form.email.trim().toLowerCase(),
            });

            // Redirect to onboarding
            setSuccess(true);
            setTimeout(() => { window.location.href = "/onboarding"; }, 1000);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError(null);
        setSuccess(false);
        await handleSendOtp(new Event('submit') as any);
    };

    return (
        <Card>
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">Create your account</CardTitle>
                <CardDescription>Set up your dealership in minutes — it's free</CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
                {step === 'form' ? (
                    // Step 1: Registration Form
                    <form onSubmit={handleSendOtp} className="space-y-4">
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
                            <p className="text-xs text-muted-foreground">We'll send a 6-digit code here</p>
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
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending code…</>
                            ) : (
                                <><Mail className="w-4 h-4 mr-2" /> Continue</>
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
                ) : (
                    // Step 2: OTP Verification
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        {success && (
                            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-600 dark:text-emerald-400">
                                <CheckCircle className="w-4 h-4 shrink-0" />
                                <span>Code sent to {form.email}</span>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label htmlFor="otp">6-Digit Code</Label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="000000"
                                value={otp}
                                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                                disabled={loading}
                                className="text-center text-2xl tracking-widest font-mono"
                                autoComplete="off"
                                autoFocus
                            />
                            <p className="text-xs text-muted-foreground">
                                Check your email for the 6-digit code. It expires in 10 minutes.
                            </p>
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
                            disabled={loading || otp.length !== 6}
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying…</>
                            ) : (
                                "Verify & Create Account"
                            )}
                        </Button>

                        {/* Resend */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={loading}
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                Didn't receive the code?{" "}
                                <span className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Resend</span>
                            </button>
                        </div>

                        {/* Back */}
                        <button
                            type="button"
                            onClick={() => { setStep('form'); setOtp(''); setError(null); setSuccess(false); }}
                            className="w-full text-sm text-muted-foreground hover:text-foreground py-2"
                        >
                            ← Change email
                        </button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}

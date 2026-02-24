"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle, Mail } from "lucide-react";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { verifyOtpAndLogin } from "@/lib/actions/auth-otp";

export default function LoginPage() {
    const router = useRouter();
    const { setDealerId } = useOnboardingStore();

    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Step 1: Send OTP to email
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email.trim() || !email.includes('@')) {
            setError("Please enter a valid email");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim().toLowerCase(), purpose: 'login' }),
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

    // Step 2: Verify OTP and login
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!otp || otp.length !== 6) {
            setError("Please enter a 6-digit code");
            return;
        }

        setLoading(true);
        try {
            const result = await verifyOtpAndLogin(email.trim().toLowerCase(), otp);

            if (!result.success) {
                setError(result.error || "Invalid OTP code");
                return;
            }

            // Redirect to dashboard or onboarding
            if (result.redirectTo) {
                window.location.href = result.redirectTo;
            } else {
                window.location.href = "/dashboard";
            }
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
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>Sign in to your dealership dashboard</CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
                {step === 'email' ? (
                    // Step 1: Email Entry
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="rajesh@rammotors.in"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoComplete="email"
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground">
                                We'll send a 6-digit code to this email
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
                            disabled={loading}
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending code…</>
                            ) : (
                                <><Mail className="w-4 h-4 mr-2" /> Send verification code</>
                            )}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link href="/auth/register" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                Create one free
                            </Link>
                        </p>
                    </form>
                ) : (
                    // Step 2: OTP Verification
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        {success && (
                            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-600 dark:text-emerald-400">
                                <CheckCircle className="w-4 h-4 shrink-0" />
                                <span>Code sent to {email}</span>
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
                                "Verify & Sign In"
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
                            onClick={() => { setStep('email'); setOtp(''); setError(null); setSuccess(false); }}
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

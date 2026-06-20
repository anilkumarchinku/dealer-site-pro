"use client"
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Loader2, LogIn, Mail, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { isValidEmail } from "@/lib/validations/client";
import { isPlatformAdminAppMetadata } from "@/lib/utils/platform-admin";

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}

function LoginForm() {
    const searchParams = useSearchParams();
    const justRegistered = searchParams.get("registered") === "true";
    const redirectTo = searchParams.get("redirect") || null;
    const callbackError = searchParams.get("error");

    const safeRedirectTo = (() => {
        if (!redirectTo) return null;
        if (!redirectTo.startsWith("/") || redirectTo.startsWith("//")) return null;
        return redirectTo;
    })();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(
        callbackError === "registration_conflict"
            ? "This email or mobile number is already registered. Please login or use different details."
            : null
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email.trim() || !isValidEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }
        if (!password) {
            setError("Please enter your password");
            return;
        }

        setLoading(true);
        try {
            // Capture data.user directly — don't make a second getUser() call.
            // signInData.user is always non-null after a successful login and
            // avoids a race where a second network call might return null.
            const { data: signInData, error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password,
            });

            if (authError) {
                if (authError.message.includes("Email not confirmed")) {
                    setError("Please verify your email first. Check your inbox for the verification link.");
                } else if (authError.message.includes("Invalid login credentials")) {
                    setError("Invalid email or password. Please try again.");
                } else {
                    setError(authError.message);
                }
                return;
            }

            // Route users to onboarding if setup isn't complete, otherwise to dashboard.
            const user = signInData?.user;
            if (user) {
                if (isPlatformAdminAppMetadata(user.app_metadata)) {
                    window.location.href = safeRedirectTo ?? "/admin";
                    return;
                }

                const adminSession = await fetch("/api/admin/session", { cache: "no-store" })
                    .then((res) => res.ok ? res.json() : null)
                    .catch(() => null) as { authenticated?: boolean; source?: string } | null;

                if (adminSession?.authenticated && adminSession.source === "platform") {
                    window.location.href = safeRedirectTo ?? "/admin";
                    return;
                }

                const { data: dealer } = await supabase
                    .from("dealers")
                    .select("id, onboarding_complete")
                    .eq("user_id", user.id)
                    .maybeSingle();

                // No dealer row OR onboarding not complete → must go through onboarding
                if (!dealer || !dealer.onboarding_complete) {
                    window.location.href = "/onboarding";
                    return;
                }
            }

            // Honor the ?redirect= param (e.g. ?redirect=%2Fadmin)
            window.location.href = safeRedirectTo ?? "/dashboard";
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="rounded-2xl border border-border bg-card p-0 shadow-[0_24px_80px_rgba(7,20,47,0.12)]">
            <CardHeader className="border-b border-border px-7 py-6 text-left">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-primary">
                    Secure Login
                </p>
                <CardTitle className="mt-2 text-3xl font-black tracking-tight">Welcome back</CardTitle>
                <CardDescription className="text-base">Sign in to your dealership dashboard</CardDescription>
            </CardHeader>

            <CardContent className="px-7 py-6">
                <form onSubmit={handleLogin} className="space-y-5">

                    {/* Registration success banner */}
                    {justRegistered && (
                        <Alert variant="success">Email verified! You can now sign in.</Alert>
                    )}

                    {/* Email */}
                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="rajesh@rammotors.in"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoComplete="email"
                                disabled={loading}
                                className="h-12 rounded-xl pl-10"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="current-password"
                                disabled={loading}
                                className="h-12 rounded-xl pl-10"
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && <Alert variant="error">{error}</Alert>}

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="h-12 w-full rounded-xl text-base font-black"
                        size="lg"
                        disabled={loading}
                    >
                        {loading ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in…</>
                        ) : (
                            <><LogIn className="w-4 h-4 mr-2" /> Sign In</>
                        )}
                    </Button>

                    <div className="flex flex-col items-center gap-2 border-t border-border pt-5">
                        <p className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/register" className="font-medium text-primary hover:underline">
                                Create one free
                            </Link>
                        </p>
                        <Link
                            href="/reset"
                            className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
